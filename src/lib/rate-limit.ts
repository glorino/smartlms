const rateLimit = new Map<string, { timestamps: number[] }>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const entry = rateLimit.get(key);
  if (!entry) {
    rateLimit.set(key, { timestamps: [now] });
    return true;
  }
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);
  if (entry.timestamps.length >= maxRequests) return false;
  entry.timestamps.push(now);
  return true;
}