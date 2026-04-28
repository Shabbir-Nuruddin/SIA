import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SUBJECTS, SubjectCode, formatDuration } from "@/lib/subjects";
import { differenceInDays, parseISO, format } from "date-fns";
import { ChevronDown } from "lucide-react";

interface UnitRow {
  subject: SubjectCode;
  unit_number: number;
  unit_name: string;
  exam_date: string;
  paper_duration_minutes: number;
}

export const CountdownOverlay = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [open, setOpen] = useState(false);

  // Hide entirely during a mock paper exam
  const hide = pathname.startsWith("/mock-papers/exam") || !user;

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_subjects")
      .select("subject,unit_number,unit_name,exam_date,paper_duration_minutes")
      .eq("user_id", user.id)
      .order("exam_date")
      .then(({ data }) => { if (data) setUnits(data as UnitRow[]); });
  }, [user, pathname]);

  if (hide || units.length === 0) return null;

  const upcoming = units
    .map(u => ({ ...u, days: differenceInDays(parseISO(u.exam_date), new Date()) }))
    .filter(u => u.days >= 0)
    .sort((a, b) => a.days - b.days);

  if (upcoming.length === 0) return null;

  const next = upcoming[0];
  const meta = SUBJECTS[next.subject];
  const amber = next.days < 30;

  return (
    <>
      <div
        className="fixed top-0 inset-x-0 z-50 select-none"
        style={{ height: 36, background: "#080810", borderBottom: "1px solid hsl(var(--border))" }}
      >
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full h-full flex items-center justify-center gap-2 text-xs font-mono tracking-wide hover:bg-white/[0.02] transition-colors"
          style={{ color: amber ? "#F5A623" : "rgba(255,255,255,0.7)" }}
        >
          <span className="text-base leading-none">{meta.emoji}</span>
          <span className="font-semibold">
            {meta.name} Unit {next.unit_number}
          </span>
          <span className="opacity-60">—</span>
          <span className="font-bold">{next.days} days</span>
          <ChevronDown className={`h-3 w-3 ml-1 opacity-50 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed top-9 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,640px)] rounded-b-xl border border-t-0 border-border shadow-2xl animate-in-up"
            style={{ background: "#0B0B14" }}
          >
            <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-mono border-b border-border">
              All upcoming exams
            </div>
            <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
              {upcoming.map(u => {
                const m = SUBJECTS[u.subject];
                const a = u.days < 30;
                return (
                  <div key={`${u.subject}-${u.unit_number}`} className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm">
                    <div className="col-span-1 text-lg">{m.emoji}</div>
                    <div className="col-span-5">
                      <div className="font-semibold leading-tight">{m.name}</div>
                      <div className="text-xs text-muted-foreground">Unit {u.unit_number} · {u.unit_name}</div>
                    </div>
                    <div className="col-span-3 text-xs text-muted-foreground font-mono">
                      {format(parseISO(u.exam_date), "d MMM yyyy")} · {formatDuration(u.paper_duration_minutes)}
                    </div>
                    <div className="col-span-3 text-right font-mono font-bold" style={{ color: a ? "#F5A623" : "hsl(var(--foreground))" }}>
                      {u.days} days
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
