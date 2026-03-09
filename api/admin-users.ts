import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@supabase/supabase-js';
import { getClientIp, rateLimit } from './_rate-limit';

type ApiRequest = IncomingMessage & {
  method?: string;
  body?: unknown;
  headers: IncomingMessage['headers'];
};

type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

type AdminRole = 'admin' | 'manager';

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

async function parseJsonBody(req: ApiRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') return JSON.parse(req.body) as Record<string, unknown>;

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve());
    req.on('error', reject);
  });
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>;
}

function getBearerToken(req: ApiRequest): string | null {
  const raw = req.headers.authorization;
  if (!raw) return null;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value?.startsWith('Bearer ')) return null;
  return value.slice('Bearer '.length).trim();
}

function isValidRole(value: unknown): value is AdminRole {
  return value === 'admin' || value === 'manager';
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);
  const limit = rateLimit(`admin:${ip}`, 20, 60);
  if (limit.blocked) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retry_after: limit.retryAfterSec,
    });
  }

  try {
    const supabaseUrl = getRequiredEnv('SUPABASE_URL');
    const serviceKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const service = createClient(supabaseUrl, serviceKey);

    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });

    const { data: requesterUser, error: requesterError } = await service.auth.getUser(token);
    if (requesterError || !requesterUser.user) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    const { data: requesterRoleRow } = await service
      .from('user_roles')
      .select('role')
      .eq('user_id', requesterUser.user.id)
      .maybeSingle();

    if (requesterRoleRow?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin role required' });
    }

    if (req.method === 'GET') {
      const { data, error } = await service
        .from('user_roles')
        .select('id, user_id, role, created_at')
        .order('created_at', { ascending: true });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ users: data ?? [] });
    }

    if (req.method === 'POST') {
      const body = await parseJsonBody(req);
      const email = String(body.email ?? '').trim().toLowerCase();
      const password = String(body.password ?? '');
      const role = body.role;

      if (!email || !password || !isValidRole(role)) {
        return res.status(400).json({ error: 'Invalid payload' });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      const { data: created, error: createError } = await service.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createError || !created.user) {
        return res.status(400).json({ error: createError?.message ?? 'Failed to create user' });
      }

      const { error: roleInsertError } = await service.from('user_roles').insert({
        user_id: created.user.id,
        role,
      });
      if (roleInsertError) {
        return res.status(500).json({ error: roleInsertError.message });
      }

      return res.status(201).json({ ok: true });
    }

    const body = await parseJsonBody(req);
    const userRoleId = String(body.id ?? '').trim();
    if (!userRoleId) return res.status(400).json({ error: 'Missing id' });

    const { data: target, error: targetError } = await service
      .from('user_roles')
      .select('id, role')
      .eq('id', userRoleId)
      .maybeSingle();

    if (targetError) return res.status(500).json({ error: targetError.message });
    if (!target) return res.status(404).json({ error: 'User role not found' });
    if (target.role === 'admin') return res.status(400).json({ error: 'Cannot delete admin role' });

    const { error: deleteError } = await service.from('user_roles').delete().eq('id', userRoleId);
    if (deleteError) return res.status(500).json({ error: deleteError.message });

    return res.status(200).json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
