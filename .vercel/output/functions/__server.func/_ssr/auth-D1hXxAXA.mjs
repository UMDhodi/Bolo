import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as createRecaptchaVerifier, d as signInToBolo, f as signInWithGoogle, i as createBoloAccount, r as useAuth, s as getFirebaseErrorMessage, u as sendPhoneOTP, v as verifyPhoneOTP } from "./router-CfhLwi9k.mjs";
import { t as SpinnerToCheck } from "./loader-64uLEdom.mjs";
import { f as Phone, h as MapPin, o as Sparkles, y as KeyRound } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-D1hXxAXA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var bolo_auth_civic_india_default = "/assets/bolo-auth-civic-india-EEDA0VFx.png";
function AuthPage() {
	const navigate = useNavigate();
	const { user, configured } = useAuth();
	const [mode, setMode] = (0, import_react.useState)("signup");
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [otpSent, setOtpSent] = (0, import_react.useState)(false);
	const [otpCode, setOtpCode] = (0, import_react.useState)("");
	const [confirmationResult, setConfirmationResult] = (0, import_react.useState)(null);
	const [verifier, setVerifier] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user) navigate({ to: "/" });
	}, [navigate, user]);
	async function handleGoogleAuth() {
		setError(null);
		setPending(true);
		try {
			await signInWithGoogle();
			await navigate({ to: "/" });
		} catch (err) {
			setError(getFirebaseErrorMessage(err));
		} finally {
			setPending(false);
		}
	}
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
	async function handleVerifyOTP(e) {
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
			await verifyPhoneOTP(confirmationResult, otpCode.trim(), name.trim() || void 0);
			await navigate({ to: "/" });
		} catch (err) {
			setError(getFirebaseErrorMessage(err));
		} finally {
			setPending(false);
		}
	}
	async function submit(event) {
		event.preventDefault();
		setError(null);
		if (!configured) {
			setError("Firebase is not connected yet. Add the values from .env.example to .env.local first.");
			return;
		}
		if (mode === "phone") {
			if (!otpSent) await handleSendOTP();
			else await handleVerifyOTP(event);
			return;
		}
		if (mode === "signup") {
			if (name.trim().length < 2) return setError("Enter your name.");
			if (password.length < 6) return setError("Choose a password with at least 6 characters.");
			if (password !== confirmPassword) return setError("Passwords do not match.");
		}
		setPending(true);
		try {
			if (mode === "signup") await createBoloAccount({
				displayName: name.trim(),
				phone: "",
				email,
				password
			});
			else await signInToBolo(email, password);
			await navigate({ to: "/" });
		} catch (nextError) {
			setError(getFirebaseErrorMessage(nextError));
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid h-dvh max-h-dvh overflow-hidden bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(440px,.95fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative hidden h-dvh overflow-hidden lg:block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: bolo_auth_civic_india_default,
					alt: "Indian neighbours caring for their community",
					className: "absolute inset-0 size-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/10 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 p-8 text-primary-foreground xl:p-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/logo.png",
								alt: "Bolo logo",
								className: "size-10 object-cover",
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-4xl leading-[.96] font-bold tracking-tight",
							children: "Your city hears you when you Bolo."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/85",
							children: "One clear report can make a neighbourhood safer, cleaner and easier to live in."
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex h-dvh flex-col justify-between overflow-hidden px-4 py-4 sm:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-full w-full max-w-md flex-col justify-between py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-3 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/logo.png",
								alt: "Bolo logo",
								className: "size-10 object-cover",
								"aria-hidden": "true"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl font-bold",
							children: "Bolo"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold tracking-wider text-primary uppercase",
						children: "Civic connect"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-bold tracking-tight text-foreground",
						children: mode === "signup" ? "Join the change." : mode === "phone" ? "Mobile Login" : "Welcome back."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted-foreground",
						children: mode === "signup" ? "Create your Bolo account to report and follow issues in your area." : mode === "phone" ? "Sign in quickly using an OTP sent to your Indian mobile number." : "Sign in to report issues and keep track of your community."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-3 rounded-2xl bg-secondary p-1",
						role: "tablist",
						"aria-label": "Authentication",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": mode === "signup",
								onClick: () => {
									setMode("signup");
									setError(null);
									setOtpSent(false);
								},
								className: `min-h-9 rounded-xl text-xs font-bold transition-colors ${mode === "signup" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`,
								children: "Create account"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": mode === "signin",
								onClick: () => {
									setMode("signin");
									setError(null);
									setOtpSent(false);
								},
								className: `min-h-9 rounded-xl text-xs font-bold transition-colors ${mode === "signin" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`,
								children: "Sign in"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": mode === "phone",
								onClick: () => {
									setMode("phone");
									setError(null);
									setOtpSent(false);
								},
								className: `min-h-9 rounded-xl text-xs font-bold transition-colors ${mode === "phone" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`,
								children: "Phone"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleGoogleAuth,
							disabled: pending,
							className: "inline-flex min-h-10 w-full items-center justify-center gap-2.5 rounded-2xl border border-input bg-card px-4 text-xs font-bold text-foreground shadow-soft transition-colors hover:bg-secondary disabled:opacity-70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								className: "size-4",
								viewBox: "0 0 24 24",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										fill: "#4285F4",
										d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										fill: "#34A853",
										d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										fill: "#FBBC05",
										d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										fill: "#EA4335",
										d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
									})
								]
							}), "Continue with Google"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative my-3 flex items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute bg-background px-2 text-[10px] font-semibold uppercase text-muted-foreground",
							children: "Or"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-2.5",
						noValidate: true,
						children: [
							mode === "phone" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: !otpSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Your Name (Optional)",
								type: "text",
								autoComplete: "name",
								value: name,
								onChange: setName,
								placeholder: "e.g. Rahul Verma"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "phone-otp",
								className: "mb-1 block text-xs font-bold text-foreground",
								children: "Mobile number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex rounded-2xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 border-r border-input px-3 text-xs font-semibold text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }), " +91"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "phone-otp",
									inputMode: "numeric",
									autoComplete: "tel-national",
									value: phone,
									onChange: (e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)),
									placeholder: "10-digit number",
									className: "h-10 min-w-0 flex-1 rounded-r-2xl bg-transparent px-3 text-sm outline-none",
									required: true
								})]
							})] })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "otp-input",
									className: "mb-1 block text-xs font-bold text-foreground",
									children: "Enter 6-digit OTP"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex rounded-2xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex items-center gap-1.5 border-r border-input px-3 text-xs font-semibold text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "otp-input",
										inputMode: "numeric",
										maxLength: 6,
										value: otpCode,
										onChange: (e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6)),
										placeholder: "6-digit code",
										className: "h-10 min-w-0 flex-1 rounded-r-2xl bg-transparent px-3 font-mono text-base tracking-wider outline-none",
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										"OTP sent to +91 ",
										phone,
										". ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setOtpSent(false),
											className: "font-bold text-primary hover:underline",
											children: "Change number"
										})
									]
								})
							] }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Your name",
									type: "text",
									autoComplete: "name",
									value: name,
									onChange: setName,
									placeholder: "e.g. Aditi Sharma",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Email address",
									type: "email",
									autoComplete: "email",
									value: email,
									onChange: setEmail,
									placeholder: "you@example.com",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Password",
									type: "password",
									autoComplete: mode === "signup" ? "new-password" : "current-password",
									value: password,
									onChange: setPassword,
									placeholder: "At least 6 characters",
									required: true
								}),
								mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Confirm password",
									type: "password",
									autoComplete: "new-password",
									value: confirmPassword,
									onChange: setConfirmPassword,
									placeholder: "Repeat your password",
									required: true
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { id: "recaptcha-container" }),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "alert",
								className: "rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: pending,
								className: "inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70",
								children: [pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinnerToCheck, {
									size: 20,
									color: "#ffffff",
									bg: "#6d28d9"
								}) : null, pending ? "Please wait…" : mode === "phone" ? otpSent ? "Verify & Sign in" : "Send OTP" : mode === "signup" ? "Create my Bolo ID" : "Sign in to Bolo"]
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2.5 rounded-2xl bg-secondary/70 p-2.5 text-[11px] leading-relaxed text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-card text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your Bolo ID is a secure unique account ID. Your personal details are never displayed on public complaint cards." })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 text-primary" }), " Speak up. See change."]
					})]
				})]
			})
		})]
	});
}
function Field({ label, value, onChange, ...props }) {
	const id = label.toLowerCase().replace(/\s+/g, "-");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		htmlFor: id,
		className: "mb-1 block text-xs font-bold text-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		id,
		value,
		onChange: (e) => onChange(e.target.value),
		className: "h-10 w-full rounded-2xl border border-input bg-card px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring",
		...props
	})] });
}
//#endregion
export { AuthPage as component };
