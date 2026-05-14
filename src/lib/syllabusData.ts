// ============================================================
// syllabusData.ts
// PLACE THIS FILE AT: src/lib/syllabusData.ts
// (or src/data/syllabusData.ts — wherever your other lib files live)
//
// HOW TO USE:
//   import { SYLLABUS, buildSystemPrompt, buildImagePrompt } from '@/lib/syllabusData'
//
//   const topicData = SYLLABUS['edexcel_ial']['chemistry']['unit1']
//   const systemPrompt = buildSystemPrompt('edexcel_ial', 'chemistry', 'unit1')
//   const imagePrompt = buildImagePrompt('edexcel_ial', 'chemistry', 'unit1', 'Electrophilic Addition of HBr to Propene')
//
// SOURCES: All content verified against official Pearson and Cambridge specifications.
// Edexcel IAL: Pearson IAL specs Issue 1-3 (2017-2021)
// CIE IGCSE: Cambridge 0610/0620/0625/0580 syllabuses 2023-2025
// CIE A Level: Cambridge 9700/9701/9702/9709 syllabuses 2025-2027
// ============================================================

export interface TopicData {
  code: string;
  title: string;
  allowedTopics: string[];
  forbiddenTopics: string[];
  requiredKeywords: string[];
  boundaryNotes?: string[];
}

export interface SubjectData {
  [unitKey: string]: TopicData;
}

export interface QualificationData {
  [subject: string]: SubjectData;
}

export interface SyllabusDatabase {
  [qualification: string]: QualificationData;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function buildSystemPrompt(
  qualification: string,
  subject: string,
  unitKey: string
): string {
  const topic = SYLLABUS[qualification]?.[subject]?.[unitKey];
  if (!topic) {
    throw new Error(`No syllabus data found for ${qualification} > ${subject} > ${unitKey}`);
  }

  const timestamp = new Date().toISOString();
  const seed = Math.floor(10000000 + Math.random() * 90000000).toString();

  return `You are generating study notes for ${qualification.toUpperCase()} ${subject.toUpperCase()} — ${topic.code}: ${topic.title}.

GENERATION TIMESTAMP: ${timestamp}
GENERATION SEED: ${seed}

You must ONLY generate content about the topics in the ALLOWED LIST below.
You must NEVER mention, explain, or reference anything in the FORBIDDEN LIST below.

Before writing each sentence, ask yourself: "Is this explicitly in the ALLOWED LIST for this specific unit?" If not, do not write it.

ALLOWED TOPICS:
${topic.allowedTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

FORBIDDEN TOPICS (never include any of the following):
${topic.forbiddenTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

REQUIRED KEYWORDS (these terms must appear where relevant):
${topic.requiredKeywords.join(', ')}

${topic.boundaryNotes && topic.boundaryNotes.length > 0 ? `CRITICAL BOUNDARY NOTES:\n${topic.boundaryNotes.join('\n')}` : ''}

BOUNDARY RULES:
- If a concept appears in both this unit and another unit at different depths, only include the version appropriate to THIS unit
- Do not introduce concepts from later units even as "preview" or "context"
- Do not repeat simplified versions of earlier units unless explicitly listed in ALLOWED TOPICS
- Every formula, definition, and diagram description must trace directly to the ALLOWED list
- Do not include the overview/introduction paragraphs at the top — go straight to definitions and content
- Structure: Definitions → Core Content (spec points with mark allocations) → Equations → Visual Summary → Examiner Tips → Flashcards`;
}

export function buildImagePrompt(
  qualification: string,
  subject: string,
  unitKey: string,
  specificTopic: string
): string {
  const topic = SYLLABUS[qualification]?.[subject]?.[unitKey];
  if (!topic) return '';

  const qualLabel = qualification.replace('_', ' ').toUpperCase();
  const subjLabel = subject.charAt(0).toUpperCase() + subject.slice(1);

  return `Create a clean, educational scientific diagram for ${qualLabel} ${subjLabel} students. White background. Textbook quality. No decorative borders. Labels with clear arrows.

Board and Level: ${topic.code} — ${topic.title}

Topic: ${specificTopic}

The diagram MUST show only what is explicitly listed in this unit's specification for the topic: ${specificTopic}

The diagram MUST NOT show:
- Content from other units (see forbidden topics list for this unit)
- Decorative elements, 3D shading that obscures labels, or abstract art
- Any process, molecule, or pathway not in the allowed list for ${topic.code}

Style: Clean scientific diagram, white background, clearly labelled with arrows, educational textbook quality. Every label must be accurate and specific.`;
}

export function validateGeneratedNotes(notes: string, qualification: string, subject: string, unitKey: string): {
  passed: boolean;
  forbiddenFound: string[];
} {
  const topic = SYLLABUS[qualification]?.[subject]?.[unitKey];
  if (!topic) return { passed: false, forbiddenFound: ['Topic not found in syllabus database'] };

  const notesLower = notes.toLowerCase();
  const forbiddenFound: string[] = [];

  for (const forbidden of topic.forbiddenTopics) {
    const keywords = forbidden.split(/[\s,;]+/).filter(w => w.length > 5);
    for (const keyword of keywords) {
      if (notesLower.includes(keyword.toLowerCase())) {
        forbiddenFound.push(`"${keyword}" found — from: ${forbidden}`);
        break;
      }
    }
  }

  return {
    passed: forbiddenFound.length === 0,
    forbiddenFound,
  };
}

// ============================================================
// THE COMPLETE SYLLABUS DATABASE
// ============================================================

export const SYLLABUS: SyllabusDatabase = {

  // ===========================================================
  // EDEXCEL IAL (International Advanced Level)
  // Qualification codes: YBI11 (Bio), YCH11 (Chem), YPH11 (Physics), YMA01 (Maths)
  // Units 3 and 6 in Bio/Chem/Physics are practical-only — NO theory notes
  // ===========================================================

  edexcel_ial: {

    // -----------------------------------------------------------
    // EDEXCEL IAL BIOLOGY (YBI11)
    // -----------------------------------------------------------
    biology: {

      unit1: {
        code: 'WBI11',
        title: 'Molecules, Diet, Transport and Health',
        allowedTopics: [
          'Water — dipole nature, role as solvent in transport, high specific heat capacity, latent heat, hydrogen bonding between water molecules',
          'Monosaccharides — glucose (α and β forms), fructose, galactose; reducing sugars',
          'Disaccharides — maltose, sucrose, lactose; glycosidic bonds formed by condensation reactions; hydrolysis',
          'Polysaccharides — glycogen (branched, energy storage in animals), amylose (unbranched helix, energy storage in plants), amylopectin (branched, energy storage in plants); NOTE: β-glucose and cellulose are in Unit 2 only',
          'Benedict\'s reagent semi-quantitative test for reducing sugars — brick red precipitate; iodine test for starch — blue-black colour',
          'Triglycerides — ester bonds from glycerol + 3 fatty acids by condensation; saturated vs unsaturated fatty acids; functions in energy storage, insulation',
          'Phospholipids — hydrophilic phosphate head, hydrophobic fatty acid tails; amphipathic nature; role in membranes',
          'Cell surface membrane — fluid mosaic model, phospholipid bilayer, membrane proteins (channel, carrier, receptor), glycolipids, glycoproteins',
          'Diffusion — passive, concentration gradient, large surface area, short distance increases rate',
          'Facilitated diffusion — channel proteins and carrier proteins; passive but specific',
          'Osmosis — movement of water from high water potential to low water potential through selectively permeable membrane',
          'Active transport — against concentration gradient, requires ATP, carrier proteins',
          'DNA structure — double helix, antiparallel strands, base pairing A-T and G-C, deoxyribose-phosphate backbone, hydrogen bonds between bases',
          'RNA types — mRNA (codons), tRNA (anticodon, amino acid attachment), rRNA (ribosome component)',
          'Genetic code — triplet codons, degenerate (multiple codons per amino acid), non-overlapping, universal',
          'Transcription — RNA polymerase binds promoter, reads template strand 3→5, produces mRNA 5→3',
          'Translation — ribosome assembles on mRNA; tRNA anticodons match codons; peptide bond formation; polypeptide assembly',
          'Gene mutations — substitution (missense/nonsense/silent), insertion, deletion; effect on protein structure',
          'Genetic screening — PCR for amplification, gel electrophoresis for separation; ethical and social issues',
          'Why animals need a circulatory system — multicellular organisms too large for diffusion alone; mass transport overcomes diffusion limitations',
          'Blood vessel structure and function — capillaries (one cell thick, exchange), arteries (thick muscular/elastic wall, high pressure, pulsed flow), veins (valves, thin wall, low pressure)',
          'Cardiac cycle — atrial systole, ventricular systole, cardiac diastole; pressure changes; valve opening and closing',
          'Heart structure — four chambers (right/left atria, right/left ventricles), major blood vessels (aorta, pulmonary artery, pulmonary vein, vena cava), valves (bicuspid/mitral, tricuspid, semilunar)',
          'Haemoglobin — quaternary globular protein; role in O₂ and CO₂ transport; oxygen dissociation curve (sigmoid shape); cooperative binding; Bohr effect (CO₂ lowers O₂ affinity, curve shifts right); foetal haemoglobin has higher O₂ affinity than adult haemoglobin',
          'Atherosclerosis — endothelial dysfunction → inflammatory response → fatty streak → plaque formation → raised blood pressure → increased CVD risk',
          'Blood clotting — thromboplastin (factor X) release from damaged tissue → prothrombin activated to thrombin → fibrinogen converted to fibrin mesh → clot forms',
          'Cardiovascular disease risk factors — genetics, diet (saturated fat, salt), age, gender, high blood pressure, smoking, physical inactivity',
          'Dietary antioxidants (vitamins C, E) and CVD risk reduction',
          'Analysis of quantitative health data — correlation vs causation; interpreting graphs and statistics',
        ],
        forbiddenTopics: [
          'β-glucose structure and cellulose — these are in Unit 2 only, not Unit 1',
          'Mitosis stages and cell cycle detail — Unit 2',
          'Meiosis — Unit 2',
          'Chloroplast structure — Unit 2',
          'Plant cell structure detail — Unit 2',
          'Biodiversity indices (Simpson\'s Diversity Index) — Unit 2',
          'Food chains and energy flow through ecosystems — Unit 4',
          'Photosynthesis mechanisms — Unit 4',
          'Microbiology (bacterial growth, aseptic technique) — Unit 4',
          'Immunity detail beyond blood clotting (T cells, B cells, antibody structure) — Unit 4',
          'Glycolysis, Krebs cycle, oxidative phosphorylation — Unit 5',
          'Nervous system and action potentials — Unit 5',
          'Kidney structure and nephron function — Unit 5',
          'Gene technology (restriction enzymes, CRISPR, genetic engineering) — Unit 5',
        ],
        requiredKeywords: [
          'condensation', 'hydrolysis', 'glycosidic bond', 'ester bond', 'peptide bond',
          'fluid mosaic model', 'phospholipid bilayer', 'concentration gradient', 'water potential',
          'atrial systole', 'ventricular systole', 'diastole', 'semilunar valve', 'bicuspid valve',
          'haemoglobin', 'oxygen dissociation curve', 'Bohr effect', 'foetal haemoglobin',
          'atherosclerosis', 'thromboplastin', 'fibrinogen', 'fibrin', 'mass transport',
          'template strand', 'codon', 'anticodon', 'transcription', 'translation',
        ],
        boundaryNotes: [
          'CRITICAL: β-glucose and cellulose must NOT appear in Unit 1 notes. They belong exclusively in Unit 2.',
          'DNA structure IS in Unit 1 — protein synthesis context. But DNA replication mechanism is NOT required here.',
          'PCR and gel electrophoresis appear here only in the context of genetic screening techniques — not as gene technology tools.',
        ],
      },

      unit2: {
        code: 'WBI12',
        title: 'Cells, Development, Biodiversity and Conservation',
        allowedTopics: [
          'Prokaryotic cell structure — no membrane-bound nucleus, 70S ribosomes, circular DNA, plasmids, peptidoglycan cell wall, pili, flagella, capsule; typically 1–5 µm',
          'Eukaryotic cell structure — membrane-bound nucleus, 80S ribosomes, membrane-bound organelles',
          'Organelle functions — mitochondria (inner membrane/cristae/matrix, site of aerobic respiration); chloroplasts (thylakoid/granum/stroma/lamellae, site of photosynthesis); rough ER (protein synthesis and transport); smooth ER (lipid synthesis); Golgi body (modification and packaging of proteins/secretory vesicles); lysosomes (hydrolytic enzymes, intracellular digestion); centrioles (spindle formation during cell division); cell wall (support in plants and fungi)',
          'Comparison of prokaryotic and eukaryotic cells',
          'Light microscopy vs electron microscopy (TEM and SEM) — magnification, resolution; magnification = image size/actual size; units mm/µm/nm',
          'Cell fractionation — homogenisation in cold isotonic buffer; differential centrifugation; nuclei pellet first (low speed), mitochondria second (medium speed), ribosomes last (high speed)',
          'Cell cycle and mitosis — interphase: G1 (growth), S (DNA replication), G2 (growth); prophase (chromosomes condense, centrioles separate, spindle forms, nuclear envelope breaks down); metaphase (chromosomes align at equator on spindle attached via centromeres); anaphase (centromeres split, chromatids pulled to poles by spindle fibres); telophase (nuclear envelopes reform, chromosomes decondense); cytokinesis',
          'Cancer — uncontrolled mitosis, tumour formation, loss of contact inhibition, proto-oncogenes mutated to oncogenes',
          'Meiosis — produces haploid gametes; meiosis I: homologous pairs separate, crossing over at chiasmata creates recombinant chromosomes, independent assortment creates variation; meiosis II: sister chromatids separate; significance: genetic variation',
          'Stem cells — totipotent (embryonic: can form any cell type including extra-embryonic); pluripotent (most cell types but not extra-embryonic); multipotent (limited range — adult stem cells e.g. haematopoietic); therapeutic cloning; ethical issues',
          'Cell differentiation — selective gene expression; same genome but different genes active',
          'β-glucose structure — OH at position 1 is above the ring plane (equatorial); compare with α-glucose where OH is below (axial)',
          'Cellulose — β-1,4 glycosidic bonds; alternating glucose orientation; hydrogen bonds between parallel chains; microfibrils; structural role in plant cell wall',
          'Plant cell structure — cell wall (cellulose), large central vacuole (tonoplast membrane), chloroplasts, plasmodesmata connecting adjacent cells',
          'Classification — three domains: Archaea, Bacteria, Eukarya; five kingdoms; binomial nomenclature (genus species in italics); hierarchy: domain/kingdom/phylum/class/order/family/genus/species',
          'Phylogenetics — cladistics (grouping by shared derived characteristics); cladograms; molecular phylogeny using DNA and protein sequence comparison; revising traditional classification with molecular evidence',
          'Biodiversity — species richness (number of species); species evenness (relative abundance); Simpson\'s Diversity Index D = 1 − Σ(n/N)²; interpreting index values (D close to 1 = high diversity)',
          'Sampling methods — random (quadrats placed by random coordinates); systematic (transects at regular intervals); stratified (proportional to habitat area); mark-release-recapture: Lincoln Index N = MN₂/m',
          'Conservation — in situ (nature reserves, national parks, habitat restoration); ex situ (zoos, botanic gardens, seed banks); captive breeding programmes; CITES convention; reasons for conservation: ecological, economic, ethical, aesthetic',
        ],
        forbiddenTopics: [
          'Membranes and transport detail (facilitated diffusion, osmosis, active transport) — covered in Unit 1',
          'Blood vessel structure and function — Unit 1',
          'Cardiovascular disease and atherosclerosis — Unit 1',
          'Haemoglobin and oxygen transport — Unit 1',
          'Genetic code, transcription and translation detail — Unit 1',
          'PCR and gel electrophoresis as gene technology — Unit 5 (they appear in Unit 1 only as genetic screening)',
          'Energy flow through ecosystems, food chains, nutrient cycles — Unit 4',
          'Microbiology and antibiotic resistance — Unit 4',
          'Immunity (B cells, T cells, antibodies) — Unit 4',
          'Respiration pathways (glycolysis, Krebs, ETC) — Unit 5',
          'Nervous system and synaptic transmission — Unit 5',
          'Kidney function and nephron detail — Unit 5',
        ],
        requiredKeywords: [
          'prokaryotic', 'eukaryotic', '70S', '80S', 'peptidoglycan', 'plasmid',
          'differential centrifugation', 'homogenisation', 'magnification', 'resolution',
          'prophase', 'metaphase', 'anaphase', 'telophase', 'centromere', 'cytokinesis',
          'meiosis I', 'meiosis II', 'chiasmata', 'crossing over', 'independent assortment',
          'totipotent', 'pluripotent', 'multipotent',
          'β-1,4 glycosidic bond', 'cellulose', 'microfibrils',
          'Simpson\'s Diversity Index', 'Lincoln Index', 'in situ', 'ex situ',
          'binomial nomenclature', 'cladogram', 'phylogenetics',
        ],
        boundaryNotes: [
          'β-glucose and cellulose first appear in Unit 2 — they must NOT appear in Unit 1 notes.',
          'Magnification formula (image size / actual size) is assessed in Unit 2.',
          'Simpson\'s Index formula D = 1 − Σ(n/N)² must be given with calculation method.',
        ],
      },

      unit4: {
        code: 'WBI14',
        title: 'Energy, Environment, Microbiology and Immunity',
        allowedTopics: [
          // --- ENERGY FLOW ---
          'ATP structure — adenine + ribose + 3 phosphate groups; high-energy bonds between phosphates',
          'ATP hydrolysis — ATP + H₂O → ADP + Pi + energy; releases ~30.5 kJ/mol; universal energy currency',
          'Photosynthesis overview — light energy converted to chemical energy; occurs in chloroplasts',
          'Light-dependent reactions (thylakoid membrane) — photosystem II absorbs light at 680nm → excites electrons → photolysis of water (2H₂O → 4H⁺ + 4e⁻ + O₂) → electrons pass down ETC → proton gradient → ATP by photophosphorylation; photosystem I absorbs light at 700nm → NADP reduced to NADPH; cyclic photophosphorylation: PSI only → ATP only, no NADPH or O₂',
          'Light-independent reactions / Calvin cycle (stroma) — CO₂ + RuBP (5C) → 2GP (3C) catalysed by RuBisCO; GP → G3P using ATP and NADPH; G3P → regenerate RuBP (requires ATP); G3P used to synthesise glucose, starch, fatty acids, amino acids',
          'Limiting factors for photosynthesis — light intensity (rate plateaus when another factor limiting); CO₂ concentration; temperature (increases rate up to optimum, then enzymes denature); interaction between limiting factors',
          'Food chains — producers (autotrophs); primary consumers; secondary consumers; tertiary consumers; decomposers and detritivores',
          'Energy flow in ecosystems — energy lost at each trophic level as heat (respiration), in waste products, and in indigestible material; approximately 10% efficiency of energy transfer; pyramid of energy',
          'Gross primary production (GPP) — total energy fixed by producers through photosynthesis per unit area per unit time',
          'Net primary production (NPP) = GPP − R (where R = energy lost in plant respiration); available to consumers',
          'Carbon cycle — photosynthesis (CO₂ → organic carbon); respiration (organic carbon → CO₂); combustion of fossil fuels; decomposition by bacteria and fungi; fossilisation',
          'Nitrogen cycle — nitrogen fixation (Rhizobium in root nodules + Azotobacter free-living → NH₄⁺); nitrification (Nitrosomonas: NH₄⁺ → NO₂⁻; Nitrobacter: NO₂⁻ → NO₃⁻); denitrification (anaerobic bacteria: NO₃⁻ → N₂); ammonification (decomposers break down organic N → NH₄⁺); eutrophication: excess fertiliser → algal bloom → death of algae → decomposer bacteria increase → O₂ depleted → fish die',
          // --- MICROBIOLOGY ---
          'Bacterial growth in culture — binary fission; four phases: lag (adaptation), log/exponential (rapid division), stationary (nutrients limit growth), death (waste accumulates)',
          'Aseptic technique — flaming inoculating loops; using laminar flow cabinets; sterilising equipment by autoclave; working away from draughts; not opening plates unnecessarily',
          'Culture media — nutrient agar plates; broth; selective media (only target organism grows); differential media (different organisms produce visible differences)',
          'Antibiotic resistance mechanisms — mutation (altered binding site for antibiotic; enzyme production e.g. β-lactamase destroys penicillin; efflux pumps remove antibiotic; reduced membrane permeability); horizontal gene transfer (conjugation via pili; transformation; transduction by bacteriophage); MRSA as case study',
          'Viruses as pathogens — influenza: haemagglutinin (binds host cell receptors) and neuraminidase (releases new virions) as surface antigens; antigenic drift = gradual change by mutation; antigenic shift = major reassortment of genes from two viral strains infecting same cell → new pandemic potential; why flu vaccine must be updated annually',
          // --- IMMUNITY ---
          'Non-specific immunity — phagocytosis by neutrophils and macrophages: engulf pathogen → phagosome formed → lysosome fuses → phagolysosome → hydrolytic enzymes digest pathogen; inflammation response; fever',
          'Specific humoral immunity — B lymphocytes; clonal selection: antigen binds B cell receptor with complementary variable region; clonal expansion; plasma cells secrete antibodies; memory B cells remain for secondary response',
          'Antibody structure — two heavy + two light chains; held by disulfide bonds; variable region = antigen-binding site (specific to antigen shape); constant region; antigen-antibody specificity',
          'Specific cell-mediated immunity — T helper cells (CD4+): secrete cytokines, activate B cells and cytotoxic T cells; T cytotoxic/killer cells (CD8+): destroy infected body cells via perforin (pores in membrane) and apoptosis; T memory cells; T regulatory cells (suppress immune response)',
          'Primary vs secondary immune response — primary: slow (days), lower antibody titre, IgM then IgG; secondary: faster, higher titre, predominantly IgG — due to memory B cells; basis for vaccination',
          'Vaccines — active immunity: body makes own antibodies and memory cells; passive immunity: antibodies received directly (e.g. maternal antibodies, antivenom); live attenuated; killed pathogen; subunit/protein vaccines; mRNA vaccines; herd immunity threshold (fraction of population needed to be immune)',
          'Monoclonal antibodies — hybridoma technology: immunise mouse → isolate B cell producing specific antibody → fuse with immortal myeloma cell → hybridoma → clone → screen → scale up production; uses: ELISA, pregnancy tests, Herceptin (HER2+ breast cancer treatment), diagnostic tests',
          'HIV mechanism — retrovirus (RNA genome, reverse transcriptase converts RNA to DNA, integrase inserts into host genome); targets CD4+ T helper cells; destroys them → immunodeficiency → AIDS when immune function critically low',
        ],
        forbiddenTopics: [
          'Glycolysis, link reaction, Krebs cycle, oxidative phosphorylation, RQ values — Unit 5 respiration only',
          'Nervous system, action potentials, synaptic transmission — Unit 5',
          'Kidney structure, nephron, ADH, osmoregulation — Unit 5',
          'Gene technology (restriction enzymes, recombinant DNA, CRISPR) — Unit 5',
          'Protein synthesis detail (transcription/translation mechanisms) — Unit 1',
          'Cell division mechanism (mitosis stages) — Unit 2',
          'Classification systems and taxonomy — Unit 2',
          'β-glucose and cellulose — Unit 2',
          'Cardiovascular disease, atherosclerosis, blood clotting — Unit 1',
        ],
        requiredKeywords: [
          'ATP hydrolysis', 'photophosphorylation', 'photolysis', 'RuBisCO', 'Calvin cycle',
          'RuBP', 'GP', 'G3P', 'cyclic photophosphorylation', 'non-cyclic photophosphorylation',
          'GPP', 'NPP', 'trophic level', 'energy efficiency',
          'nitrogen fixation', 'nitrification', 'denitrification', 'ammonification', 'eutrophication',
          'lag phase', 'log phase', 'stationary phase', 'death phase', 'binary fission',
          'β-lactamase', 'horizontal gene transfer', 'conjugation', 'antigenic shift', 'antigenic drift',
          'phagocytosis', 'phagolysosome', 'clonal selection', 'clonal expansion',
          'plasma cells', 'memory B cells', 'variable region', 'constant region',
          'T helper cells', 'cytotoxic T cells', 'perforin', 'apoptosis',
          'hybridoma', 'monoclonal antibody', 'herd immunity',
        ],
      },

      unit5: {
        code: 'WBI15',
        title: 'Respiration, Internal Environment, Coordination and Gene Technology',
        allowedTopics: [
          // --- RESPIRATION ---
          'Glycolysis (cytoplasm) — glucose (6C) phosphorylated using 2ATP → fructose-1,6-bisphosphate → split into 2× triose phosphate (3C) → 2× pyruvate (3C); net production: 2ATP (4 produced − 2 used); 2NAD reduced to 2NADH',
          'Link reaction (mitochondrial matrix) — pyruvate (3C) + CoA → acetyl-CoA (2C) + CO₂ + NADH; per glucose: 2 turns, 2CO₂ released, 2NADH produced, 2 acetyl-CoA formed',
          'Krebs cycle (mitochondrial matrix) — acetyl-CoA (2C) + oxaloacetate (4C) → citrate (6C) → through 8 reactions → back to oxaloacetate; per turn: 3NADH + 1FADH₂ + 1ATP (substrate-level phosphorylation) + 2CO₂; per glucose: 2 turns → 6NADH, 2FADH₂, 2ATP, 4CO₂',
          'Oxidative phosphorylation (inner mitochondrial membrane) — NADH and FADH₂ donate electrons to electron transport chain; electrons pass through complexes I/II/III/IV; protons pumped across inner membrane creating gradient; chemiosmosis: protons flow through ATP synthase → ATP synthesised; O₂ as terminal electron acceptor → H₂O; yield approximately 26-34 ATP per glucose',
          'Anaerobic respiration — in animals/muscle: pyruvate → lactate (by lactate dehydrogenase); NAD regenerated allowing glycolysis to continue; oxygen debt — lactate transported to liver, converted back to pyruvate when O₂ available; in yeast: pyruvate → ethanol + CO₂ (by pyruvate decarboxylase then alcohol dehydrogenase); NAD regenerated; ethanol toxic at high concentrations; commercial fermentation uses',
          'Respiratory quotient RQ = CO₂ produced / O₂ consumed; carbohydrate RQ = 1.0; fat RQ ≈ 0.7; protein RQ ≈ 0.9; measuring RQ using respirometer; interpreting mixed substrate values',
          // --- HOMEOSTASIS ---
          'Concept of homeostasis — maintaining constant internal environment; negative feedback: receptor detects deviation from set point → control centre processes signal → effector corrects deviation → receptor detects return to set point; positive feedback: amplifies change away from set point (examples: blood clotting cascade, oxytocin in childbirth)',
          'Thermoregulation — hypothalamus as thermostat; peripheral and central thermoreceptors; if too hot: vasodilation of skin arterioles (increases heat radiation), sweating (evaporative cooling), piloerection relaxes; if too cold: vasoconstriction, shivering (muscle contraction generates heat), piloerection (traps air layer), increased metabolic rate; ectotherm vs endotherm comparison',
          'Blood glucose regulation — islets of Langerhans in pancreas; α cells secrete glucagon; β cells secrete insulin; after meal (blood glucose rises): β cells detect → insulin secreted by exocytosis → binds receptors → GLUT4 transporter insertion on muscle/adipose cells → increased glucose uptake → glycogenesis (glucose→glycogen) in liver/muscle → glycolysis stimulated → lipogenesis; between meals (blood glucose falls): glucagon released → binds liver cell receptors → glycogenolysis (glycogen→glucose) → gluconeogenesis (non-carbohydrate sources → glucose) → glucose released into blood; Type 1 diabetes: autoimmune destruction of β cells → no insulin produced → insulin injections required; Type 2: insulin resistance (receptor desensitised) → lifestyle management, metformin',
          'Kidney structure — renal cortex (Bowman\'s capsules, PCT, DCT); renal medulla (loop of Henle, collecting ducts); renal pelvis; ureter; bladder; urethra',
          'Nephron function — Bowman\'s capsule + glomerulus: ultrafiltration (high hydrostatic pressure from afferent arteriole, podocytes with filtration slits, basement membrane acts as selective filter by size — small molecules pass: glucose, urea, ions, water; large proteins and blood cells do not pass); proximal convoluted tubule (PCT): selective reabsorption — all glucose and amino acids by active transport + co-transport with Na⁺, water by osmosis following solutes, Na⁺/K⁺ ATPase maintains Na⁺ gradient',
          'Loop of Henle countercurrent multiplier — descending limb: permeable to water only → water leaves by osmosis into hypertonic medulla → filtrate becomes more concentrated; ascending limb: impermeable to water, Na⁺ and Cl⁻ actively pumped out → creates increasing osmotic gradient in medulla; longer loop = more concentrated medulla = more concentrated urine potential',
          'Distal convoluted tubule (DCT) and collecting duct — water reabsorption controlled by ADH; ADH from posterior pituitary — hypothalamus detects high blood osmolarity → posterior pituitary releases ADH → ADH binds receptors on DCT/collecting duct cells → aquaporin channels inserted into membrane → more water reabsorbed → concentrated urine produced; low osmolarity → ADH suppressed → dilute urine',
          // --- NERVOUS SYSTEM ---
          'Neurone structure — cell body (soma), axon (conducts impulse away), dendrites (receive impulses), myelin sheath (Schwann cells, nodes of Ranvier), axon terminal (synaptic knob); sensory neurone (receptor → CNS); relay/interneurone (within CNS); motor neurone (CNS → effector)',
          'Resting potential — approximately −70 mV; maintained by Na⁺/K⁺ ATPase (pumps 3Na⁺ out, 2K⁺ in); K⁺ leak channels allow K⁺ to diffuse out; membrane relatively impermeable to Na⁺ at rest',
          'Action potential — depolarisation: voltage-gated Na⁺ channels open → Na⁺ rushes in → inside becomes approximately +40 mV; repolarisation: K⁺ voltage-gated channels open → K⁺ leaves → returns toward resting potential; hyperpolarisation: brief overshoot below resting potential; refractory period: absolute (no new AP possible — Na⁺ channels inactivated); relative (only strong stimulus can trigger); all-or-nothing principle',
          'Saltatory conduction — in myelinated neurones: AP jumps between nodes of Ranvier; much faster than continuous conduction in unmyelinated neurones; factors affecting speed: axon diameter (wider = faster), myelination, temperature',
          'Synaptic transmission — pre-synaptic membrane → synaptic cleft (20 nm) → post-synaptic membrane; action potential arrives → voltage-gated Ca²⁺ channels open → Ca²⁺ influx → synaptic vesicles fuse with pre-synaptic membrane → acetylcholine (ACh) released by exocytosis → binds nicotinic receptors on post-synaptic membrane → Na⁺ channels open → EPSP (depolarisation); acetylcholinesterase breaks down ACh → choline reabsorbed; summation: temporal (rapid successive stimuli sum at one synapse); spatial (multiple synapses fire simultaneously); inhibitory synapses: GABA/glycine → Cl⁻ influx → IPSP (hyperpolarisation)',
          'Endocrine coordination — hormones vs nervous system: speed (nervous faster); duration (hormonal longer); specificity (nervous more specific); adrenal medulla → adrenaline (epinephrine): glycogenolysis, increases heart rate, vasoconstriction in gut, vasodilation in skeletal muscle — prepares for fight-or-flight',
          // --- GENE TECHNOLOGY ---
          'PCR (polymerase chain reaction) — denaturation at 95°C (break H-bonds); annealing of primers at 50–65°C; extension by Taq polymerase at 72°C; exponential amplification (2ⁿ copies after n cycles); uses: forensics, medical diagnosis, research',
          'Gel electrophoresis — DNA fragments separated by size in agarose gel under electric field; smaller fragments migrate further; stained with ethidium bromide or SYBR Green; DNA profiling uses STRs (short tandem repeats)',
          'DNA sequencing — Sanger chain-termination method: ddNTPs (dideoxynucleotides) terminate extension at specific bases → fragments of different sizes → separated by electrophoresis → sequence read; next-generation sequencing: massively parallel, shotgun sequencing, bioinformatics',
          'Genetic engineering — restriction endonucleases cut DNA at palindromic recognition sequences producing sticky ends; ligation joins insert to vector using DNA ligase; vectors: plasmids (with antibiotic resistance selectable markers) and bacteriophages; transformation of host cells (e.g. E. coli) by heat shock or electroporation; reporter genes (GFP, β-galactosidase) to identify transformants; recombinant DNA: human insulin gene in E. coli, golden rice (β-carotene genes)',
          'CRISPR-Cas9 — guide RNA (gRNA) directs Cas9 nuclease to specific DNA sequence; Cas9 cuts both strands; gene editing: knockout (gene inactivated), correction (replace faulty gene), insertion; therapeutic and agricultural applications; ethical considerations',
          'Gene therapy — somatic: corrective gene delivered to somatic cells via viral vectors; affects patient only; germline: corrective gene delivered to egg/sperm/embryo — heritable; ethical issues; success stories: SCID-X1; limitations: immune response to vectors, gene expression not always sustained',
          'DNA profiling — STR analysis; RFLP (restriction fragment length polymorphism); forensic uses; paternity testing; disease susceptibility',
        ],
        forbiddenTopics: [
          'Energy flow through ecosystems and nutrient cycles — Unit 4',
          'Immunity mechanisms (B cells, T cells, antibody structure, vaccines) — Unit 4',
          'Photosynthesis (Calvin cycle, light-dependent reactions) — Unit 4',
          'Microbiology (bacterial growth phases, aseptic technique) — Unit 4',
          'Cell division mechanism (mitosis and meiosis stages) — Unit 2',
          'Plant cell ultrastructure and cellulose — Unit 2',
          'Biodiversity indices — Unit 2',
          'Haemoglobin oxygen dissociation curve detail — Unit 1',
          'Cardiovascular disease — Unit 1',
        ],
        requiredKeywords: [
          'glycolysis', 'pyruvate', 'acetyl-CoA', 'oxaloacetate', 'Krebs cycle',
          'NADH', 'FADH₂', 'oxidative phosphorylation', 'chemiosmosis', 'ATP synthase',
          'oxygen debt', 'lactate', 'respiratory quotient', 'RQ',
          'negative feedback', 'set point', 'homeostasis',
          'insulin', 'glucagon', 'glycogenesis', 'glycogenolysis', 'gluconeogenesis',
          'GLUT4', 'Type 1 diabetes', 'Type 2 diabetes',
          'ultrafiltration', 'podocytes', 'basement membrane', 'selective reabsorption',
          'loop of Henle', 'countercurrent multiplier', 'ADH', 'aquaporin',
          'resting potential', 'depolarisation', 'repolarisation', 'refractory period',
          'saltatory conduction', 'nodes of Ranvier', 'acetylcholine', 'acetylcholinesterase',
          'EPSP', 'IPSP', 'summation', 'Ca²⁺ influx',
          'PCR', 'Taq polymerase', 'restriction endonuclease', 'sticky ends', 'ligation',
          'CRISPR', 'guide RNA', 'Cas9', 'STR', 'gel electrophoresis',
        ],
      },
    },

    // -----------------------------------------------------------
    // EDEXCEL IAL CHEMISTRY (YCH11)
    // -----------------------------------------------------------
    chemistry: {

      unit1: {
        code: 'WCH11',
        title: 'Structure, Bonding and Introduction to Organic Chemistry',
        allowedTopics: [
          // FORMULAE, EQUATIONS AND AMOUNT OF SUBSTANCE
          'Relative atomic mass Ar — weighted mean mass of an atom compared to 1/12 of carbon-12; calculating from mass spectrum',
          'Relative molecular mass Mr — sum of relative atomic masses of all atoms in molecule',
          'Mole concept — n = m/M; Avogadro constant L = 6.02×10²³ mol⁻¹; molar mass in g mol⁻¹',
          'Empirical formula — simplest whole number ratio of atoms; molecular formula — actual number of each atom; calculating from percentage composition or combustion data',
          'Stoichiometric calculations — reacting masses using molar ratios; limiting reagent (determines amount of product); excess reagent; percentage yield = actual yield/theoretical yield × 100%; percentage purity',
          'Molar volume of gas — at RTP: 24 dm³ mol⁻¹ (24,000 cm³ mol⁻¹)',
          'Concentration — c = n/V; mol dm⁻³; g dm⁻³',
          'Ideal gas equation — pV = nRT (p in Pa, V in m³, T in K, R = 8.31 J K⁻¹ mol⁻¹); converting units: kPa to Pa (×1000), dm³ to m³ (÷1000), °C to K (+273)',
          // ATOMIC STRUCTURE AND THE PERIODIC TABLE
          'Subatomic particles — proton: relative mass 1, relative charge +1; neutron: relative mass 1, relative charge 0; electron: negligible mass, relative charge −1',
          'Atomic number (proton number) Z; mass number (nucleon number) A; isotopes (same Z, different A, same chemical properties); relative atomic mass from isotopic abundances',
          'Mass spectrometry (time-of-flight) — ionisation (electron bombardment), acceleration (electric field), drift (constant speed, time depends on mass), detection (time of arrival); m/z vs relative abundance; calculating Ar',
          'Electronic configuration — shells, sub-shells (s, p, d); Aufbau principle (lowest energy first); Hund\'s rule (maximise unpaired electrons); Pauli exclusion (max 2 electrons per orbital, opposite spin); filling order: 1s 2s 2p 3s 3p 4s 3d; notation e.g. 1s²2s²2p⁶3s¹; anomalies Cr and Cu NOT required at Unit 1',
          'First ionisation energy — energy to remove 1 mole of electrons from 1 mole of gaseous atoms; trend across period 2 (generally increases, with dips at Group 3 and Group 6); trend down Group 1/2 (decreases); factors: nuclear charge, atomic radius, shielding by inner electrons, spin-pair repulsion',
          'Successive ionisation energies — large jump indicates new shell; evidence for shell structure',
          // BONDING AND STRUCTURE
          'Ionic bonding — electron transfer from metal to non-metal; dot-and-cross diagrams; giant ionic lattice; properties: high MP/BP (strong electrostatic attraction), conducts electricity when molten or dissolved (free ions), brittle (like charges repel on dislocation), soluble in polar solvents',
          'Covalent bonding — electron sharing; dot-and-cross diagrams for: H₂, Cl₂, HCl, H₂O, NH₃, CH₄, CO₂, PCl₅ (10 electrons around P), SF₆ (12 electrons around S); sigma bonds (end-on overlap); pi bonds (sideways overlap of p orbitals); dative/coordinate bonds (both electrons from same atom)',
          'VSEPR theory — electron pairs (bonding + lone) repel; shapes: linear 180° (2 bonding pairs, 0 lone); trigonal planar 120° (3 bp, 0 lp); tetrahedral 109.5° (4 bp, 0 lp); trigonal bipyramidal 90°/120° (5 bp, 0 lp); octahedral 90° (6 bp, 0 lp); bent/V-shaped ~104.5° (2 bp, 2 lp e.g. H₂O); pyramidal ~107° (3 bp, 1 lp e.g. NH₃); lone pairs repel more than bonding pairs',
          'Bond length and bond energy — shorter bond = stronger (higher bond energy); triple > double > single bond strength; triple < double < single bond length',
          'Electronegativity — measure of attraction of bonded atom for electrons; Pauling scale; increases across period (increasing nuclear charge), decreases down group (increasing atomic radius/shielding); bond polarity: δ+ and δ−',
          'Polar molecules — depends on shape and electronegativity difference; symmetric molecules (CCl₄, BF₃, CO₂) are non-polar; asymmetric (H₂O, NH₃, CHCl₃) are polar; dipole moments',
          'London/dispersion forces — temporary dipole → induced dipole in adjacent molecule; increases with electron count (Mr) and surface area; explains boiling point trend in noble gases and alkanes',
          'Permanent dipole-dipole forces — between polar molecules; stronger than London forces at same Mr',
          'Hydrogen bonding — requires N-H, O-H, or F-H (lone pair on small electronegative atom); explains anomalously high BP of H₂O, HF, NH₃; explains lower density of ice vs water; affects solubility',
          'Metallic bonding — sea of delocalised electrons surrounding positive metal ions; properties: conducts electricity and heat (free electrons), malleable/ductile (layers slide), high MP (strong attraction)',
          'Carbon allotropes — diamond: each C bonded to 4 others in tetrahedral arrangement, giant covalent, very hard, non-conductor, high MP; graphite: planar layers of hexagonal rings, delocalised electrons between layers (conductor), layers held by London forces (lubricant, soft); graphene: single layer of graphite, remarkable strength; buckminsterfullerene C₆₀: molecular (not giant), cage structure, low MP, semiconductor',
          // ALKANES
          'Homologous series — same general formula, differ by CH₂, similar chemical properties, trend in physical properties',
          'Functional groups — responsible for characteristic reactions of organic compound',
          'IUPAC nomenclature — systematic naming of alkanes (straight chain, branched, cyclic); prefixes meth/eth/prop/but/pent; substituent names (methyl, ethyl, chloro etc.); numbering to give lowest locants',
          'Structural isomerism — chain isomerism (different carbon skeleton); position isomerism (same functional group, different position); functional group isomerism (same molecular formula, different functional group)',
          'Alkanes (CₙH₂ₙ₊₂) — physical properties: BP increases with chain length and Mr (stronger London forces); combustion: complete (excess O₂) → CO₂ + H₂O; incomplete (limited O₂) → CO and/or C (soot); free radical substitution with Cl₂/Br₂ under UV light: initiation (Cl₂ → 2Cl•), propagation (Cl• + CH₄ → HCl + CH₃•; CH₃• + Cl₂ → CH₃Cl + Cl•), termination (two radicals combine); cracking: thermal (high temperature, no catalyst, produces alkenes + shorter alkanes) and catalytic (lower temperature, zeolite catalyst, more useful products); fractional distillation of crude oil — fractions separated by BP; uses of fractions',
          // ALKENES
          'Alkenes (CₙH₂ₙ) — contain C=C double bond (sigma + pi); planar around double bond; test: bromine water decolourised from orange to colourless (electrophilic addition)',
          'Electrophilic addition mechanism — π bond electron-rich → attacks electrophile → carbocation intermediate → nucleophile attacks; requires curly arrows showing electron movement',
          'Addition of HBr — Markovnikov\'s rule: H adds to less substituted C; explained by carbocation stability (tertiary > secondary > primary); mechanism with curly arrows',
          'Addition of Br₂ — bromonium ion intermediate; product is dibromoalkane',
          'Addition of H₂O (steam + H₃PO₄ catalyst at 300°C, 60-70 atm) — produces alcohol',
          'Hydrogenation (H₂, Ni catalyst, 150°C) — produces alkane',
          'Addition polymerisation — monomers with C=C join to form polymer; drawing repeat unit from monomer; deducing monomer from repeat unit; naming poly(ethene), poly(propene) etc.',
        ],
        forbiddenTopics: [
          'Energetics (enthalpy changes, Hess\'s law, Born-Haber cycle) — Unit 2',
          'Group chemistry (Group 1, 2, 7 reactions) — Unit 2',
          'Kinetics and equilibria even at introductory level — Unit 2 only',
          'Halogenoalkanes (nucleophilic substitution SN1/SN2) — Unit 2',
          'Alcohols (oxidation, dehydration) — Unit 2',
          'Rate equations, order of reaction, Arrhenius equation — Unit 4',
          'Equilibrium constants Kc and Kp — Unit 4',
          'Transition metals, complex ions — Unit 5',
          'Benzene and arenes — Unit 5',
          'Amines, amino acids — Unit 5',
          'NMR spectroscopy — Unit 2 (IR and MS only at Unit 1 level)',
          'Anomalies Cr and Cu electronic configuration — Unit 5',
        ],
        requiredKeywords: [
          'Avogadro constant', 'molar mass', 'limiting reagent', 'percentage yield',
          'ideal gas equation', 'pV = nRT',
          'ionisation energy', 'Aufbau principle', 'Hund\'s rule',
          'VSEPR', 'sigma bond', 'pi bond', 'dative bond', 'lone pair',
          'electronegativity', 'dipole', 'hydrogen bond',
          'London forces', 'dispersion forces',
          'free radical substitution', 'initiation', 'propagation', 'termination',
          'electrophilic addition', 'carbocation', 'Markovnikov',
          'addition polymerisation', 'repeat unit',
        ],
        boundaryNotes: [
          'UNIT 1 ORGANIC: Only alkanes and alkenes. Halogenoalkanes, alcohols, carbonyls, carboxylic acids — all later units.',
          'Kinetics: Do NOT include any collision theory, activation energy, or rate concepts — even basic. Kinetics begins in Unit 2.',
          'Anomalous electronic configurations of Cr and Cu are Unit 5 content.',
        ],
      },

      unit2: {
        code: 'WCH12',
        title: 'Energetics, Group Chemistry, Halogenoalkanes and Alcohols',
        allowedTopics: [
          // ENERGETICS
          'Enthalpy change ΔH — heat energy change at constant pressure; standard conditions: 298 K, 100 kPa, 1 mol dm⁻³; sign convention: exothermic ΔH < 0 (heat released to surroundings); endothermic ΔH > 0 (heat absorbed from surroundings)',
          'Standard enthalpy changes — combustion ΔHc° (burning 1 mol in excess O₂); formation ΔHf° (forming 1 mol from elements in standard states); neutralisation (acid-base reaction per mole of water); atomisation (forming 1 mol of gaseous atoms from element)',
          'Hess\'s law — total enthalpy change is independent of route; Hess cycle calculations using formation data (elements as intermediates) or combustion data (products as intermediates)',
          'Bond enthalpy calculations — average bond enthalpies; ΔH = Σ(energies of bonds broken) − Σ(energies of bonds formed); bond breaking is endothermic; bond making is exothermic',
          'Calorimetry — q = mcΔT (q in J; m in g; c = specific heat capacity, for water c = 4.18 J g⁻¹ K⁻¹); calculating ΔH from experimental temperature change and moles',
          'Lattice enthalpy — energy released when 1 mol of ionic compound forms from gaseous ions at infinite separation (exothermic, negative value); related to ionic charge (higher charge = more exothermic) and ionic radius (smaller radius = more exothermic)',
          'Born-Haber cycle — Hess cycle construction using: atomisation enthalpy of metal, ionisation enthalpy (IE₁), dissociation enthalpy of non-metal, electron affinity (EA₁), lattice enthalpy; calculating unknown value; comparing calculated vs experimental values (discrepancy indicates covalent character due to polarisation)',
          // INTERMOLECULAR FORCES (extension of Unit 1)
          'Further intermolecular forces application — effect of van der Waals forces, dipole-dipole, hydrogen bonding on boiling points, viscosity, solubility; comparing substances',
          // REDOX CHEMISTRY AND GROUPS 1, 2 AND 7
          'Oxidation states — rules: O = −2 (except in peroxides −1 and OF₂); H = +1 (except in metal hydrides −1); F = −1 always; sum equals overall charge; Roman numerals for variable states; assign to all elements in inorganic and simple organic',
          'OIL RIG — oxidation is loss (of electrons); reduction is gain; oxidising agent is reduced (gains electrons); reducing agent is oxidised (loses electrons)',
          'Balancing redox equations — half-equation method: balance atoms, add H₂O for O balance, add H⁺ for H balance in acid, add electrons to balance charge; in alkaline conditions add OH⁻; combine half-equations by multiplying to equalise electrons',
          'Disproportionation — same species simultaneously oxidised and reduced (e.g. Cl₂ in NaOH)',
          'Group 1 (Li, Na, K) — reactions with water (metal + H₂O → metal hydroxide + H₂; vigour increases Li<Na<K); reactions with O₂ (Li → Li₂O, Na → Na₂O₂, K → KO₂); reactions with Cl₂ (all → metal chloride); reactivity increases down group (lower IE₁); flame tests: Li red, Na yellow/orange, K lilac',
          'Group 2 (Mg, Ca, Sr, Ba) — reactions with water: Mg reacts slowly with cold water, vigorously with steam → MgO + H₂; Ca/Sr/Ba react with cold water → metal hydroxide + H₂; trend: reactivity increases down group; reactions with O₂ and dilute HCl; thermal stability of carbonates: MgCO₃ decomposes most easily (>300°C), BaCO₃ most stable (>1000°C) — trend in stability increases down group due to increasing ionic radius polarising carbonate ion less; solubility of hydroxides INCREASES down group (Mg(OH)₂ least soluble, Ba(OH)₂ most); solubility of sulfates DECREASES down group (MgSO₄ most soluble, BaSO₄ insoluble); flame tests: Ca brick red, Sr crimson, Ba apple green; uses: Ca(OH)₂ in agriculture (neutralise acid soil), CaO quicklime, BaSO₄ in medicine (barium meal)',
          'Group 7 Halogens (F₂, Cl₂, Br₂, I₂) — physical properties (state at room temp: F₂/Cl₂ gas, Br₂ liquid, I₂ solid; colour: F₂ pale yellow, Cl₂ yellow-green, Br₂ orange-brown, I₂ grey-black); electronegativity decreases down group; oxidising power decreases (F₂ strongest); displacement reactions: Cl₂ + 2KBr → 2KCl + Br₂; Cl₂ + 2KI → 2KCl + I₂; Br₂ + 2KI → 2KBr + I₂ (Cl₂ displaces both Br⁻ and I⁻; Br₂ displaces I⁻ only; I₂ cannot displace); colours in organic solvent layer: Cl₂ = very pale yellow, Br₂ = orange, I₂ = purple; reducing power of halide ions: I⁻ > Br⁻ > Cl⁻ > F⁻ (F⁻ cannot reduce H₂SO₄); reactions with conc H₂SO₄: NaCl → HCl (g) + NaHSO₄; NaBr → HBr + SO₂ (SO₄²⁻ reduced to SO₂); NaI → HI + H₂S + S + SO₂ (multiple reduction products); test for halide ions: acidified AgNO₃ solution → AgCl white precipitate soluble in dilute NH₃; AgBr cream precipitate soluble only in conc NH₃; AgI yellow precipitate insoluble in NH₃; disproportionation of Cl₂ in NaOH: cold dilute NaOH → NaCl + NaClO (bleach); hot conc NaOH → NaCl + NaClO₃',
          // KINETICS AND EQUILIBRIA (INTRODUCTORY ONLY)
          'Collision theory — particles must collide with sufficient energy (at least equal to activation energy Ea) and correct orientation for reaction to occur; activation energy = minimum energy required',
          'Factors affecting rate — concentration (more particles per unit volume → more frequent collisions); temperature (increases average kinetic energy → greater fraction of particles have energy ≥ Ea → more effective collisions per unit time); surface area (more collisions at surface); catalyst (provides alternative lower-energy pathway → lowers Ea without being consumed)',
          'Maxwell-Boltzmann distribution — y-axis: number of particles with given energy; x-axis: kinetic energy; curve starts at origin (no particles with zero energy); rises to peak (most probable energy); long tail to right (few particles with very high energy); total area under curve = total number of particles; Ea marked on x-axis; area to right of Ea = fraction of particles that can react; increasing temperature: curve flattens, peak shifts right, peak height decreases, area to right of Ea increases significantly',
          'Dynamic equilibrium — in a closed system, forward and reverse reactions occur simultaneously; when rates of forward and reverse reactions are equal, concentrations remain constant; system is at equilibrium',
          'Le Chatelier\'s principle — if a system at equilibrium is disturbed, it will shift to oppose the change: increasing concentration of reactant → equilibrium shifts right; increasing pressure → shifts toward fewer moles of gas; increasing temperature → shifts toward endothermic side (ΔH > 0 for that direction); adding catalyst → does NOT shift position, only speeds up attainment of equilibrium',
          // ORGANIC: HALOGENOALKANES
          'Halogenoalkanes — classification: primary (C-X carbon bonded to 1 carbon group), secondary (2 carbon groups), tertiary (3 carbon groups); physical properties: BP increases with chain length and halogen atomic number (stronger London forces); C-X bond polarity (δ+ on C)',
          'Nucleophilic substitution SN1 — occurs with tertiary halogenoalkanes; two steps: (1) C-X bond breaks heterolytically → carbocation intermediate (planar, sp² hybridised); (2) nucleophile attacks carbocation; rate depends only on [halogenoalkane]; racemisation occurs',
          'Nucleophilic substitution SN2 — occurs with primary halogenoalkanes; one step: nucleophile attacks C-X carbon from back → transition state → X⁻ leaves; rate depends on [halogenoalkane] AND [nucleophile]; Walden inversion (stereochemistry inverts)',
          'Competition between substitution and elimination — with NaOH in ethanol (hot, concentrated) → elimination to form alkene; with NaOH in water (dilute) → substitution to form alcohol',
          'Reactivity order of halogenoalkanes — C-I > C-Br > C-Cl; bond enthalpy: C-F > C-Cl > C-Br > C-I (C-I weakest → most reactive toward nucleophilic substitution); testing for halide produced: add AgNO₃ to hydrolysis products',
          'CFCs and ozone depletion — UV breaks C-Cl bond → Cl• free radical; Cl• + O₃ → ClO• + O₂; ClO• + O• → Cl• + O₂; Cl• regenerated → catalytic destruction; international agreements to phase out CFCs',
          'Uses of halogenoalkanes — solvents, anaesthetics, fire retardants, refrigerants',
          // ORGANIC: ALCOHOLS
          'Alcohols — classification: primary (C-OH bonded to 1 carbon), secondary (2 carbons), tertiary (3 carbons); physical properties: H-bonding raises BP significantly vs alkanes of similar Mr; lower alcohols miscible with water',
          'Reactions of alcohols — combustion (complete): alcohol + O₂ → CO₂ + H₂O; oxidation with acidified K₂Cr₂O₇ (orange → green): primary → aldehyde (distil off) → carboxylic acid (reflux); secondary → ketone; tertiary → no reaction with Cr oxidant',
          'Dehydration of alcohol — using Al₂O₃ catalyst (400°C) or concentrated H₃PO₄: alcohol → alkene + H₂O',
          'Reaction with PCl₅ — alcohol + PCl₅ → chloroalkane + POCl₃ + HCl; white fumes of HCl confirms -OH present; used to test for alcohol',
          'Esterification — alcohol + carboxylic acid ⇌ ester + water; conc H₂SO₄ catalyst; reversible; naming esters (alkyl alkanoate)',
          // SPECTRA
          'Mass spectrometry (Unit 2 level) — molecular ion peak M⁺ gives Mr; fragmentation patterns; identifying common fragments: m/z 15 = CH₃⁺, 29 = CHO⁺, 45 = OEt⁺; base peak = most abundant fragment',
          'IR spectroscopy — wavenumber ranges for functional group identification: broad O-H 2500-3300 cm⁻¹ (carboxylic acid); O-H 3200-3550 cm⁻¹ (alcohol); N-H 3300-3500 cm⁻¹; C=O 1680-1750 cm⁻¹ (carbonyl); C-H 2850-3100 cm⁻¹; identifying functional groups from absorption peaks; fingerprint region below 1500 cm⁻¹ (complex, used for identification)',
        ],
        forbiddenTopics: [
          'CRITICAL — Rate equations (rate = k[A]^m[B]^n), order of reaction (zero/first/second), rate constant k and its units — ALL belong in Unit 4 only, never Unit 2',
          'CRITICAL — Arrhenius equation k = Ae^(-Ea/RT) — Unit 4 only',
          'CRITICAL — Half-life of first-order reactions — Unit 4 only',
          'CRITICAL — Rate-determining step and reaction mechanism analysis using rate equations — Unit 4 only',
          'CRITICAL — Initial rates method calculations from experimental data — Unit 4 only',
          'Equilibrium constants Kc, Kp, Ka, Kb, Ksp — Unit 4 only',
          'Buffer solutions — Unit 4 only',
          'Entropy ΔS and Gibbs free energy ΔG — Unit 4 only',
          'Transition metals, complex ions, d-block chemistry — Unit 5 only',
          'Amines and amino acids — Unit 5 only',
          'Arenes and benzene chemistry — Unit 5 only',
          'Carbonyl compounds (aldehydes and ketones reactions beyond aldehyde from primary alcohol oxidation) — Unit 4 only',
          'NMR spectroscopy (¹H NMR, ¹³C NMR) — Unit 5 only',
        ],
        requiredKeywords: [
          'enthalpy change', 'Hess\'s law', 'bond enthalpy', 'lattice enthalpy', 'Born-Haber cycle',
          'calorimetry', 'q = mcΔT', 'exothermic', 'endothermic',
          'oxidation state', 'OIL RIG', 'half-equation', 'disproportionation',
          'collision theory', 'activation energy', 'Maxwell-Boltzmann distribution',
          'dynamic equilibrium', 'Le Chatelier\'s principle',
          'SN1', 'SN2', 'carbocation', 'Walden inversion', 'nucleophile',
          'AgNO₃', 'AgCl white', 'AgBr cream', 'AgI yellow',
          'K₂Cr₂O₇', 'primary alcohol', 'secondary alcohol', 'tertiary alcohol',
          'esterification', 'molecular ion peak', 'fragmentation',
        ],
        boundaryNotes: [
          'KINETICS HARD BOUNDARY: Unit 2 contains ONLY qualitative collision theory, Maxwell-Boltzmann distribution, and Le Chatelier\'s principle. Any mathematical treatment of kinetics (rate equations, k, orders) is Unit 4 ONLY.',
          'Le Chatelier is qualitative only here. Kc and Kp do not appear until Unit 4.',
        ],
      },

      unit4: {
        code: 'WCH14',
        title: 'Rates, Equilibria and Further Organic Chemistry',
        allowedTopics: [
          // KINETICS (ADVANCED)
          'Rate of reaction — change in concentration of reactant or product per unit time; units: mol dm⁻³ s⁻¹; measuring by continuous monitoring (colorimetry for coloured species, gas syringe for gas volume, mass balance for gas loss, conductivity) or initial rates (clock reactions)',
          'Rate equation — rate = k[A]^m[B]^n; order with respect to A is m; overall order = m+n; determined experimentally, NOT from stoichiometric equation',
          'Orders of reaction — zero order: rate independent of concentration; first order: rate directly proportional to [A]; second order: rate ∝ [A]²',
          'Units of rate constant k — depend on overall order: zero order: mol dm⁻³ s⁻¹; first order: s⁻¹; second order: mol⁻¹ dm³ s⁻¹; general: mol^(1-n) dm^(3n-3) s⁻¹',
          'Determining order experimentally — initial rates method: compare pairs of experiments where one concentration doubled (others constant): if rate doubles → first order; if rate quadruples → second order; if rate unchanged → zero order; graph methods: concentration-time graphs: zero order = straight line; first order = exponential decay; second order = different curve; rate-concentration graphs: zero order = horizontal line; first order = straight line through origin; second order = upward-curving line',
          'Half-life (first-order ONLY) — t½ = ln2/k = 0.693/k; constant half-life regardless of initial concentration; confirming first-order by showing constant t½ from concentration-time graph',
          'Arrhenius equation — k = Ae^(−Ea/RT); A = pre-exponential/frequency factor; Ea = activation energy in J mol⁻¹; R = 8.31 J K⁻¹ mol⁻¹; T in Kelvin; graphical method: take ln of both sides → ln k = ln A − Ea/RT → plot ln k vs 1/T → straight line with gradient = −Ea/R → y-intercept = ln A; calculating Ea from two temperature measurements: ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂)',
          'Reaction mechanisms — rate-determining step (RDS) = slowest step; rate equation reflects molecularity of RDS only; proposed mechanism must be consistent with both experimental rate equation AND overall stoichiometric equation; SN1 and SN2 kinetics support respective mechanisms',
          // ENTROPY AND FURTHER ENERGETICS
          'Entropy S — measure of disorder or number of accessible microstates; units J K⁻¹ mol⁻¹; predicting sign of ΔS: gaseous products increase disorder (positive ΔS); dissolving increases disorder; fewer gaseous moles → negative ΔS; condensed phases lower entropy',
          'Total entropy change — ΔStotal = ΔSsystem + ΔSsurroundings = ΔSsystem + (−ΔH/T); for spontaneous reaction ΔStotal must be positive (second law)',
          'Gibbs free energy — ΔG = ΔH − TΔS; reaction feasible when ΔG < 0; not feasible when ΔG > 0; temperature at which reaction just becomes feasible: T = ΔH/ΔS; limitations: thermodynamic feasibility does not mean fast reaction (kinetic control)',
          // CHEMICAL EQUILIBRIA
          'Equilibrium constant Kc — expression from balanced equation: for aA + bB ⇌ cC + dD, Kc = [C]^c[D]^d/[A]^a[B]^b; units depend on Σ(product moles) − Σ(reactant moles); calculating Kc from equilibrium concentrations; temperature is the only factor that changes value of Kc; adding concentration or changing pressure shifts position but NOT value of Kc; catalyst does not change Kc or position',
          'Equilibrium constant Kp — expression using partial pressures; partial pressure pA = mole fraction × total pressure = (nA/ntotal) × Ptotal; Kp = (pC)^c(pD)^d/(pA)^a(pB)^b; units depend on Δn(gas); calculating Kp from moles and total pressure',
          // ACID-BASE EQUILIBRIA
          'Brønsted-Lowry acid-base theory — acid = proton donor; base = proton acceptor; conjugate acid-base pairs (differ by one H⁺)',
          'Strong acids — fully dissociated: HCl, H₂SO₄ (first ionisation), HNO₃; weak acids — partially dissociated: CH₃COOH, HF, H₂CO₃',
          'Ka and pKa — Ka = [H⁺][A⁻]/[HA]; acid dissociation constant; pKa = −log Ka; stronger weak acid has larger Ka, smaller pKa',
          'Kw = [H⁺][OH⁻] = 1×10⁻¹⁴ at 25°C; pKw = 14; pH = −log[H⁺]; pOH = −log[OH⁻]; pH + pOH = 14',
          'Calculating pH — strong acid: pH = −log[HA] (since fully dissociated); strong base: [OH⁻] = [MOH], find pOH, then pH = 14 − pOH; weak acid approximation: [H⁺] = √(Ka × [HA]); pH = −log√(Ka × [HA]) = ½pKa − ½log[HA]',
          'Buffer solutions — composition: weak acid + conjugate base (its salt e.g. CH₃COOH + CH₃COONa); mechanism: added H⁺ neutralised by A⁻ (CH₃COO⁻ + H⁺ → CH₃COOH); added OH⁻ neutralised by HA (CH₃COOH + OH⁻ → CH₃COO⁻ + H₂O); Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]); biological importance: blood pH 7.4 buffered by H₂CO₃/HCO₃⁻',
          'Acid-base titration curves — strong acid/strong base: equivalence point pH 7; strong acid/weak base: equivalence pH < 7; weak acid/strong base: equivalence pH > 7; weak acid/weak base: no distinct vertical portion; choosing indicator: pKin must fall within steep portion of curve; indicators: methyl orange pKin ~4 (strong acid/strong base or strong acid/weak base); phenolphthalein pKin ~9 (strong base titrations)',
          'Solubility product Ksp — expression: for MₘXₙ ⇌ mM^n⁺ + nX^m⁻, Ksp = [M^n⁺]^m[X^m⁻]^n; calculating Ksp from solubility; predicting precipitation: calculate ionic product Qsp; if Qsp > Ksp → precipitate forms; common ion effect (adding common ion reduces solubility)',
          // ORGANIC: CARBONYLS
          'Aldehydes and ketones — IUPAC naming: aldehyde = -al (CHO at end of chain); ketone = -one (C=O within chain); physical properties: polar C=O but no H-bonding between molecules → lower BP than alcohols; soluble in water (H-bonding with water)',
          'Nucleophilic addition of HCN — KCN catalyst; HCN adds across C=O; curly arrow mechanism: CN⁻ attacks δ+ carbon of C=O → alkoxide ion formed → protonated by H⁺ from HCN → hydroxynitrile; product contains new chiral centre (equal amounts of two enantiomers = racemate)',
          'Reduction with NaBH₄ — aldehyde → primary alcohol; ketone → secondary alcohol',
          'Tollens\' reagent (ammoniacal silver nitrate) — Ag(NH₃)₂⁺ oxidises aldehyde → silver mirror (Ag° deposits); ketones do NOT react; distinguishes aldehydes from ketones',
          'Fehling\'s/Benedict\'s solution — blue Cu²⁺ complex oxidises aliphatic aldehydes → brick red Cu₂O precipitate; aromatic aldehydes do NOT react; ketones do NOT react',
          '2,4-DNP (Brady\'s reagent) — identifies presence of carbonyl group (aldehyde OR ketone); yellow/orange precipitate; recrystallise and measure MP to identify specific compound',
          'Iodoform reaction — CHI₃ precipitate (yellow, characteristic smell) formed from: methyl ketones (CH₃COR), ethanal (CH₃CHO), secondary alcohols with CH₃CH(OH)− group; reagent: I₂ in NaOH; used to identify these specific compounds',
          // ORGANIC: CARBOXYLIC ACIDS
          'Carboxylic acids — IUPAC naming: -oic acid; acidic character (weaker than HCl but stronger than phenol, stronger than alcohols); reactions with Na → H₂ + sodium salt; with NaOH → sodium salt + water; with Na₂CO₃ → sodium salt + water + CO₂ (effervescence distinguishes from alcohols)',
          'Esterification — carboxylic acid + alcohol ⇌ ester + water; conc H₂SO₄ catalyst; reversible; Fischer esterification',
          'Reduction to primary alcohol — LiAlH₄ in dry ether; carboxylic acid → primary alcohol; strong reducing agent',
          'Acyl chlorides — preparation from carboxylic acid + PCl₅ or SOCl₂; reactions with water → carboxylic acid + HCl; with alcohol → ester + HCl; with ammonia → primary amide + HCl; with primary amine → secondary amide + HCl; all nucleophilic addition-elimination; more reactive than carboxylic acid',
          'Acid anhydrides — same nucleophilic addition-elimination with same nucleophiles as acyl chlorides; less reactive than acyl chlorides; produce carboxylic acid as second product (rather than HCl)',
          'Esters — acid hydrolysis (H₂SO₄/H₂O, heat) → carboxylic acid + alcohol (reversible); base hydrolysis/saponification (NaOH/H₂O, heat) → carboxylate salt + alcohol (irreversible, more complete)',
          'Polyesters — condensation polymerisation; Terylene from benzene-1,4-dicarboxylic acid + ethane-1,2-diol; draw structural formula of repeat unit',
          // CHIRALITY
          'Chirality — chiral carbon = carbon bonded to 4 different groups; enantiomers = non-superimposable mirror images; racemic mixture = 50:50 mixture of enantiomers; optically active: rotates plane polarised light; biological significance: drug enantiomers may have different activities',
        ],
        forbiddenTopics: [
          'CRITICAL — Introductory collision theory "more concentration = faster rate" without mathematical rate equation treatment — already in Unit 2. Unit 4 must use rate equations.',
          'CRITICAL — Basic Le Chatelier without Kc treatment — Unit 2 level only',
          'Transition metal chemistry — Unit 5 only',
          'Amines and amino acids — Unit 5 only',
          'Arenes/benzene and electrophilic aromatic substitution — Unit 5 only',
          'NMR spectroscopy — Unit 5 only',
          'Group 1, 2, 7 detailed chemistry — Unit 2 only',
        ],
        requiredKeywords: [
          'rate equation', 'rate constant k', 'order of reaction', 'initial rates method',
          'half-life', 't½ = 0.693/k', 'Arrhenius equation', 'activation energy Ea',
          'ln k vs 1/T', 'rate-determining step',
          'entropy', 'ΔG = ΔH − TΔS', 'Gibbs free energy', 'feasibility',
          'Kc expression', 'Kp expression', 'partial pressure', 'mole fraction',
          'Brønsted-Lowry', 'Ka', 'pKa', 'Kw', 'Henderson-Hasselbalch',
          'buffer solution', 'conjugate acid-base pair',
          'Ksp', 'ionic product', 'common ion effect',
          'nucleophilic addition', 'Tollens\' reagent', '2,4-DNP', 'iodoform',
          'acyl chloride', 'acid anhydride', 'saponification',
          'enantiomers', 'chiral carbon', 'racemic mixture',
        ],
        boundaryNotes: [
          'UNIT 4 KINETICS: Do NOT repeat basic collision theory already in Unit 2. Begin with rate equations immediately.',
          'Half-life applies to first-order reactions ONLY in this specification.',
          'Arrhenius equation must include graphical method (ln k vs 1/T) — this is commonly examined.',
        ],
      },

      unit5: {
        code: 'WCH15',
        title: 'Transition Metals and Organic Nitrogen Chemistry',
        allowedTopics: [
          // REDOX EQUILIBRIA
          'Standard electrode potential E° — EMF of half-cell measured against standard hydrogen electrode (SHE = 0.00 V) under standard conditions (298 K, 1 atm, 1 mol dm⁻³); SHE: H₂(g) at 1 atm, H⁺(aq) 1 mol dm⁻³, Pt electrode',
          'Standard cell EMF — E°cell = E°cathode − E°anode = E°(more positive electrode) − E°(more negative electrode); more positive electrode is cathode (reduction occurs)',
          'Electrochemical series — ranking of half-cells by E°; strongest oxidising agent at top right (most positive reduction potential)',
          'Predicting feasibility — positive E°cell indicates thermodynamically feasible reaction; the half-cell with more positive E° will be reduced; the other will be oxidised',
          'Limitations of E° predictions — kinetics may prevent thermodynamically feasible reactions; non-standard conditions affect electrode potential; concentration effects',
          'Nernst equation — E = E° + RT/nF × ln([Ox]/[Red]); effect of concentration on electrode potential',
          // TRANSITION METALS
          'Definition of transition metal — d-block element that forms at least one stable ion with an incomplete d sub-shell; Sc and Zn do NOT qualify (Sc³⁺ = [Ar]3d⁰; Zn²⁺ = [Ar]3d¹⁰)',
          'Electronic configurations — Ti [Ar]3d²4s²; V [Ar]3d³4s²; Cr [Ar]3d⁵4s¹ (anomaly); Mn [Ar]3d⁵4s²; Fe [Ar]3d⁶4s²; Co [Ar]3d⁷4s²; Ni [Ar]3d⁸4s²; Cu [Ar]3d¹⁰4s¹ (anomaly); 4s electrons lost before 3d when forming ions',
          'Variable oxidation states — Fe: +2 and +3; Cu: +1 and +2; Mn: +2, +4, +7; Cr: +3, +6; V: +2, +3, +4, +5; Ti: +4 (most common)',
          'Colour of compounds — d-d electron transitions; ligand field causes splitting of d orbitals into two energy levels; electron absorbs specific wavelength → transitions between levels → complementary colour observed; different oxidation states, ligands and geometry → different colours',
          'Catalytic activity — heterogeneous catalysis: Fe in Haber process (surface adsorption/activation); V₂O₅ in Contact process (V⁵⁺/V⁴⁺ redox cycle); Pt in catalytic converters; MnO₂ for H₂O₂ decomposition; homogeneous catalysis: Fe³⁺ in S₂O₈²⁻/I⁻ reaction (intermediate Fe²⁺/Fe³⁺ cycle)',
          'Complex ion formation — ligand = molecule or ion that donates a lone pair of electrons to central metal ion (Lewis base); coordination bond/dative bond formed; coordination number = number of dative bonds; monodentate ligands (one lone pair): H₂O, NH₃, Cl⁻, CN⁻, OH⁻, CO; bidentate (two lone pairs): en (ethane-1,2-diamine), ox²⁻ (ethanedioate); polydentate/hexadentate: EDTA⁴⁻ (6 lone pairs)',
          'Complex ion shapes — coordination number 6 → octahedral; coordination number 4 → tetrahedral (e.g. [CoCl₄]²⁻) or square planar (e.g. [Pt(NH₃)₂Cl₂] — Pt²⁺ often square planar)',
          'Isomerism in complexes — cis-trans: cis has identical groups on same side; trans has identical groups on opposite sides (square planar and octahedral); optical isomerism in tris-bidentate complexes (non-superimposable mirror images, no plane of symmetry)',
          'Reactions of aqua ions with NaOH — [Cu(H₂O)₆]²⁺ + 2OH⁻ → Cu(OH)₂ (pale blue precipitate); [Fe(H₂O)₆]²⁺ + 2OH⁻ → Fe(OH)₂ (green precipitate); [Fe(H₂O)₆]³⁺ + 3OH⁻ → Fe(OH)₃ (brown precipitate)',
          'Reactions with excess NH₃ — [Cu(H₂O)₆]²⁺ + 4NH₃ → [Cu(NH₃)₄(H₂O)₂]²⁺ (deep blue solution); Fe²⁺ and Fe³⁺ hydroxide precipitates do NOT dissolve in excess NH₃',
          'Redox reactions — MnO₄⁻ in acid: MnO₄⁻(aq) + 8H⁺(aq) + 5e⁻ → Mn²⁺(aq) + 4H₂O(l) (purple → almost colourless); Cr₂O₇²⁻ in acid: Cr₂O₇²⁻(aq) + 14H⁺(aq) + 6e⁻ → 2Cr³⁺(aq) + 7H₂O(l) (orange → green); Fe²⁺/Fe³⁺ redox pair',
          // ARENES
          'Benzene structure — Kekulé model (alternating double and single bonds — disproved); delocalised model: ring of 6 π electrons above and below plane; evidence: equal C-C bond lengths 140 pm (between single 154 pm and double 134 pm); enthalpy of hydrogenation benzene = −208 kJ mol⁻¹ much less negative than predicted Kekulé value of −360 kJ mol⁻¹; extra stability = delocalisation energy ~150 kJ mol⁻¹',
          'Electrophilic aromatic substitution (EAS) mechanism — electrophile attacks ring → electrons from delocalised π system → arenium ion (positively charged, ring aromaticity lost) → proton lost to base → aromaticity restored; overall substitution not addition (preserves aromatic stability)',
          'Nitration — benzene + conc HNO₃/conc H₂SO₄ (below 55°C) → nitrobenzene; H₂SO₄ protonates HNO₃ → NO₂⁺ electrophile (nitronium ion); mechanism with curly arrows',
          'Friedel-Crafts alkylation — benzene + RCl + AlCl₃ (Lewis acid catalyst) → alkylbenzene; AlCl₃ generates R⁺ carbocation; mechanism with curly arrows',
          'Friedel-Crafts acylation — benzene + RCOCl + AlCl₃ → acyl benzene (aryl ketone); AlCl₃ generates RCO⁺ (acylium ion); mechanism with curly arrows; preferred over alkylation (no polysubstitution)',
          'Halogenation of benzene — Cl₂ + AlCl₃ (Lewis acid catalyst/halogen carrier) → chlorobenzene + HCl; AlCl₃ polarises Cl₂ → Cl⁺ electrophile; mechanism with curly arrows; contrasts with electrophilic addition to alkenes',
          'Directing effects — activating groups (OH, NH₂, CH₃): electron-donating → increase electron density in ring → activate toward EAS → direct to 2,4 positions (ortho/para directors); deactivating groups (NO₂, COOH, COR): electron-withdrawing → deactivate ring → direct to 3 position (meta director)',
          'Phenol reactions — more acidic than alcohols (pKa ~10) but weaker than carboxylic acids; phenoxide ion C₆H₅O⁻ stabilised by delocalisation into ring; reacts with Na and NaOH but NOT Na₂CO₃; reacts with bromine water WITHOUT catalyst → 2,4,6-tribromophenol (white precipitate); acylation with acyl chloride → ester',
          // ORGANIC NITROGEN COMPOUNDS
          'Amines classification — primary (RNH₂): 1 alkyl/aryl group; secondary (R₂NH): 2; tertiary (R₃N): 3; lone pair on N responsible for reactions',
          'Basicity of amines — lone pair accepts H⁺; aliphatic amines (e.g. methylamine) more basic than ammonia (alkyl group donates electrons → increases electron density on N); aromatic amines (e.g. aniline/phenylamine) less basic than ammonia (lone pair delocalised into ring → less available)',
          'Reactions of amines — with HCl: RNH₂ + HCl → RNH₃⁺Cl⁻ (ammonium salt); acylation with acyl chloride: RNH₂ + R\'COCl → RNHCOR\' (secondary amide) + HCl; preparation from halogenoalkane + excess concentrated NH₃ in sealed tube (heated)',
          'Diazonium salts — primary aromatic amine + NaNO₂ + HCl at 0-5°C → ArN₂⁺Cl⁻ (benzenediazonium chloride); must be kept cold (unstable above 10°C); coupling reaction: diazonium ion + phenol (alkaline conditions) or naphthylamine → azo compound (R−N=N−R\') → azo dyes (very bright colours, −N=N− chromophore); commercial importance in textile dyeing',
          'Amino acids — general structure: NH₂−CHR−COOH; R group (side chain) determines identity; 20 naturally occurring; zwitterion at isoelectric point: NH₃⁺−CHR−COO⁻; isoelectric point (pI) = pH at which net charge = 0; varies with R group composition; condensation reaction between amino group (−NH₂) of one amino acid and carboxyl group (−COOH) of another → peptide bond (−CO−NH−) + H₂O; polypeptides and proteins; hydrolysis: acid hydrolysis (6M HCl, 110°C, 24h) or enzyme hydrolysis → individual amino acids',
          // ORGANIC SYNTHESIS
          'Multi-step synthesis — planning forward routes and retrosynthetic analysis through all functional groups covered in Units 1-5: alkanes, alkenes, halogenoalkanes, alcohols, aldehydes, ketones, carboxylic acids and derivatives, amines, amino acids, arenes; reagents and conditions for each transformation; yield and selectivity considerations',
          '¹H NMR spectroscopy — chemical shift δ (ppm) relative to TMS (tetramethylsilane, reference = 0 ppm); number of peaks = number of chemically distinct H environments; integration ratio = relative number of H in each environment; spin-spin splitting: (n+1) rule — n adjacent non-equivalent H gives n+1 peaks; doublet, triplet, quartet, singlet; common chemical shifts: CH₃ (alkyl) ~0.9 ppm; CH₂ (alkyl) ~1.2 ppm; C-OH ~2-3 ppm; Ar-H (aromatic) ~7-8 ppm; CHO (aldehyde) ~9-10 ppm; COOH ~11-12 ppm; combined interpretation with MS and IR for structure determination',
        ],
        forbiddenTopics: [
          'Rate equations and kinetics — Unit 4 only',
          'Equilibrium constants Kc, Kp — Unit 4 only',
          'Acid-base equilibria Ka, buffers, Henderson-Hasselbalch — Unit 4 only',
          'Group 1, 2, 7 detailed chemistry — Unit 2 only',
          'Basic organic nomenclature (should be assumed knowledge from Unit 1)',
          'Introductory collision theory — Unit 2 only',
          'Born-Haber cycles — Unit 2 only',
        ],
        requiredKeywords: [
          'standard electrode potential', 'SHE', 'E°cell', 'electrochemical series',
          'Nernst equation', 'feasibility',
          'incomplete d sub-shell', 'variable oxidation states', 'd-d transition',
          'ligand', 'coordination number', 'dative bond', 'monodentate', 'bidentate', 'EDTA',
          'octahedral', 'square planar', 'cis-trans isomerism',
          'MnO₄⁻', 'Cr₂O₇²⁻', '[Cu(NH₃)₄(H₂O)₂]²⁺',
          'delocalised', 'arenium ion', 'electrophilic aromatic substitution',
          'nitronium ion NO₂⁺', 'Friedel-Crafts', 'directing effect',
          'phenoxide', '2,4,6-tribromophenol',
          'diazonium salt', 'azo dye', 'coupling reaction',
          'zwitterion', 'isoelectric point', 'peptide bond',
          'chemical shift', 'TMS', 'splitting pattern', 'n+1 rule', 'integration',
        ],
      },
    },

    // -----------------------------------------------------------
    // EDEXCEL IAL PHYSICS (YPH11)
    // Unit 3 and Unit 6 are practical-only — no theory notes
    // -----------------------------------------------------------
    physics: {

      unit1: {
        code: 'WPH11',
        title: 'Mechanics and Materials',
        allowedTopics: [
          'Displacement, velocity, acceleration — vectors; equations of uniform acceleration: v = u + at; s = ut + ½at²; v² = u² + 2as; s = ½(u+v)t; deriving from definitions',
          'Graphs — distance-time (gradient = speed); velocity-time (gradient = acceleration; area under = displacement); interpreting non-uniform motion',
          'Projectile motion — horizontal: constant velocity (no air resistance); vertical: constant acceleration g = 9.81 m s⁻²; independence of components; calculating time of flight, range, maximum height',
          'Free fall; terminal velocity — drag increases with speed; when drag = weight, acceleration = zero; terminal velocity reached',
          'Newton\'s first law — object at rest or constant velocity unless resultant force acts; inertia',
          'Newton\'s second law — F = ma; F = rate of change of momentum (dp/dt)',
          'Newton\'s third law — for every force there is an equal and opposite force of the same type on a different object',
          'Free body diagrams — identifying and drawing all forces on an object',
          'Weight W = mg; mass vs weight distinction',
          'Friction — F ≤ μN; F = μN at limiting equilibrium; static (object stationary) and kinetic (object moving) coefficients; direction opposes motion',
          'Moments M = Fd (perpendicular distance from pivot); couple = two equal anti-parallel forces; principle of moments (sum clockwise = sum anticlockwise for equilibrium); centre of gravity',
          'Resolving forces into perpendicular components (Fx = F cosθ; Fy = F sinθ); vector addition using triangle/parallelogram rule',
          'Work done W = Fd cosθ (θ = angle between force and displacement)',
          'Kinetic energy Ek = ½mv²; gravitational PE Ep = mgh (near surface); elastic PE = ½kx²',
          'Conservation of mechanical energy (in absence of non-conservative forces); work-energy theorem (net work done = change in KE)',
          'Efficiency = useful output energy/total input energy × 100%',
          'Power P = W/t = Fv; unit watt (W)',
          'Momentum p = mv; conservation of momentum in closed system (no external net force)',
          'Elastic collision (KE conserved; e = 1); inelastic collision (KE not conserved; e < 1); perfectly inelastic (objects coalesce)',
          'Impulse J = FΔt = Δp = change in momentum; area under force-time graph = impulse',
          'Density ρ = m/V; pressure P = F/A; fluid pressure P = hρg',
          'Archimedes\' principle — upthrust = weight of fluid displaced; floating condition',
          'Hooke\'s law F = kx (spring constant k in N m⁻¹; valid up to elastic limit)',
          'Elastic potential energy = ½kx² = ½Fx; area under F-x graph = energy stored',
          'Young\'s modulus E = stress/strain; stress σ = F/A (Pa); strain ε = ΔL/L (dimensionless); E = FL/(AΔL)',
          'Stress-strain graph — proportionality limit; elastic limit; yield point (plastic deformation begins); UTS (ultimate tensile stress); fracture point; brittle (fracture near elastic limit, no plastic region); ductile (large plastic region before fracture)',
          'Elastic deformation (returns to original shape when force removed); plastic deformation (permanent change); hysteresis loop',
          'Properties — stiffness (high E = stiff); toughness (absorbs energy before fracture = large area under stress-strain curve); hardness (resists surface indentation)',
        ],
        forbiddenTopics: [
          'Waves and light — Unit 2',
          'Electric circuits — Unit 2',
          'Capacitors — Unit 4',
          'Magnetic fields — Unit 4',
          'Circular motion — Unit 4',
          'SHM (simple harmonic motion) — Unit 4',
          'Gravitational fields — Unit 4',
          'Electric fields — Unit 4',
          'Particle physics — Unit 4',
          'Thermodynamics and gas laws — Unit 5',
          'Nuclear radiation — Unit 5',
        ],
        requiredKeywords: [
          'SUVAT', 'projectile', 'terminal velocity', 'Newton\'s laws',
          'momentum', 'impulse', 'elastic collision', 'inelastic collision',
          'work done', 'kinetic energy', 'gravitational PE', 'elastic PE',
          'conservation of energy', 'efficiency', 'power',
          'Hooke\'s law', 'spring constant', 'elastic limit',
          'Young\'s modulus', 'stress', 'strain', 'UTS',
          'brittle', 'ductile', 'elastic deformation', 'plastic deformation',
        ],
      },

      unit2: {
        code: 'WPH12',
        title: 'Waves and Electricity',
        allowedTopics: [
          // WAVES
          'Wave properties — amplitude A (m); wavelength λ (m); frequency f (Hz); period T = 1/f (s); wave speed v = fλ (m s⁻¹); intensity ∝ amplitude²',
          'Transverse waves — oscillation perpendicular to direction of energy transfer (EM waves, water surface, transverse seismic S-waves)',
          'Longitudinal waves — oscillation parallel to direction of energy transfer (sound, seismic P-waves); compressions and rarefactions',
          'Displacement-distance and displacement-time graphs — reading amplitude, wavelength, period',
          'Phase difference — expressed in degrees or radians; in phase = 0 (or 360°); antiphase = 180° (or π)',
          'Reflection — angle of incidence = angle of reflection; plane mirror images (virtual, upright, laterally inverted, same size as object)',
          'Refraction — Snell\'s law n₁sinθ₁ = n₂sinθ₂; refractive index n = c/v; bends toward normal when entering denser medium; bends away when entering less dense',
          'Total internal reflection — only when light travels from dense to less dense medium; critical angle θc: sinθc = n₂/n₁ = 1/n (for air n₂ = 1); at and beyond θc all light reflected; optical fibres: step-index with cladding; uses in endoscopy and telecommunications',
          'Diffraction — spreading of waves at edges or through gaps; qualitative at Unit 2; wider gap or longer λ/gap ratio = more diffraction; waves diffract most when gap ≈ λ',
          'Superposition principle — algebraic sum of displacements at any point where waves overlap',
          'Stationary/standing waves — formed by two progressive waves of equal frequency and amplitude travelling in opposite directions; nodes (zero displacement always); antinodes (maximum displacement); distance between adjacent nodes = λ/2; fundamental frequency and harmonics in strings and open/closed pipes',
          'Interference — coherent sources needed (same frequency, constant phase difference); constructive: path difference = nλ; destructive: path difference = (n + ½)λ; Young\'s double-slit experiment: λ = ax/D (a = slit separation, x = fringe spacing, D = distance to screen)',
          'Diffraction grating — d sinθ = nλ; d = 1/N (where N = lines per metre); multiple sharp bright fringes; uses: measuring wavelength of light, spectroscopy, identifying elements from emission spectra',
          'Polarisation — transverse waves only; plane polarisation by filter; Malus\'s law I = I₀cos²θ; polarisation by reflection (Brewster\'s angle); uses: sunglasses, LCD screens, stress analysis; evidence that EM waves are transverse',
          'EM spectrum — all transverse, travel at c = 3×10⁸ m s⁻¹ in vacuum; order from longest to shortest λ: radio/microwave/infrared/visible/UV/X-ray/gamma; properties and uses of each region; hazards of UV, X-rays, gamma',
          'Photoelectric effect — photons needed (not wave model); threshold frequency f₀ below which no emission regardless of intensity; work function φ = hf₀; Einstein equation: hf = φ + ½mv²max; stopping potential V₀: e V₀ = ½mv²max; evidence for photon model of light',
          'Photons — E = hf = hc/λ; Planck\'s constant h = 6.63×10⁻³⁴ J s',
          'De Broglie wavelength — λ = h/p = h/mv; electron diffraction as evidence for wave nature of particles',
          'Energy levels — electrons in discrete energy levels; emission: electron falls from higher to lower level → photon emitted E = hf = ΔE; absorption: photon absorbed → electron jumps up; line emission spectra explained by specific energy level transitions',
          // ELECTRICITY
          'Charge Q = It; current I = ΔQ/Δt; conventional current direction (from + to −); drift velocity I = nAve (n = number density of charge carriers, A = cross-section, v = drift velocity, e = charge on electron)',
          'Potential difference V = W/Q; resistance R = V/I; Ohm\'s law (resistance constant at constant temperature for metallic conductors)',
          'Resistivity ρ = RA/L; factors affecting resistance: length (R ∝ L), cross-section (R ∝ 1/A), material (different ρ), temperature',
          'I-V characteristics — ohmic conductor (straight line through origin); filament lamp (curve — R increases with temperature); semiconductor diode (conducts in one direction, threshold voltage ~0.6V); thermistor NTC (R decreases as temperature increases); LDR (R decreases as light intensity increases)',
          'Power P = IV = I²R = V²/R; energy E = Pt = VIt = QV',
          'Series circuits — same current throughout; voltages add (V = V₁ + V₂ + ...); resistances add (R_total = R₁ + R₂ + ...)',
          'Parallel circuits — same voltage across each branch; currents add (I_total = I₁ + I₂ + ...); 1/R_total = 1/R₁ + 1/R₂ + ...',
          'Potential divider — Vout = R₂/(R₁+R₂) × Vin; applications with LDR (light sensor) and thermistor (temperature sensor)',
          'EMF and internal resistance — EMF ε = V_terminal + Ir = I(R+r); terminal pd V = ε − Ir; lost volts = Ir; V−I graph: y-intercept = ε, gradient = −r',
          'Kirchhoff\'s current law — algebraic sum of currents at any junction = 0',
          'Kirchhoff\'s voltage law — algebraic sum of EMFs = algebraic sum of IRs around any closed loop',
        ],
        forbiddenTopics: [
          'All mechanics content from Unit 1',
          'Capacitors (charging/discharging, RC time constant) — Unit 4',
          'Magnetic fields (force on current/charge, electromagnetic induction) — Unit 4',
          'Nuclear physics (radioactive decay, binding energy) — Unit 5',
          'Thermodynamics and gas laws — Unit 5',
          'SHM — Unit 4',
          'Circular motion — Unit 4',
        ],
        requiredKeywords: [
          'wavelength', 'frequency', 'wave speed', 'amplitude', 'superposition',
          'coherent', 'constructive interference', 'destructive interference',
          'diffraction', 'stationary wave', 'nodes', 'antinodes',
          'Snell\'s law', 'refractive index', 'total internal reflection', 'critical angle',
          'photoelectric effect', 'work function', 'threshold frequency', 'stopping potential',
          'photon', 'de Broglie wavelength', 'energy levels',
          'drift velocity', 'resistivity', 'Ohm\'s law',
          'EMF', 'internal resistance', 'lost volts',
          'Kirchhoff\'s laws', 'potential divider',
        ],
      },

      unit4: {
        code: 'WPH14',
        title: 'Further Mechanics, Fields and Particles',
        allowedTopics: [
          // CIRCULAR MOTION
          'Angular velocity ω = v/r = 2πf = 2π/T; units rad s⁻¹',
          'Centripetal acceleration a = v²/r = ω²r; directed toward centre of circle',
          'Centripetal force F = mv²/r = mω²r; this IS the resultant net force (not an additional force); provided by different forces in different situations',
          'Car on banked track — N cosθ = mg (vertical); N sinθ = mv²/r (horizontal); finding speed without friction',
          'Conical pendulum — T cosθ = mg; T sinθ = mω²r',
          'Vertical circular motion — at top of circle: mg + N = mv²/r; minimum speed when N = 0 → v_min = √(gr); at bottom: N − mg = mv²/r',
          // SHM
          'Defining condition for SHM — a ∝ −x (acceleration proportional to displacement, directed toward equilibrium); restoring force',
          'Equations — x = A cos(ωt) or A sin(ωt) (depending on initial conditions); v = ±ω√(A² − x²); v_max = ωA (at x = 0); a = −ω²x; a_max = ω²A (at x = ±A)',
          'Angular frequency ω = 2πf = 2π/T',
          'Period formulae — simple pendulum: T = 2π√(l/g); mass-spring: T = 2π√(m/k)',
          'Energy in SHM — Ek = ½mω²(A² − x²); Ep = ½mω²x²; E_total = ½mω²A² = constant; energy exchange between KE and PE; max KE at equilibrium, max PE at amplitude',
          'Damping — light (underdamped): oscillates with exponentially decreasing amplitude; heavy (overdamped): slowly returns to equilibrium without oscillating; critical damping: returns to equilibrium in shortest time without oscillating; effect of damping on resonance peak',
          'Resonance — natural frequency f₀; forced oscillations at driving frequency f; resonance: maximum amplitude when f = f₀; amplitude decreases with increased damping; phase difference between displacement and driving force increases from 0 to π through resonance',
          // GRAVITATIONAL FIELDS
          'Newton\'s law of gravitation F = Gm₁m₂/r² (G = 6.67×10⁻¹¹ N m² kg⁻²); inverse square law',
          'Gravitational field strength g = F/m = GM/r² (radial field around spherical mass)',
          'Gravitational field lines — radial field: lines point toward mass; uniform field near Earth surface: parallel lines',
          'Gravitational potential φ_g = −GM/r; negative (work done per unit mass to move from infinity to that point); zero at infinity',
          'Gravitational PE = mφ_g = −GMm/r',
          'Relationship g = −Δφ_g/Δr (field strength = −potential gradient)',
          'Orbital mechanics — equating gravitational force to centripetal: GMm/r² = mv²/r → v = √(GM/r); period T = 2πr/v = 2π√(r³/GM); Kepler\'s third law T² ∝ r³',
          'Geostationary orbit — T = 24 hours; orbit is equatorial; same direction as Earth\'s rotation; appears stationary above fixed point; r ≈ 42,000 km; uses: communications, weather satellites',
          'Escape velocity — ½mv² = GMm/r → v_esc = √(2GM/r)',
          // ELECTRIC FIELDS
          'Coulomb\'s law F = kq₁q₂/r² = q₁q₂/4πε₀r² (k ≈ 9×10⁹ N m² C⁻²; ε₀ = 8.85×10⁻¹² F m⁻¹)',
          'Electric field strength E = F/q = kQ/r² (radial field around point charge); E = V/d (uniform field between parallel plates)',
          'Electric field lines — radial field: lines out from +, into −; uniform field: parallel lines from + plate to − plate',
          'Electric potential V = kQ/r = Q/4πε₀r; zero at infinity',
          'Work done W = qΔV; E = −ΔV/Δr (field = −potential gradient)',
          'Equipotentials — surfaces of equal potential; perpendicular to field lines',
          'Comparison of gravitational and electric fields — both inverse-square laws; gravity always attractive (mass always positive); electric can attract or repel (charges can be positive or negative); replace Gm with kq in analogies',
          'Capacitance C = Q/V; unit farad (F)',
          'Energy stored in capacitor E = ½CV² = ½QV = Q²/2C',
          'Capacitors in series: 1/C_total = 1/C₁ + 1/C₂ + ...; in parallel: C_total = C₁ + C₂ + ...',
          'Charging/discharging through resistor — Q = Q₀e^(−t/RC); V = V₀e^(−t/RC); I = I₀e^(−t/RC); time constant τ = RC; graph of ln Q vs t gives gradient = −1/RC; when t = τ, charge has fallen to 37% of initial value (1/e)',
          // PARTICLE PHYSICS
          'Fundamental particles — leptons: electron (e⁻), muon (µ⁻), tau (τ⁻) and their neutrinos (νe, νµ, ντ); quarks: up (u, +2/3), down (d, −1/3), strange (s, −1/3), charm (c, +2/3), bottom (b, −1/3), top (t, +2/3); antiquarks',
          'Hadrons — baryons: made of 3 quarks (proton uud, neutron udd); mesons: quark + antiquark (pion π)',
          'Conservation laws — baryon number; lepton number (electron lepton number, muon lepton number); charge; strangeness (conserved in strong and EM interactions, NOT in weak interactions)',
          'Four fundamental forces — strong nuclear (holds quarks in hadrons; acts on quarks/gluons; short range <10⁻¹⁵ m); weak nuclear (responsible for beta decay; short range; acts on all quarks and leptons); electromagnetic (between charged particles; infinite range); gravitational (between all masses; infinite range; weakest)',
          'Exchange particles — photon γ for EM; W⁺, W⁻, Z⁰ bosons for weak; gluons for strong; graviton (hypothetical) for gravity',
          'Feynman diagrams — electron-electron repulsion (exchange photon); beta-minus decay (n → p + e⁻ + ν̄_e via W⁻); beta-plus decay (p → n + e⁺ + νe via W⁺); electron capture (p + e⁻ → n + νe via W⁺)',
        ],
        forbiddenTopics: [
          'Unit 1 mechanics content (SUVAT, Newton\'s laws, Young\'s modulus)',
          'Unit 2 waves and electricity content',
          'Thermodynamics and ideal gas laws — Unit 5',
          'Nuclear radiation (radioactive decay, activity, half-life) in detail — Unit 5',
          'Cosmology and stellar evolution — Unit 5',
        ],
        requiredKeywords: [
          'angular velocity', 'centripetal force', 'centripetal acceleration',
          'SHM', 'restoring force', 'natural frequency', 'resonance', 'damping',
          'gravitational field strength', 'gravitational potential', 'escape velocity',
          'Kepler\'s third law', 'geostationary orbit',
          'Coulomb\'s law', 'electric field strength', 'electric potential', 'equipotential',
          'capacitance', 'time constant RC', 'exponential decay',
          'quarks', 'leptons', 'hadrons', 'baryons', 'mesons',
          'baryon number', 'lepton number', 'strangeness',
          'exchange particles', 'Feynman diagram', 'W boson',
        ],
      },

      unit5: {
        code: 'WPH15',
        title: 'Thermodynamics, Radiation, Oscillations and Cosmology',
        allowedTopics: [
          // THERMODYNAMICS
          'Temperature scales — Celsius and Kelvin; T(K) = θ(°C) + 273; absolute zero = 0 K = −273°C; no negative temperatures on Kelvin scale',
          'Internal energy — sum of random KE and PE of all molecules; for ideal gas: only KE (no intermolecular PE); related to temperature',
          'Specific heat capacity — Q = mcΔT; c = heat energy per unit mass per unit temperature change; unit J kg⁻¹ K⁻¹; experimental measurement by electrical heating',
          'Specific latent heat — Q = mL; latent heat of fusion (solid→liquid) and vaporisation (liquid→gas); flat sections on heating/cooling curve; molecular interpretation: PE increases during change of state, KE (temperature) stays constant',
          'Gas laws — Boyle\'s law: pV = constant at constant T; Charles\' law: V/T = constant at constant p; Pressure law: p/T = constant at constant V; combined: p₁V₁/T₁ = p₂V₂/T₂',
          'Ideal gas equation — pV = nRT (R = 8.31 J mol⁻¹ K⁻¹; n = moles) OR pV = NkT (k = 1.38×10⁻²³ J K⁻¹; N = number of molecules)',
          'Kinetic theory assumptions — gases consist of many identical particles in random motion; particles are point masses (volume negligible); all collisions perfectly elastic; no forces between particles except during collisions; duration of collision negligible compared to time between collisions',
          'Pressure from kinetic theory — p = Nm<c²>/3V (N = number of molecules; <c²> = mean square speed; V = volume)',
          'Mean KE per molecule — ½m<c²> = 3kT/2 = 3RT/2Nₐ; r.m.s. speed c_rms = √(3RT/Mᵣ) or √(3kT/m)',
          // NUCLEAR AND PARTICLE RADIATION
          'Nuclear structure — proton number Z; nucleon number A; isotopes; nuclear notation ᴬ_Z X; nuclear radius ∝ A^(1/3)',
          'Radioactive decay — alpha α: helium nucleus ⁴₂He, +2 charge, stopped by paper/few cm air, highly ionising, deflected by fields; beta-minus β⁻: high-energy electron from nucleus, −1 charge, stopped by few mm Al, moderately ionising; beta-plus β⁺: positron +1 charge; gamma γ: EM radiation, no charge, stopped by thick lead, least ionising; positron-electron annihilation → two gamma photons',
          'Decay equations — conservation of mass number A and proton number Z; writing nuclear equations',
          'Radioactive decay law — N = N₀e^(−λt); activity A = λN; A = A₀e^(−λt); decay constant λ (s⁻¹); half-life t½ = ln2/λ = 0.693/λ; units of activity: becquerel (Bq) = 1 decay per second',
          'Uses of radioactivity — medical tracers (short t½, gamma or beta emitter); radiotherapy (gamma kills cancer cells); industrial thickness gauging; smoke detectors (Am-241, alpha); sterilisation (gamma); radiocarbon dating (C-14 t½ = 5730 years)',
          'Mass-energy equivalence — E = mc²; mass defect Δm = mass of nucleus − sum of masses of nucleons; binding energy = Δm × c²; binding energy per nucleon vs mass number graph: peak at Fe-56 (most stable); lighter than Fe: fusion releases energy; heavier than Fe: fission releases energy',
          'Nuclear fission — heavy nucleus absorbs neutron → unstable nucleus → splits → two smaller nuclei + 2-3 neutrons + energy; chain reaction (subcritical, critical, supercritical); critical mass; reactor components: fuel rods (enriched U-235), moderator (graphite or water — slows neutrons to thermal speeds to increase fission probability), control rods (absorb neutrons — B or Cd — to regulate power), coolant (transfers heat to generate steam → turbine), shielding',
          'Nuclear fusion — combining light nuclei (H isotopes → He); conditions: very high temperature (~10⁸ K) and pressure; energy released per nucleon greater than fission; JET/ITER tokamak; challenges: plasma containment at extreme temperature',
          // OSCILLATIONS
          'SHM context — references Unit 4 content applied to new contexts: seismic waves, molecular vibrations, bridges, engineering applications; damping and resonance in new physical situations',
          // COSMOLOGY
          'Hubble\'s law — v = H₀d; recession velocity proportional to distance; H₀ ≈ 70 km s⁻¹ Mpc⁻¹; evidence for expanding universe',
          'Redshift — z = Δλ/λ ≈ v/c (for v << c); observed light from distant galaxies shifted to longer wavelengths; cosmological redshift due to expansion of space',
          'Big Bang theory — universe began from single hot dense state; expanding and cooling since; evidence: CMB (cosmic microwave background radiation at 2.7 K), Hubble\'s law, relative abundances of H and He',
          'Stellar evolution — nebula → protostar (gravitational contraction) → main sequence star (H fusion, radiation pressure balances gravity); end of main sequence depends on mass: small/medium: red giant → planetary nebula → white dwarf; massive: red supergiant → supernova → neutron star or black hole',
          'Olbers\' paradox — if universe infinite and static and stars uniformly distributed, night sky should be uniformly bright; darkness indicates universe is expanding and finite in age',
          'Age of universe — t ≈ 1/H₀ ≈ 14 billion years (rough estimate)',
        ],
        forbiddenTopics: [
          'Mechanics (Unit 1) — SUVAT, Newton\'s laws, materials',
          'Waves and circuits (Unit 2)',
          'Circular motion and SHM detailed equations — Unit 4 (do not repeat; refer only to new applications in Unit 5)',
          'Gravitational fields and electric fields — Unit 4',
          'Capacitors — Unit 4',
          'Particle physics quark model and Feynman diagrams — Unit 4 (do not repeat)',
        ],
        requiredKeywords: [
          'absolute zero', 'specific heat capacity', 'specific latent heat',
          'ideal gas equation', 'pV = nRT', 'Boltzmann constant',
          'kinetic theory', 'mean square speed', 'r.m.s. speed',
          'radioactive decay law', 'decay constant', 'half-life', 'activity',
          'mass defect', 'binding energy per nucleon', 'E = mc²',
          'nuclear fission', 'chain reaction', 'moderator', 'control rods',
          'nuclear fusion', 'tokamak',
          'Hubble\'s law', 'redshift', 'Big Bang', 'CMB',
          'main sequence', 'neutron star', 'black hole', 'supernova',
        ],
      },
    },

    // -----------------------------------------------------------
    // EDEXCEL IAL MATHEMATICS (YMA01)
    // All 8 units require theory notes
    // -----------------------------------------------------------
    maths: {

      p1: {
        code: 'WMA11',
        title: 'Pure Mathematics 1',
        allowedTopics: [
          'Laws of indices — aᵐ × aⁿ = aᵐ⁺ⁿ; aᵐ ÷ aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ; a^(1/n) = ⁿ√a; a^(m/n) = ⁿ√aᵐ; a⁰ = 1; a⁻ⁿ = 1/aⁿ',
          'Surds — simplification (√(ab) = √a × √b); collecting like surds; rationalising denominators: monomial (multiply by √a/√a); binomial (multiply by conjugate (a±√b)(a∓√b) = a²−b)',
          'Quadratic functions — completing the square ax² + bx + c → a(x+p)² + q; finding vertex; discriminant b²−4ac (>0: two distinct real roots; =0: one repeated root; <0: no real roots); solving by factorisation, formula, completing the square; quadratic inequalities (solve and represent on number line)',
          'Simultaneous equations — linear (substitution and elimination); linear and quadratic (substitution, giving quadratic to solve; find intersection points of line and curve)',
          'Polynomials — expanding brackets; collecting like terms; factor theorem: if f(a) = 0 then (x−a) is a factor; remainder theorem: f(a) = remainder when divided by (x−a); polynomial long division or inspection; factorising cubics',
          'Graph sketching — cubic y = ax³+bx²+cx+d (roots, y-intercept, end behaviour); reciprocal y = k/x (hyperbola, asymptotes at x=0 and y=0); y = k/x²; graph transformations: y = f(x+a) horizontal shift left a; y = f(x)+a vertical shift up a; y = af(x) vertical stretch factor a; y = f(ax) horizontal stretch factor 1/a; y = −f(x) reflection in x-axis; y = f(−x) reflection in y-axis; combinations',
          'Coordinate geometry of straight lines — gradient m = (y₂−y₁)/(x₂−x₁); forms: y = mx+c; y−y₁ = m(x−x₁); ax+by+c = 0; equation through two points; parallel lines (same gradient); perpendicular lines (m₁×m₂ = −1); distance between two points √((x₂−x₁)²+(y₂−y₁)²); midpoint ((x₁+x₂)/2, (y₁+y₂)/2)',
          'Trigonometry — SOHCAHTOA in right-angled triangles; sine rule a/sinA = b/sinB = c/sinC; cosine rule a² = b²+c²−2bc cosA; area of triangle = ½ab sinC; exact values: sin30°=½, cos30°=√3/2, tan30°=1/√3, sin45°=1/√2, cos45°=1/√2, tan45°=1, sin60°=√3/2, cos60°=½, tan60°=√3; radian measure: π rad = 180°; arc length s = rθ; area of sector A = ½r²θ',
          'Trig graphs — y = sinx, y = cosx, y = tanx: key features (period, amplitude, asymptotes for tan); graphs of af(bx+c)+d type transformations; solving equations like sinx = 0.5 in given intervals using CAST diagram',
          'Differentiation — first principles (limit of (f(x+h)−f(x))/h as h→0); differentiation of xⁿ (including negative and fractional n); sums, differences, constant multiples; finding gradient of tangent at a point; equations of tangents and normals; stationary points (dy/dx = 0; classify using d²y/dx² or sign test); increasing/decreasing functions; second derivative d²y/dx²',
          'Integration — indefinite integration as reverse of differentiation; ∫xⁿ dx = xⁿ⁺¹/(n+1) + c (n ≠ −1); constant of integration; finding equations of curves given gradient function and a point',
        ],
        forbiddenTopics: [
          'Chain rule, product rule, quotient rule — P2',
          'Differentiation of eˣ, ln x, sin x, cos x — P2',
          'Definite integrals and areas — P2',
          'Binomial expansion (a+bx)ⁿ — P2',
          'Sequences and series (AP and GP) — P2',
          'Exponentials and logarithms — P2',
          'Circle equations — P2',
          'Proof by deduction/contradiction/induction — P2/P4',
          'Partial fractions — P2/P3',
          'Vectors — P4',
          'Complex numbers — Further Maths',
          'Differential equations — P3',
        ],
        requiredKeywords: [
          'surds', 'rationalise', 'completing the square', 'discriminant',
          'factor theorem', 'remainder theorem', 'polynomial division',
          'gradient', 'perpendicular', 'midpoint',
          'radian', 'arc length', 'sector area', 'CAST diagram',
          'first principles', 'stationary point', 'increasing', 'decreasing',
          'second derivative', 'indefinite integration', 'constant of integration',
        ],
      },

      p2: {
        code: 'WMA12',
        title: 'Pure Mathematics 2',
        allowedTopics: [
          'Proof — proof by deduction (logical argument from given assumptions); proof by exhaustion (checking all cases); disproof by counterexample (one example that contradicts statement)',
          'Partial fractions — distinct linear factors: A/(x+a) + B/(x+b); repeated linear factors: A/(x+a) + B/(x+a)²; quadratic factor: A/(x+a) + (Bx+C)/(ax²+bx+c); using partial fractions in integration',
          'Modulus function — |x| = x for x ≥ 0; |x| = −x for x < 0; graph of y = |f(x)|; solving equations |f(x)| = a and |f(x)| = |g(x)| by considering cases',
          'Circle equation — (x−a)² + (y−b)² = r² with centre (a,b) and radius r; expanding to x²+y²+2gx+2fy+c = 0 (centre (−g,−f), radius √(g²+f²−c)); conditions for line-circle intersection (use substitution → discriminant); tangent perpendicular to radius at point of contact; chord midpoint has perpendicular bisector through centre',
          'Arithmetic sequences — nth term = a+(n−1)d; sum Sn = n/2(2a+(n−1)d) = n/2(a+l); sigma notation',
          'Geometric sequences — nth term = arⁿ⁻¹; sum Sn = a(1−rⁿ)/(1−r); sum to infinity S∞ = a/(1−r) for |r| < 1 only; convergent vs divergent; applications in compound interest and decay',
          'Binomial expansion — (a+b)ⁿ for positive integer n: using Pascal\'s triangle or ⁿCr = n!/(r!(n−r)!); (1+x)ⁿ for any rational n: 1 + nx + n(n−1)/2! x² + ... valid for |x| < 1; (a+bx)ⁿ: rewrite as aⁿ(1+bx/a)ⁿ first; finding valid range; approximations',
          'Exponential function y = eˣ — gradient = eˣ (unique property); y = aˣ; laws of logarithms: log(xy) = logx + logy; log(x/y) = logx − logy; log(xⁿ) = nlogx; log 1 = 0; logₐ a = 1; change of base logₐ b = logb/loga; natural log ln x = log_e x; solving aˣ = b using logs; exponential growth and decay; graphs of y = eˣ and y = ln x as reflections in y = x',
          'Linearising data — for y = axⁿ: take log → log y = log a + n log x (linear, gradient n, intercept log a); for y = abˣ: take ln → ln y = ln a + x ln b (linear, gradient ln b, intercept ln a)',
          'Trigonometry identities — sin²θ + cos²θ ≡ 1; tanθ ≡ sinθ/cosθ; 1+tan²θ ≡ sec²θ; 1+cot²θ ≡ cosec²θ; definitions of cosec, sec, cot (reciprocals); solving equations using identities',
          'Differentiation — chain rule dy/dx = dy/du × du/dx; product rule d/dx(uv) = u(dv/dx) + v(du/dx); quotient rule d/dx(u/v) = (v(du/dx)−u(dv/dx))/v²; differentiation of eˣ, eᵏˣ, ln x, sin x, cos x, tan x; connected rates of change using chain rule',
          'Integration — definite integrals ∫ᵃᵇ f(x) dx; area under curve (care: area below x-axis is negative); area between curve and x-axis; area between two curves; integration of eˣ, 1/x (→ ln|x|+c), sin x, cos x; integration by substitution (change variable, substitute, integrate, substitute back); trapezium rule: ≈ h/2 [y₀ + yn + 2(y₁+y₂+...+yn₋₁)] where h = (b−a)/n',
          'Numerical solution of equations — locating roots by sign change (f(a) and f(b) have opposite signs); fixed-point iteration xn+1 = g(xn) — convergence (|g\'(x)| < 1 near root); Newton-Raphson xn+1 = xn − f(xn)/f\'(xn); cobweb and staircase diagrams',
        ],
        forbiddenTopics: [
          'Implicit differentiation — P3',
          'Parametric differentiation — P3',
          'Integration by parts — P3',
          'Integration using partial fractions (beyond basic) — P3',
          'Vectors — P4',
          'Complex numbers — Further Maths',
          'Differential equations — P3',
          'Compound angle formulae — P3',
          'P1 content should be assumed — do not repeat basic differentiation/integration rules',
        ],
        requiredKeywords: [
          'proof by deduction', 'counterexample', 'partial fractions',
          'modulus function', 'circle equation', 'tangent perpendicular to radius',
          'arithmetic progression', 'geometric progression', 'sum to infinity', 'convergent',
          'binomial expansion', 'ⁿCr', 'valid for |x| < 1',
          'natural logarithm', 'ln', 'exponential growth', 'linearising',
          'chain rule', 'product rule', 'quotient rule',
          'definite integral', 'area under curve', 'integration by substitution',
          'trapezium rule', 'Newton-Raphson', 'sign change',
        ],
      },

      p3: {
        code: 'WMA13',
        title: 'Pure Mathematics 3',
        allowedTopics: [
          'Further partial fractions — repeated factors and irreducible quadratic factors in denominator; using in integration',
          'Modulus function — further solving of |f(x)| = g(x) type; sketching y = |f(x)| and y = f(|x|)',
          'Functions — domain and range; composite fg(x); inverse f⁻¹(x) (exists only for one-to-one functions; restrict domain if necessary); graph of y = f⁻¹(x) as reflection in y = x; exponential and logarithmic inverses',
          'Trigonometry — compound angle formulae: sin(A±B) = sinA cosB ± cosA sinB; cos(A±B) = cosA cosB ∓ sinA sinB; tan(A±B) = (tanA±tanB)/(1∓tanA tanB); double angle formulae: sin2A = 2sinA cosA; cos2A = cos²A−sin²A = 1−2sin²A = 2cos²A−1; tan2A = 2tanA/(1−tan²A); R sin(θ+α) form (R = √(a²+b²), tanα = b/a): max/min values, solving equations; small angle approximations (θ in radians): sinθ ≈ θ; tanθ ≈ θ; cosθ ≈ 1−θ²/2; inverse trig functions arcsin (domain [−1,1], range [−π/2,π/2]), arccos (domain [−1,1], range [0,π]), arctan (domain ℝ, range (−π/2,π/2))',
          'Differentiation — implicit differentiation (d/dx of y² = 2y dy/dx; d/dx of y³ = 3y² dy/dx etc.); differentiation of inverse trig: d/dx(arcsin x) = 1/√(1−x²); d/dx(arccos x) = −1/√(1−x²); d/dx(arctan x) = 1/(1+x²); parametric differentiation: dy/dx = (dy/dt)/(dx/dt); second derivatives of implicit and parametric; connected rates of change',
          'Integration — integration by parts: ∫u(dv/dx)dx = uv − ∫v(du/dx)dx; LATE rule for choosing u; repeated integration by parts; integration of 1/(a²+x²) = (1/a)arctan(x/a)+c; integration of 1/√(a²−x²) = arcsin(x/a)+c; complex substitutions; volumes of revolution V = π∫y² dx (about x-axis); V = π∫x² dy (about y-axis)',
          'Numerical methods — Newton-Raphson further applications; iterative methods; convergence analysis using |g\'(x)|',
          'Differential equations — forming first-order separable DEs from rates of change context; separating variables: ∫f(y) dy = ∫g(x) dx; general solution (includes constant C); particular solution (using initial conditions to find C); interpreting in context; exponential growth/decay d/dt(N) = kN → N = N₀eᵏᵗ',
          'Vectors in 3D — column vector and ijk notation; magnitude |v| = √(x²+y²+z²); unit vector â = a/|a|; position vectors; scalar (dot) product a·b = a₁b₁+a₂b₂+a₃b₃ = |a||b|cosθ; angle between two vectors; perpendicularity condition a·b = 0; equation of line: vector form r = a+tb; parametric form; Cartesian form; intersection of two lines; skew lines (not parallel, no intersection); angle between lines; shortest distance from point to line',
          'Complex numbers — z = a+bi; i² = −1; Argand diagram (x = real, y = imaginary); modulus |z| = √(a²+b²); argument arg(z) = arctan(b/a) (in correct quadrant); modulus-argument form z = r(cosθ+i sinθ) = re^(iθ); complex conjugate z* = a−bi; multiplication: multiply moduli, add arguments; division: divide moduli, subtract arguments; roots of polynomial equations: complex roots occur in conjugate pairs for polynomials with real coefficients; loci in Argand diagram: |z−a| = r (circle centre a radius r); arg(z−a) = θ (half-line from a at angle θ); |z−a| = |z−b| (perpendicular bisector of line segment ab)',
        ],
        forbiddenTopics: [
          'P1 and P2 content should be assumed knowledge — do not repeat',
          'Vectors cross product — Further Maths',
          'Planes in 3D — Further Maths',
          'Hyperbolic functions — Further Maths',
          'Maclaurin series — Further Maths',
          'Second-order differential equations — Further Maths',
        ],
        requiredKeywords: [
          'compound angle', 'double angle', 'R sin(θ+α)', 'small angle approximation',
          'arcsin', 'arccos', 'arctan',
          'implicit differentiation', 'parametric differentiation',
          'integration by parts', 'LATE rule', 'volume of revolution',
          'separable differential equation', 'general solution', 'particular solution',
          'dot product', 'scalar product', 'skew lines', 'vector equation of line',
          'complex number', 'Argand diagram', 'modulus', 'argument', 'complex conjugate',
          'conjugate pairs', 'locus',
        ],
      },

      p4: {
        code: 'WMA14',
        title: 'Pure Mathematics 4',
        allowedTopics: [
          'Proof by contradiction — assume negation true, derive contradiction, conclude original true; examples: √2 irrational, infinitely many primes',
          'Proof by mathematical induction — basis step (show true for n=1); inductive step (assume true for n=k, prove for n=k+1); conclusion; applied to: series sums, divisibility results, matrices',
          'Binomial expansion for rational n — (1+x)ⁿ = 1 + nx + n(n−1)/2! x² + n(n−1)(n−2)/3! x³ + ... valid for |x| < 1; (a+bx)ⁿ = aⁿ(1+bx/a)ⁿ; finding valid range of x for given expression; partial fractions to aid expansion',
          'Parametric equations — x = f(t), y = g(t); converting to Cartesian by eliminating parameter; gradient dy/dx = (dy/dt)/(dx/dt); equations of tangents and normals using parametric form; area under parametric curve using substitution ∫y(dx/dt)dt',
          'Further differentiation — further implicit differentiation including d²y/dx² for implicit; further parametric including d²y/dx²; further applications of connected rates',
          'Further integration — reduction formulae (introductory level); integration leading to arctan and arcsin forms; ∫1/(a²+x²)dx = (1/a)arctan(x/a)+c; ∫1/√(a²−x²)dx = arcsin(x/a)+c; integration of sec²x = tanx+c; ∫cosec x cot x dx = −cosec x + c; further volumes of revolution; arc length (if in specification version)',
          'Vectors — further 3D vectors from P3 extended: distance from point to line (foot of perpendicular); shortest distance between skew lines; note if planes in 3D are in this unit for your specification version',
          'First-order linear differential equations — using integrating factor method (if in specification version)',
        ],
        forbiddenTopics: [
          'Cross product of vectors — Further Maths',
          'Equations of planes — Further Maths',
          'Complex numbers beyond P3 level — Further Maths',
          'Matrices — Further Maths',
          'Second-order DEs — Further Maths',
        ],
        requiredKeywords: [
          'proof by contradiction', 'proof by induction', 'basis step', 'inductive step',
          'binomial expansion rational n', 'valid for |x| < 1',
          'parametric equations', 'eliminating parameter',
          'reduction formula', 'arctan integral', 'arcsin integral',
          'integrating factor',
        ],
      },

      m1: {
        code: 'WME01',
        title: 'Mechanics 1',
        allowedTopics: [
          'Mathematical models in mechanics — particle (mass concentrated at point); light rod/string (mass negligible); inextensible string (constant length); smooth surface (no friction); rigid body; stating and evaluating assumptions',
          'Vectors in mechanics — representing forces as vectors; i and j unit vectors; resolving into components; adding force vectors; resultant force; magnitude and direction',
          'Kinematics in straight line — s, v, u, a, t; SUVAT equations: v = u+at; s = ut+½at²; v² = u²+2as; s = ½(u+v)t; graphs: velocity-time (area = displacement; gradient = acceleration); distance-time (gradient = velocity)',
          'Non-uniform acceleration — v = ds/dt; a = dv/dt = d²s/dt²; integrating to find s from v; using initial conditions; applying to particle in straight line',
          'Dynamics — Newton\'s 2nd law F = ma; connected particles (Atwood machine; particles on incline connected by string over pulley); tension in string; normal reaction; weight components on incline (mg sinθ parallel; mg cosθ perpendicular)',
          'Friction — F ≤ μR; F = μR at limiting equilibrium or during motion; μ = coefficient; direction opposes motion or tendency of motion',
          'Statics — particle in equilibrium (resultant = 0); resolve in two perpendicular directions; triangle of forces; finding unknown forces',
          'Moments — moment = force × perpendicular distance from pivot; principle of moments: sum clockwise = sum anticlockwise for equilibrium; simple rigid body problems (beam, rod)',
          'Projectiles — resolved into horizontal (constant velocity, no acceleration) and vertical (uniform acceleration g = 9.8 m/s²) components; calculating range, maximum height, time of flight for given launch angle and speed',
        ],
        forbiddenTopics: [
          'Kinematics in 2D using calculus — M2',
          'Centres of mass — M2',
          'Collisions and Newton\'s law of restitution — M2',
          'Elastic strings and energy — M2',
          'SHM — beyond this specification level',
          'Complex statics with couples — M2',
        ],
        requiredKeywords: [
          'particle model', 'inextensible', 'smooth surface',
          'SUVAT', 'Atwood machine', 'connected particles', 'tension',
          'friction coefficient', 'limiting equilibrium',
          'principle of moments', 'resultant',
          'projectile', 'range', 'time of flight',
          'v = ds/dt', 'a = dv/dt',
        ],
      },

      m2: {
        code: 'WME02',
        title: 'Mechanics 2',
        allowedTopics: [
          'Kinematics in 2D — position, velocity, acceleration as vector functions of time; r = xi + yj; differentiating and integrating vector functions; solving problems using initial conditions',
          'Projectiles extended — launch from non-zero height; trajectory equation: y = x tanα − gx²/(2u²cos²α); range on horizontal and inclined planes',
          'Centres of mass — of system of particles: x̄ = Σmᵢxᵢ/Σmᵢ; of lamina by integration: x̄ = ∫x dm/∫dm; standard results: rod (midpoint); rectangle (centroid); triangle (1/3 up from base); semicircle (4r/3π from diameter); sector (2r sinα/3α); cone (h/4 from base); hemisphere (3r/8 from base); composite bodies by treating parts separately and combining; finding if body topples or slides using tilting conditions',
          'Work, energy and power — work done by variable force: W = ∫F ds; elastic strings: T = λx/l (Hooke\'s law); elastic PE = λx²/2l; conservation of energy including elastic PE; power P = Fv; problems with driving force, resistance, and power',
          'Collisions — momentum conservation; Newton\'s law of restitution e = speed of separation/speed of approach; 0 ≤ e ≤ 1; elastic (e = 1) vs inelastic (e < 1) vs perfectly inelastic (e = 0, coalesce); oblique collisions with smooth surface: velocity component perpendicular to surface unchanged; impulse J = mv − mu; impulse-momentum theorem',
          'Rigid body statics — equilibrium: ΣF = 0 and ΣM = 0 about any point; three-force body (concurrent forces); ladder problems (friction at wall and/or floor); beams on multiple supports; determining whether body topples or slides',
        ],
        forbiddenTopics: [
          'M1 basics — assume as prerequisite knowledge',
          'SHM (M3 in some specifications)',
          'Angular momentum',
        ],
        requiredKeywords: [
          'vector position function', 'differentiating vectors',
          'trajectory equation', 'range on inclined plane',
          'centre of mass', 'composite body', 'toppling condition',
          'elastic string', 'Hooke\'s law', 'elastic PE', 'λx/l',
          'Newton\'s law of restitution', 'coefficient of restitution', 'oblique collision',
          'three-force body', 'concurrent', 'ladder problem',
        ],
      },

      s1: {
        code: 'WST01',
        title: 'Statistics 1',
        allowedTopics: [
          'Representation of data — stem-and-leaf diagrams; box plots (minimum, Q1, median, Q3, maximum; outliers: below Q1−1.5×IQR or above Q3+1.5×IQR); histograms (frequency density = frequency/class width; y-axis must be frequency density not frequency for unequal class widths); cumulative frequency curves; choosing appropriate diagram for different data types',
          'Measures of location — mean from ungrouped and grouped data (using midpoints): x̄ = Σfx/Σf; median: middle value or from cumulative frequency; mode and modal class; comparing distributions using average',
          'Measures of spread — range; IQR = Q3 − Q1; variance σ² = Σ(x−x̄)²/n = Σx²/n − (x̄)²; standard deviation σ = √variance; effect of coding y = (x−a)/b: ȳ = (x̄−a)/b; σy = σx/b (shift a does not affect SD; scale b multiplies SD)',
          'Correlation and regression — scatter diagrams; product-moment correlation coefficient r (formula; interpretation: r = 1 perfect positive, r = −1 perfect negative, r = 0 no linear correlation; correlation does NOT imply causation); Spearman\'s rank correlation rₛ = 1 − 6Σd²/n(n²−1); regression line y on x: ŷ = a + bx where b = Sxy/Sxx = Σxy−nx̄ȳ / Σx²−nx̄²; a = ȳ − bx̄; use of regression line for prediction; interpolation vs extrapolation; residuals',
          'Probability — events, outcomes, sample space; P(A) ∈ [0,1]; P(A∪B) = P(A)+P(B)−P(A∩B); mutually exclusive events P(A∩B) = 0; independent events P(A∩B) = P(A)×P(B); conditional probability P(A|B) = P(A∩B)/P(B); Venn diagrams; tree diagrams (with and without replacement)',
          'Discrete random variables — probability distribution table; ΣP(X=x) = 1; E(X) = Σ xP(X=x); E(X²) = Σ x²P(X=x); Var(X) = E(X²) − [E(X)]²; E(aX+b) = aE(X)+b; Var(aX+b) = a²Var(X)',
          'Binomial distribution — X~B(n,p); conditions: fixed n independent trials, constant probability p of success, binary outcome; P(X=r) = ⁿCr pʳ(1−p)ⁿ⁻ʳ; mean np; variance np(1−p); using tables or calculator; cumulative probabilities',
          'Normal distribution — X~N(μ,σ²); symmetric bell curve; standardising Z = (X−μ)/σ ~ N(0,1); P(Z < z) from tables; finding probabilities by standardising; inverse normal: finding x given probability; finding μ or σ using standardisation equation',
          'Normal approximation to binomial — conditions: n large (n > 50), p close to 0.5; X~B(n,p) ≈ Y~N(np, np(1−p)); continuity correction: P(X≤a) → P(Y≤a+0.5); P(X≥a) → P(Y≥a−0.5); P(X=a) → P(a−0.5≤Y≤a+0.5)',
        ],
        forbiddenTopics: [
          'Poisson distribution — S2 only',
          'Continuous random variables (pdf, cdf) — S2 only',
          'Hypothesis testing — S2 only',
          'Sampling distributions (central limit theorem) — S2 only',
          'Confidence intervals — S2 only',
          'Chi-squared test — not in this specification',
        ],
        requiredKeywords: [
          'frequency density', 'IQR', 'standard deviation', 'variance', 'outlier',
          'coding', 'shift and scale effect',
          'product-moment correlation', 'Spearman\'s rank', 'regression line',
          'interpolation', 'extrapolation', 'residual',
          'conditional probability', 'independent events', 'mutually exclusive',
          'discrete random variable', 'E(X)', 'Var(X)',
          'B(n,p)', 'binomial conditions',
          'N(μ,σ²)', 'standardising', 'Z-score', 'continuity correction',
        ],
      },

      s2: {
        code: 'WST02',
        title: 'Statistics 2',
        allowedTopics: [
          'Binomial distribution further — complex calculations; binomial approximation by Poisson: conditions n large (>50), p small (<0.1), λ = np ≤ 10',
          'Poisson distribution — X~Po(λ); P(X=r) = e^(−λ) × λʳ/r!; mean = variance = λ; conditions: events occur randomly, independently, at constant average rate; additive property: X₁~Po(λ₁) and X₂~Po(λ₂) independent → X₁+X₂~Po(λ₁+λ₂); using Poisson tables; normal approximation to Poisson: if λ large (>15), X~Po(λ) ≈ N(λ,λ); continuity correction',
          'Continuous random variables — probability density function f(x): P(a≤X≤b) = ∫ᵃᵇf(x)dx; conditions: f(x) ≥ 0 for all x and ∫₋∞^∞f(x)dx = 1; cumulative distribution function F(x) = P(X≤x) = ∫₋∞ˣf(t)dt; F\'(x) = f(x); E(X) = ∫xf(x)dx; E(X²) = ∫x²f(x)dx; Var(X) = E(X²) − [E(X)]²; mode (maximum of f(x)); median (F(median) = 0.5; solve ∫f(x)dx = 0.5)',
          'Uniform/rectangular distribution — X~U(a,b): f(x) = 1/(b−a) for a≤x≤b, 0 otherwise; E(X) = (a+b)/2; Var(X) = (b−a)²/12',
          'Sampling — population vs sample; sampling frame; random sampling; sampling distribution of sample mean X̄; E(X̄) = μ; Var(X̄) = σ²/n; standard error SE = σ/√n; central limit theorem: for large n, X̄ approximately N(μ, σ²/n) regardless of parent distribution shape',
          'Hypothesis tests — framework: H₀ (null hypothesis, assumed true), H₁ (alternative, one-tailed or two-tailed), significance level α (probability of Type I error), test statistic, critical region, p-value, conclusion in context; test population mean with known σ: Z = (x̄−μ₀)/(σ/√n) ~ N(0,1); test population proportion: use binomial directly (find P(X ≥ observed or ≤ observed) and compare to α); test Poisson mean: find P(X ≥ observed) and compare to α',
          'Type I and Type II errors — Type I: reject H₀ when H₀ is true; P(Type I) = significance level; Type II: fail to reject H₀ when H₀ is false; power = 1 − P(Type II); calculating P(Type II) for given alternative parameter',
        ],
        forbiddenTopics: [
          'S1 content — assumed knowledge, do not repeat',
          'Chi-squared test — not in this specification level',
          'Analysis of variance (ANOVA) — not in specification',
          'Regression and correlation significance tests — not in S2',
          'Two-sample tests — not in specification',
        ],
        requiredKeywords: [
          'Poisson distribution', 'Po(λ)', 'conditions for Poisson',
          'additive property Poisson',
          'probability density function', 'f(x)', 'cumulative distribution function', 'F(x)',
          'median from integral', 'mode from f(x)',
          'uniform distribution', 'U(a,b)',
          'sampling distribution', 'central limit theorem', 'standard error',
          'null hypothesis', 'alternative hypothesis', 'significance level', 'critical region',
          'p-value', 'Type I error', 'Type II error', 'power of test',
          'Z-test', 'conclusion in context',
        ],
      },
    },
  },


  // ===========================================================
  // CIE IGCSE
  // Chemistry: 0620 (12 topics), Biology: 0610 (21 topics)
  // Physics: 0625, Maths: 0580
  // ===========================================================

  cie_igcse: {

    chemistry: {

      topic1: {
        code: '0620-T1',
        title: 'States of Matter',
        allowedTopics: [
          'Three states of matter — solid (particles closely packed in fixed positions, vibrate about mean position, strong forces of attraction, definite shape and volume); liquid (particles closely packed but randomly arranged, slide past each other, weaker forces, no fixed shape but definite volume); gas (particles far apart, random arrangement, rapid random movement, negligible forces, no fixed shape or volume)',
          'Changes of state — melting (solid → liquid), freezing (liquid → solid), boiling/evaporation (liquid → gas), condensation (gas → liquid), sublimation (solid → gas); energy input required for melting and boiling; energy released on freezing and condensation',
          'Heating and cooling curves — temperature vs time; flat sections during change of state (temperature constant while bonds/interactions are being broken/formed)',
          'Kinetic particle theory — particles in constant random motion; higher temperature = greater average kinetic energy; explains properties of each state',
          'Diffusion — evidence for particle movement; gases diffuse faster than liquids; heavier molecules diffuse slower (lower average speed at same temperature); NH₃ and HCl ring experiment (NH₄Cl white ring forms closer to HCl end because NH₃ lighter/faster)',
        ],
        forbiddenTopics: [
          'Atomic structure (protons, neutrons, electrons) — Topic 2',
          'Ionic and covalent bonding — Topic 2',
          'Solubility and solutions — Topic 2/3',
          'Rate equations — A Level only',
        ],
        requiredKeywords: [
          'closely packed', 'vibrate', 'fixed positions', 'random motion',
          'melting', 'boiling', 'condensation', 'sublimation',
          'kinetic energy', 'diffusion', 'NH₃', 'HCl',
        ],
      },

      topic2: {
        code: '0620-T2',
        title: 'Atoms, Elements and Compounds',
        allowedTopics: [
          'Atomic structure — nucleus contains protons and neutrons; electrons in shells around nucleus',
          'Proton/atomic number Z; mass/nucleon number A; isotopes (same Z, different A, same chemical properties, different physical properties); relative atomic mass as weighted average',
          'Electronic structure — shells/energy levels (2, 8, 8...); notation e.g. 2,8,1; relating electronic configuration to group and period in periodic table',
          'Elements, compounds and mixtures — element: one type of atom; compound: two or more elements chemically bonded in fixed ratio; mixture: physically combined, can be separated',
          'Pure substances — fixed melting and boiling points; impure substances/mixtures melt or boil over a range of temperatures',
          'Ionic bonding — electron transfer from metal to non-metal; formation of positive metal ions and negative non-metal ions; dot-and-cross diagrams showing electron transfer; giant ionic lattice; properties: high MP, conducts when molten or dissolved, brittle, soluble in water',
          'Covalent bonding — electron sharing; dot-and-cross diagrams for H₂, Cl₂, HCl, H₂O, NH₃, CH₄, CO₂; simple molecular structure: low BP, does not conduct electricity; giant covalent structures (diamond, graphite, SiO₂): high MP, hard, diamond non-conductor, graphite conductor',
          'Metallic bonding — sea of delocalised electrons; properties: conducts electricity and heat, malleable, ductile, high MP',
          'Writing formulae — using valency and ionic charges; balancing chemical equations; state symbols (s), (l), (g), (aq)',
        ],
        forbiddenTopics: [
          's, p, d sub-shells, Aufbau, Hund\'s rule — A Level only',
          'VSEPR theory and bond angles — A Level only',
          'Stoichiometric calculations (moles) — Topic 3',
          'Electrochemistry — Topic 4',
        ],
        requiredKeywords: [
          'proton number', 'nucleon number', 'isotope', 'electronic configuration',
          'ionic bonding', 'electron transfer', 'giant ionic lattice',
          'covalent bonding', 'electron sharing', 'simple molecular',
          'giant covalent', 'metallic bonding', 'delocalised electrons',
          'state symbols',
        ],
      },

      topic3: {
        code: '0620-T3',
        title: 'Stoichiometry',
        allowedTopics: [
          'Writing formulae from valency and ionic charges',
          'Balancing chemical equations (full equations and ionic equations); spectator ions',
          'State symbols (s), (l), (g), (aq)',
          'Mole concept — n = m/M; Avogadro constant L = 6.02×10²³ mol⁻¹',
          'Molar volume of gas at RTP = 24 dm³ mol⁻¹ (24,000 cm³ mol⁻¹)',
          'Concentration — c = n/V; mol dm⁻³',
          'Calculations using reacting masses — using molar ratios from balanced equations',
          'Calculations involving volumes of gases — at RTP using molar volume',
          'Calculations involving volumes of solutions — using concentration and volume',
          'Percentage yield — % yield = (actual yield/theoretical yield) × 100',
          'Limiting reagent — the reagent that is completely used up; determines maximum product',
          'Titration calculations — using concentration × volume to find moles; finding unknown concentration or volume',
        ],
        forbiddenTopics: [
          'Ideal gas equation pV = nRT — A Level only',
          'Empirical formula from combustion data — uses moles but is part of this topic; may be included',
          'Rate equations — A Level only',
          'Equilibrium constants — A Level only',
        ],
        requiredKeywords: [
          'mole', 'molar mass', 'Avogadro constant', 'molar volume',
          'limiting reagent', 'percentage yield', 'concentration',
          'titration', 'spectator ions', 'ionic equation',
        ],
      },

      topic4: {
        code: '0620-T4',
        title: 'Electrochemistry',
        allowedTopics: [
          'Electrolysis — electrolyte (ionic compound molten or dissolved); inert electrodes (graphite or platinum); anode (positive electrode, oxidation, anions discharge); cathode (negative electrode, reduction, cations discharge)',
          'Products from molten NaCl — Na at cathode; Cl₂ at anode',
          'Products from aqueous NaCl — H₂ at cathode (H⁺ preferred over Na⁺); Cl₂ at anode if concentrated (Cl⁻ preferred); OH⁻ and Na⁺ remain → NaOH formed; O₂ at anode if dilute (OH⁻ preferred)',
          'Products from aqueous CuSO₄ with copper electrodes — Cu deposited at cathode; Cu dissolves at anode (purification of copper); mass of cathode increases, anode decreases',
          'Products from dilute H₂SO₄ — H₂ at cathode; O₂ at anode',
          'Electroplating — object as cathode; coating metal as anode; solution of coating metal salt as electrolyte; purpose: decoration, corrosion prevention',
          'Hydrogen-oxygen fuel cell — H₂ at anode → 2H⁺ + 2e⁻; O₂ at cathode + 4H⁺ + 4e⁻ → 2H₂O; overall: 2H₂ + O₂ → 2H₂O; advantages: no combustion, water only product, high efficiency',
        ],
        forbiddenTopics: [
          'Nernst equation — A Level only',
          'Standard electrode potentials — A Level only',
          'Born-Haber cycles — A Level only',
          'Faraday\'s laws quantitative (m = ItM/nF) — A Level only',
        ],
        requiredKeywords: [
          'electrolysis', 'electrolyte', 'anode', 'cathode', 'inert electrode',
          'oxidation at anode', 'reduction at cathode',
          'selective discharge', 'concentrated vs dilute',
          'copper purification', 'electroplating',
          'fuel cell', 'H₂', 'O₂',
        ],
      },

      topic5: {
        code: '0620-T5',
        title: 'Chemical Energetics',
        allowedTopics: [
          'Exothermic reactions — energy released to surroundings; temperature rises; ΔH negative; examples: combustion, neutralisation, reaction of metals with acid, respiration',
          'Endothermic reactions — energy absorbed from surroundings; temperature falls; ΔH positive; examples: thermal decomposition, dissolving ammonium nitrate, photosynthesis',
          'Activation energy Ea — minimum energy needed for reaction to occur; conceptual understanding; shown on energy profile diagram',
          'Energy profile diagrams — y-axis: energy; x-axis: reaction progress; exothermic: products lower than reactants; endothermic: products higher; Ea shown as peak; catalyst shown as alternative lower-energy pathway',
          'Bond breaking endothermic; bond making exothermic; ΔH = Σ(bond energies broken) − Σ(bond energies formed)',
          'Simple bond enthalpy calculations using given bond energy values',
        ],
        forbiddenTopics: [
          'Hess\'s law cycle calculations using multiple reactions — A Level (only simple ΔH here)',
          'Born-Haber cycle — A Level only',
          'Entropy ΔS and Gibbs free energy ΔG — A Level only',
          'Lattice enthalpy — A Level only',
        ],
        requiredKeywords: [
          'exothermic', 'endothermic', 'ΔH negative', 'ΔH positive',
          'activation energy', 'energy profile diagram', 'catalyst lowers Ea',
          'bond breaking endothermic', 'bond making exothermic',
          'bond enthalpy',
        ],
      },

      topic6: {
        code: '0620-T6',
        title: 'Chemical Reactions (Rates and Equilibrium)',
        allowedTopics: [
          'Rate of reaction — change in amount/concentration of reactant or product per unit time; measuring by gas syringe, mass balance, colour change, precipitation (cross-disappears method)',
          'Factors affecting rate — concentration (more frequent collisions); temperature (more energetic particles, more exceed Ea); surface area (more collisions at surface); catalyst (provides lower energy pathway, lowers Ea)',
          'Collision theory (qualitative) — particles must collide with sufficient energy (≥ Ea) and correct orientation; explains all four factors',
          'Concentration-time graphs — steeper gradient = faster rate; qualitative interpretation',
          'Reversible reactions — symbol ⇌; meaning (can go in both directions); examples: hydrated/anhydrous copper sulfate, ammonium chloride decomposition',
          'Dynamic equilibrium — closed system; forward and reverse reaction rates equal; concentrations constant (not necessarily equal)',
          'Le Chatelier\'s principle (qualitative) — if equilibrium disturbed, system shifts to oppose change: concentration increase → shifts away from added reactant; pressure increase → shifts toward fewer moles of gas; temperature increase → shifts toward endothermic side; catalyst → does NOT shift position, only speeds attainment',
          'Haber process — N₂ + 3H₂ ⇌ 2NH₃; ΔH = −92 kJ mol⁻¹; conditions: 450°C (compromise — too hot shifts equilibrium left, too cold slow rate); 200 atm (high pressure favours fewer moles of gas = right); iron catalyst (speeds up without shifting equilibrium); economic considerations',
          'Contact process — 2SO₂ + O₂ ⇌ 2SO₃; V₂O₅ catalyst; 450°C; 1–2 atm',
        ],
        forbiddenTopics: [
          'Rate equations rate = k[A]^m — A Level only',
          'Order of reaction, rate constant k — A Level only',
          'Arrhenius equation — A Level only',
          'Equilibrium constants Kc, Kp — A Level only',
          'Maxwell-Boltzmann distribution — A Level (only qualitative collision theory here)',
        ],
        requiredKeywords: [
          'rate of reaction', 'collision theory', 'activation energy', 'catalyst',
          'dynamic equilibrium', 'Le Chatelier\'s principle',
          'Haber process', 'iron catalyst', '450°C', '200 atm',
          'Contact process', 'V₂O₅',
          'concentration', 'temperature', 'surface area',
        ],
      },

      topic7: {
        code: '0620-T7',
        title: 'Acids, Bases and Salts',
        allowedTopics: [
          'pH scale — 0-14; acidic pH < 7; neutral pH = 7; alkaline pH > 7',
          'Indicators — litmus (red in acid, blue in alkali); phenolphthalein (colourless in acid, pink in alkali); universal indicator (range of colours); methyl orange',
          'Strong acids — fully dissociated: HCl, H₂SO₄, HNO₃',
          'Weak acids — partially dissociated: ethanoic acid CH₃COOH; lower [H⁺] than strong acid of same concentration',
          'Neutralisation — acid + alkali → salt + water',
          'Reactions of dilute acids with metals — acid + reactive metal → salt + H₂ (Mg, Zn, Fe react; Cu does not)',
          'Reactions with bases/alkalis — acid + base → salt + water; acid + alkali → salt + water',
          'Reactions with carbonates — acid + carbonate → salt + water + CO₂; acid + hydrogencarbonate → salt + water + CO₂',
          'Preparing soluble salts — from excess insoluble base/carbonate/metal + acid → filter → evaporate; from acid + alkali by titration then evaporate',
          'Preparing insoluble salts — precipitation: mix two solutions containing the required ions → filter → wash → dry',
          'Types of oxides — metal oxides: basic (react with acids to form salt + water); non-metal oxides: acidic; amphoteric: Al₂O₃ and ZnO (react with both acids and alkalis)',
        ],
        forbiddenTopics: [
          'Ka, Kb, acid dissociation constants — A Level only',
          'Buffer solutions — A Level only',
          'Henderson-Hasselbalch equation — A Level only',
          'Kw = [H⁺][OH⁻] — A Level only',
        ],
        requiredKeywords: [
          'pH scale', 'strong acid', 'weak acid', 'neutralisation',
          'salt', 'precipitation', 'insoluble salt',
          'amphoteric', 'filtration', 'crystallisation',
        ],
      },

      topic8: {
        code: '0620-T8',
        title: 'The Periodic Table',
        allowedTopics: [
          'History — Mendeleev arranged by atomic mass with gaps for undiscovered elements; modern table arranged by atomic/proton number',
          'Periods (horizontal rows) and groups (vertical columns); metals on left, non-metals on right',
          'Trends in period 3 — atomic radius decreases across period (increasing nuclear charge); ionisation energy generally increases across period (dips at Group 3 and 6); direction only, not calculation',
          'Group 1 alkali metals (Li, Na, K) — react with water: 2M + 2H₂O → 2MOH + H₂; vigour increases Li<Na<K; stored in oil; reactions with O₂; reactions with Cl₂; reactivity increases down group (lower IE₁); flame tests: Li red, Na yellow/orange, K lilac',
          'Group 17/7 halogens (F₂, Cl₂, Br₂, I₂) — state at room temp and colour; decreasing reactivity down group; displacement reactions (Cl₂ displaces Br⁻ and I⁻; Br₂ displaces I⁻ only); uses: Cl₂ in water treatment and bleach',
          'Group 0 noble gases — full outer shell; chemically inert; uses: Ar in light bulbs (inert atmosphere), He in balloons (less dense than air), Ne in signs',
          'Transition metals — position in periodic table (d-block); high density, high melting point, hard; variable oxidation states; form coloured compounds; catalytic activity (Fe in Haber, V₂O₅ in Contact, MnO₂, Pt in catalytic converters); comparison with Group 1 (less reactive, higher density, higher MP)',
        ],
        forbiddenTopics: [
          'd-block orbital filling, crystal field theory — A Level only',
          'Complex ion formation, stability constants — A Level only',
          'Quantitative IE calculations, Born-Haber — A Level only',
        ],
        requiredKeywords: [
          'atomic radius', 'ionisation energy', 'periodic trends',
          'alkali metals', 'reactivity increases down group',
          'halogens', 'displacement reactions', 'decreasing reactivity',
          'noble gases', 'inert', 'full outer shell',
          'transition metals', 'variable oxidation states', 'coloured compounds',
        ],
      },

      topic9: {
        code: '0620-T9',
        title: 'Metals',
        allowedTopics: [
          'Reactivity series — K > Na > Ca > Mg > Al > Zn > Fe > Ni > Sn > Pb > Cu > Ag > Au > Pt; basis: reactions with water and dilute acid',
          'Displacement reactions — more reactive metal displaces less reactive from solution; evidence: colour change, temperature change, mass change',
          'Extraction of Al — Hall-Héroult electrolysis of molten Al₂O₃ dissolved in cryolite; carbon cannot reduce Al₂O₃; high electricity cost',
          'Extraction of Fe — blast furnace: iron ore (Fe₂O₃) + coke (C) + limestone (CaCO₃); coke burns → CO; CO reduces Fe₂O₃ → Fe; limestone → CaO → removes SiO₂ as slag (CaSiO₃)',
          'Uses of metals — properties justify uses: Al (low density, corrosion resistant → aircraft, overhead cables); Cu (good conductor → wires, plumbing); Fe/steel (strong → construction)',
          'Corrosion/rusting — Fe + O₂ + H₂O → hydrated iron(III) oxide (rust); both O₂ and H₂O required; salt speeds up rusting; rust prevention: painting, galvanising (Zn coating), sacrificial protection (Mg or Zn anode), stainless steel, tin plating',
          'Alloys — mixtures of metals (or metal + non-metal): steel (Fe + C); brass (Cu + Zn); bronze (Cu + Sn); solder (Pb + Sn); why alloys stronger: different sized atoms disrupt regular lattice → harder to dislocate layers',
        ],
        forbiddenTopics: [
          'Standard electrode potentials, Gibbs free energy — A Level only',
          'Quantitative Faraday calculations — A Level only',
        ],
        requiredKeywords: [
          'reactivity series', 'displacement reaction',
          'electrolysis', 'blast furnace', 'coke', 'limestone', 'slag',
          'corrosion', 'rusting', 'sacrificial protection', 'galvanising',
          'alloy', 'different sized atoms', 'dislocate',
        ],
      },

      topic10: {
        code: '0620-T10',
        title: 'Chemistry of the Environment',
        allowedTopics: [
          'Water — tests: anhydrous CuSO₄ turns blue (water present); anhydrous CoCl₂ turns pink; pure water: fixed BP 100°C, fixed FP 0°C; water treatment: sedimentation (remove large particles), filtration (remove smaller particles), chlorination (kills bacteria), fluoridation (prevents tooth decay)',
          'Hard water — temporary hardness (Ca(HCO₃)₂ or Mg(HCO₃)₂): removed by boiling (produces CaCO₃ scale); permanent hardness (CaSO₄): removed by ion exchange or distillation but NOT by boiling',
          'Air composition — approx 78% N₂, 21% O₂, ~0.04% CO₂, noble gases; argon ~1%',
          'Air pollutants — CO (from incomplete combustion): toxic, binds to haemoglobin preferentially, prevents O₂ transport; SO₂ (from S in fossil fuels): acid rain (SO₂ + H₂O → H₂SO₃); NO/NO₂ (from N₂ + O₂ at high temperature in engines): acid rain and smog; CO₂ (from combustion): greenhouse gas; particulates (unburned carbon): lung damage',
          'Greenhouse effect — CO₂, methane (CH₄), water vapour absorb infrared radiation re-emitted from Earth\'s surface; trap heat; global warming consequences: rising sea levels, extreme weather, shifting climate zones, melting ice caps',
          'Acid rain — causes: SO₂ and NO₂ react with water in atmosphere; effects: corrodes limestone/marble buildings/statues, harms aquatic ecosystems (lowers pH), damages forests; solutions: catalytic converters (reduce NOₓ), desulfurisation of flue gases (remove SO₂)',
        ],
        forbiddenTopics: [
          'Standard electrode potentials — A Level only',
          'Detailed atmospheric chemistry mechanisms — A Level level',
        ],
        requiredKeywords: [
          'water treatment', 'hard water', 'temporary hardness', 'permanent hardness',
          'CO toxic', 'SO₂ acid rain', 'CO₂ greenhouse gas',
          'greenhouse effect', 'global warming',
          'catalytic converter', 'desulfurisation',
        ],
      },

      topic11: {
        code: '0620-T11',
        title: 'Organic Chemistry',
        allowedTopics: [
          'Homologous series — same general formula; differ by CH₂; similar chemical properties; trend in physical properties; functional group constant',
          'IUPAC naming — straight-chain alkanes and their derivatives up to C4; prefixes meth/eth/prop/but; functional group suffixes',
          'Structural formulae — full displayed, condensed, skeletal formulae',
          'Alkanes (CₙH₂ₙ₊₂) — saturated; combustion (complete → CO₂ + H₂O; incomplete → CO/C); substitution with halogens under UV (name only, no mechanism required at IGCSE); cracking — thermal and catalytic (name only, no mechanism)',
          'Alkenes (CₙH₂ₙ) — contain C=C double bond; unsaturated; test: bromine water decolourised; addition reactions with H₂, HBr, Br₂, H₂O; Markovnikov\'s rule — name only, no mechanism required; addition polymerisation — drawing repeat unit from monomer',
          'Ethanol (alcohol) — fermentation: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ (yeast, 25-37°C, anaerobic, slow); industrial: hydration of ethene (steam + H₃PO₄ catalyst, 300°C, 60-70 atm, fast but uses non-renewable resource); comparison of methods; uses; combustion; oxidation to ethanoic acid',
          'Carboxylic acids — weak acids; reactions with Na, NaOH, Na₂CO₃ (effervescence distinguishes from alcohols); esterification — naming esters (alkyl alkanoate); uses of esters (perfumes, flavourings, solvents)',
          'Condensation polymers — polyesters from diol + dicarboxylic acid (Terylene from ethane-1,2-diol + benzene-1,4-dicarboxylic acid); polyamides from diamine + dicarboxylic acid (nylon from 1,6-diaminohexane + hexanedioic acid); drawing repeat units; hydrolysis; biodegradability comparison',
        ],
        forbiddenTopics: [
          'Reaction mechanisms with curly arrows — A Level only',
          'Spectroscopy (IR, MS, NMR) — A Level only',
          'Optical isomerism, E/Z isomerism — A Level only',
          'SN1/SN2 mechanisms — A Level only',
        ],
        requiredKeywords: [
          'homologous series', 'saturated', 'unsaturated', 'C=C double bond',
          'addition polymerisation', 'repeat unit',
          'fermentation', 'hydration of ethene', 'yeast',
          'esterification', 'alkyl alkanoate',
          'condensation polymerisation', 'polyester', 'polyamide', 'hydrolysis',
        ],
      },

      topic12: {
        code: '0620-T12',
        title: 'Experimental Techniques and Chemical Analysis',
        allowedTopics: [
          'Chromatography — Rf = distance moved by substance/distance moved by solvent front; paper chromatography for identifying components of mixtures; identifying pure substance vs mixture',
          'Distillation — separates liquids with different boiling points; simple distillation (liquid from soluble solid); fractional distillation (liquids with close BP e.g. crude oil)',
          'Filtration — separates insoluble solid from liquid; residue stays in filter; filtrate passes through',
          'Crystallisation — evaporate solution to saturation; cool to crystallise; filter and dry crystals',
          'Evaporation — removes solvent to leave dissolved solid',
          'Flame tests — Li⁺ red; Na⁺ yellow; K⁺ lilac; Ca²⁺ orange-red; Ba²⁺ pale green',
          'Tests for cations — NH₄⁺: add NaOH → NH₃ produced (pungent smell, turns damp red litmus blue); Cu²⁺: add NaOH → blue precipitate; Fe²⁺: add NaOH → green precipitate; Fe³⁺: add NaOH → brown precipitate; Al³⁺: add NaOH → white precipitate dissolves in excess; Pb²⁺: add NaOH → white precipitate',
          'Tests for anions — Cl⁻: add acidified AgNO₃ → white precipitate (AgCl), soluble in dilute NH₃; Br⁻: add acidified AgNO₃ → cream precipitate (AgBr), soluble in conc NH₃ only; I⁻: add acidified AgNO₃ → yellow precipitate (AgI), insoluble in NH₃; SO₄²⁻: add acidified BaCl₂ (or BaSO₄ with HCl) → white precipitate; CO₃²⁻: add dilute acid → CO₂ (turns limewater milky); NO₃⁻: add NaOH + Al foil → NH₃ gas',
          'Gas tests — H₂: pops with lighted splint; O₂: relights glowing splint; CO₂: turns limewater milky; Cl₂: bleaches damp litmus paper; NH₃: turns damp red litmus blue; HCl: white smoke with NH₃',
        ],
        forbiddenTopics: [
          'NMR, IR, mass spectrometry — A Level only',
          'Gas chromatography — A Level only',
          'TLC (thin layer chromatography) — A Level level',
        ],
        requiredKeywords: [
          'Rf value', 'solvent front', 'chromatography',
          'AgNO₃', 'AgCl white', 'AgBr cream', 'AgI yellow',
          'BaCl₂', 'white precipitate', 'sulfate test',
          'flame test', 'Li red', 'Na yellow', 'K lilac',
          'limewater', 'CO₂ test', 'NH₃ test',
        ],
      },
    },

    biology: {
      // CIE IGCSE Biology 0610 — 21 topics
      // Topics 1-21 follow the verified Cambridge syllabus
      // See document 38 in context for full topic content
      // Key topics listed here with boundaries

      topic1: {
        code: '0610-T1',
        title: 'Characteristics and Classification of Living Organisms',
        allowedTopics: [
          'Seven characteristics of living organisms — MRS GREN: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition; definition of each',
          'Five kingdoms — Animalia (multicellular, heterotrophic, no cell wall); Plantae (multicellular, autotrophic, cellulose cell wall, chlorophyll); Fungi (multicellular, saprophytic, chitin cell wall, no chlorophyll); Prokaryotae/Bacteria (unicellular, no nucleus, circular DNA); Protoctista (unicellular, eukaryotic)',
          'Viruses — non-living; not a kingdom; protein coat (capsid) + nucleic acid core (DNA or RNA); much smaller than cells; can only replicate inside host cells',
          'Binomial nomenclature — genus (capitalised) + species (lower case); italicised or underlined; e.g. Homo sapiens',
          'Dichotomous keys — using to identify organisms (answer yes/no questions); constructing simple keys from given characteristics',
          'Vertebrate groups — fish (gills, scales, fins); amphibians (moist skin, lay eggs in water); reptiles (dry scales, lay eggs on land); birds (feathers, wings, beak); mammals (hair/fur, suckle young with milk)',
          'Invertebrate examples — insects, crustaceans, arachnids, molluscs, annelids, echinoderms',
        ],
        forbiddenTopics: [
          'Evolution and natural selection — Topic 18',
          'Cell ultrastructure (organelles) — Topic 2',
          'Genetic basis of variation — Topic 17',
        ],
        requiredKeywords: [
          'MRS GREN', 'five kingdoms', 'binomial nomenclature',
          'dichotomous key', 'vertebrate', 'invertebrate',
          'virus', 'capsid',
        ],
      },

      topic2: {
        code: '0610-T2',
        title: 'Organisation of the Organism',
        allowedTopics: [
          'Cell structure — plant cell: cell wall (cellulose), cell membrane, cytoplasm, nucleus, large central vacuole, chloroplasts, mitochondria; animal cell: cell membrane, cytoplasm, nucleus, mitochondria (no cell wall, no chloroplasts, no large vacuole)',
          'Function of organelles — nucleus (contains DNA, controls cell); cell membrane (controls entry/exit); cytoplasm (site of reactions); mitochondria (site of aerobic respiration); chloroplasts (site of photosynthesis); cell wall (support and shape); vacuole (stores cell sap, maintains turgor)',
          'Light microscopy — compound microscope; magnification = image size/actual size; calculating actual size from scale bar or magnification; units mm → µm (÷1000)',
          'Levels of organisation — cell → tissue (group of cells with same function) → organ (group of tissues with same function) → organ system → organism',
          'Specialised cells — red blood cells (biconcave disc, no nucleus, haemoglobin, large SA for O₂ absorption); sperm (streamlined, acrosome with enzymes, mitochondria for energy, flagellum for movement); ciliated epithelial (cilia to move mucus); root hair cells (long thin extension for maximum surface area); palisade mesophyll (many chloroplasts for photosynthesis); guard cells (change shape to control stomata opening)',
        ],
        forbiddenTopics: [
          'Cell division/mitosis — Topic 4',
          'Membrane transport (facilitated diffusion, active transport) — Topic 3',
          'Electron microscopy detail — A Level level',
          'ER, Golgi, lysosomes in detail — A Level level',
        ],
        requiredKeywords: [
          'cell wall', 'cell membrane', 'cytoplasm', 'nucleus', 'chloroplast',
          'mitochondria', 'vacuole', 'magnification',
          'tissue', 'organ', 'organ system',
          'red blood cell', 'biconcave', 'root hair cell',
        ],
      },

      topic3: {
        code: '0610-T3',
        title: 'Movement Into and Out of Cells',
        allowedTopics: [
          'Diffusion — passive; net movement of molecules/ions from high concentration to low concentration; factors: concentration gradient (larger = faster), temperature (higher = faster), surface area (larger = faster), diffusion distance (shorter = faster); examples: O₂ into cells, CO₂ out of cells',
          'Osmosis — special case of diffusion; movement of water molecules from region of higher water potential to lower water potential through a selectively permeable membrane; no net movement if water potentials equal',
          'Plant cell osmosis — turgid (excess water → vacuole fills → cell wall prevents further expansion → firm cell); flaccid (water loss → vacuole shrinks → cell loses rigidity); plasmolysis (excessive water loss → cell membrane pulls away from cell wall → protoplast shrinks); incipient plasmolysis (point when plasmolysis just begins)',
          'Animal cell osmosis — crenated (shrinks in concentrated solution → lose water); lysis (bursts in dilute solution → too much water enters)',
          'Osmosis practical — potato cylinders/strips in different concentrations; measuring mass or length change',
          'Active transport — movement of particles against concentration gradient; requires energy from respiration (ATP); requires carrier proteins; examples: mineral ion uptake by root hairs from soil; glucose absorption in small intestine',
          'Comparison — diffusion and osmosis are passive (no energy); active transport requires energy and carrier proteins; diffusion and active transport can move many types of particles; osmosis is only water',
        ],
        forbiddenTopics: [
          'Water potential notation ψs and ψp (psi) — A Level only',
          'Co-transport mechanism (sodium-glucose co-transporter detail) — A Level only',
          'Facilitated diffusion (channel proteins) — implicit in IGCSE but detailed mechanism A Level',
        ],
        requiredKeywords: [
          'concentration gradient', 'passive', 'selectively permeable membrane',
          'water potential', 'osmosis', 'turgid', 'flaccid', 'plasmolysis', 'crenated', 'lysis',
          'active transport', 'against concentration gradient', 'ATP', 'carrier protein',
        ],
      },

      topic4: {
        code: '0610-T4',
        title: 'Biological Molecules',
        allowedTopics: [
          'Carbohydrates — glucose as energy source; starch (energy storage in plants); glycogen (energy storage in animals); cellulose (structural — plant cell walls)',
          'Proteins — made of amino acids; enzymes are proteins; many structural roles',
          'Lipids — made of fatty acids + glycerol; energy storage; insulation; cell membrane component',
          'Food tests — Benedict\'s test: reducing sugars (e.g. glucose, maltose): blue → brick red precipitate on heating; non-reducing sugar test: boil with HCl → neutralise with NaHCO₃ → then Benedict\'s; iodine solution test for starch: orange-brown → blue-black; biuret test for proteins: blue → purple/mauve (NaOH + CuSO₄); emulsion/ethanol test for lipids: add ethanol, shake, add water → milky white emulsion',
          'Balanced diet — carbohydrates (energy), proteins (growth and repair), fats (energy, insulation, hormones), vitamins (A: vision; C: wound healing/immune; D: bone/calcium absorption), minerals (Ca: bones/teeth; Fe: haemoglobin), dietary fibre (prevent constipation), water',
          'Malnutrition — kwashiorkor (protein deficiency: bloated abdomen, muscle wasting); marasmus (energy and protein deficiency: wasted, thin); obesity (excess energy intake); anaemia (iron deficiency)',
        ],
        forbiddenTopics: [
          'Quaternary protein structure — A Level',
          'Bohr effect and haemoglobin cooperative binding detail — A Level',
          'ATP structure and synthesis — A Level',
          'DNA structure and replication — Topic 17 (inheritance) and A Level',
        ],
        requiredKeywords: [
          'Benedict\'s', 'reducing sugar', 'iodine starch test', 'biuret', 'emulsion test',
          'glucose', 'starch', 'glycogen', 'cellulose',
          'amino acids', 'fatty acids', 'glycerol',
          'balanced diet', 'kwashiorkor', 'marasmus',
        ],
      },

      topic5: {
        code: '0610-T5',
        title: 'Enzymes',
        allowedTopics: [
          'Enzymes — biological catalysts; protein in nature; specific to one substrate; speed up metabolic reactions without being used up; lower activation energy',
          'Active site — specific 3D shape; complementary to substrate; enzyme-substrate complex formed; lock-and-key model (basic): fixed shape active site fits specific substrate',
          'Effect of temperature — rate increases with temperature up to optimum; above optimum: shape of active site changes (denatures) → enzyme-substrate complex cannot form → rate falls to zero; denaturation is irreversible',
          'Effect of pH — each enzyme has optimum pH; outside range: bonds holding shape break → active site changes shape → denaturation; e.g. pepsin optimum pH 2; amylase optimum pH 7',
          'Effect of substrate concentration — increasing substrate concentration increases rate (more enzyme-substrate complexes form per unit time) until all active sites occupied (enzymes saturated) → rate levels off (Vmax)',
          'Commercial uses — proteases in biological washing powder (digest protein stains); amylase in food industry (digest starch to sugar); lactase to make lactose-free milk; immobilised enzymes (on beads/membranes): reusable, easy product separation',
        ],
        forbiddenTopics: [
          'Induced fit model — A Level only',
          'Competitive and non-competitive inhibition by mechanism (Km, Vmax analysis) — A Level only',
          'Coenzymes — A Level only',
          'Allosteric regulation — A Level only',
        ],
        requiredKeywords: [
          'biological catalyst', 'active site', 'enzyme-substrate complex',
          'lock-and-key', 'optimum temperature', 'optimum pH',
          'denaturation', 'substrate concentration', 'saturation',
          'immobilised enzymes',
        ],
      },

      topic6: {
        code: '0610-T6',
        title: 'Plant Nutrition (Photosynthesis)',
        allowedTopics: [
          'Photosynthesis equation — 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂; requires light energy; chlorophyll absorbs light',
          'Requirements for photosynthesis — light (energy source; different wavelengths absorbed by chlorophyll); CO₂ (from air through stomata); water (from soil via roots/xylem)',
          'Products — glucose (used in respiration; converted to starch for storage; used to make cellulose, oils, amino acids by combining with mineral ions); O₂ (released as by-product through stomata)',
          'Leaf structure for gas exchange — upper epidermis (transparent, allows light through); palisade mesophyll (many chloroplasts, main photosynthesis site); spongy mesophyll (air spaces for gas exchange); stomata (pores for CO₂/O₂/H₂O exchange); guard cells (control stomata)',
          'Limiting factors — light intensity (more light → more photosynthesis until another factor limits); CO₂ concentration (more CO₂ → more photosynthesis until another factor limits); temperature (increases rate up to optimum, then enzymes denature); graphs showing plateau when limiting factor',
          'Investigating photosynthesis — oxygen bubbles from Elodea (aquatic plant); effect of light intensity; inverse square law (light intensity ∝ 1/d²); leaf disk/pond weed experiments',
          'Variegated leaf experiment — destarch leaf → expose to light → test for starch with iodine; starch found only in green parts → chlorophyll necessary; starch found only in exposed part → light necessary',
        ],
        forbiddenTopics: [
          'Calvin cycle (carbon fixation, RuBP, GP, G3P, RuBisCO) — A Level only',
          'Z-scheme, photosystems I and II — A Level only',
          'Cyclic/non-cyclic photophosphorylation — A Level only',
          'NADPH — A Level only',
          'C4 plants and CAM — A Level only',
        ],
        requiredKeywords: [
          'chlorophyll', 'photosynthesis equation', 'CO₂', 'light energy', 'glucose', 'O₂',
          'limiting factor', 'light intensity', 'stomata', 'guard cells',
          'palisade mesophyll', 'inverse square law',
        ],
      },

      topic7: {
        code: '0610-T7',
        title: 'Human Nutrition',
        allowedTopics: [
          'Digestive system — mouth (salivary amylase: starch → maltose; teeth — incisors/canines/premolars/molars); oesophagus (peristalsis — muscular contractions move food); stomach (pepsin/protease: proteins → polypeptides; HCl — activates pepsin, kills bacteria; mucus — prevents self-digestion); small intestine — duodenum (bile from liver/gallbladder — emulsifies fats into droplets, not enzymatic, alkaline; pancreatic enzymes: amylase/protease/lipase); ileum (further digestion; absorption via villi)',
          'Villi structure — finger-like projections; single cell layer (one cell thick wall); large surface area (microvilli too); capillary network (absorb glucose, amino acids, water, mineral ions → blood); lacteal (absorbs fatty acids, glycerol → lymph)',
          'Absorption — glucose and amino acids → blood → portal vein → liver; fatty acids and glycerol → reform triglycerides → lacteals → lymph → blood',
          'Assimilation — nutrients used by cells (glucose for respiration; amino acids for protein synthesis)',
          'Egestion — removal of indigestible material (fibre) as faeces from anus; different from excretion (removal of metabolic waste)',
          'Deficiency diseases — vitamin C deficiency → scurvy (poor wound healing, bleeding gums); vitamin D deficiency → rickets (soft bones, bow legs in children); iron deficiency → anaemia (low haemoglobin → fatigue, pale)',
        ],
        forbiddenTopics: [
          'Co-transport mechanism for glucose/Na⁺ — A Level only',
          'Cholesterol metabolism — A Level only',
          'Detailed digestive enzyme kinetics — A Level only',
        ],
        requiredKeywords: [
          'peristalsis', 'salivary amylase', 'pepsin', 'HCl', 'bile emulsification',
          'villi', 'microvilli', 'lacteal', 'portal vein',
          'absorption', 'assimilation', 'egestion',
          'scurvy', 'rickets', 'anaemia',
        ],
      },

      topic8: {
        code: '0610-T8',
        title: 'Transport in Plants',
        allowedTopics: [
          'Xylem — transports water and dissolved mineral ions from roots to leaves (and all parts); dead hollow tubes (vessel elements); lignified cell walls; no end walls; unidirectional upward flow; cohesion of water molecules in column',
          'Phloem — transports sucrose and amino acids (organic solutes) from leaves (source) to all parts (sink) — translocation; living cells (sieve tube elements and companion cells); sieve plates; bidirectional',
          'Water uptake — root hair cells (large surface area, thin wall); osmosis across root cortex cells; root hairs in soil → cortex cells → endodermis → xylem',
          'Transpiration — evaporation of water from leaf surfaces mainly through open stomata; driven by concentration gradient; creates tension that pulls water column up; factors affecting rate: temperature (higher → faster), humidity (lower → faster), wind speed (higher → faster), light intensity (higher → stomata open → faster)',
          'Stomata — guard cells control opening (turgid → open; flaccid → close); open in light (guard cells gain K⁺ → take in water by osmosis → become turgid → open); close in dark; role in gas exchange and transpiration',
          'Root hair cells — large surface area for water/mineral uptake; thin wall for fast diffusion; water absorbed by osmosis; mineral ions by active transport',
          'Wilting — when transpiration exceeds water uptake; cells lose turgor; plant droops',
        ],
        forbiddenTopics: [
          'Cohesion-tension theory by name — A Level (students should know water is pulled up but detailed mechanism is A Level)',
          'Apoplast and symplast pathways by name — A Level only',
          'Casparian strip — A Level only',
          'Mass flow hypothesis (phloem) in detail — A Level only',
        ],
        requiredKeywords: [
          'xylem', 'phloem', 'transpiration', 'translocation',
          'root hair', 'osmosis', 'active transport minerals',
          'guard cells', 'turgid', 'flaccid', 'stomata',
          'wilting', 'turgor',
        ],
      },

      topic9: {
        code: '0610-T9',
        title: 'Transport in Animals',
        allowedTopics: [
          'Heart — four chambers: right atrium, right ventricle, left atrium, left ventricle; valves prevent backflow: atrioventricular valves (bicuspid/mitral — left; tricuspid — right), semilunar valves in pulmonary artery and aorta; major vessels: aorta, vena cava, pulmonary artery, pulmonary vein',
          'Cardiac cycle — basic: atria contract (push blood to ventricles) → ventricles contract (push blood to arteries) → heart relaxes; pulse = arterial wall expansion with each heartbeat; blood pressure: systolic/diastolic',
          'Double circulation — pulmonary (right heart → lungs → left heart: oxygenation); systemic (left heart → body → right heart: delivery of O₂); advantages: higher pressure in systemic, separate oxygenation from delivery',
          'Blood components — red blood cells: haemoglobin carries O₂ (oxyhaemoglobin in lungs; haemoglobin + CO₂ transport); biconcave, no nucleus; white blood cells: phagocytes (engulf pathogens) and lymphocytes (produce antibodies); platelets: cell fragments involved in clotting; plasma: liquid (water) carrying dissolved glucose, amino acids, fatty acids, hormones, CO₂, urea, mineral ions, antibodies',
          'Blood vessels — artery: thick muscular and elastic wall, small lumen, high pressure, pulsed flow; vein: valves (prevent backflow), thin wall, wide lumen, low pressure; capillary: one cell thick wall, exchange of substances with cells, very small lumen',
          'Coronary heart disease — blocked coronary arteries; risk factors: diet (saturated fat, high salt), smoking, high blood pressure, physical inactivity, age, genetics',
          'Smoking effects on cardiovascular — nicotine increases heart rate and blood pressure; CO reduces O₂-carrying capacity; increases risk of blood clots',
        ],
        forbiddenTopics: [
          'ECG interpretation in detail — A Level',
          'Bohr shift and haemoglobin oxygen dissociation curve in detail — A Level',
          'Tissue fluid formation (Starling forces) — A Level',
        ],
        requiredKeywords: [
          'bicuspid', 'tricuspid', 'semilunar valve', 'aorta', 'vena cava',
          'pulmonary', 'systemic', 'double circulation',
          'haemoglobin', 'oxyhaemoglobin', 'plasma',
          'artery', 'vein', 'capillary', 'valves',
          'coronary heart disease',
        ],
      },

      topic10: {
        code: '0610-T10',
        title: 'Diseases and Immunity',
        allowedTopics: [
          'Pathogens — bacteria (Salmonella → food poisoning; Mycobacterium tuberculosis → TB); viruses (influenza virus → flu; HIV → AIDS); fungi (Tinea → athlete\'s foot); protozoa (Plasmodium → malaria via Anopheles mosquito vector)',
          'Transmission — droplet inhalation (TB, flu); direct contact; contaminated food and water (cholera, Salmonella); vectors (malaria — mosquito; sleeping sickness — tsetse fly); sexual contact (HIV)',
          'Antibiotics — kill bacteria only; do NOT work against viruses; antibiotic resistance: natural selection of resistant mutants; importance of completing antibiotic course',
          'Vaccination — antigen introduced (weakened/killed pathogen or component) → immune system produces antibodies + memory cells → secondary response much faster and larger if infected; herd immunity',
          'Body defences — skin (barrier, sebum — antibacterial); mucus and cilia (trap pathogens in respiratory tract); stomach acid (kills pathogens in food); white blood cells: phagocytes (engulf and digest pathogens — phagocytosis); lymphocytes (B lymphocytes — produce antibodies; T lymphocytes — cell-mediated)',
          'Antibodies — proteins produced by lymphocytes; specific to one antigen (complementary shape); antibody-antigen complex; agglutination; memory cells remain',
          'Active vs passive immunity — active: body produces own antibodies (natural infection or vaccination); passive: antibodies received (maternal in milk, antitoxin injection); active = longer lasting; passive = immediate but temporary',
        ],
        forbiddenTopics: [
          'T helper/killer cell subtypes and mechanism — A Level',
          'Clonal selection and clonal expansion detail — A Level',
          'Monoclonal antibody production — A Level',
          'HIV mechanism (reverse transcriptase, integrase) — A Level',
        ],
        requiredKeywords: [
          'pathogen', 'bacteria', 'virus', 'vector', 'Plasmodium', 'Anopheles',
          'antibiotic', 'antibiotic resistance', 'natural selection',
          'vaccination', 'memory cells', 'herd immunity',
          'phagocytosis', 'antibody', 'antigen', 'lymphocyte',
          'active immunity', 'passive immunity',
        ],
      },

      topic11: {
        code: '0610-T11',
        title: 'Gas Exchange in Humans',
        allowedTopics: [
          'Lung structure — trachea → bronchi → bronchioles → alveoli; alveolar features: large surface area (millions of alveoli), one cell thick epithelium (short diffusion distance), moist surface (gases dissolve), surrounded by capillary network (maintained concentration gradient)',
          'Ventilation mechanism — inspiration: external intercostal muscles contract → ribs move up and out; diaphragm muscles contract → diaphragm flattens → thorax volume increases → pressure falls below atmospheric → air flows in; expiration: muscles relax → thorax volume decreases → pressure rises above atmospheric → air flows out',
          'Gas exchange at alveoli — O₂ diffuses from alveolar air (higher O₂) into blood (lower O₂); CO₂ diffuses from blood (higher CO₂) into alveolar air (lower CO₂); thin, moist surfaces; short diffusion distance; maintained concentration gradient by ventilation and blood flow',
          'Effects of smoking on lungs — tar: coats alveolar surfaces, paralyses/destroys cilia, contains carcinogens → lung cancer; chronic bronchitis: persistent inflammation and mucus production; emphysema: alveolar walls broken down → reduced surface area → reduced gas exchange → breathlessness; nicotine: causes addiction; CO: reduces O₂-carrying capacity of blood',
        ],
        forbiddenTopics: [
          'Fish gill counter-current mechanism detail — A Level level',
          'Surfactant mechanism — A Level',
          'Type I and type II pneumocytes — A Level',
          'Neural control of breathing rate — A Level',
          'Gas exchange in insects and plants in detail — separate topics',
        ],
        requiredKeywords: [
          'alveoli', 'large surface area', 'one cell thick', 'moist',
          'inspiration', 'expiration', 'diaphragm', 'intercostal muscles',
          'O₂ diffuses into blood', 'CO₂ diffuses out',
          'tar', 'nicotine', 'CO', 'emphysema', 'lung cancer', 'bronchitis',
        ],
      },

      topic12: {
        code: '0610-T12',
        title: 'Respiration',
        allowedTopics: [
          'Aerobic respiration — C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy; occurs in mitochondria; produces maximum ATP; uses O₂',
          'Anaerobic respiration — in animals/muscles: glucose → lactic acid (+ small amount of energy); no O₂ required; less ATP produced; oxygen debt (lactic acid removed when O₂ available again, converted back to glucose or CO₂ + H₂O in liver)',
          'Anaerobic respiration in yeast — glucose → ethanol + CO₂ (+ small amount of energy); used in bread-making (CO₂ makes bread rise) and brewing (ethanol production); NAD regenerated allows glycolysis to continue briefly',
          'Comparison — aerobic: uses O₂, produces much more ATP (~38 per glucose), products CO₂ + H₂O; anaerobic: no O₂ needed, much less ATP (2 per glucose), products lactic acid (animals) or ethanol + CO₂ (yeast)',
          'Uses of energy in the body — active transport (moving molecules against gradient); muscle contraction (movement); maintaining body temperature; protein synthesis; cell division',
        ],
        forbiddenTopics: [
          'Glycolysis steps (G6P, triose phosphate etc.) — A Level only',
          'Link reaction (pyruvate → acetyl-CoA) — A Level only',
          'Krebs cycle steps and intermediates — A Level only',
          'Electron transport chain and oxidative phosphorylation — A Level only',
          'RQ values — A Level only',
          'Chemiosmosis — A Level only',
        ],
        requiredKeywords: [
          'aerobic respiration', 'anaerobic respiration',
          'glucose', 'O₂', 'CO₂', 'H₂O', 'lactic acid', 'ethanol',
          'mitochondria', 'oxygen debt',
          'ATP', 'energy release', 'fermentation',
        ],
      },

      topic13: {
        code: '0610-T13',
        title: 'Excretion in Humans',
        allowedTopics: [
          'Excretion definition — removal of metabolic waste products from the body; waste produced BY the body\'s chemical reactions (distinguished from egestion which removes undigested food)',
          'Metabolic waste products — CO₂ (from respiration, excreted via lungs); water (from respiration and other reactions; via lungs, skin, kidneys); urea (from deamination of excess amino acids in liver; excreted in urine)',
          'Urea formation — deamination: amino acid → ammonia + organic acid; ammonia is toxic → converted to urea in liver (less toxic); urea transported in blood to kidneys',
          'Kidney structure (simplified) — cortex (outer, contains Bowman\'s capsules, PCT, DCT); medulla (inner, contains loops of Henle and collecting ducts); pelvis (funnel-shaped, connects to ureter); ureter (carries urine to bladder); bladder; urethra',
          'Kidney function (simplified) — filtration in glomerulus/Bowman\'s capsule: removes urea, glucose, water, salts from blood; selective reabsorption in tubule: all glucose reabsorbed, some water and salts reabsorbed; remaining fluid = urine (contains urea, water, salts — no glucose in healthy person)',
          'ADH — antidiuretic hormone from pituitary gland; released when blood too concentrated; acts on collecting duct → more water reabsorbed → concentrated urine, small volume; less ADH → dilute urine, large volume',
          'Skin excretion — sweat glands produce sweat; contains water, mineral salts, small amount of urea; evaporation of sweat also cools body',
        ],
        forbiddenTopics: [
          'Loop of Henle countercurrent multiplier detail — A Level only',
          'PCT co-transport mechanisms — A Level only',
          'Water potential notation ψ — A Level only',
          'Aquaporin channels detail — A Level only',
        ],
        requiredKeywords: [
          'excretion', 'metabolic waste', 'urea', 'deamination', 'liver',
          'kidney', 'filtration', 'glomerulus', 'selective reabsorption',
          'tubule', 'urine composition', 'ADH', 'concentrated urine',
        ],
      },

      topic14: {
        code: '0610-T14',
        title: 'Coordination and Response',
        allowedTopics: [
          'Nervous system — CNS (brain + spinal cord) and PNS (peripheral nerves); somatic (voluntary) and autonomic (involuntary)',
          'Neurones — sensory (receptor → CNS); relay (within CNS); motor (CNS → effector)',
          'Reflex arc — receptor → sensory neurone → relay neurone → motor neurone → effector; rapid, automatic, protective, does not require conscious thought',
          'Synapse — gap between neurones; electrical impulse → chemical neurotransmitter released → diffuses across → binds receptors on next neurone → new electrical impulse; allows signal transmission between neurones; one-directional',
          'Eye structure and function — cornea (refracts light); iris (controls pupil size — amount of light); pupil (opening); lens (focuses light on retina by changing shape); retina (contains rods for low light/black and white; cones for colour and high light/detail); fovea (most cones, highest acuity); optic nerve (impulses to brain)',
          'Accommodation — near object: ciliary muscles contract → suspensory ligaments loosen → lens becomes rounder/more curved → more refractive; distant object: ciliary muscles relax → suspensory ligaments tighten → lens becomes flatter/less curved → less refractive',
          'Short/long sight — short-sighted (myopia): eyeball too long or lens too curved → image forms in front of retina → corrected with concave lens; long-sighted (hyperopia): eyeball too short or lens too flat → image would form behind retina → corrected with convex lens',
          'Ear — pinna (collects sound); auditory canal; eardrum (vibrates); ossicles — hammer (malleus)/anvil (incus)/stirrup (stapes) amplify and transmit vibrations; cochlea (converts vibrations to electrical impulses); semicircular canals (balance/rotation)',
          'Endocrine system — glands produce hormones (chemical messengers); transported in blood; affect target organs; slower and longer lasting than nervous response; comparison: nervous (fast, short duration, specific, electrical); hormonal (slow, long duration, widespread, chemical)',
          'Adrenaline — from adrenal glands; fight-or-flight; glycogenolysis (→ increases blood glucose); increases heart rate and breathing rate; vasoconstriction in gut, vasodilation in muscles',
          'Insulin and glucagon — from pancreas (islets of Langerhans); insulin (after meal, blood glucose high → insulin released → glucose into cells → glycogenesis → blood glucose falls); glucagon (blood glucose low → glucagon released → glycogenolysis → blood glucose rises); Type 1 diabetes: no insulin production; Type 2: insulin resistance',
          'Plant responses — phototropism: shoots grow toward light (positive); roots grow away (negative); gravitropism: roots grow downward (positive); shoots grow upward (negative); auxins (plant hormones): produced in shoot tip; move to shaded side; higher concentration causes more cell elongation → bending toward light; commercial uses of plant hormones: rooting powder, selective weedkillers, controlling fruit ripening',
        ],
        forbiddenTopics: [
          'Action potential mV values (−70 mV, +40 mV) — A Level only',
          'Na⁺/K⁺ ATPase pump mechanism — A Level only',
          'EPSP/IPSP — A Level only',
          'Specific neurotransmitter names (acetylcholine) in detail — A Level only',
          'Refractory period detail — A Level only',
        ],
        requiredKeywords: [
          'reflex arc', 'sensory neurone', 'relay neurone', 'motor neurone', 'synapse',
          'rods', 'cones', 'fovea', 'accommodation', 'concave lens', 'convex lens',
          'adrenaline', 'fight-or-flight', 'glycogenolysis',
          'insulin', 'glucagon', 'islets of Langerhans', 'Type 1 diabetes',
          'auxin', 'phototropism', 'gravitropism',
        ],
      },

      topic15: {
        code: '0610-T15',
        title: 'Drugs',
        allowedTopics: [
          'Medicinal drugs — antibiotics (kill bacteria; not effective against viruses); aspirin (pain relief, anti-inflammatory); prescribed vs over-the-counter',
          'Heroin — class of drug; painkiller; highly addictive (physical and psychological dependence); withdrawal symptoms; health risks: overdose, sharing needles (HIV/hepatitis); social costs',
          'Cocaine — stimulant; highly addictive; affects CNS; cardiovascular effects (increased heart rate, blood pressure); risk of cardiac arrest',
          'Alcohol — depressant; impairs judgement/reaction time/coordination; long-term: liver disease (cirrhosis), brain damage; foetal alcohol syndrome (drinking during pregnancy)',
          'Smoking effects — nicotine: addictive, increases heart rate and blood pressure; tar: contains carcinogens → lung cancer; paralyses cilia → mucus builds up → increased infection; CO: combines with haemoglobin → reduces O₂ transport → cardiovascular effects; particulates/soot: emphysema',
          'Performance-enhancing drugs — anabolic steroids: increase muscle mass and strength; side effects: liver damage, infertility, mood changes; EPO (erythropoietin): increases red blood cells → more O₂ transport → increased endurance; risk of stroke/blood clots; ethical issues in sport; testing methods',
        ],
        forbiddenTopics: [
          'Neurotransmitter pharmacology (how drugs affect synaptic transmission at molecular level) — A Level only',
          'Drug metabolism pathways — A Level level',
        ],
        requiredKeywords: [
          'antibiotic', 'addictive', 'depressant', 'stimulant',
          'nicotine', 'tar', 'carcinogen', 'CO', 'haemoglobin',
          'cirrhosis', 'foetal alcohol syndrome',
          'anabolic steroids', 'EPO', 'performance-enhancing',
        ],
      },

      topic16: {
        code: '0610-T16',
        title: 'Reproduction',
        allowedTopics: [
          'Sexual vs asexual reproduction — sexual: two parents, gametes, fertilisation, genetic variation in offspring, slower; asexual: one parent, mitosis, genetically identical offspring (clones), faster; examples of asexual in plants: runners (strawberry), bulbs (daffodil), tubers (potato), cuttings',
          'Flower structure — sepal (protects bud); petals (attract pollinators); stamen = anther (produces pollen) + filament; carpel = stigma (receives pollen) + style + ovary + ovule (contains egg cell)',
          'Pollination — wind: light/smooth pollen, no nectar/scent, small/no petals, feathery stigmas to catch pollen; insect: colourful petals, nectar, scent, sticky/rough pollen, sticky stigma',
          'Fertilisation in plants — pollen lands on stigma → pollen tube grows down style → reaches ovule → male nucleus fuses with female nucleus → zygote → seed; ovary becomes fruit',
          'Seed dispersal — wind (light, wings, parachutes — dandelion, sycamore), animal: eaten (berries), attached (hooks — burdock), water, self-dispersal (pods explode)',
          'Germination conditions — water (activates enzymes, dissolves food stores), warmth (for enzyme activity), oxygen (for aerobic respiration to provide energy)',
          'Human reproductive systems — male: testes (produce sperm and testosterone), epididymis (sperm stored), vas deferens (sperm to urethra), prostate gland (seminal fluid), urethra, penis; female: ovaries (produce eggs/ova and hormones), fallopian tubes/oviducts (egg to uterus), uterus (site of implantation and development), cervix, vagina',
          'Fertilisation and early development — sperm swims to egg in fallopian tube; fusion of nuclei; zygote → embryo by cell division → implantation in uterine wall; placenta function: exchange of O₂, glucose, hormones, antibodies from mother to foetus; CO₂ and urea from foetus to mother; barrier (some pathogens can pass); umbilical cord',
          'Menstrual cycle (simplified) — FSH from pituitary: stimulates follicle growth and oestrogen production; oestrogen: rebuilds uterine lining; LH surge: triggers ovulation (approx day 14); progesterone: maintains uterine lining if pregnancy; if no pregnancy: lining breaks down → menstruation',
          'Contraception — barrier (condom, diaphragm); hormonal (pill prevents ovulation); IUD; vasectomy; abstinence; STI prevention: condom',
          'STIs — HIV/AIDS (transmitted via blood, sexual contact; damages immune system); gonorrhoea; chlamydia; prevention: safe sex, testing, treatment',
        ],
        forbiddenTopics: [
          'Detailed hormone feedback loops (negative feedback for menstrual cycle) — A Level only',
          'Meiosis mechanism — Topic 17',
          'Foetal development in molecular detail — A Level level',
        ],
        requiredKeywords: [
          'asexual reproduction', 'clone', 'sexual reproduction', 'gametes', 'fertilisation',
          'pollination', 'pollen tube', 'ovule', 'seed dispersal',
          'germination', 'water warmth oxygen',
          'placenta', 'umbilical cord',
          'FSH', 'LH', 'oestrogen', 'progesterone', 'ovulation',
          'STI', 'HIV',
        ],
      },

      topic17: {
        code: '0610-T17',
        title: 'Inheritance',
        allowedTopics: [
          'Chromosomes — in nucleus; human: 23 pairs (46 total); diploid (2n = 46); haploid gametes (n = 23)',
          'Genes — section of DNA that codes for a specific protein; located at specific locus on chromosome',
          'Alleles — alternative forms of a gene at same locus; dominant (expressed when present even with one copy); recessive (expressed only when homozygous)',
          'Genotype vs phenotype — genotype: alleles present; phenotype: observable characteristic',
          'Homozygous (both alleles same); heterozygous (different alleles)',
          'Monohybrid crosses — Punnett square; F₁ and F₂ ratios; test cross (crossing with homozygous recessive to determine genotype)',
          'Sex determination — XX female; XY male; Y chromosome carries SRY gene for male development',
          'Sex linkage — genes on X chromosome; examples: colour blindness (red-green — X^R and X^r); haemophilia (X^H and X^h); carrier females (X^H X^h); affected males more common (XhY); inheritance patterns with Punnett squares',
          'Codominance — neither allele dominant; both expressed; e.g. ABO blood groups (IA, IB, i alleles — IA and IB codominant, i recessive); sickle cell (HbA/HbS — heterozygote has both types of haemoglobin)',
          'Mutation — gene mutation: random change in DNA base sequence; causes: radiation (UV, X-rays, gamma), chemical mutagens, spontaneous; sickle cell anaemia as example of point mutation effect; chromosome mutation: wrong number of chromosomes — non-disjunction → Down\'s syndrome (trisomy 21)',
          'Natural selection — heritable variation; competition; differential survival; reproduction; inheritance of favourable alleles; change in allele frequency over generations',
        ],
        forbiddenTopics: [
          'Dihybrid crosses — A Level only',
          'Chi-squared test — A Level only',
          'Hardy-Weinberg equation — A Level only',
          'Epistasis — A Level only',
          'Linkage and crossing over — A Level only',
          'Multiple alleles beyond ABO — A Level level',
        ],
        requiredKeywords: [
          'chromosome', 'gene', 'allele', 'dominant', 'recessive',
          'genotype', 'phenotype', 'homozygous', 'heterozygous',
          'Punnett square', 'test cross', 'monohybrid',
          'sex-linked', 'carrier', 'X-chromosome',
          'codominance', 'ABO blood group', 'sickle cell',
          'mutation', 'non-disjunction', 'trisomy 21',
        ],
      },

      topic18: {
        code: '0610-T18',
        title: 'Variation and Selection',
        allowedTopics: [
          'Variation — continuous variation: ranges from one extreme to other with no distinct categories; influenced by both genes AND environment; e.g. height, skin colour, mass; shows normal distribution; discontinuous variation: distinct categories; mainly genetic; little environmental influence; e.g. ABO blood groups, tongue rolling',
          'Causes of variation — genetic: mutations (new alleles), sexual reproduction (meiosis creates new combinations through crossing over and independent assortment), random fertilisation; environmental: diet, exercise, temperature, sunlight, disease',
          'Natural selection (Darwin) — overproduction of offspring; variation in population (heritable); competition for limited resources (struggle for survival); some variants better adapted (survival of fittest); survivors reproduce and pass on favourable alleles; gradual change in population over generations',
          'Antibiotic resistance — excellent worked example of natural selection: random mutation in bacteria creates resistant variant; antibiotic kills non-resistant; resistant survive and reproduce; population becomes resistant; horizontal gene transfer can also spread resistance',
          'Selective breeding — artificial selection: humans identify desired traits; breed selected individuals; select offspring with trait; repeat over many generations; examples: disease-resistant wheat, high-milk-yield dairy cattle, lean pigs, thoroughbred horses, dog breeds; loss of genetic diversity as consequence',
          'Extinction — caused by: habitat destruction, hunting/overexploitation, disease, competition from invasive species, climate change; examples; once extinct cannot recover',
          'Conservation — importance: ecological stability, food chains, medicine, tourism, moral duty; strategies: protected areas (national parks, nature reserves), captive breeding programmes, seed banks, breeding programmes, legislation',
        ],
        forbiddenTopics: [
          'Speciation mechanism (allopatric, sympatric) — A Level only',
          'Hardy-Weinberg calculations — A Level only',
          'Genetic drift and founder effect — A Level only',
        ],
        requiredKeywords: [
          'continuous variation', 'discontinuous variation', 'normal distribution',
          'natural selection', 'heritable variation', 'adaptation', 'survival of fittest',
          'antibiotic resistance', 'selective breeding', 'artificial selection',
          'extinction', 'habitat destruction',
          'conservation', 'captive breeding', 'seed bank',
        ],
      },

      topic19: {
        code: '0610-T19',
        title: 'Organisms and Their Environment',
        allowedTopics: [
          'Ecosystems — habitat (place where organisms live); population (all individuals of one species in area); community (all populations in area); ecosystem (community + physical environment); abiotic factors: temperature, light, humidity, soil pH, rainfall, wind; biotic factors: predation, competition, disease, availability of food',
          'Food chains and webs — producers (autotrophs, make organic molecules by photosynthesis); primary consumers → secondary consumers → tertiary consumers; decomposers (bacteria and fungi break down dead organic matter)',
          'Trophic levels — level of feeding in food chain; biomass and energy decrease at each level',
          'Energy flow — energy lost at each trophic level: as heat (respiration), in excretory products, in indigestible material; approximately 10% energy transferred to next level; reason: inefficiency of digestion, energy lost in life processes; pyramid of numbers/biomass/energy',
          'Carbon cycle — photosynthesis (CO₂ → organic carbon); respiration (organic carbon → CO₂); combustion of fossil fuels; decomposition by bacteria/fungi; death; fossilisation',
          'Nitrogen cycle — nitrogen fixation: Rhizobium in legume root nodules + free-living Azotobacter → NH₄⁺; nitrification: NH₄⁺ → NO₂⁻ → NO₃⁻; denitrification: NO₃⁻ → N₂ (anaerobic bacteria); decomposition/ammonification; plants absorb NO₃⁻ → amino acids → proteins; animals eat plants',
          'Water cycle — evaporation; transpiration (from plants); condensation; precipitation; run-off; infiltration; percolation',
          'Population growth — S-shaped (logistic) growth curve: lag phase → exponential growth → stationary phase (carrying capacity); limiting factors: food, space, water, light, disease, predation; human population growth and consequences',
        ],
        forbiddenTopics: [
          'Hardy-Weinberg equilibrium — A Level only',
          'Detailed biogeochemical cycle calculations — A Level level',
        ],
        requiredKeywords: [
          'ecosystem', 'habitat', 'population', 'community',
          'food chain', 'food web', 'producer', 'consumer', 'decomposer',
          'trophic level', 'energy transfer 10%', 'pyramid of biomass',
          'carbon cycle', 'photosynthesis', 'respiration', 'decomposition',
          'nitrogen fixation', 'Rhizobium', 'nitrification', 'denitrification',
          'carrying capacity', 'limiting factors',
        ],
      },

      topic20: {
        code: '0610-T20',
        title: 'Human Influences on Ecosystems',
        allowedTopics: [
          'Deforestation — causes: agriculture (clearance for crops/cattle), timber industry, urbanisation; consequences: loss of biodiversity (species become extinct), increased CO₂ (trees cannot absorb/fewer trees), soil erosion (roots no longer bind soil), disrupted water cycle (less transpiration), local climate changes',
          'Fossil fuel combustion — CO₂ released → enhanced greenhouse effect → global warming; consequences: rising sea levels (thermal expansion + melting ice), extreme weather, shifting biomes, coral bleaching',
          'Eutrophication — excess fertiliser/sewage → nitrates/phosphates enter waterways → algal bloom → algae die (when nutrients depleted) → decomposers increase using O₂ → O₂ depleted (deoxygenation) → fish and other organisms die (oxygen deprivation); dead zone formation',
          'Pesticide accumulation — bioaccumulation: DDT or other pesticides absorbed by organisms at each trophic level; biomagnification: concentration increases up food chain (highest in top predators); effects on predatory birds (eggshell thinning), mammals, and ecosystems',
          'Plastic pollution — non-biodegradable; marine ecosystems; microplastics ingested by marine organisms; seabirds and marine mammals affected; entanglement; enters food chain',
          'Overfishing — depletes fish populations below sustainable levels; disrupts food webs; solutions: quotas, mesh size regulations, closed seasons, marine protected areas',
          'Conservation strategies — sustainable fishing (quotas, minimum mesh size); protected areas (national parks, marine reserves); reforestation; recycling; renewable energy; captive breeding programmes',
        ],
        forbiddenTopics: [
          'Detailed genetic consequences of habitat fragmentation — A Level level',
          'Climate modelling — beyond IGCSE scope',
        ],
        requiredKeywords: [
          'deforestation', 'biodiversity loss', 'CO₂', 'greenhouse effect',
          'eutrophication', 'algal bloom', 'deoxygenation', 'nitrates', 'phosphates',
          'bioaccumulation', 'biomagnification', 'DDT',
          'overfishing', 'quotas', 'sustainable',
          'recycling', 'reforestation',
        ],
      },

      topic21: {
        code: '0610-T21',
        title: 'Biotechnology and Genetic Modification',
        allowedTopics: [
          'Biotechnology — use of organisms or biological processes for commercial, industrial or medical purposes',
          'Fermentation — yeast and ethanol production (anaerobic: glucose → ethanol + CO₂; baking: CO₂ raises bread; brewing: ethanol consumed); bacteria and yoghurt production (Lactobacillus: lactose → lactic acid → denatures proteins → yoghurt thickens); mycoprotein (Fusarium grown in fermenter on glucose → mycoprotein → Quorn); cheese (bacteria curdle milk)',
          'Industrial fermenters — batch culture; controlling conditions: temperature (cooling jacket), pH (pH probe + buffers), nutrients (added), O₂ supply (aeration for aerobic), mixing (stirrer/agitator); aseptic conditions (sterilise equipment and media); monitoring; extracting product',
          'Genetic modification (basic concept) — isolating gene (using restriction endonucleases to cut DNA); inserting into vector (plasmid cut with same restriction enzyme → sticky ends; ligase joins gene to plasmid); transformation of host cell (e.g. E. coli); selection of transformed cells',
          'Examples of GM organisms — insulin production in E. coli (human insulin gene inserted; bacteria grow in fermenter; insulin extracted, purified); golden rice (β-carotene genes from daffodil and bacterium inserted into rice → rice grains produce β-carotene → converts to vitamin A → reduces vitamin A deficiency); GM crops (herbicide-resistant, pest-resistant, drought-tolerant)',
          'Ethical arguments — benefits: increased crop yield, improved nutrition, cheaper medicines, reduced pesticide use; concerns: unknown long-term effects on health, biodiversity impacts (e.g. gene flow to wild relatives), corporate control/ownership of food supply, labelling and consumer choice, playing God, cross-contamination',
          'Plant tissue culture — taking cells from plant meristem → placing in sterile nutrient medium → callus forms (undifferentiated cells) → differentiation into new plants; shows totipotency; advantages: rapid production of many identical plants, disease-free plants',
        ],
        forbiddenTopics: [
          'CRISPR-Cas9 mechanism — A Level only',
          'PCR mechanism in detail — A Level only (basic concept of copying DNA is fine)',
          'Detailed gel electrophoresis DNA profiling — A Level only',
          'Recombinant DNA technology molecular steps in detail — A Level level',
          'Gene therapy — A Level only',
        ],
        requiredKeywords: [
          'fermentation', 'yeast', 'Lactobacillus', 'mycoprotein', 'fermenter',
          'aseptic technique', 'batch culture',
          'restriction endonuclease', 'ligase', 'plasmid', 'sticky ends', 'transformation',
          'insulin', 'golden rice', 'β-carotene',
          'totipotency', 'callus', 'tissue culture',
          'ethical arguments', 'biodiversity impact',
        ],
      },
    },
  },
};

// ============================================================
// UTILITY FUNCTIONS FOR USE IN YOUR APP
// ============================================================

/**
 * Get all available qualifications
 */
export function getQualifications(): string[] {
  return Object.keys(SYLLABUS);
}

/**
 * Get all subjects for a qualification
 */
export function getSubjects(qualification: string): string[] {
  return Object.keys(SYLLABUS[qualification] || {});
}

/**
 * Get all units/topics for a qualification + subject
 */
export function getUnits(qualification: string, subject: string): string[] {
  return Object.keys(SYLLABUS[qualification]?.[subject] || {});
}

/**
 * Get topic data safely
 */
export function getTopicData(qualification: string, subject: string, unitKey: string): TopicData | null {
  return SYLLABUS[qualification]?.[subject]?.[unitKey] || null;
}

/**
 * Generate a fresh seed for cache busting
 */
export function generateSeed(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

/**
 * Generate cache key for a note
 */
export function generateCacheKey(qualification: string, subject: string, unitKey: string): string {
  return `notes_${qualification}_${subject}_${unitKey}`;
}

/**
 * Build a generation log entry
 */
export function buildGenerationLog(
  qualification: string,
  subject: string,
  unitKey: string,
  trigger: 'initial' | 'cache_clear' | 'validation_retry',
  validationPassed: boolean,
  forbiddenFound: string[] = []
) {
  const topicData = getTopicData(qualification, subject, unitKey);
  return {
    qualification,
    subject,
    unit_topic: unitKey,
    unit_topic_name: topicData?.title || 'Unknown',
    timestamp: new Date().toISOString(),
    seed: generateSeed(),
    trigger,
    validation_passed: validationPassed,
    forbidden_keywords_found: forbiddenFound,
  };
}