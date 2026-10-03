/**
 * Cloudflare R2 service — server-side only.
 * Generates pre-signed PUT URLs so the browser uploads directly to R2
 * without ever touching a service-role key in the frontend bundle.
 *
 * Env vars (server-side only — NO VITE_ prefix):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL
 */

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function getEnv(key: string): string {
  if (!process.env[key] && !process.env[`VITE_${key}`]) {
    try {
      process.loadEnvFile?.(".env.local");
    } catch {}
    try {
      process.loadEnvFile?.(".env");
    } catch {}
  }
  const val = process.env[key] || process.env[`VITE_${key}`];
  if (!val) throw new Error(`[R2] Missing env var: ${key}`);
  return val;
}

function buildR2Client(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${getEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

// Allowed MIME types for avatar uploads
const ALLOWED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

// Max file size: 8 MB
const MAX_AVATAR_BYTES = 8 * 1024 * 1024;

// ---------------------------------------------------------------------------
// Signed-URL generation
// ---------------------------------------------------------------------------

export type AvatarUploadTicket = {
  /** Pre-signed PUT URL — the browser sends a PUT request here directly */
  uploadUrl: string;
  /** Public URL to save in the `profiles` table after the upload succeeds */
  publicUrl: string;
  /** R2 object key (for deletion later) */
  key: string;
};

/**
 * Generate a short-lived pre-signed PUT URL for an avatar upload.
 *
 * @param userId   Supabase auth.users UUID — used as the folder prefix
 * @param mimeType Must be one of the ALLOWED_AVATAR_TYPES
 * @param bytes    Reported file size — must be ≤ MAX_AVATAR_BYTES
 */
export async function getAvatarUploadTicket(
  userId: string,
  mimeType: string,
  bytes: number,
  folder: "avatars" | "issues" | "media" = "avatars",
): Promise<AvatarUploadTicket> {
  if (!ALLOWED_AVATAR_TYPES.has(mimeType)) {
    throw new Error(
      `Invalid file type: ${mimeType}. Only JPEG, PNG, WebP and GIF are allowed.`,
    );
  }
  if (bytes > 15 * 1024 * 1024) {
    throw new Error("File too large. Maximum size is 15 MB.");
  }

  const bucket = getEnv("R2_BUCKET");
  const publicBaseUrl = (process.env["R2_PUBLIC_URL"] || `https://${bucket}.r2.dev`).replace(/\/$/, "");

  // Deterministic key per user for avatars; unique key for issues/media
  const ext = mimeType.split("/")[1] ?? "jpg";
  const key =
    folder === "avatars"
      ? `avatars/${userId}/avatar.${ext}`
      : `${folder}/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const client = buildR2Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: mimeType,
    ContentLength: bytes,
    Metadata: { "uploaded-by": userId, folder },
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 }); // 5 min

  return {
    uploadUrl,
    publicUrl: `${publicBaseUrl}/${key}`,
    key,
  };
}

/**
 * Directly upload a file buffer to Cloudflare R2 server-side.
 * Eliminates browser CORS issues and presigned URL roundtrip failures.
 */
export async function uploadDirectToR2(
  userId: string,
  buffer: Buffer | Uint8Array,
  mimeType: string,
  folder: "avatars" | "issues" | "media" = "avatars",
): Promise<string> {
  if (!ALLOWED_AVATAR_TYPES.has(mimeType)) {
    throw new Error(
      `Invalid file type: ${mimeType}. Only JPEG, PNG, WebP and GIF are allowed.`,
    );
  }
  const bucket = getEnv("R2_BUCKET");
  const publicBaseUrl = (
    process.env["R2_PUBLIC_URL"] ||
    process.env["VITE_R2_PUBLIC_URL"] ||
    `https://${bucket}.r2.dev`
  ).replace(/\/$/, "");

  const ext = mimeType.split("/")[1] ?? "jpg";
  const key =
    folder === "avatars"
      ? `avatars/${userId}/avatar.${ext}`
      : `${folder}/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const client = buildR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: mimeType,
      Body: buffer,
      Metadata: { "uploaded-by": userId, folder },
    }),
  );

  return `${publicBaseUrl}/${key}`;
}

// ---------------------------------------------------------------------------
// Deletion
// ---------------------------------------------------------------------------

/**
 * Delete an avatar object from R2 (e.g. on account deletion).
 * Safe to call even if the object does not exist.
 */
export async function deleteAvatarFromR2(key: string): Promise<void> {
  const bucket = getEnv("R2_BUCKET");
  const client = buildR2Client();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
