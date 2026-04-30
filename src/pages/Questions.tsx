import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getSubjectsForBoard, SubjectCode } from "@/lib/subjects";
import { findChemistryTopic } from "@/lib/chemistrySyllabus";
import { buildCieSyllabusContext } from "@/lib/cieSyllabus";
import { formattedHtmlProps } from "@/lib/formatText";
import { fileToCompressedDataUrl } from "@/lib/imageUpload";
import { Brain, Loader2, RefreshCw, Sparkles, CheckCircle2, ArrowLeft, ArrowRight, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

type Difficulty = "Foundation" | "Standard" | "Challenge";
type QType = "Multiple Choice" | "Short Answer" | "Extended Response" | "Calculation";

interface Generated {
  question_text: string;
  marks: number;
  mark_scheme: string;
  options?: string[];
}

interface MarkResult {
  awarded_marks: number;
  total_marks: number;
  feedback: string;
  model_answer: string;
}

const BATCH_SIZE = 10;

const QuestionsPage = () => {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const initialSubject = (params.get("subject") as SubjectCode) || "mathematics";
  const initialTopic = params.get("topic") || "";

  const [board, setBoard] = useState<"edexcel-ial" | "cie">("edexcel-ial");
  const SUBJECTS = getSubjectsForBoard(board);
  const [subject, setSubject] = useState<SubjectCode>(initialSubject);
  const [topic, setTopic] = useState(initialTopic || SUBJECTS[initialSubject].units[0].topics[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("Standard");
  const [qType, setQType] = useState<QType>("Short Answer");

  const [batch, setBatch] = useState<Generated[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [marks, setMarks] = useState<(MarkResult | null)[]>([]);
  const [loadingGen, setLoadingGen] = useState(false);
  const [loadingMark, setLoadingMark] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("exam_board").eq("id", user.id).single().then(({ data }) => {
      if (data?.exam_board === "cie") setBoard("cie"); else setBoard("edexcel-ial");
    });
  }, [user]);

  useEffect(() => { setTopic(SUBJECTS[subject].units[0].topics[0]); }, [subject]);

  const current = batch[idx];
  const currentAnswer = answers[idx] || "";
  const currentMark = marks[idx] || null;

  const setCurrentAnswer = (v: string) => setAnswers(a => { const c = [...a]; c[idx] = v; return c; });

  const generateBatch = async () => {
    setLoadingGen(true);
    setBatch([]); setAnswers([]); setMarks([]); setIdx(0);
    try {
      let syllabus_context: string | undefined;
      if (board === "cie") {
        syllabus_context = buildCieSyllabusContext(subject, topic);
      } else if (subject === "chemistry") {
        const t = findChemistryTopic(topic);
        if (t) syllabus_context = `Edexcel IAL Chemistry — Topic: ${t.name}\nSpec statements:\n${t.statements.map(s => `${s.ref} ${s.text}`).join("\n")}`;
      }
      const { data, error } = await supabase.functions.invoke("ai-question", {
        body: { action: "generate", subject, topic, difficulty, questionType: qType, syllabus_context, count: BATCH_SIZE, board },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const qs: Generated[] = data?.questions || [];
      if (!qs.length) throw new Error("No questions returned. Try again.");
      setBatch(qs);
      setAnswers(new Array(qs.length).fill(""));
      setMarks(new Array(qs.length).fill(null));

      if (user) {
        const rows = qs.map(q => ({
          user_id: user.id, subject, topic, difficulty, question_type: qType,
          question_text: q.question_text, marks: q.marks, mark_scheme: q.mark_scheme,
        }));
        await supabase.from("ai_questions").insert(rows);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't generate. Try again.");
    } finally {
      setLoadingGen(false);
    }
  };

  const submit = async () => {
    if (!current || !currentAnswer.trim()) return;
    setLoadingMark(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-question", {
        body: {
          action: "mark", subject, topic, board,
          questionText: current.question_text, markScheme: current.mark_scheme,
          totalMarks: current.marks, studentAnswer: currentAnswer,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMarks(m => { const c = [...m]; c[idx] = data; return c; });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Marking failed");
    } finally {
      setLoadingMark(false);
    }
  };

  const goNext = () => setIdx(i => Math.min(batch.length - 1, i + 1));
  const goPrev = () => setIdx(i => Math.max(0, i - 1));

  const subjectMeta = SUBJECTS[subject];
  const allTopics = Array.from(new Set(subjectMeta.units.flatMap(u => u.topics)));
  const completed = marks.filter(Boolean).length;
  const totalAwarded = marks.reduce((a, m) => a + (m?.awarded_marks || 0), 0);
  const totalPossible = marks.reduce((a, m) => a + (m?.total_marks || 0), 0);

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="text-sm text-primary font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Topical Question Set · {board === "cie" ? "CIE" : "Edexcel IAL"}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Train like it's exam day.</h1>
          <p className="text-muted-foreground mt-1">A fresh set of {BATCH_SIZE} original questions per topic. Examiner-grade marking on each.</p>
        </div>

        {/* Setup */}
        <div className="surface p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value as SubjectCode)}
                className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
                {Object.values(SUBJECTS).map(s => <option key={s.code} value={s.code}>{s.emoji} {s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Topic</label>
              <select value={topic} onChange={e => setTopic(e.target.value)}
                className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
                {allTopics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Type</label>
              <select value={qType} onChange={e => setQType(e.target.value as QType)}
                className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
                {(["Multiple Choice", "Short Answer", "Extended Response", "Calculation"] as QType[]).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}
                className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
                {(["Foundation", "Standard", "Challenge"] as Difficulty[]).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <Button onClick={generateBatch} disabled={loadingGen} className="mt-5 btn-primary">
            {loadingGen
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating set of {BATCH_SIZE}…</>
              : <><Brain className="h-4 w-4 mr-2" />{batch.length ? "Generate new set" : `Generate set of ${BATCH_SIZE}`}</>}
          </Button>
        </div>

        {/* Question pager */}
        {batch.length > 0 && (
          <div className="surface p-6 md:p-8 animate-in-up">
            {/* Pager */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                {batch.map((_, i) => {
                  const isDone = !!marks[i];
                  const isCurrent = i === idx;
                  return (
                    <button key={i} onClick={() => setIdx(i)}
                      className={`h-7 w-7 rounded-full text-[11px] font-mono font-semibold transition-all ${
                        isCurrent ? "bg-primary text-primary-foreground"
                        : isDone ? "bg-success/20 text-success"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/70"
                      }`}>
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="text-xs font-mono text-muted-foreground tabular">
                {completed}/{batch.length} marked {totalPossible > 0 && `· ${totalAwarded}/${totalPossible}`}
              </div>
            </div>

            <div className="flex items-start justify-between mb-5 pb-5 border-b border-border">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{subjectMeta.name} · {topic}</div>
                <div className="text-xs font-mono text-primary mt-1">Question {idx + 1} of {batch.length} · {difficulty} · {qType}</div>
              </div>
              <div className="font-mono text-sm bg-secondary px-3 py-1.5 rounded-md">[{current.marks} marks]</div>
            </div>

            <div className="prose prose-invert max-w-none mb-6">
              <div className="text-lg leading-relaxed" {...formattedHtmlProps(current.question_text)} />
            </div>

            {!currentMark && (
              <>
                {qType === "Multiple Choice" && current.options ? (
                  <div className="space-y-2 mb-6">
                    {current.options.map((opt, i) => (
                      <button key={i} onClick={() => setCurrentAnswer(opt)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${currentAnswer === opt ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                        <span className="font-mono text-xs text-muted-foreground mr-3">{String.fromCharCode(65 + i)}</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Textarea value={currentAnswer} onChange={e => setCurrentAnswer(e.target.value)}
                    placeholder="Write your answer here. Show your working."
                    className="min-h-[180px] mb-4 font-mono text-sm" />
                )}
                <div className="flex gap-3">
                  <Button onClick={submit} disabled={loadingMark || !currentAnswer.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    {loadingMark ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Marking…</> : "Submit answer"}
                  </Button>
                  <Button variant="outline" onClick={goNext} disabled={idx === batch.length - 1}>
                    Skip <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </>
            )}

            {currentMark && (
              <div className="space-y-6 animate-in-up">
                <div className="flex items-center gap-4 p-5 rounded-xl bg-secondary/50">
                  <div className="text-5xl font-mono font-extrabold text-gradient">{currentMark.awarded_marks}<span className="text-2xl text-muted-foreground">/{currentMark.total_marks}</span></div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Marks awarded</div>
                    <div className="text-sm font-medium mt-0.5">
                      {currentMark.awarded_marks === currentMark.total_marks ? "Full marks. Clean."
                        : currentMark.awarded_marks >= currentMark.total_marks * 0.7 ? "Strong. Tighten the gaps below."
                        : "Plenty to improve. Read the feedback."}
                    </div>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-accent font-mono mb-2">Examiner feedback</div>
                  <div className="prose prose-invert max-w-none text-sm" {...formattedHtmlProps(currentMark.feedback)} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-success font-mono mb-2">Model answer</div>
                  <div className="prose prose-invert max-w-none text-sm p-4 rounded-lg bg-success/5 border border-success/20" {...formattedHtmlProps(currentMark.model_answer)} />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6 pt-5 border-t border-border">
              <Button variant="outline" onClick={goPrev} disabled={idx === 0}>
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Previous
              </Button>
              <Button onClick={goNext} disabled={idx === batch.length - 1} className="btn-primary">
                Next <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {batch.length === 0 && !loadingGen && (
          <div className="surface p-12 text-center">
            <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Ready when you are.</h3>
            <p className="text-muted-foreground">Pick a topic above and hit generate. We'll build a set of {BATCH_SIZE} original questions in real {board === "cie" ? "CIE" : "Edexcel"} style.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default QuestionsPage;
