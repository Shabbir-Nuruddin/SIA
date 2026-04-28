import { useEffect, useState } from "react";
import { differenceInSeconds, parseISO } from "date-fns";

interface Props { examDate: string; subjectName: string; emoji: string; large?: boolean; }

export const CountdownCard = ({ examDate, subjectName, emoji, large }: Props) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const exam = parseISO(examDate);
  const totalSeconds = Math.max(0, differenceInSeconds(exam, new Date(now)));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  // Ring depletes from 365 days
  const fullCycle = 365 * 86400;
  const ratio = Math.min(1, totalSeconds / fullCycle);
  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - ratio);

  const urgent = days < 30;
  const ringColor = urgent ? "hsl(var(--urgent))" : days < 90 ? "hsl(var(--accent))" : "hsl(var(--primary))";

  if (large) {
    return (
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 opacity-20 -translate-y-8 translate-x-8">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
            <circle cx="50" cy="50" r="42" fill="none" stroke={ringColor} strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 50 50)" />
          </svg>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{emoji}</span>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{subjectName}</div>
        </div>
        <div className="font-mono text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: urgent ? "hsl(var(--urgent))" : "hsl(var(--foreground))" }}>
          {days}<span className="text-lg text-muted-foreground ml-1">d</span>{" "}
          {String(hours).padStart(2, "0")}<span className="text-lg text-muted-foreground">h</span>{" "}
          {String(mins).padStart(2, "0")}<span className="text-lg text-muted-foreground">m</span>{" "}
          <span className="animate-tick">{String(secs).padStart(2, "0")}</span><span className="text-lg text-muted-foreground">s</span>
        </div>
        <div className="text-xs text-muted-foreground mt-2 font-mono">EXAM · {exam.toDateString()}</div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-4">
      <div className="relative w-14 h-14 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <circle cx="50" cy="50" r="42" fill="none" stroke={ringColor} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-lg">{emoji}</div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wider text-muted-foreground truncate">{subjectName}</div>
        <div className="font-mono font-bold text-lg" style={{ color: urgent ? "hsl(var(--urgent))" : "hsl(var(--foreground))" }}>
          {days}d {String(hours).padStart(2, "0")}h
        </div>
      </div>
    </div>
  );
};
