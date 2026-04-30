import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { formattedHtmlProps, toPlainText } from "@/lib/formatText";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Loader2, Sparkles, Highlighter, Trash2, Download, ChevronDown, ChevronRight, FileText } from "lucide-react";
import { toast } from "sonner";
import { findChemistryTopic } from "@/lib/chemistrySyllabus";

interface NoteContent {
  key_definitions: { term: string; definition: string }[];
  core_concepts: { cluster: string; bullets: string[] }[];
  common_mistakes: string[];
  worked_example: { problem: string; steps: { step: string; reason: string }[]; answer: string };
  examiner_tips: string[];
}

interface Annotation {
  id: string;
  highlighted_text: string;
  note: string;
}

const NotesPage = () => {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [enrolled, setEnrolled] = useState<Array<{ subject: SubjectCode; unit_number: number; unit_name: string }>>([]);
  const [openSubject, setOpenSubject] = useState<SubjectCode | null>(null);

  const subjectParam = (params.get("subject") as SubjectCode) || null;
  const unitParam = params.get("unit") ? Number(params.get("unit")) : null;
  const topicParam = params.get("topic") || null;

  const [notes, setNotes] = useState<NoteContent | null>(null);
  const [noteRowId, setNoteRowId] = useState<string | null>(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Floating selection toolbar state
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const [composing, setComposing] = useState<{ text: string; x: number; y: number } | null>(null);
  const [draftNote, setDraftNote] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  // Load enrolled units
  useEffect(() => {
    if (!user) return;
    supabase.from("user_subjects").select("subject,unit_number,unit_name").eq("user_id", user.id).order("subject").order("unit_number")
      .then(({ data }) => {
        if (data) {
          setEnrolled(data as any);
          if (!openSubject && data.length > 0) setOpenSubject(data[0].subject as SubjectCode);
        }
      });
    // eslint-disable-next-line
  }, [user]);

  // Load (or generate) notes when topic changes
  useEffect(() => {
    if (!user || !subjectParam || !unitParam || !topicParam) {
      setNotes(null);
      setNoteRowId(null);
      setAnnotations([]);
      return;
    }
    loadOrGenerate(subjectParam, unitParam, topicParam);
    // eslint-disable-next-line
  }, [user, subjectParam, unitParam, topicParam]);

  const loadOrGenerate = async (subject: SubjectCode, unit: number, topic: string) => {
    if (!user) return;
    setLoadingNotes(true);
    setNotes(null);
    try {
      // Try cached
      const { data: cached } = await supabase
        .from("topic_notes")
        .select("id,content")
        .eq("user_id", user.id)
        .eq("subject", subject)
        .eq("unit_number", unit)
        .eq("topic", topic)
        .maybeSingle();

      if (cached) {
        setNotes(cached.content as unknown as NoteContent);
        setNoteRowId(cached.id);
        await loadAnnotations(cached.id);
      } else {
        const subjMeta = SUBJECTS[subject];
        const unitMeta = subjMeta.units.find(u => u.number === unit);
        let syllabus_context: string | undefined;
        if (subject === "chemistry") {
          const t = findChemistryTopic(topic);
          if (t) syllabus_context = t.statements.map(s => `${s.ref} ${s.text}`).join("\n");
        }
        const { data, error } = await supabase.functions.invoke("ai-notes", {
          body: { subject, unit_number: unit, unit_name: unitMeta?.name || `Unit ${unit}`, topic, syllabus_context },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        const { data: inserted, error: insErr } = await supabase
          .from("topic_notes")
          .insert({ user_id: user.id, subject, unit_number: unit, topic, content: data })
          .select("id")
          .single();
        if (insErr) throw insErr;
        setNotes(data as NoteContent);
        setNoteRowId(inserted.id);
        setAnnotations([]);
      }
    } catch (err: any) {
      toast.error(err?.message || "Couldn't load notes. Try again.");
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

  // Selection handler within the notes panel
  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !panelRef.current) {
      setSelection(null);
      return;
    }
    const text = sel.toString().trim();
    if (text.length < 3 || text.length > 400) {
      setSelection(null);
      return;
    }
    // Ensure selection is inside panel
    const range = sel.getRangeAt(0);
    if (!panelRef.current.contains(range.commonAncestorContainer)) {
      setSelection(null);
      return;
    }
    const rect = range.getBoundingClientRect();
    const panelRect = panelRef.current.getBoundingClientRect();
    setSelection({
      text,
      x: rect.left - panelRect.left + rect.width / 2,
      y: rect.top - panelRect.top - 8,
    });
  };

  const startComposing = () => {
    if (!selection) return;
    setComposing(selection);
    setDraftNote("");
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  const saveAnnotation = async () => {
    if (!composing || !noteRowId || !user) return;
    if (!draftNote.trim()) {
      toast.error("Annotation can't be empty.");
      return;
    }
    const { data, error } = await supabase
      .from("note_annotations")
      .insert({
        user_id: user.id,
        topic_notes_id: noteRowId,
        highlighted_text: composing.text,
        note: draftNote.trim(),
      })
      .select("id,highlighted_text,note")
      .single();
    if (error) {
      toast.error("Couldn't save annotation.");
      return;
    }
    setAnnotations(a => [...a, data as Annotation]);
    setComposing(null);
    setDraftNote("");
    toast.success("Annotation saved.");
  };

  const deleteAnnotation = async (id: string) => {
    await supabase.from("note_annotations").delete().eq("id", id);
    setAnnotations(a => a.filter(x => x.id !== id));
  };

  // Render helper: wrap occurrences of highlighted_text with marked spans
  const annotateHtml = (html: string): string => {
    if (annotations.length === 0) return html;
    let out = html;
    // Sort longest first to avoid nested replacement issues
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
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Apex · ${studentName} · ${sub.name} U${unitParam} — ${topicParam}`, margin, pageH - 24);
      doc.setTextColor(0);
    };

    writeLine(`${sub.name} — Unit ${unitParam}`, 10, false, 0);
    writeLine(topicParam, 22, true, 16);

    writeLine("Key definitions", 14, true);
    notes.key_definitions.forEach(d => writeLine(`${d.term}: ${d.definition}`, 11, false, 4));
    y += 8;

    writeLine("Core concepts", 14, true);
    notes.core_concepts.forEach(c => {
      writeLine(c.cluster, 12, true, 2);
      c.bullets.forEach(b => writeLine(`• ${b}`, 11, false, 2));
      y += 4;
    });

    writeLine("Common exam mistakes", 14, true);
    notes.common_mistakes.forEach(m => writeLine(`• ${m}`, 11, false, 2));
    y += 8;

    writeLine("Worked example", 14, true);
    writeLine(`Problem: ${notes.worked_example.problem}`, 11);
    notes.worked_example.steps.forEach((s, i) => {
      writeLine(`Step ${i + 1}: ${s.step}`, 11, false, 1);
      writeLine(`Why: ${s.reason}`, 10, false, 4);
    });
    writeLine(`Answer: ${notes.worked_example.answer}`, 11, true);

    writeLine("Examiner tips", 14, true);
    notes.examiner_tips.forEach(t => writeLine(`• ${t}`, 11, false, 2));

    footer();
    doc.save(`Apex-${sub.code}-U${unitParam}-${topicParam.replace(/[^a-z0-9]+/gi, "-")}.pdf`);
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
          <p className="text-muted-foreground mt-1">Pick any topic. We'll generate Edexcel-grade notes you can highlight, annotate, and export.</p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Topic browser */}
          <aside className="space-y-3">
            {Object.entries(groupedBySubject).map(([code, units]) => {
              const m = SUBJECTS[code as SubjectCode];
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
                        const unitMeta = m.units.find(x => x.number === u.unit_number);
                        return (
                          <div key={u.unit_number}>
                            <div className="text-[10px] uppercase tracking-wider font-mono text-primary mb-1">Unit {u.unit_number}</div>
                            <div className="space-y-0.5">
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
                            </div>
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
              <div className="glass-card rounded-2xl p-12 text-center">
                <Loader2 className="h-8 w-8 text-primary mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-bold mb-2">Generating your {topicParam} notes...</h3>
                <p className="text-muted-foreground text-sm">Pulling Edexcel mark-scheme phrasing and worked examples.</p>
              </div>
            ) : notes ? (
              <div className="glass-card rounded-2xl p-6 md:p-8 relative" ref={panelRef} onMouseUp={handleMouseUp}>
                <div className="flex items-start justify-between gap-3 mb-6 pb-5 border-b border-border">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">{SUBJECTS[subjectParam].name} · Unit {unitParam}</div>
                    <h2 className="text-2xl font-extrabold mt-1">{topicParam}</h2>
                  </div>
                  <Button onClick={downloadPdf} variant="outline" size="sm">
                    <Download className="h-3.5 w-3.5 mr-1.5" />PDF
                  </Button>
                </div>

                <Section title="Key definitions">
                  <dl className="space-y-2">
                    {(notes.key_definitions ?? []).map((d, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:gap-3 text-sm">
                        <dt className="font-semibold text-primary sm:w-1/3 shrink-0" {...formattedHtmlProps(d.term)} />
                        <dd className="text-foreground/90" dangerouslySetInnerHTML={{ __html: annotateHtml(formatToHtml(d.definition)) }} />
                      </div>
                    ))}
                  </dl>
                </Section>

                <Section title="Core concepts">
                  <div className="space-y-4">
                    {notes.core_concepts.map((c, i) => (
                      <div key={i}>
                        <div className="font-semibold text-sm mb-1.5" {...formattedHtmlProps(c.cluster)} />
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {c.bullets.map((b, j) => (
                            <li key={j} dangerouslySetInnerHTML={{ __html: annotateHtml(formatToHtml(b)) }} />
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Common exam mistakes">
                  <ul className="space-y-2 text-sm">
                    {notes.common_mistakes.map((m, i) => (
                      <li key={i} className="pl-3 border-l-2 border-urgent/60"
                          dangerouslySetInnerHTML={{ __html: annotateHtml(formatToHtml(m)) }} />
                    ))}
                  </ul>
                </Section>

                <Section title="Worked example">
                  <div className="rounded-lg bg-secondary/40 p-4 text-sm space-y-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground mb-1">Problem</div>
                      <div dangerouslySetInnerHTML={{ __html: annotateHtml(formatToHtml(notes.worked_example.problem)) }} />
                    </div>
                    <ol className="space-y-2 list-decimal pl-5">
                      {notes.worked_example.steps.map((s, i) => (
                        <li key={i}>
                          <div dangerouslySetInnerHTML={{ __html: annotateHtml(formatToHtml(s.step)) }} />
                          <div className="text-xs text-muted-foreground mt-0.5" dangerouslySetInnerHTML={{ __html: formatToHtml(s.reason) }} />
                        </li>
                      ))}
                    </ol>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-mono text-success mr-2">Answer</span>
                      <span className="font-mono font-bold" dangerouslySetInnerHTML={{ __html: formatToHtml(notes.worked_example.answer) }} />
                    </div>
                  </div>
                </Section>

                <Section title="Examiner tips">
                  <ul className="space-y-2 text-sm">
                    {notes.examiner_tips.map((t, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-accent shrink-0">→</span>
                        <span dangerouslySetInnerHTML={{ __html: annotateHtml(formatToHtml(t)) }} />
                      </li>
                    ))}
                  </ul>
                </Section>

                {/* Floating selection toolbar */}
                {selection && !composing && (
                  <div
                    className="absolute z-30 -translate-x-1/2 -translate-y-full"
                    style={{ left: selection.x, top: selection.y }}
                  >
                    <button
                      onClick={startComposing}
                      className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1.5 hover:bg-primary/90"
                    >
                      <Highlighter className="h-3 w-3" /> Add note
                    </button>
                  </div>
                )}

                {/* Compose bubble */}
                {composing && (
                  <div
                    className="absolute z-30 -translate-x-1/2 w-72"
                    style={{ left: composing.x, top: composing.y + 8 }}
                  >
                    <div className="glass-card rounded-lg p-3 shadow-xl border-primary/40">
                      <div className="text-[10px] uppercase tracking-wider font-mono text-primary mb-1.5">Annotate</div>
                      <div className="text-xs text-muted-foreground mb-2 italic line-clamp-2">"{composing.text}"</div>
                      <Textarea
                        value={draftNote}
                        onChange={e => setDraftNote(e.target.value)}
                        placeholder="Your note…"
                        className="min-h-[60px] text-xs"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => { setComposing(null); setDraftNote(""); }}>Cancel</Button>
                        <Button size="sm" onClick={saveAnnotation} className="bg-primary hover:bg-primary/90">Save</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hover tooltip — wires via delegated mouseover */}
                <AnnotationTooltipLayer annotations={annotations} container={panelRef} onDelete={deleteAnnotation} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <style>{`
        .apex-annotation {
          background: transparent;
          color: inherit;
          border-bottom: 2px solid hsl(var(--accent) / 0.85);
          padding-bottom: 1px;
          cursor: help;
          transition: background 120ms;
        }
        .apex-annotation:hover {
          background: hsl(var(--accent) / 0.18);
        }
      `}</style>
    </AppLayout>
  );
};

// Inline import-like helper to avoid extra import
import { toFormattedHtml } from "@/lib/formatText";
const formatToHtml = (s: string) => toFormattedHtml(s);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-primary mb-3">{title}</h3>
    {children}
  </section>
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
    <div
      className="apex-tooltip absolute z-30 -translate-x-1/2 max-w-xs"
      style={{ left: hovered.x, top: hovered.y }}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="bg-popover border border-accent/40 rounded-md shadow-xl p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="text-xs leading-relaxed text-popover-foreground">{a.note}</div>
          <button
            onClick={() => onDelete(a.id)}
            className="text-muted-foreground hover:text-urgent shrink-0"
            aria-label="Delete annotation"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
