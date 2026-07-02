import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getSubjectsForBoard, SubjectCode } from "@/lib/subjects";
import { findChemistryTopic } from "@/lib/chemistrySyllabus";
import { buildCieSyllabusContext } from "@/lib/cieSyllabus";
import { formattedHtmlProps } from "@/lib/formatText";
import { fileToCompressedDataUrl } from "@/lib/imageUpload";
import { Brain, Loader2, RefreshCw, Sparkles, CheckCircle2, ArrowLeft, ArrowRight, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { usePlan } from "@/hooks/usePlan";
import { UpgradeModal } from "@/components/UpgradeModal";
import { incrementUsage } from "@/lib/plan";
import { recordTopicResult, findUnitForTopic, usePageTimeTracker } from "@/lib/progressTracker";
import { DEMO_EMAILS } from "@/lib/demoAccounts";

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

// Pre-baked question + draft answer for the "Demo Student" account, so a live
// demo can jump straight to "Submit answer" (real AI marking) without waiting
// on a generated batch or typing an answer from scratch. The answer is left
// deliberately one step short of finished so the marking sim shows genuine
// partial credit + feedback, not a scripted full-marks result.
const DEMO_TOPICAL_QUESTION: Generated = {
  question_text: "Simplify fully: (x² − 9) / (x² + x − 6). Show each step of your working, including any factorisation.",
  marks: 4,
  mark_scheme: "M1 for factorising the numerator as (x − 3)(x + 3). M1 for factorising the denominator as (x + 3)(x − 2). M1 for cancelling the common factor (x + 3). A1 for the fully simplified answer (x − 3)/(x − 2).",
};
const DEMO_TOPICAL_ANSWER =
  "Numerator: x² − 9 = (x − 3)(x + 3)\nDenominator: x² + x − 6 = (x + 3)(x − 2)\n\nSo the fraction is (x − 3)(x + 3) over (x + 3)(x − 2).";

const QuestionsPage = () => {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const initialSubject = (params.get("subject") as SubjectCode) || "mathematics";
  const initialTopic = params.get("topic") || "";
  const { checkAndWarn, upgrade, closeUpgrade, state: planState } = usePlan();

  const [board, setBoard] = useState<"edexcel-ial" | "cie">("edexcel-ial");
  const SUBJECTS = getSubjectsForBoard(board);
  const [subject, setSubject] = useState<SubjectCode>(initialSubject);
  const [topic, setTopic] = useState(initialTopic || SUBJECTS[initialSubject].units[0].topics[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("Standard");
  const [qType, setQType] = useState<QType>("Short Answer");

  const [batch, setBatch] = useState<Generated[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answerImages, setAnswerImages] = useState<(string | null)[]>([]);
  const [marks, setMarks] = useState<(MarkResult | null)[]>([]);
  const [loadingGen, setLoadingGen] = useState(false);
  const [loadingMark, setLoadingMark] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("exam_board")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.exam_board === "cie") setBoard("cie");
        else setBoard("edexcel-ial");
      });
  }, [user]);

  // When the user changes subject, reset to its first topic — but skip this once
  // during restore so a saved topic isn't clobbered.
  const skipTopicReset = useRef(false);
  useEffect(() => {
    if (skipTopicReset.current) { skipTopicReset.current = false; return; }
    setTopic(SUBJECTS[subject].units[0].topics[0]);
  }, [subject]);

  // Restore the question set the user was working on (so leaving and returning
  // to this tab doesn't wipe it). Skipped when arriving via a URL link to a
  // specific topic (e.g. a roadmap review).
  useEffect(() => {
    if (params.get("subject") || params.get("topic")) return;
    let saved: any = null;
    try { saved = JSON.parse(localStorage.getItem("sia_questions_state") || "null"); } catch { /* ignore */ }
    if (saved && Array.isArray(saved.batch) && saved.batch.length > 0) {
      skipTopicReset.current = true;
      if (saved.subject) setSubject(saved.subject);
      if (saved.topic) setTopic(saved.topic);
      if (saved.difficulty) setDifficulty(saved.difficulty);
      if (saved.qType) setQType(saved.qType);
      setBatch(saved.batch);
      setAnswers(Array.isArray(saved.answers) ? saved.answers : new Array(saved.batch.length).fill(""));
      setAnswerImages(new Array(saved.batch.length).fill(null));
      setMarks(Array.isArray(saved.marks) ? saved.marks : new Array(saved.batch.length).fill(null));
      setIdx(Math.min(saved.idx || 0, saved.batch.length - 1));
      return;
    }
    // First-ever visit for the Demo Student account: seed a ready question +
    // draft answer so a live demo can click straight to "Submit answer".
    if (user?.email === DEMO_EMAILS.student) {
      skipTopicReset.current = true;
      const demoTopic = SUBJECTS.mathematics.units[0].topics[0];
      setSubject("mathematics");
      setTopic(demoTopic);
      setDifficulty("Standard");
      setQType("Short Answer");
      setBatch([DEMO_TOPICAL_QUESTION]);
      setAnswers([DEMO_TOPICAL_ANSWER]);
      setAnswerImages([null]);
      setMarks([null]);
      setIdx(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Save the working set so it survives navigation. (Answer images are skipped —
  // they're large data URLs; everything else persists.)
  useEffect(() => {
    try {
      if (batch.length === 0) localStorage.removeItem("sia_questions_state");
      else localStorage.setItem("sia_questions_state", JSON.stringify({ subject, topic, difficulty, qType, batch, answers, marks, idx }));
    } catch { /* ignore */ }
  }, [subject, topic, difficulty, qType, batch, answers, marks, idx]);

  usePageTimeTracker({
    user_id: user?.id,
    subject,
    topic,
    unit_number: findUnitForTopic(subject, topic),
  });

  const current = batch[idx];
  const currentAnswer = answers[idx] || "";
  const currentImage = answerImages[idx] || null;
  const currentMark = marks[idx] || null;

  const setCurrentAnswer = (v: string) =>
    setAnswers((a) => {
      const c = [...a];
      c[idx] = v;
      return c;
    });
  const setCurrentImage = (v: string | null) =>
    setAnswerImages((a) => {
      const c = [...a];
      c[idx] = v;
      return c;
    });

  const handleAnswerImage = async (file: File | undefined) => {
    if (!file) return;
    if (!(await checkAndWarn("photo_upload"))) return;
    setImageBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setCurrentImage(dataUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't read image");
    } finally {
      setImageBusy(false);
    }
  };

  const generateBatch = async () => {
    if (!(await checkAndWarn("questions_per_day"))) return;
    setLoadingGen(true);
    setBatch([]);
    setAnswers([]);
    setAnswerImages([]);
    setMarks([]);
    setIdx(0);
    try {
      let syllabus_context: string | undefined;
      if (board === "cie") {
        syllabus_context = buildCieSyllabusContext(subject, topic);
      } else if (subject === "chemistry") {
        const t = findChemistryTopic(topic);
        if (t)
          syllabus_context = `Edexcel IAL Chemistry — Topic: ${t.name}\nSpec statements:\n${t.statements.map((s) => `${s.ref} ${s.text}`).join("\n")}`;
      }
      const { data, error } = await supabase.functions.invoke("ai-question", {
        body: {
          action: "generate",
          subject,
          topic,
          difficulty,
          questionType: qType,
          syllabus_context,
          count: BATCH_SIZE,
          board,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const qs: Generated[] = data?.questions || [];
      if (!qs.length) throw new Error("No questions returned. Try again.");
      setBatch(qs);
      setAnswers(new Array(qs.length).fill(""));
      setAnswerImages(new Array(qs.length).fill(null));
      setMarks(new Array(qs.length).fill(null));

      if (user) {
        const rows = qs.map((q) => ({
          user_id: user.id,
          subject,
          topic,
          difficulty,
          question_type: qType,
          question_text: q.question_text,
          marks: q.marks,
          mark_scheme: q.mark_scheme,
        }));
        await supabase.from("ai_questions").insert(rows);
      }
      // Count this batch toward the daily question limit (free = 10/day)
      if (planState?.plan === "free") {
        for (let i = 0; i < BATCH_SIZE; i++) await incrementUsage("questions_per_day");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't generate. Try again.");
    } finally {
      setLoadingGen(false);
    }
  };

  const submit = async () => {
    if (!current) return;
    if (!currentAnswer.trim() && !currentImage) return;
    setLoadingMark(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-question", {
        body: {
          action: "mark",
          subject,
          topic,
          board,
          questionText: current.question_text,
          markScheme: current.mark_scheme,
          totalMarks: current.marks,
          studentAnswer: currentAnswer || undefined,
          studentAnswerImage: currentImage || undefined,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMarks((m) => {
        const c = [...m];
        c[idx] = data;
        return c;
      });
      // Persist progress: update the ai_questions row for this attempt and bump
      // topic_progress so the Progress & Insights page reflects the work.
      if (user && current) {
        const unit_number = findUnitForTopic(subject, topic);
        await Promise.all([
          supabase
            .from("ai_questions")
            .update({
              student_answer: currentAnswer || null,
              awarded_marks: data.awarded_marks ?? null,
              feedback: data.feedback ?? null,
              unit_number,
            })
            .eq("user_id", user.id)
            .eq("question_text", current.question_text)
            .is("awarded_marks", null),
          recordTopicResult({
            user_id: user.id,
            subject,
            topic,
            unit_number,
            awarded: data.awarded_marks ?? 0,
            total: data.total_marks ?? current.marks,
          }),
        ]);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Marking failed");
    } finally {
      setLoadingMark(false);
    }
  };

  const goNext = () => setIdx((i) => Math.min(batch.length - 1, i + 1));
  const goPrev = () => setIdx((i) => Math.max(0, i - 1));

  const subjectMeta = SUBJECTS[subject];
  const allTopics = Array.from(new Set(subjectMeta.units.flatMap((u) => u.topics)));
  const completed = marks.filter(Boolean).length;
  const totalAwarded = marks.reduce((a, m) => a + (m?.awarded_marks || 0), 0);
  const totalPossible = marks.reduce((a, m) => a + (m?.total_marks || 0), 0);

  return (
    <AppLayout>
      <SEO title="Practice questions — SIA Smart Revision" description="AI-marked A-Level topical questions across Edexcel IAL and Cambridge — examiner-grade feedback in seconds." path="/questions" />
      <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="text-sm text-primary font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Topical Question Set · {board === "cie" ? "CIE" : "Edexcel IAL"}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Train like it's exam day.</h1>
          <p className="text-muted-foreground mt-1">
            A fresh set of {BATCH_SIZE} original questions per topic. Examiner-grade marking on each.
          </p>
        </div>

        {/* Setup */}
        <div className="surface p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="q-subject" className="text-xs uppercase tracking-wider text-muted-foreground">Subject</label>
              <select
                id="q-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectCode)}
                className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm"
              >
                {Object.values(SUBJECTS).map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.emoji} {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="q-topic" className="text-xs uppercase tracking-wider text-muted-foreground">Topic</label>
              <select
                id="q-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm"
              >
                {allTopics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="q-type" className="text-xs uppercase tracking-wider text-muted-foreground">Type</label>
              <select
                id="q-type"
                value={qType}
                onChange={(e) => setQType(e.target.value as QType)}
                className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm"
              >
                {(["Multiple Choice", "Short Answer", "Extended Response", "Calculation"] as QType[]).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="q-difficulty" className="text-xs uppercase tracking-wider text-muted-foreground">Difficulty</label>
              <select
                id="q-difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm"
              >
                {(["Foundation", "Standard", "Challenge"] as Difficulty[]).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={generateBatch} disabled={loadingGen} className="mt-5 btn-primary">
            {loadingGen ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating set of {BATCH_SIZE}…
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                {batch.length ? "Generate new set" : `Generate set of ${BATCH_SIZE}`}
              </>
            )}
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
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      className={`h-7 w-7 rounded-full text-[11px] font-mono font-semibold transition-all ${
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : isDone
                            ? "bg-success/20 text-success"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/70"
                      }`}
                    >
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
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  {subjectMeta.name} · {topic}
                </div>
                <div className="text-xs font-mono text-primary mt-1">
                  Question {idx + 1} of {batch.length} · {difficulty} · {qType}
                </div>
              </div>
              <div className="font-mono text-sm bg-secondary px-3 py-1.5 rounded-md">[{current.marks} marks]</div>
            </div>

            <div className="mb-6">
              <div className="text-lg leading-relaxed text-foreground" {...formattedHtmlProps(current.question_text)} />
            </div>

            {!currentMark && (
              <>
                {qType === "Multiple Choice" && current.options ? (
                  <div className="space-y-2 mb-6">
                    {current.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentAnswer(opt)}
                        className={`w-full text-left p-4 rounded-lg border transition-all flex items-center gap-3 ${currentAnswer === opt ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}
                      >
                        <span className="font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + i)}</span>
                        <span {...formattedHtmlProps(opt)} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    <Textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Write your answer here. Show your working — or upload a photo of your handwritten work below."
                      className="min-h-[180px] mb-3 font-mono text-sm"
                    />
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        handleAnswerImage(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                    {currentImage ? (
                      <div className="relative inline-block mb-4">
                        <img
                          src={currentImage}
                          alt="your working"
                          className="max-h-48 rounded-md border border-border"
                        />
                        <button
                          onClick={() => setCurrentImage(null)}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label="Remove image"
                          type="button"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileRef.current?.click()}
                        disabled={imageBusy}
                        className="mb-4"
                      >
                        {imageBusy ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Reading…
                          </>
                        ) : (
                          <>
                            <ImagePlus className="h-3.5 w-3.5 mr-1.5" /> Upload photo of working
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}
                <div className="flex gap-3">
                  <Button
                    onClick={submit}
                    disabled={loadingMark || (!currentAnswer.trim() && !currentImage)}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {loadingMark ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Marking…
                      </>
                    ) : (
                      "Submit answer"
                    )}
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
                  <div className="text-5xl font-mono font-extrabold text-gradient">
                    {currentMark.awarded_marks}
                    <span className="text-2xl text-muted-foreground">/{currentMark.total_marks}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Marks awarded</div>
                    <div className="text-sm font-medium mt-0.5">
                      {currentMark.awarded_marks === currentMark.total_marks
                        ? "Full marks. Clean."
                        : currentMark.awarded_marks >= currentMark.total_marks * 0.7
                          ? "Strong. Tighten the gaps below."
                          : "Plenty to improve. Read the feedback."}
                    </div>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-accent font-mono mb-2">Examiner feedback</div>
                  <div
                    className="max-w-none text-sm leading-relaxed text-foreground"
                    {...formattedHtmlProps(currentMark.feedback)}
                  />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-success font-mono mb-2">Model answer</div>
                  <div
                    className="max-w-none text-sm leading-relaxed text-foreground p-4 rounded-lg bg-success/5 border border-success/20"
                    {...formattedHtmlProps(currentMark.model_answer)}
                  />
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
            <p className="text-muted-foreground">
              Pick a topic above and hit generate. We'll build a set of {BATCH_SIZE} original questions in real{" "}
              {board === "cie" ? "CIE" : "Edexcel"} style.
            </p>
          </div>
        )}
      </div>
      <UpgradeModal
        open={upgrade.open}
        onClose={closeUpgrade}
        limitKey={upgrade.key}
        plan={planState?.plan ?? "free"}
        used={upgrade.used}
        limit={upgrade.limit}
      />
    </AppLayout>
  );
};

export default QuestionsPage;
