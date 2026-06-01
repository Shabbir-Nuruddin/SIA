/**
 * RoadmapCalendar — Real calendar over roadmap_nodes.
 * Month view + per-day event list with add / edit / move / delete.
 */
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { confirmDialog } from "@/components/ui/confirm";
import { toast } from "sonner";
import { format, parseISO, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import {
  BookOpen, Repeat, FileText, Coffee, Plus, Pencil, Trash2,
  CalendarIcon, CheckCircle2, Loader2,
} from "lucide-react";

type NodeType = "learn" | "review" | "mock" | "break";
type Status = "locked" | "unlocked" | "in_progress" | "complete" | "skipped";

interface RoadmapNode {
  id: string;
  user_id: string;
  scheduled_date: string;       // yyyy-mm-dd
  node_order: number;
  node_type: NodeType;
  topic_name: string | null;
  unit_name: string | null;
  unit_number: number | null;
  unit_code: string | null;
  subject: string | null;
  status: Status;
  why_now_text: string | null;
  science_method: string | null;
}

const TYPE_META: Record<NodeType, { label: string; color: string; bg: string; icon: any }> = {
  learn:  { label: "Learn",  color: "#3B82F6", bg: "rgba(59,130,246,0.12)", icon: BookOpen },
  review: { label: "Review", color: "#D97706", bg: "rgba(217,119,6,0.12)",  icon: Repeat   },
  mock:   { label: "Mock",   color: "#DC2626", bg: "rgba(220,38,38,0.12)",  icon: FileText },
  break:  { label: "Break",  color: "#16A34A", bg: "rgba(22,163,74,0.12)",  icon: Coffee   },
};

const STATUS_META: Record<Status, string> = {
  locked: "Locked", unlocked: "Planned", in_progress: "In progress",
  complete: "Complete", skipped: "Skipped",
};

const toIsoDate = (d: Date) => format(d, "yyyy-MM-dd");

export default function RoadmapCalendar() {
  const { user } = useAuth();
  const [nodes, setNodes] = useState<RoadmapNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editing, setEditing] = useState<RoadmapNode | null>(null);
  const [creatingForDate, setCreatingForDate] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("roadmap_nodes")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_date")
      .order("node_order");
    if (error) toast.error(error.message);
    else setNodes((data || []) as RoadmapNode[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  // Date → events map
  const eventsByDate = useMemo(() => {
    const m = new Map<string, RoadmapNode[]>();
    for (const n of nodes) {
      const arr = m.get(n.scheduled_date) ?? [];
      arr.push(n);
      m.set(n.scheduled_date, arr);
    }
    return m;
  }, [nodes]);

  const selectedIso = toIsoDate(selectedDate);
  const dayEvents = eventsByDate.get(selectedIso) ?? [];

  const modifiers = useMemo(() => {
    const dates: Date[] = [];
    for (const iso of eventsByDate.keys()) dates.push(parseISO(iso));
    return { hasEvents: dates };
  }, [eventsByDate]);

  const handleDelete = async (id: string) => {
    if (!(await confirmDialog({ title: "Delete this session?", confirmText: "Delete", destructive: true }))) return;
    const { error } = await supabase.from("roadmap_nodes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setNodes(prev => prev.filter(n => n.id !== id));
    window.dispatchEvent(new CustomEvent("apex-roadmap-change"));
  };

  const handleToggleComplete = async (n: RoadmapNode) => {
    const next: Status = n.status === "complete" ? "unlocked" : "complete";
    const { error } = await supabase
      .from("roadmap_nodes")
      .update({
        status: next,
        completed_at: next === "complete" ? new Date().toISOString() : null,
      })
      .eq("id", n.id);
    if (error) return toast.error(error.message);
    await load();
    window.dispatchEvent(new CustomEvent("apex-roadmap-change"));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Calendar</h3>
          <p className="text-xs text-muted-foreground">
            Click any day to view, edit, move or delete sessions.
          </p>
        </div>
        <Button size="sm" onClick={() => setCreatingForDate(selectedIso)} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> New session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5">
        {/* Calendar */}
        <div className="surface p-3 inline-block">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => d && setSelectedDate(d)}
            modifiers={modifiers}
            modifiersClassNames={{
              hasEvents: "relative font-semibold after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary",
            }}
            className={cn("p-0 pointer-events-auto")}
          />
        </div>

        {/* Events for selected day */}
        <div className="surface p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs uppercase tracking-widest font-mono text-muted-foreground">
                {format(selectedDate, "EEEE")}
              </div>
              <div className="text-lg font-bold">{format(selectedDate, "d MMMM yyyy")}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              {dayEvents.length} session{dayEvents.length === 1 ? "" : "s"}
            </div>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : dayEvents.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No sessions on this day.
              <div className="mt-3">
                <Button size="sm" variant="outline" onClick={() => setCreatingForDate(selectedIso)} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Add a session
                </Button>
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {dayEvents.map(n => {
                const meta = TYPE_META[n.node_type];
                const Icon = meta.icon;
                const subjMeta = n.subject ? SUBJECTS[n.subject as SubjectCode] : null;
                return (
                  <li
                    key={n.id}
                    className="rounded-lg border border-border p-3 flex items-start gap-3"
                    style={{ background: meta.bg, borderLeft: `3px solid ${meta.color}` }}
                  >
                    <div className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: meta.color, color: "white" }}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] uppercase tracking-widest font-mono" style={{ color: meta.color }}>
                        {meta.label}{subjMeta && <span className="text-muted-foreground normal-case tracking-normal font-normal ml-2">{subjMeta.name}{n.unit_code ? ` · ${n.unit_code}` : ""}</span>}
                      </div>
                      <div className="text-sm font-semibold mt-0.5 truncate">
                        {n.topic_name || (n.node_type === "break" ? "Rest" : meta.label)}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {STATUS_META[n.status]}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button size="icon" variant="ghost" className="h-7 w-7"
                        title={n.status === "complete" ? "Mark not done" : "Mark complete"}
                        onClick={() => handleToggleComplete(n)}>
                        <CheckCircle2 className={cn("h-4 w-4", n.status === "complete" ? "text-success" : "text-muted-foreground")} />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" title="Edit"
                        onClick={() => setEditing(n)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" title="Delete"
                        onClick={() => handleDelete(n.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Edit dialog */}
      <EventDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        node={editing}
        onSaved={async () => { setEditing(null); await load(); window.dispatchEvent(new CustomEvent("apex-roadmap-change")); }}
      />

      {/* Create dialog */}
      <EventDialog
        open={!!creatingForDate}
        onClose={() => setCreatingForDate(null)}
        createForDate={creatingForDate}
        onSaved={async () => { setCreatingForDate(null); await load(); window.dispatchEvent(new CustomEvent("apex-roadmap-change")); }}
      />
    </div>
  );
}

// ─── Edit / Create dialog ──────────────────────────────────────────────────

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  node?: RoadmapNode | null;
  createForDate?: string | null;
  onSaved: () => void;
}

function EventDialog({ open, onClose, node, createForDate, onSaved }: EventDialogProps) {
  const { user } = useAuth();
  const isEdit = !!node;
  const [topic, setTopic] = useState("");
  const [type, setType] = useState<NodeType>("learn");
  const [subject, setSubject] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (node) {
      setTopic(node.topic_name || "");
      setType(node.node_type);
      setSubject(node.subject || "");
      setDate(parseISO(node.scheduled_date));
    } else {
      setTopic("");
      setType("learn");
      setSubject("");
      setDate(createForDate ? parseISO(createForDate) : new Date());
    }
  }, [open, node, createForDate]);

  const handleSave = async () => {
    if (!user) return;
    if (!topic.trim() && type !== "break") {
      toast.error("Add a topic name");
      return;
    }
    setSaving(true);
    try {
      if (isEdit && node) {
        const { error } = await supabase.from("roadmap_nodes").update({
          topic_name: topic.trim() || null,
          node_type: type,
          subject: subject || null,
          scheduled_date: toIsoDate(date),
        }).eq("id", node.id);
        if (error) throw error;
        toast.success("Session updated");
      } else {
        // Pick a node_order at end of day
        const { data: existing } = await supabase
          .from("roadmap_nodes")
          .select("node_order")
          .eq("user_id", user.id)
          .eq("scheduled_date", toIsoDate(date))
          .order("node_order", { ascending: false })
          .limit(1);
        const nextOrder = (existing?.[0]?.node_order ?? 0) + 1;
        const { error } = await supabase.from("roadmap_nodes").insert({
          user_id: user.id,
          scheduled_date: toIsoDate(date),
          node_order: nextOrder,
          node_type: type,
          topic_name: topic.trim() || null,
          subject: subject || null,
          status: "unlocked",
        });
        if (error) throw error;
        toast.success("Session added");
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.message || "Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit session" : "New session"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as NodeType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(TYPE_META) as NodeType[]).map(t => (
                  <SelectItem key={t} value={t}>{TYPE_META[t].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type !== "break" && (
            <div className="space-y-1.5">
              <Label>Subject (optional)</Label>
              <Select value={subject || "none"} onValueChange={(v) => setSubject(v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="No subject" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No subject</SelectItem>
                  {(Object.keys(SUBJECTS) as SubjectCode[]).map(s => (
                    <SelectItem key={s} value={s}>{SUBJECTS[s].name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Topic / title</Label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Energetics — Hess cycles" />
          </div>

          <div className="space-y-1.5">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start font-normal">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Save" : "Add session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
