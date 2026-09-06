import { checkRateLimit as dbCheckRateLimit } from "./rate-limit-db";

function kvAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kvCheckRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
  ip?: string,
): Promise<boolean> {
  if (!kvAvailable()) return dbCheckRateLimit(key, maxRequests, windowMs, ip);

  try {
    const { kv } = await import("@vercel/kv");
    const scopedKey = ip ? `rl:${key}:${ip}` : `rl:${key}`;
    const windowSeconds = Math.ceil(windowMs / 1000);

    const count = await kv.incr(scopedKey);
    if (count === 1) {
      await kv.expire(scopedKey, windowSeconds);
    }
    return count <= maxRequests;
  } catch {
    return dbCheckRateLimit(key, maxRequests, windowMs, ip);
  }
}

export { kvCheckRateLimit as checkRateLimit };
