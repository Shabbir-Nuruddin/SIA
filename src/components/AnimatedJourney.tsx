import { useMemo, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Repeat, FileText, Coffee, Lock, CheckCircle2,
  GraduationCap, Flag, Sparkles, Zap, Trophy,
} from "lucide-react";
import { differenceInDays, parseISO, format } from "date-fns";
import type { RoadmapNodeRow, NodeType } from "@/lib/roadmapNodes";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";

interface Props {
  nodes: RoadmapNodeRow[];
  exam: { subject: SubjectCode | null; exam_date: string; name: string } | null;
  onChallenge?: (node: RoadmapNodeRow) => void;
}

// Visual tokens per node type — Emerald Prestige palette
const NODE_STYLES: Record<NodeType, { color: string; ring: string; Icon: typeof BookOpen; label: string }> = {
  learn:  { color: "hsl(160, 60%, 50%)",  ring: "hsl(160, 60%, 50%, 0.35)",  Icon: BookOpen, label: "Learn" },
  review: { color: "hsl(43, 80%, 60%)",   ring: "hsl(43, 80%, 60%, 0.35)",   Icon: Repeat,   label: "Review" },
  mock:   { color: "hsl(12, 70%, 60%)",   ring: "hsl(12, 70%, 60%, 0.35)",   Icon: FileText, label: "Mock" },
  break:  { color: "hsl(200, 70%, 60%)",  ring: "hsl(200, 70%, 60%, 0.35)",  Icon: Coffee,   label: "Break" },
};

// Compute zigzag positions along a sinusoidal column — wider for full-bleed
function computePositions(count: number, width: number, rowGap = 150, padTop = 110) {
  const cx = width / 2;
  const amp = Math.min(280, width * 0.38);
  return Array.from({ length: count }, (_, i) => {
    const y = padTop + i * rowGap;
    const x = cx + Math.sin(i * 0.85) * amp;
    return { x, y, i };
  });
}

// Build a smooth SVG path through points
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const cy = (a.y + b.y) / 2;
    d += ` C ${a.x} ${cy}, ${b.x} ${cy}, ${b.x} ${b.y}`;
  }
  return d;
}

export const AnimatedJourney = ({ nodes, exam, onChallenge }: Props) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const positions = useMemo(() => computePositions(nodes.length, width), [nodes.length, width]);
  const path = useMemo(() => smoothPath(positions), [positions]);

  // Current active node index
  const activeIdx = useMemo(() => {
    const i = nodes.findIndex(n => n.status === "in_progress" || n.status === "unlocked");
    return i === -1 ? nodes.length - 1 : i;
  }, [nodes]);

  const completedCount = nodes.filter(n => n.status === "complete").length;
  const progressPct = nodes.length ? completedCount / nodes.length : 0;

  // Total svg height
  const totalHeight = (positions.at(-1)?.y ?? 0) + 220;

  // Path through completed nodes (for progress fill)
  const completedPath = useMemo(() => {
    const upto = Math.max(0, completedCount);
    if (upto < 2) return "";
    return smoothPath(positions.slice(0, upto));
  }, [positions, completedCount]);

  const avatarPos = positions[activeIdx] ?? positions[0];
  const daysToExam = exam ? Math.max(0, differenceInDays(parseISO(exam.exam_date), new Date())) : null;
  const examLabel = exam
    ? (exam.subject ? SUBJECTS[exam.subject].name : exam.name)
    : null;

  const handleNodeClick = (node: RoadmapNodeRow) => {
    if (node.status === "locked") return;
    setOpenId(openId === node.id ? null : node.id);
  };

  const handleAction = (node: RoadmapNodeRow) => {
    if (node.node_type === "learn") {
      navigate(`/roadmap/topic/${node.id}/notes`);
    } else if (node.node_type === "review") {
      navigate(`/questions?subject=${node.subject}&unit=${node.unit_number}&topic=${encodeURIComponent(node.topic_name ?? "")}&node=${node.id}`);
    } else if (node.node_type === "mock") {
      navigate(`/mock-papers/new?subject=${node.subject}&unit=${node.unit_number}`);
    }
  };

  if (nodes.length === 0) return null;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Glow backdrop — emerald + gold */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 10%, hsl(160 60% 30% / 0.25), transparent 55%), radial-gradient(ellipse at 70% 80%, hsl(43 70% 50% / 0.18), transparent 60%)",
        }}
      />

      {/* Start banner */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-[10px] font-mono uppercase tracking-[0.25em] gold-text">
          <Sparkles className="h-3 w-3" /> Your Journey Begins
        </div>
      </div>

      <svg width="100%" height={totalHeight} viewBox={`0 0 ${width} ${totalHeight}`} className="block">
        {/* Soft starfield dots */}
        <g opacity="0.35">
          {Array.from({ length: 30 }).map((_, i) => {
            const seed = (i * 9301 + 49297) % 233280;
            const sx = ((seed / 233280) * width);
            const sy = ((((i * 1103515245 + 12345) % 2147483648) / 2147483648) * totalHeight);
            return <circle key={i} cx={sx} cy={sy} r={0.9} fill="hsl(var(--foreground))" />;
          })}
        </g>

        {/* Base path */}
        <path
          d={path}
          stroke="hsl(var(--border))"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="2 10"
        />

        {/* Animated path draw */}
        <motion.path
          d={path}
          stroke="hsl(var(--muted-foreground) / 0.4)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />

        {/* Completed path overlay */}
        <AnimatePresence>
          {completedPath && (
            <motion.path
              key={completedPath}
              d={completedPath}
              stroke="url(#progressGradient)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        <defs>
          <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2={totalHeight} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="hsl(160, 60%, 50%)" />
            <stop offset="1" stopColor="hsl(43, 80%, 60%)" />
          </linearGradient>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos = positions[i];
          if (!pos) return null;
          const style = NODE_STYLES[node.node_type];
          const isLocked = node.status === "locked";
          const isComplete = node.status === "complete";
          const isCurrent = i === activeIdx && !isComplete;
          const r = isCurrent ? 30 : 26;

          return (
            <g
              key={node.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              style={{ cursor: isLocked ? "default" : "pointer" }}
              onClick={() => handleNodeClick(node)}
            >
              {/* Pulse ring on current */}
              {isCurrent && (
                <motion.circle
                  r={r + 6}
                  fill="none"
                  stroke={style.color}
                  strokeWidth="2"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              <motion.circle
                r={r}
                fill={isLocked ? "hsl(var(--muted))" : isComplete ? style.color : "hsl(var(--card))"}
                stroke={isLocked ? "hsl(var(--border))" : style.color}
                strokeWidth={isCurrent ? 3 : 2}
                filter={isCurrent ? "url(#nodeGlow)" : undefined}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: isLocked ? 0.5 : 1 }}
                transition={{ delay: 0.05 * Math.min(i, 12), type: "spring", stiffness: 180, damping: 14 }}
                whileHover={!isLocked ? { scale: 1.08 } : {}}
              />

              {/* Icon */}
              <foreignObject x={-12} y={-12} width={24} height={24} pointerEvents="none">
                <div className="flex items-center justify-center w-full h-full">
                  {isLocked ? (
                    <Lock className="h-4 w-4" style={{ color: "hsl(var(--muted-foreground))" }} />
                  ) : isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  ) : (
                    <style.Icon className="h-4 w-4" style={{ color: style.color }} />
                  )}
                </div>
              </foreignObject>

              {/* Label below */}
              <foreignObject x={-90} y={r + 4} width={180} height={48} pointerEvents="none">
                <div className="text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: isLocked ? "hsl(var(--muted-foreground))" : style.color }}>
                    {style.label}
                  </div>
                  <div className={`text-xs font-medium leading-tight mt-0.5 line-clamp-2 px-1 ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                    {node.topic_name || (node.node_type === "break" ? "Rest" : node.unit_name) || "Session"}
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Avatar springs along path */}
        {avatarPos && (
          <motion.g
            animate={{ x: avatarPos.x, y: avatarPos.y }}
            transition={{ type: "spring", stiffness: 90, damping: 15 }}
            initial={false}
          >
            <circle r="22" fill="hsl(var(--background))" stroke="hsl(43, 80%, 60%)" strokeWidth="2.5" filter="url(#nodeGlow)" />
            <foreignObject x={-12} y={-12} width={24} height={24}>
              <div className="flex items-center justify-center w-full h-full">
                <GraduationCap className="h-5 w-5" style={{ color: "hsl(43, 80%, 60%)" }} />
              </div>
            </foreignObject>
          </motion.g>
        )}

        {/* Goal flag at the end */}
        {positions.length > 0 && (() => {
          const last = positions[positions.length - 1];
          const gy = last.y + 110;
          return (
            <motion.g
              transform={`translate(${last.x}, ${gy})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <circle r="40" fill="hsl(var(--card))" stroke="hsl(43, 80%, 60%)" strokeWidth="2.5" filter="url(#nodeGlow)" />
              <foreignObject x={-22} y={-22} width={44} height={44} pointerEvents="none">
                <div className="flex items-center justify-center w-full h-full">
                  <Trophy className="h-8 w-8" style={{ color: "hsl(43, 80%, 60%)" }} />
                </div>
              </foreignObject>
              <foreignObject x={-120} y={46} width={240} height={56} pointerEvents="none">
                <div className="text-center">
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] gold-text">Goal · Exam Day</div>
                  <div className="text-sm font-semibold mt-1 font-display">
                    {examLabel ?? "Set your exam date"}
                  </div>
                  {daysToExam !== null && (
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {daysToExam === 0 ? "Today" : `${daysToExam} days · ${format(parseISO(exam!.exam_date), "d MMM")}`}
                    </div>
                  )}
                </div>
              </foreignObject>
            </motion.g>
          );
        })()}
      </svg>

      {/* Floating action panel for selected node */}
      <AnimatePresence>
        {openId && (() => {
          const node = nodes.find(n => n.id === openId);
          if (!node) return null;
          const pos = positions[nodes.indexOf(node)];
          if (!pos) return null;
          const style = NODE_STYLES[node.node_type];
          const meta = node.subject ? SUBJECTS[node.subject as SubjectCode] : null;

          return (
            <motion.div
              key={openId}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="absolute z-20 w-72 -translate-x-1/2"
              style={{ left: pos.x, top: pos.y + 70 }}
            >
              <div
                className="surface p-4 shadow-xl backdrop-blur"
                style={{ borderTop: `3px solid ${style.color}` }}
              >
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: style.color }}>
                  <style.Icon className="h-3 w-3" />
                  {style.label}
                  {meta && <span className="text-muted-foreground normal-case tracking-normal ml-auto">{meta.name}</span>}
                </div>
                <h4 className="text-sm font-semibold mb-1 leading-tight">
                  {node.topic_name || node.unit_name || "Session"}
                </h4>
                {node.why_now_text && (
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                    {node.why_now_text}
                  </p>
                )}
                <div className="flex gap-2">
                  {node.node_type !== "break" && (
                    <button
                      onClick={() => handleAction(node)}
                      className="flex-1 h-8 text-xs font-medium rounded-md text-white transition-transform hover:scale-[1.02]"
                      style={{ background: style.color }}
                    >
                      {node.node_type === "learn" ? "Begin" : node.node_type === "review" ? "Review" : "Start mock"}
                    </button>
                  )}
                  {node.node_type === "learn" && onChallenge && (
                    <button
                      onClick={() => onChallenge(node)}
                      className="h-8 px-2.5 text-xs font-medium rounded-md border border-accent/40 text-accent hover:bg-accent/10 transition-colors inline-flex items-center gap-1"
                      title="Skip notes — challenge me with hard AI questions"
                    >
                      <Zap className="h-3 w-3" /> Challenge
                    </button>
                  )}
                  <button
                    onClick={() => setOpenId(null)}
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Progress chip — sticky bottom */}
      <div className="sticky bottom-4 z-10 mt-6 flex justify-center pointer-events-none">
        <div className="pointer-events-auto inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/90 backdrop-blur border border-accent/30 shadow-[0_8px_30px_-8px_hsl(43_70%_50%/0.4)]">
          <Flag className="h-4 w-4 gold-text" />
          <div className="text-xs font-medium font-mono uppercase tracking-wider">
            {completedCount} / {nodes.length} · {Math.round(progressPct * 100)}%
          </div>
          <div className="w-28 h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full"
              style={{ background: "linear-gradient(90deg, hsl(160, 60%, 50%), hsl(43, 80%, 60%))" }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
