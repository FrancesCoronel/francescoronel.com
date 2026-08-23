"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Cal?: {
      (...args: unknown[]): void;
      ns?: Record<string, (...args: unknown[]) => void>;
      q?: unknown[];
      loaded?: boolean;
    };
  }
}

export function CalEmbed() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load Cal.com embed script
    (function (C: Window, A: string, L: string) {
      const p = function (a: { q: unknown[] }, ar: unknown) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function (...args: unknown[]) {
          const cal = C.Cal!;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            const script = d.createElement("script");
            script.src = A;
            d.head.appendChild(script);
            cal.loaded = true;
          }
          if (args[0] === L) {
            const api = function (...apiArgs: unknown[]) {
              p(api as unknown as { q: unknown[] }, apiArgs);
            };
            const namespace = args[1] as string;
            (api as unknown as { q: unknown[] }).q = [];
            if (typeof namespace === "string") {
              cal.ns![namespace] =
                cal.ns![namespace] ||
                (api as unknown as (...a: unknown[]) => void);
              p(
                cal.ns![namespace] as unknown as { q: unknown[] },
                args
              );
              p(cal as unknown as { q: unknown[] }, [
                "initNamespace",
                namespace,
              ]);
            } else {
              p(cal as unknown as { q: unknown[] }, args);
            }
            return;
          }
          p(cal as unknown as { q: unknown[] }, args);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal!("init", "mentoring", { origin: "https://app.cal.com" });

    window.Cal!.ns!.mentoring("inline", {
      elementOrSelector: "#my-cal-inline-mentoring",
      config: {
        layout: "month_view",
        useSlotsViewOnSmallScreen: "true",
      },
      calLink: "francescoronel/mentoring",
    });

    window.Cal!.ns!.mentoring("ui", {
      cssVarsPerTheme: {
        light: { "cal-brand": "#171717" },
        dark: { "cal-brand": "#efb920" },
      },
      hideEventTypeDetails: false,
      layout: "month_view",
    });

    // Mark as loaded once the embed script fires
    const timer = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[600px] rounded-2xl">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-horchata-200 bg-horchata-50 dark:border-navy-700 dark:bg-navy-800">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-horchata-200 border-t-horchata-500 dark:border-navy-600 dark:border-t-horchata-400" />
          <p className="text-sm text-navy-600 dark:text-horchata-500">Loading calendar...</p>
        </div>
      )}
      <div
        id="my-cal-inline-mentoring"
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        className="min-h-[600px] rounded-2xl"
      />
    </div>
  );
}
