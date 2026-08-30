import prisma from "./prisma";

export async function checkRateLimit(key: string, maxRequests: number, windowMs: number, ip?: string): Promise<boolean> {
  const now = Date.now();
  const windowStart = now - windowMs;
  const scopedKey = ip ? `${key}:${ip}` : key;

  try {
    const entry = await prisma.rateLimitEntry.findUnique({ where: { key: scopedKey } });

    if (!entry) {
      await prisma.rateLimitEntry.create({
        data: { key: scopedKey, timestamps: [String(now)] },
      });
      return true;
    }

    const timestamps = entry.timestamps
      .map(Number)
      .filter((t) => t > windowStart);

    if (timestamps.length >= maxRequests) return false;

    timestamps.push(now);
    await prisma.rateLimitEntry.update({
      where: { key: scopedKey },
      data: { timestamps: timestamps.map(String) },
    });
    return true;
  } catch {
    return true;
  }
}