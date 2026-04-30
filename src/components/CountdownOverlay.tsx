import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { ChevronDown } from "lucide-react";
import { parseLocalDate } from "@/lib/dateLocal";

interface UnitRow {
  subject: SubjectCode;
  unit_number: number;
  unit_name: string;
  exam_date: string;
}

const subjectDot: Record<SubjectCode, string> = {
  mathematics: "#3B82F6",
  biology: "#16A34A",
  chemistry: "#9333EA",
  physics: "#F97316",
};

function urgencyMessage(days: number): { text: string; color: string; pulse: boolean } {
  if (days < 3) return { text: "Final stretch.", color: "#DC2626", pulse: true };
  if (days < 7) return { text: "No days off.", color: "#DC2626", pulse: false };
  if (days < 15) return { text: "Every session counts.", color: "#D97706", pulse: false };
  if (days < 30) return { text: "Stay on plan.", color: "#D97706", pulse: false };
  return { text: "", color: "rgba(240,246,252,0.6)", pulse: false };
}

function formatExamDate(iso: string) {
  return parseLocalDate(iso).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
  });
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

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  if (hide || units.length === 0) return null;

  const now = Date.now();
  const upcoming = units
    .map(u => {
      // Anchor exam at 09:00 local on the exam date
      const examLocal = parseLocalDate(u.exam_date);
      examLocal.setHours(9, 0, 0, 0);
      const ms = examLocal.getTime() - now;
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
  const msg = urgencyMessage(next.days);
  const unitLabel = `${meta.name} ${meta.units.find(u => u.number === next.unit_number)?.name ?? `Unit ${next.unit_number}`}`;

  return (
    <>
      <div
        className="fixed top-0 inset-x-0 z-50 select-none"
        style={{
          height: 44,
          background: "#161B22",
          borderBottom: "1px solid #30363D",
          color: "rgba(240,246,252,0.8)",
        }}
      >
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full h-full flex items-center justify-between px-4 md:px-6 hover:bg-[#1C2128] transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0 text-[13px] font-medium">
            <span
              className={`h-2 w-2 rounded-full shrink-0 ${msg.pulse ? "animate-slow-pulse" : ""}`}
              style={{ background: subjectDot[next.subject] }}
            />
            <span className="truncate" style={{ color: "rgba(240,246,252,0.8)" }}>
              {unitLabel}
            </span>
            <span className="opacity-50 shrink-0">—</span>
            <span className="font-mono tabular shrink-0" style={{ color: "rgba(240,246,252,0.8)" }}>
              {next.days}d {next.hours}h
            </span>
            {msg.text && (
              <>
                <span className="opacity-50 shrink-0 hidden sm:inline">·</span>
                <span className="hidden sm:inline shrink-0" style={{ color: msg.color }}>
                  {msg.text}
                </span>
              </>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform shrink-0 ml-2 ${open ? "rotate-180" : ""}`}
            style={{ color: "rgba(240,246,252,0.6)" }}
          />
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed left-0 right-0 z-50 animate-in-up"
            style={{
              top: 44,
              background: "#161B22",
              borderBottom: "1px solid #30363D",
              borderLeft: "1px solid #30363D",
              borderRight: "1px solid #30363D",
            }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="px-5 py-2.5 text-[10px] uppercase tracking-widest" style={{ color: "rgba(240,246,252,0.5)" }}>
                All upcoming exams
              </div>
              <div className="max-h-[60vh] overflow-y-auto" style={{ borderTop: "1px solid #30363D" }}>
                {upcoming.map(u => {
                  const m = SUBJECTS[u.subject];
                  const uMsg = urgencyMessage(u.days);
                  const uName = m.units.find(x => x.number === u.unit_number)?.name ?? `Unit ${u.unit_number}`;
                  return (
                    <div
                      key={`${u.subject}-${u.unit_number}`}
                      className="flex items-center gap-3 px-5 py-3 text-[13px] hover:bg-[#1C2128] transition-colors"
                      style={{ borderBottom: "1px solid #21262D" }}
                    >
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: subjectDot[u.subject] }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate" style={{ color: "#F0F6FC" }}>
                          {m.name} · {uName}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: "rgba(240,246,252,0.5)" }}>
                          {formatExamDate(u.exam_date)}
                        </div>
                      </div>
                      <div className="font-mono text-[13px] tabular font-semibold shrink-0" style={{ color: uMsg.color === "rgba(240,246,252,0.6)" ? "rgba(240,246,252,0.8)" : uMsg.color }}>
                        {u.days}d {u.hours}h
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
