// Render AI text with proper exam-grade math typesetting (KaTeX) plus markdown.
// Used everywhere AI output is rendered: notes, questions, mocks, roadmap, etc.

import katex from "katex";
import "katex/dist/katex.min.css";

/* ------------------------------------------------------------------ */
/*  KaTeX rendering helpers                                            */
/* ------------------------------------------------------------------ */

const renderMath = (tex: string, displayMode: boolean): string => {
  try {
    return katex.renderToString(tex.trim(), {
      throwOnError: false,
      displayMode,
      output: "html",
      strict: "ignore",
      trust: false,
    });
  } catch {
    return escapeHtml(tex);
  }
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ------------------------------------------------------------------ */
/*  Auto-math: heuristically wrap bare math tokens in $...$            */
/*  so plain "x^2", "sqrt(2)", "1/2", "\frac{a}{b}", "H_2O" render.    */
/* ------------------------------------------------------------------ */

const autoWrapMath = (text: string): string => {
  // Skip already-delimited math segments — handled later.
  // We split on existing math markers so we only transform prose.
  const segments = text.split(
    /(\$\$[\s\S]+?\$\$|\$[^\n$]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\])/g
  );
  return segments
    .map((seg, i) => {
      if (i % 2 === 1) return seg; // already math
      let s = seg;

      // \frac{...}{...} → wrap as inline math
      s = s.replace(/\\frac\s*\{[^{}]+\}\s*\{[^{}]+\}/g, (m) => `$${m}$`);

      // \sqrt{...} or \sqrt[n]{...}
      s = s.replace(/\\sqrt(?:\[[^\]]+\])?\s*\{[^{}]+\}/g, (m) => `$${m}$`);

      // sqrt(...)  →  $\sqrt{...}$
      s = s.replace(/\bsqrt\s*\(([^()]+)\)/gi, (_m, inner) => `$\\sqrt{${inner}}$`);

      // a^b, a^{...}, a_b, a_{...}  (single token)
      s = s.replace(
        /\b([A-Za-z0-9])(\^|_)(\{[^}]+\}|[A-Za-z0-9+\-]+)/g,
        (_m, base, op, exp) => `$${base}${op}${exp}$`
      );

      // Greek/symbol macros standing alone (\pi, \theta, \alpha, \Delta, etc.)
      s = s.replace(
        /\\(alpha|beta|gamma|delta|Delta|theta|Theta|lambda|mu|pi|sigma|Sigma|phi|omega|Omega|infty|pm|times|cdot|approx|neq|leq|geq|to|rightarrow|leftarrow|Rightarrow|Leftrightarrow|degree|circ)\b/g,
        (m) => `$${m}$`
      );

      return s;
    })
    .join("");
};

/* ------------------------------------------------------------------ */
/*  Plain-text fallback (PDF export etc.)                              */
/* ------------------------------------------------------------------ */

const SUP_MAP: Record<string, string> = {
  "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹",
  "+":"⁺","-":"⁻","=":"⁼","(":"⁽",")":"⁾","n":"ⁿ","i":"ⁱ",
};
const SUB_MAP: Record<string, string> = {
  "0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉",
  "+":"₊","-":"₋","=":"₌","(":"₍",")":"₎",
};
const toSup = (s: string) => s.split("").map((c) => SUP_MAP[c] ?? c).join("");
const toSub = (s: string) => s.split("").map((c) => SUB_MAP[c] ?? c).join("");

const PLAIN_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\\Delta\b/g, "Δ"], [/\\delta\b/g, "δ"], [/\\alpha\b/g, "α"], [/\\beta\b/g, "β"],
  [/\\gamma\b/g, "γ"], [/\\theta\b/g, "θ"], [/\\lambda\b/g, "λ"], [/\\mu\b/g, "μ"],
  [/\\pi\b/g, "π"], [/\\sigma\b/g, "σ"], [/\\phi\b/g, "φ"], [/\\omega\b/g, "ω"],
  [/\\rightarrow\b/g, "→"], [/\\to\b/g, "→"], [/\\leftarrow\b/g, "←"],
  [/\\Rightarrow\b/g, "⇒"], [/\\rightleftharpoons\b/g, "⇌"],
  [/\\approx\b/g, "≈"], [/\\neq\b/g, "≠"], [/\\leq\b/g, "≤"], [/\\geq\b/g, "≥"],
  [/\\pm\b/g, "±"], [/\\times\b/g, "×"], [/\\cdot\b/g, "·"], [/\\div\b/g, "÷"],
  [/\\infty\b/g, "∞"], [/\\degree\b/g, "°"], [/\\circ\b/g, "°"],
  [/\\sqrt\s*\{([^{}]+)\}/g, "√($1)"],
  [/\\sqrt\b/g, "√"],
  [/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, "($1)/($2)"],
  [/\\text\{([^}]*)\}/g, "$1"], [/\\mathrm\{([^}]*)\}/g, "$1"],
];

export const stripLatex = (input: string): string => {
  if (!input) return "";
  let s = input;
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_m, inner) => inner);
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_m, inner) => inner);
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_m, inner) => inner);
  s = s.replace(/\$([^$\n]+?)\$/g, (_m, inner) => inner);
  for (const [pat, rep] of PLAIN_REPLACEMENTS) s = s.replace(pat, rep);
  s = s.replace(/\^\{([^{}]+)\}/g, (_m, g) => toSup(g));
  s = s.replace(/_\{([^{}]+)\}/g, (_m, g) => toSub(g));
  s = s.replace(/\^([0-9a-zA-Z+\-=()])/g, (_m, g) => toSup(g));
  s = s.replace(/_([0-9a-zA-Z+\-=()])/g, (_m, g) => toSub(g));
  s = s.replace(/\\\\/g, "\n").replace(/\\,/g, " ").replace(/\\;/g, " ").replace(/\\ /g, " ");
  return s;
};

export const toPlainText = (input: string): string => {
  let s = stripLatex(input);
  s = s.replace(/^#{1,6}\s+/gm, "");
  s = s.replace(/\*\*(.+?)\*\*/g, "$1");
  s = s.replace(/__(.+?)__/g, "$1");
  s = s.replace(/\*(.+?)\*/g, "$1");
  s = s.replace(/`([^`]+)`/g, "$1");
  return s;
};

/* ------------------------------------------------------------------ */
/*  Main HTML formatter (math → KaTeX, prose → markdown-lite)          */
/* ------------------------------------------------------------------ */

// Replace all math segments with KaTeX HTML; leaves prose untouched.
const renderMathSegments = (text: string): string => {
  // Order matters: handle display math first, then inline.
  let s = text;

  // $$...$$
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_m, tex) => renderMath(tex, true));
  // \[...\]
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_m, tex) => renderMath(tex, true));
  // \(...\)
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_m, tex) => renderMath(tex, false));
  // $...$  (single line, non-greedy)
  s = s.replace(/\$([^\n$]+?)\$/g, (_m, tex) => renderMath(tex, false));

  return s;
};

// Markdown-lite for inline runs. Math is rendered first, so the resulting
// KaTeX HTML is preserved (we only escape & < > on the *prose* segments).
const inlineFormat = (raw: string): string => {
  // Split on KaTeX spans so we don't escape their HTML.
  const parts = raw.split(/(<span class="katex[\s\S]*?<\/span>)/g);
  return parts
    .map((part) => {
      if (part.startsWith('<span class="katex')) return part;
      let s = escapeHtml(part);
      s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      s = s.replace(/__(.+?)__/g, "<strong>$1</strong>");
      s = s.replace(/(^|\W)\*([^*\n]+)\*(?=\W|$)/g, "$1<em>$2</em>");
      s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
      return s;
    })
    .join("");
};

export const toFormattedHtml = (input: string): string => {
  if (!input) return "";
  // 1) Heuristically wrap bare math, 2) render math via KaTeX,
  // 3) build block structure, escaping only prose.
  const wrapped = autoWrapMath(input);
  const mathRendered = renderMathSegments(wrapped);

  const lines = mathRendered.split(/\r?\n/);
  const out: string[] = [];
  let inUl = false, inOl = false;
  const closeLists = () => {
    if (inUl) { out.push("</ul>"); inUl = false; }
    if (inOl) { out.push("</ol>"); inOl = false; }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { closeLists(); continue; }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeLists();
      const lvl = Math.min(6, h[1].length);
      out.push(`<h${lvl}>${inlineFormat(h[2])}</h${lvl}>`);
      continue;
    }
    const ul = line.match(/^\s*[-*•]\s+(.*)$/);
    if (ul) {
      if (inOl) { out.push("</ol>"); inOl = false; }
      if (!inUl) { out.push("<ul>"); inUl = true; }
      out.push(`<li>${inlineFormat(ul[1])}</li>`);
      continue;
    }
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ol) {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (!inOl) { out.push("<ol>"); inOl = true; }
      out.push(`<li>${inlineFormat(ol[1])}</li>`);
      continue;
    }
    closeLists();
    out.push(`<p>${inlineFormat(line)}</p>`);
  }
  closeLists();
  return out.join("");
};

export const formattedHtmlProps = (input: string) => ({
  dangerouslySetInnerHTML: { __html: toFormattedHtml(input) },
});
