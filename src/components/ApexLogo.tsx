interface Props {
  size?: number;
  showWord?: boolean;
  showTagline?: boolean;
  className?: string;
}

/**
 * SIA Smart Revision logo — the official SIA crest (public/sia-logo.png) plus the
 * wordmark. Component name kept as `ApexLogo` so existing imports don't change.
 */
export const ApexLogo = ({
  size = 32,
  showWord = true,
  showTagline = false,
  className = "",
}: Props) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/sia-logo.png"
        alt="SIA Smart Revision logo"
        width={size}
        height={size}
        className="shrink-0 rounded-full object-contain"
        style={{ width: size, height: size }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />

      {showWord && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold tracking-tight text-base" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: "hsl(var(--primary))" }}>
            SIA Smart Revision
          </span>
          {showTagline && (
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mt-1">
              Scholars International Academy
            </span>
          )}
        </div>
      )}
    </div>
  );
};
