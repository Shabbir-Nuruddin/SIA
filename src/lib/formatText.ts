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
/*  Repair LaTeX corrupted by JSON control-char interpretation.        */
/*  When an LLM emits "\rightarrow" inside a JSON string without       */
/*  escaping the backslash, JSON.parse turns "\r" into a CR and the    */
/*  rest survives as "ightarrow". Same for \f → "rac", \b → "ackslash" */
/*  These patches restore the missing backslash + drop stray controls. */
/* ------------------------------------------------------------------ */
const repairLatex = (input: string): string => {
  if (!input) return input;
  let s = input;
  // Strip raw control chars that came from \r \f \b \v \t inside math.
  s = s.replace(/[\u0008\u000B\u000C]/g, "");
  s = s.replace(/\r(?!\n)/g, "");
  // Restore commands whose leading backslash was eaten as a control char.
  // \f → "f" was lost, leaving "rac{...}" etc.
  s = s.replace(/\b(rac)\s*\{/g, "\\f$1{");
  // \r* commands (rightarrow, rightleftharpoons, rho)
  s = s.replace(/(^|[^\\A-Za-z])(ightarrow|ightleftharpoons|ho)\b/g, "$1\\r$2");
  // \l* commands (leftarrow, leq, ldots, log, ln, lambda, leftrightarrow)
  s = s.replace(/(^|[^\\A-Za-z])(eftarrow|eftrightarrow)\b/g, "$1\\l$2");
  // \b* commands (beta, binom)
  s = s.replace(/(^|[^\\A-Za-z])Bightarrow\b/g, "$1\\Rightarrow");
  // Capital variants — \Rightarrow, \Leftarrow
  s = s.replace(/(^|[^\\A-Za-z])(ightarrow)\b/g, "$1\\r$2");
  return s;
};

/* ------------------------------------------------------------------ */
/*  Auto-math: heuristically wrap bare math tokens in $...$            */
/*  so plain "x^2", "sqrt(2)", "1/2", "\frac{a}{b}", "H_2O" render.    */
/* ------------------------------------------------------------------ */

// Match a balanced {...} block starting at index i (i points at '{').
// Returns end index (exclusive) or -1 if unbalanced.
const matchBraces = (s: string, i: number): number => {
  if (s[i] !== "{") return -1;
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === "{") depth++;
    else if (s[j] === "}") {
      depth--;
      if (depth === 0) return j + 1;
    }
  }
  return -1;
};

// Find spans of \frac{...}{...} or \sqrt[..]{...} with proper brace nesting.
const wrapBalancedMacro = (text: string, macro: "frac" | "sqrt"): string => {
  const needle = "\\" + macro;
  let out = "";
  let i = 0;
  while (i < text.length) {
    const k = text.indexOf(needle, i);
    if (k === -1) { out += text.slice(i); break; }
    out += text.slice(i, k);
    let p = k + needle.length;
    // optional [..] for sqrt
    if (macro === "sqrt" && text[p] === "[") {
      const close = text.indexOf("]", p);
      if (close === -1) { out += text.slice(k); break; }
      p = close + 1;
    }
    // skip whitespace
    while (text[p] === " ") p++;
    if (text[p] !== "{") { out += text.slice(k, p); i = p; continue; }
    const end1 = matchBraces(text, p);
    if (end1 === -1) { out += text.slice(k); break; }
    let end = end1;
    if (macro === "frac") {
      let q = end1;
      while (text[q] === " ") q++;
      if (text[q] !== "{") { out += text.slice(k, end1); i = end1; continue; }
      const end2 = matchBraces(text, q);
      if (end2 === -1) { out += text.slice(k); break; }
      end = end2;
    }
    out += `$${text.slice(k, end)}$`;
    i = end;
  }
  return out;
};

// Known LaTeX command names we'll auto-wrap if found bare (without $ delimiters).
const LATEX_CMDS = "alpha|beta|gamma|delta|Delta|epsilon|varepsilon|zeta|eta|theta|Theta|iota|kappa|lambda|Lambda|mu|nu|xi|Xi|pi|Pi|rho|sigma|Sigma|tau|upsilon|phi|Phi|chi|psi|Psi|omega|Omega|infty|partial|nabla|hbar|ell|aleph|forall|exists|in|notin|subset|supset|cup|cap|emptyset|pm|mp|times|div|cdot|ast|approx|equiv|neq|leq|geq|ne|ge|le|ll|gg|sim|propto|to|longrightarrow|rightleftharpoons|rightarrow|leftarrow|Rightarrow|Leftarrow|Leftrightarrow|mapsto|degree|circ|prime|ominus|oplus|otimes|odot|sum|prod|int|oint|lim|log|ln|sin|cos|tan|sec|csc|cot|arcsin|arccos|arctan|sinh|cosh|tanh|exp|min|max|sqrt|frac|binom|text|mathrm|mathbf|mathit|left|right|cdots|ldots|dots|vec|hat|bar|tilde|dot|ddot|overline|underline|begin|end";
const LATEX_CMD_RE = new RegExp(`\\\\(?:${LATEX_CMDS})\\b`);

// Split a string into [outside, math, outside, math, ...] segments based on
// any of the supported math delimiters. Even indices = prose, odd = math.
const splitOnMath = (text: string): string[] =>
  text.split(/(\$\$[\s\S]+?\$\$|\$[^\n$]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\])/g);

// Apply a transform only to the prose (even-index) segments, then rejoin.
const transformOutside = (text: string, fn: (s: string) => string): string =>
  splitOnMath(text).map((seg, i) => (i % 2 === 1 ? seg : fn(seg))).join("");

const autoWrapMath = (text: string): string => {
  // Each pass operates ONLY on prose between existing math delimiters.
  // After each pass, we re-split so newly added $...$ are treated as math
  // and never get re-wrapped (which previously produced nested $$).

  // 1. Balanced \frac{...}{...} and \sqrt[..]{...}
  let s = transformOutside(text, seg => wrapBalancedMacro(seg, "frac"));
  s = transformOutside(s, seg => wrapBalancedMacro(seg, "sqrt"));

  // 2. sqrt(...) → $\sqrt{...}$
  s = transformOutside(s, seg => seg.replace(/\bsqrt\s*\(([^()]+)\)/gi, (_m, inner) => `$\\sqrt{${inner}}$`));

  // 3. a^b / a^{..} / a_b / a_{..}
  s = transformOutside(s, seg => seg.replace(
    /\b([A-Za-z0-9])(\^|_)(\{[^}]+\}|[A-Za-z0-9+\-]+)/g,
    (_m, base, op, exp) => `$${base}${op}${exp}$`,
  ));

  // 4. Bare greek/operator macros
  s = transformOutside(s, seg => seg.replace(
    /\\(alpha|beta|gamma|delta|Delta|theta|Theta|lambda|mu|nu|pi|sigma|Sigma|phi|omega|Omega|infty|pm|times|cdot|approx|neq|leq|geq|ne|ge|le|to|longrightarrow|rightleftharpoons|rightarrow|leftarrow|Rightarrow|Leftrightarrow|degree|circ|ominus|oplus|otimes|partial|nabla|hbar|prime|ell|sum|prod|int)\b/g,
    (m) => `$${m}$`,
  ));

  // 5. Bare \text{...}, \mathrm{...}, etc. with balanced braces
  for (const macro of ["text", "mathrm", "mathbf", "mathit", "operatorname"]) {
    s = transformOutside(s, seg => {
      const needle = "\\" + macro + "{";
      let out = "";
      let i = 0;
      while (i < seg.length) {
        const k = seg.indexOf(needle, i);
        if (k === -1) { out += seg.slice(i); break; }
        const braceStart = k + needle.length - 1;
        const end = matchBraces(seg, braceStart);
        if (end === -1) { out += seg.slice(i); break; }
        out += seg.slice(i, k) + `$${seg.slice(k, end)}$`;
        i = end;
      }
      return out;
    });
  }

  // 6. Last-resort: any prose segment STILL containing a bare LaTeX command
  // gets wrapped wholesale.
  s = transformOutside(s, seg => (LATEX_CMD_RE.test(seg) ? `$${seg}$` : seg));

  return s;
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

// Render math, replacing each KaTeX HTML chunk with a placeholder token,
// so subsequent HTML-escaping of prose can't corrupt KaTeX markup.
const PLACEHOLDER_RE = /\uE000(\d+)\uE001/g;
const renderMathWithPlaceholders = (text: string): { text: string; store: string[] } => {
  const store: string[] = [];
  const push = (html: string) => {
    const i = store.length;
    store.push(html);
    return `\uE000${i}\uE001`;
  };
  let s = text;
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_m, tex) => push(renderMath(tex, true)));
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_m, tex) => push(renderMath(tex, true)));
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_m, tex) => push(renderMath(tex, false)));
  s = s.replace(/\$([^\n$]+?)\$/g, (_m, tex) => push(renderMath(tex, false)));
  return { text: s, store };
};

const inlineFormat = (raw: string, store: string[]): string => {
  let s = escapeHtml(raw);
  // Text-formatting LaTeX that leaks into prose (outside $…$): render it instead
  // of showing raw "\textit{least}". Math versions are already KaTeX-rendered.
  s = s.replace(/\\textit\{([^{}]*)\}/g, "<em>$1</em>");
  s = s.replace(/\\emph\{([^{}]*)\}/g, "<em>$1</em>");
  s = s.replace(/\\textbf\{([^{}]*)\}/g, "<strong>$1</strong>");
  s = s.replace(/\\underline\{([^{}]*)\}/g, "<u>$1</u>");
  s = s.replace(/\\text(?:rm|sf|tt|normal)?\{([^{}]*)\}/g, "$1");
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__(.+?)__/g, "<strong>$1</strong>");
  s = s.replace(/(^|\W)\*([^*\n]+)\*(?=\W|$)/g, "$1<em>$2</em>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(PLACEHOLDER_RE, (_m, n) => store[parseInt(n, 10)] ?? "");
  return s;
};

// Strip LaTeX list environments and orphan markers the model sometimes emits
// (e.g. "\item ...", "\end{itemize}"). Convert \item to markdown bullets.
const sanitizeLatexEnvs = (input: string): string => {
  let s = input;
  s = s.replace(/\\(begin|end)\{(itemize|enumerate|description|list)\}/g, "");
  s = s.replace(/\\item\s+/g, "\n- ");
  s = s.replace(/\\(begin|end)\{[^}]*\}/g, "");
  s = s.replace(/^\s*\$\s*$/gm, "");
  return s;
};

export const toFormattedHtml = (input: string): string => {
  if (!input) return "";
  const repaired = repairLatex(input);
  const cleaned = sanitizeLatexEnvs(repaired);
  const wrapped = autoWrapMath(cleaned);
  const { text: mathRendered, store } = renderMathWithPlaceholders(wrapped);

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
      out.push(`<h${lvl}>${inlineFormat(h[2], store)}</h${lvl}>`);
      continue;
    }
    const ul = line.match(/^\s*[-*•]\s+(.*)$/);
    if (ul) {
      if (inOl) { out.push("</ol>"); inOl = false; }
      if (!inUl) { out.push("<ul>"); inUl = true; }
      out.push(`<li>${inlineFormat(ul[1], store)}</li>`);
      continue;
    }
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ol) {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (!inOl) { out.push("<ol>"); inOl = true; }
      out.push(`<li>${inlineFormat(ol[1], store)}</li>`);
      continue;
    }
    closeLists();
    out.push(`<p>${inlineFormat(line, store)}</p>`);
  }
  closeLists();
  return out.join("");
};

export const formattedHtmlProps = (input: string) => ({
  dangerouslySetInnerHTML: { __html: toFormattedHtml(input) },
});

/**
 * Replace $$...$$ and $...$ inside an arbitrary string (HTML or plain text)
 * with KaTeX-rendered HTML, leaving the surrounding markup untouched. Use for
 * AI-generated tables / ASCII diagrams that already contain HTML structure
 * but embed LaTeX fragments.
 */
export const renderMathInString = (input: string): string => {
  if (!input) return "";
  let s = autoWrapMath(sanitizeLatexEnvs(repairLatex(input)));
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_m, tex) => renderMath(tex, true));
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_m, tex) => renderMath(tex, true));
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_m, tex) => renderMath(tex, false));
  s = s.replace(/\$([^\n$]+?)\$/g, (_m, tex) => renderMath(tex, false));
  return s;
};

export const renderedMathHtmlProps = (input: string) => ({
  dangerouslySetInnerHTML: { __html: renderMathInString(input) },
});
