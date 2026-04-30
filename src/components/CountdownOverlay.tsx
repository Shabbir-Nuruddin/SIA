import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { ChevronDown } from "lucide-react";

interface UnitRow {
  subject: SubjectCode;
  unit_number: number;
  unit_name: string;
  exam_date: string;
}

const subjectDot: Record<SubjectCode, string> = {
  mathematics: "hsl(var(--subject-maths))",
  biology: "hsl(var(--subject-biology))",
  chemistry: "hsl(var(--subject-chemistry))",
  physics: "hsl(var(--subject-physics))",
};

function urgencyColor(days: number, hours: number) {
  if (days < 1) return { bg: "hsl(var(--urgent))", text: "#fff", pulse: true };
  if (days < 3) return { bg: "hsl(var(--urgent))", text: "#fff", pulse: false };
  if (days < 7) return { bg: "hsl(var(--urgent))", text: "#fff", pulse: false };
  if (days < 15) return { bg: "hsl(var(--accent))", text: "#fff", pulse: false };
  if (days < 30) return { bg: "hsl(32 94% 38%)", text: "#fff", pulse: false };
  return { bg: "hsl(var(--primary))", text: "#fff", pulse: false };
}

function urgencyLine(unitName: string, days: number) {
  if (days < 1) return `${unitName} — exam day. Final review only.`;
  if (days < 3) return `${unitName} — ${days} days. Revise everything.`;
  if (days < 7) return `${unitName} — ${days} days left. No days off.`;
  if (days < 15) return `${unitName} — ${days} days. Every session counts.`;
  if (days < 30) return `${unitName} — ${days} days. Stay on plan.`;
  return `${unitName} — ${days} days away`;
}

export const CountdownOverlay = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [open, setOpen] = useState(false);
  const [, setTick] = useState(0);

  const hide = pathname.startsWith("/mock-papers/exam") || !user;

  useEffect(() => {
    if (!user) return;
    supabase.from("user_subjects")
      .select("subject,unit_number,unit_name,exam_date")
      .eq("user_id", user.id)
      .order("exam_date")
      .then(({ data }) => { if (data) setUnits(data as UnitRow[]); });
  }, [user, pathname]);

  // Re-render every minute so days/hours stay live
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  if (hide || units.length === 0) return null;

  const now = Date.now();
  const upcoming = units
    .map(u => {
      const ms = new Date(u.exam_date + "T09:00:00").getTime() - now;
      const totalH = Math.max(0, Math.floor(ms / 3_600_000));
      const days = Math.floor(totalH / 24);
      const hours = totalH % 24;
      return { ...u, days, hours, ms };
    })
    .filter(u => u.ms >= -86_400_000)
    .sort((a, b) => a.ms - b.ms);

  if (upcoming.length === 0) return null;
  const next = upcoming[0];
  const meta = SUBJECTS[next.subject];
  const c = urgencyColor(next.days, next.hours);
  const label = `${meta.name} U${next.unit_number}`;

  return (
    <>
      <div
        className={`fixed top-0 inset-x-0 z-50 select-none ${c.pulse ? "animate-slow-pulse" : ""}`}
        style={{ height: 40, background: c.bg, color: c.text, borderBottom: "1px solid rgba(0,0,0,0.2)" }}
      >
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full h-full flex items-center justify-center gap-2.5 text-[13px] font-medium hover:brightness-110 transition px-4"
        >
          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: subjectDot[next.subject], boxShadow: "0 0 0 2px rgba(255,255,255,0.2)" }} />
          <span className="truncate">{urgencyLine(label, next.days)}</span>
          <span className="font-mono font-bold tabular tracking-tight whitespace-nowrap">
            {next.days}d {next.hours}h
          </span>
          <ChevronDown className={`h-3.5 w-3.5 opacity-70 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed top-10 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,560px)] surface shadow-2xl animate-in-up overflow-hidden"
            style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          >
            <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              All upcoming exams
            </div>
            <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
              {upcoming.map(u => {
                const m = SUBJECTS[u.subject];
                return (
                  <div key={`${u.subject}-${u.unit_number}`} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-card-hover">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: subjectDot[u.subject] }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">{m.name} · Unit {u.unit_number}</div>
                      <div className="text-xs text-muted-foreground truncate">{u.unit_name}</div>
                    </div>
                    <div className="font-mono text-sm font-bold tabular shrink-0" style={{ color: u.days < 30 ? "hsl(var(--accent))" : "hsl(var(--foreground))" }}>
                      {u.days}d {u.hours}h
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};
