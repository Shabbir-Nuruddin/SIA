// Per-unit USE / DO NOT USE lists.
// Reference implementation: Edexcel IAL Biology + Chemistry, Units 1, 2, 4, 5.
// To extend: add a new key with the same shape. Key format: `${qualification}|${subject}|${unit}`.
// qualification ∈ { "edexcel-ial", "cie", "edexcel-igcse", "cie-igcse" }
// subject ∈ { "biology", "chemistry", "physics", "mathematics" }
// unit = unit number (string)

export interface Boundary {
  unitName: string;
  use: string;
  doNotUse: string;
}

export const SYLLABUS_BOUNDARIES: Record<string, Boundary> = {
  // ---------------- EDEXCEL IAL BIOLOGY ----------------
  "edexcel-ial|biology|1": {
    unitName: "WBI11 — Molecules, Diet, Transport and Health",
    use: `water (dipole nature, role as solvent in transport), monosaccharides (glucose, fructose, galactose), disaccharides (maltose, sucrose, lactose — glycosidic bonds via condensation), polysaccharides (glycogen, amylose, amylopectin — structure and role in energy storage; β-glucose and cellulose are NOT in Unit 1 — they appear in Unit 2), Benedict's reagent semi-quantitative test for reducing sugars, iodine test for starch, triglycerides (ester bonds from glycerol + 3 fatty acids, condensation reaction, saturated vs unsaturated fatty acids), why animals need a circulatory system (mass transport overcomes diffusion limitations), blood vessel structure and function (capillaries, arteries, veins — wall structure and function), cardiac cycle (atrial systole, ventricular systole, cardiac diastole), heart structure (four chambers, major blood vessels, valves — bicuspid/tricuspid/semilunar), haemoglobin (role in O₂ and CO₂ transport, oxygen dissociation curve, Bohr effect, foetal haemoglobin higher affinity than adult), atherosclerosis (endothelial dysfunction → inflammatory response → plaque formation → raised blood pressure), blood clotting process (thromboplastin release, prothrombin → thrombin, fibrinogen → fibrin), cardiovascular disease risk factors (genetics, diet, age, gender, high blood pressure, smoking, physical inactivity), dietary antioxidants and CVD risk, analysis of quantitative health data (correlation vs causation). Unit 1 also includes: cell surface membrane fluid mosaic model, phospholipid bilayer, membrane proteins (channel, carrier, receptor), diffusion, facilitated diffusion, osmosis, active transport, DNA structure (double helix, base pairing A-T C-G, antiparallel strands, deoxyribose/phosphate backbone), RNA types (mRNA, tRNA, rRNA), genetic code (triplet codons, degenerate code), transcription (RNA polymerase, mRNA from template strand), translation (ribosomes, tRNA anticodons, polypeptide assembly), gene mutations (substitution, insertion, deletion — effect on protein), genetic screening techniques (PCR, gel electrophoresis — basic), ethical/social issues of genetic screening.`,
    doNotUse: `β-glucose, cellulose, mitosis, meiosis, chloroplast, plant cell structure, biodiversity indices, food chains, energy flow, microbiology, immunity beyond clotting, respiration pathways, nervous system, kidney, gene technology, genetic engineering.`,
  },
  "edexcel-ial|biology|2": {
    unitName: "WBI12 — Cells, Development, Biodiversity and Conservation",
    use: `cell structure — prokaryotic vs eukaryotic (prokaryotic: no membrane-bound nucleus, 70S ribosomes, circular DNA, plasmids, peptidoglycan cell wall, pili, flagella, capsule; eukaryotic: membrane-bound nucleus, 80S ribosomes, organelles), organelle functions (mitochondria, chloroplasts, rough/smooth ER, Golgi, lysosomes, centrioles, cell wall), magnification and resolution (light vs electron microscopy TEM/SEM), cell fractionation (homogenisation, differential centrifugation), cell cycle and mitosis (G1/S/G2 interphase; prophase, metaphase, anaphase, telophase, cytokinesis), cancer (uncontrolled mitosis, oncogenes), meiosis (haploid gametes; meiosis I — homologous pairs separate, crossing over at chiasmata, independent assortment; meiosis II — sister chromatids separate), stem cells (totipotent, pluripotent, multipotent), cell differentiation (selective gene expression), β-glucose, cellulose (β-1,4 glycosidic bonds, hydrogen bonds between chains, structural role in cell wall), plant cell structure (cell wall, large central vacuole, chloroplasts, plasmodesmata), classification (three domains, five kingdoms, binomial nomenclature, hierarchy), phylogenetics (cladistics, molecular phylogeny, cladograms), biodiversity (species richness, species evenness, Simpson's Diversity Index), sampling methods (random, systematic, stratified; quadrats, transects, mark-release-recapture — Lincoln Index), conservation (in situ vs ex situ, seed banks, captive breeding, CITES).`,
    doNotUse: `membranes and transport detail (Unit 1), blood vessels (Unit 1), cardiovascular disease (Unit 1), genetic code, transcription, translation (Unit 1), energy flow through ecosystems (Unit 4), microbiology (Unit 4), immunity (Unit 4), respiration (Unit 5), nervous system (Unit 5).`,
  },
  "edexcel-ial|biology|4": {
    unitName: "WBI14 — Energy, Environment, Microbiology and Immunity",
    use: `ATP structure and hydrolysis; photosynthesis overview; light-dependent reactions (photosystem II, photolysis of water, electron transport chain, photophosphorylation, photosystem I, NADP reduction; cyclic photophosphorylation); Calvin cycle (CO₂ + RuBP → 2GP via RuBisCO; GP → G3P using ATP and NADPH; G3P → RuBP and useful organic molecules); limiting factors for photosynthesis; food chains, energy flow in ecosystems (≈10% efficiency, pyramid of energy), GPP, NPP = GPP − R; nutrient cycles (carbon cycle, nitrogen cycle — Rhizobium, Azotobacter, Nitrosomonas, Nitrobacter, denitrification, ammonification; eutrophication). Microbiology: bacterial growth in culture (binary fission; lag/log/stationary/death phases), aseptic technique, culture media, antibiotic resistance mechanisms (mutation — altered binding site, β-lactamase, efflux pumps; horizontal gene transfer — conjugation, transformation, transduction; MRSA), viruses as pathogens (influenza haemagglutinin and neuraminidase; antigenic drift vs shift). Immunity: phagocytosis (neutrophils, macrophages); inflammation; specific humoral immunity (B lymphocytes, clonal selection, plasma cells, memory B cells); antibody structure (heavy + light chains, disulfide bonds, variable and constant regions); cell-mediated immunity (T helper, T cytotoxic via perforin/apoptosis, T memory, T regulatory); primary vs secondary immune response; vaccines (active vs passive; live attenuated, killed, subunit; herd immunity); monoclonal antibodies (hybridoma; ELISA, pregnancy tests, Herceptin); HIV mechanism (retrovirus, reverse transcriptase, integrase, CD4+ destruction, AIDS).`,
    doNotUse: `respiration pathways, nervous system, kidney, gene technology (all Unit 5); protein synthesis detail (Unit 1); cell division mechanism (Unit 2); classification (Unit 2).`,
  },
  "edexcel-ial|biology|5": {
    unitName: "WBI15 — Respiration, Internal Environment, Coordination and Gene Technology",
    use: `Respiration: glycolysis (cytoplasm; glucose → 2 pyruvate; net 2 ATP, 2 NADH), link reaction (matrix; pyruvate + CoA → acetyl-CoA + CO₂ + NADH), Krebs cycle (matrix; per turn 2CO₂, 3NADH, 1FADH₂, 1ATP), oxidative phosphorylation (inner mitochondrial membrane; complexes I–IV; chemiosmosis; ATP synthase; O₂ as terminal electron acceptor; 26–34 ATP per glucose), anaerobic respiration (lactate in animals, ethanol + CO₂ in yeast), respiratory quotient (carb 1.0; fat 0.7; protein 0.9; respirometer). Homeostasis: negative and positive feedback; thermoregulation (hypothalamus, vasodilation/vasoconstriction, sweating, shivering, piloerection; ectotherm vs endotherm); blood glucose regulation (islets of Langerhans, insulin via β cells, glucagon via α cells, GLUT4, glycogenesis/glycogenolysis/gluconeogenesis; Type 1 vs Type 2 diabetes); kidney structure and nephron function (Bowman's capsule, glomerulus ultrafiltration, PCT selective reabsorption, loop of Henle countercurrent multiplier, DCT, collecting duct, ADH from posterior pituitary, aquaporins). Coordination: neurone structure (cell body, axon, dendrites, myelin, Schwann cells, nodes of Ranvier); resting potential (−70 mV; Na⁺/K⁺ ATPase); action potential (depolarisation Na⁺ in, repolarisation K⁺ out, hyperpolarisation, refractory period); all-or-nothing; saltatory conduction; synaptic transmission (Ca²⁺ influx, vesicle fusion, ACh, acetylcholinesterase, EPSP/IPSP, summation); endocrine vs nervous; adrenaline. Gene Technology: PCR (denaturation 95°C, annealing 50–65°C, extension 72°C with Taq), gel electrophoresis (STRs, ethidium bromide), DNA sequencing (Sanger, NGS overview), genetic engineering (restriction endonucleases, sticky ends, ligation, vectors — plasmids/viruses, transformation, selectable markers, GFP; human insulin in E. coli; golden rice), CRISPR-Cas9 (guide RNA, Cas9 nuclease, knockout/correction/insertion), gene therapy (somatic vs germline, viral vectors), DNA profiling (STR, RFLP, forensics, paternity).`,
    doNotUse: `energy flow and ecosystems (Unit 4), immunity mechanisms (Unit 4), photosynthesis (Unit 4), cell division mechanism (Unit 2), plant structure (Unit 2), biodiversity indices (Unit 2).`,
  },

  // ---------------- EDEXCEL IAL CHEMISTRY ----------------
  "edexcel-ial|chemistry|1": {
    unitName: "WCH11 — Structure, Bonding and Introduction to Organic Chemistry",
    use: `Formulae, Equations and Amount of Substance: relative atomic mass Ar, relative molecular mass Mr, mole concept n = m/M, Avogadro constant L = 6.02×10²³, empirical and molecular formulae, stoichiometric calculations (reacting masses, limiting reagent, percentage yield/purity), molar volume of gas, concentration mol dm⁻³, ideal gas equation pV = nRT. Atomic Structure and the Periodic Table: subatomic particles, atomic number, mass number, isotopes, mass spectrometry (time-of-flight: ionisation, acceleration, drift, detection), electronic configuration (s/p/d sub-shells, Aufbau, Hund, Pauli), first ionisation energy (definition, trend across period 2, trend down group 1/2), qualitative periodicity trends. Bonding and Structure: ionic bonding (giant lattice, properties), covalent bonding (dot-and-cross for H₂/Cl₂/HCl/H₂O/NH₃/CH₄/CO₂/PCl₅/SF₆; sigma and pi bonds; dative bonds), VSEPR shapes (linear 180°, trigonal planar 120°, tetrahedral 109.5°, trigonal bipyramidal, octahedral, bent ~104.5°, pyramidal ~107°), electronegativity (Pauling scale; trends), bond polarity, intermolecular forces (London/dispersion, permanent dipole-dipole, hydrogen bonds — N-H/O-H/F-H), metallic bonding, allotropes of carbon (diamond, graphite, graphene, C₆₀). Introductory Organic and Alkanes: homologous series, functional groups, IUPAC nomenclature, structural isomerism (chain, position, functional group), alkanes CₙH₂ₙ₊₂ (combustion complete and incomplete, free radical substitution with Cl₂/Br₂ under UV — initiation/propagation/termination with curly arrows, cracking thermal and catalytic, fractional distillation). Alkenes CₙH₂ₙ: bromine water test; electrophilic addition mechanism with curly arrows (π bond → electrophile → carbocation → nucleophile attacks); addition of HBr/HCl, Br₂, H₂O (steam + H₃PO₄), H₂; Markovnikov's rule via carbocation stability (3° > 2° > 1°); addition polymerisation.`,
    doNotUse: `energetics (Unit 2), Group chemistry (Unit 2), kinetics and equilibria — even basic (Unit 2), halogenoalkanes in depth (Unit 2), alcohols (Unit 2), rate equations and order of reaction (Unit 4), equilibrium constants (Unit 4), transition metals (Unit 5), arenes (Unit 5), amines (Unit 5).`,
  },
  "edexcel-ial|chemistry|2": {
    unitName: "WCH12 — Energetics, Group Chemistry, Halogenoalkanes and Alcohols",
    use: `Energetics: enthalpy change ΔH (standard conditions 298 K, 100 kPa, 1 mol dm⁻³), sign convention, ΔHc°, ΔHf°, neutralisation, atomisation, Hess's law (cycles using formation or combustion data), bond enthalpy calculations (ΔH = Σ bonds broken − Σ bonds made), calorimetry (q = mcΔT), lattice enthalpy, Born-Haber cycle (sublimation → ionisation → dissociation → electron affinity → lattice). Intermolecular Forces (extending Unit 1). Redox and Groups 1, 2, 7: oxidation states (rules, Roman numerals), OIL RIG, oxidising/reducing agents, balancing redox via half-equations, disproportionation, Group 1 (Li/Na/K reactions with water/oxygen/chlorine; flame tests Li red, Na yellow/orange, K lilac), Group 2 (Mg/Ca/Sr/Ba reactions with water/O₂/dilute acids; thermal stability of carbonates; solubility of hydroxides increases down group, sulfates decreases; flame tests Ca brick red, Sr crimson, Ba apple green; uses of Ca(OH)₂, CaO), Group 7 (F₂/Cl₂/Br₂/I₂ — physical properties, electronegativity, oxidising power decreases down group; displacement reactions; organic solvent layer colours; reducing power of halide ions including reactions with H₂SO₄; AgNO₃ test for halide ions with NH₃ confirmation; Cl₂ in NaOH cold vs hot). Introductory Kinetics and Equilibria — QUALITATIVE ONLY: collision theory (sufficient energy ≥ Ea, correct orientation), factors affecting rate (concentration, temperature, surface area, catalyst), Maxwell-Boltzmann distribution sketch and effect of temperature, dynamic equilibrium, Le Chatelier's principle (qualitative — concentration, pressure, temperature, catalyst). Halogenoalkanes: classification 1°/2°/3°, nucleophilic substitution SN1 (3°, two-step via carbocation) and SN2 (1°, one-step, Walden inversion), competition with elimination, reactivity C-I > C-Br > C-Cl, CFCs and ozone depletion. Alcohols: classification, H-bonding raises BP; combustion; oxidation with acidified K₂Cr₂O₇ (1° → aldehyde → carboxylic acid on reflux; 2° → ketone; 3° none); dehydration to alkene with Al₂O₃ or H₃PO₄; reaction with PCl₅; esterification with carboxylic acid + conc. H₂SO₄. Spectra: mass spectrometry (M⁺ peak gives Mr; common fragments m/z 15 = CH₃, 29 = CHO, 45 = OEt); IR spectroscopy (broad O-H 2500-3300 cm⁻¹, N-H 3300-3500, C=O 1680-1750, C-H 2850-3100).`,
    doNotUse: `rate equations rate = k[A]^m[B]^n, order of reaction, rate constant k or its units, Arrhenius equation, half-life, rate-determining step, initial rates calculations, Kc, Kp, Ka, buffer solutions, entropy, Gibbs energy (all Unit 4); transition metals, amines, amino acids, arenes (Unit 5); carbonyl chemistry in depth (Unit 4).`,
  },
  "edexcel-ial|chemistry|4": {
    unitName: "WCH14 — Rates, Equilibria and Further Organic Chemistry",
    use: `Kinetics (advanced): rate of reaction (units mol dm⁻³ s⁻¹), rate equation rate = k[A]^m[B]^n, orders (zero, first, second; overall order), units of k (zero: mol dm⁻³ s⁻¹; first: s⁻¹; second: mol⁻¹ dm³ s⁻¹), determining order experimentally (initial rates method), concentration-time and rate-concentration graph shapes, half-life (first-order only: t½ = ln 2 / k = 0.693/k), Arrhenius equation k = Ae^(−Ea/RT) (graphical method ln k vs 1/T; gradient = −Ea/R; calculating Ea from two temperatures), reaction mechanisms (rate-determining step; rate equation reflects molecularity of RDS; mechanism must match both rate equation and overall stoichiometry; SN1 vs SN2 supported by order). Entropy and Energetics: entropy S (J K⁻¹ mol⁻¹; predicting sign of ΔS), total entropy change ΔStotal = ΔSsystem + (−ΔH/T), feasibility, Gibbs free energy ΔG = ΔH − TΔS (feasibility threshold T = ΔH/ΔS). Chemical Equilibria: Kc expression and units; calculating Kc; temperature changes Kc; concentration/pressure shift position not Kc. Kp: partial pressures; mole fraction × total pressure; calculating Kp; relationship to Kc. Acid-base Equilibria: Brønsted-Lowry; conjugate pairs; strong acids (HCl, H₂SO₄, HNO₃); weak acids (CH₃COOH; Ka and pKa; Ka = [H⁺][A⁻]/[HA]); Kw = [H⁺][OH⁻] = 1×10⁻¹⁴ at 25°C; pH = −log[H⁺]; calculating pH for strong acid, strong base, weak acid (pH = −log√(Ka × [HA])); buffer solutions (composition: weak acid + conjugate base salt; mechanism; Henderson-Hasselbalch pH = pKa + log([A⁻]/[HA]); blood pH 7.4); titration curves (strong/strong pH ~7; strong/weak; weak/strong; weak/weak indistinct; choosing indicator pKin within vertical portion); solubility product Ksp (expression; calculating from solubility; Qsp vs Ksp; common ion effect). Organic: Carbonyls (aldehydes and ketones; nucleophilic addition of HCN/KCN with curly-arrow mechanism; reduction with NaBH₄; Tollens' silver mirror — aldehydes only; Fehling's/Benedict's; 2,4-DNP; iodoform from methyl ketones / ethanal / 2° alcohols with CH₃C=O group). Carboxylic acids: acidic character with Na/NaOH/Na₂CO₃; esterification; reduction with LiAlH₄; acyl chlorides from RCOOH + PCl₅/SOCl₂; reactions of acyl chlorides with water/alcohols/ammonia/amines; acid anhydrides; esters (acid and base hydrolysis); polyesters (Terylene). Chirality: chiral carbon (4 different groups), enantiomers, racemate, optical activity (plane polarised light), biological significance.`,
    doNotUse: `qualitative collision theory only (Unit 2), basic Le Chatelier without Kc, transition metal chemistry (Unit 5), amines and amino acids (Unit 5), arenes/benzene (Unit 5).`,
  },
  "edexcel-ial|chemistry|5": {
    unitName: "WCH15 — Transition Metals and Organic Nitrogen Chemistry",
    use: `Redox Equilibria: standard electrode potential E° (vs SHE = 0.00 V); standard cell EMF E°cell = E°cathode − E°anode; electrochemical series; predicting feasibility (positive E°cell); limitations (kinetics; non-standard conditions); Nernst equation E = E° + (RT/zF) ln([Ox]/[Red]). Transition Metals: definition (d-block forming at least one stable ion with incomplete d sub-shell), electronic configurations Ti–Cu including anomalies Cr [Ar]3d⁵4s¹ and Cu [Ar]3d¹⁰4s¹, variable oxidation states (Fe +2/+3; Cu +1/+2; Mn +2/+4/+7; Cr +3/+6; V +2/+3/+4/+5), colour (d-d transitions, crystal field splitting, complementary colour), catalytic activity (heterogeneous Fe Haber, V₂O₅ Contact, Pt catalytic converters; homogeneous Fe³⁺ in S₂O₈²⁻/I⁻), complex ions (ligand types — monodentate H₂O/NH₃/Cl⁻/CN⁻/OH⁻; bidentate en, ox²⁻; polydentate EDTA⁴⁻; coordination number 6 octahedral; coordination number 4 tetrahedral or square planar — Pt²⁺), cis-trans and optical isomerism in complexes, reactions of aqua ions with NaOH ([Cu(H₂O)₆]²⁺ → Cu(OH)₂ pale blue; [Fe(H₂O)₆]²⁺ → Fe(OH)₂ green; [Fe(H₂O)₆]³⁺ → Fe(OH)₃ brown) and with excess NH₃ (Cu²⁺ → [Cu(NH₃)₄(H₂O)₂]²⁺ deep blue; Fe³⁺ does not dissolve), redox reactions of MnO₄⁻ (acid: + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O), Cr₂O₇²⁻ (+ 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O), Fe²⁺/Fe³⁺. Arenes: benzene structure (Kekulé vs delocalised; equal bond lengths 140 pm; enthalpy of hydrogenation evidence −208 vs predicted −360 kJ mol⁻¹), electrophilic aromatic substitution mechanism with curly arrows, nitration (HNO₃/conc. H₂SO₄ → NO₂⁺), Friedel-Crafts alkylation and acylation (RCl/AlCl₃; RCOCl/AlCl₃), halogenation (Cl₂/AlCl₃), directing effects (activating OH/NH₂ → 2,4; deactivating NO₂ → 3-position), phenol (acidic; reacts with Na and NaOH; reaction with bromine water without catalyst → 2,4,6-tribromophenol; phenoxide stabilised by delocalisation). Nitrogen Compounds: amines (1°/2°/3°; basicity aliphatic > NH₃ > aromatic; preparation from halogenoalkane + excess NH₃ in sealed tube; reactions with HCl; acylation with acyl chloride → amide), diazonium salts (1° aromatic amine + NaNO₂ + HCl at 0–5°C → ArN₂⁺Cl⁻; coupling with phenol or naphthylamine → azo dyes), amino acids (NH₂-CHR-COOH; zwitterion at isoelectric point NH₃⁺-CHR-COO⁻; peptide bond −CO−NH−; acid/enzyme hydrolysis). Synthesis: multi-step planning (forward and retrosynthetic) across all functional groups; choice of reagents/conditions/mechanisms; yield and selectivity; protecting groups concept. Spectroscopy combined: ¹H NMR (chemical shift δ vs TMS; n+1 splitting; common shifts CH₃ ~0.9, CH₂ ~1.2, C-OH ~2-3, Ar-H ~7-8, CHO ~9-10, COOH ~11-12).`,
    doNotUse: `reaction kinetics and rate equations (Unit 4), Kc/Kp (Unit 4), acid-base equilibria (Unit 4), Group 1/2/7 chemistry (Unit 2), basic organic chemistry (Unit 1).`,
  },
};

const randomSeed = () => Math.floor(10_000_000 + Math.random() * 89_999_999).toString();

export interface BuildPromptInput {
  qualification: string;
  subject: string;
  unit: number | string;
  unitName: string;
}

export interface BuiltPrompt {
  systemPrompt: string;
  seed: string;
  timestamp: string;
  hasBoundary: boolean;
  forbiddenList: string[];
}

/** Builds the wrapper exactly as Part 1 of the brief specifies. */
export function buildSystemPrompt(input: BuildPromptInput): BuiltPrompt {
  const key = `${input.qualification}|${input.subject}|${input.unit}`;
  const boundary = SYLLABUS_BOUNDARIES[key];
  const seed = randomSeed();
  const timestamp = new Date().toISOString();
  const allowed = boundary?.use || "(no boundary defined for this unit yet — stay strictly within official syllabus statements supplied by the user message)";
  const forbidden = boundary?.doNotUse || "(no explicit forbidden list — use professional judgement based on official syllabus)";
  const unitName = boundary?.unitName || input.unitName;

  const systemPrompt = `You are generating study notes for ${input.qualification.toUpperCase()} ${input.subject.toUpperCase()} — ${unitName}.

GENERATION TIMESTAMP: ${timestamp}
GENERATION SEED: ${seed}

You must ONLY generate content about the topics in the ALLOWED LIST below.
You must NEVER mention, explain, or reference anything in the FORBIDDEN LIST below.

Before writing each sentence, ask yourself: "Is this explicitly in the ALLOWED LIST for this specific unit?" If not, do not write it.

ALLOWED TOPICS:
${allowed}

FORBIDDEN TOPICS:
${forbidden}

BOUNDARY RULES:
- If a concept appears in both this unit and another unit at different depths, only include the version appropriate to THIS unit.
- Do not introduce concepts from later units even as "preview" or "context".
- Do not repeat simplified versions of earlier units unless explicitly listed here.
- Every formula, definition, and diagram description must trace directly to the ALLOWED list.

FORMATTING:
- Plain Unicode only. No LaTeX. Use ² ³ ⁻¹ ₂ ₃ for super/subscripts; → ⇌ ≤ ≥ ≠ ≈ ± × · ÷ √ Δ for math.
- UK English; mark-scheme phrasing.
- Return structured data via the supplied tool — no markdown headers in fields.`;

  // Build a flat list of forbidden keywords for post-generation validation.
  const forbiddenList = boundary
    ? boundary.doNotUse
        .replace(/\(.*?\)/g, " ")
        .split(/[,;\.]/)
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 4 && !/^unit \d|^all unit/i.test(s))
    : [];

  return { systemPrompt, seed, timestamp, hasBoundary: !!boundary, forbiddenList };
}

/** Scan generated content for any forbidden term. Returns the matches found (empty = pass). */
export function findForbiddenKeywords(payload: unknown, forbiddenList: string[]): string[] {
  if (!forbiddenList.length) return [];
  const haystack = JSON.stringify(payload).toLowerCase();
  return forbiddenList.filter((k) => haystack.includes(k));
}

/** Builds an explicit, on-template image prompt (Part 6). */
export interface ImagePromptInput {
  qualification: string;
  subject: string;
  unitName: string;
  topic: string;
  mustShow: string[];
  mustNotShow: string[];
}
export function buildImagePrompt(i: ImagePromptInput): string {
  const must = i.mustShow.length ? i.mustShow : [
    `Clear scientific illustration of "${i.topic}" with every key component named on the diagram`,
    `Each labelled element annotated with its function and (if applicable) numerical value or quantity`,
    `Direction of any flow, change, or process indicated by clearly drawn arrows`,
  ];
  const mustNot = i.mustNotShow.length ? i.mustNotShow : [
    `Any concept that is not part of "${i.topic}" within this specific unit`,
    `Decorative borders, watermarks, signatures, or stylised cartoons`,
  ];
  return `Create a clean, educational scientific diagram for ${i.qualification.toUpperCase()} ${i.subject.toUpperCase()} students. White background. Textbook quality. No decorative borders. Labels with clear arrows.

Board and Level: ${i.qualification.toUpperCase()} — ${i.unitName}

Topic: ${i.topic}

The diagram MUST show:
${must.map((m) => `- ${m}`).join("\n")}

The diagram MUST NOT show:
${mustNot.map((m) => `- ${m}`).join("\n")}`;
}
