import crypto from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@supabase/supabase-js';
import { getClientIp, rateLimit } from './_rate-limit.js';

type PaymongoEvent = {
  data?: {
    id?: string;
    type?: string;
    attributes?: {
      type?: string;
      data?: {
        id?: string;
        attributes?: {
          metadata?: {
            order_id?: string;
          };
        };
      };
    };
  };
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

async function readRawBody(req: ApiRequest): Promise<string> {
  if (typeof req.body === 'string') return req.body;
  if (req.body && typeof req.body === 'object') return JSON.stringify(req.body);

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve());
    req.on('error', reject);
  });
  return Buffer.concat(chunks).toString('utf8');
}

function parseSignatureHeader(value: string): Record<string, string> {
  return value.split(',').reduce<Record<string, string>>((acc, pair) => {
    const [k, v] = pair.split('=');
    if (k && v) acc[k.trim()] = v.trim();
    return acc;
  }, {});
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function verifyWebhookSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  const parsed = parseSignatureHeader(signatureHeader);
  const timestamp = parsed.t;
  const testSig = parsed.te;
  const liveSig = parsed.li;

  if (!timestamp || (!testSig && !liveSig)) return false;

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');

  return [testSig, liveSig].filter(Boolean).some((sig) => constantTimeEqual(sig!, expected));
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);
  const limit = rateLimit(`webhook:${ip}`, 30, 60);
  if (limit.blocked) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const supabaseUrl = getRequiredEnv('SUPABASE_URL');
    const supabaseServiceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const webhookSecret = getRequiredEnv('PAYMONGO_WEBHOOK_SECRET');

    const rawBody = await readRawBody(req);
    if (!rawBody) return res.status(400).json({ error: 'Empty payload' });

    const signatureHeader = req.headers['paymongo-signature'];
    const signatureValue = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
    if (!signatureValue || !verifyWebhookSignature(rawBody, signatureValue, webhookSecret)) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const payload = JSON.parse(rawBody) as PaymongoEvent;
    const eventType = payload.data?.attributes?.type || payload.data?.type;
    const sessionId = payload.data?.attributes?.data?.id;
    const orderIdFromMetadata = payload.data?.attributes?.data?.attributes?.metadata?.order_id;

    if (!eventType) return res.status(400).json({ error: 'Missing event type' });
    if (!sessionId && !orderIdFromMetadata) return res.status(200).json({ ok: true });

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    let targetOrderId = orderIdFromMetadata;
    if (!targetOrderId && sessionId) {
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('payment_id', sessionId)
        .maybeSingle();
      targetOrderId = existing?.id;
    }

    if (!targetOrderId) return res.status(200).json({ ok: true });

    if (eventType === 'checkout_session.payment.paid') {
      const { data: order } = await supabase
        .from('orders')
        .select('id, items, payment_status')
        .eq('id', targetOrderId)
        .maybeSingle();

      if (!order) return res.status(200).json({ ok: true });
      if (order.payment_status === 'paid') {
        return res.status(200).json({ ok: true, duplicate: true });
      }

      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          order_status: 'confirmed',
          payment_method: 'paymongo',
          payment_id: sessionId ?? null,
        })
        .eq('id', targetOrderId);

      const items = (order.items as Array<{ id: string; quantity: number }> | null) ?? [];
      for (const item of items) {
        const qty = Number(item.quantity) || 0;
        if (!item.id || qty <= 0) continue;
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .maybeSingle();

        if (product && typeof product.stock === 'number') {
          const nextStock = Math.max(0, product.stock - qty);
          await supabase.from('products').update({ stock: nextStock }).eq('id', item.id);
        }
      }
    } else if (
      eventType === 'checkout_session.payment.failed' ||
      eventType === 'payment.failed' ||
      eventType === 'checkout_session.expired'
    ) {
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          payment_method: 'paymongo',
          payment_id: sessionId ?? null,
        })
        .eq('id', targetOrderId);
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
type ApiRequest = IncomingMessage & {
  method?: string;
  body?: unknown;
  headers: IncomingMessage['headers'];
  on: IncomingMessage['on'];
};

type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};
