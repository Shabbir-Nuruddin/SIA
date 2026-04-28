import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { SUBJECTS, SubjectCode, formatDuration, gradeColor } from "@/lib/subjects";
import { FileClock, Plus, Loader2, Info } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Mock {
  id: string;
  subject: SubjectCode;
  units: number[];
  total_marks: number;
  awarded_marks: number | null;
  estimated_grade: string | null;
  status: string;
  submitted_at: string | null;
  created_at: string;
}

const MockPapers = () => {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const subject = params.get("subject");
  const unit = params.get("unit");

  const [loading, setLoading] = useState(true);
  const [mocks, setMocks] = useState<Mock[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("mock_papers")
      .select("id,subject,units,total_marks,awarded_marks,estimated_grade,status,submitted_at,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setMocks(data as Mock[]); setLoading(false); });
  }, [user]);

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs text-primary font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
              <FileClock className="h-3 w-3" /> Mock Paper Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Sit a real Edexcel-style mock.</h1>
            <p className="text-muted-foreground mt-1">Original questions. Real timing. Examiner-grade marking.</p>
          </div>
          <Link to={`/mock-papers/new${subject ? `?subject=${subject}${unit ? `&unit=${unit}` : ""}` : ""}`}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 glow-primary">
              <Plus className="h-4 w-4 mr-2" /> New mock paper
            </Button>
          </Link>
        </div>

        <div className="glass-card rounded-xl p-3 mb-6 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>AI marking is most reliable for calculation and short-answer questions. Extended response marking is indicative — use it as guidance, not a definitive grade.</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : mocks.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <FileClock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No mocks yet. Set your baseline.</h3>
            <p className="text-muted-foreground mb-6">Real exam conditions. Real Edexcel style. Let's go.</p>
            <Link to="/mock-papers/new"><Button className="bg-primary hover:bg-primary/90"><Plus className="h-4 w-4 mr-2" />Build your first mock</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {mocks.map(m => {
              const meta = SUBJECTS[m.subject];
              const pct = m.awarded_marks !== null ? Math.round((m.awarded_marks / m.total_marks) * 100) : null;
              return (
                <Link key={m.id} to={m.status === "marked" ? `/mock-papers/${m.id}/results` : `/mock-papers/exam/${m.id}`}
                  className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-primary/40 transition-all">
                  <span className="text-2xl">{meta.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold">{meta.name} — Units {m.units.join(", ")}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      {format(parseISO(m.created_at), "d MMM yyyy")} · {m.total_marks} marks · {m.status === "marked" ? "Completed" : m.status === "in_progress" ? "In progress" : m.status}
                    </div>
                  </div>
                  {m.status === "marked" && m.estimated_grade && (
                    <div className="text-right">
                      <div className="font-mono text-2xl font-extrabold">{m.awarded_marks}<span className="text-sm text-muted-foreground">/{m.total_marks}</span></div>
                      <div className="font-mono text-xs" style={{ color: gradeColor(m.estimated_grade) }}>Grade {m.estimated_grade} · {pct}%</div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MockPapers;
