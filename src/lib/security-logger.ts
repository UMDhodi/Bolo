/**
 * Standardized Security Audit Logger
 * Conforms to OWASP ASVS v4.0.3 (V8 Logging and Monitoring)
 */

export type SecurityEventType =
  | "AUTH_SUCCESS"
  | "AUTH_FAILURE"
  | "AUTHORIZATION_FAILURE"
  | "ADMIN_ACTION"
  | "PERMISSION_CHANGE"
  | "SUSPICIOUS_BEHAVIOR"
  | "RATE_LIMIT_EXCEEDED";

export interface SecurityEvent {
  eventType: SecurityEventType;
  action: string;
  uid?: string | null;
  targetId?: string;
  details?: Record<string, unknown>;
}

const PII_KEYS = new Set(["password", "token", "secret", "authorization", "bearer", "apikey"]);

function sanitizeLogData(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (PII_KEYS.has(lowerKey)) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "string") {
      // Mask full email
      if (value.includes("@") && value.includes(".")) {
        const [user, domain] = value.split("@");
        sanitized[key] = user && user.length > 2 ? `${user[0]}***${user.slice(-1)}@${domain}` : `***@${domain}`;
      } else {
        sanitized[key] = value.length > 200 ? value.slice(0, 200) + "..." : value;
      }
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = sanitizeLogData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export function logSecurityEvent(event: SecurityEvent): void {
  const timestamp = new Date().toISOString();
  const sanitizedDetails = event.details ? sanitizeLogData(event.details) : undefined;

  const logEntry = {
    timestamp,
    type: "SECURITY_AUDIT",
    eventType: event.eventType,
    action: event.action,
    uid: event.uid || "anonymous",
    targetId: event.targetId,
    details: sanitizedDetails,
  };

  // Structured security log
  if (event.eventType === "AUTHORIZATION_FAILURE" || event.eventType === "SUSPICIOUS_BEHAVIOR") {
    console.warn("[SECURITY_ALERT]", JSON.stringify(logEntry));
  } else {
    console.info("[SECURITY_AUDIT]", JSON.stringify(logEntry));
  }
}
