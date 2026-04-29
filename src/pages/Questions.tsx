import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { findChemistryTopic } from "@/lib/chemistrySyllabus";
import { formattedHtmlProps } from "@/lib/formatText";
import { Brain, Loader2, RefreshCw, TrendingUp, TrendingDown, Sparkles, CheckCircle2 } from "lucide-react";
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

const QuestionsPage = () => {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const initialSubject = (params.get("subject") as SubjectCode) || "mathematics";
  const initialTopic = params.get("topic") || "";

  const [subject, setSubject] = useState<SubjectCode>(initialSubject);
  const [topic, setTopic] = useState(initialTopic || SUBJECTS[initialSubject].units[0].topics[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("Standard");
  const [qType, setQType] = useState<QType>("Short Answer");
  const [question, setQuestion] = useState<Generated | null>(null);
  const [answer, setAnswer] = useState("");
  const [marking, setMarking] = useState<MarkResult | null>(null);
  const [loadingGen, setLoadingGen] = useState(false);
  const [loadingMark, setLoadingMark] = useState(false);
  const [questionId, setQuestionId] = useState<string | null>(null);

  useEffect(() => {
    setTopic(SUBJECTS[subject].units[0].topics[0]);
  }, [subject]);

  const generate = async () => {
    setLoadingGen(true);
    setQuestion(null);
    setAnswer("");
    setMarking(null);
    try {
      let syllabus_context: string | undefined;
      if (subject === "chemistry") {
        const t = findChemistryTopic(topic);
        if (t) {
          syllabus_context = `Edexcel International A-Level Chemistry — Unit ${t.unit}, Topic ${t.number}: ${t.name}\nOfficial assessment statements (your scope is LIMITED to these — do not include content outside this list):\n${t.statements.map(s => `${s.ref} ${s.text}`).join("\n")}`;
        }
      }
      const { data, error } = await supabase.functions.invoke("ai-question", {
        body: { action: "generate", subject, topic, difficulty, questionType: qType, syllabus_context },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setQuestion(data);
      // Save to db
      if (user) {
        const { data: row } = await supabase.from("ai_questions").insert({
          user_id: user.id,
          subject,
          topic,
          difficulty,
          question_type: qType,
          question_text: data.question_text,
          marks: data.marks,
          mark_scheme: data.mark_scheme,
        }).select("id").single();
        if (row) setQuestionId(row.id);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't generate. Try again.");
    } finally {
      setLoadingGen(false);
    }
  };

  const submit = async () => {
    if (!question || !answer.trim()) return;
    setLoadingMark(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-question", {
        body: {
          action: "mark",
          subject, topic,
          questionText: question.question_text,
          markScheme: question.mark_scheme,
          totalMarks: question.marks,
          studentAnswer: answer,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMarking(data);
      if (questionId && user) {
        await supabase.from("ai_questions").update({
          student_answer: answer,
          feedback: data.feedback,
          awarded_marks: data.awarded_marks,
        }).eq("id", questionId);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Marking failed");
    } finally {
      setLoadingMark(false);
    }
  };

  const adjustDifficulty = (dir: "up" | "down") => {
    const order: Difficulty[] = ["Foundation", "Standard", "Challenge"];
    const idx = order.indexOf(difficulty);
    const next = dir === "up" ? Math.min(idx + 1, 2) : Math.max(idx - 1, 0);
    setDifficulty(order[next]);
    setTimeout(generate, 0);
  };

  const subjectMeta = SUBJECTS[subject];
  const allTopics = Array.from(new Set(subjectMeta.units.flatMap(u => u.topics)));

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="text-sm text-primary font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> AI Question Generator
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Train like it's exam day.</h1>
          <p className="text-muted-foreground mt-1">Original questions in real Edexcel style. Examiner-grade marking.</p>
        </div>

        {/* Setup card */}
        <div className="glass-card rounded-2xl p-6 mb-6">
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
          <Button onClick={generate} disabled={loadingGen} className="mt-5 bg-primary hover:bg-primary/90 glow-primary">
            {loadingGen ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating…</> : <><Brain className="h-4 w-4 mr-2" />Generate question</>}
          </Button>
        </div>

        {/* Question display */}
        {question && (
          <div className="glass-card rounded-2xl p-8 animate-in-up">
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-border">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{subjectMeta.name} · {topic}</div>
                <div className="text-xs font-mono text-primary mt-1">{difficulty} · {qType}</div>
              </div>
              <div className="font-mono text-sm bg-secondary px-3 py-1.5 rounded-md">[{question.marks} marks]</div>
            </div>
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{question.question_text}</p>
            </div>

            {!marking && (
              <>
                {qType === "Multiple Choice" && question.options ? (
                  <div className="space-y-2 mb-6">
                    {question.options.map((opt, i) => (
                      <button key={i} onClick={() => setAnswer(opt)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${answer === opt ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                        <span className="font-mono text-xs text-muted-foreground mr-3">{String.fromCharCode(65 + i)}</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Textarea value={answer} onChange={e => setAnswer(e.target.value)}
                    placeholder="Write your answer here. Show your working."
                    className="min-h-[180px] mb-4 font-mono text-sm" />
                )}
                <div className="flex gap-3">
                  <Button onClick={submit} disabled={loadingMark || !answer.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    {loadingMark ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Marking…</> : "Submit answer"}
                  </Button>
                  <Button variant="outline" onClick={generate}><RefreshCw className="h-4 w-4 mr-2" />Skip</Button>
                </div>
              </>
            )}

            {marking && (
              <div className="space-y-6 animate-in-up">
                <div className="flex items-center gap-4 p-5 rounded-xl bg-secondary/50">
                  <div className="text-5xl font-mono font-extrabold text-gradient">{marking.awarded_marks}<span className="text-2xl text-muted-foreground">/{marking.total_marks}</span></div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Marks awarded</div>
                    <div className="text-sm font-medium mt-0.5">{marking.awarded_marks === marking.total_marks ? "Full marks. Clean." : marking.awarded_marks >= marking.total_marks * 0.7 ? "Strong. Tighten the gaps below." : "Plenty to improve. Read the feedback."}</div>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-accent font-mono mb-2">Examiner feedback</div>
                  <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap">{marking.feedback}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-success font-mono mb-2">Model answer</div>
                  <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap p-4 rounded-lg bg-success/5 border border-success/20">{marking.model_answer}</div>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  <Button onClick={generate} className="bg-primary hover:bg-primary/90"><RefreshCw className="h-4 w-4 mr-2" />Generate another like this</Button>
                  <Button variant="outline" onClick={() => adjustDifficulty("down")}><TrendingDown className="h-4 w-4 mr-2" />Make it easier</Button>
                  <Button variant="outline" onClick={() => adjustDifficulty("up")}><TrendingUp className="h-4 w-4 mr-2" />Make it harder</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {!question && !loadingGen && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Ready when you are.</h3>
            <p className="text-muted-foreground">Pick a topic above and hit generate. Each question is original — built in the exact style of real Edexcel papers.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default QuestionsPage;
