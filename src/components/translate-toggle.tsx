import { Languages } from "lucide-react";

import { LANGUAGES, t } from "@/lib/i18n";
import { useLanguage } from "@/components/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function TranslateToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        aria-label={t.explore.translate}
        className={cn(
          "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-card/95 px-3 text-xs font-semibold text-foreground shadow-soft backdrop-blur transition-colors hover:bg-secondary",
          className,
        )}
      >
        <Languages className="size-4 text-primary" aria-hidden="true" />
        {current.label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuLabel>{t.explore.translate}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLanguage(l.code)}
            className="flex items-center justify-between gap-3"
          >
            <span>{l.label}</span>
            <span className="text-xs text-muted-foreground">{l.native}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <p className="px-2 py-1.5 text-xs leading-relaxed text-muted-foreground">
          {t.explore.translateNote}
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
