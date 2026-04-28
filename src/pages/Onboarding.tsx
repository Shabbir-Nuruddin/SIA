import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ApexLogo } from "@/components/ApexLogo";
import { SUBJECT_LIST, SubjectCode, GRADES, Grade } from "@/lib/subjects";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

interface SubjectInput {
  selected: boolean;
  exam_date: string;
  target_grade: Grade;
  current_grade: Grade;
}

const STATS = [
  "Students who study 45 mins/day improve by 1.5 grades on average.",
  "Spaced repetition beats cramming by 2x in long-term recall.",
  "Past paper practice in the final 2 weeks correlates with +1 grade.",
  "Daily streaks predict exam outcomes better than IQ.",
  "Active recall is 3x more effective than re-reading notes.",
];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState<Record<SubjectCode, SubjectInput>>(() =>
    SUBJECT_LIST.reduce((a, s) => ({
      ...a,
      [s.code]: { selected: false, exam_date: "2026-06-01", target_grade: "A", current_grade: "C" }
    }), {} as Record<SubjectCode, SubjectInput>)
  );
  const [statIdx, setStatIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const selectedCount = Object.values(subjects).filter(s => s.selected).length;

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const rows = SUBJECT_LIST
        .filter(s => subjects[s.code].selected)
        .map(s => ({
          user_id: user.id,
          subject: s.code,
          exam_date: subjects[s.code].exam_date,
          target_grade: subjects[s.code].target_grade,
          current_grade: subjects[s.code].current_grade,
        }));
      const { error: e1 } = await supabase.from("user_subjects").upsert(rows, { onConflict: "user_id,subject" });
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("profiles").update({ onboarded: true }).eq("id", user.id);
      if (e2) throw e2;

      // Animated roadmap loader
      setStep(3);
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

  if (step === 3) {
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
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <ApexLogo />
          <div className="font-mono text-xs text-muted-foreground">STEP {step} / 2</div>
        </div>

        {step === 1 && (
          <div className="animate-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Which subjects are you taking?</h1>
            <p className="text-muted-foreground mb-10">Pick all that apply. You can change these later.</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {SUBJECT_LIST.map(s => {
                const sel = subjects[s.code].selected;
                return (
                  <button
                    key={s.code}
                    onClick={() => setSubjects(prev => ({ ...prev, [s.code]: { ...prev[s.code], selected: !sel } }))}
                    className={`glass-card rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-0.5 ${sel ? "border-primary glow-primary" : "hover:border-primary/30"}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{s.emoji}</div>
                      <Checkbox checked={sel} className="pointer-events-none data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    </div>
                    <div className="font-bold text-lg">{s.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">Edexcel A-Level</div>
                  </button>
                );
              })}
            </div>
            <Button
              size="lg"
              disabled={selectedCount === 0}
              onClick={() => setStep(2)}
              className="bg-primary hover:bg-primary/90 h-12 px-8"
            >
              Continue with {selectedCount} {selectedCount === 1 ? "subject" : "subjects"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Set your targets.</h1>
            <p className="text-muted-foreground mb-10">When are your exams and what grades are you fighting for?</p>
            <div className="space-y-4 mb-10">
              {SUBJECT_LIST.filter(s => subjects[s.code].selected).map(s => (
                <div key={s.code} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">{s.emoji}</div>
                    <div className="font-bold text-lg">{s.name}</div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Exam date</Label>
                      <Input type="date" value={subjects[s.code].exam_date}
                        onChange={e => setSubjects(p => ({ ...p, [s.code]: { ...p[s.code], exam_date: e.target.value } }))}
                        className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Target grade</Label>
                      <select value={subjects[s.code].target_grade}
                        onChange={e => setSubjects(p => ({ ...p, [s.code]: { ...p[s.code], target_grade: e.target.value as Grade } }))}
                        className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Currently predicted</Label>
                      <select value={subjects[s.code].current_grade}
                        onChange={e => setSubjects(p => ({ ...p, [s.code]: { ...p[s.code], current_grade: e.target.value as Grade } }))}
                        className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(1)}>Back</Button>
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
