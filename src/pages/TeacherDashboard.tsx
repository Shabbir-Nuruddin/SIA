import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Activity, Target, AlertTriangle, TrendingDown, ChevronDown } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { format, subDays, differenceInDays } from "date-fns";

const SIA_LOGO = "https://sia.ae/wp-content/uploads/2022/03/cropped-sia-sub-logo-2-270x270.png";
const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME ?? "Scholars International Academy";

interface StudentRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}
interface SessionRow {
  user_id: string;
  subject: string | null;
  topic: string | null;
  duration_minutes: number | null;
  mock_attempted: boolean | null;
  mock_score: number | null;
  session_date: string | null;
  created_at: string;
}
interface WeakRow {
  student_id: string;
  subject: string;
  topic: string;
  weakness_score: number;
}

const StatCard = ({ icon: Icon, label, value, color, sub }: {
  icon: any; label: string; value: string | number; color: string; sub?: string;
}) => (
  <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(27,42,74,0.07)" }}>
    <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
      <Icon className="h-6 w-6" style={{ color }} />
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B7280" }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: "#1B2A4A" }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: "#9CA3AF" }}>{sub}</p>}
    </div>
  </div>
);

const scoreBadge = (score: number | null) => {
  if (score == null) return <span style={{ color: "#9CA3AF" }}>—</span>;
  const color = score >= 70 ? "#2E7D32" : score >= 50 ? "#D97706" : "#DC2626";
  return <span className="font-bold" style={{ color }}>{score}%</span>;
};

const TeacherDashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [weakTopics, setWeakTopics] = useState<WeakRow[]>([]);
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    supabase
      .from("teacher_class_links")
      .select("student_id, subject, year_group")
      .eq("teacher_id", user.id)
      .then(async ({ data: links, error: le }) => {
        if (le) { setError("Failed to load class data."); setLoading(false); return; }
        const studentIds = [...new Set((links ?? []).map(l => l.student_id))];
        if (!studentIds.length) { setLoading(false); return; }

        const [profRes, sessRes, weakRes] = await Promise.all([
          supabase.from("profiles").select("id,first_name,last_name,email").in("id", studentIds),
          supabase.from("study_sessions").select("user_id,subject,topic,duration_minutes,mock_attempted,mock_score,session_date,created_at").in("user_id", studentIds).order("created_at", { ascending: false }),
          supabase.from("weak_topics").select("student_id,subject,topic,weakness_score").in("student_id", studentIds),
        ]);

        setStudents((profRes.data ?? []) as StudentRow[]);
        setSessions((sessRes.data ?? []) as SessionRow[]);
        setWeakTopics((weakRes.data ?? []) as WeakRow[]);
        setLoading(false);
      });
  }, [user]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" style={{ color: "#1B2A4A" }} /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (profile?.role !== "teacher") return <Navigate to="/dashboard" replace />;
  if (!profile.approved) return <Navigate to="/auth/pending-approval" replace />;

  // ── Analytics ─────────────────────────────────────────────────────────────
  const filteredSessions = subjectFilter === "all"
    ? sessions
    : sessions.filter(s => s.subject === subjectFilter);

  const allSubjects = [...new Set(sessions.map(s => s.subject).filter(Boolean))] as string[];

  const weekAgo = subDays(new Date(), 7);
  const activeThisWeek = new Set(
    sessions.filter(s => s.created_at && new Date(s.created_at) >= weekAgo).map(s => s.user_id)
  ).size;

  const mocksWithScore = sessions.filter(s => s.mock_attempted && s.mock_score != null);
  const classAvgMock = mocksWithScore.length
    ? Math.round(mocksWithScore.reduce((a, s) => a + (s.mock_score ?? 0), 0) / mocksWithScore.length)
    : null;

  // At-risk: < 2 sessions in last 7 days OR mock avg < 50
  const atRisk = students.filter(st => {
    const recentCount = sessions.filter(
      s => s.user_id === st.id && s.created_at && new Date(s.created_at) >= weekAgo
    ).length;
    const stMocks = sessions.filter(s => s.user_id === st.id && s.mock_score != null);
    const stAvg = stMocks.length ? stMocks.reduce((a, s) => a + (s.mock_score ?? 0), 0) / stMocks.length : null;
    return recentCount < 2 || (stAvg != null && stAvg < 50);
  });

  // Class activity trend — avg daily study minutes, last 4 weeks
  const trendData = Array.from({ length: 28 }, (_, i) => {
    const d = subDays(new Date(), 27 - i);
    const key = format(d, "yyyy-MM-dd");
    const daySessions = sessions.filter(s => (s.session_date ?? s.created_at?.slice(0, 10)) === key);
    const totalMins = daySessions.reduce((a, s) => a + (s.duration_minutes ?? 0), 0);
    const avg = students.length ? Math.round(totalMins / students.length) : 0;
    return { date: format(d, "MMM d"), avg };
  });

  // Student rows for league table
  const studentRows = students.map(st => {
    const stSessions = filteredSessions.filter(s => s.user_id === st.id);
    const weekSessions = stSessions.filter(s => s.created_at && new Date(s.created_at) >= weekAgo);
    const weekMins = weekSessions.reduce((a, s) => a + (s.duration_minutes ?? 0), 0);
    const stMocks = stSessions.filter(s => s.mock_score != null);
    const mockAvg = stMocks.length ? Math.round(stMocks.reduce((a, s) => a + (s.mock_score ?? 0), 0) / stMocks.length) : null;
    const lastSession = stSessions[0];
    const daysSince = lastSession ? differenceInDays(new Date(), new Date(lastSession.created_at)) : null;
    const isAtRisk = atRisk.some(r => r.id === st.id);
    return { ...st, weekMins, mockAvg, daysSince, isAtRisk, sessionCount: stSessions.length };
  }).sort((a, b) => b.weekMins - a.weekMins);

  // Class weak topic heatmap (top topics with weakness_score > 0.4)
  const classWeakTopics = weakTopics
    .filter(t => t.weakness_score > 0.4)
    .reduce((acc: Record<string, { count: number; avgScore: number; total: number }>, t) => {
      const key = `${t.subject}::${t.topic}`;
      if (!acc[key]) acc[key] = { count: 0, avgScore: 0, total: 0 };
      acc[key].count++;
      acc[key].total += t.weakness_score;
      acc[key].avgScore = acc[key].total / acc[key].count;
      return acc;
    }, {});

  const heatmapTopics = Object.entries(classWeakTopics)
    .map(([key, val]) => {
      const [subject, topic] = key.split("::");
      return { subject, topic, ...val };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <AppLayout>
      <div className="min-h-screen p-5 md:p-8" style={{ background: "#F7F7F5", fontFamily: "var(--font-body)" }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <img src={SIA_LOGO} alt="SIA" className="h-10 w-10 rounded-full object-contain bg-white shadow-sm"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#1B2A4A" }}>
                Teacher Dashboard
              </h1>
              <p className="text-sm" style={{ color: "#6B7280" }}>{SCHOOL_NAME}</p>
            </div>
          </div>

          {allSubjects.length > 1 && (
            <div className="relative">
              <select
                value={subjectFilter}
                onChange={e => setSubjectFilter(e.target.value)}
                className="pl-4 pr-10 py-2 rounded-xl border text-sm font-semibold appearance-none"
                style={{ borderColor: "#E5E7EB", background: "#fff", color: "#1B2A4A" }}
              >
                <option value="all">All Subjects</option>
                {allSubjects.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "#6B7280" }} />
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#1B2A4A" }} />
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl mb-6 text-sm" style={{ background: "#FEE2E2", color: "#991B1B" }}>
            {error}
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <div className="p-8 rounded-2xl text-center" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(27,42,74,0.07)" }}>
            <p className="text-lg font-semibold mb-2" style={{ color: "#1B2A4A" }}>No students linked yet</p>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Students will appear here once they are linked to your class by SIA administration.
            </p>
          </div>
        )}

        {!loading && !error && students.length > 0 && (
          <>
            {/* Class overview cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Users} label="Total Students" value={students.length} color="#1B2A4A" />
              <StatCard icon={Activity} label="Active This Week" value={activeThisWeek} sub={`of ${students.length}`} color="#C9A84C" />
              <StatCard icon={Target} label="Class Mock Avg" value={classAvgMock != null ? `${classAvgMock}%` : "—"} color="#2E7D32" />
              <StatCard icon={AlertTriangle} label="Need Support" value={atRisk.length} sub="at-risk students" color="#DC2626" />
            </div>

            {/* At-risk banner */}
            {atRisk.length > 0 && (
              <div className="rounded-2xl p-5 mb-6 flex items-start gap-3" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#D97706" }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: "#92400E" }}>
                    {atRisk.length} student{atRisk.length > 1 ? "s" : ""} may need support this week
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#B45309" }}>
                    {atRisk.map(s => `${s.first_name} ${s.last_name ?? ""}`.trim()).join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Activity trend */}
            <div className="rounded-2xl p-6 mb-6" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(27,42,74,0.07)" }}>
              <h2 className="font-bold mb-4" style={{ color: "#1B2A4A" }}>Class Activity Trend — Last 4 Weeks</h2>
              {trendData.some(d => d.avg > 0) ? (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} interval={6} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} />
                    <Tooltip
                      formatter={(v: number) => [`${v} min avg`, "Study time"]}
                      contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                    />
                    <Line type="monotone" dataKey="avg" stroke="#1B2A4A" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-center py-8" style={{ color: "#9CA3AF" }}>No activity data yet.</p>
              )}
            </div>

            {/* Student league table */}
            <div className="rounded-2xl p-6 mb-6" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(27,42,74,0.07)" }}>
              <h2 className="font-bold mb-4" style={{ color: "#1B2A4A" }}>Student Overview</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "#6B7280" }}>
                      <th className="text-left pb-3 font-semibold">#</th>
                      <th className="text-left pb-3 font-semibold">Student</th>
                      <th className="text-right pb-3 font-semibold">Study (7d)</th>
                      <th className="text-right pb-3 font-semibold">Mock Avg</th>
                      <th className="text-right pb-3 font-semibold">Last Active</th>
                      <th className="text-right pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentRows.map((st, i) => (
                      <tr
                        key={st.id}
                        className="border-t cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "#F3F4F6" }}
                        onClick={() => setSelectedStudent(selectedStudent?.id === st.id ? null : st)}
                      >
                        <td className="py-3 pr-3 font-semibold" style={{ color: "#9CA3AF" }}>{i + 1}</td>
                        <td className="py-3">
                          <span className="font-semibold" style={{ color: "#1B2A4A" }}>
                            {st.first_name} {st.last_name}
                          </span>
                        </td>
                        <td className="py-3 text-right" style={{ color: "#374151" }}>
                          {st.weekMins > 0 ? `${(st.weekMins / 60).toFixed(1)}h` : "—"}
                        </td>
                        <td className="py-3 text-right">{scoreBadge(st.mockAvg)}</td>
                        <td className="py-3 text-right" style={{ color: "#6B7280" }}>
                          {st.daysSince == null ? "—" : st.daysSince === 0 ? "Today" : st.daysSince === 1 ? "Yesterday" : `${st.daysSince}d ago`}
                        </td>
                        <td className="py-3 text-right">
                          {st.isAtRisk
                            ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#FEE2E2", color: "#DC2626" }}>⚠ At Risk</span>
                            : <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>✓ Active</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Class weak topic heatmap */}
            {heatmapTopics.length > 0 && (
              <div className="rounded-2xl p-6 mb-6" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(27,42,74,0.07)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="h-5 w-5" style={{ color: "#DC2626" }} />
                  <h2 className="font-bold" style={{ color: "#1B2A4A" }}>Class Weak Topics</h2>
                  <span className="text-xs ml-auto" style={{ color: "#9CA3AF" }}>Topics where multiple students are struggling</span>
                </div>
                <div className="space-y-2">
                  {heatmapTopics.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>
                            <span className="font-semibold capitalize" style={{ color: "#1B2A4A" }}>{t.subject}</span>
                            <span style={{ color: "#6B7280" }}> → {t.topic}</span>
                          </span>
                          <span className="text-xs font-bold" style={{ color: "#DC2626" }}>
                            {t.count} student{t.count > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, Math.round(t.avgScore * 100))}%`,
                              background: t.avgScore > 0.7 ? "#DC2626" : t.avgScore > 0.5 ? "#D97706" : "#C9A84C",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default TeacherDashboard;
