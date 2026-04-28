import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const WORK = 25 * 60;
const BREAK = 5 * 60;

export const PomodoroTimer = ({ topic, subject }: { topic?: string; subject?: string }) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<"work" | "break">("work");
  const [seconds, setSeconds] = useState(WORK);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            playChime();
            handleComplete();
            return mode === "work" ? BREAK : WORK;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode]);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880; o.type = "sine";
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      o.start(); o.stop(ctx.currentTime + 0.6);
    } catch {}
  };

  const handleComplete = async () => {
    if (mode === "work" && user) {
      try {
        await supabase.from("study_sessions").insert({
          user_id: user.id,
          subject: subject as any,
          topic: topic || null,
          duration_minutes: 25,
        });
        // Increment streak/XP
        const today = new Date().toISOString().split("T")[0];
        const { data: profile } = await supabase.from("profiles").select("xp,current_streak,last_session_date").eq("id", user.id).single();
        if (profile) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
          const newStreak = profile.last_session_date === today
            ? profile.current_streak
            : profile.last_session_date === yesterday
              ? profile.current_streak + 1
              : 1;
          await supabase.from("profiles").update({
            xp: (profile.xp || 0) + 25,
            current_streak: newStreak,
            last_session_date: today,
          }).eq("id", user.id);
        }
        toast.success("🔥 Session complete! +25 XP");
      } catch {}
    }
    setMode(m => m === "work" ? "break" : "work");
  };

  const total = mode === "work" ? WORK : BREAK;
  const ratio = seconds / total;
  const circumference = 2 * Math.PI * 90;

  const reset = () => { setRunning(false); setSeconds(mode === "work" ? WORK : BREAK); };

  return (
    <div className="glass-card rounded-2xl p-6 text-center">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{mode === "work" ? "Focus" : "Break"}</div>
      {topic && <div className="text-sm text-foreground/80 mb-4 truncate">{topic}</div>}
      <div className="relative w-48 h-48 mx-auto mb-4">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <circle cx="100" cy="100" r="90" fill="none"
            stroke={mode === "work" ? "hsl(var(--primary))" : "hsl(var(--success))"}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - ratio)}
            style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-4xl font-extrabold">
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <Button onClick={() => setRunning(r => !r)} className="bg-primary hover:bg-primary/90 px-6">
          {running ? <><Pause className="h-4 w-4 mr-2" />Pause</> : <><Play className="h-4 w-4 mr-2" />Start</>}
        </Button>
        <Button onClick={reset} variant="outline" size="icon"><RotateCcw className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};
