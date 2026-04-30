// Hardcoded roadmap topic lists per the spec (Edexcel IAL — fully supported).
// These supersede the topic lists in src/lib/subjects.ts when generating the roadmap.

import type { SubjectCode } from "./subjects";

export const ROADMAP_TOPICS: Record<SubjectCode, Record<number, string[]>> = {
  chemistry: {
    1: [
      "Formulae, Equations and Amount of Substance",
      "Atomic Structure and the Periodic Table",
      "Bonding and Structure",
      "Introductory Organic Chemistry and Alkanes",
      "Alkenes",
    ],
    2: [
      "Energetics",
      "Intermolecular Forces",
      "Redox Chemistry and Groups 1, 2 and 7",
      "Introduction to Kinetics and Equilibria",
      "Halogenoalkanes, Alcohols and Spectra",
    ],
    3: [
      "Practical techniques (Units 1 & 2)",
      "Data analysis, uncertainties and evaluation",
      "Tests for ions, gases and organic functional groups",
    ],
    4: [
      "Kinetics",
      "Entropy and Energetics",
      "Chemical Equilibria",
      "Acid-base Equilibria",
      "Electrochemistry",
      "Transition Metals",
      "Reactions of Inorganic Compounds in Aqueous Solution",
    ],
    5: [
      "Arenes",
      "Aldehydes and Ketones",
      "Carboxylic Acids and Derivatives",
      "Nitrogen Compounds",
      "Polymerisation",
      "Chemical Analysis and Detection",
    ],
    6: [
      "Planning, Implementing and Safety",
      "Analysis and Evaluation",
      "Experimental Techniques",
    ],
  },

  biology: {
    1: ["Lifestyle and Health", "Genes and Health"],
    2: ["Voice of the Genome", "Biodiversity and Natural Resources"],
    3: ["On the Wild Side", "Immunity Infection and Forensics"],
    4: ["Run for Your Life", "Grey Matter"],
    5: ["Batty About Bacteria (Microbiology)", "Cystic Fibrosis Gene Therapy"],
    6: ["Practical Skills"],
  },

  physics: {
    1: ["Mechanics", "Electric Circuits"],
    2: ["Waves and the Particle Nature of Light"],
    3: ["Practical"],
    4: ["Further Mechanics", "Electric and Magnetic Fields", "Nuclear and Particle Physics"],
    5: ["Thermodynamics", "Nuclear Radiation", "Oscillations and Cosmology"],
    6: ["Practical"],
  },

  // For Maths we use unit numbers 1..8 to map P1..P4, M1..M2, S1..S2.
  // The subjects.ts spec only defines P1, P2, P3 as units 1/2/3, so when a user has those units,
  // we serve the spec topic list; otherwise we fall back to the existing topics list.
  mathematics: {
    1: ["Algebra and Functions", "Coordinate Geometry", "Differentiation", "Integration", "Trigonometry", "Exponentials and Logarithms", "Vectors"],
    2: ["Further Algebra", "Series", "Further Calculus", "Further Trigonometry", "Numerical Methods"],
    3: ["Functions", "Further Trigonometry", "Differential Equations", "Vectors (3D)", "Complex Numbers"],
    4: ["Proof", "Polar Coordinates", "Hyperbolic Functions", "Further Differentiation", "Further Integration", "Further Vectors"],
  },
};

const FOUNDATIONAL_KEYWORDS = [
  "algebra and functions",
  "proof",
  "atomic structure",
  "formulae, equations",
  "bonding and structure",
  "mechanics",
  "lifestyle",
  "genes and health",
];

export function isFoundationalTopic(topic: string): boolean {
  const t = topic.toLowerCase();
  return FOUNDATIONAL_KEYWORDS.some(k => t.includes(k));
}
