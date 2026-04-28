export type SubjectCode = "mathematics" | "biology" | "chemistry" | "physics";

export interface SubjectMeta {
  code: SubjectCode;
  name: string;
  emoji: string;
  papers: { title: string; topics: string[] }[];
}

export const SUBJECTS: Record<SubjectCode, SubjectMeta> = {
  mathematics: {
    code: "mathematics",
    name: "Mathematics",
    emoji: "∑",
    papers: [
      { title: "Paper 1: Pure Mathematics 1", topics: ["Algebra", "Graphs", "Coordinate Geometry", "Sequences", "Trigonometry", "Exponentials & Logarithms", "Differentiation", "Integration", "Proof", "Vectors"] },
      { title: "Paper 2: Pure Mathematics 2", topics: ["Algebra", "Graphs", "Coordinate Geometry", "Sequences", "Trigonometry", "Exponentials & Logarithms", "Differentiation", "Integration", "Proof", "Vectors"] },
      { title: "Paper 3: Statistics & Mechanics", topics: ["Statistical Sampling", "Data Presentation", "Probability", "Statistical Distributions", "Hypothesis Testing", "Quantities & Units", "Kinematics", "Forces", "Newton's Laws", "Moments"] },
    ],
  },
  biology: {
    code: "biology",
    name: "Biology",
    emoji: "🧬",
    papers: [
      { title: "Edexcel A-Level Biology", topics: [
        "Biological Molecules", "Cells", "Exchange with Environment",
        "Genetic Information & Variation", "Energy Transfers",
        "Organisms Respond to Change", "Genetics, Populations & Ecosystems",
        "Control of Gene Expression"
      ]},
    ],
  },
  chemistry: {
    code: "chemistry",
    name: "Chemistry",
    emoji: "⚗",
    papers: [
      { title: "Edexcel A-Level Chemistry", topics: [
        "Atomic Structure & Periodic Table", "Bonding & Structure", "Redox I",
        "Inorganic Chemistry & Periodic Table", "Formulae, Equations & Amounts",
        "Organic Chemistry I", "Modern Analytical Techniques I", "Energetics I",
        "Kinetics I", "Equilibrium I", "Acid-Base Equilibria",
        "Properties & Uses of Alcohols", "Halogenoalkanes",
        "Carboxylic Acids & Esters", "Organic Chemistry II", "Kinetics II",
        "Equilibrium II", "Electrode Potentials", "Transition Metals",
        "Modern Analytical Techniques II"
      ]},
    ],
  },
  physics: {
    code: "physics",
    name: "Physics",
    emoji: "⚛",
    papers: [
      { title: "Edexcel A-Level Physics", topics: [
        "Working as a Physicist", "Mechanics", "Electric Circuits", "Materials",
        "Waves & Particle Nature of Light", "Further Mechanics",
        "Electric & Magnetic Fields", "Nuclear & Particle Physics",
        "Thermodynamics", "Space", "Nuclear Radiation", "Gravitational Fields",
        "Oscillations"
      ]},
    ],
  },
};

export const SUBJECT_LIST: SubjectMeta[] = Object.values(SUBJECTS);

export const GRADES = ["A*", "A", "B", "C", "D", "E"] as const;
export type Grade = typeof GRADES[number];

export const gradeGap = (target: Grade, current: Grade): number => {
  const idx = (g: Grade) => GRADES.indexOf(g);
  return Math.max(0, idx(current) - idx(target));
};

export const urgencyScore = (gap: number, daysToExam: number): { value: number; level: "urgent" | "moderate" | "track"; color: string } => {
  // 0-100
  const gapScore = Math.min(gap, 4) * 20; // 0-80
  const timePressure = daysToExam <= 30 ? 40 : daysToExam <= 90 ? 25 : daysToExam <= 180 ? 12 : 5;
  const value = Math.min(100, gapScore + timePressure);
  if (value >= 65) return { value, level: "urgent", color: "hsl(var(--urgent))" };
  if (value >= 35) return { value, level: "moderate", color: "hsl(var(--accent))" };
  return { value, level: "track", color: "hsl(var(--success))" };
};
