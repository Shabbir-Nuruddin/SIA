// ============================================================
// syllabusData_cie_igcse.ts
// PLACE THIS FILE AT: src/lib/syllabusData_cie_igcse.ts
//
// HOW TO USE:
//   import { CIE_IGCSE_SYLLABUS } from '@/lib/syllabusData_cie_igcse'
//   import { buildSystemPrompt, buildImagePrompt } from '@/lib/syllabusHelpers'
//
// SOURCES (all content verified against official Cambridge specifications):
//
// CIE IGCSE Biology:    Cambridge 0610 Syllabus, Version 1, 2023–2025
//   https://www.cambridgeinternational.org/Images/595426-2023-2025-syllabus.pdf
//   21 topics; Core (Papers 1+3) and Extended/Supplement (Papers 2+4)
//   Practical: Paper 5 (practical exam) or Paper 6 (alternative to practical)
//
// CIE IGCSE Chemistry:  Cambridge 0620 Syllabus, Version 2, 2023–2025
//   https://www.cambridgeinternational.org/Images/595428-2023-2025-syllabus.pdf
//   14 topics; Core (Papers 1+3) and Extended/Supplement (Papers 2+4)
//   Practical: Paper 5 or Paper 6
//
// CIE IGCSE Physics:    Cambridge 0625 Syllabus, Version 1, 2023–2025
//   https://www.cambridgeinternational.org/images/595430-2023-2025-syllabus.pdf
//   5 sections; Core + Supplement; Space Physics is COMPULSORY from 2023
//   Practical: Paper 5 or Paper 6
//
// CIE IGCSE Mathematics: Cambridge 0580 Syllabus, Version 3, 2025–2027
//   https://www.cambridgeinternational.org/Images/662466-2025-2027-syllabus.pdf
//   9 topic areas; Core (Papers 1+3) and Extended (Papers 2+4)
//   NEW 2025: Paper 1 (Core) and Paper 2 (Extended) are non-calculator
//
// GRADING STRUCTURE (sciences 0610/0620/0625):
//   Core:      Papers 1 (MCQ) + 3 (Theory) + 5/6 (Practical) → max Grade C
//   Extended:  Papers 2 (MCQ) + 4 (Theory) + 5/6 (Practical) → Grades A*–G
//   Supplement = content tested on Extended papers only
//
// GRADING STRUCTURE (maths 0580):
//   Core:      Papers 1 (non-calc) + 3 (calc) → Grades C–G
//   Extended:  Papers 2 (non-calc) + 4 (calc) → Grades A*–E
// ============================================================

export interface TopicData {
  code: string;
  title: string;
  tier: 'core_only' | 'supplement_only' | 'both';
  sourceUrl?: string;
  allowedTopics: string[];
  forbiddenTopics: string[];
  requiredKeywords: string[];
  supplementOnlyPoints?: string[];
  practicalSkills?: string[];
  boundaryNotes?: string[];
}

export interface SubjectData {
  [topicKey: string]: TopicData;
}

export interface QualificationData {
  [subject: string]: SubjectData;
}

export const CIE_IGCSE_SYLLABUS: QualificationData = {

  // ============================================================
  // CIE IGCSE BIOLOGY (0610) — 21 Topics
  // Source: Cambridge 0610 Syllabus 2023–2025 Version 1
  // ============================================================
  biology: {

    topic1: {
      code: '0610-T1',
      title: 'Characteristics and Classification of Living Organisms',
      tier: 'both',
      allowedTopics: [
        'Seven characteristics of living organisms (MRS GREN) — Movement (change in position of whole organism or part); Respiration (reactions releasing energy from nutrients); Sensitivity (detect and respond to changes in environment); Growth (permanent increase in size and dry mass); Reproduction (produce offspring, sexually or asexually); Excretion (removal of toxic waste products of metabolism and substances in excess of requirements); Nutrition (taking in materials for energy, growth and development)',
        'Five kingdoms — Animals (multicellular, heterotrophic, no cell wall); Plants (multicellular, autotrophic, cellulose cell wall); Fungi (multicellular or unicellular, saprotrophic, chitin cell wall, no chlorophyll — includes yeast); Prokaryotes/Bacteria (unicellular, no membrane-bound nucleus, 70S ribosomes, circular DNA, peptidoglycan cell wall, no membrane-bound organelles); Protoctists (eukaryotic, mostly unicellular — Chlorella photosynthetic, Amoeba heterotrophic, Plasmodium parasitic)',
        'Viruses — NOT living organisms; do not fit any kingdom; smaller than cells; structure: protein coat (capsid) + nucleic acid core (DNA or RNA); can only reproduce inside living host cells; examples: influenza, HIV, tobacco mosaic virus (TMV)',
        'Vertebrate classes — Fish (gills, scales, ectothermic, eggs in water); Amphibians (moist skin, eggs in water, larval stage); Reptiles (dry scaly skin, waterproof eggs on land); Birds (feathers, wings, endothermic, eggs on land); Mammals (hair/fur, endothermic, viviparous most, suckle young with milk, diaphragm)',
        'Invertebrate groups — Insects (3 body segments: head/thorax/abdomen; 3 pairs legs; 1–2 pairs wings; antennae; exoskeleton); Arachnids (4 pairs legs, 2 body segments, no antennae, no wings); Crustaceans (exoskeleton, 5+ pairs legs, 2 pairs antennae, gills); Myriapods (many legs, long segmented body); Annelids (segmented worms, soft body, e.g. earthworm); Molluscs (soft unsegmented body, usually shell, e.g. snail); Echinoderms (five-fold radial symmetry, spiny skin, e.g. starfish)',
        'Plant groups — Ferns (vascular, spores, leaves = fronds); Conifers (vascular, seeds in cones, usually evergreen); Flowering plants: monocotyledons (1 seed leaf, parallel veins, flower parts in 3s) and dicotyledons (2 seed leaves, branching veins, flower parts in 4s or 5s)',
        'Dichotomous keys — paired statements with two choices; leads to identification; constructing and using keys from observable features',
        'Binomial nomenclature — genus (capitalised) + species (lower case); italic or underlined; universal scientific communication; e.g. Homo sapiens, Felis catus',
      ],
      forbiddenTopics: [
        'Evolutionary relationships and phylogeny — Topic 18 only',
        'Cell ultrastructure detail — Topic 2',
        'Cladistics and molecular phylogeny — beyond 0610 IGCSE',
        'Ecological roles — Topics 19–20',
        'Archaea kingdom — not required at 0610 IGCSE; Prokaryotes = Bacteria only',
      ],
      requiredKeywords: [
        'MRS GREN', 'movement', 'respiration', 'sensitivity', 'growth', 'reproduction', 'excretion', 'nutrition',
        'five kingdoms', 'animals', 'plants', 'fungi', 'prokaryotes', 'protoctists',
        'virus', 'capsid', 'protein coat', 'nucleic acid', 'host cell',
        'vertebrate', 'invertebrate', 'mammal', 'bird', 'reptile', 'amphibian', 'fish',
        'insect', 'arachnid', 'crustacean', 'annelid', 'mollusc',
        'fern', 'conifer', 'monocotyledon', 'dicotyledon',
        'dichotomous key', 'binomial nomenclature', 'genus', 'species',
      ],
      supplementOnlyPoints: [
        'Explain why viruses are not living — no cellular structure; cannot carry out life processes independently; replicate only using host machinery',
        'Justify placement of organisms into kingdoms using specific cell structure features, cell wall composition and nutrition mode',
        'Distinguish between chitin (fungal cell wall) and cellulose (plant cell wall) and peptidoglycan (bacterial cell wall)',
      ],
      practicalSkills: [
        'Construct a dichotomous key from observable features of named organisms',
        'Use a dichotomous key to identify named organisms',
        'Interpret photographs and drawings to classify organisms into correct kingdom/group',
      ],
      boundaryNotes: [
        'Prokaryotes at 0610 = Bacteria only — Archaea NOT required.',
        'Fungi includes yeast (unicellular) — must know this; yeast is NOT a bacterium.',
        'All 7 MRS GREN characteristics must be recalled with full definitions.',
      ],
    },

    topic2: {
      code: '0610-T2',
      title: 'Organisation of the Organism',
      tier: 'both',
      allowedTopics: [
        'Animal cell structure — cell membrane (controls entry/exit); nucleus (contains DNA, controls activities); cytoplasm (site of reactions); mitochondria (aerobic respiration, ATP); ribosomes (protein synthesis)',
        'Plant cell structure — all of above PLUS: cell wall (cellulose — support); chloroplasts (photosynthesis — in photosynthetic cells); large central vacuole with tonoplast (cell sap storage, turgor)',
        'Bacterial cell — no membrane-bound nucleus; 70S ribosomes (smaller than eukaryotic 80S); cell wall of peptidoglycan; circular DNA (no chromosomes); no membrane-bound organelles; may have pili, capsule, flagella',
        'Light microscopy — compound microscope; staining (iodine, methylene blue); magnification = image size ÷ actual size; units: mm → µm (×1000); drawing scientific diagrams (sharp outline, labels, scale bar, no shading)',
        'Electron microscopy — TEM (internal ultrastructure, very high magnification/resolution); SEM (3D surface view); greater resolution than light microscope (shorter wavelength of electrons)',
        'Ultrastructure (Supplement) — rough ER (ribosomes on surface, transports proteins); smooth ER (lipid synthesis, no ribosomes); Golgi apparatus/body (modifies, packages, secretes proteins in vesicles); lysosomes (hydrolytic enzymes, intracellular digestion); centrioles (spindle formation in animal cells)',
        'Levels of organisation — cell → tissue (similar cells, same function) → organ (tissues working together) → organ system → organism',
        'Specialised cells — red blood cells: biconcave disc, no nucleus, haemoglobin, large SA:V ratio; sperm: acrosome (enzymes), mitochondria-rich midpiece, flagellum; ciliated epithelial: cilia move mucus; root hair cells: long projection (SA), mitochondria (active transport); palisade mesophyll: many chloroplasts, cylindrical close-packed; guard cells: control stomata opening/closing',
      ],
      forbiddenTopics: [
        'Protein synthesis mechanism (transcription/translation) — Topic 17',
        'DNA replication — Topic 17',
        'Cell division mitosis/meiosis — Topics 16, 17',
        'ATP synthesis mechanism — Topic 12',
        'Photosynthesis light-dependent/independent reactions — Topic 6',
      ],
      requiredKeywords: [
        'cell membrane', 'nucleus', 'cytoplasm', 'mitochondria', 'ribosomes',
        'cell wall', 'chloroplast', 'vacuole', 'tonoplast', 'cellulose', 'peptidoglycan',
        'magnification', 'actual size', 'resolution', 'TEM', 'SEM',
        'tissue', 'organ', 'organ system',
        'biconcave', 'haemoglobin', 'no nucleus', 'acrosome', 'flagellum',
        'root hair', 'surface area', 'palisade mesophyll', 'guard cells', 'stomata',
        'rough ER', 'smooth ER', 'Golgi', 'lysosomes', 'centrioles',
      ],
      supplementOnlyPoints: [
        'Describe ultrastructure organelles seen in electron micrographs: rough ER, smooth ER, Golgi, lysosomes, centrioles — state function of each',
        'Describe secretory pathway: proteins synthesised on ribosomes → enter rER lumen → transported in vesicles to Golgi → modified and packaged → secreted',
        'Explain why each specialised cell is adapted for its function — linking each structural feature to function',
      ],
      practicalSkills: [
        'Prepare and stain temporary mounts of onion epidermis (iodine) and cheek cells (methylene blue)',
        'Draw labelled scientific diagrams from microscope observations with scale bar',
        'Calculate magnification and actual size from scale bars or given magnification',
        'Identify organelles in electron micrographs',
      ],
      boundaryNotes: [
        'Magnification formula: magnification = image size ÷ actual size — units MUST match.',
        'Plant cells do NOT all have chloroplasts — root cells, for example, have no chloroplasts.',
        'Supplement students must know all ultrastructure organelles and their functions.',
      ],
    },

    topic3: {
      code: '0610-T3',
      title: 'Movement Into and Out of Cells',
      tier: 'both',
      allowedTopics: [
        'Diffusion — net movement of molecules/ions from high to low concentration; passive (no ATP); rate affected by concentration gradient (steeper = faster), temperature (higher = faster), surface area (larger = faster), diffusion distance (shorter = faster); examples: O₂ and CO₂ at alveoli, glucose from gut into blood',
        'Osmosis — diffusion of water molecules through selectively permeable membrane from region of higher water potential (more dilute) to lower water potential (more concentrated); no energy required',
        'Plant cell osmosis — turgid (water enters → vacuole swells → presses against wall → firm cell; wall pressure prevents further entry); flaccid (water leaves → vacuole shrinks → cell soft → wilts); plasmolysis (extreme water loss → cell membrane pulls away from cell wall → protoplast shrinks); incipient plasmolysis = point where plasmolysis just begins',
        'Animal cell osmosis — crenation (water leaves in concentrated/hypertonic solution → cell shrivels); lysis (water enters in dilute/hypotonic solution → cell swells and bursts)',
        'Active transport — movement from low to high concentration (against gradient); requires ATP from respiration; requires specific carrier proteins; examples: NO₃⁻ and K⁺ uptake by root hair cells; glucose reabsorption in kidney; Na⁺/K⁺ in nerve cells',
        'Comparison — diffusion and osmosis: passive, no ATP, down gradient; active transport: requires ATP, against gradient, carrier proteins; osmosis: only water, through selectively permeable membrane',
      ],
      forbiddenTopics: [
        'Water potential ψ, ψₛ, ψₚ notation — NOT used in 0610 IGCSE; use "more/less dilute"',
        'Facilitated diffusion by channel proteins — not explicitly in 0610 spec',
        'Na⁺/K⁺ ATPase detailed mechanism — beyond 0610',
        'Co-transport and sodium-glucose symporter — beyond 0610',
        'Endocytosis/exocytosis (bulk transport) — beyond 0610',
      ],
      requiredKeywords: [
        'diffusion', 'concentration gradient', 'passive', 'net movement',
        'osmosis', 'selectively permeable membrane', 'water potential', 'dilute', 'concentrated',
        'turgid', 'flaccid', 'plasmolysis', 'incipient plasmolysis', 'wall pressure',
        'crenation', 'lysis', 'hypertonic', 'hypotonic',
        'active transport', 'ATP', 'carrier proteins', 'against concentration gradient',
      ],
      supplementOnlyPoints: [
        'Explain turgidity as mechanical support in herbaceous (non-woody) plants',
        'Explain guard cell mechanism in detail: light → K⁺ absorbed → water potential decreases → water enters by osmosis → turgid → stomata open; reverses in dark',
        'Explain why plant cells do not lyse in pure water (cell wall resists expansion with wall pressure) unlike animal cells',
      ],
      practicalSkills: [
        'Investigate osmosis with potato cylinders in sucrose solutions — measure % mass change vs concentration; find isotonic point',
        'Investigate plasmolysis in plant cells under microscope — observe membrane pulling from wall',
        'Calculate % change in mass: (change ÷ original mass) × 100',
        'Investigate diffusion using agar cubes with different SA:V ratios',
      ],
      boundaryNotes: [
        'DO NOT use ψ notation — say "more dilute" or "higher water potential" descriptively.',
        'Incipient plasmolysis IS in the spec — know exact definition: point at which cell membrane just begins to pull away from cell wall.',
      ],
    },

    topic4: {
      code: '0610-T4',
      title: 'Biological Molecules',
      tier: 'both',
      allowedTopics: [
        'Carbohydrates — C, H, O; monosaccharides: glucose, fructose, galactose; disaccharides: maltose, sucrose, lactose (condensation reactions); polysaccharides: starch (energy storage, plants), glycogen (energy storage, animals/fungi), cellulose (structural, plant cell walls)',
        'Proteins — C, H, O, N, often S; amino acids joined by peptide bonds; diverse 3D shapes; functions: enzymes, antibodies, haemoglobin, structural proteins (collagen, keratin), hormones (e.g. insulin)',
        'Lipids — C, H, O; fatty acids + glycerol joined by ester bonds; energy storage, insulation, cell membranes (phospholipids), fat-soluble vitamin solvent; fats solid, oils liquid at room temperature',
        'Water — H and O; solvent for reactions, transport medium, reactant (photosynthesis, hydrolysis), coolant (high specific heat capacity and latent heat), provides turgor in plant cells',
        'Food tests — Benedict\'s (reducing sugars): blue → brick red (heat); semi-quantitative: brick red > orange > yellow > green = more sugar; non-reducing sugar test: boil with dilute HCl → neutralise with NaHCO₃ → then Benedict\'s; iodine (starch): orange-brown → blue-black; biuret (protein): add NaOH then dilute CuSO₄ → blue → purple/lilac; ethanol emulsion test (lipid): dissolve in ethanol, add water → cloudy white emulsion',
        'Balanced diet — carbohydrate (energy); protein (growth, repair, enzymes, antibodies); fat (energy, membranes, insulation); vitamins: A (rhodopsin, night vision), C (collagen, immune), D (calcium absorption, bone); minerals: Ca (bones/teeth), Fe (haemoglobin), I (thyroid hormones); fibre (prevents constipation, bowel cancer); water (metabolic processes)',
        'Malnutrition — kwashiorkor (protein deficiency: oedema, wasting, distended abdomen, hair changes); marasmus (protein + energy deficiency: severe wasting); scurvy (vitamin C: bleeding gums, poor wound healing); rickets (vitamin D: soft bowed bones in children); anaemia (iron: low Hb → fatigue, pallor); obesity (excess energy: fat deposit → T2 diabetes, CVD, hypertension)',
      ],
      forbiddenTopics: [
        'Carbohydrate synthesis/breakdown pathways (glycolysis, Krebs) — Topic 12',
        'Enzyme active site and kinetics — Topic 5',
        'DNA/RNA structure — Topic 17',
        'Phospholipid bilayer fluid mosaic detail — Topic 2',
        'Detailed protein synthesis — Topic 17',
      ],
      requiredKeywords: [
        'carbohydrate', 'glucose', 'monosaccharide', 'disaccharide', 'polysaccharide',
        'starch', 'glycogen', 'cellulose', 'condensation', 'hydrolysis',
        'protein', 'amino acid', 'peptide bond', 'enzyme', 'antibody', 'haemoglobin',
        'lipid', 'fatty acid', 'glycerol', 'ester bond',
        'Benedict\'s', 'brick red', 'iodine', 'blue-black', 'biuret', 'purple', 'emulsion', 'cloudy white',
        'kwashiorkor', 'marasmus', 'scurvy', 'rickets', 'anaemia', 'obesity',
      ],
      supplementOnlyPoints: [
        'Starch structure: amylose (unbranched, helical) vs amylopectin (branched) — link to function',
        'Glycogen is highly branched → rapid breakdown → quick energy release',
        'Saturated fatty acids (no C=C, solid) vs unsaturated (one or more C=C, liquid/oil); high saturated fat → increased CVD risk',
        'Amino acid structure: NH₂ group, COOH group, R group (variable), central C',
        'Role of water as solvent, transport medium, reactant and coolant',
      ],
      practicalSkills: [
        'Carry out food tests (Benedict\'s, iodine, biuret, emulsion) on unknown food samples',
        'Investigate energy content of food by calorimetry — burn food, heat water, calculate energy',
        'Use chromatography to separate and identify food dyes or amino acids',
      ],
      boundaryNotes: [
        'Biuret test: NaOH FIRST then dilute CuSO₄ — NOT added simultaneously.',
        'Non-reducing sugar (sucrose) test: must include acid hydrolysis + neutralisation step before Benedict\'s.',
        'Semi-quantitative Benedict\'s: green → yellow → orange → brick red = increasing concentration.',
      ],
    },

    topic5: {
      code: '0610-T5',
      title: 'Enzymes',
      tier: 'both',
      allowedTopics: [
        'Enzymes as biological catalysts — proteins; speed up reactions without being consumed; specific; substrate = substance they act on; lower activation energy; found in and outside cells',
        'Active site — specific 3D shape; complementary to substrate; enzyme-substrate complex forms → product released → enzyme unchanged; can catalyse again',
        'Lock-and-key model (Core) — active site fixed shape; substrate fits precisely; complex forms; products do not fit; enzyme released unchanged',
        'Induced fit model (Supplement) — active site is flexible; substrate binding induces conformational change in active site to mould around substrate; better explains specificity and reduced activation energy',
        'Effect of temperature — increasing temperature from 0°C: rate increases (more KE → more ES collisions per unit time); optimum (~37°C for human enzymes): maximum rate; above optimum: H-bonds and other bonds maintaining 3D structure break → active site changes shape (denaturation) → substrate cannot fit → rate = 0; denaturation is permanent and irreversible; graph: curve rises then falls sharply at denaturation point',
        'Effect of pH — each enzyme has optimum pH; deviation: H⁺ and OH⁻ ions disrupt bonds maintaining shape → active site altered → denaturation at extremes; examples: pepsin (pH 2), amylase (pH 7), arginase (pH 9.5); graph: bell-shaped curve peaking at optimum',
        'Effect of substrate concentration — low concentration: rate increases as [S] increases (more ES complexes formed); high concentration: plateau (all active sites occupied/saturated → Vmax); graph: hyperbola flattening to plateau',
        'Digestive enzymes — amylase (salivary glands + pancreas): starch → maltose; protease/pepsin (stomach): proteins → polypeptides (pH 2, activated by HCl); trypsin (pancreas): polypeptides → amino acids (pH 8); lipase (pancreas): lipids → fatty acids + glycerol',
        'Industrial uses — biological washing powders (proteases + lipases, work at low temperature); food industry (amylase: starch → glucose; lactase: lactose → glucose + galactose for lactose-free milk; pectinase: clarifies juice; isomerase: glucose → fructose); immobilised enzymes (on beads/gel): reusable, product uncontaminated',
      ],
      forbiddenTopics: [
        'Competitive and non-competitive inhibition — beyond 0610 IGCSE',
        'Allosteric regulation and feedback inhibition — beyond 0610',
        'Coenzymes and cofactors — beyond 0610',
        'Km and Michaelis-Menten kinetics — beyond 0610',
      ],
      requiredKeywords: [
        'biological catalyst', 'substrate', 'active site', 'enzyme-substrate complex', 'product',
        'lock-and-key', 'induced fit', 'specificity', 'complementary',
        'optimum temperature', 'denaturation', 'irreversible',
        'optimum pH', 'bell-shaped curve',
        'substrate concentration', 'saturation', 'Vmax', 'plateau',
        'amylase', 'starch', 'maltose', 'protease', 'pepsin', 'trypsin', 'lipase',
        'immobilised enzymes', 'biological washing powder',
      ],
      supplementOnlyPoints: [
        'Induced fit: explain how active site changes conformation on substrate binding; why this is a better model than lock-and-key',
        'Denaturation at molecular level: H-bonds, ionic bonds, hydrophobic interactions and disulfide bonds that maintain tertiary structure all disrupted',
        'Explain enzyme activity changes in terms of BOTH collision frequency AND shape changes',
      ],
      practicalSkills: [
        'Investigate effect of temperature on enzyme activity (amylase + starch with iodine; catalase + H₂O₂)',
        'Investigate effect of pH using buffer solutions',
        'Investigate effect of substrate concentration on rate',
        'Identify independent, dependent and controlled variables; write null hypothesis; plan controls',
        'Use colorimetry to measure enzyme reaction rates quantitatively',
      ],
      boundaryNotes: [
        'Induced fit is SUPPLEMENT only — must clearly distinguish from lock-and-key model.',
        'Denaturation = PERMANENT structural change to protein — never say "killed" or "melted".',
        'Graph shapes: temperature = curve with sharp fall; pH = bell curve; [S] = rectangular hyperbola.',
      ],
    },

    topic6: {
      code: '0610-T6',
      title: 'Plant Nutrition',
      tier: 'both',
      allowedTopics: [
        'Photosynthesis equation — 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂; light energy absorbed by chlorophyll; occurs in chloroplasts',
        'Requirements — light (energy); carbon dioxide (raw material via stomata); water (raw material via roots/xylem); chlorophyll (light-absorbing pigment)',
        'Uses of glucose — respiration (energy); starch (storage); cellulose (cell walls); sucrose (phloem transport); fats/oils (seed storage); amino acids + proteins (with nitrate ions)',
        'Leaf structure — upper epidermis (transparent, waxy cuticle); palisade mesophyll (densely packed, many chloroplasts near surface, main photosynthesis zone); spongy mesophyll (loosely packed, large air spaces for gas diffusion); lower epidermis (guard cells + stomata); vascular bundles (xylem + phloem)',
        'Guard cells and stomata — kidney-shaped (dicots) or dumbbell-shaped (monocots); contain chloroplasts; in light: guard cells absorb K⁺ → water follows by osmosis → turgid → stomata open → CO₂ in; in dark: K⁺ leaves → flaccid → stomata close → reduces water loss; mainly on lower epidermis',
        'Limiting factors — light intensity: rate increases until another factor limits (graph plateaus); CO₂ concentration: similar pattern; temperature: increases rate to optimum (enzymes), then falls (denaturation); interaction of all three in commercial glasshouses',
        'Starch test — destarch (dark 48h); treat differently (cover, variegated, NaOH for CO₂ removal); boil in water; clear in hot ethanol; rinse in water; add iodine; blue-black = starch present → demonstrates light, chlorophyll, CO₂ all required',
        'Mineral ions — nitrates (NO₃⁻): amino acid and protein synthesis; deficiency: stunted growth, yellowing (chlorosis); magnesium (Mg²⁺): chlorophyll synthesis; deficiency: interveinal yellowing (interveinal chlorosis)',
      ],
      forbiddenTopics: [
        'Z-scheme, photosystems I and II, electron transport chain — beyond 0610',
        'Calvin cycle intermediates (RuBP, GP, GALP, RuBisCO) — beyond 0610 (simplified description only in Supplement)',
        'Cyclic/non-cyclic photophosphorylation — beyond 0610',
        'C4 and CAM pathways — beyond 0610',
        'Photorespiration — beyond 0610',
      ],
      requiredKeywords: [
        'photosynthesis', 'chlorophyll', 'light energy', 'CO₂', 'water', 'glucose', 'oxygen',
        'chloroplast', 'palisade mesophyll', 'spongy mesophyll', 'guard cells', 'stomata',
        'limiting factor', 'light intensity', 'temperature', 'CO₂ concentration',
        'iodine', 'blue-black', 'destarch', 'ethanol', 'starch test',
        'nitrate', 'magnesium', 'chlorosis', 'interveinal',
      ],
      supplementOnlyPoints: [
        'Light-dependent stage (simplified): chlorophyll absorbs light; photolysis of water releases O₂; ATP and reduced NADP produced',
        'Light-independent stage/Calvin cycle (simplified): CO₂ fixed by RuBisCO; ATP and reduced NADP used to produce organic compounds including glucose',
        'Explain plateau on photosynthesis/light intensity graph: another factor becomes limiting',
        'Commercial glasshouse manipulation: raising CO₂, temperature and light intensity to overcome limiting factors',
      ],
      practicalSkills: [
        'Investigate effect of light intensity on photosynthesis using Elodea — count bubbles or gas syringe; apply inverse square law (intensity ∝ 1/d²)',
        'Investigate effect of CO₂ concentration using bicarbonate indicator',
        'Test leaves for starch (full method: destarch → boil → ethanol → rinse → iodine)',
        'Chromatography of leaf pigments — calculate Rf values for chlorophyll a/b, xanthophyll, carotene',
        'Investigate effect of different wavelengths on photosynthesis rate using coloured filters',
      ],
      boundaryNotes: [
        'Light-dependent and light-independent reactions are Supplement but only simplified — NOT the detailed biochemistry.',
        'Starch test method must be in correct order — Paper 5/6 assessed.',
        'Plateau on graph: always explain as "another factor limiting" not just "rate levels off".',
      ],
    },

    topic7: {
      code: '0610-T7',
      title: 'Human Nutrition',
      tier: 'both',
      allowedTopics: [
        'Digestive system — alimentary canal: mouth, oesophagus, stomach, small intestine (duodenum → ileum), large intestine (colon, rectum), anus; associated organs: salivary glands, liver, gallbladder, pancreas',
        'Mechanical digestion — teeth: incisors (cut/bite), canines (tear), premolars/molars (crush/grind); tongue mixes; churning in stomach; all increase surface area for enzymes',
        'Chemical digestion — amylase (salivary glands + pancreas): starch → maltose (pH 7); pepsin (stomach): proteins → polypeptides (pH 2, HCl activates); trypsin (pancreas): polypeptides → amino acids (pH 8); lipase (pancreas): lipids → fatty acids + glycerol (duodenum, pH 7–8)',
        'Bile — produced in liver from RBC breakdown; stored in gallbladder; released into duodenum; bile salts emulsify lipids (NOT enzyme — physical process: large fat globules → small droplets → increased SA for lipase); bile alkaline → neutralises stomach acid → optimum pH for pancreatic enzymes',
        'Absorption — ileum is main absorption site; villi: large SA; epithelial single layer (short diffusion distance); blood capillaries (absorb glucose, amino acids, water, minerals → portal vein → liver); lacteals (absorb fatty acids + glycerol → reform triglycerides → lymph → blood); goblet cells produce mucus',
        'Liver functions — bile production; deamination (excess amino acids → ammonia → urea); glycogen storage; detoxification; plasma protein production; blood glucose regulation',
        'Egestion — removal of undigested material (cellulose/fibre) as faeces; distinct from excretion (metabolic waste) and secretion',
        'Deficiency — protein (kwashiorkor, marasmus); vitamin C (scurvy); vitamin D (rickets); iron (anaemia); obesity',
      ],
      forbiddenTopics: [
        'Sodium-glucose co-transporter mechanism — beyond 0610',
        'Cholesterol/LDL/HDL metabolism — beyond 0610',
        'Hormonal control of digestion (gastrin, secretin, CCK) — beyond 0610',
        'Ornithine cycle in detail — beyond 0610 (only state ammonia → urea in liver)',
      ],
      requiredKeywords: [
        'incisors', 'canines', 'molars', 'salivary amylase', 'peristalsis',
        'pepsin', 'HCl', 'trypsin', 'lipase', 'duodenum', 'ileum',
        'bile', 'emulsification', 'not a chemical digestion', 'alkaline',
        'villi', 'microvilli', 'single layer', 'capillaries', 'lacteal', 'portal vein',
        'absorption', 'assimilation', 'egestion',
        'liver', 'deamination', 'urea', 'glycogen', 'detoxification',
      ],
      supplementOnlyPoints: [
        'Peristalsis: circular and longitudinal muscle layers; wave-like contractions push food along canal',
        'Detailed fatty acid/glycerol pathway: reform triglycerides in epithelial cells → chylomicrons → lacteals → lymph → thoracic duct → blood',
        'Liver deamination detail: amino group removed → ammonia + keto-acid; ammonia toxic → converted to urea',
      ],
      practicalSkills: [
        'Dissect and identify structures of mammalian digestive system',
        'Investigate amylase action on starch at different temperatures and pH values',
        'Test food samples with all four food tests',
        'Investigate effect of bile salts on lipase digestion rate',
      ],
      boundaryNotes: [
        'Bile does NOT contain enzymes — emulsification is a PHYSICAL process.',
        'Absorption = movement into blood/lymph; assimilation = cellular use of absorbed nutrients.',
        'Peristalsis is Supplement — must describe two muscle layers and wave-like motion.',
      ],
    },

    topic8: {
      code: '0610-T8',
      title: 'Transport in Plants',
      tier: 'both',
      allowedTopics: [
        'Xylem — transports water and dissolved mineral ions upward from roots; dead hollow vessels with lignified walls; no end walls; continuous column; unidirectional; lignin deposited in rings or spirals',
        'Phloem — transports sucrose and amino acids (organic solutes) from source (leaves) to sink (roots, growing regions, storage organs); translocation; living cells: sieve tube elements + companion cells; bidirectional',
        'Water uptake — root hair cells: long thin extension into soil, large SA; water enters by osmosis (soil water potential > root hair); mineral ions by active transport; water moves across root cortex toward xylem',
        'Transpiration — evaporation of water from leaf surfaces mainly through stomata; water vapour exits into air; cools leaf; transports minerals; provides water for photosynthesis',
        'Factors affecting transpiration rate — light (stomata open → faster); temperature (faster evaporation → faster); humidity (lower humidity → steeper gradient → faster); wind speed (removes humid air → faster); leaf surface area (more area → faster)',
        'Potometer — measures water uptake by shoot (proxy for transpiration); air bubble method; limitations: uptake ≠ exactly transpiration; compare rates under different conditions',
        'Xerophyte adaptations (Supplement) — thick waxy cuticle (reduces evaporation through epidermis); sunken stomata (traps humid air in pit); rolled leaves (humid air trapped inside); reduced leaf area; CAM (stomata open at night when cooler)',
      ],
      forbiddenTopics: [
        'Apoplast and symplast pathways by name — beyond 0610',
        'Casparian strip — beyond 0610',
        'Mass flow hypothesis (phloem) in full detail — beyond 0610',
        'Root pressure as a detailed mechanism — beyond 0610',
      ],
      requiredKeywords: [
        'xylem', 'lignin', 'dead cells', 'hollow', 'unidirectional',
        'phloem', 'sieve tube', 'companion cell', 'translocation', 'sucrose', 'bidirectional',
        'root hair', 'osmosis', 'active transport', 'mineral ions',
        'transpiration', 'evaporation', 'stomata', 'water vapour',
        'light', 'temperature', 'humidity', 'wind', 'surface area',
        'potometer', 'air bubble', 'water uptake', 'proxy',
        'xerophyte', 'waxy cuticle', 'sunken stomata', 'rolled leaves',
      ],
      supplementOnlyPoints: [
        'Cohesion-tension theory: transpiration creates tension at xylem top; cohesion (H-bonds between water molecules) pulls continuous water column upward; adhesion to xylem walls also helps',
        'Translocation requires metabolic energy from companion cells; source-to-sink direction can reverse',
        'Explain each xerophyte adaptation in terms of which component of the water loss pathway it reduces',
      ],
      practicalSkills: [
        'Set up and use potometer — measure transpiration rate under different conditions (light, wind, humidity)',
        'Investigate stomatal density on upper vs lower leaf surfaces using microscopy',
        'Draw and label TS of stem and root showing xylem and phloem positions',
      ],
      boundaryNotes: [
        'Cohesion-tension theory IS in 0610 Supplement — must explain H-bonding and tension mechanism.',
        'Potometer measures water UPTAKE, not transpiration — must state this limitation.',
        'Phloem transports sucrose AND amino acids — not sucrose alone.',
      ],
    },

    topic9: {
      code: '0610-T9',
      title: 'Transport in Animals',
      tier: 'both',
      allowedTopics: [
        'Need for transport system — cells far from exchange surfaces in multicellular organisms; diffusion too slow over large distances; mass transport overcomes diffusion limitation',
        'Heart structure — right atrium (deoxygenated blood from vena cava), right ventricle (to lungs via pulmonary artery), left atrium (oxygenated from lungs via pulmonary veins), left ventricle (to body via aorta; thick wall — pumps against high pressure); tricuspid valve (right AV), bicuspid/mitral valve (left AV); semilunar valves in aorta and pulmonary artery; coronary arteries supply myocardium',
        'Cardiac cycle — diastole: heart relaxes, atria fill; atrial systole: atria contract → ventricles fill; ventricular systole: ventricles contract → blood to arteries; AV valves close (lub sound); semilunar valves close (dub sound); pulse = arterial wall expansion with each heartbeat',
        'Double circulation — pulmonary (right heart → lungs → left heart); systemic (left heart → body → right heart); advantages: high pressure maintained in systemic; oxygenated/deoxygenated blood separated',
        'Blood vessels — arteries (away from heart): thick muscular elastic wall, narrow lumen, high pressure, pulsatile; veins (toward heart): thin wall, wide lumen, low pressure, valves; capillaries (exchange): one cell thick, large total SA, very narrow lumen',
        'Blood components — erythrocytes (red blood cells): biconcave disc, no nucleus, packed with haemoglobin (Hb + O₂ ⇌ oxyhaemoglobin); leucocytes: phagocytes (engulf pathogens) and lymphocytes (produce antibodies); platelets (cell fragments, clotting); plasma (water — carries glucose, amino acids, urea, CO₂, hormones, fibrinogen, antibodies, mineral ions)',
        'Haemoglobin — loads O₂ in lungs (high pO₂); releases O₂ in respiring tissues (low pO₂); CO₂ transported: dissolved in plasma; as carbaminohaemoglobin; mainly as HCO₃⁻ in plasma',
        'CHD — coronary arteries blocked by atherosclerotic plaques → angina or myocardial infarction; risk factors: diet (saturated fat, salt), smoking, physical inactivity, hypertension, obesity, genetics, age',
      ],
      forbiddenTopics: [
        'Tissue fluid formation (Starling forces, oncotic pressure) — beyond 0610',
        'ECG detailed interpretation — beyond 0610',
        'Bohr effect and O₂ dissociation curve — Supplement only',
        'Chloride shift mechanism — Supplement only',
        'ABO genetics — Topic 17',
      ],
      requiredKeywords: [
        'right atrium', 'right ventricle', 'left atrium', 'left ventricle',
        'tricuspid', 'bicuspid', 'semilunar', 'aorta', 'vena cava', 'pulmonary',
        'systole', 'diastole', 'cardiac cycle', 'double circulation',
        'artery', 'vein', 'capillary', 'valves',
        'erythrocyte', 'haemoglobin', 'oxyhaemoglobin', 'biconcave', 'no nucleus',
        'phagocyte', 'lymphocyte', 'platelet', 'plasma', 'fibrinogen',
        'coronary heart disease', 'atherosclerosis', 'risk factors',
      ],
      supplementOnlyPoints: [
        'Bohr effect: CO₂ in respiring tissues lowers pH → reduces Hb affinity for O₂ → O₂ released more readily',
        'O₂ dissociation curve: sigmoid shape; Bohr shift right with increased CO₂; foetal Hb curve shifted left (higher affinity → takes O₂ from maternal blood)',
        'CO₂ transport: dissolved in plasma; carbaminohaemoglobin; mainly HCO₃⁻ (carbonic anhydrase: CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻; Cl⁻ enters = chloride shift)',
        'Tissue fluid formation: blood pressure forces fluid from capillaries; oncotic pressure draws back; excess via lymph',
      ],
      practicalSkills: [
        'Dissect and examine mammalian heart — identify chambers, valves, vessels, wall thickness difference',
        'Examine slides/micrographs of artery, vein, capillary — identify from wall structure',
        'Investigate effect of exercise on heart rate and recovery time',
        'Examine blood smears — identify RBCs, WBC types, platelets',
      ],
      boundaryNotes: [
        'Bohr effect and O₂ dissociation curve are SUPPLEMENT only.',
        'Left ventricle wall thicker than right: pumps to whole body (higher resistance → higher pressure required).',
        'Chloride shift is Supplement only.',
      ],
    },

    topic10: {
      code: '0610-T10',
      title: 'Diseases and Immunity',
      tier: 'both',
      allowedTopics: [
        'Pathogens — bacteria (Salmonella, S. pneumoniae, M. tuberculosis); viruses (HIV, influenza, measles); fungi (Tinea — athlete\'s foot); protoctists (Plasmodium — malaria)',
        'Transmission — droplet inhalation (influenza, TB); contaminated food/water (Salmonella, cholera); sexual contact (HIV, gonorrhoea); vector: female Anopheles mosquito (malaria/Plasmodium injected with saliva); contaminated blood/needles (HIV)',
        'Malaria — Plasmodium (protoctist); vector: female Anopheles; symptoms: cyclic fever; control: drain standing water; insecticide-treated bed nets; insecticides; antimalarial drugs; repellents',
        'HIV and AIDS — retrovirus; infects and destroys T-helper (CD4+) lymphocytes; immune system fails → AIDS; transmission: sex, blood, mother to child; treatment: antiretroviral drugs (do not cure); prevention: condoms, needle exchange, testing',
        'Non-specific defences — skin (keratinised barrier, sebum antibacterial); mucus + cilia (airways, trap/sweep pathogens); stomach acid (HCl kills pathogens); phagocytosis: engulf → phagosome + lysosome → phagolysosome → hydrolytic enzymes destroy pathogen',
        'Humoral immunity — antigen triggers specific B lymphocyte; clonal selection (antigen binds B cell receptor); clonal expansion (mitosis → large clone); plasma cells secrete antibodies; memory B cells remain for secondary response',
        'Antibody structure — Y-shaped glycoprotein; heavy + light chains; variable region (antigen-binding site, unique, complementary to one antigen); constant region; agglutination (antibodies cross-link antigens → clumps); neutralisation',
        'Cell-mediated immunity — T helper cells (CD4+): secrete cytokines, activate B cells and cytotoxic T cells; cytotoxic T cells (CD8+): kill infected cells (perforin → pores → lysis + apoptosis); T memory cells',
        'Primary vs secondary immune response — primary: slow, lower antibody titre; secondary: faster, higher titre (memory B and T cells); basis for vaccination',
        'Vaccination — antigen introduced (dead/weakened/fragment/mRNA) → primary immune response → memory cells → secondary response if antigen reencountered; herd immunity: sufficient population vaccinated → pathogen cannot spread; types: live attenuated, inactivated, subunit, mRNA',
        'Antibiotics — kill bacteria; do NOT work against viruses (no cell wall/70S ribosomes); antibiotic resistance by natural selection; MRSA; mechanisms: altered target, β-lactamase, efflux pumps, reduced permeability',
      ],
      forbiddenTopics: [
        'Detailed HIV replication (reverse transcriptase, integrase mechanism) — beyond 0610',
        'Complement system — beyond 0610',
        'MHC class I/II antigen presentation — beyond 0610',
        'Monoclonal antibody PRODUCTION (hybridoma) — not in 0610; only uses allowed',
        'T-regulatory cells in detail — beyond 0610',
      ],
      requiredKeywords: [
        'pathogen', 'Plasmodium', 'Anopheles', 'vector', 'transmission',
        'HIV', 'AIDS', 'T-helper cells', 'CD4', 'antiretroviral',
        'phagocytosis', 'phagosome', 'lysosome', 'phagolysosome',
        'antigen', 'antibody', 'B lymphocyte', 'T lymphocyte',
        'clonal selection', 'clonal expansion', 'plasma cells', 'memory cells',
        'variable region', 'constant region', 'agglutination',
        'primary response', 'secondary response', 'antibody titre',
        'vaccination', 'herd immunity',
        'antibiotic', 'antibiotic resistance', 'natural selection', 'MRSA',
      ],
      supplementOnlyPoints: [
        'Antibiotic resistance mechanism: random mutation → resistant variant → antibiotic kills susceptible → resistant survive and reproduce → allele frequency increases',
        'Monoclonal antibody uses: pregnancy tests, ELISA, targeted cancer therapy (Herceptin for HER2+)',
        'Opsonisation: antibodies coat pathogens making them easier for phagocytes to recognise and engulf',
      ],
      practicalSkills: [
        'Investigate antibiotic effectiveness on bacteria using agar plates — measure zones of inhibition (Kirby-Bauer)',
        'Use aseptic technique: autoclave, flaming loops, not opening plates',
        'Interpret graphs of primary and secondary immune responses',
        'Evaluate vaccine efficacy data from studies',
      ],
      boundaryNotes: [
        'Monoclonal antibody PRODUCTION is NOT in 0610 — only their uses.',
        'HIV: only need to know it destroys T-helper cells causing AIDS — not detailed replication.',
        'Antibiotic resistance by natural selection IS Supplement content.',
      ],
    },

    topic11: {
      code: '0610-T11',
      title: 'Gas Exchange in Humans',
      tier: 'both',
      allowedTopics: [
        'Structure — trachea (C-shaped cartilage rings); bronchi; bronchioles; alveoli (~300 million); alveoli surrounded by capillary network; ciliated epithelium + goblet cells line airways',
        'Alveoli features — large total surface area; one cell thick walls (short diffusion distance); moist lining (gases dissolve); rich blood supply (maintains steep gradient); good ventilation',
        'Ventilation — inspiration: external intercostal muscles contract → ribs up and out; diaphragm contracts → flattens → thorax volume increases → pressure falls → air in; expiration: muscles relax; elastic recoil; thorax volume decreases → pressure rises → air out; forced expiration: internal intercostals contract',
        'Gas exchange at alveoli — O₂: higher in alveolar air → lower in blood → diffuses in; CO₂: higher in blood → lower in alveolar air → diffuses out; gradients maintained by ventilation and blood flow',
        'Gas exchange in other organisms — fish: gill lamellae; counter-current exchange (blood flows opposite to water → maintains gradient along full length → more efficient than parallel flow); insects: spiracles → tracheae → tracheoles → cells (gas moves by diffusion; no haemoglobin needed)',
        'Effects of smoking — nicotine: addictive, increases HR + BP, vasoconstriction; tar: destroys/paralyses cilia → mucus accumulates → chronic bronchitis; carcinogens → DNA mutations → lung cancer; emphysema: tar breaks down alveolar walls → reduced SA → breathlessness; CO: binds Hb (250× affinity) → carboxyhaemoglobin → reduced O₂ transport → CVD',
      ],
      forbiddenTopics: [
        'Surfactant — beyond 0610',
        'Type I and Type II pneumocytes — beyond 0610',
        'Spirometry (FVC, FEV₁) — beyond 0610',
        'Neural control of breathing rate (medulla oblongata, chemoreceptors) — beyond 0610',
      ],
      requiredKeywords: [
        'trachea', 'bronchi', 'bronchioles', 'alveoli', 'cartilage', 'surface area',
        'one cell thick', 'moist', 'capillaries', 'concentration gradient',
        'external intercostal muscles', 'diaphragm', 'thorax volume', 'atmospheric pressure',
        'inspiration', 'expiration', 'counter-current', 'gill lamellae',
        'spiracles', 'tracheoles', 'diffusion',
        'nicotine', 'tar', 'carcinogen', 'lung cancer', 'emphysema', 'bronchitis',
        'carbon monoxide', 'carboxyhaemoglobin',
      ],
      supplementOnlyPoints: [
        'Counter-current in fish gills: blood and water flow in opposite directions → concentration gradient maintained along whole lamella → more O₂ absorbed than parallel flow',
        'Insect tracheal system: spiracles → tracheae → tracheoles → cells; diffusion only; limitation: large insects cannot supply deep cells',
        'Explain mechanism of each smoking-related disease using chemistry of each component',
      ],
      practicalSkills: [
        'Measure breathing rate before and after exercise',
        'Examine normal vs emphysematous lung tissue slides — compare alveolar structure',
        'Dissect sheep/pig lungs if available',
      ],
      boundaryNotes: [
        'Counter-current fish gills IS Supplement — must explain WHY more efficient than parallel flow.',
        'Internal intercostal muscles only in FORCED expiration.',
        'Emphysema: alveolar walls break down → reduced surface area — must link to impaired gas exchange.',
      ],
    },

    topic12: {
      code: '0610-T12',
      title: 'Respiration',
      tier: 'both',
      allowedTopics: [
        'Aerobic respiration — C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy (ATP); site: mitochondria; large ATP yield (~30–38 per glucose); uses: active transport, muscle contraction, temperature maintenance, protein synthesis, cell division',
        'Anaerobic respiration (animals) — glucose → lactic acid + small ATP; in muscle during intense exercise; 2 ATP per glucose; NAD regenerated; lactic acid → fatigue and cramp; oxygen debt: after exercise O₂ repays debt (lactic acid oxidised → CO₂ + H₂O); breathing and HR remain elevated',
        'Anaerobic respiration (yeast) — glucose → ethanol + CO₂ + small ATP; baking (CO₂ rises dough); brewing (ethanol); ethanol toxic at ~15%; distillation for spirits',
        'Comparison — aerobic: O₂ required, large ATP yield, CO₂ + H₂O; anaerobic: no O₂, small ATP yield, lactic acid (animals) or ethanol + CO₂ (yeast)',
        'Respiratory quotient — RQ = CO₂ produced / O₂ consumed; carbohydrate = 1.0; fat ≈ 0.7; protein ≈ 0.9; used to identify substrate being respired',
      ],
      forbiddenTopics: [
        'Glycolysis steps (G6P, PGAL, pyruvate production step by step) — beyond 0610',
        'Link reaction (pyruvate → acetyl-CoA) — Supplement simplified only',
        'Krebs cycle intermediates (citrate, etc.) — Supplement simplified only',
        'ETC detail (complex I/II/III/IV, proton pumping) — Supplement simplified only',
        'Chemiosmosis and ATP synthase detail — beyond 0610',
      ],
      requiredKeywords: [
        'aerobic respiration', 'mitochondria', 'glucose', 'oxygen', 'CO₂', 'water', 'ATP',
        'anaerobic', 'lactic acid', 'oxygen debt', 'fatigue',
        'fermentation', 'yeast', 'ethanol', 'baking', 'brewing',
        'respiratory quotient', 'RQ', 'substrate',
      ],
      supplementOnlyPoints: [
        'Glycolysis (simplified): glucose → 2 pyruvate; net 2 ATP; cytoplasm; no O₂',
        'Link reaction (simplified): pyruvate → acetyl-CoA + CO₂ + reduced NAD; mitochondrial matrix',
        'Krebs cycle (simplified): acetyl-CoA → CO₂; produces reduced NAD/FAD and ATP; matrix',
        'Oxidative phosphorylation (simplified): reduced coenzymes → electrons to ETC on inner membrane; proton gradient → ATP synthase; O₂ final electron acceptor → H₂O',
        'Calculate RQ from gas volume data; identify substrate from RQ value',
      ],
      practicalSkills: [
        'Use respirometer: soda lime absorbs CO₂; measure O₂ consumption by manometer fluid movement; calculate RQ',
        'Investigate yeast fermentation: collect CO₂; vary glucose concentration or temperature',
        'Investigate respiration rate in germinating seeds using respirometer',
      ],
      boundaryNotes: [
        'Krebs cycle and oxidative phosphorylation ARE in Supplement but SIMPLIFIED ONLY — no intermediate compounds.',
        'RQ = CO₂/O₂: glucose = 1.0, fat = 0.7, protein = 0.9 — must know all three.',
        'Use "lactic acid" not "lactate" in 0610 IGCSE papers.',
      ],
    },

    topic13: {
      code: '0610-T13',
      title: 'Excretion in Humans',
      tier: 'both',
      allowedTopics: [
        'Excretion — removal of metabolic waste products and substances in excess of requirements; CO₂ (respiration → lungs); urea (deamination → liver → kidneys); bile pigments (Hb breakdown → bile → faeces); NOT egestion',
        'Urea formation — excess amino acids: deamination in liver removes NH₂ → ammonia (toxic) → converted to urea in liver; urea transported in blood plasma to kidneys',
        'Kidney structure — cortex (Bowman\'s capsules, PCT, DCT); medulla (loops of Henle, collecting ducts); renal pelvis → ureter → bladder → urethra; renal artery in, renal vein out; ~1 million nephrons per kidney',
        'Nephron — Bowman\'s capsule + glomerulus: ultrafiltration (afferent arteriole wider than efferent → high pressure → forces water, urea, glucose, ions, amino acids through; blood cells and plasma proteins too large → not filtered); PCT: selective reabsorption (100% glucose by active transport; amino acids; water by osmosis; Na⁺/Cl⁻); loop of Henle: creates medullary salt gradient; DCT + collecting duct: ADH controls water reabsorption',
        'ADH — osmoreceptors in hypothalamus detect high blood osmolarity → posterior pituitary releases ADH → ADH binds collecting duct/DCT receptors → aquaporin channels inserted → more water reabsorbed → concentrated small-volume urine; low osmolarity → less ADH → dilute large-volume urine; negative feedback',
        'Urine composition — water, urea, mineral ions; no glucose (healthy); no protein (too large to filter); glycosuria in diabetes (blood glucose > renal threshold)',
      ],
      forbiddenTopics: [
        'Countercurrent multiplier in detail — Supplement simplified only',
        'Aquaporin molecular mechanism — beyond 0610 (know ADH inserts them)',
        'Renin-angiotensin-aldosterone system — beyond 0610',
        'Juxtaglomerular apparatus — beyond 0610',
      ],
      requiredKeywords: [
        'excretion', 'urea', 'deamination', 'ammonia', 'liver',
        'kidney', 'cortex', 'medulla', 'nephron', 'Bowman\'s capsule', 'glomerulus',
        'ultrafiltration', 'blood pressure', 'basement membrane',
        'PCT', 'selective reabsorption', 'glucose', 'active transport',
        'loop of Henle', 'ADH', 'aquaporin', 'collecting duct', 'concentrated urine',
        'osmoreceptors', 'hypothalamus', 'posterior pituitary', 'negative feedback',
        'glycosuria', 'renal threshold',
      ],
      supplementOnlyPoints: [
        'Ultrafiltration detail: afferent arteriole wider than efferent → high hydrostatic pressure → fluid forced through capillary wall, basement membrane, podocytes (filtration slits) into Bowman\'s space',
        'Loop of Henle: descending limb permeable to water → water leaves → filtrate concentrated; ascending limb impermeable to water, pumps Na⁺/Cl⁻ → hypertonic medulla created → enables water reabsorption in collecting duct',
        'ADH cellular mechanism: binds receptor → signal cascade → aquaporin-2 vesicles fuse with apical membrane → more water channels → more reabsorption',
      ],
      practicalSkills: [
        'Dissect kidney — identify cortex, medulla, renal pelvis',
        'Examine kidney tissue micrographs — identify glomerulus, Bowman\'s, tubule',
        'Test urine samples for glucose (Benedict\'s), protein (biuret), pH',
        'Analyse data comparing urine composition under different physiological conditions',
      ],
      boundaryNotes: [
        'Loop of Henle countercurrent multiplier IS in Supplement but at simple level only (creates salt gradient).',
        'Aquaporins: know they are water channels inserted by ADH — detailed mechanism beyond 0610.',
        'Glycosuria in diabetes: high blood glucose exceeds renal threshold → glucose in urine.',
      ],
    },

    topic14: {
      code: '0610-T14',
      title: 'Coordination and Response',
      tier: 'both',
      allowedTopics: [
        'Nervous system — CNS (brain + spinal cord); PNS (cranial + spinal nerves); somatic (voluntary, skeletal muscle); autonomic (involuntary, glands, smooth muscle, heart)',
        'Neurones — sensory (receptor → CNS); motor (CNS → effector); relay/interneurone (within CNS); structure: cell body, axon, dendrites, myelin sheath (Schwann cells), nodes of Ranvier, axon terminal',
        'Reflex arc — receptor → sensory neurone → relay neurone (spinal cord) → motor neurone → effector; rapid, automatic, involuntary, protective; bypasses conscious brain',
        'Synapse — Ca²⁺ influx (Supplement) → synaptic vesicles fuse → neurotransmitter (ACh) released → diffuses across 20 nm cleft → binds postsynaptic receptors → new impulse; one-directional; ACh hydrolysed by acetylcholinesterase',
        'Eye — cornea (most refraction); iris (circular + radial muscles → pupil size); lens (accommodation); ciliary muscles + suspensory ligaments; retina (rods for dim/monochrome; cones for colour/detail); fovea (max cone density); blind spot (optic nerve exit — no receptors); optic nerve',
        'Pupil reflex — bright: circular muscles contract + radial relax → constrict; dim: radial contract + circular relax → dilate; antagonistic pairs',
        'Accommodation — near object: ciliary muscles contract → suspensory ligaments slacken → lens fatter (more convex) → more refraction; far object: ciliary muscles relax → ligaments tighten → lens thinner → less refraction',
        'Sight defects — myopia (short sight): eyeball too long or lens too curved → image in front of retina → concave lens; hyperopia (long sight): eyeball too short or lens too flat → image behind retina → convex lens',
        'Endocrine system — glands secrete hormones into blood → transported to target organs; slower and longer-lasting than nervous; examples: pancreas (insulin, glucagon), adrenal (adrenaline), thyroid (thyroxine), ovaries (oestrogen, progesterone), testes (testosterone), pituitary (FSH, LH, ADH, GH)',
        'Adrenaline — adrenal medulla; stress/fear/excitement; increases HR, breathing rate, dilates pupils, glycogenolysis (raises blood glucose), redistributes blood to muscles; fight-or-flight',
        'Insulin and glucagon — islets of Langerhans; after meal (high glucose): β cells secrete insulin → glycogenesis + increased uptake; between meals (low glucose): α cells secrete glucagon → glycogenolysis + gluconeogenesis; Type 1 diabetes: β cells destroyed (autoimmune) → no insulin → injections; Type 2: insulin resistance → diet/exercise/metformin',
        'Homeostasis — constant internal environment; negative feedback: deviation from set point → effector corrects → returns to set point → signals stop; thermoregulation: hypothalamus as thermostat; too hot → vasodilation, sweating, piloerection relaxes; too cold → vasoconstriction, shivering, piloerection traps air, increased metabolic rate',
        'Auxins — produced in shoot tip (apical meristems); promote cell elongation at low concentration; roots more sensitive (inhibited at lower concentration); phototropism: auxin accumulates on shaded side → more elongation → bends toward light; gravitropism: in roots, lower side inhibited → root bends down; positive phototropism in shoots, positive gravitropism in roots; commercial uses: rooting powder, selective weedkillers, fruit ripening',
      ],
      forbiddenTopics: [
        'Resting potential mV values and Na⁺/K⁺ ATPase detailed mechanism — beyond 0610',
        'Action potential (depolarisation/repolarisation/refractory period) — beyond 0610',
        'EPSP/IPSP — beyond 0610',
        'Detailed HPG axis (GnRH, gonadotrophin pulsatility) — beyond 0610',
        'Gibberellins and cytokinins — beyond 0610 (mention only in commercial use context)',
      ],
      requiredKeywords: [
        'CNS', 'PNS', 'sensory neurone', 'motor neurone', 'relay neurone', 'reflex arc',
        'synapse', 'Ca²⁺', 'neurotransmitter', 'acetylcholine', 'synaptic cleft', 'one-directional',
        'cornea', 'iris', 'lens', 'retina', 'rods', 'cones', 'fovea', 'accommodation',
        'ciliary muscles', 'suspensory ligaments', 'pupil reflex', 'antagonistic',
        'myopia', 'hyperopia', 'concave', 'convex',
        'insulin', 'glucagon', 'β cells', 'α cells', 'glycogenesis', 'glycogenolysis',
        'Type 1 diabetes', 'Type 2 diabetes',
        'adrenaline', 'fight-or-flight',
        'homeostasis', 'negative feedback', 'set point', 'thermoregulation',
        'vasodilation', 'vasoconstriction', 'sweating', 'shivering',
        'auxin', 'phototropism', 'gravitropism', 'cell elongation', 'apical meristem',
      ],
      supplementOnlyPoints: [
        'Synapse: Ca²⁺ influx on arrival of impulse at presynaptic terminal triggers vesicle fusion',
        'Auxin acid growth hypothesis: auxin → H⁺ secretion into cell wall → loosens cell wall → cell elongates',
        'Apical dominance: high auxin from shoot tip suppresses lateral bud growth',
        'Negative feedback in thermoregulation detail: vasodilation/vasoconstriction changes blood flow to skin → changes heat radiation rate',
        'Insulin at cellular level: binds receptor → GLUT4 transporter insertion → increased glucose uptake',
      ],
      practicalSkills: [
        'Investigate pupil reflex under different light conditions',
        'Investigate phototropism in seedlings; compare auxin agar block experiments',
        'Investigate gravitropism in germinating seeds — rotate orientations',
        'Measure reaction time as example of nervous coordination',
      ],
      boundaryNotes: [
        'Ca²⁺ influx at synapse IS in Supplement at 0610.',
        'Roots MORE sensitive to auxin than shoots — auxin concentrations that promote shoot elongation inhibit root elongation.',
        'Type 1 vs Type 2 diabetes distinction: Type 1 = no insulin produced; Type 2 = insulin produced but cells resistant.',
      ],
    },

    topic15: {
      code: '0610-T15',
      title: 'Drugs',
      tier: 'both',
      allowedTopics: [
        'Drug definition — substance affecting body function; medicinal (treat disease/pain); recreational (pleasure/social); misuse causes harm',
        'Antibiotics — kill bacteria; do NOT work on viruses; complete full course; penicillin, amoxicillin',
        'Heroin — opiate/analgesic narcotic; highly addictive (physical + psychological); tolerance (increasing amounts needed); withdrawal (fever, cramps, vomiting); binds opioid receptors → pain reduction, euphoria, breathing depression; overdose risk; sharing needles → HIV, hepatitis C',
        'Cocaine — stimulant; blocks reuptake of dopamine and norepinephrine in synapses; intense euphoria; increased HR, BP; vasoconstriction; heart attack/stroke risk; crack more addictive',
        'Ecstasy (MDMA) — stimulant + mild hallucinogen; releases serotonin/dopamine/norepinephrine; hyperthermia, dehydration/hyponatraemia risk; neurotoxic with prolonged use (damages serotonin neurones)',
        'Alcohol — CNS depressant; impairs coordination, reaction time, judgment; diuretic; long-term: cirrhosis (inflammation → fibrosis → liver failure), brain damage; fetal alcohol syndrome (crosses placenta → developmental defects); addiction',
        'Smoking — nicotine: addictive stimulant, increases HR/BP, promotes clotting; tar: carcinogens → lung cancer; paralyses/destroys cilia → mucus → bronchitis/emphysema; CO: Hb binds → reduced O₂ transport; CVD; passive smoking; effects on foetus',
        'Performance-enhancing drugs — anabolic steroids (muscle mass, strength; liver damage, CVD, infertility, mood changes); EPO (more RBCs → O₂ to muscles; blood clot/stroke risk); stimulants; beta-blockers; diuretics (mask drugs); ethical issues, testing',
      ],
      forbiddenTopics: [
        'Detailed receptor pharmacology (agonists/antagonists, receptor subtypes) — beyond 0610',
        'Alcohol metabolism enzymes (alcohol dehydrogenase, ALDH) — beyond 0610',
        'Drug testing analytical methods — beyond 0610',
      ],
      requiredKeywords: [
        'addictive', 'dependence', 'tolerance', 'withdrawal',
        'heroin', 'opioid receptors', 'analgesic', 'overdose',
        'cocaine', 'stimulant', 'dopamine reuptake',
        'ecstasy', 'serotonin', 'hyperthermia',
        'alcohol', 'depressant', 'cirrhosis', 'fetal alcohol syndrome',
        'nicotine', 'tar', 'carcinogen', 'emphysema', 'cilia', 'CO', 'carboxyhaemoglobin',
        'anabolic steroids', 'EPO', 'erythropoietin',
      ],
      supplementOnlyPoints: [
        'Drug action at synapses: opiates bind receptors → reduce pain signal; cocaine blocks dopamine/NE reuptake; MDMA increases serotonin release',
        'Physiological basis of tolerance: receptor down-regulation → withdrawal symptoms when drug removed',
        'Evaluate evidence for/against drug legalisation from health, social and economic perspectives',
      ],
      boundaryNotes: [
        'Molecular mechanisms of drug action are Supplement — Core = observable effects only.',
        'Performance-enhancing drugs: must include both physiological effects AND ethical arguments.',
      ],
    },

    topic16: {
      code: '0610-T16',
      title: 'Reproduction',
      tier: 'both',
      allowedTopics: [
        'Sexual vs asexual — sexual: two parents, gametes, fertilisation, genetic variation, meiosis; asexual: one parent, mitosis, genetically identical (clones), faster; asexual examples: runners (strawberry), rhizomes (grass), bulbs (onion), tubers (potato), budding (yeast), binary fission (bacteria)',
        'Mitosis — produces two genetically identical daughter cells; stages: prophase (condense, spindle, nuclear membrane breaks); metaphase (align at equator); anaphase (chromatids to poles); telophase (nuclear membranes reform); cytokinesis; used for growth, repair, asexual reproduction',
        'Meiosis — produces four haploid cells with different genetic combinations; meiosis I: homologous chromosomes pair, cross over at chiasmata, separate (independent assortment); meiosis II: chromatids separate; variation from: crossing over, independent assortment, random fertilisation',
        'Male reproductive system — testes (sperm + testosterone), epididymis (maturation/storage), vas deferens (transport), seminal vesicles + prostate (seminal fluid), urethra, penis',
        'Female reproductive system — ovaries (oocytes, oestrogen, progesterone), fallopian tubes/oviducts (site of fertilisation, cilia move egg), uterus (implantation, development), cervix, vagina',
        'Fertilisation and implantation — sperm swim to fallopian tube; acrosome enzymes digest zona pellucida; cortical reaction prevents polyspermy; zygote → morula → blastocyst → implants ~6–10 days',
        'Placenta — chorionic villi (foetal) interdigitate with maternal blood sinuses; O₂, glucose, amino acids, antibodies, hormones → foetus; CO₂, urea → mother; barrier to some pathogens (NOT HIV); umbilical cord (artery: deoxygenated to placenta; vein: oxygenated to foetus); amnion/amniotic fluid',
        'Menstrual cycle — FSH from anterior pituitary → follicle development → oestrogen; oestrogen → thickens uterine lining, inhibits FSH; LH surge (day 14) → ovulation; corpus luteum → progesterone → maintains lining; if no pregnancy → progesterone/oestrogen fall → menstruation; negative feedback on pituitary',
        'Contraception — barrier (condom + STI protection; diaphragm); hormonal (combined pill: oestrogen + progesterone → suppresses FSH/LH; mini-pill: thickens mucus); IUD; vasectomy; tubal ligation',
        'Flower structure — sepals, petals, stamens (anther + filament), carpel (stigma + style + ovary + ovule)',
        'Pollination — wind: light pollen, feathery stigmas, no nectaries; insect: colourful petals, nectar, scent, sticky pollen/stigma',
        'Fertilisation in plants — pollen germinates on stigma → pollen tube grows to ovule → male nucleus fuses with egg → zygote → seed; ovary wall → fruit',
        'Seed dispersal — wind (wings, parachutes); animal ingested (fleshy fruits); animal external (hooks); water (buoyant); explosive (pods)',
        'Germination — water, warmth (temperature), oxygen; radicle first, then plumule',
      ],
      forbiddenTopics: [
        'GnRH and gonadotrophin pulsatility — beyond 0610',
        'Zona pellucida chemistry — beyond 0610',
        'Double fertilisation in angiosperms — Supplement only',
        'Detailed placental hormone production — beyond 0610',
      ],
      requiredKeywords: [
        'asexual', 'clone', 'sexual reproduction', 'gametes', 'fertilisation',
        'mitosis', 'meiosis', 'haploid', 'diploid', 'crossing over', 'independent assortment',
        'testes', 'ovary', 'fallopian tube', 'placenta', 'umbilical cord', 'amnion',
        'FSH', 'LH', 'oestrogen', 'progesterone', 'ovulation', 'corpus luteum', 'menstruation',
        'negative feedback', 'uterine lining',
        'condom', 'oral contraceptive pill',
        'anther', 'stigma', 'ovule', 'pollen tube',
        'pollination', 'wind', 'insect',
        'germination', 'radicle', 'plumule', 'water', 'warmth', 'oxygen',
      ],
      supplementOnlyPoints: [
        'Meiosis stages in detail: crossing over at chiasmata during prophase I; independent assortment during metaphase I; explain significance of each for genetic variation',
        'Negative feedback: high oestrogen/progesterone inhibit FSH/LH from pituitary → prevents further follicle development',
        'How hormonal contraceptives work: oestrogen + progesterone suppress FSH → no follicle development → no ovulation',
        'Double fertilisation: one male nucleus + egg → zygote; second male nucleus + polar nuclei → triploid endosperm (food store)',
      ],
      practicalSkills: [
        'Dissect and label a flower — identify all structures',
        'Investigate germination conditions — test effects of water, temperature, oxygen',
        'Dissect and examine seed structure (broad bean) — radicle, plumule, cotyledon, testa',
      ],
      boundaryNotes: [
        'Meiosis stages are Supplement — Core only needs to know meiosis produces haploid cells with genetic variation.',
        'Menstrual cycle: FSH, LH, oestrogen, progesterone, their sources and roles ALL required.',
        'Placenta: foetal and maternal blood do NOT mix — exchange by diffusion/active transport.',
      ],
    },

    topic17: {
      code: '0610-T17',
      title: 'Inheritance',
      tier: 'both',
      allowedTopics: [
        'Chromosomes and genes — 23 pairs (46) in human diploid cells; gametes haploid (23); genes at specific loci; alleles = different forms of gene at same locus',
        'DNA structure (Supplement) — double helix; antiparallel strands; deoxyribose-phosphate backbone; base pairs A-T, G-C by hydrogen bonds; triplet codons; transcription (DNA → mRNA in nucleus); translation (mRNA → protein at ribosome; tRNA anticodon matches codon)',
        'Genetic terminology — dominant (expressed with 1 or 2 copies); recessive (expressed only homozygous); homozygous (both alleles same); heterozygous (different alleles); genotype (alleles present); phenotype (observable characteristic)',
        'Monohybrid crosses — Punnett squares; F1 and F2 ratios; test cross (cross dominant phenotype with homozygous recessive → 1:1 ratio = heterozygous parent; all dominant = homozygous dominant)',
        'Co-dominance — both alleles expressed in heterozygote; ABO blood groups (IA, IB codominant; i recessive); sickle cell trait (HbA/HbS = both types of Hb); snapdragon (red × white → pink)',
        'Sex determination — XX female, XY male; Y has SRY gene; 50:50 probability; Punnett square demonstration',
        'Sex-linkage — genes on X chromosome; red-green colour blindness (XᴿXʳ carrier female; XʳY affected male); haemophilia (XᴴXʰ carrier female; XʰY affected male); more males affected; all daughters of affected father are carriers',
        'Mutation — random change in DNA; mutagens: UV, X-rays, gamma radiation, chemical mutagens; somatic (body, not inherited, may cause cancer); germline (gametes, inherited); gene mutation (nucleotide change); chromosome mutation (number change)',
        'Sickle cell — single base substitution in Hb gene (GAG → GTG) → valine replaces glutamic acid at position 6 → HbS polymerises at low pO₂ → sickle-shaped RBCs → block capillaries; HbA/HbS heterozygote = sickle cell TRAIT (advantage in malaria-endemic areas)',
        'Down syndrome — non-disjunction during meiosis → trisomy 21; learning disability, heart defects; risk increases with maternal age',
        'Natural selection — heritable variation; overproduction; competition; differential survival; reproduction → allele frequency change over generations; antibiotic resistance, peppered moth, sickle cell advantage',
      ],
      forbiddenTopics: [
        'Dihybrid crosses — beyond 0610',
        'Hardy-Weinberg equation — beyond 0610',
        'Epigenetics — beyond 0610',
        'Detailed promoters and transcription factors — beyond 0610',
        'Gel electrophoresis for DNA profiling — beyond 0610',
      ],
      requiredKeywords: [
        'chromosome', 'gene', 'allele', 'locus', 'diploid', 'haploid',
        'dominant', 'recessive', 'homozygous', 'heterozygous', 'genotype', 'phenotype',
        'Punnett square', 'test cross', 'monohybrid', 'F1', 'F2',
        'co-dominance', 'ABO blood group', 'sickle cell', 'HbA', 'HbS',
        'XX', 'XY', 'sex-linked', 'carrier', 'colour blindness', 'haemophilia',
        'mutation', 'mutagen', 'ionising radiation', 'UV',
        'sickle cell anaemia', 'base substitution', 'valine', 'glutamic acid',
        'Down syndrome', 'trisomy 21', 'non-disjunction',
        'natural selection', 'heritable variation', 'allele frequency',
      ],
      supplementOnlyPoints: [
        'DNA structure detail: nucleotide = phosphate + deoxyribose + base; antiparallel; A-T, G-C base pairing',
        'Protein synthesis: transcription (RNA polymerase, template strand, mRNA); translation (ribosome, tRNA, anticodon, codon, peptide bond formation)',
        'Sickle cell full molecular basis: GAG → GTG (template DNA) → GUG (mRNA codon) → valine instead of glutamic acid',
        'Natural selection quantitative treatment: show allele frequency change over generations with numerical data',
      ],
      practicalSkills: [
        'Work through monohybrid crosses including sex-linked and co-dominance using Punnett squares',
        'Interpret pedigree charts for autosomal dominant, autosomal recessive, sex-linked conditions',
        'Predict offspring ratios and phenotype frequencies',
      ],
      boundaryNotes: [
        'DNA structure is SUPPLEMENT at 0610 — Core only needs to know DNA carries genetic information.',
        'Protein synthesis (transcription/translation) is SUPPLEMENT.',
        'HbA/HbS heterozygote = TRAIT, not disease — RBCs only sickle at very low O₂.',
      ],
    },

    topic18: {
      code: '0610-T18',
      title: 'Variation and Selection',
      tier: 'both',
      allowedTopics: [
        'Variation types — continuous (range with no distinct categories; multiple genes + environment; e.g. height, mass, skin colour; normal distribution/bell curve); discontinuous (distinct separate categories; mainly genetic; e.g. ABO blood group, tongue rolling, sex, sickle cell; bar chart)',
        'Causes — genetic: mutations (new alleles); meiosis (crossing over, independent assortment); random fertilisation; environmental: diet, exercise, disease, temperature, sunlight; most traits influenced by both',
        'Adaptive features — structural/physiological/behavioural features improving survival in habitat; camouflage; streamlined body; insulation; desert adaptations (large ears, nocturnal, concentrated urine); aquatic adaptations',
        'Natural selection — overproduction of offspring; heritable variation; competition for limited resources; differential survival (better-adapted more likely to survive); reproduction (pass favourable alleles) → allele frequency change → population adapts',
        'Antibiotic resistance as example — random mutation → resistant variant; antibiotic kills susceptible; resistant survive, reproduce → resistant allele frequency increases; MRSA; preventive measures: complete course, not prescribing for viruses, rotation, hygiene',
        'Selective breeding — humans choose desirable traits; breed; select best offspring; repeat; examples: high-yield wheat, high-milk-yield cattle, disease-resistant crops, lean pigs, dog breeds; consequence: reduced genetic diversity',
        'Evolution — change in heritable characteristics of populations over time; common ancestry; evidence: fossil record, comparative anatomy (homologous structures), molecular biology (DNA/protein sequences), biogeography; Darwin and Wallace (independent)',
      ],
      forbiddenTopics: [
        'Hardy-Weinberg equation — beyond 0610',
        'Speciation mechanisms (allopatric, sympatric) — Supplement simplified only',
        'Genetic drift, founder effect, bottleneck — beyond 0610',
        'Lamarck\'s theory — beyond 0610 (only as contrast to Darwin if needed)',
      ],
      requiredKeywords: [
        'continuous variation', 'discontinuous variation', 'normal distribution', 'bell curve',
        'genetic', 'environmental', 'mutation', 'meiosis', 'crossing over',
        'adaptive feature', 'camouflage',
        'natural selection', 'overproduction', 'survival of fittest', 'heritable', 'allele frequency',
        'selective breeding', 'artificial selection', 'genetic diversity',
        'antibiotic resistance', 'MRSA', 'natural selection',
        'evolution', 'fossil record', 'homologous structures', 'Darwin',
      ],
      supplementOnlyPoints: [
        'Evidence for evolution: fossil record (transitional fossils, gradual change); homologous structures (pentadactyl limb — same bones, different functions); molecular evidence (DNA/protein similarity increases with relatedness)',
        'Speciation (simplified): geographic isolation → different mutation/selection → genetic differences accumulate → reproductive isolation → new species',
        'Statistical measures for variation: mean, range, standard deviation to compare populations',
      ],
      practicalSkills: [
        'Measure continuous variable in population — plot frequency histogram; identify normal distribution',
        'Measure discontinuous variable — bar chart',
        'Interpret graphs of allele frequency change under selection pressure',
        'Analyse antibiotic resistance data in terms of natural selection',
      ],
      boundaryNotes: [
        'Speciation is SUPPLEMENT only at 0610.',
        'Normal distribution: must be able to sketch bell curve and describe its properties.',
        'Adaptive features: must link specific structure to specific function in named habitat.',
      ],
    },

    topic19: {
      code: '0610-T19',
      title: 'Organisms and Their Environment',
      tier: 'both',
      allowedTopics: [
        'Ecological terms — habitat (place where organism lives); population (all individuals of one species in area); community (all populations in area); ecosystem (community + non-living environment); niche (organism\'s role: what eats, where lives, when active)',
        'Abiotic factors — temperature, light intensity, pH, water, mineral content, salinity, wind, O₂ availability, CO₂, humidity',
        'Biotic factors — food availability, predation, disease, competition (intraspecific: same species; interspecific: different species), pollination, mutualism, parasitism',
        'Food chains and webs — begin with producer (photosynthetic autotroph); arrows = direction of energy/material transfer; primary consumer → secondary → tertiary; food webs more realistic; removal of one species cascades',
        'Trophic levels — producer = TL1; primary consumer = TL2; etc.; biomass and energy decrease at each level',
        'Energy flow — ~10% of energy passes to next trophic level; lost as heat (respiration), in excretory products, in indigestible material; pyramid of energy (always upright); pyramid of biomass (usually upright, may invert in aquatic systems); pyramid of numbers (may invert if producer is large)',
        'Carbon cycle — photosynthesis (CO₂ → organic C); respiration (organic C → CO₂); combustion (fossil fuels release stored C); death + decomposition (organic C → CO₂); feeding (C passes up food chain); fossilisation',
        'Nitrogen cycle — fixation: Rhizobium (legume root nodules) + Azotobacter (free-living in soil) → NH₄⁺; lightning also fixes N₂; nitrification: Nitrosomonas (NH₄⁺ → NO₂⁻), Nitrobacter (NO₂⁻ → NO₃⁻) — aerobic; denitrification: anaerobic bacteria (NO₃⁻ → N₂) — waterlogged soils; ammonification: decomposers break organic N → NH₄⁺; plant uptake: NO₃⁻ → amino acids → proteins',
        'Decomposers — bacteria and fungi; extracellular enzymes; release mineral ions into soil; essential for nutrient cycling; detritivores (earthworms, woodlice) fragment dead matter → increase SA for decomposers',
        'Population sampling — random quadrats (coordinates); systematic transects; mean density × total area = population estimate; Lincoln index: N = (M × S) / R (M = marked released; S = sample size 2nd visit; R = recaptured marked); assumptions: random mixing, mark not harmful, no births/deaths/migration between samples',
      ],
      forbiddenTopics: [
        'GPP, NPP, net secondary productivity calculations — beyond 0610',
        'Shannon diversity index — beyond 0610',
        'Lotka-Volterra predator-prey equations — beyond 0610',
      ],
      requiredKeywords: [
        'habitat', 'population', 'community', 'ecosystem', 'niche',
        'abiotic', 'biotic', 'producer', 'consumer', 'decomposer', 'detritivore',
        'food chain', 'food web', 'trophic level', '10% energy transfer',
        'pyramid of energy', 'pyramid of biomass', 'pyramid of numbers',
        'carbon cycle', 'photosynthesis', 'respiration', 'combustion', 'decomposition',
        'nitrogen fixation', 'Rhizobium', 'Azotobacter',
        'nitrification', 'Nitrosomonas', 'Nitrobacter',
        'denitrification', 'ammonification',
        'Lincoln index', 'N = (M × S) / R', 'quadrat', 'transect',
      ],
      supplementOnlyPoints: [
        'Evaluate sampling methods: quadrats (random vs systematic), transects (zonation studies), mark-release-recapture (assumptions and limitations)',
        'Calculate population using Lincoln index; evaluate assumptions (no immigration/emigration, mark not affecting behaviour, random mixing)',
        'Explain why ~10% energy transfer in quantitative terms: respiratory heat loss + excretion + indigestible material',
      ],
      practicalSkills: [
        'Use quadrats to estimate plant population density; calculate mean density',
        'Carry out belt transect across habitat boundary — identify zonation, link to abiotic factors',
        'Simulate mark-release-recapture; calculate N; evaluate assumptions',
        'Measure abiotic factors and relate to species distribution',
        'Investigate decomposition rate under different conditions',
      ],
      boundaryNotes: [
        'Lincoln index formula N = (M × S) / R IS in spec — must know formula and all assumptions.',
        'All named nitrogen cycle bacteria required: Rhizobium, Azotobacter, Nitrosomonas, Nitrobacter.',
        'Pyramid of energy ALWAYS upright; pyramid of numbers CAN be inverted.',
      ],
    },

    topic20: {
      code: '0610-T20',
      title: 'Human Influences on Ecosystems',
      tier: 'both',
      allowedTopics: [
        'Deforestation — agriculture, timber, urbanisation, roads, mining; effects: loss of biodiversity (extinction); disrupted carbon cycle (CO₂ released, less absorbed); soil erosion (roots no longer bind soil, leaching); disrupted water cycle (less transpiration, reduced rainfall); climate change',
        'Global warming — enhanced greenhouse effect: CO₂, CH₄ (livestock, rice paddies), N₂O, water vapour, CFCs absorb and re-emit infrared; increasing due to: fossil fuel combustion, deforestation, intensive farming, landfill; consequences: melting ice → rising sea levels → flooding; extreme weather; coral bleaching; species distribution shifts',
        'Eutrophication — nitrates + phosphates from fertilisers, manure, sewage → algal bloom (surface coverage blocks light → submerged plants die) → algae die → bacteria decompose → BOD increases → O₂ depleted → fish and aerobic organisms die; solutions: reduce fertiliser use, buffer strips, sewage treatment',
        'Pesticides — bioaccumulation (fat-soluble, not excreted, stored in fatty tissue); biomagnification (concentration ×10 per trophic level); DDT in top predators → thin eggshells in birds of prey; non-target species deaths; biological control as alternative',
        'Conservation — importance: ecological stability, medicines, food security, ethical, aesthetic; in situ: national parks, nature reserves, legislation (CITES); ex situ: zoos, captive breeding, botanic gardens, seed banks (Svalbard); sustainable fishing (quotas, minimum mesh size, closed seasons, MPAs); sustainable forestry (replanting, selective felling)',
        'Overfishing — stock below replacement level → collapse; solutions: quotas, minimum mesh size, closed seasons, no-take zones; aquaculture problems: waste, escapes, antibiotics, disease',
        'Pollution — acid rain (SO₂ and NOₓ → H₂SO₄ and HNO₃; damages trees, lakes, limestone buildings); plastic pollution (non-biodegradable, microplastics, marine organisms); heavy metal bioaccumulation',
      ],
      forbiddenTopics: [
        'Carbon footprint calculations — beyond 0610',
        'Ozone depletion detailed chemistry (Chapman cycle) — beyond 0610',
        'Specific climate agreements (Kyoto, Paris) — beyond 0610',
        'Nuclear waste — beyond 0610',
      ],
      requiredKeywords: [
        'deforestation', 'biodiversity', 'soil erosion', 'carbon cycle',
        'greenhouse gas', 'CO₂', 'methane', 'CH₄', 'global warming', 'sea level', 'ice caps',
        'eutrophication', 'nitrates', 'phosphates', 'algal bloom', 'BOD', 'O₂ depletion',
        'bioaccumulation', 'biomagnification', 'DDT', 'top predators', 'eggshells',
        'in situ', 'ex situ', 'national park', 'CITES', 'seed bank', 'captive breeding',
        'quotas', 'sustainable', 'mesh size',
        'acid rain', 'SO₂', 'NOₓ', 'limestone',
      ],
      supplementOnlyPoints: [
        'BOD definition: O₂ used by bacteria decomposing organic matter; higher BOD = lower dissolved O₂ = fewer aerobic organisms',
        'Biomagnification quantitative: DDT concentration increases ~×10 per trophic level — explain why (stored in fat, not excreted, predators eat many prey)',
        'Evaluate in situ vs ex situ conservation with named examples and success data',
        'Sustainable resource management: specific fishery or forest example with detailed evaluation',
      ],
      practicalSkills: [
        'Investigate effect of fertiliser concentration on algal growth (simulated eutrophication)',
        'Analyse species population data related to environmental pressures',
        'Evaluate conservation measure effectiveness using data',
      ],
      boundaryNotes: [
        'BOD (biological oxygen demand) IS in spec — definition required.',
        'Eutrophication: must give mechanism in correct sequence — fertiliser → algal bloom → die → bacteria → O₂ depletion → fish die.',
        'Acid rain: SO₂ AND NOₓ → H₂SO₄ and HNO₃ — both gases and both acids required.',
      ],
    },

    topic21: {
      code: '0610-T21',
      title: 'Biotechnology and Genetic Modification',
      tier: 'both',
      allowedTopics: [
        'Biotechnology — use of organisms/products commercially, industrially, medically, agriculturally; food and drink (bread, beer, wine, yoghurt, cheese); antibiotics (penicillin from Penicillium); industrial enzymes; insulin; biofuels',
        'Fermentation — yeast: glucose → ethanol + CO₂ (bread rises from CO₂; brewing produces ethanol); Lactobacillus: lactose → lactic acid (yoghurt, cheese); industrial fermenter: cooling jacket (temperature), pH probes + buffers, nutrient supply, aeration (aerobic organisms), agitation (stirrer); aseptic/sterile conditions; batch vs continuous; mycoprotein (Quorn) from Fusarium venenatum aerobically in fermenter — high protein, low fat',
        'Genetic modification — restriction endonucleases cut DNA at palindromic recognition sites → sticky ends; DNA ligase joins insert to vector; vectors: plasmids (bacteria), bacteriophages, Ti plasmid (plants); transformation: E. coli by heat shock; plants by Agrobacterium tumefaciens or gene gun; selection by antibiotic resistance marker or GFP reporter gene',
        'GM examples — insulin: human gene → plasmid → E. coli → fermenter → harvest; identical to human insulin, no allergic reactions, unlimited supply; Golden Rice: β-carotene genes (daffodil psy gene + bacterial crtI gene) inserted via Agrobacterium → endosperm produces β-carotene → vitamin A precursor → addresses vitamin A deficiency; Bt crops: Bacillus thuringiensis cry gene → crop produces toxin → kills lepidopteran pests; herbicide-resistant crops',
        'Plant cloning — vegetative propagation: runners, bulbs, rhizomes, tubers, cuttings; tissue culture: explant from meristem + sterile medium + hormones (auxins, cytokinins) → callus (undifferentiated cells) → differentiation → plantlets; totipotency: every cell has full genome, potential to develop into complete organism; advantages: fast, identical, disease-free, preserve rare varieties',
        'Animal cloning — embryo splitting: early embryo split → each half to surrogate; adult cell cloning (SCNT): somatic cell nucleus into enucleated egg → electric shock → embryo → surrogate; Dolly the sheep (1996); uses: valuable traits, preserving endangered species',
        'Ethical issues — GM: unknown long-term effects; gene flow to wild relatives; biodiversity loss; corporate ownership/patents; labelling/consumer choice; "playing God"; ecological effects; needed for food security; animal cloning: high failure rate; abnormalities; animal welfare; slippery slope to human cloning; therapeutic vs reproductive cloning',
      ],
      forbiddenTopics: [
        'CRISPR-Cas9 mechanism — beyond 0610 IGCSE',
        'PCR in detail — beyond 0610 (only mention amplification in GM context)',
        'Gel electrophoresis for DNA profiling — beyond 0610',
        'Gene therapy — beyond 0610',
        'RNA interference — beyond 0610',
      ],
      requiredKeywords: [
        'fermenter', 'fermentation', 'yeast', 'Lactobacillus', 'aseptic',
        'mycoprotein', 'Fusarium', 'Quorn',
        'restriction endonuclease', 'sticky ends', 'DNA ligase', 'plasmid', 'vector', 'transformation',
        'insulin', 'E. coli', 'fermenter', 'harvested',
        'Golden Rice', 'β-carotene', 'vitamin A',
        'Bt toxin', 'herbicide-resistant',
        'totipotency', 'callus', 'tissue culture', 'explant', 'meristem',
        'embryo splitting', 'SCNT', 'enucleated', 'Dolly',
        'gene flow', 'biodiversity', 'food security', 'ethical',
      ],
      supplementOnlyPoints: [
        'Restriction enzyme cutting and ligation detail: cuts at palindromic site producing sticky ends; complementary sticky ends of gene and vector anneal by H-bonds; ligase seals phosphodiester bonds → recombinant plasmid',
        'Antibiotic resistance marker: transformants grown on antibiotic plates → only cells with plasmid survive; GFP: cells fluoresce under UV → confirms transformation',
        'Evaluate GM crops: economic (increased yield, reduced pesticide cost), environmental (gene flow risk, non-target species), social (food security, corporate control, labelling)',
        'Distinguish therapeutic cloning (medical purposes, more ethically accepted) from reproductive cloning (creating whole organisms, widely rejected)',
      ],
      practicalSkills: [
        'Investigate optimum conditions for fermentation — temperature, sugar concentration, yeast amount',
        'Design investigation testing antimicrobial effectiveness with aseptic technique',
        'Evaluate experimental designs for testing GM crop yield',
      ],
      boundaryNotes: [
        'Sticky ends: single-stranded overhangs complementary between gene and vector — must explain.',
        'PCR is NOT in 0610 spec — only restriction enzymes and ligation for GM.',
        'Totipotency = every somatic cell has FULL genome and POTENTIAL to develop into complete organism.',
      ],
    },
  },

  // ============================================================
  // CIE IGCSE CHEMISTRY (0620) — 14 Topics
  // Source: Cambridge 0620 Syllabus Version 2, 2023–2025
  // ============================================================
  chemistry: {

    topic1: {
      code: '0620-T1',
      title: 'States of Matter',
      tier: 'both',
      allowedTopics: [
        'Three states — solid: closely packed, regular arrangement, strong forces, vibrate about fixed positions, definite shape and volume, incompressible; liquid: closely packed, random arrangement, weaker forces, slide past each other, flows, no fixed shape, definite volume, virtually incompressible; gas: far apart, random, negligible forces, rapid random movement, easily compressed, no fixed shape or volume',
        'Changes of state — melting (solid → liquid, energy absorbed); freezing (liquid → solid, energy released); evaporation (liquid → gas at surface, any temperature); boiling (throughout liquid, fixed boiling point); condensation (gas → liquid, energy released); sublimation (solid → gas, e.g. iodine, dry ice); temperature constant during change of state (energy breaks intermolecular forces, not increases KE)',
        'Kinetic particle theory — particles in constant motion; higher temperature = greater average KE; explains properties and changes of state',
        'Diffusion — net movement from high to low concentration; passive; gases faster than liquids; heavier molecules diffuse slower; NH₃/HCl demo: white NH₄Cl ring forms closer to HCl end (NH₃ lighter, faster)',
        'Brownian motion — random movement of visible particles (smoke, pollen) due to bombardment by invisible smaller particles; evidence for constant random particle motion (Robert Brown, 1827)',
      ],
      forbiddenTopics: [
        'Named intermolecular forces (London, dipole-dipole, H-bonding) — Topic 3',
        'Ionic and covalent bonding — Topic 3',
        'Specific heat capacity calculations — Topic 6 (Energetics)',
        'Ideal gas equation pV = nRT — beyond 0620 IGCSE',
      ],
      requiredKeywords: [
        'solid', 'liquid', 'gas', 'particle', 'arrangement', 'forces',
        'melting', 'freezing', 'evaporation', 'boiling', 'condensation', 'sublimation',
        'kinetic theory', 'kinetic energy', 'temperature',
        'diffusion', 'random motion', 'high to low concentration',
        'Brownian motion', 'evidence', 'bombardment',
      ],
      practicalSkills: [
        'Investigate diffusion of NH₃ and HCl — predict and observe NH₄Cl ring position',
        'Investigate factors affecting diffusion rate (temperature, concentration)',
        'Heating and cooling curves of stearic acid — identify changes of state from flat sections',
      ],
      boundaryNotes: [
        'Brownian motion: visible particles are smoke/pollen being HIT by invisible molecules — not the gas molecules themselves.',
        'Diffusion at IGCSE: particles move from high to low concentration — do NOT use formal water potential or intermolecular force language.',
      ],
    },

    topic2: {
      code: '0620-T2',
      title: 'Experimental Techniques and Chemical Analysis',
      tier: 'both',
      allowedTopics: [
        'Apparatus and measurement — thermometer/digital probe (temperature); measuring cylinder, burette (±0.05 cm³), pipette (volume); balance ±0.01 g (mass); gas syringe (gas volume); stopwatch (time); choosing correct apparatus for precision required',
        'Purity — pure substance: sharp fixed melting/boiling point; impure: range of temperatures; test purity by measuring melting point (sharp = pure) or boiling point',
        'Separation techniques — filtration (insoluble solid from liquid: residue on paper, filtrate through); crystallisation/evaporation (soluble solid from liquid); simple distillation (liquid from dissolved solid or widely different boiling points); fractional distillation (close boiling points, fractionating column); paper chromatography (dissolved substances by solubility; Rf = distance substance moved / distance solvent front moved); separating funnel (immiscible liquids)',
        'Chromatography — components travel at different rates; Rf values characteristic; identify by comparison with known standards; TLC similar principle; locating agents for colourless compounds',
        'Gas tests — H₂: pop with lighted splint; O₂: relights glowing splint; CO₂: limewater milky; Cl₂: bleaches damp litmus; NH₃: damp red litmus blue; SO₂: acidified KMnO₄ purple → colourless',
        'Anion tests — Cl⁻: acidify HNO₃ + AgNO₃ → white ppt (AgCl), soluble in dilute NH₃; Br⁻: cream ppt (AgBr), conc NH₃ only; I⁻: yellow ppt (AgI), insoluble NH₃; SO₄²⁻: acidify HCl + BaCl₂ → white ppt (BaSO₄) insoluble in HCl; CO₃²⁻: dilute acid → CO₂ (limewater milky)',
        'Cation tests — NH₄⁺: NaOH + warm → NH₃ (pungent, damp red litmus blue); flame tests: Li⁺ crimson; Na⁺ yellow; K⁺ lilac; Ca²⁺ orange-red; Ba²⁺ light green; Cu²⁺ blue-green; NaOH precipitation: Cu²⁺ pale blue ppt; Fe²⁺ green ppt; Fe³⁺ brown ppt; Zn²⁺/Al³⁺ white ppt dissolves in excess NaOH',
        'Titrations — acid-base; burette + pipette technique; indicator; concordant titres (within 0.10 cm³); calculate titre; mean volume; calculations of concentration',
      ],
      forbiddenTopics: [
        'GLC/GC (gas-liquid chromatography) — beyond 0620 IGCSE',
        'Mass spectrometry for organic analysis — beyond 0620 IGCSE',
        'IR and NMR spectroscopy — beyond 0620 IGCSE',
        'Ksp and solubility product calculations — beyond 0620 IGCSE',
      ],
      requiredKeywords: [
        'filtration', 'residue', 'filtrate', 'crystallisation', 'distillation', 'chromatography',
        'Rf value', 'solvent front',
        'pure substance', 'sharp melting point', 'impure', 'range',
        'Li crimson', 'Na yellow', 'K lilac', 'Ca orange-red', 'Ba light green', 'Cu blue-green',
        'AgNO₃', 'AgCl white', 'AgBr cream', 'AgI yellow', 'BaCl₂', 'BaSO₄ white',
        'limewater', 'litmus', 'NH₃',
        'titration', 'burette', 'pipette', 'concordant',
      ],
      practicalSkills: [
        'Carry out acid-base titration accurately — correct technique, concordant titres, calculations',
        'Carry out paper chromatography — Rf calculations, identify components',
        'Carry out filtration, distillation, crystallisation',
        'Identify unknowns using cation, anion and gas tests',
      ],
      boundaryNotes: [
        'MUST acidify with HNO₃ (NOT HCl) before AgNO₃ test for halides — HCl gives false positive.',
        'MUST acidify with HCl before BaCl₂ test for sulfate — dissolves other white precipitates.',
        'ALL flame test colours required; Cu blue-green is often missed.',
      ],
    },

    topic3: {
      code: '0620-T3',
      title: 'Atoms, Elements and Compounds',
      tier: 'both',
      allowedTopics: [
        'Atomic structure — nucleus (protons: charge +1, mass 1; neutrons: charge 0, mass 1); electrons (charge −1, negligible mass) in shells; neutral atom: protons = electrons',
        'Proton/mass number — Z (proton/atomic number); A (mass/nucleon number); N = A − Z neutrons; isotopes: same Z, different A; same chemical properties, different physical; Ar = weighted mean mass relative to ¹²C; calculate from isotope data: Ar = Σ(mass × % abundance)/100',
        'Electronic configuration — shell capacities: 1st max 2, 2nd max 8, 3rd max 8 (at IGCSE); notation e.g. Na = 2,8,1; period = shells occupied; group = outer electrons; elements 1–20',
        'Periodic table — ordered by proton number; periods (horizontal); groups (vertical, same outer electron number → similar properties); metals left, non-metals right; transition metals between Groups 2 and 3',
        'Ionic bonding — electron transfer metal → non-metal; cations (+) and anions (−); electrostatic attraction; dot-and-cross diagrams: NaCl, MgO, MgCl₂, CaO, Na₂O, Al₂O₃; giant ionic lattice (regular 3D); properties: high MP/BP, conducts when molten/dissolved, brittle, water-soluble generally',
        'Covalent bonding — electron sharing between non-metals; single/double/triple bonds; dot-and-cross: H₂, Cl₂, HCl, H₂O, NH₃, CH₄, CO₂, O₂, N₂; molecular (simple): low MP/BP, no conduction; giant covalent: diamond (tetrahedral C-C, hard, high MP, non-conductor); graphite (hexagonal layers, delocalised electrons, conductor, lubricant); SiO₂ (giant, high MP)',
        'Metallic bonding — positive ion lattice + sea of delocalised electrons; conductor of electricity/heat, malleable, ductile, high MP, lustrous',
        'Alloys — mix of metals or metal + non-metal; different-sized atoms disrupt lattice → layers cannot slide → harder/stronger; steel (Fe+C); brass (Cu+Zn); bronze (Cu+Sn); solder (Sn+Pb)',
        'Formulae and equations — formulae from valency/charges; balancing symbol equations; state symbols (s)(l)(g)(aq); ionic equations with spectator ions',
      ],
      forbiddenTopics: [
        's, p, d subshells, Aufbau, Hund\'s rule — beyond 0620 IGCSE',
        'VSEPR theory for bond angles — beyond 0620 IGCSE (only describe shapes)',
        'Named intermolecular forces (London/Van der Waals/dipole-dipole/H-bonding) — beyond 0620 IGCSE',
        'Electronegativity concept — beyond 0620 IGCSE',
        'Bond polarity and molecular polarity — beyond 0620 IGCSE',
      ],
      requiredKeywords: [
        'proton', 'neutron', 'electron', 'proton number', 'mass number', 'isotope', 'relative atomic mass',
        'electronic configuration', 'shells', 'outer electrons', 'period', 'group',
        'ionic bond', 'electron transfer', 'cation', 'anion', 'giant ionic lattice',
        'covalent bond', 'electron sharing', 'molecular', 'giant covalent',
        'diamond', 'graphite', 'SiO₂', 'delocalised electrons',
        'metallic bond', 'sea of electrons', 'malleable', 'ductile',
        'alloy', 'different sized atoms', 'disrupt lattice',
        'ionic equation', 'spectator ions', 'state symbols',
      ],
      supplementOnlyPoints: [
        'Calculate Ar from isotope data: Ar = Σ(isotope mass × % abundance)/100',
        'Explain graphite conductor: one electron per C atom delocalised between layers; explain graphite lubricant: layers slide (weak forces between layers)',
        'Explain high MP of ionic compounds in terms of electrostatic attraction strength',
        'Write and balance ionic equations showing only species that change',
      ],
      boundaryNotes: [
        'VSEPR NOT in 0620 — only describe shapes (tetrahedral, linear, etc.) by observation.',
        'Intermolecular forces NOT named at 0620 — say "forces between molecules" only.',
        'Alloy hardness: different SIZED atoms disrupt REGULAR lattice → layers cannot SLIDE — all three parts needed.',
      ],
    },

    topic4: {
      code: '0620-T4',
      title: 'Stoichiometry',
      tier: 'both',
      allowedTopics: [
        'Formulae — molecular (number and type of atoms per molecule); empirical (simplest whole number ratio); structural (showing bonding); deducing from diagrams or models',
        'Equations — word and symbol equations; balancing; state symbols; ionic equations',
        'Relative formula mass (Mr) — sum of all Ar in formula; calculating from chemical formula',
        'Mole — n = m/M; 1 mol = 6.02 × 10²³ particles (Avogadro constant); molar mass = Ar or Mr in g/mol',
        'Molar volume — at RTP (~25°C, 1 atm): 1 mol gas = 24 dm³ (24,000 cm³); n = V/24 (V in dm³)',
        'Concentration — c = n/V; c in mol/dm³; V in dm³ (divide cm³ by 1000)',
        'Stoichiometric calculations — reacting masses from molar ratios; volumes of gases; concentrations and volumes of solutions; limiting reagent (completely used up, determines yield); excess reagent; percentage yield = actual/theoretical × 100; percentage purity',
        'Empirical formula from data — divide mass by Ar → divide by smallest → simplest ratio; from combustion data; molecular formula from empirical formula + known Mr',
      ],
      forbiddenTopics: [
        'pV = nRT ideal gas equation — beyond 0620 IGCSE',
        'Partial pressures — beyond 0620 IGCSE',
        'Born-Haber cycle stoichiometry — Topic 6 Energetics',
      ],
      requiredKeywords: [
        'mole', 'molar mass', 'Avogadro constant', '6.02 × 10²³',
        'n = m/M', 'c = n/V', 'molar volume', '24 dm³',
        'limiting reagent', 'excess', 'percentage yield', 'percentage purity',
        'empirical formula', 'molecular formula', 'percentage composition',
        'balanced equation', 'molar ratios',
      ],
      practicalSkills: [
        'Determine empirical formula experimentally (burn Mg; heat Cu with O₂)',
        'Carry out titration and calculate concentration of unknown',
        'Calculate percentage yield from experimental data',
        'Carry out gravimetric analysis — verify stoichiometry',
      ],
      boundaryNotes: [
        'Molar volume at RTP = 24 dm³/mol — must memorise.',
        'Avogadro: 6.02 × 10²³ (spec also uses 6 × 10²³ — both acceptable).',
        'Limiting reagent = one completely used up, determines max yield of product.',
      ],
    },

    topic5: {
      code: '0620-T5',
      title: 'Electricity and Chemistry (Electrochemistry)',
      tier: 'both',
      allowedTopics: [
        'Electrolysis — DC through molten ionic compound or aqueous electrolyte → decomposition; anode (+): oxidation, anions discharge; cathode (−): reduction, cations discharge; inert electrodes: graphite or platinum',
        'Molten compounds — molten PbBr₂: Pb at cathode (grey metal), Br₂ at anode (orange vapour); ions free to move when molten; molten Al₂O₃ in Hall-Héroult',
        'Aqueous solutions — selective discharge; cathode: less reactive metals before H⁺ (Cu²⁺ before H⁺; H⁺ before Na⁺/K⁺/Mg²⁺); anode: Cl⁻ preferred if concentrated → Cl₂; OH⁻ → O₂ if dilute; dilute H₂SO₄: H₂ (cathode), O₂ (anode); concentrated NaCl: H₂ (cathode), Cl₂ (anode), NaOH remains; CuSO₄ with Cu electrodes: Cu deposits at cathode, Cu dissolves at anode (purification)',
        'Electroplating — object as cathode; plating metal as anode; plating metal salt solution; metal deposits on object; decoration (silver, gold), corrosion protection (Cr, Zn, Sn), industrial',
        'Hydrogen fuel cell — H₂ at anode: H₂ → 2H⁺ + 2e⁻; O₂ at cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O; overall: 2H₂ + O₂ → 2H₂O; advantages: efficient, no CO₂ at point of use, only H₂O; disadvantages: H₂ storage, H₂ production (usually from fossil fuels → CO₂), expensive Pt catalyst',
        'Industrial — Al extraction (Hall-Héroult): molten Al₂O₃ in cryolite at 950°C; Al³⁺ → Al (cathode); O²⁻ → O₂ (anode → reacts with C anodes → CO₂ → anodes replaced); high energy; recycle saves 95%; chlor-alkali: concentrated brine → Cl₂ (anode), H₂ (cathode), NaOH remains; uses: Cl₂ (bleach, PVC), H₂ (Haber, margarine), NaOH (soap, paper)',
      ],
      forbiddenTopics: [
        'Standard electrode potentials E° — beyond 0620 IGCSE',
        'Electrochemical cells and cell notation (Daniell cell etc.) — beyond 0620 IGCSE',
        'Faraday quantitative calculations (m = ItM/nF) — beyond 0620 IGCSE',
        'Nernst equation — beyond 0620 IGCSE',
      ],
      requiredKeywords: [
        'electrolysis', 'electrolyte', 'anode', 'cathode',
        'oxidation at anode', 'reduction at cathode', 'inert electrode',
        'selective discharge', 'concentrated', 'dilute',
        'molten', 'ions free to move',
        'copper purification', 'cathode grows', 'anode dissolves',
        'electroplating', 'decoration', 'corrosion protection',
        'fuel cell', 'H₂', 'O₂', 'H₂O', 'efficient', 'no CO₂',
        'Hall-Héroult', 'cryolite', 'Al₂O₃', '950°C',
        'chlor-alkali', 'brine', 'Cl₂', 'NaOH',
      ],
      practicalSkills: [
        'Electrolysis of CuSO₄(aq) with copper and graphite electrodes — mass changes',
        'Electrolysis of dilute H₂SO₄ — collect and test H₂ and O₂; verify 2:1 ratio',
        'Electroplating an object with copper or nickel',
        'Investigate effect of current/time on mass deposited',
      ],
      boundaryNotes: [
        'Faraday quantitative calculations NOT in 0620 — only qualitative product prediction.',
        'ANODE = OXIDATION; CATHODE = REDUCTION — these are fundamental definitions.',
        'Fuel cell: must write both half-equations and overall equation.',
      ],
    },

    topic6: {
      code: '0620-T6',
      title: 'Chemical Energetics',
      tier: 'both',
      allowedTopics: [
        'Exothermic — energy released to surroundings; temperature increases; ΔH < 0; products lower energy than reactants; examples: combustion, neutralisation, respiration, metals + acid, metals + water',
        'Endothermic — energy absorbed from surroundings; temperature decreases; ΔH > 0; products higher energy; examples: thermal decomposition of CaCO₃, dissolving NH₄NO₃, photosynthesis',
        'Energy profile diagrams — y: energy; x: reaction coordinate; show reactants, products, Ea barrier, ΔH; exothermic: products lower; endothermic: products higher; catalyst: lower Ea (separate lower peak)',
        'Activation energy — minimum energy colliding particles need to react; energy barrier; not all collisions cause reaction',
        'Bond energies — bond breaking endothermic; bond making exothermic; ΔH = Σ(bonds broken) − Σ(bonds formed); if ΔH negative = exothermic; data given in questions; limitations: average bond energies',
        'Calorimetry — q = mcΔT; q in J, m in g, c in J g⁻¹ °C⁻¹; c(water) = 4.18 J g⁻¹ °C⁻¹; ΔH = −q/n; sources of error: heat loss, heat absorbed by container, density assumption; improvements: insulation, polystyrene calorimeter',
      ],
      forbiddenTopics: [
        'Hess\'s law multi-step calculations — beyond 0620 IGCSE',
        'Born-Haber cycles — beyond 0620 IGCSE',
        'Formal ΔHf°, ΔHc° definitions — beyond 0620 IGCSE',
        'Entropy ΔS and Gibbs free energy ΔG — beyond 0620 IGCSE',
        'Lattice enthalpy — beyond 0620 IGCSE',
      ],
      requiredKeywords: [
        'exothermic', 'endothermic', 'ΔH', 'enthalpy',
        'energy profile diagram', 'activation energy', 'catalyst lowers Ea',
        'bond breaking endothermic', 'bond making exothermic',
        'bond energy', 'ΔH = bonds broken − bonds made',
        'calorimetry', 'q = mcΔT', 'temperature change',
      ],
      practicalSkills: [
        'Measure enthalpy change of combustion of alcohols — spirit burner, water calorimeter',
        'Measure enthalpy change of neutralisation — acid + alkali, temperature change',
        'Compare enthalpy changes for different reactions',
        'Evaluate sources of error in calorimetry; suggest improvements',
      ],
      boundaryNotes: [
        'Hess\'s law NOT in 0620 IGCSE — only simple bond energy calculations and direct calorimetry.',
        'Bond energy values always given in question — students apply the formula.',
        'q = mcΔT: c(water) = 4.18 J g⁻¹ °C⁻¹; m = mass in grams; must know formula.',
      ],
    },

    topic7: {
      code: '0620-T7',
      title: 'Chemical Reactions (Rates and Equilibrium)',
      tier: 'both',
      allowedTopics: [
        'Rate of reaction — change in reactant/product per unit time; measuring: mass loss (balance); gas volume (syringe/inverted tube); turbidity (cross-disappears/clock method); colour change; pH',
        'Factors affecting rate — concentration (more particles per unit volume → more frequent collisions); temperature (more KE → more particles exceed Ea → more successful collisions); surface area (more collisions at surface); catalyst (lower Ea → more particles have enough energy; not consumed); light (photochemical reactions)',
        'Collision theory — collision needed; must have sufficient energy (≥ Ea); correct orientation; rate depends on frequency of effective collisions',
        'Maxwell-Boltzmann distribution (Supplement) — y = number of particles with given energy; x = KE; area = total particles; peak = most probable energy; long right tail; Ea marked; area right of Ea = fraction able to react; temperature increase: curve flattens, shifts right, area right of Ea increases greatly; catalyst: Ea moves left on same distribution → larger fraction can react',
        'Reversible reactions — ⇌ symbol; examples: anhydrous CuSO₄ (white) + H₂O ⇌ CuSO₄.5H₂O (blue); NH₄Cl decomposition; esterification',
        'Dynamic equilibrium — closed system; forward and reverse rates equal; concentrations constant (not necessarily equal); not static',
        'Le Chatelier\'s principle — system shifts to oppose disturbance: increase [reactant] → shifts right; increase pressure → toward fewer gas moles; increase temperature → endothermic direction; catalyst → no shift, only reaches equilibrium faster',
        'Haber process — N₂ + 3H₂ ⇌ 2NH₃; ΔH = −92 kJ/mol; N₂ from liquid air; H₂ from steam reforming; 450°C (compromise: faster rate vs lower yield from higher T); 200 atm (higher yield and faster rate but costly/unsafe); iron catalyst; continuous, unreacted gases recycled; yield ~15%; uses: fertilisers (NH₄NO₃, urea), explosives, cleaning',
        'Contact process — H₂SO₄ manufacture; S + O₂ → SO₂; 2SO₂ + O₂ ⇌ 2SO₃ (V₂O₅, 450°C, 1–2 atm); SO₃ + conc H₂SO₄ → oleum H₂S₂O₇; + H₂O → H₂SO₄; (not dissolved directly in water — violent, misty); uses: fertilisers, car batteries, detergents',
      ],
      forbiddenTopics: [
        'Rate equations rate = k[A]^m — beyond 0620 IGCSE',
        'Rate constant k and units — beyond 0620 IGCSE',
        'Order of reaction — beyond 0620 IGCSE',
        'Arrhenius equation — beyond 0620 IGCSE',
        'Equilibrium constants Kc, Kp, Ka — beyond 0620 IGCSE',
        'Half-life — beyond 0620 IGCSE',
      ],
      requiredKeywords: [
        'rate of reaction', 'collision theory', 'activation energy', 'effective collision',
        'concentration', 'temperature', 'surface area', 'catalyst',
        'Maxwell-Boltzmann distribution', 'fraction with enough energy',
        'reversible reaction', 'dynamic equilibrium', 'closed system',
        'Le Chatelier', 'oppose', 'shift',
        'Haber', 'N₂ + 3H₂ ⇌ 2NH₃', 'iron catalyst', '450°C', '200 atm', 'compromise',
        'Contact process', 'SO₂', 'SO₃', 'V₂O₅', 'oleum', 'H₂SO₄',
      ],
      practicalSkills: [
        'Investigate concentration and temperature effects on thiosulfate + HCl clock reaction',
        'Investigate catalyst effect on H₂O₂ decomposition (MnO₂, liver)',
        'Investigate surface area effect on marble chips + HCl',
        'Plot and interpret rate graphs',
      ],
      boundaryNotes: [
        'Maxwell-Boltzmann distribution is SUPPLEMENT only — must draw and interpret correctly.',
        'Le Chatelier: MUST explain WHY equilibrium shifts to oppose the change.',
        'Haber conditions: MUST explain as compromise between rate and yield — not just list them.',
      ],
    },

    topic8: {
      code: '0620-T8',
      title: 'Acids, Bases and Salts',
      tier: 'both',
      allowedTopics: [
        'pH — 0–14; acid pH < 7; neutral pH = 7; alkali pH > 7; measure: universal indicator, pH probe, litmus paper',
        'Acids — produce H⁺ in solution; strong (fully ionise: HCl, H₂SO₄, HNO₃); weak (partially ionise: CH₃COOH, H₂CO₃, citric acid); same concentration: strong has lower pH',
        'Bases and alkalis — base: reacts with acid to give salt + water (oxide or hydroxide); alkali: soluble base, produces OH⁻; NaOH, KOH, Ca(OH)₂, NH₃(aq)',
        'Neutralisation — acid + alkali → salt + water; acid + base → salt + water; acid + carbonate → salt + water + CO₂; acid + metal → salt + H₂',
        'Salts and preparation — naming (from acid: HCl → chloride; H₂SO₄ → sulfate; HNO₃ → nitrate); soluble salts: insoluble base + acid (excess base, filter, evaporate); alkali + acid (titration); metal + acid (excess metal, filter); insoluble salts: precipitation (mix two solutions → ppt → filter → wash → dry)',
        'Oxides — metal oxides: basic (react with acids); non-metal oxides: acidic (react with water or alkalis); amphoteric (Al₂O₃ and ZnO react with both acids and alkalis); neutral (CO, H₂O, NO)',
        'Strong vs weak acids (Supplement) — strong fully dissociate → high [H⁺]; weak partially dissociate → low [H⁺]; same concentration: different pH, conductivity, rate with Mg',
      ],
      forbiddenTopics: [
        'Ka, pKa values — beyond 0620 IGCSE',
        'pH calculations (log [H⁺]) — beyond 0620 IGCSE',
        'Buffer solutions — beyond 0620 IGCSE',
        'Kw = [H⁺][OH⁻] — beyond 0620 IGCSE',
        'Titration curves and indicator choice by pKin — beyond 0620 IGCSE',
      ],
      requiredKeywords: [
        'pH scale', 'acid', 'alkali', 'base', 'neutral',
        'strong acid', 'weak acid', 'fully ionise', 'partially ionise',
        'neutralisation', 'salt', 'water',
        'metal oxide basic', 'non-metal oxide acidic', 'amphoteric',
        'Al₂O₃', 'ZnO',
        'soluble salt', 'insoluble salt', 'precipitation', 'excess', 'filter', 'crystallise',
      ],
      practicalSkills: [
        'Prepare soluble salt by titration (acid-base)',
        'Prepare soluble salt from acid and insoluble base',
        'Prepare insoluble salt by precipitation',
        'Investigate pH of substances; compare strong and weak acids with Mg',
      ],
      boundaryNotes: [
        'Strong = fully ionised, weak = partially ionised — same concentration does NOT mean same [H⁺].',
        'Only Al₂O₃ and ZnO are named as amphoteric in 0620 spec.',
        'Insoluble salt precipitation: must include washing with distilled water and drying.',
      ],
    },

    topic9: {
      code: '0620-T9',
      title: 'The Periodic Table',
      tier: 'both',
      allowedTopics: [
        'History — Mendeleev arranged by atomic mass, gaps for undiscovered elements; modern table by proton number; periods (rows), groups (columns, same outer electrons → similar properties)',
        'Group 1 alkali metals (Li, Na, K, Rb, Cs) — with water: 2M + 2H₂O → 2MOH + H₂; vigour: Li < Na (melts/ball) < K (ignites lilac) < Rb/Cs (explode); soft, low density, silver-shiny, tarnish quickly; stored in oil; reactivity increases down (IE decreases, outer electron further/more shielded); flame tests: Li red, Na yellow, K lilac',
        'Group 7 halogens (F, Cl, Br, I) — state at rtp: F₂ pale yellow gas; Cl₂ greenish-yellow gas; Br₂ brown/red liquid; I₂ grey-black solid (purple vapour); reactivity decreases down; displacement: Cl₂ displaces Br⁻ and I⁻; Br₂ displaces I⁻ only; colour in organic solvent: Cl₂ pale/colourless; Br₂ orange; I₂ purple; oxidising power decreases down',
        'Group 18 noble gases — full outer shells → inert/unreactive; monatomic; He (balloons, airships); Ar (light bulbs, welding, double glazing); Ne (advertising signs); Kr/Xe (specialist lighting)',
        'Transition metals — between Groups 2 and 3; high density, high MP (except Hg); hard/strong; less reactive than Gp 1/2; coloured compounds; variable oxidation numbers (Fe: 2+/3+; Cu: 1+/2+; Mn: 2+/4+/7+; Cr: 3+/6+); catalysts: Fe (Haber), V₂O₅ (Contact), Ni (hydrogenation), MnO₂ (H₂O₂), Pt/Pd/Rh (catalytic converter)',
        'Period 3 trends — MP: increases Na → Si (giant structures) then decreases (molecular P₄, S₈, Cl₂, Ar); conductivity: Na > Mg > Al then insulators; metal reactivity decreases across; non-metal reactivity increases across',
      ],
      forbiddenTopics: [
        'Ionisation energy quantitative trends — beyond 0620 (qualitative for Gp 1 only)',
        'd-block electron configurations — beyond 0620 IGCSE',
        'Complex ion formation — beyond 0620 IGCSE',
        'Crystal field theory and d-d transitions — beyond 0620 IGCSE',
      ],
      requiredKeywords: [
        'Mendeleev', 'proton number', 'period', 'group',
        'alkali metals', 'Group 1', 'reactivity increases down', 'ionisation energy', 'shielding',
        'halogens', 'Group 7', 'reactivity decreases down', 'displacement', 'oxidising power',
        'organic solvent colour', 'Cl₂ pale', 'Br₂ orange', 'I₂ purple',
        'noble gases', 'inert', 'full outer shell',
        'transition metals', 'variable oxidation number', 'coloured compounds', 'catalyst',
      ],
      practicalSkills: [
        'Group 1 reactions with water — observe Li, Na, K; measure pH of solution produced',
        'Halogen displacement reactions — add Cl₂/Br₂ water to halide solutions; add organic solvent; observe colour',
        'Transition metal reactions with acid; NaOH precipitation tests',
      ],
      boundaryNotes: [
        'Group 1 reactivity INCREASES down; Group 7 reactivity DECREASES down — opposite trends.',
        'Transition metal oxidation states: Fe(2+/3+), Cu(1+/2+), Mn(2+/4+/7+), Cr(3+/6+) — all required.',
        'Halogen displacement colours must be known for BOTH aqueous and organic solvent layers.',
      ],
    },

    topic10: {
      code: '0620-T10',
      title: 'Metals',
      tier: 'both',
      allowedTopics: [
        'Metal vs non-metal properties — metals: high density (generally), high MP (generally), malleable/ductile, good conductor electricity/heat, shiny, form positive ions; non-metals: low density, low MP (often gases), brittle, poor conductor, dull; exceptions: mercury (liquid metal), Na/K (low density), iodine (shiny non-metal)',
        'Reactivity series — K > Na > Ca > Mg > Al > (C) > Zn > Fe > (H) > Cu > Ag > Au > Pt; K/Na/Ca react with cold water; Mg slowly in cold water, vigorously with steam; Al protective oxide; Zn/Fe react with steam; Cu/Ag/Au unreactive with dilute acids',
        'Displacement reactions — more reactive displaces less reactive from salt solution; e.g. Mg + CuSO₄ → MgSO₄ + Cu; evidence: colour change, temperature change; thermite: Al + Fe₂O₃ → Al₂O₃ + Fe',
        'Extraction — method depends on reactivity: K/Na/Ca/Mg/Al (too reactive for C reduction) → electrolysis; metals below C in series (Zn/Fe/Pb/Cu) → reduction by C or CO; Ag/Au/Pt → found native or easily reduced; ores: naturally occurring metal compounds',
        'Blast furnace (iron) — raw materials: Fe₂O₃ ore, coke (C), limestone (CaCO₃), air; C + O₂ → CO₂; CO₂ + C → 2CO; Fe₂O₃ + 3CO → 2Fe + 3CO₂; CaCO₃ → CaO + CO₂; CaO + SiO₂ → CaSiO₃ (slag); molten iron (pig iron ~4% C) collected; converted to steel by removing C/adding metals',
        'Hall-Héroult (aluminium) — molten Al₂O₃ dissolved in cryolite (Na₃AlF₆) at ~950°C; Al³⁺ + 3e⁻ → Al (cathode); 2O²⁻ → O₂ + 4e⁻ (anode → reacts with C anode → CO₂ → replace regularly); very high energy; recycling Al saves ~95% energy',
        'Rusting — requires O₂ AND H₂O; rust = hydrated Fe₂O₃; salt accelerates; prevention: paint, oil, grease, tin plating, galvanising (Zn coating), sacrificial protection (Zn or Mg anode — more reactive, oxidised preferentially, protects iron even when coating scratched); stainless steel (Fe + Cr + Ni)',
        'Alloys — superior properties; steel (Fe + C); stainless steel (Fe + Cr + Ni); brass (Cu + Zn); bronze (Cu + Sn); solder (Sn + Pb); different sized atoms disrupt lattice → harder',
      ],
      forbiddenTopics: [
        'Ellingham diagrams — beyond 0620 IGCSE',
        'Zone refining — beyond 0620 IGCSE',
        'Pourbaix diagrams — beyond 0620 IGCSE',
        'Detailed electrode equations for Al beyond half-equations — beyond 0620 IGCSE',
      ],
      requiredKeywords: [
        'reactivity series', 'displacement', 'oxidation', 'reduction',
        'blast furnace', 'Fe₂O₃', 'coke', 'limestone', 'CO', 'slag', 'CaSiO₃', 'pig iron',
        'Hall-Héroult', 'cryolite', 'Al₂O₃', '950°C', 'anode replaced',
        'rusting', 'O₂ AND H₂O', 'galvanising', 'sacrificial protection', 'stainless steel',
        'alloy', 'different sized atoms', 'disrupt lattice',
      ],
      practicalSkills: [
        'Investigate rusting conditions — iron nails in different conditions (air+water; air only; water only; boiled water+oil)',
        'Investigate displacement reactions — temperature changes',
        'Investigate rust prevention methods',
        'Electroplate objects',
      ],
      boundaryNotes: [
        'Rusting: BOTH O₂ AND H₂O required — one alone is wrong.',
        'Blast furnace: CO is the reducing agent for Fe₂O₃ — Fe₂O₃ + 3CO → 2Fe + 3CO₂.',
        'Sacrificial protection: Zn/Mg oxidised PREFERENTIALLY — protects Fe even when coating is scratched.',
      ],
    },

    topic11: {
      code: '0620-T11',
      title: 'Air and Water',
      tier: 'both',
      allowedTopics: [
        'Air composition — N₂ ~78%, O₂ ~21%, Ar ~1%, CO₂ ~0.04%; traces of noble gases, water vapour; determine O₂ %: pass air over heated copper → mass decrease = O₂ absorbed; or slow rusting of iron in closed volume',
        'Air pollution — CO (incomplete combustion → toxic → binds Hb; catalytic converter: CO + NO → CO₂ + N₂); NOₓ (high T in engines: N₂ + O₂ → 2NO → acid rain, photochemical smog); SO₂ (sulfur-containing fuels → acid rain; flue gas desulfurisation: CaO/Ca(OH)₂ + SO₂ → CaSO₃); CO₂ (combustion → greenhouse gas → global warming/climate change); particulates (incomplete combustion → respiratory problems); CFCs (destroy stratospheric ozone)',
        'Water tests — anhydrous CuSO₄ (white → blue); anhydrous CoCl₂ (blue → pink); pure water: fixed MP 0°C and BP 100°C',
        'Hard water — dissolved Ca²⁺ and Mg²⁺ (from CaCO₃, CaSO₄, Ca(HCO₃)₂); forms scum with soap; temporary hardness: Ca(HCO₃)₂ → removed by boiling (CaCO₃ precipitates = limescale); permanent hardness: CaSO₄ NOT removed by boiling; both removed by: ion exchange (Ca²⁺/Mg²⁺ → Na⁺/H⁺), washing soda (Na₂CO₃), distillation',
        'Water purification — sedimentation (flocculation with Al₂SO₄); filtration (sand/gravel beds); chlorination (kills bacteria); fluoridation (1 ppm → prevents tooth decay by hardening enamel; controversial: dental benefits vs ethical objections to mass medication)',
      ],
      forbiddenTopics: [
        'Photochemical smog detailed chemistry — beyond 0620 IGCSE',
        'Ozone layer Chapman cycle — beyond 0620 IGCSE',
        'Detailed water treatment plant engineering — beyond 0620 IGCSE',
      ],
      requiredKeywords: [
        'N₂ 78%', 'O₂ 21%', 'Ar 1%', 'CO₂ 0.04%',
        'CO', 'catalytic converter', 'CO + NO → CO₂ + N₂',
        'NOₓ', 'acid rain', 'SO₂', 'flue gas desulfurisation',
        'greenhouse gas', 'global warming', 'CO₂',
        'anhydrous CuSO₄ white→blue', 'anhydrous CoCl₂ blue→pink',
        'hard water', 'Ca²⁺', 'Mg²⁺', 'scum', 'limescale',
        'temporary hardness', 'Ca(HCO₃)₂', 'removed by boiling',
        'permanent hardness', 'CaSO₄', 'not removed by boiling',
        'ion exchange', 'washing soda', 'Na₂CO₃',
        'sedimentation', 'filtration', 'chlorination', 'fluoridation',
      ],
      practicalSkills: [
        'Test for water using anhydrous CuSO₄ and anhydrous CoCl₂',
        'Investigate water hardness — soap solution lather; before and after softening',
        'Investigate temporary vs permanent hardness — boiling effect',
      ],
      boundaryNotes: [
        'Temporary hardness: specifically Ca(HCO₃)₂ — not just "dissolved calcium salts".',
        'Permanent hardness: CaSO₄ (and MgSO₄) — NOT removed by boiling.',
        'Both water tests required: anhydrous CuSO₄ AND anhydrous CoCl₂.',
      ],
    },

    topic12: {
      code: '0620-T12',
      title: 'Sulfur',
      tier: 'both',
      allowedTopics: [
        'Contact process — H₂SO₄ manufacture; stage 1: S + O₂ → SO₂; stage 2: 2SO₂ + O₂ ⇌ 2SO₃ (V₂O₅ catalyst, 450°C, 1–2 atm); stage 3: SO₃ dissolved in conc H₂SO₄ → oleum (H₂S₂O₇); stage 4: oleum + H₂O → H₂SO₄; (NOT dissolved in water directly: too violent, produces acid mist); conditions are compromise between rate and equilibrium yield',
        'H₂SO₄ properties and uses — colourless, oily, dense liquid; strong dibasic acid; dehydrating agent (removes H₂O from compounds: sucrose → C + H₂O); oxidising agent (concentrated); reactions: metals → sulfate + H₂; metal oxides → sulfate + H₂O; metal hydroxides → sulfate + H₂O; metal carbonates → sulfate + H₂O + CO₂; uses: fertilisers (ammonium sulfate, superphosphate), lead-acid batteries, detergents, dyes, pharmaceuticals',
        'Acid rain — SO₂ from fossil fuel combustion + volcanic emissions; NOₓ from engines; dissolve in rain → H₂SO₄ + HNO₃; pH < 5.6; effects: damages forests (leaches nutrients), acidifies lakes/streams (kills fish at low pH), corrodes limestone buildings and statues, corrodes metals; solutions: FGD (wet scrubbing with Ca(OH)₂ or CaCO₃); catalytic converters for NOₓ',
      ],
      forbiddenTopics: [
        'Allotropes of sulfur (rhombic, monoclinic) — beyond 0620 IGCSE',
        'Thiosulfate reactions — beyond 0620 IGCSE (except clock reaction in Topic 7)',
        'Industrial conditions already in Topic 7 — avoid repetition',
      ],
      requiredKeywords: [
        'Contact process', 'SO₂', 'SO₃', 'V₂O₅', '450°C', 'oleum', 'H₂SO₄',
        'dehydrating agent', 'oxidising agent',
        'acid rain', 'pH < 5.6', 'damages forests', 'acidifies lakes', 'corrodes limestone',
        'flue gas desulfurisation', 'slaked lime', 'Ca(OH)₂',
      ],
      boundaryNotes: [
        'Why not dissolve SO₃ directly in water: violent, exothermic, produces fine acid mist/fog.',
        'Contact process conditions: 450°C is compromise (higher T → faster rate but lower equilibrium yield).',
      ],
    },

    topic13: {
      code: '0620-T13',
      title: 'Carbonates',
      tier: 'both',
      allowedTopics: [
        'Limestone — calcium carbonate CaCO₃; constituent of chalk and marble; thermal decomposition: CaCO₃ → CaO + CO₂ (~1000°C, limestone kiln); CaO (quicklime) + H₂O → Ca(OH)₂ (slaked lime); Ca(OH)₂ solution = limewater (CO₂ test: turns milky)',
        'Uses of limestone — building material; CaO (quicklime) for cement, glass, steel, agriculture; Ca(OH)₂ (neutralise acid soil, water treatment, plaster); flux in blast furnace: CaO + SiO₂ → CaSiO₃ (slag)',
        'Carbonate reactions — carbonates + acid → salt + water + CO₂ (effervescence); thermal stability of Group 2 carbonates increases down group: MgCO₃ easiest to decompose; BaCO₃ most stable; Group 1 (except Li₂CO₃) stable to heat; test for carbonate: dilute acid → CO₂ turns limewater milky',
        'Carbon cycle — CO₂ removed by photosynthesis and ocean dissolution; returned by respiration, combustion, decay; CaCO₃ formation/weathering; importance of controlling atmospheric CO₂',
      ],
      forbiddenTopics: [
        'Portland cement chemistry in detail — beyond 0620 IGCSE',
        'Karst topography — beyond 0620 IGCSE',
        'Detailed carbonate-silicate geological cycle — beyond 0620 IGCSE',
      ],
      requiredKeywords: [
        'CaCO₃', 'limestone', 'chalk', 'marble',
        'thermal decomposition', 'CaO', 'quicklime', 'Ca(OH)₂', 'slaked lime', 'limewater',
        'carbonate + acid → CO₂', 'effervescence',
        'thermal stability increases down Group 2', 'MgCO₃ least stable', 'BaCO₃ most stable',
        'flux', 'slag', 'acid soil neutralisation',
      ],
      boundaryNotes: [
        'Thermal stability of Group 2 carbonates INCREASES DOWN group — MgCO₃ decomposes most easily.',
        'Group 1 carbonates (except Li₂CO₃) do NOT decompose on heating.',
        'CaO + H₂O → Ca(OH)₂ is exothermic (slaking of lime) — vigorous reaction.',
      ],
    },

    topic14: {
      code: '0620-T14',
      title: 'Organic Chemistry',
      tier: 'both',
      allowedTopics: [
        'Introduction — organic compounds contain C (usually with H, O, N); homologous series: same general formula, differ by CH₂, similar chemical properties, trend in physical properties; functional group: atom/group responsible for characteristic reactions; structural isomers: same molecular formula, different structural formula',
        'Alkanes — CₙH₂ₙ₊₂; saturated; combustion: complete → CO₂ + H₂O; incomplete → CO + H₂O and/or soot; halogen substitution in UV light (free radical): CH₄ + Cl₂ → CH₃Cl + HCl (mixture of products); IUPAC naming (meth, eth, prop, but, pent); crude oil fractional distillation (fractions by BP); cracking: thermal (high T) or catalytic (lower T, zeolite) → shorter alkanes + alkenes',
        'Alkenes — CₙH₂ₙ; unsaturated; C=C; more reactive than alkanes; addition reactions: bromine water (orange → colourless = test for alkene/unsaturation); HBr → halogenoalkane; H₂O (steam, H₃PO₄ catalyst, 300°C, 60–70 atm) → alcohol; H₂ (Ni catalyst, 150°C) → alkane (hydrogenation); Markovnikov\'s rule (H to less substituted C); addition polymerisation: monomers → polymer; draw repeat unit from monomer; poly(ethene), poly(propene), PVC, PTFE',
        'Alcohols — CₙH₂ₙ₊₁OH; −OH group; miscible with water (lower); higher BP than alkanes; combustion → CO₂ + H₂O; oxidation (acidified KMnO₄ or K₂Cr₂O₇): primary → aldehyde → carboxylic acid; secondary → ketone; tertiary → no oxidation; reaction with Na → H₂; dehydration (Al₂O₃ 400°C or conc H₂SO₄) → alkene; esterification (carboxylic acid + alcohol ⇌ ester + H₂O, conc H₂SO₄); ethanol by fermentation (glucose, yeast, 30°C, anaerobic) or by hydration of ethene',
        'Carboxylic acids — CₙH₂ₙ₊₁COOH; −COOH; weak acids; reactions with Na → H₂; NaOH → salt; Na₂CO₃ → salt + CO₂ (distinguishes from alcohols); esterification with alcohols',
        'Esters — −COO− linkage; naming (methyl ethanoate from methanol + ethanoic acid); acid hydrolysis → carboxylic acid + alcohol; base hydrolysis/saponification → carboxylate salt + alcohol; uses: perfumes, flavourings, solvents, biodiesel',
        'Polymers — addition: from alkenes; repeat unit (no double bond); poly(ethene), poly(propene), PVC (from chloroethene), PTFE; condensation: two functional groups; small molecule eliminated (H₂O or HCl); polyesters (diol + dicarboxylic acid, Terylene from ethane-1,2-diol + benzene-1,4-dicarboxylic acid); polyamides (diamine + dicarboxylic acid, nylon-6,6; peptide link = amide link); proteins (amino acids → polypeptides); hydrolysis of polymers',
        'Environmental — non-biodegradable addition polymers; plastic pollution; solutions: reduce, reuse, recycle, biodegradable alternatives, incineration (CO₂ produced)',
        'Macromolecules (Supplement) — DNA double helix: nucleotides (sugar + phosphate + base); bases A-T, G-C; stores genetic information; proteins: polypeptide chains; sequence of amino acids; secondary and tertiary folding; enzymes, antibodies',
      ],
      forbiddenTopics: [
        'Curly arrow mechanisms (SN1, SN2, electrophilic addition) — beyond 0620 IGCSE',
        'NMR, IR, mass spectrometry — beyond 0620 IGCSE',
        'Optical isomerism — beyond 0620 IGCSE',
        'E/Z geometric isomerism — beyond 0620 IGCSE',
        'Tollens\' and Fehling\'s tests — NOT in 0620 spec',
        'Benzene and arenes — beyond 0620 IGCSE',
        'Amines and amino acid chemistry beyond condensation context — beyond 0620 IGCSE',
      ],
      requiredKeywords: [
        'homologous series', 'functional group', 'structural isomer',
        'alkane', 'saturated', 'combustion', 'cracking', 'fractional distillation',
        'alkene', 'unsaturated', 'C=C', 'bromine water', 'addition reaction', 'Markovnikov',
        'addition polymerisation', 'repeat unit', 'polymer',
        'alcohol', '-OH', 'esterification', 'fermentation', 'dehydration',
        'carboxylic acid', '-COOH', 'weak acid', 'Na₂CO₃ effervescence',
        'ester', '-COO-', 'saponification', 'hydrolysis',
        'condensation polymerisation', 'polyester', 'polyamide', 'nylon', 'Terylene',
        'peptide bond', 'amino acid', 'protein',
      ],
      practicalSkills: [
        'Esterification reaction — mix ethanol + ethanoic acid with conc H₂SO₄; warm; identify ester by smell',
        'Test for alkenes with bromine water',
        'Chromatography to identify organic compounds',
        'Investigate fermentation conditions — temperature, concentration, yeast; measure CO₂',
        'Cracking paraffin oil — test alkene products with bromine water',
      ],
      boundaryNotes: [
        'Curly arrow mechanisms NOT in 0620 — only equations and observations.',
        'Tollens\' and Fehling\'s tests NOT in 0620 spec.',
        'DNA structure and protein details are SUPPLEMENT at 0620.',
      ],
    },
  },

  // ============================================================
  // CIE IGCSE PHYSICS (0625) — 5 Sections
  // Source: Cambridge 0625 Syllabus Version 1, 2023–2025
  // Space Physics is COMPULSORY from 2023 (new addition)
  // ============================================================
  physics: {

    section1: {
      code: '0625-S1',
      title: 'Motion, Forces and Energy',
      tier: 'both',
      allowedTopics: [
        // MEASUREMENT AND SCALARS/VECTORS
        'Scalars and vectors — scalar (magnitude only): distance, speed, time, mass, energy, temperature; vector (magnitude + direction): displacement, velocity, acceleration, force, weight, momentum; resultant of two vectors at right angles by Pythagoras or scale drawing',
        'Measurement — rulers/measuring cylinders (length/volume); clocks/digital timers (time); average values (e.g. pendulum period by timing multiple swings)',
        // MOTION
        'Speed and velocity — speed = distance/time; velocity = displacement/time (vector); acceleration a = Δv/Δt; units m/s, m/s²',
        'Distance-time graphs — gradient = speed; horizontal = stationary; straight line = constant speed; curve = changing speed',
        'Velocity-time graphs — gradient = acceleration; area = displacement; horizontal = constant velocity; slope up = acceleration; slope down = deceleration',
        'Equations of motion — v = u + at; s = ½(u+v)t; s = ut + ½at²; v² = u² + 2as; for uniform acceleration',
        'Free fall — g ≈ 9.8 m/s² near Earth; all objects same acceleration in vacuum; no air resistance',
        'Terminal velocity — weight (constant) vs drag (increases with speed); when drag = weight → net force = 0 → terminal velocity; applies to parachutists, raindrops',
        // MASS, WEIGHT, DENSITY
        'Mass — quantity of matter; scalar; kg; measured with balance (independent of gravity)',
        'Weight — gravitational force on mass; W = mg; vector; N; g = 9.8 N/kg; measured with newton meter',
        'Density — ρ = m/V; kg/m³ or g/cm³; regular solid: measure dimensions; irregular: displacement; liquid: mass and volume',
        // FORCES
        'Forces — push/pull; Newton; effects: change speed, direction, shape; resultant = vector sum',
        'Newton\'s 1st law — object at rest/constant velocity unless resultant force acts; inertia',
        'Newton\'s 2nd law — F = ma; resultant force and acceleration in same direction',
        'Newton\'s 3rd law — equal and opposite reaction on different object; same type',
        'Friction — opposes relative motion; produces heat',
        'Circular motion (qualitative) — centripetal force toward centre; speed constant but velocity direction changes; provided by gravity (planets), tension, friction etc.',
        // MOMENTUM
        'Momentum — p = mv; kg m/s; vector; conservation in closed system (no external net force); apply to collisions and explosions',
        'Impulse — F×t = Δp; area under F-t graph; explains crumple zones, airbags',
        // ENERGY, WORK, POWER
        'Work done — W = Fd (parallel force/displacement); J',
        'Energy forms — kinetic (½mv²), gravitational PE (mgh), elastic PE, thermal, chemical, electrical, nuclear, light, sound; conservation (total constant)',
        'Efficiency — useful output/total input × 100%; < 100% due to heat dissipation',
        'Power — P = W/t = E/t; W (1 W = 1 J/s); P = Fv',
        'Energy resources — renewable (solar, wind, hydroelectric, tidal, wave, geothermal, biomass); non-renewable (fossil fuels, nuclear); environmental impacts',
        // PRESSURE
        'Pressure — P = F/A; Pa (N/m²); fluid pressure P = hρg; pressure acts in all directions at same depth; Boyle\'s law (Supplement): pV = constant at constant T; atmospheric pressure; Archimedes: upthrust = weight of fluid displaced; float if upthrust ≥ weight',
      ],
      forbiddenTopics: [
        'SHM (simple harmonic motion) — NOT in 0625 IGCSE spec at all',
        'Rotational dynamics (torque = Iα, moment of inertia) — NOT in 0625 IGCSE',
        'Gravitational field detail (g = GM/r²) — NOT in 0625 IGCSE',
        'Special/general relativity — beyond 0625 IGCSE',
      ],
      requiredKeywords: [
        'scalar', 'vector', 'speed', 'velocity', 'acceleration', 'displacement',
        'distance-time graph', 'velocity-time graph', 'area under graph', 'gradient',
        'equations of motion', 'SUVAT', 'terminal velocity', 'drag',
        'mass', 'weight', 'W = mg', 'g = 9.8 N/kg', 'density', 'ρ = m/V',
        'Newton\'s laws', 'F = ma', 'resultant', 'inertia', 'friction',
        'circular motion', 'centripetal force',
        'momentum', 'p = mv', 'conservation of momentum', 'impulse', 'F×t',
        'W = Fd', 'Ek = ½mv²', 'Ep = mgh', 'efficiency', 'P = W/t', 'P = Fv',
        'P = F/A', 'P = hρg', 'Archimedes', 'upthrust',
      ],
      supplementOnlyPoints: [
        'Derive equations of motion from graphs and definitions',
        'Calculate resultant of two vectors at right angles using Pythagoras',
        'Boyle\'s law: p₁V₁ = p₂V₂ at constant temperature; graphical representation',
        'Conservation of momentum: numerical calculations for elastic and inelastic collisions and explosions',
        'Explain terminal velocity in terms of forces and changing acceleration',
        'Describe qualitatively circular motion: speed constant, velocity direction continuously changing, force perpendicular to velocity directed to centre',
      ],
      practicalSkills: [
        'Measure g by free-fall (electromagnet release + timer) or pendulum (T² vs l graph)',
        'Verify Newton\'s 2nd law (trolley, pulley, mass hanger, light gates)',
        'Investigate Hooke\'s law — F vs extension; spring constant k; elastic limit',
        'Investigate conservation of momentum (trolleys/air track)',
        'Determine density of regular and irregular solids, liquids',
        'Investigate terminal velocity in viscous fluid (ball bearings in glycerol)',
      ],
      boundaryNotes: [
        'Circular motion at 0625 is QUALITATIVE ONLY — no F = mv²/r calculation required.',
        'Know all four SUVAT equations; identify which to use from given/unknown quantities.',
        'Boyle\'s law is SUPPLEMENT only.',
      ],
    },

    section2: {
      code: '0625-S2',
      title: 'Thermal Physics',
      tier: 'both',
      allowedTopics: [
        'Particle model — matter = particles in constant random motion; temperature = average KE; absolute zero (−273°C = 0 K) = minimum KE',
        'States of matter — solid: fixed positions, vibrate; liquid: random, slide past; gas: widely spaced, rapid random; changes of state: energy changes PE not KE → temperature constant during change of state',
        'Brownian motion — random jerky movement of smoke/pollen particles due to bombardment by invisible air/liquid molecules; evidence for particle motion',
        'Thermal expansion — solids/liquids/gases expand when heated; gases expand most; applications: thermometers, bimetallic strips, railway gaps, expansion joints; liquid-in-glass thermometer (liquid expands); bimetallic strip (different expansion rates → bends)',
        'Specific heat capacity — Q = mcΔT; c = energy per unit mass per °C; unit J/(kg°C); water c = 4200 J/(kg°C) → good coolant, climate moderator',
        'Specific latent heat — Q = mL; fusion (solid ↔ liquid); vaporisation (liquid ↔ gas); energy overcomes intermolecular bonds → no temperature change; plateaus on heating/cooling curves',
        'Pressure law — P/T = constant at constant volume (T in Kelvin); T(K) = θ(°C) + 273; p₁/T₁ = p₂/T₂',
        'Boyle\'s law (Supplement) — pV = constant at constant T; p₁V₁ = p₂V₂; P-V graph: hyperbola; P vs 1/V: straight line',
        'Kinetic theory of gases — pressure due to particle collisions with walls; increasing T → faster particles → more frequent/harder collisions → higher pressure; decreasing V → more collisions per wall area → higher pressure',
        'Conduction — through material without bulk movement; best in solids; metals best (free electrons); liquids and gases poor; rate depends on: temperature difference, material, thickness, cross-section',
        'Convection — bulk movement of fluid; warm fluid rises (less dense), cool sinks (denser); convection currents; not in solids; examples: room heating, hot water systems, ocean currents',
        'Radiation — infrared EM waves; no medium needed; emitted by all objects above 0 K; amount increases with temperature; dark/matt = best emitter and absorber; shiny/smooth = poor emitter (good reflector), poor absorber',
        'Insulation applications — double glazing (air gap), loft insulation, cavity walls (reduce convection), reflective foil (reduce radiation); vacuum flask (silvered → reduce radiation; vacuum → no conduction/convection)',
      ],
      forbiddenTopics: [
        'Entropy and second law — beyond 0625 IGCSE',
        'Stefan-Boltzmann law calculations (P = σAT⁴) — beyond 0625 IGCSE',
        'Specific heat capacity of gases Cv and Cp — beyond 0625 IGCSE',
        'Detailed molecular bond energy calculations — beyond 0625 IGCSE',
      ],
      requiredKeywords: [
        'kinetic theory', 'random motion', 'average kinetic energy', 'absolute zero', '0 K', '−273°C',
        'T(K) = θ(°C) + 273', 'Brownian motion',
        'Q = mcΔT', 'specific heat capacity', 'Q = mL', 'specific latent heat',
        'latent heat of fusion', 'latent heat of vaporisation', 'no temperature change',
        'P/T = constant', 'p₁V₁ = p₂V₂', 'Boyle\'s law',
        'conduction', 'convection', 'radiation', 'infrared',
        'dark matt', 'good absorber', 'good emitter', 'shiny', 'poor emitter',
        'convection current', 'less dense rises', 'denser sinks',
        'double glazing', 'vacuum flask',
      ],
      supplementOnlyPoints: [
        'Boyle\'s law: p₁V₁ = p₂V₂; P vs 1/V straight line through origin',
        'Explain gas pressure using kinetic theory: number of molecules × average force per collision per unit area of wall; explain changes in T and V',
        'Absolute zero from P-T graph: extrapolate P/T relationship → P = 0 at −273°C',
      ],
      practicalSkills: [
        'Measure specific heat capacity by electrical heating (metal block, water)',
        'Measure specific latent heat of ice fusion',
        'Investigate radiation absorption/emission (Leslie cube: dark vs silver surfaces)',
        'Investigate gas pressure vs temperature at constant volume (pressure thermometer)',
        'Investigate Boyle\'s law (syringe; measure P and V)',
        'Compare thermal conductivity of different materials',
      ],
      boundaryNotes: [
        'MUST use Kelvin for all gas law calculations — a very common error.',
        'Latent heat: temperature CONSTANT during change of state (energy changes PE, not KE).',
        'Boyle\'s law is SUPPLEMENT only at 0625.',
      ],
    },

    section3: {
      code: '0625-S3',
      title: 'Waves',
      tier: 'both',
      allowedTopics: [
        'Wave properties — amplitude A; wavelength λ (m); frequency f (Hz); period T = 1/f (s); wave speed v = fλ; transverse (vibration ⊥ travel: EM, water, S-waves); longitudinal (vibration ∥ travel: sound, P-waves, compressions/rarefactions)',
        'EM wave speed — c = 3×10⁸ m/s in vacuum; speed of sound in air ≈ 340 m/s; sound faster in liquids and solids',
        'Reflection — angle of incidence = angle of reflection (from normal); plane mirror image: virtual, upright, laterally inverted, same size, same distance behind as object in front',
        'Refraction — direction changes on entering different speed medium; light bends toward normal entering denser (slower); away when exiting; Snell\'s law: n₁ sin θ₁ = n₂ sin θ₂; refractive index n = c/v = sin i/sin r',
        'Total internal reflection — dense to less dense medium; angle > critical angle θc; sin θc = 1/n; optical fibres (telecommunications, endoscopy); diamond brilliance; prism periscopes',
        'Converging lens — parallel rays → focal point F; focal length f; real inverted image (object beyond F); virtual upright magnified image (object between F and lens); ray diagrams; applications: camera, magnifying glass, projector, eye',
        'Dispersion — prism splits white light → spectrum ROYGBIV; different wavelengths → different speeds in glass → different n → different refraction angles; red least refracted (longest λ); violet most',
        'Sound — longitudinal; medium required; cannot travel in vacuum; 20 Hz–20 kHz (human hearing); ultrasound > 20 kHz; infrasound < 20 Hz; loudness ∝ amplitude; pitch ∝ frequency',
        'Speed of sound — ≈ 340 m/s air; measure by echo (d = vt/2) or two-microphone; thunder-lightning distance',
        'Ultrasound applications — prenatal scanning (pulses reflected at tissue boundaries → time of return → depth → image); sonar (SONAR) for sea depth/submarines; kidney stone destruction; non-destructive testing; non-ionising (safe for soft tissue)',
        'Doppler effect — moving source: toward observer → compressed → higher f (blue shift); away → stretched → lower f (red shift); applications: speed radar, medical Doppler, astronomy (galaxy redshift)',
        'EM spectrum — all transverse; all c = 3×10⁸ m/s in vacuum; order decreasing λ/increasing f: radio → microwave → infrared → visible (ROYGBIV) → UV → X-ray → gamma',
        'EM uses — radio (communications, TV, radio); microwaves (satellite comms, mobile, cooking); infrared (thermal imaging, remote controls, optical fibre); visible (vision, photography); UV (sterilisation, fluorescence, vitamin D, forgery detection); X-rays (medical imaging, CT, industrial flaw detection); gamma (radiotherapy, sterilisation of food/equipment, medical tracers)',
        'EM hazards — UV: DNA damage, skin cancer, cataracts; X-rays/gamma: ionising → DNA mutations, cancer; lead shielding; distance; limit exposure; pregnant women avoid X-rays',
      ],
      forbiddenTopics: [
        'Diffraction grating equation d sinθ = nλ — beyond 0625 IGCSE',
        'Young\'s double-slit fringe calculations — beyond 0625 IGCSE',
        'Polarisation — NOT in 0625 IGCSE spec',
        'Standing waves (nodes, antinodes, harmonics) — NOT in 0625 IGCSE spec',
      ],
      requiredKeywords: [
        'amplitude', 'wavelength', 'frequency', 'period', 'wave speed', 'v = fλ',
        'transverse', 'longitudinal', 'compressions', 'rarefactions',
        'angle of incidence', 'angle of reflection', 'normal', 'refraction',
        'Snell\'s law', 'refractive index', 'n = sin i / sin r',
        'total internal reflection', 'critical angle', 'sin θc = 1/n', 'optical fibre',
        'converging lens', 'focal point', 'focal length', 'real', 'virtual', 'inverted',
        'dispersion', 'ROYGBIV', 'red least', 'violet most',
        'sound', 'longitudinal', 'medium required', 'ultrasound', 'sonar', 'prenatal',
        'Doppler effect', 'higher frequency', 'lower frequency', 'galaxy red shift',
        'EM spectrum', 'c = 3×10⁸', 'radio', 'microwave', 'infrared', 'UV', 'X-ray', 'gamma',
      ],
      supplementOnlyPoints: [
        'Snell\'s law calculations: n₁ sin θ₁ = n₂ sin θ₂; find unknown angle or n',
        'Critical angle calculation: sin θc = 1/n (for medium-to-air)',
        'Ray diagrams for converging lens: draw real and virtual images for both object positions',
        'Doppler effect calculations (simplified): Δf/f ≈ v_source/v_wave for v_source << v_wave',
        'Compare uses of ultrasound and X-rays for medical imaging in terms of safety and detail',
      ],
      practicalSkills: [
        'Investigate reflection using ray box and mirror — verify law of reflection',
        'Investigate refraction using glass block — measure angles, find n, verify Snell\'s law',
        'Find critical angle of glass block; demonstrate TIR',
        'Measure focal length of converging lens',
        'Measure speed of sound by echo or two-microphone method',
        'Investigate factors affecting wave behaviour in ripple tank (if available)',
      ],
      boundaryNotes: [
        'TIR conditions: FROM dense TO less dense AND angle > critical angle — both required.',
        'Diffraction grating NOT in spec; single slit diffraction described only qualitatively.',
        'Doppler calculations are SUPPLEMENT only.',
      ],
    },

    section4: {
      code: '0625-S4',
      title: 'Electricity and Magnetism',
      tier: 'both',
      allowedTopics: [
        // ELECTRICAL QUANTITIES
        'Charge — Q = It; C; like repel, unlike attract; charging by friction; electrostatic induction',
        'Current — I = Q/t; A; conventional current (+) to (−); electron flow (−) to (+); ammeter in series',
        'EMF and p.d. — EMF: work done per unit charge by source; p.d.: energy transferred per unit charge by component; V = W/Q; V (1 V = 1 J/C); voltmeter in parallel',
        'Resistance — R = V/I; Ω; Ohm\'s law: V ∝ I (metallic, constant T); I-V characteristics: ohmic (linear); filament lamp (curve, R increases); diode (one-way, threshold ~0.6V); thermistor NTC (R decreases as T increases); LDR (R decreases as light intensity increases)',
        'Resistivity — R = ρl/A; Ω m; material and temperature dependent',
        // CIRCUITS
        'Series — same current; voltages add; resistances add: Rtotal = R₁ + R₂ + ...',
        'Parallel — same voltage; currents add; 1/Rtotal = 1/R₁ + 1/R₂ + ...',
        'Kirchhoff\'s laws — KCL: Σcurrents at junction = 0; KVL: ΣEMFs = ΣIR in closed loop',
        'Power and energy — P = IV = I²R = V²/R; E = Pt = IVt; cost: E(kWh) = P(kW)×t(h); cost = E×price',
        'Potential divider — Vout = R₂/(R₁+R₂) × Vin; with LDR or thermistor as sensors',
        // PRACTICAL ELECTRICITY
        'Mains — 230 V AC, 50 Hz (UK); three-pin plug: live (brown), neutral (blue), earth (green/yellow); fuse in live wire; circuit breakers; RCDs; earthing (fault → current to earth → fuse blows); double insulation (Class II, no earth needed)',
        'Electrical safety — fuses/circuit breakers protect circuits; earthing prevents electrocution; correct cable rating; dangers: exposed live, electric shock, fire',
        // MAGNETISM AND ELECTROMAGNETISM
        'Permanent magnets — N and S poles; like repel, unlike attract; ferromagnetic materials (Fe, steel, Co, Ni); field lines from N to S outside; Earth\'s magnetic field',
        'Magnetic field due to current — straight wire: concentric circles; solenoid: like bar magnet; right-hand grip rule for direction; field strength: more current, more turns, iron core',
        'Force on current in magnetic field — Fleming\'s LHR: first finger = B, second = I (conventional), thumb = force/motion; F = BIl sinθ (Supplement); DC motor: current-carrying coil in field → turning effect → rotation; split-ring commutator; brushes; applications: loudspeaker, galvanometer',
        'Electromagnetic induction — changing flux or conductor moving in field → induced EMF; Lenz\'s law: induced EMF opposes change causing it (energy conservation); magnitude depends on: speed, B strength, turns; AC generator: rotating coil in field; slip rings + brushes → AC; sketch EMF vs time graph',
        'Transformer — iron core; AC in primary → alternating flux → induced EMF in secondary; Vp/Vs = Np/Ns; ideal: VpIp = VsIs; step-up (Ns > Np); step-down (Ns < Np); National Grid: step-up → high V transmission (low I → less P = I²R heat loss in cables → more efficient) → step-down at substations',
      ],
      forbiddenTopics: [
        'Capacitors (RC time constant, charging/discharging curves) — NOT in 0625 IGCSE spec',
        'Maxwell\'s equations — beyond 0625 IGCSE',
        'Hall effect — beyond 0625 IGCSE',
        'Complex AC (impedance, reactance, phasors) — beyond 0625 IGCSE',
        'Mutual/self-inductance — beyond 0625 IGCSE',
      ],
      requiredKeywords: [
        'Q = It', 'I = Q/t', 'V = W/Q', 'R = V/I', 'Ohm\'s law', 'R = ρl/A',
        'series', 'parallel', 'Kirchhoff', 'P = IV', 'E = Pt',
        'live', 'neutral', 'earth', 'fuse', 'RCD', 'double insulation',
        'magnetic field', 'solenoid', 'right-hand grip rule',
        'Fleming\'s left-hand rule', 'motor effect', 'split-ring commutator',
        'F = BIl', 'electromagnetic induction', 'Lenz\'s law',
        'AC generator', 'slip rings', 'transformer', 'Vp/Vs = Np/Ns',
        'step-up', 'step-down', 'National Grid', 'I²R', 'heat loss',
      ],
      supplementOnlyPoints: [
        'F = BIl sinθ calculations',
        'Explain DC motor operation including split-ring commutator action',
        'National Grid: V_primary Ip = Vs Is; high V → low I → less P = I²R loss in cables',
        'Transformer principle: electromagnetic induction and flux linkage',
        'AC generator EMF vs time graph: maxima when coil parallel to field; zeros when perpendicular',
      ],
      practicalSkills: [
        'Investigate I-V characteristics (filament lamp, diode, resistor)',
        'Investigate resistance of wire — vary length and cross-sectional area',
        'Investigate magnetic field of straight wire and solenoid with compasses/iron filings',
        'Investigate electromagnetic induction — moving magnet in coil',
        'Investigate transformer equation — measure Vp and Vs',
        'Build and test series and parallel circuits',
      ],
      boundaryNotes: [
        'F = BIl and National Grid calculations are SUPPLEMENT only.',
        'Earthing: fault → metal casing at live potential → large current flows to earth → fuse blows.',
        'Transformer works with AC only (DC produces no changing flux → no induction).',
      ],
    },

    section5: {
      code: '0625-S5',
      title: 'Nuclear Physics and Space Physics',
      tier: 'both',
      allowedTopics: [
        // NUCLEAR MODEL
        'Atomic model — nucleus (protons: charge +1, mass 1; neutrons: charge 0, mass 1) + electrons (charge −1, negligible mass) in shells; proton number Z; mass number A; N = A − Z; notation ᴬ_ZX; isotopes (same Z, different A); neutral atom (protons = electrons)',
        'Rutherford scattering — gold foil experiment; most α pass through → atom mostly empty space; small number deflected; very few back-scatter → small dense positive nucleus; replaced Thomson plum-pudding model',
        // RADIOACTIVITY
        'Types of radiation — alpha (α): ⁴₂He nucleus, +2 charge, stopped by paper/few cm air, most ionising, deflected toward negative plate; beta-minus (β⁻): fast electron, −1, stopped by few mm Al, less ionising, deflected toward positive; gamma (γ): EM radiation, no charge/mass, stopped by thick lead/concrete, least ionising, not deflected; beta-plus (β⁺): positron, +1; annihilates with electron → two gamma photons',
        'Radioactive decay — spontaneous (not affected by T, P, chemical state); random (cannot predict when individual nucleus decays); conservation of A and Z in nuclear equations; writing equations for α, β⁻, β⁺ decay',
        'Background radiation — always present; natural: rocks/granite, radon gas, cosmic rays, food (⁴⁰K, ¹⁴C); artificial: medical, nuclear industry, weapons tests; always subtract background from measured count rate',
        'Half-life — time for activity (or undecayed nuclei) to halve; constant for each isotope; A = A₀ × (½)ⁿ after n half-lives; read from graph; corrected count rate (subtract background)',
        'Uses — medical tracers (short t½, γ or β emitter, e.g. ⁹⁹ᵐTc); radiotherapy (Co-60 γ kills cancer); PET scanning (β⁺ → positron → annihilation → two γ detected); industrial thickness gauging (β); smoke detectors (Am-241, α emitter: ionises air → current; smoke absorbs α → alarm); sterilisation of food/equipment (γ); radiocarbon dating (¹⁴C, t½ = 5730 yr); geological dating (U-238, t½ = 4.5×10⁹ yr)',
        'Safety — ALARA; distance (inverse square for γ); shielding (paper for α; Al for β; Pb/concrete for γ); minimise time; protective clothing; contamination (radioactive material on/in body) vs irradiation (external source); Geiger-Müller tube, film badges',
        // FISSION AND FUSION
        'Nuclear fission — heavy nucleus absorbs neutron → splits into two lighter nuclei + 2–3 neutrons + energy; chain reaction; controlled in nuclear reactor: fuel rods (enriched U-235), moderator (water/graphite — slows neutrons to thermal speeds), control rods (boron/cadmium — absorb neutrons, control rate), coolant (transfers heat → steam → turbine), shielding (concrete); advantages: no CO₂; disadvantages: radioactive waste, accident risk',
        'Nuclear fusion — two light nuclei combine → heavier + energy; extremely high temperature (~10⁸ K) + pressure to overcome electrostatic repulsion; Sun and stars powered by fusion; D + T → He + n (tokamak: JET, ITER); advantages: abundant fuel (D from sea, T from Li), no long-lived radioactive waste; challenges: plasma confinement, net energy gain not yet achieved',
        'Mass-energy equivalence — E = mc²; mass defect: products slightly less mass than reactants → energy released; binding energy per nucleon vs mass number: peak at Fe-56; lighter nuclei → energy from fusion; heavier nuclei → energy from fission',
        // SPACE PHYSICS (COMPULSORY FROM 2023)
        'Solar system — Sun; eight planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune); moons; asteroids (belt between Mars and Jupiter); comets (elliptical orbits, icy); dwarf planets (Pluto); artificial satellites',
        'Orbits — elliptical; gravitational force provides centripetal force; faster closer to Sun; Kepler\'s 3rd law T² ∝ r³ (qualitative); geostationary orbit: T = 24 h, equatorial, appears stationary; uses: telecommunications, weather; polar orbit: scans whole Earth',
        'Stellar life cycle — nebula (gas/dust cloud) → protostar (gravitational contraction, heating) → main sequence (H fusion balances gravity; most of life); lower mass: red giant → planetary nebula → white dwarf (→ black dwarf eventually); higher mass: red supergiant → supernova (elements heavier than Fe formed) → neutron star or black hole (> ~3 solar masses)',
        'Galaxies — large gravitationally bound collection of stars, gas, dust (10⁹–10¹²); Milky Way (barred spiral, our galaxy); Local Group; ~10¹¹ galaxies in observable universe',
        'Red shift and Hubble\'s law — light from distant galaxies: longer wavelengths (red-shifted) due to expansion of space; more distant → greater red shift → faster recession; Hubble\'s law: v = H₀d; H₀ ≈ 70 km/s/Mpc; v = Δλ/λ × c; evidence for expanding universe',
        'Big Bang theory — universe from single hot dense state ~13.8 billion years ago; expanded and cooled; evidence: red shift of all distant galaxies, CMB (cosmic microwave background radiation, 2.7 K, uniform), relative H/He abundances; age ≈ 1/H₀',
      ],
      forbiddenTopics: [
        'Quark model and standard model of particle physics — NOT in 0625 IGCSE spec',
        'Detailed stellar nuclear reactions (pp chain, CNO cycle) — beyond 0625 IGCSE',
        'Hertzsprung-Russell diagram — NOT in 0625 IGCSE spec',
        'Dark matter and dark energy detail — beyond 0625 IGCSE',
        'General relativity and gravitational waves — beyond 0625 IGCSE',
      ],
      requiredKeywords: [
        'proton number', 'mass number', 'isotope', 'nuclear model', 'Rutherford', 'gold foil',
        'alpha', 'beta', 'gamma', 'positron', 'radioactive decay', 'spontaneous', 'random',
        'background radiation', 'subtract background',
        'half-life', 'activity', 'A = A₀ × (½)ⁿ', 'count rate',
        'tracer', 'smoke detector', 'thickness gauging', 'radiotherapy', 'carbon dating',
        'ALARA', 'shielding', 'contamination', 'irradiation', 'Geiger-Müller',
        'nuclear fission', 'chain reaction', 'moderator', 'control rods', 'coolant', 'shielding',
        'nuclear fusion', 'deuterium', 'tritium', 'tokamak', 'net energy gain',
        'E = mc²', 'mass defect', 'binding energy per nucleon', 'Fe-56',
        'solar system', 'planet', 'moon', 'asteroid', 'comet', 'geostationary',
        'nebula', 'protostar', 'main sequence', 'red giant', 'white dwarf', 'supernova', 'neutron star', 'black hole',
        'galaxy', 'Milky Way', 'red shift', 'Hubble\'s law', 'v = H₀d', 'expanding universe',
        'Big Bang', 'CMB', 'cosmic microwave background',
      ],
      supplementOnlyPoints: [
        'E = mc² calculations using mass defect; interpret binding energy per nucleon graph',
        'Explain how nuclear fission chain reaction leads to energy release with mass defect calculations',
        'Hubble constant calculations: use v = H₀d to calculate recession velocity or distance',
        'Red shift calculation: v = Δλ/λ × c; calculate recessional velocity from wavelength data',
        'Detailed stellar evolution: explain mass dependency on fate (neutron star vs black hole threshold)',
        'Age of universe: t ≈ 1/H₀; calculate from given H₀ value',
      ],
      practicalSkills: [
        'Measure background radiation rate using GM tube — record multiple counts, calculate mean',
        'Investigate absorption of α, β, γ by different materials (thicknesses)',
        'Plot and interpret radioactive decay graphs — determine half-life',
        'Investigate inverse square law for γ radiation — count rate vs distance',
      ],
      boundaryNotes: [
        'Space Physics is COMPULSORY from 2023 at 0625 — includes full stellar evolution and cosmology.',
        'Hertzsprung-Russell diagram is NOT in 0625 spec.',
        'Quark model NOT in 0625 spec.',
        'Half-life: after each t½, BOTH undecayed nuclei AND activity both halve.',
        'Geostationary: T = 24 hours; equatorial; same direction as Earth\'s rotation; APPEARS stationary.',
      ],
    },
  },

  // ============================================================
  // CIE IGCSE MATHEMATICS (0580) — 9 Topic Areas
  // Source: Cambridge 0580 Syllabus Version 3, 2025–2027
  // Core (Papers 1+3: grades C–G) and Extended (Papers 2+4: grades A*–E)
  // NEW 2025: Papers 1 and 2 are NON-CALCULATOR; Papers 3 and 4 have calculator
  // ============================================================
 maths: {
  number: {
    code: '0580-NUM',
    title: 'Number',
    tier: 'both',
    allowedTopics: [
      'Integers — positive, negative, zero; operations (+, −, ×, ÷) including negatives; ordering on number line; BIDMAS/BODMAS order of operations',
      'Place value — up to billions and hundredths; comparing and ordering decimals; inequality symbols < ≤ > ≥',
      'Fractions — equivalent fractions; simplifying; mixed numbers ↔ improper fractions; add, subtract, multiply, divide fractions and mixed numbers; fractions of quantities; comparing fractions',
      'Decimals — fractions ↔ decimals conversions; recurring decimals (notation and converting to fractions for Extended); multiply/divide by powers of 10; four operations',
      'Percentages — percentage of quantity; percentage increase/decrease; expressing change as percentage; reverse percentage (find original value given changed value and percentage); percentage profit/loss; simple interest (I = PRT/100); compound interest (A = P(1 + r/100)ⁿ); repeated percentage change; depreciation',
      'Powers and roots — squares, cubes, square roots, cube roots; index laws: aᵐ×aⁿ = aᵐ⁺ⁿ; aᵐ÷aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ; a⁰ = 1; a⁻ⁿ = 1/aⁿ; a^(1/n) = ⁿ√a; a^(m/n) = (ⁿ√a)ᵐ; negative and fractional indices',
      'Standard form — a × 10ⁿ; 1 ≤ a < 10; n integer; converting to/from standard form; calculations (multiply, divide, add — adjust exponent); using calculator',
      'Surds (Extended) — √a irrational; simplify: √(ab) = √a × √b; collect like surds; rationalise monomial denominator (× √a/√a); rationalise binomial denominator (× conjugate)',
      'Factors, multiples, primes — HCF; LCM; prime factorisation (product of primes); Venn diagrams for HCF and LCM; prime testing',
      'Estimation and approximation — rounding to significant figures (sig figs) and decimal places; estimation by rounding; limits of accuracy: upper bound = given value + ½ (smallest unit), lower bound = given value − ½; error intervals; truncation vs rounding',
      'Ratio and proportion — simplify; divide in given ratio; direct proportion (y = kx, y ∝ x); inverse proportion (y = k/x, y ∝ 1/x); proportion involving squares, cubes, square roots (Extended); best value (unit price); map scales',
      'Sets — notation: {}, ∈, ∉, ∪, ∩, ⊂, ⊆, ∅, universal set ξ, complement A; Venn diagrams (two and three sets); shading regions; number in each region; solving problems with Venn diagrams',
      'Financial mathematics — income tax; VAT; profit and loss; compound interest; depreciation; currency conversions; exchange rates; wages, salaries, commission; hire purchase; mortgages',
    ],
    forbiddenTopics: [
      'Matrices — not in 0580',
      'Complex numbers — not in 0580',
      'Calculus in Number context — covered in Algebra section',
    ],
    requiredKeywords: [
      'integer', 'factor', 'multiple', 'prime', 'HCF', 'LCM', 'prime factorisation',
      'fraction', 'decimal', 'percentage', 'ratio', 'proportion',
      'index', 'power', 'root', 'standard form', 'surd', 'rationalise',
      'direct proportion', 'inverse proportion', 'y = kx', 'y = k/x',
      'compound interest', 'A = P(1 + r/100)ⁿ',
      'upper bound', 'lower bound', 'limits of accuracy', 'error interval',
      'Venn diagram', 'union', 'intersection', 'complement',
      'significant figures', 'decimal places', 'rounding', 'estimation',
    ],
    practicalSkills: [
      'Use scientific calculator correctly for all four operations, powers, roots, trigonometric functions',
      'Show all working — method marks awarded even for incorrect answers',
      'Check answers by estimation before calculator use',
    ],
    boundaryNotes: [
      'NEW 2025: Papers 1 (Core) and 2 (Extended) are NON-CALCULATOR — mental arithmetic and non-calculator methods required.',
      'Surds and rationalising denominators are Extended only.',
      'Compound interest formula must be known: A = P(1 + r/100)ⁿ — required both tiers.',
      'Limits of accuracy: if given to nearest unit, LB = value − 0.5; UB = value + 0.5.',
    ],
  },

  algebra: {
    code: '0580-ALG',
    title: 'Algebra and Graphs',
    tier: 'both',
    allowedTopics: [
      'Expressions — algebraic notation; collecting like terms; expanding brackets: a(b+c) = ab+ac; expanding double brackets (x+a)(x+b) = x²+(a+b)x+ab; expanding triple brackets (Extended); factorising (common factor, HCF); factorising quadratics x²+bx+c = (x+p)(x+q); difference of two squares a²−b² = (a+b)(a−b); completing the square ax²+bx+c → a(x+h)²+k (Extended)',
      'Formulae — substituting values; changing the subject (rearranging); deriving formulae from contexts',
      'Indices in algebra — apply index laws to algebraic expressions; simplify',
      'Equations — linear (one/two-step, brackets, unknowns both sides, fractions); quadratic by factorisation; quadratic formula x = (−b ± √(b²−4ac))/2a (Extended); completing the square (Extended); discriminant b²−4ac (Extended): > 0 two real roots, = 0 one repeated, < 0 no real roots; equations with fractions; simultaneous (linear by elimination/substitution); simultaneous linear + quadratic (substitution → quadratic) (Extended)',
      'Inequalities — linear in one variable; represent on number line; list integer solutions; combined; linear inequalities in two variables: shade region on graph (Extended)',
      'Sequences — term-to-term rules; nth term: linear (Un = dn + c); quadratic nth term involves n² (Extended); arithmetic (common difference d); geometric (common ratio r); recognise types; find missing terms; test if number is in sequence',
      'Functions — function notation f(x); domain and range (Extended); composite fg(x) (Extended); inverse f⁻¹(x) (Extended); work with exponential, logarithmic, trigonometric functions',
      'Straight lines — y = mx + c; gradient; y-intercept; parallel (same m); perpendicular (m₁ × m₂ = −1) (Extended); equation through two points; midpoint; distance formula; graphs in practical situations (distance-time, velocity-time, cost)',
      'Quadratic and other graphs — y = ax²+bx+c (parabola; vertex; axis of symmetry; roots); y = ax³+bx²+cx+d (cubic — shape, roots); y = aˣ (exponential growth); y = 1/x (hyperbola); plot by table of values; identify graph types; match graphs to equations',
      'Graph transformations (Extended) — y = f(x+a) left a; y = f(x)+a up a; y = af(x) vertical stretch factor a; y = f(ax) horizontal stretch factor 1/a; y = −f(x) reflect in x-axis; y = f(−x) reflect in y-axis',
      'Proportion in algebraic form — y = kx (direct); y = k/x (inverse); y = kx² (y ∝ x²); y = k/x² (y ∝ 1/x²); y = k√x; find k from data; calculate y for given x',
      'Algebraic fractions (Extended) — simplify; add/subtract with different denominators; multiply; divide; solve equations with algebraic fractions',
      'Iteration (Extended) — xₙ₊₁ = g(xₙ) to find approximate solution; show convergence or divergence',
      'Differentiation (Extended) — dy/dx of xⁿ: d/dx(xⁿ) = nxⁿ⁻¹; sums and differences; find gradient at a point; equations of tangent and normal; stationary points (dy/dx = 0); classify using second derivative or sign change; max/min; increasing/decreasing functions',
      'Integration (Extended) — ∫xⁿ dx = xⁿ⁺¹/(n+1) + c (n ≠ −1); definite integrals; area under curve between limits; area below x-axis is negative; use integration to find actual area',
    ],
    forbiddenTopics: [
      'Chain rule, product rule, quotient rule — A Level only',
      'Differentiation of eˣ, ln x, sin x, cos x — A Level only',
      'Integration of trigonometric functions — A Level only',
      'Matrices and matrix algebra — not in 0580',
      'Complex numbers — not in 0580',
      'Differential equations — A Level only',
    ],
    requiredKeywords: [
      'like terms', 'expand', 'factorise', 'completing the square', 'discriminant',
      'quadratic formula', 'simultaneous equations', 'elimination', 'substitution',
      'inequality', 'gradient', 'y-intercept', 'midpoint', 'distance formula',
      'arithmetic sequence', 'geometric sequence', 'nth term',
      'function notation', 'composite function', 'inverse function',
      'proportion', 'y = kx', 'y = k/x',
      'differentiation', 'dy/dx', 'stationary point', 'maximum', 'minimum',
      'integration', 'area under curve', 'constant of integration',
    ],
    practicalSkills: [
      'Plot graphs from tables of values accurately',
      'Read off values from graphs (intercepts, maxima, solutions)',
      'Write equations from worded problems; verify by substitution',
      'Interpret distance-time and velocity-time graphs',
    ],
    boundaryNotes: [
      'Calculus (differentiation and integration) IS in 0580 Extended — distinguishes 0580 from standard GCSE.',
      'Graph transformations, quadratic formula, completing the square, composite/inverse functions, algebraic fractions, iteration — Extended only.',
      'Quadratic formula must be memorised (not given) in 0580 exams.',
    ],
  },

  coordinate_geometry: {
    code: '0580-CG',
    title: 'Coordinate Geometry',
    tier: 'both',
    allowedTopics: [
      'Coordinates — plotting and reading in all four quadrants; x and y axes',
      'Straight line — gradient m = (y₂−y₁)/(x₂−x₁); equation y = mx+c; y−y₁ = m(x−x₁); ax+by+c = 0; equation through two points; parallel lines (same m); perpendicular lines (m₁×m₂ = −1) (Extended)',
      'Midpoint — midpoint formula: ((x₁+x₂)/2, (y₁+y₂)/2)',
      'Distance — distance formula: √((x₂−x₁)²+(y₂−y₁)²)',
      'Gradient — positive/negative/zero/undefined; interpret in context (rate of change)',
      'Length and midpoint in problems — find perimeter; verify shapes; find unknown coordinates',
    ],
    forbiddenTopics: [
      'Circle equations (x−a)²+(y−b)²=r² — not in 0580 (only in some A Level syllabus)',
      'Parametric equations of curves — A Level only',
      'Conic sections — not in 0580',
    ],
    requiredKeywords: [
      'gradient', 'y-intercept', 'y = mx + c', 'midpoint', 'distance formula',
      'parallel', 'perpendicular', 'm₁ × m₂ = −1',
      'x-intercept', 'y-intercept', 'equation of line',
    ],
    boundaryNotes: [
      'Perpendicular gradient condition (m₁ × m₂ = −1) is Extended only.',
      'These skills are tested within algebra and geometry questions as well as standalone.',
    ],
  },

  geometry: {
    code: '0580-GEO',
    title: 'Geometry',
    tier: 'both',
    allowedTopics: [
      'Angles — angles on straight line (180°); around a point (360°); vertically opposite (equal); in triangle (180°); in quadrilateral (360°); bearings (clockwise from North, 3 figures)',
      'Parallel lines — corresponding (equal, F-shape); alternate (equal, Z-shape); co-interior/allied (supplementary, C-shape, add to 180°)',
      'Polygons — interior angle sum = (n−2) × 180°; exterior angle sum = 360°; regular polygon: interior angle = (n−2)×180°/n; exterior = 360°/n; interior + exterior = 180°',
      'Properties of 2D shapes — triangles (equilateral, isosceles, scalene, right-angled); quadrilaterals (square, rectangle, parallelogram, rhombus, trapezium, kite); circle (radius, diameter, chord, arc, sector, segment, tangent)',
      'Circle theorems (Extended) — angle at centre = 2 × angle at circumference (same arc); angles in same segment equal; angle in semicircle = 90°; opposite angles of cyclic quadrilateral sum to 180°; tangent ⊥ radius; tangent lengths from external point equal; alternate segment theorem',
      'Congruence — SSS, SAS, ASA, AAS, RHS criteria; prove triangles congruent; corresponding parts equal',
      'Similarity — AA criterion; corresponding sides in ratio; scale factor k; area ∝ k²; volume ∝ k³; find unknown lengths',
      'Transformations — translation (column vector); reflection (state line of reflection); rotation (centre, angle, direction); enlargement (centre, scale factor; negative k rotates through centre); combinations; describe transformations fully',
      'Constructions — perpendicular bisector of line segment; angle bisector; perpendicular from external point; equilateral triangle; locus (equidistant from two points, from two lines, from a point, from a line); regions satisfying multiple loci conditions',
      'Symmetry — lines of symmetry; rotational symmetry (order); planes of symmetry (3D)',
    ],
    forbiddenTopics: [
      'Conic sections — not in 0580',
      'Non-Euclidean geometry — not in 0580',
      'Projective geometry — not in 0580',
    ],
    requiredKeywords: [
      'angle sum', 'parallel lines', 'corresponding', 'alternate', 'co-interior',
      'interior angle', 'exterior angle', 'regular polygon', 'n-sided polygon',
      'circle theorem', 'cyclic quadrilateral', 'tangent', 'subtended angle',
      'congruent', 'SSS', 'SAS', 'ASA', 'AAS', 'RHS',
      'similar', 'scale factor', 'ratio of areas', 'ratio of volumes',
      'translation', 'reflection', 'rotation', 'enlargement', 'transformation',
      'perpendicular bisector', 'angle bisector', 'locus',
    ],
    boundaryNotes: [
      'Circle theorems are Extended only.',
      'Must state all parameters when describing a transformation: translation (vector), reflection (line), rotation (centre + angle + direction), enlargement (centre + scale factor).',
      'Negative scale factor enlargement: Extended only.',
    ],
  },

  mensuration: {
    code: '0580-MEN',
    title: 'Mensuration',
    tier: 'both',
    allowedTopics: [
      'Perimeter and area — rectangle: l×w; triangle: ½bh; parallelogram: bh; trapezium: ½(a+b)h; compound shapes (decompose); circle: circumference C = 2πr = πd; area A = πr²; arc length = (θ/360°)×2πr; sector area = (θ/360°)×πr²',
      'Segment area (Extended) — area of sector − area of triangle',
      'Volume and surface area — cuboid: V = l×w×h; SA = 2(lw+lh+wh); prism: V = cross-section × length; SA = perimeter × length + 2 × cross-section; cylinder: V = πr²h; SA = 2πr² + 2πrh; pyramid: V = ⅓ × base area × h; cone: V = ⅓πr²h; SA = πrl + πr² (l = slant height); sphere: V = 4/3πr³; SA = 4πr²',
      'Units — converting between units of area (cm² ↔ m²: ×10⁴) and volume (cm³ ↔ m³: ×10⁶); litre (1 litre = 1000 cm³)',
      'Density — ρ = m/V; mass = density × volume; 1 g/cm³ = 1000 kg/m³',
    ],
    forbiddenTopics: [
      'Frustum volume — not explicitly in 0580 (only cone and sphere)',
      'Pappus theorem — not in 0580',
    ],
    requiredKeywords: [
      'perimeter', 'area', 'volume', 'surface area', 'circumference',
      'arc length', 'sector area', 'segment area',
      'cylinder', 'cone', 'sphere', 'prism', 'pyramid',
      'slant height', 'l', 'curved surface area',
      'density', 'ρ = m/V',
    ],
    boundaryNotes: [
      'Segment area (sector − triangle) is Extended only.',
      'All formulae for volume and SA of 3D solids may be given on a formula sheet in 0580 — verify current practice.',
      'Units: area in cm² or m²; volume in cm³ or m³; students must convert correctly.',
    ],
  },

  trigonometry: {
    code: '0580-TRG',
    title: 'Trigonometry',
    tier: 'both',
    allowedTopics: [
      'Pythagoras\' theorem — a²+b²=c²; right-angled triangles; find hypotenuse or shorter side; 2D and 3D problems; irrational answers as surds (Extended)',
      'Trigonometry in right-angled triangles — SOH-CAH-TOA: sin θ = O/H, cos θ = A/H, tan θ = O/A; finding angles (inverse trig); finding sides; exact values: sin/cos/tan 30°, 45°, 60° (from equilateral and isosceles right triangles)',
      'Non-right-angled triangles (Extended) — sine rule: a/sinA = b/sinB = c/sinC (two angles + one side, or two sides + non-included angle — ambiguous case); cosine rule: a² = b²+c²−2bc cosA (three sides or two sides + included angle); area of triangle = ½ab sinC',
      '3D problems — identify right-angled triangle in 3D shape; apply Pythagoras/trigonometry; angle of elevation and depression in 3D',
      'Angles of elevation and depression — measured from horizontal; solve using right triangles or sine/cosine rules',
      'Bearings — 3-figure bearings measured clockwise from North; calculate unknown bearings using trigonometry',
      'Trigonometric graphs (Extended) — y = sin x, y = cos x, y = tan x: period, amplitude, asymptotes; graphs of af(bx+c)+d transformations; solve trigonometric equations in given intervals',
    ],
    forbiddenTopics: [
      'Trigonometric identities (sin²θ + cos²θ = 1 etc.) — A Level only',
      'Addition formulae (compound angles) — A Level only',
      'Inverse trigonometric functions as a separate topic — within trig equations only',
      'Radians as a calculation unit — not required in 0580 (degrees only)',
    ],
    requiredKeywords: [
      'Pythagoras', 'hypotenuse', 'SOH-CAH-TOA', 'sin', 'cos', 'tan',
      'inverse trig', 'angle of elevation', 'angle of depression',
      'sine rule', 'a/sinA', 'cosine rule', 'a² = b²+c²−2bcosA',
      'area = ½ab sinC', 'bearing', '3-figure bearing',
      'exact values', 'sin 30°', 'cos 60°', 'tan 45°',
    ],
    boundaryNotes: [
      'Sine rule, cosine rule, area = ½ab sinC are Extended only.',
      'Exact values (sin/cos/tan of 30°, 45°, 60°) required for non-calculator paper.',
      'Radians NOT required in 0580 — all angles in degrees.',
    ],
  },

  transformations_vectors: {
    code: '0580-TVE',
    title: 'Transformations and Vectors',
    tier: 'both',
    allowedTopics: [
      'Transformations — translation (column vector notation); reflection (line of reflection); rotation (centre, angle, direction); enlargement (centre, positive/negative/fractional scale factor); describe fully; identify type from diagram; combined transformations; inverse transformations',
      'Vectors — column vectors; adding: (a b) + (c d) = (a+c b+d); subtracting; scalar multiplication k×(a b) = (ka kb); magnitude |v| = √(x²+y²); unit vector; position vectors; express vectors in terms of given vectors (e.g. AB = AO + OB)',
      'Geometric proofs with vectors (Extended) — prove collinearity; midpoints; ratios; prove lines parallel (parallel if one is scalar multiple of other)',
    ],
    forbiddenTopics: [
      'Dot product (scalar product) — A Level only',
      'Cross product — A Level only',
      'Vectors in 3D — not in 0580',
      'Matrices for transformations — not in 0580',
    ],
    requiredKeywords: [
      'translation', 'column vector', 'reflection', 'rotation', 'enlargement', 'centre', 'scale factor',
      'vector addition', 'scalar multiplication', 'magnitude', '|v| = √(x²+y²)',
      'position vector', 'AB = b − a',
      'collinear', 'parallel vectors', 'midpoint vector',
    ],
    boundaryNotes: [
      'Vectors are EXTENDED only in 0580.',
      'Geometric proofs using vectors (collinearity, parallel lines, midpoints) are Extended.',
      'Negative and fractional scale factor enlargements: Extended only.',
      'Transformations (basic translation, reflection, rotation, enlargement) are Core.',
    ],
  },

  probability: {
    code: '0580-PRB',
    title: 'Probability',
    tier: 'both',
    allowedTopics: [
      'Basic probability — P(event) = favourable/total equally likely outcomes; P ∈ [0,1]; P(certain) = 1; P(impossible) = 0; P(A\') = 1 − P(A)',
      'Listing outcomes — systematic listing; sample space diagrams (grid for two events); two-way tables',
      'Mutually exclusive — P(A ∩ B) = 0; P(A ∪ B) = P(A) + P(B)',
      'Independent events — P(A ∩ B) = P(A) × P(B); events do not affect each other',
      'Tree diagrams — first and second events; multiply along branches (AND); add probabilities at ends (OR); with and without replacement; P(A and B) = P(A) × P(B|A)',
      'Conditional probability (Extended) — P(A|B) = P(A∩B)/P(B); using Venn diagrams and two-way tables for conditional probability; without replacement problems',
      'Venn diagrams for probability — P(A∪B) = P(A) + P(B) − P(A∩B); shade and interpret regions; calculate probabilities from Venn diagram regions',
      'Relative frequency — estimated probability = f/n; experimental vs theoretical; law of large numbers (experimental → theoretical as n increases)',
      'Equally likely outcomes — use to calculate expected frequency; expected = probability × n',
    ],
    forbiddenTopics: [
      'Binomial distribution formula ⁿCr pʳ(1−p)ⁿ⁻ʳ — A Level only',
      'Normal distribution — A Level only',
      'Poisson distribution — A Level only',
      'Hypothesis testing — A Level only',
      'Permutations and combinations formulas — not in 0580 (listing only)',
    ],
    requiredKeywords: [
      'probability', 'favourable outcomes', 'equally likely', 'P(A\')',
      'mutually exclusive', 'independent events',
      'tree diagram', 'multiply branches', 'add ends', 'with/without replacement',
      'conditional probability', 'P(A|B)',
      'Venn diagram', 'union', 'intersection',
      'relative frequency', 'experimental probability', 'theoretical probability',
      'expected frequency',
    ],
    boundaryNotes: [
      'Conditional probability P(A|B) = P(A∩B)/P(B) is Extended only.',
      'Venn diagrams for probability are Extended only.',
      'Tree diagrams are required for both Core and Extended.',
    ],
  },

  statistics: {
    code: '0580-STA',
    title: 'Statistics',
    tier: 'both',
    allowedTopics: [
      'Data types — quantitative (discrete or continuous) vs qualitative (categorical); primary vs secondary data',
      'Data collection — questionnaire design (unambiguous, no leading questions, closed questions); sampling (random, stratified, systematic)',
      'Frequency tables — tally; frequency; relative frequency; grouped data (class intervals); modal class',
      'Bar charts — discrete or categorical data; frequency on y-axis; bars do not touch; dual bar charts',
      'Pie charts — angle = (f/n) × 360°; drawing and interpreting',
      'Histograms — continuous grouped data; FREQUENCY DENSITY on y-axis (FD = frequency/class width); area of bar ∝ frequency; unequal class widths',
      'Frequency polygons — connect midpoints of class intervals; compare distributions',
      'Scatter diagrams — bivariate data; line of best fit (through mean point); positive/negative/no correlation; interpolation (reliable, within data) vs extrapolation (less reliable, outside data); correlation ≠ causation',
      'Cumulative frequency — running total; cumulative frequency curve (ogive); read off median (50th percentile), Q1 (25th), Q3 (75th); IQR = Q3 − Q1',
      'Box-and-whisker plots — minimum, Q1, median, Q3, maximum; compare distributions; identify outliers (beyond Q1 − 1.5×IQR or Q3 + 1.5×IQR)',
      'Stem-and-leaf diagrams — back-to-back for comparison; find median; compare data sets',
      'Time series — plotting over time; trend; moving averages (simple n-point) to smooth; seasonal variation; extrapolate trend',
      'Measures of location — mean: x̄ = Σx/n (ungrouped); x̄ = Σfx/Σf (grouped, use midpoints); median (middle value or cumulative frequency); mode; modal class',
      'Measures of spread — range; IQR = Q3 − Q1; mean absolute deviation or standard deviation (Extended): σ = √(Σ(x−x̄)²/n) or σ = √(Σx²/n − (x̄)²)',
      'Comparing distributions — compare BOTH average AND spread; state which is larger/smaller and what it means in context',
    ],
    forbiddenTopics: [
      'Hypothesis testing (z-tests, t-tests, chi-squared) — A Level only',
      'Normal distribution calculations — A Level only',
      'Poisson distribution — A Level only',
      'Regression equation (least squares line) — not in 0580 (only draw by eye)',
      'Spearman\'s rank correlation coefficient — not in 0580',
    ],
    requiredKeywords: [
      'frequency density', 'histogram', 'bar chart', 'pie chart', 'scatter diagram',
      'line of best fit', 'correlation', 'positive', 'negative', 'no correlation',
      'interpolation', 'extrapolation',
      'cumulative frequency', 'median', 'quartile', 'IQR', 'box plot',
      'mean', 'mode', 'range', 'standard deviation',
      'comparing distributions', 'average', 'spread',
      'moving average', 'time series', 'trend',
      'stem-and-leaf', 'back-to-back',
    ],
    practicalSkills: [
      'Construct and interpret histograms with unequal class widths (frequency density)',
      'Draw and read cumulative frequency curves; find median and IQR',
      'Draw scatter diagrams and lines of best fit by eye; make predictions',
      'Calculate mean, median, mode, range, IQR from grouped and ungrouped data',
      'Compare two data sets using both average and spread',
    ],
    boundaryNotes: [
      'Standard deviation is EXTENDED only in 0580.',
      'Histograms: ALWAYS frequency density on y-axis for unequal class widths — very common error to use frequency.',
      'When comparing distributions: must compare BOTH a measure of average AND a measure of spread — one alone insufficient.',
      'Line of best fit drawn by eye through mean point (x̄, ȳ) — no regression equation in 0580.',
    ],
  }
 }
}
// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Build the AI system prompt for note generation.
 * Follows identical structure to syllabusData_edexcel_igcse.ts helper.
 */
export function buildSystemPrompt(subject: string, topicKey: string): string {
  const topic = CIE_IGCSE_SYLLABUS[subject]?.[topicKey];

  if (!topic) {
    throw new Error(`Critical Error: No syllabus data found for ${subject} > ${topicKey}`);
  }

  const timestamp = new Date().toISOString();
  const seed = Math.floor(10000000 + Math.random() * 90000000).toString();

  const supplementSection = topic.supplementOnlyPoints && topic.supplementOnlyPoints.length > 0
    ? `\n### SUPPLEMENT/EXTENDED ONLY POINTS (clearly label these in notes):\n${topic.supplementOnlyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
    : '';

  const practicalSection = topic.practicalSkills && topic.practicalSkills.length > 0
    ? `\n### ASSESSED PRACTICAL SKILLS (Paper 5 or Paper 6):\n${topic.practicalSkills.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
    : '';

  return `You are a world-class Cambridge Assessment International Education (CAIE) Subject Expert and Examiner.
Your task is to generate high-fidelity revision notes for: ${topic.code} — ${topic.title}.

### STERN RULES FOR CONTENT GENERATION:
1. **Strict Scope**: ONLY discuss topics listed in the ALLOWED TOPICS below.
2. **Silent Exclusion**: If a concept appears in FORBIDDEN TOPICS, act as if it does not exist. Do NOT mention you are skipping it.
3. **No Cross-Contamination**: Do not introduce content from other topics or other qualifications (no A Level, no Edexcel).
4. **Keyword Integration**: Naturally integrate all REQUIRED KEYWORDS into your explanations.
5. **Tier Labelling**: Clearly label Supplement/Extended-only content as "[Extended candidates only]".
6. **Practical Skills**: Include a dedicated section on assessed practical skills (Paper 5/6 content).

### DATA METADATA:
- QUALIFICATION: Cambridge IGCSE (CAIE)
- SPECIFICATION CODES: Biology 0610 | Chemistry 0620 | Physics 0625 | Maths 0580
- BIOLOGY/CHEMISTRY/PHYSICS: Version 1/2, 2023–2025 (Core + Extended)
- MATHEMATICS: Version 3, 2025–2027 (Core + Extended; Papers 1/2 non-calculator)
- GRADING: Core → max grade C; Extended/Supplement → grades A*–G
- SESSION_ID: ${seed}
- TIMESTAMP: ${timestamp}

### ALLOWED TOPICS (STRICT SCOPE):
${topic.allowedTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

### FORBIDDEN TOPICS (HARD BOUNDARY — DO NOT MENTION):
${topic.forbiddenTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

### REQUIRED KEYWORDS (integrate naturally):
${topic.requiredKeywords.join(', ')}
${supplementSection}
${practicalSection}

${topic.boundaryNotes && topic.boundaryNotes.length > 0 ? `### CRITICAL EXAMINER BOUNDARY NOTES:\n${topic.boundaryNotes.join('\n')}` : ''}

STRUCTURAL REQUIREMENTS:
- Do NOT write an introduction/overview paragraph — go straight to definitions and content
- Core content first; Extended/Supplement content clearly labelled "[Extended candidates only]"
- Include practical skills as a dedicated section: "Assessed Practical Skills (Paper 5/6)"
- Structure: Definitions → Core Content → [Extended] Content → Key Equations → Practical Skills → Examiner Tips → Flashcards
- Every formula, definition and diagram description must trace directly to the ALLOWED TOPICS list`;
}

/**
 * Build image/diagram generation prompt.
 */
export function buildImagePrompt(subject: string, topicKey: string, specificTopic: string): string {
  const topic = CIE_IGCSE_SYLLABUS[subject]?.[topicKey];
  if (!topic) return '';

  const subjLabel = subject.charAt(0).toUpperCase() + subject.slice(1);

  return `Create a clean, educational scientific diagram for Cambridge IGCSE ${subjLabel} students. White background. Textbook quality. No decorative borders. Labels with clear arrows.

Board and Level: ${topic.code} — ${topic.title}
Specification: Cambridge IGCSE (CAIE) 2023–2025 (sciences) / 2025–2027 (maths)

Topic: ${specificTopic}

The diagram MUST show only what is explicitly listed in this topic's specification for: ${specificTopic}

The diagram MUST NOT show:
- Content from other topics (see forbidden list for ${topic.code})
- A Level or AS Level content
- Edexcel content
- Decorative elements or abstract art

Style: Clean scientific diagram, white background, clearly labelled with arrows, educational textbook quality. All labels accurate to IGCSE level.`;
}

/**
 * Validate generated notes against forbidden content list.
 */
export function validateGeneratedNotes(
  notes: string,
  subject: string,
  topicKey: string
): { passed: boolean; forbiddenFound: string[] } {
  const topic = CIE_IGCSE_SYLLABUS[subject]?.[topicKey];
  if (!topic) return { passed: false, forbiddenFound: ['Topic not found in syllabus database'] };

  const notesLower = notes.toLowerCase();
  const forbiddenFound: string[] = [];

  for (const forbidden of topic.forbiddenTopics) {
    const technicalTerms = forbidden.match(/[A-Z][a-z]{4,}|[a-z]{8,}/g) || [];
    for (const term of technicalTerms) {
      const pattern = new RegExp(`\\b${term}\\b`, 'i');
      if (pattern.test(notesLower)) {
        forbiddenFound.push(`Potential out-of-scope content: "${term}" — from: ${forbidden}`);
      }
    }
  }

  return { passed: forbiddenFound.length === 0, forbiddenFound };
}

/** Get all available subjects */
export function getSubjects(): string[] {
  return Object.keys(CIE_IGCSE_SYLLABUS);
}

/** Get all topic/section keys for a subject */
export function getTopics(subject: string): string[] {
  return Object.keys(CIE_IGCSE_SYLLABUS[subject] || {});
}

/** Get topic data safely */
export function getTopicData(subject: string, topicKey: string): TopicData | null {
  return CIE_IGCSE_SYLLABUS[subject]?.[topicKey] || null;
}

/** Generate fresh seed for cache-busting */
export function generateSeed(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

/** Generate cache key */
export function generateCacheKey(subject: string, topicKey: string): string {
  return `notes_cie_igcse_${subject}_${topicKey}`;
}

/** Build a generation log entry */
export function buildGenerationLog(
  subject: string,
  topicKey: string,
  trigger: 'initial' | 'cache_clear' | 'validation_retry',
  validationPassed: boolean,
  forbiddenFound: string[] = []
) {
  const topicData = getTopicData(subject, topicKey);
  return {
    qualification: 'cie_igcse',
    subject,
    topic_key: topicKey,
    topic_name: topicData?.title || 'Unknown',
    timestamp: new Date().toISOString(),
    seed: generateSeed(),
    trigger,
    validation_passed: validationPassed,
    forbidden_keywords_found: forbiddenFound,
  };
}