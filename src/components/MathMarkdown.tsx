import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";

/**
 * Renders markdown with proper math formatting.
 * Supports:
 *  - $...$ inline math, $$...$$ block math (LaTeX)
 *  - Inline shortcuts: x^2, H_2O, 1/2 (rendered as fractions when written `\frac{a}{b}`)
 *  - Standard markdown (bold, lists, code, tables)
 *
 * If the source uses plain `^` and `_` outside of `$…$` (e.g. "x^2"), we
 * lightly preprocess them into `$x^2$` style so superscripts/subscripts
 * still render correctly.
 */

// Heuristic preprocessor: wrap simple math-looking tokens in $...$ so KaTeX picks them up.
// Only triggers when the token clearly looks mathematical to avoid breaking prose.
function autoMath(input: string): string {
  // Already-LaTeX expressions remain untouched (between $ … $ or $$ … $$).
  // We split on $...$ blocks and only transform the parts outside them.
  const parts = input.split(/(\$\$[\s\S]+?\$\$|\$[^\n$]+?\$)/g);
  return parts
    .map((part, i) => {
      // Odd indices are the math segments — leave alone.
      if (i % 2 === 1) return part;
      let p = part;
      // Convert simple x^2, x^{2}, H_2, H_{2}, a^b/c into $...$
      // 1) variable or digit followed by ^digit/letter or ^{...}
      p = p.replace(/(\b[A-Za-z0-9]\^(?:\{[^}]+\}|[A-Za-z0-9+\-]+))/g, "$$$1$$");
      p = p.replace(/(\b[A-Za-z0-9]_(?:\{[^}]+\}|[A-Za-z0-9+\-]+))/g, "$$$1$$");
      // 2) explicit \frac stays as math
      p = p.replace(/(\\frac\{[^}]+\}\{[^}]+\})/g, "$$$1$$");
      return p;
    })
    .join("");
}

interface Props {
  children: string;
  className?: string;
  inline?: boolean;
}

export const MathMarkdown = ({ children, className = "", inline = false }: Props) => {
  const processed = autoMath(children ?? "");
  const Tag = inline ? "span" : "div";
  return (
    <Tag className={`math-md ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {processed}
      </ReactMarkdown>
    </Tag>
  );
};

export default MathMarkdown;
