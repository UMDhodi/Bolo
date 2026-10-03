import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarDays,
  LocateFixed,
  MapPin,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site-header";
import { IssueListCard } from "@/components/issue-list-card";
import { IssueDetailDialog } from "@/components/issue-detail-dialog";
import { EditIssueDialog } from "@/components/edit-issue-dialog";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SpinnerToCheck from "@/components/loader";
import { useAuth } from "@/components/auth-context";
import { useT } from "@/components/language-context";
import { isIssueOwner } from "@/lib/utils";
import { deleteIssue, getFirebaseErrorMessage, subscribeToIssues } from "@/lib/supabase";
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
    // Failsafe: stop spinner after 1.5s max and show results/empty state immediately
    const failsafe = setTimeout(() => setLoadingIssues(false), 1500);
    return () => {
      unsubscribe();
      clearTimeout(failsafe);
    };
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
      return [
        i.city,
        i.district,
        i.state,
        i.location,
        i.title,
        i.category,
        i.reporter,
        i.description,
      ].some((v) => (v ? v.toLowerCase().includes(q) : false));
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
    [issuesList, selectedId],
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
          <Card
            aria-label={t.home.title}
            className="flex min-h-0 flex-col gap-3 overflow-hidden rounded-3xl border-border bg-card p-4 shadow-soft"
          >
            <div className="grid gap-2.5">
              {/* Search box with clear button and badge */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Label htmlFor="place-search" className="text-sm font-semibold">
                    {t.home.searchLabel}
                  </Label>
                  {query && (
                    <Badge variant="outline" className="text-[11px] font-semibold">
                      {filteredIssues.length} matching
                    </Badge>
                  )}
                </div>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="place-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.home.searchPlaceholder}
                    className="h-11 rounded-2xl border-input bg-background pr-10 pl-11 text-base shadow-xs"
                  />
                  {query && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuery("")}
                      className="absolute top-1/2 right-2 size-7 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
                      aria-label="Clear search"
                    >
                      <X className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Quick filter category chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-xs font-semibold text-muted-foreground">Quick filter:</span>
                {["All", "Road damage", "Streetlight", "Drainage", "Garbage", "Water"].map((cat) => {
                  const isActive = (cat === "All" && !query) || query.toLowerCase() === cat.toLowerCase();
                  return (
                    <Badge
                      key={cat}
                      variant={isActive ? "default" : "outline"}
                      onClick={() => setQuery(cat === "All" ? "" : cat)}
                      className="cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all hover:bg-primary/20 hover:text-primary"
                    >
                      {cat}
                    </Badge>
                  );
                })}
              </div>

              {/* Location Select Filters */}
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

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  type="button"
                  onClick={locate}
                  variant="default"
                  className="min-h-10 rounded-full px-5 text-sm font-semibold shadow-soft"
                >
                  <LocateFixed className="size-4" aria-hidden="true" />
                  {locating ? t.home.locating : t.home.useLocation}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFilters}
                  className="min-h-10 rounded-full px-5 text-sm font-semibold"
                >
                  <SlidersHorizontal className="size-4" aria-hidden="true" />
                  {t.home.reset}
                </Button>
                {locationNote && (
                  <p className="text-xs font-medium text-muted-foreground" role="status">
                    {locationNote}
                  </p>
                )}
              </div>
            </div>

            {/* Map Container with Sub-legend overlay */}
            <div className="relative z-0 isolate h-[400px] overflow-hidden rounded-2xl border border-border lg:h-auto lg:min-h-[300px] lg:flex-1">
              {/* Map floating status chip */}
              <div className="absolute top-3 left-3 z-[1000] pointer-events-none flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="gap-1.5 rounded-full border-border/80 bg-background/85 px-3 py-1 text-xs font-semibold shadow-md backdrop-blur-md"
                >
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Civic Map
                </Badge>
              </div>

              <ClientOnly
                fallback={
                  <div className="flex size-full items-center justify-center">
                    <SpinnerToCheck size={52} color="var(--color-primary)" bg="white" />
                  </div>
                }
              >
                <Suspense
                  fallback={
                    <div className="flex size-full items-center justify-center">
                      <SpinnerToCheck size={52} color="var(--color-primary)" bg="white" />
                    </div>
                  }
                >
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
                <Card
                  role="region"
                  aria-label="Selected Issue Preview"
                  className="animate-in fade-in slide-in-from-bottom-4 absolute right-3 bottom-3 left-3 z-[1000] max-w-md rounded-2xl border-border bg-card/95 p-3.5 shadow-2xl backdrop-blur-md transition-all sm:right-auto sm:left-4"
                >
                  {/* Close cross icon */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseSubLegend}
                    aria-label="Close legend preview"
                    className="absolute top-2.5 right-2.5 size-7 rounded-full bg-secondary text-foreground shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </Button>

                  <div className="flex gap-3 pr-6">
                    <img
                      src={selectedIssue.images[0]}
                      alt=""
                      className="size-16 shrink-0 rounded-xl object-cover border border-border"
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
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => setOpenIssue(selectedIssue)}
                      className="h-auto p-0 font-semibold text-primary hover:underline"
                    >
                      View details
                      <ArrowUpRight className="ml-1 size-3.5" />
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </Card>

          {/* Complaint list section */}
          <section aria-label={t.home.listTitle} className="flex min-h-0 flex-col">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{t.home.listTitle}</h2>
                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  {displayedIssues.length}
                </Badge>
              </div>

              {/* All vs My Sort Filter Toggle using shadcn Button pills */}
              <div className="flex items-center rounded-full border border-border bg-secondary/40 p-1">
                <Button
                  type="button"
                  size="sm"
                  variant={issueFilterTab === "all" ? "default" : "ghost"}
                  onClick={() => setIssueFilterTab("all")}
                  className="h-7 rounded-full px-3 text-xs font-semibold shadow-none"
                >
                  All ({issuesList.length})
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={issueFilterTab === "my" ? "default" : "ghost"}
                  onClick={() => {
                    if (!user) {
                      toast.info("Please sign in to view your reported complaints.");
                    }
                    setIssueFilterTab("my");
                  }}
                  className="h-7 rounded-full px-3 text-xs font-semibold shadow-none"
                >
                  My ({myIssuesCount})
                </Button>
              </div>
            </div>

            {/* Scrollable complaint list with shadcn ScrollArea and ScrollBar */}
            <ScrollArea
              ref={listRef}
              className="flex-1 max-h-[70vh] rounded-2xl pr-2.5 lg:max-h-none lg:min-h-0"
            >
              {/* Mutually exclusive states: loading → no-data → list */}
              {loadingIssues ? (
                <div className="flex flex-1 items-center justify-center py-16">
                  <SpinnerToCheck size={52} color="var(--color-primary)" bg="white" />
                </div>
              ) : displayedIssues.length === 0 ? (
                <Card className="rounded-2xl border-dashed border-border bg-card p-8 text-center shadow-none">
                  <p className="text-sm font-semibold text-foreground">
                    {issueFilterTab === "my"
                      ? user
                        ? "You haven't reported any civic complaints yet."
                        : "Please sign in to see complaints you've raised."
                      : t.home.empty}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetFilters}
                    className="mt-3 rounded-full px-5 text-sm font-semibold"
                  >
                    {t.home.reset}
                  </Button>
                </Card>
              ) : (
                <div className="flex flex-col gap-3 pb-4">
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
              )}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
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

      {/* Delete confirmation dialog using shadcn AlertDialog */}
      <AlertDialog open={deletingIssue !== null} onOpenChange={(o) => !o && setDeletingIssue(null)}>
        <AlertDialogContent className="max-w-md rounded-3xl border-border bg-card p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-foreground">
              Delete Complaint?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-muted-foreground">
              Are you sure you want to delete &quot;{deletingIssue?.title}&quot;? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 gap-2 sm:gap-3">
            <AlertDialogCancel className="rounded-full border-border font-semibold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
