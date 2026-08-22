import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, Edit3, Trash2, User } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { TranslateToggle } from "@/components/translate-toggle";
import { IssueDetailDialog } from "@/components/issue-detail-dialog";
import { EditIssueDialog } from "@/components/edit-issue-dialog";
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
import { formatDate, type Issue } from "@/lib/mock-data";
import { isIssueOwner } from "@/lib/utils";
import { deleteIssue, getFirebaseErrorMessage, subscribeToIssues } from "@/lib/firebase";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore issues — Bolo" },
      {
        name: "description",
        content:
          "A visual feed of civic complaints reported across Indian towns and cities, with status and reporter details.",
      },
      { property: "og:title", content: "Explore issues — Bolo" },
      {
        property: "og:description",
        content: "Browse a photo-led feed of neighbourhood issues and their progress.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [openIssue, setOpenIssue] = useState<Issue | null>(null);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [deletingIssue, setDeletingIssue] = useState<Issue | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const t = useT();

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-8 md:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t.explore.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t.explore.subtitle}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <SpinnerToCheck size={60} color="var(--color-primary)" bg="white" />
          </div>
        ) : issues.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-soft">
            <p className="font-display text-xl font-bold text-foreground">No civic complaints reported yet</p>
            <p className="mt-2 text-sm text-muted-foreground">Be the first to report an issue in your area and track its progress in real-time!</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => {
              const isOwner = isIssueOwner(issue, user);

              return (
                <article
                  key={issue.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-4/3 overflow-hidden">
                    <img
                      src={issue.images[0]}
                      alt={issue.title}
                      loading="lazy"
                      width={1024}
                      height={768}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={issue.status} size="sm" className="bg-card/95 backdrop-blur" />
                    </div>

                    {isOwner && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-card/90 p-1 backdrop-blur">
                        <button
                          type="button"
                          onClick={() => setEditingIssue(issue)}
                          title="Edit"
                          className="grid size-7 place-items-center rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                        >
                          <Edit3 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingIssue(issue)}
                          title="Delete"
                          className="grid size-7 place-items-center rounded-full bg-destructive/15 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                      {issue.category}
                    </span>
                    <h2 className="line-clamp-2 font-display text-lg leading-snug font-semibold text-foreground">
                      {issue.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="size-3.5" aria-hidden="true" />
                        {issue.reporter}
                        {isOwner && (
                          <span className="ml-1 rounded bg-primary/15 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                            You
                          </span>
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {formatDate(issue.date)}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setOpenIssue(issue)}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        {t.explore.cta}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </button>
                      <TranslateToggle />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-xs text-muted-foreground">{t.disclaimer}</p>
      </main>

      <IssueDetailDialog
        issue={openIssue}
        open={openIssue !== null}
        onOpenChange={(o) => !o && setOpenIssue(null)}
        onEdit={(i) => setEditingIssue(i)}
        onDelete={(i) => setDeletingIssue(i)}
      />

      <EditIssueDialog
        issue={editingIssue}
        open={editingIssue !== null}
        onOpenChange={(o) => !o && setEditingIssue(null)}
      />

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
