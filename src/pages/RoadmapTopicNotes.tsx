import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { getSubjectsForBoard, SubjectCode } from "@/lib/subjects";
import { findChemistryTopic } from "@/lib/chemistrySyllabus";
import { buildCieSyllabusContext } from "@/lib/cieSyllabus";
import { ArrowLeft, ArrowRight, Loader2, BookOpen, Quote, Layers, Sigma, Eye, GraduationCap, Brain } from "lucide-react";
import { toast } from "sonner";

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
        const { data: nd, error: ne } = await supabase.from("roadmap_nodes").select("*").eq("id", nodeId).maybeSingle();
        if (ne) throw ne;
        if (!nd) { toast.error("Node not found"); navigate("/roadmap"); return; }
        setNode(nd);

        // Set tutor context
        window.dispatchEvent(new CustomEvent("apex-assistant-context", {
          detail: { topic: nd.topic_name, subject: nd.subject, unit_name: nd.unit_name },
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
          if (nd.subject === "chemistry" && nd.topic_name) {
            const t = findChemistryTopic(nd.topic_name);
            if (t) syllabus_context = `Edexcel International A-Level Chemistry — Unit ${t.unit}, Topic ${t.number}: ${t.name}\nOfficial assessment statements:\n${t.statements.map(s => `${s.ref} ${s.text}`).join("\n")}`;
          }
          const { data, error } = await supabase.functions.invoke("ai-notes", {
            body: { subject: nd.subject, unit_number: nd.unit_number, unit_name: nd.unit_name, topic: nd.topic_name, syllabus_context },
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

  const subjectMeta = node?.subject ? SUBJECTS[node.subject as SubjectCode] : null;
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
                  <p key={i} className="text-foreground/90">{p}</p>
                ))}
              </section>
            )}

            {tab === "definitions" && (
              <section className="space-y-4">
                {notes.key_definitions?.map((d, i) => (
                  <div key={i} className="surface p-4">
                    <div className="font-bold text-base mb-2">{d.term}</div>
                    <div className="text-sm space-y-2">
                      <div><span className="text-[11px] uppercase font-mono text-primary tracking-wider">Mark scheme</span><div className="mt-1">{d.mark_scheme}</div></div>
                      <div><span className="text-[11px] uppercase font-mono text-success tracking-wider">Plain English</span><div className="mt-1 text-muted-foreground">{d.plain_english}</div></div>
                      <div><span className="text-[11px] uppercase font-mono text-accent tracking-wider">Common mistake</span><div className="mt-1 text-muted-foreground italic">{d.common_mistake}</div></div>
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
                      <div className="font-semibold flex-1">{c.statement}</div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">{c.typical_marks} marks</span>
                    </div>
                    <div className="text-sm space-y-3">
                      <div>
                        <div className="text-[11px] uppercase font-mono text-success tracking-wider mb-1.5">Worked example</div>
                        <pre className="whitespace-pre-wrap font-mono text-[13px] bg-secondary rounded-md p-3">{c.worked_example}</pre>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase font-mono text-urgent tracking-wider mb-1.5">Wrong approach</div>
                        <p className="text-muted-foreground text-[13px]">{c.wrong_approach}</p>
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
                    <pre className="font-mono text-base font-bold text-primary mb-3 whitespace-pre-wrap">{e.equation}</pre>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm mb-3">
                      {e.variables.map((v, j) => (
                        <div key={j} className="flex items-baseline gap-2">
                          <span className="font-mono font-bold text-primary">{v.symbol}</span>
                          <span className="text-muted-foreground text-[13px]">{v.meaning}</span>
                          <span className="font-mono text-[11px] text-success ml-auto">{v.unit}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] uppercase font-mono text-success tracking-wider mb-1.5">Worked substitution</div>
                    <pre className="whitespace-pre-wrap font-mono text-[13px] bg-secondary rounded-md p-3">{e.worked_substitution}</pre>
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
                      <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: notes.visual_summary.content }} />
                    ) : (
                      <pre className="whitespace-pre font-mono text-[13px] bg-secondary rounded-md p-3 overflow-x-auto">{notes.visual_summary.content}</pre>
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
                    <p className="mt-2 text-sm">{t.tip}</p>
                  </div>
                ))}
              </section>
            )}

            {tab === "flashcards" && (
              <section className="space-y-3">
                {notes.flashcards?.map((f, i) => (
                  <Flashcard key={i} q={f.q} a={f.a} index={i + 1} />
                ))}
              </section>
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

const Flashcard = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div
      className="surface p-5 cursor-pointer select-none transition-all hover:border-primary/40 min-h-[140px] flex flex-col"
      onClick={() => setRevealed(r => !r)}
    >
      <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between">
        <span>Card {index}</span>
        <span className="text-primary">{revealed ? "Answer" : "Question"} · tap to flip</span>
      </div>
      {!revealed ? (
        <div className="font-semibold text-[15px] flex-1 flex items-center animate-fade-in">{q}</div>
      ) : (
        <div className="text-sm flex-1 flex items-center text-foreground/90 animate-fade-in">{a}</div>
      )}
    </div>
  );
};

export default RoadmapTopicNotes;
