import { CIE_SUBJECTS } from "./cieSyllabus";

export type SubjectCode = "mathematics" | "biology" | "chemistry" | "physics";
export type Board = "edexcel-ial" | "cie";

export interface UnitMeta {
  number: number;
  name: string;
  paperLabel: string;
  durationMinutes: number;
  topics: string[];
  aLevelOnly?: boolean;
  section?: string;
  unitCode?: string; // Display code e.g. "P1", "U4", "M2"
}

export interface SubjectMeta {
  code: SubjectCode;
  name: string;
  emoji: string;
  spec: string;
  units: UnitMeta[];
}

// === EDEXCEL IAL — full default catalogue (Maths P1–4/M1–2/S1–2, Sciences U1–6) ===
export const SUBJECTS: Record<SubjectCode, SubjectMeta> = {
  mathematics: {
    code: "mathematics",
    name: "Mathematics",
    emoji: "∑",
    spec: "WMA / YMA",
    units: [
      {
        number: 1, unitCode: "P1", name: "Pure Mathematics 1",
        paperLabel: "P1 · 1hr 30min · 75 marks",
        durationMinutes: 90,
        topics: [
          "Algebra and Functions",
          "Quadratics",
          "Surds and Indices",
          "Coordinate Geometry",
          "Trigonometry",
          "Differentiation",
          "Integration",
        ],
      },
      {
        number: 2, unitCode: "P2", name: "Pure Mathematics 2",
        paperLabel: "P2 · 1hr 30min · 75 marks",
        durationMinutes: 90,
        topics: [
          "Proof",
          "Further Algebra",
          "Sequences and Series",
          "Binomial Expansion",
          "Exponentials and Logarithms",
          "Further Trigonometry",
          "Further Calculus",
        ],
      },
      {
        number: 3, unitCode: "P3", name: "Pure Mathematics 3",
        paperLabel: "P3 · 1hr 30min · 75 marks",
        durationMinutes: 90,
        aLevelOnly: true,
        topics: [
          "Algebra and Functions (advanced)",
          "Further Trigonometry",
          "Differential Equations",
          "Further Vectors",
          "Numerical Methods",
        ],
      },
      {
        number: 4, unitCode: "P4", name: "Pure Mathematics 4",
        paperLabel: "P4 · 1hr 30min · 75 marks",
        durationMinutes: 90,
        aLevelOnly: true,
        topics: [
          "Proof",
          "Further Algebra",
          "Parametric Equations",
          "Vectors (lines & planes)",
          "Further Differentiation and Integration",
          "Complex Numbers",
        ],
      },
      {
        number: 5, unitCode: "M1", name: "Mechanics 1",
        paperLabel: "M1 · 1hr 30min · 75 marks",
        durationMinutes: 90,
        topics: [
          "Kinematics in One Dimension",
          "Kinematics in Two Dimensions",
          "Dynamics — Newton's Laws",
          "Statics and Equilibrium",
          "Moments",
        ],
      },
      {
        number: 6, unitCode: "M2", name: "Mechanics 2",
        paperLabel: "M2 · 1hr 30min · 75 marks",
        durationMinutes: 90,
        aLevelOnly: true,
        topics: [
          "Projectile Motion",
          "Rigid Bodies and Moments",
          "Elastic Strings and Springs",
          "Further Dynamics",
        ],
      },
      {
        number: 7, unitCode: "S1", name: "Statistics 1",
        paperLabel: "S1 · 1hr 30min · 75 marks",
        durationMinutes: 90,
        topics: [
          "Representation and Summary of Data",
          "Probability",
          "Correlation and Regression",
          "Discrete Random Variables",
          "Normal Distribution",
        ],
      },
      {
        number: 8, unitCode: "S2", name: "Statistics 2",
        paperLabel: "S2 · 1hr 30min · 75 marks",
        durationMinutes: 90,
        aLevelOnly: true,
        topics: [
          "Binomial Distribution",
          "Poisson Distribution",
          "Continuous Random Variables",
          "Hypothesis Testing",
        ],
      },
    ],
  },

  biology: {
    code: "biology",
    name: "Biology",
    emoji: "🧬",
    spec: "YBI / WBI",
    units: [
      { number: 1, unitCode: "U1", name: "Lifestyle, Transport, Genes and Health",
        paperLabel: "Unit 1 · 1hr 30min", durationMinutes: 90,
        topics: ["Lifestyle and Health", "Genes and Health"],
      },
      { number: 2, unitCode: "U2", name: "Development, Plants and the Environment",
        paperLabel: "Unit 2 · 1hr 30min", durationMinutes: 90,
        topics: ["Voice of the Genome", "Biodiversity and Natural Resources"],
      },
      { number: 3, unitCode: "U3", name: "Practical Skills in Biology I",
        paperLabel: "Unit 3 · 1hr 20min", durationMinutes: 80,
        topics: ["On the Wild Side", "Immunity Infection and Forensics"],
      },
      { number: 4, unitCode: "U4", name: "Energy, Environment, Microbiology and Immunity",
        paperLabel: "Unit 4 · A2 · 1hr 45min", durationMinutes: 105, aLevelOnly: true,
        topics: ["Run for Your Life", "Grey Matter"],
      },
      { number: 5, unitCode: "U5", name: "Respiration, Internal Environment, Coordination and Gene Technology",
        paperLabel: "Unit 5 · A2 · 1hr 45min", durationMinutes: 105, aLevelOnly: true,
        topics: ["Microbiology and Pathogens", "Genetics and Gene Expression"],
      },
      { number: 6, unitCode: "U6", name: "Practical Skills in Biology II",
        paperLabel: "Unit 6 · A2 · 1hr 20min", durationMinutes: 80, aLevelOnly: true,
        topics: ["Practical Skills Assessment"],
      },
    ],
  },

  chemistry: {
    code: "chemistry",
    name: "Chemistry",
    emoji: "⚗",
    spec: "YCH / WCH",
    units: [
      { number: 1, unitCode: "U1", name: "Structure, Bonding and Introduction to Organic Chemistry",
        paperLabel: "Unit 1 · IAS · 1hr 30min · 80 marks", durationMinutes: 90,
        topics: [
          "Formulae, Equations and Amount of Substance",
          "Atomic Structure and the Periodic Table",
          "Bonding and Structure",
          "Introductory Organic Chemistry and Alkanes",
          "Alkenes",
        ],
      },
      { number: 2, unitCode: "U2", name: "Energetics, Group Chemistry, Halogenoalkanes and Alcohols",
        paperLabel: "Unit 2 · IAS · 1hr 30min · 80 marks", durationMinutes: 90,
        topics: [
          "Energetics",
          "Intermolecular Forces",
          "Redox Chemistry and Groups 1, 2 and 7",
          "Introduction to Kinetics and Equilibria",
          "Halogenoalkanes, Alcohols and Spectra",
        ],
      },
      { number: 3, unitCode: "U3", name: "Practical Skills in Chemistry I",
        paperLabel: "Unit 3 · IAS · 1hr 20min · 50 marks", durationMinutes: 80,
        topics: [
          "Practical techniques (Units 1 & 2)",
          "Data analysis, uncertainties and evaluation",
          "Tests for ions, gases and organic functional groups",
        ],
      },
      { number: 4, unitCode: "U4", name: "Rates, Equilibria and Further Organic Chemistry",
        paperLabel: "Unit 4 · IA2 · 1hr 45min · 90 marks", durationMinutes: 105, aLevelOnly: true,
        topics: [
          "Kinetics",
          "Entropy and Energetics",
          "Chemical Equilibria",
          "Acid-base Equilibria",
          "Organic Chemistry: Carbonyls, Carboxylic Acids and Chirality",
        ],
      },
      { number: 5, unitCode: "U5", name: "Transition Metals and Organic Nitrogen Chemistry",
        paperLabel: "Unit 5 · IA2 · 1hr 45min · 90 marks", durationMinutes: 105, aLevelOnly: true,
        topics: [
          "Redox Equilibria",
          "Transition Metals and their Chemistry",
          "Organic Chemistry: Arenes",
          "Organic Nitrogen Compounds: Amines, Amides, Amino Acids and Proteins",
          "Organic Synthesis",
        ],
      },
      { number: 6, unitCode: "U6", name: "Practical Skills in Chemistry II",
        paperLabel: "Unit 6 · IA2 · 1hr 20min · 50 marks", durationMinutes: 80, aLevelOnly: true,
        topics: [
          "Planning, Implementing and Safety",
          "Analysis and Evaluation",
          "Experimental Techniques",
        ],
      },
    ],
  },

  physics: {
    code: "physics",
    name: "Physics",
    emoji: "⚛",
    spec: "YPH / WPH",
    units: [
      { number: 1, unitCode: "U1", name: "Mechanics and Materials",
        paperLabel: "Unit 1 · 1hr 30min", durationMinutes: 90,
        topics: ["Mechanics", "Electric Circuits"],
      },
      { number: 2, unitCode: "U2", name: "Waves and Electricity",
        paperLabel: "Unit 2 · 1hr 30min", durationMinutes: 90,
        topics: ["Waves and the Particle Nature of Light"],
      },
      { number: 3, unitCode: "U3", name: "Practical Skills in Physics I",
        paperLabel: "Unit 3 · 1hr 20min", durationMinutes: 80,
        topics: ["Practical Assessment"],
      },
      { number: 4, unitCode: "U4", name: "Further Mechanics, Fields and Particles",
        paperLabel: "Unit 4 · A2 · 1hr 45min", durationMinutes: 105, aLevelOnly: true,
        topics: ["Further Mechanics", "Electric and Magnetic Fields", "Nuclear and Particle Physics"],
      },
      { number: 5, unitCode: "U5", name: "Thermodynamics, Radiation, Oscillations and Cosmology",
        paperLabel: "Unit 5 · A2 · 1hr 45min", durationMinutes: 105, aLevelOnly: true,
        topics: ["Thermodynamics", "Nuclear Radiation", "Oscillations and Cosmology"],
      },
      { number: 6, unitCode: "U6", name: "Practical Skills in Physics II",
        paperLabel: "Unit 6 · A2 · 1hr 20min", durationMinutes: 80, aLevelOnly: true,
        topics: ["Practical Assessment"],
      },
    ],
  },
};

export const SUBJECT_LIST: SubjectMeta[] = Object.values(SUBJECTS);

// Board-aware catalog: returns Edexcel IAL (default) or CIE subject metadata.
export function getSubjectsForBoard(board: Board | string | null | undefined): Record<SubjectCode, SubjectMeta> {
  if (board === "cie") return CIE_SUBJECTS;
  return SUBJECTS;
}

export function getSubjectListForBoard(board: Board | string | null | undefined): SubjectMeta[] {
  return Object.values(getSubjectsForBoard(board));
}

export const BOARD_LABEL: Record<Board, string> = {
  "edexcel-ial": "Edexcel IAL",
  "cie": "Cambridge International (CIE) A Level",
};

export const GRADES = ["A*", "A", "B", "C", "D", "E"] as const;
export type Grade = typeof GRADES[number];

export const gradeGap = (target: Grade, current: Grade): number => {
  const idx = (g: Grade) => GRADES.indexOf(g);
  return Math.max(0, idx(current) - idx(target));
};

// Helper: short unit label like "Maths P1" or "Chemistry U4"
export const unitShortLabel = (subject: SubjectCode, unit_number: number | null | undefined): string => {
  const meta = SUBJECTS[subject];
  if (!meta || unit_number == null) return meta?.name ?? "";
  const u = meta.units.find(x => x.number === unit_number);
  const code = u?.unitCode ?? `U${unit_number}`;
  const subShort = subject === "mathematics" ? "Maths"
                 : subject === "biology" ? "Biology"
                 : subject === "chemistry" ? "Chemistry"
                 : "Physics";
  return `${subShort} ${code}`;
};

export const urgencyScore = (gap: number, daysToExam: number): { value: number; level: "urgent" | "moderate" | "track"; color: string } => {
  const gapScore = Math.min(gap, 4) * 20;
  const timePressure = daysToExam <= 30 ? 40 : daysToExam <= 90 ? 25 : daysToExam <= 180 ? 12 : 5;
  const value = Math.min(100, gapScore + timePressure);
  if (value >= 65) return { value, level: "urgent", color: "hsl(var(--urgent))" };
  if (value >= 35) return { value, level: "moderate", color: "hsl(var(--accent))" };
  return { value, level: "track", color: "hsl(var(--success))" };
};

export const formatDuration = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

// Edexcel IAL grade boundaries — indicative, recent data.
export interface GradeBoundary { grade: string; minPercent: number; }
export const GRADE_BOUNDARIES: Record<SubjectCode, GradeBoundary[]> = {
  mathematics: [
    { grade: "A*", minPercent: 90 },
    { grade: "A", minPercent: 80 },
    { grade: "B", minPercent: 70 },
    { grade: "C", minPercent: 60 },
    { grade: "D", minPercent: 50 },
    { grade: "E", minPercent: 40 },
  ],
  biology: [
    { grade: "A*", minPercent: 90 }, { grade: "A", minPercent: 80 }, { grade: "B", minPercent: 70 },
    { grade: "C", minPercent: 60 }, { grade: "D", minPercent: 50 }, { grade: "E", minPercent: 40 },
  ],
  chemistry: [
    { grade: "A*", minPercent: 90 }, { grade: "A", minPercent: 80 }, { grade: "B", minPercent: 70 },
    { grade: "C", minPercent: 60 }, { grade: "D", minPercent: 50 }, { grade: "E", minPercent: 40 },
  ],
  physics: [
    { grade: "A*", minPercent: 90 }, { grade: "A", minPercent: 80 }, { grade: "B", minPercent: 70 },
    { grade: "C", minPercent: 60 }, { grade: "D", minPercent: 50 }, { grade: "E", minPercent: 40 },
  ],
};

export const estimateGrade = (subject: SubjectCode, awarded: number, total: number): string => {
  if (total === 0) return "U";
  const pct = (awarded / total) * 100;
  const boundaries = GRADE_BOUNDARIES[subject];
  for (const b of boundaries) if (pct >= b.minPercent) return b.grade;
  return "U";
};

export const gradeColor = (grade: string): string => {
  switch (grade) {
    case "A*": return "hsl(45 95% 55%)";
    case "A":  return "hsl(152 76% 48%)";
    case "B":  return "hsl(210 90% 60%)";
    case "C":  return "hsl(36 92% 55%)";
    default:   return "hsl(230 12% 60%)";
  }
};

export const minutesPerMark = (subject: SubjectCode): number =>
  subject === "mathematics" ? 1.4 : 1.2;
