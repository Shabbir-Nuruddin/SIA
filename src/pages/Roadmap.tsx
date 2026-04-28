import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { buildRoadmap, DayPlan, Roadmap, UserUnitRow, POMODORO_MIN } from "@/lib/roadmap";
import { SUBJECTS, SubjectCode, formatDuration } from "@/lib/subjects";
import { Loader2, Brain, Repeat, Shuffle, FileClock, BookOpen, Coffee, Flame, Calendar, Clock, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";

const TYPE_META: Record<string, { label: string; icon: any; color: string }> = {
  learn:      { label: "Learn",       icon: BookOpen,   color: "hsl(244 100% 70%)" },
  recall:     { label: "Recall",      icon: Repeat,     color: "hsl(152 76% 48%)" },
  interleave: { label: "Interleave",  icon: Shuffle,    color: "hsl(280 80% 70%)" },
  mock:       { label: "Mock paper",  icon: FileClock,  color: "hsl(0 84% 62%)" },
  review:     { label: "Review",      icon: Brain,      color: "hsl(36 92% 55%)" },
  rest:       { label: "Rest",        icon: Coffee,     color: "hsl(230 12% 60%)" },
};

const SUBJECT_TINT: Record<SubjectCode, string> = {
  mathematics: "hsl(244 100% 70%)",
  biology:     "hsl(152 76% 48%)",
  chemistry:   "hsl(280 80% 70%)",
  physics:     "hsl(36 92% 55%)",
};

const RoadmapPage = () => {
  const { user } = useAuth();
  const [units, setUnits] = useState<UserUnitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("user_subjects")
        .select("subject, unit_number, unit_name, exam_date, target_grade, current_grade")
        .eq("user_id", user.id);
      if (!error && data) setUnits(data as any);
      setLoading(false);
    })();
  }, [user]);

  const roadmap: Roadmap | null = useMemo(() => {
    if (units.length === 0) return null;
    return buildRoadmap(units, { weeklyMinutes: weeklyHours * 60 });
  }, [units, weeklyHours]);

  const today = roadmap?.days[activeDay];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-mono mb-3">
            <Sparkles className="h-3 w-3" /> Personalised plan
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Your roadmap to the grade.</h1>
          <p className="text-muted-foreground max-w-2xl">
            Built from your exam dates, target grades, and the science of how memory actually works —
            spaced repetition, interleaving, active recall, and Pomodoro focus blocks.
          </p>
        </header>

        {loading && (
          <div className="flex items-center gap-3 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Building your plan…</div>
        )}

        {!loading && units.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">No units yet.</h2>
            <p className="text-muted-foreground mb-6">Finish onboarding to generate your roadmap.</p>
            <Link to="/onboarding"><Button className="bg-primary hover:bg-primary/90">Set up subjects</Button></Link>
          </div>
        )}

        {!loading && roadmap && (
          <>
            {/* The science strip */}
            <section className="glass-card rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Weekly study target</div>
                  <div className="text-3xl font-extrabold mt-1">{weeklyHours}h <span className="text-sm font-normal text-muted-foreground">/ week · ≈ {Math.round((weeklyHours * 60) / 7)} min/day</span></div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Plan horizon</div>
                  <div className="text-3xl font-extrabold mt-1">{roadmap.daysCovered}<span className="text-sm font-normal text-muted-foreground"> days · {roadmap.totalPomodoros} pomos</span></div>
                </div>
              </div>
              <Slider min={4} max={30} step={1} value={[weeklyHours]} onValueChange={v => setWeeklyHours(v[0])} />
              <div className="grid sm:grid-cols-4 gap-3 mt-6">
                <ScienceCard icon={Repeat} title="Spaced repetition" body="Reviews at 1d → 3d → 7d → 16d → 35d. Beats cramming 2×." />
                <ScienceCard icon={Shuffle} title="Interleaving" body="Topics rotate between blocks — discrimination > blocked practice." />
                <ScienceCard icon={Brain} title="Active recall" body="Self-testing via AI questions, not re-reading. 3× more durable." />
                <ScienceCard icon={Clock} title="Pomodoro 25/5" body="50-min deep blocks, 5-min breaks, 15-min reset every 4th cycle." />
              </div>
            </section>

            {/* Day picker */}
            <section className="mb-8">
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono mb-3">Next 14 days</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {roadmap.days.slice(0, 14).map((d, i) => {
                  const active = i === activeDay;
                  const intensity = Math.min(1, d.totalMinutes / 180);
                  return (
                    <button
                      key={d.date}
                      onClick={() => setActiveDay(i)}
                      className={`shrink-0 rounded-xl border p-3 min-w-[92px] text-left transition-all ${active ? "border-primary bg-primary/10 glow-primary" : "border-border hover:border-primary/40"}`}
                    >
                      <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">{d.dayLabel.split(" ")[0]}</div>
                      <div className="text-lg font-bold mt-0.5">{d.dayLabel.split(" ").slice(1).join(" ")}</div>
                      <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full" style={{ width: `${intensity * 100}%`, background: d.phase === "exam-week" ? "hsl(var(--urgent))" : d.phase === "consolidation" ? "hsl(var(--accent))" : "hsl(var(--primary))" }} />
                      </div>
                      <div className="text-[10px] mt-1 text-muted-foreground font-mono">{Math.round(d.totalMinutes / 60 * 10) / 10}h</div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Today detail */}
            {today && <DayDetail day={today} />}

            {/* Coverage heatmap */}
            <section className="mt-12">
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono mb-4">Topic coverage in this plan</h2>
              <div className="glass-card rounded-2xl p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {roadmap.topicCoverage.slice(0, 60).map(t => (
                    <div key={`${t.subject}-${t.unit}-${t.topic}`} className="flex items-center gap-2 text-sm">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: SUBJECT_TINT[t.subject] }} />
                      <span className="truncate flex-1">{t.topic}</span>
                      <span className="font-mono text-xs text-muted-foreground">×{t.passes}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
};

const ScienceCard = ({ icon: Icon, title, body }: any) => (
  <div className="rounded-xl bg-secondary/40 border border-border p-4">
    <Icon className="h-4 w-4 text-primary mb-2" />
    <div className="font-semibold text-sm mb-1">{title}</div>
    <div className="text-xs text-muted-foreground leading-relaxed">{body}</div>
  </div>
);

const DayDetail = ({ day }: { day: DayPlan }) => {
  const phaseLabel = day.phase === "exam-week" ? "Exam week" : day.phase === "consolidation" ? "Consolidation" : "Foundation";
  const phaseColor = day.phase === "exam-week" ? "hsl(var(--urgent))" : day.phase === "consolidation" ? "hsl(var(--accent))" : "hsl(var(--primary))";
  return (
    <section className="glass-card rounded-2xl p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-mono mb-2" style={{ color: phaseColor }}>
            <Flame className="h-3 w-3" /> {phaseLabel}
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold">{day.dayLabel}</h3>
          <div className="text-sm text-muted-foreground mt-1">
            {day.totalMinutes === 0 ? "Rest day." : `${formatDuration(day.totalMinutes)} of focused work · ${day.blocks.reduce((s,b)=>s+b.pomodoros,0)} pomodoros`}
          </div>
        </div>
        {day.daysToNearestExam < 999 && (
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Next exam</div>
            <div className="text-2xl font-extrabold" style={{ color: phaseColor }}>{day.daysToNearestExam}d</div>
            <div className="text-xs text-muted-foreground mt-0.5">{day.nearestExamLabel}</div>
          </div>
        )}
      </div>

      <ol className="space-y-3">
        {day.blocks.map((b, i) => {
          const meta = TYPE_META[b.type];
          const Icon = meta.icon;
          const subjectMeta = b.subject ? SUBJECTS[b.subject] : null;
          return (
            <li key={b.id} className="rounded-xl border border-border bg-background-elevated/50 p-4 flex gap-4">
              <div className="font-mono text-xs text-muted-foreground pt-1 w-6 shrink-0">{String(i + 1).padStart(2, "0")}</div>
              <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${meta.color}20`, color: meta.color }}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-bold">{meta.label}</span>
                  {subjectMeta && <span className="text-xs font-mono text-muted-foreground">· {subjectMeta.name} U{b.unit_number}</span>}
                  {b.topic && <span className="text-sm">· {b.topic}</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{b.rationale}</p>
                {b.pomodoros > 0 && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex gap-1">
                      {Array.from({ length: b.pomodoros }).map((_, k) => (
                        <span key={k} className="h-2 w-6 rounded-full" style={{ background: meta.color, opacity: 0.7 }} />
                      ))}
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{b.pomodoros} × {POMODORO_MIN}m</span>
                  </div>
                )}
              </div>
              {b.type === "learn" || b.type === "recall" ? (
                <Link to={`/questions?subject=${b.subject}&unit=${b.unit_number}&topic=${encodeURIComponent(b.topic ?? "")}`}>
                  <Button size="sm" variant="outline" className="shrink-0">Start</Button>
                </Link>
              ) : b.type === "mock" ? (
                <Link to="/mock-papers/new"><Button size="sm" variant="outline" className="shrink-0">Build</Button></Link>
              ) : b.type === "interleave" ? (
                <Link to="/questions"><Button size="sm" variant="outline" className="shrink-0">Mix</Button></Link>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default RoadmapPage;
