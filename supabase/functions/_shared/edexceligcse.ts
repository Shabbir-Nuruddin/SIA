// ============================================================
// syllabusData_edexcel_igcse.ts
// PLACE THIS FILE AT: src/lib/syllabusData_edexcel_igcse.ts
//
// HOW TO USE:
//   import { EDEXCEL_IGCSE_SYLLABUS } from '@/lib/syllabusData_edexcel_igcse'
//   import { buildSystemPrompt, buildImagePrompt } from '@/lib/syllabusHelpers'
//
// SOURCES: All content verified against official Pearson specifications.
// Edexcel IGCSE Biology:    Pearson 4BI1 Specification Issue 3 (2019 onwards)
//                           https://qualifications.pearson.com — International GCSE Biology (2017)
// Edexcel IGCSE Chemistry:  Pearson 4CH1 Specification Issue 2 (2019 onwards)
//                           https://qualifications.pearson.com — International GCSE Chemistry (2017)
// Edexcel IGCSE Physics:    Pearson 4PH1 Specification Issue 2 (2019 onwards)
//                           https://qualifications.pearson.com — International GCSE Physics (2017)
// Edexcel IGCSE Maths:      Pearson 4MA1 Specification A Issue 2 (November 2017)
//                           https://qualifications.pearson.com — International GCSE Mathematics A (2016)
//
// PAPER STRUCTURE (all sciences):
//   Paper 1 (1B/1C/1P): 2 hours, 110 marks — core content (no bold/'B/C/P' references)
//   Paper 2 (2B/2C/2P): 1 hr 15 min, 70 marks — all content including bold extension
// PAPER STRUCTURE (maths):
//   Paper 1F/1H and Paper 2F/2H: 2 hours each, 100 marks each — Foundation (grades 1–5) or Higher (grades 4–9)
//
// PRACTICAL SKILLS NOTE:
//   Practical investigations are embedded in the written papers (not a separate practical exam).
//   Italic specification points indicate assessed practical skills.
//   ~20% of paper marks assess experimental skills and understanding.
// ============================================================

export interface TopicData {
  code: string;
  title: string;
  tier?: 'core' | 'extension' | 'both' | 'foundation' | 'higher' | 'both_tiers';
  sourceUrl?: string;
  allowedTopics: string[];
  forbiddenTopics: string[];
  requiredKeywords: string[];
  practicalSkills?: string[];   // Italic spec points — assessed in written papers
  boundaryNotes?: string[];
}

export interface SubjectData {
  [topicKey: string]: TopicData;
}

export interface QualificationData {
  [subject: string]: SubjectData;
}

// ============================================================
// EDEXCEL IGCSE SYLLABUS DATABASE
// ============================================================

export const EDEXCEL_IGCSE_SYLLABUS: QualificationData = {

  // -----------------------------------------------------------
  // EDEXCEL IGCSE BIOLOGY (4BI1)
  // Five topics assessed across Paper 1 and Paper 2
  // Bold/'B'-reference content: Paper 2 extension only
  // Source: Pearson 4BI1 Specification Issue 3, first examined 2019
  // -----------------------------------------------------------
  biology: {

    topic1: {
      code: '4BI1-T1',
      title: 'The Nature and Variety of Living Organisms',
      tier: 'both',
      allowedTopics: [
        // (a) CHARACTERISTICS OF LIVING ORGANISMS
        'Seven characteristics of living organisms — MRS GREN: Movement (change position or part moves); Respiration (chemical reactions that release energy from food molecules); Sensitivity (detect and respond to stimuli); Growth (permanent increase in size and dry mass); Reproduction (produce offspring); Excretion (remove waste products of metabolism); Nutrition (take in and use materials for energy and growth)',
        // (b) VARIETY OF LIVING ORGANISMS — PLANTS
        'Plants — multicellular organisms; most have cells with chloroplasts and can photosynthesise; all have cell walls made of cellulose; store carbohydrates as starch or sucrose; examples: maize, peas, cactus',
        // (b) ANIMALS
        'Animals — multicellular organisms; no cell wall or chloroplasts; heterotrophic (take in complex organic compounds); store carbohydrates as glycogen; examples: humans, mosquito, housefly, tapeworm',
        // (b) FUNGI
        'Fungi — not able to photosynthesize; saprotrophic nutrition (feed on dead or decaying organic matter by secreting enzymes that digest food outside the body); body composed of a network of thread-like structures called hyphae which contain many nuclei; cell wall made of chitin; store carbohydrates as glycogen; examples: Mucor (pin mould) and yeast',
        // (b) BACTERIA
        'Bacteria — microscopic single-celled organisms; have cell wall but NOT a nucleus; have a circular chromosome of DNA; some carry out photosynthesis, most feed off other organisms; 70S ribosomes; no membrane-bound organelles; pili, capsule, flagella; examples: Lactobacillus bulgaricus (used in yoghurt production), Pneumococcus (spherical, causes pneumonia), Salmonella (rod-shaped, causes food poisoning), Helicobacter pylori (causes stomach ulcers)',
        // (b) PROTOCTISTS
        'Protoctists — microscopic organisms that are not plants, animals, fungi or bacteria; most are single-celled; some have chloroplasts (Chlorella); some are parasites; examples: Plasmodium (malaria parasite), Amoeba',
        // (b) VIRUSES
        'Viruses — not living organisms; much smaller than cells; consist only of a protein coat (capsid) and nucleic acid core (DNA or RNA); can only reproduce inside host cells; examples: influenza virus (causes flu), HIV (causes AIDS), tobacco mosaic virus (TMV — mosaic pattern on leaves)',
        // CLASSIFICATION NOTE
        'Five kingdoms — Plants, Animals, Fungi, Prokaryotes (Bacteria), Protoctists; understand that viruses do not fit into any kingdom',
      ],
      forbiddenTopics: [
        'Cell ultrastructure (organelle functions in detail) — Topic 2',
        'Biological molecules (carbohydrates, proteins, lipids structures) — Topic 2',
        'Photosynthesis mechanism — Topic 2',
        'Classification beyond five kingdoms (domains Archaea/Bacteria/Eukarya) — not in this specification',
        'Genetic basis of disease — Topic 3',
        'Evolutionary relationships and cladograms — not in 4BI1 IGCSE',
      ],
      requiredKeywords: [
        'MRS GREN', 'multicellular', 'chloroplasts', 'cellulose', 'heterotrophic',
        'saprotrophic', 'hyphae', 'chitin', 'glycogen',
        'circular chromosome', 'no nucleus', 'prokaryote',
        'capsid', 'protein coat', 'nucleic acid', 'Plasmodium',
      ],
      practicalSkills: [
        'Observe and identify bacteria from diagrams and descriptions — know rod (bacillus), spherical (coccus), spiral shapes',
        'Interpret photomicrographs of organisms from each kingdom',
      ],
      boundaryNotes: [
        'Students need only recognise named examples — detailed life cycles not required at this topic level.',
        'Virus replication mechanism NOT required — only structure and general reproduction in host cells.',
      ],
    },

    topic2: {
      code: '4BI1-T2',
      title: 'Structure and Functions in Living Organisms',
      tier: 'both',
      allowedTopics: [
        // (a) LEVELS OF ORGANISATION
        'Levels of organisation — cell → tissue (group of similar cells performing same function) → organ (group of tissues working together) → organ system → organism',

        // (b) CELL STRUCTURE
        'Animal cell structure — cell membrane (controls entry and exit of substances); nucleus (contains DNA, controls cell activities); cytoplasm (where most chemical reactions occur); mitochondria (site of aerobic respiration/energy release); ribosomes (site of protein synthesis)',
        'Plant cell structure — all animal cell components PLUS: cell wall (cellulose — provides support and strength); vacuole (filled with cell sap, helps maintain turgor); chloroplasts (contain chlorophyll, site of photosynthesis)',
        'Comparison of plant, animal and bacterial cells — bacteria lack nucleus, have cell wall (not cellulose — peptidoglycan), smaller (typically 1–5 µm vs 10–100 µm for eukaryotic cells)',
        'Specialised cells and their adaptations — red blood cells (biconcave disc, no nucleus, large surface area, packed with haemoglobin for O₂ transport); sperm cells (streamlined head, acrosome with enzymes to penetrate egg, mitochondria in midpiece for energy, flagellum for movement); egg cells (large, stored food, jelly coat for fertilisation); ciliated epithelial cells (cilia on surface to move mucus); root hair cells (long projection into soil, large surface area, thin wall, many mitochondria for active transport); palisade mesophyll cells (cylindrical, many chloroplasts near top of cell, thin walls for CO₂ diffusion)',
        'Microscopy — use of light microscope; magnification = image size/actual size; calculating actual size from scale bar or given magnification; units: mm → µm (× 1000); drawing scientific diagrams (sharp pencil, clear outline, no shading, scale bar or magnification stated)',

        // (c) BIOLOGICAL MOLECULES
        'Carbohydrates — glucose as monomer; starch (energy storage in plants); glycogen (energy storage in animals and fungi); cellulose (structural — plant cell wall); sucrose (transport in plants)',
        'Proteins — made of amino acids; enzymes, antibodies, haemoglobin, structural proteins (collagen, keratin); affect rate of chemical reactions',
        'Lipids — made of fatty acids and glycerol; energy storage, cell membranes, thermal insulation, organ protection; triglycerides',
        'Food tests — Benedict\'s solution (reducing sugars: blue → orange/brick red precipitate with heat; semi-quantitative: brick red > orange > yellow > green indicates more sugar); iodine solution (starch: brown/orange → blue-black); biuret test (protein: blue → purple/mauve — requires NaOH + CuSO₄); ethanol/emulsion test (lipids: dissolve lipid in ethanol, add water → milky white emulsion)',
        'Balanced diet — carbohydrates (energy), proteins (growth, repair, enzymes, antibodies), fats (energy, cell membranes, insulation), vitamins (A: vision, rhodopsin in rods; C: wound healing, immune system, collagen synthesis; D: calcium absorption, bone formation), minerals (calcium: bones/teeth; iron: haemoglobin synthesis), dietary fibre (prevents constipation, bowel cancer), water (solvent, temperature regulation, chemical reactions)',
        'Malnutrition — kwashiorkor (protein deficiency: oedema — fluid accumulation, stunted growth, muscle wasting, dry flaky skin); marasmus (protein and energy deficiency: severe wasting, very low body weight); obesity (excess energy intake → excess fat deposition → increased risk of Type 2 diabetes, CVD, hypertension); anaemia (iron deficiency → low haemoglobin → fatigue, pallor, breathlessness); scurvy (vitamin C deficiency → weak collagen → bleeding gums, poor wound healing); rickets (vitamin D deficiency → soft bones → bone deformity)',

        // (d) MOVEMENT OF SUBSTANCES INTO AND OUT OF CELLS
        'Diffusion — passive movement of molecules/ions from high concentration to low concentration; net movement down concentration gradient; factors: concentration gradient (steeper = faster), temperature (higher = faster), surface area (larger = faster), diffusion distance (shorter = faster); no energy required; examples: O₂ into respiring cells, CO₂ out of respiring cells, glucose from gut into blood',
        'Osmosis — special case of diffusion; movement of water molecules from high water potential (dilute solution) to low water potential (concentrated solution) through a selectively permeable membrane; no energy required',
        'Osmosis in plant cells — turgid (excess water → vacuole presses cell membrane against cell wall → turgor pressure → rigid cell supports plant); flaccid (water loss → vacuole shrinks → cell becomes soft → plant wilts); plasmolysis (severe water loss → cell membrane pulls away from cell wall → protoplast shrinks away; called incipient plasmolysis at point of just starting)',
        'Osmosis in animal cells — crenation (shrinks/wrinkles in hypertonic solution — water leaves by osmosis); lysis (bursts in hypotonic solution — too much water enters by osmosis)',
        'Active transport — movement of molecules or ions against a concentration gradient (from low to high concentration); requires energy from respiration (ATP); requires carrier proteins; examples: uptake of mineral ions (nitrate, potassium) from soil into root hair cells; glucose reabsorption in kidney tubules; glucose uptake in small intestine',

        // (e) NUTRITION — PLANTS (PHOTOSYNTHESIS)
        'Photosynthesis equation — 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂; requires light energy; light trapped by chlorophyll; produces glucose and oxygen',
        'Requirements for photosynthesis — light (energy source); chlorophyll (absorbs light, mainly red and blue wavelengths); carbon dioxide (raw material from air via stomata); water (raw material from soil via roots and xylem)',
        'Products of photosynthesis — glucose (used in respiration; converted to starch for storage; converted to cellulose for cell walls; converted to sucrose for transport; combined with nitrate ions to make amino acids → proteins); oxygen (released as by-product via stomata)',
        'Leaf structure — upper epidermis (transparent, lets light through); palisade mesophyll (main photosynthesis layer — densely packed cells with many chloroplasts); spongy mesophyll (large air spaces for gas exchange, some chloroplasts); lower epidermis; guard cells + stomata (control CO₂/O₂/water vapour exchange); vascular bundles (xylem and phloem — transport)',
        'Limiting factors for photosynthesis — light intensity (at low intensity, rate limited by light; at high intensity another factor limits; inverse square law: intensity ∝ 1/d²); CO₂ concentration (increasing CO₂ increases rate up to another factor limiting); temperature (increases rate up to enzyme optimum, then denatures enzymes → rate falls); water availability (affects stomatal opening)',
        'Guard cells and stomata — guard cells change shape to open or close stomata; in light: guard cells absorb K⁺ ions → water enters by osmosis → turgid → stomata open; in dark: K⁺ leaves → guard cells become flaccid → stomata close; controls gas exchange and water vapour loss',

        // (e) NUTRITION — ANIMALS (DIGESTION)
        'Digestive system — alimentary canal: mouth, oesophagus, stomach, small intestine (duodenum + ileum), large intestine (colon + rectum), anus; accessory organs: salivary glands, liver, gallbladder, pancreas',
        'Digestion — physical: teeth (incisors — cutting, canines — tearing, premolars/molars — grinding/crushing), tongue, churning in stomach — breaks food into smaller pieces, increases SA for enzyme action; chemical: enzymes break large insoluble molecules into small soluble ones',
        'Digestive enzymes — amylase (produced by salivary glands and pancreas; digests starch → maltose; works in mouth pH 7 and duodenum); protease/pepsin (produced by stomach cells; digests protein → polypeptides; works in stomach pH 2; pepsin needs HCl to work); trypsin (produced by pancreas; digests proteins → polypeptides/amino acids; works in duodenum pH 8); lipase (produced by pancreas; digests lipids → fatty acids + glycerol; works in duodenum pH 8)',
        'Role of bile — produced by liver, stored in gallbladder, released into duodenum; bile salts emulsify fats (break large fat droplets into small droplets = emulsification — NOT a chemical digestion by enzyme); increases surface area for lipase action; bile is alkaline (neutralises stomach acid, creating optimum pH for pancreatic enzymes)',
        'Villi and absorption — finger-like projections in ileum; increase SA enormously; single layer of epithelial cells (short diffusion distance); dense network of blood capillaries (maintain concentration gradient, transport absorbed nutrients); lacteal (lymph capillary — absorbs fatty acids + glycerol reformed into triglycerides); glucose and amino acids → blood capillaries → portal vein → liver; fatty acids + glycerol → lacteals → lymph → blood',
        'Assimilation — using absorbed nutrients: glucose → respiration for energy; amino acids → protein synthesis; fatty acids + glycerol → energy storage, cell membranes; glucose → glycogen for storage in liver and muscle',
        'Egestion — removal of undigested material (fibre/cellulose) as faeces from anus; distinguish from excretion (removal of metabolic waste produced BY the body)',

        // (f) RESPIRATION
        'Aerobic respiration equation — C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy; occurs in mitochondria; complete oxidation of glucose; produces maximum energy (ATP); used for: active transport, muscle contraction, maintaining body temperature, protein synthesis, cell division',
        'Anaerobic respiration (animals) — glucose → lactic acid + energy; no O₂ required; much less energy produced; occurs in muscle during intense exercise; lactic acid causes muscle fatigue and cramp; oxygen debt: when exercise stops, lactic acid oxidised back to CO₂ + H₂O using extra O₂; breathing and heart rate remain elevated',
        'Anaerobic respiration (yeast) — glucose → ethanol + CO₂ + energy; no O₂ required; NAD regenerated allows glycolysis to continue; used in baking (CO₂ causes dough to rise), brewing (ethanol produced); ethanol is toxic to yeast at high concentrations',
        'Comparison of aerobic and anaerobic — aerobic: uses O₂, large ATP yield (~30–38 per glucose), products CO₂ + H₂O; anaerobic: no O₂ used, small ATP yield (2 per glucose), products: lactic acid (animal) or ethanol + CO₂ (yeast)',
        'Effect of exercise on breathing and heart rate — increased O₂ demand → increased depth and rate of breathing; increased heart rate; increased blood flow to muscles; after exercise: O₂ debt repaid, lactic acid removed, breathing and heart rate return to normal',

        // (g) GAS EXCHANGE
        'Human lung structure — trachea → bronchi → bronchioles → alveoli; alveoli features: large total surface area (300 million alveoli), one cell thick epithelium (very short diffusion distance), moist lining (gases dissolve), richly supplied with blood capillaries (maintain steep concentration gradient)',
        'Ventilation mechanism — inspiration: external intercostal muscles contract → ribs move up and out; diaphragm muscles contract → diaphragm flattens/moves down → thorax volume increases → pressure decreases → air rushes in down pressure gradient; expiration: muscles relax → elastic recoil → thorax volume decreases → pressure increases → air pushed out',
        'Gas exchange at alveoli — O₂: higher concentration in alveolar air than blood → diffuses from alveolus into capillary blood; CO₂: higher concentration in blood than alveolar air → diffuses from blood into alveolus; thin moist surface, large SA, and steep gradient maintained by blood flow and ventilation',
        'Effects of smoking — tar: coats alveolar and bronchial surfaces; contains carcinogens (cause mutations → lung cancer); destroys/paralyses cilia → mucus builds up → bacteria not removed → chronic bronchitis; nicotine: highly addictive; increases heart rate and blood pressure; promotes blood clot formation → increased CVD risk; carbon monoxide (CO): binds to haemoglobin more strongly than O₂ → carboxyhaemoglobin formed → reduces O₂-carrying capacity → tissues deprived of O₂; emphysema: alveolar walls break down → reduced surface area → poor gas exchange → breathlessness even at rest',
        'Gas exchange in plants — through stomata (on underside of leaf — lower epidermis) and through lenticels (in bark); CO₂ in/O₂ out during photosynthesis in light; O₂ in/CO₂ out during respiration; at night: only respiration — net CO₂ loss, O₂ in; air spaces in spongy mesophyll allow gas diffusion to reach all cells',

        // (h) TRANSPORT
        'Circulatory system — double circulation: pulmonary (right heart → lungs → left heart: deoxygenation replenished); systemic (left heart → body → right heart: delivers O₂); advantages: maintains higher pressure in systemic; keeps oxygenated/deoxygenated blood separate',
        'Heart structure — four chambers: right atrium (receives deoxygenated blood from vena cava), right ventricle (pumps to pulmonary artery to lungs), left atrium (receives oxygenated blood from pulmonary veins), left ventricle (pumps to aorta — thicker wall as pumps to whole body); valves: atrioventricular valves (bicuspid/mitral — left; tricuspid — right; prevent backflow from ventricles to atria); semilunar valves (in aorta and pulmonary artery; prevent backflow into ventricles); coronary arteries supply heart muscle with O₂ and glucose',
        'Cardiac cycle (simplified) — atria contract pushing blood into ventricles → ventricles contract pushing blood to lungs (right) and body (left) → heart relaxes; heart rate = number of beats per minute; pulse = wave of pressure in artery with each heartbeat',
        'Blood vessels — arteries: thick wall (muscle + elastic tissue), small lumen, high pressure, pulsatile flow; carry blood away from heart; veins: thin wall, large lumen, low pressure, valves prevent backflow; carry blood to heart; capillaries: one cell thick wall, large total surface area, very small lumen, exchange of substances with cells; connect arteries to veins',
        'Blood components — red blood cells (erythrocytes): biconcave disc shape (large SA: volume ratio), no nucleus (maximises haemoglobin space), packed with haemoglobin (Hb + O₂ → oxyhaemoglobin in lungs; releases O₂ in tissues where pO₂ is low); white blood cells (leucocytes): larger than RBCs, have nucleus; phagocytes (engulf and digest pathogens — phagocytosis); lymphocytes (produce antibodies); platelets: cell fragments, no nucleus, involved in blood clotting; plasma: liquid part (mostly water) — carries dissolved glucose, amino acids, fatty acids, vitamins, minerals, hormones, antibodies, fibrinogen, urea, CO₂',
        'Coronary heart disease (CHD) — coronary arteries blocked by fatty deposits (atherosclerosis) → reduced blood flow → myocardial infarction (heart attack); risk factors: diet high in saturated fats and salt, smoking, physical inactivity, hypertension, family history, age, obesity; prevention: healthy diet, regular exercise, not smoking, medication (statins, aspirin)',
        'Transport in plants — xylem: dead hollow tubes (vessels), no end walls, lignified cell walls, transports water and dissolved mineral ions upward from roots; phloem: living cells (sieve tubes and companion cells), transports sucrose and amino acids from leaves (source) to all parts (sink) — translocation; bidirectional',
        'Transpiration — evaporation of water vapour from leaves mainly through stomata; creates tension pulling water up xylem; factors affecting rate: temperature (higher → faster evaporation), humidity (lower → faster), wind speed (higher → faster), light intensity (higher → stomata open → faster), surface area (more leaves/leaf area → faster)',
        'Root pressure and water uptake — root hair cells: large surface area with long projection into soil, water enters by osmosis (soil water potential > root hair cell), mineral ions taken up by active transport; water moves across root cells by osmosis into xylem',
        'Wilting — transpiration rate exceeds water uptake rate → cells lose turgor → plant droops; reversible if water available; permanent wilting if drought prolonged',

        // (i) EXCRETION
        'Excretion — removal of waste products of metabolism from the body; distinguish from egestion (undigested food) and secretion',
        'Carbon dioxide excretion — produced by all cells in respiration; transported in blood (dissolved in plasma; as bicarbonate ions HCO₃⁻; combined with haemoglobin as carbaminohaemoglobin); excreted via lungs during expiration',
        'Urea formation — excess amino acids cannot be stored; deamination in liver: amino acid → ammonia + organic acid (keto-acid); ammonia is toxic → immediately converted to urea in liver (less toxic, soluble); urea transported in blood plasma to kidneys',
        'Kidney structure — outer cortex (Bowman\'s capsules, proximal + distal convoluted tubules); inner medulla (loops of Henle, collecting ducts); renal pelvis; ureter; bladder; urethra; renal artery brings blood in, renal vein takes it out',
        'Nephron function — glomerulus + Bowman\'s capsule: ultrafiltration (high blood pressure forces small molecules through capillary wall and basement membrane into capsule: water, glucose, amino acids, urea, mineral salts pass; large proteins and blood cells do NOT pass due to size); proximal convoluted tubule (PCT): selective reabsorption — 100% glucose reabsorbed by active transport (healthy person has no glucose in urine), amino acids reabsorbed, some water reabsorbed by osmosis, some salts reabsorbed; loop of Henle: creates osmotic gradient in medulla — helps concentrate urine; distal convoluted tubule + collecting duct: water reabsorption controlled by ADH; remaining fluid = urine',
        'ADH (antidiuretic hormone) — released from posterior pituitary gland; released when blood osmolarity increases (dehydration, sweating); acts on collecting duct and DCT → increases permeability to water → more water reabsorbed → concentrated, small-volume urine; less ADH when well-hydrated → dilute, large-volume urine; negative feedback via osmoreceptors in hypothalamus',

        // (j) COORDINATION AND RESPONSE
        'Nervous system overview — CNS (brain + spinal cord); peripheral nervous system (sensory + motor nerves); somatic (voluntary, to skeletal muscles); autonomic (involuntary, to glands and smooth muscle)',
        'Neurone types — sensory neurone (receptor → spinal cord/brain); relay/interneurone (within CNS, connects sensory to motor); motor neurone (brain/spinal cord → effector: muscle or gland)',
        'Reflex arc — receptor → sensory neurone → relay neurone (in spinal cord) → motor neurone → effector; pathway: stimulus → receptor → afferent (sensory) nerve → integration centre → efferent (motor) nerve → effector → response; reflex is automatic, rapid, does not require conscious thought; protective value (e.g. knee jerk, pupil reflex, withdrawal from pain)',
        'Synapse — junction between neurones; electrical impulse cannot cross directly; neurotransmitter (e.g. acetylcholine) released from presynaptic knob into synaptic cleft → binds to receptors on postsynaptic membrane → new electrical impulse generated; one-directional (only one side has vesicles); allows integration and modulation',
        'Eye structure and function — cornea (transparent, refracts light — most refraction); iris (coloured part, controls pupil size); pupil (aperture, controls amount of light reaching retina); lens (transparent, elastic, fine-tunes focus — less refraction than cornea but adjustable); retina (light-sensitive layer: rods — sensitive to dim light, detect black/white; cones — require bright light, detect colour, concentrated in fovea); fovea (highest cone density, area of greatest acuity); blind spot (no receptors where optic nerve leaves); optic nerve (transmits impulses to brain)',
        'Accommodation (focusing) — near object: ciliary muscles contract → suspensory ligaments loosen/go slack → lens becomes fatter/more convex (greater curvature) → more refraction → focus on retina; distant object: ciliary muscles relax → suspensory ligaments tighten/pull → lens becomes thinner/less convex → less refraction → focus on retina',
        'Short sight (myopia) — eyeball too long or lens too curved → image focuses in front of retina → corrected with concave (diverging) lens',
        'Long sight (hyperopia) — eyeball too short or lens too flat → image would focus behind retina → corrected with convex (converging) lens',
        'Pupil reflex — bright light: circular muscles of iris contract, radial muscles relax → pupil constricts (decreases in size); dim light: radial muscles contract, circular muscles relax → pupil dilates (increases in size)',
        'Hormones — chemical messengers; produced and secreted by endocrine glands into blood; transported to target organs; slower and longer-lasting than nervous response; comparison: nervous (fast: milliseconds, short-lived, specific to one muscle/gland, electrical); hormonal (slow: seconds to hours, long-lasting, widespread, chemical)',
        'Adrenaline — produced by adrenal glands (above kidneys); released in response to stress, fear, excitement; causes: increased heart rate, dilated pupils, glycogenolysis in liver (glycogen → glucose → increased blood glucose), vasoconstriction in gut, vasodilation in skeletal muscles, increased breathing rate — fight-or-flight',
        'Insulin and glucagon — both produced by islets of Langerhans in pancreas; insulin (from β cells): released when blood glucose rises after eating → stimulates uptake of glucose by liver and muscle cells → glycogenesis (glucose → glycogen) → blood glucose falls back to normal; glucagon (from α cells): released when blood glucose falls → stimulates liver to break down glycogen → glycogenolysis → blood glucose rises; Type 1 diabetes: autoimmune destruction of β cells → no insulin → must inject insulin; Type 2 diabetes: body cells become resistant to insulin → manage with diet/exercise/metformin',
        'Testosterone — produced by testes; controls male secondary sexual characteristics (facial/body hair, deepening voice, sperm production, muscle development, penis growth)',
        'Oestrogen and progesterone — produced by ovaries; oestrogen: controls female secondary sexual characteristics (breast development, pubic/axillary hair, widening hips, uterine lining repair); progesterone: maintains uterine lining during pregnancy; both hormones regulated by FSH and LH from pituitary',
        'Auxins — plant hormones produced in shoot tips; promote cell elongation; unequal distribution causes phototropism (shoot bends toward light — more auxin on shaded side → more elongation on shaded side → bends toward light); gravitropism (roots grow down: auxin accumulates on lower side of root → inhibits root cell elongation on lower side → root tip bends down; shoot grows up: auxin stimulates elongation on lower side → shoot tip bends up); commercial uses: rooting powder (promotes root growth in cuttings), selective weedkillers (broad-leaved weeds absorb more auxin analogue → overstimulated → die), controlling fruit ripening',
      ],
      forbiddenTopics: [
        'Calvin cycle (light-independent reactions detail) — beyond 4BI1 IGCSE',
        'Z-scheme, photosystems I and II, NADPH — beyond 4BI1 IGCSE',
        'Glycolysis mechanism, Krebs cycle, ETC, chemiosmosis — beyond 4BI1 IGCSE',
        'ADH mechanism at aquaporin level — beyond 4BI1 IGCSE',
        'Na+/K+ pump mechanism — beyond 4BI1 IGCSE',
        'Resting potential, action potential mV values — beyond 4BI1 IGCSE',
        'Bohr effect and oxygen dissociation curve — beyond 4BI1 IGCSE',
        'Lymphatic system detail — beyond 4BI1 IGCSE',
        'Menstrual cycle hormones (FSH, LH, oestrogen, progesterone feedback loop) in detail — Topic 3',
      ],
      requiredKeywords: [
        'cell membrane', 'nucleus', 'cytoplasm', 'mitochondria', 'chloroplast', 'cell wall', 'vacuole',
        'magnification', 'actual size', 'tissue', 'organ',
        'Benedict\'s', 'iodine', 'biuret', 'emulsion test',
        'diffusion', 'concentration gradient', 'osmosis', 'water potential', 'active transport', 'ATP',
        'turgid', 'flaccid', 'plasmolysis', 'crenation',
        'photosynthesis equation', 'chlorophyll', 'limiting factor', 'guard cells', 'stomata',
        'amylase', 'protease', 'lipase', 'bile emulsification', 'villi', 'lacteal',
        'aerobic respiration', 'anaerobic', 'lactic acid', 'oxygen debt', 'ethanol',
        'alveoli', 'surface area', 'diffusion distance', 'ventilation',
        'double circulation', 'bicuspid valve', 'semilunar valve', 'haemoglobin', 'oxyhaemoglobin',
        'phagocytosis', 'lymphocyte', 'antibody', 'plasma',
        'xylem', 'phloem', 'transpiration', 'translocation',
        'ultrafiltration', 'selective reabsorption', 'ADH', 'urea', 'deamination',
        'reflex arc', 'sensory', 'relay', 'motor', 'synapse', 'neurotransmitter',
        'accommodation', 'rods', 'cones', 'fovea',
        'insulin', 'glucagon', 'glycogenesis', 'glycogenolysis', 'Type 1 diabetes',
        'auxin', 'phototropism', 'gravitropism',
      ],
      practicalSkills: [
        'Investigate the effect of light intensity on the rate of photosynthesis using an aquatic plant (e.g. Elodea/Cabomba) — count bubbles or use gas syringe; inverse square law',
        'Investigate the effect of pH and temperature on enzyme activity (e.g. amylase + starch with iodine indicator; catalase + H₂O₂)',
        'Investigate osmosis using plant tissue (e.g. potato cylinders in sucrose solutions of different concentrations) — measure mass or length change; determine water potential of tissue',
        'Investigate the effect of exercise on heart rate and breathing rate — record before and after; recovery time',
        'Prepare and observe temporary mounts of plant and animal cells — onion epidermis, cheek cells; staining with iodine/methylene blue; calculate magnification and actual size',
        'Investigate the effect of different concentrations of glucose solution on rate of respiration in yeast — measure CO₂ production using limewater or gas syringe',
        'Investigate the effect of different wavelengths of light on the rate of photosynthesis (using coloured filters)',
        'Use of a light microscope to observe cells — draw and label with scale bars',
        'Measure transpiration rate using a potometer — investigate effects of temperature, wind, humidity',
      ],
      boundaryNotes: [
        'Extension content (Bold/B-reference Paper 2 topics) includes: blood clotting mechanism; spleen function; detail of lymphocyte activation; stomata guard cell mechanism (K+ ions); detailed nephron countercurrent multiplier; detail of auxin mechanism at cellular level.',
        'Magnification formula MUST be used correctly: magnification = image size ÷ actual size. Units MUST be consistent (both mm or both µm).',
        'Both aerobic and anaerobic respiration word equations AND symbol equations are required.',
      ],
    },

    topic3: {
      code: '4BI1-T3',
      title: 'Reproduction and Inheritance',
      tier: 'both',
      allowedTopics: [
        // (a) REPRODUCTION
        'Sexual reproduction — gametes (sperm and egg in animals; pollen and ovule in plants); fertilisation (fusion of gametes → zygote); results in genetic variation; offspring differ from both parents; requires two parents',
        'Asexual reproduction — mitosis; produces genetically identical offspring (clones); one parent; faster than sexual reproduction; examples in plants: runners (strawberry), bulbs (daffodil), tubers (potato); vegetative propagation',
        'Mitosis — nuclear division producing two genetically identical daughter cells; stages: prophase (chromosomes condense, spindle forms); metaphase (chromosomes align at equator); anaphase (chromatids pulled to poles); telophase (nuclear envelopes reform); cytokinesis; used for: growth, repair, asexual reproduction',
        'Meiosis — nuclear division producing four genetically different haploid cells (n); used for gamete production; involves two divisions: meiosis I (homologous pairs separate) and meiosis II (chromatids separate); crossing over and independent assortment create genetic variation; human diploid cells (2n = 46); gametes are haploid (n = 23)',

        // HUMAN REPRODUCTION
        'Male reproductive system — testes (produce sperm and testosterone); epididymis (sperm maturation and storage); vas deferens (sperm transport); seminal vesicles and prostate gland (produce seminal fluid — nourishes sperm, aids motility); urethra; penis',
        'Female reproductive system — ovaries (produce eggs/ova and oestrogen/progesterone); fallopian tubes/oviducts (site of fertilisation; egg travels to uterus); uterus (site of implantation and foetal development); cervix; vagina; menstrual cycle controlled by FSH and LH from pituitary',
        'Fertilisation and implantation — sperm swim to fallopian tube; one sperm penetrates egg → zygote; zygote divides by mitosis → embryo; embryo travels down fallopian tube → implants in uterine wall (~6–10 days after fertilisation)',
        'Placenta and foetal development — placenta: allows exchange of O₂, glucose, amino acids, hormones, antibodies between mother and foetus (by diffusion and active transport); removes CO₂ and urea from foetus to mother; barrier to some pathogens (not all); fingerlike villi increase surface area; umbilical cord connects foetus to placenta; amniotic fluid (cushions foetus from shock)',
        'Menstrual cycle — approximately 28 days; days 1–5: menstruation (uterine lining breaks down, low oestrogen/progesterone); days 6–13: FSH from pituitary stimulates follicle development → oestrogen secreted → uterine lining thickens and repairs; day 14: LH surge → ovulation (egg released from ovary); days 15–28: LH stimulates corpus luteum → progesterone → maintains uterine lining; if no pregnancy: progesterone falls → menstruation begins',
        'Contraception — barrier methods: male condom (barrier + STI protection), female condom, diaphragm (barrier); hormonal methods: contraceptive pill (oestrogen + progesterone — prevents ovulation), mini-pill (progesterone only), injection, implant; intrauterine device (IUD — prevents implantation); surgical: vasectomy (male), tubal ligation (female); natural/rhythm method (abstinence around ovulation)',
        'STIs — sexually transmitted infections; HIV/AIDS: HIV destroys T-helper cells → immunodeficiency → AIDS; transmitted via unprotected sex, contaminated blood, mother to child; treatment: antiretroviral drugs (do not cure); prevention: condoms, testing; gonorrhoea (bacterial — treated with antibiotics; may be antibiotic-resistant strains); chlamydia (bacterial — often asymptomatic, treated with antibiotics)',

        // PLANT REPRODUCTION
        'Flower structure — petals (attract pollinators); sepals (protect bud); stamen = anther (produces pollen/male gametes) + filament; carpel/pistil = stigma (receives pollen) + style + ovary + ovule (contains female gamete)',
        'Pollination — transfer of pollen from anther to stigma; wind pollination: small/light/smooth pollen, large feathery stigmas, no petals/nectaries, anthers hang outside flower; insect pollination: colourful petals, nectaries with nectar/scent, sticky or spiky pollen, sticky stigma',
        'Fertilisation in plants — pollen lands on stigma → pollen tube grows down style → pollen tube enters ovule → male nucleus fuses with female nucleus (egg cell) → zygote → seed; ovary wall becomes fruit; ovule becomes seed',
        'Seed and fruit dispersal — wind: light seeds with wings (sycamore) or parachutes (dandelion/dandelion clock); animal: fleshy fruits (berries — seeds ingested and excreted); hooks or burrs (burdock — attach to fur/clothing); water: buoyant fruits; self-dispersal: seed pods explode (peas)',
        'Germination conditions — water (activates enzymes, needed for metabolic reactions, dissolves nutrients); warmth/suitable temperature (enzyme activity); oxygen (for aerobic respiration to provide energy for growth)',
        'Vegetative propagation — natural: runners (strawberry), rhizomes (grass), bulbs (onion, tulip), tubers (potato), corms; artificial: cuttings (taking a stem or leaf, dipping in rooting powder, planting); advantages over seeds: faster, genetically identical, no need to wait for pollination',

        // (b) INHERITANCE
        'Chromosomes and genes — chromosomes in nucleus carry genes; genes are sections of DNA at specific loci on chromosomes; alleles are different forms of same gene at same locus; human cells have 23 pairs (46 total) of chromosomes; diploid (2n); gametes are haploid (n = 23)',
        'Mendel\'s laws — law of segregation: allele pairs separate during gamete formation → each gamete receives one allele; law of independent assortment: allele pairs for different characters segregate independently (dihybrid only introduced if needed)',
        'Genetic terminology — dominant allele: expressed when one or two copies present; recessive allele: only expressed when two copies present (homozygous recessive); homozygous (both alleles identical: AA or aa); heterozygous (two different alleles: Aa); genotype (alleles present: AA, Aa, aa); phenotype (observable characteristic)',
        'Monohybrid crosses — using Punnett squares; F1 and F2 ratios; predicting offspring ratios; working backwards from offspring to determine parental genotypes; test cross (unknown dominant phenotype × homozygous recessive → if 1:1 offspring ratio → parent was heterozygous; if all dominant offspring → parent was homozygous dominant)',
        'Sex determination — sex chromosomes: XX (female), XY (male); Y chromosome carries SRY gene → male development; 50% chance of male or female in each pregnancy; sex ratio from Punnett square',
        'Sex-linkage — genes carried on X chromosome; examples: red-green colour blindness (XᴿXᴿ or XᴿXʳ female; XʳY male — affected); haemophilia (XᴴXʰ carrier female; XʰY affected male); females can be carrier (heterozygous) and not affected; males with one recessive X allele are affected; affected sons must have inherited allele from mother; carrier daughters can be from father or mother',
        'Codominance — neither allele dominant over the other; both expressed in heterozygote; example: sickle cell anaemia (HbA/HbS genotype — heterozygote has both normal and sickle-shaped cells = sickle cell trait); ABO blood groups: IA, IB codominant; i recessive; genotypes IA IA or IA i = blood group A; IB IB or IB i = B; IA IB = AB; ii = O',
        'Mutation — random change in DNA sequence (base/nucleotide change); can be caused by mutagens (UV light, ionising radiation/X-rays, gamma rays, certain chemicals — carcinogens); sickle cell anaemia caused by single base substitution in haemoglobin gene → abnormal β-haemoglobin chain → red blood cells become sickle-shaped → less efficient at O₂ transport, block capillaries; Down\'s syndrome: non-disjunction of chromosome 21 during meiosis → trisomy 21 (3 copies of chromosome 21) → learning difficulties, distinctive facial features',
        'Natural selection — variation exists in populations; variation partly heritable; more offspring produced than can survive; competition for limited resources; best-adapted individuals more likely to survive and reproduce → pass on favourable alleles → change in allele frequency over many generations; antibiotic resistance as example: random mutation → resistant variant → antibiotic kills susceptible → resistant bacteria survive and reproduce → whole population resistant',
        'Selective breeding (artificial selection) — humans choose organisms with desirable traits → breed them → select offspring with desired traits → repeat over many generations; examples: high milk yield cattle, disease-resistant wheat, seedless grapes, ornamental dog breeds; consequences: reduced genetic diversity, increased risk from new diseases',

        // (c) GENETIC ENGINEERING (Extension — Bold/B reference)
        'Genetic engineering — using restriction enzymes to cut DNA at specific sites → removes desired gene; DNA ligase to join gene into vector (plasmid); transformation of host cells; applications: human insulin production in bacteria (E. coli given insulin gene → grow in fermenter → insulin extracted); Golden Rice (β-carotene genes from daffodil inserted into rice → produces vitamin A precursor → reduces vitamin A deficiency); GM crops (herbicide-resistant, insect-resistant/Bt toxin)',
        'Cloning — producing genetically identical organisms; in plants: tissue culture (cells from meristem → nutrient medium → callus → new plants); in animals: embryo splitting (embryo split before cells specialise → surrogate mothers); adult cell cloning (somatic cell nuclear transfer SCNT: enucleated egg cell + donor nucleus → electric shock → develops into clone)',
      ],
      forbiddenTopics: [
        'Chi-squared test — beyond 4BI1 IGCSE',
        'Hardy-Weinberg equation — beyond 4BI1 IGCSE',
        'Linkage groups — beyond 4BI1 IGCSE',
        'Epistasis — beyond 4BI1 IGCSE',
        'Dihybrid crosses in detail — not explicitly required (mention only if needed for monohybrid context)',
        'Gene expression mechanisms (transcription/translation) — beyond 4BI1 IGCSE',
        'DNA replication mechanism — beyond 4BI1 IGCSE',
        'Speciation — beyond 4BI1 IGCSE',
      ],
      requiredKeywords: [
        'asexual reproduction', 'clone', 'mitosis', 'meiosis', 'fertilisation', 'gametes',
        'diploid', 'haploid', 'chromosomes',
        'pollination', 'pollen tube', 'ovule', 'seed dispersal', 'germination',
        'dominant', 'recessive', 'homozygous', 'heterozygous', 'genotype', 'phenotype',
        'Punnett square', 'test cross', 'monohybrid',
        'sex chromosomes', 'XX', 'XY', 'sex-linked', 'carrier',
        'codominance', 'sickle cell', 'ABO blood group',
        'mutation', 'non-disjunction', 'trisomy 21', 'mutagen',
        'natural selection', 'antibiotic resistance', 'selective breeding',
        'restriction enzyme', 'DNA ligase', 'plasmid', 'insulin', 'Golden Rice',
      ],
      practicalSkills: [
        'Carry out monohybrid crosses using physical or drawn Punnett squares',
        'Interpret genetic diagrams including sex-linked inheritance and codominance',
        'Calculate phenotype ratios from given crosses',
        'Interpret pedigree charts to determine inheritance patterns',
      ],
      boundaryNotes: [
        'Extension (Paper 2 B-reference) content includes: detail of meiosis crossing over and independent assortment; embryo cloning and adult cell cloning (SCNT); genetic engineering mechanism (restriction enzymes, ligase, plasmid vector)',
        'Monohybrid crosses MUST show: parental genotypes, gametes (circle the alleles), Punnett square, offspring genotypes and phenotypes with ratios',
      ],
    },

    topic4: {
      code: '4BI1-T4',
      title: 'Ecology and the Environment',
      tier: 'both',
      allowedTopics: [
        // (a) ORGANISMS AND THEIR ENVIRONMENT
        'Ecological terminology — ecosystem (all the living organisms in an area and the non-living environment they interact with); habitat (specific place where an organism lives within an ecosystem); population (all individuals of one species in a defined area); community (all populations of different species in an area)',
        'Abiotic factors — non-living physical and chemical factors: temperature, light intensity, pH, water availability, mineral ion concentration, humidity, wind speed, soil type',
        'Biotic factors — living factors affecting organisms: competition (interspecific: between different species; intraspecific: within same species), predation (predator–prey relationship), disease, food availability, pollination',
        'Food chains — always begin with a producer (photosynthetic organism); primary consumer (herbivore) → secondary consumer → tertiary consumer; example: grass → rabbit → fox; arrows show direction of energy/biomass flow',
        'Food webs — multiple interconnected food chains; more realistic representation of feeding relationships in ecosystem; removal of one species affects many others',
        'Trophic levels — position in food chain: producer (trophic level 1), primary consumer (TL2), secondary consumer (TL3) etc.; biomass and energy decrease at each level',
        'Energy transfer — energy lost at each trophic level: as heat in respiration; in excretory products; in indigestible material (faeces); only about 10% of energy passes to next trophic level; pyramid of energy (always a true pyramid); pyramid of numbers (may not be pyramidal); pyramid of biomass (usually a pyramid but can be inverted in some aquatic ecosystems)',
        'Decomposers and detritivores — decomposers (bacteria and fungi): secrete enzymes, break down dead organic matter by extracellular digestion, absorb products; release mineral ions back into soil; detritivores (earthworms, woodlice, millipedes): ingest and mechanically break up dead matter; increase surface area for decomposer action',

        // (b) FEEDING RELATIONSHIPS
        'Prey–predator cycles — oscillating population size; predator numbers lag behind prey numbers; as prey increases → more food for predators → predators increase → prey decreases → less food → predators decrease → prey increases again; interpreted from graphs',
        'Competition — for limited resources: food, water, territory, nesting sites, light (plants), minerals (plants); intraspecific (more intense — same niche); interspecific; resource partitioning reduces direct competition',

        // (c) CYCLES WITHIN ECOSYSTEMS
        'Carbon cycle — photosynthesis: CO₂ + H₂O → glucose (removes CO₂ from atmosphere); respiration by all organisms: glucose + O₂ → CO₂ (returns CO₂); combustion of fossil fuels (coal, oil, gas): releases CO₂ stored for millions of years; decomposition by bacteria/fungi: organic carbon in dead organisms → CO₂; feeding: carbon passes up food chain; fossilisation: dead organisms → fossil fuels over millions of years under pressure',
        'Water cycle — evaporation (from oceans, lakes, rivers); transpiration (from plant leaves); condensation (water vapour cools → forms clouds); precipitation (rain, snow); surface run-off; infiltration into groundwater; transpiration is a significant contribution to water cycle in forests',
        'Nitrogen cycle — nitrogen fixation: Rhizobium bacteria (in root nodules of legumes) and Azotobacter (free-living in soil) fix N₂ → NH₄⁺ (ammonium ions); lightning also fixes N₂; nitrification: Nitrosomonas convert NH₄⁺ → NO₂⁻; Nitrobacter convert NO₂⁻ → NO₃⁻ (nitrate); both aerobic bacteria; denitrification: anaerobic denitrifying bacteria convert NO₃⁻ → N₂ (in waterlogged/anaerobic soils — removes nitrogen from cycle); ammonification: decomposers break down proteins/nucleic acids in dead organic matter → NH₄⁺; nitrogen uptake: plants absorb NO₃⁻ via active transport → make amino acids → proteins; animals eat plants → organic nitrogen passes up food chain',

        // (d) HUMAN INFLUENCES ON THE ENVIRONMENT
        'Deforestation — causes: clearance for agriculture, timber industry, urbanisation, roads; effects: loss of biodiversity (species extinct), disrupted carbon cycle (trees absorb CO₂ → less absorption, burning releases CO₂), soil erosion (roots no longer hold soil → leaching of minerals), disrupted water cycle (less transpiration → less rainfall), habitat loss',
        'Global warming — enhanced greenhouse effect: CO₂, methane (CH₄), nitrous oxide (N₂O), water vapour act as greenhouse gases — absorb and re-emit infrared radiation trapped near Earth\'s surface; causes: burning fossil fuels, deforestation, intensive livestock farming (methane from cattle and paddy fields), industrial processes; effects: rising sea levels (thermal expansion of seawater + melting ice caps/glaciers), flooding of low-lying land, more extreme weather events, shifting climate zones, coral bleaching, extinction of species unable to adapt',
        'Eutrophication — excessive nutrients (nitrates/phosphates from artificial fertilisers or sewage) enter waterways; algal bloom (rapid algal growth → covers water surface → blocks light from submerged plants → plants die); algae die when nutrients depleted; decomposers increase (bacteria decomposing dead algae/plants); decomposers use up O₂ in aerobic respiration → O₂ concentration falls → BOD (biological oxygen demand) increases → fish and other aerobic organisms die (oxygen deprivation); dead zone formed',
        'Pesticides — used to kill pests; bioaccumulation: non-biodegradable pesticides (e.g. DDT) absorbed by organisms at base of food chain, not excreted, stored in fat; biomagnification: concentration increases at each trophic level (top predators accumulate highest concentrations); effects: reproductive failure in birds of prey (thin eggshells), neurotoxic effects in mammals',
        'Pollution and human impact — acid rain (SO₂ and NO₂ from fossil fuel combustion dissolve in rainwater → H₂SO₃, HNO₃ → lowers pH → damages trees, acidifies freshwater lakes killing fish and invertebrates, corrodes limestone buildings); plastic pollution (non-biodegradable, accumulates in marine environments, microplastics ingested by organisms at all levels, entanglement of marine mammals and seabirds); heavy metal pollution from mining/industrial effluent',
        'Conservation — reasons: ecological (ecosystem stability, food chains), economic (tourism, medicines from plants, genetic resources), ethical (no right to destroy species), aesthetic; in situ conservation: nature reserves, national parks, SSSIs (Sites of Special Scientific Interest), wildlife corridors; ex situ conservation: zoos and captive breeding programmes (reintroduction), botanic gardens, seed banks (permafrost storage — Svalbard Global Seed Vault); international agreements: CITES (Convention on International Trade in Endangered Species); sustainable management of fisheries (quotas, minimum net mesh size, closed seasons, marine reserves)',
        'Endangered species — species at risk of extinction; causes: habitat destruction, overexploitation (hunting, overfishing), pollution, invasive species, disease, climate change; conservation measures target these causes',
      ],
      forbiddenTopics: [
        'Detailed biochemistry of the carbon cycle (RuBisCO, Calvin cycle) — beyond 4BI1',
        'Detailed nitrogen fixation enzyme mechanism — beyond 4BI1',
        'Population ecology calculations (mark-release-recapture Lincoln Index) — beyond 4BI1 IGCSE level',
        'Biodiversity indices (Simpson\'s D) — beyond 4BI1',
      ],
      requiredKeywords: [
        'ecosystem', 'habitat', 'population', 'community', 'abiotic', 'biotic',
        'food chain', 'food web', 'trophic level', 'producer', 'consumer',
        'energy transfer', 'biomass', 'pyramid',
        'decomposer', 'detritivore', 'nitrogen fixation', 'nitrification', 'denitrification', 'ammonification',
        'carbon cycle', 'photosynthesis', 'respiration', 'combustion', 'decomposition',
        'deforestation', 'biodiversity', 'greenhouse gas', 'global warming',
        'eutrophication', 'algal bloom', 'deoxygenation', 'BOD',
        'bioaccumulation', 'biomagnification', 'DDT',
        'in situ', 'ex situ', 'seed bank', 'captive breeding', 'CITES',
      ],
      practicalSkills: [
        'Investigate the distribution of organisms in a habitat using quadrats and belt transects — calculate frequency and percentage cover',
        'Measure abiotic factors (light intensity, temperature, pH, humidity) in different habitats',
        'Construct and interpret food chains and webs from data',
        'Interpret population graphs including prey-predator oscillations',
        'Plan an investigation into the effect of a named factor on the rate of decomposition',
      ],
      boundaryNotes: [
        'Extension (Paper 2): quantitative energy transfer calculations between trophic levels; detail of eutrophication mechanism including BOD; detailed CITES information.',
        'Pyramid of numbers can be inverted (e.g. one oak tree supporting many caterpillars); pyramid of biomass is more useful; pyramid of energy is always a true pyramid.',
      ],
    },

    topic5: {
      code: '4BI1-T5',
      title: 'Use of Biological Resources',
      tier: 'both',
      allowedTopics: [
        // (a) FOOD PRODUCTION (PLANTS)
        'Crop plant improvement — selective breeding: choose plants with desired traits (high yield, disease resistance, pest resistance, drought tolerance) → cross-breed → select best offspring → repeat over generations; green revolution: high-yielding varieties, fertilisers, pesticides, irrigation → greatly increased food production from 1960s onwards',
        'Glasshouse production — control of temperature (heating system); control of CO₂ concentration (artificially increased by burning fuels or using CO₂ injectors); control of light (artificial lighting to extend day length); maximises photosynthesis and growth; protection from pests and weather',
        'Hydroponics — growing plants without soil in nutrient solution (contains mineral ions in correct proportions); advantages: precise control of nutrients, faster growth, no weeds, no soil-borne pests, grow in areas with poor soil; disadvantages: high cost, regular monitoring required, dependency on electricity and equipment',
        'Biological pest control — using natural predators, parasites or pathogens to control pest populations; examples: Ladybirds to control aphids; Bacillus thuringiensis (Bt) bacteria to control caterpillars; advantages: no chemical residues, sustainable, no harm to non-target organisms; disadvantages: slow acting, may not eliminate pest completely, introduced organism may itself become pest',
        'Fertilisers — provide mineral ions (nitrogen for protein/chlorophyll synthesis, phosphorus for DNA/ATP, potassium for enzyme activation); natural (manure, compost): improves soil structure, releases nutrients slowly, sustainable; artificial (ammonium nitrate, NPK fertilisers): precise nutrient content, rapidly available, risk of eutrophication if leaches into waterways',

        // (b) FOOD PRODUCTION (MICROORGANISMS)
        'Yeast in bread-making — Saccharomyces cerevisiae; anaerobic respiration: glucose → ethanol + CO₂; CO₂ causes dough to rise (gluten network traps bubbles); ethanol evaporates on baking; yeast also produces flavour compounds',
        'Yeast in brewing (beer and wine) — anaerobic conditions; glucose → ethanol + CO₂; ethanol is the desired product; CO₂ released as gas; distillation used to concentrate ethanol for spirits; ethanol concentration limited by toxicity to yeast (~15%)',
        'Bacteria in yoghurt production — Lactobacillus bacteria; pasteurised milk inoculated with starter culture; lactose (milk sugar) fermented → lactic acid; lactic acid lowers pH → denatures casein (milk protein) → coagulates → thick creamy texture; cooling stops fermentation',
        'Mycoprotein production (Quorn) — Fusarium venenatum (fungus) grown in large fermenter/bioreactor; aerobic conditions; glucose (from starch) as carbon source; ammonia as nitrogen source; temperature and pH controlled; mycoprotein harvested, processed; high protein, high fibre, low fat; suitable for vegetarians; fermentation conditions: 30°C, pH 6; continuous process',
        'Industrial fermenters — large steel vessel (10,000–100,000 litres); controlled conditions: temperature (water-cooled jacket — fermentation generates heat), pH (alkali/acid additions), nutrient supply (glucose, mineral ions), aeration (sterile air bubbled in for aerobic organisms), agitation (stirrer/impeller — keeps organisms in suspension, improves gas/nutrient exchange); sterilisation essential (steam sterilisation of vessel, filter sterilisation of air, autoclave media); aseptic technique; monitoring (pH probe, O₂ electrode, temperature sensor, sampling)',

        // (c) SELECTIVE BREEDING
        'Selective breeding in animals — choosing animals with desired traits: increased milk yield in dairy cattle (Holstein/Friesian breeds); lean meat in pigs; egg-laying frequency in chickens; disease resistance; high wool production in sheep; methodology: select parents → breed → select best offspring → back-cross or breed together → repeat; loss of genetic diversity is a consequence',
        'Fish farming (aquaculture) — salmon, tilapia; controlled environment: cages in sea or ponds; fed high-protein pellets; selective breeding for fast growth and disease resistance; problems: water pollution (waste food, faeces), disease spread (antibiotics overused → resistance), escape of farmed fish → interbreeding with wild, sea lice',

        // (d) BIOTECHNOLOGY
        'Genetic engineering — recombinant DNA technology; steps: identify and isolate desired gene (using restriction endonucleases to cut at specific palindromic sequences, leaving sticky ends); insert into vector (plasmid cut with same restriction enzyme → complementary sticky ends; DNA ligase seals the phosphodiester bonds); transform host cells (E. coli by heat shock; plant cells by Agrobacterium tumefaciens or gene gun); select transformed cells (using antibiotic resistance marker genes); grow and extract product',
        'Applications of genetic engineering — human insulin production: human insulin gene isolated from human cDNA → inserted into E. coli plasmid → E. coli grown in fermenter → insulin extracted/purified; advantages over pig/cow insulin: identical to human insulin, no allergic reactions, unlimited supply, ethical; Golden Rice: β-carotene synthesis genes from daffodil and bacterium inserted into rice genome → endosperm produces β-carotene (precursor to vitamin A) → reduces vitamin A deficiency; GM herbicide-resistant crops: gene for herbicide resistance inserted → allows herbicide use to kill weeds without harming crop; Bt crops: gene for Bacillus thuringiensis toxin (kills lepidopteran pests) inserted → crop produces toxin internally → reduces pesticide use',
        'Cloning plants — tissue culture: explains totipotency (every cell contains same genome, can be stimulated to develop into whole plant); take cells from apical meristem (rapidly dividing); sterilise; place on agar with plant hormones (auxins and cytokinins); callus forms (mass of undifferentiated cells); transfer to medium promoting differentiation → shoots and roots form → plantlets transferred to compost; advantages: rapid production of many identical plants, all disease-free, preserve rare varieties',
        'Cloning animals — embryo splitting: early embryo (8-cell stage) split → each half implanted in surrogate mother; identical genetically; adult cell cloning (somatic cell nuclear transfer — SCNT, Dolly the sheep): enucleated egg cell + somatic (body) cell nucleus → electric shock fuses them and stimulates division → embryo → implanted in surrogate; genetically identical to nucleus donor',
        'Ethical issues in biotechnology — genetic engineering: unknown long-term health effects, biodiversity impacts (gene flow from GM to wild relatives), corporate control of food supply (GM patents), labelling and consumer choice, "playing God" argument, reduction of genetic diversity; animal cloning: welfare concerns (high failure rate, many abnormalities), purpose of cloning (conservation vs commercial), slippery slope to human cloning; selective breeding: reduced genetic diversity, welfare of animals bred for commercial traits',
      ],
      forbiddenTopics: [
        'CRISPR-Cas9 mechanism — beyond 4BI1 IGCSE',
        'Transcription/translation for gene expression — beyond 4BI1 IGCSE',
        'PCR in detail — beyond 4BI1 IGCSE',
        'Gel electrophoresis for DNA profiling — beyond 4BI1 IGCSE',
        'RNA interference — beyond 4BI1 IGCSE',
        'Industrial penicillin production (fermentation) — not in 4BI1 IGCSE specification',
      ],
      requiredKeywords: [
        'selective breeding', 'glasshouse', 'hydroponics', 'biological pest control',
        'fermenter', 'bioreactor', 'aseptic', 'pH', 'temperature control', 'aeration',
        'anaerobic respiration', 'lactic acid', 'lactose', 'Lactobacillus',
        'mycoprotein', 'Fusarium', 'Quorn',
        'restriction enzyme', 'sticky ends', 'DNA ligase', 'plasmid', 'vector',
        'transformation', 'antibiotic resistance marker',
        'insulin', 'Golden Rice', 'β-carotene',
        'totipotency', 'callus', 'tissue culture',
        'embryo splitting', 'SCNT', 'Dolly',
        'eutrophication risk', 'fertiliser', 'NPK',
      ],
      practicalSkills: [
        'Investigate the effect of yeast concentration on rate of fermentation (CO₂ production)',
        'Investigate food preservation methods (temperature, pH effects on microbial growth)',
        'Investigate the effect of different nutrients on plant growth (hydroponics investigation)',
        'Plan an investigation into the effectiveness of a biological pest control agent',
      ],
      boundaryNotes: [
        'Extension (Paper 2 Bold/B-reference) includes: detailed genetic engineering steps (restriction enzyme, ligation, transformation); SCNT cloning mechanism; detailed fermenter diagram and function of all components.',
        'Practical skills assessed embedded in written papers — students should be able to plan, analyse and evaluate practical investigations in this topic.',
        'Ethical arguments must present both sides and be balanced — DO NOT just list advantages or disadvantages.',
      ],
    },
  },

  // -----------------------------------------------------------
  // EDEXCEL IGCSE CHEMISTRY (4CH1)
  // Four topics across Paper 1 (core) and Paper 2 (extension)
  // Bold/'C'-reference content: Paper 2 extension only
  // Source: Pearson 4CH1 Specification Issue 2, first examined 2019
  // -----------------------------------------------------------
  chemistry: {

    topic1: {
      code: '4CH1-T1',
      title: 'Principles of Chemistry',
      tier: 'both',
      allowedTopics: [
        // (a) STATES OF MATTER
        'Three states of matter — solid: particles closely packed in regular arrangement, vibrate about fixed positions, cannot flow, incompressible, definite shape and volume, strong forces of attraction; liquid: particles closely packed but randomly arranged, slide past each other, can flow, virtually incompressible, no fixed shape but definite volume, weaker forces than solid; gas: particles far apart, random arrangement, move rapidly in all directions, easily compressed, no fixed shape or volume, negligible forces between particles',
        'Changes of state — melting (solid → liquid); freezing (liquid → solid); boiling/evaporation (liquid → gas); condensation (gas → liquid); sublimation (solid → gas, e.g. iodine, dry ice CO₂); energy input required for melting and boiling (overcome intermolecular forces); energy released on freezing and condensation',
        'Particle theory — kinetic model; evidence: Brownian motion (pollen/smoke particles visible moving erratically when seen under microscope — caused by bombardment by invisible gas/liquid molecules); diffusion (mixing of gases or liquids by random particle movement)',
        'Diffusion — net movement of particles from high concentration to low concentration region; gases diffuse faster than liquids (particles move faster, greater distances between particles); heavier molecules diffuse slower; NH₃/HCl experiment: white ring of NH₄Cl forms closer to HCl end (NH₃ is lighter, diffuses faster)',
        'Heating and cooling curves — plateau at melting/boiling point (energy used to break intermolecular forces, not increase KE or temperature); temperature constant during change of state',

        // (b) ATOMIC STRUCTURE
        'Atoms — fundamental unit of an element; very small (radius ≈ 0.1 nm); mostly empty space; nucleus: contains protons and neutrons, very small and dense; electrons: orbit nucleus in shells, negligible mass',
        'Subatomic particles — proton: mass 1, charge +1; neutron: mass 1, charge 0; electron: mass ~1/1840 (negligible), charge −1; proton number = number of protons = number of electrons (neutral atom) = atomic/proton number Z; mass number A = protons + neutrons; neutrons = A − Z',
        'Isotopes — atoms of the same element with same proton number but different mass numbers (different numbers of neutrons); same chemical properties (same electron configuration); different physical properties (different mass); examples: ¹²C and ¹⁴C; ³⁵Cl and ³⁷Cl; relative atomic mass is weighted average',
        'Electronic configuration — electrons in shells (energy levels); first shell: maximum 2 electrons; second shell: maximum 8; third shell: maximum 8 (at IGCSE level); notation 2,8,1 for sodium; link to position in periodic table: period = number of electron shells occupied; group = number of electrons in outermost shell (valence electrons); elements 1-20',
        'Relative atomic mass (Ar) — weighted mean mass of an atom of an element compared to 1/12 mass of a ¹²C atom; calculating from isotope abundances: Ar = Σ(isotope mass × relative abundance)/100',
        'Mass spectrometry — used to find relative atomic mass and relative molecular mass; ions accelerated by electric field, deflected by magnetic field, detected; m/z value measured; most abundant peak = base peak; molecular ion peak M⁺ gives Mr; isotope peaks give Ar',

        // (c) RELATIVE FORMULA MASSES AND MOLAR VOLUMES
        'Relative molecular mass (Mr) — sum of relative atomic masses of all atoms in formula; calculated from chemical formula; examples: H₂O: 2(1)+16 = 18; NaCl: 23+35.5 = 58.5; H₂SO₄: 2(1)+32+4(16) = 98',
        'Mole — amount of substance containing 6.02×10²³ particles (Avogadro\'s constant L); n = m/M (n = moles, m = mass in g, M = molar mass in g/mol); molar mass = numerically equal to Ar or Mr in g/mol',
        'Percentage composition — (mass of element in 1 mol / Mr) × 100; empirical formula from percentage composition: divide by Ar → divide by smallest → simplest ratio',
        'Molecular formula from empirical formula — must be given Mr; molecular formula = n × empirical formula',
        'Molar volume of gases — at room temperature and pressure (RTP: 25°C, 1 atm): 1 mol of any gas occupies 24 dm³ (24,000 cm³); V = n × 24 (dm³); n = V/24',
        'Concentration — c = n/V; c in mol/dm³; V in dm³; n in mol; converting cm³ → dm³: divide by 1000',
        'Reacting masses — use molar ratios from balanced equation; calculate mass of product from mass of reactant; limiting reagent: reagent that is completely used up; excess reagent: reagent remaining at end; percentage yield = (actual yield/theoretical yield) × 100',

        // (d) ATOMIC STRUCTURE AND BONDING THEORY
        'Ionic bonding — electron transfer from metal to non-metal; metals lose electrons → positive ions (cations); non-metals gain electrons → negative ions (anions); electrostatic attraction between oppositely charged ions; dot-and-cross diagrams for: NaCl, MgO, MgCl₂, Na₂O, CaCl₂, Al₂O₃; giant ionic lattice: regular 3D arrangement, strong electrostatic forces in all directions; properties: high melting and boiling points (strong forces, requires much energy to break); conducts electricity when molten or dissolved (free ions); does NOT conduct when solid (ions fixed); brittle (like charges brought opposite when displaced → repulsion); soluble in polar solvents (water)',
        'Covalent bonding — sharing of a pair of electrons between two non-metal atoms; each atom contributes one electron; both atoms achieve full outer shell; single bond (one shared pair), double bond (two shared pairs), triple bond (three shared pairs); dot-and-cross diagrams: H₂, Cl₂, HCl, H₂O, NH₃, CH₄, CO₂, O₂, N₂, HF, CH₃Cl',
        'Molecular covalent compounds — small molecules; forces: strong covalent bonds within molecule, weak intermolecular forces (van der Waals/London forces) between molecules; properties: low melting/boiling points (weak intermolecular forces overcome); do NOT conduct electricity (no free ions or electrons); many are gases or liquids at room temperature; solubility varies',
        'Giant covalent (macromolecular) structures — diamond: each C bonded to 4 others in tetrahedral arrangement; giant lattice; all bonds covalent; very hard (high breaking bond energy); very high melting point; does NOT conduct electricity (no free electrons/ions); used in cutting tools; graphite: each C bonded to 3 others in hexagonal layers; one delocalised electron per C atom between layers; conducts electricity (delocalised electrons); layers held by weak van der Waals forces → layers slide → lubricant; soft; used as lubricant and electrode; SiO₂ (silicon dioxide): giant covalent; very high melting point; does not conduct electricity',
        'Metallic bonding — lattice of positive metal ions surrounded by sea of delocalised electrons; strong electrostatic attraction between positive ions and electron sea; properties: conducts electricity (free/delocalised electrons); conducts heat (electrons transfer energy); malleable and ductile (layers of ions slide over each other, electron sea maintains bonding); high melting/boiling points (strong bonds); lustrous appearance; alloys: mixing of two or more metals (or metal + non-metal) disrupts regular lattice → different-sized atoms prevent sliding → harder and stronger than pure metals; examples: steel (Fe + C), brass (Cu + Zn), bronze (Cu + Sn)',
        'Fullerenes — C₆₀ (buckminsterfullerene): spherical cage of 60 carbon atoms; 20 hexagonal + 12 pentagonal faces; molecular structure (NOT giant); weak intermolecular forces → low melting point; semiconductor; potential drug delivery vehicle; carbon nanotubes: cylindrical; very high tensile strength; conduct electricity; uses in electronics, composite materials',

        // (e) ACIDS, BASES AND SALTS
        'Acids — produce H⁺ ions in solution; pH < 7; strong acids fully ionise (HCl, HNO₃, H₂SO₄); weak acids partially ionise (ethanoic acid CH₃COOH, carbonic acid H₂CO₃, citric acid); universal indicator/pH probe measures acidity',
        'Bases and alkalis — bases: substances that neutralise acids (usually metal oxides or hydroxides); alkalis: soluble bases that produce OH⁻ ions in solution; NaOH, KOH, Ca(OH)₂ (limewater), NH₃(aq); pH > 7',
        'pH scale — 0-14; pH 7 neutral; decreasing pH = increasing acid strength; increasing pH = increasing alkali strength; pH measured using universal indicator, indicator paper, or pH probe/meter',
        'Indicators — litmus (red in acid, blue in alkali); phenolphthalein (colourless in acid, pink in alkali); methyl orange (red in acid, yellow in alkali); universal indicator (full range of colours)',
        'Neutralisation — acid + alkali → salt + water; acid + metal oxide → salt + water; acid + carbonate → salt + water + CO₂; acid + metal → salt + hydrogen',
        'Reactions of acids — with metals: metal + acid → metal salt + H₂ (only reactive metals: Mg, Zn, Fe, not Cu); with metal hydroxides/oxides: acid + base → salt + water; with carbonates: acid + carbonate → salt + water + CO₂; test for H₂: lighted splint → pops; test for CO₂: limewater turns milky',
        'Preparing salts — soluble salts: from insoluble base/carbonate + acid → add excess solid → filter → evaporate; from alkali + acid: titration → evaporate; insoluble salts: precipitation — mix two solutions containing required ions; e.g. BaSO₄: add H₂SO₄ to BaCl₂ solution → white precipitate BaSO₄; filter, wash, dry',
        'Titrations — accurate measurement of volume of acid/alkali required for neutralisation; technique: fill burette with one solution; use pipette for other; run into conical flask with indicator; swirl; add dropwise near endpoint; record concordant titres (within 0.10 cm³); calculate moles → concentration',

        // (f) CHEMISTRY OF GROUPS 1, 7 AND 0
        'Group 1 alkali metals (Li, Na, K) — soft, low density metals; react vigorously with water: 2M + 2H₂O → 2MOH + H₂; Li: slow, Na: vigorous/melts into ball, K: ignites with lilac flame; reactivity increases down group (outer electron further from nucleus, lost more easily); flame tests: Li crimson red, Na yellow-orange, K lilac; stored in oil (prevent contact with air and water)',
        'Group 7 halogens (F₂, Cl₂, Br₂, I₂) — diatomic molecules; physical state at room temp: F₂ pale yellow gas, Cl₂ green-yellow gas, Br₂ brown/orange liquid, I₂ grey-black solid (purple vapour); reactivity and oxidising power decrease down group; displacement reactions: more reactive halogen displaces less reactive from its salt solution: Cl₂ + 2KBr → 2KCl + Br₂ (solution turns orange); Cl₂ + 2KI → 2KCl + I₂ (solution turns brown/purple); Br₂ + 2KI → 2KBr + I₂; test for halide ions using acidified silver nitrate: Cl⁻ → AgCl white (soluble in dilute NH₃); Br⁻ → AgBr cream (soluble only in conc NH₃); I⁻ → AgI yellow (insoluble in NH₃); uses of chlorine: water treatment (kills bacteria), bleach (Cl₂ + NaOH → NaOCl), PVC; uses of iodine: antiseptic, iodised salt',
        'Group 0 noble gases (He, Ne, Ar, Kr, Xe) — full outer electron shell → very unreactive/inert; monatomic (exist as single atoms); very low boiling points (weak forces); uses: He in balloons and airships (lighter than air, non-flammable); Ar in light bulbs and welding (inert atmosphere, prevents oxidation); Ne in advertising signs (distinct colour when electricity passed through); Kr and Xe in speciality lighting',

        // (g) TRANSITION METALS
        'Transition metals — found in the central block (d-block) of periodic table between Groups 2 and 3; high density; high melting points (except mercury); hard and strong; less reactive than Group 1/2 metals; form coloured compounds (due to d-electron transitions); variable oxidation states (e.g. Fe: +2 and +3; Cu: +1 and +2; Mn: +2, +4, +7); act as catalysts: Fe in Haber process, V₂O₅ in Contact process, Pt in catalytic converters, MnO₂ in H₂O₂ decomposition',

        // (h) QUANTITATIVE ANALYSIS (EXTENSION — Bold C reference for some)
        'Identifying ions — cation tests: NH₄⁺ — add NaOH → warm → pungent gas (NH₃ — turns damp red litmus blue); Cu²⁺ — add NaOH → blue precipitate; Fe²⁺ — add NaOH → green precipitate; Fe³⁺ — add NaOH → brown precipitate; Ca²⁺ — add NaOH → white precipitate (insoluble); Al³⁺ — add NaOH → white precipitate (dissolves in excess — amphoteric)',
        'Identifying anions — Cl⁻: acidify with HNO₃, add AgNO₃ → white precipitate (AgCl); Br⁻: cream precipitate; I⁻: yellow precipitate; SO₄²⁻: acidify with HCl, add BaCl₂ → white precipitate (BaSO₄); CO₃²⁻: add dilute HCl → bubbles (CO₂ turns limewater milky); NO₃⁻: add NaOH + aluminium foil → warm → NH₃ produced',
      ],
      forbiddenTopics: [
        'Enthalpy changes (Hess\'s law, bond enthalpy calculations, Born-Haber cycles) — Topic 3 Physical Chemistry',
        'Rate of reaction mathematical treatment — Topic 3',
        'Equilibrium constants (Kc, Kp, Ka) — beyond 4CH1 IGCSE',
        's, p, d sub-shell notation; Aufbau; Hund\'s rule — beyond 4CH1 IGCSE',
        'VSEPR theory for predicting bond angles — beyond 4CH1 IGCSE (only shapes required)',
        'Organic reaction mechanisms with curly arrows — beyond 4CH1 IGCSE',
        'NMR spectroscopy — beyond 4CH1 IGCSE',
        'Electrode potentials and electrochemical cells (E° values) — beyond 4CH1 IGCSE',
      ],
      requiredKeywords: [
        'diffusion', 'Brownian motion', 'kinetic model',
        'proton number', 'mass number', 'isotope', 'relative atomic mass', 'electronic configuration',
        'ionic bonding', 'electron transfer', 'cation', 'anion', 'giant ionic lattice',
        'covalent bonding', 'electron sharing', 'molecular', 'giant covalent',
        'metallic bonding', 'delocalised electrons', 'alloy',
        'diamond', 'graphite', 'fullerene', 'C₆₀',
        'mole', 'molar mass', 'Avogadro constant', 'limiting reagent', 'percentage yield',
        'acid', 'base', 'alkali', 'neutralisation', 'salt', 'pH',
        'displacement reaction', 'AgNO₃', 'AgCl white', 'AgBr cream', 'AgI yellow',
        'Group 1', 'Group 7', 'Group 0', 'transition metals', 'variable oxidation states',
      ],
      practicalSkills: [
        'Carry out acid-base titrations — accurate burette technique, concordant titres, indicator choice',
        'Prepare a pure dry sample of an insoluble salt by precipitation',
        'Prepare a pure dry sample of a soluble salt from an acid and insoluble base',
        'Identify unknown substances using chemical tests (flame tests, cation/anion tests, gas tests)',
        'Investigate the reaction of metals with acids — observe rate differences; collect and test hydrogen gas',
        'Investigate the properties of Group 7 halogens — displacement reactions, colour changes in organic/aqueous layer',
      ],
      boundaryNotes: [
        'Extension (Paper 2 C-reference): quantitative titration calculations; calculating Ar from mass spectrum; calculating empirical and molecular formula from data; detailed ionic test interpretations.',
        'Bond angles at IGCSE are qualitative — students should know common shapes (tetrahedral ~109.5°, V-shaped water, pyramidal ammonia) but VSEPR theory is NOT required; only describe shapes without formal VSEPR language.',
        'Relative atomic mass from isotope abundances IS required for Paper 2.',
      ],
    },

    topic2: {
      code: '4CH1-T2',
      title: 'Inorganic Chemistry',
      tier: 'both',
      allowedTopics: [
        // (a) GROUP 1 (covered in Topic 1 — cross-reference)
        'Group 1 reactions (detailed) — reactions with oxygen: 4Li + O₂ → 2Li₂O (oxide); 2Na + O₂ → Na₂O₂ (peroxide); K + O₂ → KO₂ (superoxide); reactivity order: Li < Na < K < Rb < Cs; ionisation energy decreases (outer electron further from nucleus, more shielded); properties: very soft (cut with scalpel), low density (Li, Na, K float on water); lustrous when freshly cut then tarnish rapidly in air',

        // (b) GROUP 7 (covered in Topic 1 — cross-reference)
        'Group 7 reactions (detailed) — with hydrogen: H₂ + X₂ → 2HX; HF most stable, HI least stable; with sodium: 2Na + Cl₂ → 2NaCl; Cl₂ with water: Cl₂ + H₂O ⇌ HCl + HOCl; disproportionation with NaOH: cold dilute → NaCl + NaOCl (bleach); hot concentrated → NaCl + NaClO₃; reducing power of halide ions: I⁻ > Br⁻ > Cl⁻ (test with conc H₂SO₄: NaCl → HCl gas; NaBr → HBr + SO₂; NaI → HI + H₂S + SO₂ + S — multiple products)',

        // (c) GROUP 2
        'Group 2 alkaline earth metals (Mg, Ca, Sr, Ba) — reactions with water: Mg reacts slowly with cold water, vigorously with steam → MgO + H₂; Ca + 2H₂O → Ca(OH)₂ + H₂; Sr and Ba react vigorously with cold water; reactivity increases down group; reactions with O₂: 2Mg + O₂ → 2MgO (burns with bright white flame); with dilute HCl: vigorous reaction → metal chloride + H₂; thermal decomposition of Group 2 carbonates: increases in stability down group (MgCO₃ decomposes most easily, BaCO₃ most stable) — polarising power of cation decreases down group (cations get larger → less polarising → carbonate more stable); solubility of Group 2 hydroxides: increases down group (Mg(OH)₂ insoluble/slightly soluble → Ba(OH)₂ soluble); solubility of Group 2 sulfates: decreases down group (MgSO₄ soluble → BaSO₄ insoluble); flame tests: Ca²⁺ brick/orange-red, Sr²⁺ crimson, Ba²⁺ apple-green',

        // (d) TRANSITION METALS (detailed from Topic 1)
        'Transition metal reactions — iron: Fe + dilute H₂SO₄ → FeSO₄ + H₂; Fe²⁺ oxidised to Fe³⁺ by Cl₂; rust formation (Fe + O₂ + H₂O → iron(III) oxide — requires both O₂ and H₂O); rust prevention: painting, galvanising (Zn coating), sacrificial protection (Zn or Mg anode — more reactive, oxidised preferentially), alloying (stainless steel), electroplating; copper: unreactive with dilute acids; Cu + conc HNO₃ → Cu(NO₃)₂ + NO₂ + H₂O',
        'Identification of transition metal ions — by colour of compound and precipitate with NaOH: Cu²⁺ blue solution → Cu(OH)₂ blue precipitate; Fe²⁺ pale green solution → Fe(OH)₂ green precipitate; Fe³⁺ yellow-brown solution → Fe(OH)₃ brown precipitate; Mn²⁺ very pale pink solution → Mn(OH)₂ buff/cream precipitate; Cr³⁺ green solution → Cr(OH)₃ green precipitate (dissolves in excess NaOH)',

        // (e) WATER
        'Tests for water — anhydrous copper(II) sulfate CuSO₄ (white powder): turns blue in presence of water; anhydrous cobalt(II) chloride CoCl₂ (blue solid/paper): turns pink in presence of water',
        'Water hardness — hard water: contains dissolved Ca²⁺ and Mg²⁺ ions (from CaCO₃ and CaSO₄ in rock); difficult to form lather with soap (forms scum: Ca²⁺/Mg²⁺ + soap → calcium stearate precipitate); temporary hardness: caused by Ca(HCO₃)₂ or Mg(HCO₃)₂ (dissolved CO₂ + CaCO₃ → Ca(HCO₃)₂); removed by boiling: Ca(HCO₃)₂ → CaCO₃↓ + H₂O + CO₂ (causes scale/limescale in kettles); permanent hardness: caused by CaSO₄; NOT removed by boiling; removed by: ion exchange (Na⁺ replaces Ca²⁺/Mg²⁺), adding washing soda (Na₂CO₃), distillation',
        'Water purification — sedimentation (add aluminium sulfate coagulant → flocculation → large particles settle); filtration (through sand and gravel beds removes smaller particles and microorganisms); chlorination (adding Cl₂ or chlorine compound kills bacteria and other pathogens); fluoridation (adding fluoride at 1 ppm prevents tooth decay — controversial); advantages and disadvantages of adding fluoride (advantage: reduces tooth decay, cheaper than dental treatment; disadvantage: concerns about effects at higher concentrations, ethical objections to mass medication)',

        // (f) INDUSTRIAL PROCESSES
        'Haber process — N₂ + 3H₂ ⇌ 2NH₃; ΔH = −92 kJ/mol; raw materials: N₂ from fractional distillation of liquid air; H₂ from natural gas (steam reforming) or cracking; conditions: temperature 450°C (compromise — too hot shifts equilibrium left, too cold → slow rate), pressure 200 atm (high pressure → shifts equilibrium right toward 2 mol NH₃ from 4 mol gas, but expensive compressors), iron catalyst (increases rate but does NOT shift equilibrium); yield ~15%; unreacted gases recycled; uses of ammonia: fertilisers (ammonium nitrate, ammonium sulfate), explosives (TNT, nitroglycerine via nitric acid), nylon, cleaning products',
        'Contact process — manufacture of sulfuric acid; 2SO₂ + O₂ ⇌ 2SO₃; V₂O₅ catalyst; 450°C; 1–2 atm; SO₃ + H₂SO₄ → H₂S₂O₇ (oleum); H₂S₂O₇ + H₂O → 2H₂SO₄; uses of sulfuric acid: fertilisers (ammonium sulfate, superphosphate), car batteries, detergents, dyes',
        'Electrolysis of brine — chlor-alkali industry; concentrated NaCl(aq); products: Cl₂ at anode (from Cl⁻ discharge), H₂ at cathode (from H⁺ discharge — H₂O → H⁺ + OH⁻; H⁺ preferred over Na⁺), NaOH in remaining solution; uses: Cl₂ → bleach, PVC, disinfectants; H₂ → ammonia (Haber), margarine (hydrogenation); NaOH → soap, paper, cleaning',
        'Extraction of aluminium — Hall-Héroult electrolysis; Al₂O₃ (alumina/bauxite) dissolved in molten cryolite (Na₃AlF₆) to lower melting point (from 2015°C to ~950°C); electrolysis of molten mixture: Al³⁺ reduced at cathode → Al (liquid, collected at bottom); O²⁻ oxidised at anode → O₂; carbon anodes burn away (O₂ reacts with C → CO₂, anodes replaced regularly); high electricity cost → why recycling Al is important (saves 95% energy)',
        'Rusting and its prevention — iron rusts when both O₂ and H₂O present (salt acts as electrolyte, speeds up rusting); rust = hydrated iron(III) oxide Fe₂O₃·xH₂O; prevention: physical barriers (paint, oil, plastic coating, tin plating); galvanising (zinc coating — acts as physical barrier AND sacrificial protection); sacrificial anodes (Zn or Mg blocks attached to iron → more reactive → oxidised instead → protect iron even when coating scratched; Mg used on ships, pipelines); stainless steel (Fe + Cr + Ni — Cr₂O₃ layer forms, impervious)',
      ],
      forbiddenTopics: [
        'Detailed d-block electron configurations — beyond 4CH1 IGCSE',
        'Electrode potentials for transition metals — beyond 4CH1 IGCSE',
        'Complex ion formation and stability constants — beyond 4CH1 IGCSE',
        'Nuclear chemistry — Topic 1 Principles (atomic structure) only — no nuclear reactions at 4CH1',
      ],
      requiredKeywords: [
        'Group 1', 'Group 2', 'Group 7', 'reactivity trend', 'displacement',
        'thermal decomposition', 'carbonate stability', 'sulfate solubility', 'hydroxide solubility',
        'flame test', 'NaOH precipitation test', 'colour of precipitate',
        'hard water', 'temporary hardness', 'permanent hardness', 'ion exchange',
        'Haber process', 'N₂', 'H₂', 'NH₃', 'iron catalyst', '450°C', '200 atm',
        'Contact process', 'SO₂', 'SO₃', 'V₂O₅',
        'electrolysis of brine', 'Cl₂', 'NaOH', 'H₂',
        'Hall-Héroult', 'cryolite', 'aluminium extraction',
        'galvanising', 'sacrificial protection', 'rusting',
      ],
      practicalSkills: [
        'Investigate the factors affecting the rate of rusting (presence of water, O₂, salt)',
        'Test water hardness using soap solution — measure volume of soap needed to form lather',
        'Investigate the effect of temperature on thermal decomposition of Group 2 carbonates',
        'Carry out electrolysis of brine — identify products at each electrode and test them',
        'Demonstrate displacement reactions of halogens — observe and explain colour changes',
      ],
      boundaryNotes: [
        'Extension (Paper 2 C-reference): detailed Group 2 solubility trends with explanation; polarising power explanation for carbonate stability; detailed electrolysis calculations (Faraday — NOT required, just qualitative products); vanadium oxidation states in Contact process detail.',
        'Haber and Contact process conditions must be explained in terms of rate/equilibrium compromise — do NOT just list conditions without explanation.',
      ],
    },

    topic3: {
      code: '4CH1-T3',
      title: 'Physical Chemistry',
      tier: 'both',
      allowedTopics: [
        // (a) ENERGETICS
        'Exothermic reactions — energy released to surroundings; temperature of surroundings increases; ΔH < 0 (negative); products have lower energy than reactants; examples: combustion of fuels (CH₄ + 2O₂ → CO₂ + 2H₂O + energy), neutralisation, respiration, reaction of Na with water, rusting',
        'Endothermic reactions — energy absorbed from surroundings; temperature of surroundings decreases; ΔH > 0 (positive); products have higher energy than reactants; examples: thermal decomposition of CaCO₃, dissolving ammonium nitrate in water, photosynthesis',
        'Activation energy (Ea) — minimum energy needed for reaction to occur; must overcome energy barrier; not all collisions result in reaction (must have Ea or more); activation energy shown on energy profile diagram',
        'Energy profile diagrams — y-axis: energy; x-axis: reaction coordinate/progress; show: reactants, products, transition state (peak), activation energy, ΔH; exothermic: products lower than reactants; endothermic: products higher; catalyst: lower-energy pathway (lower Ea)',
        'Bond energies — bond breaking requires energy input (endothermic); bond making releases energy (exothermic); ΔH = Σ(bond energies broken) − Σ(bond energies formed); if ΔH negative → exothermic (more energy released making bonds than absorbed breaking bonds); calculating ΔH from given bond energies',
        'Calorimetry — q = mcΔT (q = heat energy in J; m = mass of solution in g; c = specific heat capacity = 4.2 J/g°C for water/dilute solution; ΔT = temperature change in °C); calculating ΔH from experimental data: find q, find moles of limiting reagent, ΔH = q/moles (in kJ/mol); sign: exothermic if temperature rises',

        // (b) RATES OF REACTION
        'Factors affecting rate — concentration (more concentrated → more particles per unit volume → more frequent collisions → faster rate); temperature (higher temperature → particles have more kinetic energy → more particles exceed Ea → more frequent AND more successful collisions → faster rate); surface area (more surface area → more frequent collisions → faster rate; powders react faster than lumps); catalysts (provide lower-energy alternative pathway → reduce Ea → more particles have sufficient energy → faster rate; catalyst NOT used up; selectivity of catalysts)',
        'Collision theory — for reaction to occur: particles must collide; collision must have sufficient energy (≥ Ea); correct orientation of particles; rate depends on frequency of successful collisions',
        'Maxwell-Boltzmann distribution — bell-shaped curve on energy vs number of particles graph: starts at origin (no particles with zero energy); maximum at most probable energy; tail to right (few particles with very high energy); total area = total number of particles; Ea marked on x-axis: only particles to right of Ea can react; effect of temperature increase: curve flattens, peak shifts right, same total area (same number of particles), much greater area to right of Ea → faster rate; effect of catalyst: Ea shifts left on same curve → greater area to right → faster rate',
        'Measuring rate — change in mass (CO₂ gas loss on balance); gas volume collected (gas syringe or inverted measuring cylinder); colour change (colorimetry for coloured solutions); change in turbidity (thiosulfate + acid → S precipitate → cross-disappears; time for cross to disappear); sampling and quenching (withdraw sample, quench with cold water/NaOH, titrate)',
        'Concentration-time graphs — gradient = rate; steeper gradient at start (higher concentration); rate decreases as reactants consumed; zero when reaction complete',

        // (c) REVERSIBLE REACTIONS AND EQUILIBRIUM
        'Reversible reactions — symbol ⇌; reaction can proceed in both directions; examples: CuSO₄ hydration (anhydrous CuSO₄ + H₂O ⇌ hydrated CuSO₄; white ⇌ blue); NH₄Cl decomposition (NH₄Cl ⇌ NH₃ + HCl — white solid → white fumes)',
        'Dynamic equilibrium — in a closed system; forward and reverse reactions occur at equal rates; macroscopic properties (concentration, colour, pressure) remain constant; NOT a static state; concentrations of reactants and products need not be equal',
        'Le Chatelier\'s principle — if equilibrium disturbed, system shifts to minimise/oppose the change: increasing concentration of reactant → shifts forward (toward products); increasing pressure → shifts toward side with fewer moles of gas; increasing temperature → shifts in endothermic direction (toward reactants if forward reaction exothermic); adding catalyst → no shift in position, only reaches equilibrium faster; industrial applications: N₂ + 3H₂ ⇌ 2NH₃ (Haber — choice of T and P explained by Le Chatelier)',

        // (d) ELECTROLYSIS
        'Electrolysis — passage of electricity through molten ionic compound or aqueous solution → decomposition into elements; electrolyte: conducts electricity and is decomposed; anode (+): oxidation occurs, anions (negative ions) discharge; cathode (−): reduction occurs, cations (positive ions) discharge; inert electrodes (graphite or platinum — do not react)',
        'Electrolysis of molten compounds — molten NaCl: Na⁺ → Na (cathode); Cl⁻ → Cl₂ (anode); molten Al₂O₃: Al³⁺ → Al (cathode); O²⁻ → O₂ (anode — reacts with carbon anode)',
        'Electrolysis of aqueous solutions — selective discharge: order of discharge depends on position in activity series; cathode: less reactive metal ions discharged before H⁺; H⁺ discharged before Na⁺, K⁺ (very reactive metals not discharged from solution); anode: Cl⁻ discharged before OH⁻ if concentrated; OH⁻ discharged as O₂ if dilute; dilute H₂SO₄: H₂ at cathode, O₂ at anode; concentrated NaCl: H₂ at cathode, Cl₂ at anode; CuSO₄(aq) with copper electrodes: Cu deposited at cathode, Cu dissolves from anode (copper purification)',
        'Electroplating — cathode: object to be plated; anode: plating metal (dissolves); electrolyte: solution of plating metal salt; current deposits metal from anode → solution → cathode; purpose: decorative (silver, gold plating of jewellery), protection against corrosion (chromium plating), industrial (nickel plating); conditions for good plating: clean surface, correct current density, correct concentration',
        'Fuel cells — hydrogen-oxygen fuel cell: H₂ fed to anode → oxidised: H₂ → 2H⁺ + 2e⁻; O₂ fed to cathode → reduced: O₂ + 4H⁺ + 4e⁻ → 2H₂O; overall: 2H₂ + O₂ → 2H₂O; advantages: no combustion, water as only product (clean), efficient energy conversion, no NOₓ or SO₂; disadvantages: H₂ storage and production, expensive catalysts (Pt), infrastructure',
      ],
      forbiddenTopics: [
        'Hess\'s Law cycle calculations using multiple enthalpies — beyond 4CH1 IGCSE',
        'Born-Haber cycles — beyond 4CH1 IGCSE',
        'Entropy (ΔS) and Gibbs free energy (ΔG) — beyond 4CH1 IGCSE',
        'Rate equations, rate constant k, order of reaction — beyond 4CH1 IGCSE',
        'Arrhenius equation — beyond 4CH1 IGCSE',
        'Equilibrium constants (Kc, Kp) — beyond 4CH1 IGCSE',
        'Faraday\'s laws (quantitative electrolysis m = ItM/nF) — beyond 4CH1 IGCSE',
        'Half-cell electrode potentials — beyond 4CH1 IGCSE',
      ],
      requiredKeywords: [
        'exothermic', 'endothermic', 'ΔH', 'activation energy', 'energy profile diagram',
        'bond breaking', 'bond making', 'calorimetry', 'q = mcΔT',
        'collision theory', 'Maxwell-Boltzmann distribution', 'Ea', 'frequency of collisions',
        'reversible reaction', 'dynamic equilibrium', 'Le Chatelier\'s principle',
        'concentration', 'temperature', 'pressure effect on equilibrium',
        'electrolysis', 'anode', 'cathode', 'oxidation', 'reduction', 'inert electrode',
        'selective discharge', 'copper purification', 'electroplating',
        'fuel cell', 'H₂', 'O₂', 'H₂O',
      ],
      practicalSkills: [
        'Investigate the effect of concentration and temperature on rate of reaction — thiosulfate clock reaction',
        'Measure enthalpy changes by calorimetry — combustion of alcohols, neutralisation',
        'Carry out electrolysis experiments — molten lead bromide; aqueous copper sulfate; aqueous sodium chloride; collect and test products',
        'Investigate the effect of surface area on rate of reaction — calcium carbonate + HCl (marble chips vs powder)',
        'Investigate the rate of decomposition of H₂O₂ with different catalysts (MnO₂, liver, etc.)',
      ],
      boundaryNotes: [
        'Le Chatelier\'s principle MUST include explanation of WHY equilibrium shifts — not just which direction.',
        'Maxwell-Boltzmann distribution is required for Paper 2 — students must be able to draw and interpret the curve, show Ea, and explain effect of temperature/catalyst.',
        'Extension (Paper 2 C-reference): Maxwell-Boltzmann distribution; bond energy calculations from data; detailed electrolysis of brine (selective discharge explanation); fuel cell mechanism; Faraday NOT required — only qualitative predictions.',
      ],
    },

    topic4: {
      code: '4CH1-T4',
      title: 'Organic Chemistry',
      tier: 'both',
      allowedTopics: [
        // (a) INTRODUCTION TO ORGANIC CHEMISTRY
        'Carbon chemistry — carbon forms 4 bonds; can form chains (aliphatic), rings (cyclic), branched structures; carbon-carbon bonds can be single, double, or triple; organic compounds contain carbon (usually with H, O, N, halogens)',
        'Homologous series — series of organic compounds with same general formula; successive members differ by CH₂; similar chemical properties (same functional group); gradual change in physical properties (boiling point increases with chain length due to stronger London forces)',
        'Functional groups — determine chemical properties of organic compound; alkane: no functional group (C-C and C-H bonds only); alkene: C=C double bond; alcohol: -OH group; carboxylic acid: -COOH group; halogenoalkane: -X (X = Cl, Br, I)',
        'IUPAC nomenclature — systematic naming of organic compounds; chain length prefix: meth- (1C), eth- (2C), prop- (3C), but- (4C), pent- (5C), hex- (6C); functional group suffix: -ane (alkane), -ene (alkene), -ol (alcohol), -oic acid (carboxylic acid); numbering carbon chain to give lowest locants to functional groups; naming branched alkanes: methyl, ethyl substituents; structural isomers: same molecular formula, different structural formula',
        'Displayed (full structural), condensed, and skeletal formulae — ability to draw and interpret all three representations',
        'Structural isomerism — chain isomers (different carbon skeleton), position isomers (same functional group at different position), functional group isomers (same molecular formula but different functional group)',

        // (b) ALKANES
        'Alkanes (CₙH₂ₙ₊₂) — saturated hydrocarbons (only single C-C bonds); non-polar; relatively unreactive; methane, ethane, propane, butane (gases at room temperature); pentane, hexane, heptane, octane (liquids)',
        'Combustion — complete combustion (excess O₂): alkane + O₂ → CO₂ + H₂O + energy; incomplete combustion (limited O₂): → CO and/or C (soot) + H₂O; CO is toxic (binds to haemoglobin → forms carboxyhaemoglobin → prevents O₂ transport)',
        'Substitution with halogens — free radical mechanism; UV light needed (initiates reaction by breaking Cl₂ → 2Cl•); three stages: initiation (Cl₂ → 2Cl• by UV light); propagation (Cl• + CH₄ → HCl + CH₃•; CH₃• + Cl₂ → CH₃Cl + Cl•; chain reaction, continues); termination (two radicals combine: Cl• + Cl• → Cl₂; CH₃• + Cl• → CH₃Cl; 2CH₃• → C₂H₆); polyhalogenation possible (multiple H atoms can be replaced)',
        'Crude oil — mixture of hydrocarbons (mainly alkanes); fractional distillation: heat crude oil → vapour → pass up fractionating column → temperature decreases going up → different fractions condense at different temperatures; fractions (from bottom to top): residue/bitumen (>300°C) used for roads; fuel oil/heavy oil (250-300°C) for ships, power stations; diesel/gas oil (200-250°C) for lorries, trains; kerosene/paraffin (150-200°C) for jet fuel; naphtha/gasoline (40-150°C) for petrol; refinery gas (LPG, <40°C) for domestic gas/calor gas',
        'Cracking — breaking large hydrocarbon molecules into smaller, more useful ones; thermal cracking: high temperature (500°C), high pressure, no catalyst → alkane → alkene + shorter alkane; catalytic cracking: lower temperature (450°C), zeolite catalyst, atmospheric pressure → produces more branched and aromatic compounds (higher octane petrol)',

        // (c) ALKENES
        'Alkenes (CₙH₂ₙ) — unsaturated hydrocarbons; contain at least one C=C double bond; more reactive than alkanes due to double bond; planar around double bond (120° bond angles)',
        'Reactions of alkenes — electrophilic addition reactions (double bond is electron-rich and attracts electrophiles); addition of Br₂ (bromine water decolourises from orange to colourless — test for unsaturation/alkene); addition of HBr → bromoalkane; addition of H₂O (hydration with steam + H₃PO₄ catalyst) → alcohol; addition of H₂ (hydrogenation with Ni catalyst, 150°C) → alkane; Markovnikov\'s rule (H adds to carbon with more H atoms — H to H): gives major product when adding HBr or H₂O to asymmetrical alkenes',
        'Addition polymerisation — monomers with C=C join together by addition to form long polymer chain; initiator needed; repeat unit in polymer shows one monomer unit in chain; drawing repeat unit from monomer (remove double bond, add chain bonds); naming polymers: poly(ethene) from ethene; poly(propene) from propene; poly(chloroethene) = PVC from chloroethene; poly(tetrafluoroethene) = PTFE/Teflon from CF₂=CF₂; deducing monomer from repeat unit; disposal problems: non-biodegradable, contribution to plastic pollution',

        // (d) ALCOHOLS
        'Alcohols — contain -OH hydroxyl group; general formula CₙH₂ₙ₊₁OH; primary (CH₃OH methanol; C₂H₅OH ethanol; propan-1-ol; butan-1-ol); hydrogen bonding: -OH can form H-bonds with water → lower alcohols fully miscible with water; higher boiling points than corresponding alkanes (due to H-bonding)',
        'Reactions of alcohols — combustion: alcohol + O₂ → CO₂ + H₂O (used as fuels — biofuels); reaction with Na: 2ROH + 2Na → 2RONa + H₂ (gentler than Na + water); dehydration: alcohol + Al₂O₃ catalyst or conc H₂SO₄ at 180°C → alkene + H₂O; oxidation: primary alcohols → aldehydes (then carboxylic acids) with acidified KMnO₄ or K₂Cr₂O₇ (orange → green); secondary alcohols → ketones; tertiary alcohols not easily oxidised; esterification with carboxylic acids',
        'Ethanol production — fermentation: glucose → ethanol + CO₂ (by yeast; anaerobic; temperature 25-37°C; pH neutral; product limited by ethanol toxicity to yeast ~15% v/v; slow; uses renewable resource — glucose from crops; needs distillation to concentrate); hydration of ethene: CH₂=CH₂ + H₂O → C₂H₅OH (steam + H₃PO₄ catalyst, 300°C, 60-70 atm; fast; pure product; uses non-renewable resource — crude oil derived)',
        'Comparison of fermentation vs hydration — fermentation: renewable, lower technology, slow, dilute, batch process; hydration: non-renewable (fossil fuel), higher energy cost, faster, pure, continuous process',

        // (e) CARBOXYLIC ACIDS
        'Carboxylic acids — contain -COOH group; general formula CₙH₂ₙ₊₁COOH; examples: methanoic acid HCOOH (formic acid), ethanoic acid CH₃COOH (acetic acid), propanoic acid, butanoic acid; weak acids (partially ionise); form hydrogen bonds → higher boiling points than similar mass alcohols; miscible with water',
        'Reactions of carboxylic acids — react as acids with: metals (Ca, Mg, Zn, Na → salt + H₂); metal hydroxides/oxides → salt + water; Na₂CO₃ → salt + water + CO₂ (effervescence — distinguishes carboxylic acids from other acids/alcohols); esterification with alcohol: carboxylic acid + alcohol ⇌ ester + water (concentrated H₂SO₄ catalyst; reversible; reflux; named: alkyl alkanoate — ethyl ethanoate from ethanol + ethanoic acid)',
        'Esters — -COO- linkage; sweet/fruity smell; used as flavourings, perfumes, solvents; hydrolysis (reverse of esterification): ester + H₂O ⇌ carboxylic acid + alcohol (acid or alkali catalyst; if base used: saponification → carboxylate salt + alcohol — used in soap making; fats = esters of fatty acids + glycerol)',

        // (f) POLYMERS
        'Condensation polymerisation — monomers join with elimination of small molecule (H₂O or HCl); polyesters (two monomers: diol + dicarboxylic acid, e.g. ethane-1,2-diol + benzene-1,4-dicarboxylic acid → Terylene/PET; -ester- linkage -COO-; water eliminated); polyamides (diamine + dicarboxylic acid or amino acid, e.g. nylon-6,6 from hexane-1,6-diamine + hexanedioic acid; -amide- linkage -CONH-; water eliminated); amino acids → peptides/proteins (peptide bond = amide bond; condensation)',
        'Hydrolysis of polymers — polyesters hydrolysed by acid or base → monomers (diols + dicarboxylic acids); polyamides hydrolysed by acid or base → monomers (diamines + dicarboxylic acids); proteins hydrolysed → amino acids; DNA hydrolysed → nucleotides',
        'Comparison of addition vs condensation polymers — addition: one monomer type (with C=C), no small molecule lost, product is the polymer with no by-product; condensation: two different monomer types (usually), small molecule (H₂O or HCl) lost, -ester- or -amide- linkage in backbone',

        // (g) ANALYTICAL CHEMISTRY (ORGANIC)
        'Identifying organic functional groups — bromine water: orange → colourless with alkenes or phenols (NOT alkanes, NOT alcohols, NOT carboxylic acids); acidified KMnO₄: purple → colourless/brown MnO₂ with alkenes (or alcohols); universal indicator/litmus: red with carboxylic acids; Na₂CO₃ solution: effervescence with carboxylic acids; Na metal: bubbles H₂ with alcohols AND carboxylic acids (carboxylic acid reacts faster)',
        'Chromatography — paper chromatography: separate mixtures by solubility in solvent; Rf = distance moved by substance/distance moved by solvent front; identify substances by Rf values or comparison with known standards; TLC (thin layer chromatography): similar principle, faster, more sensitive; gas-liquid chromatography (GLC/GC): separates mixture by boiling point/interaction with stationary phase; retention time identifies compounds',

        // (h) PETROCHEMICALS AND SYNTHETIC MATERIALS
        'Synthetic materials — nylon (polyamide): strong, elastic, resistant to abrasion; uses: clothing, ropes, toothbrush bristles, parachutes; Terylene/polyester (PET): strong, resistant to chemicals; uses: clothing, bottles, films; PTFE (Teflon): non-stick, resistant to chemicals; uses: cookware coating, electrical insulation; PVC: rigid or flexible (with plasticiser); uses: pipes, window frames, cables; poly(ethene): two types: LDPE (low-density, flexible) and HDPE (high-density, rigid)',
        'Environmental impact of plastics — non-biodegradable (most addition polymers); plastic pollution in oceans and land; microplastics entering food chain; solutions: reduce use, reuse, recycle, biodegradable alternatives (polylactic acid PLA from renewable starch), incineration (energy recovery but CO₂ produced), landfill issues',
      ],
      forbiddenTopics: [
        'Reaction mechanisms with curly arrows (SN1, SN2, E2, nucleophilic addition, EAS) — beyond 4CH1 IGCSE',
        'Spectroscopy for organic analysis (IR, MS, NMR) — beyond 4CH1 IGCSE',
        'Optical isomerism — beyond 4CH1 IGCSE',
        'E/Z isomerism — beyond 4CH1 IGCSE (only structural isomerism at IGCSE)',
        'Benzene and arene chemistry — beyond 4CH1 IGCSE',
        'Amines and amino acids beyond condensation polymer context — beyond 4CH1 IGCSE',
        'Detailed ester hydrolysis mechanism — beyond 4CH1 IGCSE',
      ],
      requiredKeywords: [
        'homologous series', 'functional group', 'structural isomer',
        'alkane', 'alkene', 'saturated', 'unsaturated', 'C=C',
        'combustion', 'free radical substitution', 'initiation', 'propagation', 'termination',
        'fractional distillation', 'cracking',
        'addition reaction', 'bromine water', 'Markovnikov',
        'addition polymerisation', 'repeat unit', 'polymer',
        'hydroxyl group', 'fermentation', 'hydration', 'dehydration', 'esterification',
        'carboxylic acid', 'ester', 'saponification',
        'condensation polymerisation', 'polyester', 'polyamide', 'peptide bond',
        'hydrolysis', 'Rf value', 'chromatography',
      ],
      practicalSkills: [
        'Test for alkenes using bromine water — observe decolourisation; compare with alkanes',
        'Carry out esterification reaction — mix alcohol and carboxylic acid with conc H₂SO₄; warm; distil off ester; test smell',
        'Investigate rates of reactions involving organic compounds — e.g. combustion of different alcohols by calorimetry',
        'Carry out paper chromatography — calculate Rf values; identify compounds from Rf and colour',
        'Investigate cracking of paraffin oil — collect unsaturated products; test with bromine water',
      ],
      boundaryNotes: [
        'Extension (Paper 2 C-reference): free radical substitution mechanism; Markovnikov\'s rule explanation; condensation polymerisation mechanism; hydrolysis of esters/polyesters; comparison of industrial methods for ethanol production in depth.',
        'Bromine water test: alkenes decolourise bromine water (orange → colourless); alkanes do NOT. This is a key practical identification test.',
        'IGCSE requires drawing structural formulae — both displayed formula (showing all bonds) and condensed formula.',
      ],
    },
  },

  // -----------------------------------------------------------
  // EDEXCEL IGCSE PHYSICS (4PH1)
  // Eight topics across Paper 1 (core) and Paper 2 (extension)
  // Bold/'P'-reference content: Paper 2 extension only
  // Source: Pearson 4PH1 Specification Issue 2, first examined 2019
  // -----------------------------------------------------------
  physics: {

    topic1: {
      code: '4PH1-T1',
      title: 'Forces and Motion',
      tier: 'both',
      allowedTopics: [
        // (a) MOVEMENT AND POSITION
        'Speed, distance, time — speed = distance/time; v = d/t; units: m/s; distance-time graphs: gradient = speed; flat section = stationary; steep section = fast; curve = changing speed',
        'Velocity and acceleration — velocity = speed in a given direction (vector); acceleration = change in velocity/time; a = (v−u)/t; units: m/s²',
        'Velocity-time graphs — gradient = acceleration; area under graph = displacement/distance; flat section = constant velocity; upward slope = acceleration; downward slope = deceleration; area of triangle = ½ × base × height; area of trapezium',
        'Equations of motion (SUVAT) — v = u + at; s = ut + ½at²; v² = u² + 2as; s = ½(u+v)t; using these to solve problems; recognising which to use from given quantities',
        'Acceleration due to gravity — g = 9.8 m/s² (or 10 m/s² for approximations); all objects fall with same acceleration in vacuum (ignoring air resistance); free fall',

        // (b) FORCES, MOVEMENT, SHAPE AND MOMENTUM
        'Newton\'s first law — object at rest remains at rest; object moving continues at constant velocity unless a resultant force acts; inertia',
        'Newton\'s second law — F = ma; resultant force = mass × acceleration; F in N, m in kg, a in m/s²; resultant force in same direction as acceleration',
        'Newton\'s third law — for every action there is an equal and opposite reaction; forces act on different objects; same type, same magnitude, opposite direction',
        'Weight — W = mg; weight is force due to gravity; mass is scalar (constant everywhere); weight is vector (varies with g)',
        'Friction — force opposing relative motion; always opposes direction of motion; causes surfaces to heat up; static friction (object stationary), kinetic friction (object moving); friction = μN at limiting equilibrium',
        'Terminal velocity — as object falls: weight (constant, downward) > drag (increases with speed); net force decreases → acceleration decreases; when drag = weight → net force = 0 → constant velocity = terminal velocity; applies to: falling objects, vehicles at top speed',
        'Free body diagrams — represent all forces on one object as labelled arrows; correct direction, proportional length',
        'Momentum — p = mv; p in kg·m/s; vector quantity; conservation of momentum in closed system (no external net force): total momentum before = total momentum after; apply to: collisions, explosions',
        'Impulse — impulse = FΔt = Δp; impulse = change in momentum; area under force-time graph = impulse; explains why longer contact time reduces injury force (airbag, crumple zone)',
        'Stopping distance — thinking distance (distance during reaction time; affected by speed, tiredness, alcohol, drugs) + braking distance (distance during deceleration; affected by speed, road conditions, tyre/brake condition); total stopping distance = thinking + braking',
        'Forces and deformation — elastic deformation: object returns to original shape when force removed; plastic deformation: permanent change; Hooke\'s law: F = kx (spring constant k; extension x; valid up to elastic limit); elastic PE = ½kx²; beyond elastic limit: deformation no longer proportional to force; force-extension graph: linear section = Hooke\'s law obeyed; gradient = spring constant',
        'Pressure — P = F/A; P in Pa (N/m²); applies to solids; liquid pressure: P = hρg (h = depth, ρ = density, g = gravitational field strength); pressure in fluid increases with depth; pressure acts equally in all directions in a fluid',

        // (c) ENERGY, FORCES AND MOMENTUM
        'Work done — W = Fd cosθ; work done when force moves object in direction of force; W in J; 1 J = 1 N·m; θ = angle between force and displacement',
        'Gravitational potential energy — GPE = mgh (near Earth\'s surface); h = vertical height above reference',
        'Kinetic energy — KE = ½mv²',
        'Conservation of energy — energy cannot be created or destroyed; only transferred between stores; in absence of non-conservative forces: total mechanical energy conserved (KE + GPE = constant)',
        'Power — P = W/t = Fv; P in W (watts); 1 W = 1 J/s',
        'Efficiency — efficiency = useful energy output/total energy input × 100%; or useful power output/total power input × 100%; always less than 100% due to energy lost as heat; improving efficiency: lubrication (reduces friction), insulation, streamlining',
        'Energy resources — renewable: solar, wind, hydroelectric, geothermal, tidal, wave, biomass; non-renewable: fossil fuels (coal, oil, natural gas), nuclear; advantages and disadvantages of each: fossil fuels (reliable, high energy density; CO₂ emissions, finite); nuclear (high energy density, no CO₂; radioactive waste, accident risk); solar (clean, infinite; intermittent, expensive); wind (clean, cheap to run; intermittent, noise, visual impact); hydroelectric (reliable, clean; habitat disruption); tidal/wave (clean; expensive, intermittent)',
      ],
      forbiddenTopics: [
        'SHM (simple harmonic motion) — Topic 4 Waves (and not in 4PH1 IGCSE at all)',
        'Circular motion — Topic 7/8 Astrophysics',
        'Gravitational fields (field lines, potential, g = GM/r²) — Topic 8 Astrophysics',
        'Fluid dynamics (Bernoulli principle) — beyond 4PH1 IGCSE',
        'Angular momentum — beyond 4PH1 IGCSE',
        'Relativistic mechanics — beyond 4PH1 IGCSE',
      ],
      requiredKeywords: [
        'speed', 'velocity', 'acceleration', 'distance-time graph', 'velocity-time graph',
        'SUVAT', 'Newton\'s laws', 'resultant force', 'F = ma',
        'weight', 'W = mg', 'friction', 'terminal velocity', 'drag',
        'momentum', 'p = mv', 'conservation of momentum', 'impulse', 'FΔt',
        'Hooke\'s law', 'elastic limit', 'spring constant',
        'stopping distance', 'thinking distance', 'braking distance',
        'work done', 'W = Fd', 'GPE', 'KE = ½mv²',
        'conservation of energy', 'power', 'P = W/t', 'efficiency',
        'renewable', 'non-renewable', 'fossil fuels',
      ],
      practicalSkills: [
        'Investigate the relationship between force, mass and acceleration using a dynamics trolley and light gates (verify Newton\'s second law)',
        'Investigate Hooke\'s law — measure extension of spring under different loads; plot F-x graph; determine spring constant',
        'Investigate the effect of drop height on crater size (model for energy conversion)',
        'Use speed-time graphs to calculate distance and acceleration',
        'Measure stopping distance — investigate effects of speed and surface',
      ],
      boundaryNotes: [
        'Extension (Paper 2 P-reference): detailed momentum calculations for multi-body collisions; crumple zone and airbag calculations; detailed pressure calculations; power calculations for different energy resources.',
        'Velocity is a vector; speed is scalar — this distinction IS tested at IGCSE level.',
        'SUVAT equations: students must know all four and select the correct one.',
      ],
    },

    topic2: {
      code: '4PH1-T2',
      title: 'Electricity',
      tier: 'both',
      allowedTopics: [
        // (a) UNITS AND QUANTITIES
        'Electric charge — unit: coulomb (C); charge Q = It; positive charge: protons; negative charge: electrons; like charges repel, unlike charges attract; electrostatic induction',
        'Current — flow of charge; I = Q/t; unit: ampere (A); conventional current: flows from + to −; electron flow: from − to +; measure with ammeter (in series)',
        'Potential difference (voltage) — energy transferred per unit charge; V = W/Q; unit: volt (V); measure with voltmeter (in parallel); EMF (electromotive force): energy given to charge per unit charge by source',
        'Resistance — R = V/I; unit: ohm (Ω); factors: length (∝ R), cross-sectional area (∝ 1/R), material (resistivity), temperature',
        'Ohm\'s law — for metallic conductor at constant temperature: V ∝ I (or I ∝ V); R = V/I = constant; I-V graph: straight line through origin',
        'I-V characteristics — ohmic resistor: straight line through origin; filament lamp: curve (R increases as temperature increases as I increases); semiconductor diode: conducts in forward direction only, threshold voltage ≈ 0.6V, essentially no current in reverse; thermistor (NTC): R decreases as temperature increases; LDR (light-dependent resistor): R decreases as light intensity increases',

        // (b) CIRCUITS
        'Series circuits — same current everywhere (I = I₁ = I₂); voltages add up (V = V₁ + V₂ + ...); resistances add (R_total = R₁ + R₂ + ...); if one bulb fails, all go out',
        'Parallel circuits — same voltage across all branches (V = V₁ = V₂); currents add up (I = I₁ + I₂ + ...); 1/R_total = 1/R₁ + 1/R₂ + ...; if one branch fails, others continue',
        'Potential divider — two resistors in series connected to supply; Vout = R₂/(R₁+R₂) × Vin; used with LDR and thermistor as sensors; as LDR R decreases (brighter): Vout across LDR decreases; used in automatic lighting control',
        'Power — P = IV = I²R = V²/R; unit: watt (W); energy E = Pt = IVt = VQ',

        // (c) MAINS ELECTRICITY
        'Direct current (DC) vs alternating current (AC) — DC: current flows in one direction (batteries, cells); AC: current reverses direction periodically (mains electricity); UK mains: 230 V, 50 Hz; frequency = 50 Hz means 50 complete cycles per second',
        'Structure of mains cable — live wire (brown): high voltage, dangerous; neutral wire (blue): returns current, at 0V; earth wire (green/yellow stripe): safety, connected to case of appliance; should be held at 0V; connects to Earth',
        'Fuses and circuit breakers — fuse: thin wire that melts when current exceeds rating → breaks circuit → protects appliance; choose correct fuse rating (just above normal operating current); circuit breaker: electromagnetic or thermal switch that trips when current too high; can be reset; advantages over fuse: faster, reusable; RCD (residual current device): detects small current difference between live and neutral → trips → protects against electrocution',
        'Earthing — earth wire connected to metal case of appliance; if fault occurs (live touches case): large current flows to earth → fuse blows → circuit breaks → prevents electrocution; double insulation: two layers of insulation around live parts → no earth wire needed (class II appliances)',
        'Plugs — correct colour connections; fuse in live wire; cable grip holds cable firmly',
        'Electrical safety — dangers: electric shock, fire; precautions: fuses, circuit breakers, RCDs, correct insulation, earth wire, safety switches',
        'Cost of electricity — E = Pt (energy in joules); or E (kWh) = P(kW) × t(hours); cost = E(kWh) × price per kWh',

        // (d) ELECTROMAGNETIC EFFECTS
        'Electromagnetism — current in wire produces magnetic field; direction: right-hand grip rule; solenoid produces field similar to bar magnet; field strength increased by: more turns, greater current, iron core',
        'Force on current in magnetic field — F = BIl (F = force, B = magnetic flux density, I = current, l = length of conductor in field); direction: Fleming\'s left-hand rule (thumb = force/motion, index = field, middle = conventional current); used in: electric motors, loudspeakers',
        'Electric motor — current-carrying coil in magnetic field; forces on opposite sides in opposite directions → torque → rotation; split-ring commutator reverses current direction each half-turn → continuous rotation; brushes maintain electrical contact; used in: fans, drills, washing machines',
        'Electromagnetic induction — changing magnetic field (or conductor moving through magnetic field) induces EMF; magnitude of EMF depends on: rate of change of flux, number of turns, strength of magnet; direction: Lenz\'s law (induced current opposes change that caused it)',
        'Generator — coil rotating in magnetic field; induced EMF; AC generator: slip rings; DC generator: commutator; EMF increases with: faster rotation, more turns, stronger magnet',
        'Transformer — changes voltage; iron core; primary coil (input voltage Vp, turns Np); secondary coil (output voltage Vs, turns Ns); transformer equation: Vp/Vs = Np/Ns; for ideal transformer: VpIp = VsIs (power in = power out); step-up: Ns > Np → Vs > Vp; step-down: Ns < Np → Vs < Vp; used in National Grid to reduce energy losses in transmission (high voltage → low current → less heating in cables)',
        'National Grid — transmit electricity from power stations to consumers; step-up transformers at power station (raise to ~400,000 V); overhead cables and pylons; step-down transformers at substations (reduce to 230 V for homes); efficiency improved by high voltage transmission',
      ],
      forbiddenTopics: [
        'Derivation of resistivity formula — beyond 4PH1 IGCSE (only know R ∝ L and R ∝ 1/A)',
        'Capacitors — beyond 4PH1 IGCSE',
        'Complex AC circuit analysis (impedance, reactance) — beyond 4PH1 IGCSE',
        'Electromagnetic wave propagation from Maxwell\'s equations — beyond 4PH1 IGCSE',
        'Hall effect — beyond 4PH1 IGCSE',
        'Magnetic flux density derivations — beyond 4PH1 IGCSE',
      ],
      requiredKeywords: [
        'current', 'charge', 'Q = It', 'potential difference', 'voltage', 'resistance',
        'Ohm\'s law', 'R = V/I', 'series circuit', 'parallel circuit',
        'I-V characteristic', 'thermistor', 'LDR', 'diode',
        'potential divider', 'power', 'P = IV',
        'AC', 'DC', 'mains', 'live', 'neutral', 'earth', 'fuse', 'RCD',
        'earthing', 'double insulation',
        'electromagnet', 'solenoid', 'Fleming\'s left-hand rule', 'electric motor',
        'electromagnetic induction', 'Lenz\'s law', 'generator',
        'transformer', 'Vp/Vs = Np/Ns', 'step-up', 'step-down', 'National Grid',
      ],
      practicalSkills: [
        'Investigate I-V characteristics of resistors, filament lamps, and diodes — plot I-V graphs',
        'Investigate the factors affecting resistance — length, cross-sectional area, temperature',
        'Investigate the relationship between turns ratio and voltage ratio in a transformer',
        'Demonstrate electromagnetic induction using a moving magnet and coil',
        'Build and test series and parallel circuits — measure and predict voltages and currents',
      ],
      boundaryNotes: [
        'Extension (Paper 2 P-reference): F = BIl force calculations; generator EMF calculations; detailed transformer efficiency calculations; National Grid power loss calculations.',
        'Fleming\'s left-hand rule must be applied correctly — most common error is not knowing which finger represents which quantity.',
        'Alternating current: peak vs RMS voltage — RMS = Vpeak/√2 is NOT required at 4PH1 IGCSE.',
      ],
    },

    topic3: {
      code: '4PH1-T3',
      title: 'Waves',
      tier: 'both',
      allowedTopics: [
        // (a) PROPERTIES OF WAVES
        'Wave properties — amplitude (A): maximum displacement from equilibrium; wavelength (λ): distance between two adjacent points in phase; frequency (f): number of complete waves per second; period (T): time for one complete wave; T = 1/f; wave speed: v = fλ',
        'Transverse waves — oscillation perpendicular to direction of energy transfer; examples: light, all EM waves, water waves, transverse seismic S-waves; can be polarised',
        'Longitudinal waves — oscillation parallel to direction of energy transfer; compressions and rarefactions; examples: sound waves, seismic P-waves; cannot be polarised',
        'Displacement-distance and displacement-time graphs — reading off wavelength, amplitude, period, frequency from graphs',

        // (b) REFLECTION, REFRACTION, DIFFRACTION
        'Reflection — law of reflection: angle of incidence = angle of reflection (both measured from normal); angle of incidence = i; angle of reflection = r; i = r; regular reflection (smooth surface) vs diffuse reflection (rough surface); plane mirror images: virtual, upright, laterally inverted, same size as object, same distance behind mirror as object is in front',
        'Refraction — change in direction when wave passes from one medium to another (due to change in speed); light bends toward normal when entering denser medium (slower); bends away from normal when entering less dense medium (faster); refractive index n = sin i/sin r (Snell\'s law); n = c/v (c = speed of light in vacuum; v = speed in medium)',
        'Total internal reflection (TIR) — occurs when light travels from dense to less dense medium AND angle of incidence > critical angle (θc); all light reflected (no refraction); critical angle: sin θc = 1/n (for medium-to-air); optical fibres: glass/plastic core with lower density cladding → TIR keeps light inside fibre; uses: telecommunications (carry data as light pulses), endoscopes (imaging internal organs)',
        'Converging lens — focal point: where parallel rays converge after passing through lens; focal length f; principal axis; images: real, inverted images when object beyond focal point; virtual, upright, magnified when object between focal length and lens (magnifying glass); used in: camera, eye, magnifying glass, projector',
        'Dispersion — white light splits into spectrum when passing through prism; different wavelengths of light travel at slightly different speeds in glass → different refractive indices → different angles of refraction; red least refracted (longest λ); violet most refracted (shortest λ); order ROYGBIV',

        // (c) SOUND
        'Sound waves — longitudinal; produced by vibrating objects; require medium to travel; cannot travel in vacuum; speed in air ≈ 340 m/s (faster in liquids and solids — particles closer together); range of human hearing: 20 Hz to 20,000 Hz; infrasound < 20 Hz; ultrasound > 20,000 Hz',
        'Loudness and pitch — loudness: related to amplitude (greater amplitude → louder); pitch: related to frequency (higher frequency → higher pitch)',
        'Ultrasound applications — prenatal scanning (foetal imaging): pulses sent → partially reflected at boundaries between tissues → time between pulse and echo → calculate depth → build image; non-destructive testing: detect flaws in metals/welds; echo location in bats and dolphins; sonar (SONAR — Sound Navigation And Ranging): measuring sea depth; advantages over X-rays: safe (no ionising radiation), shows soft tissue',
        'Speed of sound — v = d/t; echoes: distance = speed × time/2 (divide by 2 as sound travels there and back); measuring speed of sound experimentally: time between seeing flash and hearing thunder; double microphone method',
        'Doppler effect — source moving toward observer: waves compressed → shorter λ → higher frequency; source moving away: waves stretched → longer λ → lower frequency; police speed radar; red shift in astronomy (galaxies moving away → light shifted to longer wavelengths)',

        // (d) ELECTROMAGNETIC SPECTRUM
        'EM spectrum — all transverse waves; all travel at c = 3×10⁸ m/s in vacuum; family of waves arranged by wavelength/frequency; order (decreasing wavelength / increasing frequency): radio waves → microwaves → infrared → visible light → ultraviolet → X-rays → gamma rays',
        'Properties and uses of EM waves — radio waves: communications (radio, TV, mobile phones; long wavelength → diffract around hills and buildings); microwaves: cooking (absorbed by water molecules → heat food), satellite communications, radar; infrared: thermal imaging cameras, remote controls, optical fibre (IR laser), physiotherapy, toasters/grills; visible light: vision, photography, fibre optic communications; UV: fluorescent lamps, sterilising water/medical equipment, vitamin D synthesis, detecting forged banknotes; X-rays: medical imaging (denser materials absorb more → bones show as white on film), security scanning, cancer treatment; gamma rays: cancer treatment (radiotherapy), sterilising food and medical equipment, nuclear medicine (tracers)',
        'Hazards — UV: skin cancer, eye damage, sunburn; X-rays: ionise cells → DNA damage → cancer; gamma: same as X-rays but more penetrating; minimising risk: limit exposure time, distance from source, shielding (lead for X-rays/gamma)',
      ],
      forbiddenTopics: [
        'Quantum nature of light (photons, photoelectric effect) — beyond 4PH1 IGCSE',
        'Diffraction grating equation d sinθ = nλ — beyond 4PH1 IGCSE',
        'Interference fringes (Young\'s double slit) — beyond 4PH1 IGCSE',
        'Polarisation calculations (Malus\'s law) — beyond 4PH1 IGCSE',
        'Standing waves and harmonics — beyond 4PH1 IGCSE',
        'Seismic waves in detail — beyond 4PH1 IGCSE',
      ],
      requiredKeywords: [
        'amplitude', 'wavelength', 'frequency', 'period', 'wave speed', 'v = fλ',
        'transverse', 'longitudinal', 'compressions', 'rarefactions',
        'angle of incidence', 'angle of reflection', 'refraction', 'Snell\'s law', 'refractive index',
        'total internal reflection', 'critical angle', 'optical fibre',
        'converging lens', 'focal point', 'focal length',
        'dispersion', 'prism', 'spectrum',
        'ultrasound', 'prenatal scanning', 'non-destructive testing',
        'Doppler effect', 'red shift',
        'electromagnetic spectrum', 'speed of light', 'c = 3×10⁸ m/s',
        'radio', 'microwave', 'infrared', 'UV', 'X-ray', 'gamma',
      ],
      practicalSkills: [
        'Investigate reflection and refraction using a ray box and glass block — measure angles, verify Snell\'s law, find refractive index',
        'Investigate total internal reflection — find critical angle of glass block',
        'Investigate the properties of sound — measure speed of sound; investigate relationship between pitch and frequency',
        'Measure focal length of a converging lens using a distant object or lamp and screen',
        'Investigate absorption of different types of EM radiation',
      ],
      boundaryNotes: [
        'Extension (Paper 2 P-reference): calculations using n = sin i/sin r; TIR critical angle calculations; converging lens calculations (object/image distance formula 1/f = 1/u + 1/v — NOT required); Doppler calculations.',
        'Optical fibre: students must explain why TIR occurs (angle > critical angle) — not just state it uses TIR.',
      ],
    },

    topic4: {
      code: '4PH1-T4',
      title: 'Energy Resources and Energy Transfer',
      tier: 'both',
      allowedTopics: [
        // (a) ENERGY AND ENERGY RESOURCES (covered in Topic 1 Forces — cross-reference)
        'Energy stores — kinetic, gravitational potential, chemical (fuel, food), elastic (spring, rubber), thermal (internal), electrical, nuclear, magnetic; energy can be transferred between stores',
        'Energy transfer pathways — mechanical (forces), electrical, radiation (waves), heating (conduction/convection/radiation)',
        'Conservation of energy — first law of thermodynamics: total energy is always conserved; energy is never created or destroyed; only transferred or dissipated',
        'Energy dissipation — in any energy transfer some energy is dissipated as heat to surroundings (thermal energy increases internal energy of surroundings); no process is 100% efficient; e.g. light bulb: electrical → light (useful) + heat (wasted)',
        'Efficiency (detailed) — efficiency = useful energy output/total energy input; can also express as ratio or percentage; Sankey diagrams: arrow widths proportional to energy; show useful output, wasted output; use to calculate efficiency',

        // (b) HEAT TRANSFER
        'Conduction — transfer of thermal energy through matter without movement of matter itself; best in solids (particles closely packed); metals are best conductors (free delocalised electrons transfer energy); insulators (wood, plastic, glass, air) — very slow conduction; good conductors: copper, aluminium, iron; explaining differences in terms of particle spacing and electron availability',
        'Convection — transfer of thermal energy by bulk movement of fluid (liquid or gas); heated fluid becomes less dense (particles move faster, more spread out) → rises; cooler, denser fluid sinks → takes its place → convection current; cannot occur in solids (particles fixed); examples: ocean currents, atmospheric circulation, heating a room with a radiator, hot water heating systems',
        'Radiation (infrared) — thermal radiation: infrared electromagnetic waves; emitted by all objects above absolute zero; can travel through vacuum; does not require a medium; emission and absorption depend on surface properties: dark/matt surfaces: good emitters, good absorbers; light/shiny/smooth surfaces: poor emitters (good reflectors), poor absorbers; black body radiation; Leslie cube experiment',
        'Reducing heat transfer — insulation: double glazing (air gap or argon between panes — poor conductor, reduces conduction and convection); loft insulation (fibreglass — traps still air, reduces convection); cavity wall insulation (foam fills air gap — reduces convection); draught proofing; reflective surfaces (foil-backed insulation — reflects infrared, reduces radiation); calculating savings on heating bills',

        // (c) SPECIFIC HEAT CAPACITY AND LATENT HEAT
        'Specific heat capacity — Q = mcΔθ (Q = heat energy, m = mass, c = specific heat capacity, Δθ = temperature change); c for water = 4200 J/kg°C; unit: J/kg°C or J/kg·K; physical meaning: energy needed to raise 1 kg of substance by 1°C',
        'Specific latent heat — Q = mL; L = specific latent heat; latent heat of fusion: energy needed to melt solid at melting point (or released on freezing) — no temperature change; latent heat of vaporisation: energy needed to vaporise liquid at boiling point (or released on condensation); molecular interpretation: energy used to overcome intermolecular forces, not increase kinetic energy → temperature stays constant during change of state',
        'Heating and cooling curves — flat sections at melting and boiling points; temperature vs time; steeper gradient = faster temperature change; gradient depends on specific heat capacity and power input',
        'Absolute zero — 0 K = −273°C; lowest possible temperature; particles have minimum possible internal energy; Kelvin scale: T(K) = θ(°C) + 273',
      ],
      forbiddenTopics: [
        'Second law of thermodynamics (entropy) — beyond 4PH1 IGCSE',
        'Gas laws (Boyle\'s, Charles\') in detail — Topic 5',
        'Stefan-Boltzmann law — beyond 4PH1 IGCSE',
        'Heat engine calculations (Carnot efficiency) — beyond 4PH1 IGCSE',
      ],
      requiredKeywords: [
        'energy stores', 'energy transfer', 'conservation of energy', 'dissipated',
        'efficiency', 'Sankey diagram',
        'conduction', 'convection', 'radiation', 'infrared',
        'dark/matt surface', 'shiny surface', 'good absorber', 'good emitter',
        'convection current', 'density', 'rises', 'sinks',
        'insulation', 'double glazing', 'loft insulation',
        'specific heat capacity', 'Q = mcΔθ', 'latent heat', 'Q = mL',
        'melting', 'vaporisation', 'no temperature change during change of state',
        'absolute zero', 'Kelvin scale',
      ],
      practicalSkills: [
        'Investigate specific heat capacity of a metal and water using electrical heating method',
        'Investigate rate of cooling of different surfaces — black vs silver can (Leslie cube principle)',
        'Measure latent heat of fusion of ice — add known mass of ice to water; measure temperature change',
        'Investigate effect of insulation on rate of heat loss',
      ],
      boundaryNotes: [
        'Extension (Paper 2 P-reference): detailed calculations combining Q = mcΔθ and Q = mL; Kelvin conversions in calculations; efficiency calculations from Sankey diagrams.',
        'Specific latent heat: temperature does NOT change during change of state — energy goes to breaking intermolecular bonds, not increasing kinetic energy.',
      ],
    },

    topic5: {
      code: '4PH1-T5',
      title: 'Solids, Liquids and Gases',
      tier: 'both',
      allowedTopics: [
        // (a) DENSITY AND PRESSURE
        'Density — ρ = m/V; unit: kg/m³ or g/cm³; measuring density: regular shape (measure dimensions, calculate V); irregular shape (Archimedes: submerge in measuring cylinder, measure displaced water volume); comparing densities of solids, liquids, gases (gases much less dense due to large spacing between particles)',
        'Pressure in fluids — P = F/A; P in Pa (N/m²); pressure in fluid increases with depth: P = hρg; pressure acts in all directions; Archimedes\' principle: upthrust = weight of fluid displaced = ρVg; object floats if upthrust ≥ weight; sinks if upthrust < weight; this explains why ships float despite being denser than water (their shape displaces much water)',

        // (b) CHANGE OF STATE
        'Particle model (kinetic theory) — matter consists of particles in constant random motion; higher temperature → higher average kinetic energy; explains properties of states; melting (solid → liquid): particles gain enough energy to overcome lattice forces; boiling (liquid → gas): particles escape from surface; condensation/freezing: particles lose energy',
        'Brownian motion — random movement of visible particles (smoke/pollen) due to bombardment by invisible molecules; evidence for particle nature of matter and random motion',
        'Gas laws — Boyle\'s law: pV = constant at constant temperature (pressure and volume inversely proportional); p₁V₁ = p₂V₂; Charles\' law: V/T = constant at constant pressure (volume proportional to absolute temperature); p/T = constant at constant volume (pressure proportional to absolute temperature); combined gas law: p₁V₁/T₁ = p₂V₂/T₂; temperature MUST be in Kelvin',
        'Kinetic theory of gases — ideal gas model: particles are point masses (negligible volume), in constant random motion, perfectly elastic collisions, no forces between particles except during collisions; pressure due to particles colliding with walls; increasing temperature → faster particles → more frequent and harder collisions → higher pressure; absolute zero: particles have minimum KE; gas cannot be cooled below 0K',
        'Pressure-temperature (at constant volume) — p ∝ T (in kelvin); graph of p vs T: straight line extrapolating to p = 0 at T = 0 K (−273°C); evidence for absolute zero',
      ],
      forbiddenTopics: [
        'pV = nRT (ideal gas equation) — beyond 4PH1 IGCSE',
        'pV = NkT — beyond 4PH1 IGCSE',
        'RMS speed calculations — beyond 4PH1 IGCSE',
        'Van der Waals equation — beyond 4PH1 IGCSE',
        'Detailed derivation of gas laws from kinetic theory — beyond 4PH1 IGCSE',
      ],
      requiredKeywords: [
        'density', 'ρ = m/V', 'pressure', 'P = F/A', 'P = hρg',
        'Archimedes\' principle', 'upthrust', 'floats', 'sinks',
        'kinetic theory', 'Brownian motion', 'evidence for particles',
        'Boyle\'s law', 'p₁V₁ = p₂V₂', 'Charles\' law', 'V/T = constant',
        'combined gas law', 'Kelvin', 'absolute zero',
        'change of state', 'melting', 'boiling', 'latent heat',
      ],
      practicalSkills: [
        'Measure density of solids (regular and irregular) and liquids',
        'Investigate Boyle\'s law — vary pressure and volume at constant temperature; plot p vs 1/V',
        'Investigate pressure-temperature relationship for a fixed volume of gas',
        'Demonstrate Brownian motion using smoke cell and microscope',
        'Investigate Archimedes\' principle — measure upthrust; compare with weight of displaced fluid',
      ],
      boundaryNotes: [
        'Gas law calculations MUST use Kelvin — convert °C → K by adding 273.',
        'Extension (Paper 2 P-reference): numerical gas law problems; detailed kinetic theory explanations for gas behaviour; quantitative Archimedes calculations.',
      ],
    },

    topic6: {
      code: '4PH1-T6',
      title: 'Magnetism and Electromagnetism',
      tier: 'both',
      allowedTopics: [
        // (a) PERMANENT MAGNETS
        'Magnetic properties — permanent magnets: always magnetic; induced magnets: temporary, become magnetic in magnetic field, lose magnetism when field removed; ferromagnetic materials: iron, steel, cobalt, nickel; magnetic poles: north and south; like poles repel, unlike poles attract; force is non-contact',
        'Magnetic fields — region where magnetic materials experience force; direction: from North to South pole outside magnet; field lines show direction and strength (closer lines = stronger field); uniform field between poles of two opposing magnets',
        'Earth\'s magnetic field — behaves like giant bar magnet with magnetic south pole near geographic North Pole; compass needle aligns with Earth\'s field; magnetic declination varies with location; Aurora Borealis/Australis caused by charged particles from Sun guided by Earth\'s magnetic field',

        // (b) ELECTROMAGNETS
        'Magnetic effect of current — current-carrying wire produces magnetic field; right-hand grip rule: thumb points in direction of conventional current, fingers curl in direction of field; field pattern around straight wire: concentric circles; solenoid: field similar to bar magnet (concentrated inside); field outside solenoid like a bar magnet',
        'Factors affecting solenoid field strength — increasing current; increasing number of turns; adding iron core (becomes magnetised, strengthens field greatly)',
        'Electromagnetic devices — electric bell: uses electromagnet and spring; relay: low current circuit switches high-current circuit using electromagnet; MRI scanner; electromagnet in scrapyard; loudspeaker (current in coil in magnetic field → force → cone vibrates → sound)',

        // (c) FORCES ON CURRENT-CARRYING CONDUCTORS
        'Force on current in magnetic field — F = BIl; Fleming\'s left-hand rule: first finger = field (B), second finger = current (I), thumb = force/motion; motor effect: force is perpendicular to both current and field; magnitude increases with: larger current, stronger magnetic field, longer conductor in field',
        'Electric motor (DC) — rectangular coil in magnetic field; current in two sides of coil in opposite directions → forces in opposite directions → couple → rotation; split-ring commutator: reverses current in coil every half-turn → maintains rotation in same direction; brushes maintain contact; uses: pumps, fans, drills, washing machines',

        // (d) ELECTROMAGNETIC INDUCTION
        'Faraday\'s law — when magnetic flux through a conductor changes, EMF is induced; magnitude proportional to rate of change of flux; EMF = rate of change of flux linkage',
        'Lenz\'s law — induced current opposes change causing it (energy conservation); direction of induced current determined by Lenz\'s law or Fleming\'s right-hand rule',
        'AC generator — coil rotating in magnetic field; as coil rotates: flux changes → EMF induced; maximum EMF when coil parallel to field (fastest rate of flux change); zero EMF when coil perpendicular to field; AC output (alternating); slip rings (not split rings) → AC output',
        'Transformer — iron core; alternating current in primary coil → alternating magnetic field → changing flux in iron core → changing flux in secondary coil → induced EMF; works with AC only (DC produces no changing flux); Vp/Vs = Np/Ns; power conservation (ideal): Pp = Ps, VpIp = VsIs',
      ],
      forbiddenTopics: [
        'B-H curves and hysteresis loops — beyond 4PH1 IGCSE',
        'Self-induction — beyond 4PH1 IGCSE',
        'Maxwell\'s equations — beyond 4PH1 IGCSE',
        'Hall effect measurements — beyond 4PH1 IGCSE',
      ],
      requiredKeywords: [
        'permanent magnet', 'induced magnet', 'ferromagnetic', 'poles', 'field lines',
        'solenoid', 'electromagnet', 'right-hand grip rule', 'current',
        'F = BIl', 'Fleming\'s left-hand rule', 'motor effect', 'electric motor', 'commutator',
        'electromagnetic induction', 'EMF', 'rate of change of flux',
        'Lenz\'s law', 'AC generator', 'slip rings',
        'transformer', 'Vp/Vs = Np/Ns', 'step-up', 'step-down', 'National Grid',
      ],
      practicalSkills: [
        'Investigate the factors affecting the strength of an electromagnet — number of turns, current, iron core',
        'Investigate electromagnetic induction — use bar magnet in coil; vary speed, number of turns, magnet strength',
        'Build a simple DC motor and investigate factors affecting its speed',
        'Investigate the transformer equation — measure primary and secondary voltages',
      ],
      boundaryNotes: [
        'Extension (Paper 2 P-reference): quantitative F = BIl calculations; transformer efficiency calculations; generator output graphs; explanation of national grid power loss.',
        'Motor uses split-ring commutator (reverses current); generator uses slip rings (maintains AC output) — students frequently confuse these.',
      ],
    },

    topic7: {
      code: '4PH1-T7',
      title: 'Radioactivity and Particles',
      tier: 'both',
      allowedTopics: [
        // (a) ATOMIC STRUCTURE
        'Nuclear model — atom: mostly empty space; nucleus: very small, dense, contains protons (+) and neutrons (0); electrons: orbit nucleus in shells, negligible mass, negative charge; size: nucleus ≈ 10⁻¹⁵ m; atom ≈ 10⁻¹⁰ m; Rutherford gold-foil experiment: most α-particles pass through, some deflected, very few back-scattered → led to nuclear model (replaced Thomson plum pudding model)',
        'Proton number and mass number — proton number Z = number of protons = number of electrons; mass number A = protons + neutrons; neutron number N = A − Z; notation: ᴬ_Z X',
        'Isotopes — same proton number, different mass numbers; same number of electrons → same chemical properties; different numbers of neutrons → different physical properties; different nuclear stability → some are radioactive',
        'Nuclear radius — proportional to A^(1/3); nucleus density is extremely high and constant for all nuclei',

        // (b) RADIOACTIVITY
        'Radioactive decay — spontaneous, random process (cannot be predicted when any individual nucleus will decay); types: alpha (α), beta-minus (β⁻), gamma (γ), beta-plus (β⁺)',
        'Alpha decay (α) — nucleus emits helium-4 nucleus ⁴₂He; A decreases by 4, Z decreases by 2; highly ionising (can knock electrons off atoms in its path); very short range in air (few centimetres); stopped by paper or few cm of air; deflected by electric/magnetic fields (toward negative plate → positively charged)',
        'Beta-minus decay (β⁻) — neutron → proton + electron (β⁻ particle) + antineutrino; A unchanged, Z increases by 1; moderately ionising; range: several metres in air; stopped by few mm of aluminium; deflected toward positive plate (negatively charged)',
        'Beta-plus decay (β⁺) — proton → neutron + positron (β⁺ particle) + neutrino; A unchanged, Z decreases by 1; positron annihilates with electron → two gamma photons (used in PET scanning)',
        'Gamma radiation (γ) — electromagnetic radiation (not particles); high energy, short wavelength; no change in A or Z; least ionising; stopped by thick lead or several cm concrete; no deflection in electric/magnetic fields (no charge); penetrates human body → used in medical applications',
        'Nuclear equations — conservation of mass number (A) and proton number (Z); balancing nuclear equations for α and β decay; writing nuclear equations',
        'Background radiation — radiation from natural and artificial sources; always present; natural: cosmic rays, radioactive rocks (radon gas from granite), carbon-14 in living organisms, food; artificial: nuclear power stations, medical X-rays, nuclear weapon tests; must subtract background from measured count rate',
        'Contamination vs irradiation — contamination: radioactive material deposited on or inside body; irradiation: body exposed to source that stays outside; contamination more dangerous (continuous internal exposure); alpha most dangerous if inhaled or ingested (highly ionising inside body)',

        // (c) DECAY AND HALF-LIFE
        'Activity and half-life — activity (A) = number of decays per second; unit: becquerel (Bq); 1 Bq = 1 decay per second; half-life (t½) = time for activity (or number of undecayed nuclei) to halve; constant half-life: characteristic of each isotope; decay is random → not all nuclei decay at once; count rate decreases by half each half-life',
        'Decay graphs — activity vs time: exponential decay; N vs t: exponential decay; reading half-life from graph: time for N or A to halve; after n half-lives: N = N₀ × (1/2)ⁿ',
        'Uses of radioactivity — medical: gamma emitters with short half-life as tracers (e.g. technetium-99m — traces blood flow); radiotherapy (cobalt-60 gamma rays to kill cancer cells — target tumour from multiple angles to minimise normal tissue damage); PET scanning (β⁺ decay → positron annihilation → gamma photons detected); industrial: thickness gauging (β particles: if material thicker → count rate drops → adjust rollers); smoke detectors (Am-241 — α emitter: ionises air in detector → current flows → smoke absorbs α → current drops → alarm sounds); sterilising medical equipment and food (gamma); dating: radiocarbon dating (C-14, t½ = 5730 years — measures proportion of C-14 remaining in organic material; valid up to ~50,000 years); geological dating (uranium-238, t½ = 4.5×10⁹ years)',
        'Safety precautions — minimise exposure: distance (inverse square law for gamma), time, shielding (paper for α, aluminium for β, lead for γ); gloves to prevent contamination; monitor with Geiger-Müller (GM) tube + counter or film badges; do not eat or drink near sources; no pointing at people; store in lead-lined containers; ALARA principle (As Low As Reasonably Achievable)',

        // (d) NUCLEAR FISSION AND FUSION
        'Nuclear fission — splitting of heavy nucleus into two smaller nuclei + 2-3 neutrons + energy; induced by neutron absorption; chain reaction: neutrons from fission trigger further fissions; subcritical (< critical mass — chain dies); critical (self-sustaining); supercritical (runaway → explosion in bomb); energy released from mass deficit (E = mc²)',
        'Nuclear reactor — controlled chain reaction; components: fuel rods (enriched U-235); moderator (water or graphite — slows neutrons to thermal/slow speeds → more likely to induce fission); control rods (boron or cadmium — absorb neutrons → control reaction rate; lowered in → reaction rate decreases); coolant (water → heat exchanger → steam → turbine → generator); shielding (thick concrete); fuel used more efficiently than coal; no CO₂ emissions; radioactive waste problem; risk of accidents',
        'Nuclear fusion — combining light nuclei (e.g. H isotopes: deuterium + tritium → He + neutron + energy); releases more energy per nucleon than fission; requires extreme temperature (~10⁸ K) and pressure (or high temperature alone in magnetic confinement) to overcome electrostatic repulsion of nuclei; plasma confinement: magnetic (tokamak — JET, ITER) or inertial; advantages: abundant fuel (deuterium from water, tritium from lithium), no long-lived radioactive waste; challenges: sustaining high temperature and pressure, achieving net energy gain (more energy out than in)',
        'Mass-energy equivalence — E = mc² (Einstein); mass and energy are equivalent; fission/fusion release energy because products have slightly less mass than reactants (mass deficit) → converted to energy; binding energy per nucleon graph: iron-56 is most stable; nuclei lighter than Fe release energy by fusion; nuclei heavier than Fe release energy by fission',
      ],
      forbiddenTopics: [
        'Quark model, leptons, hadrons, baryons — beyond 4PH1 IGCSE',
        'Standard model of particle physics — beyond 4PH1 IGCSE',
        'Detailed quantum mechanics — beyond 4PH1 IGCSE',
        'Pair production in detail — beyond 4PH1 IGCSE',
      ],
      requiredKeywords: [
        'proton number', 'mass number', 'nucleon', 'isotope', 'nuclear model',
        'Rutherford', 'gold-foil experiment',
        'alpha', 'beta', 'gamma', 'radioactive decay', 'ionising',
        'background radiation', 'contamination', 'irradiation',
        'activity', 'becquerel', 'half-life', 'exponential decay',
        'nuclear equations', 'conservation of A and Z',
        'uses of radioactivity', 'tracers', 'smoke detector', 'carbon dating',
        'nuclear fission', 'chain reaction', 'moderator', 'control rods', 'coolant',
        'nuclear fusion', 'tokamak', 'deuterium', 'tritium',
        'E = mc²', 'mass deficit', 'binding energy per nucleon',
      ],
      practicalSkills: [
        'Measure background radiation using a GM tube — record count rate over several minutes',
        'Investigate the absorption of α, β, γ radiation using different materials',
        'Plot and interpret radioactive decay graphs — determine half-life from graph',
        'Investigate the inverse square law for γ radiation — measure count rate at different distances',
      ],
      boundaryNotes: [
        'Extension (Paper 2 P-reference): detailed mass-energy calculations; binding energy per nucleon calculations; detailed reactor component explanations; PET scan mechanism.',
        'Chain reaction diagram: must show neutrons released → causing further fissions → more neutrons etc.',
        'Half-life: after each half-life the number of undecayed nuclei AND the activity BOTH halve.',
      ],
    },

    topic8: {
      code: '4PH1-T8',
      title: 'Astrophysics and Space',
      tier: 'both',
      allowedTopics: [
        // (a) THE SOLAR SYSTEM
        'Structure of solar system — Sun (star, our local star); eight planets (Mercury, Venus, Earth, Mars — rocky inner; Jupiter, Saturn, Uranus, Neptune — gas giants outer); moons (natural satellites of planets; Moon orbits Earth); asteroids (rocky bodies, mostly in asteroid belt between Mars and Jupiter); comets (icy bodies in elliptical orbits; tail formed when near Sun); dwarf planets (Pluto)',
        'Orbits — planets orbit Sun in slightly elliptical orbits; moons orbit planets; gravity provides centripetal force for orbits; orbital period increases with orbital radius (Kepler\'s third law: T² ∝ r³ — qualitative understanding); geostationary orbit: T = 24 hours; equatorial orbit; same angular velocity as Earth → appears stationary; used for telecommunications, weather satellites; polar orbit: passes over poles; scans entire Earth as it rotates below',

        // (b) STARS AND STELLAR EVOLUTION
        'Life cycle of stars — nebula (cloud of dust and gas → gravitational attraction → contracts → heats up); protostar (heating from gravitational PE → kinetic energy; not yet fusing); main sequence star (nuclear fusion: H → He; radiation pressure balances gravity; most of star\'s life here; Sun is middle-aged main sequence star); end of main sequence depends on mass',
        'Stellar evolution — low/medium mass stars (like Sun): main sequence → red giant (expands, H shell around He core burns; He fusing) → planetary nebula (outer layers ejected) → white dwarf (core remaining; no fusion; cools slowly → black dwarf eventually); massive stars: main sequence → red supergiant → supernova (explosion; elements heavier than Fe formed and scattered) → neutron star (very dense, pulsars) or black hole (if mass > 3 solar masses; gravity so strong light cannot escape)',
        'Fusion in stars — on main sequence: H + H → He (proton-proton chain); releases energy; responsible for star\'s energy; in red giant/supergiant: He fusing → heavier elements (C, O...); in supernova: elements up to uranium formed; all elements heavier than H originally produced in stars',

        // (c) UNIVERSE
        'Scale of universe — astronomical unit (AU): average Earth-Sun distance = 1.5×10¹¹ m; light-year: distance light travels in one year ≈ 9.5×10¹⁵ m; parsec (pc): 1 pc ≈ 3.09×10¹⁶ m (parallax second); orders of magnitude: Earth ≈ 10⁷ m; Solar system ≈ 10¹³ m; Milky Way ≈ 10²¹ m; observable universe ≈ 10²⁶ m',
        'Galaxies — large collections of stars (10⁹–10¹² stars), gas and dust; Milky Way: our galaxy (barred spiral); Sun located in one of the spiral arms; diameter ≈ 100,000 light-years; Local Group: cluster of galaxies including Milky Way and Andromeda; universe contains ≈ 10¹¹ galaxies',
        'Red shift — light from distant galaxies is shifted toward longer wavelengths (red end of spectrum); more distant galaxies show greater red shift → faster recession velocity; Hubble\'s law: v = H₀d (v = recession velocity, H₀ = Hubble constant ≈ 70 km/s/Mpc, d = distance); evidence that universe is expanding',
        'Big Bang theory — universe began from single, extremely hot, dense point ≈ 13.8 billion years ago; expanded and cooled; evidence: redshift of galaxies (Hubble), cosmic microwave background radiation (CMB — radiation from early universe, now cooled to 2.7K; fills universe uniformly), abundance of hydrogen and helium (about 75% H, 25% He by mass — as predicted by Big Bang nucleosynthesis)',
        'Age and fate of universe — t ≈ 1/H₀ ≈ 14 billion years (rough estimate); fate depends on average density: if density > critical density: expansion slows and reverses → Big Crunch; if density < critical density: expansion continues forever; dark energy may be causing accelerating expansion',
        'Olbers\' paradox — if universe were infinite, eternal and static, every line of sight would end on a star → night sky would be uniformly bright; it is not → universe is finite in age or expanding (light from most distant galaxies has not had time to reach us; light from receding galaxies redshifted to non-visible wavelengths)',
      ],
      forbiddenTopics: [
        'Detailed nuclear reactions in stars (pp chain equations) — beyond 4PH1 IGCSE',
        'Hertzsprung-Russell diagram — beyond 4PH1 IGCSE',
        'General relativity and spacetime curvature — beyond 4PH1 IGCSE',
        'Dark matter detailed composition — beyond 4PH1 IGCSE',
        'Detailed formation mechanism of black holes — beyond 4PH1 IGCSE',
      ],
      requiredKeywords: [
        'solar system', 'planet', 'moon', 'asteroid', 'comet', 'star',
        'orbit', 'gravity', 'centripetal force', 'geostationary',
        'nebula', 'protostar', 'main sequence', 'red giant', 'white dwarf',
        'red supergiant', 'supernova', 'neutron star', 'black hole',
        'nuclear fusion', 'H → He', 'radiation pressure',
        'light-year', 'galaxy', 'Milky Way', 'observable universe',
        'red shift', 'Hubble\'s law', 'v = H₀d', 'expanding universe',
        'Big Bang', 'CMB', 'cosmic microwave background',
        'Olbers\' paradox',
      ],
      practicalSkills: [
        'Analyse spectra to determine red shift and recession velocity',
        'Use Hubble\'s law to estimate distances to galaxies',
        'Interpret Hertzsprung-Russell diagrams (qualitative) — NOT required for exam',
        'Estimate age of universe from Hubble constant',
      ],
      boundaryNotes: [
        'Extension (Paper 2 P-reference): numerical red shift calculations; Hubble constant calculations; detailed stellar evolution mass dependency; formation and properties of neutron stars and black holes; age of universe calculation from H₀.',
        'The Big Bang theory is the currently accepted scientific explanation — students should be able to describe the evidence (CMB, redshift, H/He abundance) and explain why the evidence supports the theory.',
      ],
    },
  },

  // -----------------------------------------------------------
  // EDEXCEL IGCSE MATHEMATICS A (4MA1)
  // Foundation tier: Grades 1–5; Higher tier: Grades 4–9
  // Paper 1F/2F (Foundation); Paper 1H/2H (Higher): each 2 hours, 100 marks
  // Source: Pearson 4MA1 Specification Issue 2, November 2017 (first examined 2019)
  // Content areas: Number; Algebra; Shape, Space and Measures; Data Handling; Probability
  // -----------------------------------------------------------
  maths: {

    number: {
      code: '4MA1-NUM',
      title: 'Number',
      tier: 'both_tiers',
      allowedTopics: [
        // INTEGERS AND FRACTIONS
        'Integers — positive, negative, zero; ordering integers on number line; four operations (+, −, ×, ÷) with integers including negative numbers; rules for multiplying/dividing negatives (negative × negative = positive)',
        'Place value and ordering — understanding place value to billions and hundredths; comparing and ordering decimals; use of inequality signs (< ≤ > ≥)',
        'Fractions — equivalent fractions; simplifying; mixed numbers and improper fractions; adding, subtracting, multiplying, dividing fractions; fractions of quantities; comparing fractions',
        'Decimals — converting between fractions and decimals; recurring decimals; multiplying and dividing by powers of 10; four operations with decimals',
        'Percentages — percentage of a quantity; percentage increase and decrease; expressing as percentage; reverse percentage (finding original value given percentage change); percentage profit/loss; simple and compound interest; repeated percentage change',

        // POWERS AND ROOTS
        'Indices (powers) — understanding aⁿ; squares and cubes; square roots and cube roots; index laws: aᵐ × aⁿ = aᵐ⁺ⁿ; aᵐ ÷ aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ; a⁰ = 1; a⁻ⁿ = 1/aⁿ; a^(1/n) = ⁿ√a; a^(m/n) = (ⁿ√a)ᵐ; fractional and negative indices',
        'Standard form — a × 10ⁿ where 1 ≤ a < 10 and n is an integer; converting to and from standard form; calculations in standard form (multiplying, dividing, adding — may need to adjust exponent)',
        'Surds (Higher only) — √a as irrational number; simplifying surds √(ab) = √a × √b; collecting like surds; rationalising monomial denominators (multiply by √a/√a); rationalising binomial denominators (multiply by conjugate)',

        // NUMBER SKILLS
        'Factors, multiples, primes — HCF (highest common factor); LCM (lowest common multiple); prime factorisation (express as product of primes); Venn diagrams for HCF and LCM',
        'Estimation and approximation — rounding to significant figures and decimal places; estimation by rounding; limits of accuracy (upper and lower bounds); error intervals; truncation vs rounding',
        'Ratio and proportion — simplify ratios; divide in a given ratio; direct proportion (y ∝ x, y = kx); inverse proportion (y ∝ 1/x, y = k/x); best value (unit price)',
        'Sets — set notation {}, ∈, ∉, ∪, ∩, ⊂, ⊆, ∅, universal set ξ; Venn diagrams (two and three sets); complement A\'; number of elements in each region; shading regions; solving problems using Venn diagrams',
        'Financial mathematics — income tax; VAT; profit and loss; simple interest I = PRT/100; compound interest A = P(1 + r/100)ⁿ; depreciation; currency conversions; exchange rates; wages, salaries, commission',
        'Calculator skills — using calculator for complex calculations; interpreting calculator display; order of operations (BODMAS/BIDMAS)',
      ],
      forbiddenTopics: [
        'Matrices — Further Maths only',
        'Complex numbers — not in 4MA1',
        'Limits and calculus concepts within Number section — Topic: Calculus',
        'Permutations and combinations formulas — Probability/Algebra',
      ],
      requiredKeywords: [
        'place value', 'integer', 'factor', 'multiple', 'prime', 'HCF', 'LCM',
        'fraction', 'decimal', 'percentage', 'ratio', 'proportion',
        'index', 'power', 'root', 'standard form', 'surd', 'rationalise',
        'direct proportion', 'inverse proportion', 'compound interest',
        'upper bound', 'lower bound', 'limits of accuracy',
        'Venn diagram', 'set', 'union', 'intersection', 'complement',
      ],
      practicalSkills: [
        'Use a scientific calculator accurately for all four operations, powers, roots, trigonometric functions',
        'Show all working clearly — full marks may require working even with calculator',
        'Check answers by estimation',
      ],
      boundaryNotes: [
        'Foundation: integers, basic fractions, percentages, standard form (unit 1F topics). Surds, negative and fractional indices more fully developed on Higher paper (1H/2H).',
        'Compound interest formula A = P(1 + r/100)ⁿ: n = number of years; r = annual interest rate as percentage; required for both tiers.',
        'Limits of accuracy: if a value is given to the nearest unit, lower bound = value − 0.5; upper bound = value + 0.5.',
      ],
    },

    algebra: {
      code: '4MA1-ALG',
      title: 'Algebra',
      tier: 'both_tiers',
      allowedTopics: [
        // EXPRESSIONS AND MANIPULATION
        'Algebraic expressions — using letters for unknowns; writing expressions from word problems; collecting like terms; expanding brackets: a(b + c) = ab + ac; expanding double brackets (x+a)(x+b) = x² + (a+b)x + ab; expanding triple brackets (Higher); factorising: common factor (take out HCF); factorising quadratics: x² + bx + c = (x+p)(x+q); factorising difference of two squares: a²−b² = (a+b)(a−b); completing the square ax² + bx + c → a(x+h)² + k',
        'Formulae — substituting into formulae; changing the subject of a formula (isolating variable); deriving formulae from word problems',
        'Indices in algebra — applying index laws to algebraic expressions: xᵃ × xᵇ = xᵃ⁺ᵇ etc.; simplifying expressions with algebraic indices',

        // EQUATIONS
        'Linear equations — solving one and two-step equations; equations with brackets; equations with unknowns on both sides; equations involving fractions',
        'Simultaneous equations — solving by elimination and substitution; linear × linear (two methods); linear and quadratic (substitution → quadratic → solve); interpreting as intersection of graphs',
        'Quadratic equations — solving by factorisation; solving by completing the square; quadratic formula x = (−b ± √(b²−4ac)) / 2a; discriminant b²−4ac (>0: two distinct real roots; =0: one repeated root; <0: no real roots)',
        'Inequalities — linear inequalities in one variable: solve and represent on number line; combined inequalities (−3 < 2x + 1 ≤ 5); listing integer solutions; linear inequalities in two variables: region on graph; shading; quadratic inequalities (Higher)',

        // SEQUENCES
        'Sequences — term-to-term rules; nth term formula (for linear: aₙ = a + (n−1)d, written as Un = dn + (a−d); for quadratic: nth term formula involves n²); arithmetic sequences (common difference d); geometric sequences (common ratio r); recognising types; finding missing terms; proving whether a number is in a sequence',

        // FUNCTIONS AND GRAPHS
        'Graphs of functions — straight line: y = mx + c (gradient m, y-intercept c); parallel lines (same gradient); perpendicular lines (m₁ × m₂ = −1); equation of a line through two points; midpoint formula; distance formula',
        'Graphs in practical situations — distance-time graphs (gradient = speed); velocity-time graphs; direct proportion (straight line through origin); inverse proportion (y = k/x — hyperbola); interpreting gradients and intercepts in context',
        'Quadratic and other graphs — y = ax² + bx + c (parabola, vertex, axis of symmetry); y = ax³ + bx² + cx + d (cubic — shape, roots, y-intercept); y = aˣ (exponential growth); y = 1/x (hyperbola); y = k/x² (inverse square); identifying and matching graphs to equations; plotting by constructing table of values',
        'Graph transformations (Higher) — y = f(x+a) shifts left a; y = f(x) + a shifts up a; y = af(x) stretches vertically by factor a; y = f(ax) stretches horizontally by factor 1/a; y = −f(x) reflects in x-axis; y = f(−x) reflects in y-axis; applying transformations to given graph',
        'Sketching graphs — identifying key features: roots (y=0), y-intercept, turning points; qualitative behaviour; rough sketches',

        // FURTHER ALGEBRA (Higher)
        'Algebraic fractions (Higher) — simplifying; adding and subtracting with different denominators; multiplying; dividing; solving equations with algebraic fractions',
        'Functions (Higher) — function notation f(x); composite functions fg(x); inverse functions f⁻¹(x)',
        'Iteration (Higher) — using iterative formula xₙ₊₁ = g(xₙ) to find approximate solution; showing convergence',

        // CALCULUS (Higher only — Edexcel IGCSE includes basic calculus)
        'Differentiation (Higher) — finding gradient function dy/dx; differentiation of xⁿ: d/dx(xⁿ) = nxⁿ⁻¹; differentiating sums/differences; finding gradient at a point; equations of tangent and normal; stationary points (dy/dx = 0); classify using second derivative d²y/dx² or sign change; maximum and minimum values; increasing/decreasing functions',
        'Integration (Higher) — integration as reverse of differentiation; ∫xⁿ dx = xⁿ⁺¹/(n+1) + c (n ≠ −1); indefinite integration with constant of integration; definite integrals ∫ₐᵇ f(x) dx; area under curve; area between curve and x-axis (care with negative areas)',

        // PROPORTIONALITY
        'Direct and inverse proportion in algebraic form — y ∝ x: y = kx; y ∝ x²: y = kx²; y ∝ √x: y = k√x; y ∝ 1/x: y = k/x; y ∝ 1/x²: y = k/x²; finding k from given values; calculating y for given x or vice versa',
        'Linear programming (Higher) — formulating constraints as inequalities; drawing and shading feasible region; finding optimal value at vertices',
      ],
      forbiddenTopics: [
        'Chain rule, product rule, quotient rule — A Level only',
        'Differentiation of trigonometric, exponential, logarithmic functions — A Level only',
        'Integration of trigonometric functions — A Level only',
        'Matrices and matrix algebra — Further Maths',
        'Complex numbers — not in 4MA1',
        'Differential equations — A Level only',
      ],
      requiredKeywords: [
        'like terms', 'expand', 'factorise', 'quadratic', 'completing the square',
        'discriminant', 'simultaneous equations', 'elimination', 'substitution',
        'inequality', 'gradient', 'y-intercept', 'midpoint',
        'arithmetic sequence', 'geometric sequence', 'nth term',
        'function notation', 'composite function', 'inverse function',
        'differentiation', 'dy/dx', 'stationary point', 'integration',
        'direct proportion', 'inverse proportion', 'y = kx',
      ],
      practicalSkills: [
        'Construct and interpret real-life graphs (distance-time, velocity-time)',
        'Formulate and solve problems algebraically (write equations from worded problems)',
        'Verify solutions by substitution',
        'Use trial and improvement to find approximate solutions',
      ],
      boundaryNotes: [
        'Basic calculus (differentiation and integration) IS in Edexcel IGCSE 4MA1 Higher tier — this distinguishes it from GCSE.',
        'Linear programming is Higher tier only.',
        'Quadratic formula: students must know it — it is NOT given on the formula sheet.',
        'Graph transformations are Higher tier only in 4MA1.',
      ],
    },

    geometry: {
      code: '4MA1-GEO',
      title: 'Shape, Space and Measures',
      tier: 'both_tiers',
      allowedTopics: [
        // ANGLES
        'Angle properties — angles on a straight line (sum = 180°); angles around a point (360°); vertically opposite angles (equal); angles in a triangle (sum = 180°); angles in a quadrilateral (sum = 360°); bearing (measured clockwise from North, written as 3 figures)',
        'Parallel lines — corresponding angles (F-shape, equal); alternate angles (Z-shape, equal); co-interior (same-side interior) angles (C-shape, supplementary — add to 180°)',
        'Polygons — interior angle sum of n-sided polygon = (n−2) × 180°; exterior angles (sum always 360°); regular polygon: all sides equal, all angles equal; interior angle + exterior angle = 180°',

        // 2D SHAPES
        'Properties of 2D shapes — triangles (equilateral, isosceles, scalene, right-angled); quadrilaterals (square, rectangle, parallelogram, rhombus, trapezium, kite); circle (radius, diameter, chord, arc, sector, segment, tangent); polygons (pentagon, hexagon, heptagon, octagon)',
        'Perimeter and area — perimeter of any shape; area of: rectangle = l × w; triangle = ½bh; parallelogram = bh; trapezium = ½(a+b)h; circle: circumference = 2πr = πd; area = πr²; arc length = (θ/360°) × 2πr; sector area = (θ/360°) × πr²; compound shapes (decompose into simpler shapes)',
        'Circle theorems (Higher) — angle at centre = 2 × angle at circumference (same arc); angles in same segment are equal; angle in semicircle = 90°; opposite angles in cyclic quadrilateral are supplementary (add to 180°); tangent perpendicular to radius at point of contact; alternate segment theorem (angle between tangent and chord = inscribed angle in alternate segment)',

        // 3D SHAPES
        'Volume and surface area — cuboid: V = l × w × h; SA = 2(lw + lh + wh); prism: V = cross-sectional area × length; cylinder: V = πr²h; SA = 2πr² + 2πrh; pyramid: V = ⅓ × base area × height; cone: V = ⅓πr²h; SA = πrl + πr² (l = slant height); sphere: V = 4/3 πr³; SA = 4πr²',
        'Density — ρ = m/V (connection with physics)',

        // TRANSFORMATIONS
        'Transformations — translation (using vector notation); reflection (identify or apply line of reflection — horizontal, vertical, diagonal y=x, y=−x, etc.); rotation (centre, angle, direction — clockwise/anticlockwise); enlargement (centre of enlargement, scale factor; positive k: same side; negative k: opposite side through centre; fractional k: reduction); combination of transformations; describing transformations fully (type, all parameters)',
        'Vectors (Higher) — column vectors; adding, subtracting, scalar multiplication; magnitude |v| = √(x² + y²); midpoint using vectors; proving geometric properties using vectors',

        // SIMILARITY AND CONGRUENCE
        'Congruence — triangles: SSS, SAS, ASA, AAS, RHS criteria; proving triangles congruent; corresponding parts',
        'Similarity — triangles: AA criterion; corresponding sides in proportion; scale factor; ratio of areas = (scale factor)²; ratio of volumes = (scale factor)³; using similarity to find unknown lengths',

        // TRIGONOMETRY
        'Pythagoras\' theorem — a² + b² = c² (right-angled triangles only); finding hypotenuse or a shorter side; 2D and 3D problems',
        'Trigonometry in right-angled triangles — SOH-CAH-TOA: sin θ = O/H; cos θ = A/H; tan θ = O/A; finding angles; finding sides; exact values: sin/cos/tan 30°, 45°, 60°',
        'Trigonometry in non-right-angled triangles (Higher) — sine rule: a/sinA = b/sinB = c/sinC; use when given: two angles and one side, or two sides and opposite angle (ambiguous case); cosine rule: a² = b² + c² − 2bc cosA; use when given: three sides, or two sides and included angle; area of triangle = ½ab sinC; solving problems in 2D and 3D',
        'Angles of elevation and depression — angle above/below horizontal line; solving problems with right-angled and non-right-angled triangles',

        // CONSTRUCTIONS AND LOCI
        'Constructions — perpendicular bisector of a line segment; angle bisector; perpendicular from external point to line; equilateral triangle; loci: set of all points satisfying a condition; equidistant from two points (perpendicular bisector); equidistant from two lines (angle bisector); fixed distance from a point (circle); fixed distance from a line (parallel lines); regions satisfying multiple conditions (intersection of loci)',

        // COORDINATE GEOMETRY
        'Coordinate geometry — midpoint; distance formula; gradient; equation of straight line; parallel and perpendicular lines (already in Algebra — cross-reference)',

        // MENSURATION FURTHER
        'Arc and sector — arc length = (θ/360°) × 2πr; sector area = (θ/360°) × πr² (both in degrees and radians at Higher)',
        'Segment area (Higher) — area of segment = area of sector − area of triangle',
      ],
      forbiddenTopics: [
        'Conic sections beyond circle — beyond 4MA1 IGCSE',
        'Vectors in 3D — not in 4MA1 IGCSE (only 2D vectors)',
        'Calculus applied to geometry (finding area under curve using integration is in Algebra section)',
        'Non-Euclidean geometry — beyond 4MA1 IGCSE',
      ],
      requiredKeywords: [
        'perimeter', 'area', 'volume', 'surface area', 'circumference',
        'triangle', 'quadrilateral', 'polygon', 'circle', 'arc', 'sector',
        'angle sum', 'parallel lines', 'corresponding', 'alternate', 'co-interior',
        'circle theorem', 'tangent', 'cyclic quadrilateral',
        'congruent', 'similar', 'scale factor', 'ratio of areas', 'ratio of volumes',
        'Pythagoras', 'SOH-CAH-TOA', 'sine rule', 'cosine rule', 'area = ½ab sinC',
        'translation', 'reflection', 'rotation', 'enlargement', 'transformation',
        'vector', 'column vector', 'magnitude',
        'locus', 'perpendicular bisector', 'angle bisector',
      ],
      practicalSkills: [
        'Use ruler and compass for geometric constructions — perpendicular bisector, angle bisector',
        'Plot and interpret graphs of geometric transformations on a coordinate grid',
        'Draw accurate 2D representations of 3D shapes (nets, plans, elevations)',
        'Use trigonometry to solve real-world problems (heights, distances, bearings)',
      ],
      boundaryNotes: [
        'Circle theorems are Higher only in 4MA1.',
        'Sine rule, cosine rule and area formula ½ab sinC are Higher only.',
        'Vectors are Higher only.',
        'Students should know and use π = 3.14159... (calculator), not approximations unless instructed.',
        'For 3D problems: identify the relevant right-angled triangle, use Pythagoras/trigonometry carefully.',
      ],
    },

    statistics: {
      code: '4MA1-STA',
      title: 'Statistics and Probability',
      tier: 'both_tiers',
      allowedTopics: [
        // DATA COLLECTION AND REPRESENTATION
        'Types of data — quantitative (numerical: discrete or continuous) vs qualitative (categorical); primary (collected by you) vs secondary (from existing sources)',
        'Data collection — questionnaire design: clear, unambiguous, closed questions (tick boxes); avoid leading questions; pilot survey; sampling methods: random, stratified, systematic; sample size considerations',
        'Frequency tables — tallying; frequency; relative frequency = frequency/total; class intervals for continuous data',
        'Bar charts — for discrete or categorical data; frequency or relative frequency on y-axis; bars do not touch; dual bar charts; compound bar charts',
        'Histograms — for continuous grouped data; frequency density on y-axis (not frequency): FD = frequency/class width; area of bar ∝ frequency; interpreting histograms; drawing histograms for equal and unequal class widths',
        'Pie charts — angle = (frequency/total) × 360°; drawing and interpreting; sector angles',
        'Frequency polygons — connect midpoints of class intervals; compare distributions',
        'Scatter diagrams — plotting bivariate data; identifying and drawing line of best fit (through mean point); positive/negative/no correlation; using line of best fit for interpolation (within data range — reliable) and extrapolation (outside — less reliable); strong/moderate/weak correlation; correlation does NOT imply causation',
        'Cumulative frequency — running total of frequencies; cumulative frequency curve (ogive); reading off median (50th percentile), lower quartile Q1 (25th), upper quartile Q3 (75th); interquartile range IQR = Q3 − Q1',
        'Box plots (box-and-whisker) — minimum, Q1, median, Q3, maximum; IQR shows spread; comparing distributions using box plots; outliers (beyond Q1 − 1.5 × IQR or Q3 + 1.5 × IQR)',
        'Stem-and-leaf diagrams — back-to-back for comparison; reading off individual values; finding median; comparing two data sets',
        'Time series — plotting over time; identifying trends; moving averages (simple 3-point, 4-point) to smooth data; seasonal variation; extrapolating trend',

        // AVERAGES AND MEASURES OF SPREAD
        'Mean — x̄ = Σx/n (ungrouped); x̄ = Σfx/Σf (grouped — use midpoints); mean of combined data; effect of adding a constant or multiplying on mean',
        'Median — middle value (odd n); average of two middle values (even n); median from cumulative frequency',
        'Mode and modal class — most frequent value; modal class for grouped data',
        'Range — maximum − minimum; affected by outliers',
        'Standard deviation (Higher) — σ = √(Σ(x−x̄)²/n) = √(Σx²/n − (x̄)²); measures spread about mean; larger σ = more spread; use of calculator; interpreting standard deviation to compare datasets',
        'Comparing distributions — compare averages (mean, median, mode) AND spread (range, IQR, standard deviation); always comment on both average and spread when comparing',

        // PROBABILITY
        'Basic probability — P(event) = number of favourable outcomes/total number of equally likely outcomes; P(event) ∈ [0, 1]; P(certain) = 1; P(impossible) = 0; P(A\') = 1 − P(A)',
        'Listing outcomes — sample space (systematic listing); sample space diagram (grid for two events); two-way tables',
        'Tree diagrams — first and second events; multiply along branches (AND rule); add probabilities at end (OR rule); with and without replacement; P(A and B) = P(A) × P(B|A)',
        'Venn diagrams for probability — P(A ∪ B) = P(A) + P(B) − P(A ∩ B); mutually exclusive events: P(A ∩ B) = 0; independent events: P(A ∩ B) = P(A) × P(B)',
        'Conditional probability (Higher) — P(A|B) = P(A ∩ B) / P(B); using two-way tables and Venn diagrams; without replacement problems',
        'Frequency and relative frequency — estimated probability = relative frequency = f/n; comparing experimental and theoretical probabilities; law of large numbers (experimental probability approaches theoretical as n increases)',
        'Combined events — at least one (use complement: P(at least one) = 1 − P(none)); exactly/at most — use listing or tree diagram',
      ],
      forbiddenTopics: [
        'Hypothesis testing (z-tests, t-tests) — A Level only',
        'Normal distribution calculations — A Level only',
        'Poisson distribution — A Level only',
        'Binomial distribution formula — A Level only',
        'Confidence intervals — A Level only',
        'Chi-squared test — not in 4MA1 IGCSE',
        'Regression equations (least squares) — not in 4MA1 IGCSE',
        'Spearman\'s rank correlation — not in 4MA1 IGCSE',
      ],
      requiredKeywords: [
        'frequency', 'frequency density', 'histogram', 'bar chart', 'pie chart',
        'scatter diagram', 'correlation', 'line of best fit', 'interpolation', 'extrapolation',
        'cumulative frequency', 'median', 'quartile', 'IQR', 'box plot',
        'mean', 'mode', 'range', 'standard deviation',
        'probability', 'sample space', 'tree diagram', 'Venn diagram',
        'mutually exclusive', 'independent events', 'conditional probability',
        'relative frequency', 'without replacement', 'with replacement',
        'moving average', 'time series',
      ],
      practicalSkills: [
        'Design and carry out a statistical investigation — collect data, represent, analyse, interpret',
        'Construct and interpret histograms with unequal class widths',
        'Draw and interpret cumulative frequency curves — find median and IQR',
        'Calculate probabilities from tree diagrams and Venn diagrams',
        'Use scatter diagrams and lines of best fit to make predictions',
      ],
      boundaryNotes: [
        'Standard deviation is Higher tier only in 4MA1.',
        'Conditional probability and Venn diagrams for probability are Higher only.',
        'Histograms: ALWAYS use frequency density on y-axis (not raw frequency) for unequal class widths — this is a very common error.',
        'When comparing distributions, ALWAYS compare BOTH a measure of average AND a measure of spread — one statement is insufficient.',
      ],
    },
  },
};

// ============================================================
// HELPER FUNCTIONS — same pattern as syllabusData_edexcel_ial.ts
// ============================================================

/**
 * Build the system prompt for note generation
 * Keeps the same high-fidelity format as the IAL version
 */
export function buildSystemPrompt(
  subject: string,
  topicKey: string
): string {
  const topic = EDEXCEL_IGCSE_SYLLABUS[subject]?.[topicKey];

  if (!topic) {
    throw new Error(`Critical Error: No syllabus data found for ${subject} > ${topicKey}`);
  }

  const timestamp = new Date().toISOString();
  const seed = Math.floor(10000000 + Math.random() * 90000000).toString();

  const practicalSection = topic.practicalSkills && topic.practicalSkills.length > 0
    ? `\n### REQUIRED PRACTICAL SKILLS (assessed in written papers):\n${topic.practicalSkills.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
    : '';

  const tierNote = topic.tier === 'extension'
    ? '\nNOTE: This content is assessed on Paper 2 ONLY (extension/bold content).'
    : topic.tier === 'core'
      ? '\nNOTE: This content is assessed on Paper 1 ONLY (core content).'
      : '\nNOTE: This content is assessed on both Paper 1 (core) and Paper 2 (extension — bold statements).';

  const isMaths = /math/i.test(subject);
  const overviewRule = isMaths
    ? `### OVERVIEW RULE (MATHS):
- Write the "overview" field as ONE OR TWO short sentences only — a quick description of what the topic is about. No theory paragraphs.
- Move all the depth into the "core_content" array: AT LEAST 8 worked examples covering different question types from this topic. For each: "statement" = the question, "worked_example" = full step-by-step solution (every algebraic step), "wrong_approach" = a common student mistake.
- Include AT LEAST 4 entries in "equations" with full variable definitions and a numerical "worked_substitution".`
    : `### OVERVIEW RULE (SCIENCE) — ZNotes/Save My Exams/PMT style:
- Structure the overview as 3–5 sub-topics. For EACH sub-topic: write **Sub-Topic Name** on its own line as a bold heading, then 3–5 bullet points (starting with •) of precise, exam-relevant facts.
- Each bullet = ONE complete, testable fact. Use → for sequences. Use numbered steps for mechanisms.
- Define key terms in-line on first use. NO flowing prose. NO padding. Every word must be testable.
- Tone: direct, exam-focused, like a ZNotes or PMT revision page.`;

  return `You are a world-class Pearson Edexcel IGCSE Subject Expert and Examiner.
Your task is to generate high-fidelity revision notes for: ${topic.code} — ${topic.title}.

### STERN RULES FOR CONTENT GENERATION:
1. **Strict Context Slicing**: You must ONLY discuss topics listed in the ALLOWED TOPICS below.
2. **Silent Exclusion**: If a concept is in the FORBIDDEN TOPICS list, you must act as if that concept does not exist. Do NOT mention that you are skipping it.
3. **No Previewing**: Do not mention concepts beyond the scope of ${topic.code}.
4. **Keyword Density**: Naturally integrate all REQUIRED KEYWORDS into your technical explanations.
5. **Practical Skills**: Include the required practical investigations as a dedicated section — examiners test these in written papers.

${overviewRule}

### DATA METADATA:
- QUALIFICATION: Pearson Edexcel International GCSE (9-1)
- SPECIFICATION: Issue 3 (4BI1/4CH1/4PH1/4MA1) — examined from 2019
- ASSESSMENT: Paper 1 (110 marks, 2h) + Paper 2 (70 marks, 1h15m) — both written, untiered
- SESSION_ID: ${seed}
- TIMESTAMP: ${timestamp}
${tierNote}

### ALLOWED TOPICS (STRICT SCOPE):
${topic.allowedTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

### FORBIDDEN TOPICS (HARD BOUNDARY — DO NOT MENTION):
${topic.forbiddenTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

### REQUIRED KEYWORDS:
${topic.requiredKeywords.join(', ')}
${practicalSection}

${topic.boundaryNotes && topic.boundaryNotes.length > 0 ? `### CRITICAL EXAMINER BOUNDARY NOTES:\n${topic.boundaryNotes.join('\n')}` : ''}

BOUNDARY RULES:
- Only include content explicitly listed in ALLOWED TOPICS
- Do not introduce A-Level concepts or IGCSE content from other topics
- Every formula, definition, and diagram description must trace to the ALLOWED list
- Extension content (bold/B/C/P reference) should be clearly labelled "Extension (Paper 2 only)"
- Structure: Overview → Definitions → Core Content → Extension Content (Paper 2) → Equations → Practical Skills → Examiner Tips → Flashcards

CORE CONTENT STRUCTURE RULES (non-negotiable):
- Each "statement" must be ONE complete, testable exam fact — not a topic heading
- Use "→" notation for sequences and processes (e.g. "Starch → maltose → glucose (digestion)")
- For multi-step processes, number the steps within the statement: "Step 1: ... Step 2: ... Step 3: ..."
- "worked_example": show reasoning step-by-step with \\n between steps — do NOT repeat the statement
- "wrong_approach": name the specific misconception and correct it concisely
- Definitions "mark_scheme": write as examiner mark-scheme credit points, not dictionary definitions
- Do NOT write flowing essay prose anywhere in core_content — every item must be a crisp, structured note`;
}

/**
 * Build image prompt for diagrams
 */
export function buildImagePrompt(
  subject: string,
  topicKey: string,
  specificTopic: string
): string {
  const topic = EDEXCEL_IGCSE_SYLLABUS[subject]?.[topicKey];
  if (!topic) return '';

  const subjLabel = subject.charAt(0).toUpperCase() + subject.slice(1);

  return `Create a clean, educational scientific diagram for Pearson Edexcel IGCSE ${subjLabel} students. White background. Textbook quality. No decorative borders. Labels with clear arrows.

Board and Level: ${topic.code} — ${topic.title}
Specification: Pearson Edexcel International GCSE (9-1), first examined 2019

Topic: ${specificTopic}

The diagram MUST show only what is explicitly listed in this topic's specification for: ${specificTopic}

The diagram MUST NOT show:
- Content from other topics (see forbidden topics list for ${topic.code})
- A-Level or post-IGCSE content
- Decorative elements, 3D shading that obscures labels, or abstract art
- Any process, molecule, or pathway not in the allowed list for ${topic.code}

Style: Clean scientific diagram, white background, clearly labelled with arrows, educational textbook quality. Every label must be accurate and specific to IGCSE level.`;
}

/**
 * Validate generated notes for forbidden content
 */
export function validateGeneratedNotes(notes: string, subject: string, topicKey: string): {
  passed: boolean;
  forbiddenFound: string[];
} {
  const topic = EDEXCEL_IGCSE_SYLLABUS[subject]?.[topicKey];
  if (!topic) return { passed: false, forbiddenFound: ['Topic not found in syllabus database'] };

  const notesLower = notes.toLowerCase();
  const forbiddenFound: string[] = [];

  for (const forbidden of topic.forbiddenTopics) {
    const technicalTerms = forbidden.match(/[A-Z][a-z]{4,}|[a-z]{8,}/g) || [];
    for (const term of technicalTerms) {
      const pattern = new RegExp(`\\b${term}\\b`, 'i');
      if (pattern.test(notesLower)) {
        forbiddenFound.push(`Detected potential out-of-scope content: "${term}"`);
      }
    }
  }

  return {
    passed: forbiddenFound.length === 0,
    forbiddenFound,
  };
}

/**
 * Get all available subjects
 */
export function getSubjects(): string[] {
  return Object.keys(EDEXCEL_IGCSE_SYLLABUS);
}

/**
 * Get all topic keys for a subject
 */
export function getTopics(subject: string): string[] {
  return Object.keys(EDEXCEL_IGCSE_SYLLABUS[subject] || {});
}

/**
 * Get topic data safely
 */
export function getTopicData(subject: string, topicKey: string): TopicData | null {
  return EDEXCEL_IGCSE_SYLLABUS[subject]?.[topicKey] || null;
}

/**
 * Generate fresh seed for cache-busting
 */
export function generateSeed(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

/**
 * Generate cache key for a note
 */
export function generateCacheKey(subject: string, topicKey: string): string {
  return `notes_edexcel_igcse_${subject}_${topicKey}`;
}

/**
 * Build a generation log entry
 */
export function buildGenerationLog(
  subject: string,
  topicKey: string,
  trigger: 'initial' | 'cache_clear' | 'validation_retry',
  validationPassed: boolean,
  forbiddenFound: string[] = []
) {
  const topicData = getTopicData(subject, topicKey);
  return {
    qualification: 'edexcel_igcse',
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