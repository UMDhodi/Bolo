import React from "react";
import { CalendarDays, Edit3, MapPin, Trash2, User } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { cn, isIssueOwner } from "@/lib/utils";
import { formatDate, type Issue } from "@/lib/mock-data";
import { useAuth } from "@/components/auth-context";

export function IssueListCard({
  issue,
  selected,
  onOpen,
  onFocusSelect,
  onEdit,
  onDelete,
}: {
  issue: Issue;
  selected: boolean;
  onOpen: () => void;
  onFocusSelect: () => void;
  onEdit?: (issue: Issue) => void;
  onDelete?: (issue: Issue) => void;
}) {
  const { user } = useAuth();
  const isOwner = isIssueOwner(issue, user);

  return (
    <div
      onClick={() => {
        onFocusSelect();
        onOpen();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFocusSelect();
          onOpen();
        }
      }}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full cursor-pointer gap-4 rounded-2xl border bg-card p-3 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus:ring-2 focus:ring-primary",
        selected ? "border-primary ring-2 ring-primary/25 bg-primary/[0.02]" : "border-border",
      )}
    >
      <img
        src={issue.images[0]}
        alt={issue.title}
        loading="lazy"
        width={1024}
        height={768}
        className="size-24 shrink-0 rounded-xl object-cover sm:size-28"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={issue.status} size="sm" />
            <span className="text-[11px] font-semibold text-muted-foreground">{issue.category}</span>
          </div>

          {/* Universal Edit/Delete buttons (Visible only on owner's cards) */}
          {isOwner && (
            <div
              className="flex items-center gap-1 opacity-90 transition-opacity group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(issue);
                  }}
                  title="Edit Complaint"
                  className="grid size-7 place-items-center rounded-lg border border-border bg-secondary text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Edit3 className="size-3.5" aria-hidden="true" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(issue);
                  }}
                  title="Delete Complaint"
                  className="grid size-7 place-items-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>

        <h3 className="line-clamp-2 font-display text-base leading-snug font-semibold text-foreground">
          {issue.title}
        </h3>
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
          <span className="flex min-w-0 items-center gap-1">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{issue.location}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
