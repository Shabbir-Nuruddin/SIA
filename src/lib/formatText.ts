// Post-process AI text: strip LaTeX delimiters, convert common LaTeX to unicode,
// convert markdown to safe HTML. Used everywhere AI output is rendered.

const LATEX_REPLACEMENTS: Array<[RegExp, string]> = [
  // Greek letters
  [/\\Delta\b/g, "Δ"], [/\\delta\b/g, "δ"],
  [/\\alpha\b/g, "α"], [/\\beta\b/g, "β"], [/\\gamma\b/g, "γ"], [/\\Gamma\b/g, "Γ"],
  [/\\theta\b/g, "θ"], [/\\Theta\b/g, "Θ"], [/\\lambda\b/g, "λ"], [/\\Lambda\b/g, "Λ"],
  [/\\mu\b/g, "μ"], [/\\nu\b/g, "ν"], [/\\pi\b/g, "π"], [/\\Pi\b/g, "Π"],
  [/\\sigma\b/g, "σ"], [/\\Sigma\b/g, "Σ"], [/\\tau\b/g, "τ"], [/\\phi\b/g, "φ"],
  [/\\Phi\b/g, "Φ"], [/\\omega\b/g, "ω"], [/\\Omega\b/g, "Ω"], [/\\epsilon\b/g, "ε"],
  // Arrows + symbols
  [/\\rightarrow\b/g, "→"], [/\\to\b/g, "→"], [/\\leftarrow\b/g, "←"],
  [/\\leftrightarrow\b/g, "↔"], [/\\Rightarrow\b/g, "⇒"], [/\\Leftrightarrow\b/g, "⇔"],
  [/\\rightleftharpoons\b/g, "⇌"], [/\\equiv\b/g, "≡"], [/\\approx\b/g, "≈"],
  [/\\neq\b/g, "≠"], [/\\leq\b/g, "≤"], [/\\geq\b/g, "≥"],
  [/\\pm\b/g, "±"], [/\\times\b/g, "×"], [/\\cdot\b/g, "·"], [/\\div\b/g, "÷"],
  [/\\infty\b/g, "∞"], [/\\degree\b/g, "°"], [/\\circ\b/g, "°"],
  [/\\sum\b/g, "Σ"], [/\\int\b/g, "∫"], [/\\sqrt\b/g, "√"],
  // \text{...}
  [/\\text\{([^}]*)\}/g, "$1"],
  [/\\mathrm\{([^}]*)\}/g, "$1"],
  // \frac{a}{b} -> a/b (with parens for safety)
  [/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)"],
  // ^{xxx} -> <sup>xxx</sup>
  // Handled below after escaping
];

const SUP_MAP: Record<string, string> = {
  "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹",
  "+":"⁺","-":"⁻","=":"⁼","(":"⁽",")":"⁾","n":"ⁿ","i":"ⁱ",
};
const SUB_MAP: Record<string, string> = {
  "0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉",
  "+":"₊","-":"₋","=":"₌","(":"₍",")":"₎",
};

const toSup = (s: string) => s.split("").map(c => SUP_MAP[c] ?? c).join("");
const toSub = (s: string) => s.split("").map(c => SUB_MAP[c] ?? c).join("");

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Strip LaTeX delimiters and convert common LaTeX inside to unicode. */
export const stripLatex = (input: string): string => {
  if (!input) return "";
  let s = input;
  // Pull contents out of $$...$$, $...$, \[...\], \(...\)
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, inner) => inner);
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_, inner) => inner);
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_, inner) => inner);
  s = s.replace(/\$([^$\n]+?)\$/g, (_, inner) => inner);

  for (const [pat, rep] of LATEX_REPLACEMENTS) s = s.replace(pat, rep);

  // ^{group} or _{group}
  s = s.replace(/\^\{([^{}]+)\}/g, (_, g) => toSup(g));
  s = s.replace(/_\{([^{}]+)\}/g, (_, g) => toSub(g));
  // single char ^x or _x
  s = s.replace(/\^([0-9a-zA-Z+\-=()])/g, (_, g) => toSup(g));
  s = s.replace(/_([0-9a-zA-Z+\-=()])/g, (_, g) => toSub(g));

  // remove stray backslashes left over
  s = s.replace(/\\\\/g, "\n").replace(/\\,/g, " ").replace(/\\;/g, " ").replace(/\\ /g, " ");
  return s;
};

/** Strip latex AND convert markdown to plain text (no HTML). For PDFs etc. */
export const toPlainText = (input: string): string => {
  let s = stripLatex(input);
  s = s.replace(/^#{1,6}\s+/gm, "");
  s = s.replace(/\*\*(.+?)\*\*/g, "$1");
  s = s.replace(/__(.+?)__/g, "$1");
  s = s.replace(/\*(.+?)\*/g, "$1");
  s = s.replace(/`([^`]+)`/g, "$1");
  return s;
};

/** Convert AI output (LaTeX + markdown) into safe HTML. */
export const toFormattedHtml = (input: string): string => {
  if (!input) return "";
  const cleaned = stripLatex(input);
  const lines = cleaned.split(/\r?\n/);
  const out: string[] = [];
  let inUl = false, inOl = false;

  const closeLists = () => {
    if (inUl) { out.push("</ul>"); inUl = false; }
    if (inOl) { out.push("</ol>"); inOl = false; }
  };

  const inline = (raw: string) => {
    let s = escapeHtml(raw);
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/__(.+?)__/g, "<strong>$1</strong>");
    s = s.replace(/(^|\W)\*([^*\n]+)\*(?=\W|$)/g, "$1<em>$2</em>");
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    return s;
  };

  for (let raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { closeLists(); continue; }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeLists();
      const lvl = Math.min(6, h[1].length);
      out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`);
      continue;
    }
    const ul = line.match(/^\s*[-*•]\s+(.*)$/);
    if (ul) {
      if (inOl) { out.push("</ol>"); inOl = false; }
      if (!inUl) { out.push("<ul>"); inUl = true; }
      out.push(`<li>${inline(ul[1])}</li>`);
      continue;
    }
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ol) {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (!inOl) { out.push("<ol>"); inOl = true; }
      out.push(`<li>${inline(ol[1])}</li>`);
      continue;
    }
    closeLists();
    out.push(`<p>${inline(line)}</p>`);
  }
  closeLists();
  return out.join("");
};

/** React-friendly: returns props object for dangerouslySetInnerHTML. */
export const formattedHtmlProps = (input: string) => ({
  dangerouslySetInnerHTML: { __html: toFormattedHtml(input) },
});
