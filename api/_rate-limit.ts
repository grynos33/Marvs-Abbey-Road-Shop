import type { IncomingMessage } from 'node:http';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of buckets) {
    if (now > entry.resetAt) buckets.delete(key);
  }
}

export function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return value.split(',')[0].trim();
  }
  return req.socket?.remoteAddress ?? 'unknown';
}

/**
 * In-memory sliding-window rate limiter.
 * Returns null if allowed, or { retryAfterSec } if blocked.
 *
 * Note: Vercel serverless functions may run across multiple instances,
 * so this is per-instance. It stops naive abuse and bots, not
 * sophisticated distributed attacks. For that, use Vercel WAF or Upstash.
 */
export function rateLimit(
  key: string,
  maxRequests: number,
  windowSec: number,
): { blocked: false } | { blocked: true; retryAfterSec: number } {
  cleanup();

  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { blocked: false };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    return { blocked: true, retryAfterSec };
  }

  entry.count++;
  return { blocked: false };
}
