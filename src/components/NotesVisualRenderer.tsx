/**
 * NotesVisualRenderer
 * A lively, book-style notes renderer inspired by hand-written study notes.
 * Replaces the plain paragraph layout with colour blocks, mind-map chips,
 * flashcard flips, equation cards, and examiner tip badges.
 */

import { useState } from "react";
import { ChevronDown, ChevronUp, Zap, Target, AlertTriangle, BookOpen, Hash, Lightbulb, Star, ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface KeyDef   { term: string; mark_scheme: string; plain_english?: string; common_mistake?: string; }
interface CoreItem { statement: string; worked_example?: string; wrong_approach?: string; typical_marks?: number; }
interface EqVar    { symbol: string; meaning: string; unit: string; }
interface EqItem   { equation: string; variables: EqVar[]; worked_substitution?: string; }
interface TipItem  { command_word?: string; tip: string; }
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
  unitLabel: string;   // e.g. "Unit 4" or "Paper 1"
  formatHtml: (s: string) => string;
  renderMath: (s: string) => string;
  annotate: (s: string) => string;
}

// ─── Palette — section accent colours cycling ─────────────────────────────────
const SECTION_PALETTES = [
  { bg: "bg-amber-50 dark:bg-amber-950/30",   border: "border-amber-300 dark:border-amber-700",  tag: "bg-amber-400 text-amber-950",  dot: "bg-amber-400" },
  { bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-300 dark:border-violet-700", tag: "bg-violet-400 text-white",      dot: "bg-violet-400" },
  { bg: "bg-teal-50 dark:bg-teal-950/30",     border: "border-teal-300 dark:border-teal-700",    tag: "bg-teal-400 text-teal-950",    dot: "bg-teal-400" },
  { bg: "bg-rose-50 dark:bg-rose-950/30",     border: "border-rose-300 dark:border-rose-700",    tag: "bg-rose-400 text-white",       dot: "bg-rose-400" },
  { bg: "bg-sky-50 dark:bg-sky-950/30",       border: "border-sky-300 dark:border-sky-700",      tag: "bg-sky-400 text-sky-950",      dot: "bg-sky-400" },
  { bg: "bg-lime-50 dark:bg-lime-950/30",     border: "border-lime-300 dark:border-lime-700",    tag: "bg-lime-400 text-lime-950",    dot: "bg-lime-400" },
];

const HIGHLIGHT_COLORS = [
  "bg-yellow-200/70 dark:bg-yellow-700/40",
  "bg-purple-200/70 dark:bg-purple-700/40",
  "bg-green-200/70 dark:bg-green-700/40",
  "bg-pink-200/70 dark:bg-pink-700/40",
  "bg-blue-200/70 dark:bg-blue-700/40",
  "bg-orange-200/70 dark:bg-orange-700/40",
];

// ─── Small helper components ───────────────────────────────────────────────────

const SectionHeader = ({ icon, title, palette }: { icon: React.ReactNode; title: string; palette: typeof SECTION_PALETTES[0] }) => (
  <div className={`flex items-center gap-3 mb-5 pb-3 border-b-2 ${palette.border}`}>
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${palette.tag} shrink-0`}>{icon}</div>
    <h3 className="text-lg font-extrabold tracking-tight">{title}</h3>
  </div>
);

const Chip = ({ text, color }: { text: string; color: string }) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mr-1 mb-1 ${color}`}>{text}</span>
);

const MistakeTag = () => (
  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded">
    <AlertTriangle className="h-2.5 w-2.5" /> Watch out
  </span>
);

const ExampleTag = () => (
  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded">
    <Zap className="h-2.5 w-2.5" /> Worked example
  </span>
);

// ─── Overview section — paragraph blocks with lead ────────────────────────────
const OverviewSection = ({ text, formatHtml, annotate }: { text: string; formatHtml: (s:string)=>string; annotate: (s:string)=>string }) => {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="grid gap-3">
      {paragraphs.map((para, i) => (
        <div
          key={i}
          className={`rounded-xl p-4 ${i === 0 ? "border-l-4 border-primary bg-primary/5" : "bg-secondary/20"}`}
        >
          {i === 0 && (
            <div className="text-[10px] uppercase tracking-widest font-mono text-primary mb-2 flex items-center gap-1">
              <BookOpen className="h-3 w-3" /> Introduction
            </div>
          )}
          <p
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: annotate(formatHtml(para)) }}
          />
        </div>
      ))}
    </div>
  );
};

// ─── Key Definitions — card grid ──────────────────────────────────────────────
const DefinitionsSection = ({ defs, formatHtml, i: sectionIdx }: { defs: KeyDef[]; formatHtml:(s:string)=>string; i: number }) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {defs.map((d, i) => {
        const color = HIGHLIGHT_COLORS[i % HIGHLIGHT_COLORS.length];
        const open = expanded === i;
        return (
          <div
            key={i}
            onClick={() => setExpanded(open ? null : i)}
            className="rounded-xl border border-border bg-card p-4 cursor-pointer hover:shadow-md transition-all select-none"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className={`inline-block px-2 py-0.5 rounded font-semibold text-sm ${color}`}
                dangerouslySetInnerHTML={{ __html: d.term }} />
              {open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed"
               dangerouslySetInnerHTML={{ __html: formatHtml(d.plain_english || d.mark_scheme) }} />
            {open && (
              <div className="mt-3 space-y-2 border-t border-border pt-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-primary mb-1">Mark-scheme definition</div>
                  <p className="text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: formatHtml(d.mark_scheme) }} />
                </div>
                {d.common_mistake && (
                  <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-2.5">
                    <MistakeTag />
                    <p className="text-xs mt-1.5" dangerouslySetInnerHTML={{ __html: formatHtml(d.common_mistake) }} />
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

// ─── Core Content — numbered blocks with colour accent bars ───────────────────
const CoreContentSection = ({ items, formatHtml, annotate }: { items: CoreItem[]; formatHtml:(s:string)=>string; annotate:(s:string)=>string }) => {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setExpanded(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="space-y-3">
      {items.map((c, i) => {
        const accent = SECTION_PALETTES[i % SECTION_PALETTES.length];
        const open = expanded.has(i);
        const hasExtra = c.worked_example || c.wrong_approach;
        return (
          <div key={i} className={`rounded-xl border ${accent.border} overflow-hidden`}>
            <button
              onClick={() => hasExtra && toggle(i)}
              className={`w-full flex items-start gap-3 p-4 text-left ${accent.bg} ${hasExtra ? "cursor-pointer hover:brightness-95" : "cursor-default"}`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-extrabold ${accent.tag}`}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug" dangerouslySetInnerHTML={{ __html: annotate(formatHtml(c.statement)) }} />
                {typeof c.typical_marks === "number" && c.typical_marks > 0 && (
                  <span className="inline-block mt-1.5 text-[10px] font-mono bg-white/60 dark:bg-black/20 px-1.5 py-0.5 rounded">
                    {c.typical_marks} mark{c.typical_marks !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {hasExtra && (
                open
                  ? <ChevronUp className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                  : <ChevronDown className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
              )}
            </button>
            {open && hasExtra && (
              <div className="bg-card divide-y divide-border">
                {c.worked_example && (
                  <div className="p-4">
                    <ExampleTag />
                    <p className="text-xs mt-2 leading-relaxed whitespace-pre-wrap text-foreground/90"
                       dangerouslySetInnerHTML={{ __html: annotate(formatHtml(c.worked_example)) }} />
                  </div>
                )}
                {c.wrong_approach && (
                  <div className="p-4 bg-orange-50/50 dark:bg-orange-950/20">
                    <MistakeTag />
                    <p className="text-xs mt-2 leading-relaxed text-foreground/80"
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

// ─── Equations — formula cards ────────────────────────────────────────────────
const EquationsSection = ({ eqs, renderMath, formatHtml }: { eqs: EqItem[]; renderMath:(s:string)=>string; formatHtml:(s:string)=>string }) => (
  <div className="grid sm:grid-cols-2 gap-4">
    {eqs.map((e, i) => {
      const raw = String(e.equation ?? "").trim();
      const mathStr = raw && !/\$/.test(raw) ? `$${raw}$` : raw;
      return (
        <div key={i} className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
          <div className="text-center text-xl font-bold mb-3 py-2 rounded-lg bg-primary/10"
               dangerouslySetInnerHTML={{ __html: renderMath(mathStr) }} />
          {e.variables.length > 0 && (
            <div className="space-y-1 mb-3">
              {e.variables.map((v, j) => {
                const meaning = String(v.meaning ?? "").replace(/\{?\s*meaning\s*:?\s*\}?/gi, "").trim();
                const unit = String(v.unit ?? "").replace(/^[\s({]+|[\s)}]+$/g, "").trim();
                return (
                  <div key={j} className="flex items-baseline gap-1.5 text-xs flex-wrap">
                    <span className="font-mono font-bold text-primary" dangerouslySetInnerHTML={{ __html: renderMath(v.symbol) }} />
                    <span className="text-muted-foreground">=</span>
                    <span dangerouslySetInnerHTML={{ __html: renderMath(meaning) }} />
                    {unit && <span className="text-muted-foreground font-mono">({unit})</span>}
                  </div>
                );
              })}
            </div>
          )}
          {e.worked_substitution && (
            <div className="mt-2 pt-2 border-t border-primary/20">
              <div className="text-[10px] uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400 mb-1">Substitution</div>
              <p className="text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: formatHtml(e.worked_substitution) }} />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ─── Visual Summary — rendered HTML/SVG or table ──────────────────────────────
const VisualSection = ({ vs, renderMath }: { vs: VisualSummary; renderMath:(s:string)=>string }) => (
  <div className="rounded-xl border border-border overflow-hidden">
    {vs.caption && (
      <div className="px-4 py-2 bg-secondary/40 text-xs font-medium text-muted-foreground border-b border-border">
        {vs.caption}
      </div>
    )}
    <div className="p-4 overflow-x-auto [&_table]:w-full [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:bg-primary/10 [&_tr:nth-child(even)]:bg-secondary/20 [&_table]:text-sm [&_svg]:max-w-full"
         dangerouslySetInnerHTML={{ __html: renderMath(vs.content) }} />
  </div>
);

// ─── Examiner Tips — command-word badges on a coloured rail ───────────────────
const ExaminerTipsSection = ({ tips, formatHtml }: { tips: TipItem[]; formatHtml:(s:string)=>string }) => (
  <div className="space-y-3">
    {tips.map((t, i) => {
      const palette = SECTION_PALETTES[i % SECTION_PALETTES.length];
      return (
        <div key={i} className={`flex gap-3 rounded-xl p-3 ${palette.bg} border ${palette.border}`}>
          <ArrowRight className={`h-4 w-4 shrink-0 mt-0.5 ${palette.dot.replace("bg-", "text-")}`} />
          <div>
            {t.command_word && (
              <span className={`inline-block text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded mr-2 ${palette.tag}`}>
                {t.command_word}
              </span>
            )}
            <span className="text-sm" dangerouslySetInnerHTML={{ __html: formatHtml(t.tip) }} />
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Flashcards — flip deck ───────────────────────────────────────────────────
const FlashcardsSection = ({ cards, formatHtml }: { cards: Flashcard[]; formatHtml:(s:string)=>string }) => {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center gap-1.5 flex-wrap mb-4">
          {cards.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${SECTION_PALETTES[i % SECTION_PALETTES.length].dot}`} />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-4">{cards.length} flashcards ready</p>
        <button
          onClick={() => { setStarted(true); setIdx(0); setFlipped(false); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          <Star className="h-4 w-4" /> Start flashcards
        </button>
      </div>
    );
  }

  const card = cards[idx];
  const pal = SECTION_PALETTES[idx % SECTION_PALETTES.length];

  return (
    <div className="select-none">
      <div className="text-center text-xs font-mono text-muted-foreground mb-3">{idx + 1} / {cards.length}</div>
      <div
        onClick={() => setFlipped(f => !f)}
        className={`rounded-2xl border-2 ${pal.border} ${flipped ? "bg-emerald-50 dark:bg-emerald-950/30" : pal.bg} min-h-[140px] flex flex-col items-center justify-center p-6 cursor-pointer transition-all hover:shadow-lg`}
      >
        <div className="text-[10px] uppercase tracking-widest font-mono mb-3 text-muted-foreground">
          {flipped ? "Answer" : "Question"}
        </div>
        <p className="text-sm font-medium text-center leading-relaxed max-w-md"
           dangerouslySetInnerHTML={{ __html: formatHtml(flipped ? card.a : card.q) }} />
        <p className="text-[10px] text-muted-foreground mt-4">{flipped ? "Click to see question" : "Click to reveal answer"}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => { setIdx(i => Math.max(0, i - 1)); setFlipped(false); }}
          disabled={idx === 0}
          className="px-4 py-1.5 rounded-lg border border-border text-xs font-medium disabled:opacity-40 hover:bg-secondary/40 transition-colors"
        >← Prev</button>
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); setFlipped(false); }}
              className={`w-2 h-2 rounded-full transition-all ${i === idx ? pal.dot + " scale-125" : "bg-muted"}`}
            />
          ))}
        </div>
        {idx < cards.length - 1 ? (
          <button
            onClick={() => { setIdx(i => i + 1); setFlipped(false); }}
            className="px-4 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-secondary/40 transition-colors"
          >Next →</button>
        ) : (
          <button
            onClick={() => { setStarted(false); setIdx(0); setFlipped(false); }}
            className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >Restart ↺</button>
        )}
      </div>
    </div>
  );
};

// ─── Main renderer ─────────────────────────────────────────────────────────────
export default function NotesVisualRenderer({ notes, topic, subject, unitLabel, formatHtml, renderMath, annotate }: Props) {
  let palIdx = 0;
  const nextPal = () => SECTION_PALETTES[(palIdx++) % SECTION_PALETTES.length];

  const sections: Array<{ id: string; title: string; icon: React.ReactNode; content: React.ReactNode }> = [];

  if (notes.overview) {
    nextPal();
    sections.push({
      id: "overview", title: "Overview", icon: <BookOpen className="h-4 w-4" />,
      content: <OverviewSection text={notes.overview} formatHtml={formatHtml} annotate={annotate} />,
    });
  }

  if (notes.key_definitions.length > 0) {
    nextPal();
    sections.push({
      id: "defs", title: "Key Definitions", icon: <Hash className="h-4 w-4" />,
      content: <DefinitionsSection defs={notes.key_definitions} formatHtml={formatHtml} i={palIdx} />,
    });
  }

  if (notes.core_content.length > 0) {
    nextPal();
    sections.push({
      id: "core", title: "Core Content", icon: <Target className="h-4 w-4" />,
      content: <CoreContentSection items={notes.core_content} formatHtml={formatHtml} annotate={annotate} />,
    });
  }

  if (notes.equations.length > 0) {
    nextPal();
    sections.push({
      id: "eqs", title: "Equations", icon: <Zap className="h-4 w-4" />,
      content: <EquationsSection eqs={notes.equations} renderMath={renderMath} formatHtml={formatHtml} />,
    });
  }

  if (notes.visual_summary?.content) {
    nextPal();
    sections.push({
      id: "visual", title: "Visual Summary", icon: <Star className="h-4 w-4" />,
      content: <VisualSection vs={notes.visual_summary} renderMath={renderMath} />,
    });
  }

  if (notes.examiner_tips.length > 0) {
    nextPal();
    sections.push({
      id: "tips", title: "Examiner Tips", icon: <Lightbulb className="h-4 w-4" />,
      content: <ExaminerTipsSection tips={notes.examiner_tips} formatHtml={formatHtml} />,
    });
  }

  if (notes.flashcards.length > 0) {
    nextPal();
    sections.push({
      id: "flash", title: "Flashcards", icon: <Star className="h-4 w-4" />,
      content: <FlashcardsSection cards={notes.flashcards} formatHtml={formatHtml} />,
    });
  }

  // Reset palette counter for rendering
  palIdx = 0;

  return (
    <div className="space-y-8">
      {/* Topic title banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="text-xs font-mono uppercase tracking-widest text-primary mb-1 opacity-80">
          {subject} · {unitLabel}
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">{topic}</h2>
        {/* Quick-nav dots */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`#notes-${s.id}`}
              className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${SECTION_PALETTES[i % SECTION_PALETTES.length].tag} border-transparent hover:opacity-80`}
            >
              {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      {sections.map((s, i) => {
        const pal = SECTION_PALETTES[i % SECTION_PALETTES.length];
        return (
          <section key={s.id} id={`notes-${s.id}`} className="scroll-mt-4">
            <SectionHeader icon={s.icon} title={s.title} palette={pal} />
            {s.content}
          </section>
        );
      })}
    </div>
  );
}
