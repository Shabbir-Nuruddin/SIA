import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RoleShell, RED, RED_DARK } from "@/components/role/RoleShell";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { Loader2, Search, Flame, Clock, Target, Users } from "lucide-react";
import {
  fetchMetricsFor, fmtMinutes, relativeTime, fullName, subjectLabel,
  YEAR_GROUPS, type ChildProfile, type StudentMetrics,
} from "@/lib/studentMetrics";

const STUDENT_FIELDS = "id, first_name, last_name, student_id, grade, current_streak, exam_board, last_session_date";

const TeacherDashboard = () => {
  const [metrics, setMetrics] = useState<StudentMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await supabase.from("profiles").select(STUDENT_FIELDS).eq("role", "student");
        const list = ((data as any[]) || []) as ChildProfile[];
        const m = await fetchMetricsFor(list);
        if (alive) setMetrics(m);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return metrics
      .filter((m) => gradeFilter === "all" || m.profile.grade === gradeFilter)
      .filter((m) =>
        !q ||
        fullName(m.profile).toLowerCase().includes(q) ||
        (m.profile.student_id || "").toLowerCase().includes(q))
      .sort((a, b) => fullName(a.profile).localeCompare(fullName(b.profile)));
  }, [metrics, gradeFilter, query]);

  // School-wide aggregates for the filtered set
  const summary = useMemo(() => {
    const n = filtered.length;
    const totalMin = filtered.reduce((a, m) => a + m.totalMinutes, 0);
    const scored = filtered.filter((m) => m.avgScore != null);
    const avg = scored.length ? Math.round(scored.reduce((a, m) => a + (m.avgScore || 0), 0) / scored.length) : null;
    const active = filtered.filter((m) => m.weekSessions > 0).length;
    return { n, totalMin, avg, active };
  }, [filtered]);

  const gradeCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of metrics) {
      const g = m.profile.grade || "Unassigned";
      map.set(g, (map.get(g) || 0) + 1);
    }
    return map;
  }, [metrics]);

  return (
    <RoleShell role="teacher" title="Teacher Dashboard" subtitle="Track every student's grade, progress and revision activity.">
      <SEO title="Teacher Dashboard — SIA Smart Revision" description="Monitor all SIA students' progress." path="/teacher" noindex />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <SummaryCard icon={<Users className="h-4 w-4" />} label="Students" value={String(summary.n)} />
        <SummaryCard icon={<Flame className="h-4 w-4" />} label="Active this week" value={String(summary.active)} />
        <SummaryCard icon={<Clock className="h-4 w-4" />} label="Total study time" value={fmtMinutes(summary.totalMin)} />
        <SummaryCard icon={<Target className="h-4 w-4" />} label="Avg score" value={summary.avg != null ? `${summary.avg}%` : "—"} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button onClick={() => setGradeFilter("all")}
          className="px-3.5 py-1.5 rounded-full text-sm font-semibold border-2 transition-all"
          style={{ borderColor: gradeFilter === "all" ? RED : "#e5e7eb", background: gradeFilter === "all" ? RED : "#fff", color: gradeFilter === "all" ? "#fff" : "#374151" }}>
          All grades ({metrics.length})
        </button>
        {YEAR_GROUPS.map((g) => (
          <button key={g} onClick={() => setGradeFilter(g)}
            className="px-3.5 py-1.5 rounded-full text-sm font-semibold border-2 transition-all"
            style={{ borderColor: gradeFilter === g ? RED : "#e5e7eb", background: gradeFilter === g ? RED : "#fff", color: gradeFilter === g ? "#fff" : "#374151" }}>
            {g} ({gradeCounts.get(g) || 0})
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#bbb" }} />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or ID" className="h-10 pl-9 w-56" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" style={{ color: RED }} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border bg-white" style={{ borderColor: "#f0e0e2" }}>
          <div className="text-4xl mb-3">🎓</div>
          <p className="font-semibold" style={{ color: RED_DARK }}>No students found</p>
          <p className="text-sm mt-1" style={{ color: "#999" }}>Students appear here once they sign up and set their Student ID.</p>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white overflow-hidden shadow-sm" style={{ borderColor: "#f0e0e2" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ background: "#fdf8f8", color: "#999" }}>
                  <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">Student</th>
                  <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">Grade</th>
                  <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">Subjects</th>
                  <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-right">Streak</th>
                  <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-right">This week</th>
                  <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-right">Avg score</th>
                  <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-right">Weak</th>
                  <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-right">Last active</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.profile.id} className="border-t" style={{ borderColor: "#f5ebec", background: i % 2 ? "#fff" : "#fffcfc" }}>
                    <td className="px-4 py-3">
                      <div className="font-semibold" style={{ color: RED_DARK }}>{fullName(m.profile)}</div>
                      <div className="text-xs" style={{ color: "#bbb" }}>{m.profile.student_id || "—"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#fce8eb", color: RED_DARK }}>{m.profile.grade || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {m.subjects.length === 0 ? <span style={{ color: "#ccc" }}>—</span> :
                          m.subjects.map((s) => (
                            <span key={s.subject} className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: "#f0e0e2", color: "#666" }}>
                              {subjectLabel(s.subject)} <span className="font-mono" style={{ color: "#bbb" }}>{s.target_grade}</span>
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{m.profile.current_streak ?? 0}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtMinutes(m.weekMinutes)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold" style={{ color: m.avgScore != null && m.avgScore < 50 ? RED : "#444" }}>
                      {m.avgScore != null ? `${m.avgScore}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums" style={{ color: m.weakTopics > 0 ? "#c2410c" : "#ccc" }}>{m.weakTopics}</td>
                    <td className="px-4 py-3 text-right text-xs" style={{ color: "#999" }}>{relativeTime(m.lastActive)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </RoleShell>
  );
};

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: "#f0e0e2" }}>
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#999" }}>
        <span style={{ color: RED }}>{icon}</span> {label}
      </div>
      <div className="text-2xl font-bold tabular-nums" style={{ color: RED_DARK }}>{value}</div>
    </div>
  );
}

export default TeacherDashboard;
