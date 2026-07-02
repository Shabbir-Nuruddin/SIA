import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RoleShell, RED, RED_DARK } from "@/components/role/RoleShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import { Loader2, Search, Flame, Clock, Target, Users, FileText, ClipboardPlus, X, FlaskConical } from "lucide-react";
import {
  fetchMetricsFor, fmtMinutes, relativeTime, fullName, subjectLabel,
  YEAR_GROUPS, SECTIONS, type ChildProfile, type StudentMetrics,
} from "@/lib/studentMetrics";
import { DEMO_STUDENTS, DEMO_FEATURED_STUDENT, DEMO_TARGET } from "@/lib/demoStudents";

const STUDENT_FIELDS = "id, first_name, last_name, student_id, grade, section, current_streak, exam_board, last_session_date";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<StudentMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [assignTarget, setAssignTarget] = useState<StudentMetrics[] | null>(null);
  const [targetStudent, setTargetStudent] = useState<StudentMetrics | null>(null);
  // Sample students are always shown for now (real roster import comes later).
  // The featured demo student (DEMO_FEATURED_STUDENT) is DEMO_STUDENTS[0], so
  // it's already the first card — and it opens with a ready-made HPL target.
  const demo = true;
  const data = demo ? DEMO_STUDENTS : metrics;

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await supabase.from("profiles").select(STUDENT_FIELDS).eq("role", "student");
        const list = ((data as any[]) || []) as ChildProfile[];
        const m = await fetchMetricsFor(list);
        if (alive) setMetrics(m);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const allSubjects = useMemo(() => {
    const s = new Set<string>();
    data.forEach((m) => m.subjects.forEach((x) => s.add(x.subject)));
    return Array.from(s).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data
      .filter((m) => gradeFilter === "all" || m.profile.grade === gradeFilter)
      .filter((m) => sectionFilter === "all" || m.profile.section === sectionFilter)
      .filter((m) => subjectFilter === "all" || m.subjects.some((s) => s.subject === subjectFilter))
      .filter((m) =>
        !q ||
        fullName(m.profile).toLowerCase().includes(q) ||
        (m.profile.student_id || "").toLowerCase().includes(q))
      .sort((a, b) =>
        (a.profile.grade || "").localeCompare(b.profile.grade || "") ||
        (a.profile.section || "").localeCompare(b.profile.section || "") ||
        fullName(a.profile).localeCompare(fullName(b.profile)));
  }, [data, gradeFilter, sectionFilter, subjectFilter, query]);

  const summary = useMemo(() => {
    const n = filtered.length;
    const totalMin = filtered.reduce((a, m) => a + m.totalMinutes, 0);
    const scored = filtered.filter((m) => m.avgScore != null);
    const avg = scored.length ? Math.round(scored.reduce((a, m) => a + (m.avgScore || 0), 0) / scored.length) : null;
    const mockScored = filtered.filter((m) => m.mockAvgPct != null);
    const mockAvg = mockScored.length ? Math.round(mockScored.reduce((a, m) => a + (m.mockAvgPct || 0), 0) / mockScored.length) : null;
    const active = filtered.filter((m) => m.weekSessions > 0).length;
    return { n, totalMin, avg, mockAvg, active };
  }, [filtered]);

  const gradeCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of data) map.set(m.profile.grade || "—", (map.get(m.profile.grade || "—") || 0) + 1);
    return map;
  }, [data]);

  // Group filtered students by grade → section for the analytics view.
  const groups = useMemo(() => {
    const map = new Map<string, StudentMetrics[]>();
    for (const m of filtered) {
      const key = `${m.profile.grade || "Unassigned"} · Section ${m.profile.section || "—"}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <RoleShell role="teacher" title="Teacher Analytics" subtitle="Track students by grade, section and subject — and set them tasks.">
      <SEO title="Teacher Analytics — SIA Smart Revision" description="Monitor all SIA students' progress." path="/teacher" noindex />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <SummaryCard icon={<Users className="h-4 w-4" />} label="Students" value={String(summary.n)} />
        <SummaryCard icon={<Flame className="h-4 w-4" />} label="Active this week" value={String(summary.active)} />
        <SummaryCard icon={<Clock className="h-4 w-4" />} label="Study time" value={fmtMinutes(summary.totalMin)} />
        <SummaryCard icon={<Target className="h-4 w-4" />} label="Topic avg" value={summary.avg != null ? `${summary.avg}%` : "—"} />
        <SummaryCard icon={<FileText className="h-4 w-4" />} label="Mock avg" value={summary.mockAvg != null ? `${summary.mockAvg}%` : "—"} />
      </div>

      {/* Filters */}
      <div className="space-y-2 mb-4">
        <FilterRow label="Grade">
          <Pill active={gradeFilter === "all"} onClick={() => setGradeFilter("all")}>All ({data.length})</Pill>
          {YEAR_GROUPS.map((g) => (
            <Pill key={g} active={gradeFilter === g} onClick={() => setGradeFilter(g)}>{g} ({gradeCounts.get(g) || 0})</Pill>
          ))}
        </FilterRow>
        <FilterRow label="Section">
          <Pill active={sectionFilter === "all"} onClick={() => setSectionFilter("all")}>All</Pill>
          {SECTIONS.map((s) => (
            <Pill key={s} active={sectionFilter === s} onClick={() => setSectionFilter(s)}>{s}</Pill>
          ))}
        </FilterRow>
        <FilterRow label="Subject">
          <Pill active={subjectFilter === "all"} onClick={() => setSubjectFilter("all")}>All</Pill>
          {allSubjects.map((s) => (
            <Pill key={s} active={subjectFilter === s} onClick={() => setSubjectFilter(s)}>{subjectLabel(s)}</Pill>
          ))}
        </FilterRow>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#bbb" }} />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or ID" className="h-10 pl-9 w-56" />
        </div>
        <Button
          onClick={() => filtered.length ? setAssignTarget(filtered) : toast.error("No students in this view.")}
          className="h-10 ml-auto font-semibold text-white" style={{ background: RED }}>
          <ClipboardPlus className="h-4 w-4 mr-1.5" /> Assign task to {filtered.length} student{filtered.length === 1 ? "" : "s"}
        </Button>
      </div>
      <div className="mb-4 rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-2" style={{ background: "#fff7ed", color: "#c2410c" }}>
        <FlaskConical className="h-3.5 w-3.5" />
        Preview mode — showing sample students. Once your school roster is imported, your real students appear here automatically.
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" style={{ color: RED }} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border bg-white" style={{ borderColor: "#f0e0e2" }}>
          <div className="text-4xl mb-3">🎓</div>
          <p className="font-semibold" style={{ color: RED_DARK }}>No students found</p>
          <p className="text-sm mt-1" style={{ color: "#999" }}>Students appear here once they sign up and set their Student ID, grade and section.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(([groupName, rows]) => (
            <div key={groupName}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold" style={{ color: RED_DARK }}>{groupName} <span className="font-normal" style={{ color: "#bbb" }}>· {rows.length}</span></h2>
              </div>
              <div className="rounded-2xl border bg-white overflow-hidden shadow-sm" style={{ borderColor: "#f0e0e2" }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left" style={{ background: "#fdf8f8", color: "#999" }}>
                        <Th>Student</Th><Th>Subjects</Th>
                        <Th right>Streak</Th><Th right>Week</Th><Th right>Roadmap</Th><Th right>Topic avg</Th>
                        <Th right>Mock avg</Th><Th right>Questions</Th><Th right>Active</Th><Th right>Task</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((m, i) => (
                        <tr key={m.profile.id} className="border-t" style={{ borderColor: "#f5ebec", background: i % 2 ? "#fff" : "#fffcfc" }}>
                          <td className="px-4 py-3">
                            <div className="font-semibold" style={{ color: RED_DARK }}>{fullName(m.profile)}</div>
                            <div className="text-xs" style={{ color: "#bbb" }}>{m.profile.student_id || "—"}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {m.subjects.length === 0 ? <span style={{ color: "#ccc" }}>—</span> :
                                m.subjects.map((s) => (
                                  <span key={s.subject} className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: "#f0e0e2", color: "#666" }}>
                                    {subjectLabel(s.subject)} <span className="font-mono" style={{ color: "#bbb" }}>{s.target_grade}</span>
                                  </span>
                                ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums">{m.profile.current_streak ?? 0}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{fmtMinutes(m.weekMinutes)}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{m.roadmapPct != null ? `${m.roadmapPct}%` : "—"}</td>
                          <td className="px-4 py-3 text-right tabular-nums font-semibold" style={{ color: m.avgScore != null && m.avgScore < 50 ? RED : "#444" }}>{m.avgScore != null ? `${m.avgScore}%` : "—"}</td>
                          <td className="px-4 py-3 text-right tabular-nums font-semibold" style={{ color: m.mockAvgPct != null && m.mockAvgPct < 50 ? RED : "#444" }}>{m.mockAvgPct != null ? `${m.mockAvgPct}%` : "—"}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{m.questionsAttempted}</td>
                          <td className="px-4 py-3 text-right text-xs" style={{ color: "#999" }}>{relativeTime(m.lastActive)}</td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button onClick={() => setTargetStudent(m)}
                              className="text-xs font-semibold px-2.5 py-1 rounded-full hover:bg-red-50"
                              style={{ color: RED }}>
                              {m.profile.id === DEMO_FEATURED_STUDENT.profile.id ? "🎯 View target" : "🎯 Target"}
                            </button>
                            <button onClick={() => setAssignTarget([m])}
                              className="text-xs font-semibold px-2.5 py-1 rounded-full hover:bg-red-50"
                              style={{ color: RED }}>
                              + Task
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {assignTarget && (
        <AssignTaskModal
          teacherId={user?.id || null}
          students={assignTarget}
          subjects={allSubjects}
          onClose={() => setAssignTarget(null)}
        />
      )}
      {targetStudent && (
        <TargetModal
          teacherId={user?.id || null}
          student={targetStudent}
          presetContent={targetStudent.profile.id === DEMO_FEATURED_STUDENT.profile.id ? DEMO_TARGET.content : ""}
          onClose={() => setTargetStudent(null)}
        />
      )}
    </RoleShell>
  );
};

function TargetModal({ teacherId, student, presetContent = "", onClose }: { teacherId: string | null; student: StudentMetrics; presetContent?: string; onClose: () => void }) {
  const [period, setPeriod] = useState("This week");
  // Pre-fill with the ready-made HPL target for the featured demo student, so
  // it's "already generated" for a live demo — no waiting on the AI call.
  const [content, setContent] = useState(presetContent);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const isDemo = student.profile.id.startsWith("demo-");

  const generate = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-student-target", {
        body: {
          studentName: fullName(student.profile),
          period,
          subjects: student.subjects,
          metrics: {
            weekMinutes: student.weekMinutes,
            roadmapPct: student.roadmapPct,
            avgScore: student.avgScore,
            mockAvgPct: student.mockAvgPct,
            questionsAttempted: student.questionsAttempted,
            questionsCorrect: student.questionsCorrect,
            weakTopics: student.weakTopics,
            currentStreak: student.profile.current_streak ?? 0,
          },
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setContent(data?.target || "");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate target.");
    } finally {
      setGenerating(false);
    }
  };

  const save = async () => {
    if (!content.trim()) { toast.error("Generate or write a target first."); return; }
    if (isDemo) { toast.success("Target sent to parent (preview)."); onClose(); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from("student_targets").insert({
        teacher_id: teacherId,
        student_id: student.profile.id,
        period,
        content: content.trim(),
        status: "sent",
      } as any);
      if (error) throw error;
      toast.success("Target saved & shared with the parent.");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save target.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#f0e0e2" }}>
          <h3 className="font-bold" style={{ color: RED_DARK }}>HPL target · {fullName(student.profile)}</h3>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full hover:bg-gray-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Label className="shrink-0">Period</Label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="h-10 rounded-md border px-3 text-sm" style={{ borderColor: "#e5e7eb" }}>
              <option>This week</option>
              <option>Next 2 weeks</option>
            </select>
            <Button onClick={generate} disabled={generating} className="ml-auto h-10 font-semibold text-white" style={{ background: RED }}>
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : "✨ Generate"}
            </Button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Generate an AI target from this student's analytics, then edit it here before sending to the parent."
            className="w-full min-h-[200px] rounded-md border px-3 py-2 text-sm leading-relaxed" style={{ borderColor: "#e5e7eb" }}
          />
          <p className="text-xs" style={{ color: "#999" }}>Grounded in this student's SIA analytics and framed in HPL (Meta-thinking, Linking, Analysing, Creating, Realising; Empathetic, Agile, Hard-working). Edit freely before sending.</p>
          <Button onClick={save} disabled={saving || !content.trim()} className="h-11 w-full font-semibold text-white" style={{ background: RED }}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save & share with parent"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AssignTaskModal({
  teacherId, students, subjects, onClose,
}: { teacherId: string | null; students: StudentMetrics[]; subjects: string[]; onClose: () => void }) {
  const [taskType, setTaskType] = useState<"questions" | "mock" | "notes" | "custom">("questions");
  const [count, setCount] = useState(10);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  const subjText = subject ? subjectLabel(subject) : "";
  const autoTitle =
    taskType === "questions" ? `Complete ${count} topical question${count === 1 ? "" : "s"}${subjText ? ` — ${subjText}` : ""}` :
    taskType === "mock"      ? `Sit ${count} mock paper${count === 1 ? "" : "s"}${subjText ? ` — ${subjText}` : ""}` :
    taskType === "notes"     ? `Revise ${count} topic${count === 1 ? "" : "s"} of notes${subjText ? ` — ${subjText}` : ""}` :
                               title.trim();

  const submit = async () => {
    const finalTitle = taskType === "custom" ? title.trim() : autoTitle;
    if (!finalTitle) { toast.error("Enter a task title."); return; }
    // Fake preview cards (id "demo-N") aren't real accounts — they can't take a
    // real row, so split them out and only insert for the real student(s) (e.g.
    // the pinned real Demo Student). Simulate the rest for the preview.
    const realStudents = students.filter((m) => !m.profile.id.startsWith("demo-"));
    const previewCount = students.length - realStudents.length;
    if (realStudents.length === 0) {
      toast.success(`Task assigned to ${students.length} student${students.length === 1 ? "" : "s"} (preview).`);
      onClose();
      return;
    }
    setSaving(true);
    try {
      const rows = realStudents.map((m) => ({
        teacher_id: teacherId,
        student_id: m.profile.id,
        title: finalTitle,
        description: description.trim() || null,
        subject: subject || null,
        due_date: dueDate || null,
      }));
      const { error } = await supabase.from("student_tasks").insert(rows as any);
      if (error) throw error;
      toast.success(
        `Task assigned to ${realStudents.length} student${realStudents.length === 1 ? "" : "s"}` +
        (previewCount > 0 ? ` (+ ${previewCount} preview).` : "."),
      );
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not assign task.");
    } finally {
      setSaving(false);
    }
  };

  const label = students.length === 1 ? fullName(students[0].profile) : `${students.length} students`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#f0e0e2" }}>
          <h3 className="font-bold" style={{ color: RED_DARK }}>Assign task · {label}</h3>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full hover:bg-gray-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label>What to assign</Label>
            <div className="flex flex-wrap gap-2">
              {([
                { id: "questions", label: "Topical Questions" },
                { id: "mock", label: "Mock Paper" },
                { id: "notes", label: "Notes" },
                { id: "custom", label: "Custom" },
              ] as const).map((t) => (
                <Pill key={t.id} active={taskType === t.id} onClick={() => setTaskType(t.id)}>{t.label}</Pill>
              ))}
            </div>
          </div>

          {taskType === "custom" ? (
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Complete Unit 4 past paper" className="h-11" maxLength={120} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>How many</Label>
                <Input type="number" min={1} max={50} value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))} className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label>Preview</Label>
                <div className="h-11 flex items-center rounded-md border px-3 text-xs text-gray-600" style={{ borderColor: "#e5e7eb", background: "#fafafa" }}>
                  {autoTitle}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Details (optional)</Label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Any instructions…"
              className="w-full min-h-[80px] rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#e5e7eb" }} maxLength={500} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full h-11 rounded-md border px-3 text-sm" style={{ borderColor: "#e5e7eb" }}>
                <option value="">General</option>
                {subjects.map((s) => <option key={s} value={s}>{subjectLabel(s)}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Due date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-11" />
            </div>
          </div>
          <Button onClick={submit} disabled={saving} className="h-11 w-full font-semibold text-white" style={{ background: RED }}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : `Assign to ${label}`}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide w-16 shrink-0" style={{ color: "#bbb" }}>{label}</span>
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className="px-3 py-1 rounded-full text-sm font-semibold border-2 transition-all"
      style={{ borderColor: active ? RED : "#e5e7eb", background: active ? RED : "#fff", color: active ? "#fff" : "#374151" }}>
      {children}
    </button>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th className={`px-4 py-3 font-semibold text-xs uppercase tracking-wide ${right ? "text-right" : ""}`}>{children}</th>;
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: "#f0e0e2" }}>
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#999" }}>
        <span style={{ color: RED }}>{icon}</span> {label}
      </div>
      <div className="text-2xl font-bold tabular-nums" style={{ color: RED_DARK }}>{value}</div>
    </div>
  );
}

export default TeacherDashboard;
