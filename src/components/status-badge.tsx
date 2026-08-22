import { cn } from "@/lib/utils";
import { useT } from "@/components/language-context";
import type { IssueStatus } from "@/lib/mock-data";

const styles: Record<IssueStatus, string> = {
  reported: "bg-status-reported-soft text-status-reported border-status-reported/25",
  progress: "bg-status-progress-soft text-status-progress border-status-progress/30",
  solved: "bg-status-solved-soft text-status-solved border-status-solved/25",
};

const dots: Record<IssueStatus, string> = {
  reported: "bg-status-reported",
  progress: "bg-status-progress",
  solved: "bg-status-solved",
};

export function StatusDot({ status, className }: { status: IssueStatus; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-2.5 shrink-0 rounded-full", dots[status], className)}
    />
  );
}

export function StatusBadge({
  status,
  size = "md",
  className,
}: {
  status: IssueStatus;
  size?: "sm" | "md";
  className?: string;
}) {
  const t = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        styles[status],
        className,
      )}
    >
      <StatusDot status={status} className={size === "sm" ? "size-2" : "size-2.5"} />
      {t.status[status]}
    </span>
  );
}

export function StatusLegend({ className }: { className?: string }) {
  const t = useT();
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-card/95 px-3 py-2 text-xs text-foreground shadow-soft backdrop-blur",
        className,
      )}
    >
      <span className="font-semibold text-muted-foreground">{t.status.legend}</span>
      {(["reported", "progress", "solved"] as IssueStatus[]).map((s) => (
        <span key={s} className="flex items-center gap-1.5 font-medium">
          <StatusDot status={s} />
          {t.status[s]}
        </span>
      ))}
    </div>
  );
}
