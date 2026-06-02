import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RoleShell, RED, RED_DARK } from "@/components/role/RoleShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import { Loader2, Plus, Flame, Clock, Target, AlertTriangle, BookOpen, UserPlus, FileText, ListChecks } from "lucide-react";
import {
  fetchMetricsFor, fmtMinutes, relativeTime, fullName, subjectLabel,
  type ChildProfile, type StudentMetrics,
} from "@/lib/studentMetrics";

const CHILD_FIELDS = "id, first_name, last_name, student_id, grade, section, current_streak, exam_board, last_session_date";

const ParentDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<StudentMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkId, setLinkId] = useState("");
  const [linking, setLinking] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: links } = await supabase.from("sia_parent_child").select("child_id").eq("parent_id", user.id);
      const childIds = ((links as any[]) || []).map((l) => l.child_id);
      if (childIds.length === 0) { setMetrics([]); return; }

      const { data: profiles } = await supabase.from("profiles").select(CHILD_FIELDS).in("id", childIds);
      const list = ((profiles as any[]) || []) as ChildProfile[];
      setMetrics(await fetchMetricsFor(list));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = linkId.trim();
    if (!id) { toast.error("Enter your child's Student ID."); return; }
    setLinking(true);
    try {
      const { data, error } = await (supabase.rpc as any)("sia_link_child", { p_student_id: id });
      if (error) throw error;
      const res = data as { ok: boolean; error?: string; child_name?: string };
      if (!res?.ok) { toast.error(res?.error || "Could not link that student."); return; }
      toast.success(`Linked to ${res.child_name || "your child"}.`);
      setLinkId("");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not link that student.");
    } finally {
      setLinking(false);
    }
  };

  return (
    <RoleShell role="parent" title="Parent Dashboard" subtitle="Follow your child's revision activity and progress.">
      <SEO title="Parent Dashboard — SIA Smart Revision" description="Monitor your child's revision at SIA." path="/parent" noindex />

      {/* Link a child */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm mb-8" style={{ borderColor: "#f0e0e2" }}>
        <div className="flex items-center gap-2 mb-3">
          <UserPlus className="h-5 w-5" style={{ color: RED }} />
          <h2 className="font-bold text-lg" style={{ color: RED_DARK }}>Link a child</h2>
        </div>
        <p className="text-sm mb-4" style={{ color: "#777" }}>
          Enter the Student ID your child set up on their account. You can add more than one child.
        </p>
        <form onSubmit={handleLink} className="flex flex-col sm:flex-row gap-3 max-w-md">
          <Input value={linkId} onChange={(e) => setLinkId(e.target.value)} placeholder="e.g. SIA-10234" className="h-11" maxLength={40} />
          <Button type="submit" disabled={linking} className="h-11 px-6 font-semibold text-white shrink-0" style={{ background: RED }}>
            {linking ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" /> Link child</>}
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" style={{ color: RED }} /></div>
      ) : metrics.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border bg-white" style={{ borderColor: "#f0e0e2" }}>
          <div className="text-4xl mb-3">👨‍👩‍👧</div>
          <p className="font-semibold" style={{ color: RED_DARK }}>No children linked yet</p>
          <p className="text-sm mt-1" style={{ color: "#999" }}>Add your child's Student ID above to see their progress here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {metrics.map((m) => <ChildCard key={m.profile.id} m={m} />)}
        </div>
      )}
    </RoleShell>
  );
};

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "#f0e0e2", background: "#fdf8f8" }}>
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#999" }}>
        {icon} {label}
      </div>
      <div className="text-2xl font-bold tabular-nums" style={{ color: RED_DARK }}>{value}</div>
    </div>
  );
}

function ChildCard({ m }: { m: StudentMetrics }) {
  const p = m.profile;
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "#f0e0e2" }}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>{fullName(p)}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: "#999" }}>
            <span className="px-2 py-0.5 rounded-full font-semibold" style={{ background: "#fce8eb", color: RED_DARK }}>
              {p.grade || "—"}{p.section ? ` · Sec ${p.section}` : ""}
            </span>
            <span>ID: {p.student_id || "—"}</span>
            <span>· Last active {relativeTime(m.lastActive)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: "#fff7ed", color: "#c2410c" }}>
          <Flame className="h-4 w-4" /> {p.current_streak ?? 0} day streak
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <Stat icon={<Clock className="h-3.5 w-3.5" />} label="This week" value={fmtMinutes(m.weekMinutes)} />
        <Stat icon={<Clock className="h-3.5 w-3.5" />} label="Total time" value={fmtMinutes(m.totalMinutes)} />
        <Stat icon={<Target className="h-3.5 w-3.5" />} label="Topic avg" value={m.avgScore != null ? `${m.avgScore}%` : "—"} />
        <Stat icon={<FileText className="h-3.5 w-3.5" />} label="Mock avg" value={m.mockAvgPct != null ? `${m.mockAvgPct}%` : "—"} />
        <Stat icon={<ListChecks className="h-3.5 w-3.5" />} label="Questions" value={String(m.questionsAttempted)} />
        <Stat icon={<AlertTriangle className="h-3.5 w-3.5" />} label="Weak topics" value={String(m.weakTopics)} />
      </div>

      {m.subjects.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#999" }}>
            <BookOpen className="h-3.5 w-3.5" /> Subjects & targets
          </div>
          <div className="flex flex-wrap gap-2">
            {m.subjects.map((s) => (
              <span key={s.subject} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ borderColor: "#f0e0e2", color: RED_DARK }}>
                {subjectLabel(s.subject)}
                <span className="text-[10px] font-mono" style={{ color: "#999" }}>{s.current_grade} → {s.target_grade}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs" style={{ color: "#bbb" }}>
        {m.weekSessions} session{m.weekSessions === 1 ? "" : "s"} this week · {m.mocksTaken} mock paper{m.mocksTaken === 1 ? "" : "s"}
        {m.mockBestGrade ? ` (best grade ${m.mockBestGrade})` : ""} · {m.questionsCorrect}/{m.questionsAttempted} questions correct · {m.topicsTracked} topics tracked
      </div>
    </div>
  );
}

export default ParentDashboard;
