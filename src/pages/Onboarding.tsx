import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ApexLogo } from "@/components/ApexLogo";
import { SubjectCode, GRADES, Grade, getSubjectsForBoard, formatDuration } from "@/lib/subjects";
import { THEMES, applyTheme, getStoredTheme, ThemeName } from "@/lib/theme";
import { toast } from "sonner";
import { ArrowRight, Loader2, Check } from "lucide-react";

interface UnitInput {
  selected: boolean;
}
interface SubjectInput {
  selected: boolean;
  target_grade: Grade;
  current_grade: Grade;
  units: Record<number, UnitInput>;
}

const STATS = [
  "Students who study 45 mins/day improve by 1.5 grades on average.",
  "Spaced repetition beats cramming by 2x in long-term recall.",
  "Past paper practice in the final 2 weeks correlates with +1 grade.",
  "Daily streaks predict exam outcomes better than IQ.",
  "Active recall is 3x more effective than re-reading notes.",
];

// Sentinel date: 1 year out. Replaced by the user's actual scheduled tests
// from the new Exams page, which now drives urgency timers.
const sentinelFutureDate = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
};

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [board, setBoard] = useState<"edexcel-ial" | "cie">("edexcel-ial");
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [firstName, setFirstName] = useState("");
  const [needsName, setNeedsName] = useState(false);
  const [theme, setTheme] = useState<ThemeName>(() => getStoredTheme());

  // Live-apply theme as the user picks during onboarding
  useEffect(() => { applyTheme(theme); }, [theme]);

  // If the user signed in via Google (no first_name on profile), prompt for it.
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("first_name").eq("id", user.id).maybeSingle();
      const existing = (data?.first_name || "").trim();
      if (existing) {
        setFirstName(existing);
        setNeedsName(false);
      } else {
        const meta: any = (user as any)?.user_metadata || {};
        const fallback = (meta.given_name || meta.first_name || (meta.full_name || meta.name || "").split(" ")[0] || "").trim();
        if (fallback) setFirstName(fallback);
        setNeedsName(true);
      }
    })();
  }, [user]);

  const SUBJECT_LIST = Object.values(getSubjectsForBoard(board));

  const buildInitialSubjects = (b: "edexcel-ial" | "cie"): Record<SubjectCode, SubjectInput> => {
    const list = Object.values(getSubjectsForBoard(b));
    return list.reduce((a, s) => ({
      ...a,
      [s.code]: {
        selected: false,
        target_grade: "A" as Grade,
        current_grade: "C" as Grade,
        units: s.units.reduce((u, unit) => ({
          ...u,
          [unit.number]: { selected: !unit.aLevelOnly }
        }), {} as Record<number, UnitInput>),
      }
    }), {} as Record<SubjectCode, SubjectInput>);
  };

  const [subjects, setSubjects] = useState<Record<SubjectCode, SubjectInput>>(() => buildInitialSubjects("edexcel-ial"));
  const [statIdx, setStatIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleBoardChange = (b: "edexcel-ial" | "cie") => {
    setBoard(b);
    setSubjects(buildInitialSubjects(b));
  };

  const selectedSubjects = SUBJECT_LIST.filter(s => subjects[s.code]?.selected);
  const selectedCount = selectedSubjects.length;

  const updateSubject = (code: SubjectCode, patch: Partial<SubjectInput>) =>
    setSubjects(p => ({ ...p, [code]: { ...p[code], ...patch } }));
  const updateUnit = (code: SubjectCode, unitNum: number, patch: Partial<UnitInput>) =>
    setSubjects(p => ({
      ...p,
      [code]: {
        ...p[code],
        units: { ...p[code].units, [unitNum]: { ...p[code].units[unitNum], ...patch } }
      }
    }));

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const placeholderDate = sentinelFutureDate();
      const rows: any[] = [];
      for (const s of SUBJECT_LIST) {
        if (!subjects[s.code].selected) continue;
        for (const unit of s.units) {
          const u = subjects[s.code].units[unit.number];
          if (!u?.selected) continue;
          rows.push({
            user_id: user.id,
            subject: s.code,
            unit_number: unit.number,
            unit_name: unit.name,
            paper_duration_minutes: unit.durationMinutes,
            exam_date: placeholderDate, // user adds real dates via Exams page
            target_grade: subjects[s.code].target_grade,
            current_grade: subjects[s.code].current_grade,
          });
        }
      }
      if (rows.length === 0) throw new Error("Pick at least one unit.");

      await supabase.from("user_subjects").delete().eq("user_id", user.id);
      const { error: e1 } = await supabase.from("user_subjects").insert(rows);
      if (e1) throw e1;

      const profileUpdates: any = {
        onboarded: true,
        exam_board: board,
        hours_per_day: hoursPerDay,
      };
      if (firstName.trim()) profileUpdates.first_name = firstName.trim();
      const { error: e2 } = await supabase.from("profiles").update(profileUpdates).eq("id", user.id);
      if (e2) throw e2;

      // Build an "efficient revision" roadmap (no specific exam — just paced practice)
      try {
        const { generateAndPersistRoadmap } = await import("@/lib/persistRoadmap");
        await generateAndPersistRoadmap(
          user.id,
          rows.map(r => ({
            subject: r.subject,
            unit_number: r.unit_number,
            unit_name: r.unit_name,
            exam_date: r.exam_date,
            target_grade: r.target_grade,
            current_grade: r.current_grade,
          })),
          { weeklyMinutes: hoursPerDay * 60 * 7, studyStartTime: "16:00" }
        );
      } catch (rmErr) {
        console.error("Roadmap persistence failed", rmErr);
      }

      try {
        const { generateRoadmapForUser } = await import("@/lib/roadmapNodes");
        await generateRoadmapForUser(user.id);
      } catch (rnErr) {
        console.error("Node roadmap generation failed", rnErr);
      }

      setStep(4);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { clearInterval(interval); return 100; }
          return p + 2;
        });
        setStatIdx(i => (i + 1) % STATS.length);
      }, 80);
      setTimeout(() => navigate("/dashboard"), 4500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Setup failed");
      setLoading(false);
    }
  };

  if (step === 4) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--gradient-hero)" }}>
        <div className="text-center max-w-xl animate-fade-in">
          <ApexLogo size={48} className="justify-center mb-12" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Building your personalised<br/>revision roadmap…</h2>
          <p className="text-muted-foreground mb-12 font-mono text-sm h-6 transition-all">{STATS[statIdx]}</p>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-3 font-mono">{progress}%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <ApexLogo />
          <div className="font-mono text-xs text-muted-foreground">STEP {step + 1} / 4</div>
        </div>

        {step === 0 && (
          <div className="animate-in-up">
            {needsName && (
              <div className="glass-card rounded-2xl p-6 mb-8 max-w-md">
                <Label htmlFor="ob_name" className="text-sm font-semibold">What should we call you?</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-3">We'll use this name when your tutor talks to you.</p>
                <Input
                  id="ob_name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="e.g. Alex"
                  maxLength={40}
                  pattern="^[A-Za-z][A-Za-z'\- ]*$"
                  className="h-11"
                  autoFocus
                />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Which exam board?</h1>
            <p className="text-muted-foreground mb-10">We tailor every question, mark scheme and tip to your board.</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {([
                { id: "edexcel-ial" as const, name: "Edexcel IAL", sub: "International A-Level · Pearson", spec: "Units 1–6 (e.g. WCH11, WBI11)" },
                { id: "cie" as const, name: "Cambridge (CIE)", sub: "A Level · Cambridge International", spec: "9701, 9700, 9702, 9709" },
              ]).map(b => {
                const sel = board === b.id;
                return (
                  <button key={b.id} onClick={() => handleBoardChange(b.id)}
                    className={`glass-card rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-0.5 ${sel ? "border-primary glow-primary" : "hover:border-primary/30"}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="font-bold text-lg">{b.name}</div>
                      <Checkbox checked={sel} className="pointer-events-none data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">{b.sub}</div>
                    <div className="text-[11px] font-mono text-muted-foreground mt-2">Spec codes: {b.spec}</div>
                  </button>
                );
              })}
            </div>
            <Button
              size="lg"
              disabled={needsName && !firstName.trim()}
              onClick={() => {
                if (needsName && !/^[A-Za-z][A-Za-z'\- ]*$/.test(firstName.trim())) {
                  toast.error("Please enter a name (letters only).");
                  return;
                }
                setStep(1);
              }}
              className="bg-primary hover:bg-primary/90 h-12 px-8"
            >
              Continue with {board === "edexcel-ial" ? "Edexcel IAL" : "Cambridge"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Which subjects are you taking?</h1>
            <p className="text-muted-foreground mb-10">Pick all that apply. You'll choose units next.</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {SUBJECT_LIST.map(s => {
                const sel = subjects[s.code].selected;
                return (
                  <button
                    key={s.code}
                    onClick={() => updateSubject(s.code, { selected: !sel })}
                    className={`glass-card rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-0.5 ${sel ? "border-primary glow-primary" : "hover:border-primary/30"}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{s.emoji}</div>
                      <Checkbox checked={sel} className="pointer-events-none data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    </div>
                    <div className="font-bold text-lg">{s.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 font-mono">{board === "cie" ? "Cambridge A-Level" : "Edexcel A-Level"} · {s.spec}</div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(0)}>Back</Button>
              <Button size="lg" disabled={selectedCount === 0} onClick={() => setStep(2)} className="bg-primary hover:bg-primary/90 h-12 px-8">
                Continue with {selectedCount} {selectedCount === 1 ? "subject" : "subjects"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Which units are you studying?</h1>
            <p className="text-muted-foreground mb-10">
              Tick every unit you're covering this year. You can add specific tests, mocks or board exams from
              the <span className="text-primary font-semibold">Exams</span> tab whenever you have one scheduled.
            </p>
            <div className="space-y-6 mb-10">
              {selectedSubjects.map(s => (
                <div key={s.code} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                    <div className="text-2xl">{s.emoji}</div>
                    <div>
                      <div className="font-bold text-lg">{s.name}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{s.spec}</div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {s.units.map(unit => {
                      const u = subjects[s.code].units[unit.number];
                      return (
                        <label key={unit.number} className={`rounded-xl border p-3 transition-all flex items-start gap-3 cursor-pointer ${u.selected ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"}`}>
                          <Checkbox
                            checked={u.selected}
                            onCheckedChange={(v) => updateUnit(s.code, unit.number, { selected: !!v })}
                            className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <div className="flex-1 min-w-0">
                            <div>
                              <span className="font-mono text-xs text-primary mr-2">{unit.unitCode || `UNIT ${unit.number}`}</span>
                              <span className="font-semibold text-sm">{unit.name}</span>
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{unit.paperLabel} · {formatDuration(unit.durationMinutes)}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(1)}>Back</Button>
              <Button size="lg" onClick={() => setStep(3)} className="bg-primary hover:bg-primary/90 h-12 px-8">
                Set targets <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Targets and intensity.</h1>
            <p className="text-muted-foreground mb-10">How hard are you pushing, and for how many hours a day?</p>

            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold">Daily study hours</Label>
                <div className="font-mono text-2xl font-bold text-primary tabular">{hoursPerDay}h</div>
              </div>
              <Slider
                value={[hoursPerDay]}
                onValueChange={(v) => setHoursPerDay(v[0])}
                min={1}
                max={8}
                step={0.5}
                className="mt-4"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-2">
                <span>Light · 1h</span>
                <span>Steady · 2–3h</span>
                <span>Heavy · 5h+</span>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Your roadmap will pace topics so you cover roughly this much per day. You can change it anytime in Settings.
              </p>
            </div>

            <div className="space-y-4 mb-10">
              {selectedSubjects.map(s => (
                <div key={s.code} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">{s.emoji}</div>
                    <div className="font-bold text-lg">{s.name}</div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Target grade</Label>
                      <select value={subjects[s.code].target_grade}
                        onChange={e => updateSubject(s.code, { target_grade: e.target.value as Grade })}
                        className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Currently predicted</Label>
                      <select value={subjects[s.code].current_grade}
                        onChange={e => updateSubject(s.code, { current_grade: e.target.value as Grade })}
                        className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(2)}>Back</Button>
              <Button size="lg" onClick={handleSubmit} disabled={loading} className="bg-primary hover:bg-primary/90 h-12 px-8">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Build my roadmap <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
