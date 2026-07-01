// Shared identifiers for the three pre-created demo accounts (Auth.tsx "Try a
// demo" buttons). Single source of truth so pages that need to special-case
// the demo student (Questions, TeacherDashboard) don't duplicate the emails.

export const DEMO_EMAILS = {
  student: "demo.student@sia-revision.com",
  teacher: "demo.teacher@sia-revision.com",
  parent: "demo.parent@sia-revision.com",
} as const;

// The demo student's profiles.student_id, set by scripts/seed-demo-target.sql,
// used by the demo parent to link via sia_link_child.
export const DEMO_STUDENT_ID = "SIA-DEMO";
