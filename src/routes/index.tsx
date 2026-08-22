import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays, LocateFixed, MapPin, Search, SlidersHorizontal, User, X } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site-header";
import { IssueListCard } from "@/components/issue-list-card";
import { IssueDetailDialog } from "@/components/issue-detail-dialog";
import { EditIssueDialog } from "@/components/edit-issue-dialog";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SpinnerToCheck from "@/components/loader";
import { useAuth } from "@/components/auth-context";
import { useT } from "@/components/language-context";
import { isIssueOwner } from "@/lib/utils";
import { deleteIssue, getFirebaseErrorMessage, subscribeToIssues } from "@/lib/firebase";
import { initAutoLocationDetection, getCachedUserLocation } from "@/lib/location-resolver";
import {
  INDIA_CENTER,
  STATE_CENTERS,
  citiesFor,
  districtsFor,
  formatDate,
  getStatesFromIssues,
  type Issue,
} from "@/lib/mock-data";

const IssueMap = lazy(() => import("@/components/issue-map"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bolo" },
      {
        name: "description",
        content:
          "Browse civic complaints on an interactive map: road damage, streetlights, drainage, garbage, water leaks and public spaces.",
      },
      { property: "og:title", content: "Bolo" },
      {
        property: "og:description",
        content: "See what your neighbourhood is reporting and how it is progressing.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { user } = useAuth();
  const [issuesList, setIssuesList] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [query, setQuery] = useState("");
  const [state, setState] = useState("all");
  const [district, setDistrict] = useState("all");
  const [city, setCity] = useState("all");
  const [issueFilterTab, setIssueFilterTab] = useState<"all" | "my">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openIssue, setOpenIssue] = useState<Issue | null>(null);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [deletingIssue, setDeletingIssue] = useState<Issue | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [view, setView] = useState<{ center: [number, number]; zoom: number }>({
    center: INDIA_CENTER,
    zoom: 4.5,
  });
  const [locationNote, setLocationNote] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    initAutoLocationDetection();
    const unsubscribe = subscribeToIssues((data) => {
      setIssuesList(data);
      setLoadingIssues(false);
    });
    return () => unsubscribe();
  }, []);

  const availableStates = useMemo(() => getStatesFromIssues(issuesList), [issuesList]);

  // Filter issues according to search query, dropdowns, and All vs My tab
  const filteredIssues = useMemo(() => {
    const q = query.trim().toLowerCase();
    return issuesList.filter((i) => {
      // "My" filter
      if (issueFilterTab === "my") {
        if (!user || !isIssueOwner(i, user)) return false;
      }

      if (state !== "all" && i.state !== state) return false;
      if (district !== "all" && i.district !== district) return false;
      if (city !== "all" && i.city !== city) return false;
      if (!q) return true;
      return [i.city, i.district, i.state, i.location, i.title, i.category, i.reporter, i.description].some((v) =>
        v ? v.toLowerCase().includes(q) : false
      );
    });
  }, [query, state, district, city, issueFilterTab, user, issuesList]);

  // Dynamically reorder list so that when a marker/legend is clicked, that card moves to the very top
  const displayedIssues = useMemo(() => {
    if (!selectedId) return filteredIssues;
    const selected = filteredIssues.find((i) => i.id === selectedId);
    if (!selected) return filteredIssues;
    const others = filteredIssues.filter((i) => i.id !== selectedId);
    return [selected, ...others];
  }, [filteredIssues, selectedId]);

  // Currently selected issue details for map mini sub-legend
  const selectedIssue = useMemo(
    () => issuesList.find((i) => i.id === selectedId) || null,
    [issuesList, selectedId]
  );

  // My issues count
  const myIssuesCount = useMemo(() => {
    if (!user) return 0;
    return issuesList.filter((i) => isIssueOwner(i, user)).length;
  }, [issuesList, user]);

  // When the user searches or filters, fit the map to the matching issues.
  const focus = useMemo<[number, number][] | undefined>(() => {
    const active = query.trim() !== "" || state !== "all" || district !== "all" || city !== "all";
    if (!active || filteredIssues.length === 0) return undefined;
    return filteredIssues.map((i) => [i.lat, i.lng] as [number, number]);
  }, [filteredIssues, query, state, district, city]);

  function applyState(next: string) {
    setState(next);
    setDistrict("all");
    setCity("all");
    const preset = STATE_CENTERS[next];
    setView(preset ? { ...preset } : { center: INDIA_CENTER, zoom: 4.5 });
  }

  function locate() {
    setLocating(true);
    if (!("geolocation" in navigator)) {
      setLocating(false);
      setLocationNote(t.home.locationDenied);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        const insideIndia =
          latitude >= 6 && latitude <= 37.2 && longitude >= 67 && longitude <= 98.5;
        if (insideIndia) {
          setView({ center: [latitude, longitude], zoom: 8 });
          setLocationNote(t.home.locationOn);
        } else {
          setView({ center: INDIA_CENTER, zoom: 4.5 });
          setLocationNote(t.home.locationDenied);
        }
      },
      () => {
        setLocating(false);
        const cached = getCachedUserLocation();
        if (cached) {
          setView({ center: [cached.latitude, cached.longitude], zoom: 8 });
          setLocationNote(t.home.locationOn);
        } else {
          setView({ center: INDIA_CENTER, zoom: 4.5 });
          setLocationNote(t.home.locationDenied);
        }
      },
      { timeout: 8000 },
    );
  }

  function selectFromMap(id: string) {
    setSelectedId(id);
    const targetIssue = issuesList.find((i) => i.id === id);
    if (targetIssue) {
      setView({ center: [targetIssue.lat, targetIssue.lng], zoom: 10 });
    }
    setTimeout(() => {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
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
    setView({ center: INDIA_CENTER, zoom: 4.5 });
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

  return (
    <div className="flex min-h-screen flex-col bg-background lg:h-screen lg:min-h-0 lg:overflow-hidden">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1400px] flex-col px-4 py-4 md:px-8 md:py-6 lg:min-h-0 lg:flex-1">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t.home.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t.home.subtitle}</p>
          </div>
          <p className="text-xs text-muted-foreground">{t.disclaimer}</p>
        </div>

        <div className="grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:overflow-hidden">
          {/* Map panel */}
          <section
            aria-label={t.home.title}
            className="flex min-h-0 flex-col gap-3 overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-soft"
          >
            <div className="grid gap-2.5">
              <div>
                <Label htmlFor="place-search" className="mb-1 block text-sm font-semibold">
                  {t.home.searchLabel}
                </Label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="place-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.home.searchPlaceholder}
                    className="h-11 rounded-2xl border-input bg-background pl-12 text-base"
                  />
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-3">
                <FilterSelect
                  label={t.home.state}
                  value={state}
                  onChange={applyState}
                  options={availableStates}
                />
                <FilterSelect
                  label={t.home.district}
                  value={district}
                  onChange={(v) => {
                    setDistrict(v);
                    setCity("all");
                  }}
                  options={districtsFor(issuesList, state)}
                />
                <FilterSelect
                  label={t.home.city}
                  value={city}
                  onChange={setCity}
                  options={citiesFor(issuesList, state, district)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={locate}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
                >
                  <LocateFixed className="size-4" aria-hidden="true" />
                  {locating ? t.home.locating : t.home.useLocation}
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <SlidersHorizontal className="size-4" aria-hidden="true" />
                  {t.home.reset}
                </button>
                {locationNote && (
                  <p className="text-xs font-medium text-muted-foreground" role="status">
                    {locationNote}
                  </p>
                )}
              </div>
            </div>

            {/* Map Container with Sub-legend overlay */}
            <div className="relative z-0 isolate h-[400px] overflow-hidden rounded-2xl border border-border lg:h-auto lg:min-h-[300px] lg:flex-1">
              <ClientOnly fallback={<div className="flex size-full items-center justify-center"><SpinnerToCheck size={52} color="var(--color-primary)" bg="white" /></div>}>
                <Suspense fallback={<div className="flex size-full items-center justify-center"><SpinnerToCheck size={52} color="var(--color-primary)" bg="white" /></div>}>
                  <IssueMap
                    issues={filteredIssues}
                    selectedId={selectedId}
                    onSelect={selectFromMap}
                    center={view.center}
                    zoom={view.zoom}
                    focus={focus}
                  />
                </Suspense>
              </ClientOnly>

              {/* Floating Mini Sub-Legend with Cross Icon on Top Right */}
              {selectedIssue && (
                <div
                  role="region"
                  aria-label="Selected Issue Preview"
                  className="animate-in fade-in slide-in-from-bottom-4 absolute right-3 bottom-3 left-3 z-[1000] max-w-md rounded-2xl border border-border bg-card/95 p-3.5 shadow-2xl backdrop-blur-md transition-all sm:right-auto sm:left-4"
                >
                  {/* Close cross icon */}
                  <button
                    type="button"
                    onClick={handleCloseSubLegend}
                    aria-label="Close legend preview"
                    className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full bg-secondary text-foreground shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>

                  <div className="flex gap-3 pr-6">
                    <img
                      src={selectedIssue.images[0]}
                      alt=""
                      className="size-16 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge status={selectedIssue.status} size="sm" />
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          {selectedIssue.category}
                        </span>
                      </div>
                      <h4 className="line-clamp-1 font-display text-sm font-bold text-foreground">
                        {selectedIssue.title}
                      </h4>
                      <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="size-3 shrink-0 text-primary" />
                        <span className="truncate">{selectedIssue.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                    <span className="text-[11px] text-muted-foreground">
                      {formatDate(selectedIssue.date)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpenIssue(selectedIssue)}
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      View details
                      <ArrowUpRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Complaint list section */}
          <section aria-label={t.home.listTitle} className="flex min-h-0 flex-col">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{t.home.listTitle}</h2>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {displayedIssues.length}
                </span>
              </div>

              {/* All vs My Sort Filter Toggle */}
              <div className="flex items-center rounded-full border border-border bg-secondary/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setIssueFilterTab("all")}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                    issueFilterTab === "all"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({issuesList.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!user) {
                      toast.info("Please sign in to view your reported complaints.");
                    }
                    setIssueFilterTab("my");
                  }}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                    issueFilterTab === "my"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  My ({myIssuesCount})
                </button>
              </div>
            </div>

            <div
              ref={listRef}
              className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1 lg:max-h-none lg:min-h-0 lg:flex-1"
            >
              {loadingIssues ? (
                <div className="flex flex-1 items-center justify-center py-16">
                  <SpinnerToCheck size={52} color="var(--color-primary)" bg="white" />
                </div>
              ) : displayedIssues.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {issueFilterTab === "my"
                      ? user
                        ? "You haven't reported any civic complaints yet."
                        : "Please sign in to see complaints you've raised."
                      : t.home.empty}
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-3 inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-semibold hover:bg-secondary"
                  >
                    {t.home.reset}
                  </button>
                </div>
              ) : null}

              {displayedIssues.map((issue) => (
                <div key={issue.id} data-issue={issue.id}>
                  <IssueListCard
                    issue={issue}
                    selected={issue.id === selectedId}
                    onFocusSelect={() => setSelectedId(issue.id)}
                    onOpen={() => setOpenIssue(issue)}
                    onEdit={(i) => setEditingIssue(i)}
                    onDelete={(i) => setDeletingIssue(i)}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Full issue detail modal */}
      <IssueDetailDialog
        issue={openIssue}
        open={openIssue !== null}
        onOpenChange={(o) => !o && setOpenIssue(null)}
        onEdit={(i) => setEditingIssue(i)}
        onDelete={(i) => setDeletingIssue(i)}
      />

      {/* Edit issue modal */}
      <EditIssueDialog
        issue={editingIssue}
        open={editingIssue !== null}
        onOpenChange={(o) => !o && setEditingIssue(null)}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={deletingIssue !== null} onOpenChange={(o) => !o && setDeletingIssue(null)}>
        <DialogContent className="max-w-md rounded-3xl border-border bg-card p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Delete Complaint?
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              Are you sure you want to delete &quot;{deletingIssue?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeletingIssue(null)}
              className="inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-destructive px-5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-60"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const t = useT();
  return (
    <div>
      <Label className="mb-1 block text-sm font-semibold">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-2xl border-input bg-background text-sm">
          <SelectValue placeholder={t.home.all} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{`${t.home.all} ${label.toLowerCase()}s`}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
