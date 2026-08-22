import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as LANGUAGES, c as getUserProfile, d as signOutOfBolo, h as updateUserProfile, o as getFirebaseErrorMessage, r as useAuth, s as getUserIssueCount, v as useLanguage, y as useT } from "./router-Bqs_Dxed.mjs";
import { t as SpinnerToCheck } from "./loader-64uLEdom.mjs";
import { C as CircleAlert, D as Check, E as ChevronDown, S as CircleQuestionMark, T as ChevronRight, f as Pen, g as LifeBuoy, j as BadgeCheck, l as ScrollText, r as UserRound, t as X, u as Save, x as Circle, y as Globe } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/textarea-CBilAxl2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function isIssueOwner(issue, user) {
	if (!issue || !user) return false;
	if (issue.reporterUid && issue.reporterUid === user.uid) return true;
	if (issue.userId && issue.userId === user.uid) return true;
	const userEmail = user.email?.trim().toLowerCase();
	const issueEmail = issue.reporterEmail?.trim().toLowerCase();
	if (userEmail && issueEmail && userEmail === issueEmail) return true;
	const userDisplayName = user.displayName?.trim().toLowerCase();
	const issueReporter = issue.reporter?.trim().toLowerCase();
	if (userDisplayName && issueReporter && userDisplayName === issueReporter) return true;
	if (userEmail) {
		const emailPrefix = userEmail.split("@")[0];
		if (emailPrefix && issueReporter && (emailPrefix === issueReporter || issueReporter.includes(emailPrefix))) return true;
	}
	return false;
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-[9999] min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-[9999] max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-[9999] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-[9999] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function avatarInitials$1(name) {
	return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}
var AVATAR_COLORS = [
	["#7c3aed", "#ede9fe"],
	["#0ea5e9", "#e0f2fe"],
	["#10b981", "#d1fae5"],
	["#f59e0b", "#fef3c7"],
	["#ef4444", "#fee2e2"],
	["#ec4899", "#fce7f3"]
];
function avatarColor(name) {
	let hash = 0;
	for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
	return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? ["#7c3aed", "#ede9fe"];
}
function KpiCard({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-2xl border border-border bg-secondary/50 p-4 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-3xl font-bold text-primary tabular-nums",
			children: value === null ? "—" : value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1 text-xs font-semibold text-muted-foreground",
			children: label
		})]
	});
}
function InfoRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-0.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium text-foreground break-all",
			children: value || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground italic",
				children: "—"
			})
		})]
	});
}
function EditField({ label, value, onChange, type = "text", placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			className: "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
		})]
	});
}
function ProfilePanel({ children }) {
	const { user } = useAuth();
	const t = useT();
	const [profileDialogOpen, setProfileDialogOpen] = (0, import_react.useState)(false);
	const [supportDialogOpen, setSupportDialogOpen] = (0, import_react.useState)(false);
	const [helpDialogOpen, setHelpDialogOpen] = (0, import_react.useState)(false);
	const [tosDialogOpen, setTosDialogOpen] = (0, import_react.useState)(false);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [issueCount, setIssueCount] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [copiedUid, setCopiedUid] = (0, import_react.useState)(false);
	const [editName, setEditName] = (0, import_react.useState)("");
	const [editLegal, setEditLegal] = (0, import_react.useState)("");
	const [editPhone, setEditPhone] = (0, import_react.useState)("");
	(0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		(async () => {
			const prof = await getUserProfile(user.uid);
			const count = await getUserIssueCount(user.uid, prof?.displayName ?? user.displayName, prof?.email ?? user.email);
			setProfile(prof);
			setIssueCount(count);
		})();
	}, [user, profileDialogOpen]);
	function startEdit() {
		setEditName(profile?.displayName ?? user?.displayName ?? "");
		setEditLegal(profile?.legalName ?? "");
		setEditPhone(profile?.phone ?? user?.phone ?? "");
		setEditing(true);
	}
	function cancelEdit() {
		setEditing(false);
	}
	async function save() {
		if (!user) return;
		setSaving(true);
		try {
			await updateUserProfile(user.uid, {
				displayName: editName.trim() || void 0,
				legalName: editLegal.trim() || void 0,
				phone: editPhone.trim() || void 0
			});
			const updated = await getUserProfile(user.uid);
			setProfile(updated);
			setEditing(false);
			toast.success(t.profile.editSuccess);
		} catch (err) {
			toast.error(getFirebaseErrorMessage(err));
		} finally {
			setSaving(false);
		}
	}
	async function handleSignOut() {
		try {
			await signOutOfBolo();
			toast.success("You have been signed out.");
		} catch (err) {
			toast.error(getFirebaseErrorMessage(err));
		}
	}
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	const displayName = profile?.displayName ?? user.displayName;
	const [bgColor, textColor] = avatarColor(displayName);
	const isVerified = Boolean(user.emailVerified || user.phone && user.phone.length > 6);
	user.uid.length > 28 ? `${user.uid.slice(0, 28)}` : user.uid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			asChild: true,
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
			align: "end",
			sideOffset: 8,
			className: "w-72 rounded-2xl border border-border bg-card p-2 shadow-xl animate-in fade-in-50 zoom-in-95",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					onSelect: () => setProfileDialogOpen(true),
					className: "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus:bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.profile.title === "Your Profile" ? "Profile" : t.profile.title })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1.5 bg-border/60" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					onSelect: () => setSupportDialogOpen(true),
					className: "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus:bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Support" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					onSelect: () => setHelpDialogOpen(true),
					className: "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus:bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FAQ" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					onSelect: () => setTosDialogOpen(true),
					className: "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus:bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Terms of Service" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					onSelect: handleSignOut,
					className: "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Log out" })
				})
			]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: profileDialogOpen,
			onOpenChange: setProfileDialogOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-h-[90vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto rounded-3xl border-border bg-card p-6 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-xl font-bold text-foreground",
						children: t.profile.title
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 rounded-2xl bg-secondary/50 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-bold shadow-md",
							style: {
								backgroundColor: bgColor,
								color: textColor
							},
							"aria-hidden": "true",
							children: avatarInitials$1(displayName)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "truncate font-display text-base font-bold text-foreground",
									children: displayName
								}), isVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700",
									title: t.profile.verified,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
										className: "size-3.5",
										"aria-hidden": "true"
									}), t.profile.verified]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700",
									title: t.profile.notVerified,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
										className: "size-3.5",
										"aria-hidden": "true"
									}), t.profile.notVerified]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: user.email || user.phone
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: t.profile.complaintsRaised,
						value: issueCount
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-foreground",
								children: "Personal Information"
							}), !editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: startEdit,
								className: "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-3.5" }), t.profile.editProfile]
							})]
						}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
									label: t.profile.legalName,
									value: editLegal,
									onChange: setEditLegal,
									placeholder: "e.g. Rahul Sharma"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
									label: "Display Name",
									value: editName,
									onChange: setEditName,
									placeholder: "Display name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
									label: t.profile.mobile,
									value: editPhone,
									onChange: setEditPhone,
									type: "tel",
									placeholder: "+91 XXXXX XXXXX"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: cancelEdit,
										disabled: saving,
										className: "inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold transition-colors hover:bg-secondary disabled:opacity-60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), t.profile.cancel]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: save,
										disabled: saving,
										className: "inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90 disabled:opacity-60",
										children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinnerToCheck, {
											size: 18,
											color: "#ffffff",
											bg: "#0f766e"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), saving ? t.profile.saving : t.profile.saveChanges]
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
									label: t.profile.legalName,
									value: profile?.legalName ?? user.displayName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
									label: t.profile.mobile,
									value: profile?.phone ?? user.phone ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
									label: t.profile.email,
									value: user.email ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
									label: "User ID",
									value: user.uid
								})
							]
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: supportDialogOpen,
			onOpenChange: setSupportDialogOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md rounded-3xl border-border bg-card p-6 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2 font-display text-xl font-bold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "size-5 text-primary" }), " Support & Citizen Help"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 pt-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Need assistance or have an urgent civic emergency in your neighbourhood?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-secondary/50 p-4 text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Bolo Civic Connect Helpline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Email: themayankdhodi@gmail.com"
						})]
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: helpDialogOpen,
			onOpenChange: setHelpDialogOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md rounded-3xl border-border bg-card p-6 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2 font-display text-xl font-bold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "size-5 text-primary" }), " FAQ (Frequently Asked Questions)"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 pt-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-foreground",
								children: "1. How do I report a civic problem?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed",
								children: "Click \"Raise an Issue\" in the navigation bar. You can upload photos, take a photo directly with your camera, add the location, and submit your report."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-foreground",
								children: "2. How are complaint statuses updated?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs leading-relaxed",
								children: [
									"Issues transition from ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Problem Reported" }),
									" → ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Work in Progress" }),
									" → ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Problem Solved" }),
									" as municipal crews and community leaders take action."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-foreground",
								children: "3. Is my identity visible to the public?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed",
								children: "Only your chosen display name is shown on public reports. Your phone number, and account ID remain secure."
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: tosDialogOpen,
			onOpenChange: setTosDialogOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md rounded-3xl border-border bg-card p-6 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2 font-display text-xl font-bold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "size-5 text-primary" }), " Terms of Service"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 pt-2 text-xs leading-relaxed text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Bolo Civic Connect is a citizen grievance and community engagement platform." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Users agree to report genuine civic issues responsibly without uploading abusive, misleading, or private identifiable information on public complaint cards." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your user profile information is protected and stored securely." })
					]
				})]
			})
		})
	] });
}
function LanguageSelector({ compact = false }) {
	const { language, setLanguage } = useLanguage();
	const t = useT();
	const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuTrigger, {
		"aria-label": t.nav.language,
		className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
				className: "size-4 text-primary",
				"aria-hidden": "true"
			}),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: current.native }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
				className: "size-4 text-muted-foreground",
				"aria-hidden": "true"
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-56",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: t.nav.language }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			LANGUAGES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: () => setLanguage(l.code),
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: l.native
				})]
			}, l.code))
		]
	})] });
}
function SiteHeader() {
	const { user, loading } = useAuth();
	const t = useT();
	const links = [
		{
			to: "/",
			label: t.nav.home
		},
		{
			to: "/explore",
			label: t.nav.explore
		},
		{
			to: "/raise",
			label: t.nav.raise
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex min-w-0 items-center gap-3",
				"aria-label": `${t.brand}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-10 shrink-0 place-items-center rounded-2xl overflow-hidden shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/logo.png",
						alt: "Bolo logo",
						className: "size-10 object-cover",
						"aria-hidden": "true"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-display text-2xl leading-none font-bold tracking-tight text-foreground",
						children: t.brand
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 md:gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						"aria-label": "Main",
						className: "hidden items-center gap-1 md:flex",
						children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.to,
							activeOptions: { exact: l.to === "/" },
							className: "relative inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary",
							children: l.label
						}, l.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSelector, {}),
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-11 shrink-0 animate-pulse rounded-full bg-secondary",
						"aria-label": "Loading profile"
					}) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": t.nav.profile,
						className: "grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-border bg-accent font-display text-sm font-bold text-accent-foreground transition-colors hover:border-primary",
						children: avatarInitials(user.displayName)
					}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						"aria-label": "Sign in or create a Bolo account",
						className: "grid size-11 shrink-0 place-items-center rounded-full border-2 border-border bg-accent text-accent-foreground transition-colors hover:border-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-5" })
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			"aria-label": "Main mobile",
			className: "flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden",
			children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: l.to,
				activeOptions: { exact: l.to === "/" },
				className: "inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold text-muted-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary",
				children: l.label
			}, l.to))
		})]
	});
}
function avatarInitials(name) {
	return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
//#endregion
export { cn as _, DialogTitle as a, DropdownMenuItem as c, DropdownMenuTrigger as d, Input as f, Textarea as g, SiteHeader as h, DialogHeader as i, DropdownMenuLabel as l, LanguageSelector as m, DialogContent as n, DropdownMenu as o, Label as p, DialogDescription as r, DropdownMenuContent as s, Dialog as t, DropdownMenuSeparator as u, isIssueOwner as v };
