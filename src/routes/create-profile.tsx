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
import { User as UserIcon, Mail, ArrowRight, ImagePlus, ShieldCheck } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

        <Card className="rounded-3xl border-border bg-card shadow-soft overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <Badge variant="outline" className="w-fit text-primary border-primary/30 uppercase tracking-wider text-[10px] font-bold mb-1">
              One more step
            </Badge>
            <CardTitle className="font-display text-2xl font-bold tracking-tight text-foreground">
              Complete your Profile
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed text-muted-foreground">
              Enter your name and finish setting up your citizen identity.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-3 space-y-5">
            {/* Account indicator */}
            {user?.email && (
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary/40 px-3.5 py-2.5">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Account Created for
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">{user.email}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await signOutOfBolo();
                    void navigate({ to: "/auth", replace: true });
                  }}
                  className="rounded-full text-[11px] font-bold text-primary hover:bg-primary/10 h-7 px-2.5"
                >
                  Switch
                </Button>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4" noValidate>
              {/* Avatar picker with shadcn Avatar */}
              <div className="flex flex-col items-center gap-2.5">
                <label
                  htmlFor="avatar-upload"
                  className="group relative cursor-pointer"
                  aria-label="Upload profile photo"
                >
                  <Avatar className="size-20 border-2 border-dashed border-primary/40 bg-secondary transition-colors group-hover:border-primary">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="Avatar preview" className="object-cover" />
                    ) : null}
                    <AvatarFallback className="flex flex-col items-center justify-center gap-1 text-muted-foreground group-hover:text-primary bg-secondary">
                      <ImagePlus className="size-6" />
                      <span className="text-[10px] font-semibold">Add photo</span>
                    </AvatarFallback>
                  </Avatar>
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

              {/* Full name input */}
              <div className="space-y-1.5">
                <Label htmlFor="full-name" className="text-xs font-bold text-foreground">
                  Full / Display Name <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center rounded-2xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring">
                  <span className="flex items-center pl-3 text-muted-foreground">
                    <UserIcon className="size-4" />
                  </span>
                  <Input
                    id="full-name"
                    type="text"
                    autoComplete="name"
                    autoFocus
                    disabled={pending}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Aarav Mehta"
                    className="h-10 border-0 bg-transparent text-sm focus-visible:ring-0 shadow-none"
                    required
                  />
                </div>
              </div>

              {/* Error Alert */}
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

              {/* Submit with shadcn Button */}
              <Button
                type="submit"
                size="lg"
                disabled={pending || !displayName.trim()}
                className="w-full rounded-full font-bold shadow-soft"
              >
                {pending ? <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" /> : null}
                {pending ? "Saving Profile…" : "Save Profile & Enter Bolo"}
                {!pending && <ArrowRight className="size-4 ml-1.5" />}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-center text-[10px] text-muted-foreground pt-1">
                <ShieldCheck className="size-3.5 text-primary shrink-0" />
                <span>Your personal email and phone are kept private and never shown on public complaints.</span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
