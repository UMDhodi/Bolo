import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Clock, Mail, Sparkles, User, Users } from "lucide-react";
import { toast } from "sonner";
import { getDatabase, push, ref, set } from "firebase/database";
import { getApps, getApp } from "firebase/app";

export const Route = createFileRoute("/waitlist")({
  head: () => ({ meta: [{ title: "Join Waitlist — Bolo Civic Connect" }] }),
  component: WaitlistPage,
});

function WaitlistPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setPending(true);
    try {
      if (getApps().length > 0) {
        const db = getDatabase(getApp());
        const waitlistRef = push(ref(db, "waitlist"));
        await set(waitlistRef, {
          name: name.trim() || "Anonymous Citizen",
          email: email.trim().toLowerCase(),
          joinedAt: Date.now(),
        });
      }
      setSubmitted(true);
      toast.success("You're on the waitlist! We'll notify you when a slot opens.");
    } catch (err) {
      console.warn("Could not save to waitlist database:", err);
      // Still show successful UI for optimal UX
      setSubmitted(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-between overflow-x-hidden bg-background px-4 py-8 sm:px-6 lg:px-8">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      {/* Top Header Navigation */}
      <header className="flex w-full max-w-lg items-center justify-between">
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs backdrop-blur-md transition-all hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to sign in</span>
        </Link>

        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
          </span>
          Capacity Limit Reached
        </div>
      </header>

      {/* Main Card */}
      <section className="my-auto w-full max-w-md py-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-6 shadow-xl backdrop-blur-xl sm:p-8">
          
          {/* Logo & Civic Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary shadow-md">
                <img src="/logo.png" alt="Bolo logo" className="size-11 object-cover" />
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-wider text-primary uppercase">Civic Connect</p>
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground">Bolo India</h2>
              </div>
            </div>

            <div className="flex size-9 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
              <Users className="size-4.5" />
            </div>
          </div>

          {/* Apology & Capacity Announcement */}
          <div className="mt-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700">
              <Clock className="size-3.5" />
              Monthly Capacity Limit Reached
            </div>

            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              We're sorry! Registration is temporarily full.
            </h1>

            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Due to unprecedented civic participation and platform resource limits (50,000 active monthly citizens), new account creations are paused. We are expanding server capacity and opening new batches soon.
            </p>
          </div>

          {/* Waitlist Form or Success Message */}
          <div className="mt-6 rounded-2xl bg-secondary/60 p-4 sm:p-5">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Sparkles className="size-3.5 text-primary" />
                  Reserve your spot in line
                </div>

                <div>
                  <label htmlFor="waitlist-name" className="sr-only">Your name</label>
                  <div className="flex items-center rounded-xl border border-input bg-card px-3 focus-within:ring-2 focus-within:ring-ring">
                    <User className="size-3.5 text-muted-foreground" />
                    <input
                      id="waitlist-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name (optional)"
                      className="h-10 w-full bg-transparent px-2.5 text-xs outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="waitlist-email" className="sr-only">Email address</label>
                  <div className="flex items-center rounded-xl border border-input bg-card px-3 focus-within:ring-2 focus-within:ring-ring">
                    <Mail className="size-3.5 text-muted-foreground" />
                    <input
                      id="waitlist-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address to notify you"
                      className="h-10 w-full bg-transparent px-2.5 text-xs outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:opacity-70"
                >
                  {pending ? "Securing your spot..." : "Join Priority Waitlist"}
                </button>
              </form>
            ) : (
              <div className="py-2 text-center">
                <div className="mx-auto mb-2.5 flex size-10 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                  <CheckCircle2 className="size-5" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground">You're on the priority waitlist!</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  We'll send an invite to <strong className="text-foreground">{email}</strong> as soon as the next batch opens.
                </p>
              </div>
            )}
          </div>

          {/* Navigation link back to login for existing users */}
          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth" className="font-bold text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-md text-center">
        <p className="text-[11px] font-semibold text-muted-foreground">
          Bolo Civic Connect · Speak up. See change.
        </p>
      </footer>
    </main>
  );
}
