import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// ── New infrastructure services (server-side only) ────────────────────────────
import { getAvatarUploadTicket } from "./lib/r2";
import {
  checkAuthRateLimit,
  checkOtpSendRateLimit,
  checkOtpVerifyRateLimit,
  checkProfileRateLimit,
  checkUploadRateLimit,
  getClientIp,
  tooManyRequestsResponse,
} from "./lib/redis";
import { verifyTurnstileToken, turnstileFailedResponse } from "./lib/turnstile";
import {
  parseBody,
  otpSendSchema,
  otpVerifySchema,
  avatarUploadRequestSchema,
  authGuardSchema,
  profileCreateSchema,
} from "./lib/zod-schemas";
import { createClient } from "@supabase/supabase-js";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  const capturedError = consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`);
  console.error(capturedError);
  return new Response(renderErrorPage(capturedError), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

function applySecurityHeaders(response: Response, request: Request): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  headers.set(
    "Permissions-Policy",
    "camera=(self), geolocation=(self), microphone=(), payment=(), usb=()",
  );
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://verify.msg91.com https://verify.phone91.com https://control.msg91.com https://challenges.cloudflare.com; connect-src 'self' https://*.firebaseio.com wss://*.firebaseio.com https://*.firebasedatabase.app wss://*.firebasedatabase.app https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.cartocdn.com https://*.tile.openstreetmap.org https://control.msg91.com https://api.msg91.com https://verify.msg91.com https://verify.phone91.com https://unpkg.com https://*.supabase.co https://challenges.cloudflare.com https://*.r2.cloudflarestorage.com; img-src 'self' data: blob: https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://*.firebasestorage.app https://lh3.googleusercontent.com https://unpkg.com https://*.supabase.co https://*.r2.cloudflarestorage.com https://*.r2.dev; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://*.firebaseapp.com https://*.google.com https://verify.msg91.com https://verify.phone91.com https://challenges.cloudflare.com; worker-src 'self' blob:; frame-ancestors 'self'; object-src 'none'; base-uri 'self';",
  );

  // Strip server fingerprinting headers
  headers.delete("x-powered-by");
  headers.delete("server");
  headers.delete("X-Powered-By");
  headers.delete("Server");

  // Strict Origin Validation for CORS: never reflect 'null' origin or wildcard with credentials
  const origin = request.headers.get("origin");
  if (origin && origin !== "null") {
    try {
      const url = new URL(request.url);
      const reqHost = url.host;
      const originHost = new URL(origin).host;

      // Allow same-origin or matching subdomains
      if (originHost === reqHost || originHost.endsWith(`.${reqHost}`)) {
        headers.set("Access-Control-Allow-Origin", origin);
        headers.set("Access-Control-Allow-Credentials", "true");
        headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        headers.set(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization, X-Requested-With",
        );
      }
    } catch {
      // Invalid origin URL, ignore
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function handleMsg91ApiRoute(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/otp/")) return null;

  const authKey =
    process.env["VITE_MSG91_AUTH_KEY"] ||
    process.env["MSG91_AUTH_KEY"] ||
    process.env["VITE_MSG91_TOKEN_AUTH"] ||
    process.env["MSG91_TOKEN_AUTH"] ||
    "564040TqZHyvJa6a8d61b6P1";
  const widgetId =
    process.env["VITE_MSG91_WIDGET_ID"] ||
    process.env["MSG91_WIDGET_ID"] ||
    "366879665345393532363737";
  const templateId =
    process.env["VITE_MSG91_TEMPLATE_ID"] || process.env["MSG91_TEMPLATE_ID"] || "";

  // 1. Send OTP: POST /api/otp/send
  if (url.pathname === "/api/otp/send" && request.method === "POST") {
    try {
      const body = (await request.json()) as { phone?: string };
      const rawPhone = (body.phone || "").replace(/\D/g, "");
      const formattedMobile = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

      if (!rawPhone || rawPhone.length < 10) {
        return new Response(JSON.stringify({ type: "error", message: "Invalid phone number." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (authKey && (widgetId || templateId)) {
        const msg91Url = new URL("https://control.msg91.com/api/v5/otp");
        if (widgetId) msg91Url.searchParams.append("widgetId", widgetId);
        if (templateId) msg91Url.searchParams.append("template_id", templateId);
        msg91Url.searchParams.append("mobile", formattedMobile);
        msg91Url.searchParams.append("authkey", authKey);

        const res = await fetch(msg91Url.toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = (await res.json()) as { type?: string; message?: string };
        return new Response(JSON.stringify(data), {
          status: res.ok ? 200 : 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Sandbox Fallback
      return new Response(
        JSON.stringify({
          type: "success",
          message: `OTP sent to +${formattedMobile} (Sandbox Mode: use code 123456).`,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } catch (err: unknown) {
      return new Response(
        JSON.stringify({
          type: "error",
          message: err instanceof Error ? err.message : "Failed to send OTP.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  // 2. Verify OTP: POST /api/otp/verify
  if (url.pathname === "/api/otp/verify" && request.method === "POST") {
    try {
      const body = (await request.json()) as { phone?: string; otp?: string };
      const rawPhone = (body.phone || "").replace(/\D/g, "");
      const formattedMobile = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
      const cleanOtp = (body.otp || "").trim();

      if (authKey) {
        const msg91Url = new URL("https://control.msg91.com/api/v5/otp/verify");
        msg91Url.searchParams.append("otp", cleanOtp);
        msg91Url.searchParams.append("mobile", formattedMobile);
        msg91Url.searchParams.append("authkey", authKey);
        if (widgetId) msg91Url.searchParams.append("widgetId", widgetId);

        const res = await fetch(msg91Url.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = (await res.json()) as { type?: string; message?: string };
        return new Response(JSON.stringify(data), {
          status: res.ok ? 200 : 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Sandbox Fallback
      if (cleanOtp === "123456" || cleanOtp === "000000" || cleanOtp.length >= 4) {
        return new Response(
          JSON.stringify({ type: "success", message: "OTP verified successfully (Sandbox Mode)." }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({
          type: "error",
          message: "Invalid OTP code. In sandbox mode, enter 123456.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    } catch (err: unknown) {
      return new Response(
        JSON.stringify({
          type: "error",
          message: err instanceof Error ? err.message : "Failed to verify OTP.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  // 3. Retry OTP: POST /api/otp/retry
  if (url.pathname === "/api/otp/retry" && request.method === "POST") {
    try {
      const body = (await request.json()) as { phone?: string };
      const rawPhone = (body.phone || "").replace(/\D/g, "");
      const formattedMobile = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

      if (authKey) {
        const msg91Url = new URL("https://control.msg91.com/api/v5/otp/retry");
        msg91Url.searchParams.append("authkey", authKey);
        msg91Url.searchParams.append("mobile", formattedMobile);
        msg91Url.searchParams.append("retrytype", "text");
        if (widgetId) msg91Url.searchParams.append("widgetId", widgetId);

        const res = await fetch(msg91Url.toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = (await res.json()) as { type?: string; message?: string };
        return new Response(JSON.stringify(data), {
          status: res.ok ? 200 : 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          type: "success",
          message: `OTP resent to +${formattedMobile} (Sandbox Mode).`,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } catch (err: unknown) {
      return new Response(
        JSON.stringify({
          type: "error",
          message: err instanceof Error ? err.message : "Failed to resend OTP.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  // 4. Verify Access Token from MSG91 Widget: POST /api/otp/verify-token
  if (url.pathname === "/api/otp/verify-token" && request.method === "POST") {
    try {
      const body = (await request.json()) as { "access-token"?: string; accessToken?: string };
      const token = body["access-token"] || body.accessToken || "";

      if (authKey && token) {
        const res = await fetch("https://control.msg91.com/api/v5/widget/verifyAccessToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            authkey: authKey,
            "access-token": token,
          }),
        });

        const data = (await res.json()) as { type?: string; message?: string };
        return new Response(JSON.stringify(data), {
          status: res.ok ? 200 : 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ type: "success", message: "Token verified successfully." }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } catch (err: unknown) {
      return new Response(
        JSON.stringify({
          type: "error",
          message: err instanceof Error ? err.message : "Failed to verify token.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  return null;
}

// ── /api/upload/avatar & /api/upload/file — generate pre-signed R2 PUT URL ────
async function handleAvatarUploadRoute(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (
    (url.pathname !== "/api/upload/avatar" && url.pathname !== "/api/upload/file") ||
    request.method !== "POST"
  ) {
    return null;
  }

  const ip = getClientIp(request);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "invalid_json", message: "Request body must be JSON." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const parsed = parseBody(avatarUploadRequestSchema, body);
  if (!parsed.ok) return parsed.response;

  const { userId, mimeType, bytes, folder } = parsed.data;

  // Rate limit: per user
  const rl = await checkUploadRateLimit(userId);
  if (!rl.allowed) return tooManyRequestsResponse(rl.reset);

  // IP-level auth rate limit
  const ipRl = await checkAuthRateLimit(ip);
  if (!ipRl.allowed) return tooManyRequestsResponse(ipRl.reset);

  try {
    const ticket = await getAvatarUploadTicket(userId, mimeType, bytes, folder || "avatars");
    return new Response(JSON.stringify(ticket), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "upload_ticket_failed",
        message: err instanceof Error ? err.message : "Failed to generate upload URL.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

// ── /api/auth/guard — server-side rate-limit & Turnstile validation ──────────
async function handleAuthGuardRoute(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/auth/guard" || request.method !== "POST") return null;

  const ip = getClientIp(request);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "invalid_json", message: "Request body must be JSON." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const parsed = parseBody(authGuardSchema, body);
  if (!parsed.ok) return parsed.response;

  const { action, phone, userId, turnstileToken } = parsed.data;

  // 1. Rate limits via Upstash Redis
  if (action === "signin" || action === "signup") {
    const rl = await checkAuthRateLimit(ip);
    if (!rl.allowed) return tooManyRequestsResponse(rl.reset);
  } else if (action === "otp-send") {
    const targetPhone = phone || "unknown";
    const rl = await checkOtpSendRateLimit(targetPhone, ip);
    if (!rl.allowed) return tooManyRequestsResponse(rl.reset);
  } else if (action === "otp-verify") {
    const targetPhone = phone || "unknown";
    const rl = await checkOtpVerifyRateLimit(targetPhone);
    if (!rl.allowed) return tooManyRequestsResponse(rl.reset);
  } else if (action === "profile-create") {
    const targetUid = userId || ip;
    const rl = await checkProfileRateLimit(targetUid);
    if (!rl.allowed) return tooManyRequestsResponse(rl.reset);
  }

  // 2. Turnstile token verification
  if (turnstileToken) {
    const ts = await verifyTurnstileToken(turnstileToken, ip);
    if (!ts.success) return turnstileFailedResponse();
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// ── /api/profile/create — validated, rate-limited server-side profile creation ──
async function handleProfileCreateRoute(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/profile/create" || request.method !== "POST") return null;

  const ip = getClientIp(request);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "invalid_json", message: "Request body must be JSON." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const parsed = parseBody(profileCreateSchema, body);
  if (!parsed.ok) return parsed.response;

  const { uid, displayName, legalName, phone, email, avatar_url, turnstileToken } = parsed.data;

  // Rate limiting (per user + per IP)
  const [userRl, ipRl] = await Promise.all([
    checkProfileRateLimit(uid),
    checkAuthRateLimit(ip),
  ]);
  if (!userRl.allowed) return tooManyRequestsResponse(userRl.reset);
  if (!ipRl.allowed) return tooManyRequestsResponse(ipRl.reset);

  // Turnstile verification
  if (turnstileToken) {
    const ts = await verifyTurnstileToken(turnstileToken, ip);
    if (!ts.success) return turnstileFailedResponse();
  }

  // Supabase pooler / service-role server-side client
  const supabaseUrl = process.env["VITE_SUPABASE_URL"] ?? process.env["SUPABASE_URL"];
  const supabaseKey =
    process.env["SUPABASE_SERVICE_ROLE_KEY"] ??
    process.env["VITE_SUPABASE_ANON_KEY"] ??
    process.env["SUPABASE_ANON_KEY"];

  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: "db_error", message: "Supabase connection not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const client = createClient(supabaseUrl, supabaseKey);
    const cleanPhone = phone
      ? phone.startsWith("+91")
        ? phone
        : `+91${phone.replace(/\D/g, "")}`
      : null;

    const payload = {
      id: uid,
      full_name: displayName,
      phone: cleanPhone,
      avatar_url: avatar_url ?? null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await client.from("profiles").upsert(payload, { onConflict: "id" });
    if (error) throw error;

    return new Response(
      JSON.stringify({
        ok: true,
        profile: {
          uid,
          displayName,
          legalName: legalName || displayName,
          phone: cleanPhone,
          email: email ?? null,
          role: "citizen",
          createdAt: Date.now(),
          avatar_url: avatar_url ?? null,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "db_error",
        message: err instanceof Error ? err.message : "Failed to create profile.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

// ── /api/health — lightweight DB ping to prevent Supabase free-tier pause ────
async function handleHealthRoute(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/health" || request.method !== "GET") return null;

  const supabaseUrl = process.env["VITE_SUPABASE_URL"] ?? process.env["SUPABASE_URL"];
  const supabaseKey = process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? process.env["VITE_SUPABASE_ANON_KEY"];

  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ status: "degraded", message: "Supabase not configured." }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const client = createClient(supabaseUrl, supabaseKey);
    // Minimal query — just checks the DB is reachable
    const { error } = await client.from("profiles").select("id").limit(1);
    if (error) throw error;
    return new Response(
      JSON.stringify({ status: "ok", ts: new Date().toISOString() }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: err instanceof Error ? err.message : "DB check failed.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }
}

// ── Rate-limit + Turnstile wrapper for existing OTP routes ───────────────────
async function handleOtpRouteWithGuards(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/otp/")) return null;

  // Only guard send + verify with Turnstile (retry doesn't require a new challenge)
  const ip = getClientIp(request);
  let body: Record<string, unknown> = {};

  // Clone so the original request can be re-read by handleMsg91ApiRoute
  const cloned = request.clone();
  try {
    body = (await cloned.json()) as Record<string, unknown>;
  } catch {
    // Non-JSON body — pass through to the real handler
    return null;
  }

  if (url.pathname === "/api/otp/send" && request.method === "POST") {
    const parsed = parseBody(otpSendSchema, body);
    if (!parsed.ok) return parsed.response;

    const rl = await checkOtpSendRateLimit(parsed.data.phone, ip);
    if (!rl.allowed) return tooManyRequestsResponse(rl.reset);

    const ts = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
    if (!ts.success) return turnstileFailedResponse();

    // Guards passed — fall through to the real MSG91 handler
    return null;
  }

  if (url.pathname === "/api/otp/verify" && request.method === "POST") {
    const parsed = parseBody(otpVerifySchema, body);
    if (!parsed.ok) return parsed.response;

    const rl = await checkOtpVerifyRateLimit(parsed.data.phone);
    if (!rl.allowed) return tooManyRequestsResponse(rl.reset);

    const ts = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
    if (!ts.success) return turnstileFailedResponse();

    return null;
  }

  return null;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    if (request.method === "OPTIONS") {
      const origin = request.headers.get("origin");
      const headers = new Headers();
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("X-Frame-Options", "SAMEORIGIN");
      headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
      headers.set(
        "Permissions-Policy",
        "camera=(self), geolocation=(self), microphone=(), payment=(), usb=()",
      );

      if (origin && origin !== "null") {
        try {
          const url = new URL(request.url);
          const reqHost = url.host;
          const originHost = new URL(origin).host;
          if (originHost === reqHost || originHost.endsWith(`.${reqHost}`)) {
            headers.set("Access-Control-Allow-Origin", origin);
            headers.set("Access-Control-Allow-Credentials", "true");
            headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            headers.set(
              "Access-Control-Allow-Headers",
              "Content-Type, Authorization, X-Requested-With",
            );
          }
        } catch {
          // Invalid origin
        }
      }
      return new Response(null, { status: 204, headers });
    }

    // ── /api/health — DB liveness ping ──────────────────────────────────────
    const healthResponse = await handleHealthRoute(request);
    if (healthResponse) {
      return applySecurityHeaders(healthResponse, request);
    }

    // ── /api/auth/guard — rate limiting + Turnstile verification ────────────
    const authGuardResponse = await handleAuthGuardRoute(request);
    if (authGuardResponse) {
      return applySecurityHeaders(authGuardResponse, request);
    }

    // ── /api/profile/create — validated + rate-limited server profile creation ──
    const profileResponse = await handleProfileCreateRoute(request);
    if (profileResponse) {
      return applySecurityHeaders(profileResponse, request);
    }

    // ── /api/upload/avatar & /api/upload/file — signed R2 upload URL ─────────
    const uploadResponse = await handleAvatarUploadRoute(request);
    if (uploadResponse) {
      return applySecurityHeaders(uploadResponse, request);
    }

    // ── OTP guards (rate limit + Turnstile) before MSG91 handler ────────────
    const otpGuardResponse = await handleOtpRouteWithGuards(request);
    if (otpGuardResponse) {
      return applySecurityHeaders(otpGuardResponse, request);
    }

    // Direct backend routing for MSG91 OTP requests (Eliminates browser CORS blocks)
    const otpResponse = await handleMsg91ApiRoute(request);
    if (otpResponse) {
      return applySecurityHeaders(otpResponse, request);
    }

    try {
      const handler = await getServerEntry();
      const rawResponse = await handler.fetch(request, env, ctx);
      const normalizedResponse = await normalizeCatastrophicSsrResponse(rawResponse);
      return applySecurityHeaders(normalizedResponse, request);
    } catch (error) {
      console.error(error);
      const errResponse = new Response(renderErrorPage(error), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
      return applySecurityHeaders(errResponse, request);
    }
  },
};
