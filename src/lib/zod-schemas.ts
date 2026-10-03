/**
 * Shared Zod schemas for server-side input validation.
 * Used in server.ts API route handlers.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export const indianPhoneSchema = z
  .string()
  .trim()
  .regex(/^\+?91?[6-9]\d{9}$/, "Must be a valid 10-digit Indian mobile number")
  .transform((v) => {
    const digits = v.replace(/\D/g, "");
    return digits.length === 10 ? `+91${digits}` : `+${digits}`;
  });

export const otpCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{4,8}$/, "OTP must be 4–8 digits");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Must be a valid email address")
  .max(254);

export const uuidSchema = z
  .string()
  .uuid("Must be a valid UUID");

export const mimeTypeSchema = z
  .enum(["image/jpeg", "image/png", "image/webp", "image/gif"], {
    errorMap: () => ({
      message: "Only JPEG, PNG, WebP, and GIF images are allowed.",
    }),
  });

// ---------------------------------------------------------------------------
// Request body schemas
// ---------------------------------------------------------------------------

export const otpSendSchema = z.object({
  phone: indianPhoneSchema,
  turnstileToken: z.string().min(1, "Human verification token is required"),
});

export const otpVerifySchema = z.object({
  phone: indianPhoneSchema,
  otp: otpCodeSchema,
  turnstileToken: z.string().min(1, "Human verification token is required"),
});

export const authGuardSchema = z.object({
  action: z.enum(["signin", "signup", "otp-send", "otp-verify", "profile-create"]),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional(),
  userId: z.string().optional(),
  turnstileToken: z.string().optional(),
});

export const profileCreateSchema = z.object({
  uid: z.string().min(1, "User ID is required"),
  displayName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  legalName: z.string().trim().max(100).optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  turnstileToken: z.string().optional(),
});

export const avatarUploadRequestSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  mimeType: mimeTypeSchema,
  bytes: z
    .number()
    .int()
    .positive()
    .max(15 * 1024 * 1024, "File must be under 15 MB"),
  folder: z.enum(["avatars", "issues", "media"]).default("avatars").optional(),
});

export const directUploadRequestSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  mimeType: mimeTypeSchema,
  folder: z.enum(["avatars", "issues", "media"]).default("avatars").optional(),
  fileData: z.string().min(1, "File data is required"),
});

// ---------------------------------------------------------------------------
// Helper: parse + respond
// ---------------------------------------------------------------------------

type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: Response };

export function parseBody<T>(
  schema: z.ZodSchema<T>,
  raw: unknown,
): ParseResult<T> {
  const result = schema.safeParse(raw);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  const issues = result.error.issues.map((i) => i.message).join(", ");
  return {
    ok: false,
    response: new Response(
      JSON.stringify({ error: "validation_error", message: issues }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    ),
  };
}
