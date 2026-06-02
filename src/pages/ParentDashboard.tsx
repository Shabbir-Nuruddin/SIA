import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Clock, BarChart2, Target, Map, AlertTriangle, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, subDays, parseISO } from "date-fns";

const SIA_LOGO = "https://sia.ae/wp-content/uploads/2022/03/cropped-sia-sub-logo-2-270x270.png";
const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME ?? "Scholars International Academy";
const CHART_COLORS = ["#1B2A4A", "#C9A84C", "#2E7D32", "#DC2626", "#2A3F6B", "#E8C870"];

interface ChildProfile { id: string; first_name: string | null; last_name: string | null; email: string | null; }
interface StudySession {
  id: string; subject: string; topic: string | null; duration_minutes: number | null;
  mock_attempted: boolean | null; mock_score: number | null;
  session_date: string | null; created_at: string; roadmap_position: any;
  notes_generated: boolean | null;
}
interface WeakTopic { id: string; subject: string; topic: string; weakness_score: number; }
interface TopicProgress { subject: string; topic_name: string; last_score_percent: number | null; }

const StatCard = ({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string; sub?: string; color: string;
}) => (
  <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(27,42,74,0.07)" }}>
    <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
      <Icon className="h-6 w-6" style={{ color }} />
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B7280" }}>{label}</p>
      <p className="text-2xl font-bold mt-0.5" style={{ color: "#1B2A4A" }}>{value}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{sub}</p>}
    </div>
  </div>
);

const ParentDashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch linked children
  useEffect(() => {
    if (!user) return;
    supabase
      .from("parent_child_links")
      .select("child_id, child_email")
      .eq("parent_id", user.id)
      .then(async ({ data, error: err }) => {
        if (err || !data?.length) { setLoading(false); return; }
        const ids = data.filter(d => d.child_id).map(d => d.child_id as string);
        if (!ids.length) { setLoading(false); return; }
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id,first_name,last_name,email")
          .in("id", ids);
        const list = (profiles ?? []) as ChildProfile[];
        setChildren(list);
        if (list.length) setSelectedChild(list[0]);
        setLoading(false);
      });
  }, [user]);

  // Fetch selected child's data
  useEffect(() => {
    if (!selectedChild) return;
    setLoading(true);
    setError(null);
    const cid = selectedChild.id;
    Promise.all([
      supabase.from("study_sessions").select("*").eq("user_id", cid).order("created_at", { ascending: false }).limit(200),
      supabase.from("weak_topics").select("*").eq("student_id", cid).order("weakness_score", { ascending: false }),
      supabase.from("topic_progress").select("subject,topic_name,last_score_percent").eq("user_id", cid),
    ]).then(([sess, weak, tp]) => {
      setSessions((sess.data ?? []) as StudySession[]);
      setWeakTopics((weak.data ?? []) as WeakTopic[]);
      setTopicProgress((tp.data ?? []) as TopicProgress[]);
      setLoading(false);
    }).catch(() => { setError("Failed to load data. Please refresh."); setLoading(false); });
  }, [selectedChild]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" style={{ color: "#1B2A4A" }} /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (profile?.role !== "parent") return <Navigate to="/dashboard" replace />;
  if (!profile.approved) return <Navigate to="/auth/pending-approval" replace />;

  // ── Computed analytics ────────────────────────────────────────────────────
  const totalMinutes = sessions.reduce((s, r) => s + (r.duration_minutes ?? 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const weekAgo = subDays(new Date(), 7);
  const thisWeekSessions = sessions.filter(s => s.created_at && new Date(s.created_at) >= weekAgo);

  const mocksWithScore = sessions.filter(s => s.mock_attempted && s.mock_score != null);
  const mockAvg = mocksWithScore.length
    ? Math.round(mocksWithScore.reduce((a, s) => a + (s.mock_score ?? 0), 0) / mocksWithScore.length)
    : null;

  const subjects = Array.from(new Set(sessions.map(s => s.subject))).filter(Boolean);
  const subjectMinutes = subjects.map(sub => ({
    name: sub.charAt(0).toUpperCase() + sub.slice(1),
    value: sessions.filter(s => s.subject === sub).reduce((a, s) => a + (s.duration_minutes ?? 0), 0),
  })).filter(s => s.value > 0);

  // Daily activity last 30 days
  const days30 = Array.from({ length: 30 }, (_, i) => {
    const d = subDays(new Date(), 29 - i);
    const key = format(d, "yyyy-MM-dd");
    const mins = sessions.filter(s => (s.session_date ?? s.created_at?.slice(0, 10)) === key)
      .reduce((a, s) => a + (s.duration_minutes ?? 0), 0);
    return { date: format(d, "MMM d"), mins };
  });

  // Roadmap by subject (latest position)
  const roadmapBySubject: Record<string, any> = {};
  sessions.forEach(s => {
    if (s.roadmap_position && !roadmapBySubject[s.subject]) {
      roadmapBySubject[s.subject] = s.roadmap_position;
    }
  });

  const recentMocks = sessions.filter(s => s.mock_attempted && s.mock_score != null).slice(0, 5);
  const atRiskTopics = weakTopics.filter(t => t.weakness_score > 0.5);
  const childName = selectedChild ? `${selectedChild.first_name ?? ""} ${selectedChild.last_name ?? ""}`.trim() : "Child";

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
                Parent Dashboard
              </h1>
              <p className="text-sm" style={{ color: "#6B7280" }}>{SCHOOL_NAME}</p>
            </div>
          </div>

          {children.length > 1 && (
            <div className="relative">
              <select
                value={selectedChild?.id ?? ""}
                onChange={e => setSelectedChild(children.find(c => c.id === e.target.value) ?? null)}
                className="pl-4 pr-10 py-2 rounded-xl border text-sm font-semibold appearance-none"
                style={{ borderColor: "#E5E7EB", background: "#fff", color: "#1B2A4A" }}
              >
                {children.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name}
                  </option>
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

        {!loading && !error && !selectedChild && (
          <div className="p-8 rounded-2xl text-center" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(27,42,74,0.07)" }}>
            <p className="text-lg font-semibold mb-2" style={{ color: "#1B2A4A" }}>No linked children yet</p>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Your child's account hasn't been linked yet. Once they sign in and verify the link, their progress will appear here.
            </p>
          </div>
        )}

        {!loading && !error && selectedChild && (
          <>
            <p className="text-sm font-semibold mb-5" style={{ color: "#6B7280" }}>
              Showing progress for <span style={{ color: "#1B2A4A" }}>{childName}</span>
            </p>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Clock} label="Total Study" value={`${totalHours}h`} sub="all time" color="#1B2A4A" />
              <StatCard icon={BarChart2} label="This Week" value={`${thisWeekSessions.length}`} sub="sessions" color="#C9A84C" />
              <StatCard icon={Target} label="Mock Average" value={mockAvg != null ? `${mockAvg}%` : "—"} sub={mocksWithScore.length ? `${mocksWithScore.length} mocks` : "no mocks yet"} color="#2E7D32" />
              <StatCard icon={Map} label="Subjects Active" value={`${subjects.length}`} sub="subjects tracked" color="#2A3F6B" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Activity bar chart */}
              <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(27,42,74,0.07)" }}>
                <h2 className="font-bold mb-4" style={{ color: "#1B2A4A" }}>Study Activity — Last 30 Days</h2>
                {days30.some(d => d.mins > 0) ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={days30} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} interval={4} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} />
                      <Tooltip
                        formatter={(v: number) => [`${v} min`, "Study time"]}
                        contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                      />
                      <Bar dataKey="mins" fill="#1B2A4A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-center py-10" style={{ color: "#9CA3AF" }}>No study sessions recorded yet.</p>
                )}
              </div>

              {/* Subject pie chart */}
              <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(27,42,74,0.07)" }}>
                <h2 className="font-bold mb-4" style={{ color: "#1B2A4A" }}>Time by Subject</h2>
                {subjectMinutes.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={subjectMinutes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                          {subjectMinutes.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => [`${v} min`, ""]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1 mt-2">
                      {subjectMinutes.map((s, i) => (
                        <div key={s.name} className="flex items-center gap-2 text-xs">
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                          <span style={{ color: "#374151" }}>{s.name}</span>
                          <span className="ml-auto font-semibold" style={{ color: "#6B7280" }}>{s.value}m</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-center py-10" style={{ color: "#9CA3AF" }}>No data yet.</p>
                )}
              </div>
            </div>

            {/* Weak Areas Alert */}
            {atRiskTopics.length > 0 && (
              <div className="rounded-2xl p-6 mb-6" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5" style={{ color: "#D97706" }} />
                  <h2 className="font-bold" style={{ color: "#92400E" }}>Areas Needing Attention</h2>
                </div>
                <div className="space-y-2">
                  {atRiskTopics.slice(0, 5).map(t => (
                    <div key={t.id} className="flex items-center justify-between text-sm">
                      <span style={{ color: "#78350F" }}>
                        <span className="font-semibold capitalize">{t.subject}</span>
                        <span className="text-amber-700"> → {t.topic}</span>
                      </span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "#FCA5A5", color: "#991B1B" }}
                      >
                        {Math.round(t.weakness_score * 100)}% weak
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent mock scores */}
            {recentMocks.length > 0 && (
              <div className="rounded-2xl p-6 mb-6" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(27,42,74,0.07)" }}>
                <h2 className="font-bold mb-4" style={{ color: "#1B2A4A" }}>Recent Mock Scores</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ color: "#6B7280" }}>
                        <th className="text-left pb-2 font-semibold">Date</th>
                        <th className="text-left pb-2 font-semibold">Subject</th>
                        <th className="text-left pb-2 font-semibold">Topic</th>
                        <th className="text-right pb-2 font-semibold">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentMocks.map(s => (
                        <tr key={s.id} className="border-t" style={{ borderColor: "#F3F4F6" }}>
                          <td className="py-2" style={{ color: "#374151" }}>
                            {s.session_date ? format(parseISO(s.session_date), "MMM d") : format(new Date(s.created_at), "MMM d")}
                          </td>
                          <td className="py-2 capitalize" style={{ color: "#374151" }}>{s.subject}</td>
                          <td className="py-2" style={{ color: "#6B7280" }}>{s.topic ?? "—"}</td>
                          <td className="py-2 text-right font-bold" style={{ color: (s.mock_score ?? 0) >= 70 ? "#2E7D32" : "#DC2626" }}>
                            {s.mock_score}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Roadmap status */}
            {Object.keys(roadmapBySubject).length > 0 && (
              <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(27,42,74,0.07)" }}>
                <h2 className="font-bold mb-4" style={{ color: "#1B2A4A" }}>Roadmap Status</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ color: "#6B7280" }}>
                        <th className="text-left pb-2 font-semibold">Subject</th>
                        <th className="text-left pb-2 font-semibold">Current Position</th>
                        <th className="text-right pb-2 font-semibold">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(roadmapBySubject).map(([subj, pos]) => (
                        <tr key={subj} className="border-t" style={{ borderColor: "#F3F4F6" }}>
                          <td className="py-2 capitalize font-medium" style={{ color: "#1B2A4A" }}>{subj}</td>
                          <td className="py-2" style={{ color: "#6B7280" }}>
                            {pos?.chapter ? `Chapter ${pos.chapter}` : ""}{pos?.topic ? ` — ${pos.topic}` : "In progress"}
                          </td>
                          <td className="py-2 text-right">
                            {pos?.percent != null ? (
                              <span className="font-bold" style={{ color: "#1B2A4A" }}>{pos.percent}%</span>
                            ) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default ParentDashboard;
