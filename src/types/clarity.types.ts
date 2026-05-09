export interface SubjectEntry {
  subject: string;
  currentGrade: string;
  predictedGrade: string;
}

export interface ClarityProfile {
  id?: string;
  user_id: string;
  subjects: SubjectEntry[];
  hobbies: string[];
  strengths: string[];
  dislikes: string[];
  free_text: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuizAnswer {
  question_text: string;
  answer_type: 'MULTIPLE_CHOICE' | 'SCALE' | 'TEXT' | 'RANK' | 'YES_NO';
  user_answer: string | number | string[];
}

export interface QuizQuestion {
  question_text: string;
  answer_type: 'MULTIPLE_CHOICE' | 'SCALE' | 'TEXT' | 'RANK' | 'YES_NO';
  options: string[] | null;
  scale_labels: { low: string; high: string } | null;
  rationale: string;
  confidence: number;
  quiz_complete: boolean;
  final_analysis?: FinalAnalysis;
}

export interface SkillResource {
  skill: string;
  how: string;
  resource: string;
  is_free: boolean;
}

export interface CareerMatch {
  career: string;
  match_score: number;
  why_it_fits: string;
  reality_check: string;
  daily_tasks_glimpse: string[];
  experience_it_now: string[];
  skills_to_build_before_uni: SkillResource[];
}

export interface FinalAnalysis {
  personality_summary: string;
  core_values: string[];
  working_style: string;
  hidden_strengths: string[];
  career_matches: CareerMatch[];
  careers_to_avoid: string[];
}

export interface QuizSession {
  id?: string;
  user_id: string;
  questions_and_answers: QuizAnswer[];
  ai_analysis?: FinalAnalysis;
  completed: boolean;
  created_at?: string;
}

export interface RoadmapResource {
  name: string;
  url: string;
  is_free: boolean;
}

export interface RoadmapMilestone {
  title: string;
  description: string;
  action_items: string[];
  resources: RoadmapResource[];
  is_free: boolean;
  priority: 'essential' | 'recommended' | 'optional';
}

export interface RoadmapPhase {
  phase_name: string;
  time_period: string;
  milestones: RoadmapMilestone[];
}

export interface ClarityRoadmapData {
  career: string;
  phases: RoadmapPhase[];
}

export interface ClarityResults {
  id?: string;
  user_id: string;
  session_id?: string;
  career_matches: CareerMatch[];
  roadmap?: ClarityRoadmapData;
  milestone_checks: Record<string, boolean>;
  created_at?: string;
}
