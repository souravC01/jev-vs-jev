interface RateLimitEntry {
  timestamps: number[];
}

const windowMs = 60 * 1000; // 1 minute
const maxRequests = 60; // 60 requests per minute

const ipStore = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipStore.entries()) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
      if (entry.timestamps.length === 0) {
        ipStore.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

export function checkRateLimit(ip: string): {
  success: boolean;
  remaining: number;
  resetInSeconds: number;
} {
  const now = Date.now();
  const entry = ipStore.get(ip) || { timestamps: [] };

  // Remove timestamps outside window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    const oldest = entry.timestamps[0];
    const resetInSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetInSeconds: Math.max(1, resetInSeconds),
    };
  }

  entry.timestamps.push(now);
  ipStore.set(ip, entry);

  return {
    success: true,
    remaining: maxRequests - entry.timestamps.length,
    resetInSeconds: Math.ceil(windowMs / 1000),
  };
}
