import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import { ClarityLayout } from "@/components/ClarityCompass/ClarityLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { clarityDb } from "@/types/clarity-types";
import {
  ClarityRoadmapData,
  RoadmapMilestone,
  RoadmapPhase,
  FinalAnalysis,
} from "@/types/clarity.types";
import { toast } from "sonner";

async function generateRoadmap(
  career: string,
  analysis: FinalAnalysis
): Promise<ClarityRoadmapData> {
  const systemPrompt = `You are a UK career coach creating a detailed roadmap for a student who wants to pursue: ${career}

Student profile:
${JSON.stringify(analysis)}

Create a realistic, actionable 5-phase roadmap with real resources and milestones. Format exactly as JSON (no markdown):

{
  "career": "${career}",
  "phases": [
    { "phase_name": "Right Now — Before Exams Finish", "time_period": "Now - April 2025", "milestones": [...] },
    { "phase_name": "This Summer — After A-levels", "time_period": "July - September 2025", "milestones": [...] },
    { "phase_name": "Results & Application Season", "time_period": "October - January 2026", "milestones": [...] },
    { "phase_name": "Gap Year / Pre-University", "time_period": "February - August 2026", "milestones": [...] },
    { "phase_name": "First Year of University", "time_period": "September 2026+", "milestones": [...] }
  ]
}

Each milestone: { "title", "description", "action_items": [], "resources": [{"name", "url", "is_free"}], "is_free", "priority": "essential|recommended|optional" }
3-5 milestones per phase. Name REAL resources with real URLs. Be specific and actionable.`;

  const { data, error } = await supabase.functions.invoke("clarity-ai", {
    body: { prompt: systemPrompt, max_tokens: 3000, temperature: 0.7 },
  });
  if (error) throw new Error(error.message ?? "AI request failed");
  const content: string = data?.content ?? "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid AI response format");

  return JSON.parse(jsonMatch[0]) as ClarityRoadmapData;
}



interface MilestoneCardProps {
  milestone: RoadmapMilestone;
  checked: boolean;
  onCheck: (checked: boolean) => void;
}

function MilestoneCard({ milestone, checked, onCheck }: MilestoneCardProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);

  const borderColor = {
    essential: "border-l-green-500",
    recommended: "border-l-blue-500",
    optional: "border-l-gray-500",
  }[milestone.priority];

  return (
    <div className={`border-l-4 ${borderColor} bg-card border border-border rounded-lg p-4 space-y-3`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-1">
            <h4 className={`font-semibold text-foreground ${
              checked ? "line-through text-muted-foreground" : ""
            }`}>
              {milestone.title}
            </h4>
            {milestone.is_free && (
              <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded whitespace-nowrap">
                Free
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
              milestone.priority === "essential"
                ? "bg-green-500/10 text-green-700"
                : milestone.priority === "recommended"
                ? "bg-blue-500/10 text-blue-700"
                : "bg-gray-500/10 text-gray-700"
            }`}>
              {milestone.priority}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{milestone.description}</p>
        </div>
      </div>

      {/* Toggle more/less */}
      {(milestone.action_items.length > 0 || milestone.resources.length > 0) && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors ml-7"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {expanded ? "Less" : "More"}
        </button>
      )}

      {expanded && (
        <div className="ml-7 space-y-3 pt-2 border-t border-border">
          {/* Action items */}
          {milestone.action_items.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Action items:</p>
              <ul className="space-y-1">
                {milestone.action_items.map((item, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources */}
          {milestone.resources.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Resources:</p>
              <ul className="space-y-1">
                {milestone.resources.map((res, idx) => (
                  <li key={idx} className="text-xs">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {res.name}
                    </a>
                    {res.is_free && (
                      <span className="text-muted-foreground ml-2">(free)</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ClarityRoadmap(): React.ReactElement {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<ClarityRoadmapData | null>(null);
  const [view, setView] = useState<"timeline" | "list">("timeline");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [selectedCareer, setSelectedCareer] = useState<string>("");
  const [allCareers, setAllCareers] = useState<string[]>([]);

  useEffect(() => {
    const initializeRoadmap = async (): Promise<void> => {
      const career = localStorage.getItem("clarity_selected_career");
      const analysisStr = localStorage.getItem("clarity_analysis");

      if (!career || !analysisStr) {
        setError("Missing career or analysis data");
        setLoading(false);
        return;
      }

      try {
        const analysis = JSON.parse(analysisStr) as FinalAnalysis;
        const careers = analysis.career_matches.map((c) => c.career);
        setAllCareers(careers);
        setSelectedCareer(career);

        const data = await generateRoadmap(career, analysis);
        setRoadmap(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to generate roadmap");
      } finally {
        setLoading(false);
      }
    };

    initializeRoadmap();
  }, []);

  const handleCareerChange = async (newCareer: string): Promise<void> => {
    localStorage.setItem("clarity_selected_career", newCareer);
    setSelectedCareer(newCareer);
    setLoading(true);
    setError(null);

    try {
      const analysisStr = localStorage.getItem("clarity_analysis");
      if (!analysisStr) throw new Error("Missing analysis");
      const analysis = JSON.parse(analysisStr) as FinalAnalysis;
      const data = await generateRoadmap(newCareer, analysis);
      setRoadmap(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneCheck = useCallback(
    async (milestoneTitle: string, checked: boolean): Promise<void> => {
      const newChecks = { ...checks, [milestoneTitle]: checked };
      setChecks(newChecks);

      if (!user) return;

      await clarityDb
        .from("clarity_results")
        .update({ milestone_checks: newChecks })
        .eq("user_id", user.id)
        .catch((err) => console.error("Failed to update milestone", err));
    },
    [checks, user]
  );

  if (loading) {
    return (
      <ClarityLayout>
        <div className="flex-1 flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Generating your roadmap...</p>
        </div>
      </ClarityLayout>
    );
  }

  if (error || !roadmap) {
    return (
      <ClarityLayout>
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{error || "No roadmap data"}</p>
            <Button onClick={() => navigate("/clarity-compass/results")} variant="outline">
              Back to results
            </Button>
          </div>
        </div>
      </ClarityLayout>
    );
  }

  return (
    <ClarityLayout>
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Career Roadmap</h1>
              <p className="text-muted-foreground mt-1">{selectedCareer}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.print()}
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
          </div>

          {/* Career switcher */}
          {allCareers.length > 1 && (
            <div className="flex gap-2">
              <label className="text-sm font-semibold text-foreground flex items-center">
                Switch career:
              </label>
              <select
                value={selectedCareer}
                onChange={(e) => handleCareerChange(e.target.value)}
                className="bg-card border border-border rounded px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {allCareers.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* View toggle */}
          <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
            {["timeline", "list"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as "timeline" | "list")}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
                  view === v
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v === "timeline" ? "Timeline" : "List"}
              </button>
            ))}
          </div>

          {/* Content */}
          {view === "timeline" && (
            <div className="space-y-8">
              {roadmap.phases.map((phase, phaseIdx) => (
                <div key={phaseIdx} className="relative pl-8">
                  {/* Timeline dot */}
                  <div className="absolute -left-3 top-0 w-3 h-3 rounded-full bg-primary" />
                  {/* Timeline line */}
                  {phaseIdx < roadmap.phases.length - 1 && (
                    <div className="absolute left-0 top-6 w-0.5 h-12 bg-border" />
                  )}

                  <div>
                    <h3 className="font-bold text-lg text-foreground">{phase.phase_name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{phase.time_period}</p>
                    <div className="space-y-3">
                      {phase.milestones.map((milestone, mIdx) => (
                        <MilestoneCard
                          key={mIdx}
                          milestone={milestone}
                          checked={checks[milestone.title] || false}
                          onCheck={(checked) =>
                            handleMilestoneCheck(milestone.title, checked)
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === "list" && (
            <div className="space-y-6">
              {roadmap.phases.map((phase, phaseIdx) => (
                <section key={phaseIdx} className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{phase.phase_name}</h3>
                    <p className="text-xs text-muted-foreground">{phase.time_period}</p>
                  </div>
                  <div className="space-y-3">
                    {phase.milestones.map((milestone, mIdx) => (
                      <MilestoneCard
                        key={mIdx}
                        milestone={milestone}
                        checked={checks[milestone.title] || false}
                        onCheck={(checked) =>
                          handleMilestoneCheck(milestone.title, checked)
                        }
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClarityLayout>
  );
}
