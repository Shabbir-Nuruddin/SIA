interface Props {
  size?: number;
  showWord?: boolean;
  showTagline?: boolean;
  className?: string;
}

/**
 * Make Me Revise logo — custom SVG monogram.
 *
 * Design notes
 * ------------
 * - "MMR" letterforms are drawn as a single continuous geometric mark, with
 *   the centre M sharing its peak with an upward arrow — the "rising" idea
 *   that ties to the Apex/Make-Me-Revise revision narrative.
 * - Uses the design tokens `--primary` (blue) and `--accent` (amber) via
 *   `hsl(var(...))`, so it automatically retunes when the theme changes.
 * - Component name kept as `ApexLogo` so we don't have to touch every import.
 */
export const ApexLogo = ({
  size = 32,
  showWord = true,
  showTagline = false,
  className = "",
}: Props) => {
  const id = `mmr-${size}`;
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Make Me Revise logo"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="hsl(var(--primary) / 0.18)" />
            <stop offset="1" stopColor="hsl(var(--accent) / 0.10)" />
          </linearGradient>
          <linearGradient id={`${id}-letters`} x1="0" y1="14" x2="0" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="hsl(var(--foreground))" />
            <stop offset="1" stopColor="hsl(var(--foreground) / 0.78)" />
          </linearGradient>
          <linearGradient id={`${id}-arrow`} x1="24" y1="6" x2="24" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="hsl(var(--accent))" />
            <stop offset="1" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>

        {/* Rounded tile */}
        <rect x="0.5" y="0.5" width="47" height="47" rx="11" fill={`url(#${id}-bg)`} stroke="hsl(var(--border))" />

        {/* Subtle inner glow */}
        <rect x="3" y="3" width="42" height="42" rx="9" fill="none" stroke="hsl(var(--primary) / 0.25)" strokeWidth="0.6" />

        {/*
          MMR monogram — single stroked path, geometric.
          Drawn at 1.6 stroke; the centre M's peak intentionally aligns with
          the tip of the rising arrow above it.
        */}
        <g
          stroke={`url(#${id}-letters)`}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Left M */}
          <path d="M7 34 V18 L12 26 L17 18 V34" />
          {/* Centre M (slightly smaller — sits behind arrow) */}
          <path d="M19 34 V20 L24 27 L29 20 V34" opacity="0.55" />
          {/* R */}
          <path d="M32 34 V18 H37 a4 4 0 0 1 0 8 H32 M36 26 L41 34" />
        </g>

        {/* Rising arrow piercing the centre M */}
        <path
          d="M24 32 V12 M19 17 L24 12 L29 17"
          stroke={`url(#${id}-arrow)`}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Accent dot (top-right "spark") */}
        <circle cx="38" cy="9" r="2" fill="hsl(var(--accent))" />
      </svg>

      {showWord && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold tracking-tight text-base">
            Make Me Revise
          </span>
          {showTagline && (
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mt-1">
              Revise smart, score higher
            </span>
          )}
        </div>
      )}
    </div>
  );
};
