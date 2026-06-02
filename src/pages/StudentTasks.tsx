import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import { Loader2, ClipboardList, Check, Clock3, CalendarDays } from "lucide-react";
import { subjectLabel } from "@/lib/studentMetrics";

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  due_date: string | null;
  status: string;
  created_at: string;
}

export default function StudentTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("student_tasks")
      .select("id,title,description,subject,due_date,status,created_at")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false });
    setTasks(((data as any[]) || []) as TaskRow[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  const toggle = async (t: TaskRow) => {
    const next = t.status === "done" ? "pending" : "done";
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
    const { error } = await supabase.from("student_tasks").update({ status: next } as any).eq("id", t.id);
    if (error) { toast.error("Could not update task."); void load(); }
  };

  const pending = tasks.filter((t) => t.status !== "done");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <AppLayout>
      <SEO title="My Tasks — SIA Smart Revision" description="Tasks set by your teachers." path="/tasks" noindex />
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-11 w-11 rounded-xl grid place-items-center bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
            <p className="text-sm text-muted-foreground">Assignments set by your teachers.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-border bg-card">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-semibold text-foreground">No tasks yet</p>
            <p className="text-sm mt-1 text-muted-foreground">When a teacher sets you a task, it'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pending.length > 0 && (
              <section>
                <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">To do · {pending.length}</h2>
                <div className="space-y-2">{pending.map((t) => <TaskItem key={t.id} t={t} onToggle={toggle} />)}</div>
              </section>
            )}
            {done.length > 0 && (
              <section>
                <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Completed · {done.length}</h2>
                <div className="space-y-2 opacity-70">{done.map((t) => <TaskItem key={t.id} t={t} onToggle={toggle} />)}</div>
              </section>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function TaskItem({ t, onToggle }: { t: TaskRow; onToggle: (t: TaskRow) => void }) {
  const isDone = t.status === "done";
  const overdue = t.due_date && !isDone && new Date(t.due_date) < new Date(new Date().toDateString());
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <button
        onClick={() => onToggle(t)}
        className={`mt-0.5 h-6 w-6 rounded-full border-2 grid place-items-center shrink-0 transition-colors ${isDone ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40 hover:border-primary"}`}
        aria-label={isDone ? "Mark as not done" : "Mark as done"}
      >
        {isDone && <Check className="h-3.5 w-3.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className={`font-semibold text-foreground ${isDone ? "line-through" : ""}`}>{t.title}</div>
        {t.description && <p className="text-sm text-muted-foreground mt-0.5">{t.description}</p>}
        <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
          {t.subject && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{subjectLabel(t.subject)}</span>}
          {t.due_date && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${overdue ? "bg-red-100 text-red-700" : "bg-secondary text-muted-foreground"}`}>
              <CalendarDays className="h-3 w-3" /> Due {new Date(t.due_date).toLocaleDateString()}{overdue ? " · overdue" : ""}
            </span>
          )}
          {!t.due_date && <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock3 className="h-3 w-3" /> No due date</span>}
        </div>
      </div>
    </div>
  );
}
