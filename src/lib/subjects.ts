export type SubjectCode = "mathematics" | "biology" | "chemistry" | "physics";

export interface UnitMeta {
  number: number;
  name: string;
  paperLabel: string;        // e.g. "Paper 1, no calculator, 2 hrs"
  durationMinutes: number;   // hardcoded paper duration
  topics: string[];
  aLevelOnly?: boolean;
  section?: string;          // optional sub-section header (e.g. Statistics / Mechanics)
}

export interface SubjectMeta {
  code: SubjectCode;
  name: string;
  emoji: string;
  spec: string;              // e.g. "9MA0"
  units: UnitMeta[];
}

const PURE_TOPICS = [
  "Proof",
  "Algebra and Functions",
  "Coordinate Geometry in the (x,y) plane",
  "Sequences and Series",
  "Trigonometry",
  "Exponentials and Logarithms",
  "Differentiation",
  "Integration",
  "Vectors",
];

export const SUBJECTS: Record<SubjectCode, SubjectMeta> = {
  mathematics: {
    code: "mathematics",
    name: "Mathematics",
    emoji: "∑",
    spec: "9MA0",
    units: [
      {
        number: 1,
        name: "Pure Mathematics 1",
        paperLabel: "Paper 1 · no calculator · 2 hrs",
        durationMinutes: 120,
        topics: PURE_TOPICS,
      },
      {
        number: 2,
        name: "Pure Mathematics 2 (application of Pure topics)",
        paperLabel: "Paper 2 · calculator · 2 hrs",
        durationMinutes: 120,
        topics: PURE_TOPICS,
      },
      {
        number: 3,
        name: "Statistics and Mechanics",
        paperLabel: "Paper 3 · calculator · 2 hrs",
        durationMinutes: 120,
        topics: [
          // Statistics
          "Statistical Sampling",
          "Data Presentation and Interpretation",
          "Probability",
          "Statistical Distributions (Binomial, Normal)",
          "Statistical Hypothesis Testing",
          // Mechanics
          "Quantities, Units and Numerical Work",
          "Kinematics",
          "Forces and Newton's Laws",
          "Moments",
        ],
      },
    ],
  },

  biology: {
    code: "biology",
    name: "Biology",
    emoji: "🧬",
    spec: "9BI0",
    units: [
      {
        number: 1,
        name: "Lifestyle, Transport, Genes and Health",
        paperLabel: "Paper 1 · 1hr 45min",
        durationMinutes: 105,
        topics: [
          "Cholesterol and heart disease",
          "Lifestyle factors and health",
          "Blood vessels and the cardiac cycle",
          "Transport in animals (haemoglobin, oxygen dissociation)",
          "DNA structure, protein synthesis, genetic disorders",
          "Cell structure and microscopy",
          "Biological molecules",
        ],
      },
      {
        number: 2,
        name: "Development, Plants and the Environment",
        paperLabel: "Paper 2 · 1hr 45min",
        durationMinutes: 105,
        topics: [
          "Cell division (mitosis, meiosis)",
          "Genetics and inheritance",
          "Plant biology (photosynthesis, water transport)",
          "Ecosystems and populations",
          "Biodiversity",
        ],
      },
      {
        number: 3,
        name: "Unified Biology",
        paperLabel: "Paper 3 · 1hr 45min",
        durationMinutes: 105,
        topics: [
          "Synoptic content from Units 1 and 2",
          "Experimental skills and data analysis",
          "Extended response questions",
        ],
      },
      {
        number: 4,
        name: "Energy, Exercise and Coordination",
        paperLabel: "Paper 4 · A-Level only · 1hr 45min",
        durationMinutes: 105,
        aLevelOnly: true,
        topics: [
          "Muscles and exercise physiology",
          "The nervous system and coordination",
          "Homeostasis (blood glucose, thermoregulation)",
          "Sensory receptors",
        ],
      },
      {
        number: 5,
        name: "Genetics, Evolution and Ecosystems",
        paperLabel: "Paper 5 · A-Level only · 1hr 45min",
        durationMinutes: 105,
        aLevelOnly: true,
        topics: [
          "Genetics: linkage, epistasis, chi-squared",
          "Population genetics and evolution",
          "Ecosystems: nutrient cycles, succession",
          "Gene technologies (PCR, electrophoresis, genetic engineering)",
        ],
      },
      {
        number: 6,
        name: "Practical Biology and Research Skills",
        paperLabel: "Paper 6 · A-Level only · 1hr 20min",
        durationMinutes: 80,
        aLevelOnly: true,
        topics: [
          "Planning, implementing, and analysing experiments",
          "Statistical tests",
          "Evaluation and conclusions",
          "Research skills",
        ],
      },
    ],
  },

  chemistry: {
    code: "chemistry",
    name: "Chemistry",
    emoji: "⚗",
    spec: "9CH0",
    units: [
      {
        number: 1,
        name: "The Core Principles of Chemistry",
        paperLabel: "Paper 1 · 1hr 45min",
        durationMinutes: 105,
        topics: [
          "Atomic structure and the periodic table",
          "Bonding and structure (ionic, covalent, metallic)",
          "Introductory organic chemistry and alkanes",
          "Energetics (enthalpy changes, Hess's Law)",
          "Kinetics (rate of reaction, collision theory)",
          "Equilibrium (Le Chatelier's principle)",
          "Redox reactions",
        ],
      },
      {
        number: 2,
        name: "Application of Core Principles of Chemistry",
        paperLabel: "Paper 2 · 1hr 45min",
        durationMinutes: 105,
        topics: [
          "Groups 2 and 17 (alkaline earth metals, halogens)",
          "Period 3 (properties of elements and oxides)",
          "Transition metals (properties, complex ions, colour)",
          "Organic chemistry: alkenes, alcohols, halogenoalkanes, carbonyl compounds, carboxylic acids, aromatic chemistry",
          "Polymers",
        ],
      },
      {
        number: 3,
        name: "General and Practical Principles of Chemistry",
        paperLabel: "Paper 3 · 2hrs 30min",
        durationMinutes: 150,
        topics: [
          "Synoptic content from Units 1 and 2",
          "Practical skills and experimental techniques",
          "Data analysis, error analysis, graph interpretation",
        ],
      },
      {
        number: 4,
        name: "Rates, Equilibria and Further Organic Chemistry",
        paperLabel: "Paper 4 · A-Level only · 1hr 45min",
        durationMinutes: 105,
        aLevelOnly: true,
        topics: [
          "Kinetics II (rate equations, half-life, Arrhenius equation)",
          "Equilibrium II (Kc, Kp calculations)",
          "Acid-base equilibria (pH, buffers, titration curves)",
          "Further organic chemistry: amino acids, proteins, NMR, mass spec",
        ],
      },
      {
        number: 5,
        name: "Transition Metals and Organic Nitrogen Chemistry",
        paperLabel: "Paper 5 · A-Level only · 1hr 45min",
        durationMinutes: 105,
        aLevelOnly: true,
        topics: [
          "Transition metals in depth (electrode potentials, redox titrations)",
          "Organic nitrogen compounds (amines, amides, amino acids)",
          "Polymers and synthesis routes",
        ],
      },
      {
        number: 6,
        name: "Practical Chemistry and Research Skills",
        paperLabel: "Paper 6 · A-Level only · 1hr 20min",
        durationMinutes: 80,
        aLevelOnly: true,
        topics: [
          "Planning and carrying out experiments",
          "Quantitative analysis techniques",
          "Evaluating results, identifying errors",
          "Research skills",
        ],
      },
    ],
  },

  physics: {
    code: "physics",
    name: "Physics",
    emoji: "⚛",
    spec: "9PH0",
    units: [
      {
        number: 1,
        name: "Mechanics and Materials",
        paperLabel: "Paper 1 · 1hr 45min",
        durationMinutes: 105,
        topics: [
          "Working as a Physicist (SI units, errors, sig figs)",
          "Mechanics (scalars/vectors, SUVAT, projectiles, Newton's laws)",
          "Materials (stress, strain, Young's modulus, elastic/plastic)",
          "Further Mechanics (momentum, collisions, circular motion)",
        ],
      },
      {
        number: 2,
        name: "Waves and Electricity",
        paperLabel: "Paper 2 · 1hr 45min",
        durationMinutes: 105,
        topics: [
          "Waves (transverse, longitudinal, superposition, diffraction)",
          "Particle nature of light (photoelectric effect, de Broglie)",
          "Electric circuits (Ohm's law, EMF, internal resistance, power, potential dividers)",
          "Capacitors (charge/discharge, time constants)",
        ],
      },
      {
        number: 3,
        name: "Practical Physics",
        paperLabel: "Paper 3 · AS only · 1hr 30min",
        durationMinutes: 90,
        topics: [
          "Experimental design, data collection",
          "Graph analysis, uncertainties, conclusions",
        ],
      },
      {
        number: 4,
        name: "Further Mechanics, Fields and Particles",
        paperLabel: "Paper 4 · A-Level only · 1hr 45min",
        durationMinutes: 105,
        aLevelOnly: true,
        topics: [
          "Further Mechanics (simple harmonic motion, resonance)",
          "Electric and magnetic fields (Coulomb's law, capacitors in fields, magnetic force, electromagnetic induction, transformers)",
          "Nuclear and particle physics (radioactive decay, nuclear energy, particle accelerators, the Standard Model)",
        ],
      },
      {
        number: 5,
        name: "Thermodynamics, Radiation, Oscillations and Cosmology",
        paperLabel: "Paper 5 · A-Level only · 1hr 45min",
        durationMinutes: 105,
        aLevelOnly: true,
        topics: [
          "Thermodynamics (Boltzmann constant, ideal gases, specific heat)",
          "Radiation (blackbody radiation, Wien's law, Stefan-Boltzmann)",
          "Gravitational fields (Newton's law, orbital motion, escape velocity)",
          "Oscillations (SHM equations, damping, forced oscillations)",
          "Space and cosmology (Hubble's law, Big Bang, stellar evolution)",
        ],
      },
      {
        number: 6,
        name: "Practical Physics and Research Skills",
        paperLabel: "Paper 6 · A-Level only · 1hr 20min",
        durationMinutes: 80,
        aLevelOnly: true,
        topics: [
          "Planning investigations",
          "Implementing and recording results",
          "Analysing and evaluating",
          "Research skills and scientific communication",
        ],
      },
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

// Grade boundaries — indicative, recent Edexcel data
export interface GradeBoundary { grade: string; minPercent: number; }
export const GRADE_BOUNDARIES: Record<SubjectCode, GradeBoundary[]> = {
  mathematics: [
    { grade: "A*", minPercent: 75 },
    { grade: "A", minPercent: 65 },
    { grade: "B", minPercent: 55 },
    { grade: "C", minPercent: 45 },
    { grade: "D", minPercent: 35 },
  ],
  biology: [
    { grade: "A", minPercent: 69 },
    { grade: "B", minPercent: 59 },
    { grade: "C", minPercent: 49 },
    { grade: "D", minPercent: 40 },
  ],
  chemistry: [
    { grade: "A", minPercent: 70 },
    { grade: "B", minPercent: 60 },
    { grade: "C", minPercent: 50 },
    { grade: "D", minPercent: 41 },
  ],
  physics: [
    { grade: "A", minPercent: 68 },
    { grade: "B", minPercent: 58 },
    { grade: "C", minPercent: 48 },
    { grade: "D", minPercent: 39 },
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
    case "A*": return "hsl(45 95% 55%)";    // gold
    case "A":  return "hsl(152 76% 48%)";   // green
    case "B":  return "hsl(210 90% 60%)";   // blue
    case "C":  return "hsl(36 92% 55%)";    // amber
    default:   return "hsl(230 12% 60%)";   // grey
  }
};

// Recommended timing per subject
export const minutesPerMark = (subject: SubjectCode): number =>
  subject === "mathematics" ? 1.4 : 1.2;
