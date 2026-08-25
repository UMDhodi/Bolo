import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import {
  MapPin,
  Phone,
  Sparkles,
  Check,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  RotateCw,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import civicIllustration from "@/assets/bolo-auth-civic-india.png";
import { useAuth } from "@/components/auth-context";
import BSpinnerToCheck from "@/components/bspinnertocheck";
import {
  initiateSignupAndSendVerification,
  saveCitizenProfile,
  getFirebaseErrorMessage,
  signInToBolo,
  signInWithGoogle,
  resendVerificationEmail,
  checkEmailVerified,
  sendPasswordResetLink,
  auth,
} from "@/lib/firebase";
import { validateIndianPhone } from "@/lib/msg91";
import { validateStrongPassword, validateEmailDomain } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Welcome to Bolo" }] }),
  component: AuthPage,
});

type Mode = "signup" | "signin" | "forgot_password";
type OnboardingStep = "credentials" | "awaiting_verification" | "profile";

function AuthPage() {
  const navigate = useNavigate();
  const { user, configured } = useAuth();

  const [mode, setMode] = useState<Mode>("signup");
  const [step, setStep] = useState<OnboardingStep>("credentials");

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Verification & Reset States
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Inline email field domain error (shown below the email input, not in the general error box)
  const [emailFieldError, setEmailFieldError] = useState<string | null>(null);

  // States
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Redirect if already authenticated, email is verified, and profile is complete
  useEffect(() => {
    if (
      user &&
      step === "credentials" &&
      mode === "signup" &&
      user.emailVerified &&
      user.displayName &&
      user.displayName !== "Bolo citizen"
    ) {
      void navigate({ to: "/" });
    }
    // For signin mode, user is explicitly navigated after signInToBolo succeeds
  }, [user, step, mode, navigate]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if ((step === "awaiting_verification" || resetSent) && resendTimer > 0) {
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
  }, [step, resetSent, resendTimer]);

  // Real-Time Email Verification Polling (automatically proceeds to profile setup upon link click)
  useEffect(() => {
    let checkInterval: NodeJS.Timeout | null = null;

    if (step === "awaiting_verification") {
      checkInterval = setInterval(async () => {
        try {
          if (auth.currentUser) {
            await auth.currentUser.reload();
            if (auth.currentUser.emailVerified) {
              setStep("profile");
            }
          }
        } catch {
          // ignore network hiccups
        }
      }, 2000);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [step]);

  const resetAllStates = (newMode: Mode) => {
    setMode(newMode);
    setStep("credentials");
    setError(null);
    setEmailNotice(null);
    setResetSent(false);
    setEmailFieldError(null);
  };

  // Google OAuth Handler
  async function handleGoogleAuth() {
    setError(null);
    setPending(true);
    try {
      await signInWithGoogle();
      await navigate({ to: "/" });
    } catch (err) {
      const errStr = (err instanceof Error ? err.message : String(err)).toLowerCase();
      if (errStr.includes("quota-exceeded") || errStr.includes("quota") || errStr.includes("limit")) {
        void navigate({ to: "/waitlist" });
        return;
      }
      setError(getFirebaseErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  // Resend Verification Email Link
  async function handleResendVerificationLink() {
    if (!canResend || pending) return;
    setError(null);
    setPending(true);
    try {
      await resendVerificationEmail();
      setEmailNotice("New verification link sent! Please check your inbox or spam folder.");
      setResendTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend verification email.");
    } finally {
      setPending(false);
    }
  }

  // Resend Password Reset Link
  async function handleResendPasswordReset() {
    if (!canResend || pending) return;
    setError(null);
    setPending(true);
    try {
      await sendPasswordResetLink(email.trim());
      setEmailNotice("New password reset link sent. Please check your inbox.");
      setResendTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend password reset link.");
    } finally {
      setPending(false);
    }
  }

  // Manual Check if user clicked email verification link
  async function handleManualCheckVerification() {
    setError(null);
    setPending(true);
    try {
      if (!auth.currentUser) {
        setError("No active session found. Please go back and sign up again.");
        return;
      }
      await auth.currentUser.reload();
      const isVerified = auth.currentUser.emailVerified;
      if (isVerified) {
        setStep("profile");
      } else {
        setEmailNotice("Your email has not been verified yet. Please open the link in your inbox (check spam too), then click here again.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.replace("Firebase: ", "")
          : "Failed to check verification status. Please try again."
      );
    } finally {
      setPending(false);
    }
  }

  // Form Submit Dispatcher
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!configured) {
      setError("Firebase is not connected yet. Check your database environment variables.");
      return;
    }

    // --- Forgot Password Flow ---
    if (mode === "forgot_password") {
      const cleanEmail = email.trim().toLowerCase();
      const domainCheck = validateEmailDomain(cleanEmail);
      if (!domainCheck.valid) {
        return setError(domainCheck.error || "Please enter a valid email address.");
      }
      setPending(true);
      try {
        await sendPasswordResetLink(cleanEmail);
        setResetSent(true);
        setEmailNotice(`Password reset link sent to ${cleanEmail}. Check your inbox.`);
        setResendTimer(30);
        setCanResend(false);
      } catch (nextError) {
        setError(getFirebaseErrorMessage(nextError));
      } finally {
        setPending(false);
      }
      return;
    }

    // --- Sign In Flow ---
    if (mode === "signin") {
      setPending(true);
      try {
        await signInToBolo(email.trim(), password);
        await navigate({ to: "/" });
      } catch (nextError) {
        const errStr = (nextError instanceof Error ? nextError.message : String(nextError)).toLowerCase();
        if (errStr.includes("quota-exceeded") || errStr.includes("quota")) {
          void navigate({ to: "/waitlist" });
          return;
        }
        setError(getFirebaseErrorMessage(nextError));
      } finally {
        setPending(false);
      }
      return;
    }

    // --- Sign Up Step 1: Validate Domain & Password -> Dispatch Verification Link ---
    if (mode === "signup" && step === "credentials") {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Strict email domain validation (Google, Outlook, Yahoo, etc. & block fake domains)
      const domainCheck = validateEmailDomain(cleanEmail);
      if (!domainCheck.valid) {
        setEmailFieldError(domainCheck.error || "Please use a valid email provider (Gmail, Outlook, Yahoo, iCloud, etc.).");
        return;
      }
      setEmailFieldError(null);

      // 2. Strong password validation
      const pwdValidation = validateStrongPassword(password);
      if (!pwdValidation.valid) {
        return setError(`Strong password required: ${pwdValidation.errors.join(", ")}.`);
      }

      // 3. Password confirmation match
      if (password !== confirmPassword) {
        return setError("Passwords do not match.");
      }

      setPending(true);
      try {
        await initiateSignupAndSendVerification(cleanEmail, password);
        setStep("awaiting_verification");
        setResendTimer(30);
        setCanResend(false);
      } catch (nextError) {
        setError(getFirebaseErrorMessage(nextError));
      } finally {
        setPending(false);
      }
      return;
    }

    // --- Sign Up Step 2: Save Profile to Realtime Database & Auth ---
    if (mode === "signup" && step === "profile") {
      if (name.trim().length < 2) {
        return setError("Please enter your full name.");
      }
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone && !validateIndianPhone(cleanPhone)) {
        return setError("Please enter a valid 10-digit Indian mobile number.");
      }

      setPending(true);
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          throw new Error("No active session found. Please sign in.");
        }

        const formattedPhone = cleanPhone ? `+91${cleanPhone}` : "";
        
        // Save to Realtime Database and update Auth profile
        await saveCitizenProfile({
          uid,
          displayName: name.trim(),
          legalName: name.trim(),
          phone: formattedPhone,
          email: email.trim() || auth.currentUser?.email || "",
        });

        await navigate({ to: "/" });
      } catch (nextError) {
        setError(getFirebaseErrorMessage(nextError));
      } finally {
        setPending(false);
      }
      return;
    }
  }

  const pwdValidation = validateStrongPassword(password);

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
            <img src="/logo.png" alt="Bolo logo" className="size-10 object-cover" aria-hidden="true" />
          </div>
          <p className="font-display text-4xl leading-[.96] font-bold tracking-tight">Your city hears you when you Bolo.</p>
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
                <img src="/logo.png" alt="Bolo logo" className="size-10 object-cover" aria-hidden="true" />
              </span>
              <span className="font-display text-2xl font-bold">Bolo</span>
            </div>

            <p className="text-xs font-bold tracking-wider text-primary uppercase">Civic connect</p>

            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-foreground">
              {mode === "forgot_password"
                ? "Reset your password."
                : step === "awaiting_verification"
                  ? "Verify your email."
                  : step === "profile"
                    ? "Complete your profile."
                    : mode === "signup"
                      ? "Join the change."
                      : "Welcome back."}
            </h1>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {mode === "forgot_password"
                ? "Enter your registered email and we'll send you a password reset link."
                : step === "awaiting_verification"
                  ? "We dispatched a verification link to your registered email."
                  : step === "profile"
                    ? "Set up your civic identity. Your details are saved securely in your profile."
                    : mode === "signup"
                      ? "Create your account with your genuine email (Gmail, Outlook, Yahoo, etc.)."
                      : "Sign in to report issues and track resolutions in your area."}
            </p>

            {/* Mode Selector Tabs (only shown on step 1 and when not in forgot password) */}
            {step === "credentials" && mode !== "forgot_password" && (
              <div className="mt-3 grid grid-cols-2 rounded-2xl bg-secondary p-1" role="tablist" aria-label="Authentication mode">
                <button
                  type="button"
                  role="tab"
                  disabled={pending}
                  aria-selected={mode === "signup"}
                  onClick={() => resetAllStates("signup")}
                  className={`min-h-9 rounded-xl text-xs font-bold transition-all disabled:pointer-events-none disabled:opacity-60 ${
                    mode === "signup" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign up
                </button>
                <button
                  type="button"
                  role="tab"
                  disabled={pending}
                  aria-selected={mode === "signin"}
                  onClick={() => resetAllStates("signin")}
                  className={`min-h-9 rounded-xl text-xs font-bold transition-all disabled:pointer-events-none disabled:opacity-60 ${
                    mode === "signin" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign in
                </button>
              </div>
            )}

            {/* Google OAuth (only on initial credentials step, not forgot password) */}
            {step === "credentials" && mode !== "forgot_password" && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={pending}
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2.5 rounded-2xl border border-input bg-card px-4 text-xs font-bold text-foreground shadow-soft transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg className="size-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="relative my-3 flex items-center justify-center">
                  <div className="w-full border-t border-border" />
                  <span className="absolute bg-background px-2 text-[10px] font-semibold uppercase text-muted-foreground">Or</span>
                </div>
              </div>
            )}

            {/* ========================================================
             * FLOW 2: REAL-TIME VERIFICATION LOADING SCREEN
             * ======================================================== */}
            {step === "awaiting_verification" ? (
              <div className="space-y-4 pt-2 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="rounded-3xl border border-primary/25 bg-primary/5 p-6 flex flex-col items-center">
                  {/* User's Custom Animated Loading Spinner */}
                  <div className="mb-4 flex items-center justify-center p-3.5 rounded-full bg-card shadow-soft border border-primary/20">
                    <BSpinnerToCheck size={64} color="#059669" bg="#ffffff" />
                  </div>

                  <h2 className="font-display text-xl font-bold text-foreground">
                    Go check your mailbox & verify the link
                  </h2>

                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-sm">
                    We sent a verification link to:
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-card px-3.5 py-1 text-xs font-bold text-primary shadow-xs">
                    <Mail className="size-3.5" /> {email}
                  </div>

                  <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-full px-3 py-1">
                    <span className="relative flex size-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
                    </span>
                    Listening for email verification in real-time...
                  </div>
                </div>

                {emailNotice && (
                  <p className="rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
                    {emailNotice}
                  </p>
                )}

                {error && (
                  <p role="alert" className="rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                    {error}
                  </p>
                )}

                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleManualCheckVerification}
                    disabled={pending}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {pending ? <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" /> : null}
                    {pending ? "Checking link status..." : "I've Clicked the Verification Link"}
                    {!pending && <ArrowRight className="size-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendVerificationLink}
                    disabled={pending || !canResend}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-input bg-card px-4 text-xs font-bold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RotateCw className="size-3.5" />
                    {canResend ? "Resend Verification Link" : `Resend Link in ${resendTimer}s`}
                  </button>

                  <button
                    type="button"
                    onClick={() => resetAllStates("signin")}
                    className="inline-flex min-h-9 w-full items-center justify-center text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            ) : mode === "forgot_password" ? (
              /* ========================================================
               * FLOW 3: FORGOT PASSWORD RESET FLOW
               * ======================================================== */
              <div className="space-y-3 pt-1">
                {resetSent ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 text-center">
                      <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <KeyRound className="size-7 stroke-[2.2]" />
                      </div>
                      <h2 className="text-base font-bold text-foreground">Password Reset Link Sent</h2>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        We sent a secure password reset link to:
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-bold text-primary shadow-xs">
                        <Mail className="size-3.5" /> {email}
                      </div>
                      <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
                        Please open your email inbox and click the reset link to choose a new password.
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
                        disabled={pending || !canResend}
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
                      disabled={pending}
                      value={email}
                      onChange={setEmail}
                      placeholder="you@gmail.com"
                      icon={<Mail className="size-4 text-muted-foreground" />}
                      required
                    />

                    {error && (
                      <p role="alert" className="rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={pending || !email}
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {pending ? <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" /> : null}
                      {pending ? "Sending Link..." : "Send Password Reset Link"}
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
            ) : (
              /* Main Dynamic Forms */
              <form onSubmit={submit} className="space-y-3" noValidate>

                {/* ========================================================
                 * FLOW 1: EMAIL SIGNUP (STEP 1: CREDENTIALS)
                 * ======================================================== */}
                {mode === "signup" && step === "credentials" && (
                  <>
                    <div>
                      <div>
                        <label
                          htmlFor="email-address-(google,-outlook,-yahoo,-etc.)"
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
                          <span className="flex items-center pl-3 text-muted-foreground">
                            <Mail className={`size-4 ${emailFieldError ? "text-destructive" : "text-muted-foreground"}`} />
                          </span>
                          <input
                            id="email-address-(google,-outlook,-yahoo,-etc.)"
                            type="email"
                            autoComplete="email"
                            disabled={pending}
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              // Clear field error as user types
                              if (emailFieldError) setEmailFieldError(null);
                            }}
                            onBlur={() => {
                              const cleanEmail = email.trim().toLowerCase();
                              if (cleanEmail) {
                                const check = validateEmailDomain(cleanEmail);
                                setEmailFieldError(check.valid ? null : (check.error ?? null));
                              }
                            }}
                            placeholder="you@gmail.com"
                            className="h-10 w-full rounded-2xl bg-transparent px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground disabled:cursor-not-allowed"
                            required
                          />
                        </div>
                        {emailFieldError && (
                          <p role="alert" className="mt-1 text-[11px] font-medium text-destructive">
                            {emailFieldError}
                          </p>
                        )}
                        {!emailFieldError && (
                          <p className="mt-1 text-[10px] text-muted-foreground flex items-center gap-1">
                            <ShieldCheck className="size-3 text-primary" /> Supported: Gmail, Outlook, Yahoo, iCloud, Proton, etc.
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Field
                        label="Create password"
                        type="password"
                        autoComplete="new-password"
                        disabled={pending}
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
                      disabled={pending}
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      placeholder="Repeat your password"
                      icon={<Lock className="size-4 text-muted-foreground" />}
                      required
                    />
                  </>
                )}

                {/* ========================================================
                 * FLOW 4: SIGN IN FLOW
                 * ======================================================== */}
                {mode === "signin" && (
                  <>
                    <Field
                      label="Email address"
                      type="email"
                      autoComplete="email"
                      disabled={pending}
                      value={email}
                      onChange={setEmail}
                      placeholder="you@gmail.com"
                      icon={<Mail className="size-4 text-muted-foreground" />}
                      required
                    />

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label htmlFor="password" className="text-xs font-bold text-foreground">
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
                      <div className={`flex items-center rounded-2xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring ${pending ? "opacity-60 cursor-not-allowed bg-muted/30" : ""}`}>
                        <span className="flex items-center pl-3 text-muted-foreground">
                          <Lock className="size-4 text-muted-foreground" />
                        </span>
                        <input
                          id="password"
                          type="password"
                          autoComplete="current-password"
                          disabled={pending}
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

                {/* ========================================================
                 * STEP 3: CREATE CITIZEN PROFILE (AFTER EMAIL IS VERIFIED)
                 * ======================================================== */}
                {step === "profile" && (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs leading-relaxed text-foreground">
                      <p className="font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-4" />
                        Email Verified Successfully!
                      </p>
                      <p className="mt-0.5 text-muted-foreground">
                        Enter your legal name and mobile number to complete and activate your civic profile.
                      </p>
                    </div>

                    {/* 1. Name Input */}
                    <Field
                      label="Your Full Name"
                      type="text"
                      autoComplete="name"
                      autoFocus
                      disabled={pending}
                      value={name}
                      onChange={setName}
                      placeholder="e.g. Aditi Sharma"
                      icon={<UserIcon className="size-4 text-primary" />}
                      required
                    />

                    {/* 2. Optional Mobile Number */}
                    <div>
                      <label htmlFor="profile-phone" className="mb-1 block text-xs font-bold text-foreground">
                        Mobile Number (Optional)
                      </label>
                      <div className={`flex rounded-2xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring ${pending ? "opacity-60 cursor-not-allowed bg-muted/30" : ""}`}>
                        <span className="flex items-center gap-1 border-r border-input px-3 text-xs font-bold text-foreground">
                          <Phone className="size-3.5 text-primary" /> +91
                        </span>
                        <input
                          id="profile-phone"
                          type="tel"
                          inputMode="numeric"
                          disabled={pending}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="10-digit number"
                          className="h-10 min-w-0 flex-1 rounded-r-2xl bg-transparent px-3 text-sm outline-none disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* 3. Verified Email Preview */}
                    <div>
                      <label className="mb-1 block text-xs font-bold text-foreground">Verified Email</label>
                      <div className="flex items-center justify-between rounded-2xl border border-input bg-secondary/50 px-3 py-2 text-sm">
                        <span className="font-semibold text-foreground flex items-center gap-2">
                          <Mail className="size-4 text-primary" /> {email || auth.currentUser?.email}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Check className="size-3" /> Verified
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Box */}
                {error && (
                  <p role="alert" className="rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                    {error}
                  </p>
                )}

                {/* Action Buttons */}
                {mode === "signup" && step === "credentials" ? (
                  <button
                    type="submit"
                    disabled={pending || !email || !password || password !== confirmPassword || !!emailFieldError}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {pending ? <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" /> : null}
                    {pending ? "Sending Verification Link..." : "Verify"}
                    {!pending && <ArrowRight className="size-4" />}
                  </button>
                ) : step === "profile" ? (
                  <button
                    type="submit"
                    disabled={pending || name.trim().length < 2}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {pending ? <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" /> : null}
                    {pending ? "Saving Profile..." : "Create Account"}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {pending ? <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" /> : null}
                    {pending ? "Signing in..." : "Sign in to Bolo"}
                  </button>
                )}
              </form>
            )}
          </div>

          {/* Footer badge */}
          <div className="pt-2">
            <div className="flex items-start gap-2.5 rounded-2xl bg-secondary/70 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-card text-primary">
                <MapPin className="size-3.5" />
              </span>
              <p>Your Bolo ID is a secure unique account ID. Your personal phone and email are never displayed on public complaint cards.</p>
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

function Field({
  label,
  value,
  onChange,
  icon,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-bold text-foreground">
        {label}
      </label>
      <div className={`flex items-center rounded-2xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring ${props.disabled ? "opacity-60 cursor-not-allowed bg-muted/30" : ""}`}>
        {icon && <span className="flex items-center pl-3 text-muted-foreground">{icon}</span>}
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-2xl bg-transparent px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground disabled:cursor-not-allowed"
          {...props}
        />
      </div>
    </div>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-1 text-[10px] transition-colors ${met ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground/80"
        }`}
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
