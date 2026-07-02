// Shared identifiers for the three pre-created demo accounts (Auth.tsx "Try a
// demo" buttons). Single source of truth so pages that special-case a demo
// account (Auth, Questions, ParentDashboard) don't duplicate the emails.

export const DEMO_EMAILS = {
  student: "demo.student@sia-revision.com",
  teacher: "demo.teacher@sia-revision.com",
  parent: "demo.parent@sia-revision.com",
} as const;
