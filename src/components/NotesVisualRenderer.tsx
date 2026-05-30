/**
 * NotesVisualRenderer — Notebook edition.
 * Renders AI-generated revision notes as if they were a vibrant student notebook:
 * lined paper, sticky-note headers, highlighter chips, index-card definitions,
 * blackboard equations, and a 3D-flip flashcard deck.
 */

import { useState, useMemo, useEffect } from "react";
import {
  ChevronDown, ChevronUp, Zap, Target, AlertTriangle, BookOpen,
  Hash, Lightbulb, Star, Sparkles, FlaskConical, Atom, Dna, Sigma,
  PencilLine, Eye, RotateCcw,
} from "lucide-react";


// ─── Types ────────────────────────────────────────────────────────────────────
interface KeyDef    { term: string; mark_scheme: string; plain_english?: string; common_mistake?: string; }
interface CoreItem  { statement: string; worked_example?: string; wrong_approach?: string; typical_marks?: number; }
interface EqVar     { symbol: string; meaning: string; unit: string; }
interface EqItem    { equation: string; variables: EqVar[]; worked_substitution?: string; }
interface TipItem   { command_word?: string; tip: string; }
interface Flashcard { q: string; a: string; }
interface VisualSummary { kind: string; caption: string; content: string; }

export interface NotesData {
  overview: string;
  key_definitions: KeyDef[];
  core_content: CoreItem[];
  equations: EqItem[];
  visual_summary: VisualSummary | null;
  examiner_tips: TipItem[];
  flashcards: Flashcard[];
}

interface Props {
  notes: NotesData;
  topic: string;
  subject: string;
  unitLabel: string;
  formatHtml: (s: string) => string;
  renderMath: (s: string) => string;
  annotate: (s: string) => string;
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

// ─── Overview — paragraphs with drop-caps + alternating highlighter tints ────
const OverviewSection = ({ text, formatHtml, annotate }: { text: string; formatHtml: (s:string)=>string; annotate: (s:string)=>string }) => {
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  const tints = [
    "bg-amber-100/40 dark:bg-amber-900/15",
    "bg-violet-100/40 dark:bg-violet-900/15",
    "bg-emerald-100/40 dark:bg-emerald-900/15",
    "bg-sky-100/40 dark:bg-sky-900/15",
    "bg-rose-100/40 dark:bg-rose-900/15",
  ];
  const dropColors = ["text-amber-600", "text-violet-600", "text-emerald-600", "text-sky-600", "text-rose-600"];
  return (
    <div className="space-y-4 relative">
      {paragraphs.map((para, i) => {
        const tint = tints[i % tints.length];
        const dc = dropColors[i % dropColors.length];
        return (
          <div key={i} className={`relative rounded-xl ${tint} p-5 pl-6 border border-foreground/5`}>
            {i === 0 && (
              <div className="absolute -top-3 left-4 z-10">
                <Sticky variant="" className="text-xs">📌 Introduction</Sticky>
              </div>
            )}
            <p className="text-[15px] leading-[1.85] text-foreground/90"
               dangerouslySetInnerHTML={{
                 __html: annotate(formatHtml(para)).replace(
                   /^([A-Za-z])/,
                   (m) => `<span class="font-handwritten ${dc} text-5xl leading-none float-left mr-2 -mt-1 font-bold">${m}</span>`
                 ),
               }} />
          </div>
        );
      })}
    </div>
  );
};

// ─── Definitions — index-card grid ────────────────────────────────────────────
const DefinitionsSection = ({
  defs,
  formatHtml,
}: {
  defs: KeyDef[];
  formatHtml: (s: string) => string;
}) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
      {defs.map((d, i) => {
        const a = ACCENTS[i % ACCENTS.length];
        const open = expanded === i;
        return (
          <div
            key={i}
            className={`relative rounded-xl bg-card border border-foreground/10 shadow-sm hover:shadow-md transition-all overflow-hidden`}
          >
            <div className={`h-1.5 ${a.dot}`} />
            <div className="p-4">
              <div className="mb-2">
                <span className={`font-handwritten text-2xl font-bold ${a.hl} px-1.5 inline-block`}
                  dangerouslySetInnerHTML={{ __html: d.term }} />
              </div>
              {d.plain_english && (
                <p className="text-sm text-foreground/80 leading-relaxed mb-2"
                   dangerouslySetInnerHTML={{ __html: formatHtml(d.plain_english) }} />
              )}
              <div className="text-xs text-muted-foreground italic mb-3 leading-relaxed border-l-2 border-foreground/15 pl-2"
                   dangerouslySetInnerHTML={{ __html: `<strong class="not-italic text-foreground/70">Mark scheme:</strong> ${formatHtml(d.mark_scheme)}` }} />

              {d.common_mistake && (
                <button
                  onClick={() => setExpanded(open ? null : i)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-orange-200 text-orange-900 hover:bg-orange-300 transition-colors"
                >
                  <AlertTriangle className="h-3 w-3" /> Watch out
                  {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              )}
              {open && d.common_mistake && (
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
const CoreContentSection = ({ items, formatHtml, annotate }: { items: CoreItem[]; formatHtml:(s:string)=>string; annotate:(s:string)=>string }) => {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setExpanded(prev => {
    const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n;
  });
  return (
    <div className="space-y-3">
      {items.map((c, i) => {
        const a = ACCENTS[i % ACCENTS.length];
        const open = expanded.has(i);
        const hasExtra = !!(c.worked_example || c.wrong_approach);
        return (
          <div key={i} className={`rounded-xl bg-card border-l-[6px] ${a.rail} border-y border-r border-foreground/10 shadow-sm overflow-hidden`}>
            <button
              onClick={() => hasExtra && toggle(i)}
              className={`w-full flex items-start gap-3 p-4 text-left ${hasExtra ? "hover:bg-foreground/5 cursor-pointer" : "cursor-default"}`}
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
              {hasExtra && (open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />)}
            </button>
            {open && hasExtra && (
              <div className="px-4 pb-4 space-y-3 animate-fade-in">
                {c.worked_example && (
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-400 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mb-1.5">
                      <PencilLine className="h-3 w-3" /> Worked example
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90"
                       dangerouslySetInnerHTML={{ __html: annotate(formatHtml(c.worked_example)) }} />
                  </div>
                )}
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

// ─── Main renderer ────────────────────────────────────────────────────────────
export default function NotesVisualRenderer({ notes, topic, subject, unitLabel, formatHtml, renderMath, annotate }: Props) {
  const meta = useMemo(() => subjectMeta(subject), [subject]);


  const sections = useMemo(() => {
    const out: Array<{ id: string; title: string; icon: React.ReactNode; content: React.ReactNode }> = [];
    if (notes.overview) out.push({ id: "overview", title: "Overview", icon: <BookOpen className="h-5 w-5" />, content: <OverviewSection text={notes.overview} formatHtml={formatHtml} annotate={annotate} /> });
    if (notes.key_definitions.length) out.push({ id: "defs", title: "Definitions", icon: <Hash className="h-5 w-5" />, content: <DefinitionsSection defs={notes.key_definitions} formatHtml={formatHtml} /> });
    if (notes.core_content.length) out.push({ id: "core", title: "Core Content", icon: <Target className="h-5 w-5" />, content: <CoreContentSection items={notes.core_content} formatHtml={formatHtml} annotate={annotate} /> });
    if (notes.equations.length) out.push({ id: "eqs", title: "Equations", icon: <Zap className="h-5 w-5" />, content: <EquationsSection eqs={notes.equations} renderMath={renderMath} formatHtml={formatHtml} /> });
    if (notes.visual_summary?.content) out.push({ id: "visual", title: "Visual Summary", icon: <Eye className="h-5 w-5" />, content: <VisualSection vs={notes.visual_summary} renderMath={renderMath} /> });
    if (notes.examiner_tips.length) out.push({ id: "tips", title: "Examiner Tips", icon: <Lightbulb className="h-5 w-5" />, content: <ExaminerTipsSection tips={notes.examiner_tips} formatHtml={formatHtml} /> });
    if (notes.flashcards.length) out.push({ id: "flash", title: "Flashcards", icon: <Star className="h-5 w-5" />, content: <FlashcardsSection cards={notes.flashcards} formatHtml={formatHtml} /> });
    return out;
  }, [notes, formatHtml, annotate, renderMath, visuals, visualsLoading]);

  return (
    <div className="space-y-8">
      {/* ── Topic banner ─────────────────────────────────────────────────── */}
      <div className={`relative rounded-2xl overflow-hidden p-7 bg-gradient-to-br ${meta.tint} border border-foreground/10 shadow-sm`}>
        <div className="washi-tape h-4 w-40 absolute -top-1 right-8 rounded-sm" style={{ transform: "rotate(3deg)" }} />
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

      {preview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div className="relative max-h-[92vh] max-w-[96vw]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute -right-2 -top-2 z-10 rounded-full bg-background px-2 py-1 text-xs font-semibold shadow-md hover:bg-muted"
            >
              Close
            </button>
            <img
              src={preview.imageUrl}
              alt={preview.title}
              className="max-h-[92vh] max-w-[96vw] rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
