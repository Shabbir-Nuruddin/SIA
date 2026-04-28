// Edexcel International A-Level Chemistry (XCH11 / YCH11)
// Topic names taken verbatim from the official specification (Issue 1, Sept 2017).
// Each topic carries its full statement-level content for AI grounding.

export interface SyllabusStatement {
  ref: string;          // e.g. "1.2"
  text: string;         // verbatim assessment statement (paraphrased lightly only when needed for plaintext)
}
export interface SyllabusTopic {
  number: number;       // 1..18
  name: string;         // exact topic name from spec
  unit: number;         // 1..6
  statements: SyllabusStatement[];
}

// Statements are condensed to plain text (no LaTeX/markdown) but follow the spec content.
export const CHEMISTRY_TOPICS: SyllabusTopic[] = [
  {
    number: 1, unit: 1, name: "Formulae, Equations and Amount of Substance",
    statements: [
      { ref: "1.1", text: "know the terms 'atom', 'element', 'ion', 'molecule', 'compound', 'empirical formula' and 'molecular formula'" },
      { ref: "1.2", text: "know that the mole (mol) is the unit for the amount of a substance and perform calculations using the Avogadro constant L (6.02 × 10^23 mol^-1)" },
      { ref: "1.3", text: "write balanced full and ionic equations, including state symbols, for chemical reactions" },
      { ref: "1.4", text: "understand 'relative atomic mass' (12C scale), 'relative molecular/formula mass', 'molar mass' in g mol^-1, and parts per million (ppm)" },
      { ref: "1.5", text: "calculate the concentration of a solution in mol dm^-3 and g dm^-3 (titration calcs not at this stage)" },
      { ref: "1.6", text: "use experimental data to calculate empirical and molecular formulae" },
      { ref: "1.7", text: "use chemical equations to calculate reacting masses and vice versa" },
      { ref: "1.8", text: "use chemical equations to calculate volumes of gases using molar volume and the ideal gas equation pV = nRT" },
      { ref: "1.9", text: "calculate percentage yields and percentage atom economies (by mass) using equations and experimental results" },
      { ref: "1.10", text: "determine a formula or confirm an equation by experiment, including evaluation of the data" },
      { ref: "1.11", text: "CORE PRACTICAL 1: Measurement of the molar volume of a gas" },
      { ref: "1.12", text: "relate ionic and full equations, with state symbols, to observations from simple test-tube experiments (displacement, acid reactions, precipitation)" },
    ],
  },
  {
    number: 2, unit: 1, name: "Atomic Structure and the Periodic Table",
    statements: [
      { ref: "2.1", text: "know the structure of an atom in terms of electrons, protons and neutrons" },
      { ref: "2.2", text: "know the relative mass and charge of protons, neutrons and electrons" },
      { ref: "2.3", text: "know what is meant by 'atomic (proton) number' and 'mass number'" },
      { ref: "2.4", text: "use the atomic and mass number to determine subatomic particle counts in atoms or ions" },
      { ref: "2.5", text: "understand the term 'isotope'" },
      { ref: "2.6", text: "understand the principles of a mass spectrometer; analyse mass spectra to deduce isotopic composition, calculate Ar, identify molecules, recognise 2+ ions" },
      { ref: "2.7", text: "predict mass spectra and relative peak heights for diatomic molecules including chlorine" },
      { ref: "2.8", text: "define first, second and third ionisation energies; understand all are endothermic" },
      { ref: "2.9", text: "know that an orbital holds up to two electrons with opposite spins" },
      { ref: "2.10", text: "understand how ionisation energies depend on nuclear charge, shielding and sub-shell from which the electron is removed" },
      { ref: "2.11", text: "know that successive ionisation energies provide evidence for quantum shells; first ionisation trends provide evidence for sub-shells" },
      { ref: "2.12", text: "describe the shapes of s and p orbitals" },
      { ref: "2.13", text: "know orbitals in sub-shells fill singly first, then pair with opposite spins" },
      { ref: "2.14", text: "predict electronic configuration of H to Kr atoms and ions using s, p, d notation and electrons-in-boxes" },
      { ref: "2.15", text: "understand electronic configuration determines chemical properties" },
      { ref: "2.16", text: "know the Periodic Table is divided into s, p, d blocks; sub-shell capacities in the first four quantum shells" },
      { ref: "2.17", text: "represent first ionisation data graphically (including logarithms) for elements 1–36; explain 'periodic property'" },
      { ref: "2.18", text: "explain trends in melting/boiling temperatures across Periods 2 and 3, ionisation energy trends across periods, and decrease down a group" },
    ],
  },
  {
    number: 3, unit: 1, name: "Bonding and Structure",
    statements: [
      { ref: "3.1", text: "interpret evidence for ions: physical properties, electron density maps, migration of ions" },
      { ref: "3.2", text: "describe the formation of ions in terms of loss/gain of electrons" },
      { ref: "3.3", text: "draw dot-and-cross diagrams for cations and anions" },
      { ref: "3.4", text: "describe ionic crystals as giant lattices of ions" },
      { ref: "3.5", text: "ionic bonding = strong net electrostatic attraction between ions" },
      { ref: "3.6", text: "effects of ionic radius and charge on strength of ionic bonding" },
      { ref: "3.7", text: "trends in ionic radii down a group and across an isoelectronic set (N3- to Al3+)" },
      { ref: "3.8", text: "meaning of 'polarisation' applied to ions" },
      { ref: "3.9", text: "polarising power of cations and polarisability of anions depend on radius and charge" },
      { ref: "3.10", text: "covalent bonding = strong electrostatic attraction between two nuclei and shared pair of electrons" },
      { ref: "3.11", text: "draw dot-and-cross diagrams for covalent species incl. single/double/triple, dative covalent (Al2Cl6, NH4+)" },
      { ref: "3.12", text: "structures of giant carbon lattices: graphite, diamond, graphene, and applications" },
      { ref: "3.13", text: "meaning of 'electronegativity' for atoms in a covalent bond" },
      { ref: "3.14", text: "ionic and covalent bonding as extremes of a continuum, explained by electronegativity differences and bond polarity" },
      { ref: "3.15", text: "distinguish polar bonds vs polar molecules; predict molecular polarity" },
      { ref: "3.16", text: "principles of electron-pair repulsion theory to predict shapes of molecules and ions" },
      { ref: "3.17", text: "terms 'bond length' and 'bond angle'" },
      { ref: "3.18", text: "know shapes/bond angles of BeCl2, BCl3, CH4, NH3, NH4+, H2O, CO2, gaseous PCl5, SF6, C2H4" },
      { ref: "3.19", text: "apply electron-pair repulsion theory to predict shapes/bond angles of analogous molecules and ions" },
      { ref: "3.20", text: "metals are giant lattices of metal ions in a sea of delocalised electrons" },
      { ref: "3.21", text: "explain physical properties of metals (conductivity, melting points, malleability) in terms of metallic bonding" },
    ],
  },
  {
    number: 4, unit: 1, name: "Introductory Organic Chemistry and Alkanes",
    statements: [
      { ref: "4.1", text: "general formulae, homologous series, structural and skeletal formulae, displayed formulae" },
      { ref: "4.2", text: "IUPAC nomenclature for alkanes, alkenes, halogenoalkanes, alcohols up to six carbons; cyclic and branched" },
      { ref: "4.3", text: "definitions of structural isomerism (chain, position, functional group)" },
      { ref: "4.4", text: "homolytic vs heterolytic bond fission; free radicals; curly arrow conventions" },
      { ref: "4.5", text: "alkanes as saturated hydrocarbons; combustion (complete and incomplete) and pollutants" },
      { ref: "4.6", text: "free radical substitution of alkanes by chlorine and bromine; mechanism (initiation, propagation, termination)" },
      { ref: "4.7", text: "fractional distillation of crude oil; cracking; isomerisation; reforming" },
    ],
  },
  {
    number: 5, unit: 1, name: "Alkenes",
    statements: [
      { ref: "5.1", text: "general formula of alkenes; alkenes/cycloalkenes are unsaturated (C=C with sigma + pi bond)" },
      { ref: "5.2", text: "geometric isomerism from restricted rotation around C=C and substituents on the carbon atoms" },
      { ref: "5.3", text: "the E–Z naming system for geometric isomers and why cis/trans breaks down" },
      { ref: "5.4", text: "reactions of alkenes: H2/Ni, halogens, hydrogen halides, steam/H+ to alcohols, acidified KMnO4 to diol" },
      { ref: "5.5", text: "qualitative test for C=C using bromine or bromine water" },
      { ref: "5.6", text: "mechanism of electrophilic addition of Br2 and HBr to ethene; HBr to propene; carbocation stability (1°<2°<3°)" },
      { ref: "5.7", text: "addition polymerisation of alkenes; draw repeat unit from monomer and vice versa" },
      { ref: "5.8", text: "limit problems of polymer disposal: biodegradable polymers; removing toxic incineration gases" },
    ],
  },
  {
    number: 6, unit: 2, name: "Energetics",
    statements: [
      { ref: "6.1", text: "enthalpy change ΔH = heat energy at constant pressure; standard conditions = 100 kPa and 298 K" },
      { ref: "6.2", text: "exothermic reactions = negative ΔH; endothermic = positive" },
      { ref: "6.3", text: "construct/interpret enthalpy level diagrams" },
      { ref: "6.4", text: "standard enthalpy changes: reaction, formation, combustion, neutralisation, atomisation" },
      { ref: "6.5", text: "calculate energy transferred (q = mcΔT) and ΔH in kJ mol^-1 from experimental data" },
      { ref: "6.6", text: "Hess's Law and applying it via enthalpy cycles to calculate ΔH" },
      { ref: "6.7", text: "CORE PRACTICAL 2: determine ΔH using Hess's Law" },
      { ref: "6.8", text: "evaluate experimental results, sources of error, assumptions; cooling-curve corrections" },
      { ref: "6.9", text: "bond enthalpy, mean bond enthalpy; use to calculate ΔH; understand limitations" },
      { ref: "6.10", text: "calculate mean bond enthalpies from ΔH of reaction" },
      { ref: "6.11", text: "bond enthalpy data indicates which bond breaks first and reaction speed at room T" },
    ],
  },
  {
    number: 7, unit: 2, name: "Intermolecular Forces",
    statements: [
      { ref: "7.1", text: "London forces (induced dipole), permanent dipole-dipole, hydrogen bonds" },
      { ref: "7.2", text: "interactions in H2O, liquid NH3, liquid HF leading to hydrogen bonding" },
      { ref: "7.3", text: "anomalous properties of water from hydrogen bonding (high mp/bp; density of ice vs water)" },
      { ref: "7.4", text: "predict hydrogen bonding in analogous molecules" },
      { ref: "7.5", text: "explain physical properties via intermolecular forces: alkane bp trends, branching, alcohols vs alkanes, HF–HI bp trend" },
      { ref: "7.6", text: "factors choosing solvents: water for ionic/alcohol; non-aqueous for like-with-like" },
    ],
  },
  {
    number: 8, unit: 2, name: "Redox Chemistry and Groups 1, 2 and 7",
    statements: [
      { ref: "8.1", text: "oxidation number and rules for assigning it" },
      { ref: "8.2", text: "calculate oxidation numbers in compounds and ions, including peroxides and metal hydrides" },
      { ref: "8.3", text: "indicate oxidation number in a compound/ion using a Roman numeral" },
      { ref: "8.4", text: "write formulae given oxidation numbers" },
      { ref: "8.5", text: "oxidation/reduction in terms of electron transfer and oxidation number changes; apply to s/p block" },
      { ref: "8.6", text: "oxidising agents gain electrons; reducing agents lose electrons" },
      { ref: "8.7", text: "disproportionation: same element simultaneously oxidised and reduced" },
      { ref: "8.8", text: "oxidation number useful in classifying redox/disproportionation" },
      { ref: "8.9", text: "metals form positive ions (oxidation no. increase); non-metals form negative ions (decrease)" },
      { ref: "8.10", text: "write ionic half-equations and combine into full ionic equations" },
      { ref: "8.11", text: "trend in ionisation energy down Groups 1 and 2" },
      { ref: "8.12", text: "trend in reactivity down Group 1 (Li–K) and Group 2 (Mg–Ba)" },
      { ref: "8.13", text: "reactions of Group 1 (Li–K) and Group 2 (Mg–Ba) with oxygen, chlorine, water" },
      { ref: "8.14", text: "reactions of Group 1/2 oxides and hydroxides with water and dilute acid" },
      { ref: "8.15", text: "trends in solubility of Group 2 hydroxides and sulfates" },
      { ref: "8.16", text: "thermal stability of Group 1 and 2 nitrates and carbonates" },
      { ref: "8.17", text: "flame test colours for Group 1 and 2 ions; explanation in terms of electron transitions" },
      { ref: "8.18", text: "trends in halogen reactivity Cl–I; displacement reactions; oxidising power" },
      { ref: "8.19", text: "tests for halide ions using acidified silver nitrate and ammonia; tests for halogens with starch/iodide" },
      { ref: "8.20", text: "disproportionation of chlorine in water and alkali; uses in water treatment and bleach" },
      { ref: "8.21", text: "reactions of solid halide ions with concentrated sulfuric acid; redox products" },
    ],
  },
  {
    number: 9, unit: 2, name: "Introduction to Kinetics and Equilibria",
    statements: [
      { ref: "9.1", text: "rate of reaction definition and measurement (gas volume, mass, colour, conductivity, titration)" },
      { ref: "9.2", text: "collision theory; activation energy" },
      { ref: "9.3", text: "Maxwell–Boltzmann distribution; effect of temperature on the curve and on rate" },
      { ref: "9.4", text: "effect of concentration, pressure, surface area, catalyst on rate" },
      { ref: "9.5", text: "catalysts: lower Ea, alternative pathway; not consumed; homogeneous vs heterogeneous (qualitative)" },
      { ref: "9.6", text: "dynamic equilibrium in closed systems; equal forward/backward rates" },
      { ref: "9.7", text: "Le Chatelier's principle: effect of concentration, pressure, temperature; catalysts no effect on position" },
      { ref: "9.8", text: "industrial conditions chosen on rate vs yield (e.g. Haber, Contact)" },
    ],
  },
  {
    number: 10, unit: 2, name: "Organic Chemistry: Halogenoalkanes, Alcohols and Spectra",
    statements: [
      { ref: "10.1", text: "halogenoalkane classification: primary, secondary, tertiary" },
      { ref: "10.2", text: "nucleophilic substitution mechanisms: SN1 (tertiary) and SN2 (primary); curly arrows" },
      { ref: "10.3", text: "reactions of halogenoalkanes with aqueous OH-, alcoholic NH3, alcoholic CN-, alcoholic OH- (elimination)" },
      { ref: "10.4", text: "comparative rates of hydrolysis of C–Cl, C–Br, C–I (bond enthalpies)" },
      { ref: "10.5", text: "uses and environmental issues of halogenoalkanes (CFCs and ozone depletion)" },
      { ref: "10.6", text: "alcohol classification (1°, 2°, 3°)" },
      { ref: "10.7", text: "preparation of alcohols from halogenoalkanes (hydrolysis) and alkenes (acid-catalysed hydration)" },
      { ref: "10.8", text: "combustion of alcohols; biofuels and carbon-neutrality discussion" },
      { ref: "10.9", text: "oxidation of alcohols with acidified K2Cr2O7: 1° to aldehyde then carboxylic acid; 2° to ketone; 3° resists" },
      { ref: "10.10", text: "distinguishing aldehydes and ketones with Fehling's/Benedict's and Tollens' reagents; using acidified K2Cr2O7" },
      { ref: "10.11", text: "dehydration of alcohols to alkenes (concentrated H2SO4 or Al2O3)" },
      { ref: "10.12", text: "halogenation of alcohols (PCl5, PCl3, SOCl2, HBr/HCl)" },
      { ref: "10.13", text: "infrared spectroscopy: identifying functional groups from absorption frequencies; greenhouse gas links" },
      { ref: "10.14", text: "mass spectrometry of organic compounds: M+ peak, fragmentation patterns" },
      { ref: "10.15", text: "use IR + MS data to deduce structures of simple molecules" },
      { ref: "10.16", text: "interpretation of (low-resolution) proton NMR not required at IAS" },
      { ref: "10.17", text: "interpret IR absorption bands for O–H, N–H, C=O, C–H, C–O" },
      { ref: "10.18", text: "CORE PRACTICALS in this topic: oxidation of an alcohol; tests for aldehydes/ketones" },
    ],
  },
  {
    number: 11, unit: 4, name: "Kinetics",
    statements: [
      { ref: "11.1", text: "definitions: rate of reaction; rate equation rate = k[A]^m[B]^n; orders; rate constant; half-life; rate-determining step; activation energy; heterogeneous/homogeneous catalyst" },
      { ref: "11.2", text: "calculate half-life from a graph; constant half-life ⇒ first order" },
      { ref: "11.3", text: "select/justify experimental technique for rate data: titration, colorimetry, mass change, gas volume" },
      { ref: "11.4", text: "initial-rate method (incl. clock reactions) and continuous monitoring methods" },
      { ref: "11.5", text: "deduce orders (0, 1, 2) from concentration-time, rate-concentration, initial-rate data" },
      { ref: "11.6", text: "obtain orders for the acid-catalysed iodination of propanone and deduce mechanism / RDS" },
      { ref: "11.7", text: "deduce rate-determining step from rate equation and vice versa" },
      { ref: "11.8", text: "deduce reaction mechanism from rate equation and stoichiometric equation" },
      { ref: "11.9", text: "evidence for SN1 vs SN2 hydrolysis of tertiary vs primary halogenoalkanes from rate equations" },
      { ref: "11.10", text: "calculate activation energy from experimental data using the Arrhenius equation (given when needed)" },
      { ref: "11.11", text: "heterogeneous catalysts in industry: surface adsorption mechanism" },
      { ref: "11.12", text: "CORE PRACTICALS 9a/9b: iodine-propanone reaction by titration; Harcourt-Esson iodine clock" },
      { ref: "11.13", text: "CORE PRACTICAL 10: finding the activation energy of a reaction" },
    ],
  },
  {
    number: 12, unit: 4, name: "Entropy and Energetics",
    statements: [
      { ref: "12.1", text: "entropy as a measure of disorder; standard entropy values" },
      { ref: "12.2", text: "predict sign of ΔS for a reaction (changes in state, moles of gas)" },
      { ref: "12.3", text: "calculate ΔS_system from standard entropies" },
      { ref: "12.4", text: "ΔS_surroundings = -ΔH/T; ΔS_total = ΔS_system + ΔS_surroundings" },
      { ref: "12.5", text: "feasibility: spontaneous when ΔS_total > 0; effect of temperature" },
      { ref: "12.6", text: "lattice energy definition (formation from gaseous ions); exothermic; factors affecting magnitude (charge density)" },
      { ref: "12.7", text: "Born–Haber cycles: construct and use to calculate lattice energy or any unknown enthalpy" },
      { ref: "12.8", text: "compare experimental lattice energies to those calculated assuming pure ionic model; evidence for covalent character (polarisation)" },
      { ref: "12.9", text: "enthalpy changes of solution and hydration; use to calculate ΔH_sol from cycle" },
    ],
  },
  {
    number: 13, unit: 4, name: "Chemical Equilibria",
    statements: [
      { ref: "13.1", text: "equilibrium constant Kc and Kp expressions; units" },
      { ref: "13.2", text: "calculate Kc and Kp from equilibrium concentrations or partial pressures" },
      { ref: "13.3", text: "effect of changing concentration, pressure, temperature on Kc/Kp; catalysts have no effect" },
      { ref: "13.4", text: "calculate equilibrium amounts/concentrations using ICE tables" },
      { ref: "13.5", text: "interpret the size of K to predict extent of reaction" },
    ],
  },
  {
    number: 14, unit: 4, name: "Acid-base Equilibria",
    statements: [
      { ref: "14.1", text: "Brønsted–Lowry acids and bases; conjugate acid–base pairs" },
      { ref: "14.2", text: "pH = -log10[H+]; calculate pH of strong acids and strong bases (using Kw)" },
      { ref: "14.3", text: "Ka and pKa for weak acids; calculate pH of weak monobasic acids" },
      { ref: "14.4", text: "buffer solutions: composition; calculate pH (Henderson-Hasselbalch)" },
      { ref: "14.5", text: "titration curves for strong/weak acid–base combinations; choice of indicator" },
      { ref: "14.6", text: "CORE PRACTICAL: pH titration to find concentration; identify equivalence point and indicator" },
    ],
  },
  {
    number: 15, unit: 4, name: "Organic Chemistry: Carbonyls, Carboxylic Acids and Chirality",
    statements: [
      { ref: "15.1", text: "structure and naming of aldehydes, ketones, carboxylic acids, esters, acyl chlorides, acid anhydrides, amides" },
      { ref: "15.2", text: "addition reactions of carbonyls: H2/Ni or NaBH4 reduction; HCN + NaCN as nucleophilic addition (mechanism with curly arrows)" },
      { ref: "15.3", text: "tests for aldehydes/ketones: Tollens', Fehling's, 2,4-DNP and melting point identification" },
      { ref: "15.4", text: "carboxylic acids: acidity (Ka comparison), reactions with metals, carbonates, alkalis" },
      { ref: "15.5", text: "esterification with alcohols using acid catalysis; mechanism; uses of esters" },
      { ref: "15.6", text: "acid hydrolysis and base hydrolysis (saponification) of esters" },
      { ref: "15.7", text: "acyl chlorides and anhydrides: formation of esters, amides, carboxylic acids; relative reactivity" },
      { ref: "15.8", text: "chirality, optical isomerism, optical activity, racemic mixtures; significance in pharmaceuticals" },
    ],
  },
  {
    number: 16, unit: 5, name: "Redox Equilibria, Transition Metals and Inorganic Chemistry",
    statements: [
      { ref: "16.1", text: "standard electrode potentials; standard hydrogen electrode; measurement using a salt bridge" },
      { ref: "16.2", text: "calculate Ecell; predict feasibility of redox reactions" },
      { ref: "16.3", text: "limitations of E predictions: kinetics, non-standard conditions" },
      { ref: "16.4", text: "fuel cells (H2/O2); advantages over conventional energy" },
      { ref: "16.5", text: "transition metals definition (incomplete d-subshell ions); Sc and Zn excluded" },
      { ref: "16.6", text: "variable oxidation states; coloured ions (d-d transitions); catalytic activity" },
      { ref: "16.7", text: "complex ions: ligands (mono/bi/multidentate), coordination number, shapes (linear, tetrahedral, square planar, octahedral)" },
      { ref: "16.8", text: "ligand substitution reactions; chelate effect; cis/trans isomerism in complexes; cisplatin" },
      { ref: "16.9", text: "redox titrations using KMnO4 and Na2S2O3 (with starch indicator); calculations" },
      { ref: "16.10", text: "CORE PRACTICALS: redox titrations" },
    ],
  },
  {
    number: 17, unit: 5, name: "Organic Nitrogen Chemistry: Amines, Amides, Amino Acids and Proteins",
    statements: [
      { ref: "17.1", text: "preparation of amines: from halogenoalkane + ammonia; reduction of nitriles; reduction of nitro compounds" },
      { ref: "17.2", text: "basicity of aliphatic vs aromatic amines (electron donation/withdrawal)" },
      { ref: "17.3", text: "reactions of amines with acids, acyl chlorides, halogenoalkanes" },
      { ref: "17.4", text: "amides: hydrolysis; relationship with carboxylic acids" },
      { ref: "17.5", text: "amino acids: zwitterions, isoelectric point, pH-dependent behaviour" },
      { ref: "17.6", text: "peptide bond formation; primary, secondary, tertiary structure of proteins" },
      { ref: "17.7", text: "polyamides and polyesters; condensation polymerisation; nylon, terylene; biodegradability" },
      { ref: "17.8", text: "azo dyes: diazonium salts and coupling; uses" },
    ],
  },
  {
    number: 18, unit: 5, name: "Organic Synthesis, Aromatic Chemistry and Modern Analytical Techniques",
    statements: [
      { ref: "18.1", text: "benzene structure: delocalised π system; evidence (enthalpy of hydrogenation, bond lengths)" },
      { ref: "18.2", text: "electrophilic substitution mechanisms: nitration, halogenation, Friedel–Crafts alkylation/acylation" },
      { ref: "18.3", text: "phenol: acidity vs alcohols; reactions with bromine water and FeCl3 test" },
      { ref: "18.4", text: "directing effects of substituents on benzene ring (2,4 vs 3 positions)" },
      { ref: "18.5", text: "synthetic routes: planning multi-step syntheses; functional group interconversions" },
      { ref: "18.6", text: "TLC and column chromatography; Rf values; principles" },
      { ref: "18.7", text: "high-resolution proton NMR: chemical shift, integration, splitting (n+1 rule); D2O exchange for OH/NH" },
      { ref: "18.8", text: "carbon-13 NMR: number of unique carbons; chemical shifts" },
      { ref: "18.9", text: "combine MS, IR, NMR data to identify organic structures" },
    ],
  },
];

export const TOPICS_BY_UNIT: Record<number, SyllabusTopic[]> = CHEMISTRY_TOPICS.reduce((acc, t) => {
  (acc[t.unit] ||= []).push(t);
  return acc;
}, {} as Record<number, SyllabusTopic[]>);

/** Find the syllabus topic that matches a topic name (case-insensitive contains). */
export const findChemistryTopic = (name: string): SyllabusTopic | undefined => {
  const n = name.toLowerCase();
  return CHEMISTRY_TOPICS.find(t => n.includes(t.name.toLowerCase()) || t.name.toLowerCase().includes(n));
};

/** Render syllabus context for AI grounding. */
export const chemistrySyllabusContext = (topic?: string): string => {
  if (topic) {
    const t = findChemistryTopic(topic);
    if (t) {
      return `Edexcel International A-Level Chemistry — Unit ${t.unit}, Topic ${t.number}: ${t.name}\nOfficial assessment statements (your scope is LIMITED to these — do not include content outside this list):\n${t.statements.map(s => `${s.ref} ${s.text}`).join("\n")}`;
    }
  }
  return CHEMISTRY_TOPICS.map(t => `Unit ${t.unit} · Topic ${t.number}: ${t.name}\n${t.statements.map(s => `  ${s.ref} ${s.text}`).join("\n")}`).join("\n\n");
};
