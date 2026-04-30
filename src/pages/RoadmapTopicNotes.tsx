import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { getSubjectsForBoard, SubjectCode } from "@/lib/subjects";
import { findChemistryTopic } from "@/lib/chemistrySyllabus";
import { buildCieSyllabusContext } from "@/lib/cieSyllabus";
import { ArrowLeft, ArrowRight, Loader2, BookOpen, Quote, Layers, Sigma, Eye, GraduationCap, Brain, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { formattedHtmlProps, renderedMathHtmlProps } from "@/lib/formatText";

// Full-screen Notes route consuming the structured ai-notes JSON.
// Tabs: Overview / Definitions / Worked Examples / Equations / Visual / Tips / Flashcards.

interface Notes {
  overview?: string;
  key_definitions?: { term: string; mark_scheme: string; plain_english: string; common_mistake: string }[];
  core_content?: { statement: string; worked_example: string; wrong_approach: string; typical_marks: number }[];
  equations?: { equation: string; variables: { symbol: string; meaning: string; unit: string }[]; worked_substitution: string }[];
  visual_summary?: { kind: string; caption: string; content: string };
  examiner_tips?: { command_word: string; tip: string }[];
  flashcards?: { q: string; a: string }[];
}

type Tab = "overview" | "definitions" | "examples" | "equations" | "visual" | "tips" | "flashcards";

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "definitions", label: "Definitions", icon: Quote },
  { key: "examples", label: "Worked Examples", icon: Layers },
  { key: "equations", label: "Equations", icon: Sigma },
  { key: "visual", label: "Visual", icon: Eye },
  { key: "tips", label: "Examiner Tips", icon: GraduationCap },
  { key: "flashcards", label: "Flashcards", icon: Brain },
];

const RoadmapTopicNotes = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Notes | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [node, setNode] = useState<any | null>(null);
  const [board, setBoard] = useState<"edexcel-ial" | "cie">("edexcel-ial");
  const [readSec, setReadSec] = useState(0);

  // Read time gate per spec — minimum 60 seconds before "I've read this" enables.
  useEffect(() => {
    const id = setInterval(() => setReadSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      if (!user || !nodeId) return;
      setLoading(true);
      try {
        // Load board
        const { data: prof } = await supabase.from("profiles").select("exam_board").eq("id", user.id).single();
        const userBoard: "edexcel-ial" | "cie" = prof?.exam_board === "cie" ? "cie" : "edexcel-ial";
        setBoard(userBoard);

        const { data: nd, error: ne } = await supabase.from("roadmap_nodes").select("*").eq("id", nodeId).maybeSingle();
        if (ne) throw ne;
        if (!nd) { toast.error("Node not found"); navigate("/roadmap"); return; }
        setNode(nd);

        // Set tutor context
        window.dispatchEvent(new CustomEvent("apex-assistant-context", {
          detail: { topic: nd.topic_name, subject: nd.subject, unit_name: nd.unit_name, board: userBoard },
        }));

        // Cache check
        const { data: cached } = await supabase
          .from("topic_notes")
          .select("content")
          .eq("user_id", user.id)
          .eq("subject", nd.subject)
          .eq("unit_number", nd.unit_number)
          .eq("topic", nd.topic_name)
          .maybeSingle();

        if (cached?.content) {
          setNotes(cached.content as Notes);
        } else {
          let syllabus_context: string | undefined;
          if (userBoard === "cie" && nd.subject && nd.topic_name) {
            syllabus_context = buildCieSyllabusContext(nd.subject as SubjectCode, nd.topic_name);
          } else if (nd.subject === "chemistry" && nd.topic_name) {
            const t = findChemistryTopic(nd.topic_name);
            if (t) syllabus_context = `Edexcel International A-Level Chemistry — Unit ${t.unit}, Topic ${t.number}: ${t.name}\nOfficial assessment statements:\n${t.statements.map(s => `${s.ref} ${s.text}`).join("\n")}`;
          }
          const { data, error } = await supabase.functions.invoke("ai-notes", {
            body: { subject: nd.subject, unit_number: nd.unit_number, unit_name: nd.unit_name, topic: nd.topic_name, syllabus_context, board: userBoard },
          });
          if (error) throw error;
          if ((data as any)?.error) throw new Error((data as any).error);
          setNotes(data as Notes);
          await supabase.from("topic_notes").insert({
            user_id: user.id, subject: nd.subject, unit_number: nd.unit_number, topic: nd.topic_name, content: data,
          });
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Notes failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, nodeId]);

  const SUBJECTS = getSubjectsForBoard(board);
  const subjectMeta = node?.subject ? SUBJECTS[node.subject as SubjectCode] : null;
  const isMaths = node?.subject === "mathematics" || node?.subject === "maths" || node?.subject === "math";
  const minRead = 60;
  const canContinue = readSec >= minRead && !loading;

  const handleDone = () => {
    // Return to roadmap with state to launch Explain stage immediately.
    navigate(`/roadmap?continue=${nodeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/roadmap")} className="text-muted-foreground hover:text-foreground p-1.5 -ml-1.5 rounded-md hover:bg-secondary">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono truncate">
              {subjectMeta?.name} · {node?.unit_code} · Notes
            </div>
            <h1 className="font-bold text-base md:text-lg truncate">{node?.topic_name || "Loading…"}</h1>
          </div>
          <Button
            onClick={handleDone}
            disabled={!canContinue}
            className={`btn-primary h-9 px-3 text-sm shrink-0 ${canContinue ? "animate-slow-pulse" : ""}`}
          >
            {canContinue ? "I've read this" : `Read for ${Math.max(0, minRead - readSec)}s`}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 overflow-x-auto">
          <div className="flex gap-1 border-b border-border -mb-px min-w-max">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />{t.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {loading && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-24">
            <Loader2 className="h-4 w-4 animate-spin" /> Generating comprehensive notes for {node?.topic_name}…
          </div>
        )}

        {!loading && notes && (
          <article className="prose-content text-[15px] leading-relaxed">
            {tab === "overview" && (
              <section className="space-y-4">
                {notes.overview?.split(/\n\n+/).map((p, i) => (
                  <p key={i} className="text-foreground/90" {...formattedHtmlProps(p)} />
                ))}
              </section>
            )}

            {tab === "definitions" && (
              <section className="space-y-4">
                {notes.key_definitions?.map((d, i) => (
                  <div key={i} className="surface p-4">
                    <div className="font-bold text-base mb-2" {...formattedHtmlProps(d.term)} />
                    <div className="text-sm space-y-2">
                      <div><span className="text-[11px] uppercase font-mono text-primary tracking-wider">Mark scheme</span><div className="mt-1" {...formattedHtmlProps(d.mark_scheme)} /></div>
                      {!isMaths && (
                        <div><span className="text-[11px] uppercase font-mono text-success tracking-wider">Plain English</span><div className="mt-1 text-muted-foreground" {...formattedHtmlProps(d.plain_english)} /></div>
                      )}
                      <div><span className="text-[11px] uppercase font-mono text-accent tracking-wider">Common mistake</span><div className="mt-1 text-muted-foreground italic" {...formattedHtmlProps(d.common_mistake)} /></div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {tab === "examples" && (
              <section className="space-y-5">
                {notes.core_content?.map((c, i) => (
                  <div key={i} className="surface p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="font-semibold flex-1" {...formattedHtmlProps(c.statement)} />
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">{c.typical_marks} marks</span>
                    </div>
                    <div className="text-sm space-y-3">
                      <div>
                        <div className="text-[11px] uppercase font-mono text-success tracking-wider mb-1.5">Worked example</div>
                        <div className="text-[13px] bg-secondary rounded-md p-3 leading-relaxed" {...formattedHtmlProps(c.worked_example)} />
                      </div>
                      <div>
                        <div className="text-[11px] uppercase font-mono text-urgent tracking-wider mb-1.5">Wrong approach</div>
                        <div className="text-muted-foreground text-[13px]" {...formattedHtmlProps(c.wrong_approach)} />
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {tab === "equations" && (
              <section className="space-y-4">
                {(notes.equations?.length ?? 0) === 0 ? (
                  <p className="text-muted-foreground text-sm italic">No equations for this topic.</p>
                ) : notes.equations?.map((e, i) => (
                  <div key={i} className="surface p-5">
                    <div className="text-base font-bold text-primary mb-3" {...formattedHtmlProps(e.equation)} />
                    <div className="grid sm:grid-cols-2 gap-2 text-sm mb-3">
                      {e.variables.map((v, j) => (
                        <div key={j} className="flex items-baseline gap-2">
                          <span className="font-bold text-primary" {...formattedHtmlProps(v.symbol)} />
                          <span className="text-muted-foreground text-[13px]">{v.meaning}</span>
                          <span className="font-mono text-[11px] text-success ml-auto">{v.unit}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] uppercase font-mono text-success tracking-wider mb-1.5">Worked substitution</div>
                    <div className="text-[13px] bg-secondary rounded-md p-3 leading-relaxed" {...formattedHtmlProps(e.worked_substitution)} />
                  </div>
                ))}
              </section>
            )}

            {tab === "visual" && (
              <section>
                {notes.visual_summary ? (
                  <div className="surface p-5">
                    <div className="text-[11px] uppercase font-mono text-primary tracking-wider mb-2">{notes.visual_summary.kind} · {notes.visual_summary.caption}</div>
                    {notes.visual_summary.content.includes("<table") || notes.visual_summary.content.includes("<tr") ? (
                      <div className="overflow-x-auto [&_td]:px-3 [&_td]:py-1.5 [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-left [&_table]:w-full" {...renderedMathHtmlProps(notes.visual_summary.content)} />
                    ) : (
                      <pre className="whitespace-pre-wrap font-mono text-[13px] bg-secondary rounded-md p-3 overflow-x-auto" {...renderedMathHtmlProps(notes.visual_summary.content)} />
                    )}
                  </div>
                ) : <p className="text-muted-foreground text-sm italic">No visual summary.</p>}
              </section>
            )}

            {tab === "tips" && (
              <section className="space-y-3">
                {notes.examiner_tips?.map((t, i) => (
                  <div key={i} className="surface p-4">
                    <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded-full bg-success/10 text-success">{t.command_word}</span>
                    <div className="mt-2 text-sm" {...formattedHtmlProps(t.tip)} />
                  </div>
                ))}
              </section>
            )}

            {tab === "flashcards" && notes.flashcards && notes.flashcards.length > 0 && (
              <FlashcardDeck cards={notes.flashcards} />
            )}
          </article>
        )}
      </main>

      {/* Footer CTA — sticky reminder */}
      <div className="sticky bottom-0 z-20 bg-background/95 backdrop-blur border-t border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground font-mono hidden sm:block">
            Read all 7 tabs for the strongest retention. Min {minRead}s read time.
          </p>
          <Button onClick={handleDone} disabled={!canContinue} className={`btn-primary h-10 px-5 text-sm ${canContinue ? "animate-slow-pulse" : ""}`}>
            {canContinue ? "I've read this — continue to Explain" : `${Math.max(0, minRead - readSec)}s remaining`}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const FlashcardDeck = ({ cards }: { cards: { q: string; a: string }[] }) => {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const total = cards.length;
  const card = cards[idx];

  const go = (delta: number) => {
    setRevealed(false);
    setIdx(i => Math.max(0, Math.min(total - 1, i + delta)));
  };

  // keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === " " || e.key === "Enter") { e.preventDefault(); setRevealed(r => !r); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  return (
    <section>
      <div className="flex items-center justify-between mb-3 text-xs font-mono text-muted-foreground">
        <span>Card {idx + 1} / {total}</span>
        <button
          onClick={() => { setIdx(0); setRevealed(false); }}
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> Restart
        </button>
      </div>

      <div
        onClick={() => setRevealed(r => !r)}
        className="surface cursor-pointer select-none p-8 md:p-12 min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-center transition-all hover:border-primary/40 relative overflow-hidden"
      >
        <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-4">
          {revealed ? "Answer" : "Question"}
        </div>
        <div
          key={`${idx}-${revealed}`}
          className={`animate-fade-in max-w-2xl w-full ${revealed ? "text-base md:text-lg text-foreground/90" : "text-xl md:text-2xl font-semibold"}`}
          {...formattedHtmlProps(revealed ? card.a : card.q)}
        />
        <div className="absolute bottom-3 left-0 right-0 text-[10px] font-mono text-muted-foreground/70">
          Tap, press space or enter to {revealed ? "hide" : "reveal"}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 gap-3">
        <Button variant="outline" onClick={() => go(-1)} disabled={idx === 0} className="h-10">
          <ChevronLeft className="h-4 w-4 mr-1" /> Prev
        </Button>
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <Button onClick={() => go(1)} disabled={idx === total - 1} className="btn-primary h-10">
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </section>
  );
};

export default RoadmapTopicNotes;
