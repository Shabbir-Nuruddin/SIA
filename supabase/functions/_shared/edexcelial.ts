// ============================================================
// syllabusData_edexcel_ial.ts
// PLACE THIS FILE AT: src/lib/syllabusData_edexcel_ial.ts
//
// HOW TO USE:
//   import { EDEXCEL_IAL_SYLLABUS } from '@/lib/syllabusData_edexcel_ial'
//   import { buildSystemPrompt, buildImagePrompt } from '@/lib/syllabusHelpers'
//
// SOURCES: All content verified against official Pearson specifications.
// Edexcel IAL: Pearson IAL specs Issue 1-3 (2017-2021)
// Qualification codes: YBI11 (Bio), YCH11 (Chem), YPH11 (Physics), YMA01 (Maths)
// ============================================================
 
export interface TopicData {
  code: string;
  title: string;
  sourceUrl?: string; // Links to official Pearson PDF
  allowedTopics: string[];
  forbiddenTopics: string[];
  requiredKeywords: string[];
  boundaryNotes?: string[];
  practicalCriteria?: string[]; // Specific to Units 3 and 6
}
 
export interface SubjectData {
  [unitKey: string]: TopicData;
}
 
export interface QualificationData {
  [subject: string]: SubjectData;
}
 
// ============================================================
// EDEXCEL IAL SYLLABUS DATABASE
// ============================================================
 
export const EDEXCEL_IAL_SYLLABUS: QualificationData = {
 
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
 
    unit3: {
      code: 'WBI13',
      title: 'Practical Skills in Biology I',
      allowedTopics: [
        // PRACTICAL UNIT — assesses experimental and investigative skills
        // Core Practicals for WBI13 — students must be able to plan, execute, analyse and evaluate these:
        'Core Practical 1 — Investigate the effect of temperature on the rate of an enzyme-controlled reaction: use of colorimeter or gas syringe; drawing calibration curves; calculating rate from gradient of tangent; identifying optimum temperature; plotting and interpreting results',
        'Core Practical 2 — Investigate the effect of substrate concentration on the initial rate of an enzyme-controlled reaction: hydrogen peroxide and catalase; measuring O₂ evolution; calculating initial rate; plotting rate vs [substrate]; identifying Vmax; limitations of substrate concentration experiments',
        'Core Practical 3 — Investigate the effect of pH on enzyme activity: different buffer solutions; comparing enzymes from different sources; interpreting pH-activity curves; optimum pH; denaturation at extremes',
        'Core Practical 4 — Investigate osmosis in plant tissue: potato cylinders/discs; measuring mass change; plotting % change in mass vs sucrose concentration; determining water potential of tissue from where line crosses x-axis; preparing serial dilutions',
        'Core Practical 5 — Prepare and observe plant and animal cells under a light microscope: preparing temporary mounts (onion epidermis, cheek cells); staining (iodine, methylene blue); drawing scientific diagrams with labels and scale bars; calculating actual size; calculating magnification',
        'Core Practical 6 — Determine the tensile strength of plant fibres: measuring extensions under load; interpreting stress-strain relationships in biological context',
        'Core Practical 7 — Investigate the effect of different wavelengths of light on the rate of photosynthesis: using Elodea or Cabomba; counting bubbles or using gas syringe; inverse square law for light intensity; using coloured filters; comparing photosynthesis at different parts of spectrum',
        'Core Practical 8 — Investigate the transpiration rate of a leafy shoot using a potometer: setting up potometer; controlling variables (temperature, humidity, wind); measuring rate of water uptake; calculating rate per unit leaf area; effect of environmental conditions',
        // ANALYTICAL SKILLS
        'Statistical analysis — mean, standard deviation, standard error; t-test (comparing two means); Chi-squared test (testing if observed deviates from expected); correlation coefficient; null hypothesis; p-value and significance at 0.05 level; degrees of freedom',
        'Graph skills — choosing appropriate graph type (bar, line, scatter); plotting with error bars (standard deviation or standard error); drawing line of best fit; calculating gradient; extrapolation; identifying anomalies',
        'Microscopy skills — calculating magnification from scale bar; drawing labelled diagrams; interpreting micrographs; TEM vs SEM vs light microscope differences in resolution and magnification',
        'Colorimetry — using a colorimeter to measure absorbance; preparing calibration curves; measuring concentration of unknown solutions; Beer-Lambert relationship',
        'Serial dilution technique — preparing serial dilutions (e.g. ×10 dilutions); calculating concentrations; using in enzyme and microbiology experiments',
        'Chromatography — paper chromatography of photosynthetic pigments; Rf values; identifying pigments (chlorophyll a, chlorophyll b, xanthophyll, carotene); TLC as alternative',
        'Haemocytometer — counting cells; calculating cell concentration per cm³',
        // EVALUATION SKILLS
        'Sources of error — systematic errors (affect accuracy but not precision; e.g. calibration error); random errors (affect precision; e.g. parallax error, timing); reducing errors (repeating readings, using larger samples, more precise equipment)',
        'Variables — independent (what you change); dependent (what you measure); control variables (what you keep constant); confounding variables; ensuring a fair test',
        'Validity and reliability — valid experiment tests what it claims to test; reliable results are repeatable and reproducible; discussing validity of conclusions from data',
        'Risk assessment — identifying hazards in biology practicals; control measures; COSHH considerations; safe disposal',
        // EXTENDED INVESTIGATION SKILLS
        'Planning investigations — writing testable hypotheses; choosing appropriate methods; identifying control experiments; considering ethical issues in using living organisms; statistical planning (sample size)',
        'Data analysis — identifying trends and patterns; drawing conclusions from data; distinguishing correlation from causation; anomalous results and their treatment; considering sources of experimental error in conclusions',
      ],
      forbiddenTopics: [
        'Theory content from Units 1 and 2 — Unit 3 is practical skills only; do not repeat theoretical explanations here',
        'Unit 4 microbiology practicals — these appear in Unit 6 (the second practical unit)',
        'Unit 5 practical skills — Unit 6',
        'A-level statistics beyond t-test and chi-squared (e.g. ANOVA, Mann-Whitney) — beyond this specification level',
      ],
      requiredKeywords: [
        'core practical', 'colorimeter', 'calibration curve', 'standard deviation', 'standard error',
        't-test', 'Chi-squared', 'null hypothesis', 'p-value', 'degrees of freedom',
        'potometer', 'inverse square law', 'Rf value', 'haemocytometer',
        'systematic error', 'random error', 'validity', 'reliability',
        'independent variable', 'dependent variable', 'control variable',
        'serial dilution', 'magnification', 'scale bar', 'error bars',
      ],
      boundaryNotes: [
        'Unit 3 is assessed by a practical examination — notes should focus on techniques, skills and analysis rather than repeating theory from Units 1-2.',
        'Statistical tests: know which test to use and when, not just how to calculate.',
        'Core Practicals 1-8 listed here are the ones examinable for WBI13.',
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
 
    unit6: {
      code: 'WBI16',
      title: 'Practical Skills in Biology II',
      allowedTopics: [
        // PRACTICAL UNIT — builds on Unit 3 skills; covers content from Units 4 and 5
        // Core Practicals for WBI16:
        'Core Practical 9 — Investigate the effect of different antibiotics on bacterial growth: aseptic technique; streak plate or spread plate method; measuring zones of inhibition (mm); interpreting results; comparing antibiotic effectiveness; Kirby-Bauer disc diffusion method; calculating areas of inhibition zones',
        'Core Practical 10 — Investigate the effect of named variables on the rate of growth of microorganisms: bacterial growth curves; using turbidimetry (colorimeter to measure optical density); serial dilutions and plate counts; comparing growth under different conditions (temperature, pH, nutrient availability)',
        'Core Practical 11 — Dissect and examine mammalian heart or lung: identifying chambers, valves, vessels; examining lung tissue; cutting and preparing specimens; scientific drawing with labels',
        'Core Practical 12 — Dissect and examine a small mammalian or plant organ to investigate structure-function relationship: e.g. kidney cortex vs medulla; leaf cross-section; drawing and labelling; linking structure to function from Units 4/5',
        'Core Practical 13 — Investigate factors affecting the rate of photosynthesis using isolated chloroplasts and DCPIP: DCPIP as electron acceptor (blue → colourless when reduced); measuring rate of decolourisation; controls (boiled chloroplasts; dark conditions); using colorimeter; linking to light-dependent reactions',
        'Core Practical 14 — Investigate the effect of exercise on heart rate and breathing rate: recording baseline and post-exercise values; recovery time; calculating cardiac output (heart rate × stroke volume); plotting graphs; statistical analysis of class data; evaluating validity',
        'Core Practical 15 — Measure the rate of respiration using a respirometer: soda lime absorbs CO₂; measuring O₂ consumption by movement of manometer fluid; calculating RQ using different substrates (glucose vs lipid); correcting for temperature changes; comparing aerobic and anaerobic conditions',
        'Core Practical 16 — Investigate the effect of different substrate concentrations on the rate of fermentation by yeast: glucose concentration vs CO₂ production; using a gas syringe or limewater; plotting rate vs concentration; interpreting in context of glycolysis and anaerobic respiration',
        'Core Practical 17 — Carry out a chromatographic separation of chloroplast pigments and interpret results: thin layer chromatography (TLC) or paper chromatography; Rf values; identifying chlorophyll a, chlorophyll b, xanthophyll, carotene; linking to absorption of different wavelengths',
        'Core Practical 18 — Investigate the effect of a named factor on the production of amylase or protease by microorganisms: using agar with starch substrate; iodine staining to detect clear zones; comparing enzyme production under different conditions',
        // ADVANCED ANALYTICAL SKILLS
        'Advanced statistical tests — Mann-Whitney U test (comparing non-normally distributed data); Spearman\'s rank correlation (rs); interpreting correlation coefficients; selecting the appropriate statistical test for different data types and experimental designs',
        'Evaluating experimental design — identifying flaws in given experimental methods; suggesting improvements; commenting on sample size adequacy; considering ethical issues in using living organisms or human subjects',
        'Writing conclusions — relating results to biological theory; discussing whether data supports or refutes the hypothesis; quantitative statements; considering alternative explanations',
        'Microbiological counting techniques — total viable count (colony forming units per cm³); serial dilutions for counting; Miles and Misra method; spread plates vs pour plates; limitations of viable counting',
        'Using data loggers — pH probes, oxygen electrodes, temperature probes, light meters; continuous data recording; interpreting data logger output; identifying biological events from graphs',
        'Investigating plant responses — auxin agar blocks; measuring curvature; demonstrating phototropism; quantifying gravitropism',
        'Measuring metabolic rate — direct and indirect calorimetry; oxygen consumption as proxy for metabolic rate; bomb calorimeter (conceptual understanding); calculating energy content of food',
      ],
      forbiddenTopics: [
        'Theory content from Units 4 and 5 — Unit 6 is practical skills only; do not repeat theoretical explanations',
        'Unit 3 core practicals — those are assessed in the Unit 3 paper',
        'Statistics beyond what is listed — Mann-Whitney and Spearman\'s are the extension tests for Unit 6',
      ],
      requiredKeywords: [
        'aseptic technique', 'zone of inhibition', 'turbidimetry', 'optical density',
        'DCPIP', 'colorimeter', 'respirometer', 'RQ', 'manometer',
        'Rf value', 'TLC', 'chlorophyll a', 'chlorophyll b', 'xanthophyll', 'carotene',
        'cardiac output', 'stroke volume', 'recovery time',
        'Mann-Whitney', 'Spearman\'s rank', 'correlation coefficient',
        'colony forming units', 'serial dilution', 'viable count',
        'data logger', 'experimental design', 'validity',
      ],
      boundaryNotes: [
        'Unit 6 is the synoptic practical paper — it can draw on content from all theory units (1, 2, 4, 5).',
        'Emphasis is on higher-order analytical and evaluative skills, not just recall of practical procedures.',
        'Core Practicals 9-18 listed here are the ones most relevant to WBI16 assessment.',
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
 
    unit3: {
      code: 'WCH13',
      title: 'Practical Skills in Chemistry I',
      allowedTopics: [
        // PRACTICAL UNIT — covers lab skills assessed in the WCH13 practical paper
        // Core Practicals for WCH13:
        'Core Practical 1 — Preparation of a standard solution: accurate weighing; dissolving in distilled water; making up to volume in a volumetric flask; calculating concentration from mass and molar mass',
        'Core Practical 2 — Acid-base titration: using burette (reading to nearest 0.05 cm³); pipette; conical flask; indicator choice (phenolphthalein or methyl orange); calculating concentration from titre volume; concordant titres (within 0.10 cm³); identifying anomalous results',
        'Core Practical 3 — Enthalpy of combustion by calorimetry: spirit burner; measuring temperature rise; q = mcΔT; calculating molar enthalpy; sources of error (heat loss, incomplete combustion, draught); improving accuracy',
        'Core Practical 4 — Enthalpy of neutralisation: measuring temperature changes when acid reacts with alkali; calculating ΔH; comparing strong and weak acid/alkali combinations',
        'Core Practical 5 — Finding the Mr of a volatile liquid by the gas syringe method: measuring volume of vapour produced at known temperature; using pV = nRT to find moles; calculating Mr',
        'Core Practical 6 — Investigate the rate of a reaction by a clock method: thiosulfate and hydrochloric acid producing sulfur (S); measuring time for cross to disappear; calculating 1/t as measure of rate; investigating effect of concentration and temperature; plotting rate vs concentration graphs',
        'Core Practical 7 — Investigate enthalpy changes using Hess\'s law: measuring temperature changes for different routes; comparing direct and indirect routes; verifying Hess\'s law experimentally',
        'Core Practical 8 — Identify functional groups using chemical tests: bromine water (alkene decolourises; alkane/aromatic does not); acidified KMnO₄; PCl₅ (white fumes with -OH); Na₂CO₃ (effervescence with carboxylic acid); tollens\' reagent (silver mirror with aldehyde); 2,4-DNP (orange precipitate with carbonyl); iodine/NaOH (iodoform with methyl carbonyl); Fehling\'s solution',
        'Core Practical 9 — Distillation and recrystallisation: setting up simple distillation; fractional distillation; measuring boiling point; recrystallisation from hot solvent; filtering under reduced pressure; testing purity by melting point (sharp MP = pure; range = impure)',
        'Core Practical 10 — Investigate the effect of temperature and concentration on the rate of iodination of propanone: using a colorimeter; measuring absorbance change over time; calculating rate; plotting graphs',
        // COLOUR CHANGES IN CHEMISTRY — PRACTICAL OBSERVATIONS
        'Colour changes in inorganic reactions — Group 1 reactions with water: Li (slow, sinks), Na (vigorous, melts), K (ignites, violet flame); Group 2 reactions: Ca fizzes slowly in cold water; Mg burns white in steam',
        'Halogen colour changes in organic solvent — Cl₂: very pale yellow; Br₂: orange; I₂: purple; identifying displacement reactions by organic layer colour change',
        'Transition metal colour changes — Cu²⁺ (aq) blue → [Cu(NH₃)₄(H₂O)₂]²⁺ deep blue (excess NH₃); Cu(OH)₂ pale blue precipitate; Fe²⁺ green precipitate; Fe³⁺ brown precipitate with NaOH',
        'Colour changes in acid-base reactions — universal indicator colour range (pH 1-14); litmus (red acid, blue alkali); methyl orange (red pH <3.1, orange 3.1-4.4, yellow >4.4); phenolphthalein (colourless acid, pink >8.2)',
        'Colour changes in redox reactions — K₂Cr₂O₇ orange → Cr³⁺ green (reduction); KMnO₄ purple → Mn²⁺ colourless/pale pink (in acid); I₂ brown → colourless with thiosulfate (Na₂S₂O₃)',
        'Colour changes in organic tests — bromine water orange → colourless (addition to alkene or phenol); 2,4-DNP orange/yellow precipitate (carbonyl); silver mirror test (Tollens\' — colourless → silver metal); Fehling\'s blue → brick-red (aldehyde)',
        // APPARATUS AND TECHNIQUES
        'Accurate measurement — use of burette (±0.05 cm³); pipette (±0.06 cm³); balance (±0.001 g); thermometer; measuring cylinder (less accurate); gas syringe; choice of apparatus for given precision requirement',
        'Safe laboratory practice — COSHH; PPE (goggles, gloves, lab coat); fume cupboard for volatile or toxic chemicals; fire safety; disposal of chemicals',
        'Separation techniques in practice — gravity filtration; filtration under reduced pressure (Buchner funnel); simple distillation; fractional distillation; solvent extraction; chromatography (TLC, paper, column)',
        'Yield calculations — theoretical yield from stoichiometry; actual yield from experiment; % yield; % atom economy = (Mr of desired product / Mr of all reactants) × 100; green chemistry principles',
        // ANALYTICAL TECHNIQUES IN PRACTICE
        'Interpreting IR spectra — identifying peaks: broad O-H (carboxylic acid or alcohol); sharp C=O; N-H; C-H; fingerprint region; using data books for wavenumber ranges',
        'Interpreting mass spectra — identifying M⁺ peak for Mr; base peak; common fragment ions (CH₃⁺ = 15; CHO⁺ = 29; C₂H₅⁺ = 29; C₃H₇⁺ = 43; benzoyl C₆H₅CO⁺ = 105)',
        'Planning experiments — writing hypothesis; identifying variables; risk assessment; selecting appropriate method; considering sources of error; evaluating results',
      ],
      forbiddenTopics: [
        'Unit 4 and 5 theory content — Unit 3 practical only',
        'NMR spectroscopy interpretation — Unit 5 only',
        'Rate equations and mathematical kinetics — Unit 4 only',
      ],
      requiredKeywords: [
        'titration', 'burette', 'pipette', 'concordant titres', 'standard solution',
        'q = mcΔT', 'enthalpy of combustion', 'enthalpy of neutralisation',
        'clock reaction', '1/t', 'rate of reaction',
        'distillation', 'recrystallisation', 'melting point', 'boiling point',
        'percentage yield', 'atom economy',
        'bromine water', '2,4-DNP', 'Tollens\' reagent', 'Fehling\'s',
        'colour change', 'displacement reaction',
        'burette reading', 'volumetric flask', 'IR spectrum', 'mass spectrum',
      ],
      boundaryNotes: [
        'Unit 3 is assessed by a practical examination — core practicals 1-10 are the primary focus.',
        'Colour changes are particularly important for practical identification questions.',
        'Students must know which colour change corresponds to which chemical test.',
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
 
    unit6: {
      code: 'WCH16',
      title: 'Practical Skills in Chemistry II',
      allowedTopics: [
        // PRACTICAL UNIT — builds on Unit 3; covers Units 4 and 5 content in practical context
        'Core Practical 11 — Preparation and purification of an organic compound: multi-step synthesis; reflux; distillation; extraction; drying (anhydrous Na₂SO₄ or MgSO₄); measuring yield; measuring purity by melting point or boiling point; TLC to confirm purity',
        'Core Practical 12 — Investigate redox titration using KMnO₄: standardising KMnO₄ solution against sodium oxalate (Na₂C₂O₄); titrating iron(II) sulfate solution; calculating concentration; recognising endpoint (purple → colourless); sources of error in permanganate titrations',
        'Core Practical 13 — Investigate the rate of a reaction and determine orders: using colorimeter for coloured species; manganate(VII) with ethanedioate; or bromine with propanone; calculating initial rate; plotting rate vs concentration; determining order from graphs; fitting to rate equation',
        'Core Practical 14 — Determine electrode potentials and construct electrochemical cells: using half-cells (metal/metal ion, non-metal/ion); salt bridge; measuring EMF; comparing measured vs theoretical E°cell; effect of concentration (qualitative Nernst application)',
        'Core Practical 15 — Investigate properties of transition metal compounds: reactions of Cu²⁺, Fe²⁺, Fe³⁺, Mn²⁺ with NaOH and NH₃; colour changes; observing redox reactions with MnO₄⁻; complex ion formation; identifying transition metal ions by colour and precipitate tests',
        'Core Practical 16 — Investigate the properties of complex ions: adding ligands; observing colour changes; Ag⁺ with Cl⁻, Br⁻, I⁻ — precipitate colours and solubility in NH₃; identifying complex ions; ligand substitution',
        'Core Practical 17 — Prepare an azo dye and carry out a coupling reaction: diazotisation of aromatic amine (0–5°C with NaNO₂/HCl); coupling with phenol or naphthol in alkaline conditions; observing azo dye formation; colour of product; filtration and drying',
        'Core Practical 18 — Investigate acid-base equilibria: measuring pH of strong and weak acids at same concentration; calculating Ka; buffer preparation; measuring pH of buffer before and after adding small amounts of acid/alkali; verifying Henderson-Hasselbalch',
        // COLOUR CHANGES IN ADVANCED CHEMISTRY — PRACTICAL IDENTIFICATION
        'Transition metal colour changes — vanadium oxidation states: V⁵⁺ (yellow VO₂⁺) → V⁴⁺ (blue VO²⁺) → V³⁺ (green) → V²⁺ (violet) when reduced by zinc in acid; chromium: Cr₂O₇²⁻ orange → Cr³⁺ green (reduction); CrO₄²⁻ yellow (in alkali) ↔ Cr₂O₇²⁻ orange (in acid)',
        'Colour changes in electrode potential experiments — Cu²⁺ blue deposits Cu(s) at cathode; Ag⁺ colourless deposits Ag(s); I₂ brown → I⁻ colourless with thiosulfate; Fe³⁺ yellow-brown → Fe²⁺ pale green; MnO₄⁻ purple → Mn²⁺ almost colourless in acid',
        'Colour changes in organic synthesis — bromine water orange → colourless (electrophilic addition to alkene; also phenol reacts without catalyst); 2,4-DNP orange precipitate (carbonyl confirmed); silver mirror (Tollens\' — aldehyde confirmed); KMnO₄ purple → colourless/brown MnO₂ (oxidation of alkene or alcohol)',
        'Colour changes in acid-base titrations — methyl orange: red (acid) → orange → yellow (alkali); phenolphthalein: colourless (acid) → pink (alkali); bromothymol blue: yellow (acid) → green → blue (alkali)',
        // ADVANCED PRACTICAL SKILLS
        'Planning multi-step syntheses in the lab — choosing reagents and conditions; identifying hazards at each step; predicting products; calculating theoretical yield; designing purification scheme; determining purity at each stage',
        'Evaluating kinetics experiments — identifying sources of error specific to rate experiments; effect of temperature fluctuation; light sensitivity of photochemical reactions; alternative methods for measuring rate (comparing clock, colorimetry, gas syringe, mass loss)',
        'Advanced statistical analysis — calculating mean and standard deviation from replicate readings; identifying outliers using ±2σ rule; presenting uncertainty in results (absolute and percentage uncertainty); propagating uncertainties through calculations',
        'Interpreting spectra for structure determination — combining ¹H NMR chemical shifts and splitting patterns with IR functional group identification and MS molecular ion peak; full structure determination from combined spectroscopic data',
        'Calibration and systematic error correction — calibrating pH meter; calibrating colorimeter with blanks; correcting for background absorbance; understanding systematic vs random error; ways to minimise each type',
      ],
      forbiddenTopics: [
        'Theory content from Units 4 and 5 — Unit 6 practical only',
        'Unit 3 core practicals — assessed separately',
        'Beyond-specification spectroscopic techniques (GC-MS, X-ray crystallography)',
      ],
      requiredKeywords: [
        'KMnO₄ redox titration', 'electrode potential', 'salt bridge', 'E°cell',
        'transition metal colour', 'vanadium oxidation states', 'V⁵⁺ yellow', 'V⁴⁺ blue', 'V³⁺ green', 'V²⁺ violet',
        'diazotisation', 'coupling reaction', 'azo dye',
        'Henderson-Hasselbalch', 'buffer pH measurement',
        'NMR interpretation', 'splitting pattern', 'chemical shift',
        'percentage uncertainty', 'systematic error', 'calibration',
        'multi-step synthesis', 'purification', 'melting point purity',
      ],
      boundaryNotes: [
        'Unit 6 is the synoptic practical paper — it can draw on content from all theory units (1, 2, 4, 5).',
        'Colour changes for transition metals are especially important for Unit 6 identification questions.',
        'Core practicals 11-18 listed here are the primary focus for WCH16 assessment.',
      ],
    },
  },
 
  // -----------------------------------------------------------
  // EDEXCEL IAL PHYSICS (YPH11)
  // Unit 3 and Unit 6 are practical-only — included here with full practical content
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
        'SHM (simple harmonic motion) — Unit 5',
        'Gravitational fields — Unit 5',
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
 
    unit3: {
      code: 'WPH13',
      title: 'Practical Skills in Physics I',
      allowedTopics: [
        // PRACTICAL UNIT — covers experimental skills relevant to Units 1 and 2 content
        // Core Practicals for WPH13:
        'Core Practical 1 — Determine the acceleration due to gravity using a free-fall method: timing falling object; using light gates or electromagnetic release and timer; calculating g from h and t using s = ½gt²; sources of error (reaction time, air resistance at low speeds); improving accuracy with multiple drops',
        'Core Practical 2 — Determine the Young modulus of a material: long wire under tension; measuring extension with micrometer at known loads; calculating stress and strain; plotting stress-strain graph; gradient = Young modulus; identifying proportionality limit and elastic limit',
        'Core Practical 3 — Determine the spring constant of a spring: plotting F-x graph; gradient = k; finding elastic limit from graph; measuring elastic PE stored; energy stored = area under F-x graph',
        'Core Practical 4 — Investigate the relationship between force, mass and acceleration: dynamics trolley on runway; light gates to measure velocity; calculating acceleration; plotting F vs a (at constant m) and a vs 1/m (at constant F); verifying Newton\'s second law',
        'Core Practical 5 — Determine the refractive index of a glass or perspex block: ray box; measuring angles of incidence and refraction; plotting sin i vs sin r graph; gradient = n; identifying total internal reflection at critical angle',
        'Core Practical 6 — Investigate the I-V characteristics of electrical components: variable resistor (rheostat) or potential divider; measuring V and I for ohmic resistor, bulb, diode; plotting I-V graphs; interpreting shapes; calculating resistance from gradient',
        'Core Practical 7 — Determine the wavelength of light using Young\'s double-slit or diffraction grating: measuring fringe spacing x and D; using λ = ax/D; or using d sinθ = nλ for diffraction grating; using a ruler and travelling microscope for fringe measurements; calculating λ',
        'Core Practical 8 — Investigate the relationship between the length of a wire and its resistance: measuring resistance at different lengths; plotting R vs L graph; gradient related to resistivity; measuring cross-section with micrometer; calculating ρ = RA/L',
        'Core Practical 9 — Determine the EMF and internal resistance of a cell: varying external resistance; measuring terminal pd V and current I; plotting V vs I graph; y-intercept = EMF; gradient magnitude = r; calculating EMF and r',
        'Core Practical 10 — Investigate how the charge on a capacitor varies with voltage: connecting capacitor in series with resistor; measuring voltage across capacitor at different times; plotting V vs time for charging/discharging (qualitative)',
        // MEASUREMENT AND UNCERTAINTY
        'Measurement uncertainty — absolute uncertainty: ±half the smallest scale division for analogue; ±1 in the last significant figure for digital; percentage uncertainty = (absolute uncertainty/measurement) × 100%; combining uncertainties: add absolute for + and −; add % for × and ÷; multiply % by power for powers',
        'Significant figures — recording results to appropriate number of significant figures; matching sig figs to measurement uncertainty; consistency in tables and graphs',
        'Repeat measurements and anomalies — identifying anomalous results (outliers); using at least 5 values for a graph; calculating mean from repeats; excluding outliers from mean with justification',
        'Types of error — random error (affects precision — reduces with repeats); systematic error (affects accuracy — cannot be reduced by repeating; e.g. zero error on a meter, parallax, calibration error); identifying which type affects an experiment',
        // GRAPH SKILLS IN PHYSICS
        'Drawing graphs — choosing appropriate axes and scales; plotting all points with correct scale; drawing best-fit line (straight or smooth curve); the best-fit line does not have to pass through all points; drawing lines of maximum and minimum gradient to estimate uncertainty in gradient',
        'Gradient and intercept — calculating gradient using large triangle; units of gradient; intercept; rearranging physics equations into y = mx + c form to identify what to plot; e.g. for v² = u² + 2as plot v² vs s (gradient = 2a)',
        'Linearising relationships — if y = kxⁿ, plot log y vs log x (gradient = n); if y = ke^(bx), plot ln y vs x (gradient = b)',
        // EXPERIMENTAL DESIGN AND EVALUATION
        'Control variables — identifying all variables and how to control them; fair test principle; improving experimental design',
        'Precision and accuracy — precise = small spread of results; accurate = close to true value; how to improve each',
        'Anomalies and outliers — identifying points that do not fit the trend; possible explanations; whether to include or exclude in analysis',
        'Limitations and improvements — evaluating specific limitations of each core practical; suggesting specific improvements (not generic statements)',
      ],
      forbiddenTopics: [
        'Theory content from Units 1 and 2 — Unit 3 practical only',
        'Unit 4 and 5 physics theory — assessed in those theory papers',
        'Mathematical derivations beyond practical application',
      ],
      requiredKeywords: [
        'absolute uncertainty', 'percentage uncertainty', 'random error', 'systematic error',
        'significant figures', 'anomalous result', 'best-fit line',
        'gradient', 'intercept', 'linearising', 'log-log graph',
        'Young modulus', 'spring constant', 'refractive index', 'internal resistance',
        'I-V characteristic', 'wavelength measurement', 'double-slit', 'diffraction grating',
        'free-fall', 'acceleration due to gravity', 'Newton\'s second law verification',
        'precision', 'accuracy', 'control variable', 'fair test',
      ],
      boundaryNotes: [
        'Unit 3 is assessed by a practical paper covering Units 1 and 2 content in experimental contexts.',
        'Uncertainty analysis is especially important — students must know how to calculate, combine and interpret uncertainties.',
        'Core Practicals 1-10 listed here are the primary focus for WPH13 assessment.',
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
        'Simple harmonic motion / oscillations / damping / resonance — Unit 5 (NOT Unit 4)',
        'Gravitational fields — Newton\'s law of gravitation, radial g, gravitational potential, orbital motion and Kepler\'s third law are all Unit 5 (NOT Unit 4); Unit 4 fields are ELECTRIC and MAGNETIC only',
        'Thermodynamics and ideal gas laws — Unit 5',
        'Nuclear radiation (radioactive decay, activity, half-life) and binding energy — Unit 5',
        'Cosmology and stellar evolution — Unit 5',
      ],
      requiredKeywords: [
        'angular velocity', 'centripetal force', 'centripetal acceleration',
        'Coulomb\'s law', 'electric field strength', 'electric potential', 'equipotential',
        'capacitance', 'time constant RC', 'exponential decay',
        'magnetic flux density', 'electromagnetic induction', 'Faraday\'s law',
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
        // OSCILLATIONS (SHM)
        'Defining condition for SHM — a ∝ −x (acceleration proportional to displacement, directed toward equilibrium); restoring force',
        'SHM equations — x = A cos(ωt) or A sin(ωt) (depending on initial conditions); v = ±ω√(A² − x²); v_max = ωA (at x = 0); a = −ω²x; a_max = ω²A (at x = ±A); angular frequency ω = 2πf = 2π/T',
        'Period formulae — simple pendulum: T = 2π√(l/g); mass-spring: T = 2π√(m/k)',
        'Energy in SHM — Ek = ½mω²(A² − x²); Ep = ½mω²x²; E_total = ½mω²A² = constant; energy exchange between KE and PE; max KE at equilibrium, max PE at amplitude',
        'Damping — light (underdamped): oscillates with exponentially decreasing amplitude; heavy (overdamped): slowly returns to equilibrium without oscillating; critical damping: returns to equilibrium in shortest time without oscillating',
        'Resonance — natural frequency f₀; forced oscillations at driving frequency f; resonance: maximum amplitude when f = f₀; amplitude decreases with increased damping; phase difference between displacement and driving force increases from 0 to π through resonance',
        // GRAVITATIONAL FIELDS
        'Newton\'s law of gravitation F = Gm₁m₂/r² (G = 6.67×10⁻¹¹ N m² kg⁻²); inverse square law',
        'Gravitational field strength g = F/m = GM/r² (radial field around spherical mass); field lines point radially toward the mass; uniform field near Earth surface',
        'Gravitational potential Vgrav = −GM/r; negative (work done per unit mass to move from infinity to that point); zero at infinity; gravitational PE = mVgrav = −GMm/r; g = −ΔVgrav/Δr',
        'Orbital motion — equating gravitational force to centripetal: GMm/r² = mv²/r → v = √(GM/r); period T = 2π√(r³/GM); Kepler\'s third law T² ∝ r³; geostationary orbit (T = 24 h, equatorial); comparison of gravitational and electric fields (both inverse-square; gravity always attractive)',
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
        'Circular motion — Unit 4 (assumed knowledge; SHM and gravitation here are Unit 5)',
        'Electric fields and capacitors — Unit 4',
        'Magnetic fields and electromagnetic induction — Unit 4',
        'Particle physics quark model and Feynman diagrams — Unit 4 (do not repeat)',
      ],
      requiredKeywords: [
        'absolute zero', 'specific heat capacity', 'specific latent heat',
        'ideal gas equation', 'pV = nRT', 'Boltzmann constant',
        'kinetic theory', 'mean square speed', 'r.m.s. speed',
        'simple harmonic motion', 'restoring force', 'natural frequency', 'resonance', 'damping',
        'Newton\'s law of gravitation', 'gravitational field strength', 'gravitational potential',
        'Kepler\'s third law', 'orbital motion',
        'radioactive decay law', 'decay constant', 'half-life', 'activity',
        'mass defect', 'binding energy per nucleon', 'E = mc²',
        'nuclear fission', 'chain reaction', 'moderator', 'control rods',
        'nuclear fusion', 'tokamak',
        'Hubble\'s law', 'redshift', 'Big Bang', 'CMB',
        'main sequence', 'neutron star', 'black hole', 'supernova',
      ],
    },
 
    unit6: {
      code: 'WPH16',
      title: 'Practical Skills in Physics II',
      allowedTopics: [
        // PRACTICAL UNIT — builds on Unit 3; covers Units 4 and 5 content in practical context
        'Core Practical 11 — Investigate simple harmonic motion using a mass-spring system and simple pendulum: measuring period T for different amplitudes (showing amplitude independence for SHM); varying mass (spring) and length (pendulum); plotting T² vs m (spring: gradient = 4π²/k) and T² vs l (pendulum: gradient = 4π²/g); determining k and g from graphs; measuring small angles to maintain SHM approximation',
        'Core Practical 12 — Investigate resonance using a driven mechanical oscillator: Barton\'s pendulums or driven spring system; observing resonance when driving frequency equals natural frequency; noting phase relationship (90° at resonance); effect of damping on peak amplitude and width; plotting amplitude vs frequency graphs',
        'Core Practical 13 — Investigate the charging and discharging of a capacitor: connecting capacitor with resistor; measuring V across capacitor with time; plotting V vs t; plotting ln V vs t to get straight line (gradient = −1/RC); determining time constant τ = RC; comparing with theoretical value',
        'Core Practical 14 — Determine the specific heat capacity of a metal or liquid by electrical heating: measuring energy input (Q = IVt); measuring temperature rise; calculating c = Q/mΔT; identifying sources of heat loss; using insulation and lagging to reduce heat loss; comparing calculated value with data book value',
        'Core Practical 15 — Investigate radioactive decay using a model or actual Geiger-Müller tube: counting background radiation; measuring count rate vs time for a radioactive source; plotting count rate vs time; plotting ln(count rate) vs time to get straight line (gradient = −λ); calculating half-life t½ = 0.693/λ; safety protocols with radioactive sources',
        'Core Practical 16 — Investigate the relationship between gravitational force and distance (inverse-square law): using gravitational field simulation data or gravity sensor; plotting F vs 1/r² to verify inverse square law; comparing with Coulomb\'s law for electric fields; similarities and differences',
        'Core Practical 17 — Investigate circular motion: centripetal force apparatus; measuring period T and radius r at different speeds; plotting F vs v² (gradient = m/r); verifying F = mv²/r; identifying centripetal force provider in each situation',
        'Core Practical 18 — Use a spreadsheet or data analysis software to model radioactive decay or oscillations: generating N vs t data from N = N₀e^(−λt); varying λ; comparing exponential decay with SHM; calculating derived quantities (activity A = λN; half-life)',
        // ADVANCED MEASUREMENT TECHNIQUES IN PHYSICS
        'Using oscilloscopes — measuring frequency and period from time-base; measuring amplitude (peak and RMS); triggering; measuring phase difference between two signals; calculating frequency from T = 1/f',
        'Using data loggers and sensors — ultrasound distance sensor for SHM; force probe; temperature probe; light gate for velocity measurement; configuring logging rate; downloading and processing data; identifying limitations',
        'Geiger-Müller tube and radiation detectors — operating voltage; detecting different radiation types; correcting for background; statistical nature of radioactive decay (count rate fluctuates); dead time of GM tube',
        'Thermocouple and temperature measurement — converting thermocouple EMF to temperature; calibration; use in inaccessible locations; comparing with thermistor and platinum resistance thermometer',
        // ADVANCED ANALYSIS IN PHYSICS
        'Exponential analysis — plotting ln y vs t for exponential relationships; identifying gradient as −λ or −1/RC; extrapolating to find y-intercept (N₀, V₀, I₀); using Excel/data analysis software',
        'Circular motion data analysis — plotting v² vs r (at constant ω) and F vs v² (at constant r and m); interpretation of gradients; verifying theoretical relationships',
        'Uncertainty in advanced experiments — estimating uncertainty from gradient of best-fit vs extremes on ln graphs; uncertainty in half-life from uncertainty in gradient; combining uncertainties in c = Q/mΔT (adding percentage uncertainties in Q, m, ΔT)',
        'Evaluating experiments in physics — specific critiques for each core practical; identifying the dominant source of error; suggesting improvements that are specific and realistic; assessing whether uncertainty is acceptable for the purpose of the experiment',
      ],
      forbiddenTopics: [
        'Theory content from Units 4 and 5 — Unit 6 practical only',
        'Unit 3 core practicals — assessed separately in Unit 3 paper',
        'Quantum physics beyond de Broglie and photoelectric effect — beyond specification',
      ],
      requiredKeywords: [
        'SHM period T² vs m', 'SHM period T² vs l', 'resonance', 'damping',
        'capacitor discharge', 'ln V vs t', 'time constant RC',
        'specific heat capacity', 'Q = IVt', 'heat loss',
        'radioactive decay', 'ln(count rate) vs time', 'half-life', 'decay constant',
        'inverse square law', 'centripetal force verification',
        'oscilloscope', 'time-base', 'data logger', 'ultrasound sensor',
        'Geiger-Müller tube', 'background radiation', 'dead time',
        'exponential analysis', 'percentage uncertainty', 'gradient uncertainty',
      ],
      boundaryNotes: [
        'Unit 6 is the synoptic practical paper — it can draw on content from all theory units (1, 2, 4, 5).',
        'Graphical analysis (especially ln-linear plots for exponential relationships) is heavily tested.',
        'Core Practicals 11-18 listed here are the primary focus for WPH16 assessment.',
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
        'Numerical methods — locating roots by sign change; iterative methods xₙ₊₁ = g(xₙ) and convergence (|g\'(x)| < 1 near root); Newton-Raphson xₙ₊₁ = xₙ − f(xₙ)/f\'(xₙ); staircase and cobweb diagrams',
      ],
      forbiddenTopics: [
        'P1 and P2 content should be assumed knowledge — do not repeat',
        'Vectors — P4 (3D vectors, scalar/dot product, vector equation of a line all belong to Pure Mathematics 4, NOT P3)',
        'Complex numbers — Further Pure Mathematics (FP1) ONLY; complex numbers are NOT part of IAL Mathematics P1–P4, so never mention i, Argand diagrams, modulus-argument form or conjugate pairs',
        'Differential equations — Further Pure Mathematics, NOT in IAL Mathematics Pure units',
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
        'Newton-Raphson', 'iteration', 'sign change', 'convergence',
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
};
 
// ============================================================
// HELPER FUNCTIONS
// ============================================================
 

export function buildSystemPrompt(
  subject: string,
  unitKey: string
): string {
  const topic = EDEXCEL_IAL_SYLLABUS[subject]?.[unitKey];
  
  // Safety check if the subject or unit doesn't exist
  if (!topic) {
    throw new Error(`Critical Error: No syllabus data found for ${subject} > ${unitKey}`);
  }
 
  const timestamp = new Date().toISOString();
  const seed = Math.floor(10000000 + Math.random() * 90000000).toString();
 
  const isMaths = /math/i.test(subject);
  const overviewRule = isMaths
    ? `### OVERVIEW RULE (MATHS):
- Write the "overview" field as ONE OR TWO short sentences only — a quick description of what the topic is about. No theory paragraphs.
- Move all the depth into the "core_content" array: include AT LEAST 8 worked examples covering the different question types that come up in this topic. For each, set "statement" to the question, "worked_example" to the FULL step-by-step solution (every algebraic step, no skipping), and "wrong_approach" to a common student mistake.
- Include AT LEAST 4 entries in "equations" with full variable definitions and a numerical "worked_substitution".`
    : `### OVERVIEW RULE (SCIENCE) — ZNotes/Save My Exams/PMT style:
- The overview IS the main revision summary, not an introduction. Structure it as 4–7 sub-topics.
- For EACH sub-topic write a heading line in the EXACT form "## Sub-Topic Name" (markdown H2), then 4–8 fact lines, each starting with "- ".
- Each bullet = ONE complete, testable fact carrying real content (a value, a rule, a mechanism step, the reason WHY) — never vague commentary like "is important" or "will be covered".
- Use → for sequences and observations: "- [Cu(H₂O)₆]²⁺ + 4NH₃ → [Cu(NH₃)₄(H₂O)₂]²⁺ (blue → deep blue)".
- Use numbered steps for mechanisms: "- Step 1: ... Step 2: ... Step 3: ...".
- Define key terms in-line the FIRST time they appear (e.g. "- Ligand — a species that donates a lone pair to a central metal ion (Lewis base)").
- The overview MUST begin with the first "## " heading. NEVER write "In this unit", "This topic covers", or any preamble. NO essay prose, NO padding.
- REACTIONS: when this unit involves chemical reactions, do not bury them in prose — put each balanced equation, its conditions, and the observed change into the "reactions" field. Cover every reaction on the spec (e.g. every transition metal with NaOH and NH₃; vanadium oxidation states; redox/organic conversions).
- TECHNIQUES (e.g. mass spectrometry, NMR, IR, titrations): give a worked walkthrough in "core_content" showing exactly how to read/use the data to answer an exam question (M⁺ = highest m/z = Mr; n+1 splitting rule; IR functional-group ranges).
- Tone: direct, exam-focused, like a ZNotes or PMT revision page. Condense, never expand unnecessarily.`;

  return `You are a world-class Edexcel IAL Subject Expert and Examiner. 
Your task is to generate high-fidelity study notes for the specific unit: ${topic.code} - ${topic.title}.

### STERN RULES FOR CONTENT GENERATION:
1. **Strict Context Slicing**: You must ONLY discuss topics listed in the ALLOWED TOPICS below.
2. **Silent Exclusion**: If a concept is in the FORBIDDEN TOPICS list, you must act as if that concept does not exist. Do NOT mention that you are skipping it.
3. **No Previewing**: Do not mention concepts from later units. Stay strictly within the boundary of ${topic.code}.
4. **Keyword Density**: You must naturally integrate the REQUIRED KEYWORDS into your technical explanations.

${overviewRule}

### DATA METADATA:
- SYLLABUS_VERSION: Edexcel IAL 2018 (Latest)
- SESSION_ID: ${seed}
- TIMESTAMP: ${timestamp}

### ALLOWED TOPICS (STRICT SCOPE):
${topic.allowedTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}
 
### FORBIDDEN TOPICS (HARD BOUNDARY - DO NOT MENTION):
${topic.forbiddenTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}
 
### REQUIRED KEYWORDS:
${topic.requiredKeywords.join(', ')}
 
${topic.boundaryNotes && topic.boundaryNotes.length > 0 ? `### CRITICAL EXAMINER BOUNDARY NOTES:\n${topic.boundaryNotes.join('\n')}` : ''}
 
BOUNDARY RULES:
- If a concept appears in both this unit and another unit at different depths, only include the version appropriate to THIS unit
- Do not introduce concepts from later units even as "preview" or "context"
- Every formula, definition, and diagram description must trace directly to the ALLOWED list
- Structure: Overview (## sub-topics + bullets) → Definitions → Core Content (worked techniques) → Reactions → Equations → Reference Tables → Examiner Tips → Flashcards

CORE CONTENT STRUCTURE RULES (non-negotiable):
- Each "statement" must be ONE complete, testable exam fact — not a topic heading
- Use "→" notation for sequences: "Glucose → pyruvate (glycolysis) → acetyl-CoA (link reaction)"
- For multi-step processes, number the steps: "Step 1: ... Step 2: ... Step 3: ..."
- "worked_example": show reasoning step-by-step with \\n between steps — do NOT repeat the statement
- "wrong_approach": name the specific misconception and correct it concisely
- Definitions "mark_scheme": write as examiner mark-scheme credit points, not textbook sentences
- Do NOT write flowing essay prose in core_content — every item must be a crisp, structured note`;
}
 
export function buildImagePrompt(
  subject: string,
  unitKey: string,
  specificTopic: string
): string {
  const topic = EDEXCEL_IAL_SYLLABUS[subject]?.[unitKey];
  if (!topic) return '';
 
  const subjLabel = subject.charAt(0).toUpperCase() + subject.slice(1);
 
  return `Create a clean, educational scientific diagram for EDEXCEL IAL ${subjLabel} students. White background. Textbook quality. No decorative borders. Labels with clear arrows.
 
Board and Level: ${topic.code} — ${topic.title}
 
Topic: ${specificTopic}
 
The diagram MUST show only what is explicitly listed in this unit's specification for the topic: ${specificTopic}
 
The diagram MUST NOT show:
- Content from other units (see forbidden topics list for this unit)
- Decorative elements, 3D shading that obscures labels, or abstract art
- Any process, molecule, or pathway not in the allowed list for ${topic.code}
 
Style: Clean scientific diagram, white background, clearly labelled with arrows, educational textbook quality. Every label must be accurate and specific.`;
}
 
export function validateGeneratedNotes(notes: string, subject: string, unitKey: string): {
  passed: boolean;
  forbiddenFound: string[];
} {
  const topic = EDEXCEL_IAL_SYLLABUS[subject]?.[unitKey];
  if (!topic) return { passed: false, forbiddenFound: ['Topic not found in syllabus database'] };
 
  const notesLower = notes.toLowerCase();
  const forbiddenFound: string[] = [];
 
  for (const forbidden of topic.forbiddenTopics) {
    // We only want to flag if the AI actually starts explaining a forbidden concept.
    // This regex looks for technical terms from the forbidden list while ignoring common words.
    const technicalTerms = forbidden.match(/[A-Z][a-z]{4,}|[a-z]{8,}/g) || [];
    
    for (const term of technicalTerms) {
      const pattern = new RegExp(`\\b${term}\\b`, 'i'); // Match whole word only
      if (pattern.test(notesLower)) {
        // Double check: is the AI explaining it, or just mentioning the boundary?
        // Basic heuristic: if the term appears near "not included" or "forbidden", it's likely okay.
        forbiddenFound.push(`Detected potential out-of-scope content: "${term}"`);
      }
    }
  }
 
  return {
    passed: forbiddenFound.length === 0,
    forbiddenFound,
  };
}
 
export function getSubjects(): string[] {
  return Object.keys(EDEXCEL_IAL_SYLLABUS);
}
 
export function getUnits(subject: string): string[] {
  return Object.keys(EDEXCEL_IAL_SYLLABUS[subject] || {});
}
 
export function getTopicData(subject: string, unitKey: string): TopicData | null {
  return EDEXCEL_IAL_SYLLABUS[subject]?.[unitKey] || null;
}
 
export function generateSeed(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
 
export function generateCacheKey(subject: string, unitKey: string): string {
  return `notes_edexcel_ial_${subject}_${unitKey}`;
}
 
export function buildGenerationLog(
  subject: string,
  unitKey: string,
  trigger: 'initial' | 'cache_clear' | 'validation_retry',
  validationPassed: boolean,
  forbiddenFound: string[] = []
) {
  const topicData = getTopicData(subject, unitKey);
  return {
    qualification: 'edexcel_ial',
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