interface Props { size?: number; showWord?: boolean; className?: string; }

export const ApexLogo = ({ size = 32, showWord = true, className = "" }: Props) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Apex logo">
      <defs>
        <linearGradient id="apex-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(244 100% 70%)" />
          <stop offset="1" stopColor="hsl(264 100% 72%)" />
        </linearGradient>
        <linearGradient id="apex-bolt" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(36 92% 60%)" />
          <stop offset="1" stopColor="hsl(28 100% 55%)" />
        </linearGradient>
      </defs>
      <path d="M20 4L36 34H4L20 4Z" fill="url(#apex-g)" />
      <path d="M22 14L15 24H20L18 32L26 20H21L22 14Z" fill="url(#apex-bolt)" />
    </svg>
    {showWord && (
      <span className="font-extrabold tracking-tight text-xl">
        APEX
      </span>
    )}
  </div>
);
