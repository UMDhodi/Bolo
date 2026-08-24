import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as initAutoLocationDetection, a as deleteIssue, g as getCachedUserLocation, o as getFirebaseErrorMessage, p as subscribeToIssues, r as useAuth, y as useT } from "./router-BCpHqYz2.mjs";
import { t as SpinnerToCheck } from "./loader-64uLEdom.mjs";
import { I as ArrowUpRight, N as CalendarDays, _ as LocateFixed, a as Trash2, c as SlidersHorizontal, h as MapPin, l as Search, m as PenLine, r as User, t as X } from "../_libs/lucide-react.mjs";
import { _ as cn, a as DialogTitle, f as Input, h as SiteHeader, i as DialogHeader, n as DialogContent, p as Label, r as DialogDescription, t as Dialog, v as isIssueOwner } from "./textarea-BKWF6XWk.mjs";
import { a as Select, c as SelectTrigger, f as citiesFor, h as getStatesFromIssues, i as STATE_CENTERS, l as SelectValue, m as formatDate, n as INDIA_CENTER, o as SelectContent, p as districtsFor, r as IssueDetailDialog, s as SelectItem, t as EditIssueDialog, u as StatusBadge } from "./edit-issue-dialog-BVAdZLOK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-myJ5gsrB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function IssueListCard({ issue, selected, onOpen, onFocusSelect, onEdit, onDelete }) {
	const { user } = useAuth();
	const isOwner = isIssueOwner(issue, user);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick: () => {
			onFocusSelect();
			onOpen();
		},
		role: "button",
		tabIndex: 0,
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onFocusSelect();
				onOpen();
			}
		},
		"aria-pressed": selected,
		className: cn("group relative flex w-full cursor-pointer gap-4 rounded-2xl border bg-card p-3 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus:ring-2 focus:ring-primary", selected ? "border-primary ring-2 ring-primary/25 bg-primary/[0.02]" : "border-border"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: issue.images[0],
			alt: issue.title,
			loading: "lazy",
			width: 1024,
			height: 768,
			className: "size-24 shrink-0 rounded-xl object-cover sm:size-28"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: issue.status,
							size: "sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold text-muted-foreground",
							children: issue.category
						})]
					}), isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 opacity-90 transition-opacity group-hover:opacity-100",
						onClick: (e) => e.stopPropagation(),
						children: [onEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								onEdit(issue);
							},
							title: "Edit Complaint",
							className: "grid size-7 place-items-center rounded-lg border border-border bg-secondary text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, {
								className: "size-3.5",
								"aria-hidden": "true"
							})
						}), onDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								onDelete(issue);
							},
							title: "Delete Complaint",
							className: "grid size-7 place-items-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
								className: "size-3.5",
								"aria-hidden": "true"
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "line-clamp-2 font-display text-base leading-snug font-semibold text-foreground",
					children: issue.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
								className: "size-3.5",
								"aria-hidden": "true"
							}), formatDate(issue.date)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex min-w-0 items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								className: "size-3.5 shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: issue.location
							})]
						})
					]
				})
			]
		})]
	});
}
function HomePage() {
	const { user } = useAuth();
	const [issuesList, setIssuesList] = (0, import_react.useState)([]);
	const [loadingIssues, setLoadingIssues] = (0, import_react.useState)(true);
	const [query, setQuery] = (0, import_react.useState)("");
	const [state, setState] = (0, import_react.useState)("all");
	const [district, setDistrict] = (0, import_react.useState)("all");
	const [city, setCity] = (0, import_react.useState)("all");
	const [issueFilterTab, setIssueFilterTab] = (0, import_react.useState)("all");
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [openIssue, setOpenIssue] = (0, import_react.useState)(null);
	const [editingIssue, setEditingIssue] = (0, import_react.useState)(null);
	const [deletingIssue, setDeletingIssue] = (0, import_react.useState)(null);
	const [isDeleting, setIsDeleting] = (0, import_react.useState)(false);
	const [, setView] = (0, import_react.useState)({
		center: INDIA_CENTER,
		zoom: 4.5
	});
	const [locationNote, setLocationNote] = (0, import_react.useState)(null);
	const [locating, setLocating] = (0, import_react.useState)(false);
	const listRef = (0, import_react.useRef)(null);
	const t = useT();
	(0, import_react.useEffect)(() => {
		initAutoLocationDetection();
		const unsubscribe = subscribeToIssues((data) => {
			setIssuesList(data);
			setLoadingIssues(false);
		});
		return () => unsubscribe();
	}, []);
	const availableStates = (0, import_react.useMemo)(() => getStatesFromIssues(issuesList), [issuesList]);
	const filteredIssues = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return issuesList.filter((i) => {
			if (issueFilterTab === "my") {
				if (!user || !isIssueOwner(i, user)) return false;
			}
			if (state !== "all" && i.state !== state) return false;
			if (district !== "all" && i.district !== district) return false;
			if (city !== "all" && i.city !== city) return false;
			if (!q) return true;
			return [
				i.city,
				i.district,
				i.state,
				i.location,
				i.title,
				i.category,
				i.reporter,
				i.description
			].some((v) => v ? v.toLowerCase().includes(q) : false);
		});
	}, [
		query,
		state,
		district,
		city,
		issueFilterTab,
		user,
		issuesList
	]);
	const displayedIssues = (0, import_react.useMemo)(() => {
		if (!selectedId) return filteredIssues;
		const selected = filteredIssues.find((i) => i.id === selectedId);
		if (!selected) return filteredIssues;
		return [selected, ...filteredIssues.filter((i) => i.id !== selectedId)];
	}, [filteredIssues, selectedId]);
	const selectedIssue = (0, import_react.useMemo)(() => issuesList.find((i) => i.id === selectedId) || null, [issuesList, selectedId]);
	const myIssuesCount = (0, import_react.useMemo)(() => {
		if (!user) return 0;
		return issuesList.filter((i) => isIssueOwner(i, user)).length;
	}, [issuesList, user]);
	function applyState(next) {
		setState(next);
		setDistrict("all");
		setCity("all");
		const preset = STATE_CENTERS[next];
		setView(preset ? { ...preset } : {
			center: INDIA_CENTER,
			zoom: 4.5
		});
	}
	function locate() {
		setLocating(true);
		if (!("geolocation" in navigator)) {
			setLocating(false);
			setLocationNote(t.home.locationDenied);
			return;
		}
		navigator.geolocation.getCurrentPosition((pos) => {
			setLocating(false);
			const { latitude, longitude } = pos.coords;
			if (latitude >= 6 && latitude <= 37.2 && longitude >= 67 && longitude <= 98.5) {
				setView({
					center: [latitude, longitude],
					zoom: 8
				});
				setLocationNote(t.home.locationOn);
			} else {
				setView({
					center: INDIA_CENTER,
					zoom: 4.5
				});
				setLocationNote(t.home.locationDenied);
			}
		}, () => {
			setLocating(false);
			const cached = getCachedUserLocation();
			if (cached) {
				setView({
					center: [cached.latitude, cached.longitude],
					zoom: 8
				});
				setLocationNote(t.home.locationOn);
			} else {
				setView({
					center: INDIA_CENTER,
					zoom: 4.5
				});
				setLocationNote(t.home.locationDenied);
			}
		}, { timeout: 8e3 });
	}
	function handleCloseSubLegend() {
		setSelectedId(null);
	}
	function resetFilters() {
		setQuery("");
		setState("all");
		setDistrict("all");
		setCity("all");
		setIssueFilterTab("all");
		setSelectedId(null);
		setView({
			center: INDIA_CENTER,
			zoom: 4.5
		});
	}
	async function handleConfirmDelete() {
		if (!deletingIssue) return;
		setIsDeleting(true);
		try {
			await deleteIssue(deletingIssue.id);
			setIsDeleting(false);
			toast.success("Complaint deleted successfully.");
			if (selectedId === deletingIssue.id) setSelectedId(null);
			if (openIssue?.id === deletingIssue.id) setOpenIssue(null);
			setDeletingIssue(null);
		} catch (err) {
			setIsDeleting(false);
			toast.error(getFirebaseErrorMessage(err));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background lg:h-screen lg:min-h-0 lg:overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto flex w-full max-w-[1400px] flex-col px-4 py-4 md:px-8 md:py-6 lg:min-h-0 lg:flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-foreground md:text-3xl",
						children: t.home.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: t.home.subtitle
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: t.disclaimer
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-label": t.home.title,
						className: "flex min-h-0 flex-col gap-3 overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "place-search",
									className: "mb-1 block text-sm font-semibold",
									children: t.home.searchLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
										className: "pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground",
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "place-search",
										value: query,
										onChange: (e) => setQuery(e.target.value),
										placeholder: t.home.searchPlaceholder,
										className: "h-11 rounded-2xl border-input bg-background pl-12 text-base"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2.5 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
											label: t.home.state,
											value: state,
											onChange: applyState,
											options: availableStates
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
											label: t.home.district,
											value: district,
											onChange: (v) => {
												setDistrict(v);
												setCity("all");
											},
											options: districtsFor(issuesList, state)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
											label: t.home.city,
											value: city,
											onChange: setCity,
											options: citiesFor(issuesList, state, district)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: locate,
											className: "inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, {
												className: "size-4",
												"aria-hidden": "true"
											}), locating ? t.home.locating : t.home.useLocation]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: resetFilters,
											className: "inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {
												className: "size-4",
												"aria-hidden": "true"
											}), t.home.reset]
										}),
										locationNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium text-muted-foreground",
											role: "status",
											children: locationNote
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-0 isolate h-[400px] overflow-hidden rounded-2xl border border-border lg:h-auto lg:min-h-[300px] lg:flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-full items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinnerToCheck, {
									size: 52,
									color: "var(--color-primary)",
									bg: "white"
								})
							}) }), selectedIssue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								role: "region",
								"aria-label": "Selected Issue Preview",
								className: "animate-in fade-in slide-in-from-bottom-4 absolute right-3 bottom-3 left-3 z-[1000] max-w-md rounded-2xl border border-border bg-card/95 p-3.5 shadow-2xl backdrop-blur-md transition-all sm:right-auto sm:left-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleCloseSubLegend,
										"aria-label": "Close legend preview",
										className: "absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full bg-secondary text-foreground shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
											className: "size-4",
											"aria-hidden": "true"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3 pr-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: selectedIssue.images[0],
											alt: "",
											className: "size-16 shrink-0 rounded-xl object-cover"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex min-w-0 flex-1 flex-col gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
														status: selectedIssue.status,
														size: "sm"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] font-semibold text-muted-foreground",
														children: selectedIssue.category
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "line-clamp-1 font-display text-sm font-bold text-foreground",
													children: selectedIssue.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "flex items-center gap-1 text-[11px] text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate",
														children: selectedIssue.location
													})]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2.5 flex items-center justify-between border-t border-border/60 pt-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: formatDate(selectedIssue.date)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setOpenIssue(selectedIssue),
											className: "inline-flex items-center gap-1 font-semibold text-primary hover:underline",
											children: ["View details", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
										})]
									})
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-label": t.home.listTitle,
						className: "flex min-h-0 flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold text-foreground",
									children: t.home.listTitle
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground",
									children: displayedIssues.length
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center rounded-full border border-border bg-secondary/40 p-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setIssueFilterTab("all"),
									className: `rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${issueFilterTab === "all" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: [
										"All (",
										issuesList.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										if (!user) toast.info("Please sign in to view your reported complaints.");
										setIssueFilterTab("my");
									},
									className: `rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${issueFilterTab === "my" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: [
										"My (",
										myIssuesCount,
										")"
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: listRef,
							className: "flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1 lg:max-h-none lg:min-h-0 lg:flex-1",
							children: [loadingIssues ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-1 items-center justify-center py-16",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinnerToCheck, {
									size: 52,
									color: "var(--color-primary)",
									bg: "white"
								})
							}) : displayedIssues.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-dashed border-border bg-card p-8 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-foreground",
									children: issueFilterTab === "my" ? user ? "You haven't reported any civic complaints yet." : "Please sign in to see complaints you've raised." : t.home.empty
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: resetFilters,
									className: "mt-3 inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-semibold hover:bg-secondary",
									children: t.home.reset
								})]
							}) : null, displayedIssues.map((issue) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"data-issue": issue.id,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueListCard, {
									issue,
									selected: issue.id === selectedId,
									onFocusSelect: () => setSelectedId(issue.id),
									onOpen: () => setOpenIssue(issue),
									onEdit: (i) => setEditingIssue(i),
									onDelete: (i) => setDeletingIssue(i)
								})
							}, issue.id))]
						})]
					})]
				})]
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
function FilterSelect({ label, value, onChange, options }) {
	const t = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "mb-1 block text-sm font-semibold",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value,
		onValueChange: onChange,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
			className: "h-11 rounded-2xl border-input bg-background text-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: t.home.all })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: "all",
			children: `${t.home.all} ${label.toLowerCase()}s`
		}), options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: o,
			children: o
		}, o))] })]
	})] });
}
//#endregion
export { HomePage as component };
