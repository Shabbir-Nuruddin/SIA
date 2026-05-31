import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis, Legend,
} from "recharts";
import {
  TrendingUp, Target, Clock, Trophy, AlertTriangle, Sparkles, BookOpen,
  Brain, FileText, Loader2, ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, subDays, startOfDay, parseISO } from "date-fns";

type Range = "7" | "30" | "90" | "all";

export default function Progress() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>("30");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const [studySessions, setStudySessions] = useState<any[]>([]);
  const [topicProgress, setTopicProgress] = useState<any[]>([]);
  const [mocks, setMocks] = useState<any[]>([]);
  const [aiQ, setAiQ] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [s, tp, m, q, fc, rn, us] = await Promise.all([
        supabase.from("study_sessions").select("*").eq("user_id", user.id).order("completed_at", { ascending: true }),
        supabase.from("topic_progress").select("*").eq("user_id", user.id),
        supabase.from("mock_papers").select("*").eq("user_id", user.id).not("submitted_at", "is", null).order("submitted_at", { ascending: true }),
        supabase.from("ai_questions").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
        supabase.from("flashcard_reviews").select("*").eq("user_id", user.id),
        supabase.from("roadmap_nodes").select("*").eq("user_id", user.id),
        supabase.from("user_subjects").select("subject").eq("user_id", user.id),
      ]);
      setStudySessions(s.data || []);
      setTopicProgress(tp.data || []);
      setMocks(m.data || []);
      setAiQ(q.data || []);
      setFlashcards(fc.data || []);
      setRoadmap(rn.data || []);
      const subs = Array.from(new Set((us.data || []).map((x: any) => x.subject)));
      setSubjects(subs);
      setLoading(false);
    })();
  }, [user]);

  const cutoff = useMemo(() => {
    if (range === "all") return null;
    return startOfDay(subDays(new Date(), parseInt(range)));
  }, [range]);

  const inRange = (d: string | null | undefined) => {
    if (!cutoff || !d) return true;
    return new Date(d) >= cutoff;
  };
  const inSubject = (s: string | null | undefined) => subjectFilter === "all" || s === subjectFilter;

  // ====== KPIs ======
  const filteredSessions = studySessions.filter((x) => inRange(x.completed_at) && inSubject(x.subject));
  const totalMinutes = filteredSessions.reduce((a, x) => a + (x.duration_minutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const filteredQ = aiQ.filter((x) => inRange(x.created_at) && inSubject(x.subject));
  const answeredQ = filteredQ.filter((x) => typeof x.awarded_marks === "number");
  const totalMarks = answeredQ.reduce((a, x) => a + (x.marks || 0), 0);
  const earnedMarks = answeredQ.reduce((a, x) => a + (x.awarded_marks || 0), 0);
  const accuracy = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;

  const filteredMocks = mocks.filter((x) => inRange(x.submitted_at) && inSubject(x.subject));
  const mockAvg = filteredMocks.length
    ? Math.round(
        (filteredMocks.reduce((a, x) => a + ((x.awarded_marks || 0) / (x.total_marks || 1)) * 100, 0) /
          filteredMocks.length) * 1
      )
    : 0;

  const filteredRoadmap = roadmap.filter((x) => inSubject(x.subject));
  const completedNodes = filteredRoadmap.filter((x) => x.status === "complete").length;
  const roadmapPct = filteredRoadmap.length ? Math.round((completedNodes / filteredRoadmap.length) * 100) : 0;

  // ====== Study time per day ======
  const dailyStudy = useMemo(() => {
    const days = range === "all" ? 30 : parseInt(range);
    const map = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const key = format(subDays(new Date(), i), "yyyy-MM-dd");
      map.set(key, 0);
    }
    filteredSessions.forEach((s) => {
      const key = format(new Date(s.completed_at), "yyyy-MM-dd");
      if (map.has(key)) map.set(key, (map.get(key) || 0) + (s.duration_minutes || 0));
    });
    return Array.from(map.entries()).map(([date, minutes]) => ({
      date: format(parseISO(date), "MMM d"),
      minutes,
    }));
  }, [filteredSessions, range]);

  // ====== Accuracy trend (rolling 5-question) ======
  const accuracyTrend = useMemo(() => {
    const ans = answeredQ.slice(-30);
    return ans.map((q, i) => {
      const window = ans.slice(Math.max(0, i - 4), i + 1);
      const m = window.reduce((a, x) => a + (x.marks || 0), 0);
      const e = window.reduce((a, x) => a + (x.awarded_marks || 0), 0);
      return {
        n: i + 1,
        accuracy: m > 0 ? Math.round((e / m) * 100) : 0,
      };
    });
  }, [answeredQ]);

  // ====== Mock score trend ======
  const mockTrend = useMemo(
    () =>
      filteredMocks.map((m, i) => ({
        n: `Mock ${i + 1}`,
        score: Math.round(((m.awarded_marks || 0) / (m.total_marks || 1)) * 100),
        date: m.submitted_at ? format(new Date(m.submitted_at), "MMM d") : "",
      })),
    [filteredMocks]
  );

  // ====== Topic mastery (per topic_progress) ======
  type TopicRow = {
    topic: string;
    subject: string;
    attempted: number;
    correct: number;
    mastery: number;
    weak: boolean;
  };
  const topicRows: TopicRow[] = useMemo(() => {
    return topicProgress
      .filter((t) => inSubject(t.subject))
      .map((t) => {
        const att = t.questions_attempted || 0;
        const cor = t.questions_correct || 0;
        const mastery = att > 0 ? Math.round((cor / att) * 100) : t.last_score_percent || 0;
        return {
          topic: t.topic_name,
          subject: t.subject,
          attempted: att,
          correct: cor,
          mastery,
          weak: t.weak_flag || (att >= 3 && mastery < 60),
        };
      })
      .sort((a, b) => a.mastery - b.mastery);
  }, [topicProgress, subjectFilter]);

  const weakTopics = topicRows.filter((t) => t.weak).slice(0, 6);
  const strongTopics = [...topicRows].filter((t) => t.attempted >= 3).sort((a, b) => b.mastery - a.mastery).slice(0, 5);

  // ====== Flashcard SR distribution ======
  const filteredFC = flashcards.filter((f) => inSubject(f.subject));
  const boxDist = useMemo(() => {
    const boxes = [1, 2, 3, 4, 5];
    return boxes.map((b) => ({
      box: `Box ${b}`,
      cards: filteredFC.filter((f) => f.box === b).length,
    }));
  }, [filteredFC]);
  const dueNow = filteredFC.filter((f) => new Date(f.due_at) <= new Date()).length;
  const masteredCards = filteredFC.filter((f) => f.box >= 4).length;
  const retentionRate = filteredFC.length
    ? Math.round(
        (filteredFC.reduce((a, f) => a + (f.total_correct || 0), 0) /
          Math.max(1, filteredFC.reduce((a, f) => a + (f.total_reviews || 0), 0))) * 100
      )
    : 0;

  // ====== Personalized recommendations ======
  const recommendations = useMemo(() => {
    const recs: { icon: any; title: string; body: string; action?: () => void; cta?: string }[] = [];
    if (weakTopics.length > 0) {
      recs.push({
        icon: AlertTriangle,
        title: `Focus on ${weakTopics[0].topic}`,
        body: `${weakTopics[0].mastery}% mastery across ${weakTopics[0].attempted} attempts — your weakest area. Practice 5 questions today.`,
        cta: "Practice now",
        action: () => nav("/questions"),
      });
    }
    if (dueNow > 0) {
      recs.push({
        icon: Brain,
        title: `${dueNow} flashcards due for review`,
        body: "Spaced repetition works best when you review on time. Clear today's queue to lock in long-term recall.",
        cta: "Open notes",
        action: () => nav("/notes"),
      });
    }
    if (filteredMocks.length === 0) {
      recs.push({
        icon: FileText,
        title: "Sit your first mock paper",
        body: "Timed mocks are the single best predictor of exam performance. Start a 30-minute paper to benchmark yourself.",
        cta: "Start mock",
        action: () => nav("/mock-papers"),
      });
    } else if (mockAvg < 60) {
      recs.push({
        icon: Target,
        title: "Mock average below grade B",
        body: `Your last ${filteredMocks.length} mock(s) averaged ${mockAvg}%. Review mark schemes for the topics you dropped marks on.`,
        cta: "View mocks",
        action: () => nav("/mock-papers"),
      });
    }
    if (totalMinutes < 60 && range !== "all") {
      recs.push({
        icon: Clock,
        title: "Study time is low this period",
        body: `You logged ${totalHours}h in the last ${range} days. Aim for at least 30 minutes per active day to stay on track.`,
        cta: "Open plan",
        action: () => nav("/dashboard"),
      });
    }
    if (accuracy >= 80 && answeredQ.length >= 10) {
      recs.push({
        icon: Trophy,
        title: "You're crushing topical questions",
        body: `${accuracy}% accuracy across ${answeredQ.length} answers. Step up to harder questions or a full mock paper to push further.`,
        cta: "Harder questions",
        action: () => nav("/questions"),
      });
    }
    if (roadmapPct > 0 && roadmapPct < 100) {
      recs.push({
        icon: Sparkles,
        title: `Roadmap ${roadmapPct}% complete`,
        body: `${filteredRoadmap.length - completedNodes} sessions remaining. Keep your streak going to hit your exam-ready milestone.`,
        cta: "Open roadmap",
        action: () => nav("/roadmap"),
      });
    }
    return recs.slice(0, 4);
  }, [weakTopics, dueNow, filteredMocks, mockAvg, totalMinutes, range, accuracy, answeredQ, roadmapPct, filteredRoadmap, completedNodes, totalHours, nav]);

  if (loading) {
    return (
      <AppLayout>
      <SEO title="Progress — MakeMeRevise" description="Track your A-Level mastery by topic, see strengths and weak spots, and watch your grade trajectory." path="/progress" />
        <div className="h-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const chartProps = {
    stroke: "hsl(var(--muted-foreground))",
    fontSize: 11,
  };

  return (
    <AppLayout>
      <div className="h-full overflow-y-auto">
        <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight">Progress &amp; Insights</h1>
              <p className="text-muted-foreground mt-1">
                Track mastery, spot weak topics, and get personalized next steps.
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subjects</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={range} onValueChange={(v) => setRange(v as Range)}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <KPI icon={Clock} label="Study time" value={`${totalHours}h`} accent="hsl(205 85% 58%)" />
            <KPI icon={Target} label="Q accuracy" value={`${accuracy}%`} accent="hsl(160 70% 45%)" sub={`${answeredQ.length} answered`} />
            <KPI icon={FileText} label="Mock avg" value={`${mockAvg}%`} accent="hsl(28 95% 58%)" sub={`${filteredMocks.length} papers`} />
            <KPI icon={Brain} label="Cards mastered" value={`${masteredCards}`} accent="hsl(265 75% 62%)" sub={`${retentionRate}% retention`} />
            <KPI icon={Sparkles} label="Roadmap" value={`${roadmapPct}%`} accent="hsl(43 70% 58%)" sub={`${completedNodes}/${filteredRoadmap.length} done`} />
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card className="p-5 bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="font-semibold">Your intelligent revision partner suggests</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {recommendations.map((r, i) => (
                  <button
                    key={i}
                    onClick={r.action}
                    className="text-left p-4 rounded-lg bg-card/60 border hover:border-primary/40 hover:bg-card transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                        <r.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm">{r.title}</p>
                          {r.cta && (
                            <span className="text-xs text-primary opacity-70 group-hover:opacity-100 flex items-center gap-0.5 shrink-0">
                              {r.cta} <ChevronRight className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.body}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Charts tabs */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="topics">Topic mastery</TabsTrigger>
              <TabsTrigger value="mocks">Mock papers</TabsTrigger>
              <TabsTrigger value="recall">Recall</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid lg:grid-cols-2 gap-4">
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" />Daily study minutes</h3>
                    <Badge variant="outline">{totalHours}h total</Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={dailyStudy}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" {...chartProps} />
                      <YAxis {...chartProps} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                      <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-muted-foreground" />Accuracy trend</h3>
                    <Badge variant="outline">Rolling 5-Q</Badge>
                  </div>
                  {accuracyTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={accuracyTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="n" {...chartProps} />
                        <YAxis domain={[0, 100]} {...chartProps} />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                        <Line type="monotone" dataKey="accuracy" stroke="hsl(160 70% 45%)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState text="Answer topical questions to see your accuracy trend." />
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="topics" className="space-y-4 mt-4">
              <div className="grid lg:grid-cols-2 gap-4">
                <Card className="p-5">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-amber-500" /> Weakest topics
                  </h3>
                  {weakTopics.length === 0 ? (
                    <EmptyState text="No weak topics yet — keep practising to surface them." />
                  ) : (
                    <div className="space-y-3">
                      {weakTopics.map((t) => (
                        <div key={t.topic}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="truncate">{t.topic}</span>
                            <span className="text-muted-foreground">{t.mastery}% • {t.correct}/{t.attempted}</span>
                          </div>
                          <ProgressBar value={t.mastery} className="h-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="p-5">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <Trophy className="h-4 w-4 text-amber-400" /> Strongest topics
                  </h3>
                  {strongTopics.length === 0 ? (
                    <EmptyState text="Build a track record by attempting topical questions." />
                  ) : (
                    <div className="space-y-3">
                      {strongTopics.map((t) => (
                        <div key={t.topic}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="truncate">{t.topic}</span>
                            <span className="text-muted-foreground">{t.mastery}%</span>
                          </div>
                          <ProgressBar value={t.mastery} className="h-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              <Card className="p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-muted-foreground" /> All tracked topics ({topicRows.length})
                </h3>
                {topicRows.length === 0 ? (
                  <EmptyState text="No topic data yet." />
                ) : (
                  <div className="overflow-x-auto -mx-2">
                    <table className="w-full text-sm">
                      <thead className="text-left text-xs text-muted-foreground uppercase">
                        <tr><th className="px-2 py-2">Topic</th><th className="px-2 py-2">Subject</th><th className="px-2 py-2 text-right">Attempts</th><th className="px-2 py-2 text-right">Mastery</th><th className="px-2 py-2">Status</th></tr>
                      </thead>
                      <tbody>
                        {topicRows.slice(0, 30).map((t) => (
                          <tr key={t.topic + t.subject} className="border-t border-border/40">
                            <td className="px-2 py-2 max-w-[300px] truncate">{t.topic}</td>
                            <td className="px-2 py-2 capitalize text-muted-foreground">{t.subject}</td>
                            <td className="px-2 py-2 text-right text-muted-foreground">{t.correct}/{t.attempted}</td>
                            <td className="px-2 py-2 text-right font-medium">{t.mastery}%</td>
                            <td className="px-2 py-2">
                              {t.weak ? <Badge variant="destructive" className="text-xs">Needs review</Badge>
                                : t.mastery >= 80 ? <Badge className="text-xs bg-emerald-600/20 text-emerald-300 border border-emerald-600/30">Strong</Badge>
                                : <Badge variant="secondary" className="text-xs">Developing</Badge>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="mocks" className="space-y-4 mt-4">
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" />Mock paper scores</h3>
                  <Badge variant="outline">Avg {mockAvg}%</Badge>
                </div>
                {mockTrend.length === 0 ? (
                  <EmptyState text="Submit a mock paper to see your trend." />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={mockTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="n" {...chartProps} />
                      <YAxis domain={[0, 100]} {...chartProps} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                      <Line type="monotone" dataKey="score" stroke="hsl(28 95% 58%)" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                {filteredMocks.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {filteredMocks.slice(-5).reverse().map((m) => {
                      const pct = Math.round(((m.awarded_marks || 0) / (m.total_marks || 1)) * 100);
                      return (
                        <button key={m.id} onClick={() => nav(`/mock-papers/${m.id}/results`)} className="w-full flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/60 transition">
                          <div className="text-left">
                            <p className="text-sm font-medium capitalize">{m.subject}</p>
                            <p className="text-xs text-muted-foreground">{m.submitted_at && format(new Date(m.submitted_at), "MMM d, yyyy")} • {m.awarded_marks}/{m.total_marks} marks</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">{pct}%</span>
                            {m.estimated_grade && <Badge variant="outline">{m.estimated_grade}</Badge>}
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="recall" className="space-y-4 mt-4">
              <div className="grid lg:grid-cols-2 gap-4">
                <Card className="p-5">
                  <h3 className="font-semibold flex items-center gap-2 mb-3"><Brain className="h-4 w-4 text-muted-foreground" />Flashcard box distribution</h3>
                  {filteredFC.length === 0 ? (
                    <EmptyState text="Review flashcards in Notes to start your Leitner queue." />
                  ) : (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={boxDist}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="box" {...chartProps} />
                        <YAxis {...chartProps} />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                        <Bar dataKey="cards" fill="hsl(265 75% 62%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Card>

                <Card className="p-5">
                  <h3 className="font-semibold flex items-center gap-2 mb-3"><Target className="h-4 w-4 text-muted-foreground" />Recall snapshot</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <Stat label="Total cards" value={filteredFC.length} />
                    <Stat label="Due now" value={dueNow} accent={dueNow > 0 ? "text-amber-400" : undefined} />
                    <Stat label="Retention" value={`${retentionRate}%`} />
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "mastery", value: filteredFC.length ? Math.round((masteredCards / filteredFC.length) * 100) : 0, fill: "hsl(160 70% 45%)" }]} startAngle={90} endAngle={-270}>
                      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                      <RadialBar background dataKey="value" cornerRadius={10} />
                      <Legend iconSize={0} verticalAlign="bottom" content={() => (
                        <p className="text-center text-sm text-muted-foreground">
                          <span className="text-2xl font-bold text-foreground">{filteredFC.length ? Math.round((masteredCards / filteredFC.length) * 100) : 0}%</span> mastered (Box 4+)
                        </p>
                      )} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}

function KPI({ icon: Icon, label, value, sub, accent }: { icon: any; label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
        {label}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </Card>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="p-3 rounded-md bg-muted/30">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-lg font-bold ${accent || ""}`}>{value}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-40 flex items-center justify-center text-sm text-muted-foreground text-center px-4">
      {text}
    </div>
  );
}
