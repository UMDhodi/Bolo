import { useState } from "react";
import { CalendarDays, MapPin, User, Building2, Edit3, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
      <DialogContent className="max-h-[92vh] w-[calc(100vw-2rem)] max-w-5xl rounded-3xl border-border bg-card p-0 sm:max-w-5xl overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 max-h-[92vh]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="bg-secondary/40 p-4">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`${t.detail.gallery} ${i + 1}`}
                      aria-current={i === active}
                      className="shrink-0 overflow-hidden rounded-xl border-2 transition-all data-[on=true]:border-primary data-[on=true]:ring-2 data-[on=true]:ring-primary/20"
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
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={issue.status} />
                  <Badge variant="secondary" className="font-semibold text-xs py-0.5">
                    {issue.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-mono text-muted-foreground py-0.5">
                    {issue.id}
                  </Badge>
                </div>

                {isOwner && (
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          onOpenChange(false);
                          onEdit(issue);
                        }}
                        className="rounded-full gap-1.5 text-xs font-semibold h-8"
                      >
                        <Edit3 className="size-3.5" />
                        Edit Complaint
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          onOpenChange(false);
                          onDelete(issue);
                        }}
                        className="rounded-full gap-1.5 text-xs font-semibold h-8"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </Button>
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
                    <Badge variant="default" className="ml-1.5 text-[10px] font-bold py-0 px-1.5">
                      You
                    </Badge>
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

              <Card className="rounded-2xl border-border bg-secondary/30 p-4 shadow-none">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {t.detail.address}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground">{issue.address}</p>
              </Card>

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
          <ScrollBar orientation="vertical" />
        </ScrollArea>
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
