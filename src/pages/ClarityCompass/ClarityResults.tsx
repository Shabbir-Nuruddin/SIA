import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ChevronDown, ChevronUp, Sparkles, Download } from "lucide-react";
import { ClarityLayout } from "@/components/ClarityCompass/ClarityLayout";
import { Button } from "@/components/ui/button";
import { FinalAnalysis, CareerMatch } from "@/types/clarity.types";

function CircularScore({ score }: { score: number }): React.ReactElement {
  const [animated, setAnimated] = useState(false);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const strokeDashoffset = circ - (score / 100) * circ;

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  return (
    <div className="flex justify-center mb-6">
      <svg width="88" height="88" viewBox="0 0 88 88" className="transform -rotate-90">
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="3"
        />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={animated ? strokeDashoffset : circ}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <text
          x="44"
          y="44"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-2xl font-bold fill-foreground"
          transform="rotate(90 44 44)"
        >
          {score}%
        </text>
      </svg>
    </div>
  );
}

function CareerCard({ career }: { career: CareerMatch }): React.ReactElement {
  const [expandTasks, setExpandTasks] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleTask = (task: string): void => {
    const newChecked = new Set(checkedTasks);
    if (newChecked.has(task)) {
      newChecked.delete(task);
    } else {
      newChecked.add(task);
    }
    setCheckedTasks(newChecked);
  };

  const handleBuildRoadmap = (): void => {
    localStorage.setItem("clarity_selected_career", career.career);
    navigate("/clarity-compass/roadmap");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <CircularScore score={career.match_score} />
      <h3 className="text-xl font-bold text-foreground">{career.career}</h3>
      <p className="text-sm text-muted-foreground">{career.why_it_fits}</p>

      {/* Reality Check */}
      <div className="flex gap-3 bg-muted/50 p-3 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">{career.reality_check}</p>
      </div>

      {/* Daily tasks */}
      <div>
        <button
          onClick={() => setExpandTasks(!expandTasks)}
          className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          A day in the life
          {expandTasks ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandTasks && (
          <ul className="mt-2 space-y-2 ml-4">
            {career.daily_tasks_glimpse.map((task, idx) => (
              <li key={idx} className="text-sm text-foreground flex gap-2">
                <span className="text-primary">•</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Try it now */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Try it now</p>
        {career.experience_it_now.map((task, idx) => (
          <label key={idx} className="flex items-start gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={checkedTasks.has(task)}
              onChange={() => toggleTask(task)}
              className="mt-1 rounded border-border"
            />
            <span
              className={`text-sm transition-colors ${
                checkedTasks.has(task)
                  ? "line-through text-muted-foreground"
                  : "text-foreground group-hover:text-primary"
              }`}
            >
              {task}
            </span>
          </label>
        ))}
      </div>

      {/* Build roadmap button */}
      <Button onClick={handleBuildRoadmap} className="w-full">
        <Sparkles className="w-4 h-4 mr-2" />
        Build my roadmap for {career.career} →
      </Button>
    </div>
  );
}

export function ClarityResults(): React.ReactElement {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<FinalAnalysis | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("clarity_analysis");
    if (!stored) {
      setAnalysis(null);
      return;
    }
    try {
      setAnalysis(JSON.parse(stored) as FinalAnalysis);
    } catch (err) {
      console.error("Failed to parse analysis", err);
      setAnalysis(null);
    }
  }, []);

  if (!analysis) {
    return (
      <ClarityLayout>
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center text-center">
            <p className="text-muted-foreground mb-6">No results found.</p>
            <Button onClick={() => navigate("/clarity-compass/quiz")}>
              Take the quiz →
            </Button>
          </div>
        </div>
      </ClarityLayout>
    );
  }

  return (
    <ClarityLayout>
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-12">
          {/* Section 1: Your Profile */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Your Profile</h2>
            <p className="text-muted-foreground mb-4">{analysis.personality_summary}</p>

            {/* Core values */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-foreground mb-3">Core values</p>
              <div className="flex flex-wrap gap-2">
                {analysis.core_values.map((value) => (
                  <span
                    key={value}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>

            {/* Working style */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-foreground mb-2">Working style</p>
              <p className="text-muted-foreground text-sm">{analysis.working_style}</p>
            </div>

            {/* Hidden strengths */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Hidden strengths</p>
              <ul className="space-y-2">
                {analysis.hidden_strengths.map((strength) => (
                  <li key={strength} className="text-sm text-foreground flex gap-2">
                    <span className="text-primary">✦</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 2: Career Matches */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Your Career Matches</h2>
            <div className="space-y-8">
              {analysis.career_matches.map((career) => (
                <CareerCard key={career.career} career={career} />
              ))}
            </div>
          </section>

          {/* Section 3: Careers to Avoid */}
          {analysis.careers_to_avoid.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-6">Careers to Avoid</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {analysis.careers_to_avoid.map((career) => (
                  <span
                    key={career}
                    className="px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border text-sm"
                  >
                    ✕ {career}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on your current profile. People change — you can always retake.
              </p>
            </section>
          )}

          {/* Section 4: Actions */}
          <section className="flex gap-3 pb-12">
            <Button
              variant="outline"
              onClick={() => navigate("/clarity-compass/quiz")}
              className="flex-1"
            >
              Retake quiz
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/clarity-compass/onboarding")}
              className="flex-1"
            >
              Update my profile
            </Button>
          </section>
        </div>
      </div>
    </ClarityLayout>
  );
}
