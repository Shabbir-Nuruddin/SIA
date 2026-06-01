// Roadmap topic lists for Edexcel IAL.
//
// IMPORTANT: this is DERIVED from the single source of truth in src/lib/subjects.ts
// (the SUBJECTS catalogue) rather than being a hand-maintained duplicate. A copy
// used to live here and silently rotted — e.g. Chemistry U4/U5 had their organic
// vs transition-metal content swapped, and Maths P4 listed Further-Maths topics
// (polar coordinates, hyperbolic functions). When the roadmap and the Notes
// sidebar disagree on a unit's topics, the roadmap sends the AI a topic that
// doesn't match the unit's boundary data. Deriving from SUBJECTS makes the
// roadmap, the Notes sidebar and the AI prompt boundaries permanently agree.

import { SUBJECTS, type SubjectCode } from "./subjects";

export const ROADMAP_TOPICS: Record<SubjectCode, Record<number, string[]>> =
  (Object.keys(SUBJECTS) as SubjectCode[]).reduce((acc, code) => {
    const byUnit: Record<number, string[]> = {};
    for (const u of SUBJECTS[code].units ?? []) byUnit[u.number] = [...u.topics];
    acc[code] = byUnit;
    return acc;
  }, {} as Record<SubjectCode, Record<number, string[]>>);

const FOUNDATIONAL_KEYWORDS = [
  "algebra and functions",
  "proof",
  "atomic structure",
  "formulae, equations",
  "bonding and structure",
  "kinematics",
  "water properties",
  "monosaccharides",
  "prokaryotic cell",
  "kinematics in one dimension",
  "representation and summary",
  "mechanics",
  "wave properties",
];

export function isFoundationalTopic(topic: string): boolean {
  const t = topic.toLowerCase();
  return FOUNDATIONAL_KEYWORDS.some(k => t.includes(k));
}
