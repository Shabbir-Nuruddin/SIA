import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { ChevronDown } from "lucide-react";
import { parseLocalDate } from "@/lib/dateLocal";

interface ExamRow {
  id?: string;
  subject: SubjectCode | null;
  unit_numbers?: number[];
  unit_number?: number; // legacy from user_subjects
  unit_name?: string;
  exam_date: string;
  name?: string;
  exam_type?: string;
}

const subjectDot: Record<string, string> = {
  mathematics: "#3B82F6",
  biology: "#16A34A",
  chemistry: "#9333EA",
  physics: "#F97316",
  _none: "hsl(var(--muted-foreground))",
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

export const CountdownOverlay = ({ onVisibilityChange }: { onVisibilityChange?: (visible: boolean) => void } = {}) => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [items, setItems] = useState<ExamRow[]>([]);
  const [open, setOpen] = useState(false);
  const [, setTick] = useState(0);

  const hide = pathname.startsWith("/mock-papers/exam") || !user;

  useEffect(() => {
    if (!user) return;
    (async () => {
      // Only show countdowns for exams the user has explicitly scheduled.
      // We do NOT fall back to user_subjects placeholder dates — those are
      // sentinel "1 year out" values from onboarding and would lie to the user.
      const { data: exams } = await supabase
        .from("exams")
        .select("id, name, exam_type, subject, unit_numbers, exam_date, is_active")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("exam_date");

      setItems((exams ?? []) as any);
    })();
  }, [user, pathname]);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const now = Date.now();
  // Upcoming = scheduled exams not yet more than a day past (so a passed exam
  // automatically drops off and the top bar collapses on its own).
  const upcoming = items
    .map(u => {
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

  // Report visibility so the layout only reserves top padding when the bar shows.
  const visible = !hide && upcoming.length > 0;
  useEffect(() => { onVisibilityChange?.(visible); }, [visible, onVisibilityChange]);

  if (!visible) return null;
  const next = upcoming[0];
  const meta = next.subject ? SUBJECTS[next.subject as SubjectCode] : null;
  const msg = urgencyMessage(next.days);

  // Build label
  let label: string;
  if (next.name) {
    label = next.name;
  } else if (meta && next.unit_number != null) {
    const u = meta.units.find(u => u.number === next.unit_number);
    label = `${meta.name} ${u?.name ?? `Unit ${next.unit_number}`}`;
  } else if (meta) {
    label = meta.name;
  } else {
    label = "Upcoming exam";
  }

  return (
    <>
      <div
        data-tutorial="countdown-bar"
        className="fixed top-0 inset-x-0 z-50 select-none"
        style={{
          height: 44,
          background: "#161B22",
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
              style={{ background: subjectDot[(next.subject as string) ?? "_none"] }}
            />
            <span className="truncate" style={{ color: "rgba(240,246,252,0.8)" }}>
              {label}
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
                  const m = u.subject ? SUBJECTS[u.subject as SubjectCode] : null;
                  const uMsg = urgencyMessage(u.days);
                  let uLabel: string;
                  if (u.name) uLabel = u.name;
                  else if (m && u.unit_number != null) {
                    const uu = m.units.find(x => x.number === u.unit_number);
                    uLabel = `${m.name} · ${uu?.name ?? `Unit ${u.unit_number}`}`;
                  } else uLabel = m?.name ?? "Upcoming exam";
                  return (
                    <div
                      key={`${u.id ?? u.subject}-${u.unit_number ?? "x"}-${u.exam_date}`}
                      className="flex items-center gap-3 px-5 py-3 text-[13px] hover:bg-[#1C2128] transition-colors"
                      style={{ borderBottom: "1px solid #21262D" }}
                    >
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: subjectDot[(u.subject as string) ?? "_none"] }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate" style={{ color: "#F0F6FC" }}>
                          {uLabel}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: "rgba(240,246,252,0.5)" }}>
                          {formatExamDate(u.exam_date)}
                          {u.exam_type ? ` · ${u.exam_type}` : ""}
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
