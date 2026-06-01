/**
 * RoadmapWorkspace — Full-bleed interactive roadmap workspace.
 *
 * Layout: subject tabs at top, left rail of units & topics (with one-click
 * "schedule this" and an "add custom topic" form), and the main canvas
 * showing scheduled nodes for the selected subject grouped by day.
 *
 * All mutations write to the existing `roadmap_nodes` table — the data
 * surface used by RoadmapCalendar and the auto-generator. No new tables.
 * No schema changes.
 */
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { confirmDialog } from "@/components/ui/confirm";
import { Input } from "@/components/ui/input";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { ROADMAP_TOPICS } from "@/lib/roadmapTopics";
import type { RoadmapNodeRow, NodeType } from "@/lib/roadmapNodes";
import { format, parseISO, isToday, isTomorrow, addDays } from "date-fns";
import {
  Plus, BookOpen, Repeat, FileText, Coffee, CheckCircle2, Lock, Play,
  Trash2, Zap, Sparkles, GripVertical, Calendar as CalIcon, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

const SUBJECT_TINT: Record<SubjectCode, string> = {
  mathematics: "hsl(220 70% 55%)",
  biology:     "hsl(150 60% 45%)",
  chemistry:   "hsl(280 55% 60%)",
  physics:     "hsl(28 80% 58%)",
};

const NODE_ACCENT: Record<NodeType, string> = {
  learn:  "hsl(160 65% 45%)",
  review: "hsl(43 75% 55%)",
  mock:   "hsl(0 70% 60%)",
  break:  "hsl(200 60% 55%)",
};

const TYPE_ICON: Record<NodeType, typeof BookOpen> = {
  learn: BookOpen, review: Repeat, mock: FileText, break: Coffee,
};

interface Props {
  nodes: RoadmapNodeRow[];
  exams: { subject: SubjectCode | null; exam_date: string; name: string }[];
  defaultSubject?: SubjectCode;
  onChallenge: (node: RoadmapNodeRow) => void;
  onStartLearn: (node: RoadmapNodeRow) => void;
  onMarkComplete: (node: RoadmapNodeRow) => Promise<void>;
  onMarkSkipped: (node: RoadmapNodeRow) => Promise<void>;
  onReload: () => Promise<void>;
}

const toIso = (d: Date) => format(d, "yyyy-MM-dd");

function dayLabel(iso: string) {
  const d = parseISO(iso);
  if (isToday(d)) return `Today · ${format(d, "EEE d MMM")}`;
  if (isTomorrow(d)) return `Tomorrow · ${format(d, "EEE d MMM")}`;
  return format(d, "EEEE d MMMM");
}

export const RoadmapWorkspace = ({
  nodes, exams, defaultSubject = "chemistry",
  onChallenge, onStartLearn, onMarkComplete, onMarkSkipped, onReload,
}: Props) => {
  const { user } = useAuth();
  const [subject, setSubject] = useState<SubjectCode>(defaultSubject);
  const [openUnits, setOpenUnits] = useState<Record<number, boolean>>({ 1: true });
  const [customTopic, setCustomTopic] = useState("");
  const [customDate, setCustomDate] = useState(toIso(new Date()));
  const [customUnit, setCustomUnit] = useState<number>(1);
  const [adding, setAdding] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);

  const subjectMeta = SUBJECTS[subject];
  const topicsByUnit = ROADMAP_TOPICS[subject] || {};

  // All scheduled topic names for the chosen subject (for "already planned" badges)
  const plannedTopicSet = useMemo(() => {
    return new Set(
      nodes
        .filter(n => n.subject === subject && n.topic_name)
        .map(n => (n.topic_name || "").toLowerCase())
    );
  }, [nodes, subject]);

  // Nodes for the chosen subject, grouped by day
  const grouped = useMemo(() => {
    const filtered = nodes.filter(n => n.subject === subject);
    const map = new Map<string, RoadmapNodeRow[]>();
    for (const n of filtered) {
      const arr = map.get(n.scheduled_date) ?? [];
      arr.push(n);
      map.set(n.scheduled_date, arr);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, list]) => [date, list.sort((a, b) => a.node_order - b.node_order)] as const);
  }, [nodes, subject]);

  const nearestExam = useMemo(() => {
    const e = exams.find(x => x.subject === subject) || exams[0];
    return e ?? null;
  }, [exams, subject]);

  const scheduleTopic = async (
    topicName: string,
    unitNumber: number,
    nodeType: NodeType,
    scheduledDate: string,
  ) => {
    if (!user) return;
    const unit = subjectMeta.units?.find(u => u.number === unitNumber);
    const { data: existing } = await supabase
      .from("roadmap_nodes")
      .select("node_order")
      .eq("user_id", user.id)
      .eq("scheduled_date", scheduledDate)
      .order("node_order", { ascending: false })
      .limit(1);
    const nextOrder = (existing?.[0]?.node_order ?? 0) + 1;
    const { error } = await supabase.from("roadmap_nodes").insert({
      user_id: user.id,
      subject,
      unit_number: unitNumber,
      unit_name: unit?.name ?? null,
      unit_code: (unit as any)?.unitCode ?? null,
      topic_name: topicName,
      node_type: nodeType,
      node_order: nextOrder,
      scheduled_date: scheduledDate,
      status: "unlocked",
    });
    if (error) { toast.error(error.message); return; }
    toast.success(`Added "${topicName}"`);
    await onReload();
  };

  const handleQuickAdd = async (topicName: string, unitNumber: number) => {
    const todayIso = toIso(new Date());
    await scheduleTopic(topicName, unitNumber, "learn", todayIso);
  };

  const handleCustomAdd = async () => {
    if (!customTopic.trim()) { toast.error("Type a topic name"); return; }
    setAdding(true);
    await scheduleTopic(customTopic.trim(), customUnit, "learn", customDate);
    setCustomTopic("");
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!(await confirmDialog({ title: "Delete this session?", confirmText: "Delete", destructive: true }))) return;
    const { error } = await supabase.from("roadmap_nodes").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    await onReload();
  };

  const handleDrop = async (targetDate: string) => {
    if (!dragNodeId) return;
    const node = nodes.find(n => n.id === dragNodeId);
    setDragNodeId(null);
    if (!node || node.scheduled_date === targetDate) return;
    const { error } = await supabase
      .from("roadmap_nodes")
      .update({ scheduled_date: targetDate })
      .eq("id", node.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Moved to ${dayLabel(targetDate)}`);
    await onReload();
  };

  const tint = SUBJECT_TINT[subject];

  return (
    <div className="w-full">
      {/* Subject tabs */}
      <div className="px-6 md:px-10 pt-6">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SUBJECTS) as SubjectCode[]).map(code => {
            const m = SUBJECTS[code];
            const active = code === subject;
            return (
              <button
                key={code}
                onClick={() => { setSubject(code); setOpenUnits({ 1: true }); }}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all border"
                style={{
                  background: active ? `${SUBJECT_TINT[code]}22` : "hsl(var(--card) / 0.6)",
                  borderColor: active ? SUBJECT_TINT[code] : "hsl(var(--border))",
                  color: active ? SUBJECT_TINT[code] : "hsl(var(--muted-foreground))",
                  boxShadow: active ? `0 0 0 1px ${SUBJECT_TINT[code]}33` : undefined,
                }}
              >
                <span className="mr-2">{m.emoji}</span>{m.name}
              </button>
            );
          })}
        </div>
        {nearestExam && (
          <div className="mt-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Next {subjectMeta.name} exam: {format(parseISO(nearestExam.exam_date), "EEE d MMM yyyy")}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0 mt-5">
        {/* === LEFT RAIL === */}
        <aside className="border-r border-border bg-card/30 backdrop-blur-sm p-5 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto">
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono mb-3" style={{ color: tint }}>
            Syllabus topics
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Tap any topic to schedule it for today, or add your own custom topic below.
          </p>

          <div className="space-y-2 mb-6">
            {Object.entries(topicsByUnit).map(([unitStr, topics]) => {
              const unitNum = Number(unitStr);
              const unitMeta = subjectMeta.units?.find(u => u.number === unitNum);
              const isOpen = !!openUnits[unitNum];
              return (
                <div key={unitNum} className="rounded-lg border border-border bg-background overflow-hidden">
                  <button
                    onClick={() => setOpenUnits(s => ({ ...s, [unitNum]: !s[unitNum] }))}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-card/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        Unit {unitNum}{(unitMeta as any)?.unitCode ? ` · ${(unitMeta as any).unitCode}` : ""}
                      </div>
                      <div className="text-sm font-semibold truncate">{unitMeta?.name ?? `Unit ${unitNum}`}</div>
                    </div>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </button>
                  {isOpen && (
                    <ul className="border-t border-border divide-y divide-border">
                      {(topics as string[]).map(t => {
                        const planned = plannedTopicSet.has(t.toLowerCase());
                        return (
                          <li key={t} className="flex items-center gap-2 px-3 py-2 hover:bg-card/40">
                            <span className="flex-1 text-[13px] leading-snug">{t}</span>
                            {planned ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" aria-label="Already planned" />
                            ) : (
                              <button
                                onClick={() => handleQuickAdd(t, unitNum)}
                                className="h-7 w-7 rounded-md hover:bg-primary/15 text-primary flex items-center justify-center shrink-0"
                                title="Schedule for today"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {/* Custom topic */}
          <div className="rounded-lg border border-dashed border-border p-3 bg-background/50">
            <div className="text-[10px] uppercase tracking-[0.3em] font-mono mb-2" style={{ color: tint }}>
              Your own topic
            </div>
            <Input
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              placeholder="e.g. Past paper Jun 2023 Q4"
              className="h-9 text-sm mb-2"
            />
            <div className="grid grid-cols-2 gap-2 mb-3">
              <select
                value={customUnit}
                onChange={e => setCustomUnit(Number(e.target.value))}
                className="h-9 rounded-md bg-background border border-input px-2 text-xs"
              >
                {(subjectMeta.units ?? []).map(u => (
                  <option key={u.number} value={u.number}>Unit {u.number}{(u as any).unitCode ? ` · ${(u as any).unitCode}` : ""}</option>
                ))}
              </select>
              <Input
                type="date"
                value={customDate}
                onChange={e => setCustomDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <Button
              onClick={handleCustomAdd}
              disabled={adding || !customTopic.trim()}
              className="w-full h-9 text-xs btn-primary"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add custom topic
            </Button>
          </div>
        </aside>

        {/* === MAIN CANVAS === */}
        <main className="p-5 md:p-8 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto">
          {grouped.length === 0 ? (
            <div className="surface p-12 text-center">
              <Sparkles className="h-10 w-10 mx-auto mb-4" style={{ color: tint }} />
              <h3 className="text-xl font-bold mb-2">No {subjectMeta.name} sessions yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Pick a topic on the left to schedule it, or add your own. You're in full control of what gets studied and when.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map(([date, dayNodes]) => {
                const allDone = dayNodes.every(n => n.status === "complete" || n.status === "skipped");
                return (
                  <section
                    key={date}
                    onDragOver={(e) => { if (dragNodeId) e.preventDefault(); }}
                    onDrop={() => handleDrop(date)}
                    className={`rounded-2xl border ${dragNodeId ? "border-dashed border-primary/50" : "border-border"} bg-card/40 p-4 transition-colors`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CalIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{dayLabel(date)}</span>
                        {allDone && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
                        {dayNodes.filter(n => n.status === "complete").length}/{dayNodes.length}
                      </span>
                    </div>

                    <div className="grid gap-2.5 md:grid-cols-2">
                      {dayNodes.map(node => (
                        <NodeTile
                          key={node.id}
                          node={node}
                          tint={tint}
                          onDragStart={() => setDragNodeId(node.id)}
                          onDragEnd={() => setDragNodeId(null)}
                          onStart={() => onStartLearn(node)}
                          onChallenge={() => onChallenge(node)}
                          onComplete={() => onMarkComplete(node)}
                          onSkip={() => onMarkSkipped(node)}
                          onDelete={() => handleDelete(node.id)}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

interface NodeTileProps {
  node: RoadmapNodeRow;
  tint: string;
  onDragStart: () => void;
  onDragEnd: () => void;
  onStart: () => void;
  onChallenge: () => void;
  onComplete: () => void;
  onSkip: () => void;
  onDelete: () => void;
}

const NodeTile = ({
  node, tint, onDragStart, onDragEnd, onStart, onChallenge, onComplete, onSkip, onDelete,
}: NodeTileProps) => {
  const Icon = TYPE_ICON[node.node_type];
  const accent = NODE_ACCENT[node.node_type];
  const isComplete = node.status === "complete";
  const isLocked = node.status === "locked";
  const isSkipped = node.status === "skipped";

  return (
    <div
      draggable={!isLocked}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group relative rounded-xl border bg-background p-3.5 transition-all ${isComplete ? "opacity-60" : isSkipped ? "opacity-50" : "hover:border-primary/40"}`}
      style={{ borderLeft: `3px solid ${isComplete ? "hsl(var(--success))" : isLocked ? "hsl(var(--border))" : accent}` }}
    >
      <div className="flex items-start gap-2 mb-2">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground mt-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono mb-1" style={{ color: isComplete ? "hsl(var(--success))" : accent }}>
            <Icon className="h-3 w-3" />
            {node.node_type}
            {isLocked && <Lock className="h-3 w-3 ml-1" />}
          </div>
          <h4 className={`text-sm font-semibold leading-snug ${isComplete ? "line-through decoration-1" : ""}`}>
            {node.topic_name || `Unit ${node.unit_number}`}
          </h4>
          {node.unit_code && (
            <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{node.unit_code}</div>
          )}
        </div>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 -mr-1 -mt-1"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {!isComplete && !isLocked && !isSkipped && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {node.node_type === "learn" && (
            <Button onClick={onStart} size="sm" className="h-7 px-2.5 text-[11px] btn-primary">
              <Play className="h-3 w-3 mr-1" fill="currentColor" /> Start
            </Button>
          )}
          <Button onClick={onChallenge} size="sm" variant="outline" className="h-7 px-2.5 text-[11px]" style={{ borderColor: `${accent}55`, color: accent }}>
            <Zap className="h-3 w-3 mr-1" /> Challenge
          </Button>
          <Button onClick={onComplete} size="sm" variant="ghost" className="h-7 px-2 text-[11px] text-muted-foreground hover:text-success">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Done
          </Button>
          <Button onClick={onSkip} size="sm" variant="ghost" className="h-7 px-2 text-[11px] text-muted-foreground">
            Skip
          </Button>
        </div>
      )}
    </div>
  );
};
