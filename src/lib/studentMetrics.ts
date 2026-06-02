import { supabase } from "@/integrations/supabase/client";

/** Year groups offered at SIA (IGCSE → A-Level). */
export const YEAR_GROUPS = ["Year 10", "Year 11", "Year 12", "Year 13"] as const;
export type YearGroup = (typeof YEAR_GROUPS)[number];

/** Class sections within a year group. */
export const SECTIONS = ["A", "B", "C", "D", "E", "F"] as const;
export type Section = (typeof SECTIONS)[number];

const SUBJECT_LABELS: Record<string, string> = {
  mathematics: "Mathematics",
  biology: "Biology",
  chemistry: "Chemistry",
  physics: "Physics",
};
export const subjectLabel = (code: string) =>
  SUBJECT_LABELS[code] || code.charAt(0).toUpperCase() + code.slice(1);

export interface ChildProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  student_id: string | null;
  grade: string | null;
  section: string | null;
  current_streak: number | null;
  exam_board: string | null;
  last_session_date: string | null;
}

export interface SubjectTarget {
  subject: string;
  target_grade: string;
  current_grade: string;
}

export interface StudentMetrics {
  profile: ChildProfile;
  totalMinutes: number;
  weekMinutes: number;
  sessions: number;
  weekSessions: number;
  avgScore: number | null;
  topicsTracked: number;
  weakTopics: number;
  subjects: SubjectTarget[];
  lastActive: string | null;
  // Topical questions (from topic_progress)
  questionsAttempted: number;
  questionsCorrect: number;
  // Mock papers (completed = submitted)
  mocksTaken: number;
  mockAvgPct: number | null;
  mockBestGrade: string | null;
  // Roadmap progress
  roadmapTotal: number;
  roadmapDone: number;
  roadmapPct: number | null;
  // Engagement
  siteSeconds: number;        // total time on platform (user_activity)
  activeDays: number;         // distinct days with a study session
}

const startOfWeekISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 6); // rolling 7-day window
  return d.toISOString();
};

const fullName = (p: { first_name: string | null; last_name: string | null }) =>
  `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Student";

export { fullName };

/**
 * Fetch progress metrics for a set of student ids. RLS must already permit the
 * caller to read these rows (teacher = all students, parent = linked children).
 */
export async function fetchMetricsFor(profiles: ChildProfile[]): Promise<StudentMetrics[]> {
  const ids = profiles.map((p) => p.id);
  if (ids.length === 0) return [];

  const weekStart = startOfWeekISO();

  const [sessionsRes, progressRes, subjectsRes, mocksRes, roadmapRes, activityRes] = await Promise.all([
    supabase.from("study_sessions").select("user_id,duration_minutes,completed_at").in("user_id", ids),
    supabase.from("topic_progress").select("user_id,last_score_percent,weak_flag,questions_attempted,questions_correct").in("user_id", ids),
    supabase.from("user_subjects").select("user_id,subject,target_grade,current_grade").in("user_id", ids),
    supabase.from("mock_papers").select("user_id,awarded_marks,total_marks,estimated_grade,submitted_at").in("user_id", ids).not("submitted_at", "is", null),
    supabase.from("roadmap_nodes").select("user_id,completed_at").in("user_id", ids),
    supabase.from("user_activity").select("user_id,total_seconds").in("user_id", ids),
  ]);

  const sessions = (sessionsRes.data as any[]) || [];
  const progress = (progressRes.data as any[]) || [];
  const subjects = (subjectsRes.data as any[]) || [];
  const mocks = (mocksRes.data as any[]) || [];
  const roadmap = (roadmapRes.data as any[]) || [];
  const activity = (activityRes.data as any[]) || [];

  const gradeRank = (g: string) => "UEDCBA".indexOf((g || "").toUpperCase()[0] || "U");

  return profiles.map((profile) => {
    const mySessions = sessions.filter((s) => s.user_id === profile.id);
    const myProgress = progress.filter((p) => p.user_id === profile.id);
    const mySubjectRows = subjects.filter((s) => s.user_id === profile.id);

    const totalMinutes = mySessions.reduce((a, s) => a + (s.duration_minutes || 0), 0);
    const weekSessionsArr = mySessions.filter((s) => s.completed_at && s.completed_at >= weekStart);
    const weekMinutes = weekSessionsArr.reduce((a, s) => a + (s.duration_minutes || 0), 0);

    const scored = myProgress.filter((p) => p.last_score_percent != null);
    const avgScore = scored.length
      ? Math.round(scored.reduce((a, p) => a + (p.last_score_percent || 0), 0) / scored.length)
      : null;

    // De-dupe subjects, keep first target/current seen per subject code.
    const subjMap = new Map<string, SubjectTarget>();
    for (const r of mySubjectRows) {
      if (!subjMap.has(r.subject)) {
        subjMap.set(r.subject, { subject: r.subject, target_grade: r.target_grade, current_grade: r.current_grade });
      }
    }

    const lastActive =
      mySessions.reduce<string | null>((latest, s) => {
        if (!s.completed_at) return latest;
        return !latest || s.completed_at > latest ? s.completed_at : latest;
      }, null) || profile.last_session_date || null;

    const questionsAttempted = myProgress.reduce((a, p) => a + (p.questions_attempted || 0), 0);
    const questionsCorrect = myProgress.reduce((a, p) => a + (p.questions_correct || 0), 0);

    const myMocks = mocks.filter((m) => m.user_id === profile.id);
    const mockPcts = myMocks
      .filter((m) => m.total_marks > 0 && m.awarded_marks != null)
      .map((m) => (m.awarded_marks / m.total_marks) * 100);
    const mockAvgPct = mockPcts.length ? Math.round(mockPcts.reduce((a, p) => a + p, 0) / mockPcts.length) : null;
    const mockBestGrade =
      myMocks
        .map((m) => m.estimated_grade)
        .filter(Boolean)
        .sort((a, b) => gradeRank(b) - gradeRank(a))[0] || null;

    const myRoadmap = roadmap.filter((r) => r.user_id === profile.id);
    const roadmapTotal = myRoadmap.length;
    const roadmapDone = myRoadmap.filter((r) => r.completed_at).length;
    const roadmapPct = roadmapTotal > 0 ? Math.round((roadmapDone / roadmapTotal) * 100) : null;

    const siteSeconds = activity
      .filter((a) => a.user_id === profile.id)
      .reduce((acc, a) => acc + (a.total_seconds || 0), 0);

    const activeDays = new Set(
      mySessions.filter((s) => s.completed_at).map((s) => String(s.completed_at).slice(0, 10)),
    ).size;

    return {
      profile,
      totalMinutes,
      weekMinutes,
      sessions: mySessions.length,
      weekSessions: weekSessionsArr.length,
      avgScore,
      topicsTracked: myProgress.length,
      weakTopics: myProgress.filter((p) => p.weak_flag).length,
      subjects: Array.from(subjMap.values()),
      lastActive,
      questionsAttempted,
      questionsCorrect,
      mocksTaken: myMocks.length,
      mockAvgPct,
      mockBestGrade,
      roadmapTotal,
      roadmapDone,
      roadmapPct,
      siteSeconds,
      activeDays,
    };
  });
}

export const fmtMinutes = (m: number) => {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return min ? `${h}h ${min}m` : `${h}h`;
};

export const relativeTime = (iso: string | null) => {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};
