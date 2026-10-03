import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, type FormEvent } from "react";
import {
  MapPin,
  Sparkles,
  Check,
  Lock,
  Mail,
  ArrowRight,
  KeyRound,
  RotateCw,
  ShieldCheck,
  User as UserIcon,
  Phone,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import civicIllustration from "@/assets/bolo-auth-civic-india.png";
import { useAuth } from "@/components/auth-context";
import BSpinnerToCheck from "@/components/bspinnertocheck";
import { TurnstileWidget, type TurnstileRef } from "@/components/turnstile";
import {
  signUpWithCredentials,
  saveCitizenProfile,
  getFirebaseErrorMessage,
  signInToBolo,
  signInWithGoogle,
  signInWithApple,
  sendPhoneOTP,
  verifyPhoneOTP,
  sendPasswordResetLink,
  profileExists,
  verifyAuthGuard,
} from "@/lib/supabase";
import { validateStrongPassword, validateEmailDomain } from "@/lib/utils";
import { validateIndianPhone } from "@/lib/msg91";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Welcome to Bolo" }] }),
  component: AuthPage,
});

// ── Bugs fixed vs original Firebase version ──────────────────────────────────
//
// BUG 1 — Firebase `auth` singleton imported directly in JSX:
//   `auth.currentUser?.uid` was used directly without a null guard race.
//   FIX: Use the uid returned from signUpWithCredentials instead.
//
// BUG 2 — Storing raw password in state (tempPassword) and sending it to RTDB:
//   The original code passed `password: tempPassword || password` in plaintext
//   to `saveCitizenProfile` which hashed it — but the hash ran client-side
//   using a non-standard SHA-256 approach. With Supabase we never need this.
//   FIX: Removed tempPassword state; Supabase handles hashing.
//
// BUG 3 — Double-navigation race (window.location.replace AND navigate):
//   Both `window.location.replace("/")` and `navigate({ to: "/" })` were called
//   depending on SSR/CSR mode. During Vite dev (always CSR) this caused a
//   full-page reload that could lose state.
//   FIX: Always use TanStack navigate(); the SessionGate handles the redirect
//   anyway after auth state changes.
//
// BUG 4 — isCreatingProfile sessionStorage flag not cleaned on Google sign-in:
//   If a Google OAuth flow started but then the user closed the popup, the flag
//   stayed set and blocked the "redirect to home" guard.
//   FIX: Removed entirely; profile existence is now derived from the DB row.
//
// BUG 5 — `configured` check referenced Firebase; now checks Supabase.
//   FIX: `configured` from useAuth() now reports isSupabaseConfigured.
//
// BUG 6 — No handling for OAuth redirect return:
//   After Google/Apple sign-in the browser returns to /auth with a code in the
//   URL. Supabase client auto-exchanges it via detectSessionInUrl:true, but the
//   old code had no awareness of this; it re-ran the sign-up form.
//   FIX: We detect a pending OAuth session (oauthPending state + onAuthStateChange
//   via the AuthContext) and show a loading indicator instead of the form.
//
// BUG 7 — Resend-timer not reset when switching modes:
//   resetAllStates() did not reset resendTimer back to 30.
//   FIX: Added `setResendTimer(30)` to resetAllStates().

type Mode = "signup" | "signin" | "phone" | "forgot_password";
type SignupStep = "credentials" | "profile";

function AuthPage() {
  const navigate = useNavigate();
  const { user, configured, hasProfile, profileChecked, setProfile } = useAuth();

  const [mode, setMode] = useState<Mode>("signup");
  const [signupStep, setSignupStep] = useState<SignupStep>("credentials");

  // Credentials Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profile Fields
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Phone OTP States
  const [phoneAuthNumber, setPhoneAuthNumber] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpCode, setPhoneOtpCode] = useState("");
  const [phoneTimer, setPhoneTimer] = useState(30);
  const [canResendPhone, setCanResendPhone] = useState(false);
  const [phonePending, setPhonePending] = useState(false);

  // UID of newly created account (for profile step)
  const [createdUid, setCreatedUid] = useState("");

  // Password Reset States
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Inline email error
  const [emailFieldError, setEmailFieldError] = useState<string | null>(null);

  // General state & dedicated loading states to prevent button state bleed
  const [error, setError] = useState<string | null>(null);
  const [authPending, setAuthPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [applePending, setApplePending] = useState(false);
  const [resetPending, setResetPending] = useState(false);

  // Cloudflare Turnstile token & ref
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileRef>(null);

  // True while Supabase is exchanging an OAuth code from the URL
  const [oauthExchanging, setOauthExchanging] = useState(false);

  const isAnyPending =
    authPending || googlePending || applePending || resetPending || phonePending || oauthExchanging;

  // Detect OAuth return — Supabase sets a hash/query with access_token or code
  useEffect(() => {
    const url = new URL(window.location.href);
    const hasOAuthParams =
      url.hash.includes("access_token") ||
      url.searchParams.has("code") ||
      url.hash.includes("error");
    if (hasOAuthParams) {
      setOauthExchanging(true);
    }
  }, []);

  // Once profileChecked resolves after OAuth, redirect correctly
  useEffect(() => {
    if (!oauthExchanging) return;
    if (!profileChecked) return;
    setOauthExchanging(false);
    if (!user) {
      // OAuth failed (error in URL) — stay on /auth
      const url = new URL(window.location.href);
      const errDesc = url.hash.match(/error_description=([^&]+)/)?.[1];
      if (errDesc) setError(decodeURIComponent(errDesc.replace(/\+/g, " ")));
      return;
    }
    if (hasProfile) {
      void navigate({ to: "/", replace: true });
    } else {
      void navigate({ to: "/create-profile", replace: true });
    }
  }, [oauthExchanging, profileChecked, user, hasProfile, navigate]);

  // Redirect already-authenticated users (normal page load, not OAuth)
  useEffect(() => {
    if (!profileChecked) return;
    if (oauthExchanging) return;
    if (user && hasProfile) {
      void navigate({ to: "/", replace: true });
    } else if (user && !hasProfile && signupStep !== "profile") {
      void navigate({ to: "/create-profile", replace: true });
    }
  }, [user, hasProfile, profileChecked, oauthExchanging, navigate, signupStep]);

  // Resend countdown timer (for forgot-password flow)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resetSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resetSent, resendTimer]);

  // Phone OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (phoneOtpSent && phoneTimer > 0) {
      interval = setInterval(() => {
        setPhoneTimer((prev) => {
          if (prev <= 1) {
            setCanResendPhone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phoneOtpSent, phoneTimer]);

  const resetAllStates = (newMode: Mode) => {
    setMode(newMode);
    setSignupStep("credentials");
    setError(null);
    setEmailNotice(null);
    setResetSent(false);
    setResendTimer(30); // BUG 7 fix
    setCanResend(false);
    setEmailFieldError(null);
    setPhoneError(null);
    setCreatedUid("");
    setPhoneAuthNumber("");
    setPhoneOtpSent(false);
    setPhoneOtpCode("");
    setPhoneTimer(30);
    setCanResendPhone(false);
    setTurnstileToken("");
    turnstileRef.current?.reset();
  };

  // Google OAuth
  async function handleGoogleAuth() {
    setError(null);
    setGooglePending(true);
    try {
      await signInWithGoogle();
      // Supabase redirects the browser; execution stops here
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
      setGooglePending(false);
    }
  }

  // Apple OAuth
  async function handleAppleAuth() {
    setError(null);
    setApplePending(true);
    try {
      await signInWithApple();
      // Supabase redirects the browser; execution stops here
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
      setApplePending(false);
    }
  }

  // Send Phone OTP
  async function handleSendPhoneOtp() {
    const clean = phoneAuthNumber.trim();
    if (!validateIndianPhone(clean)) {
      setPhoneError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setPhoneError(null);
    setError(null);
    setPhonePending(true);
    try {
      const full = clean.startsWith("+91") ? clean : `+91${clean.replace(/\D/g, "")}`;
      await verifyAuthGuard({ action: "otp-send", phone: full, turnstileToken });
      await sendPhoneOTP(full);
      setPhoneOtpSent(true);
      setPhoneTimer(30);
      setCanResendPhone(false);
      setTurnstileToken("");
      turnstileRef.current?.reset();
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
      turnstileRef.current?.reset();
    } finally {
      setPhonePending(false);
    }
  }

  // Verify Phone OTP
  async function handleVerifyPhoneOtp() {
    if (!phoneOtpCode || phoneOtpCode.trim().length < 6) {
      setError("Please enter the 6-digit OTP code sent to your phone.");
      return;
    }
    setError(null);
    setPhonePending(true);
    try {
      const clean = phoneAuthNumber.trim();
      const full = clean.startsWith("+91") ? clean : `+91${clean.replace(/\D/g, "")}`;
      await verifyAuthGuard({ action: "otp-verify", phone: full, turnstileToken });
      const loggedUser = await verifyPhoneOTP(full, phoneOtpCode.trim());
      const hasProf = await profileExists(loggedUser.uid);
      if (hasProf) {
        void navigate({ to: "/", replace: true });
      } else {
        void navigate({ to: "/create-profile", replace: true });
      }
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
      turnstileRef.current?.reset();
    } finally {
      setPhonePending(false);
    }
  }

  // Resend password reset link
  async function handleResendPasswordReset() {
    if (!canResend || resetPending) return;
    setError(null);
    setResetPending(true);
    try {
      await sendPasswordResetLink(email.trim());
      setEmailNotice("New password reset link sent. Please check your inbox.");
      setResendTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend password reset link.");
    } finally {
      setResetPending(false);
    }
  }

  // Form submit dispatcher
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!configured) {
      setError(
        "Supabase is not connected. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local",
      );
      return;
    }

    // ── Forgot Password ──
    if (mode === "forgot_password") {
      const cleanEmail = email.trim().toLowerCase();
      const domainCheck = validateEmailDomain(cleanEmail);
      if (!domainCheck.valid) {
        return setError(domainCheck.error || "Please enter a valid email address.");
      }
      setResetPending(true);
      try {
        await sendPasswordResetLink(cleanEmail);
        setResetSent(true);
        setEmailNotice(`Password reset link sent to ${cleanEmail}. Check your inbox.`);
        setResendTimer(30);
        setCanResend(false);
      } catch (nextError) {
        setError(getFirebaseErrorMessage(nextError));
      } finally {
        setResetPending(false);
      }
      return;
    }

    // ── Sign In ──
    if (mode === "signin") {
      setAuthPending(true);
      try {
        await verifyAuthGuard({ action: "signin", email: email.trim(), turnstileToken });
        await signInToBolo(email.trim(), password);
        // SessionGate will redirect once onAuthStateChange fires
      } catch (nextError) {
        setError(getFirebaseErrorMessage(nextError));
        turnstileRef.current?.reset();
      } finally {
        setAuthPending(false);
      }
      return;
    }

    // ── Sign Up: Step 1 (Credentials → account creation) ──
    if (mode === "signup" && signupStep === "credentials") {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Email domain validation
      const domainCheck = validateEmailDomain(cleanEmail);
      if (!domainCheck.valid) {
        setEmailFieldError(
          domainCheck.error ||
            "Please use a trusted email provider (Gmail, Outlook, Yahoo, iCloud, Proton, etc.).",
        );
        return;
      }
      setEmailFieldError(null);

      // 2. Password strength
      const pwdValidation = validateStrongPassword(password);
      if (!pwdValidation.valid) {
        return setError(`Strong password required: ${pwdValidation.errors.join(", ")}.`);
      }

      // 3. Password match
      if (password !== confirmPassword) {
        return setError("Passwords do not match.");
      }

      setAuthPending(true);
      try {
        await verifyAuthGuard({ action: "signup", email: cleanEmail, turnstileToken });
        const createdUser = await signUpWithCredentials(cleanEmail, password);
        setCreatedUid(createdUser.uid);

        // Pre-fill suggestion from email prefix
        if (!displayName) {
          const suggestedName = cleanEmail.split("@")[0]?.replace(/[._]/g, " ") || "";
          if (suggestedName) {
            setDisplayName(suggestedName.charAt(0).toUpperCase() + suggestedName.slice(1));
          }
        }
        setSignupStep("profile");
        turnstileRef.current?.reset();
      } catch (nextError) {
        const errStr = (
          nextError instanceof Error ? nextError.message : String(nextError)
        ).toLowerCase();
        if (
          errStr.includes("already registered") ||
          errStr.includes("already been registered") ||
          errStr.includes("email-already-in-use")
        ) {
          setEmailFieldError("This email is already registered. Please sign in instead.");
        } else {
          setError(getFirebaseErrorMessage(nextError));
        }
        turnstileRef.current?.reset();
      } finally {
        setAuthPending(false);
      }
      return;
    }

    // ── Sign Up: Step 2 (Profile → upsert to profiles table → redirect) ──
    if (mode === "signup" && signupStep === "profile") {
      const cleanName = displayName.trim();
      if (!cleanName || cleanName.length < 2) {
        return setError("Please enter your full name (minimum 2 characters).");
      }

      const cleanPhone = phone.trim();
      if (cleanPhone) {
        const isValidPhone = validateIndianPhone(cleanPhone);
        if (!isValidPhone) {
          setPhoneError("Please enter a valid 10-digit Indian mobile number.");
          return;
        }
      }
      setPhoneError(null);

      // BUG 1 fix: use createdUid (returned from signUpWithCredentials)
      // Supabase also sets the session immediately, so user.uid is also valid
      const targetUid = createdUid;
      if (!targetUid) {
        setError("Session expired. Please sign in.");
        setSignupStep("credentials");
        return;
      }

      setAuthPending(true);
      try {
        const savedProfile = await saveCitizenProfile({
          uid: targetUid,
          displayName: cleanName,
          legalName: cleanName,
          ...(cleanPhone ? { phone: cleanPhone } : {}),
          email: email.trim().toLowerCase(),
          turnstileToken,
        });

        // ✅ Update context immediately so SessionGate sees hasProfile=true
        // This prevents the white screen after navigation
        setProfile(savedProfile);

        void navigate({ to: "/", replace: true });
      } catch (nextError) {
        setError(getFirebaseErrorMessage(nextError));
        turnstileRef.current?.reset();
      } finally {
        setAuthPending(false);
      }
      return;
    }
  }

  const pwdValidation = validateStrongPassword(password);

  // Show a simple loading indicator while OAuth is being exchanged
  if (oauthExchanging) {
    return (
      <div className="grid h-dvh place-items-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <img src="/logo.png" alt="Bolo" className="size-12 animate-pulse" />
          <p className="text-sm font-semibold text-muted-foreground">Completing sign-in…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="grid h-dvh max-h-dvh overflow-hidden bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(440px,.95fr)]">
      {/* Left hero banner */}
      <section className="relative hidden h-dvh overflow-hidden lg:block">
        <img
          src={civicIllustration}
          alt="Indian neighbours caring for their community"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-primary-foreground xl:p-12">
          <div className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <img
              src="/logo.png"
              alt="Bolo logo"
              className="size-10 object-cover"
              aria-hidden="true"
            />
          </div>
          <p className="font-display text-4xl leading-[.96] font-bold tracking-tight">
            Your city hears you when you Bolo.
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/85">
            One clear report can make a neighbourhood safer, cleaner and easier to live in.
          </p>
        </div>
      </section>

      {/* Right form container */}
      <section className="flex h-dvh flex-col justify-between overflow-y-auto px-4 py-4 sm:px-8">
        <div className="mx-auto flex h-full w-full max-w-md flex-col justify-between py-2">
          <div>
            <div className="mb-3 flex items-center gap-3 lg:hidden">
              <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <img
                  src="/logo.png"
                  alt="Bolo logo"
                  className="size-10 object-cover"
                  aria-hidden="true"
                />
              </span>
              <span className="font-display text-2xl font-bold">Bolo</span>
            </div>

            <p className="text-xs font-bold tracking-wider text-primary uppercase">Civic connect</p>

            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-foreground">
              {mode === "forgot_password"
                ? "Reset your password."
                : mode === "phone"
                  ? "Sign in with Phone."
                  : mode === "signup"
                    ? signupStep === "profile"
                      ? "Complete your Profile."
                      : "Join the change."
                    : "Welcome back."}
            </h1>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {mode === "forgot_password"
                ? "Enter your registered email and we'll send you a password reset link."
                : mode === "phone"
                  ? "Enter your 10-digit mobile number to verify via secure SMS OTP."
                  : mode === "signup"
                    ? signupStep === "profile"
                      ? "Enter your name and phone number to finish setting up your citizen profile."
                      : "Create your account with your genuine email (Gmail, Outlook, Yahoo, etc.)."
                    : "Sign in to report issues and track resolutions in your area."}
            </p>

            {/* Mode Selector Tabs (only in credentials step) */}
            {mode !== "forgot_password" && signupStep === "credentials" && (
              <div
                className="mt-3 grid grid-cols-3 rounded-2xl bg-secondary p-1"
                role="tablist"
                aria-label="Authentication mode"
              >
                <button
                  type="button"
                  role="tab"
                  disabled={isAnyPending}
                  aria-selected={mode === "signup"}
                  onClick={() => resetAllStates("signup")}
                  className={`min-h-9 rounded-xl text-xs font-bold transition-all disabled:pointer-events-none disabled:opacity-60 ${
                    mode === "signup"
                      ? "bg-card text-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign up
                </button>
                <button
                  type="button"
                  role="tab"
                  disabled={isAnyPending}
                  aria-selected={mode === "signin"}
                  onClick={() => resetAllStates("signin")}
                  className={`min-h-9 rounded-xl text-xs font-bold transition-all disabled:pointer-events-none disabled:opacity-60 ${
                    mode === "signin"
                      ? "bg-card text-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  role="tab"
                  disabled={isAnyPending}
                  aria-selected={mode === "phone"}
                  onClick={() => resetAllStates("phone")}
                  className={`min-h-9 rounded-xl text-xs font-bold transition-all disabled:pointer-events-none disabled:opacity-60 ${
                    mode === "phone"
                      ? "bg-card text-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Phone OTP
                </button>
              </div>
            )}

            {/* Google & Apple OAuth (only in credentials step) */}
            {mode !== "forgot_password" && signupStep === "credentials" && (
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isAnyPending}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-2xl border border-input bg-card px-3 text-xs font-bold text-foreground shadow-soft transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {googlePending ? (
                      <BSpinnerToCheck size={18} color="#059669" bg="#ffffff" />
                    ) : (
                      <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    )}
                    <span className="truncate">{googlePending ? "Connecting…" : "Google"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAppleAuth}
                    disabled={isAnyPending}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-2xl border border-input bg-card px-3 text-xs font-bold text-foreground shadow-soft transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {applePending ? (
                      <BSpinnerToCheck size={18} color="#059669" bg="#ffffff" />
                    ) : (
                      <svg className="size-4 shrink-0 fill-current" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.96 2.77 1 .08 2.05-.52 2.68-1.27z" />
                      </svg>
                    )}
                    <span className="truncate">{applePending ? "Connecting…" : "Apple"}</span>
                  </button>
                </div>

                <div className="relative my-3 flex items-center justify-center">
                  <div className="w-full border-t border-border" />
                  <span className="absolute bg-background px-2 text-[10px] font-semibold uppercase text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>
            )}

            {/* ── Forgot Password Flow ── */}
            {mode === "forgot_password" ? (
              <div className="space-y-3 pt-1">
                {resetSent ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 text-center">
                      <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <KeyRound className="size-7 stroke-[2.2]" />
                      </div>
                      <h2 className="text-base font-bold text-foreground">
                        Password Reset Link Sent
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        We sent a secure password reset link to:
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-bold text-primary shadow-xs">
                        <Mail className="size-3.5" /> {email}
                      </div>
                      <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
                        Please open your email inbox and click the reset link to choose a new
                        password.
                      </p>
                    </div>

                    {emailNotice && (
                      <p className="rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
                        {emailNotice}
                      </p>
                    )}

                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={handleResendPasswordReset}
                        disabled={resetPending || !canResend}
                        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-input bg-card px-4 text-xs font-bold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <RotateCw className="size-3.5" />
                        {canResend ? "Resend Reset Link" : `Resend Link in ${resendTimer}s`}
                      </button>

                      <button
                        type="button"
                        onClick={() => resetAllStates("signin")}
                        className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-3" noValidate>
                    <Field
                      label="Your registered email address"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      disabled={resetPending}
                      value={email}
                      onChange={setEmail}
                      placeholder="you@gmail.com"
                      icon={<Mail className="size-4 text-muted-foreground" />}
                      required
                    />

                    {error && (
                      <p
                        role="alert"
                        className="rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
                      >
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={resetPending || !email}
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {resetPending ? (
                        <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" />
                      ) : null}
                      {resetPending ? "Sending Link…" : "Send Password Reset Link"}
                    </button>

                    <button
                      type="button"
                      onClick={() => resetAllStates("signin")}
                      className="inline-flex min-h-9 w-full items-center justify-center text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Back to Sign In
                    </button>
                  </form>
                )}
              </div>
            ) : mode === "phone" ? (
              <div className="space-y-3 pt-1">
                {!phoneOtpSent ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleSendPhoneOtp();
                    }}
                    className="space-y-3"
                    noValidate
                  >
                    <Field
                      label="Mobile Number (India +91)"
                      type="tel"
                      autoComplete="tel"
                      autoFocus
                      disabled={phonePending}
                      value={phoneAuthNumber}
                      onChange={(val) => {
                        setPhoneAuthNumber(val);
                        if (phoneError) setPhoneError(null);
                      }}
                      placeholder="9876543210"
                      icon={<Phone className="size-4 text-muted-foreground" />}
                      error={phoneError}
                      required
                    />

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
                      action="phone-otp-send"
                    />

                    <button
                      type="submit"
                      disabled={phonePending || !phoneAuthNumber.trim()}
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {phonePending ? (
                        <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" />
                      ) : null}
                      {phonePending ? "Sending OTP…" : "Send Verification OTP"}
                      {!phonePending && <ArrowRight className="size-4" />}
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleVerifyPhoneOtp();
                    }}
                    className="space-y-3"
                    noValidate
                  >
                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3.5 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <KeyRound className="size-3.5 text-primary" /> Enter 6-digit OTP
                        </span>
                        <button
                          type="button"
                          disabled={phonePending}
                          onClick={() => {
                            setPhoneOtpSent(false);
                            setPhoneOtpCode("");
                            setError(null);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline disabled:opacity-50"
                        >
                          Change number
                        </button>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        We sent an SMS OTP to{" "}
                        <span className="font-semibold text-foreground">{phoneAuthNumber}</span>.
                      </p>

                      <div
                        className={`flex rounded-2xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring ${
                          phonePending ? "opacity-60 cursor-not-allowed bg-muted/30" : ""
                        }`}
                      >
                        <span className="flex items-center border-r border-input px-3 text-muted-foreground">
                          <KeyRound className="size-4 text-primary" />
                        </span>
                        <input
                          id="phone-otp-input"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          autoFocus
                          disabled={phonePending}
                          value={phoneOtpCode}
                          onChange={(e) =>
                            setPhoneOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                          }
                          placeholder="••••••"
                          className="h-11 min-w-0 flex-1 rounded-r-2xl bg-transparent px-3 font-mono text-lg tracking-widest outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
                        <span>Didn't receive code?</span>
                        {canResendPhone ? (
                          <button
                            type="button"
                            onClick={handleSendPhoneOtp}
                            disabled={phonePending}
                            className="inline-flex items-center gap-1 font-bold text-primary hover:underline disabled:opacity-50"
                          >
                            <RotateCw className="size-3" /> Resend OTP
                          </button>
                        ) : (
                          <span>Resend in {phoneTimer}s</span>
                        )}
                      </div>
                    </div>

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
                      action="phone-otp-verify"
                    />

                    <button
                      type="submit"
                      disabled={phonePending || phoneOtpCode.trim().length < 6}
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {phonePending ? (
                        <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" />
                      ) : null}
                      {phonePending ? "Verifying OTP…" : "Verify & Continue"}
                      {!phonePending && <ArrowRight className="size-4" />}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* ── Main Sign Up / Sign In Forms ── */
              <form onSubmit={submit} className="space-y-3 pt-1" noValidate>
                {/* ── Sign Up: Step 1 (Email, Password, Confirm) ── */}
                {mode === "signup" && signupStep === "credentials" && (
                  <>
                    {/* Email with inline domain validation */}
                    <div>
                      <label
                        htmlFor="signup-email"
                        className="mb-1 block text-xs font-bold text-foreground"
                      >
                        Email address (Google, Outlook, Yahoo, etc.)
                      </label>
                      <div
                        className={`flex items-center rounded-2xl border bg-card focus-within:ring-2 focus-within:ring-ring ${
                          emailFieldError
                            ? "border-destructive focus-within:ring-destructive"
                            : "border-input"
                        }`}
                      >
                        <span className="flex items-center pl-3">
                          <Mail
                            className={`size-4 ${emailFieldError ? "text-destructive" : "text-muted-foreground"}`}
                          />
                        </span>
                        <input
                          id="signup-email"
                          type="email"
                          autoComplete="email"
                          disabled={authPending}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailFieldError) setEmailFieldError(null);
                          }}
                          onBlur={() => {
                            const clean = email.trim().toLowerCase();
                            if (clean) {
                              const check = validateEmailDomain(clean);
                              setEmailFieldError(check.valid ? null : (check.error ?? null));
                            }
                          }}
                          placeholder="you@gmail.com"
                          className="h-10 w-full rounded-2xl bg-transparent px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground disabled:cursor-not-allowed"
                          required
                        />
                      </div>
                      {emailFieldError ? (
                        <p role="alert" className="mt-1 text-[11px] font-medium text-destructive">
                          {emailFieldError}
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] text-muted-foreground flex items-center gap-1">
                          <ShieldCheck className="size-3 text-primary" /> Supported: Gmail, Outlook,
                          Yahoo, iCloud, Proton, etc.
                        </p>
                      )}
                    </div>

                    {/* Password with strength indicators */}
                    <div>
                      <Field
                        label="Create password"
                        type="password"
                        autoComplete="new-password"
                        disabled={authPending}
                        value={password}
                        onChange={setPassword}
                        placeholder="8+ characters (Aa, 1, #)"
                        icon={<Lock className="size-4 text-muted-foreground" />}
                        required
                      />
                      <div className="mt-1.5 grid grid-cols-2 gap-1 sm:grid-cols-3">
                        <RequirementItem met={pwdValidation.hasMinLength} label="8+ characters" />
                        <RequirementItem met={pwdValidation.hasUpper} label="Uppercase (A-Z)" />
                        <RequirementItem met={pwdValidation.hasLower} label="Lowercase (a-z)" />
                        <RequirementItem met={pwdValidation.hasNumber} label="Number (0-9)" />
                        <RequirementItem met={pwdValidation.hasSpecial} label="Special symbol" />
                      </div>
                    </div>

                    <Field
                      label="Confirm password"
                      type="password"
                      autoComplete="new-password"
                      disabled={authPending}
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      placeholder="Repeat your password"
                      icon={<Lock className="size-4 text-muted-foreground" />}
                      required
                    />
                  </>
                )}

                {/* ── Sign Up: Step 2 (Create Profile Form) ── */}
                {mode === "signup" && signupStep === "profile" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary">
                          <CheckCircle2 className="size-4" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground">
                            Account Created for
                          </p>
                          <p className="text-xs font-bold text-foreground">{email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSignupStep("credentials");
                          setCreatedUid("");
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft className="size-3" /> Back
                      </button>
                    </div>

                    <Field
                      label="Full / Display Name"
                      type="text"
                      autoComplete="name"
                      autoFocus
                      disabled={authPending}
                      value={displayName}
                      onChange={setDisplayName}
                      placeholder="e.g. Aarav Mehta"
                      icon={<UserIcon className="size-4 text-muted-foreground" />}
                      required
                    />

                    <div>
                      <Field
                        label="Mobile Number (Optional)"
                        type="tel"
                        autoComplete="tel"
                        disabled={authPending}
                        value={phone}
                        onChange={(val) => {
                          setPhone(val);
                          if (phoneError) setPhoneError(null);
                        }}
                        placeholder="e.g. 9876543210"
                        icon={<Phone className="size-4 text-muted-foreground" />}
                      />
                      {phoneError ? (
                        <p role="alert" className="mt-1 text-[11px] font-medium text-destructive">
                          {phoneError}
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Used for municipal status SMS updates.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Sign In Form ── */}
                {mode === "signin" && (
                  <>
                    <Field
                      label="Email address"
                      type="email"
                      autoComplete="email"
                      disabled={authPending}
                      value={email}
                      onChange={setEmail}
                      placeholder="you@gmail.com"
                      icon={<Mail className="size-4 text-muted-foreground" />}
                      required
                    />

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="signin-password"
                          className="text-xs font-bold text-foreground"
                        >
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setMode("forgot_password");
                            setError(null);
                            setEmailNotice(null);
                            setResetSent(false);
                          }}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div
                        className={`flex items-center rounded-2xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring ${authPending ? "opacity-60 cursor-not-allowed bg-muted/30" : ""}`}
                      >
                        <span className="flex items-center pl-3 text-muted-foreground">
                          <Lock className="size-4" />
                        </span>
                        <input
                          id="signin-password"
                          type="password"
                          autoComplete="current-password"
                          disabled={authPending}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Your password"
                          className="h-10 w-full rounded-2xl bg-transparent px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground disabled:cursor-not-allowed"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Error Box */}
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
                  action={mode}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    isAnyPending ||
                    (mode === "signup" &&
                      signupStep === "credentials" &&
                      (!email || !password || password !== confirmPassword || !!emailFieldError)) ||
                    (mode === "signup" && signupStep === "profile" && !displayName.trim()) ||
                    (mode === "signin" && (!email || !password))
                  }
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {authPending ? <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" /> : null}
                  {mode === "signup"
                    ? signupStep === "credentials"
                      ? authPending
                        ? "Validating & Creating Account…"
                        : "Create Account"
                      : authPending
                        ? "Saving Profile…"
                        : "Save Profile & Enter Bolo"
                    : authPending
                      ? "Signing in…"
                      : "Sign in to Bolo"}
                  {!authPending && <ArrowRight className="size-4" />}
                </button>
              </form>
            )}
          </div>

          {/* Footer badge */}
          <div className="pt-2">
            <div className="flex items-start gap-2.5 rounded-2xl bg-secondary/70 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-card text-primary">
                <MapPin className="size-3.5" />
              </span>
              <p>
                Your Bolo ID is a secure unique account ID. Your personal phone and email are never
                displayed on public complaint cards.
              </p>
            </div>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <Sparkles className="size-3 text-primary" /> Speak up. See change.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Shared UI sub-components (unchanged styling) ──────────────────────────────

function Field({
  label,
  value,
  onChange,
  icon,
  error,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  error?: string | null | undefined;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-bold text-foreground">
        {label}
      </label>
      <div
        className={`flex items-center rounded-2xl border ${
          error ? "border-destructive focus-within:ring-destructive" : "border-input"
        } bg-card focus-within:ring-2 focus-within:ring-ring ${props.disabled ? "opacity-60 cursor-not-allowed bg-muted/30" : ""}`}
      >
        {icon && <span className="flex items-center pl-3 text-muted-foreground">{icon}</span>}
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-2xl bg-transparent px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground disabled:cursor-not-allowed"
          {...props}
        />
      </div>
      {error && (
        <p role="alert" className="mt-1 text-[11px] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-1 text-[10px] transition-colors ${met ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground/80"}`}
    >
      {met ? (
        <Check className="size-3 shrink-0 stroke-[3]" />
      ) : (
        <span className="inline-block size-1.5 rounded-full bg-muted-foreground/40 ml-1 mr-0.5" />
      )}
      <span>{label}</span>
    </div>
  );
}
