import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, GripVertical } from "lucide-react";
import { ClarityLayout } from "@/components/ClarityCompass/ClarityLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { clarityDb } from "@/types/clarity-types";
import {
  QuizQuestion,
  QuizAnswer,
  ClarityProfile,
  FinalAnalysis,
} from "@/types/clarity.types";
import { toast } from "sonner";

const LOADING_MESSAGES = [
  "Reading between the lines...",
  "Connecting the dots...",
  "One more dimension to explore...",
  "The AI is thinking...",
  "Mapping your strengths...",
];

async function fetchNextQuestion(
  profile: ClarityProfile,
  history: QuizAnswer[]
): Promise<QuizQuestion> {
  const systemPrompt = `You are a world-class career psychologist conducting an adaptive career discovery assessment for a UK student aged 16-19 finishing their A-levels. Your goal: understand what careers will make this student THRIVE.

Student profile:
SUBJECTS: ${JSON.stringify(profile.subjects)}
HOBBIES: ${profile.hobbies.join(", ")}
STRENGTHS: ${profile.strengths.join(", ")}
DISLIKES: ${profile.dislikes.join(", ")}
PERSONAL STATEMENT: ${profile.free_text}
Questions asked so far: ${history.length}
Q&A history: ${JSON.stringify(history)}

Generate the NEXT single question. Rules: never repeat themes, probe something unknown, sound like a thoughtful mentor, ask about real scenarios. When question count >= 28 OR confidence >= 85, end the quiz.

Respond ONLY in this exact JSON (no markdown):
{ question_text, answer_type (MULTIPLE_CHOICE|SCALE|TEXT|RANK|YES_NO), options (array or null), scale_labels ({low,high} or null), rationale, confidence (0-100), quiz_complete: false }

When ending: { quiz_complete: true, final_analysis: { personality_summary, core_values[], working_style, hidden_strengths[], career_matches: [{ career, match_score, why_it_fits, reality_check, daily_tasks_glimpse[], experience_it_now[], skills_to_build_before_uni: [{skill,how,resource,is_free}] }], careers_to_avoid[] } }
Return 3-4 career matches sorted by match_score descending. Be honest and specific.`;

  const { data, error } = await supabase.functions.invoke("clarity-ai", {
    body: { prompt: systemPrompt, max_tokens: 2000, temperature: 0.7 },
  });
  if (error) throw new Error(error.message ?? "AI request failed");
  const content: string = data?.content ?? "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid AI response format");

  return JSON.parse(jsonMatch[0]) as QuizQuestion;
}


// Answer type components
function MultipleChoice({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}): React.ReactElement {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`p-3 rounded-lg border transition-colors text-sm font-medium ${
            value === opt
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:border-primary/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function YesNo({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}): React.ReactElement {
  return (
    <div className="flex gap-4">
      {["Yes", "No"].map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 p-4 rounded-lg border transition-colors font-semibold text-base ${
            value === opt
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:border-primary/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ScaleInput({
  value,
  onChange,
  labels,
}: {
  value: number;
  onChange: (val: number) => void;
  labels: { low: string; high: string };
}): React.ReactElement {
  return (
    <div className="space-y-4">
      <input
        type="range"
        min="1"
        max="10"
        value={value || 5}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{labels.low}</span>
        <span className="text-2xl font-bold text-primary">{value || 5}</span>
        <span className="text-xs text-muted-foreground">{labels.high}</span>
      </div>
    </div>
  );
}

function TextInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}): React.ReactElement {
  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 200))}
        placeholder="Your answer..."
        className="w-full min-h-[120px] bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <p className="text-xs text-muted-foreground text-right">
        {value.length} / 200 characters
      </p>
    </div>
  );
}

function RankInput({
  items,
  onChange,
}: {
  items: string[];
  onChange: (ranked: string[]) => void;
}): React.ReactElement {
  const [list, setList] = useState<string[]>(items);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number): void => {
    setDraggingIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number): void => {
    e.preventDefault();
    if (draggingIdx !== null && draggingIdx !== idx) {
      const newList = [...list];
      const [removed] = newList.splice(draggingIdx, 1);
      newList.splice(idx, 0, removed);
      setList(newList);
      setDraggingIdx(idx);
      onChange(newList);
    }
  };

  return (
    <div className="space-y-2">
      {list.map((item, idx) => (
        <div
          key={idx}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          className="flex items-center gap-3 p-3 bg-card border border-border rounded cursor-move hover:border-primary/50 transition-colors"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-primary text-sm w-6">{idx + 1}.</span>
          <span className="text-foreground flex-1">{item}</span>
        </div>
      ))}
    </div>
  );
}

export function ClarityQuiz(): React.ReactElement {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ClarityProfile | null>(null);
  const [history, setHistory] = useState<QuizAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | number | string[]>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [slideIn, setSlideIn] = useState<boolean>(true);
  const loadingIntervalRef = useRef<number | null>(null);

  // Load profile and initialize session
  useEffect(() => {
    const initializeQuiz = async (): Promise<void> => {
      if (!user) {
        toast.error("User not authenticated");
        navigate("/clarity-compass");
        return;
      }

      try {
        // Load profile
        const { data: profileData, error: profileError } = await clarityDb
          .from("clarity_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) throw new Error("Profile not found");
        setProfile(profileData as ClarityProfile);

        // Create session
        const { data: sessionData, error: sessionError } = await clarityDb
          .from("clarity_quiz_sessions")
          .insert({
            user_id: user.id,
            questions_and_answers: [],
            completed: false,
          })
          .select("id")
          .single();

        if (sessionError) throw new Error("Failed to create session");
        setSessionId(sessionData.id);

        // Load first question
        await loadNextQuestion(profileData as ClarityProfile, []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to start quiz");
        navigate("/clarity-compass");
      }
    };

    initializeQuiz();
  }, [user, navigate]);

  // Loading message rotation
  useEffect(() => {
    if (!loading) return;
    loadingIntervalRef.current = window.setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    };
  }, [loading]);

  const loadNextQuestion = useCallback(
    async (prof: ClarityProfile, hist: QuizAnswer[]): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const question = await fetchNextQuestion(prof, hist);
        setCurrentQuestion(question);
        setCurrentAnswer("");
        setSlideIn(true);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load next question. Please try again.");
        setLoading(false);
      }
    },
    []
  );

  const handleSubmitAnswer = useCallback(async (): Promise<void> => {
    if (!currentQuestion || !profile || !user) return;
    if (currentAnswer === "" || currentAnswer === null) return;

    const newAnswer: QuizAnswer = {
      question_text: currentQuestion.question_text,
      answer_type: currentQuestion.answer_type,
      user_answer: currentAnswer,
    };

    const newHistory = [...history, newAnswer];
    setHistory(newHistory);

    // Update session every 3 questions
    if ((newHistory.length + 1) % 3 === 0 && sessionId) {
      await clarityDb
        .from("clarity_quiz_sessions")
        .update({ questions_and_answers: newHistory })
        .eq("id", sessionId)
        .catch((err) => console.error("Failed to update session", err));
    }

    // Check if quiz is complete
    if (currentQuestion.quiz_complete && currentQuestion.final_analysis) {
      // Update session as completed
      if (sessionId) {
        await clarityDb
          .from("clarity_quiz_sessions")
          .update({
            completed: true,
            ai_analysis: currentQuestion.final_analysis,
            questions_and_answers: newHistory,
          })
          .eq("id", sessionId);
      }

      // Insert results
      if (user && currentQuestion.final_analysis) {
        const { error: resultsError } = await clarityDb
          .from("clarity_results")
          .insert({
            user_id: user.id,
            session_id: sessionId,
            career_matches: currentQuestion.final_analysis.career_matches,
            milestone_checks: {},
          });

        if (resultsError) console.error("Failed to insert results", resultsError);
      }

      // Save to localStorage
      if (currentQuestion.final_analysis) {
        localStorage.setItem(
          "clarity_analysis",
          JSON.stringify(currentQuestion.final_analysis)
        );
      }

      toast.success("Quiz complete!");
      navigate("/clarity-compass/results");
    } else {
      // Load next question
      setSlideIn(false);
      setTimeout(() => {
        if (profile) {
          loadNextQuestion(profile, newHistory);
        }
      }, 50);
    }
  }, [currentQuestion, profile, user, history, sessionId, navigate, loadNextQuestion]);

  const handleBackClick = (): void => {
    if (history.length > 0) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentAnswer("");
      setSlideIn(false);
      setTimeout(() => {
        if (profile) {
          loadNextQuestion(profile, newHistory);
        }
      }, 50);
    }
  };

  if (!profile) {
    return (
      <ClarityLayout>
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center">
            <Compass className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading your quiz...</p>
          </div>
        </div>
      </ClarityLayout>
    );
  }

  const progress = Math.min(95, (history.length / 28) * 100);
  const roughlyPercent = Math.round(progress);

  return (
    <ClarityLayout>
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Question {history.length + 1} • Roughly {roughlyPercent}% through
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Compass className="w-12 h-12 text-primary mb-4 animate-spin" />
              <p className="text-muted-foreground">{LOADING_MESSAGES[loadingMsgIdx]}</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button
                onClick={() => {
                  if (profile) loadNextQuestion(profile, history);
                }}
                variant="outline"
              >
                Try again
              </Button>
            </div>
          )}

          {/* Question */}
          {currentQuestion && !loading && !error && (
            <div
              className={`transition-all duration-300 ${
                slideIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {currentQuestion.question_text}
              </h2>

              {/* Answer components */}
              <div className="mb-8 p-4 bg-card rounded-lg border border-border">
                {currentQuestion.answer_type === "MULTIPLE_CHOICE" &&
                  currentQuestion.options && (
                    <MultipleChoice
                      options={currentQuestion.options}
                      value={currentAnswer as string}
                      onChange={setCurrentAnswer}
                    />
                  )}

                {currentQuestion.answer_type === "YES_NO" && (
                  <YesNo
                    value={currentAnswer as string}
                    onChange={setCurrentAnswer}
                  />
                )}

                {currentQuestion.answer_type === "SCALE" &&
                  currentQuestion.scale_labels && (
                    <ScaleInput
                      value={currentAnswer as number}
                      onChange={setCurrentAnswer}
                      labels={currentQuestion.scale_labels}
                    />
                  )}

                {currentQuestion.answer_type === "TEXT" && (
                  <TextInput
                    value={currentAnswer as string}
                    onChange={setCurrentAnswer}
                  />
                )}

                {currentQuestion.answer_type === "RANK" &&
                  currentQuestion.options && (
                    <RankInput
                      items={currentQuestion.options}
                      onChange={(ranked) => setCurrentAnswer(ranked)}
                    />
                  )}
              </div>

              {/* Rationale */}
              <p className="text-xs text-muted-foreground italic mb-8">
                {currentQuestion.rationale}
              </p>

              {/* Navigation */}
              <div className="flex gap-3">
                {history.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleBackClick}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={
                    currentAnswer === "" ||
                    (typeof currentAnswer === "number" && currentAnswer === 0)
                  }
                  className={history.length === 0 ? "w-full" : "flex-1"}
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClarityLayout>
  );
}
