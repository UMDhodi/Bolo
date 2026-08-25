import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

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
    "camera=(self), geolocation=(self), microphone=(), payment=(), usb=()"
  );
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://verify.msg91.com https://verify.phone91.com https://control.msg91.com; connect-src 'self' https://*.firebaseio.com wss://*.firebaseio.com https://*.firebasedatabase.app wss://*.firebasedatabase.app https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.cartocdn.com https://*.tile.openstreetmap.org https://control.msg91.com https://api.msg91.com https://verify.msg91.com https://verify.phone91.com https://unpkg.com; img-src 'self' data: blob: https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://*.firebasestorage.app https://lh3.googleusercontent.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://*.firebaseapp.com https://*.google.com https://verify.msg91.com https://verify.phone91.com; worker-src 'self' blob:; frame-ancestors 'self'; object-src 'none'; base-uri 'self';"
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
        headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
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
    process.env["VITE_MSG91_TEMPLATE_ID"] ||
    process.env["MSG91_TEMPLATE_ID"] ||
    "";

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
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err: unknown) {
      return new Response(
        JSON.stringify({ type: "error", message: err instanceof Error ? err.message : "Failed to send OTP." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
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
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ type: "error", message: "Invalid OTP code. In sandbox mode, enter 123456." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    } catch (err: unknown) {
      return new Response(
        JSON.stringify({ type: "error", message: err instanceof Error ? err.message : "Failed to verify OTP." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
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
        JSON.stringify({ type: "success", message: `OTP resent to +${formattedMobile} (Sandbox Mode).` }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err: unknown) {
      return new Response(
        JSON.stringify({ type: "error", message: err instanceof Error ? err.message : "Failed to resend OTP." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
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
            "Accept": "application/json",
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
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err: unknown) {
      return new Response(
        JSON.stringify({ type: "error", message: err instanceof Error ? err.message : "Failed to verify token." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
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
        "camera=(self), geolocation=(self), microphone=(), payment=(), usb=()"
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
            headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
          }
        } catch {
          // Invalid origin
        }
      }
      return new Response(null, { status: 204, headers });
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
