import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ApexLogo } from "@/components/ApexLogo";
import { ArrowRight, Brain } from "lucide-react";

// 12 mindset / pain-point questions. NOT an academic test.
// Result is a pain summary that primes the student emotionally for the app.

interface Q {
  id: string;
  prompt: string;
  options: { label: string; value: number; tag?: string }[]; // value 0-3 severity
}

const QUESTIONS: Q[] = [
  { id: "q1", prompt: "When you sit down to revise, how often do you waste 10+ minutes deciding what to study?", options: [
    { label: "Almost every session", value: 3, tag: "decision_paralysis" },
    { label: "Often", value: 2, tag: "decision_paralysis" },
    { label: "Sometimes", value: 1 },
    { label: "Rarely", value: 0 },
  ]},
  { id: "q2", prompt: "How confident are you that your current revision schedule actually covers everything before the exam?", options: [
    { label: "Not confident at all", value: 3, tag: "no_plan" },
    { label: "I have doubts", value: 2, tag: "no_plan" },
    { label: "Mostly confident", value: 1 },
    { label: "Fully confident", value: 0 },
  ]},
  { id: "q3", prompt: "How often do you re-read notes hoping it'll stick?", options: [
    { label: "Most of my study time", value: 3, tag: "passive_study" },
    { label: "Often", value: 2, tag: "passive_study" },
    { label: "Sometimes", value: 1 },
    { label: "Rarely — I test myself", value: 0 },
  ]},
  { id: "q4", prompt: "When you finish a topic, do you ever come back to review it?", options: [
    { label: "Almost never — I move on", value: 3, tag: "no_spacing" },
    { label: "Only right before the exam", value: 2, tag: "no_spacing" },
    { label: "Occasionally", value: 1 },
    { label: "Yes — on a schedule", value: 0 },
  ]},
  { id: "q5", prompt: "How often do you feel anxious or overwhelmed when you think about your exams?", options: [
    { label: "Daily", value: 3, tag: "anxiety" },
    { label: "Several times a week", value: 2, tag: "anxiety" },
    { label: "Sometimes", value: 1 },
    { label: "Rarely", value: 0 },
  ]},
  { id: "q6", prompt: "Have you ever finished a study session and not been able to recall what you covered?", options: [
    { label: "Yes — often", value: 3, tag: "low_retention" },
    { label: "Sometimes", value: 2 },
    { label: "Rarely", value: 1 },
    { label: "Never", value: 0 },
  ]},
  { id: "q7", prompt: "Do you skip topics because you don't know how to start them?", options: [
    { label: "Frequently", value: 3, tag: "avoidance" },
    { label: "Sometimes", value: 2 },
    { label: "Rarely", value: 1 },
    { label: "Never", value: 0 },
  ]},
  { id: "q8", prompt: "How often do you do past papers under timed conditions?", options: [
    { label: "Never", value: 3, tag: "no_practice" },
    { label: "Once a month", value: 2, tag: "no_practice" },
    { label: "Weekly", value: 1 },
    { label: "Multiple times a week", value: 0 },
  ]},
  { id: "q9", prompt: "When you get a question wrong, do you understand exactly why?", options: [
    { label: "Rarely", value: 3, tag: "no_feedback" },
    { label: "Sometimes", value: 2 },
    { label: "Usually", value: 1 },
    { label: "Always", value: 0 },
  ]},
  { id: "q10", prompt: "Do you currently track which topics you're weakest at?", options: [
    { label: "No idea where my gaps are", value: 3, tag: "no_tracking" },
    { label: "A vague sense", value: 2 },
    { label: "Sort of — in my head", value: 1 },
    { label: "Yes, written down", value: 0 },
  ]},
  { id: "q11", prompt: "How motivated do you feel right now to start revising?", options: [
    { label: "Zero", value: 3, tag: "low_motivation" },
    { label: "Low", value: 2, tag: "low_motivation" },
    { label: "OK", value: 1 },
    { label: "High", value: 0 },
  ]},
  { id: "q12", prompt: "If you had a personal coach who told you exactly what to study every day, would you follow it?", options: [
    { label: "Yes — that's exactly what I need", value: 3, tag: "wants_guidance" },
    { label: "Probably", value: 2, tag: "wants_guidance" },
    { label: "Maybe", value: 1 },
    { label: "I prefer to plan my own", value: 0 },
  ]},
];

const Diagnostic = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0..QUESTIONS.length, last = result
  const [answers, setAnswers] = useState<Record<string, { value: number; tag?: string }>>({});

  // Wait for the auth session to hydrate before deciding to redirect — otherwise
  // a fresh login bounces straight back to /auth.
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/auth?mode=signup");
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Loading…</div>;
  }

  const handlePick = (q: Q, opt: Q["options"][number]) => {
    setAnswers(a => ({ ...a, [q.id]: { value: opt.value, tag: opt.tag } }));
    setTimeout(() => setStep(s => s + 1), 200);
  };

  const total = QUESTIONS.length;
  const showResult = step >= total;
  const score = Object.values(answers).reduce((a, x) => a + x.value, 0); // 0..36
  const pct = Math.round((score / (total * 3)) * 100);
  const tags = Object.values(answers).map(x => x.tag).filter(Boolean) as string[];
  const topPains = useMemo(() => {
    const counts = new Map<string, number>();
    tags.forEach(t => counts.set(t, (counts.get(t) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);
  }, [tags]);

  const PAIN_LABELS: Record<string, { headline: string; body: string }> = {
    decision_paralysis: { headline: "You waste study time deciding what to study.", body: "Make Me Revise tells you exactly what to open every time you sit down. Decision removed." },
    no_plan: { headline: "You don't trust your current schedule.", body: "We build the schedule from your exam dates back. Every topic is covered, in order." },
    passive_study: { headline: "Re-reading isn't sticking.", body: "every Make Me Revise session ends with active recall — the single highest-impact study method." },
    no_spacing: { headline: "You don't review what you've learned.", body: "Make Me Revise auto-schedules reviews at +3, +7, and +14 days so it actually stays in." },
    anxiety: { headline: "Exams make you anxious.", body: "Anxiety drops when you have a clear, science-backed plan you trust. That's the whole product." },
    low_retention: { headline: "What you learn doesn't stick.", body: "Spaced repetition + active recall + interleaving — built into every node." },
    avoidance: { headline: "You skip the hard topics.", body: "Make Me Revise sequences them so you can't avoid them — but never overwhelms you in one session." },
    no_practice: { headline: "Not enough exam-condition practice.", body: "Mock papers are auto-scheduled in the 14 days before your exam. Real timing, real marking." },
    no_feedback: { headline: "You don't know why you lose marks.", body: "every Make Me Revise answer gets line-by-line examiner feedback, not just a tick or cross." },
    no_tracking: { headline: "You don't know your weaknesses.", body: "Make Me Revise tracks every topic score and rebuilds your roadmap around the weakest ones." },
    low_motivation: { headline: "Motivation is low right now.", body: "You don't need motivation. You need a path. Make Me Revise makes the next step impossible to miss." },
    wants_guidance: { headline: "You want someone to just tell you what to do.", body: "that's exactly what Make Me Revise does. Open the app, follow the path. Repeat daily." },
  };

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-2xl w-full animate-fade-in">
          <div className="text-center mb-8">
            <ApexLogo size={40} className="justify-center mb-6" />
            <div className="text-[11px] uppercase tracking-widest text-primary font-mono mb-3">Your study profile</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
              {pct >= 70 ? "You're studying on hard mode." :
               pct >= 50 ? "Your revision has gaps Make Me Revise was built for." :
               pct >= 30 ? "You're doing OK — Make Me Revise closes the rest." :
                            "You've got good habits. Make Me Revise makes them automatic."}
            </h1>
            <p className="text-muted-foreground text-sm">
              Pain score: <span className="font-mono font-bold text-foreground">{pct}/100</span>
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {topPains.length === 0 ? (
              <div className="surface p-5 text-center text-muted-foreground text-sm">
                You're already using strong habits — Make Me Revise will lock them into a daily plan.
              </div>
            ) : topPains.map(t => {
              const label = PAIN_LABELS[t];
              if (!label) return null;
              return (
                <div key={t} className="surface p-5 border-l-4 border-primary">
                  <div className="font-bold text-base mb-1">{label.headline}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{label.body}</div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button size="lg" onClick={async () => {
              if (user) {
                await supabase.from("profiles").update({ diagnostic_completed: true }).eq("id", user.id);
              }
              navigate("/onboarding");
            }} className="btn-primary h-12 px-8 text-base">
              Build my plan now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mt-4">
              Takes 2 minutes · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  const progress = Math.round((step / total) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <ApexLogo size={32} />
          <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
            Question {step + 1} / {total}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-secondary overflow-hidden mb-10">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <div key={q.id} className="animate-in-up">
          <div className="text-[11px] uppercase tracking-widest text-primary font-mono mb-3 flex items-center gap-2">
            <Brain className="h-3 w-3" />Mindset screener
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 leading-tight">{q.prompt}</h2>

          <div className="space-y-3">
            {q.options.map((o, i) => (
              <button
                key={i}
                onClick={() => handlePick(q, o)}
                className="w-full text-left surface p-5 hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{o.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
                </div>
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              className="mt-6 text-[11px] text-muted-foreground hover:text-foreground font-mono uppercase tracking-wider"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diagnostic;
