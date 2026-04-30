// Direct hyperlinks to official board past papers and grade boundaries.

import type { SubjectCode } from "./subjects";

export type Board = "edexcel-ial" | "cie";

export interface PastPaperResource {
  board: Board;
  subject: SubjectCode;
  spec_code: string;
  title: string;
  url: string;
  description: string;
}

export const PAST_PAPER_RESOURCES: PastPaperResource[] = [
  // EDEXCEL IAL
  {
    board: "edexcel-ial", subject: "chemistry", spec_code: "YCH11/WCH11",
    title: "Edexcel IAL Chemistry — Past Papers",
    url: "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/chemistry-2018.coursematerials.html",
    description: "All Units 1–6 question papers, mark schemes and examiner reports.",
  },
  {
    board: "edexcel-ial", subject: "biology", spec_code: "YBI11/WBI11",
    title: "Edexcel IAL Biology — Past Papers",
    url: "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/biology-2018.coursematerials.html",
    description: "All Units 1–6 question papers, mark schemes and examiner reports.",
  },
  {
    board: "edexcel-ial", subject: "physics", spec_code: "YPH11/WPH11",
    title: "Edexcel IAL Physics — Past Papers",
    url: "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/physics-2018.coursematerials.html",
    description: "All Units 1–6 question papers, mark schemes and examiner reports.",
  },
  {
    board: "edexcel-ial", subject: "mathematics", spec_code: "YMA01/WMA01",
    title: "Edexcel IAL Mathematics — Past Papers",
    url: "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics-2018.coursematerials.html",
    description: "P1, P2, P3, P4, M1, M2, S1, S2, S3 papers, mark schemes and examiner reports.",
  },

  // CIE
  {
    board: "cie", subject: "chemistry", spec_code: "9701",
    title: "CIE A Level Chemistry 9701 — Past Papers",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-chemistry-9701/past-papers/",
    description: "AS and A Level papers (Paper 1–5), mark schemes and examiner reports.",
  },
  {
    board: "cie", subject: "biology", spec_code: "9700",
    title: "CIE A Level Biology 9700 — Past Papers",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-biology-9700/past-papers/",
    description: "AS and A Level papers (Paper 1–5), mark schemes and examiner reports.",
  },
  {
    board: "cie", subject: "physics", spec_code: "9702",
    title: "CIE A Level Physics 9702 — Past Papers",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-physics-9702/past-papers/",
    description: "AS and A Level papers (Paper 1–5), mark schemes and examiner reports.",
  },
  {
    board: "cie", subject: "mathematics", spec_code: "9709",
    title: "CIE A Level Mathematics 9709 — Past Papers",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-9709/past-papers/",
    description: "Pure (P1–P3), Mechanics (M1), Statistics (S1–S2), Probability & Statistics papers and mark schemes.",
  },
];

export const GRADE_BOUNDARY_LINKS: Record<Board, { label: string; url: string }> = {
  "edexcel-ial": {
    label: "Edexcel IAL Grade Boundaries",
    url: "https://qualifications.pearson.com/en/support/support-topics/results-certification/grade-boundaries.html",
  },
  "cie": {
    label: "CIE Grade Thresholds",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/results/grade-thresholds/",
  },
};
