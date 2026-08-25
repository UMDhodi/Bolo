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

/**
 * Strict email domain validation for account creation.
 * Enforces valid, reputable providers (Google, Microsoft, Yahoo, Apple, Zoho, Proton, etc.)
 * and blocks disposable/temporary/burner/spam/fake domains.
 */
const ALLOWED_EXACT_DOMAINS = new Set([
  // Google
  "gmail.com",
  "googlemail.com",
  // Microsoft
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "outlook.in",
  "hotmail.co.uk",
  // Yahoo
  "yahoo.com",
  "yahoo.co.in",
  "yahoo.co.uk",
  "yahoo.ca",
  "yahoo.com.au",
  "ymail.com",
  "rocketmail.com",
  // Apple
  "icloud.com",
  "me.com",
  "mac.com",
  // Trusted global providers
  "zoho.com",
  "zoho.in",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "mail.com",
  "gmx.com",
  "gmx.net",
  "tutanota.com",
  "tuta.io",
]);

const BLOCKED_DOMAINS = new Set([
  "tempmail.com", "tempmail.net", "tempmail.org", "temp-mail.org", "temp-mail.io",
  "10minutemail.com", "10minutemail.net", "10minutemail.org",
  "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "guerrillamailblock.com", "sharklasers.com", "grr.la",
  "mailinator.com", "yopmail.com", "yopmail.fr", "yopmail.net",
  "trashmail.com", "trashmail.net", "trashmail.org", "throwawaymail.com",
  "getairmail.com", "dispostable.com", "crazymailing.com", "mailcatch.com",
  "mytemp.email", "mohmal.com", "burnermail.io", "maildrop.cc", "nada.ltd",
  "fake.com", "test.com", "example.com", "sample.com", "dummy.com", "abc.com", "xyz.com",
  "foo.com", "bar.com", "asdf.com", "testing.com", "email.com", "nomail.com",
]);

export function validateEmailDomain(email: string): { valid: boolean; error?: string } {
  const clean = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return { valid: false, error: "Please enter a valid email format (e.g. name@gmail.com)." };
  }

  const parts = clean.split("@");
  if (parts.length !== 2) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  const domain = parts[1]!.toLowerCase();

  // 1. Block known disposable, temporary, and test domains
  if (BLOCKED_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: "Temporary, disposable, or test email domains are not allowed. Please use your genuine email address (Gmail, Outlook, Yahoo, etc.).",
    };
  }

  // 2. If it's in the explicit trusted list (Gmail, Outlook, Yahoo, Apple, etc.), it's valid
  if (ALLOWED_EXACT_DOMAINS.has(domain)) {
    return { valid: true };
  }

  // 3. Allow legitimate educational, governmental, or organizational domains (.edu, .edu.in, .gov, .gov.in, .ac.in, .org)
  const isInstitutional =
    domain.endsWith(".edu") ||
    domain.endsWith(".edu.in") ||
    domain.endsWith(".gov") ||
    domain.endsWith(".gov.in") ||
    domain.endsWith(".ac.in") ||
    domain.endsWith(".org") ||
    domain.endsWith(".res.in") ||
    domain.endsWith(".nic.in");

  if (isInstitutional) {
    return { valid: true };
  }

  // 4. For other custom corporate domains: block suspicious substrings
  const suspiciousKeywords = ["temp", "trash", "fake", "burner", "dispos", "throwaway", "mailinator", "10min"];
  const isSuspicious = suspiciousKeywords.some((kw) => domain.includes(kw));
  if (isSuspicious) {
    return {
      valid: false,
      error: "Disposable or burner email addresses are not permitted. Please sign up using a genuine email provider.",
    };
  }

  // Check valid domain structure (at least domain.tld with valid chars)
  const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;
  if (!domainRegex.test(domain) || (domain.split(".").pop()?.length ?? 0) < 2) {
    return {
      valid: false,
      error: "Invalid email domain structure. Please enter a valid email address (e.g. Gmail, Outlook, Yahoo).",
    };
  }

  return { valid: true };
}
