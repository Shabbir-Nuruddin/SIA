// Phase 1 — Interactive roadmap canvas (React Flow).
// Reads roadmap_nodes + topic_progress + exams from Supabase and renders
// a spatial mind-map: Grade core → Subject hubs → Unit hubs → Topic leaves.
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SUBJECTS, type SubjectCode } from "@/lib/subjects";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lock, CheckCircle2, Sparkles, NotebookText, AlertTriangle, Play, Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { differenceInDays, parseISO } from "date-fns";
import { toast } from "sonner";
import type { RoadmapNodeRow } from "@/lib/roadmapNodes";

const SUBJECT_HSL: Record<SubjectCode, string> = {
  mathematics: "262 83% 65%",
  biology: "142 70% 50%",
  chemistry: "25 95% 60%",
  physics: "210 95% 60%",
};

interface WeakRow { subject: string; unit_number: number | null; topic_name: string; }
interface ExamRow { subject: SubjectCode | null; exam_date: string; name: string; is_active: boolean; }
interface NoteRow { subject: string; unit_number: number; topic: string; }

type SubjectFilter = "all" | SubjectCode;

// ---------- Custom node components ----------

interface NodeData {
  label: string;
  sublabel?: string;
  status: RoadmapNodeRow["status"];
  subject?: SubjectCode | null;
  isWeak?: boolean;
  hasNotes?: boolean;
  isCore?: boolean;
  isSubjectHub?: boolean;
  isUnitHub?: boolean;
  onClick?: () => void;
  onMarkWeak?: () => void;
}

function statusStyle(status: RoadmapNodeRow["status"], subject?: SubjectCode | null) {
  const hue = subject ? SUBJECT_HSL[subject] : "230 15% 55%";
  switch (status) {
    case "complete":
      return { bg: `hsl(${hue} / 0.10)`, border: `hsl(${hue} / 0.55)`, text: "hsl(var(--foreground))", opacity: 0.7 };
    case "in_progress":
      return { bg: `hsl(${hue} / 0.25)`, border: `hsl(${hue})`, text: "hsl(var(--foreground))", opacity: 1 };
    case "unlocked":
      return { bg: `hsl(${hue} / 0.18)`, border: `hsl(${hue} / 0.85)`, text: "hsl(var(--foreground))", opacity: 1 };
    case "locked":
    default:
      return { bg: "hsl(var(--muted) / 0.4)", border: "hsl(var(--border))", text: "hsl(var(--muted-foreground))", opacity: 0.55 };
  }
}

function TopicNode({ data }: NodeProps) {
  const d = data as unknown as NodeData;
  const s = statusStyle(d.status, d.subject);
  const isLocked = d.status === "locked";
  return (
    <div
      onClick={() => !isLocked && d.onClick?.()}
      onContextMenu={(e) => { e.preventDefault(); d.onMarkWeak?.(); }}
      style={{
        background: s.bg,
        border: `1.5px solid ${d.isWeak ? "hsl(var(--destructive))" : s.border}`,
        color: s.text,
        opacity: s.opacity,
        boxShadow: d.status === "in_progress" ? `0 0 22px hsl(${d.subject ? SUBJECT_HSL[d.subject] : "230 15% 55%"} / 0.5)` : undefined,
      }}
      className={`px-3 py-2 rounded-xl text-xs font-medium max-w-[180px] transition-all ${isLocked ? "cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="flex items-center gap-1.5">
        {d.status === "complete" && <CheckCircle2 className="w-3 h-3 shrink-0" />}
        {d.status === "locked" && <Lock className="w-3 h-3 shrink-0" />}
        {d.isWeak && <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />}
        {d.hasNotes && <NotebookText className="w-3 h-3 text-primary shrink-0" />}
        <span className="leading-tight">{d.label}</span>
      </div>
      {d.sublabel && <div className="text-[10px] opacity-60 mt-0.5">{d.sublabel}</div>}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

function UnitHubNode({ data }: NodeProps) {
  const d = data as unknown as NodeData;
  const hue = d.subject ? SUBJECT_HSL[d.subject] : "230 15% 55%";
  return (
    <div
      style={{ background: `hsl(${hue} / 0.15)`, border: `2px solid hsl(${hue} / 0.6)` }}
      className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-foreground shadow-lg"
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div>{d.label}</div>
      {d.sublabel && <div className="text-[10px] opacity-70 font-normal">{d.sublabel}</div>}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

function SubjectHubNode({ data }: NodeProps) {
  const d = data as unknown as NodeData;
  const hue = d.subject ? SUBJECT_HSL[d.subject] : "230 15% 55%";
  return (
    <div
      style={{
        background: `radial-gradient(circle, hsl(${hue} / 0.35) 0%, hsl(${hue} / 0.05) 70%)`,
        border: `2.5px solid hsl(${hue})`,
        boxShadow: `0 0 36px hsl(${hue} / 0.4)`,
      }}
      className="px-5 py-3 rounded-full text-base font-bold text-foreground"
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="flex items-center gap-2">
        <span className="text-xl">{d.sublabel}</span>
        <span>{d.label}</span>
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

function CoreNode({ data }: NodeProps) {
  const d = data as unknown as NodeData;
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
      <div
        className="relative px-6 py-4 rounded-full text-lg font-extrabold text-primary-foreground"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))",
          boxShadow: "0 0 50px hsl(var(--primary) / 0.6)",
          border: "3px solid hsl(var(--primary))",
        }}
      >
        <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
        <div className="text-center">
          <div className="text-[10px] opacity-80 font-normal">YOU ARE HERE</div>
          <div>{d.label}</div>
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  core: CoreNode,
  subjectHub: SubjectHubNode,
  unitHub: UnitHubNode,
  topic: TopicNode,
};

// ---------- Layout ----------

interface LayoutInput {
  rows: RoadmapNodeRow[];
  weakSet: Set<string>;
  notesSet: Set<string>;
  filter: SubjectFilter;
  onOpenNode: (n: RoadmapNodeRow) => void;
  onMarkWeak: (n: RoadmapNodeRow) => void;
}

function buildGraph({ rows, weakSet, notesSet, filter, onOpenNode, onMarkWeak }: LayoutInput): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const bySubject = new Map<SubjectCode, Map<number, RoadmapNodeRow[]>>();
  for (const r of rows) {
    if (!r.subject) continue;
    const subj = r.subject as SubjectCode;
    if (filter !== "all" && subj !== filter) continue;
    if (!bySubject.has(subj)) bySubject.set(subj, new Map());
    const byUnit = bySubject.get(subj)!;
    const unitNo = r.unit_number ?? 0;
    if (!byUnit.has(unitNo)) byUnit.set(unitNo, []);
    byUnit.get(unitNo)!.push(r);
  }

  nodes.push({
    id: "core",
    type: "core",
    position: { x: 0, y: 0 },
    data: { label: "Your Path", status: "in_progress" } as any,
  });

  const subjects = Array.from(bySubject.keys());
  const subjectGap = filter === "all" ? 360 : 0;
  const subjectStartY = -((subjects.length - 1) * subjectGap) / 2;

  subjects.forEach((subj, sIdx) => {
    const subjY = subjectStartY + sIdx * subjectGap;
    const subjX = 320;
    const subjId = `subj-${subj}`;
    const meta = SUBJECTS[subj];
    nodes.push({
      id: subjId,
      type: "subjectHub",
      position: { x: subjX, y: subjY },
      data: { label: meta?.name ?? subj, sublabel: meta?.emoji, subject: subj, status: "in_progress" } as any,
    });
    edges.push({
      id: `e-core-${subj}`,
      source: "core",
      target: subjId,
      type: "smoothstep",
      animated: false,
      style: { stroke: `hsl(${SUBJECT_HSL[subj]} / 0.7)`, strokeWidth: 2 },
    });

    const units = Array.from(bySubject.get(subj)!.entries()).sort(([a], [b]) => a - b);
    const unitGap = 220;
    const unitStartY = subjY - ((units.length - 1) * unitGap) / 2;

    units.forEach(([unitNo, unitNodes], uIdx) => {
      const unitY = unitStartY + uIdx * unitGap;
      const unitX = subjX + 280;
      const unitId = `unit-${subj}-${unitNo}`;
      const first = unitNodes[0];
      nodes.push({
        id: unitId,
        type: "unitHub",
        position: { x: unitX, y: unitY },
        data: {
          label: first.unit_name ?? `Unit ${unitNo}`,
          sublabel: first.unit_code ?? `U${unitNo}`,
          subject: subj,
          status: "in_progress",
        } as any,
      });
      edges.push({
        id: `e-${subjId}-${unitId}`,
        source: subjId,
        target: unitId,
        type: "smoothstep",
        style: { stroke: `hsl(${SUBJECT_HSL[subj]} / 0.55)`, strokeWidth: 1.5 },
      });

      const topicGap = 70;
      const topicStartY = unitY - ((unitNodes.length - 1) * topicGap) / 2;
      unitNodes.forEach((row, tIdx) => {
        const topicY = topicStartY + tIdx * topicGap;
        const topicX = unitX + 280;
        const noteKey = `${subj}::${unitNo}::${(row.topic_name ?? "").toLowerCase()}`;
        const isWeak = weakSet.has(noteKey);
        const hasNotes = notesSet.has(noteKey);
        nodes.push({
          id: row.id,
          type: "topic",
          position: { x: topicX, y: topicY },
          data: {
            label: row.topic_name ?? row.node_type,
            sublabel: row.node_type !== "learn" ? row.node_type : undefined,
            subject: subj,
            status: row.status,
            isWeak,
            hasNotes,
            onClick: () => onOpenNode(row),
            onMarkWeak: () => onMarkWeak(row),
          } as any,
        });
        edges.push({
          id: `e-${unitId}-${row.id}`,
          source: unitId,
          target: row.id,
          type: "smoothstep",
          style: { stroke: `hsl(${SUBJECT_HSL[subj]} / ${row.status === "complete" ? 0.4 : 0.3})`, strokeWidth: 1 },
        });
      });
    });
  });

  return { nodes, edges };
}

// ---------- Main canvas ----------

interface Props {
  rows: RoadmapNodeRow[];
  onChange: () => void;
}

function CanvasInner({ rows, onChange }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<SubjectFilter>("all");
  const [weakRows, setWeakRows] = useState<WeakRow[]>([]);
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [activeNode, setActiveNode] = useState<RoadmapNodeRow | null>(null);
  const [weakOnly, setWeakOnly] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [w, e, n] = await Promise.all([
        supabase.from("topic_progress").select("subject,unit_number,topic_name").eq("user_id", user.id).eq("weak_flag", true),
        supabase.from("exams").select("subject,exam_date,name,is_active").eq("user_id", user.id).eq("is_active", true).order("exam_date"),
        supabase.from("topic_notes").select("subject,unit_number,topic").eq("user_id", user.id),
      ]);
      if (w.data) setWeakRows(w.data as WeakRow[]);
      if (e.data) setExams(e.data as ExamRow[]);
      if (n.data) setNotes(n.data as NoteRow[]);
    })();
  }, [user]);

  const weakSet = useMemo(() => new Set(
    weakRows.map(w => `${w.subject}::${w.unit_number ?? ""}::${w.topic_name.toLowerCase()}`)
  ), [weakRows]);

  const notesSet = useMemo(() => new Set(
    notes.map(n => `${n.subject}::${n.unit_number}::${n.topic.toLowerCase()}`)
  ), [notes]);

  const subjectsInPlan = useMemo(() => {
    const s = new Set<SubjectCode>();
    for (const r of rows) if (r.subject) s.add(r.subject as SubjectCode);
    return Array.from(s);
  }, [rows]);

  const urgentExam = useMemo(() => {
    const upcoming = exams.find(e => {
      const d = differenceInDays(parseISO(e.exam_date), new Date());
      return d >= 0 && d <= 60;
    });
    return upcoming ?? null;
  }, [exams]);

  const handleMarkWeak = useCallback(async (row: RoadmapNodeRow) => {
    if (!user || !row.subject || !row.topic_name) return;
    const noteKey = `${row.subject}::${row.unit_number ?? ""}::${row.topic_name.toLowerCase()}`;
    const isWeak = weakSet.has(noteKey);
    const existing = await supabase
      .from("topic_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("subject", row.subject)
      .eq("topic_name", row.topic_name)
      .maybeSingle();
    const op = existing.data
      ? supabase.from("topic_progress").update({ weak_flag: !isWeak }).eq("id", existing.data.id)
      : supabase.from("topic_progress").insert({
          user_id: user.id,
          subject: row.subject,
          unit_number: row.unit_number,
          topic_name: row.topic_name,
          weak_flag: !isWeak,
        });
    const { error } = await op;
    if (error) { toast.error(error.message); return; }
    toast.success(isWeak ? "Unmarked weak topic" : "Marked as weak topic");
    const { data } = await supabase.from("topic_progress").select("subject,unit_number,topic_name").eq("user_id", user.id).eq("weak_flag", true);
    if (data) setWeakRows(data as WeakRow[]);
  }, [user, weakSet]);

  const visibleRows = useMemo(() => {
    if (!weakOnly) return rows;
    return rows.filter(r => {
      if (!r.subject || !r.topic_name) return false;
      const key = `${r.subject}::${r.unit_number ?? ""}::${r.topic_name.toLowerCase()}`;
      return weakSet.has(key);
    });
  }, [rows, weakOnly, weakSet]);

  const { nodes: flowNodes, edges: flowEdges } = useMemo(
    () => buildGraph({
      rows: visibleRows,
      weakSet,
      notesSet,
      filter,
      onOpenNode: setActiveNode,
      onMarkWeak: handleMarkWeak,
    }),
    [visibleRows, weakSet, notesSet, filter, handleMarkWeak]
  );

  const startSession = () => {
    if (!activeNode) return;
    navigate(`/roadmap/topic/${activeNode.id}/notes`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Subjects
        </Button>
        {subjectsInPlan.map(s => {
          const examForSubj = exams.find(e => e.subject === s);
          const daysAway = examForSubj ? differenceInDays(parseISO(examForSubj.exam_date), new Date()) : null;
          const urgent = daysAway != null && daysAway >= 0 && daysAway <= 30;
          return (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(s)}
              className="relative"
              style={filter === s ? { background: `hsl(${SUBJECT_HSL[s]})`, borderColor: `hsl(${SUBJECT_HSL[s]})` } : undefined}
            >
              {SUBJECTS[s]?.emoji} {SUBJECTS[s]?.name}
              {urgent && <Badge variant="destructive" className="ml-1.5 h-4 px-1 text-[9px]">{daysAway}d</Badge>}
            </Button>
          );
        })}
        <div className="flex-1" />
        <Button
          variant={weakOnly ? "destructive" : "outline"}
          size="sm"
          onClick={() => setWeakOnly(v => !v)}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Weak topics ({weakRows.length})
        </Button>
      </div>

      {urgentExam && (
        <div
          className="px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          style={{
            background: urgentExam.subject ? `hsl(${SUBJECT_HSL[urgentExam.subject]} / 0.15)` : "hsl(var(--destructive) / 0.15)",
            border: `1px solid ${urgentExam.subject ? `hsl(${SUBJECT_HSL[urgentExam.subject]} / 0.5)` : "hsl(var(--destructive) / 0.5)"}`,
          }}
        >
          <Flame className="w-4 h-4" />
          <span className="font-medium">{urgentExam.name}</span> in {differenceInDays(parseISO(urgentExam.exam_date), new Date())} days — high-frequency topics prioritised.
        </div>
      )}

      <div className="flex-1 rounded-2xl border border-border overflow-hidden bg-background/30">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ type: "smoothstep" }}
        >
          <Background gap={24} size={1} color="hsl(var(--border))" />
          <Controls className="!bg-card !border-border [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground" />
          <MiniMap
            className="!bg-card !border-border"
            nodeColor={(n) => {
              const d = n.data as unknown as NodeData;
              if (d.isCore || n.id === "core") return "hsl(var(--primary))";
              if (d.subject) return `hsl(${SUBJECT_HSL[d.subject]})`;
              return "hsl(var(--muted))";
            }}
            maskColor="hsl(var(--background) / 0.7)"
          />
        </ReactFlow>
      </div>

      <Sheet open={!!activeNode} onOpenChange={(o) => !o && setActiveNode(null)}>
        <SheetContent className="overflow-y-auto">
          {activeNode && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2 mb-2">
                  {activeNode.subject && (
                    <Badge
                      style={{
                        background: `hsl(${SUBJECT_HSL[activeNode.subject as SubjectCode]} / 0.2)`,
                        color: `hsl(${SUBJECT_HSL[activeNode.subject as SubjectCode]})`,
                        border: `1px solid hsl(${SUBJECT_HSL[activeNode.subject as SubjectCode]} / 0.5)`,
                      }}
                    >
                      {SUBJECTS[activeNode.subject as SubjectCode]?.name}
                    </Badge>
                  )}
                  <Badge variant="outline">{activeNode.unit_code ?? `U${activeNode.unit_number}`}</Badge>
                  <Badge variant="secondary">{activeNode.node_type}</Badge>
                </div>
                <SheetTitle>{activeNode.topic_name ?? "Session"}</SheetTitle>
                <SheetDescription>{activeNode.why_now_text}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-3">
                {activeNode.status === "complete" && (
                  <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Completed — open to review.
                  </div>
                )}

                {(() => {
                  const noteKey = activeNode.subject && activeNode.topic_name
                    ? `${activeNode.subject}::${activeNode.unit_number ?? ""}::${activeNode.topic_name.toLowerCase()}`
                    : "";
                  const hasNotes = notesSet.has(noteKey);
                  return hasNotes && (
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Personalised from your notes.
                    </div>
                  );
                })()}

                <Button onClick={startSession} className="w-full" size="lg">
                  <Play className="w-4 h-4" /> {activeNode.status === "complete" ? "Review session" : "Start session"}
                </Button>

                <Button onClick={() => handleMarkWeak(activeNode)} variant="outline" className="w-full">
                  <AlertTriangle className="w-4 h-4" />
                  {(() => {
                    const k = activeNode.subject && activeNode.topic_name
                      ? `${activeNode.subject}::${activeNode.unit_number ?? ""}::${activeNode.topic_name.toLowerCase()}`
                      : "";
                    return weakSet.has(k) ? "Unmark weak topic" : "Mark as weak topic";
                  })()}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function RoadmapCanvas(props: Props) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
