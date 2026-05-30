import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getSubjectsForBoard, SubjectCode } from "@/lib/subjects";
import { formattedHtmlProps, toPlainText, toFormattedHtml, renderMathInString } from "@/lib/formatText";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen, Loader2, Sparkles, Highlighter, Trash2,
  ChevronDown, ChevronRight, FileText, AlertTriangle, RefreshCw,
  Search, Youtube, X, Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import FlashcardDeck from "@/components/FlashcardDeck";
import { toast } from "sonner";
import NotesVisualRenderer from "@/components/NotesVisualRenderer";
import { findChemistryTopic } from "@/lib/chemistrySyllabus";
import { buildCieSyllabusContext } from "@/lib/cieSyllabus";
import { usePlan } from "@/hooks/usePlan";
import { UpgradeModal } from "@/components/UpgradeModal";
import { incrementUsage } from "@/lib/plan";


/* ────────────────────────────────────────────────────────────
   UNIFIED NOTE MODEL
   The edge function returns the new ChemRevise-inspired shape:
   { overview, key_definitions[{term,mark_scheme,plain_english,common_mistake}],
     core_content[{statement,worked_example,wrong_approach,typical_marks}],
     equations[{equation,variables[],worked_substitution}],
     visual_summary{kind,caption,content},
     examiner_tips[{command_word,tip}],
     flashcards[{q,a}] }
   Older cached rows used the legacy shape:
   { key_definitions[{term,definition}], core_concepts[{cluster,bullets}],
     common_mistakes[], worked_example{problem,steps,answer}, examiner_tips[] }
   Normalise both into NormalisedNotes so render never crashes.
   ──────────────────────────────────────────────────────────── */

interface KeyDef { term: string; mark_scheme: string; plain_english?: string; common_mistake?: string; }
interface CoreItem { statement: string; worked_example: string; wrong_approach?: string; typical_marks?: number; }
interface EquationItem { equation: string; variables: { symbol: string; meaning: string; unit: string }[]; worked_substitution: string; }
interface VisualSummary { kind: "table" | "flowchart" | "diagram"; caption: string; content: string; }
interface TipItem { command_word: string; tip: string; }
interface Flashcard { q: string; a: string; }

interface NormalisedNotes {
  overview: string;
  key_definitions: KeyDef[];
  core_content: CoreItem[];
  equations: EquationItem[];
  visual_summary: VisualSummary | null;
  examiner_tips: TipItem[];
  flashcards: Flashcard[];
}

const normaliseNotes = (raw: any): NormalisedNotes => {
  if (!raw || typeof raw !== "object") {
    return { overview: "", key_definitions: [], core_content: [], equations: [], visual_summary: null, examiner_tips: [], flashcards: [] };
  }
  // Detect legacy shape
  const isLegacy = Array.isArray(raw.core_concepts) || (Array.isArray(raw.common_mistakes) && raw.common_mistakes.length);

  // Key definitions
  const key_definitions: KeyDef[] = Array.isArray(raw.key_definitions)
    ? raw.key_definitions.map((d: any) => ({
        term: d?.term ?? "",
        mark_scheme: d?.mark_scheme ?? d?.definition ?? "",
        plain_english: d?.plain_english ?? "",
        common_mistake: d?.common_mistake ?? "",
      }))
    : [];

  // Core content
  let core_content: CoreItem[] = [];
  if (Array.isArray(raw.core_content)) {
    core_content = raw.core_content.map((c: any) => ({
      statement: c?.statement ?? "",
      worked_example: c?.worked_example ?? "",
      wrong_approach: c?.wrong_approach ?? "",
      typical_marks: typeof c?.typical_marks === "number" ? c.typical_marks : undefined,
    }));
  } else if (Array.isArray(raw.core_concepts)) {
    // Legacy: each cluster's bullets become a single statement entry
    core_content = raw.core_concepts.flatMap((c: any) => {
      const bullets: string[] = Array.isArray(c?.bullets) ? c.bullets : [];
      return bullets.map((b) => ({ statement: `${c?.cluster ? c.cluster + " — " : ""}${b}`, worked_example: "", wrong_approach: "" }));
    });
  }

  // Legacy worked example → push into core_content as one item if present
  if (isLegacy && raw.worked_example) {
    const w = raw.worked_example;
    const steps: string = Array.isArray(w?.steps)
      ? w.steps.map((s: any, i: number) => `Step ${i + 1}: ${s?.step ?? ""}${s?.reason ? ` — ${s.reason}` : ""}`).join("\n")
      : "";
    core_content.unshift({
      statement: w?.problem ?? "Worked example",
      worked_example: `${steps}${w?.answer ? `\nAnswer: ${w.answer}` : ""}`.trim(),
      wrong_approach: "",
    });
  }

  // Legacy common_mistakes → tack onto core items as wrong_approach hints; or surface separately
  // We'll surface them as a synthesised section by reusing core_content entries when sparse.

  const equations: EquationItem[] = Array.isArray(raw.equations)
    ? raw.equations.map((e: any) => ({
        equation: e?.equation ?? "",
        variables: Array.isArray(e?.variables) ? e.variables.map((v: any) => ({ symbol: v?.symbol ?? "", meaning: v?.meaning ?? "", unit: v?.unit ?? "" })) : [],
        worked_substitution: e?.worked_substitution ?? "",
      }))
    : [];

  // Disabled: AI-generated visual summaries were producing broken HTML/SVG,
  // overlapping diagrams, and out-of-scope content. Keep the notes readable.
  const visual_summary: VisualSummary | null = null;

  let examiner_tips: TipItem[] = [];
  if (Array.isArray(raw.examiner_tips)) {
    examiner_tips = raw.examiner_tips.map((t: any) =>
      typeof t === "string"
        ? { command_word: "", tip: t }
        : { command_word: t?.command_word ?? "", tip: t?.tip ?? "" }
    );
  }

  // Append legacy common_mistakes as examiner-style tips so they remain visible
  if (Array.isArray(raw.common_mistakes)) {
    raw.common_mistakes.forEach((m: string) => examiner_tips.push({ command_word: "Avoid", tip: m }));
  }

  const flashcards: Flashcard[] = Array.isArray(raw.flashcards)
    ? raw.flashcards.map((f: any) => ({ q: f?.q ?? "", a: f?.a ?? "" }))
    : [];

  return {
    overview: String(raw.overview ?? "")
      .split(/\n\s*\n+|(?<=\.)\s+(?=[A-Z][a-z])/g)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, /math/i.test(String(raw.subject ?? "")) ? 2 : 7)
      .join("\n\n"),
    key_definitions,
    core_content,
    equations,
    visual_summary,
    examiner_tips,
    flashcards,
  };
};

interface Annotation { id: string; highlighted_text: string; note: string; }

const formatToHtml = (s: string) => toFormattedHtml(s ?? "");

const NotesPage = () => {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const { checkAndWarn, upgrade, closeUpgrade, state: planState } = usePlan();
  const [board, setBoard] = useState<"edexcel-ial" | "cie" | "cie-igcse" | "edexcel-igcse">("edexcel-ial");
  const SUBJECTS = getSubjectsForBoard(board);
  const [enrolled, setEnrolled] = useState<Array<{ subject: SubjectCode; unit_number: number; unit_name: string }>>([]);
  const [openSubject, setOpenSubject] = useState<SubjectCode | null>(null);
  const [openUnit, setOpenUnit] = useState<string | null>(null);

  const subjectParam = (params.get("subject") as SubjectCode) || null;
  const unitParam = params.get("unit") ? Number(params.get("unit")) : null;
  const topicParam = params.get("topic") || null;

  const [notes, setNotes] = useState<NormalisedNotes | null>(null);
  const [noteRowId, setNoteRowId] = useState<string | null>(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const [composing, setComposing] = useState<{ text: string; x: number; y: number } | null>(null);
  const [draftNote, setDraftNote] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const [topicSearch, setTopicSearch] = useState("");
  const [showVideos, setShowVideos] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);

  // Load profile board + enrolled units
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("exam_board").eq("id", user.id).single().then(({ data }) => {
      const b = data?.exam_board;
      if (b === "cie") setBoard("cie");
      else if (b === "cie-igcse") setBoard("cie-igcse");
      else if (b === "edexcel-igcse") setBoard("edexcel-igcse");
      else setBoard("edexcel-ial");
    });
    supabase.from("user_subjects").select("subject,unit_number,unit_name").eq("user_id", user.id).order("subject").order("unit_number")
      .then(({ data }) => {
        if (data) {
          setEnrolled(data as any);
          if (!openSubject && data.length > 0) setOpenSubject(data[0].subject as SubjectCode);
        }
      });
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (!user || !subjectParam || !unitParam || !topicParam) {
      setNotes(null); setNoteRowId(null); setAnnotations([]); setLoadError(null);
      setShowVideos(false);
      setShowFlashcards(false);
      return;
    }
    setShowVideos(false);
    setShowFlashcards(false);
    loadOrGenerate(subjectParam, unitParam, topicParam);
    // eslint-disable-next-line
  }, [user, subjectParam, unitParam, topicParam]);


  const STALE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

  const loadOrGenerate = async (subject: SubjectCode, unit: number, topic: string, forceRefresh = false) => {
    if (!user) return;
    setLoadingNotes(true);
    setLoadError(null);
    setNotes(null);
    // (legacy flashcard local state removed — handled inside NotesVisualRenderer)
    try {
      let cached: any = null;
      if (!forceRefresh) {
        const { data } = await supabase
          .from("topic_notes")
          .select("id,content,updated_at")
          .eq("user_id", user.id)
          .eq("subject", subject)
          .eq("unit_number", unit)
          .eq("topic", topic)
          .maybeSingle();
        cached = data;
      }

      const isFresh = cached?.updated_at && (Date.now() - new Date(cached.updated_at).getTime() < STALE_MS);

      if (cached && isFresh && !forceRefresh) {
        setNotes(normaliseNotes(cached.content));
        setNoteRowId(cached.id);
        await loadAnnotations(cached.id);
      } else {
        // Plan gate: free = 3 notes / week
        const ok = await checkAndWarn("notes_per_week");
        if (!ok) { setLoadingNotes(false); return; }
        const subjMeta = SUBJECTS[subject];
        const unitMeta = subjMeta?.units.find(u => u.number === unit);
        let syllabus_context: string | undefined;
        if (board === "cie") {
          syllabus_context = buildCieSyllabusContext(subject, topic);
        } else if (subject === "chemistry") {
          const t = findChemistryTopic(topic);
          if (t) syllabus_context = t.statements.map(s => `${s.ref} ${s.text}`).join("\n");
        }
        // When the user clicks Regenerate (forceRefresh), tell the edge function
        // to bypass + overwrite its shared cache so we get a brand-new generation.
        const { data, error } = await supabase.functions.invoke("ai-notes", {
          body: {
            subject,
            unit_number: unit,
            unit_name: unitMeta?.name || `Unit ${unit}`,
            topic,
            syllabus_context,
            board,
            level: unit >= 4 ? "A2-Level (IA2)" : "AS-Level (IAS)",
            trigger: forceRefresh ? "cache_clear" : "initial",
          },
        });
        if (error) {
          let detail = error.message || "Notes service unavailable";
          const context = (error as any).context;
          if (context && typeof context.json === "function") {
            try {
              const body = await context.json();
              detail = body?.error || body?.message || detail;
            } catch {
              // Keep the Supabase client error if the response body is not JSON.
            }
          }
          throw new Error(detail);
        }
        if (!data || data.error) throw new Error(data?.error || "Notes service returned no data");

        // Upsert (replace stale)
        if (cached?.id) {
          await supabase.from("topic_notes").update({ content: data, updated_at: new Date().toISOString() }).eq("id", cached.id);
          setNoteRowId(cached.id);
          await loadAnnotations(cached.id);
        } else {
          const { data: inserted, error: insErr } = await supabase
            .from("topic_notes")
            .insert({ user_id: user.id, subject, unit_number: unit, topic, content: data })
            .select("id")
            .single();
          if (insErr) throw insErr;
          setNoteRowId(inserted.id);
          setAnnotations([]);
        }
        setNotes(normaliseNotes(data));
        if (planState?.plan === "free") await incrementUsage("notes_per_week");
      }
    } catch (err: any) {
      console.error("Notes load error:", err);
      const message = err?.message || "Couldn't load notes.";
      toast.error(`Notes generation failed: ${message}`, {
        duration: 5000,
        description: "The AI provider quota or fallback model is unavailable right now.",
      });
      setLoadError(message);
    } finally {
      setLoadingNotes(false);
    }
  };

  const loadAnnotations = async (rowId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from("note_annotations")
      .select("id,highlighted_text,note")
      .eq("user_id", user.id)
      .eq("topic_notes_id", rowId)
      .order("created_at");
    if (data) setAnnotations(data as Annotation[]);
  };

  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !panelRef.current) { setSelection(null); return; }
    const text = sel.toString().trim();
    if (text.length < 3 || text.length > 400) { setSelection(null); return; }
    const range = sel.getRangeAt(0);
    if (!panelRef.current.contains(range.commonAncestorContainer)) { setSelection(null); return; }
    const rect = range.getBoundingClientRect();
    const panelRect = panelRef.current.getBoundingClientRect();
    setSelection({ text, x: rect.left - panelRect.left + rect.width / 2, y: rect.top - panelRect.top - 8 });
  };

  const startComposing = () => {
    if (!selection) return;
    setComposing(selection); setDraftNote(""); setSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  const saveAnnotation = async () => {
    if (!composing || !noteRowId || !user) return;
    if (!draftNote.trim()) { toast.error("Annotation can't be empty."); return; }
    const { data, error } = await supabase
      .from("note_annotations")
      .insert({ user_id: user.id, topic_notes_id: noteRowId, highlighted_text: composing.text, note: draftNote.trim() })
      .select("id,highlighted_text,note").single();
    if (error) { toast.error("Couldn't save annotation."); return; }
    setAnnotations(a => [...a, data as Annotation]);
    setComposing(null); setDraftNote("");
    toast.success("Annotation saved.");
  };

  const deleteAnnotation = async (id: string) => {
    await supabase.from("note_annotations").delete().eq("id", id);
    setAnnotations(a => a.filter(x => x.id !== id));
  };

  const annotateHtml = (html: string): string => {
    if (annotations.length === 0) return html;
    let out = html;
    const sorted = [...annotations].sort((a, b) => b.highlighted_text.length - a.highlighted_text.length);
    for (const a of sorted) {
      const escaped = a.highlighted_text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(?<!data-aid="[^"]*")(${escaped})`, "g");
      out = out.replace(re, `<mark data-aid="${a.id}" class="apex-annotation">$1</mark>`);
    }
    return out;
  };

  // PDF export removed.

  const getStudentName = async (): Promise<string> => {
    if (!user) return "Student";
    const { data } = await supabase.from("profiles").select("first_name,last_name,display_name").eq("id", user.id).single();
    if (!data) return "Student";
    return `${data.first_name || data.display_name || ""} ${data.last_name || ""}`.trim() || "Student";
  };

  const groupedBySubject = useMemo(() => {
    return enrolled.reduce((acc, u) => {
      (acc[u.subject] ||= []).push(u);
      return acc;
    }, {} as Record<SubjectCode, typeof enrolled>);
  }, [enrolled]);

  const selectTopic = (subject: SubjectCode, unit: number, topic: string) => {
    setParams({ subject, unit: String(unit), topic });
  };

  return (
    <AppLayout>
      <div className="p-5 md:p-8 max-w-7xl mx-auto animate-fade-in">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="glass-card rounded-3xl border border-border/80 bg-background-elevated p-6 lg:sticky lg:top-5 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <div className="mb-4">
              <div className="text-[10px] uppercase tracking-[0.28em] font-mono text-muted-foreground mb-2">Topic picker</div>
              <p className="text-sm text-muted-foreground">Choose a subject, unit and topic. The note panel below opens into a full-screen revision canvas.</p>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                placeholder="Search topics…"
                className="pl-8 pr-8 h-9 text-xs"
              />
              {topicSearch && (
                <button
                  onClick={() => setTopicSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {topicSearch.trim() ? (
              (() => {
                const q = topicSearch.trim().toLowerCase();
                const matches: Array<{ subject: SubjectCode; unit: number; unitCode: string; topic: string; subjectName: string }> = [];
                for (const u of enrolled) {
                  const m = SUBJECTS[u.subject];
                  if (!m) continue;
                  const unitMeta = m.units?.find(x => x.number === u.unit_number);
                  for (const t of unitMeta?.topics ?? []) {
                    if (t.toLowerCase().includes(q) || (unitMeta?.name ?? "").toLowerCase().includes(q)) {
                      matches.push({
                        subject: u.subject,
                        unit: u.unit_number,
                        unitCode: unitMeta?.unitCode ?? `U${u.unit_number}`,
                        topic: t,
                        subjectName: m.name,
                      });
                    }
                  }
                }
                if (matches.length === 0) {
                  return <div className="text-xs text-muted-foreground italic px-1 py-2">No topics match "{topicSearch}".</div>;
                }
                return (
                  <div className="space-y-0.5">
                    {matches.slice(0, 50).map((r) => {
                      const active = subjectParam === r.subject && unitParam === r.unit && topicParam === r.topic;
                      return (
                        <button
                          key={`${r.subject}-${r.unit}-${r.topic}`}
                          onClick={() => selectTopic(r.subject, r.unit, r.topic)}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"}`}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 shrink-0" />
                            <span className="truncate">{r.topic}</span>
                          </div>
                          <div className="text-[10px] font-mono text-muted-foreground/80 mt-0.5 ml-5">
                            {r.subjectName} · {r.unitCode}
                          </div>
                        </button>
                      );
                    })}
                    {matches.length > 50 && (
                      <div className="text-[10px] text-muted-foreground italic px-2 pt-2">Showing first 50 of {matches.length}. Refine your search.</div>
                    )}
                  </div>
                );
              })()
            ) : (
              <>
            {Object.entries(groupedBySubject).map(([code, units]) => {
              const m = SUBJECTS[code as SubjectCode];
              if (!m) return null;
              const open = openSubject === (code as SubjectCode);
              return (
                <div key={code} className="overflow-hidden border-t border-border/70 first:border-t-0">
                  <button
                    onClick={() => setOpenSubject(open ? null : (code as SubjectCode))}
                    className="w-full flex items-center gap-2 py-3 text-left hover:text-primary transition-colors"
                  >
                    {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    <span className="text-lg">{m.emoji}</span>
                    <span className="font-semibold text-sm">{m.name}</span>
                  </button>
                  {open && (
                    <div className="pb-3 space-y-3">
                      {units.map(u => {
                        const unitMeta = m.units?.find(x => x.number === u.unit_number);
                        const unitKey = `${code}-${u.unit_number}`;
                        const unitOpen = openUnit === unitKey || (subjectParam === code && unitParam === u.unit_number);
                        const unitLabel = board === "cie" ? "Paper" : board === "cie-igcse" || board === "edexcel-igcse" ? "Section" : "Unit";
                        return (
                          <div key={u.unit_number}>
                            <button
                              onClick={() => setOpenUnit(unitOpen ? null : unitKey)}
                              className="w-full flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-mono text-primary mb-1 hover:text-primary/80"
                            >
                              {unitOpen ? <ChevronDown className="h-2.5 w-2.5" /> : <ChevronRight className="h-2.5 w-2.5" />}
                              <span>{unitLabel} {u.unit_number} · {unitMeta?.unitCode ?? ""}</span>
                            </button>
                            {unitOpen && (
                              <div className="space-y-0.5 ml-3">
                                {(unitMeta?.topics ?? []).map(t => {
                                  const active = subjectParam === code && unitParam === u.unit_number && topicParam === t;
                                  return (
                                    <button key={t}
                                      onClick={() => selectTopic(code as SubjectCode, u.unit_number, t)}
                                      className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"}`}
                                    >
                                      <FileText className="h-3 w-3 shrink-0" />
                                      <span className="truncate">{t}</span>
                                    </button>
                                  );
                                })}
                                {(!unitMeta?.topics || unitMeta.topics.length === 0) && (
                                  <div className="text-[11px] text-muted-foreground italic px-2 py-1">No topics defined</div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {enrolled.length === 0 && (
              <div className="border-t border-border/70 pt-4 text-sm text-muted-foreground">
                Add subjects in onboarding to access notes.
              </div>
            )}
              </>
            )}
          </aside>

          <div className="flex flex-col min-h-0">
            <div className="glass-card rounded-3xl border border-border/80 bg-background-elevated p-6 mb-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-mono mb-2">Revision notes</div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">Instant exam-focused notes in one clean canvas.</h1>
                  <p className="mt-3 text-sm text-muted-foreground max-w-2xl">Every topic expands to a full-width workspace for fast review, annotation and export.</p>
                </div>
                {subjectParam && unitParam && topicParam && notes && !loadingNotes && !loadError && (
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      onClick={() => setShowVideos(v => !v)}
                      variant={showVideos ? "default" : "outline"}
                      size="sm"
                      className="h-9 px-3 text-[11px]"
                      title="Toggle YouTube revision videos"
                    >
                      <Youtube className="h-3.5 w-3.5 mr-2" />
                      {showVideos ? "Hide videos" : "Watch videos"}
                    </Button>
                    {notes.flashcards.length > 0 && (
                      <Button
                        onClick={() => setShowFlashcards(v => !v)}
                        variant={showFlashcards ? "default" : "outline"}
                        size="sm"
                        className="h-9 px-3 text-[11px]"
                        title="Practise with spaced-repetition flashcards"
                      >
                        <Layers className="h-3.5 w-3.5 mr-2" />
                        {showFlashcards ? "Hide flashcards" : `Flashcards (${notes.flashcards.length})`}
                      </Button>
                    )}
                    <Button
                      onClick={() => loadOrGenerate(subjectParam, unitParam, topicParam, true)}
                      variant="outline"
                      size="sm"
                      title="Regenerate notes"
                      className="h-9 px-3 text-[11px]"
                    >
                      <RefreshCw className="h-3 w-3 mr-2" /> Regenerate
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {showVideos && subjectParam && unitParam && topicParam && (() => {
              const subjName = SUBJECTS[subjectParam]?.name ?? subjectParam;
              const boardLabel =
                board === "cie" ? "CIE A Level" :
                board === "cie-igcse" ? "CIE IGCSE" :
                board === "edexcel-igcse" ? "Edexcel IGCSE" :
                "Edexcel IAL";
              const query = `${topicParam} ${subjName} ${boardLabel} revision`;
              const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
              return (
                <YouTubeLessonEmbed key={query} query={query} topic={topicParam} searchUrl={searchUrl} />
              );
            })()}


            {showFlashcards && notes && subjectParam && unitParam && topicParam && (
              <div className="glass-card rounded-3xl border border-border/80 bg-background-elevated p-5 mb-6 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between mb-4 gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Layers className="h-4 w-4 text-primary shrink-0" />
                    <div className="text-sm font-semibold truncate">Spaced repetition · {topicParam}</div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">
                    Leitner boxes 1–5
                  </span>
                </div>
                <FlashcardDeck
                  cards={notes.flashcards}
                  source="notes"
                  subject={subjectParam}
                  unit_number={unitParam}
                  topic={topicParam}
                  board={board}
                />
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Cards you know get pushed further out (1 day → 3 days → 1 week → 3 weeks). Cards you forget drop back to Box 1.
                </p>
              </div>
            )}


            <div className="flex-1 min-h-[calc(100vh-180px)]">
              {!subjectParam || !unitParam || !topicParam ? (
                <div className="glass-card flex h-full min-h-[520px] items-center justify-center rounded-3xl border border-border/70 bg-card p-12 text-center">
                  <div>
                    <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Pick a topic to begin.</h3>
                    <p className="text-muted-foreground">Notes generate in seconds and stay saved to your account.</p>
                  </div>
                </div>
              ) : loadingNotes ? (
                <NotesSkeleton topic={topicParam} board={board} />
              ) : loadError ? (
                <div className="glass-card flex h-full min-h-[520px] items-center justify-center rounded-3xl border border-border/70 bg-card p-12 text-center">
                  <div>
                    <AlertTriangle className="h-10 w-10 text-urgent mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Notes couldn't load.</h3>
                    <p className="text-muted-foreground text-sm mb-6">This is on our end, not yours.</p>
                    <Button onClick={() => loadOrGenerate(subjectParam, unitParam, topicParam, true)} className="bg-primary hover:bg-primary/90">
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Try again
                    </Button>
                  </div>
                </div>
              ) : notes ? (
                <div className="notebook-paper notes-canvas relative h-full min-h-[520px] overflow-y-auto rounded-3xl border border-foreground/10 p-6 shadow-lg md:p-10" ref={panelRef} onMouseUp={handleMouseUp}>
                  <NotesVisualRenderer
                    notes={notes}
                    topic={topicParam}
                    subject={SUBJECTS[subjectParam]?.name ?? subjectParam}
                    unitLabel={
                      board === "cie" ? `Paper ${unitParam}` :
                      board === "cie-igcse" || board === "edexcel-igcse" ? `Section ${unitParam}` :
                      `Unit ${unitParam}`
                    }
                    formatHtml={formatToHtml}
                    renderMath={renderMathInString}
                    annotate={annotateHtml}
                  />

                  {selection && !composing && (
                    <div className="absolute z-30 -translate-x-1/2 -translate-y-full" style={{ left: selection.x, top: selection.y }}>
                      <button onClick={startComposing}
                        className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1.5 hover:bg-primary/90">
                        <Highlighter className="h-3 w-3" /> Add note
                      </button>
                    </div>
                  )}

                  {composing && (
                    <div className="absolute z-30 -translate-x-1/2 w-72" style={{ left: composing.x, top: composing.y + 8 }}>
                      <div className="glass-card rounded-3xl border border-primary/30 bg-background p-4 shadow-xl">
                        <div className="text-[10px] uppercase tracking-wider font-mono text-primary mb-1.5">Annotate</div>
                        <div className="text-xs text-muted-foreground mb-2 italic line-clamp-2">"{composing.text}"</div>
                        <Textarea value={draftNote} onChange={e => setDraftNote(e.target.value)} placeholder="Your note…" className="min-h-[60px] text-xs" autoFocus />
                        <div className="flex gap-2 mt-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => { setComposing(null); setDraftNote(""); }}>Cancel</Button>
                          <Button size="sm" onClick={saveAnnotation} className="bg-primary hover:bg-primary/90">Save</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <AnnotationTooltipLayer annotations={annotations} container={panelRef} onDelete={deleteAnnotation} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .apex-annotation {
          background: transparent; color: inherit;
          border-bottom: 2px solid hsl(var(--accent) / 0.85);
          padding-bottom: 1px; cursor: help; transition: background 120ms;
        }
        .apex-annotation:hover { background: hsl(var(--accent) / 0.18); }
        .notes-canvas {
          background-image: none !important;
        }
        html.theme-inkwell .notes-canvas,
        :root:not(.light):not(.theme-paper):not(.theme-notebook) .notes-canvas {
          background-image: none !important;
        }
        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
          background-color: hsl(var(--secondary) / 0.58);
          box-shadow: 0 0 0.65rem hsl(var(--primary) / 0.12);
        }
        .skeleton-shimmer::after {
          content: "";
          position: absolute;
          inset: -160%;
          background: linear-gradient(
            130deg,
            transparent 38%,
            hsl(var(--primary) / 0.2) 48%,
            hsl(var(--primary) / 0.38) 52%,
            transparent 64%
          );
          transform: translate3d(-45%, -35%, 0);
          animation: skeleton-diagonal-sheen 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes skeleton-diagonal-sheen {
          0% { transform: translate3d(-45%, -35%, 0); }
          100% { transform: translate3d(45%, 35%, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-shimmer::after {
            animation: none;
          }
        }
      `}</style>
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

const NotesSkeleton = ({ topic, board }: { topic: string; board: string }) => (
  <div className="glass-card flex h-full min-h-[520px] flex-col rounded-2xl border-primary/20 bg-card/90 p-6 shadow-lg shadow-primary/10 lg:border-t-0 md:p-8">
    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-primary/20">
      <Loader2 className="h-5 w-5 text-primary animate-spin drop-shadow-[0_0_8px_hsl(var(--primary)/0.45)]" />
      <div>
        <div className="text-sm font-semibold">Generating your {topic} notes...</div>
        <div className="text-xs text-muted-foreground">Pulling {board === "cie" ? "Cambridge (CIE)" : "Edexcel"} mark-scheme phrasing and worked examples.</div>
      </div>
    </div>
    <div className="grid flex-1 grid-rows-4 gap-7 py-2">
      {["w-1/3", "w-full", "w-5/6", "w-2/3"].map((w, i) => (
        <div key={i} className="space-y-3">
          <div className={`skeleton-shimmer h-3 ${w} rounded`} />
          <div className="flex gap-2">
            <div className="skeleton-shimmer h-5 w-14 rounded-md" />
            <div className="skeleton-shimmer h-5 w-20 rounded-md" />
          </div>
          <div className="space-y-2.5">
            <div className="skeleton-shimmer h-2 w-full rounded" />
            <div className="skeleton-shimmer h-2 w-11/12 rounded" />
            <div className="skeleton-shimmer h-2 w-4/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnnotationTooltipLayer = ({
  annotations, container, onDelete,
}: { annotations: Annotation[]; container: React.RefObject<HTMLDivElement>; onDelete: (id: string) => void; }) => {
  const [hovered, setHovered] = useState<{ id: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const mark = target.closest("mark[data-aid]") as HTMLElement | null;
      if (mark) {
        const aid = mark.getAttribute("data-aid")!;
        const rect = mark.getBoundingClientRect();
        const cRect = el.getBoundingClientRect();
        setHovered({ id: aid, x: rect.left - cRect.left + rect.width / 2, y: rect.bottom - cRect.top + 4 });
      }
    };
    const onOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (related?.closest(".apex-tooltip")) return;
      setHovered(null);
    };
    el.addEventListener("mouseover", onOver);
    el.addEventListener("mouseout", onOut);
    return () => {
      el.removeEventListener("mouseover", onOver);
      el.removeEventListener("mouseout", onOut);
    };
  }, [container, annotations]);

  if (!hovered) return null;
  const a = annotations.find(x => x.id === hovered.id);
  if (!a) return null;

  return (
    <div className="apex-tooltip absolute z-30 -translate-x-1/2 max-w-xs"
      style={{ left: hovered.x, top: hovered.y }}
      onMouseLeave={() => setHovered(null)}>
      <div className="bg-popover border border-accent/40 rounded-md shadow-xl p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="text-xs leading-relaxed text-popover-foreground">{a.note}</div>
          <button onClick={() => onDelete(a.id)} className="text-muted-foreground hover:text-urgent shrink-0" aria-label="Delete annotation">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

function YouTubeLessonEmbed({ query, topic, searchUrl }: { query: string; topic: string; searchUrl: string }) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setVideoId(null);
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("youtube-search", { body: { q: query } });
        if (cancelled) return;
        if (error || !data?.videoId) { setStatus("error"); return; }
        setVideoId(data.videoId);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, [query]);

  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
    : null;

  return (
    <div className="glass-card rounded-3xl border border-border/80 bg-background-elevated p-5 mb-6 shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Youtube className="h-4 w-4 text-primary shrink-0" />
          <div className="text-sm font-semibold truncate">Video lesson · {topic}</div>
        </div>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-mono uppercase tracking-wider text-primary hover:text-primary/80 shrink-0"
        >
          More on YouTube ↗
        </a>
      </div>
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-black" style={{ paddingTop: "56.25%" }}>
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Finding a video…
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 text-sm gap-2 p-4 text-center">
            <AlertTriangle className="h-5 w-5" />
            Couldn't load a video. <a className="underline" href={searchUrl} target="_blank" rel="noopener noreferrer">Search on YouTube</a>
          </div>
        )}
        {status === "ready" && embedUrl && (
          <iframe
            src={embedUrl}
            title={`YouTube revision video for ${topic}`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Top result from YouTube — quality varies. Use as a supplement to the notes above.
      </p>
    </div>
  );
}

export default NotesPage;

