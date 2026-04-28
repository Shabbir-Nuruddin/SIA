import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { UrgencyArc } from "@/components/UrgencyArc";
import { Button } from "@/components/ui/button";
import { SUBJECTS, gradeGap, urgencyScore, Grade, SubjectCode, formatDuration } from "@/lib/subjects";
import { differenceInDays, parseISO, format } from "date-fns";
import { Brain, Flame, Trophy, ArrowRight, Loader2, FileClock, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface UnitRow {
  subject: SubjectCode;
  unit_number: number;
  unit_name: string;
  paper_duration_minutes: number;
  exam_date: string;
  target_grade: Grade;
  current_grade: Grade;
}

interface MockRow {
  subject: SubjectCode;
  awarded_marks: number | null;
  total_marks: number;
  estimated_grade: string | null;
  submitted_at: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [mocks, setMocks] = useState<MockRow[]>([]);
  const [profile, setProfile] = useState<{ display_name: string; xp: number; current_streak: number; onboarded: boolean } | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("user_subjects").select("subject,unit_number,unit_name,paper_duration_minutes,exam_date,target_grade,current_grade").eq("user_id", user.id).order("exam_date"),
      supabase.from("profiles").select("display_name,xp,current_streak,onboarded").eq("id", user.id).single(),
      supabase.from("mock_papers").select("subject,awarded_marks,total_marks,estimated_grade,submitted_at").eq("user_id", user.id).eq("status", "marked").order("submitted_at", { ascending: false }),
    ]).then(([s, p, m]) => {
      if (s.data) setUnits(s.data as UnitRow[]);
      if (p.data) setProfile(p.data as any);
      if (m.data) setMocks(m.data as MockRow[]);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <AppLayout><div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></AppLayout>;
  if (profile && !profile.onboarded) return <Navigate to="/onboarding" replace />;
  if (units.length === 0) return <Navigate to="/onboarding" replace />;

  const nearest = units[0];
  const nearestMeta = SUBJECTS[nearest.subject];
  const nearestUnitMeta = nearestMeta.units.find(u => u.number === nearest.unit_number)!;
  const days = differenceInDays(parseISO(nearest.exam_date), new Date());
  const gap = gradeGap(nearest.target_grade, nearest.current_grade);
  const urgency = urgencyScore(gap, days);
  const todayTopic = nearestUnitMeta.topics[0];

  // Group units by subject
  const bySubject = units.reduce((acc, u) => {
    (acc[u.subject] ||= []).push(u);
    return acc;
  }, {} as Record<SubjectCode, UnitRow[]>);

  // Mock performance per subject
  const mockTrend = (subject: SubjectCode) => {
    const sm = mocks.filter(m => m.subject === subject && m.awarded_marks !== null);
    if (sm.length === 0) return null;
    const last = sm[0];
    const prev = sm[1];
    const lastPct = (last.awarded_marks! / last.total_marks) * 100;
    if (!prev) return { last, lastPct, dir: "flat" as const, delta: 0 };
    const prevPct = (prev.awarded_marks! / prev.total_marks) * 100;
    const delta = lastPct - prevPct;
    return { last, lastPct, dir: delta > 1 ? "up" as const : delta < -1 ? "down" as const : "flat" as const, delta };
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-sm text-muted-foreground font-mono">// {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
              {profile?.display_name ? `Back to it, ${profile.display_name}.` : "Back to it."}
            </h1>
            <p className="text-muted-foreground mt-1">
              Your {nearestMeta.name} Unit {nearest.unit_number} exam is in <span className="text-urgent font-mono font-bold">{days} days</span>. Don't break the streak.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
              <Flame className="h-5 w-5 text-accent" />
              <div>
                <div className="font-mono font-extrabold text-xl">{profile?.current_streak ?? 0}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Day streak</div>
              </div>
            </div>
            <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <div>
                <div className="font-mono font-extrabold text-xl">{profile?.xp ?? 0}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">XP</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Today's session */}
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{ background: "var(--gradient-primary)", filter: "blur(60px)" }} />
              <div className="relative">
                <div className="text-xs uppercase tracking-widest text-primary font-mono mb-2">Today's session</div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{nearestMeta.emoji}</span>
                  <div className="text-2xl md:text-3xl font-extrabold">{todayTopic}</div>
                </div>
                <div className="text-muted-foreground mb-6">{nearestMeta.name} · Unit {nearest.unit_number} · 25 min focus block</div>
                <div className="flex flex-wrap gap-3">
                  <Link to={`/questions?subject=${nearest.subject}&unit=${nearest.unit_number}&topic=${encodeURIComponent(todayTopic)}`}>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 glow-primary">
                      Start session <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/mock-papers">
                    <Button size="lg" variant="outline">
                      <FileClock className="h-4 w-4 mr-2" /> Sit a mock paper
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mock performance widget */}
            <div>
              <h2 className="font-bold text-lg mb-3">Mock paper performance</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.keys(bySubject).map(code => {
                  const t = mockTrend(code as SubjectCode);
                  const m = SUBJECTS[code as SubjectCode];
                  return (
                    <Link key={code} to="/mock-papers" className="glass-card rounded-xl p-4 hover:border-primary/40 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{m.emoji}</span>
                          <div>
                            <div className="font-semibold text-sm">{m.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {t ? `Last: ${t.last.awarded_marks}/${t.last.total_marks} · ${t.last.estimated_grade}` : "No mocks yet — set a baseline"}
                            </div>
                          </div>
                        </div>
                        {t && (
                          <div className={`flex items-center gap-1 font-mono text-sm ${t.dir === "up" ? "text-success" : t.dir === "down" ? "text-urgent" : "text-muted-foreground"}`}>
                            {t.dir === "up" ? <TrendingUp className="h-4 w-4" /> : t.dir === "down" ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                            {t.dir !== "flat" && `${t.delta > 0 ? "+" : ""}${t.delta.toFixed(0)}%`}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Subject + unit list */}
            <div>
              <h2 className="font-bold text-lg mb-3">Your subjects & units</h2>
              <div className="space-y-4">
                {Object.entries(bySubject).map(([code, rows]) => {
                  const m = SUBJECTS[code as SubjectCode];
                  return (
                    <div key={code} className="glass-card rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                        <span className="text-xl">{m.emoji}</span>
                        <div className="font-bold">{m.name}</div>
                        <span className="text-[10px] font-mono text-muted-foreground ml-1">{m.spec}</span>
                      </div>
                      <div className="space-y-2">
                        {rows.map(r => {
                          const d = differenceInDays(parseISO(r.exam_date), new Date());
                          return (
                            <div key={r.unit_number} className="grid grid-cols-12 items-center gap-2 text-sm py-2">
                              <div className="col-span-1 font-mono text-xs text-primary">U{r.unit_number}</div>
                              <div className="col-span-5 truncate">{r.unit_name}</div>
                              <div className="col-span-3 text-xs text-muted-foreground font-mono">
                                {format(parseISO(r.exam_date), "d MMM")} · {formatDuration(r.paper_duration_minutes)}
                              </div>
                              <div className="col-span-1 text-right font-mono text-xs" style={{ color: d < 30 ? "#F5A623" : undefined }}>
                                {d}d
                              </div>
                              <div className="col-span-2 flex justify-end gap-1">
                                <Link to={`/questions?subject=${code}&unit=${r.unit_number}`}>
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"><Brain className="h-3 w-3 mr-1" />AI</Button>
                                </Link>
                                <Link to={`/mock-papers?subject=${code}&unit=${r.unit_number}`}>
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"><FileClock className="h-3 w-3 mr-1" />Mock</Button>
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <UrgencyArc value={urgency.value} level={urgency.level} />
            <PomodoroTimer topic={todayTopic} subject={nearest.subject} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
