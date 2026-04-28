import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { CountdownCard } from "@/components/CountdownCard";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { UrgencyArc } from "@/components/UrgencyArc";
import { Button } from "@/components/ui/button";
import { SUBJECTS, gradeGap, urgencyScore, Grade, SubjectCode } from "@/lib/subjects";
import { differenceInDays, parseISO } from "date-fns";
import { Brain, Flame, Trophy, ArrowRight, Loader2 } from "lucide-react";

interface UserSubject {
  subject: SubjectCode;
  exam_date: string;
  target_grade: Grade;
  current_grade: Grade;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<UserSubject[]>([]);
  const [profile, setProfile] = useState<{ display_name: string; xp: number; current_streak: number; onboarded: boolean } | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("user_subjects").select("subject,exam_date,target_grade,current_grade").eq("user_id", user.id).order("exam_date"),
      supabase.from("profiles").select("display_name,xp,current_streak,onboarded").eq("id", user.id).single(),
    ]).then(([s, p]) => {
      if (s.data) setSubjects(s.data as UserSubject[]);
      if (p.data) setProfile(p.data as any);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <AppLayout><div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></AppLayout>;
  if (profile && !profile.onboarded) return <Navigate to="/onboarding" replace />;
  if (subjects.length === 0) return <Navigate to="/onboarding" replace />;

  const nearest = subjects[0];
  const nearestMeta = SUBJECTS[nearest.subject];
  const days = differenceInDays(parseISO(nearest.exam_date), new Date());
  const gap = gradeGap(nearest.target_grade, nearest.current_grade);
  const urgency = urgencyScore(gap, days);
  const todayTopic = nearestMeta.papers[0].topics[0];

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
              Your {nearestMeta.name} exam is in <span className="text-urgent font-mono font-bold">{days} days</span>. Don't break the streak.
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
          {/* Left & Center */}
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
                <div className="text-muted-foreground mb-6">{nearestMeta.name} · 25 minute focus block</div>
                <Link to={`/questions?subject=${nearest.subject}&topic=${encodeURIComponent(todayTopic)}`}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 glow-primary">
                    Start session <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Countdowns */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg">Exam countdowns</h2>
                <span className="text-xs font-mono text-muted-foreground">{subjects.length} subjects</span>
              </div>
              <CountdownCard examDate={nearest.exam_date} subjectName={nearestMeta.name} emoji={nearestMeta.emoji} large />
              {subjects.length > 1 && (
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  {subjects.slice(1).map(s => (
                    <CountdownCard key={s.subject} examDate={s.exam_date} subjectName={SUBJECTS[s.subject].name} emoji={SUBJECTS[s.subject].emoji} />
                  ))}
                </div>
              )}
            </div>

            {/* Subject grid */}
            <div>
              <h2 className="font-bold text-lg mb-3">Your subjects</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {subjects.map(s => {
                  const m = SUBJECTS[s.subject];
                  const sg = gradeGap(s.target_grade, s.current_grade);
                  return (
                    <Link key={s.subject} to={`/questions?subject=${s.subject}`}
                      className="glass-card rounded-xl p-5 hover:border-primary/40 transition-all hover:-translate-y-0.5 group">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl">{m.emoji}</span>
                        <Brain className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="font-bold">{m.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Target <span className="text-foreground font-mono">{s.target_grade}</span> · Now <span className="text-foreground font-mono">{s.current_grade}</span> · Gap <span className="text-accent font-mono">{sg}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
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
