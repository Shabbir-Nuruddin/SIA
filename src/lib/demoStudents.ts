import type { StudentMetrics, ChildProfile, SubjectTarget } from "@/lib/studentMetrics";

// Deterministic demo students for showcasing the teacher portal before the real
// roster is imported. Pure client-side — never written to the database.

const SUBJECT_CODES = ["mathematics", "physics", "chemistry", "biology"] as const;

const NAMES: [string, string][] = [
  ["Ahmed", "Al-Rashidi"], ["Sara", "Khan"], ["Yusuf", "Patel"], ["Layla", "Hassan"],
  ["Omar", "Siddiqui"], ["Fatima", "Noor"], ["Zayd", "Malik"], ["Aisha", "Rahman"],
  ["Bilal", "Ahmed"], ["Hamza", "Sheikh"], ["Noor", "Abbas"], ["Khalid", "Yousef"],
  ["Hana", "Saleh"], ["Idris", "Karim"], ["Salma", "Darwish"], ["Adam", "Farooq"],
  // + 20 more
  ["Zara", "Mahmood"], ["Ali", "Haider"], ["Maya", "Suleiman"], ["Rayan", "Aziz"],
  ["Lina", "Mansoor"], ["Tariq", "Jamal"], ["Dina", "Khalil"], ["Saif", "Anwar"],
  ["Huda", "Bashir"], ["Kareem", "Nabil"], ["Amira", "Fadel"], ["Faris", "Lutfi"],
  ["Reem", "Hadid"], ["Nael", "Qureshi"], ["Sana", "Tariq"], ["Jad", "Halabi"],
  ["Yara", "Othman"], ["Musa", "Imran"], ["Hala", "Nasr"], ["Zaid", "Mansour"],
];

const GRADES = ["Year 11", "Year 12", "Year 13"];
const SECTIONS = ["A", "B"];

// Small seeded PRNG so the demo looks identical every load.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const gradeLetter = (pct: number) => (pct >= 90 ? "A*" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "E");

function makeStudent(i: number): StudentMetrics {
  const r = rng(i * 97 + 7);
  const [first, last] = NAMES[i % NAMES.length];
  const grade = GRADES[i % GRADES.length];
  const section = SECTIONS[i % SECTIONS.length];

  const subjCount = 2 + Math.floor(r() * 3); // 2–4 subjects
  const subjects: SubjectTarget[] = SUBJECT_CODES.slice(0, subjCount).map((code) => {
    const cur = 55 + Math.floor(r() * 35);
    const tgt = Math.min(95, cur + 5 + Math.floor(r() * 20));
    return { subject: code, current_grade: gradeLetter(cur), target_grade: gradeLetter(tgt) };
  });

  const totalMinutes = 200 + Math.floor(r() * 2600);
  const weekMinutes = Math.floor(totalMinutes * (0.05 + r() * 0.12));
  const sessions = 8 + Math.floor(r() * 60);
  const weekSessions = 1 + Math.floor(r() * 6);
  const avgScore = 45 + Math.floor(r() * 50);
  const topicsTracked = 6 + Math.floor(r() * 30);
  const weakTopics = Math.floor(r() * 6);
  const questionsAttempted = 30 + Math.floor(r() * 400);
  const questionsCorrect = Math.floor(questionsAttempted * (0.5 + r() * 0.4));
  const mocksTaken = Math.floor(r() * 8);
  const mockAvgPct = mocksTaken ? 45 + Math.floor(r() * 50) : null;
  const mockBestGrade = mockAvgPct != null ? gradeLetter(mockAvgPct + 5) : null;
  const roadmapTotal = 20 + Math.floor(r() * 40);
  const roadmapDone = Math.floor(roadmapTotal * (0.1 + r() * 0.8));
  const roadmapPct = Math.round((roadmapDone / roadmapTotal) * 100);
  const siteSeconds = (totalMinutes + Math.floor(r() * 600)) * 60;
  const activeDays = 3 + Math.floor(r() * 40);
  const daysAgo = Math.floor(r() * 6);
  const lastActive = new Date(Date.now() - daysAgo * 86400000).toISOString();

  const profile: ChildProfile = {
    id: `demo-${i}`,
    first_name: first,
    last_name: last,
    student_id: `SIA-DEMO-${1000 + i}`,
    grade,
    section,
    current_streak: Math.floor(r() * 21),
    exam_board: "edexcel-ial",
    last_session_date: lastActive,
  };

  return {
    profile, totalMinutes, weekMinutes, sessions, weekSessions, avgScore,
    topicsTracked, weakTopics, subjects, lastActive,
    questionsAttempted, questionsCorrect, mocksTaken, mockAvgPct, mockBestGrade,
    roadmapTotal, roadmapDone, roadmapPct, siteSeconds, activeDays,
  };
}

export const DEMO_STUDENTS: StudentMetrics[] = Array.from({ length: 34 }, (_, i) => makeStudent(i));

// The featured demo student — always the first card in the teacher roster and
// the single child on the demo parent dashboard.
export const DEMO_FEATURED_STUDENT: StudentMetrics = DEMO_STUDENTS[0];

// A ready-made, AI-style HPL target for the featured demo student. This is
// shown PRE-FILLED in the teacher's Target modal (so a demo needs no live AI
// call) and rendered on the demo parent dashboard under "Targets from
// teacher" — entirely client-side, so no SQL seeding is required.
export const DEMO_TARGET = {
  id: "demo-target-featured",
  period: "This week",
  created_at: new Date().toISOString(),
  content: `**Push your Mathematics from a B toward your A target this week.**

1. Complete two topical-question sets on your weakest topic and review every worked solution, not just the score — builds **Meta-thinking** and **Hard-working: perseverance**.
2. Sit one timed mock paper and act on the examiner feedback before your next attempt — builds **Analysing**.
3. Finish the remaining roadmap sessions this week to protect your streak and keep momentum — builds **Realising**.

You're already putting in consistent hours — channel that into your flagged weak topics and the grade gap will close. Keep it up!`,
};
