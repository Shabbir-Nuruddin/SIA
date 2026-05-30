import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_ID = "G-V21JTY66DQ";

let gaReady = false;

export function initAnalytics() {
  if (gaReady || typeof window === "undefined") return;
  gaReady = true;

  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s1);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
}

export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined") return;
  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: title ?? document.title,
      page_location: window.location.href,
    });
  }
  void supabase
    .from("analytics_events")
    .insert({ event_name: "page_view", path, properties: { title: title ?? document.title } });
}

export function trackEvent(
  name: string,
  properties: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;
  if (window.gtag) {
    window.gtag("event", name, properties);
  }
  void supabase.from("analytics_events").insert({
    event_name: name,
    path: typeof window !== "undefined" ? window.location.pathname : null,
    properties: properties as never,
  });
}
