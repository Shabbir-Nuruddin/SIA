import { supabase } from "@/integrations/supabase/client";

/** Year groups offered at SIA (IGCSE → A-Level). */
export const YEAR_GROUPS = ["Year 10", "Year 11", "Year 12", "Year 13"] as const;
export type YearGroup = (typeof YEAR_GROUPS)[number];

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

  const [sessionsRes, progressRes, subjectsRes] = await Promise.all([
    supabase.from("study_sessions").select("user_id,duration_minutes,completed_at").in("user_id", ids),
    supabase.from("topic_progress").select("user_id,last_score_percent,weak_flag").in("user_id", ids),
    supabase.from("user_subjects").select("user_id,subject,target_grade,current_grade").in("user_id", ids),
  ]);

  const sessions = (sessionsRes.data as any[]) || [];
  const progress = (progressRes.data as any[]) || [];
  const subjects = (subjectsRes.data as any[]) || [];

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
