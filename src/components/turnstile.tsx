import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          action?: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "error-callback"?: (error?: unknown) => void;
          "expired-callback"?: () => void;
          appearance?: "always" | "execute" | "interaction-only";
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

export interface TurnstileRef {
  reset: () => void;
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: (err?: unknown) => void;
  onExpire?: () => void;
  action?: string;
  className?: string;
}

export const TurnstileWidget = forwardRef<TurnstileRef, TurnstileWidgetProps>(
  ({ onVerify, onError, onExpire, action, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const siteKey = (import.meta.env["VITE_TURNSTILE_SITE_KEY"] as string | undefined)?.trim();
    const [isDevFallback, setIsDevFallback] = useState(!siteKey);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        } else if (!siteKey) {
          onVerify("dev-bypass-turnstile-token");
        }
      },
    }));

    useEffect(() => {
      if (!siteKey) {
        setIsDevFallback(true);
        // Automatically provide bypass token in local dev environment
        onVerify("dev-bypass-turnstile-token");
        return;
      }

      setIsDevFallback(false);

      const renderWidget = () => {
        if (!containerRef.current || !window.turnstile) return;
        if (widgetIdRef.current) return;

        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            action: action || "auth",
            theme: "auto",
            callback: (token: string) => {
              onVerify(token);
            },
            "error-callback": (err: unknown) => {
              console.warn("[Turnstile] Challenge error:", err);
              onError?.(err);
            },
            "expired-callback": () => {
              onExpire?.();
            },
          });
        } catch (e) {
          console.warn("[Turnstile] Render error:", e);
        }
      };

      // Check if turnstile script is already present
      if (window.turnstile) {
        renderWidget();
      } else {
        const existingScript = document.querySelector('script[src*="turnstile/v0/api.js"]');
        if (!existingScript) {
          const script = document.createElement("script");
          script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
          script.async = true;
          script.defer = true;
          script.onload = () => {
            renderWidget();
          };
          document.head.appendChild(script);
        } else {
          existingScript.addEventListener("load", renderWidget);
        }
      }

      return () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // Widget might already be removed
          }
          widgetIdRef.current = null;
        }
      };
    }, [siteKey, action, onVerify, onError, onExpire]);

    if (isDevFallback) {
      return (
        <div className={`text-xs text-muted-foreground/70 flex items-center justify-center gap-1.5 py-1 ${className || ""}`}>
          <span className="inline-block size-2 rounded-full bg-emerald-500/70" />
          <span>Security Guard Active</span>
        </div>
      );
    }

    return (
      <div className={`flex justify-center items-center my-2 ${className || ""}`}>
        <div ref={containerRef} className="cf-turnstile" />
      </div>
    );
  },
);

TurnstileWidget.displayName = "TurnstileWidget";
