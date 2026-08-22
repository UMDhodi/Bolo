import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as LANGUAGES, S as useT, g as updateIssue, r as useAuth, s as getFirebaseErrorMessage, w as t, x as useLanguage } from "./router-CfhLwi9k.mjs";
import { t as SpinnerToCheck } from "./loader-64uLEdom.mjs";
import { E as ChevronUp, M as Building2, O as ChevronDown, b as ImagePlus, h as MapPin, i as Trash2, j as CalendarDays, k as Check, m as PenLine, n as User, t as X, u as Save, v as Languages } from "../_libs/lucide-react.mjs";
import { _ as cn, a as DialogTitle, c as DropdownMenuItem, d as DropdownMenuTrigger, f as Input, g as Textarea, i as DialogHeader, l as DropdownMenuLabel, n as DialogContent, o as DropdownMenu, p as Label, r as DialogDescription, s as DropdownMenuContent, t as Dialog, u as DropdownMenuSeparator, v as isIssueOwner } from "./textarea-CanCViwR.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit-issue-dialog-BZIbzRzV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles = {
	reported: "bg-status-reported-soft text-status-reported border-status-reported/25",
	progress: "bg-status-progress-soft text-status-progress border-status-progress/30",
	solved: "bg-status-solved-soft text-status-solved border-status-solved/25"
};
var dots = {
	reported: "bg-status-reported",
	progress: "bg-status-progress",
	solved: "bg-status-solved"
};
function StatusDot({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": "true",
		className: cn("size-2.5 shrink-0 rounded-full", dots[status], className)
	});
}
function StatusBadge({ status, size = "md", className }) {
	const t = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border font-semibold", size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs", styles[status], className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDot, {
			status,
			className: size === "sm" ? "size-2" : "size-2.5"
		}), t.status[status]]
	});
}
function TranslateToggle({ className }) {
	const { language, setLanguage } = useLanguage();
	const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuTrigger, {
		onClick: (e) => e.stopPropagation(),
		"aria-label": t.explore.translate,
		className: cn("inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-card/95 px-3 text-xs font-semibold text-foreground shadow-soft backdrop-blur transition-colors hover:bg-secondary", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, {
			className: "size-4 text-primary",
			"aria-hidden": "true"
		}), current.label]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-60",
		onClick: (e) => e.stopPropagation(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: t.explore.translate }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			LANGUAGES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: () => setLanguage(l.code),
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: l.native
				})]
			}, l.code)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 py-1.5 text-xs leading-relaxed text-muted-foreground",
				children: t.explore.translateNote
			})
		]
	})] });
}
var INDIA_CENTER = [22.55, 79.5];
var STATE_CENTERS = {
	Maharashtra: {
		center: [19.2, 75.5],
		zoom: 7
	},
	Karnataka: {
		center: [14.8, 76],
		zoom: 7
	},
	Delhi: {
		center: [28.62, 77.14],
		zoom: 10
	},
	"Tamil Nadu": {
		center: [11, 78.4],
		zoom: 7
	},
	"West Bengal": {
		center: [23.5, 87.9],
		zoom: 7
	},
	Rajasthan: {
		center: [26.8, 74.2],
		zoom: 7
	},
	Gujarat: {
		center: [22.6, 71.8],
		zoom: 7
	},
	"Uttar Pradesh": {
		center: [27, 80.5],
		zoom: 7
	}
};
function getStatesFromIssues(issues) {
	return Array.from(new Set(issues.map((i) => i.state))).sort();
}
function districtsFor(issues, state) {
	return Array.from(new Set(issues.filter((i) => state === "all" || i.state === state).map((i) => i.district))).sort();
}
function citiesFor(issues, state, district) {
	return Array.from(new Set(issues.filter((i) => (state === "all" || i.state === state) && (district === "all" || i.district === district)).map((i) => i.city))).sort();
}
function formatDate(iso) {
	return (/* @__PURE__ */ new Date(iso + "T00:00:00")).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function IssueDetailDialog({ issue, open, onOpenChange, onEdit, onDelete }) {
	const [active, setActive] = (0, import_react.useState)(0);
	const t = useT();
	const { user } = useAuth();
	if (!issue) return null;
	const gallery = issue.images;
	const isOwner = isIssueOwner(issue, user);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-h-[92vh] w-[calc(100vw-2rem)] max-w-5xl overflow-y-auto rounded-3xl border-border bg-card p-0 sm:max-w-5xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-secondary/60 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl border border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: gallery[active] || gallery[0],
							alt: issue.title,
							width: 1024,
							height: 768,
							className: "aspect-4/3 w-full object-cover"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "sr-only",
							children: t.detail.gallery
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2",
							children: gallery.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setActive(i),
								"aria-label": `${t.detail.gallery} ${i + 1}`,
								"aria-current": i === active,
								className: "overflow-hidden rounded-xl border-2 transition-colors data-[on=true]:border-primary",
								"data-on": i === active,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src,
									alt: "",
									loading: "lazy",
									className: "size-16 object-cover",
									width: 64,
									height: 64
								})
							}, i))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-5 p-6 md:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: issue.status }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground",
										children: issue.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground",
										children: issue.id
									})
								]
							}), isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [onEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										onOpenChange(false);
										onEdit(issue);
									},
									className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/80 px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-3.5" }), "Edit Complaint"]
								}), onDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										onOpenChange(false);
										onDelete(issue);
									},
									className: "inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3.5 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Delete"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display text-2xl leading-snug font-bold text-foreground md:text-3xl",
							children: issue.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4" }),
									label: t.detail.reportedBy,
									children: [issue.reporter, isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-1.5 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary",
										children: "You"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4" }),
									label: t.detail.date,
									children: formatDate(issue.date)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }),
									label: t.detail.location,
									children: issue.location
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4" }),
									label: "Ward area",
									children: [
										issue.district,
										", ",
										issue.state
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-secondary/50 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
								children: t.detail.address
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-foreground",
								children: issue.address
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
							children: t.detail.description
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "mt-2 text-[15px] leading-relaxed text-foreground",
							children: issue.description
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto flex items-end justify-between gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-[60%] text-xs text-muted-foreground",
								children: t.disclaimer
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TranslateToggle, {})]
						})
					]
				})]
			})
		})
	});
}
function Field({ icon, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
			className: "flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary",
				"aria-hidden": "true",
				children: icon
			}), label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 text-sm font-medium text-foreground",
			children
		})]
	});
}
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var CATEGORIES = [
	"Road damage",
	"Streetlight",
	"Drainage",
	"Garbage collection",
	"Water leak",
	"Public space",
	"Civic Issue"
];
function EditIssueDialog({ issue, open, onOpenChange, onUpdated }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("reported");
	const [category, setCategory] = (0, import_react.useState)("Civic Issue");
	const [images, setImages] = (0, import_react.useState)([]);
	const [newImageFiles, setNewImageFiles] = (0, import_react.useState)([]);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (issue) {
			setTitle(issue.title);
			setDescription(issue.description);
			setLocation(issue.location);
			setAddress(issue.address);
			setStatus(issue.status);
			setCategory(issue.category || "Civic Issue");
			setImages(issue.images || []);
			setNewImageFiles([]);
		}
	}, [issue]);
	if (!issue) return null;
	function handleRemoveExistingImage(index) {
		setImages((prev) => prev.filter((_, i) => i !== index));
	}
	function handleAddNewFiles(files) {
		if (!files) return;
		const added = Array.from(files).filter((f) => f.type.startsWith("image/"));
		setNewImageFiles((prev) => [...prev, ...added]);
	}
	async function handleSave(e) {
		e.preventDefault();
		if (!issue) return;
		if (title.trim().length < 5) {
			toast.error("Please enter a clear title (at least 5 characters).");
			return;
		}
		if (description.trim().length < 15) {
			toast.error("Please provide sufficient description (at least 15 characters).");
			return;
		}
		if (location.trim().length < 3) {
			toast.error("Please enter a valid location.");
			return;
		}
		setSubmitting(true);
		try {
			await updateIssue(issue.id, {
				title: title.trim(),
				description: description.trim(),
				location: location.trim(),
				address: address.trim(),
				status,
				category,
				images,
				newImages: newImageFiles
			});
			setSubmitting(false);
			toast.success("Complaint updated successfully!");
			onOpenChange(false);
			if (onUpdated) onUpdated();
		} catch (err) {
			setSubmitting(false);
			toast.error(getFirebaseErrorMessage(err));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-border bg-card p-6 shadow-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-xl font-bold text-foreground",
					children: "Edit Civic Complaint"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: ["Update the grievance details, status, or location info for ID: ", issue.id]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSave,
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "edit-title",
						className: "mb-1.5 block text-sm font-semibold",
						children: "Issue Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "edit-title",
						value: title,
						onChange: (e) => setTitle(e.target.value),
						className: "h-11 rounded-xl bg-background",
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1.5 block text-sm font-semibold",
							children: "Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: category,
							onValueChange: setCategory,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-11 rounded-xl bg-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c,
								children: c
							}, c)) })]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1.5 block text-sm font-semibold",
							children: "Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: status,
							onValueChange: (v) => setStatus(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-11 rounded-xl bg-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "reported",
									children: "Problem Reported (Red)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "progress",
									children: "Work in Progress (Amber)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "solved",
									children: "Solved (Green)"
								})
							] })]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "edit-location",
							className: "mb-1.5 block text-sm font-semibold",
							children: "Location (Locality, City)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "edit-location",
							value: location,
							onChange: (e) => setLocation(e.target.value),
							placeholder: "e.g. Krishna Nagar, Delhi",
							className: "h-11 rounded-xl bg-background",
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "edit-address",
							className: "mb-1.5 block text-sm font-semibold",
							children: "Specific Address / Landmark"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "edit-address",
							value: address,
							onChange: (e) => setAddress(e.target.value),
							placeholder: "e.g. Main road near metro station",
							className: "h-11 rounded-xl bg-background",
							required: true
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "edit-description",
						className: "mb-1.5 block text-sm font-semibold",
						children: "Description & Details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "edit-description",
						rows: 4,
						value: description,
						onChange: (e) => setDescription(e.target.value),
						className: "rounded-xl bg-background",
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1.5 block text-sm font-semibold",
						children: "Attached Photos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [images.map((img, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative size-20 overflow-hidden rounded-xl border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: img,
								alt: "",
								className: "size-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleRemoveExistingImage(idx),
								className: "absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-destructive text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
							})]
						}, idx)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-secondary/40 text-muted-foreground hover:border-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold",
									children: "Add"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									multiple: true,
									className: "sr-only",
									onChange: (e) => handleAddNewFiles(e.target.files)
								})
							]
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-end gap-3 border-t border-border pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onOpenChange(false),
							className: "inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-semibold text-foreground hover:bg-secondary",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: submitting,
							className: "inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60",
							children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinnerToCheck, {
								size: 20,
								color: "#ffffff",
								bg: "#0f766e"
							}), "Saving…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), "Save Changes"] })
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { Select as a, SelectTrigger as c, TranslateToggle as d, citiesFor as f, getStatesFromIssues as h, STATE_CENTERS as i, SelectValue as l, formatDate as m, INDIA_CENTER as n, SelectContent as o, districtsFor as p, IssueDetailDialog as r, SelectItem as s, EditIssueDialog as t, StatusBadge as u };
