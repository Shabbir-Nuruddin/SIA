import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { ClarityLayout } from "@/components/ClarityCompass/ClarityLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { clarityDb } from "@/types/clarity-types";
import { SubjectEntry, ClarityProfile } from "@/types/clarity.types";

const SUBJECT_OPTIONS = [
  "Maths",
  "Further Maths",
  "Biology",
  "Chemistry",
  "Physics",
  "Economics",
  "Business",
  "History",
  "Geography",
  "Psychology",
  "English Literature",
  "English Language",
  "Computer Science",
  "Art & Design",
  "Law",
  "Sociology",
  "Religious Studies",
  "French",
  "Spanish",
  "Arabic",
  "PE",
  "Media Studies",
];

const GRADE_OPTIONS = ["A*", "A", "B", "C", "D", "E", "U", "Not yet graded"];

const HOBBIES_OPTIONS = [
  "Reading",
  "Gaming",
  "Sports",
  "Music",
  "Art & Drawing",
  "Cooking",
  "Coding",
  "Writing",
  "Photography",
  "Travelling",
  "Debating",
  "Volunteering",
  "Building things",
  "Science experiments",
  "Watching documentaries",
  "Social media content",
  "Theatre & Drama",
  "Business & entrepreneurship",
  "Fashion",
  "Animals & Nature",
  "Fitness & gym",
  "Film & video editing",
  "Maths & puzzles",
  "Politics & current affairs",
];

const STRENGTHS_OPTIONS = [
  "Problem-solving",
  "Creativity",
  "Communication",
  "Leadership",
  "Empathy",
  "Attention to detail",
  "Research",
  "Maths & numbers",
  "Writing & storytelling",
  "Working with people",
  "Working independently",
  "Quick learner",
  "Physical coordination",
  "Patience",
  "Persuasion",
  "Organisation",
  "Technical/practical skills",
  "Critical thinking",
  "Listening",
  "Innovation",
];

const DISLIKES_OPTIONS = [
  "Repetitive tasks",
  "Working alone",
  "Lots of paperwork",
  "Physical labour",
  "High-pressure deadlines",
  "Public speaking",
  "Numbers & data",
  "Long reading sessions",
  "Unpredictable schedules",
  "Working with children",
  "Corporate environments",
  "Manual work",
  "Strict rules & bureaucracy",
  "Constant travel",
  "Sales & cold calling",
];

interface State {
  subjects: SubjectEntry[];
  noGrades: boolean;
  hobbies: string[];
  strengths: string[];
  dislikes: string[];
  freeText: string;
}

export function ClarityOnboarding(): React.ReactElement {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);
  const [customHobbyInput, setCustomHobbyInput] = useState<string>("");
  const [customStrengthInput, setCustomStrengthInput] = useState<string>("");
  const [customDislikeInput, setCustomDislikeInput] = useState<string>("");
  const [state, setState] = useState<State>({
    subjects: [{ subject: "", currentGrade: "", predictedGrade: "" }],
    noGrades: false,
    hobbies: [],
    strengths: [],
    dislikes: [],
    freeText: "",
  });

  // Subject handlers
  const updateSubject = (
    index: number,
    field: keyof SubjectEntry,
    value: string
  ): void => {
    const newSubjects = [...state.subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setState({ ...state, subjects: newSubjects });
  };

  const addSubject = (): void => {
    if (state.subjects.length < 5) {
      setState({
        ...state,
        subjects: [
          ...state.subjects,
          { subject: "", currentGrade: "", predictedGrade: "" },
        ],
      });
    }
  };

  const removeSubject = (index: number): void => {
    if (state.subjects.length > 1) {
      setState({
        ...state,
        subjects: state.subjects.filter((_, i) => i !== index),
      });
    }
  };

  // Chip handlers
  const toggleChip = (
    value: string,
    type: "hobbies" | "strengths" | "dislikes"
  ): void => {
    const current = state[type];
    if (current.includes(value)) {
      setState({
        ...state,
        [type]: current.filter((item) => item !== value),
      });
    } else {
      setState({
        ...state,
        [type]: [...current, value],
      });
    }
  };

  const addCustomChip = (
    input: string,
    type: "hobbies" | "strengths" | "dislikes",
    setInput: (value: string) => void
  ): void => {
    if (input.trim() && !state[type].includes(input.trim())) {
      setState({
        ...state,
        [type]: [...state[type], input.trim()],
      });
      setInput("");
    }
  };

  // Navigation
  const goBack = (): void => {
    if (step > 1) setStep(step - 1);
  };

  const goNext = (): void => {
    if (step < 6) setStep(step + 1);
  };

  // Save profile
  const saveProfile = async (): Promise<void> => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setSaving(true);
    try {
      const profile: ClarityProfile = {
        user_id: user.id,
        subjects: state.subjects,
        hobbies: state.hobbies,
        strengths: state.strengths,
        dislikes: state.dislikes,
        free_text: state.freeText,
      };

      const { error } = await clarityDb
        .from("clarity_profiles")
        .upsert(profile, { onConflict: "user_id" });

      if (error) throw error;
      toast.success("Profile saved!");
      navigate("/clarity-compass/quiz");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const progress = (step / 6) * 100;

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
              Step {step} of 6
            </p>
          </div>

          {/* Step 1: Subjects & Grades */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  What are you studying?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tell us your subjects and grades
                </p>
              </div>

              <div className="space-y-4">
                {state.subjects.map((subj, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-semibold text-foreground">
                        Subject {idx + 1}
                      </span>
                      {state.subjects.length > 1 && (
                        <button
                          onClick={() => removeSubject(idx)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <input
                      list={`subjects-${idx}`}
                      type="text"
                      placeholder="Subject"
                      value={subj.subject}
                      onChange={(e) =>
                        updateSubject(idx, "subject", e.target.value)
                      }
                      className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground mb-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <datalist id={`subjects-${idx}`}>
                      {SUBJECT_OPTIONS.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>

                    {!state.noGrades && (
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={subj.currentGrade}
                          onChange={(e) =>
                            updateSubject(idx, "currentGrade", e.target.value)
                          }
                          className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">Current Grade</option>
                          {GRADE_OPTIONS.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                        <select
                          value={subj.predictedGrade}
                          onChange={(e) =>
                            updateSubject(idx, "predictedGrade", e.target.value)
                          }
                          className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">Predicted Grade</option>
                          {GRADE_OPTIONS.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {state.subjects.length < 5 && !state.noGrades && (
                <Button
                  variant="outline"
                  onClick={addSubject}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add another subject
                </Button>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.noGrades}
                  onChange={(e) =>
                    setState({ ...state, noGrades: e.target.checked })
                  }
                  className="rounded border-border"
                />
                <span className="text-sm text-foreground">
                  I don't know my grades yet
                </span>
              </label>
            </div>
          )}

          {/* Step 2: Hobbies */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  What are your hobbies?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select as many as you like
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {HOBBIES_OPTIONS.map((hobby) => {
                  const isSelected = state.hobbies.includes(hobby);
                  return (
                    <button
                      key={hobby}
                      onClick={() => toggleChip(hobby, "hobbies")}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {hobby}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom hobby"
                  value={customHobbyInput}
                  onChange={(e) => setCustomHobbyInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addCustomChip(customHobbyInput, "hobbies", setCustomHobbyInput);
                    }
                  }}
                  className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    addCustomChip(customHobbyInput, "hobbies", setCustomHobbyInput)
                  }
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Strengths */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  What are your strengths?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Pick the ones that resonate with you
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {STRENGTHS_OPTIONS.map((strength) => {
                  const isSelected = state.strengths.includes(strength);
                  return (
                    <button
                      key={strength}
                      onClick={() => toggleChip(strength, "strengths")}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {strength}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom strength"
                  value={customStrengthInput}
                  onChange={(e) => setCustomStrengthInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addCustomChip(
                        customStrengthInput,
                        "strengths",
                        setCustomStrengthInput
                      );
                    }
                  }}
                  className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    addCustomChip(
                      customStrengthInput,
                      "strengths",
                      setCustomStrengthInput
                    )
                  }
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Dislikes */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  What do you dislike?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Help us avoid suggesting unsuitable careers
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {DISLIKES_OPTIONS.map((dislike) => {
                  const isSelected = state.dislikes.includes(dislike);
                  return (
                    <button
                      key={dislike}
                      onClick={() => toggleChip(dislike, "dislikes")}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {dislike}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom dislike"
                  value={customDislikeInput}
                  onChange={(e) => setCustomDislikeInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addCustomChip(
                        customDislikeInput,
                        "dislikes",
                        setCustomDislikeInput
                      );
                    }
                  }}
                  className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    addCustomChip(
                      customDislikeInput,
                      "dislikes",
                      setCustomDislikeInput
                    )
                  }
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Free text */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Anything else?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tell us anything — dreams, role models, fears. Optional.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Your thoughts
                </label>
                <textarea
                  value={state.freeText}
                  onChange={(e) =>
                    setState({ ...state, freeText: e.target.value.slice(0, 500) })
                  }
                  placeholder="A dream job, someone you admire, something you're scared to commit to..."
                  className="w-full min-h-[160px] bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {state.freeText.length} / 500 characters
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Let's review
                </h2>
                <p className="text-sm text-muted-foreground">
                  Make sure everything looks good
                </p>
              </div>

              <div className="space-y-4">
                {/* Subjects */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-foreground">Subjects</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(1)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {state.subjects.map((s, i) => (
                      <div key={i}>
                        {s.subject}
                        {!state.noGrades &&
                          (s.currentGrade || s.predictedGrade) && (
                            <span className="text-foreground ml-2">
                              {s.currentGrade && `Current: ${s.currentGrade}`}
                              {s.currentGrade && s.predictedGrade && " | "}
                              {s.predictedGrade && `Predicted: ${s.predictedGrade}`}
                            </span>
                          )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hobbies */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-foreground">Hobbies</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(2)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {state.hobbies.map((h) => (
                      <span key={h} className="text-xs bg-primary/10 text-primary rounded px-2 py-1">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-foreground">Strengths</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(3)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {state.strengths.map((s) => (
                      <span key={s} className="text-xs bg-primary/10 text-primary rounded px-2 py-1">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dislikes */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-foreground">Dislikes</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(4)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {state.dislikes.map((d) => (
                      <span key={d} className="text-xs bg-primary/10 text-primary rounded px-2 py-1">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Free text */}
                {state.freeText && (
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-foreground">Additional notes</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStep(5)}
                        className="text-xs"
                      >
                        Edit
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      "{state.freeText}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={step === 1}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            {step < 6 ? (
              <Button onClick={goNext} className="flex-1">
                Continue <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={saveProfile}
                disabled={saving}
                className="flex-1"
              >
                {saving ? "Saving..." : "Start my quiz →"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </ClarityLayout>
  );
}
