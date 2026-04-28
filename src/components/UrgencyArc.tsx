interface Props { value: number; level: "urgent" | "moderate" | "track"; }

export const UrgencyArc = ({ value, level }: Props) => {
  const color = level === "urgent" ? "hsl(var(--urgent))" : level === "moderate" ? "hsl(var(--accent))" : "hsl(var(--success))";
  const label = level === "urgent" ? "URGENT" : level === "moderate" ? "MODERATE" : "ON TRACK";
  // Half-circle arc
  const radius = 60;
  const circumference = Math.PI * radius; // half
  const offset = circumference * (1 - value / 100);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Urgency Score</div>
      <div className="relative h-24">
        <svg viewBox="0 0 160 90" className="w-full h-full">
          <path d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none" stroke="hsl(var(--border))" strokeWidth="10" strokeLinecap="round" />
          <path d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }} />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <div className="font-mono text-3xl font-extrabold" style={{ color }}>{value}</div>
          <div className="text-[10px] font-bold tracking-widest" style={{ color }}>{label}</div>
        </div>
      </div>
    </div>
  );
};
