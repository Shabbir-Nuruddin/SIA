import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { confirmDialog } from "@/components/ui/confirm";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";
import { Trash2, Loader2, Shield, Eye, MessageSquare, KeyRound, RefreshCw, Rocket, Users, BarChart3, Search, UserX } from "lucide-react";
import { ADMIN_EMAILS, isAdminEmail, useTestMode } from "@/lib/admin";

interface Modifier { id: string; feature: string; board: string; instruction: string; created_at: string; is_active: boolean; }
interface FeedbackRow { id: string; created_at: string; user_id: string | null; message: string; rating: number | null; user_email?: string | null; }
interface AdminUser { id: string; email: string; display_name: string | null; is_pro: boolean; plan: string | null; subscription_status: string | null; created_at: string; study_minutes: number; }

const Admin = () => {
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [testMode, setTestMode] = useTestMode();
  const [keyStatus, setKeyStatus] = useState<any>(null);
  const [keyLoading, setKeyLoading] = useState(false);
  const [redeployResult, setRedeployResult] = useState<{ name: string; ok: boolean; status: number; ms: number }[] | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersStats, setUsersStats] = useState<{ total: number; pro: number } | null>(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-list-users");
      if (error || data?.error) throw new Error(error?.message || data?.error);
      setUsers(data.users || []);
      setUsersStats({ total: data.total ?? 0, pro: data.pro ?? 0 });
    } catch (e: any) {
      toast.error(e.message || "Failed to load users.");
    } finally { setUsersLoading(false); }
  };

  const deleteUser = async (u: AdminUser) => {
    if (!(await confirmDialog({ title: `Hard delete ${u.email || u.id}?`, description: "This removes their account and ALL their data (roadmap, mocks, notes, progress). Cannot be undone.", confirmText: "Delete user", destructive: true }))) return;
    setDeletingUserId(u.id);
    try {
      const { data, error } = await supabase.functions.invoke("admin-delete-user", { body: { user_id: u.id } });
      if (error || data?.error) throw new Error(error?.message || data?.error);
      setUsers(prev => prev.filter(x => x.id !== u.id));
      setUsersStats(s => s ? { total: Math.max(0, s.total - 1), pro: s.pro - (u.is_pro ? 1 : 0) } : s);
      toast.success("Account deleted.");
    } catch (e: any) {
      toast.error(e.message || "Delete failed.");
    } finally { setDeletingUserId(null); }
  };

  const redeployAll = async () => {
    if (!(await confirmDialog({ title: "Warm & health-check all edge functions?", description: "This pings every function with a no-op so cold instances spin up.", confirmText: "Run" }))) return;
    setBusy("redeploy");
    setRedeployResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("admin-redeploy-functions");
      if (error || data?.error) throw new Error(error?.message || data?.error);
      setRedeployResult(data.results || []);
      const failed = (data.results || []).filter((r: any) => !r.ok).length;
      if (failed === 0) toast.success(`All ${data.results.length} edge functions are live.`);
      else toast.warning(`${data.results.length - failed}/${data.results.length} live — ${failed} unhealthy.`);
    } catch (e: any) {
      toast.error(e.message || "Redeploy check failed.");
    } finally { setBusy(null); }
  };

  const loadKeyStatus = async () => {
    setKeyLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-ai-keys");
      if (error) throw error;
      setKeyStatus(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to load key status.");
    } finally { setKeyLoading(false); }
  };

  useEffect(() => {
    if (!user) return;
    (supabase.from("admin_ai_modifiers") as any).select("*").order("created_at", { ascending: false })
      .then(({ data }: any) => { if (data) setModifiers(data); });
    (supabase.from("feedback_tickets") as any).select("id,created_at,user_id,subject,message,rating").order("created_at", { ascending: false }).limit(200)
      .then(({ data }: any) => {
        if (data) setFeedback(data.map((d: any) => ({ ...d, message: `${d.subject ? `[${d.subject}] ` : ""}${d.message || ""}` })));
      });
    loadKeyStatus();
    loadUsers();
  }, [user]);

  if (loading) return <AppLayout><div className="p-10"><Loader2 className="h-6 w-6 animate-spin" /></div></AppLayout>;
  if (!user || !isAdminEmail(user.email)) return <Navigate to="/dashboard" replace />;

  const clearCache = async (target: "notes" | "faq" | "questions") => {
    if (!(await confirmDialog({ title: `Clear all ${target} cache?`, description: "This cannot be undone.", confirmText: "Clear cache", destructive: true }))) return;
    setBusy(`clear-${target}`);
    try {
      const { data, error } = await supabase.functions.invoke("admin-cache-clear", { body: { target } });
      if (error || data?.error) throw new Error(error?.message || data?.error);
      toast.success(`Cleared ${data.deleted} rows from ${data.table}.`);
    } catch (e: any) {
      toast.error(e.message || "Failed to clear cache.");
    } finally { setBusy(null); }
  };

  const removeModifier = async (id: string) => {
    await supabase.from("admin_ai_modifiers").update({ is_active: false }).eq("id", id);
    setModifiers(m => m.map(x => x.id === id ? { ...x, is_active: false } : x));
    toast.success("Modifier removed.");
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-widest"><Shield className="h-3.5 w-3.5" /> Admin Panel</div>
            <h1 className="text-3xl font-extrabold mt-1">SIA Smart Revision — Control Room</h1>
            <p className="text-muted-foreground text-sm mt-1">Visible to: {ADMIN_EMAILS.join(", ")}.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/admin/launch">
              <Button variant="outline"><Rocket className="h-4 w-4 mr-2" />Launch Dashboard</Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline"><BarChart3 className="h-4 w-4 mr-2" />Analytics</Button>
            </Link>
            <Button
              variant={testMode ? "default" : "outline"}
              onClick={() => setTestMode(!testMode)}
              className={testMode ? "bg-accent text-accent-foreground" : ""}
            >
              <Eye className="h-4 w-4 mr-2" />{testMode ? "Disable Test Mode" : "Enable Test Mode"}
            </Button>
          </div>
        </header>

        {/* Section A — Cache controls */}
        <section className="surface p-6">
          <h2 className="text-lg font-bold mb-1">Cache Controls</h2>
          <p className="text-xs text-muted-foreground mb-4">Wipe cached AI content. Next student access will trigger fresh generation.</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {(["notes", "faq", "questions"] as const).map(t => (
              <Button key={t} variant="outline" disabled={busy === `clear-${t}`} onClick={() => clearCache(t)} className="h-auto py-4 flex-col items-start text-left">
                {busy === `clear-${t}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-urgent" />}
                <span className="font-semibold mt-2 capitalize">Clear {t} Cache</span>
              </Button>
            ))}
          </div>
        </section>

        {/* Edge functions redeploy / warm */}
        <section className="surface p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold flex items-center gap-2"><Rocket className="h-4 w-4" /> Edge Functions</h2>
            <Button size="sm" onClick={redeployAll} disabled={busy === "redeploy"}>
              {busy === "redeploy" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
              Warm / Health Check All
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Pings every edge function in parallel to wake cold instances and verify health. Code deploys through Lovable Cloud, while this button confirms the live functions are reachable.
          </p>
          {redeployResult && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
              {redeployResult.map(r => (
                <div key={r.name} className={`text-xs font-mono flex items-center justify-between px-2 py-1.5 rounded border ${r.ok ? "border-primary/30 bg-primary/5" : "border-urgent/40 bg-urgent/5"}`}>
                  <span className="truncate">{r.name}</span>
                  <span className={r.ok ? "text-primary" : "text-urgent"}>{r.status} · {r.ms}ms</span>
                </div>
              ))}
            </div>
          )}
        </section>


        {/* AI Key Rotation */}
        <section className="surface p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold flex items-center gap-2"><KeyRound className="h-4 w-4" /> Gemini API Key Rotation</h2>
            <Button size="sm" variant="ghost" onClick={loadKeyStatus} disabled={keyLoading}>
              {keyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            When a key hits its rate limit the backend rotates to the next one automatically and wraps back to the first when all are exhausted.
          </p>
          {!keyStatus ? (
            <p className="text-sm text-muted-foreground italic">{keyLoading ? "Loading…" : "—"}</p>
          ) : keyStatus.totalKeys === 0 ? (
            <p className="text-sm text-urgent">No Gemini keys configured. Add GEMINI_API_KEY (and GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3, …) in secrets, then redeploy the edge functions.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
                <div><span className="text-muted-foreground">Active:</span> <span className="font-mono font-bold text-primary">{keyStatus.currentKeyName}</span> ({keyStatus.currentIndex + 1}/{keyStatus.totalKeys})</div>
                {keyStatus.lastRotatedAt && (
                  <div className="text-xs text-muted-foreground">Last rotation: {new Date(keyStatus.lastRotatedAt).toLocaleString()}</div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {keyStatus.keyNames.map((n: string, i: number) => (
                  <span key={n} className={`px-2 py-1 rounded text-xs font-mono border ${i === keyStatus.currentIndex ? "bg-primary/15 border-primary text-primary" : "border-border text-muted-foreground"}`}>
                    {i + 1}. {n}{i === keyStatus.currentIndex ? " ●" : ""}
                  </span>
                ))}
              </div>
              {keyStatus.lastError && (
                <p className="text-xs text-urgent/80 font-mono break-all">Last error: {keyStatus.lastError}</p>
              )}
            </div>
          )}
        </section>

        {/* Engagement Overview — quick analytics snapshot */}
        <section className="surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Engagement Overview</h2>
            <Button size="sm" variant="ghost" onClick={loadUsers} disabled={usersLoading}>
              {usersLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
          {(() => {
            const total = usersStats?.total ?? 0;
            const pro = usersStats?.pro ?? 0;
            const active7d = users.filter(u => u.study_minutes > 0).length;
            const totalStudyMin = users.reduce((a, u) => a + (u.study_minutes || 0), 0);
            const avgMin = total > 0 ? Math.round(totalStudyMin / total) : 0;
            const convPct = total > 0 ? Math.round((pro / total) * 100) : 0;
            const newLast7 = users.filter(u => (Date.now() - new Date(u.created_at).getTime()) / 86400000 <= 7).length;
            const tiles = [
              { label: "Total students", value: total },
              { label: "Pro subscribers", value: pro, sub: `${convPct}% conversion` },
              { label: "Active (logged study)", value: active7d },
              { label: "New (7d)", value: newLast7 },
              { label: "Avg study / student", value: `${avgMin}m` },
              { label: "Total study logged", value: `${Math.round(totalStudyMin / 60)}h` },
            ];
            return (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {tiles.map(t => (
                  <div key={t.label} className="rounded-xl border border-border/70 bg-card p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{t.label}</div>
                    <div className="text-2xl font-bold mt-1 tabular">{t.value}</div>
                    {t.sub && <div className="text-[10px] text-muted-foreground mt-0.5">{t.sub}</div>}
                  </div>
                ))}
              </div>
            );
          })()}
        </section>

        {/* User Management — view, search, hard delete */}
        <section className="surface p-6">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h2 className="text-lg font-bold flex items-center gap-2"><Users className="h-4 w-4" /> User Management</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search email or name…"
                className="pl-8 pr-3 py-1.5 text-sm rounded-md border border-border bg-background w-64"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Hard delete removes the account and ALL of their data (roadmap, mocks, notes, progress). Admins are protected.</p>
          {usersLoading ? (
            <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No users loaded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-3">Email</th>
                    <th className="text-left py-2 pr-3">Name</th>
                    <th className="text-left py-2 pr-3">Plan</th>
                    <th className="text-left py-2 pr-3">Study</th>
                    <th className="text-left py-2 pr-3">Joined</th>
                    <th className="text-right py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(u => {
                      const q = userSearch.trim().toLowerCase();
                      if (!q) return true;
                      return (u.email || "").toLowerCase().includes(q) || (u.display_name || "").toLowerCase().includes(q);
                    })
                    .slice(0, 200)
                    .map(u => {
                      const isAdmin = isAdminEmail(u.email);
                      return (
                        <tr key={u.id} className="border-b border-border/50 align-middle">
                          <td className="py-2 pr-3 font-mono text-xs truncate max-w-[220px]">{u.email || u.id.slice(0, 8)}</td>
                          <td className="py-2 pr-3">{u.display_name || "—"}</td>
                          <td className="py-2 pr-3">
                            {isAdmin ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-accent/15 text-accent uppercase">Admin</span>
                            ) : u.is_pro ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-primary/15 text-primary uppercase">Pro</span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-secondary text-muted-foreground uppercase">Free</span>
                            )}
                          </td>
                          <td className="py-2 pr-3 font-mono tabular text-xs">{u.study_minutes}m</td>
                          <td className="py-2 pr-3 font-mono text-xs whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="py-2 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isAdmin || deletingUserId === u.id}
                              onClick={() => deleteUser(u)}
                              className="text-urgent hover:bg-urgent/10 h-7 px-2"
                              title={isAdmin ? "Admins cannot be deleted here" : "Hard delete"}
                            >
                              {deletingUserId === u.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserX className="h-3.5 w-3.5" />}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Active modifiers */}
        <section className="surface p-6">
          <h2 className="text-lg font-bold mb-1">Active AI Modifiers</h2>
          <p className="text-xs text-muted-foreground mb-4">Persistent instructions appended to AI prompts. Add new ones from the Notes / FAQ pages.</p>
          {modifiers.filter(m => m.is_active).length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No active modifiers.</p>
          ) : (
            <div className="space-y-2">
              {modifiers.filter(m => m.is_active).map(m => (
                <div key={m.id} className="flex items-start gap-3 p-3 rounded-md border border-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-2 text-[10px] font-mono uppercase tracking-wider mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary">{m.feature}</span>
                      <span className="px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{m.board}</span>
                    </div>
                    <p className="text-sm">{m.instruction}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeModifier(m.id)} className="text-urgent hover:bg-urgent/10">
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Feedback */}
        <section className="surface p-6">
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Feedback Submissions</h2>
          <p className="text-xs text-muted-foreground mb-4">{feedback.length} entries — newest first.</p>
          {feedback.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No feedback yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                  <tr className="border-b border-border"><th className="text-left py-2 pr-3">Date</th><th className="text-left py-2 pr-3">User</th><th className="text-left py-2 pr-3">Rating</th><th className="text-left py-2">Message</th></tr>
                </thead>
                <tbody>
                  {feedback.map(f => (
                    <tr key={f.id} className="border-b border-border/50 align-top">
                      <td className="py-2 pr-3 font-mono text-xs whitespace-nowrap">{new Date(f.created_at).toLocaleString()}</td>
                      <td className="py-2 pr-3 font-mono text-xs">{f.user_id?.slice(0, 8) || "—"}</td>
                      <td className="py-2 pr-3">{f.rating ?? "—"}</td>
                      <td className="py-2 whitespace-pre-wrap">{f.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <Link to="/dashboard" className="inline-block text-xs text-primary hover:underline">← Back to dashboard</Link>
      </div>
    </AppLayout>
  );
};

export default Admin;
