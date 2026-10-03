/**
 * Supabase client + all auth/profile/issue helpers.
 * Drop-in replacement for firebase.ts — all exported symbols are preserved.
 */
import { createClient } from "@supabase/supabase-js";
import { sanitizeInput, validateStrongPassword } from "./utils";
import { logSecurityEvent } from "./security-logger";
import { type Issue } from "./mock-data";
import { resolveLocationCoordinates } from "./location-resolver";

// ── Environment variables ─────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"] as string;
const SUPABASE_ANON_KEY = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string;

export const isSupabaseConfigured = Boolean(SUPABASE_URL) && Boolean(SUPABASE_ANON_KEY);

if (!isSupabaseConfigured) {
  console.warn(
    "[Bolo] Supabase env vars missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local",
  );
}

// ── Singleton client ──────────────────────────────────────────────────────────
export const supabase = createClient(
  SUPABASE_URL ?? "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY ?? "placeholder",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // handles OAuth redirect return
    },
  },
);

// ── Public types ──────────────────────────────────────────────────────────────
export type BoloUser = {
  uid: string;
  displayName: string;
  email: string | null;
  phone?: string | null;
  emailVerified?: boolean;
  avatarUrl?: string | null;
};

export type UserProfile = {
  uid: string;
  displayName: string;
  legalName?: string;
  email?: string | null;
  phone?: string | null;
  role?: string;
  verified?: boolean;
  createdAt?: number;
  avatar_url?: string | null;
  avatarUrl?: string | null;
};

export type NewIssue = {
  title: string;
  description: string;
  reporter: string;
  occurredAt: string;
  location: string;
  address: string;
  language: string;
  latitude: number | null;
  longitude: number | null;
  images: File[];
};

// ── Error message mapper ──────────────────────────────────────────────────────
function message(error: unknown): string {
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : String(error);

  if (msg.includes("User already registered") || msg.includes("already been registered"))
    return "This email is already registered. Try signing in instead.";
  if (msg.includes("Invalid login credentials") || msg.includes("invalid_grant"))
    return "Email or password is incorrect.";
  if (msg.includes("Email not confirmed"))
    return "Please verify your email address before signing in.";
  if (msg.includes("Password should be at least"))
    return "Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters.";
  if (msg.includes("invalid OTP") || msg.includes("Token has expired"))
    return "Invalid or expired OTP. Please request a new code.";
  if (msg.includes("rate limit") || msg.includes("too many requests"))
    return "Too many requests. Please wait a moment before trying again.";
  if (msg.includes("network") || msg.includes("fetch"))
    return "Network error. Please check your connection and try again.";
  if (msg.includes("Phone") || msg.includes("phone"))
    return "Invalid phone number. Please enter a valid number with country code.";
  return msg.replace("AuthApiError: ", "").replace("PostgrestError: ", "");
}

export function getFirebaseErrorMessage(error: unknown): string {
  return message(error);
}

// ── Auth observer (replaces observeBoloAuth) ──────────────────────────────────
export function observeBoloAuth(callback: (user: BoloUser | null) => void): () => void {
  // Immediately check current session
  supabase.auth.getSession().then(({ data }) => {
    callback(data.session?.user ? toBoloUser(data.session.user) : null);
  });

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? toBoloUser(session.user) : null);
  });

  return () => listener.subscription.unsubscribe();
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

/** Email/password sign-up — creates Firebase-compatible credential only; profile upsert is separate */
export async function signUpWithCredentials(
  email: string,
  password: string,
): Promise<{ uid: string; email: string }> {
  const pwdValidation = validateStrongPassword(password);
  if (!pwdValidation.valid) {
    throw new Error(`Password security requirements not met: ${pwdValidation.errors.join(", ")}.`);
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw new Error(message(error));
  if (!data.user) throw new Error("Sign-up failed: no user returned.");

  return { uid: data.user.id, email: data.user.email ?? email };
}

/** Email/password sign-in */
export async function signInToBolo(email: string, password: string): Promise<BoloUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw new Error(message(error));
  if (!data.user) throw new Error("Sign-in failed.");

  return toBoloUser(data.user);
}

/** Google OAuth — opens redirect, returns immediately (OAuth redirect completes later) */
export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth`,
      queryParams: { access_type: "offline", prompt: "select_account" },
    },
  });
  if (error) throw new Error(message(error));
}

/** Apple OAuth */
export async function signInWithApple(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: { redirectTo: `${window.location.origin}/auth` },
  });
  if (error) throw new Error(message(error));
}

/** Phone OTP — send code */
export async function sendPhoneOTP(phone: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw new Error(message(error));
}

/** Phone OTP — verify code */
export async function verifyPhoneOTP(phone: string, token: string): Promise<BoloUser> {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) throw new Error(message(error));
  if (!data.user) throw new Error("OTP verification failed.");
  return toBoloUser(data.user);
}

/** Password reset email */
export async function sendPasswordResetLink(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }
  const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo: `${window.location.origin}/auth`,
  });
  if (error) throw new Error(message(error));
}

/** Update password (requires active session) */
export async function updateUserPassword(newPassword: string): Promise<void> {
  const pwdValidation = validateStrongPassword(newPassword);
  if (!pwdValidation.valid) {
    throw new Error(`Password requirement: ${pwdValidation.errors.join(", ")}.`);
  }
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(message(error));
}

/** Sign out */
export async function signOutOfBolo(): Promise<void> {
  await supabase.auth.signOut();
}

// ── Profile helpers ───────────────────────────────────────────────────────────

/** Security guard verification: verifies Turnstile token and checks Upstash Redis rate limits */
export async function verifyAuthGuard(params: {
  action: "signin" | "signup" | "otp-send" | "otp-verify" | "profile-create";
  email?: string;
  phone?: string;
  userId?: string;
  turnstileToken?: string;
}): Promise<void> {
  try {
    const res = await fetch("/api/auth/guard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
        retryAfterSeconds?: number;
      };
      if (res.status === 429) {
        throw new Error(
          data.message || `Too many attempts. Please try again in ${data.retryAfterSeconds || 60} seconds.`,
        );
      }
      if (res.status === 403) {
        throw new Error(data.message || "Human verification failed. Please try again.");
      }
      throw new Error(data.message || "Security verification failed.");
    }
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message.includes("Too many") ||
        err.message.includes("Human verification") ||
        err.message.includes("Security verification failed"))
    ) {
      throw err;
    }
    // Network / dev-mode pass-through
    console.warn("[Security Guard] Pass-through:", err);
  }
}

/** Upsert row in `profiles` table with server-side validation & rate-limiting */
export async function saveCitizenProfile(input: {
  uid: string;
  displayName: string;
  legalName?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  avatar_url?: string | undefined;
  turnstileToken?: string | undefined;
}): Promise<UserProfile> {
  const cleanDisplayName = sanitizeInput(input.displayName.trim(), 100);
  const cleanPhone = input.phone
    ? input.phone.startsWith("+91")
      ? input.phone
      : `+91${input.phone.replace(/\D/g, "")}`
    : null;

  // 1. Try server-side endpoint first (rate-limited via Upstash & validated via Zod)
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    const res = await fetch("/api/profile/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        uid: input.uid,
        displayName: cleanDisplayName,
        legalName: input.legalName,
        phone: cleanPhone,
        email: input.email ?? null,
        avatar_url: input.avatar_url ?? null,
        turnstileToken: input.turnstileToken,
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as { ok: boolean; profile: UserProfile };
      return data.profile;
    }

    if (res.status === 429 || res.status === 403 || res.status === 400) {
      const errData = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(errData.message || "Failed to create profile.");
    }
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message.includes("Too many") ||
        err.message.includes("Human verification") ||
        err.message.includes("characters"))
    ) {
      throw err;
    }
    console.warn("[Profile] Falling back to direct Supabase client upsert:", err);
  }

  // 2. Client-side Supabase upsert fallback
  const payload = {
    id: input.uid,
    full_name: cleanDisplayName,
    phone: cleanPhone,
    avatar_url: input.avatar_url ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").upsert(payload, {
    onConflict: "id",
  });

  if (error) throw new Error(message(error));

  return {
    uid: input.uid,
    displayName: cleanDisplayName,
    legalName: input.legalName || cleanDisplayName,
    phone: cleanPhone,
    email: input.email ?? null,
    role: "citizen",
    createdAt: Date.now(),
    avatar_url: input.avatar_url ?? null,
    avatarUrl: input.avatar_url ?? null,
  };
}

/** Fetch profile row (checks Upstash Redis cache first for sub-millisecond response) */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  // 1. Try server-side Redis cache endpoint first
  try {
    const res = await fetch(`/api/profile/get/${encodeURIComponent(uid)}`);
    if (res.ok) {
      const data = (await res.json()) as { ok: boolean; profile: UserProfile | null };
      if (data.ok && data.profile) {
        const prof = data.profile;
        return {
          ...prof,
          avatarUrl: prof.avatarUrl || prof.avatar_url || null,
        };
      }
    }
  } catch {
    // Non-blocking fallback to client-side Supabase
  }

  // 2. Direct Supabase query fallback
  const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();

  if (error) {
    console.warn("[Bolo] getUserProfile error:", error.message);
    // Fall back to auth metadata
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (user && user.id === uid) {
      const av = (user.user_metadata["avatar_url"] as string | undefined) ?? null;
      return {
        uid,
        displayName:
          (user.user_metadata["full_name"] as string | undefined) ||
          (user.user_metadata["name"] as string | undefined) ||
          user.email?.split("@")[0] ||
          "Bolo citizen",
        email: user.email ?? null,
        phone: user.phone ?? null,
        avatar_url: av,
        avatarUrl: av,
      };
    }
    return null;
  }

  if (!data) return null;

  const row = data as Record<string, unknown>;
  const av = (row["avatar_url"] as string | undefined) ?? null;
  return {
    uid: row["id"] as string,
    displayName: (row["full_name"] as string | undefined) ?? "Bolo citizen",
    ...(row["full_name"] ? { legalName: row["full_name"] as string } : {}),
    ...(row["phone"] ? { phone: row["phone"] as string } : {}),
    avatar_url: av,
    avatarUrl: av,
    ...(row["created_at"] ? { createdAt: new Date(row["created_at"] as string).getTime() } : {}),
  };
}

/** Check if a profile row exists for the given uid */
export async function profileExists(uid: string): Promise<boolean> {
  const { data, error } = await supabase.from("profiles").select("id").eq("id", uid).maybeSingle();
  if (error) return false;
  return data !== null;
}

/** Update profile fields (IDOR-guarded + invalidates Upstash Redis cache) */
export async function updateUserProfile(
  uid: string,
  fields: {
    displayName?: string | undefined;
    legalName?: string | undefined;
    phone?: string | undefined;
    avatarUrl?: string | undefined;
  },
): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const currentUid = sessionData.session?.user?.id;

  if (currentUid && currentUid !== uid) {
    logSecurityEvent({
      eventType: "AUTHORIZATION_FAILURE",
      action: "MODIFY_USER_PROFILE_ATTEMPT",
      uid: currentUid,
      targetId: uid,
    });
    throw new Error("Unauthorized: You can only modify your own profile.");
  }

  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (fields.displayName !== undefined) {
    payload["full_name"] = sanitizeInput(fields.displayName.trim(), 100);
  }
  if (fields.phone !== undefined) {
    payload["phone"] = fields.phone.trim() || null;
  }
  if (fields.avatarUrl !== undefined) {
    payload["avatar_url"] = fields.avatarUrl.trim() || null;
  }

  const { error } = await supabase.from("profiles").update(payload).eq("id", uid);

  if (error) throw new Error(message(error));

  // Invalidate Upstash Redis cache so fresh profile is fetched next time
  try {
    void fetch("/api/profile/invalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });
  } catch {
    // Non-blocking
  }
}

/**
 * Avatar upload to Cloudflare R2 using pre-signed upload URLs.
 * Direct-to-R2 upload bypasses server bandwidth and memory limits.
 * Falls back to Supabase Storage if R2 is not configured.
 */
export async function uploadAvatar(uid: string, file: File): Promise<string> {
  try {
    const res = await fetch("/api/upload/avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: uid,
        mimeType: file.type || "image/jpeg",
        bytes: file.size,
        folder: "avatars",
      }),
    });

    if (res.ok) {
      const ticket = (await res.json()) as { uploadUrl: string; publicUrl: string };
      const uploadRes = await fetch(ticket.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/jpeg" },
        body: file,
      });

      if (uploadRes.ok) {
        return ticket.publicUrl;
      }
    } else if (res.status === 429) {
      const errData = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(errData.message || "Upload limit exceeded. Please wait a moment.");
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("limit exceeded")) {
      throw err;
    }
    console.warn("[Upload] R2 signed upload failed, falling back to Supabase Storage:", err);
  }

  // Fallback to Supabase Storage
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${uid}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) throw new Error(message(uploadError));

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * General file upload to Cloudflare R2 using signed PUT URLs.
 */
export async function uploadFileToR2(
  uid: string,
  file: File,
  folder: "avatars" | "issues" | "media" = "media",
): Promise<string> {
  const res = await fetch("/api/upload/file", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: uid,
      mimeType: file.type || "image/jpeg",
      bytes: file.size,
      folder,
    }),
  });

  if (!res.ok) {
    const errData = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(errData.message || "Failed to obtain signed upload URL.");
  }

  const ticket = (await res.json()) as { uploadUrl: string; publicUrl: string };
  const uploadRes = await fetch(ticket.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "image/jpeg" },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Failed to upload file to Cloudflare R2.");
  }

  return ticket.publicUrl;
}

/** Count issues reported by user */
export async function getUserIssueCount(
  uid: string,
  _userDisplayName?: string | null,
  _userEmail?: string | null,
): Promise<number> {
  const { count, error } = await supabase
    .from("issues")
    .select("id", { count: "exact", head: true })
    .or(`reporter_uid.eq.${uid},user_id.eq.${uid}`);

  if (error) return 0;
  return count ?? 0;
}

/** Export user data (GDPR / DPDP) */
export async function exportUserData(
  uid: string,
): Promise<{ profile: UserProfile | null; issues: Issue[] }> {
  const profile = await getUserProfile(uid);
  const { data: issuesData } = await supabase
    .from("issues")
    .select("*")
    .or(`reporter_uid.eq.${uid},user_id.eq.${uid}`);

  return {
    profile,
    issues: (issuesData ?? []) as unknown as Issue[],
  };
}

/** Delete account (GDPR / DPDP right to erasure) */
export async function deleteUserAccount(uid: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const current = sessionData.session?.user;
  if (!current || current.id !== uid) {
    throw new Error("Unauthorized: You can only delete your own account.");
  }

  logSecurityEvent({
    eventType: "PERMISSION_CHANGE",
    action: "DELETE_USER_ACCOUNT",
    uid,
  });

  // Delete profile row (cascade will handle related data via RLS)
  await supabase.from("profiles").delete().eq("id", uid);

  // Clear session cookie
  if (typeof document !== "undefined") {
    document.cookie = "bolo_session=; Path=/; Max-Age=0; SameSite=Lax";
  }

  // Sign out (Supabase doesn't let client delete auth.users directly)
  await supabase.auth.signOut();
}

// ── Issues CRUD ───────────────────────────────────────────────────────────────

const DEFAULT_ISSUE_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22450%22%20viewBox%3D%220%200%20600%20450%22%3E%3Crect%20width%3D%22600%22%20height%3D%22450%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%3ENo%20Image%20Uploaded%3C%2Ftext%3E%3C%2Fsvg%3E";

export function normalizeIssueRow(row: Record<string, unknown>): Issue {
  const rawImages = row["images"];
  const parsedImages = Array.isArray(rawImages)
    ? (rawImages as string[])
    : typeof rawImages === "string"
      ? [rawImages]
      : [];
  const safeImages = parsedImages.length > 0 ? parsedImages : [DEFAULT_ISSUE_IMAGE];

  const rawLat = row["lat"] ?? row["latitude"];
  const rawLng = row["lng"] ?? row["longitude"];
  const parsedLat = typeof rawLat === "number" && !isNaN(rawLat) ? rawLat : Number(rawLat);
  const parsedLng = typeof rawLng === "number" && !isNaN(rawLng) ? rawLng : Number(rawLng);

  const safeLat = !isNaN(parsedLat) && parsedLat !== 0 ? parsedLat : 20.5937;
  const safeLng = !isNaN(parsedLng) && parsedLng !== 0 ? parsedLng : 78.9629;

  return {
    id: (row["id"] as string) || `BLO-${Date.now()}`,
    title: (row["title"] as string) || "Civic Complaint",
    reporter: (row["reporter"] as string) || "Citizen",
    reporterUid: (row["reporter_uid"] as string) || (row["reporterUid"] as string) || undefined,
    userId: (row["user_id"] as string) || (row["userId"] as string) || undefined,
    reporterEmail: (row["reporter_email"] as string) || (row["reporterEmail"] as string) || null,
    reporterPhone: (row["reporter_phone"] as string) || (row["reporterPhone"] as string) || null,
    createdAt: row["created_at"] ? new Date(row["created_at"] as string).getTime() : Date.now(),
    date:
      (row["date"] as string) ||
      (row["created_at"] ? new Date(row["created_at"] as string).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)),
    status: (row["status"] as "reported" | "progress" | "solved") || "reported",
    category: (row["category"] as string) || "Civic Issue",
    location: (row["location"] as string) || "India",
    address: (row["address"] as string) || "",
    description: (row["description"] as string) || "",
    images: safeImages,
    state: (row["state"] as string) || "",
    district: (row["district"] as string) || "",
    city: (row["city"] as string) || "",
    lat: safeLat,
    lng: safeLng,
  };
}

/** Subscribe to issues (real-time) — returns unsubscribe fn */
export function subscribeToIssues(callback: (issues: Issue[]) => void): () => void {
  let isSubscribed = true;

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        if (isSubscribed) {
          callback(data.map((r) => normalizeIssueRow(r as Record<string, unknown>)));
        }
        return;
      }
      if (error) {
        console.warn("[Issues] Client query error, falling back to /api/issues:", error.message);
      }
    } catch (e) {
      console.warn("[Issues] Client query threw, falling back to /api/issues:", e);
    }

    // Fallback: try server-side endpoint
    try {
      const res = await fetch("/api/issues");
      if (res.ok) {
        const body = (await res.json()) as { ok: boolean; issues: Record<string, unknown>[] };
        if (body.ok && Array.isArray(body.issues)) {
          if (isSubscribed) {
            callback(body.issues.map((r) => normalizeIssueRow(r)));
          }
          return;
        }
      }
    } catch (e) {
      console.warn("[Issues] Server fallback failed:", e);
    }

    // Always resolve with empty list so loading indicator never gets stuck
    if (isSubscribed) {
      callback([]);
    }
  };

  void fetchIssues();

  // Real-time subscription
  const channel = supabase
    .channel("public:issues")
    .on("postgres_changes", { event: "*", schema: "public", table: "issues" }, () => {
      void fetchIssues();
    })
    .subscribe();

  return () => {
    isSubscribed = false;
    void supabase.removeChannel(channel);
  };
}

/** Submit a new issue */
export async function submitIssue(user: BoloUser, issue: NewIssue): Promise<string> {
  const issueId = `BLO-${Date.now()}`;

  const imageUrls: string[] = [];
  for (const file of issue.images) {
    if (!file) continue;
    try {
      const b64 = await compressImageToBase64(file);
      imageUrls.push(b64);
    } catch (err) {
      console.warn("Error compressing image:", err);
    }
  }
  if (imageUrls.length === 0) {
    imageUrls.push(
      "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22450%22%20viewBox%3D%220%200%20600%20450%22%3E%3Crect%20width%3D%22600%22%20height%3D%22450%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%3ENo%20Image%20Uploaded%3C%2Ftext%3E%3C%2Fsvg%3E",
    );
  }

  const manualCoords =
    issue.latitude && issue.longitude
      ? { latitude: issue.latitude, longitude: issue.longitude }
      : null;
  const resolved = resolveLocationCoordinates(issue.location, issue.address, manualCoords);

  const dateParts = issue.occurredAt ? issue.occurredAt.split("T") : [];
  const dateStr =
    (dateParts.length > 0 && dateParts[0] ? dateParts[0] : "") ||
    new Date().toISOString().slice(0, 10);

  const payload = {
    id: issueId,
    title: sanitizeInput(issue.title, 150),
    description: sanitizeInput(issue.description, 4000),
    reporter: sanitizeInput(issue.reporter, 100) || user.displayName,
    reporter_uid: user.uid,
    user_id: user.uid,
    reporter_email: user.email ?? null,
    reporter_phone: user.phone ?? null,
    created_at: new Date().toISOString(),
    date: dateStr,
    status: "reported",
    category: sanitizeInput(issue.language, 50) || "Civic Issue",
    location: sanitizeInput(issue.location, 200),
    address: sanitizeInput(issue.address, 300),
    images: imageUrls,
    state: resolved.state,
    district: resolved.district,
    city: resolved.city,
    lat: resolved.latitude,
    lng: resolved.longitude,
  };

  const { error } = await supabase.from("issues").insert(payload);
  if (error) throw new Error(message(error));

  return issueId;
}

/** Update an issue (IDOR-guarded) */
export async function updateIssue(
  issueId: string,
  updates: Partial<Omit<Issue, "id">> & { newImages?: File[] },
): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const currentUid = sessionData.session?.user?.id;

  const { data: existing, error: fetchErr } = await supabase
    .from("issues")
    .select("*")
    .eq("id", issueId)
    .maybeSingle();

  if (fetchErr || !existing) throw new Error("Issue not found.");

  if (
    currentUid &&
    existing["reporter_uid"] &&
    existing["reporter_uid"] !== currentUid &&
    existing["user_id"] !== currentUid
  ) {
    logSecurityEvent({
      eventType: "AUTHORIZATION_FAILURE",
      action: "UPDATE_ISSUE_ATTEMPT",
      uid: currentUid,
      targetId: issueId,
      details: { reporterUid: existing["reporter_uid"] as string },
    });
    throw new Error("Unauthorized: You do not have permission to modify this issue.");
  }

  let finalImages = updates.images ?? (existing["images"] as string[]);
  if (updates.newImages && updates.newImages.length > 0) {
    const newBase64s: string[] = [];
    for (const file of updates.newImages) {
      try {
        const b64 = await compressImageToBase64(file);
        newBase64s.push(b64);
      } catch (e) {
        console.warn("Error compressing image:", e);
      }
    }
    if (newBase64s.length > 0) {
      finalImages = [...finalImages, ...newBase64s].slice(0, 5);
    }
  }

  let resolvedLat = updates.lat ?? (existing["lat"] as number | null);
  let resolvedLng = updates.lng ?? (existing["lng"] as number | null);
  let resolvedState = updates.state ?? (existing["state"] as string | null);
  let resolvedDistrict = updates.district ?? (existing["district"] as string | null);
  let resolvedCity = updates.city ?? (existing["city"] as string | null);

  if (
    (updates.location && updates.location !== existing["location"]) ||
    (updates.address && updates.address !== existing["address"])
  ) {
    const loc = updates.location ?? (existing["location"] as string);
    const addr = updates.address ?? (existing["address"] as string);
    const resolved = resolveLocationCoordinates(loc, addr, null);
    resolvedLat = resolved.latitude;
    resolvedLng = resolved.longitude;
    resolvedState = resolved.state;
    resolvedDistrict = resolved.district;
    resolvedCity = resolved.city;
  }

  const safePayload: Record<string, unknown> = {
    title: updates.title !== undefined ? sanitizeInput(updates.title, 150) : existing["title"],
    description:
      updates.description !== undefined
        ? sanitizeInput(updates.description, 4000)
        : existing["description"],
    location:
      updates.location !== undefined ? sanitizeInput(updates.location, 200) : existing["location"],
    address:
      updates.address !== undefined ? sanitizeInput(updates.address, 300) : existing["address"],
    category:
      updates.category !== undefined ? sanitizeInput(updates.category, 50) : existing["category"],
    images: finalImages,
    lat: resolvedLat,
    lng: resolvedLng,
    state: resolvedState,
    district: resolvedDistrict,
    city: resolvedCity,
  };

  const { error } = await supabase.from("issues").update(safePayload).eq("id", issueId);

  if (error) throw new Error(message(error));
}

/** Delete an issue (IDOR-guarded) */
export async function deleteIssue(issueId: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const currentUid = sessionData.session?.user?.id;

  const { data: existing } = await supabase
    .from("issues")
    .select("reporter_uid, user_id")
    .eq("id", issueId)
    .maybeSingle();

  if (
    existing &&
    currentUid &&
    existing["reporter_uid"] &&
    existing["reporter_uid"] !== currentUid &&
    existing["user_id"] !== currentUid
  ) {
    logSecurityEvent({
      eventType: "AUTHORIZATION_FAILURE",
      action: "DELETE_ISSUE_ATTEMPT",
      uid: currentUid,
      targetId: issueId,
    });
    throw new Error("Unauthorized: You do not have permission to delete this issue.");
  }

  const { error } = await supabase.from("issues").delete().eq("id", issueId);
  if (error) throw new Error(message(error));
}

/** Check issue ownership */
export function isIssueOwner(
  uid: string | undefined,
  issue: { reporterUid?: string; userId?: string },
): boolean {
  if (!uid) return false;
  return issue.reporterUid === uid || issue.userId === uid;
}

// ── Image utilities (keep local, no Firebase Storage dependency) ──────────────

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

async function validateImageMagicBytes(file: File): Promise<boolean> {
  try {
    const buffer = await file.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes.length < 4) return false;
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
      return true;
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46)
      return true;
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38)
      return true;
    return false;
  } catch {
    return false;
  }
}

export async function compressImageToBase64(
  file: File,
  maxWidth = 800,
  quality = 0.7,
): Promise<string> {
  if (file.size > MAX_FILE_SIZE_BYTES)
    throw new Error("File exceeds maximum allowed size (10 MB).");
  if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase()))
    throw new Error("Invalid file format. Only JPG, PNG, and WebP images are permitted.");
  const isValidSignature = await validateImageMagicBytes(file);
  if (!isValidSignature) throw new Error("File content does not match genuine image signature.");

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.naturalWidth > 8192 || img.naturalHeight > 8192) {
        reject(new Error("Image dimensions exceed the safety limit (8192×8192)."));
        return;
      }
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } else {
        reject(new Error("Unable to create canvas context for image re-encoding."));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image file."));
    };
    img.src = url;
  });
}

// ── Internal helper ───────────────────────────────────────────────────────────
import type { User } from "@supabase/supabase-js";

function toBoloUser(user: User): BoloUser {
  return {
    uid: user.id,
    displayName:
      (user.user_metadata["full_name"] as string | undefined) ||
      (user.user_metadata["name"] as string | undefined) ||
      user.email?.split("@")[0] ||
      "Bolo citizen",
    email: user.email ?? null,
    phone: user.phone ?? null,
    emailVerified: user.email_confirmed_at != null,
    avatarUrl: (user.user_metadata["avatar_url"] as string | undefined) ?? null,
  };
}
