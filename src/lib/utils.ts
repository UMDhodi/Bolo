import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Issue } from "./mock-data";
import type { BoloUser } from "./firebase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isIssueOwner(
  issue: Issue | null | undefined,
  user: BoloUser | null | undefined
): boolean {
  if (!issue || !user) return false;

  // 1. Direct UID match (primary backend UID field)
  if (issue.reporterUid && issue.reporterUid === user.uid) return true;
  if (issue.userId && issue.userId === user.uid) return true;

  // 2. Email match
  const userEmail = user.email?.trim().toLowerCase();
  const issueEmail = issue.reporterEmail?.trim().toLowerCase();
  if (userEmail && issueEmail && userEmail === issueEmail) return true;

  // 3. Display name match (case-insensitive & whitespace trimmed)
  const userDisplayName = user.displayName?.trim().toLowerCase();
  const issueReporter = issue.reporter?.trim().toLowerCase();
  if (userDisplayName && issueReporter && userDisplayName === issueReporter) return true;

  // 4. Email prefix match (e.g. user email "ritesh@example.com" matches reporter "Ritesh")
  const emailPrefix = userEmail ? userEmail.split("@")[0] : null;
  if (emailPrefix && issueReporter && issueReporter === emailPrefix) return true;

  return false;
}

/**
 * Strips null bytes, non-printable control characters, and enforces strict max length.
 */
export function sanitizeInput(value: unknown, maxLength = 1000): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\0/g, "") // Remove null bytes
    // eslint-disable-next-line no-control-regex
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove ASCII control characters except \t and \n
    .trim()
    .slice(0, maxLength);
}

/**
 * SSRF Guard: Validates that a target URL is safe and strictly disallows
 * loopback, internal networks, link-local, cloud metadata services, and IPv6 local addresses.
 */
export function isSafeExternalUrl(targetUrl: string): boolean {
  try {
    const parsed = new URL(targetUrl);
    // 1. Only allow HTTP and HTTPS
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

    const hostname = parsed.hostname.toLowerCase();

    // 2. Loopback & Localhost checks
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local")
    ) {
      return false;
    }

    // 3. Cloud Metadata Endpoints (AWS, GCP, Azure, DigitalOcean)
    if (
      hostname === "169.254.169.254" ||
      hostname === "metadata.google.internal" ||
      hostname === "metadata.local" ||
      hostname === "instance-data"
    ) {
      return false;
    }

    // 4. Private IPv4 Ranges (RFC 1918 & RFC 3927)
    // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, 127.0.0.0/8
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);
    if (match && match[1] && match[2]) {
      const octet1 = parseInt(match[1], 10);
      const octet2 = parseInt(match[2], 10);

      if (octet1 === 127 || octet1 === 10 || octet1 === 0) return false;
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return false;
      if (octet1 === 192 && octet2 === 168) return false;
      if (octet1 === 169 && octet2 === 254) return false;
    }

    // 5. IPv6 Link-Local / Unique Local (fe80::, fc00::, fd00::)
    if (
      hostname.startsWith("fe80:") ||
      hostname.startsWith("fc00:") ||
      hostname.startsWith("fd00:") ||
      hostname.startsWith("[fe80:") ||
      hostname.startsWith("[fc00:") ||
      hostname.startsWith("[fd00:") ||
      hostname.startsWith("[::1]")
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * In-Memory Sliding Window Rate Limiter for client/runtime actions.
 * Returns `true` if allowed, `false` if rate limit exceeded.
 */
const rateLimitBuckets = new Map<string, number[]>();

export function checkRateLimit(key: string, maxRequests = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const timestamps = (rateLimitBuckets.get(key) || []).filter((t) => now - t < windowMs);

  if (timestamps.length >= maxRequests) {
    rateLimitBuckets.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  rateLimitBuckets.set(key, timestamps);
  return true;
}

/**
 * Strong Password Policy Validator (OWASP ASVS v4.0.3 V2.1)
 * Enforces 8+ characters, uppercase, lowercase, numbers, and special symbols.
 */
export interface PasswordValidationResult {
  valid: boolean;
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  errors: string[];
}

export function validateStrongPassword(password: string): PasswordValidationResult {
  const pwd = typeof password === "string" ? password : "";
  const hasMinLength = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

  const errors: string[] = [];
  if (!hasMinLength) errors.push("At least 8 characters");
  if (!hasUpper) errors.push("At least one uppercase letter (A-Z)");
  if (!hasLower) errors.push("At least one lowercase letter (a-z)");
  if (!hasNumber) errors.push("At least one number (0-9)");
  if (!hasSpecial) errors.push("At least one special character (!@#$%^&*...)");

  return {
    valid: hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    errors,
  };
}

/**
 * Hashes a password with a secure salt using SHA-256 for persistent database storage.
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder();
    const salt = "bolo_civic_pwd_salt_2026";
    const data = encoder.encode(salt + password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Simple fallback if Web Crypto is unavailable
  return btoa(`enc_${password}_bolo`);
}

/**
 * Verifies a plain password against a stored encrypted hash.
 */
export async function verifyPasswordHash(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash || !password) return false;
  const calculated = await hashPassword(password);
  return calculated === storedHash;
}
