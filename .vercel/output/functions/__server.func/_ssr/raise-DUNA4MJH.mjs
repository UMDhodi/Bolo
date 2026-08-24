import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as initAutoLocationDetection, f as submitIssue, n as Route$1, o as getFirebaseErrorMessage, r as useAuth, v as useLanguage, y as useT } from "./router-BCpHqYz2.mjs";
import { t as SpinnerToCheck } from "./loader-64uLEdom.mjs";
import { D as CircleAlert, M as Camera, S as CloudUpload, _ as LocateFixed, a as Trash2, b as ImagePlus, f as RefreshCw, j as Check, o as SwitchCamera, t as X } from "../_libs/lucide-react.mjs";
import { _ as cn, a as DialogTitle, f as Input, g as Textarea, h as SiteHeader, i as DialogHeader, m as LanguageSelector, n as DialogContent, p as Label, t as Dialog } from "./textarea-BKWF6XWk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/raise-DUNA4MJH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CameraCaptureDialog({ open, onOpenChange, onCapture }) {
	const t = useT();
	const videoRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const [stream, setStream] = (0, import_react.useState)(null);
	const [facingMode, setFacingMode] = (0, import_react.useState)("environment");
	const [capturedUrl, setCapturedUrl] = (0, import_react.useState)(null);
	const [capturedBlob, setCapturedBlob] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) {
			stopStream();
			setCapturedUrl(null);
			setCapturedBlob(null);
			setError(null);
			return;
		}
		let isMounted = true;
		async function startCamera() {
			setLoading(true);
			setError(null);
			stopStream();
			try {
				if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("Camera API is not supported in this browser.");
				const newStream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: { ideal: facingMode },
						width: { ideal: 1920 },
						height: { ideal: 1080 }
					},
					audio: false
				});
				if (!isMounted) {
					newStream.getTracks().forEach((track) => track.stop());
					return;
				}
				setStream(newStream);
				if (videoRef.current) {
					videoRef.current.srcObject = newStream;
					videoRef.current.play().catch(() => {});
				}
			} catch (err) {
				console.warn("Camera start error:", err);
				if (isMounted) setError(err instanceof Error ? err.message : "Unable to access camera. Please check permissions.");
			} finally {
				if (isMounted) setLoading(false);
			}
		}
		startCamera();
		return () => {
			isMounted = false;
			stopStream();
		};
	}, [open, facingMode]);
	function stopStream() {
		if (stream) {
			stream.getTracks().forEach((t) => t.stop());
			setStream(null);
		}
	}
	function toggleFacingMode() {
		setFacingMode((prev) => prev === "environment" ? "user" : "environment");
	}
	function handleTakePhoto() {
		if (!videoRef.current) return;
		const video = videoRef.current;
		const canvas = canvasRef.current || document.createElement("canvas");
		canvas.width = video.videoWidth || 1280;
		canvas.height = video.videoHeight || 720;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		canvas.toBlob((blob) => {
			if (blob) {
				setCapturedBlob(blob);
				const url = URL.createObjectURL(blob);
				setCapturedUrl(url);
			}
		}, "image/jpeg", .85);
	}
	function handleRetake() {
		if (capturedUrl) URL.revokeObjectURL(capturedUrl);
		setCapturedUrl(null);
		setCapturedBlob(null);
	}
	function handleConfirmPhoto() {
		if (!capturedBlob) return;
		const filename = `camera-capture-${Date.now()}.jpg`;
		onCapture(new File([capturedBlob], filename, { type: "image/jpeg" }));
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg overflow-hidden rounded-3xl border-border bg-card p-0 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "flex flex-row items-center justify-between border-b border-border px-5 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2 text-base font-bold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
							className: "size-5 text-primary",
							"aria-hidden": "true"
						}), t.raise.takePhoto]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-4/3 w-full overflow-hidden bg-black",
					children: [error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex size-full flex-col items-center justify-center gap-3 p-6 text-center text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-10 text-destructive" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-white/70",
								children: "Please allow camera access in browser settings or use the file browser button."
							})
						]
					}) : capturedUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: capturedUrl,
						alt: "Captured",
						className: "size-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						autoPlay: true,
						playsInline: true,
						muted: true,
						className: "size-full object-cover"
					}), loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center justify-center bg-black/60 text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-8 animate-spin text-primary" })
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
						ref: canvasRef,
						className: "hidden"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between bg-card p-4",
					children: capturedUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleRetake,
							className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Retake"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleConfirmPhoto,
							className: "inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Use Photo"]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full items-center justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: toggleFacingMode,
								disabled: Boolean(error || loading),
								className: "grid size-11 place-items-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50",
								title: "Switch Camera",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchCamera, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleTakePhoto,
								disabled: Boolean(error || loading),
								className: "grid size-14 place-items-center rounded-full border-4 border-primary bg-primary/20 transition-transform active:scale-95 disabled:opacity-50",
								title: "Capture Photo",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-9 rounded-full bg-primary" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onOpenChange(false),
								className: "grid size-11 place-items-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80",
								title: "Cancel",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})
						]
					})
				})
			]
		})
	});
}
var empty = {
	title: "",
	reporter: "",
	date: "",
	time: "",
	location: "",
	address: "",
	description: ""
};
function validate(f, t) {
	const e = {};
	if (f.title.trim().length < 6) e.title = t.raise.errors.title;
	if (f.reporter.trim().length < 2) e.reporter = t.raise.errors.reporter;
	if (!f.date) e.date = t.raise.errors.date;
	if (!f.time) e.time = t.raise.errors.time;
	if (f.location.trim().length < 3) e.location = t.raise.errors.location;
	if (f.address.trim().length < 10) e.address = t.raise.errors.address;
	if (f.description.trim().length < 20) e.description = t.raise.errors.description;
	return e;
}
function RaisePage() {
	const { user } = useAuth();
	const { language } = useLanguage();
	const navigate = Route$1.useNavigate();
	const [fields, setFields] = (0, import_react.useState)(empty);
	const [touched, setTouched] = (0, import_react.useState)({});
	const [previews, setPreviews] = (0, import_react.useState)([]);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [processingFiles, setProcessingFiles] = (0, import_react.useState)(false);
	const [cameraOpen, setCameraOpen] = (0, import_react.useState)(false);
	const [coordinates, setCoordinates] = (0, import_react.useState)(null);
	const [locating, setLocating] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	const t = useT();
	(0, import_react.useEffect)(() => {
		initAutoLocationDetection();
		const today = /* @__PURE__ */ new Date();
		const dateStr = today.toISOString().slice(0, 10);
		const timeStr = today.toTimeString().slice(0, 5);
		setFields((f) => ({
			...f,
			date: f.date || dateStr,
			time: f.time || timeStr
		}));
	}, []);
	(0, import_react.useEffect)(() => {
		if (user) {
			const autoName = user.displayName || (user.email ? user.email.split("@")[0] : "");
			if (autoName) setFields((f) => ({
				...f,
				reporter: f.reporter || autoName
			}));
		}
	}, [user]);
	const errors = validate(fields, t);
	const valid = Object.keys(errors).length === 0;
	function set(key, value) {
		setFields((f) => ({
			...f,
			[key]: value
		}));
	}
	async function addFiles(files) {
		if (!files) return;
		setProcessingFiles(true);
		try {
			const next = (Array.isArray(files) ? files : Array.from(files)).filter((f) => f.type.startsWith("image/")).slice(0, 5 - previews.length).map((f) => ({
				id: `${f.name}-${f.size}-${Math.random()}`,
				url: URL.createObjectURL(f),
				name: f.name,
				file: f
			}));
			setPreviews((p) => [...p, ...next].slice(0, 5));
		} finally {
			setTimeout(() => setProcessingFiles(false), 300);
		}
	}
	function handleCameraCapture(file) {
		addFiles([file]);
		toast.success("Photo captured successfully!");
	}
	function onDrop(e) {
		e.preventDefault();
		setDragging(false);
		addFiles(e.dataTransfer.files);
	}
	function useCurrentLocation() {
		if (!("geolocation" in navigator)) {
			toast.error("Your browser does not support location access.");
			return;
		}
		setLocating(true);
		navigator.geolocation.getCurrentPosition((position) => {
			setCoordinates({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			});
			setLocating(false);
			toast.success("Live coordinates attached to this issue.");
		}, () => {
			setLocating(false);
			toast.error("We could not get your location. You can still enter the address manually.");
		}, {
			enableHighAccuracy: true,
			timeout: 1e4,
			maximumAge: 6e4
		});
	}
	async function onSubmit(e) {
		e.preventDefault();
		setTouched({
			title: true,
			reporter: true,
			date: true,
			time: true,
			location: true,
			address: true,
			description: true
		});
		if (!valid) return;
		if (!user) {
			toast.error("Please sign in before raising an issue.");
			await navigate({ to: "/auth" });
			return;
		}
		setSubmitting(true);
		try {
			await submitIssue(user, {
				title: fields.title,
				description: fields.description,
				reporter: fields.reporter,
				occurredAt: `${fields.date}T${fields.time}:00`,
				location: fields.location,
				address: fields.address,
				language,
				latitude: coordinates?.latitude ?? null,
				longitude: coordinates?.longitude ?? null,
				images: previews.map((preview) => preview.file)
			});
			setSubmitting(false);
			toast.success("Issue submitted to Bolo and saved to live database.");
			setFields(empty);
			setTouched({});
			setPreviews([]);
			setCoordinates(null);
			navigate({ to: "/" });
		} catch (error) {
			setSubmitting(false);
			toast.error(getFirebaseErrorMessage(error));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-4 py-6 md:py-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold text-foreground md:text-4xl",
						children: t.raise.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: t.raise.subtitle
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					noValidate: true,
					className: "flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
							title: t.raise.groupPhotos,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "photo-input",
									className: "mb-2 block text-sm font-semibold",
									children: t.raise.photos
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									onDragOver: (e) => {
										e.preventDefault();
										setDragging(true);
									},
									onDragLeave: () => setDragging(false),
									onDrop,
									className: cn("relative flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors", dragging ? "border-primary bg-primary/5" : "border-input bg-secondary/40"),
									children: processingFiles ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center justify-center gap-3 py-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinnerToCheck, {
											size: 48,
											color: "var(--color-primary)",
											bg: "white"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-primary",
											children: "Processing photo…"
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, {
												className: "size-7",
												"aria-hidden": "true"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "max-w-sm text-sm text-muted-foreground",
											children: t.raise.photosHint
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => inputRef.current?.click(),
												className: "inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
													className: "size-4",
													"aria-hidden": "true"
												}), t.raise.browse]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setCameraOpen(true),
												className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary shadow-soft transition-colors hover:bg-primary/10",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
													className: "size-4",
													"aria-hidden": "true"
												}), t.raise.takePhoto]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: inputRef,
											id: "photo-input",
											type: "file",
											accept: "image/*",
											multiple: true,
											className: "sr-only",
											onChange: (e) => addFiles(e.target.files)
										})
									] })
								}),
								previews.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3",
									children: previews.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "group relative overflow-hidden rounded-xl border border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: p.url,
											alt: p.name,
											className: "aspect-4/3 w-full object-cover"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setPreviews((prev) => prev.filter((x) => x.id !== p.id)),
											"aria-label": `Remove ${p.name}`,
											className: "absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-card/95 text-destructive shadow-soft transition-colors hover:bg-destructive hover:text-destructive-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
												className: "size-4",
												"aria-hidden": "true"
											})
										})]
									}, p.id))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
							title: t.raise.groupWhat,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "title",
								label: t.raise.titleField,
								placeholder: t.raise.titlePlaceholder,
								value: fields.title,
								error: touched.title ? errors.title : void 0,
								onChange: (v) => set("title", v),
								onBlur: () => setTouched((s) => ({
									...s,
									title: true
								}))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "description",
									className: "mb-1.5 block text-sm font-semibold",
									children: [
										t.raise.description,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Req, {})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "description",
									rows: 6,
									value: fields.description,
									placeholder: t.raise.descriptionPlaceholder,
									onChange: (e) => set("description", e.target.value),
									onBlur: () => setTouched((s) => ({
										...s,
										description: true
									})),
									"aria-invalid": Boolean(touched.description && errors.description),
									className: cn("rounded-2xl bg-background text-base", touched.description && errors.description && "border-destructive")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { message: touched.description ? errors.description : void 0 })
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
							title: t.raise.groupWhere,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "date",
										type: "date",
										label: t.raise.date,
										value: fields.date,
										error: touched.date ? errors.date : void 0,
										onChange: (v) => set("date", v),
										onBlur: () => setTouched((s) => ({
											...s,
											date: true
										}))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "time",
										type: "time",
										label: t.raise.time,
										value: fields.time,
										error: touched.time ? errors.time : void 0,
										onChange: (v) => set("time", v),
										onBlur: () => setTouched((s) => ({
											...s,
											time: true
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "location",
									label: t.raise.location,
									placeholder: t.raise.locationPlaceholder,
									value: fields.location,
									error: touched.location ? errors.location : void 0,
									onChange: (v) => set("location", v),
									onBlur: () => setTouched((s) => ({
										...s,
										location: true
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3 rounded-2xl bg-secondary/60 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: useCurrentLocation,
										disabled: locating,
										className: "inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, {
											className: "size-4",
											"aria-hidden": "true"
										}), locating ? "Getting location…" : "Use my live location"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium text-muted-foreground",
										children: coordinates ? `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)} attached` : "Automatic fast geocoding will match your location with high accuracy."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "address",
										className: "mb-1.5 block text-sm font-semibold",
										children: [
											t.raise.address,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Req, {})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "address",
										rows: 3,
										value: fields.address,
										placeholder: t.raise.addressPlaceholder,
										onChange: (e) => set("address", e.target.value),
										onBlur: () => setTouched((s) => ({
											...s,
											address: true
										})),
										"aria-invalid": Boolean(touched.address && errors.address),
										className: cn("rounded-2xl bg-background text-base", touched.address && errors.address && "border-destructive")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { message: touched.address ? errors.address : void 0 })
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
							title: t.raise.groupWho,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "reporter",
								label: t.raise.reporter,
								placeholder: t.raise.reporterPlaceholder,
								value: fields.reporter,
								error: touched.reporter ? errors.reporter : void 0,
								onChange: (v) => set("reporter", v),
								onBlur: () => setTouched((s) => ({
									...s,
									reporter: true
								}))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1.5 text-sm font-semibold text-foreground",
								children: t.raise.language
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSelector, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "max-w-sm text-xs text-muted-foreground",
									children: t.raise.languageHint
								})]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-sm text-xs text-muted-foreground",
								children: t.disclaimer
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: !valid || submitting,
								className: "inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none",
								children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinnerToCheck, {
									size: 22,
									color: "#ffffff",
									bg: "#0f766e"
								}), t.raise.submitting] }) : t.raise.submit
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraCaptureDialog, {
				open: cameraOpen,
				onOpenChange: setCameraOpen,
				onCapture: handleCameraCapture
			})
		]
	});
}
function Group({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
		className: "rounded-3xl border border-border bg-card p-5 shadow-soft md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
			className: "px-2 font-display text-sm font-bold tracking-wide text-primary uppercase",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-4 pt-2",
			children
		})]
	});
}
function Req() {
	const t = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "text-xs font-medium text-muted-foreground",
		children: [
			"(",
			t.raise.required,
			")"
		]
	});
}
function FieldError({ message }) {
	if (!message) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		role: "alert",
		className: "mt-1.5 text-xs font-semibold text-destructive",
		children: message
	});
}
function Field({ id, label, value, onChange, onBlur, placeholder, error, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
			htmlFor: id,
			className: "mb-1.5 block text-sm font-semibold",
			children: [
				label,
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Req, {})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id,
			type,
			value,
			placeholder,
			onChange: (e) => onChange(e.target.value),
			onBlur,
			"aria-invalid": Boolean(error),
			className: cn("h-12 rounded-2xl bg-background text-base", error && "border-destructive")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { message: error })
	] });
}
//#endregion
export { RaisePage as component };
