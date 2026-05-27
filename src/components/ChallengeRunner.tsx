/**
 * ChallengeRunner — In-place question runner used by the Roadmap "Challenge"
 * action. Reuses the same `ai-question` edge function as the Topical Questions
 * page so no business logic is duplicated. Renders inline (no navigation).
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formattedHtmlProps } from "@/lib/formatText";
import { findChemistryTopic } from "@/lib/chemistrySyllabus";
import type { SubjectCode } from "@/lib/subjects";
import { Loader2, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Difficulty = "Foundation" | "Standard" | "Challenge";

interface Props {
  subject: SubjectCode | null | undefined;
  topic: string | null | undefined;
  unitNumber?: number | null;
  difficulty?: Difficulty;
  total?: number;
  onFinished?: (scorePercent: number) => void;
}

interface Question {
  question_text: string;
  marks: number;
  mark_scheme: string;
}

interface Marking {
  awarded_marks: number;
  total_marks: number;
  feedback: string;
  model_answer: string;
}

export const ChallengeRunner = ({
  subject,
  topic,
  unitNumber,
  difficulty = "Challenge",
  total = 5,
  onFinished,
}: Props) => {
  const { user } = useAuth();
  const [idx, setIdx] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [marking, setMarking] = useState<Marking | null>(null);
  const [loadingGen, setLoadingGen] = useState(false);
  const [loadingMark, setLoadingMark] = useState(false);
  const [scores, setScores] = useState<{ awarded: number; total: number }[]>([]);
  const [done, setDone] = useState(false);

  const generate = async () => {
    setLoadingGen(true);
    setQuestion(null);
    setAnswer("");
    setMarking(null);
    try {
      let syllabus_context: string | undefined;
      if (subject === "chemistry" && topic) {
        const t = findChemistryTopic(topic);
        if (t) {
          syllabus_context = `Edexcel International A-Level Chemistry — Unit ${t.unit}, Topic ${t.number}: ${t.name}\nOfficial assessment statements:\n${t.statements.map(s => `${s.ref} ${s.text}`).join("\n")}`;
        }
      }
      const { data, error } = await supabase.functions.invoke("ai-question", {
        body: {
          action: "generate",
          subject,
          topic,
          difficulty,
          questionType: "Short Answer",
          syllabus_context,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const first = Array.isArray((data as any)?.questions) ? (data as any).questions[0] : (data as any);
      if (!first?.question_text) throw new Error("No question returned");
      setQuestion(first);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Question generation failed");
    } finally {
      setLoadingGen(false);
    }
  };

  useEffect(() => { if (!done) generate(); /* eslint-disable-next-line */ }, [idx]);

  const submit = async () => {
    if (!question || !answer.trim()) return;
    setLoadingMark(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-question", {
        body: {
          action: "mark",
          subject,
          topic,
          questionText: question.question_text,
          markScheme: question.mark_scheme,
          totalMarks: question.marks,
          studentAnswer: answer,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setMarking(data as Marking);
      setScores(s => [...s, { awarded: (data as any).awarded_marks, total: (data as any).total_marks }]);

      if (user) {
        await supabase.from("ai_questions").insert({
          user_id: user.id,
          subject: subject as any,
          topic: topic ?? null,
          difficulty,
          question_type: "Short Answer",
          question_text: question.question_text,
          marks: question.marks,
          mark_scheme: question.mark_scheme,
          student_answer: answer,
          feedback: (data as any).feedback,
          awarded_marks: (data as any).awarded_marks,
          unit_number: unitNumber ?? null,
        });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Marking failed");
    } finally {
      setLoadingMark(false);
    }
  };

  const next = () => {
    if (idx + 1 >= total) {
      const a = scores.reduce((sum, s) => sum + s.awarded, 0);
      const t = scores.reduce((sum, s) => sum + s.total, 0);
      const pct = t === 0 ? 0 : Math.round((a / t) * 100);
      setDone(true);
      onFinished?.(pct);
    } else {
      setIdx(i => i + 1);
    }
  };

  const totalAwarded = scores.reduce((a, s) => a + s.awarded, 0);
  const totalPossible = scores.reduce((a, s) => a + s.total, 0);
  const finalPct = totalPossible === 0 ? 0 : Math.round((totalAwarded / totalPossible) * 100);

  if (done) {
    return (
      <div className="space-y-4 text-sm animate-fade-in">
        <div className="flex items-center gap-2 text-success font-semibold text-base">
          <CheckCircle2 className="h-5 w-5" /> Challenge complete · {finalPct}%
        </div>
        <p className="text-muted-foreground">
          You scored <span className="text-foreground font-semibold tabular-nums">{totalAwarded}/{totalPossible}</span> across {total} {difficulty.toLowerCase()} questions on <span className="text-foreground">{topic}</span>.
        </p>
        <Button
          onClick={() => { setIdx(0); setScores([]); setDone(false); }}
          className="btn-primary h-9 px-4 text-sm"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Run another challenge
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
        <span>Challenge · Question {idx + 1} of {total}</span>
        <span className="tabular-nums">Score: {totalAwarded} / {totalPossible || "—"}</span>
      </div>

      {loadingGen && (
        <div className="py-12 flex items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />Generating a {difficulty.toLowerCase()} question…
        </div>
      )}

      {question && !loadingGen && (
        <>
          <div className="surface p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[11px] uppercase font-mono text-muted-foreground">{topic}</span>
              <span className="text-[11px] font-mono">[{question.marks} marks]</span>
            </div>
            <div className="leading-relaxed" {...formattedHtmlProps(question.question_text)} />
          </div>

          {!marking && (
            <>
              <Textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Write your answer. Show working."
                className="min-h-[120px] text-sm font-mono"
              />
              <Button onClick={submit} disabled={!answer.trim() || loadingMark} className="btn-primary h-9 px-4 text-sm">
                {loadingMark ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Marking…</> : "Submit answer"}
              </Button>
            </>
          )}

          {marking && (
            <div className="space-y-3 animate-fade-in">
              <div className="surface p-3 border-l-4" style={{
                borderLeftColor: marking.awarded_marks === marking.total_marks ? "hsl(var(--success))" :
                  marking.awarded_marks >= marking.total_marks * 0.5 ? "hsl(var(--accent))" : "hsl(var(--urgent, 0 80% 60%))",
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-lg font-bold tabular-nums">{marking.awarded_marks}/{marking.total_marks}</span>
                  <span className="text-xs text-muted-foreground">marks</span>
                </div>
                <div className="text-[13px]" {...formattedHtmlProps(marking.feedback)} />
              </div>
              <div className="surface p-3">
                <div className="text-[11px] uppercase tracking-wider text-success font-mono mb-1.5">Model answer</div>
                <div className="text-[13px]" {...formattedHtmlProps(marking.model_answer)} />
              </div>
              <Button onClick={next} className="btn-primary h-9 px-4 text-sm">
                {idx + 1 >= total ? "Finish challenge" : "Next question"} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
