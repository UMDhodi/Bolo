//#region node_modules/.nitro/vite/services/ssr/index.js
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
var SECRET_PATTERNS = [
	/Bearer\s+[A-Za-z0-9\-_.]+/gi,
	/password["':\s]+[^\s,"']+/gi,
	/apiKey["':\s]+[^\s,"']+/gi,
	/secret["':\s]+[^\s,"']+/gi
];
function redactSecrets(text) {
	let result = text;
	for (const pattern of SECRET_PATTERNS) result = result.replace(pattern, "[REDACTED]");
	return result;
}
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? redactSecrets(current) : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		const rawMsg = `${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`;
		parts.push(redactSecrets(rawMsg));
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return redactSecrets(JSON.stringify(value) ?? String(value));
	} catch {
		return redactSecrets(String(value));
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-C11NYt3R.mjs").then((n) => n.t).then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
function applySecurityHeaders(response, request) {
	const headers = new Headers(response.headers);
	headers.set("X-Content-Type-Options", "nosniff");
	headers.set("X-Frame-Options", "SAMEORIGIN");
	headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
	headers.set("Permissions-Policy", "camera=(self), geolocation=(self), microphone=(), payment=(), usb=()");
	headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com https://www.gstatic.com; connect-src 'self' https://*.firebaseio.com wss://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.cartocdn.com https://*.tile.openstreetmap.org; img-src 'self' data: blob: https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://lh3.googleusercontent.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://*.firebaseapp.com https://*.google.com; frame-ancestors 'self'; object-src 'none'; base-uri 'self';");
	headers.delete("x-powered-by");
	headers.delete("server");
	headers.delete("X-Powered-By");
	headers.delete("Server");
	const origin = request.headers.get("origin");
	if (origin && origin !== "null") try {
		const reqHost = new URL(request.url).host;
		const originHost = new URL(origin).host;
		if (originHost === reqHost || originHost.endsWith(`.${reqHost}`)) {
			headers.set("Access-Control-Allow-Origin", origin);
			headers.set("Access-Control-Allow-Credentials", "true");
			headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
			headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
		}
	} catch {}
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}
var server_default = { async fetch(request, env, ctx) {
	const proto = request.headers.get("x-forwarded-proto");
	const url = new URL(request.url);
	if (proto === "http" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
		url.protocol = "https:";
		return new Response(null, {
			status: 301,
			headers: {
				Location: url.toString(),
				"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
			}
		});
	}
	if (request.method === "OPTIONS") {
		const origin = request.headers.get("origin");
		const headers = new Headers();
		headers.set("X-Content-Type-Options", "nosniff");
		headers.set("X-Frame-Options", "SAMEORIGIN");
		headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
		headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
		headers.set("Permissions-Policy", "camera=(self), geolocation=(self), microphone=(), payment=(), usb=()");
		if (origin && origin !== "null") try {
			const reqHost = new URL(request.url).host;
			const originHost = new URL(origin).host;
			if (originHost === reqHost || originHost.endsWith(`.${reqHost}`)) {
				headers.set("Access-Control-Allow-Origin", origin);
				headers.set("Access-Control-Allow-Credentials", "true");
				headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
				headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
			}
		} catch {}
		return new Response(null, {
			status: 204,
			headers
		});
	}
	try {
		return applySecurityHeaders(await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx)), request);
	} catch (error) {
		console.error(error);
		return applySecurityHeaders(new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		}), request);
	}
} };
//#endregion
export { server_default as default, renderErrorPage as t };
