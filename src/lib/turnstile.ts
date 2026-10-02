/**
 * Cloudflare Turnstile — server-side token verification.
 * Server-side only (no VITE_ prefix).
 *
 * Env vars:
 *   TURNSTILE_SECRET_KEY  — from Cloudflare Dashboard → Turnstile → your site
 *
 * Frontend uses:
 *   VITE_TURNSTILE_SITE_KEY — public, safe to expose in the bundle
 */

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileVerifyResult =
  | { success: true }
  | { success: false; errorCodes: string[] };

/**
 * Verify a Turnstile challenge token obtained from the browser widget.
 *
 * @param token   The `cf-turnstile-response` value from the form.
 * @param remoteip Optional client IP (improves accuracy; pass from CF header).
 */
export async function verifyTurnstileToken(
  token: string,
  remoteip?: string,
): Promise<TurnstileVerifyResult> {
  const secret = process.env["TURNSTILE_SECRET_KEY"];
  if (!secret) {
    // In development without a secret, skip verification (dev-only bypass)
    console.warn(
      "[Turnstile] TURNSTILE_SECRET_KEY not set — skipping verification (dev mode).",
    );
    return { success: true };
  }

  if (!token || token.trim() === "") {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (remoteip) formData.append("remoteip", remoteip);

  let json: { success?: boolean; "error-codes"?: string[] };
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
    });
    json = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
  } catch {
    return { success: false, errorCodes: ["network-error"] };
  }

  if (json.success === true) {
    return { success: true };
  }

  return {
    success: false,
    errorCodes: json["error-codes"] ?? ["unknown-error"],
  };
}

/**
 * Build a 403 Response for a failed Turnstile check.
 */
export function turnstileFailedResponse(): Response {
  return new Response(
    JSON.stringify({
      error: "captcha_failed",
      message:
        "Human verification failed. Please refresh the page and try again.",
    }),
    {
      status: 403,
      headers: { "Content-Type": "application/json" },
    },
  );
}
