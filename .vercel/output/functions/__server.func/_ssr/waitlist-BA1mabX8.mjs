import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as getApp, o as getApps } from "../_libs/@firebase/app+[...].mjs";
import "../_libs/firebase.mjs";
import { c as push, f as set, r as getDatabase, u as ref } from "../_libs/@firebase/database+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Clock, E as CircleCheck, L as ArrowLeft, g as Mail, n as Users, r as User, s as Sparkles } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/waitlist-BA1mabX8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WaitlistPage() {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [pending, setPending] = (0, import_react.useState)(false);
	async function handleSubmit(e) {
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
					joinedAt: Date.now()
				});
			}
			setSubmitted(true);
			toast.success("You're on the waitlist! We'll notify you when a slot opens.");
		} catch (err) {
			console.warn("Could not save to waitlist database:", err);
			setSubmitted(true);
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative flex min-h-dvh flex-col items-center justify-between overflow-x-hidden bg-background px-4 py-8 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex w-full max-w-lg items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/auth",
					className: "inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs backdrop-blur-md transition-all hover:bg-secondary hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to sign in" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative flex size-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2 rounded-full bg-amber-500" })]
					}), "Capacity Limit Reached"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "my-auto w-full max-w-md py-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-6 shadow-xl backdrop-blur-xl sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-12 place-items-center rounded-2xl bg-primary shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/logo.png",
										alt: "Bolo logo",
										className: "size-11 object-cover"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-bold tracking-wider text-primary uppercase",
									children: "Civic Connect"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-bold tracking-tight text-foreground",
									children: "Bolo India"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-9 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4.5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }), "Monthly Capacity Limit Reached"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
									children: "We're sorry! Registration is temporarily full."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2.5 text-xs leading-relaxed text-muted-foreground sm:text-sm",
									children: "Due to unprecedented civic participation and platform resource limits (50,000 active monthly citizens), new account creations are paused. We are expanding server capacity and opening new batches soon."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 rounded-2xl bg-secondary/60 p-4 sm:p-5",
							children: !submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmit,
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs font-bold text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-primary" }), "Reserve your spot in line"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "waitlist-name",
										className: "sr-only",
										children: "Your name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center rounded-xl border border-input bg-card px-3 focus-within:ring-2 focus-within:ring-ring",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "waitlist-name",
											type: "text",
											value: name,
											onChange: (e) => setName(e.target.value),
											placeholder: "Your full name (optional)",
											className: "h-10 w-full bg-transparent px-2.5 text-xs outline-none text-foreground placeholder:text-muted-foreground"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "waitlist-email",
										className: "sr-only",
										children: "Email address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center rounded-xl border border-input bg-card px-3 focus-within:ring-2 focus-within:ring-ring",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "waitlist-email",
											type: "email",
											required: true,
											value: email,
											onChange: (e) => setEmail(e.target.value),
											placeholder: "Email address to notify you",
											className: "h-10 w-full bg-transparent px-2.5 text-xs outline-none text-foreground placeholder:text-muted-foreground"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: pending,
										className: "inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:opacity-70",
										children: pending ? "Securing your spot..." : "Join Priority Waitlist"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-2 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mx-auto mb-2.5 flex size-10 items-center justify-center rounded-full bg-green-500/10 text-green-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-sm font-bold text-foreground",
										children: "You're on the priority waitlist!"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											"We'll send an invite to ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: email
											}),
											" as soon as the next batch opens."
										]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex flex-col items-center gap-2 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Already have an account?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/auth",
										className: "font-bold text-primary hover:underline",
										children: "Sign in here"
									})
								]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "w-full max-w-md text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold text-muted-foreground",
					children: "Bolo Civic Connect · Speak up. See change."
				})
			})
		]
	});
}
//#endregion
export { WaitlistPage as component };
