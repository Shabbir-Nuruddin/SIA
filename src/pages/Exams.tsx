import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarPlus, Loader2, Pencil, Trash2, Calendar, Sparkles, MapPin, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { getSubjectsForBoard, SubjectCode } from "@/lib/subjects";
import { daysFromTodayLocal } from "@/lib/dateLocal";
import { format } from "date-fns";

interface Exam {
  id: string;
  name: string;
  exam_type: "mock" | "board" | "term" | "school" | "other";
  exam_date: string;
  subject: SubjectCode | null;
  unit_numbers: number[];
  topics: string[];
  is_active: boolean;
  notes: string | null;
}

const EXAM_TYPES: { value: Exam["exam_type"]; label: string; emoji: string }[] = [
  { value: "mock",   label: "Mock Exam",   emoji: "🎯" },
  { value: "board",  label: "Board Exam",  emoji: "🎓" },
  { value: "term",   label: "Term Test",   emoji: "📅" },
  { value: "school", label: "School Test", emoji: "📝" },
  { value: "other",  label: "Other",       emoji: "📌" },
];

const Exams = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [board, setBoard] = useState<"edexcel-ial" | "cie">("edexcel-ial");
  const [editing, setEditing] = useState<Exam | null>(null);
  const [open, setOpen] = useState(false);
  const [building, setBuilding] = useState<string | null>(null);

  const SUBJECTS = useMemo(() => getSubjectsForBoard(board), [board]);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [exRes, profRes] = await Promise.all([
      supabase.from("exams").select("*").eq("user_id", user.id).order("exam_date"),
      supabase.from("profiles").select("exam_board").eq("id", user.id).single(),
    ]);
    if (exRes.data) setExams(exRes.data as any);
    if (profRes.data?.exam_board === "cie") setBoard("cie"); else setBoard("edexcel-ial");
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const openNew = () => {
    setEditing({
      id: "",
      name: "",
      exam_type: "school",
      exam_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      subject: null,
      unit_numbers: [],
      topics: [],
      is_active: true,
      notes: "",
    });
    setOpen(true);
  };

  const openEdit = (e: Exam) => { setEditing({ ...e }); setOpen(true); };

  const save = async () => {
    if (!user || !editing) return;
    if (!editing.name.trim()) { toast.error("Give your exam a name"); return; }
    if (!editing.exam_date) { toast.error("Pick an exam date"); return; }

    const payload = {
      user_id: user.id,
      name: editing.name.trim(),
      exam_type: editing.exam_type,
      exam_date: editing.exam_date,
      subject: editing.subject,
      unit_numbers: editing.unit_numbers,
      topics: editing.topics,
      is_active: editing.is_active,
      notes: editing.notes?.trim() || null,
    };

    if (editing.id) {
      const { error } = await supabase.from("exams").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Exam updated");
    } else {
      const { error } = await supabase.from("exams").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Exam added");
    }
    setOpen(false);
    setEditing(null);

    // Re-sequence BOTH roadmap systems (dashboard "Today's plan" sessions AND the
    // Roadmap page nodes) against the new/changed exam date so every surface
    // immediately prioritises the unit whose exam is next.
    try {
      const { regenerateRoadmaps } = await import("@/lib/persistRoadmap");
      await regenerateRoadmaps(user.id);
      toast.success("Roadmap re-sequenced for your exam dates");
    } catch (e) {
      console.error("Roadmap regen after exam save failed", e);
    }

    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("exams").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Exam deleted");
    load();
  };

  const toggleActive = async (e: Exam) => {
    await supabase.from("exams").update({ is_active: !e.is_active }).eq("id", e.id);
    load();
  };

  const buildRoadmap = async (e: Exam) => {
    if (!user) return;
    setBuilding(e.id);
    try {
      // Rebuild BOTH roadmap systems from all of the user's subjects with real
      // exam dates overlaid, so the dashboard "Today's plan" and the Roadmap page
      // both prioritise whichever unit's exam is soonest.
      const { regenerateRoadmaps } = await import("@/lib/persistRoadmap");
      await regenerateRoadmaps(user.id);
      toast.success("Roadmap rebuilt — prioritised by your exam dates");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not build roadmap");
    } finally {
      setBuilding(null);
    }
  };

  if (loading) {
    return (
      <AppLayout>
      <SEO title="Exam dates — MakeMeRevise" description="Add and track your A-Level exam dates to keep your revision roadmap and urgency score accurate." path="/exams" />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-5 md:p-8 max-w-5xl mx-auto animate-fade-in">
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Exams</h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-xl">
              Add any test that's coming up — mocks, board exams, term tests, school tests. Your urgency timer
              and roadmap can adapt to whichever you're focused on.
            </p>
          </div>
          <Button onClick={openNew} className="btn-primary">
            <CalendarPlus className="h-4 w-4 mr-1.5" />Add an exam
          </Button>
        </div>

        {exams.length === 0 ? (
          <div className="surface p-10 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm mb-4">
              No exams scheduled yet. Don't have one? Your roadmap still works as an efficient revision plan.
            </p>
            <Button onClick={openNew} className="btn-primary">
              <CalendarPlus className="h-4 w-4 mr-1.5" />Add your first exam
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {exams.map(e => {
              const days = daysFromTodayLocal(e.exam_date);
              const passed = days < 0;
              const urgent = days >= 0 && days < 14;
              const meta = e.subject ? SUBJECTS[e.subject] : null;
              const typeMeta = EXAM_TYPES.find(t => t.value === e.exam_type)!;
              return (
                <div key={e.id} className={`surface p-5 ${e.is_active ? "" : "opacity-60"}`}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground font-mono mb-1.5">
                        <span>{typeMeta.emoji} {typeMeta.label}</span>
                        {meta && <><span>·</span><span>{meta.name}</span></>}
                        {!e.is_active && <span className="text-muted-foreground">· paused</span>}
                      </div>
                      <h3 className="text-lg font-bold leading-tight">{e.name}</h3>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(new Date(e.exam_date + "T09:00"), "EEEE, d MMMM yyyy")}
                      </div>
                      {e.unit_numbers.length > 0 && meta && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {e.unit_numbers.map(n => {
                            const u = meta.units.find(x => x.number === n);
                            return u ? (
                              <span key={n} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary font-mono">
                                {u.unitCode || `U${n}`}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                      {e.topics.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          <BookOpen className="h-3 w-3 inline mr-1" />
                          {e.topics.join(" · ")}
                        </div>
                      )}
                      {e.notes && (
                        <div className="text-xs text-muted-foreground mt-2 italic border-l-2 border-border pl-2">
                          {e.notes}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      {passed ? (
                        <div className="text-xs text-muted-foreground font-mono">Past</div>
                      ) : (
                        <>
                          <div className={`font-mono text-2xl font-bold tabular ${urgent ? "text-urgent" : "text-foreground"}`} style={{ color: urgent ? "hsl(var(--urgent))" : undefined }}>
                            {days}d
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">to go</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                    <Button size="sm" onClick={() => buildRoadmap(e)} disabled={building === e.id || passed} className="btn-primary h-8 text-xs">
                      {building === e.id ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1.5" />}
                      Build roadmap from this
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toggleActive(e)} className="h-8 text-xs">
                      {e.is_active ? "Pause" : "Resume"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(e)} className="h-8 text-xs">
                      <Pencil className="h-3 w-3 mr-1.5" />Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive hover:text-destructive">
                          <Trash2 className="h-3 w-3 mr-1.5" />Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{e.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(e.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Editor dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "Edit exam" : "Add an exam"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
                  <Input
                    value={editing.name}
                    onChange={ev => setEditing({ ...editing, name: ev.target.value })}
                    placeholder="e.g. Term 2 Chemistry test"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Type</Label>
                    <Select value={editing.exam_type} onValueChange={(v) => setEditing({ ...editing, exam_type: v as any })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {EXAM_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value}>{t.emoji} {t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Date</Label>
                    <Input
                      type="date"
                      value={editing.exam_date}
                      onChange={ev => setEditing({ ...editing, exam_date: ev.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Subject (optional)</Label>
                  <Select
                    value={editing.subject ?? "_none"}
                    onValueChange={(v) => setEditing({ ...editing, subject: v === "_none" ? null : v as SubjectCode, unit_numbers: [], topics: [] })}
                  >
                    <SelectTrigger className="mt-1"><SelectValue placeholder="No specific subject" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">No specific subject</SelectItem>
                      {Object.values(SUBJECTS).map(s => (
                        <SelectItem key={s.code} value={s.code}>{s.emoji} {s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {editing.subject && (
                  <>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Units covered</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto border border-border rounded-md p-2">
                        {SUBJECTS[editing.subject].units.map(u => {
                          const sel = editing.unit_numbers.includes(u.number);
                          return (
                            <label key={u.number} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-xs ${sel ? "bg-primary/10" : "hover:bg-secondary"}`}>
                              <Checkbox
                                checked={sel}
                                onCheckedChange={(v) => {
                                  const next = v
                                    ? [...editing.unit_numbers, u.number]
                                    : editing.unit_numbers.filter(n => n !== u.number);
                                  setEditing({ ...editing, unit_numbers: next });
                                }}
                              />
                              <span className="font-mono text-primary">{u.unitCode || `U${u.number}`}</span>
                              <span className="truncate">{u.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {editing.unit_numbers.length > 0 && (
                      <div>
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Specific topics (optional)</Label>
                        <div className="mt-2 max-h-[180px] overflow-y-auto border border-border rounded-md p-2 space-y-1">
                          {editing.unit_numbers.flatMap(n => {
                            const u = SUBJECTS[editing.subject!].units.find(x => x.number === n);
                            return (u?.topics ?? []).map(t => ({ unit: u!, topic: t }));
                          }).map(({ unit, topic }) => {
                            const key = `${unit.number}::${topic}`;
                            const sel = editing.topics.includes(topic);
                            return (
                              <label key={key} className={`flex items-center gap-2 p-1.5 rounded-md cursor-pointer text-xs ${sel ? "bg-primary/10" : "hover:bg-secondary"}`}>
                                <Checkbox
                                  checked={sel}
                                  onCheckedChange={(v) => {
                                    const next = v
                                      ? [...editing.topics, topic]
                                      : editing.topics.filter(x => x !== topic);
                                    setEditing({ ...editing, topics: next });
                                  }}
                                />
                                <span className="text-[10px] font-mono text-muted-foreground shrink-0">{unit.unitCode || `U${unit.number}`}</span>
                                <span className="flex-1">{topic}</span>
                              </label>
                            );
                          })}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1">Leave blank to cover all topics in the selected units.</div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Notes (optional)</Label>
                  <Textarea
                    value={editing.notes ?? ""}
                    onChange={ev => setEditing({ ...editing, notes: ev.target.value })}
                    placeholder="Anything to remember about this exam…"
                    className="mt-1 min-h-[60px]"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} className="btn-primary">{editing?.id ? "Save changes" : "Add exam"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Exams;
