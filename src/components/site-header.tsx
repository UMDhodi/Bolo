import { Link } from "@tanstack/react-router";
import { ChevronDown, Globe, UserRound } from "lucide-react";

import { LANGUAGES } from "@/lib/i18n";
import { useLanguage, useT } from "@/components/language-context";
import { useAuth } from "@/components/auth-context";
import { ProfilePanel } from "@/components/profile-panel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const t = useT();
  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.nav.language}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
      >
        <Globe className="size-4 text-primary" aria-hidden="true" />
        {!compact && <span>{current.native}</span>}
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t.nav.language}</DropdownMenuLabel>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const { user, loading } = useAuth();
  const t = useT();

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/explore", label: t.nav.explore },
    { to: "/raise", label: t.nav.raise },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 md:px-8">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          aria-label={`${t.brand}`}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl overflow-hidden shadow-soft">
            <img src="/logo.png" alt="Bolo logo" className="size-10 object-cover" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-2xl leading-none font-bold tracking-tight text-foreground">
              {t.brand}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="relative inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <LanguageSelector />
          {loading ? (
            <span className="size-11 shrink-0 animate-pulse rounded-full bg-secondary" aria-label="Loading profile" />
          ) : user ? (
            <ProfilePanel>
              <button
                type="button"
                aria-label={t.nav.profile}
                className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-border bg-accent font-display text-sm font-bold text-accent-foreground transition-colors hover:border-primary"
              >
                {avatarInitials(user.displayName)}
              </button>
            </ProfilePanel>
          ) : (
            <Link to="/auth" aria-label="Sign in or create a Bolo account" className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-border bg-accent text-accent-foreground transition-colors hover:border-primary"><UserRound className="size-5" /></Link>
          )}
        </div>
      </div>

      <nav
        aria-label="Main mobile"
        className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden"
      >
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: l.to === "/" }}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold text-muted-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function avatarInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}
