import { useState } from "react";
import { CalendarDays, MapPin, User, Building2, Edit3, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { TranslateToggle } from "@/components/translate-toggle";
import { formatDate, type Issue } from "@/lib/mock-data";
import { isIssueOwner } from "@/lib/utils";
import { useT } from "@/components/language-context";
import { useAuth } from "@/components/auth-context";

export function IssueDetailDialog({
  issue,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (issue: Issue) => void;
  onDelete?: (issue: Issue) => void;
}) {
  const [active, setActive] = useState(0);
  const t = useT();
  const { user } = useAuth();

  if (!issue) return null;
  const gallery = issue.images;

  const isOwner = isIssueOwner(issue, user);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92vh] w-[calc(100vw-2rem)] max-w-5xl overflow-y-auto rounded-3xl border-border bg-card p-0 sm:max-w-5xl"
      >
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="bg-secondary/60 p-4">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <img
                src={gallery[active] || gallery[0]}
                alt={issue.title}
                width={1024}
                height={768}
                className="aspect-4/3 w-full object-cover"
              />
            </div>
            <div className="mt-3">
              <p className="sr-only">{t.detail.gallery}</p>
              <div className="flex gap-2">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`${t.detail.gallery} ${i + 1}`}
                    aria-current={i === active}
                    className="overflow-hidden rounded-xl border-2 transition-colors data-[on=true]:border-primary"
                    data-on={i === active}
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="size-16 object-cover"
                      width={64}
                      height={64}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={issue.status} />
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {issue.category}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{issue.id}</span>
              </div>

              {isOwner && (
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        onEdit(issue);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/80 px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground shadow-sm"
                    >
                      <Edit3 className="size-3.5" />
                      Edit Complaint
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        onDelete(issue);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3.5 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground shadow-sm"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>

            <DialogTitle className="font-display text-2xl leading-snug font-bold text-foreground md:text-3xl">
              {issue.title}
            </DialogTitle>

            <dl className="grid gap-4 sm:grid-cols-2">
              <Field icon={<User className="size-4" />} label={t.detail.reportedBy}>
                {issue.reporter}
                {isOwner && (
                  <span className="ml-1.5 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                    You
                  </span>
                )}
              </Field>
              <Field icon={<CalendarDays className="size-4" />} label={t.detail.date}>
                {formatDate(issue.date)}
              </Field>
              <Field icon={<MapPin className="size-4" />} label={t.detail.location}>
                {issue.location}
              </Field>
              <Field icon={<Building2 className="size-4" />} label="Ward area">
                {issue.district}, {issue.state}
              </Field>
            </dl>

            <div className="rounded-2xl border border-border bg-secondary/50 p-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {t.detail.address}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">{issue.address}</p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {t.detail.description}
              </p>
              <DialogDescription className="mt-2 text-[15px] leading-relaxed text-foreground">
                {issue.description}
              </DialogDescription>
            </div>

            <div className="mt-auto flex items-end justify-between gap-3 pt-2">
              <p className="max-w-[60%] text-xs text-muted-foreground">{t.disclaimer}</p>
              <TranslateToggle />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <span className="text-primary" aria-hidden="true">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}
