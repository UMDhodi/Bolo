import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as useT, h as subscribeToIssues, o as deleteIssue, r as useAuth, s as getFirebaseErrorMessage } from "./router-CfhLwi9k.mjs";
import { t as SpinnerToCheck } from "./loader-64uLEdom.mjs";
import { P as ArrowUpRight, i as Trash2, j as CalendarDays, m as PenLine, n as User } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, h as SiteHeader, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog, v as isIssueOwner } from "./textarea-CanCViwR.mjs";
import { d as TranslateToggle, m as formatDate, r as IssueDetailDialog, t as EditIssueDialog, u as StatusBadge } from "./edit-issue-dialog-BZIbzRzV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore-XNf89ocD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExplorePage() {
	const { user } = useAuth();
	const [issues, setIssues] = (0, import_react.useState)([]);
	const [openIssue, setOpenIssue] = (0, import_react.useState)(null);
	const [editingIssue, setEditingIssue] = (0, import_react.useState)(null);
	const [deletingIssue, setDeletingIssue] = (0, import_react.useState)(null);
	const [isDeleting, setIsDeleting] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const t = useT();
	(0, import_react.useEffect)(() => {
		const unsubscribe = subscribeToIssues((data) => {
			setIssues(data);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);
	async function handleConfirmDelete() {
		if (!deletingIssue) return;
		setIsDeleting(true);
		try {
			await deleteIssue(deletingIssue.id);
			setIsDeleting(false);
			toast.success("Complaint deleted successfully.");
			if (openIssue?.id === deletingIssue.id) setOpenIssue(null);
			setDeletingIssue(null);
		} catch (err) {
			setIsDeleting(false);
			toast.error(getFirebaseErrorMessage(err));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-[1400px] px-4 py-6 md:px-8 md:py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 flex flex-wrap items-end justify-between gap-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-bold text-foreground md:text-4xl",
							children: t.explore.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-2xl text-sm text-muted-foreground",
							children: t.explore.subtitle
						})] })
					}),
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-center py-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinnerToCheck, {
							size: 60,
							color: "var(--color-primary)",
							bg: "white"
						})
					}) : issues.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl font-bold text-foreground",
							children: "No civic complaints reported yet"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Be the first to report an issue in your area and track its progress in real-time!"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
						children: issues.map((issue) => {
							const isOwner = isIssueOwner(issue, user);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative aspect-4/3 overflow-hidden",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: issue.images[0],
											alt: issue.title,
											loading: "lazy",
											width: 1024,
											height: 768,
											className: "size-full object-cover transition-transform duration-500 group-hover:scale-105"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute top-3 left-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
												status: issue.status,
												size: "sm",
												className: "bg-card/95 backdrop-blur"
											})
										}),
										isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-card/90 p-1 backdrop-blur",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setEditingIssue(issue),
												title: "Edit",
												className: "grid size-7 place-items-center rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-3.5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setDeletingIssue(issue),
												title: "Delete",
												className: "grid size-7 place-items-center rounded-full bg-destructive/15 text-destructive hover:bg-destructive hover:text-destructive-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-1 flex-col gap-3 p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold tracking-wide text-primary uppercase",
											children: issue.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "line-clamp-2 font-display text-lg leading-snug font-semibold text-foreground",
											children: issue.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
														className: "size-3.5",
														"aria-hidden": "true"
													}),
													issue.reporter,
													isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "ml-1 rounded bg-primary/15 px-1.5 py-0.2 text-[10px] font-bold text-primary",
														children: "You"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
													className: "size-3.5",
													"aria-hidden": "true"
												}), formatDate(issue.date)]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-auto flex items-center justify-between gap-3 pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setOpenIssue(issue),
												className: "inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
												children: [t.explore.cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
													className: "size-4",
													"aria-hidden": "true"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TranslateToggle, {})]
										})
									]
								})]
							}, issue.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-xs text-muted-foreground",
						children: t.disclaimer
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueDetailDialog, {
				issue: openIssue,
				open: openIssue !== null,
				onOpenChange: (o) => !o && setOpenIssue(null),
				onEdit: (i) => setEditingIssue(i),
				onDelete: (i) => setDeletingIssue(i)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditIssueDialog, {
				issue: editingIssue,
				open: editingIssue !== null,
				onOpenChange: (o) => !o && setEditingIssue(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: deletingIssue !== null,
				onOpenChange: (o) => !o && setDeletingIssue(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md rounded-3xl border-border bg-card p-6 shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-lg font-bold text-foreground",
						children: "Delete Complaint?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"Are you sure you want to delete \"",
							deletingIssue?.title,
							"\"? This action cannot be undone."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-center justify-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDeletingIssue(null),
							className: "inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm font-semibold text-foreground hover:bg-secondary",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleConfirmDelete,
							disabled: isDeleting,
							className: "inline-flex min-h-10 items-center gap-2 rounded-full bg-destructive px-5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-60",
							children: isDeleting ? "Deleting…" : "Delete"
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { ExplorePage as component };
