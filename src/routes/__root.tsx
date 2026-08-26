import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useNavigate,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { LanguageProvider } from "../components/language-context";
import { AuthProvider } from "../components/auth-context";
import { useAuth } from "../components/auth-context";
import { Toaster } from "../components/ui/sonner";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("TanStack Router ErrorComponent caught:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-left">
            <p className="text-xs font-bold text-destructive">Error Details:</p>
            <p className="mt-1 font-mono text-xs text-destructive break-all">
              {error.message || String(error)}
            </p>
            {error.stack ? (
              <pre className="mt-2 max-h-32 overflow-auto font-mono text-[10px] text-muted-foreground">
                {error.stack}
              </pre>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bolo" },
      {
        name: "description",
        content:
          "Bolo is a citizen-facing prototype for reporting and tracking municipal issues on a live map.",
      },
      { property: "og:title", content: "Bolo" },
      {
        property: "og:description",
        content: "Report, explore and follow civic issues in your neighbourhood.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Gabarito:wght@500;600;700;800&family=Nunito+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        src: "https://verify.msg91.com/otp-provider.js",
        async: true,
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SessionGate>
          <LanguageProvider>
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
            <Toaster position="top-center" richColors />
          </LanguageProvider>
        </SessionGate>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function SessionGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isNavigatingRef = useRef(false);

  const isCreatingProfile =
    typeof window !== "undefined" &&
    window.sessionStorage?.getItem("bolo_is_creating_profile") === "true";

  useEffect(() => {
    if (loading) return;
    // Authenticated users on /auth go home unless they are currently filling their profile
    if (user && pathname === "/auth" && !isCreatingProfile && !isNavigatingRef.current) {
      isNavigatingRef.current = true;
      void navigate({ to: "/", replace: true }).finally(() => {
        isNavigatingRef.current = false;
      });
    }
    // Unauthenticated users on protected routes go to /auth
    if (!user && pathname !== "/auth" && pathname !== "/waitlist" && !isNavigatingRef.current) {
      isNavigatingRef.current = true;
      void navigate({ to: "/auth", replace: true }).finally(() => {
        isNavigatingRef.current = false;
      });
    }
  }, [loading, navigate, pathname, user, isCreatingProfile]);

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-4">
        <p className="text-sm font-semibold text-muted-foreground">Checking your Bolo session…</p>
      </div>
    );
  }

  if (!user && pathname !== "/auth" && pathname !== "/waitlist") {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-4">
        <p className="text-sm font-semibold text-muted-foreground">Redirecting to sign in…</p>
      </div>
    );
  }

  if (user && pathname === "/auth" && !isCreatingProfile) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-4">
        <p className="text-sm font-semibold text-muted-foreground">Redirecting to home…</p>
      </div>
    );
  }

  return <>{children}</>;
}

