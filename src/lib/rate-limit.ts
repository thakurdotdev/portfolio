// Simple in-memory rate limiter
interface RateLimitStore {
  [key: string]: number[];
}

// In-memory store for rate limiting
const store: RateLimitStore = {};

/**
 * Rate limits requests based on IP address
 * @param ip The IP address to rate limit
 * @param limit Maximum number of requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns Object containing success status and remaining requests
 */
export function rateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 60000,
) {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Initialize or get existing timestamps for this IP
  store[ip] = store[ip] || [];

  // Clean old requests outside the current window
  store[ip] = store[ip].filter((timestamp) => timestamp > windowStart);

  // Check if the IP has reached its limit
  const isRateLimited = store[ip].length >= limit;

  // If not rate limited, add the current timestamp
  if (!isRateLimited) {
    store[ip].push(now);
  }

  // Clean up old entries periodically to prevent memory leaks
  // This is a simple approach - for production consider a more robust solution
  if (Object.keys(store).length > 10000) {
    const oldestAllowed = now - windowMs;
    Object.keys(store).forEach((key) => {
      if (store[key].length === 0 || Math.max(...store[key]) < oldestAllowed) {
        delete store[key];
      }
    });
  }

  return {
    success: !isRateLimited,
    remaining: Math.max(0, limit - store[ip].length),
    resetAt: Math.min(...(store[ip] || [now])) + windowMs,
  };
}
