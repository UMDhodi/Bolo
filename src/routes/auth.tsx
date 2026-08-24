import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, MapPin, Megaphone, Phone, Sparkles, KeyRound, Check, XCircle } from "lucide-react";
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";

import civicIllustration from "@/assets/bolo-auth-civic-india.png";
import { useAuth } from "@/components/auth-context";
import SpinnerToCheck from "@/components/loader";
import {
  createBoloAccount,
  getFirebaseErrorMessage,
  signInToBolo,
  signInWithGoogle,
  createRecaptchaVerifier,
  sendPhoneOTP,
  verifyPhoneOTP,
} from "@/lib/firebase";
import { validateStrongPassword } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Welcome to Bolo" }] }),
  component: AuthPage,
});

type Mode = "signup" | "signin"; // Note: "phone" mode commented out until Firebase Blaze plan is activated

function AuthPage() {
  const navigate = useNavigate();
  const { user, configured } = useAuth();
  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* =========================================================================
   * PHONE OTP AUTHENTICATION (TEMPORARILY COMMENTED OUT)
   * To re-enable when upgraded to Firebase Blaze Plan:
   * 1. Add "phone" back to type Mode = "signup" | "signin" | "phone"
   * 2. Uncomment the phone state, handleSendOTP, handleVerifyOTP functions below
   * 3. Uncomment the Phone tab in the tablist (and change grid-cols-2 back to grid-cols-3)
   * 4. Uncomment the phone form UI branch in submit() and in JSX
   * =========================================================================
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [verifier, setVerifier] = useState<RecaptchaVerifier | null>(null);

  async function handleSendOTP() {
    setError(null);
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setPending(true);
    try {
      const appVerifier = verifier || createRecaptchaVerifier("recaptcha-container");
      if (!verifier) setVerifier(appVerifier);
      const formattedPhone = `+91${phone.replace(/\s/g, "")}`;
      const result = await sendPhoneOTP(formattedPhone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function handleVerifyOTP(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!confirmationResult) {
      setError("OTP request expired. Please send OTP again.");
      return;
    }
    if (otpCode.trim().length !== 6) {
      setError("Enter the 6-digit OTP sent to your phone.");
      return;
    }
    setPending(true);
    try {
      await verifyPhoneOTP(confirmationResult, otpCode.trim(), name.trim() || undefined);
      await navigate({ to: "/" });
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setPending(false);
    }
  }
  ========================================================================= */

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!configured) {
      setError("Firebase is not connected yet. Add the values from .env.example to .env.local first.");
      return;
    }

    /* --- Phone OTP Submit Handler (Uncomment when on Blaze plan) ---
    if ((mode as string) === "phone") {
      if (!otpSent) {
        await handleSendOTP();
      } else {
        await handleVerifyOTP(event);
      }
      return;
    }
    ----------------------------------------------------------------- */

    if (mode === "signup") {
      if (name.trim().length < 2) return setError("Enter your name.");
      const pwdValidation = validateStrongPassword(password);
      if (!pwdValidation.valid) {
        return setError(`Strong password required: ${pwdValidation.errors.join(", ")}.`);
      }
      if (password !== confirmPassword) return setError("Passwords do not match.");
    }

    setPending(true);
    try {
      if (mode === "signup") {
        await createBoloAccount({ displayName: name.trim(), phone: phone.trim(), email, password });
      } else {
        await signInToBolo(email, password);
      }
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
  }

  const pwdValidation = validateStrongPassword(password);

  return (
    <main className="grid h-dvh max-h-dvh overflow-hidden bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(440px,.95fr)]">
      <section className="relative hidden h-dvh overflow-hidden lg:block">
        <img src={civicIllustration} alt="Indian neighbours caring for their community" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-primary-foreground xl:p-12">
          <div className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"><img src="/logo.png" alt="Bolo logo" className="size-10 object-cover" aria-hidden="true" /></div>
          <p className="font-display text-4xl leading-[.96] font-bold tracking-tight">Your city hears you when you Bolo.</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/85">One clear report can make a neighbourhood safer, cleaner and easier to live in.</p>
        </div>
      </section>

      <section className="flex h-dvh flex-col justify-between overflow-hidden px-4 py-4 sm:px-8">
        <div className="mx-auto flex h-full w-full max-w-md flex-col justify-between py-2">
          <div>
            <div className="mb-3 flex items-center gap-3 lg:hidden"><span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground"><img src="/logo.png" alt="Bolo logo" className="size-10 object-cover" aria-hidden="true" /></span><span className="font-display text-2xl font-bold">Bolo</span></div>
            <p className="text-xs font-bold tracking-wider text-primary uppercase">Civic connect</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-foreground">{mode === "signup" ? "Join the change." : "Welcome back."}</h1>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{mode === "signup" ? "Create your Bolo account to report and follow issues in your area." : "Sign in to report issues and keep track of your community."}</p>

            <div className="mt-3 grid grid-cols-2 rounded-2xl bg-secondary p-1" role="tablist" aria-label="Authentication">
              <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => { setMode("signup"); setError(null); }} className={`min-h-9 rounded-xl text-xs font-bold transition-colors ${mode === "signup" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`}>Create account</button>
              <button type="button" role="tab" aria-selected={mode === "signin"} onClick={() => { setMode("signin"); setError(null); }} className={`min-h-9 rounded-xl text-xs font-bold transition-colors ${mode === "signin" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`}>Sign in</button>
              {/* Phone Tab (Uncomment when upgraded to Firebase Blaze plan):
              <button type="button" role="tab" aria-selected={(mode as string) === "phone"} onClick={() => { setMode("phone" as Mode); setError(null); setOtpSent(false); }} className={`min-h-9 rounded-xl text-xs font-bold transition-colors ${(mode as string) === "phone" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`}>Phone</button>
              */}
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={pending}
                className="inline-flex min-h-10 w-full items-center justify-center gap-2.5 rounded-2xl border border-input bg-card px-4 text-xs font-bold text-foreground shadow-soft transition-colors hover:bg-secondary disabled:opacity-70"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="relative my-3 flex items-center justify-center">
              <div className="w-full border-t border-border" />
              <span className="absolute bg-background px-2 text-[10px] font-semibold uppercase text-muted-foreground">Or</span>
            </div>

            <form onSubmit={submit} className="space-y-2.5" noValidate>
              {/* --- Phone OTP Form UI (Uncomment when on Blaze plan) ---
              {(mode as string) === "phone" ? (
                <>
                  {!otpSent ? (
                    <>
                      <Field label="Your Name (Optional)" type="text" autoComplete="name" value={name} onChange={setName} placeholder="e.g. Rahul Verma" />
                      <div>
                        <label htmlFor="phone-otp" className="mb-1 block text-xs font-bold text-foreground">Mobile number</label>
                        <div className="flex rounded-2xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring">
                          <span className="flex items-center gap-1.5 border-r border-input px-3 text-xs font-semibold text-muted-foreground"><Phone className="size-3.5" /> +91</span>
                          <input id="phone-otp" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit number" className="h-10 min-w-0 flex-1 rounded-r-2xl bg-transparent px-3 text-sm outline-none" required />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label htmlFor="otp-input" className="mb-1 block text-xs font-bold text-foreground">Enter 6-digit OTP</label>
                      <div className="flex rounded-2xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring">
                        <span className="flex items-center gap-1.5 border-r border-input px-3 text-xs font-semibold text-muted-foreground"><KeyRound className="size-3.5" /></span>
                        <input id="otp-input" inputMode="numeric" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit code" className="h-10 min-w-0 flex-1 rounded-r-2xl bg-transparent px-3 font-mono text-base tracking-wider outline-none" required />
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">OTP sent to +91 {phone}. <button type="button" onClick={() => setOtpSent(false)} className="font-bold text-primary hover:underline">Change number</button></p>
                    </div>
                  )}
                </>
              ) : null}
              --------------------------------------------------------- */}

              {mode === "signup" && (
                <Field label="Your name" type="text" autoComplete="name" value={name} onChange={setName} placeholder="e.g. Aditi Sharma" required />
              )}
              <Field label="Email address" type="email" autoComplete="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
              
              <div>
                <Field
                  label="Password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={setPassword}
                  placeholder={mode === "signup" ? "8+ characters (Aa, 1, #)" : "Your password"}
                  required
                />
                {mode === "signup" && (
                  <div className="mt-1.5 grid grid-cols-2 gap-1 sm:grid-cols-3">
                    <RequirementItem met={pwdValidation.hasMinLength} label="8+ characters" />
                    <RequirementItem met={pwdValidation.hasUpper} label="Uppercase (A-Z)" />
                    <RequirementItem met={pwdValidation.hasLower} label="Lowercase (a-z)" />
                    <RequirementItem met={pwdValidation.hasNumber} label="Number (0-9)" />
                    <RequirementItem met={pwdValidation.hasSpecial} label="Special symbol" />
                  </div>
                )}
              </div>

              {mode === "signup" && (
                <Field
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat your password"
                  required
                />
              )}

              <div id="recaptcha-container" />

              {error && <p role="alert" className="rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">{error}</p>}

              <button type="submit" disabled={pending} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70">
                {pending ? (
                  <SpinnerToCheck size={20} color="#ffffff" bg="#6d28d9" />
                ) : null}
                {pending ? "Please wait…" : mode === "signup" ? "Create my Bolo ID" : "Sign in to Bolo"}
              </button>
            </form>
          </div>

          <div className="pt-2">
            <div className="flex items-start gap-2.5 rounded-2xl bg-secondary/70 p-2.5 text-[11px] leading-relaxed text-muted-foreground"><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-card text-primary"><MapPin className="size-3.5" /></span><p>Your Bolo ID is a secure unique account ID. Your personal details are never displayed on public complaint cards.</p></div>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground"><Sparkles className="size-3 text-primary" /> Speak up. See change.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return <div><label htmlFor={id} className="mb-1 block text-xs font-bold text-foreground">{label}</label><input id={id} value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-2xl border border-input bg-card px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" {...props} /></div>;
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-1 text-[10px] transition-colors ${
        met ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground/80"
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


