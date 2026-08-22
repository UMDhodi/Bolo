/**
 * Application Error Logger
 * Built with OpenAI & Codex
 */

export function reportRuntimeError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("[Bolo Error]", error, context);
}
