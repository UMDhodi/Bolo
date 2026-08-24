import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { toast } from "sonner";
import { Camera, ImagePlus, LocateFixed, Trash2, UploadCloud } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { LanguageSelector } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-context";
import { useLanguage, useT } from "@/components/language-context";
import { getFirebaseErrorMessage, submitIssue } from "@/lib/firebase";
import SpinnerToCheck from "@/components/loader";
import { CameraCaptureDialog } from "@/components/camera-capture-dialog";
import { initAutoLocationDetection, resolveLocationCoordinates } from "@/lib/location-resolver";
import type { TranslationDict } from "@/lib/i18n";

export const Route = createFileRoute("/raise")({
  head: () => ({
    meta: [
      { title: "Raise an issue" },
      {
        name: "description",
        content:
          "Report a civic issue with photos, location, address and a detailed description in your preferred language.",
      },
      { property: "og:title", content: "Raise an issue" },
      {
        property: "og:description",
        content: "Share what needs attention in your area with photos and clear details.",
      },
    ],
  }),
  component: RaisePage,
});

type Fields = {
  title: string;
  reporter: string;
  date: string;
  time: string;
  location: string;
  address: string;
  description: string;
};

const empty: Fields = {
  title: "",
  reporter: "",
  date: "",
  time: "",
  location: "",
  address: "",
  description: "",
};

function validate(f: Fields, t: TranslationDict) {
  const e: Partial<Record<keyof Fields, string>> = {};
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
  const navigate = Route.useNavigate();
  const [fields, setFields] = useState<Fields>(empty);
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [previews, setPreviews] = useState<{ id: string; url: string; name: string; file: File }[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [processingFiles, setProcessingFiles] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useT();

  useEffect(() => {
    initAutoLocationDetection();
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const timeStr = today.toTimeString().slice(0, 5);
    setFields((f) => ({
      ...f,
      date: f.date || dateStr,
      time: f.time || timeStr,
    }));
  }, []);

  useEffect(() => {
    if (user) {
      const autoName = user.displayName || (user.email ? user.email.split("@")[0] : "");
      if (autoName) {
        setFields((f) => ({
          ...f,
          reporter: f.reporter || autoName,
        }));
      }
    }
  }, [user]);

  const errors = validate(fields, t);
  const valid = Object.keys(errors).length === 0;

  function set<K extends keyof Fields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  async function addFiles(files: FileList | File[] | null) {
    if (!files) return;
    setProcessingFiles(true);
    try {
      const arr = Array.isArray(files) ? files : Array.from(files);
      const next = arr
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, 5 - previews.length)
        .map((f) => ({
          id: `${f.name}-${f.size}-${Math.random()}`,
          url: URL.createObjectURL(f),
          name: f.name,
          file: f,
        }));
      setPreviews((p) => [...p, ...next].slice(0, 5));
    } finally {
      setTimeout(() => setProcessingFiles(false), 300);
    }
  }

  function handleCameraCapture(file: File) {
    addFiles([file]);
    toast.success("Photo captured successfully!");
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocating(false);
        toast.success("Live coordinates attached to this issue.");
      },
      () => {
        setLocating(false);
        toast.error("We could not get your location. You can still enter the address manually.");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({
      title: true,
      reporter: true,
      date: true,
      time: true,
      location: true,
      address: true,
      description: true,
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
        images: previews.map((preview) => preview.file),
      });
      setSubmitting(false);
      toast.success("Issue submitted to Bolo and saved to live database.");
      setFields(empty);
      setTouched({});
      setPreviews([]);
      setCoordinates(null);
      void navigate({ to: "/" });
    } catch (error) {
      setSubmitting(false);
      toast.error(getFirebaseErrorMessage(error));
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t.raise.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.raise.subtitle}</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          {/* Photos */}
          <Group title={t.raise.groupPhotos}>
            <Label htmlFor="photo-input" className="mb-2 block text-sm font-semibold">
              {t.raise.photos}
            </Label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "relative flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
                dragging ? "border-primary bg-primary/5" : "border-input bg-secondary/40",
              )}
            >
              {processingFiles ? (
                <div className="flex flex-col items-center justify-center gap-3 py-6">
                  <SpinnerToCheck size={48} color="var(--color-primary)" bg="white" />
                  <p className="text-sm font-semibold text-primary">Processing photo…</p>
                </div>
              ) : (
                <>
                  <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <UploadCloud className="size-7" aria-hidden="true" />
                  </span>
                  <p className="max-w-sm text-sm text-muted-foreground">{t.raise.photosHint}</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <ImagePlus className="size-4" aria-hidden="true" />
                      {t.raise.browse}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCameraOpen(true)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary shadow-soft transition-colors hover:bg-primary/10"
                    >
                      <Camera className="size-4" aria-hidden="true" />
                      {t.raise.takePhoto}
                    </button>
                  </div>
                  <input
                    ref={inputRef}
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => addFiles(e.target.files)}
                  />
                </>
              )}
            </div>

            {previews.length > 0 && (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previews.map((p) => (
                  <li
                    key={p.id}
                    className="group relative overflow-hidden rounded-xl border border-border"
                  >
                    <img src={p.url} alt={p.name} className="aspect-4/3 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPreviews((prev) => prev.filter((x) => x.id !== p.id))}
                      aria-label={`Remove ${p.name}`}
                      className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-card/95 text-destructive shadow-soft transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Group>

          {/* What */}
          <Group title={t.raise.groupWhat}>
            <Field
              id="title"
              label={t.raise.titleField}
              placeholder={t.raise.titlePlaceholder}
              value={fields.title}
              error={touched.title ? errors.title : undefined}
              onChange={(v) => set("title", v)}
              onBlur={() => setTouched((s) => ({ ...s, title: true }))}
            />
            <div>
              <Label htmlFor="description" className="mb-1.5 block text-sm font-semibold">
                {t.raise.description} <Req />
              </Label>
              <Textarea
                id="description"
                rows={6}
                value={fields.description}
                placeholder={t.raise.descriptionPlaceholder}
                onChange={(e) => set("description", e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, description: true }))}
                aria-invalid={Boolean(touched.description && errors.description)}
                className={cn(
                  "rounded-2xl bg-background text-base",
                  touched.description && errors.description && "border-destructive",
                )}
              />
              <FieldError message={touched.description ? errors.description : undefined} />
            </div>
          </Group>

          {/* Where and when */}
          <Group title={t.raise.groupWhere}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="date"
                type="date"
                label={t.raise.date}
                value={fields.date}
                error={touched.date ? errors.date : undefined}
                onChange={(v) => set("date", v)}
                onBlur={() => setTouched((s) => ({ ...s, date: true }))}
              />
              <Field
                id="time"
                type="time"
                label={t.raise.time}
                value={fields.time}
                error={touched.time ? errors.time : undefined}
                onChange={(v) => set("time", v)}
                onBlur={() => setTouched((s) => ({ ...s, time: true }))}
              />
            </div>
            <Field
              id="location"
              label={t.raise.location}
              placeholder={t.raise.locationPlaceholder}
              value={fields.location}
              error={touched.location ? errors.location : undefined}
              onChange={(v) => set("location", v)}
              onBlur={() => setTouched((s) => ({ ...s, location: true }))}
            />
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-secondary/60 p-3">
              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={locating}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <LocateFixed className="size-4" aria-hidden="true" />
                {locating ? "Getting location…" : "Use my live location"}
              </button>
              <p className="text-xs font-medium text-muted-foreground">
                {coordinates
                  ? `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)} attached`
                  : "Automatic fast geocoding will match your location with high accuracy."}
              </p>
            </div>
            <div>
              <Label htmlFor="address" className="mb-1.5 block text-sm font-semibold">
                {t.raise.address} <Req />
              </Label>
              <Textarea
                id="address"
                rows={3}
                value={fields.address}
                placeholder={t.raise.addressPlaceholder}
                onChange={(e) => set("address", e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, address: true }))}
                aria-invalid={Boolean(touched.address && errors.address)}
                className={cn(
                  "rounded-2xl bg-background text-base",
                  touched.address && errors.address && "border-destructive",
                )}
              />
              <FieldError message={touched.address ? errors.address : undefined} />
            </div>
          </Group>

          {/* Who */}
          <Group title={t.raise.groupWho}>
            <Field
              id="reporter"
              label={t.raise.reporter}
              placeholder={t.raise.reporterPlaceholder}
              value={fields.reporter}
              error={touched.reporter ? errors.reporter : undefined}
              onChange={(v) => set("reporter", v)}
              onBlur={() => setTouched((s) => ({ ...s, reporter: true }))}
            />
            <div>
              <p className="mb-1.5 text-sm font-semibold text-foreground">{t.raise.language}</p>
              <div className="flex flex-wrap items-center gap-3">
                <LanguageSelector />
                <p className="max-w-sm text-xs text-muted-foreground">{t.raise.languageHint}</p>
              </div>
            </div>
          </Group>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
            <p className="max-w-sm text-xs text-muted-foreground">{t.disclaimer}</p>
            <button
              type="submit"
              disabled={!valid || submitting}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
            >
              {submitting ? (
                <>
                  <SpinnerToCheck size={22} color="#ffffff" bg="#0f766e" />
                  {t.raise.submitting}
                </>
              ) : (
                t.raise.submit
              )}
            </button>
          </div>
        </form>
      </main>

      <CameraCaptureDialog
        open={cameraOpen}
        onOpenChange={setCameraOpen}
        onCapture={handleCameraCapture}
      />
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-3xl border border-border bg-card p-5 shadow-soft md:p-6">
      <legend className="px-2 font-display text-sm font-bold tracking-wide text-primary uppercase">
        {title}
      </legend>
      <div className="flex flex-col gap-4 pt-2">{children}</div>
    </fieldset>
  );
}

function Req() {
  const t = useT();
  return (
    <span className="text-xs font-medium text-muted-foreground">({t.raise.required})</span>
  );
}

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-semibold text-destructive">
      {message}
    </p>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  placeholder?: string | undefined;
  error?: string | undefined;
  type?: string | undefined;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label} <Req />
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        className={cn("h-12 rounded-2xl bg-background text-base", error && "border-destructive")}
      />
      <FieldError message={error} />
    </div>
  );
}
