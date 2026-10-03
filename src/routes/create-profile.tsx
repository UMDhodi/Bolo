/**
 * /create-profile route
 *
 * Accessible only when:
 *   - A Supabase session exists (user is logged in)
 *   - No profile row exists yet in the `profiles` table
 *
 * On submit: upserts the profile row → updates context → navigates to "/"
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, type FormEvent } from "react";
import { User as UserIcon, Mail, ArrowRight, ImagePlus } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/components/auth-context";
import BSpinnerToCheck from "@/components/bspinnertocheck";
import { TurnstileWidget, type TurnstileRef } from "@/components/turnstile";
import {
  saveCitizenProfile,
  uploadAvatar,
  getFirebaseErrorMessage,
  signOutOfBolo,
} from "@/lib/supabase";

export const Route = createFileRoute("/create-profile")({
  head: () => ({ meta: [{ title: "Complete your profile – Bolo" }] }),
  component: CreateProfilePage,
});

function CreateProfilePage() {
  const navigate = useNavigate();
  const { user, setProfile } = useAuth();

  const [displayName, setDisplayName] = useState(
    user?.displayName && user.displayName !== "Bolo citizen" ? user.displayName : "",
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileRef>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Avatar must be smaller than 5 MB.");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("Session expired. Please sign in again.");
      void navigate({ to: "/auth", replace: true });
      return;
    }

    const cleanName = displayName.trim();
    if (!cleanName || cleanName.length < 2) {
      setError("Please enter your full name (minimum 2 characters).");
      return;
    }

    setPending(true);
    try {
      let avatarUrl: string | undefined;
      if (avatarFile) {
        try {
          avatarUrl = await uploadAvatar(user.uid, avatarFile);
        } catch (uploadErr) {
          console.warn("Avatar upload failed, continuing without avatar:", uploadErr);
        }
      }

      const savedProfile = await saveCitizenProfile({
        uid: user.uid,
        displayName: cleanName,
        ...(user.email ? { email: user.email } : {}),
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
        turnstileToken,
      });

      // ✅ Update context IMMEDIATELY so SessionGate sees hasProfile = true
      // This prevents the white screen after navigation
      setProfile(savedProfile);

      toast.success(`Welcome to Bolo, ${cleanName}! 🎉`, {
        description: "Your profile has been set up successfully.",
        duration: 4000,
      });

      void navigate({ to: "/", replace: true });
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
      turnstileRef.current?.reset();
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <img
              src="/logo.png"
              alt="Bolo logo"
              className="size-9 object-cover"
              aria-hidden="true"
            />
          </span>
          <span className="font-display text-2xl font-bold text-foreground">Bolo</span>
        </div>

        <p className="text-xs font-bold tracking-wider text-primary uppercase">One more step</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-foreground">
          Complete your Profile.
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Enter your name and finish setting up your citizen profile.
        </p>

        {/* Account indicator */}
        {user?.email && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-secondary/40 px-3 py-2.5">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Account Created for</p>
              <p className="truncate text-sm font-semibold text-foreground">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await signOutOfBolo();
                void navigate({ to: "/auth", replace: true });
              }}
              className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors"
            >
              Switch Account
            </button>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          {/* Avatar picker */}
          <div className="flex flex-col items-center gap-3">
            <label
              htmlFor="avatar-upload"
              className="group relative cursor-pointer"
              aria-label="Upload profile photo"
            >
              <div className="size-20 overflow-hidden rounded-full border-2 border-dashed border-primary/40 bg-secondary transition-colors group-hover:border-primary">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground group-hover:text-primary">
                    <ImagePlus className="size-6" />
                    <span className="text-[10px] font-semibold">Add photo</span>
                  </div>
                )}
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleAvatarChange}
                disabled={pending}
              />
            </label>
            <p className="text-[11px] text-muted-foreground">
              Optional · Max 5 MB · JPG, PNG, WebP
            </p>
          </div>

          {/* Full name */}
          <div>
            <label htmlFor="full-name" className="mb-1 block text-xs font-bold text-foreground">
              Full / Display Name <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center rounded-2xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring">
              <span className="flex items-center pl-3 text-muted-foreground">
                <UserIcon className="size-4" />
              </span>
              <input
                id="full-name"
                type="text"
                autoComplete="name"
                autoFocus
                disabled={pending}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Aarav Mehta"
                className="h-10 w-full rounded-2xl bg-transparent px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
            >
              {error}
            </p>
          )}

          <TurnstileWidget
            ref={turnstileRef}
            onVerify={(token) => setTurnstileToken(token)}
            action="profile-create"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={pending || !displayName.trim()}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" /> : null}
            {pending ? "Saving Profile…" : "Save Profile & Enter Bolo"}
            {!pending && <ArrowRight className="size-4" />}
          </button>

          <p className="text-center text-[10px] text-muted-foreground">
            🔒 Your Bolo ID is a secure unique account ID. Your personal phone and email are
            never displayed on public complaint cards.
          </p>
        </form>
      </div>
    </main>
  );
}
