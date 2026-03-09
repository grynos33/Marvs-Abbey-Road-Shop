import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@supabase/supabase-js';

type CheckoutItemInput = {
  id: string;
  quantity: number;
};

type CheckoutBody = {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    province: string;
    zip: string;
    region: string;
  };
  items: CheckoutItemInput[];
};

const SHIPPING_RATES: Record<string, number> = {
  'Metro Manila': 150,
  Luzon: 200,
  Visayas: 250,
  Mindanao: 250,
};

function getShippingFee(region: string): number {
  return SHIPPING_RATES[region] ?? 250;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

type ApiRequest = IncomingMessage & {
  method?: string;
  body?: unknown;
  headers: IncomingMessage['headers'];
};

type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

function getOrigin(req: ApiRequest): string {
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host;
  if (!host) return '';
  return `${proto}://${host}`;
}

function normalizeItems(items: CheckoutItemInput[]): CheckoutItemInput[] {
  const map = new Map<string, number>();
  for (const item of items) {
    if (!item?.id) continue;
    const qty = Number(item.quantity);
    if (!Number.isFinite(qty) || qty <= 0) continue;
    map.set(item.id, (map.get(item.id) ?? 0) + Math.floor(qty));
  }
  return Array.from(map.entries()).map(([id, quantity]) => ({ id, quantity }));
}

function toPaymongoAmount(amountPhp: number): number {
  return Math.round(amountPhp * 100);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = getRequiredEnv('SUPABASE_URL');
    const supabaseServiceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const paymongoSecretKey = getRequiredEnv('PAYMONGO_SECRET_KEY');

    const body = req.body as CheckoutBody;
    if (!body?.customer || !body?.shipping || !Array.isArray(body?.items)) {
      return res.status(400).json({ error: 'Invalid request payload' });
    }

    const items = normalizeItems(body.items);
    if (items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const customerName = body.customer.name?.trim();
    const customerEmail = body.customer.email?.trim();
    const customerPhone = body.customer.phone?.trim();
    const shippingAddress = body.shipping.address?.trim();
    const shippingCity = body.shipping.city?.trim();
    const shippingProvince = body.shipping.province?.trim();
    const shippingZip = body.shipping.zip?.trim();
    const shippingRegion = body.shipping.region?.trim();

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingAddress ||
      !shippingCity ||
      !shippingProvince ||
      !shippingZip ||
      !shippingRegion
    ) {
      return res.status(400).json({ error: 'Missing customer or shipping fields' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const productIds = items.map((item) => item.id);

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, image_url, stock, is_active')
      .in('id', productIds);

    if (productsError) {
      return res.status(500).json({ error: 'Failed to fetch products', details: productsError.message });
    }

    const productMap = new Map((products ?? []).map((p) => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product || !product.is_active) {
        return res.status(400).json({ error: 'Some products are unavailable' });
      }
      if ((product.stock ?? 0) < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
    }

    const orderItems = items.map((item) => {
      const product = productMap.get(item.id)!;
      return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: item.quantity,
        image_url: product.image_url,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = getShippingFee(shippingRegion);
    const total = subtotal + shippingFee;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_province: shippingProvince,
        shipping_zip: shippingZip,
        shipping_region: shippingRegion,
        items: orderItems,
        subtotal,
        shipping_fee: shippingFee,
        total,
        payment_method: 'paymongo',
        payment_status: 'pending',
        order_status: 'pending',
      })
      .select('id')
      .single();

    if (orderError || !order) {
      return res.status(500).json({ error: 'Failed to create order', details: orderError?.message });
    }

    const baseUrl = process.env.APP_BASE_URL || getOrigin(req);
    if (!baseUrl) {
      return res.status(500).json({ error: 'Cannot determine app base URL' });
    }

    const paymentMethodTypes = (process.env.PAYMONGO_PAYMENT_METHOD_TYPES || 'card,gcash')
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const lineItems = orderItems.map((item) => ({
      currency: 'PHP',
      amount: toPaymongoAmount(item.price),
      name: item.name,
      quantity: item.quantity,
      images: item.image_url ? [item.image_url] : [],
    }));

    if (shippingFee > 0) {
      lineItems.push({
        currency: 'PHP',
        amount: toPaymongoAmount(shippingFee),
        name: `Shipping (${shippingRegion})`,
        quantity: 1,
        images: [],
      });
    }

    const paymongoPayload = {
      data: {
        attributes: {
          billing: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          },
          line_items: lineItems,
          payment_method_types: paymentMethodTypes,
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          description: `Order ${order.id}`,
          success_url: `${baseUrl}/order-success?order_id=${order.id}`,
          cancel_url: `${baseUrl}/checkout?cancelled=1`,
          metadata: {
            order_id: order.id,
          },
        },
      },
    };

    const encodedKey = Buffer.from(`${paymongoSecretKey}:`).toString('base64');
    const paymongoResp = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${encodedKey}`,
      },
      body: JSON.stringify(paymongoPayload),
    });

    const paymongoJson = await paymongoResp.json();
    if (!paymongoResp.ok) {
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          notes: `PayMongo create checkout failed: ${JSON.stringify(paymongoJson)}`,
        })
        .eq('id', order.id);

      return res.status(502).json({
        error: 'Failed to create PayMongo checkout session',
        details: paymongoJson,
      });
    }

    const checkoutSessionId = paymongoJson?.data?.id as string | undefined;
    const checkoutUrl = paymongoJson?.data?.attributes?.checkout_url as string | undefined;

    await supabase
      .from('orders')
      .update({
        payment_id: checkoutSessionId ?? null,
        payment_method: 'paymongo',
      })
      .eq('id', order.id);

    if (!checkoutUrl) {
      return res.status(502).json({ error: 'Missing checkout URL from PayMongo response' });
    }

    return res.status(200).json({
      order_id: order.id,
      checkout_session_id: checkoutSessionId,
      checkout_url: checkoutUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
