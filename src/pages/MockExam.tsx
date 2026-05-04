import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SUBJECTS, SubjectCode, estimateGrade } from "@/lib/subjects";
import { Loader2, Flag, Send, Eye, EyeOff, Download } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formattedHtmlProps } from "@/lib/formatText";

interface Q {
  id: string;
  question_index: number;
  topic: string;
  question_type: string;
  command_word: string | null;
  question_text: string;
  marks: number;
  options: string[] | null;
  student_answer: string | null;
  flagged: boolean;
  mark_scheme: string | null;
  model_answer: string | null;
}

interface Paper {
  id: string;
  subject: SubjectCode;
  units: number[];
  total_marks: number;
  time_limit_minutes: number;
  status: string;
  started_at: string;
}

const formatTimer = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const MockExam = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [now, setNow] = useState(Date.now());
  const submittedRef = useRef(false);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([
      supabase.from("mock_papers").select("*").eq("id", id).single(),
      supabase.from("mock_paper_questions").select("*").eq("mock_paper_id", id).order("question_index"),
    ]).then(([p, q]) => {
      if (p.data) setPaper(p.data as any);
      if (q.data) {
        setQuestions(q.data as Q[]);
        const a: Record<string, string> = {};
        const f: Record<string, boolean> = {};
        for (const row of q.data as Q[]) {
          a[row.id] = row.student_answer ?? "";
          f[row.id] = row.flagged;
        }
        setAnswers(a);
        setFlags(f);
      }
      setLoading(false);
    });
  }, [user, id]);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = useMemo(() => {
    if (!paper) return 0;
    const elapsed = Math.floor((now - new Date(paper.started_at).getTime()) / 1000);
    return Math.max(0, paper.time_limit_minutes * 60 - elapsed);
  }, [paper, now]);

  // Auto-submit on timer end
  useEffect(() => {
    if (paper && remaining === 0 && !submittedRef.current && paper.status === "in_progress") {
      submittedRef.current = true;
      handleSubmit(true);
    }
  }, [remaining, paper]); // eslint-disable-line

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  if (!paper || !user) return null;
  if (paper.status === "marked") {
    navigate(`/mock-papers/${paper.id}/results`, { replace: true });
    return null;
  }

  const meta = SUBJECTS[paper.subject];
  const totalAnswered = Object.values(answers).filter(v => v && v.trim()).length;

  const timerColor = remaining <= 600 ? "text-urgent" : remaining <= 1800 ? "text-accent" : "text-foreground";
  const timerPulse = remaining <= 600 ? "animate-pulse" : "";

  const setAnswer = (qid: string, v: string) => setAnswers(p => ({ ...p, [qid]: v }));
  const toggleFlag = (qid: string) => setFlags(p => ({ ...p, [qid]: !p[qid] }));
  const toggleReveal = (qid: string) => setRevealed(p => ({ ...p, [qid]: !p[qid] }));

  const stripHtml = (s: string) => {
    const div = document.createElement("div");
    div.innerHTML = s || "";
    return (div.textContent || div.innerText || "").replace(/\s+\n/g, "\n").trim();
  };

  const downloadPdf = () => {
    if (!paper) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const ensureSpace = (h: number) => {
      if (y + h > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    const writeWrapped = (text: string, opts: { size?: number; bold?: boolean; gap?: number } = {}) => {
      const { size = 11, bold = false, gap = 4 } = opts;
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text || "", maxWidth);
      const lineHeight = size * 1.35;
      for (const line of lines) {
        ensureSpace(lineHeight);
        doc.text(line, margin, y);
        y += lineHeight;
      }
      y += gap;
    };

    // Title
    writeWrapped(`${meta.name} — Mock Paper`, { size: 18, bold: true, gap: 6 });
    writeWrapped(`${meta.spec} · Units ${paper.units.join(", ")} · ${paper.total_marks} marks · ${paper.time_limit_minutes} mins`, { size: 10, gap: 14 });

    // Instructions
    writeWrapped("Instructions:", { size: 11, bold: true, gap: 2 });
    writeWrapped("• Answer all questions in the spaces provided (use separate paper if needed).", { size: 10, gap: 1 });
    writeWrapped("• Show all working. Marks may be awarded for method.", { size: 10, gap: 1 });
    writeWrapped("• Total marks shown in brackets [ ] at the end of each question.", { size: 10, gap: 14 });

    // Questions
    questions.forEach(q => {
      ensureSpace(60);
      writeWrapped(`Q${q.question_index + 1}.  (${q.topic} · ${q.question_type})   [${q.marks}]`, { size: 11, bold: true, gap: 4 });
      writeWrapped(stripHtml(q.question_text), { size: 11, gap: 6 });
      if (q.options && q.options.length > 0) {
        q.options.forEach((opt, i) => {
          writeWrapped(`   ${String.fromCharCode(65 + i)})  ${opt}`, { size: 11, gap: 2 });
        });
        y += 4;
      } else {
        // Blank answer space
        const lines = Math.max(3, Math.min(10, Math.ceil(q.marks * 1.5)));
        for (let i = 0; i < lines; i++) {
          ensureSpace(18);
          doc.setDrawColor(180);
          doc.line(margin, y + 12, margin + maxWidth, y + 12);
          y += 18;
        }
        y += 4;
      }
    });

    // Mark scheme & model answers — always included so user can self-mark
    doc.addPage();
    y = margin;
    writeWrapped("Mark Scheme & Model Answers", { size: 16, bold: true, gap: 12 });
    questions.forEach(q => {
      ensureSpace(40);
      writeWrapped(`Q${q.question_index + 1}.   [${q.marks}]`, { size: 11, bold: true, gap: 2 });
      if (q.model_answer) {
        writeWrapped("Model answer:", { size: 10, bold: true, gap: 1 });
        writeWrapped(stripHtml(q.model_answer), { size: 10, gap: 4 });
      }
      if (q.mark_scheme) {
        writeWrapped("Mark scheme:", { size: 10, bold: true, gap: 1 });
        writeWrapped(stripHtml(q.mark_scheme), { size: 10, gap: 8 });
      }
    });

    doc.save(`${meta.name.replace(/\s+/g, "-")}-mock-${paper.units.join("-")}.pdf`);
  };

  const handleSubmit = async (auto = false) => {
    if (!paper) return;
    setSubmitting(true);
    try {
      // Save answers + flags
      for (const q of questions) {
        await supabase.from("mock_paper_questions").update({
          student_answer: answers[q.id] || null,
          flagged: !!flags[q.id],
        }).eq("id", q.id);
      }
      // Refetch with mark scheme + model answer for AI marking
      const { data: full } = await supabase.from("mock_paper_questions")
        .select("question_index,question_type,question_text,marks,mark_scheme,model_answer,student_answer,id")
        .eq("mock_paper_id", paper.id).order("question_index");
      const payload = (full || []).map((q: any) => ({
        id: q.id,
        question_index: q.question_index,
        question_type: q.question_type,
        question_text: q.question_text,
        marks: q.marks,
        mark_scheme: q.mark_scheme,
        model_answer: q.model_answer,
        student_answer: q.student_answer,
      }));

      const { data: marked, error } = await supabase.functions.invoke("ai-mock-paper", {
        body: { action: "mark", subject: paper.subject, questions: payload },
      });
      if (error) throw error;
      if (marked?.error) throw new Error(marked.error);

      const results: { question_index: number; awarded_marks: number; feedback: string }[] = marked.results || [];
      let total = 0;
      for (const r of results) {
        const q = payload.find((p: any) => p.question_index === r.question_index);
        if (!q) continue;
        const studentAns = (q.student_answer ?? "").toString().trim();
        // Hard guard: blank answers always get 0, regardless of what the AI returned.
        const rawAwarded = studentAns ? r.awarded_marks : 0;
        const awarded = Math.max(0, Math.min(q.marks, rawAwarded));
        total += awarded;
        await supabase.from("mock_paper_questions").update({
          awarded_marks: awarded,
          feedback: studentAns ? r.feedback : "No answer provided. 0 marks awarded.",
        }).eq("id", q.id);
      }
      const grade = estimateGrade(paper.subject, total, paper.total_marks);
      await supabase.from("mock_papers").update({
        status: "marked",
        awarded_marks: total,
        estimated_grade: grade,
        submitted_at: new Date().toISOString(),
      }).eq("id", paper.id);

      if (auto) toast.warning("Time's up — paper submitted automatically.");
      navigate(`/mock-papers/${paper.id}/results`);
    } catch (err: any) {
      toast.error(err?.message || "Marking failed. Try submitting again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Exam header — no sidebar, no overlay */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">{meta.spec} · Mock Paper</div>
            <div className="font-bold flex items-center gap-2">
              <span>{meta.emoji}</span>
              <span>{meta.name} — Units {paper.units.join(", ")}</span>
            </div>
          </div>
          <div className="text-center">
            <div className={`font-mono font-extrabold text-2xl md:text-3xl ${timerColor} ${timerPulse}`}>{formatTimer(remaining)}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Time remaining</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xl font-extrabold">{paper.total_marks}<span className="text-xs text-muted-foreground"> marks</span></div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{totalAnswered}/{questions.length} answered</div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 grid lg:grid-cols-[1fr_180px] gap-6">
        <div className="space-y-6">
          {questions.map(q => (
            <div key={q.id} id={`q-${q.question_index}`} className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-border">
                <div className="flex items-baseline gap-3">
                  <div className="font-mono font-extrabold text-xl">{q.question_index + 1}</div>
                  <div className="text-xs text-muted-foreground font-mono">{q.topic} · {q.question_type}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleFlag(q.id)}
                    className={`p-1.5 rounded-md transition-colors ${flags[q.id] ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
                    title="Flag for review">
                    <Flag className="h-4 w-4" fill={flags[q.id] ? "currentColor" : "none"} />
                  </button>
                  <div className="font-mono text-xs bg-secondary px-2 py-1 rounded">[{q.marks}]</div>
                </div>
              </div>
              <div className="prose prose-invert max-w-none text-base leading-relaxed mb-5" {...formattedHtmlProps(q.question_text)} />

              {q.options && q.options.length > 0 ? (
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <button key={i} onClick={() => setAnswer(q.id, opt)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${answers[q.id] === opt ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                      <span className="font-mono text-xs text-muted-foreground mr-3">{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <Textarea value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)}
                  placeholder="Write your answer. Show your working."
                  className="min-h-[120px] font-mono text-sm" />
              )}
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button size="lg" onClick={() => setConfirmSubmit(true)} disabled={submitting}
              className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Marking…</> : <><Send className="h-4 w-4 mr-2" />Submit paper</>}
            </Button>
          </div>
        </div>

        {/* Question navigator */}
        <aside className="hidden lg:block">
          <div className="glass-card rounded-xl p-3 sticky top-24">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-2 px-1">Questions</div>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map(q => {
                const answered = answers[q.id]?.trim();
                const flagged = flags[q.id];
                return (
                  <a key={q.id} href={`#q-${q.question_index}`}
                    className={`aspect-square rounded text-xs font-mono font-bold flex items-center justify-center border transition-all ${
                      flagged ? "border-accent text-accent bg-accent/10" :
                      answered ? "border-primary/50 bg-primary/10 text-primary" :
                      "border-border text-muted-foreground hover:border-foreground/40"
                    }`}>
                    {q.question_index + 1}
                  </a>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-border text-[10px] text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-primary/40" />Answered</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-accent/60" />Flagged</div>
            </div>
          </div>
        </aside>
      </div>

      <AlertDialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit your paper?</AlertDialogTitle>
            <AlertDialogDescription>
              You cannot change answers after this. {totalAnswered}/{questions.length} questions answered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep going</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSubmit(false)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MockExam;
