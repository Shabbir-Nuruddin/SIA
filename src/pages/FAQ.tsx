import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { EXAM_FAQS, type Board } from "@/lib/examFaqs";
import { SUBJECTS, type SubjectCode } from "@/lib/subjects";
import { Search, ChevronDown, FileText, Loader2, AlertCircle, Layers, BookOpen } from "lucide-react";
import { formattedHtmlProps } from "@/lib/formatText";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FlashcardDeck from "@/components/FlashcardDeck";
import { SEO } from "@/components/SEO";

interface ExamQ {
  question_text: string;
  marks: number;
  mark_scheme: string;
}
interface TopicQState {
  loading: boolean;
  error: boolean;
  questions: ExamQ[] | null;
  expanded: Set<number>;
}
const cacheKey = (board: Board, subject: SubjectCode, topic: string) =>
  `apex.faq.q.${board}.${subject}.${topic}`;

const BOARD_LABEL: Record<Board, string> = {
  "edexcel-ial": "Edexcel IAL",
  "cie": "Cambridge (CIE)",
  "cie-igcse": "CIE IGCSE",
  "edexcel-igcse": "Edexcel IGCSE",
};

const FAQPage = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState<Board>("edexcel-ial");
  const [subject, setSubject] = useState<SubjectCode | "all">("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [topicQs, setTopicQs] = useState<Record<string, TopicQState>>({});
  const [quizGroup, setQuizGroup] = useState<string | null>(null);

  const loadTopicQuestions = async (key: string, subj: SubjectCode, topic: string) => {
    setTopicQs(s => ({ ...s, [key]: { loading: true, error: false, questions: null, expanded: new Set() } }));
    try {
      const { data, error } = await supabase.functions.invoke("faq-questions", {
        body: { board, subject: subj, topic },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const questions: ExamQ[] = (data?.questions || []).map((q: any) => ({
        question_text: q.question_text,
        marks: q.marks,
        mark_scheme: q.mark_scheme,
      }));
      if (!questions.length) throw new Error("no questions");
      setTopicQs(s => ({ ...s, [key]: { loading: false, error: false, questions, expanded: new Set() } }));
    } catch (e) {
      setTopicQs(s => ({ ...s, [key]: { loading: false, error: true, questions: null, expanded: new Set() } }));
      toast.error("Couldn't load exam questions. Try again.");
    }
  };

  const toggleExpand = (key: string, idx: number) => {
    setTopicQs(s => {
      const cur = s[key]; if (!cur) return s;
      const ex = new Set(cur.expanded);
      if (ex.has(idx)) ex.delete(idx); else ex.add(idx);
      return { ...s, [key]: { ...cur, expanded: ex } };
    });
  };

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("exam_board").eq("id", user.id).single().then(({ data }) => {
      if (data?.exam_board === "cie") setBoard("cie");
      else setBoard("edexcel-ial");
    });
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXAM_FAQS.filter(f =>
      f.board === board &&
      (subject === "all" || f.subject === subject) &&
      (!q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || f.topic.toLowerCase().includes(q))
    );
  }, [board, subject, query]);

  const grouped = useMemo(() => {
    const m: Record<string, typeof EXAM_FAQS> = {};
    for (const f of filtered) {
      const key = `${SUBJECTS[f.subject].name} · ${f.topic}`;
      (m[key] ||= []).push(f);
    }
    return m;
  }, [filtered]);

  const faqJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: EXAM_FAQS.slice(0, 30).map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }), []);

  return (
    <AppLayout>
      <SEO
        title="A-Level Exam FAQs — MakeMeRevise"
        description="Mark-scheme-accurate answers to the A-Level questions students get wrong most — Edexcel IAL and Cambridge across all subjects."
        path="/faq"
        jsonLd={faqJsonLd}
      />
      <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="text-xs text-primary font-mono uppercase tracking-widest mb-2">Exam FAQs</div>
          <h1 className="text-3xl md:text-4xl font-extrabold">The questions students always get wrong.</h1>
          <p className="text-muted-foreground mt-1">Mark-scheme phrasing, not approximations. Every answer carries the wording examiners look for.</p>
        </div>

        <div className="surface p-4 mb-6 grid md:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Board</label>
            <select value={board} onChange={e => setBoard(e.target.value as Board)} className="mt-1 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
              <option value="edexcel-ial">Edexcel IAL</option>
              <option value="cie">Cambridge (CIE)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value as any)} className="mt-1 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
              <option value="all">All subjects</option>
              {Object.values(SUBJECTS).map(s => <option key={s.code} value={s.code}>{s.emoji} {s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Search</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. activation energy"
                className="w-full h-10 rounded-md bg-background border border-input pl-9 pr-3 text-sm" />
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3 font-mono">{filtered.length} questions · {BOARD_LABEL[board]}</div>

        {Object.entries(grouped).map(([group, items]) => {
          const sample = items[0];
          const subj = sample.subject;
          const topic = sample.topic;
          const qkey = `${board}|${subj}|${topic}`;
          const qs = topicQs[qkey];
          return (
            <section key={group} className="mb-8">
              <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary">{group}</h2>
                <Button
                  size="sm"
                  variant={quizGroup === group ? "default" : "outline"}
                  className="h-8 px-3 text-[11px]"
                  onClick={() => setQuizGroup(quizGroup === group ? null : group)}
                >
                  {quizGroup === group ? <BookOpen className="h-3.5 w-3.5 mr-1.5" /> : <Layers className="h-3.5 w-3.5 mr-1.5" />}
                  {quizGroup === group ? "Read mode" : "Quiz mode"}
                </Button>
              </div>
              {quizGroup === group ? (
                <div className="surface p-5">
                  <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-3">
                    {items.length} flashcards · spaced repetition
                  </div>
                  <FlashcardDeck
                    cards={items.map(f => ({ q: f.question, a: `${f.answer}\n\n— ${f.examiner_note}` }))}
                    source="faq"
                    subject={subj}
                    topic={topic}
                    board={board}
                  />
                </div>
              ) : (
              <div className="space-y-2">
                {items.map(f => {
                  const open = openId === f.id;
                  return (
                    <div key={f.id} className="surface overflow-hidden">
                      <button onClick={() => setOpenId(open ? null : f.id)} className="w-full flex items-start gap-3 p-4 text-left hover:bg-card-hover transition-colors">
                        <ChevronDown className={`h-4 w-4 mt-0.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                        <span className="font-semibold flex-1 text-[15px]">{f.question}</span>
                      </button>
                      {open && (
                        <div className="px-4 pb-4 pl-11 space-y-3 text-sm animate-fade-in">
                          <div>
                            <div className="text-[10px] uppercase tracking-widest font-mono text-success mb-1">Mark-scheme answer</div>
                            <p>{f.answer}</p>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-widest font-mono text-accent mb-1">Examiner note</div>
                            <p className="text-muted-foreground italic">{f.examiner_note}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              )}

              {/* Exam Questions */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    <FileText className="h-3 w-3" /> Exam questions
                  </div>
                  {!qs?.questions && !qs?.loading && (
                    <Button size="sm" variant="outline" onClick={() => loadTopicQuestions(qkey, subj, topic)} className="h-7 text-xs">
                      Load 3 questions
                    </Button>
                  )}
                  {qs?.questions && (
                    <Button size="sm" variant="ghost" onClick={() => loadTopicQuestions(qkey, subj, topic)} className="h-7 text-xs text-muted-foreground">
                      Regenerate
                    </Button>
                  )}
                </div>

                {qs?.loading && (
                  <div className="surface p-6 flex items-center gap-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Generating exam questions for {topic}…
                  </div>
                )}

                {qs?.error && (
                  <div className="surface p-5 text-sm">
                    <div className="flex items-center gap-2 text-urgent mb-2"><AlertCircle className="h-4 w-4" /> Couldn't load questions.</div>
                    <p className="text-muted-foreground text-xs mb-3">This is on our end, not yours.</p>
                    <Button size="sm" variant="outline" onClick={() => loadTopicQuestions(qkey, subj, topic)}>Try again →</Button>
                  </div>
                )}

                {qs?.questions && (
                  <div className="space-y-2">
                    {qs.questions.map((q, i) => {
                      const ex = qs.expanded.has(i);
                      return (
                        <div key={i} className="surface overflow-hidden">
                          <button onClick={() => toggleExpand(qkey, i)} className="w-full flex items-start gap-3 p-4 text-left hover:bg-card-hover transition-colors">
                            <ChevronDown className={`h-4 w-4 mt-0.5 shrink-0 transition-transform ${ex ? "rotate-180" : ""}`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-[15px]" {...formattedHtmlProps(q.question_text)} />
                            </div>
                            <span className="font-mono text-[11px] bg-primary/15 text-primary px-2 py-0.5 rounded shrink-0">{q.marks} marks</span>
                          </button>
                          {ex && (
                            <div className="px-4 pb-4 pl-11 space-y-3 text-sm animate-fade-in">
                              <div>
                                <div className="text-[10px] uppercase tracking-widest font-mono text-success mb-1.5">Mark scheme</div>
                                <div className="rounded-md border-l-2 border-success bg-success/5 p-3 text-[13px] leading-relaxed" {...formattedHtmlProps(q.mark_scheme)} />
                              </div>
                              <p className="text-[11px] text-muted-foreground italic">
                                Each (1) above marks one awarded point. Match your answer line-by-line.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="surface p-8 text-center text-sm text-muted-foreground">No matches. Try a different subject or search term.</div>
        )}
      </div>
    </AppLayout>
  );
};

export default FAQPage;
