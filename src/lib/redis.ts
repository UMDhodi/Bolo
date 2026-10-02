/**
 * Upstash Redis service — rate limiting + lightweight caching.
 * Server-side only (no VITE_ prefix on env vars).
 *
 * Env vars:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// ---------------------------------------------------------------------------
// Singleton Redis client
// ---------------------------------------------------------------------------

let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    const url = process.env["UPSTASH_REDIS_REST_URL"];
    const token = process.env["UPSTASH_REDIS_REST_TOKEN"];
    if (!url || !token) {
      throw new Error(
        "[Redis] Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN",
      );
    }
    _redis = new Redis({ url, token });
  }
  return _redis;
}

// ---------------------------------------------------------------------------
// Rate-limit configurations
// ---------------------------------------------------------------------------

/**
 * Returns true if the request is ALLOWED (not rate-limited).
 * Returns false if it should be blocked (429).
 *
 * Uses a sliding-window algorithm per identifier.
 */
async function checkLimit(
  limiter: Ratelimit,
  identifier: string,
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const result = await limiter.limit(identifier);
  return {
    allowed: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

// ── Auth endpoint: 10 attempts per IP per 15 minutes ─────────────────────────
let _authLimiter: Ratelimit | null = null;
function getAuthLimiter(): Ratelimit {
  if (!_authLimiter) {
    _authLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(10, "15 m"),
      prefix: "bolo:rl:auth",
    });
  }
  return _authLimiter;
}

// ── OTP send: 3 sends per phone per 10 minutes ───────────────────────────────
let _otpSendLimiter: Ratelimit | null = null;
function getOtpSendLimiter(): Ratelimit {
  if (!_otpSendLimiter) {
    _otpSendLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(3, "10 m"),
      prefix: "bolo:rl:otp-send",
    });
  }
  return _otpSendLimiter;
}

// ── OTP verify: 5 attempts per phone per 10 minutes ──────────────────────────
let _otpVerifyLimiter: Ratelimit | null = null;
function getOtpVerifyLimiter(): Ratelimit {
  if (!_otpVerifyLimiter) {
    _otpVerifyLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "bolo:rl:otp-verify",
    });
  }
  return _otpVerifyLimiter;
}

// ── Profile create: 5 per user per hour ──────────────────────────────────────
let _profileLimiter: Ratelimit | null = null;
function getProfileLimiter(): Ratelimit {
  if (!_profileLimiter) {
    _profileLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "bolo:rl:profile",
    });
  }
  return _profileLimiter;
}

// ── Avatar upload: 10 per user per hour ──────────────────────────────────────
let _uploadLimiter: Ratelimit | null = null;
function getUploadLimiter(): Ratelimit {
  if (!_uploadLimiter) {
    _uploadLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      prefix: "bolo:rl:upload",
    });
  }
  return _uploadLimiter;
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/** Extract a best-effort client IP from the request headers */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  reset: number; // unix timestamp ms
};

export async function checkAuthRateLimit(ip: string): Promise<RateLimitResult> {
  return checkLimit(getAuthLimiter(), `ip:${ip}`);
}

export async function checkOtpSendRateLimit(
  phone: string,
  ip: string,
): Promise<RateLimitResult> {
  // Block both per-phone AND per-IP; whichever is stricter wins
  const [byPhone, byIp] = await Promise.all([
    checkLimit(getOtpSendLimiter(), `phone:${phone}`),
    checkLimit(getOtpSendLimiter(), `ip:${ip}`),
  ]);
  return {
    allowed: byPhone.allowed && byIp.allowed,
    remaining: Math.min(byPhone.remaining, byIp.remaining),
    reset: Math.max(byPhone.reset, byIp.reset),
  };
}

export async function checkOtpVerifyRateLimit(
  phone: string,
): Promise<RateLimitResult> {
  return checkLimit(getOtpVerifyLimiter(), `phone:${phone}`);
}

export async function checkProfileRateLimit(
  userId: string,
): Promise<RateLimitResult> {
  return checkLimit(getProfileLimiter(), `user:${userId}`);
}

export async function checkUploadRateLimit(
  userId: string,
): Promise<RateLimitResult> {
  return checkLimit(getUploadLimiter(), `user:${userId}`);
}

// ---------------------------------------------------------------------------
// Build a 429 Response
// ---------------------------------------------------------------------------

export function tooManyRequestsResponse(reset: number): Response {
  const retryAfterSecs = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return new Response(
    JSON.stringify({
      error: "too_many_requests",
      message:
        "Too many requests. Please wait a moment before trying again.",
      retryAfterSeconds: retryAfterSecs,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSecs),
      },
    },
  );
}

// ---------------------------------------------------------------------------
// Simple cache helpers (profile existence, etc.)
// ---------------------------------------------------------------------------

const CACHE_TTL_SECONDS = 300; // 5 min

export async function cacheSet(key: string, value: string): Promise<void> {
  await getRedis().set(`bolo:cache:${key}`, value, { ex: CACHE_TTL_SECONDS });
}

export async function cacheGet(key: string): Promise<string | null> {
  return getRedis().get<string>(`bolo:cache:${key}`);
}

export async function cacheDel(key: string): Promise<void> {
  await getRedis().del(`bolo:cache:${key}`);
}
