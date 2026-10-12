interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory rate limit store
const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  windowMs: number; // e.g., 15 * 60 * 1000 for 15 minutes
  maxRequests: number; // e.g., 5 requests
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 15 * 60 * 1000, maxRequests: 5 }
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = memoryStore.get(identifier);

  if (!record || record.resetAt < now) {
    // New window
    memoryStore.set(identifier, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetAt: now + options.windowMs,
    };
  }

  if (record.count >= options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: options.maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

// Cleanup expired keys periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (record.resetAt < now) {
        memoryStore.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}
