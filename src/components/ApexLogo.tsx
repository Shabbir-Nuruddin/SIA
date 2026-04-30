interface Props { size?: number; showWord?: boolean; className?: string; }

// Make Me Revise logo — open book with a rising spark/checkmark.
// (Component name kept as ApexLogo to avoid touching every import site.)
export const ApexLogo = ({ size = 32, showWord = true, className = "" }: Props) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Make Me Revise logo">
      <defs>
        <linearGradient id="mmr-book" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(217 80% 65%)" />
          <stop offset="1" stopColor="hsl(217 70% 48%)" />
        </linearGradient>
        <linearGradient id="mmr-spark" x1="20" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(36 95% 62%)" />
          <stop offset="1" stopColor="hsl(28 100% 52%)" />
        </linearGradient>
      </defs>
      {/* Open book */}
      <path
        d="M5 12c4-2 9-2 13 0v20c-4-2-9-2-13 0V12z"
        fill="url(#mmr-book)"
      />
      <path
        d="M35 12c-4-2-9-2-13 0v20c4-2 9-2 13 0V12z"
        fill="url(#mmr-book)"
        opacity="0.85"
      />
      <path d="M18 12v20M22 12v20" stroke="hsl(220 18% 11%)" strokeWidth="0.8" />
      {/* Spark / upward checkmark */}
      <path
        d="M20 4l2.2 4.6L27 10l-3.6 3.2.9 4.8L20 15.6 15.7 18l.9-4.8L13 10l4.8-1.4L20 4z"
        fill="url(#mmr-spark)"
      />
    </svg>
    {showWord && (
      <span className="font-extrabold tracking-tight text-base leading-none">
        Make Me Revise
      </span>
    )}
  </div>
);
