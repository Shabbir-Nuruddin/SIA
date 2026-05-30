import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/AppLayout";
import { Loader2, Rocket, RefreshCw, ArrowLeft, TrendingUp, Users, CreditCard, Activity } from "lucide-react";
import { isAdminEmail } from "@/lib/admin";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  email: string;
  is_pro: boolean;
  subscription_status: string | null;
  created_at: string;
  study_minutes: number;
}

// Approx Pro price (AED / month). Used for MRR estimate.
const PRO_PRICE_AED = 39.99;

const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

export default function AdminLaunch() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-list-users");
      if (error || data?.error) throw new Error(error?.message || data?.error);
      setUsers(data.users || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load metrics.");
    } finally { setBusy(false); }
  };

  useEffect(() => { if (user) load(); }, [user]);

  if (loading) return <AppLayout><div className="p-10"><Loader2 className="h-6 w-6 animate-spin" /></div></AppLayout>;
  if (!user || !isAdminEmail(user.email)) return <Navigate to="/dashboard" replace />;

  const now = new Date();
  const today = startOfDay(now);
  const dayMs = 86_400_000;

  const totalUsers = users.length;
  const signupsToday = users.filter(u => startOfDay(new Date(u.created_at)).getTime() === today.getTime()).length;
  const signupsWeek = users.filter(u => (now.getTime() - new Date(u.created_at).getTime()) <= 7 * dayMs).length;
  const activeSubs = users.filter(u => u.is_pro).length;
  const cancelled = users.filter(u => (u.subscription_status || "").toLowerCase() === "cancelled" || (u.subscription_status || "").toLowerCase() === "canceled").length;
  const churnRate = activeSubs + cancelled > 0 ? (cancelled / (activeSubs + cancelled)) * 100 : 0;
  const mrrAED = activeSubs * PRO_PRICE_AED;
  const active7d = users.filter(u => u.study_minutes > 0 && (now.getTime() - new Date(u.created_at).getTime()) <= 7 * dayMs).length;
  const conversionPct = totalUsers > 0 ? (activeSubs / totalUsers) * 100 : 0;

  // Growth chart — cumulative users by day across last 30 days
  const days = 30;
  const chartData: { date: string; users: number; new: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * dayMs);
    const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    const newOnDay = users.filter(u => startOfDay(new Date(u.created_at)).getTime() === d.getTime()).length;
    const cumulative = users.filter(u => new Date(u.created_at).getTime() <= d.getTime() + dayMs - 1).length;
    chartData.push({ date: label, users: cumulative, new: newOnDay });
  }

  const tiles = [
    { label: "Total users", value: totalUsers, icon: Users, sub: "All-time" },
    { label: "Sign-ups today", value: signupsToday, icon: TrendingUp, sub: "Since 00:00 local" },
    { label: "Sign-ups this week", value: signupsWeek, icon: TrendingUp, sub: "Last 7 days" },
    { label: "Active subscribers", value: activeSubs, icon: CreditCard, sub: `${conversionPct.toFixed(1)}% conversion` },
    { label: "MRR (AED)", value: `AED ${mrrAED.toFixed(2)}`, icon: Rocket, sub: `${activeSubs} × AED ${PRO_PRICE_AED}` },
    { label: "Churn rate", value: `${churnRate.toFixed(1)}%`, icon: Activity, sub: `${cancelled} cancelled` },
    { label: "Active this week", value: active7d, icon: Activity, sub: "Logged study time" },
    { label: "Free users", value: totalUsers - activeSubs, icon: Users, sub: "Upgrade pipeline" },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2">
              <ArrowLeft className="h-3 w-3" /> Back to Admin
            </Link>
            <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-widest">
              <Rocket className="h-3.5 w-3.5" /> Launch Command Center
            </div>
            <h1 className="text-3xl font-extrabold mt-1">First 30 Days — Business Metrics</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign-ups, subscribers, MRR and growth in one place.</p>
          </div>
          <Button variant="outline" onClick={load} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </header>

        {/* KPI tiles */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tiles.map(t => {
            const Icon = t.icon;
            return (
              <div key={t.label} className="rounded-2xl border border-border/70 bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{t.label}</div>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold mt-2 tabular">{t.value}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{t.sub}</div>
              </div>
            );
          })}
        </section>

        {/* Growth chart */}
        <section className="surface p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2"><TrendingUp className="h-4 w-4" /> User Growth — Last 30 Days</h2>
              <p className="text-xs text-muted-foreground mt-1">Cumulative total users + daily new sign-ups.</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.4)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={Math.floor(days / 8)} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="users" stroke="hsl(160 65% 45%)" strokeWidth={2.5} dot={false} name="Total users" />
                <Line type="monotone" dataKey="new" stroke="hsl(43 70% 58%)" strokeWidth={2} dot={false} name="New / day" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <p className="text-[11px] text-muted-foreground italic">
          MRR is estimated using Pro tier price (AED {PRO_PRICE_AED}/month). Churn is computed from subscribers with subscription_status = cancelled. Refresh after major launch moments to track momentum.
        </p>
      </div>
    </AppLayout>
  );
}
