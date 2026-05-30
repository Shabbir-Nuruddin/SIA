import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { isAdminEmail } from "@/lib/admin";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Loader2 } from "lucide-react";

interface EventRow {
  id: number;
  event_name: string;
  user_id: string | null;
  path: string | null;
  created_at: string;
  properties: Record<string, unknown> | null;
}

interface EmailRow {
  id: string;
  email: string;
  email_number: number;
  status: string;
  scheduled_for: string;
  sent_at: string | null;
}

const RANGES: Record<string, number> = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
};

const AdminAnalytics = () => {
  const { user, loading } = useAuth();
  const [range, setRange] = useState<keyof typeof RANGES>("7d");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [emails, setEmails] = useState<EmailRow[]>([]);
  const [busy, setBusy] = useState(false);

  const since = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - RANGES[range]);
    return d.toISOString();
  }, [range]);

  useEffect(() => {
    if (loading || !user || !isAdminEmail(user.email)) return;
    setBusy(true);
    (async () => {
      const [evRes, emRes] = await Promise.all([
        supabase
          .from("analytics_events")
          .select("id,event_name,user_id,path,created_at,properties")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(2000),
        supabase
          .from("onboarding_emails")
          .select("id,email,email_number,status,scheduled_for,sent_at")
          .order("created_at", { ascending: false })
          .limit(200),
      ]);
      setEvents((evRes.data ?? []) as EventRow[]);
      setEmails((emRes.data ?? []) as EmailRow[]);
      setBusy(false);
    })();
  }, [loading, user, since]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }
  if (!user || !isAdminEmail(user.email)) return <Navigate to="/dashboard" replace />;

  const counts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.event_name] = (acc[e.event_name] ?? 0) + 1;
    return acc;
  }, {});
  const uniqueUsers = new Set(events.map((e) => e.user_id).filter(Boolean)).size;
  const pageViews = counts["page_view"] ?? 0;
  const signUps = counts["sign_up"] ?? 0;
  const checkoutStarts = counts["begin_checkout"] ?? 0;
  const conversions = counts["subscription_activated"] ?? 0;

  const topPaths = Object.entries(
    events
      .filter((e) => e.event_name === "page_view" && e.path)
      .reduce<Record<string, number>>((acc, e) => {
        acc[e.path!] = (acc[e.path!] ?? 0) + 1;
        return acc;
      }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const featureEvents = Object.entries(counts)
    .filter(([k]) => !["page_view", "sign_up", "sign_in_attempt", "begin_checkout", "checkout_failed", "subscription_activated"].includes(k))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  return (
    <AppLayout>
      <div className="px-6 py-8 md:px-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <Link to="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to admin
            </Link>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="h-7 w-7 text-primary" /> Analytics
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Mirrored from Google Analytics 4 (live in your GA dashboard) and logged to your database for in-app reporting.
            </p>
          </div>
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
            {(Object.keys(RANGES) as Array<keyof typeof RANGES>).map((k) => (
              <Button
                key={k}
                size="sm"
                variant={range === k ? "default" : "ghost"}
                onClick={() => setRange(k)}
              >
                {k}
              </Button>
            ))}
          </div>
        </div>

        {busy ? (
          <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              <Stat label="Page views" value={pageViews} />
              <Stat label="Unique users" value={uniqueUsers} />
              <Stat label="Sign-ups" value={signUps} />
              <Stat label="Checkouts started" value={checkoutStarts} />
              <Stat label="Conversions" value={conversions} accent />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <Card className="p-5">
                <h2 className="font-display text-lg font-semibold">Top pages</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {topPaths.length === 0 && <li className="text-muted-foreground">No views in this range.</li>}
                  {topPaths.map(([path, n]) => (
                    <li key={path} className="flex items-center justify-between gap-3">
                      <span className="truncate text-foreground/90">{path}</span>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">{n}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-5">
                <h2 className="font-display text-lg font-semibold">Feature usage</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {featureEvents.length === 0 && <li className="text-muted-foreground">No feature events yet — instrument with trackEvent().</li>}
                  {featureEvents.map(([name, n]) => (
                    <li key={name} className="flex items-center justify-between gap-3">
                      <span className="text-foreground/90">{name}</span>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">{n}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card className="mt-8 p-5">
              <h2 className="font-display text-lg font-semibold">Onboarding email pipeline</h2>
              <p className="mt-1 text-sm text-muted-foreground">Latest 200 scheduled welcome emails (5-email sequence over 14 days).</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr><th className="py-2 pr-3">Recipient</th><th className="py-2 pr-3">#</th><th className="py-2 pr-3">Status</th><th className="py-2 pr-3">Scheduled</th><th className="py-2 pr-3">Sent</th></tr>
                  </thead>
                  <tbody>
                    {emails.map((e) => (
                      <tr key={e.id} className="border-t border-border/60">
                        <td className="py-2 pr-3 font-mono text-xs">{e.email}</td>
                        <td className="py-2 pr-3">{e.email_number}</td>
                        <td className="py-2 pr-3">
                          <span className={
                            "inline-flex rounded-full px-2 py-0.5 text-xs " +
                            (e.status === "sent" ? "bg-primary/15 text-primary"
                              : e.status === "failed" ? "bg-destructive/15 text-destructive"
                              : "bg-muted text-muted-foreground")
                          }>{e.status}</span>
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground">{new Date(e.scheduled_for).toLocaleString()}</td>
                        <td className="py-2 pr-3 text-muted-foreground">{e.sent_at ? new Date(e.sent_at).toLocaleString() : "—"}</td>
                      </tr>
                    ))}
                    {emails.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No onboarding emails yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </Card>

            <p className="mt-6 text-xs text-muted-foreground">
              Need deeper reports? Open{" "}
              <a className="underline" href="https://analytics.google.com/" target="_blank" rel="noreferrer">Google Analytics</a>{" "}
              — measurement ID <code className="font-mono">G-V21JTY66DQ</code>.
            </p>
          </>
        )}
      </div>
    </AppLayout>
  );
};

const Stat = ({ label, value, accent }: { label: string; value: number; accent?: boolean }) => (
  <Card className={"p-4 " + (accent ? "border-primary/40 bg-primary/5" : "")}>
    <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="mt-1 font-display text-3xl font-bold tabular-nums">{value.toLocaleString()}</div>
  </Card>
);

export default AdminAnalytics;
