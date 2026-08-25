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
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com; connect-src 'self' https://*.firebaseio.com wss://*.firebaseio.com https://*.firebasedatabase.app wss://*.firebasedatabase.app https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.cartocdn.com https://*.tile.openstreetmap.org https://control.msg91.com https://api.msg91.com https://unpkg.com; img-src 'self' data: blob: https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://*.firebasestorage.app https://lh3.googleusercontent.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://*.firebaseapp.com https://*.google.com; worker-src 'self' blob:; frame-ancestors 'self'; object-src 'none'; base-uri 'self';"
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
