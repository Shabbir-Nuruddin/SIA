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
  BookOpen, Loader2, Sparkles, Highlighter, Trash2, Download,
  ChevronDown, ChevronRight, FileText, AlertTriangle, RefreshCw,
} from "lucide-react";
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

  const visual_summary: VisualSummary | null =
    raw.visual_summary && typeof raw.visual_summary === "object"
      ? { kind: raw.visual_summary.kind ?? "diagram", caption: raw.visual_summary.caption ?? "", content: raw.visual_summary.content ?? "" }
      : null;

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
    overview: raw.overview ?? "",
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
      return;
    }
    loadOrGenerate(subjectParam, unitParam, topicParam);
    // eslint-disable-next-line
  }, [user, subjectParam, unitParam, topicParam]);

  const STALE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

  const loadOrGenerate = async (subject: SubjectCode, unit: number, topic: string, forceRefresh = false) => {
    if (!user) return;
    setLoadingNotes(true);
    setLoadError(null);
    setNotes(null);
    setShowFlashcards(false);
    setFlashIndex(0);
    setFlashFlipped(false);
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
        const { data, error } = await supabase.functions.invoke("ai-notes", {
          body: {
            subject,
            unit_number: unit,
            unit_name: unitMeta?.name || `Unit ${unit}`,
            topic,
            syllabus_context,
            board,
            level: unit >= 4 ? "A2-Level (IA2)" : "AS-Level (IAS)",
          },
        });
        if (error) throw new Error(error.message || "Notes service unavailable");
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
      setLoadError(err?.message || "Couldn't load notes.");
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

  const downloadPdf = async () => {
    if (!notes || !subjectParam || !unitParam || !topicParam) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 48;
    let y = margin;
    const sub = SUBJECTS[subjectParam];
    const studentName = await getStudentName();

    const writeLine = (text: string, size: number, bold = false, gap = 6) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(toPlainText(text), pageW - margin * 2);
      for (const ln of lines) {
        if (y > pageH - margin - 30) { footer(); doc.addPage(); y = margin; }
        doc.text(ln, margin, y);
        y += size * 1.2;
      }
      y += gap;
    };
    const footer = () => {
      doc.setFont("helvetica", "italic"); doc.setFontSize(9); doc.setTextColor(120);
      doc.text(`Make Me Revise · ${studentName} · ${sub?.name ?? ""} U${unitParam} — ${topicParam}`, margin, pageH - 24);
      doc.setTextColor(0);
    };

    writeLine(`${sub?.name ?? ""} — Unit ${unitParam}`, 10, false, 0);
    writeLine(topicParam, 22, true, 16);

    if (notes.overview) { writeLine("Overview", 14, true); writeLine(notes.overview, 11, false, 8); }

    if (notes.key_definitions.length) {
      writeLine("Key definitions", 14, true);
      notes.key_definitions.forEach(d => {
        writeLine(`${d.term}: ${d.mark_scheme}`, 11, false, 2);
        if (d.plain_english) writeLine(`Plain English: ${d.plain_english}`, 10, false, 2);
        if (d.common_mistake) writeLine(`Common mistake: ${d.common_mistake}`, 10, false, 4);
      });
    }

    if (notes.core_content.length) {
      writeLine("Core content", 14, true);
      notes.core_content.forEach((c, i) => {
        writeLine(`${i + 1}. ${c.statement}${c.typical_marks ? ` [${c.typical_marks} marks]` : ""}`, 12, true, 2);
        if (c.worked_example) writeLine(`Worked: ${c.worked_example}`, 10, false, 2);
        if (c.wrong_approach) writeLine(`Avoid: ${c.wrong_approach}`, 10, false, 4);
      });
    }

    if (notes.equations.length) {
      writeLine("Equations", 14, true);
      notes.equations.forEach(e => {
        writeLine(e.equation, 11, true, 2);
        e.variables.forEach(v => writeLine(`  ${v.symbol} = ${v.meaning} (${v.unit})`, 10, false, 1));
        if (e.worked_substitution) writeLine(`Substitution: ${e.worked_substitution}`, 10, false, 4);
      });
    }

    if (notes.examiner_tips.length) {
      writeLine("Examiner tips", 14, true);
      notes.examiner_tips.forEach(t => writeLine(`• ${t.command_word ? `[${t.command_word}] ` : ""}${t.tip}`, 11, false, 2));
    }

    footer();
    doc.save(`MakeMeRevise-${subjectParam}-U${unitParam}-${topicParam.replace(/[^a-z0-9]+/gi, "-")}.pdf`);
  };

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
      <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="text-xs text-primary font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> AI Revision Notes
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Tight, exam-focused notes — on demand.</h1>
          <p className="text-muted-foreground mt-1">Pick any topic. We'll generate {board === "cie" ? "Cambridge (CIE)" : "Edexcel"}-grade notes you can highlight, annotate, and export.</p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-3">
            {Object.entries(groupedBySubject).map(([code, units]) => {
              const m = SUBJECTS[code as SubjectCode];
              if (!m) return null;
              const open = openSubject === (code as SubjectCode);
              return (
                <div key={code} className="glass-card rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenSubject(open ? null : (code as SubjectCode))}
                    className="w-full flex items-center gap-2 p-3 text-left hover:bg-secondary/40 transition-colors">
                    {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    <span className="text-lg">{m.emoji}</span>
                    <span className="font-semibold text-sm">{m.name}</span>
                  </button>
                  {open && (
                    <div className="px-3 pb-3 space-y-3">
                      {units.map(u => {
                        const unitMeta = m.units?.find(x => x.number === u.unit_number);
                        const unitKey = `${code}-${u.unit_number}`;
                        const unitOpen = openUnit === unitKey || (subjectParam === code && unitParam === u.unit_number);
                        // CIE uses "Paper", Edexcel uses "Unit"
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
                                      className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${active ? "bg-primary/15 text-primary font-semibold" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"}`}>
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
              <div className="glass-card rounded-xl p-4 text-sm text-muted-foreground">
                Add subjects in onboarding to access notes.
              </div>
            )}
          </aside>

          {/* Notes panel */}
          <div className="relative">
            {!subjectParam || !unitParam || !topicParam ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Pick a topic to begin.</h3>
                <p className="text-muted-foreground">Notes generate in seconds and stay saved to your account.</p>
              </div>
            ) : loadingNotes ? (
              <NotesSkeleton topic={topicParam} board={board} />
            ) : loadError ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <AlertTriangle className="h-10 w-10 text-urgent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Notes couldn't load.</h3>
                <p className="text-muted-foreground text-sm mb-6">This is on our end, not yours.</p>
                <Button onClick={() => loadOrGenerate(subjectParam, unitParam, topicParam, true)} className="bg-primary hover:bg-primary/90">
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Try again
                </Button>
              </div>
            ) : notes ? (
              <div className="glass-card rounded-2xl p-6 md:p-8 relative" ref={panelRef} onMouseUp={handleMouseUp}>
                {/* Action bar */}
                <div className="flex items-center justify-end gap-2 mb-6">
                  <Button onClick={() => loadOrGenerate(subjectParam, unitParam, topicParam, true)} variant="outline" size="sm" title="Regenerate notes">
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Regenerate
                  </Button>
                  <Button onClick={downloadPdf} variant="outline" size="sm">
                    <Download className="h-3.5 w-3.5 mr-1.5" />PDF
                  </Button>
                </div>

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

                                {/* Floating selection toolbar */}
                {selection && !composing && (
                  <div className="absolute z-30 -translate-x-1/2 -translate-y-full"
                       style={{ left: selection.x, top: selection.y }}>
                    <button onClick={startComposing}
                      className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1.5 hover:bg-primary/90">
                      <Highlighter className="h-3 w-3" /> Add note
                    </button>
                  </div>
                )}

                {composing && (
                  <div className="absolute z-30 -translate-x-1/2 w-72"
                       style={{ left: composing.x, top: composing.y + 8 }}>
                    <div className="glass-card rounded-lg p-3 shadow-xl border-primary/40">
                      <div className="text-[10px] uppercase tracking-wider font-mono text-primary mb-1.5">Annotate</div>
                      <div className="text-xs text-muted-foreground mb-2 italic line-clamp-2">"{composing.text}"</div>
                      <Textarea value={draftNote} onChange={e => setDraftNote(e.target.value)}
                        placeholder="Your note…" className="min-h-[60px] text-xs" autoFocus />
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

      <style>{`
        .apex-annotation {
          background: transparent; color: inherit;
          border-bottom: 2px solid hsl(var(--accent) / 0.85);
          padding-bottom: 1px; cursor: help; transition: background 120ms;
        }
        .apex-annotation:hover { background: hsl(var(--accent) / 0.18); }
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
  <div className="glass-card rounded-2xl p-6 md:p-8">
    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
      <Loader2 className="h-5 w-5 text-primary animate-spin" />
      <div>
        <div className="text-sm font-semibold">Generating your {topic} notes...</div>
        <div className="text-xs text-muted-foreground">Pulling {board === "cie" ? "Cambridge (CIE)" : "Edexcel"} mark-scheme phrasing and worked examples.</div>
      </div>
    </div>
    {["w-1/3", "w-full", "w-5/6", "w-2/3"].map((w, i) => (
      <div key={i} className="mb-6">
        <div className={`h-3 ${w} rounded bg-secondary/60 animate-pulse mb-3`} />
        <div className="space-y-2">
          <div className="h-2 w-full rounded bg-secondary/40 animate-pulse" />
          <div className="h-2 w-11/12 rounded bg-secondary/40 animate-pulse" />
          <div className="h-2 w-4/5 rounded bg-secondary/40 animate-pulse" />
        </div>
      </div>
    ))}
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

export default NotesPage;
