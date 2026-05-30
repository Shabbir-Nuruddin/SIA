import { CIE_SUBJECTS } from "./cieSyllabus";

// --- IGCSE CIE Imports ---
import { ciePhysics0625 } from "./data/cie-physics-0625";
import { cieBiology0610 } from "./data/cie-biology-0610";
import { cieChemistry0620 } from "./data/cie-chemistry-0620";
import { cieMaths0580 } from "./data/cie-maths-0580";

// --- IGCSE Edexcel Imports ---
import { edexcelPhysics4PH1 } from "./data/edexcel-physics-4ph1";
import { edexcelBiology4BI1 } from "./data/edexcel-biology-4bi1";
import { edexcelChemistry4CH1 } from "./data/edexcel-chemistry-4ch1";
import { edexcelMaths4MA1 } from "./data/edexcel-maths-4ma1";

export type SubjectCode = "mathematics" | "biology" | "chemistry" | "physics";
export type Board = "edexcel-ial" | "cie" | "cie-igcse" | "edexcel-igcse";

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
  units?: UnitMeta[]; // Made optional to support IGCSE
  topics?: any[];    // Added to support IGCSE
}

// === EDEXCEL IAL — full default catalogue ===
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
        paperLabel: "Unit 1 · WBI11 · IAS · 1hr 30min · 80 marks", durationMinutes: 90,
        topics: [
          "Water Properties and Hydrogen Bonding",
          "Monosaccharides and Reducing Sugars",
          "Disaccharides and Glycosidic Bonds",
          "Polysaccharides — Glycogen and Starch",
          "Triglycerides and Fatty Acids",
          "Phospholipids and the Fluid Mosaic Model",
          "Cell Surface Membrane Structure",
          "Diffusion and Facilitated Diffusion",
          "Osmosis and Water Potential",
          "Active Transport",
          "DNA Structure",
          "RNA and the Genetic Code",
          "Transcription",
          "Translation",
          "Gene Mutations",
          "Genetic Screening — PCR and Gel Electrophoresis",
          "Why Animals Need a Circulatory System",
          "Blood Vessel Structure and Function",
          "Cardiac Cycle",
          "Heart Structure",
          "Haemoglobin and Oxygen Transport",
          "Atherosclerosis",
          "Blood Clotting",
          "Cardiovascular Disease Risk Factors",
        ],
      },
      { number: 2, unitCode: "U2", name: "Development, Plants and the Environment",
        paperLabel: "Unit 2 · WBI12 · IAS · 1hr 30min · 80 marks", durationMinutes: 90,
        topics: [
          "Prokaryotic Cell Structure",
          "Eukaryotic Cell Structure and Organelles",
          "Comparing Prokaryotic and Eukaryotic Cells",
          "Light Microscopy vs Electron Microscopy",
          "Cell Fractionation",
          "Cell Cycle and Mitosis",
          "Cancer and Uncontrolled Mitosis",
          "Meiosis and Genetic Variation",
          "Stem Cells and Totipotency",
          "Cell Differentiation",
          "β-glucose Structure",
          "Cellulose — Structure and Function",
          "Plant Cell Structure",
          "Classification — Three Domains and Five Kingdoms",
          "Phylogenetics and Molecular Evidence",
          "Biodiversity — Simpson's Diversity Index",
          "Sampling Methods — Quadrats and Transects",
          "Conservation — In Situ and Ex Situ",
        ],
      },
      { number: 3, unitCode: "U3", name: "Practical Skills in Biology I",
        paperLabel: "Unit 3 · WBI13 · IAS · 1hr 20min", durationMinutes: 80,
        topics: [
          "Enzyme Temperature Investigation",
          "Enzyme Substrate Concentration",
          "Enzyme pH Investigation",
          "Osmosis in Plant Tissue",
          "Microscopy and Cell Measurement",
          "Photosynthesis Rate — Light Wavelengths",
          "Transpiration and Potometers",
          "Statistical Analysis — t-test and Chi-squared",
          "Graph Skills and Error Bars",
          "Sources of Error — Systematic and Random",
          "Validity and Reliability in Biology Practicals",
        ],
      },
      { number: 4, unitCode: "U4", name: "Energy, Environment, Microbiology and Immunity",
        paperLabel: "Unit 4 · WBI14 · IA2 · 1hr 45min · 90 marks", durationMinutes: 105, aLevelOnly: true,
        topics: [
          "ATP Structure and Hydrolysis",
          "Light-Dependent Reactions of Photosynthesis",
          "Light-Independent Reactions — Calvin Cycle",
          "Limiting Factors for Photosynthesis",
          "Food Chains and Energy Flow in Ecosystems",
          "Gross and Net Primary Production",
          "Carbon Cycle",
          "Nitrogen Cycle and Eutrophication",
          "Bacterial Growth Phases",
          "Aseptic Technique and Culture Media",
          "Antibiotic Resistance",
          "Viruses — Influenza and Antigenic Variation",
          "Non-Specific Immunity and Phagocytosis",
          "Specific Humoral Immunity and B Cells",
          "Antibody Structure",
          "Specific Cell-Mediated Immunity and T Cells",
          "Primary and Secondary Immune Response",
          "Vaccines and Herd Immunity",
          "Monoclonal Antibodies",
          "HIV and AIDS",
        ],
      },
      { number: 5, unitCode: "U5", name: "Respiration, Internal Environment, Coordination and Gene Technology",
        paperLabel: "Unit 5 · WBI15 · IA2 · 1hr 45min · 90 marks", durationMinutes: 105, aLevelOnly: true,
        topics: [
          "Glycolysis",
          "Link Reaction",
          "Krebs Cycle",
          "Oxidative Phosphorylation and Chemiosmosis",
          "Anaerobic Respiration",
          "Respiratory Quotient",
          "Homeostasis and Negative Feedback",
          "Thermoregulation",
          "Blood Glucose Regulation — Insulin and Glucagon",
          "Type 1 and Type 2 Diabetes",
          "Kidney Structure",
          "Ultrafiltration and Selective Reabsorption",
          "Loop of Henle — Countercurrent Multiplier",
          "ADH and Osmoregulation",
          "Neurone Structure",
          "Resting Potential",
          "Action Potential",
          "Saltatory Conduction",
          "Synaptic Transmission",
          "Endocrine Coordination",
          "PCR and Gel Electrophoresis",
          "Genetic Engineering and Recombinant DNA",
          "CRISPR-Cas9 Gene Editing",
          "Gene Therapy",
          "DNA Profiling",
        ],
      },
      { number: 6, unitCode: "U6", name: "Practical Skills in Biology II",
        paperLabel: "Unit 6 · WBI16 · IA2 · 1hr 20min", durationMinutes: 80, aLevelOnly: true,
        topics: [
          "Antibiotic Effectiveness — Zones of Inhibition",
          "Microbial Growth Curves",
          "Investigating Photosynthesis with DCPIP",
          "Respiration with a Respirometer",
          "Fermentation Rate Investigation",
          "Chromatography of Chloroplast Pigments",
          "Advanced Statistical Tests — Mann-Whitney and Spearman's",
          "Evaluating Experimental Design",
          "Microbiological Counting Techniques",
        ],
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
        paperLabel: "Unit 1 · WPH11 · IAS · 1hr 30min · 80 marks", durationMinutes: 90,
        topics: [
          "Kinematics — SUVAT Equations",
          "Graphs of Motion",
          "Projectile Motion",
          "Free Fall and Terminal Velocity",
          "Newton's Laws of Motion",
          "Free Body Diagrams and Resolving Forces",
          "Moments, Couples and Equilibrium",
          "Work, Energy and Power",
          "Conservation of Energy",
          "Momentum and Impulse",
          "Elastic and Inelastic Collisions",
          "Density and Pressure",
          "Hooke's Law and Spring Constant",
          "Young's Modulus",
          "Stress-Strain Graphs and Material Properties",
        ],
      },
      { number: 2, unitCode: "U2", name: "Waves and Electricity",
        paperLabel: "Unit 2 · WPH12 · IAS · 1hr 30min · 80 marks", durationMinutes: 90,
        topics: [
          "Wave Properties — Amplitude, Frequency, Wavelength",
          "Transverse and Longitudinal Waves",
          "Reflection and Refraction — Snell's Law",
          "Total Internal Reflection and Optical Fibres",
          "Diffraction and Superposition",
          "Stationary Waves — Nodes and Antinodes",
          "Interference and Young's Double Slit",
          "Diffraction Gratings",
          "Polarisation",
          "Electromagnetic Spectrum",
          "Photoelectric Effect",
          "Photons and Energy Levels",
          "De Broglie Wavelength and Wave-Particle Duality",
          "Electric Current, Charge and Drift Velocity",
          "Resistance, Resistivity and Ohm's Law",
          "I-V Characteristics",
          "Power and Energy in Circuits",
          "Series and Parallel Circuits",
          "EMF and Internal Resistance",
          "Kirchhoff's Laws",
          "Potential Dividers",
        ],
      },
      { number: 3, unitCode: "U3", name: "Practical Skills in Physics I",
        paperLabel: "Unit 3 · WPH13 · IAS · 1hr 20min", durationMinutes: 80,
        topics: [
          "Measurement Uncertainty and Error Analysis",
          "Significant Figures and Recording Results",
          "Types of Error — Random and Systematic",
          "Graph Skills — Best-Fit Lines and Gradients",
          "Linearising Relationships",
          "Free-Fall Experiment — Determining g",
          "Young's Modulus Experiment",
          "Spring Constant Experiment",
          "Newton's Second Law Verification",
          "Refractive Index of Glass",
          "I-V Characteristics Investigation",
          "Wavelength Measurement — Double Slit and Grating",
          "Resistivity Experiment",
          "EMF and Internal Resistance Experiment",
        ],
      },
      { number: 4, unitCode: "U4", name: "Further Mechanics, Fields and Particles",
        paperLabel: "Unit 4 · WPH14 · IA2 · 1hr 45min · 90 marks", durationMinutes: 105, aLevelOnly: true,
        topics: [
          "Circular Motion",
          "Simple Harmonic Motion — Equations and Graphs",
          "Energy in Simple Harmonic Motion",
          "Damping and Resonance",
          "Newton's Law of Gravitation",
          "Gravitational Fields and Field Strength",
          "Gravitational Potential",
          "Orbital Mechanics and Kepler's Third Law",
          "Geostationary Orbits",
          "Coulomb's Law",
          "Electric Fields and Field Strength",
          "Electric Potential",
          "Capacitance",
          "Energy Stored in a Capacitor",
          "Capacitor Charging and Discharging",
          "Magnetic Force on Current and Charge",
          "Electromagnetic Induction and Faraday's Law",
          "Alternating Current",
          "Nuclear Atom and Radioactive Decay",
          "Binding Energy and Mass Defect",
          "Particle Physics — Quarks and the Standard Model",
        ],
      },
      { number: 5, unitCode: "U5", name: "Thermodynamics, Radiation, Oscillations and Cosmology",
        paperLabel: "Unit 5 · WPH15 · IA2 · 1hr 45min · 90 marks", durationMinutes: 105, aLevelOnly: true,
        topics: [
          "Thermal Energy Transfer",
          "Internal Energy and Temperature",
          "Ideal Gas Laws — Boyle's and Charles's Law",
          "Ideal Gas Equation",
          "Kinetic Theory of Gases",
          "Nuclear Radiation — Alpha, Beta, Gamma",
          "Half-Life and Radioactive Decay Equations",
          "Nuclear Fission and Fusion",
          "Astrophysics — Stellar Luminosity and Stefan's Law",
          "Hertzsprung-Russell Diagram",
          "Cosmology — Hubble's Law and the Big Bang",
        ],
      },
      { number: 6, unitCode: "U6", name: "Practical Skills in Physics II",
        paperLabel: "Unit 6 · WPH16 · IA2 · 1hr 20min", durationMinutes: 80, aLevelOnly: true,
        topics: [
          "Advanced Uncertainty Analysis",
          "Evaluating Experimental Design in Physics",
          "SHM Experiments — Pendulum and Mass-Spring",
          "Investigating Capacitor Discharge",
          "Magnetic Field Investigations",
          "Radiation Safety and Measurements",
        ],
      },
    ],
  },
};

// IGCSE syllabus files use { topics: [{title, subtopics}] }, but onboarding
// expects SubjectMeta with units[]. Adapter: each top-level topic becomes a unit.
const EMOJI: Record<SubjectCode, string> = { mathematics: "∑", biology: "🧬", chemistry: "🧪", physics: "⚛" };
const adaptIgcse = (raw: any, code: SubjectCode, spec: string): SubjectMeta => ({
  code,
  name: raw.name,
  emoji: EMOJI[code],
  spec,
  units: (raw.topics || []).map((t: any, i: number) => ({
    number: i + 1,
    unitCode: `T${i + 1}`,
    name: t.title,
    paperLabel: `Topic ${i + 1}`,
    durationMinutes: 60,
    topics: (t.subtopics || []).map((s: any) => s.title),
  })),
});

// === IGCSE CIE CATALOGUE ===
export const IGCSE_CIE_SUBJECTS: Record<SubjectCode, SubjectMeta> = {
  mathematics: adaptIgcse(cieMaths0580, "mathematics", "0580"),
  biology: adaptIgcse(cieBiology0610, "biology", "0610"),
  chemistry: adaptIgcse(cieChemistry0620, "chemistry", "0620"),
  physics: adaptIgcse(ciePhysics0625, "physics", "0625"),
};

// === IGCSE EDEXCEL CATALOGUE ===
export const IGCSE_EDEXCEL_SUBJECTS: Record<SubjectCode, SubjectMeta> = {
  mathematics: adaptIgcse(edexcelMaths4MA1, "mathematics", "4MA1"),
  biology: adaptIgcse(edexcelBiology4BI1, "biology", "4BI1"),
  chemistry: adaptIgcse(edexcelChemistry4CH1, "chemistry", "4CH1"),
  physics: adaptIgcse(edexcelPhysics4PH1, "physics", "4PH1"),
};

export const SUBJECT_LIST: SubjectMeta[] = Object.values(SUBJECTS);

// Board-aware catalog: returns Edexcel IAL (default) or CIE subject metadata.
export function getSubjectsForBoard(board: Board | string | null | undefined): Record<SubjectCode, SubjectMeta> {
  if (board === "cie") return CIE_SUBJECTS;
  if (board === "cie-igcse") return IGCSE_CIE_SUBJECTS;
  if (board === "edexcel-igcse") return IGCSE_EDEXCEL_SUBJECTS;
  return SUBJECTS;
}

export function getSubjectListForBoard(board: Board | string | null | undefined): SubjectMeta[] {
  return Object.values(getSubjectsForBoard(board));
}

export const BOARD_LABEL: Record<Board, string> = {
  "edexcel-ial": "Edexcel IAL",
  "cie": "Cambridge International (CIE) A Level",
  "cie-igcse": "Cambridge IGCSE",
  "edexcel-igcse": "Edexcel IGCSE",
};

export const GRADES = ["A*", "A", "B", "C", "D", "E"] as const;
export type Grade = typeof GRADES[number];

export const gradeGap = (target: Grade, current: Grade): number => {
  const idx = (g: Grade) => GRADES.indexOf(g);
  return Math.max(0, idx(current) - idx(target));
};

// Helper: short unit label like "Maths P1" or "Chemistry U4"
export const unitShortLabel = (subject: SubjectCode, unit_number: number | null | undefined, board?: string): string => {
  const meta = getSubjectsForBoard(board)[subject];
  if (!meta) return "";
  
  if (meta.units && unit_number != null) {
    const u = meta.units.find(x => x.number === unit_number);
    const code = u?.unitCode ?? `U${unit_number}`;
    const subShort = subject === "mathematics" ? "Maths"
                 : subject === "biology" ? "Biology"
                 : subject === "chemistry" ? "Chemistry"
                 : "Physics";
    return `${subShort} ${code}`;
  }
  return meta.name;
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
