import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";
import { Trash2, Loader2, Shield, Eye, MessageSquare, KeyRound, RefreshCw } from "lucide-react";
import { ADMIN_EMAIL, useTestMode } from "@/lib/admin";

interface Modifier { id: string; feature: string; board: string; instruction: string; created_at: string; is_active: boolean; }
interface FeedbackRow { id: string; created_at: string; user_id: string | null; message: string; rating: number | null; user_email?: string | null; }

const Admin = () => {
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [testMode, setTestMode] = useTestMode();

  useEffect(() => {
    if (!user) return;
    (supabase.from("admin_ai_modifiers") as any).select("*").order("created_at", { ascending: false })
      .then(({ data }: any) => { if (data) setModifiers(data); });
    (supabase.from("feedback_tickets") as any).select("id,created_at,user_id,subject,message,rating").order("created_at", { ascending: false }).limit(200)
      .then(({ data }: any) => {
        if (data) setFeedback(data.map((d: any) => ({ ...d, message: `${d.subject ? `[${d.subject}] ` : ""}${d.message || ""}` })));
      });
  }, [user]);

  if (loading) return <AppLayout><div className="p-10"><Loader2 className="h-6 w-6 animate-spin" /></div></AppLayout>;
  if (!user || (user.email || "").toLowerCase() !== ADMIN_EMAIL) return <Navigate to="/dashboard" replace />;

  const clearCache = async (target: "notes" | "faq" | "questions") => {
    if (!confirm(`Clear ALL ${target} cache? This cannot be undone.`)) return;
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
        <header className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-widest"><Shield className="h-3.5 w-3.5" /> Admin Panel</div>
            <h1 className="text-3xl font-extrabold mt-1">Make Me Revise — Control Room</h1>
            <p className="text-muted-foreground text-sm mt-1">Visible only to {ADMIN_EMAIL}.</p>
          </div>
          <Button
            variant={testMode ? "default" : "outline"}
            onClick={() => setTestMode(!testMode)}
            className={testMode ? "bg-accent text-accent-foreground" : ""}
          >
            <Eye className="h-4 w-4 mr-2" />{testMode ? "Disable Test Mode" : "Enable Test Mode"}
          </Button>
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
