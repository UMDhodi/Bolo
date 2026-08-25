import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import {
  MapPin,
  Phone,
  Sparkles,
  KeyRound,
  Check,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  RotateCw,
  Edit3,
} from "lucide-react";

import civicIllustration from "@/assets/bolo-auth-civic-india.png";
import { useAuth } from "@/components/auth-context";
import BSpinnerToCheck from "@/components/bspinnertocheck";
import {
  createBoloAccount,
  getFirebaseErrorMessage,
  signInToBolo,
  signInWithGoogle,
} from "@/lib/firebase";
import { validateIndianPhone } from "@/lib/msg91";
import { validateStrongPassword } from "@/lib/utils";
import { sendEmailOtp, verifyEmailOtp, resendEmailOtp, isValidEmail } from "@/lib/email-otp";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Welcome to Bolo" }] }),
  component: AuthPage,
});

type Mode = "signup" | "signin";
type OnboardingStep = "credentials" | "profile";

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

  // Email OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  // States
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && step === "credentials") {
      void navigate({ to: "/" });
    }
  }, [user, step, navigate]);

  // Resend Countdown Timer for Email OTP
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpSent && resendTimer > 0) {
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
  }, [otpSent, resendTimer]);

  const resetAllStates = (newMode: Mode) => {
    setMode(newMode);
    setStep("credentials");
    setOtpSent(false);
    setOtpCode("");
    setOtpMessage(null);
    setError(null);
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

  // 1. Send Email Verification OTP
  async function handleSendEmailOtp() {
    setError(null);
    setOtpMessage(null);

    const cleanEmail = email.trim();
    if (!isValidEmail(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const pwdValidation = validateStrongPassword(password);
    if (!pwdValidation.valid) {
      setError(`Strong password required: ${pwdValidation.errors.join(", ")}.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    try {
      const res = await sendEmailOtp(cleanEmail);
      setOtpSent(true);
      setOtpMessage(res.message);
      setResendTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification code.");
    } finally {
      setPending(false);
    }
  }

  // 2. Resend Email OTP
  async function handleResendEmailOtp() {
    if (!canResend || pending) return;
    setError(null);
    setPending(true);
    try {
      const res = await resendEmailOtp(email.trim());
      setOtpMessage(res.message);
      setResendTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend verification code.");
    } finally {
      setPending(false);
    }
  }

  // 3. Verify Email OTP & Proceed to Profile Setup
  async function handleVerifyEmailOtp(event?: FormEvent) {
    if (event) event.preventDefault();
    setError(null);

    if (otpCode.trim().length < 4) {
      setError("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    setPending(true);
    try {
      await verifyEmailOtp(email.trim(), otpCode.trim());
      setStep("profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid verification code.");
    } finally {
      setPending(false);
    }
  }

  // 4. Form Submit Dispatcher
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!configured) {
      setError("Firebase is not connected yet. Check your database environment variables.");
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

    // --- Sign Up Step 1: Request Email OTP if not sent yet ---
    if (mode === "signup" && step === "credentials") {
      if (!otpSent) {
        await handleSendEmailOtp();
        return;
      } else {
        await handleVerifyEmailOtp();
        return;
      }
    }

    // --- Sign Up Step 2: Create Profile & Account ---
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
        const formattedPhone = cleanPhone ? `+91${cleanPhone}` : "";
        await createBoloAccount({
          displayName: name.trim(),
          phone: formattedPhone,
          email: email.trim(),
          password,
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
              {step === "profile"
                ? "Complete your profile."
                : mode === "signup"
                  ? otpSent ? "Verify your email." : "Join the change."
                  : "Welcome back."}
            </h1>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {step === "profile"
                ? "Set up your civic identity. Your contact details remain private and safe."
                : mode === "signup"
                  ? otpSent
                    ? `Enter the 6-digit verification code sent to ${email}.`
                    : "Create your Bolo account using email & password with OTP verification."
                  : "Sign in to report issues and track resolutions in your area."}
            </p>

            {/* Mode Selector Tabs (only shown on step 1) */}
            {step === "credentials" && (
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

            {/* Google OAuth (only on initial credentials step, hidden when OTP is active) */}
            {step === "credentials" && !otpSent && (
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

            {/* Main Dynamic Forms */}
            <form onSubmit={submit} className="space-y-3" noValidate>

              {/* ========================================================
               * FLOW 1: EMAIL SIGNUP (STEP 1: CREDENTIALS + INLINE OTP)
               * ======================================================== */}
              {mode === "signup" && step === "credentials" && (
                <>
                  <Field
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    disabled={pending || otpSent}
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    icon={<Mail className="size-4 text-muted-foreground" />}
                    required
                  />

                  <div>
                    <Field
                      label="Create password"
                      type="password"
                      autoComplete="new-password"
                      disabled={pending || otpSent}
                      value={password}
                      onChange={setPassword}
                      placeholder="8+ characters (Aa, 1, #)"
                      icon={<Lock className="size-4 text-muted-foreground" />}
                      required
                    />
                    {!otpSent && (
                      <div className="mt-1.5 grid grid-cols-2 gap-1 sm:grid-cols-3">
                        <RequirementItem met={pwdValidation.hasMinLength} label="8+ characters" />
                        <RequirementItem met={pwdValidation.hasUpper} label="Uppercase (A-Z)" />
                        <RequirementItem met={pwdValidation.hasLower} label="Lowercase (a-z)" />
                        <RequirementItem met={pwdValidation.hasNumber} label="Number (0-9)" />
                        <RequirementItem met={pwdValidation.hasSpecial} label="Special symbol" />
                      </div>
                    )}
                  </div>

                  <Field
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    disabled={pending || otpSent}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Repeat your password"
                    icon={<Lock className="size-4 text-muted-foreground" />}
                    required
                  />

                  {/* ── INLINE EMAIL OTP BOX (Appears below confirm password) ── */}
                  {otpSent && (
                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3.5 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Mail className="size-3.5 text-primary" /> Enter Verification Code
                        </span>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => {
                            setOtpSent(false);
                            setOtpCode("");
                            setError(null);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline disabled:opacity-50"
                        >
                          <Edit3 className="size-3" /> Edit Email
                        </button>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        We sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>.
                      </p>

                      <div className={`flex rounded-2xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring ${pending ? "opacity-60 cursor-not-allowed bg-muted/30" : ""}`}>
                        <span className="flex items-center border-r border-input px-3 text-muted-foreground">
                          <KeyRound className="size-4 text-primary" />
                        </span>
                        <input
                          id="email-otp-input"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          autoFocus
                          disabled={pending}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="••••••"
                          className="h-11 min-w-0 flex-1 rounded-r-2xl bg-transparent px-3 font-mono text-lg tracking-widest outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
                        <span>Didn't receive code?</span>
                        {canResend ? (
                          <button
                            type="button"
                            onClick={handleResendEmailOtp}
                            disabled={pending}
                            className="inline-flex items-center gap-1 font-bold text-primary hover:underline disabled:opacity-50"
                          >
                            <RotateCw className="size-3" /> Resend Code
                          </button>
                        ) : (
                          <span>Resend in {resendTimer}s</span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ========================================================
               * FLOW 2: SIGN IN FLOW
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
                    placeholder="you@example.com"
                    icon={<Mail className="size-4 text-muted-foreground" />}
                    required
                  />
                  <Field
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    disabled={pending}
                    value={password}
                    onChange={setPassword}
                    placeholder="Your password"
                    icon={<Lock className="size-4 text-muted-foreground" />}
                    required
                  />
                </>
              )}

              {/* ========================================================
               * STEP 2: CREATE NEW PROFILE (AFTER EMAIL VERIFIED)
               * ======================================================== */}
              {step === "profile" && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 text-xs leading-relaxed text-foreground">
                    <p className="font-bold flex items-center gap-1.5 text-primary">
                      <CheckCircle2 className="size-4" />
                      Email Verified Successfully
                    </p>
                    <p className="mt-0.5 text-muted-foreground">
                      Enter your name and mobile number to complete your civic profile.
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
                    <label className="mb-1 block text-xs font-bold text-foreground">Email Address</label>
                    <div className="flex items-center justify-between rounded-2xl border border-input bg-secondary/50 px-3 py-2 text-sm">
                      <span className="font-semibold text-foreground flex items-center gap-2">
                        <Mail className="size-4 text-primary" /> {email}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
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
              {mode === "signup" && step === "credentials" && !otpSent ? (
                <button
                  type="submit"
                  disabled={pending || !email || !password || password !== confirmPassword}
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {pending ? <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" /> : null}
                  {pending ? "Sending Code..." : "Send Verification Code"}
                  {!pending && <ArrowRight className="size-4" />}
                </button>
              ) : mode === "signup" && step === "credentials" && otpSent ? (
                <button
                  type="submit"
                  disabled={pending || otpCode.trim().length < 4}
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {pending ? <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" /> : null}
                  {pending ? "Verifying..." : "Verify OTP & Proceed to Profile"}
                  {!pending && <ArrowRight className="size-4" />}
                </button>
              ) : step === "profile" ? (
                <button
                  type="submit"
                  disabled={pending || name.trim().length < 2}
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {pending ? <BSpinnerToCheck size={22} color="#ffffff" bg="#059669" /> : null}
                  {pending ? "Saving Profile..." : "Complete Profile & Enter Bolo"}
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
