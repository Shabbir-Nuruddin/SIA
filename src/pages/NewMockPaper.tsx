import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { SUBJECTS, SubjectCode, SUBJECT_LIST, formatDuration, minutesPerMark } from "@/lib/subjects";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

type Difficulty = "foundation" | "mixed" | "challenge";

const MATHS_QTYPES = ["Multiple choice", "Short calculation", "Proof question", "Extended calculation", "Show that", "Graph interpretation"];
const SCI_QTYPES = ["Multiple choice", "Short answer (1-2 marks)", "Calculation (3-4 marks)", "Describe/Explain (4-6 marks)", "Extended response (6 marks)", "Data analysis", "Practical question"];

const NewMockPaper = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [subject, setSubject] = useState<SubjectCode>((params.get("subject") as SubjectCode) || "mathematics");
  const [enrolledUnits, setEnrolledUnits] = useState<number[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [totalMarks, setTotalMarks] = useState(80);
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [customTime, setCustomTime] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [phase, setPhase] = useState<"setup" | "loading">("setup");

  const meta = SUBJECTS[subject];
  const qtypes = subject === "mathematics" ? MATHS_QTYPES : SCI_QTYPES;

  // Load enrolled units for chosen subject
  useEffect(() => {
    if (!user) return;
    supabase.from("user_subjects")
      .select("unit_number")
      .eq("user_id", user.id)
      .eq("subject", subject)
      .then(({ data }) => {
        const nums = (data || []).map((r: any) => r.unit_number).sort();
        setEnrolledUnits(nums);
        const presetUnit = params.get("unit");
        const preset = presetUnit ? [Number(presetUnit)].filter(n => nums.includes(n)) : nums;
        setSelectedUnits(preset.length ? preset : nums);
      });
  }, [user, subject]); // eslint-disable-line

  // Reset topic/type selections when units change
  useEffect(() => {
    const allTopics = Array.from(new Set(meta.units.filter(u => selectedUnits.includes(u.number)).flatMap(u => u.topics)));
    setSelectedTopics(allTopics);
    setSelectedTypes(qtypes);
  }, [selectedUnits, subject]); // eslint-disable-line

  const recommendedMins = Math.round(totalMarks * minutesPerMark(subject));
  const timeMins = customTime ?? recommendedMins;

  const availableTopics = useMemo(() =>
    Array.from(new Set(meta.units.filter(u => selectedUnits.includes(u.number)).flatMap(u => u.topics))),
    [meta, selectedUnits]
  );

  const toggle = <T,>(arr: T[], v: T): T[] => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  const handleGenerate = async () => {
    if (!user) return;
    if (selectedUnits.length === 0) return toast.error("Pick at least one unit.");
    if (selectedTopics.length === 0) return toast.error("Pick at least one topic.");
    if (selectedTypes.length === 0) return toast.error("Pick at least one question type.");
    setPhase("loading");
    setGenerating(true);
    try {
      // Build chemistry syllabus context for grounding
      let syllabus_context: string | undefined;
      if (subject === "chemistry") {
        const { chemistrySyllabusContext, findChemistryTopic } = await import("@/lib/chemistrySyllabus");
        const ctx = selectedTopics
          .map(t => findChemistryTopic(t))
          .filter(Boolean)
          .map(t => `Unit ${t!.unit} · Topic ${t!.number}: ${t!.name}\n${t!.statements.map(s => `${s.ref} ${s.text}`).join("\n")}`)
          .join("\n\n");
        syllabus_context = ctx || chemistrySyllabusContext();
      }
      const { data: aiData, error: aiErr } = await supabase.functions.invoke("ai-mock-paper", {
        body: {
          action: "generate",
          subject,
          units: selectedUnits,
          topics: selectedTopics,
          questionTypes: selectedTypes,
          totalMarks,
          difficultyMix: difficulty,
          syllabus_context,
        },
      });
      if (aiErr) throw aiErr;
      if (aiData?.error) throw new Error(aiData.error);

      const questions = aiData.questions || [];
      const actualTotal = questions.reduce((s: number, q: any) => s + (q.marks || 0), 0);

      // Insert mock_papers row
      const { data: paper, error: pErr } = await supabase.from("mock_papers").insert({
        user_id: user.id,
        subject,
        units: selectedUnits,
        topics: selectedTopics,
        question_types: selectedTypes,
        total_marks: actualTotal,
        time_limit_minutes: timeMins,
        difficulty_mix: difficulty,
        status: "in_progress",
      }).select("id").single();
      if (pErr) throw pErr;

      // Insert questions
      const rows = questions.map((q: any, i: number) => ({
        mock_paper_id: paper.id,
        user_id: user.id,
        question_index: i,
        topic: q.topic,
        question_type: q.question_type,
        command_word: q.command_word,
        question_text: q.question_text,
        marks: q.marks,
        options: q.options || null,
        mark_scheme: q.mark_scheme,
        model_answer: q.model_answer,
      }));
      const { error: qErr } = await supabase.from("mock_paper_questions").insert(rows);
      if (qErr) throw qErr;

      navigate(`/mock-papers/exam/${paper.id}`);
    } catch (err: any) {
      toast.error(err?.message || "Couldn't build the paper. Try again.");
      setPhase("setup");
      setGenerating(false);
    }
  };

  if (phase === "loading") {
    return (
      <AppLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-8" style={{ background: "var(--gradient-hero)" }}>
          <div className="text-center max-w-lg animate-fade-in">
            <Loader2 className="h-10 w-10 text-primary mx-auto mb-6 animate-spin" />
            <h2 className="text-3xl font-extrabold mb-3">Building your {meta.name} mock paper…</h2>
            <div className="font-mono text-sm text-muted-foreground mb-6">
              Units {selectedUnits.join(", ")} · ~{totalMarks} marks · {formatDuration(timeMins)}
            </div>
            <p className="text-primary italic">"Real exam conditions. Real Edexcel style. Let's go."</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">Configure your mock paper.</h1>
          <p className="text-muted-foreground mt-1">Choose what you'll be tested on. AI will build it to spec.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Subject</Label>
          <select value={subject} onChange={e => setSubject(e.target.value as SubjectCode)}
            className="mt-1.5 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
            {SUBJECT_LIST.map(s => <option key={s.code} value={s.code}>{s.emoji} {s.name}</option>)}
          </select>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Units to include</Label>
          {enrolledUnits.length === 0 ? (
            <p className="text-sm text-muted-foreground">You're not enrolled in any units for {meta.name}. Update your subjects in onboarding.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {meta.units.filter(u => enrolledUnits.includes(u.number)).map(u => {
                const sel = selectedUnits.includes(u.number);
                return (
                  <button key={u.number} type="button" onClick={() => setSelectedUnits(p => toggle(p, u.number))}
                    className={`text-left p-3 rounded-lg border transition-all ${sel ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={sel} className="pointer-events-none data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                      <div>
                        <div className="text-sm font-semibold">Unit {u.number} · {u.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{u.paperLabel}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 mb-5">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Topics to include</Label>
            <button type="button" onClick={() => setSelectedTopics(selectedTopics.length === availableTopics.length ? [] : availableTopics)}
              className="text-xs text-primary hover:underline">
              {selectedTopics.length === availableTopics.length ? "Deselect all" : "Select all"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTopics.map(t => {
              const sel = selectedTopics.includes(t);
              return (
                <button key={t} type="button" onClick={() => setSelectedTopics(p => toggle(p, t))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${sel ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Question types</Label>
          <div className="flex flex-wrap gap-2">
            {qtypes.map(t => {
              const sel = selectedTypes.includes(t);
              return (
                <button key={t} type="button" onClick={() => setSelectedTypes(p => toggle(p, t))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${sel ? "border-accent bg-accent/15 text-accent" : "border-border text-muted-foreground hover:border-accent/40"}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="glass-card rounded-2xl p-6">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Total marks</Label>
            <Input type="number" min={20} max={120} value={totalMarks}
              onChange={e => setTotalMarks(Math.max(20, Math.min(120, Number(e.target.value) || 80)))}
              className="mt-1.5" />
            <p className="text-xs text-muted-foreground mt-2">Range: 20 – 120 marks</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Timing</Label>
            <div className="text-sm mt-1.5">
              Recommended: <span className="font-mono font-bold text-primary">{formatDuration(recommendedMins)}</span>
              <span className="text-xs text-muted-foreground ml-2">({minutesPerMark(subject)} min/mark)</span>
            </div>
            <Input type="number" min={10} placeholder={`${recommendedMins}`} value={customTime ?? ""}
              onChange={e => setCustomTime(e.target.value ? Number(e.target.value) : null)}
              className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Optional override (minutes)</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-8">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Difficulty mix</Label>
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className={difficulty === "foundation" ? "text-primary font-bold" : "text-muted-foreground"}>Foundation</span>
            <span className={difficulty === "mixed" ? "text-primary font-bold" : "text-muted-foreground"}>Mixed</span>
            <span className={difficulty === "challenge" ? "text-primary font-bold" : "text-muted-foreground"}>Challenge</span>
          </div>
          <Slider value={[difficulty === "foundation" ? 0 : difficulty === "mixed" ? 1 : 2]} min={0} max={2} step={1}
            onValueChange={(v) => setDifficulty(v[0] === 0 ? "foundation" : v[0] === 1 ? "mixed" : "challenge")} />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/mock-papers")}>Cancel</Button>
          <Button size="lg" onClick={handleGenerate} disabled={generating || enrolledUnits.length === 0}
            className="bg-primary hover:bg-primary/90 glow-primary">
            {generating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Building…</> : <>Generate my paper <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewMockPaper;
