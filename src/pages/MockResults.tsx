import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { SUBJECTS, SubjectCode, GRADE_BOUNDARIES, gradeColor } from "@/lib/subjects";
import { Check, X, Info, ArrowRight, Loader2, RotateCcw, Brain, LayoutDashboard, Flag } from "lucide-react";
import { formattedHtmlProps } from "@/lib/formatText";

interface Q {
  id: string;
  question_index: number;
  topic: string;
  question_type: string;
  question_text: string;
  marks: number;
  awarded_marks: number | null;
  feedback: string | null;
  model_answer: string | null;
  student_answer: string | null;
  options: string[] | null;
  flagged: boolean;
}

interface Paper {
  id: string;
  subject: SubjectCode;
  units: number[];
  total_marks: number;
  awarded_marks: number | null;
  estimated_grade: string | null;
  status: string;
}

const MockResults = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([
      supabase.from("mock_papers").select("*").eq("id", id).single(),
      supabase.from("mock_paper_questions").select("*").eq("mock_paper_id", id).order("question_index"),
    ]).then(([p, q]) => {
      if (p.data) setPaper(p.data as any);
      if (q.data) setQuestions(q.data as Q[]);
      setLoading(false);
    });
  }, [user, id]);

  const topicBreakdown = useMemo(() => {
    const map: Record<string, { earned: number; total: number }> = {};
    for (const q of questions) {
      if (!map[q.topic]) map[q.topic] = { earned: 0, total: 0 };
      map[q.topic].total += q.marks;
      map[q.topic].earned += q.awarded_marks || 0;
    }
    return Object.entries(map).sort((a, b) => (a[1].earned / a[1].total) - (b[1].earned / b[1].total));
  }, [questions]);

  const weakTopics = useMemo(() =>
    topicBreakdown.filter(([, v]) => v.earned / v.total < 0.6).map(([t]) => t),
    [topicBreakdown]
  );

  if (loading) return <AppLayout><div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></AppLayout>;
  if (!paper) return null;

  const meta = SUBJECTS[paper.subject];
  const total = paper.total_marks;
  const awarded = paper.awarded_marks || 0;
  const pct = Math.round((awarded / total) * 100);
  const grade = paper.estimated_grade || "U";

  // Distance to next grade
  const boundaries = GRADE_BOUNDARIES[paper.subject];
  const currentIdx = boundaries.findIndex(b => b.grade === grade);
  const nextBoundary = currentIdx > 0 ? boundaries[currentIdx - 1] : currentIdx === -1 ? boundaries[boundaries.length - 1] : null;
  const marksToNext = nextBoundary ? Math.max(1, Math.ceil((nextBoundary.minPercent / 100) * total) - awarded) : 0;

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-6">
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-2">Mock paper results</div>
          <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
            <span>{meta.emoji}</span>
            <span>{meta.name} — Units {paper.units.join(", ")}</span>
          </h1>
        </div>

        {/* Score banner */}
        <div className="glass-card rounded-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 opacity-10" style={{ background: "var(--gradient-primary)", filter: "blur(80px)" }} />
          <div className="relative grid md:grid-cols-3 gap-6 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">You scored</div>
              <div className="text-6xl md:text-7xl font-extrabold font-mono mt-1">
                {awarded}<span className="text-2xl text-muted-foreground">/{total}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{pct}%</div>
            </div>
            <div className="flex justify-center">
              <div className="px-8 py-6 rounded-2xl border-2 text-center" style={{ borderColor: gradeColor(grade), boxShadow: `0 0 40px -10px ${gradeColor(grade)}` }}>
                <div className="text-xs uppercase tracking-widest font-mono opacity-70">Estimated grade</div>
                <div className="text-6xl font-extrabold mt-1" style={{ color: gradeColor(grade) }}>{grade}</div>
              </div>
            </div>
            <div>
              {nextBoundary ? (
                <>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Next grade</div>
                  <div className="text-2xl font-extrabold mt-1">
                    You're <span className="text-accent">{marksToNext} marks</span> from a {nextBoundary.grade}.
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Here's what to focus on ↓</div>
                </>
              ) : (
                <div className="text-2xl font-extrabold">Top grade. Lock it in.</div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2 text-xs text-muted-foreground border-t border-border pt-4">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              AI marking is most reliable for calculation and short-answer questions. Extended response marking is indicative — use it as guidance, not a definitive grade.
              Grade boundaries vary each year — these are based on recent Edexcel data.
            </span>
          </div>
        </div>

        {/* Topic breakdown */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Marks by topic</h2>
          <div className="space-y-2">
            {topicBreakdown.map(([topic, v]) => {
              const tpct = (v.earned / v.total) * 100;
              const color = tpct >= 70 ? "hsl(var(--success))" : tpct >= 40 ? "hsl(var(--accent))" : "hsl(var(--urgent))";
              return (
                <div key={topic} className="flex items-center gap-3 text-sm">
                  <div className="w-1/3 truncate" title={topic}>{topic}</div>
                  <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${tpct}%`, background: color }} />
                  </div>
                  <div className="w-20 text-right font-mono text-xs">{v.earned}/{v.total}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-question review */}
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4">Question review</h2>
          <div className="space-y-3">
            {questions.map(q => {
              const got = q.awarded_marks || 0;
              const full = got === q.marks;
              const part = got > 0 && !full;
              return (
                <details key={q.id} className="glass-card rounded-xl">
                  <summary className="cursor-pointer p-4 flex items-center gap-3">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${full ? "bg-success/20 text-success" : got === 0 ? "bg-urgent/20 text-urgent" : "bg-accent/20 text-accent"}`}>
                      {full ? <Check className="h-4 w-4" /> : got === 0 ? <X className="h-4 w-4" /> : <span className="font-mono text-xs">~</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">Q{q.question_index + 1}. {q.topic}</div>
                      <div className="text-xs text-muted-foreground">{q.question_type}</div>
                    </div>
                    {q.flagged && <Flag className="h-3 w-3 text-accent" fill="currentColor" />}
                    <div className="font-mono text-sm">{got}<span className="text-muted-foreground">/{q.marks}</span></div>
                  </summary>
                  <div className="px-4 pb-5 pt-1 space-y-4 border-t border-border">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider mb-1">Question</div>
                      <div className="text-sm" {...formattedHtmlProps(q.question_text)} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider mb-1">Your answer</div>
                        <div className="text-sm p-3 rounded bg-secondary/40 whitespace-pre-wrap min-h-[60px]">{q.student_answer || <span className="italic text-muted-foreground">No answer</span>}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-success tracking-wider mb-1">Model answer</div>
                        <div className="text-sm p-3 rounded bg-success/5 border border-success/20 min-h-[60px]" {...formattedHtmlProps(q.model_answer || "")} />
                      </div>
                    </div>
                    {q.feedback && (
                      <div>
                        <div className="text-[10px] uppercase font-mono text-accent tracking-wider mb-1">Examiner feedback</div>
                        <div className="text-sm" {...formattedHtmlProps(q.feedback)} />
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {weakTopics.length > 0 && (
            <Link to={`/questions?subject=${paper.subject}&topic=${encodeURIComponent(weakTopics[0])}`}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 glow-primary">
                <Brain className="h-4 w-4 mr-2" />Study the topics I got wrong
              </Button>
            </Link>
          )}
          <Button size="lg" variant="outline" onClick={() => navigate("/mock-papers/new")}>
            <RotateCcw className="h-4 w-4 mr-2" />Try another paper
          </Button>
          <Link to="/dashboard">
            <Button size="lg" variant="ghost"><LayoutDashboard className="h-4 w-4 mr-2" />Back to dashboard <ArrowRight className="h-4 w-4 ml-2" /></Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default MockResults;
