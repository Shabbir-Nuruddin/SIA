/**
 * NotesVisualRenderer — Notebook edition.
 * Renders AI-generated revision notes as if they were a vibrant student notebook:
 * lined paper, sticky-note headers, highlighter chips, index-card definitions,
 * blackboard equations, and a 3D-flip flashcard deck.
 */

import { useState, useMemo } from "react";
import {
  ChevronDown, ChevronUp, Zap, Target, AlertTriangle, BookOpen,
  Hash, Lightbulb, Star, Sparkles, FlaskConical, Atom, Dna, Sigma,
  PencilLine, Eye, RotateCcw,
} from "lucide-react";
import { type NotesVisualMap } from "@/lib/wikimediaVisuals";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from "recharts";


// ─── Types ────────────────────────────────────────────────────────────────────
interface KeyDef    { term: string; mark_scheme: string; plain_english?: string; common_mistake?: string; }
interface CoreItem  { statement: string; worked_example?: string; wrong_approach?: string; typical_marks?: number; }
interface Rxn       { reaction: string; conditions?: string; observation?: string; type?: string; }
interface EqVar     { symbol: string; meaning: string; unit: string; }
interface EqItem    { equation: string; variables: EqVar[]; worked_substitution?: string; }
interface TipItem   { command_word?: string; tip: string; }
interface Flashcard { q: string; a: string; }
interface VisualSummary { kind: string; caption: string; content: string; }
interface RefTable  { title: string; headers: string[]; rows: string[][]; caption?: string; }
interface GraphCurve { label?: string; points: { x: number; y: number }[]; }
export interface Graph { title?: string; x_label?: string; y_label?: string; curves: GraphCurve[]; caption?: string; }

export interface NotesData {
  overview: string;
  key_definitions: KeyDef[];
  core_content: CoreItem[];
  reactions?: Rxn[];
  equations: EqItem[];
  graphs?: Graph[];
  visual_summary: VisualSummary | null;
  examiner_tips: TipItem[];
  flashcards: Flashcard[];
  reference_tables?: RefTable[];
}

interface Props {
  notes: NotesData;
  topic: string;
  subject: string;
  unitLabel: string;
  formatHtml: (s: string) => string;
  renderMath: (s: string) => string;
  annotate: (s: string) => string;
  mode?: "long" | "short";
  visuals?: NotesVisualMap | null;
}

// ─── Vibrant rotating palette ─────────────────────────────────────────────────
const ACCENTS = [
  { name: "amber",  rail: "border-amber-400",  chip: "bg-amber-200 text-amber-950",  soft: "bg-amber-50 dark:bg-amber-950/30",  ring: "ring-amber-400",  dot: "bg-amber-400",  hl: "highlighter" },
  { name: "rose",   rail: "border-rose-400",   chip: "bg-rose-200 text-rose-950",     soft: "bg-rose-50 dark:bg-rose-950/30",    ring: "ring-rose-400",   dot: "bg-rose-400",   hl: "highlighter-pink" },
  { name: "sky",    rail: "border-sky-400",    chip: "bg-sky-200 text-sky-950",       soft: "bg-sky-50 dark:bg-sky-950/30",      ring: "ring-sky-400",    dot: "bg-sky-400",    hl: "highlighter-blue" },
  { name: "violet", rail: "border-violet-400", chip: "bg-violet-200 text-violet-950", soft: "bg-violet-50 dark:bg-violet-950/30", ring: "ring-violet-400", dot: "bg-violet-400", hl: "highlighter-purple" },
  { name: "teal",   rail: "border-teal-400",   chip: "bg-teal-200 text-teal-950",     soft: "bg-teal-50 dark:bg-teal-950/30",    ring: "ring-teal-400",   dot: "bg-teal-400",   hl: "highlighter-green" },
  { name: "orange", rail: "border-orange-400", chip: "bg-orange-200 text-orange-950", soft: "bg-orange-50 dark:bg-orange-950/30", ring: "ring-orange-400", dot: "bg-orange-400", hl: "highlighter-orange" },
];

const STICKY_VARIANTS = ["", "pink", "blue", "green", "purple"];

const SUBJECT_META: Record<string, { emoji: string; icon: any; tint: string }> = {
  chemistry:   { emoji: "🧪", icon: FlaskConical, tint: "from-violet-300/60 to-rose-300/60" },
  biology:     { emoji: "🧬", icon: Dna,          tint: "from-emerald-300/60 to-teal-300/60" },
  physics:     { emoji: "⚛️", icon: Atom,         tint: "from-sky-300/60 to-amber-300/60" },
  mathematics: { emoji: "📐", icon: Sigma,        tint: "from-amber-300/60 to-rose-300/60" },
  maths:       { emoji: "📐", icon: Sigma,        tint: "from-amber-300/60 to-rose-300/60" },
  math:        { emoji: "📐", icon: Sigma,        tint: "from-amber-300/60 to-rose-300/60" },
};

const subjectMeta = (subjectName: string) => {
  const k = subjectName.toLowerCase();
  for (const key of Object.keys(SUBJECT_META)) if (k.includes(key)) return SUBJECT_META[key];
  return { emoji: "📚", icon: BookOpen, tint: "from-amber-200/60 to-sky-200/60" };
};

// ─── Sticky badge ─────────────────────────────────────────────────────────────

const Sticky = ({ children, variant = "" as string, className = "" }) => (
  <div className={`sticky-note ${variant} px-3 py-1.5 rounded-md text-sm font-bold animate-sticky-in ${className}`}>
    {children}
  </div>
);

// ─── Section header — washi tape strip ────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle, accent, n }: { icon: React.ReactNode; title: string; subtitle?: string; accent: typeof ACCENTS[0]; n: number }) => (
  <div className="relative mb-5 mt-2">
    <div className="washi-tape h-3 w-32 absolute -top-1 left-6 rounded-sm" style={{ transform: "rotate(-2deg)" }} />
    <div className="flex items-end gap-3 pt-4 pl-2 border-b-2 border-dashed border-foreground/15 pb-2">
      <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold ${accent.chip} shadow-sm`}>
        {n}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-foreground/70">{icon}</span>
        <h3 className="font-handwritten text-3xl font-bold leading-none tracking-tight">{title}</h3>
      </div>
      {subtitle && <span className="text-xs text-muted-foreground italic ml-2 mb-1">{subtitle}</span>}
    </div>
  </div>
);

// ─── Overview — ZNotes/SME-style revision summary (## sub-topics + bullets) ──
// The overview text is a structured summary: "## Sub-topic" headings followed by
// "- fact" bullets. formatHtml turns these into <h2>/<ul><li>/<strong>/KaTeX, so
// we render the whole thing once and style the elements as a clean revision sheet.
// (No drop-caps, no "Introduction" framing — this IS the teaching content.)
const OverviewSection = ({ text, formatHtml, annotate }: { text: string; formatHtml: (s:string)=>string; annotate: (s:string)=>string }) => (
  <div
    className={[
      "rounded-xl bg-card border border-foreground/10 shadow-sm px-6 py-5",
      "[&_h1]:hidden",
      "[&_h2]:font-handwritten [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground",
      "[&_h2]:mt-6 [&_h2]:mb-2.5 [&_h2]:first:mt-0 [&_h2]:pb-1.5",
      "[&_h2]:border-b-2 [&_h2]:border-dashed [&_h2]:border-foreground/15",
      "[&_h3]:font-bold [&_h3]:text-lg [&_h3]:text-foreground/90 [&_h3]:mt-4 [&_h3]:mb-1.5",
      "[&_ul]:list-none [&_ul]:space-y-2 [&_ul]:my-2.5 [&_ul]:pl-0.5",
      "[&_li]:relative [&_li]:pl-5 [&_li]:text-[15px] [&_li]:leading-[1.7] [&_li]:text-foreground/90",
      "[&_li]:before:content-['▸'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-0 [&_li]:before:text-amber-500 [&_li]:before:font-bold",
      "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-2.5 [&_ol]:marker:font-bold [&_ol]:marker:text-amber-600",
      "[&_ol_li]:text-[15px] [&_ol_li]:leading-[1.7] [&_ol_li]:text-foreground/90",
      "[&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-foreground/90 [&_p]:my-2.5",
      "[&_strong]:font-bold [&_strong]:text-foreground",
      "[&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-foreground/[0.06] [&_code]:text-[13px]",
    ].join(" ")}
    dangerouslySetInnerHTML={{ __html: annotate(formatHtml(text)) }}
  />
);

// ─── Definitions — index-card grid ────────────────────────────────────────────
const DefinitionsSection = ({
  defs,
  formatHtml,
  defVisuals,
  expandAll = false,
}: {
  defs: KeyDef[];
  formatHtml: (s: string) => string;
  defVisuals?: Record<number, { imageUrl: string; title: string }>;
  expandAll?: boolean;
}) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
      {defs.map((d, i) => {
        const a = ACCENTS[i % ACCENTS.length];
        const open = expanded === i;
        const defImg = defVisuals?.[i];
        return (
          <div
            key={i}
            className={`relative rounded-xl bg-card border border-foreground/10 shadow-sm hover:shadow-md transition-all overflow-hidden`}
          >
            <div className={`h-1.5 ${a.dot}`} />
            {/* Definition image (when available) */}
            {defImg && (
              <div className="overflow-hidden" style={{ maxHeight: "120px" }}>
                <img
                  src={defImg.imageUrl}
                  alt={`Diagram for ${defImg.title}`}
                  className="w-full object-cover object-center"
                  style={{ maxHeight: "120px" }}
                  loading="lazy"
                  onError={(e) => { const c = (e.target as HTMLImageElement).parentElement; if (c) c.style.display = "none"; }}
                />
              </div>
            )}
            <div className="p-4">
              <div className="mb-2">
                <span className={`font-handwritten text-2xl font-bold ${a.hl} px-1.5 inline-block`}
                  dangerouslySetInnerHTML={{ __html: formatHtml(d.term) }} />
              </div>
              {d.plain_english && (
                <p className="text-sm text-foreground/80 leading-relaxed mb-2"
                   dangerouslySetInnerHTML={{ __html: formatHtml(d.plain_english) }} />
              )}
              <div className="text-xs text-muted-foreground italic mb-3 leading-relaxed border-l-2 border-foreground/15 pl-2"
                   dangerouslySetInnerHTML={{ __html: `<strong class="not-italic text-foreground/70">Mark scheme:</strong> ${formatHtml(d.mark_scheme)}` }} />

              {d.common_mistake && !expandAll && (
                <button
                  onClick={() => setExpanded(open ? null : i)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-orange-200 text-orange-900 hover:bg-orange-300 transition-colors"
                >
                  <AlertTriangle className="h-3 w-3" /> Watch out
                  {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              )}
              {(open || expandAll) && d.common_mistake && (
                <div className="mt-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-3 text-xs text-foreground/90 animate-fade-in"
                     dangerouslySetInnerHTML={{ __html: formatHtml(d.common_mistake) }} />
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

// ─── Core Content — numbered cards with thick coloured rail ───────────────────
const CoreContentSection = ({ items, formatHtml, annotate, expandAll = false }: { items: CoreItem[]; formatHtml:(s:string)=>string; annotate:(s:string)=>string; expandAll?: boolean }) => {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setExpanded(prev => {
    const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n;
  });
  return (
    <div className="space-y-3">
      {items.map((c, i) => {
        const a = ACCENTS[i % ACCENTS.length];
        const open = expandAll || expanded.has(i);
        // In Long Notes (expandAll), always treat the item as expandable so the
        // worked-example section renders even if the AI returned empty strings.
        const hasExtra = expandAll || !!(c.worked_example || c.wrong_approach);
        return (
          <div key={i} className={`rounded-xl bg-card border-l-[6px] ${a.rail} border-y border-r border-foreground/10 shadow-sm overflow-hidden`}>
            <button
              onClick={() => !expandAll && hasExtra && toggle(i)}
              className={`w-full flex items-start gap-3 p-4 text-left ${hasExtra && !expandAll ? "hover:bg-foreground/5 cursor-pointer" : "cursor-default"}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-extrabold ${a.chip} shadow-sm`}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium leading-snug" dangerouslySetInnerHTML={{ __html: annotate(formatHtml(c.statement)) }} />
                {typeof c.typical_marks === "number" && c.typical_marks > 0 && (
                  <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${a.chip}`}>
                    {c.typical_marks} mark{c.typical_marks !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {hasExtra && !expandAll && (open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />)}
            </button>
            {open && hasExtra && (
              <div className="px-4 pb-4 space-y-3 animate-fade-in">
                {c.worked_example ? (
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-400 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mb-1.5">
                      <PencilLine className="h-3 w-3" /> Worked example
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90"
                       dangerouslySetInnerHTML={{ __html: annotate(formatHtml(c.worked_example)) }} />
                  </div>
                ) : expandAll ? (
                  <div className="rounded-lg bg-emerald-50/40 dark:bg-emerald-950/15 border border-dashed border-emerald-300/60 p-3 text-[11px] text-muted-foreground italic">
                    No worked example in cached notes — click Regenerate to get a full Long Notes version.
                  </div>
                ) : null}
                {c.wrong_approach && (
                  <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-400 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300 mb-1.5">
                      <AlertTriangle className="h-3 w-3" /> Wrong approach
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/85"
                       dangerouslySetInnerHTML={{ __html: formatHtml(c.wrong_approach) }} />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Reactions — equation cards with conditions + observation ─────────────────
const ReactionsSection = ({ reactions, formatHtml }: { reactions: Rxn[]; formatHtml:(s:string)=>string }) => (
  <div className="space-y-3">
    {reactions.map((r, i) => {
      const a = ACCENTS[i % ACCENTS.length];
      return (
        <div key={i} className={`rounded-xl bg-card border-l-[6px] ${a.rail} border-y border-r border-foreground/10 shadow-sm overflow-hidden`}>
          <div className="p-4">
            <div className="flex items-start gap-2 flex-wrap">
              {r.type && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${a.chip}`}>
                  {r.type}
                </span>
              )}
              <div className="flex-1 min-w-0 font-mono text-[15px] leading-relaxed text-foreground/90 break-words"
                   dangerouslySetInnerHTML={{ __html: formatHtml(r.reaction) }} />
            </div>
            {(r.conditions || r.observation) && (
              <div className="mt-2.5 space-y-1.5">
                {r.conditions && (
                  <div className="text-sm text-foreground/75">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground mr-1.5">Conditions</span>
                    <span dangerouslySetInnerHTML={{ __html: formatHtml(r.conditions) }} />
                  </div>
                )}
                {r.observation && (
                  <div className="flex items-start gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 px-3 py-1.5 text-sm text-foreground/90">
                    <Eye className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span dangerouslySetInnerHTML={{ __html: formatHtml(r.observation) }} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Equations — chalkboard cards ─────────────────────────────────────────────
const EquationsSection = ({ eqs, renderMath, formatHtml }: { eqs: EqItem[]; renderMath:(s:string)=>string; formatHtml:(s:string)=>string }) => (
  <div className="grid md:grid-cols-2 gap-4">
    {eqs.map((e, i) => {
      const a = ACCENTS[i % ACCENTS.length];
      const raw = String(e.equation ?? "").trim();
      const mathStr = raw && !/\$/.test(raw) ? `$${raw}$` : raw;
      return (
        <div key={i} className="rounded-xl overflow-hidden shadow-md border-2 border-foreground/15 bg-[hsl(150_25%_12%)]">
          <div className="p-5 text-center">
            <div className="text-amber-300 text-2xl font-serif"
                 style={{ textShadow: "0 1px 0 rgba(255,255,255,0.08)" }}
                 dangerouslySetInnerHTML={{ __html: renderMath(mathStr) }} />
          </div>
          <div className="bg-card p-4 space-y-2">
            {e.variables.map((v, j) => {
              const meaning = String(v.meaning ?? "").replace(/\{?\s*meaning\s*:?\s*\}?/gi, "").trim();
              const unit = String(v.unit ?? "").replace(/^[\s({]+|[\s)}]+$/g, "").trim();
              return (
                <div key={j} className="flex items-baseline gap-2 text-sm flex-wrap">
                  <span className={`inline-flex items-center justify-center min-w-[36px] px-2 py-0.5 rounded font-bold ${a.chip}`}
                        dangerouslySetInnerHTML={{ __html: renderMath(v.symbol) }} />
                  <span className="text-muted-foreground">=</span>
                  <span className="text-foreground/85" dangerouslySetInnerHTML={{ __html: renderMath(meaning) }} />
                  {unit && <span className="text-xs text-muted-foreground font-mono">[{unit}]</span>}
                </div>
              );
            })}
            {e.worked_substitution && (
              <div className="mt-3 pt-3 border-t border-dashed border-foreground/15">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Substitution</div>
                <p className="text-sm leading-relaxed font-mono text-foreground/90" dangerouslySetInnerHTML={{ __html: formatHtml(e.worked_substitution) }} />
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Graphs — rendered from data (accurate, never AI images) ──────────────────
const GRAPH_COLORS = ["#6366f1", "#ec4899", "#14b8a6", "#f59e0b"];
const GraphsSection = ({ graphs }: { graphs: Graph[] }) => (
  <div className="space-y-6">
    {graphs.map((g, gi) => {
      // Keep only curves with ≥2 finite points so we never render a broken axis.
      const curves = (g.curves || [])
        .map((c) => ({
          label: c.label || "",
          points: (c.points || [])
            .map((p) => ({ x: Number(p.x), y: Number(p.y) }))
            .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
            .slice(0, 120),
        }))
        .filter((c) => c.points.length >= 2);
      if (curves.length === 0) return null;
      return (
        <figure key={gi} className="rounded-2xl border border-border/60 bg-background-elevated p-4 shadow-sm">
          {g.title && <figcaption className="text-sm font-bold mb-3 text-foreground/90">{g.title}</figcaption>}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 8, right: 20, bottom: 26, left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" opacity={0.4} />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" opacity={0.4} />
                <XAxis
                  type="number" dataKey="x" allowDecimals
                  stroke="hsl(var(--muted-foreground))" fontSize={11}
                  label={g.x_label ? { value: g.x_label, position: "insideBottom", offset: -14, fontSize: 11, fill: "hsl(var(--muted-foreground))" } : undefined}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))" fontSize={11}
                  label={g.y_label ? { value: g.y_label, angle: -90, position: "insideLeft", fontSize: 11, fill: "hsl(var(--muted-foreground))" } : undefined}
                />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  labelFormatter={(v) => `${g.x_label || "x"}: ${v}`}
                />
                {curves.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
                {curves.map((c, ci) => (
                  <Line
                    key={ci} data={c.points} dataKey="y" name={c.label || `Series ${ci + 1}`}
                    stroke={GRAPH_COLORS[ci % GRAPH_COLORS.length]} strokeWidth={2}
                    dot={false} type="monotone" isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {g.caption && <figcaption className="text-xs text-muted-foreground mt-2 text-center">{g.caption}</figcaption>}
        </figure>
      );
    })}
  </div>
);

// ─── Visual Summary ───────────────────────────────────────────────────────────
const VisualSection = ({ vs, renderMath }: { vs: VisualSummary; renderMath:(s:string)=>string }) => (
  <div className="rounded-xl bg-card border-2 border-dashed border-foreground/20 overflow-hidden">
    {vs.caption && (
      <div className="px-4 py-2 bg-amber-100/60 dark:bg-amber-900/30 font-handwritten text-lg text-foreground border-b-2 border-dashed border-foreground/15">
        ✏️ {vs.caption}
      </div>
    )}
    <div className="p-5 overflow-x-auto [&_table]:w-full [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:bg-amber-200/40 [&_th]:font-bold [&_tr:nth-child(even)]:bg-foreground/[0.03] [&_table]:text-sm [&_table]:rounded-lg [&_svg]:max-w-full [&_svg]:mx-auto"
         dangerouslySetInnerHTML={{ __html: renderMath(vs.content) }} />
  </div>
);

// ─── Examiner Tips — horizontal cards with command-word badge ─────────────────
const ExaminerTipsSection = ({ tips, formatHtml }: { tips: TipItem[]; formatHtml:(s:string)=>string }) => (
  <div className="grid sm:grid-cols-2 gap-4">
    {tips.map((t, i) => {
      const a = ACCENTS[i % ACCENTS.length];
      return (
        <div key={i} className="relative rounded-xl bg-card border border-foreground/10 shadow-sm hover:shadow-md transition-all overflow-hidden">
          <div className={`h-1.5 ${a.dot}`} />
          <div className="p-4">
            {t.command_word && (
              <div className="mb-3">
                <span className={`font-handwritten text-2xl font-bold ${a.hl} px-1.5 inline-block`}>
                  {t.command_word}
                </span>
              </div>
            )}
            <div className="text-sm leading-relaxed text-foreground/90"
                 dangerouslySetInnerHTML={{ __html: formatHtml(t.tip) }} />
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Reference Tables — colour-coded exam data tables ─────────────────────────
const ReferenceTablesSection = ({ tables }: { tables: RefTable[] }) => (
  <div className="space-y-6">
    {tables.map((table, ti) => {
      const a = ACCENTS[ti % ACCENTS.length];
      return (
        <div key={ti} className="rounded-xl overflow-hidden border border-foreground/10 shadow-sm">
          {/* Table header */}
          <div className={`px-4 py-2.5 ${a.soft} border-b border-foreground/10 flex items-center gap-2`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${a.chip}`}>
              {ti + 1}
            </span>
            <span className="font-semibold text-sm text-foreground/90">{table.title}</span>
          </div>
          {/* Table body */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`${a.soft} border-b border-foreground/10`}>
                  {table.headers.map((h, hi) => (
                    <th key={hi} className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-foreground/70 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {table.rows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-foreground/[0.03] transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-3 py-2 text-sm leading-snug ${ci === 0 ? "font-semibold text-foreground/90" : "text-foreground/75"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Caption */}
          {table.caption && (
            <div className="px-4 py-2 text-[11px] text-muted-foreground italic border-t border-foreground/5">
              {table.caption}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ─── Flashcards — true 3D flip deck ───────────────────────────────────────────
const FlashcardsSection = ({ cards, formatHtml }: { cards: Flashcard[]; formatHtml:(s:string)=>string }) => {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="text-center py-8 rounded-xl bg-gradient-to-br from-amber-100/60 to-rose-100/60 dark:from-amber-950/20 dark:to-rose-950/20 border-2 border-dashed border-foreground/20">
        <div className="font-handwritten text-3xl mb-2">Ready to revise?</div>
        <div className="flex justify-center gap-1.5 flex-wrap mb-4 max-w-xs mx-auto">
          {cards.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${ACCENTS[i % ACCENTS.length].dot}`} />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-5">{cards.length} flashcards in this deck</p>
        <button
          onClick={() => { setStarted(true); setIdx(0); setFlipped(false); }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition shadow-lg"
        >
          <Sparkles className="h-4 w-4" /> Start flashcards
        </button>
      </div>
    );
  }

  const card = cards[idx];
  const a = ACCENTS[idx % ACCENTS.length];

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-muted-foreground">{idx + 1} / {cards.length}</span>
        <button onClick={() => { setStarted(false); setIdx(0); setFlipped(false); }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-3 w-3" /> Restart
        </button>
      </div>
      <div className="flip-card h-56" onClick={() => setFlipped(f => !f)}>
        <div className={`flip-card-inner ${flipped ? "" : ""}`} style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}>
          {/* FRONT — question on coloured background */}
          <div className={`flip-face ${a.soft} border-2 ${a.rail} rounded-2xl shadow-md flex flex-col items-center justify-center p-6 cursor-pointer`}>
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 px-2 py-0.5 rounded-full ${a.chip}`}>Question</div>
            <p className="font-handwritten text-2xl text-center leading-tight text-foreground/90 max-w-md"
               dangerouslySetInnerHTML={{ __html: formatHtml(card.q) }} />
            <div className="text-[10px] text-muted-foreground mt-4 italic">tap to flip</div>
          </div>
          {/* BACK — answer on lighter background */}
          <div className="flip-face back bg-card border-2 border-foreground/20 rounded-2xl shadow-md flex flex-col items-center justify-center p-6 cursor-pointer">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3 px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950">Answer</div>
            <p className="text-base text-center leading-relaxed text-foreground/90 max-w-md"
               dangerouslySetInnerHTML={{ __html: formatHtml(card.a) }} />
            <div className="text-[10px] text-muted-foreground mt-4 italic">tap to flip back</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => { setIdx(i => Math.max(0, i - 1)); setFlipped(false); }}
          disabled={idx === 0}
          className="px-4 py-1.5 rounded-lg border border-foreground/15 text-sm font-medium disabled:opacity-40 hover:bg-foreground/5"
        >← Prev</button>
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); setFlipped(false); }}
              className={`w-2 h-2 rounded-full transition-all ${i === idx ? a.dot + " scale-150" : "bg-muted"}`}
            />
          ))}
        </div>
        <button
          onClick={() => { setIdx(i => Math.min(cards.length - 1, i + 1)); setFlipped(false); }}
          disabled={idx === cards.length - 1}
          className="px-4 py-1.5 rounded-lg border border-foreground/15 text-sm font-medium disabled:opacity-40 hover:bg-foreground/5"
        >Next →</button>
      </div>
    </div>
  );
};

// ─── Long-mode: expanded DefinitionsSection ───────────────────────────────────
// In Long Notes mode all definitions show every field without needing a click.

// ─── Main renderer ────────────────────────────────────────────────────────────
export default function NotesVisualRenderer({ notes, topic, subject, unitLabel, formatHtml, renderMath, annotate, mode = "short", visuals }: Props) {
  const meta = useMemo(() => subjectMeta(subject), [subject]);
  const isLong = mode === "long";
  const overviewImg = visuals?.overviewImage ?? null;

  const sections = useMemo(() => {
    const out: Array<{ id: string; title: string; icon: React.ReactNode; content: React.ReactNode }> = [];

    // Short Notes AND Long Notes both show all sections.
    // In Long Notes every card is pre-expanded (expandAll=true).
    if (notes.overview) out.push({ id: "overview", title: "Overview", icon: <BookOpen className="h-5 w-5" />, content: <OverviewSection text={notes.overview} formatHtml={formatHtml} annotate={annotate} /> });
    if (notes.key_definitions.length) out.push({ id: "defs", title: "Definitions", icon: <Hash className="h-5 w-5" />, content: <DefinitionsSection defs={notes.key_definitions} formatHtml={formatHtml} defVisuals={visuals?.definitions} expandAll={isLong} /> });
    if (notes.core_content.length) out.push({ id: "core", title: "Core Content", icon: <Target className="h-5 w-5" />, content: <CoreContentSection items={notes.core_content} formatHtml={formatHtml} annotate={annotate} expandAll={isLong} /> });
    if (notes.reactions?.length) out.push({ id: "reactions", title: "Reactions", icon: <FlaskConical className="h-5 w-5" />, content: <ReactionsSection reactions={notes.reactions} formatHtml={formatHtml} /> });
    if (notes.equations.length) out.push({ id: "eqs", title: "Equations", icon: <Zap className="h-5 w-5" />, content: <EquationsSection eqs={notes.equations} renderMath={renderMath} formatHtml={formatHtml} /> });
    // Graphs removed: AI-generated graph data was inaccurate. Re-enable only with
    // expert-authored graph data per topic. (GraphsSection kept but not rendered.)
    if (notes.visual_summary?.content) out.push({ id: "visual", title: "Visual Summary", icon: <Eye className="h-5 w-5" />, content: <VisualSection vs={notes.visual_summary} renderMath={renderMath} /> });
    if (notes.examiner_tips.length) out.push({ id: "tips", title: "Examiner Tips", icon: <Lightbulb className="h-5 w-5" />, content: <ExaminerTipsSection tips={notes.examiner_tips} formatHtml={formatHtml} /> });
    if (notes.reference_tables?.length) out.push({ id: "ref", title: "Quick Reference", icon: <Eye className="h-5 w-5" />, content: <ReferenceTablesSection tables={notes.reference_tables} /> });
    if (notes.flashcards.length) out.push({ id: "flash", title: "Flashcards", icon: <Star className="h-5 w-5" />, content: <FlashcardsSection cards={notes.flashcards} formatHtml={formatHtml} /> });
    return out;
  }, [notes, formatHtml, annotate, renderMath, isLong, visuals]);

  return (
    <div className="space-y-8">
      {/* ── Topic banner ─────────────────────────────────────────────────── */}
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${meta.tint} border border-foreground/10 shadow-sm`}>
        <div className="washi-tape h-4 w-40 absolute -top-1 right-8 rounded-sm z-10" style={{ transform: "rotate(3deg)" }} />

        {/* Overview image — shown when available */}
        {overviewImg && (
          <div className="relative w-full overflow-hidden" style={{ maxHeight: "220px" }}>
            <img
              src={overviewImg.imageUrl}
              alt={`${topic} — scientific diagram`}
              className="w-full object-cover object-center"
              style={{ maxHeight: "220px" }}
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
          </div>
        )}

        <div className="p-7">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{meta.emoji}</span>
            <div className="font-marker text-sm uppercase tracking-widest text-foreground/70">
              {subject} · {unitLabel}
            </div>
          </div>
          <h2 className="font-handwritten text-5xl md:text-6xl font-bold leading-[1.05] text-foreground">
            {topic}
          </h2>
          {/* Quick-nav pills */}
          <div className="flex gap-2 mt-5 flex-wrap">
            {sections.map((s, i) => {
              const a = ACCENTS[i % ACCENTS.length];
              return (
                <a key={s.id} href={`#notes-${s.id}`}
                   className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${a.chip} hover:scale-105 transition-transform shadow-sm`}>
                  <span className="opacity-70">{s.icon}</span>
                  {s.title}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Sections, each on its own notebook page ─────────────────────── */}
      {sections.map((s, i) => {
        const a = ACCENTS[i % ACCENTS.length];
        return (
          <section key={s.id} id={`notes-${s.id}`} className="scroll-mt-6">
            <SectionHeader icon={s.icon} title={s.title} accent={a} n={i + 1} />
            <div className="pl-2">{s.content}</div>
          </section>
        );
      })}

    </div>
  );
}
