// Exam FAQs — frequently-repeated past paper questions with mark-scheme answers.
// Researched from official Edexcel IAL and Cambridge (CIE) mark schemes.
// Organised by unit (Edexcel IAL) or chapter/topic number (CIE).

import type { SubjectCode } from "./subjects";

export type Board = "edexcel-ial" | "cie" | "edexcel-igcse" | "cie-igcse";

export interface ExamFaq {
  id: string;
  board: Board;
  subject: SubjectCode;
  unit: string;       // e.g. "WCH11" (Edexcel) or "9701-T3" (CIE)
  unitLabel: string;  // e.g. "Unit 1 · AS Level" or "Chapter 3 · Chemical Bonding"
  topic: string;      // sub-topic within the unit
  question: string;
  answer: string;
  examiner_note: string;
}

const ED = "edexcel-ial" as const;
const CIE = "cie" as const;

export const EXAM_FAQS: ExamFaq[] = [

  // ══════════════════════════════════════════════════════════════
  // EDEXCEL IAL CHEMISTRY
  // ══════════════════════════════════════════════════════════════

  // --- WCH11 Unit 1 · Structure, Bonding and Introduction to Organic Chemistry ---
  { id:"ec101", board:ED, subject:"chemistry", unit:"WCH11", unitLabel:"Unit 1 · Bonding & Organic Intro", topic:"Atomic Structure",
    question:"Define first ionisation energy.",
    answer:"The energy required to remove one mole of electrons from one mole of gaseous atoms to form one mole of gaseous 1+ ions: X(g) → X⁺(g) + e⁻.",
    examiner_note:"All three 'gaseous' references and 'one mole' are required. The equation earns a mark too." },

  { id:"ec102", board:ED, subject:"chemistry", unit:"WCH11", unitLabel:"Unit 1 · Bonding & Organic Intro", topic:"Atomic Structure",
    question:"Explain why there is a large increase in ionisation energy between the 2nd and 3rd ionisation energies of magnesium.",
    answer:"The third electron is removed from the inner shell (1st shell / n=1) which is much closer to the nucleus / has less shielding; the nuclear attraction is much stronger.",
    examiner_note:"Must reference 'inner shell' or 'closer to nucleus'. Just saying 'more shielding' without stating WHY loses the mark." },

  { id:"ec103", board:ED, subject:"chemistry", unit:"WCH11", unitLabel:"Unit 1 · Bonding & Organic Intro", topic:"Bonding and Structure",
    question:"Explain why diamond has a very high melting point.",
    answer:"Diamond has a giant covalent (macromolecular) lattice structure; it has strong covalent bonds throughout; a very large amount of energy is required to break all these bonds.",
    examiner_note:"'Covalent bonds' not 'intermolecular forces' — this is the most common error. Must say 'giant' structure." },

  { id:"ec104", board:ED, subject:"chemistry", unit:"WCH11", unitLabel:"Unit 1 · Bonding & Organic Intro", topic:"Bonding and Structure",
    question:"Why does graphite conduct electricity but diamond does not?",
    answer:"In graphite, each carbon is bonded to 3 others, leaving one delocalised electron per atom that can move through the structure. In diamond, all four outer electrons are used in covalent bonds — there are no free electrons.",
    examiner_note:"Always contrast the two: delocalised electrons in graphite vs all electrons bonded in diamond." },

  { id:"ec105", board:ED, subject:"chemistry", unit:"WCH11", unitLabel:"Unit 1 · Bonding & Organic Intro", topic:"Alkenes",
    question:"Describe the mechanism of electrophilic addition of HBr to propene and state the major product.",
    answer:"The π bond acts as a nucleophile; attacks the δ+ H of HBr; a carbocation forms at the more substituted carbon (secondary, C2); Br⁻ attacks the carbocation; major product is 2-bromopropane (Markovnikov's rule).",
    examiner_note:"Must draw curly arrows from π bond to H, and from Br⁻ to carbocation. State 'secondary carbocation more stable than primary' for the regiochemistry mark." },

  { id:"ec106", board:ED, subject:"chemistry", unit:"WCH11", unitLabel:"Unit 1 · Bonding & Organic Intro", topic:"Alkanes",
    question:"Describe the mechanism of free radical substitution of methane with chlorine under UV light.",
    answer:"Initiation: Cl₂ → 2Cl• (UV breaks Cl-Cl homolytically; half-headed arrows). Propagation: Cl• + CH₄ → HCl + •CH₃; then •CH₃ + Cl₂ → CH₃Cl + Cl•. Termination: any two radicals combine (e.g. Cl• + Cl• → Cl₂).",
    examiner_note:"All three stages named. Half-headed curly arrows for radicals. Termination must show two radicals combining — writing 'radicals are destroyed' is not enough." },

  { id:"ec107", board:ED, subject:"chemistry", unit:"WCH11", unitLabel:"Unit 1 · Bonding & Organic Intro", topic:"Bonding and Structure",
    question:"Define electronegativity.",
    answer:"The ability of an atom to attract the bonding pair of electrons in a covalent bond towards itself.",
    examiner_note:"'Bonding pair' not just 'electrons'. Pauling scale: F highest (3.98), Cs lowest." },

  // --- WCH12 Unit 2 · Energetics, Group Chemistry, Halogenoalkanes and Alcohols ---
  { id:"ec201", board:ED, subject:"chemistry", unit:"WCH12", unitLabel:"Unit 2 · Energetics & Group Chemistry", topic:"Energetics",
    question:"Define lattice enthalpy.",
    answer:"The energy released when one mole of an ionic compound is formed from its gaseous ions at infinite separation: M⁺(g) + X⁻(g) → MX(s).",
    examiner_note:"Formation lattice enthalpy is exothermic (negative). Some definitions use dissociation (endothermic) — specify which you are using." },

  { id:"ec202", board:ED, subject:"chemistry", unit:"WCH12", unitLabel:"Unit 2 · Energetics & Group Chemistry", topic:"Energetics",
    question:"State and explain the trend in thermal stability of Group 2 carbonates.",
    answer:"Thermal stability increases down the group (MgCO₃ most easily decomposed; BaCO₃ least). Larger cations have lower charge density so they polarise the carbonate ion less; the carbonate is less easily distorted/decomposed.",
    examiner_note:"Link stability to charge density (charge/radius). Don't say 'bigger ion = more stable' without the polarisation explanation." },

  { id:"ec203", board:ED, subject:"chemistry", unit:"WCH12", unitLabel:"Unit 2 · Energetics & Group Chemistry", topic:"Group 7",
    question:"Describe the reactions of sodium halides with concentrated sulfuric acid and explain the trend.",
    answer:"NaCl: only HCl(g) produced (Cl⁻ not strong enough to reduce H₂SO₄). NaBr: HBr + SO₂ (Br⁻ reduces SO₄²⁻ to SO₂). NaI: HI + H₂S + S + SO₂ (I⁻ is strongest reducing agent; reduces H₂SO₄ further to S and H₂S).",
    examiner_note:"State products clearly and explain using reducing power: I⁻ > Br⁻ > Cl⁻. Mention steamy fumes of HX for NaCl." },

  { id:"ec204", board:ED, subject:"chemistry", unit:"WCH12", unitLabel:"Unit 2 · Energetics & Group Chemistry", topic:"Group 7",
    question:"Describe the test for halide ions using silver nitrate solution and state the observations.",
    answer:"Add dilute nitric acid (to remove interfering ions), then aqueous AgNO₃: AgCl = white precipitate (soluble in dilute NH₃); AgBr = cream precipitate (soluble only in conc. NH₃); AgI = yellow precipitate (insoluble in NH₃).",
    examiner_note:"Acidify with dilute HNO₃ first — must state this. The solubility in NH₃ is always tested." },

  { id:"ec205", board:ED, subject:"chemistry", unit:"WCH12", unitLabel:"Unit 2 · Energetics & Group Chemistry", topic:"Kinetics",
    question:"Explain the effect of a catalyst on the rate of reaction in terms of the Maxwell-Boltzmann distribution.",
    answer:"A catalyst provides an alternative reaction pathway with a lower activation energy. On the Maxwell-Boltzmann curve, a greater proportion of molecules have energy ≥ Ea(catalyst); the rate increases without changing the overall energy of reactants/products.",
    examiner_note:"Must draw both Ea values on the Maxwell-Boltzmann curve. Note: the curve shape and area do NOT change with a catalyst." },

  { id:"ec206", board:ED, subject:"chemistry", unit:"WCH12", unitLabel:"Unit 2 · Energetics & Group Chemistry", topic:"Halogenoalkanes",
    question:"Explain why tertiary halogenoalkanes undergo SN1 substitution but primary undergo SN2.",
    answer:"Tertiary: the bulky alkyl groups provide steric hindrance, preventing backside attack; the tertiary carbocation formed is stable (stabilised by three electron-donating alkyl groups). Primary: little steric hindrance; backside attack by nucleophile is possible (one-step SN2).",
    examiner_note:"Two separate reasons: steric hindrance (for SN1) and carbocation stability. State both explicitly." },

  // --- WCH14 Unit 4 · Rates, Equilibria and Further Organic Chemistry ---
  { id:"ec401", board:ED, subject:"chemistry", unit:"WCH14", unitLabel:"Unit 4 · Rates, Equilibria & A2 Organic", topic:"Reaction Rates",
    question:"Define the rate constant k and state its units for a second-order reaction.",
    answer:"k is the proportionality constant in the rate equation: rate = k[A]ᵐ[B]ⁿ. For a second-order reaction (overall order 2), units of k = mol⁻¹ dm³ s⁻¹.",
    examiner_note:"Derive units by substituting into rate = k[A][B]: k = rate/([A][B]) = mol dm⁻³ s⁻¹ / (mol dm⁻³)² = mol⁻¹ dm³ s⁻¹." },

  { id:"ec402", board:ED, subject:"chemistry", unit:"WCH14", unitLabel:"Unit 4 · Rates, Equilibria & A2 Organic", topic:"Reaction Rates",
    question:"From initial rate data, how do you determine the order of reaction with respect to each reactant?",
    answer:"Compare experiments where only one concentration changes: if doubling [A] doubles rate → first order in A; if doubling [A] quadruples rate → second order in A; if rate unchanged → zero order in A. Repeat for each reactant.",
    examiner_note:"Always use the ratio method (don't just describe it qualitatively). Show a worked example with numbers from the data given." },

  { id:"ec403", board:ED, subject:"chemistry", unit:"WCH14", unitLabel:"Unit 4 · Rates, Equilibria & A2 Organic", topic:"Chemical Equilibria",
    question:"Write the expression for Kc for N₂(g) + 3H₂(g) ⇌ 2NH₃(g) and state its units.",
    answer:"Kc = [NH₃]² / ([N₂][H₂]³). Units: (mol dm⁻³)² / (mol dm⁻³)(mol dm⁻³)³ = mol⁻² dm⁶.",
    examiner_note:"Units must be derived from the Kc expression. State clearly if no units (Kc dimensionless when Δn=0)." },

  { id:"ec404", board:ED, subject:"chemistry", unit:"WCH14", unitLabel:"Unit 4 · Rates, Equilibria & A2 Organic", topic:"Chemical Equilibria",
    question:"Explain why increasing temperature increases Kc for an endothermic reaction.",
    answer:"Temperature is the only factor that changes Kc. Increasing T shifts equilibrium to the endothermic direction (Le Chatelier). More products and fewer reactants → numerator increases and denominator decreases → Kc increases.",
    examiner_note:"Must use Le Chatelier to justify the shift, then link to the Kc expression. Never say 'Kc increases because more product is made' without explaining WHY." },

  { id:"ec405", board:ED, subject:"chemistry", unit:"WCH14", unitLabel:"Unit 4 · Rates, Equilibria & A2 Organic", topic:"Transition Metals",
    question:"Explain why transition metals form coloured compounds.",
    answer:"In the presence of ligands, the d-orbitals split into two energy levels (t₂g and eg). Electrons can be promoted from the lower to the higher level by absorbing visible light of a specific frequency. The complementary colour is transmitted and observed.",
    examiner_note:"Three marking points: d-orbital splitting by ligands, absorption of visible light, complementary colour seen. Don't say 'unpaired electrons' — it's the splitting that matters." },

  { id:"ec406", board:ED, subject:"chemistry", unit:"WCH14", unitLabel:"Unit 4 · Rates, Equilibria & A2 Organic", topic:"Transition Metals",
    question:"Describe what is observed when excess NaOH(aq) is added to copper(II) sulfate solution.",
    answer:"Blue precipitate of Cu(OH)₂ forms: [Cu(H₂O)₆]²⁺ + 2OH⁻ → Cu(OH)₂ + 6H₂O. The precipitate does NOT dissolve in excess NaOH (unlike Cr³⁺ which is amphoteric).",
    examiner_note:"State colour of precipitate specifically. State that it does not dissolve in excess NaOH — contrast with Cr³⁺ which does." },

  { id:"ec407", board:ED, subject:"chemistry", unit:"WCH14", unitLabel:"Unit 4 · Rates, Equilibria & A2 Organic", topic:"Transition Metals",
    question:"What colour change is observed when excess ammonia is added to copper(II) sulfate solution?",
    answer:"Blue precipitate of Cu(OH)₂ forms first, then dissolves in excess NH₃ to give a deep blue solution of [Cu(NH₃)₄(H₂O)₂]²⁺ (tetraamminecopper(II)).",
    examiner_note:"Two-stage process. Must give formula/name of complex. Deep blue, NOT pale blue." },

  // --- WCH15 Unit 5 · Transition Metals, Arenes and Organic Nitrogen Chemistry ---
  { id:"ec501", board:ED, subject:"chemistry", unit:"WCH15", unitLabel:"Unit 5 · Transition Metals & Arenes", topic:"Arenes",
    question:"Describe the mechanism of nitration of benzene. State the reagents and conditions.",
    answer:"Reagents: conc. HNO₃ + conc. H₂SO₄; temperature below 55°C. H₂SO₄ protonates HNO₃ → NO₂⁺ (nitronium ion). NO₂⁺ attacks benzene ring → arenium ion intermediate. H⁺ expelled; aromaticity restored. Product: nitrobenzene.",
    examiner_note:"Draw full curly arrow mechanism. Below 55°C is critical — higher temperatures cause polynitration." },

  { id:"ec502", board:ED, subject:"chemistry", unit:"WCH15", unitLabel:"Unit 5 · Transition Metals & Arenes", topic:"Amino Acids and Proteins",
    question:"Draw the structure of an amino acid at its isoelectric point and explain why it exists as a zwitterion.",
    answer:"At the isoelectric point (pI), the amino group is protonated (–NH₃⁺) and the carboxyl group is deprotonated (–COO⁻). The molecule carries both a positive and negative charge → zwitterion. Net charge = 0.",
    examiner_note:"Must draw –NH₃⁺ and –COO⁻ on the same molecule. Isoelectric point is the pH where average net charge = 0." },

  { id:"ec503", board:ED, subject:"chemistry", unit:"WCH15", unitLabel:"Unit 5 · Transition Metals & Arenes", topic:"Carbonyl Compounds",
    question:"Describe how to distinguish between an aldehyde and a ketone using two different chemical tests.",
    answer:"Tollens' reagent ([Ag(NH₃)₂]⁺): aldehydes give silver mirror; ketones give no reaction. Fehling's/Benedict's solution: aliphatic aldehydes give brick-red Cu₂O precipitate; aromatic aldehydes and ketones give no reaction. Also: 2,4-DNPH gives orange precipitate with both.",
    examiner_note:"Know which reagents distinguish — 2,4-DNPH does NOT distinguish (reacts with both). Tollens' and Fehling's are the distinguishing tests." },

  // --- WCH16 Unit 6 · Practical Skills ---
  { id:"ec601", board:ED, subject:"chemistry", unit:"WCH16", unitLabel:"Unit 6 · Practical Skills", topic:"Transition Metal Colour Tests",
    question:"State the colours of the following aqueous transition metal ions: Fe²⁺, Fe³⁺, Cu²⁺, Mn²⁺.",
    answer:"Fe²⁺: pale green. Fe³⁺: yellow-brown. Cu²⁺: blue. Mn²⁺: pale pink.",
    examiner_note:"These exact colours are tested frequently. Also know MnO₄⁻ = purple and Cr₂O₇²⁻ = orange." },

  { id:"ec602", board:ED, subject:"chemistry", unit:"WCH16", unitLabel:"Unit 6 · Practical Skills", topic:"Transition Metal Colour Tests",
    question:"State the colours of the precipitates formed when NaOH is added to: Fe²⁺, Fe³⁺, Cu²⁺, Cr³⁺.",
    answer:"Fe²⁺ + NaOH: green precipitate Fe(OH)₂. Fe³⁺ + NaOH: brown/rust precipitate Fe(OH)₃. Cu²⁺ + NaOH: blue precipitate Cu(OH)₂. Cr³⁺ + NaOH: grey-green precipitate Cr(OH)₃ (dissolves in excess NaOH to give dark green [Cr(OH)₄]⁻).",
    examiner_note:"Cr(OH)₃ is amphoteric — it dissolves in BOTH excess NaOH and excess HCl. This distinction is frequently tested." },

  { id:"ec603", board:ED, subject:"chemistry", unit:"WCH16", unitLabel:"Unit 6 · Practical Skills", topic:"Redox Titration",
    question:"In a KMnO₄ titration (acid solution), what colour change indicates the endpoint and why is no indicator needed?",
    answer:"The endpoint is indicated by the first permanent pink/purple colour in the solution. No external indicator is needed because KMnO₄ itself is purple/deep violet — it acts as its own indicator; excess KMnO₄ after all Fe²⁺ is oxidised gives a permanent colour.",
    examiner_note:"The solution must be acidified (dilute H₂SO₄) so MnO₄⁻ is fully reduced to colourless Mn²⁺. Never use HCl (it would be oxidised by MnO₄⁻)." },

  // ══════════════════════════════════════════════════════════════
  // EDEXCEL IAL BIOLOGY
  // ══════════════════════════════════════════════════════════════

  // --- WBI11 Unit 1 · Lifestyle, Transport, Genes and Health ---
  { id:"eb101", board:ED, subject:"biology", unit:"WBI11", unitLabel:"Unit 1 · Lifestyle, Transport, Genes & Health", topic:"Blood Vessels",
    question:"Compare the structure of arteries and veins.",
    answer:"Arteries: thick muscular wall with elastic fibres; small lumen; no valves; carry blood away from heart at high pressure. Veins: thin wall; wide lumen; have valves to prevent backflow; carry blood to heart at low pressure.",
    examiner_note:"Compare in parallel pairs — examiners want explicit contrasts, not two separate descriptions." },

  { id:"eb102", board:ED, subject:"biology", unit:"WBI11", unitLabel:"Unit 1 · Lifestyle, Transport, Genes & Health", topic:"Haemoglobin",
    question:"Explain the Bohr effect and its significance in oxygen delivery.",
    answer:"Increased CO₂ at respiring tissues lowers pH; this causes haemoglobin's tertiary structure to change shape slightly; oxygen affinity decreases; oxyhaemoglobin releases O₂ more readily. This ensures more O₂ is delivered where metabolic activity is greatest.",
    examiner_note:"Must link CO₂ → pH decrease → shape change → reduced affinity. 'The curve shifts right' alone is insufficient." },

  { id:"eb103", board:ED, subject:"biology", unit:"WBI11", unitLabel:"Unit 1 · Lifestyle, Transport, Genes & Health", topic:"Cardiac Cycle",
    question:"Describe the events of the cardiac cycle, stating when valves open and close.",
    answer:"Atrial systole: atria contract; AV valves open; blood enters ventricles. Ventricular systole: ventricles contract; AV valves close (prevents backflow to atria); pressure exceeds aorta/pulmonary artery → semilunar valves open; blood ejected. Diastole: all chambers relax; blood enters atria; semilunar valves close.",
    examiner_note:"Must state valve events at each stage. 'Valves open/close due to pressure differences' earns an extra mark in longer questions." },

  { id:"eb104", board:ED, subject:"biology", unit:"WBI11", unitLabel:"Unit 1 · Lifestyle, Transport, Genes & Health", topic:"DNA and Protein Synthesis",
    question:"Describe how mRNA is produced during transcription.",
    answer:"Helicase breaks hydrogen bonds; DNA double helix unwinds. RNA polymerase binds to the promoter region. Uses DNA template strand (3'→5') to synthesise complementary mRNA (5'→3') using free RNA nucleotides; base pairing rules (A-U, T-A, C-G). RNA polymerase moves along until it reaches a stop codon/terminator sequence. mRNA detaches.",
    examiner_note:"State 'template strand' not just 'one strand'. Must mention 5'→3' direction for the mRNA molecule." },

  { id:"eb105", board:ED, subject:"biology", unit:"WBI11", unitLabel:"Unit 1 · Lifestyle, Transport, Genes & Health", topic:"Atherosclerosis",
    question:"Describe the process of atherosclerosis leading to myocardial infarction.",
    answer:"Endothelial damage → inflammatory response → white blood cells and lipids accumulate forming fatty streak → smooth muscle cells proliferate → plaque (atheroma) forms, narrowing lumen → raised blood pressure → reduced blood flow to heart muscle → if coronary artery blocked → myocardial infarction.",
    examiner_note:"A common 6-mark question. Must show it as a sequence of events. Key terms: endothelial damage, inflammatory response, plaque/atheroma, narrowed lumen." },

  { id:"eb106", board:ED, subject:"biology", unit:"WBI11", unitLabel:"Unit 1 · Lifestyle, Transport, Genes & Health", topic:"Blood Clotting",
    question:"Describe the blood clotting cascade.",
    answer:"Damaged tissue releases thromboplastin (clotting factors). Thromboplastin activates prothrombin → thrombin. Thrombin catalyses conversion of soluble fibrinogen → insoluble fibrin. Fibrin strands form a mesh trapping platelets and RBCs → clot.",
    examiner_note:"Cascade sequence: damage → thromboplastin → prothrombin → thrombin → fibrinogen → fibrin. Always include the prothrombin step." },

  // --- WBI12 Unit 2 · Development, Plants and the Environment ---
  { id:"eb201", board:ED, subject:"biology", unit:"WBI12", unitLabel:"Unit 2 · Development, Plants & Environment", topic:"Cell Division",
    question:"Describe what happens to chromosomes during prophase of mitosis.",
    answer:"Chromosomes condense and become visible (each consists of two chromatids joined at the centromere). The nuclear envelope breaks down. Centrioles move to opposite poles and spindle fibres form. Chromosomes attach to spindle via centromeres.",
    examiner_note:"Common error: saying chromosomes 'replicate' during prophase — they replicated during S phase of interphase." },

  { id:"eb202", board:ED, subject:"biology", unit:"WBI12", unitLabel:"Unit 2 · Development, Plants & Environment", topic:"Cell Division",
    question:"Compare mitosis and meiosis.",
    answer:"Mitosis: one division; produces 2 cells; daughter cells are genetically identical; diploid (2n). Meiosis: two divisions; produces 4 cells; daughter cells are genetically different; haploid (n); crossing over creates new allele combinations.",
    examiner_note:"Compare in parallel: number of divisions, cells produced, genetic identity, ploidy." },

  { id:"eb203", board:ED, subject:"biology", unit:"WBI12", unitLabel:"Unit 2 · Development, Plants & Environment", topic:"Stem Cells",
    question:"Compare totipotent, pluripotent and multipotent stem cells.",
    answer:"Totipotent: can differentiate into any cell type including extra-embryonic tissues; only in early embryo (morula stage). Pluripotent: can differentiate into most cell types (not extra-embryonic); embryonic stem cells. Multipotent: limited range of cell types; adult stem cells (e.g. haematopoietic stem cells produce blood cells only).",
    examiner_note:"Must distinguish extra-embryonic capability for totipotent. Always give an example of each." },

  { id:"eb204", board:ED, subject:"biology", unit:"WBI12", unitLabel:"Unit 2 · Development, Plants & Environment", topic:"Biodiversity",
    question:"State the formula for Simpson's Diversity Index and explain what a value close to 1 means.",
    answer:"D = 1 − Σ(n/N)², where n = number of individuals of each species, N = total number of all individuals. D close to 1 indicates HIGH biodiversity (many species, evenly distributed). D close to 0 indicates low biodiversity (dominated by one species).",
    examiner_note:"D = 1 − Σ(n/N)² is the standard formula. Some textbooks use D = N(N−1) / Σn(n−1) — clarify which version your spec requires." },

  { id:"eb205", board:ED, subject:"biology", unit:"WBI12", unitLabel:"Unit 2 · Development, Plants & Environment", topic:"Cell Structure",
    question:"Compare the structure of prokaryotic and eukaryotic cells.",
    answer:"Prokaryotic: no membrane-bound nucleus (circular DNA free in cytoplasm); 70S ribosomes; cell wall of peptidoglycan; no membrane-bound organelles; typically 1–5 µm. Eukaryotic: membrane-bound nucleus; 80S ribosomes; various membrane-bound organelles (mitochondria, ER, Golgi); typically 10–100 µm.",
    examiner_note:"State '70S' and '80S' for full marks. Never say 'smaller ribosomes' — state the actual sedimentation coefficient." },

  // --- WBI14 Unit 4 · Energy, Environment, Microbiology and Immunity ---
  { id:"eb401", board:ED, subject:"biology", unit:"WBI14", unitLabel:"Unit 4 · Energy, Environment & Immunity", topic:"Photosynthesis",
    question:"Describe the light-dependent reactions of photosynthesis.",
    answer:"Light hits Photosystem II (PSII) → electrons excited to higher energy level → photolysis of water: 2H₂O → 4H⁺ + 4e⁻ + O₂. Electrons pass down ETC → ATP produced by photophosphorylation. Electrons reach PSI → re-energised by light → NADP reduced to NADPH. Net: O₂ released; ATP and NADPH produced.",
    examiner_note:"Sequence: PSII → ETC → PSI → NADPH. Must include photolysis producing O₂ and state the sites (thylakoid membrane)." },

  { id:"eb402", board:ED, subject:"biology", unit:"WBI14", unitLabel:"Unit 4 · Energy, Environment & Immunity", topic:"Photosynthesis",
    question:"Describe the Calvin cycle (light-independent reactions).",
    answer:"CO₂ fixation: CO₂ combines with RuBP (5C) catalysed by RuBisCO → 2 GP (3C). Reduction: GP reduced to G3P using ATP and NADPH. Regeneration of RuBP: most G3P regenerates RuBP using ATP. G3P can be used to synthesise glucose, fatty acids, amino acids.",
    examiner_note:"Key intermediates: RuBP → GP → G3P. RuBisCO enzyme must be mentioned. The ratio: for every 3 CO₂ fixed, one G3P net is produced." },

  { id:"eb403", board:ED, subject:"biology", unit:"WBI14", unitLabel:"Unit 4 · Energy, Environment & Immunity", topic:"Immunity",
    question:"Describe the humoral immune response to a pathogen.",
    answer:"Macrophage engulfs pathogen (phagocytosis) → presents antigens on surface (antigen-presenting cell). B-lymphocyte with complementary receptor binds antigen (clonal selection) → B cell proliferates (clonal expansion) → plasma cells secrete antibodies; memory B cells formed for secondary response.",
    examiner_note:"Full marks requires: antigen presentation by macrophage, clonal selection, clonal expansion, plasma cells, memory cells. 'Antibodies are complementary to antigens' earns a mark." },

  { id:"eb404", board:ED, subject:"biology", unit:"WBI14", unitLabel:"Unit 4 · Energy, Environment & Immunity", topic:"Antibiotic Resistance",
    question:"Explain how antibiotic resistance develops in bacteria.",
    answer:"Random mutations in bacterial DNA occur; some mutations confer resistance to an antibiotic (e.g. altered target protein, production of β-lactamase). When antibiotic is present, resistant bacteria are selected for (natural selection) and survive; non-resistant bacteria die. Resistant bacteria reproduce — resistant allele passes to all offspring; may transfer via conjugation (horizontal gene transfer) to other bacteria.",
    examiner_note:"Must include natural selection and gene transfer. 'Bacteria become resistant through use of antibiotics' is wrong — antibiotic selects; it does not cause the mutation." },

  // --- WBI15 Unit 5 · Respiration, Homeostasis and Gene Technology ---
  { id:"eb501", board:ED, subject:"biology", unit:"WBI15", unitLabel:"Unit 5 · Respiration, Homeostasis & Gene Tech", topic:"Respiration",
    question:"Describe the stages of aerobic respiration, giving the location of each stage.",
    answer:"Glycolysis (cytoplasm): glucose → 2 pyruvate; net 2 ATP, 2 NADH. Link reaction (mitochondrial matrix): pyruvate → acetyl-CoA; CO₂ and NADH produced. Krebs cycle (matrix): acetyl-CoA + oxaloacetate → citrate → back to OAA; NADH, FADH₂, ATP produced; CO₂ released. Oxidative phosphorylation (inner mitochondrial membrane): NADH/FADH₂ donate electrons to ETC; chemiosmosis; O₂ as terminal electron acceptor; ~26–34 ATP produced.",
    examiner_note:"Location must be stated for each stage. Krebs cycle = 2 turns per glucose (one turn per pyruvate)." },

  { id:"eb502", board:ED, subject:"biology", unit:"WBI15", unitLabel:"Unit 5 · Respiration, Homeostasis & Gene Tech", topic:"Homeostasis",
    question:"Explain how blood glucose is regulated after a meal (high blood glucose).",
    answer:"After a meal, blood [glucose] rises → detected by β-cells in islets of Langerhans in pancreas → insulin secreted. Insulin: increases GLUT4 transport proteins in muscle/fat cell membranes → glucose uptake increases. Stimulates glycogenesis (glucose → glycogen) in liver and muscle. Stimulates glycolysis. Blood [glucose] returns to normal (negative feedback).",
    examiner_note:"β-cells secrete insulin; α-cells secrete glucagon — don't confuse. GLUT4 is specifically for insulin-stimulated uptake in muscle/adipose." },

  { id:"eb503", board:ED, subject:"biology", unit:"WBI15", unitLabel:"Unit 5 · Respiration, Homeostasis & Gene Tech", topic:"Nervous System",
    question:"Describe the sequence of events at a cholinergic synapse.",
    answer:"Action potential arrives at pre-synaptic knob → Ca²⁺ ions enter via voltage-gated channels → synaptic vesicles fuse with pre-synaptic membrane → acetylcholine (ACh) released by exocytosis into synaptic cleft → ACh binds to receptors on post-synaptic membrane → Na⁺ channels open → depolarisation → new action potential. Acetylcholinesterase breaks ACh down; choline reabsorbed.",
    examiner_note:"Ca²⁺ entry is the trigger — state this explicitly. Acetylcholinesterase is required to prevent continuous stimulation." },

  { id:"eb504", board:ED, subject:"biology", unit:"WBI15", unitLabel:"Unit 5 · Respiration, Homeostasis & Gene Tech", topic:"Kidney",
    question:"Describe ultrafiltration in the Bowman's capsule.",
    answer:"High hydrostatic blood pressure in the glomerulus (due to wider afferent than efferent arteriole) forces small molecules through the capillary walls, basement membrane (acts as filter), and podocyte filtration slits into the Bowman's capsule. Large proteins and blood cells are too large and stay in blood.",
    examiner_note:"Must mention: high pressure, basement membrane as filter, podocytes/filtration slits, what passes vs what doesn't." },

  // ══════════════════════════════════════════════════════════════
  // EDEXCEL IAL PHYSICS
  // ══════════════════════════════════════════════════════════════

  // --- WPH11 Unit 1 · Mechanics and Materials ---
  { id:"ep101", board:ED, subject:"physics", unit:"WPH11", unitLabel:"Unit 1 · Mechanics & Materials", topic:"Mechanics",
    question:"A projectile is launched horizontally from a cliff. Explain why its horizontal and vertical motions are independent.",
    answer:"In the absence of air resistance, there is no horizontal force — horizontal velocity is constant throughout. Gravity acts only downward (vertically), causing constant vertical acceleration of 9.81 m s⁻². Since the two directions are perpendicular, one component does not affect the other.",
    examiner_note:"Must state: (1) no horizontal force/constant horizontal velocity, (2) gravity only acts vertically, (3) perpendicular independence." },

  { id:"ep102", board:ED, subject:"physics", unit:"WPH11", unitLabel:"Unit 1 · Mechanics & Materials", topic:"Materials",
    question:"Define the Young modulus and state its SI unit.",
    answer:"Young modulus E = stress / strain = (F/A) / (ΔL/L₀). Unit: Pa (N m⁻²). It measures the stiffness of a material.",
    examiner_note:"Must define stress and strain separately first. Tensile strength ≠ Young modulus — Young modulus is about elasticity." },

  { id:"ep103", board:ED, subject:"physics", unit:"WPH11", unitLabel:"Unit 1 · Mechanics & Materials", topic:"Waves",
    question:"Explain what is meant by the polarisation of a transverse wave.",
    answer:"A transverse wave is polarised when its oscillations occur in only one plane (perpendicular to the direction of propagation). For light: a polarising filter only transmits the component oscillating in one direction. Longitudinal waves cannot be polarised because they oscillate parallel to propagation.",
    examiner_note:"Evidence that light is transverse: it can be polarised. Longitudinal (sound) cannot be polarised — this contrast is often tested." },

  // --- WPH12 Unit 2 · Electricity and Further Mechanics ---
  { id:"ep201", board:ED, subject:"physics", unit:"WPH12", unitLabel:"Unit 2 · Electricity & Further Mechanics", topic:"Electric Circuits",
    question:"Explain why the terminal voltage of a battery is less than its EMF when current flows.",
    answer:"The battery has internal resistance r. When current I flows: terminal voltage = EMF − Ir. Energy is dissipated (as heat) in the internal resistance, reducing the voltage available to the external circuit.",
    examiner_note:"Formula V = ε − Ir must be stated. When no current flows (open circuit), terminal voltage = EMF (no internal voltage drop)." },

  { id:"ep202", board:ED, subject:"physics", unit:"WPH12", unitLabel:"Unit 2 · Electricity & Further Mechanics", topic:"Particle Physics",
    question:"A photon of frequency f strikes a metal surface. Explain why electrons are only emitted if f exceeds a threshold frequency f₀.",
    answer:"Each photon transfers all its energy (E = hf) to one electron. The electron needs a minimum energy equal to the work function φ = hf₀ to escape the metal surface. If hf < φ, the electron cannot escape however many photons arrive (photons cannot 'add up' their energies for one electron).",
    examiner_note:"Must explain one-to-one photon–electron interaction. 'Intensity is too low' is wrong — even high-intensity light below f₀ won't emit electrons." },

  // --- WPH14 Unit 4 · Further Mechanics, Fields and Particles ---
  { id:"ep401", board:ED, subject:"physics", unit:"WPH14", unitLabel:"Unit 4 · Further Mechanics, Fields & Particles", topic:"Circular Motion",
    question:"Explain why a body moving in a circle at constant speed is still accelerating.",
    answer:"The velocity of the body is continuously changing direction (though not magnitude). Since acceleration = rate of change of velocity (a vector), a change in direction is a change in velocity. The centripetal acceleration always points towards the centre of the circle.",
    examiner_note:"Velocity is a vector — distinguish velocity from speed. The centripetal force provides this acceleration." },

  { id:"ep402", board:ED, subject:"physics", unit:"WPH14", unitLabel:"Unit 4 · Further Mechanics, Fields & Particles", topic:"Electric Fields",
    question:"Compare gravitational and electric fields.",
    answer:"Both are inverse-square law fields: g = GM/r² and E = kQ/r². Both have field lines showing direction of force. Differences: gravity is always attractive (mass always positive); electric force can be attractive or repulsive. Gravity is much weaker than electromagnetic force.",
    examiner_note:"Inverse-square law for both. Emphasise gravity is always attractive but electric can be repulsive (positive charges repel)." },

  // --- WPH15 Unit 5 · Thermodynamics, Radiation, Oscillations and Cosmology ---
  { id:"ep501", board:ED, subject:"physics", unit:"WPH15", unitLabel:"Unit 5 · Thermodynamics, Radiation & Nuclear", topic:"Nuclear Physics",
    question:"Explain what is meant by binding energy per nucleon and why it is greatest for iron-56.",
    answer:"Binding energy per nucleon = total energy needed to completely separate the nucleus into individual nucleons, divided by the number of nucleons. Iron-56 has the highest value (~8.8 MeV per nucleon) because it has the most stable combination of strong nuclear force vs electrostatic repulsion. Nuclei lighter than Fe release energy by fusion; heavier ones by fission.",
    examiner_note:"Both fusion (towards Fe) and fission (towards Fe) release energy — this is the key insight." },

  { id:"ep502", board:ED, subject:"physics", unit:"WPH15", unitLabel:"Unit 5 · Thermodynamics, Radiation & Nuclear", topic:"Magnetic Fields",
    question:"Describe how electromagnetic induction is used to generate an alternating current in a simple generator.",
    answer:"A coil rotates in a magnetic field. The flux linkage changes continuously as the angle between the coil and field changes. By Faraday's law, the rate of change of flux linkage induces an EMF. As the coil rotates continuously, the induced EMF alternates in sign → alternating current. Maximum EMF when coil is parallel to B (flux linkage changes fastest); zero when perpendicular (changing flux = 0 at that instant).",
    examiner_note:"Reference Faraday's law. Explain why it's alternating (direction of induced EMF reverses each half-rotation). Use 'flux linkage' not just 'flux'." },

  // ══════════════════════════════════════════════════════════════
  // EDEXCEL IAL MATHEMATICS
  // ══════════════════════════════════════════════════════════════

  // --- P1 · Pure Mathematics 1 ---
  { id:"em101", board:ED, subject:"mathematics", unit:"p1", unitLabel:"P1 · Pure Mathematics 1", topic:"Differentiation",
    question:"Find the equation of the tangent to y = x³ − 3x + 2 at x = 2.",
    answer:"dy/dx = 3x² − 3. At x = 2: gradient = 3(4) − 3 = 9. At x = 2: y = 8 − 6 + 2 = 4. Equation: y − 4 = 9(x − 2) → y = 9x − 14.",
    examiner_note:"Show all steps: differentiate, substitute x for gradient, find y-coordinate, use y−y₁=m(x−x₁). Numerical error still earns method marks if shown." },

  { id:"em102", board:ED, subject:"mathematics", unit:"p1", unitLabel:"P1 · Pure Mathematics 1", topic:"Integration",
    question:"Calculate the area enclosed between y = x² − 4 and the x-axis.",
    answer:"Roots at x = ±2. Area = −∫₋₂² (x² − 4) dx = −[x³/3 − 4x]₋₂² = −{(8/3−8)−(−8/3+8)} = −{−16/3 − 16/3} = 32/3.",
    examiner_note:"The function is negative between the roots, so the integral gives a negative value — take the modulus (or use −∫) for area. Students often forget the negative sign." },

  { id:"em103", board:ED, subject:"mathematics", unit:"p1", unitLabel:"P1 · Pure Mathematics 1", topic:"Coordinate Geometry",
    question:"Find the equation of the perpendicular bisector of the segment joining A(2, 5) and B(8, 1).",
    answer:"Midpoint M = (5, 3). Gradient AB = (1−5)/(8−2) = −2/3. Perpendicular gradient = 3/2. Equation: y − 3 = (3/2)(x − 5) → 2y − 6 = 3x − 15 → 3x − 2y − 9 = 0.",
    examiner_note:"Three steps: midpoint, gradient (then negative reciprocal), equation through midpoint. Always verify your equation passes through the midpoint." },

  // --- P2 · Pure Mathematics 2 ---
  { id:"em201", board:ED, subject:"mathematics", unit:"p2", unitLabel:"P2 · Pure Mathematics 2", topic:"Sequences and Series",
    question:"Find the sum to infinity of the geometric series 12 − 4 + 4/3 − …",
    answer:"a = 12, r = −4/12 = −1/3. Since |r| = 1/3 < 1, series converges. S∞ = a/(1−r) = 12/(1 − (−1/3)) = 12/(4/3) = 9.",
    examiner_note:"Must verify |r| < 1 for convergence before applying the formula. Common error: wrong value of r (calculate r = T₂/T₁)." },

  { id:"em202", board:ED, subject:"mathematics", unit:"p2", unitLabel:"P2 · Pure Mathematics 2", topic:"Binomial Expansion",
    question:"Find the coefficient of x³ in the expansion of (2 + 3x)⁵.",
    answer:"General term: ⁵Cᵣ(2)⁵⁻ʳ(3x)ʳ. For x³: r = 3. Term = ⁵C₃(2)²(3x)³ = 10 × 4 × 27x³ = 1080x³. Coefficient = 1080.",
    examiner_note:"Use the binomial theorem term formula explicitly. Show ⁵C₃ = 10 and substitute correctly. Coefficient only — don't include x³." },

  { id:"em203", board:ED, subject:"mathematics", unit:"p2", unitLabel:"P2 · Pure Mathematics 2", topic:"Exponentials and Logarithms",
    question:"Solve 3^(2x+1) = 7.",
    answer:"Take log₁₀ (or ln) of both sides: (2x+1)ln 3 = ln 7. 2x + 1 = ln7/ln3 = 1.7712... . 2x = 0.7712... . x = 0.386 (3 d.p.).",
    examiner_note:"Take log of both sides — don't try to evaluate 3^(2x+1) numerically. Give answer to 3 d.p. unless instructed otherwise." },

  // --- P3 · Pure Mathematics 3 ---
  { id:"em301", board:ED, subject:"mathematics", unit:"p3", unitLabel:"P3 · Pure Mathematics 3", topic:"Integration",
    question:"Use integration by parts to find ∫x·eˣ dx.",
    answer:"Let u = x, dv = eˣ dx → du = dx, v = eˣ. ∫x·eˣ dx = x·eˣ − ∫eˣ dx = x·eˣ − eˣ + c = eˣ(x − 1) + c.",
    examiner_note:"Choose u = x (algebraic) — LIATE rule. Show the IBP formula explicitly: ∫u dv = uv − ∫v du." },

  { id:"em302", board:ED, subject:"mathematics", unit:"p3", unitLabel:"P3 · Pure Mathematics 3", topic:"Differential Equations",
    question:"Solve dy/dx = xy, given y = 2 when x = 0.",
    answer:"Separate variables: (1/y) dy = x dx. Integrate: ln|y| = x²/2 + c. Apply condition: ln 2 = 0 + c → c = ln 2. So y = e^(x²/2 + ln2) = 2e^(x²/2).",
    examiner_note:"Always apply boundary conditions after integrating to find the particular solution. Show separation of variables step explicitly." },

  // --- M1 · Mechanics 1 ---
  { id:"em501", board:ED, subject:"mathematics", unit:"m1", unitLabel:"M1 · Mechanics 1", topic:"Newton's Laws",
    question:"A particle of mass 5 kg is on a rough horizontal surface with µ = 0.4. A horizontal force of 30 N is applied. Find the acceleration.",
    answer:"Normal reaction N = mg = 5 × 9.8 = 49 N. Friction = µN = 0.4 × 49 = 19.6 N. Net force = 30 − 19.6 = 10.4 N. a = F/m = 10.4/5 = 2.08 m s⁻².",
    examiner_note:"Always draw a free-body diagram first. Friction = µN only when the particle is moving (or on the verge of moving)." },

  { id:"em502", board:ED, subject:"mathematics", unit:"m1", unitLabel:"M1 · Mechanics 1", topic:"Moments",
    question:"State the conditions for a rigid body to be in equilibrium.",
    answer:"(1) The resultant force in any direction is zero (ΣF = 0). (2) The sum of moments about any point is zero (ΣM = 0). Both conditions must hold simultaneously.",
    examiner_note:"Two conditions — students often state only the force condition. For 2-mark questions, state both explicitly." },

  // --- S1 · Statistics 1 ---
  { id:"em701", board:ED, subject:"mathematics", unit:"s1", unitLabel:"S1 · Statistics 1", topic:"Normal Distribution",
    question:"If X ~ N(50, 16), find P(X < 53).",
    answer:"Standardise: Z = (53 − 50) / √16 = 3/4 = 0.75. P(X < 53) = P(Z < 0.75) = Φ(0.75) = 0.7734 (from standard normal tables).",
    examiner_note:"Use the standardisation formula z = (x − µ)/σ. Note σ² = 16 so σ = 4. Always show standardisation step even if you use a calculator." },

  // ══════════════════════════════════════════════════════════════
  // CIE A LEVEL CHEMISTRY 9701
  // ══════════════════════════════════════════════════════════════

  // --- Chapter 1 · Atomic Structure ---
  { id:"cc101", board:CIE, subject:"chemistry", unit:"9701-T1", unitLabel:"Chapter 1 · Atomic Structure", topic:"Atomic Structure",
    question:"Define first ionisation energy and write an equation for the first ionisation of sodium.",
    answer:"The energy required to remove one mole of electrons from one mole of gaseous atoms to form one mole of gaseous 1+ ions: Na(g) → Na⁺(g) + e⁻.",
    examiner_note:"'Gaseous' state must be specified for all species. The equation earns one mark." },

  { id:"cc102", board:CIE, subject:"chemistry", unit:"9701-T1", unitLabel:"Chapter 1 · Atomic Structure", topic:"Atomic Structure",
    question:"Explain the trend in first ionisation energy across Period 3.",
    answer:"Generally increases from Na to Ar due to increasing nuclear charge (more protons) while the number of inner shielding electrons stays the same → increased attraction for outer electrons. Dip at Al (3p electron slightly higher energy/easier to remove than 3s). Dip at S (paired 3p electron has spin-pair repulsion).",
    examiner_note:"Two exceptions must be explained: Al (3p above 3s) and S (spin-pair repulsion in paired 3p). Full marks require both anomalies." },

  { id:"cc103", board:CIE, subject:"chemistry", unit:"9701-T1", unitLabel:"Chapter 1 · Atomic Structure", topic:"Atomic Structure",
    question:"An element has successive ionisation energies: 577, 1816, 2744, 11 580 kJ mol⁻¹. To which Group does it belong?",
    answer:"The large jump occurs between the 3rd and 4th ionisation energies, meaning 3 electrons are in the outer shell. The element is in Group 3 (e.g. aluminium).",
    examiner_note:"The large jump occurs AFTER removing outer-shell electrons. Count how many IEs before the jump = number of outer electrons = group number." },

  // --- Chapter 2 · Atoms, Molecules and Stoichiometry ---
  { id:"cc201", board:CIE, subject:"chemistry", unit:"9701-T2", unitLabel:"Chapter 2 · Atoms, Molecules & Stoichiometry", topic:"Stoichiometry",
    question:"A compound contains 40.0% C, 6.7% H, 53.3% O by mass. Find its empirical formula.",
    answer:"Moles: C = 40.0/12 = 3.33; H = 6.7/1 = 6.7; O = 53.3/16 = 3.33. Ratio C:H:O = 1:2:1. Empirical formula: CH₂O.",
    examiner_note:"Divide by smallest mole value to get simplest integer ratio. If ratio is not integer (e.g. 1:1.5), multiply throughout." },

  { id:"cc202", board:CIE, subject:"chemistry", unit:"9701-T2", unitLabel:"Chapter 2 · Atoms, Molecules & Stoichiometry", topic:"Stoichiometry",
    question:"In a mass spectrum, what does the M+2 peak ratio of approximately 1:1 indicate?",
    answer:"The compound contains one bromine atom. Bromine has two isotopes of approximately equal abundance: ⁷⁹Br and ⁸¹Br, giving M and M+2 peaks in a 1:1 ratio.",
    examiner_note:"Cl shows M:M+2 = 3:1 (³⁵Cl:³⁷Cl). Br shows M:M+2 = 1:1 (⁷⁹Br:⁸¹Br). These patterns are regularly tested." },

  // --- Chapter 3 · Chemical Bonding ---
  { id:"cc301", board:CIE, subject:"chemistry", unit:"9701-T3", unitLabel:"Chapter 3 · Chemical Bonding", topic:"Chemical Bonding",
    question:"Predict the shape and bond angle of SF₄ and explain your answer using VSEPR theory.",
    answer:"Central S has 4 bonding pairs and 1 lone pair (total 5 electron pairs). Lone pairs repel more than bonding pairs. Shape = see-saw/seesaw. Bond angles: axial ≈ 173°, equatorial ≈ 102° (lone pair in equatorial position to minimise repulsion with bonding pairs).",
    examiner_note:"Always state the number of bonding pairs AND lone pairs, then apply VSEPR. Lone pairs take equatorial positions in trigonal bipyramidal geometry to minimise repulsion." },

  { id:"cc302", board:CIE, subject:"chemistry", unit:"9701-T3", unitLabel:"Chapter 3 · Chemical Bonding", topic:"Chemical Bonding",
    question:"Explain why hydrogen fluoride has a much higher boiling point than expected from its molecular mass.",
    answer:"HF molecules form hydrogen bonds between the δ+ H of one HF molecule and the lone pair on the δ− F of another (O-H···O or N-H···N or F-H···F). Hydrogen bonds are stronger than the London dispersion forces of other hydrogen halides. More energy needed to break intermolecular forces → higher boiling point.",
    examiner_note:"Draw the hydrogen bond explicitly: H−F···H−F. Specify which atoms are involved (O, N or F only form H-bonds). Must say 'requires more energy to overcome stronger forces'." },

  // --- Chapter 5 · Chemical Energetics ---
  { id:"cc501", board:CIE, subject:"chemistry", unit:"9701-T5", unitLabel:"Chapter 5 · Chemical Energetics", topic:"Chemical Energetics",
    question:"Construct a Born-Haber cycle for NaCl and use it to calculate the lattice enthalpy.",
    answer:"ΔHf = ΔHat(Na) + ΔHat(½Cl₂) + IE₁(Na) + EA₁(Cl) + ΔH_lattice. Using Hess's law: ΔH_lattice = ΔHf − ΔHat(Na) − ½ΔHdiss(Cl₂) − IE₁(Na) − EA₁(Cl). Lattice enthalpy is exothermic (−ve) for formation.",
    examiner_note:"All steps must be included: atomisation of Na, atomisation of Cl, IE₁ of Na, EA₁ of Cl, formation enthalpy. Missing any step loses marks." },

  { id:"cc502", board:CIE, subject:"chemistry", unit:"9701-T5", unitLabel:"Chapter 5 · Chemical Energetics", topic:"Chemical Energetics",
    question:"Why is the experimental lattice enthalpy of AgI significantly different from the theoretical value?",
    answer:"The theoretical lattice enthalpy assumes a purely ionic model. AgI has significant covalent character due to the polarisation of the large, polarisable I⁻ ion by the small, highly charged Ag⁺ ion (Fajans' rules). This covalent character makes the real lattice enthalpy more negative than the theoretical value.",
    examiner_note:"Always reference Fajans' rules (small highly-charged cation + large polarisable anion = covalent character). This specific example appears frequently." },

  // --- Chapter 7 · Equilibria ---
  { id:"cc701", board:CIE, subject:"chemistry", unit:"9701-T7", unitLabel:"Chapter 7 · Equilibria", topic:"Equilibria",
    question:"For N₂O₄(g) ⇌ 2NO₂(g), explain the effect of increasing pressure on the position of equilibrium and the value of Kp.",
    answer:"Increasing pressure shifts equilibrium to the left (towards fewer moles of gas, to decrease pressure — Le Chatelier). Position of equilibrium shifts towards N₂O₄. However, Kp is unchanged because temperature has not changed (Kp only changes with temperature).",
    examiner_note:"Two separate points: (1) direction of shift with reason (fewer moles of gas), (2) Kp unchanged. Many students say Kp increases when pressure increases — this is wrong." },

  // --- Chapter 8 · Reaction Kinetics ---
  { id:"cc801", board:CIE, subject:"chemistry", unit:"9701-T8", unitLabel:"Chapter 8 · Reaction Kinetics", topic:"Reaction Kinetics",
    question:"From the following initial rate data, determine the rate equation and rate constant k.",
    answer:"Method: compare experiments where one concentration doubles. If rate doubles → first order; rate quadruples → second order; rate unchanged → zero order. Write rate = k[A]ᵐ[B]ⁿ. Substitute a known experiment to calculate k. State units of k.",
    examiner_note:"Show the ratio method explicitly: rate₂/rate₁ = (conc₂/conc₁)^order. Always state units of k derived from the rate equation." },

  // --- Chapter 10 · Group 2 ---
  { id:"cc1001", board:CIE, subject:"chemistry", unit:"9701-T10", unitLabel:"Chapter 10 · Group 2", topic:"Group 2",
    question:"Explain why the solubility of hydroxides increases but the solubility of sulfates decreases down Group 2.",
    answer:"Hydroxide solubility increases: as cation size increases down the group, lattice enthalpy decreases (less energy to overcome) but hydration enthalpy also decreases — overall ΔHsol becomes less endothermic (or exothermic). Sulfate solubility decreases: SO₄²⁻ is large; for small cations (Mg²⁺) hydration enthalpy is large enough to dissolve despite high lattice enthalpy; for large cations (Ba²⁺) hydration enthalpy is too small to overcome lattice enthalpy.",
    examiner_note:"This is difficult and regularly tested. Key: lattice enthalpy and hydration enthalpy both decrease down group, but at different rates." },

  // --- Chapter 11 · Group 17 ---
  { id:"cc1101", board:CIE, subject:"chemistry", unit:"9701-T11", unitLabel:"Chapter 11 · Group 17", topic:"Group 17",
    question:"Describe the reactions of chlorine with cold dilute and hot concentrated NaOH.",
    answer:"Cold dilute NaOH: Cl₂ + 2NaOH → NaCl + NaOCl + H₂O (disproportionation; Cl₂ is both oxidised to +1 and reduced to −1). Hot concentrated NaOH: 3Cl₂ + 6NaOH → 5NaCl + NaClO₃ + 3H₂O (Cl is reduced to −1 and oxidised to +5).",
    examiner_note:"Products differ with temperature: NaOCl (bleach) in cold; NaClO₃ in hot. Disproportionation must be identified." },

  // --- Chapter 14/27 · Arenes ---
  { id:"cc1401", board:CIE, subject:"chemistry", unit:"9701-T27", unitLabel:"Chapter 27 · Arenes", topic:"Arenes",
    question:"Explain why benzene is more stable than expected from the Kekulé structure.",
    answer:"The Kekulé structure predicts three C=C bonds and suggests ΔH hydrogenation = 3 × (−120) = −360 kJ mol⁻¹. Measured ΔH hydrogenation = −208 kJ mol⁻¹. The difference (~150 kJ mol⁻¹) is the delocalisation (resonance) energy — benzene is 150 kJ mol⁻¹ more stable than expected due to delocalization of 6 π electrons over the ring.",
    examiner_note:"Must quote both predicted and actual ΔH hydrogenation values. The 'missing' energy = delocalisation energy = extra stability." },

  // --- Chapter 28 · Transition Elements ---
  { id:"cc2801", board:CIE, subject:"chemistry", unit:"9701-T28", unitLabel:"Chapter 28 · Transition Elements", topic:"Transition Elements",
    question:"Define a transition element and explain why Sc and Zn are not considered transition metals.",
    answer:"A transition element is a d-block element that forms at least one stable ion with a partially filled d sub-shell. Sc only forms Sc³⁺ with configuration [Ar]3d⁰ (empty d). Zn only forms Zn²⁺ with [Ar]3d¹⁰ (full d). Neither has a partially filled d sub-shell in any stable ion.",
    examiner_note:"'Partially filled' in at least one stable ion — critical wording. Not 'in its ground state atom'." },

  { id:"cc2802", board:CIE, subject:"chemistry", unit:"9701-T28", unitLabel:"Chapter 28 · Transition Elements", topic:"Transition Elements",
    question:"Describe the colour changes when aqueous ammonia is added dropwise, then in excess, to iron(III) chloride solution.",
    answer:"Dropwise NH₃: brown precipitate of Fe(OH)₃ forms. Excess NH₃: precipitate does NOT dissolve (Fe(OH)₃ does not form a complex with NH₃). Contrast with Cu²⁺ (Cu(OH)₂ dissolves in excess NH₃ to give deep blue).",
    examiner_note:"Fe³⁺ precipitate does NOT dissolve in excess NH₃ — this contrast with Cu²⁺ (and Cr³⁺ which dissolves in excess NH₃) is regularly tested." },

  // ══════════════════════════════════════════════════════════════
  // CIE A LEVEL BIOLOGY 9700
  // ══════════════════════════════════════════════════════════════

  // --- Chapter 2 · Cell Structure ---
  { id:"cb201", board:CIE, subject:"biology", unit:"9700-T2", unitLabel:"Chapter 2 · Cell Structure", topic:"Cell Structure",
    question:"Calculate the actual size of a cell if the image is 30 mm wide and the magnification is ×1000.",
    answer:"Actual size = image size / magnification = 30 mm / 1000 = 0.03 mm = 30 µm. (Remember: 1 mm = 1000 µm).",
    examiner_note:"Always convert to appropriate units. Check the magnification formula: magnification = image size / actual size. Don't confuse image size with actual size." },

  { id:"cb202", board:CIE, subject:"biology", unit:"9700-T2", unitLabel:"Chapter 2 · Cell Structure", topic:"Cell Structure",
    question:"Describe the role of the rough endoplasmic reticulum (rER) and Golgi apparatus in protein secretion.",
    answer:"Proteins synthesised on ribosomes attached to rER → proteins enter rER lumen → transported in vesicles → fuse with Golgi apparatus → proteins modified (glycosylation, folding) → packaged into secretory vesicles → vesicles fuse with cell surface membrane → proteins secreted by exocytosis.",
    examiner_note:"Correct sequence: rER → vesicles → Golgi → secretory vesicles → exocytosis. 'Packaged' and 'modified' in Golgi are required mark-scheme words." },

  // --- Chapter 3 · Biological Molecules ---
  { id:"cb301", board:CIE, subject:"biology", unit:"9700-T3", unitLabel:"Chapter 3 · Biological Molecules", topic:"Biological Molecules",
    question:"Describe the structure of DNA, including the types of bonds present.",
    answer:"Double helix of two antiparallel polynucleotide strands. Deoxyribose-phosphate backbone (joined by phosphodiester bonds). Complementary base pairing between strands: A pairs with T (2 hydrogen bonds); C pairs with G (3 hydrogen bonds). Strands held together by hydrogen bonds.",
    examiner_note:"'Antiparallel' — one strand runs 5'→3', the other 3'→5'. Hydrogen bond numbers (A-T: 2; C-G: 3) are tested directly." },

  { id:"cb302", board:CIE, subject:"biology", unit:"9700-T3", unitLabel:"Chapter 3 · Biological Molecules", topic:"Biological Molecules",
    question:"Compare the structures of α-helix and β-pleated sheet in proteins.",
    answer:"α-helix: polypeptide coils in a regular spiral; hydrogen bonds form between C=O of one amino acid and N-H of the amino acid 4 positions ahead (along the same chain). β-pleated sheet: polypeptide chains lie parallel or antiparallel; hydrogen bonds form between C=O and N-H groups on adjacent chains.",
    examiner_note:"Both are secondary structures held by hydrogen bonds. Specify which groups bond: C=O ···H-N. Don't confuse secondary (bonds along/between chains) with tertiary (between R groups)." },

  // --- Chapter 4 · Enzymes ---
  { id:"cb401", board:CIE, subject:"biology", unit:"9700-T4", unitLabel:"Chapter 4 · Enzymes", topic:"Enzymes",
    question:"Compare competitive and non-competitive inhibition of enzymes.",
    answer:"Competitive: inhibitor has complementary shape to active site; competes with substrate for active site; effect reduced by increasing [substrate]. Non-competitive: inhibitor binds elsewhere (allosteric site); changes shape of active site; substrate can no longer bind effectively; increasing [substrate] cannot overcome inhibition.",
    examiner_note:"Key difference: can increasing [substrate] overcome inhibition? Yes for competitive; No for non-competitive. Always include 'active site shape changes' for non-competitive." },

  // --- Chapter 5 · Cell Membranes & Transport ---
  { id:"cb501", board:CIE, subject:"biology", unit:"9700-T5", unitLabel:"Chapter 5 · Cell Membranes & Transport", topic:"Cell Membranes",
    question:"Describe how substances cross cell membranes by active transport.",
    answer:"Carrier proteins in the membrane bind specific molecules on the side of lower concentration. ATP is hydrolysed; energy is used to change the shape of the carrier protein; molecule is moved to the other side and released. Net transport is against the concentration gradient.",
    examiner_note:"Must include: carrier protein, against concentration gradient, ATP/energy required, shape change. Active transport moves specific molecules only (not bulk flow)." },

  // --- Chapter 12 · Energy and Respiration ---
  { id:"cb1201", board:CIE, subject:"biology", unit:"9700-T12", unitLabel:"Chapter 12 · Energy & Respiration", topic:"Respiration",
    question:"Describe the Krebs cycle and state the products per turn.",
    answer:"Acetyl-CoA (2C) combines with oxaloacetate (4C) → citrate (6C). Through a series of reactions, citrate is oxidised and decarboxylated → oxaloacetate regenerated. Per turn: 3 NADH (reduced NAD), 1 FADH₂ (reduced FAD), 1 ATP (substrate-level phosphorylation), 2 CO₂ released.",
    examiner_note:"'Per turn' means per acetyl-CoA. Two turns per glucose. 'Decarboxylation' earns a mark — CO₂ is not just 'produced'." },

  // --- Chapter 13 · Photosynthesis ---
  { id:"cb1301", board:CIE, subject:"biology", unit:"9700-T13", unitLabel:"Chapter 13 · Photosynthesis", topic:"Photosynthesis",
    question:"Explain what would happen to the levels of RuBP and GP in a plant if it is suddenly placed in the dark.",
    answer:"In the dark: light-dependent reactions stop → no ATP or NADPH produced. The Calvin cycle: GP cannot be reduced to G3P (no ATP/NADPH). RuBP cannot be regenerated (no G3P). CO₂ fixation continues briefly using remaining RuBisCO and RuBP. Therefore: RuBP falls (not regenerated); GP rises (accumulates as it can't be reduced).",
    examiner_note:"Classic 'change the conditions' question. Track each metabolite: RuBP is used in fixation but not remade → falls. GP is made by fixation but not reduced → rises." },

  // ══════════════════════════════════════════════════════════════
  // CIE A LEVEL PHYSICS 9702
  // ══════════════════════════════════════════════════════════════

  // --- Chapter 1 · Physical Quantities and Units ---
  { id:"cp101", board:CIE, subject:"physics", unit:"9702-T1", unitLabel:"Chapter 1 · Physical Quantities & Units", topic:"Units",
    question:"Show that the unit of electric field strength can be expressed as V m⁻¹.",
    answer:"Electric field strength E = F/Q: units = N C⁻¹. Voltage V = Work/charge: units = J C⁻¹ = N m C⁻¹. Therefore N C⁻¹ = N m C⁻¹ / m = V m⁻¹. Shown.",
    examiner_note:"Unit derivation questions require showing the algebraic steps clearly. Both N C⁻¹ and V m⁻¹ are accepted as correct units of E." },

  // --- Chapter 3 · Dynamics ---
  { id:"cp301", board:CIE, subject:"physics", unit:"9702-T3", unitLabel:"Chapter 3 · Dynamics", topic:"Dynamics",
    question:"A ball of mass 0.5 kg moving at 4 m s⁻¹ collides with a stationary ball of mass 1.5 kg. If they stick together, find the velocity after collision and state whether kinetic energy is conserved.",
    answer:"Conservation of momentum: 0.5 × 4 + 1.5 × 0 = (0.5 + 1.5) × v → v = 2/2 = 1 m s⁻¹. KE before = ½(0.5)(4²) = 4 J. KE after = ½(2)(1²) = 1 J. KE lost = 3 J. Not an elastic collision — kinetic energy is NOT conserved (inelastic).",
    examiner_note:"Two separate marks: (1) correct velocity using momentum conservation; (2) state whether elastic/inelastic with evidence (compare KE before/after)." },

  // --- Chapter 13 · Oscillations ---
  { id:"cp1301", board:CIE, subject:"physics", unit:"9702-T13", unitLabel:"Chapter 13 · Oscillations & Waves", topic:"Oscillations",
    question:"An SHM oscillator has amplitude A = 5 cm and frequency 2 Hz. Write equations for displacement, velocity and acceleration.",
    answer:"ω = 2πf = 4π rad s⁻¹. x = 5 cos(4πt) cm [or sin depending on initial conditions]. v = −20π sin(4πt) cm s⁻¹. Maximum v = Aω = 5 × 4π = 20π cm s⁻¹. a = −x ω² = −5ω² cos(4πt); max a = Aω² = 5(4π)² ≈ 789 cm s⁻².",
    examiner_note:"Always define ω first. State maximum values (at equilibrium for v; at extremes for a). Check: a = −ω²x is the defining equation of SHM." },

  // --- Chapter 20 · Magnetic Fields ---
  { id:"cp2001", board:CIE, subject:"physics", unit:"9702-T20", unitLabel:"Chapter 20 · Magnetic Fields", topic:"Electromagnetic Induction",
    question:"A rectangular coil is rotated in a uniform magnetic field. Sketch how the induced EMF varies with angle and explain the shape.",
    answer:"EMF is maximum when the coil plane is parallel to B (flux linkage changes fastest; rate of change of flux maximum). EMF is zero when coil plane is perpendicular to B (at that instant flux is maximum but rate of change = 0). EMF varies as a sine curve: ε = ε₀ sin(ωt).",
    examiner_note:"Key: EMF ∝ rate of change of flux linkage (Faraday's law). Maximum EMF ≠ maximum flux linkage — they occur 90° apart." },

  // ══════════════════════════════════════════════════════════════
  // CIE A LEVEL MATHEMATICS 9709
  // ══════════════════════════════════════════════════════════════

  // --- Pure 1 ---
  { id:"cm101", board:CIE, subject:"mathematics", unit:"9709-P1", unitLabel:"Pure 1 · Algebra, Functions & Calculus", topic:"Quadratics",
    question:"Find the range of values of k for which x² + kx + 4 > 0 for all real x.",
    answer:"For the quadratic to be always positive: discriminant < 0. b² − 4ac < 0 → k² − 16 < 0 → (k−4)(k+4) < 0 → −4 < k < 4.",
    examiner_note:"Always use discriminant < 0 for 'no real roots' / 'always positive' for a quadratic with positive leading coefficient. Must show algebraic steps." },

  { id:"cm102", board:CIE, subject:"mathematics", unit:"9709-P1", unitLabel:"Pure 1 · Algebra, Functions & Calculus", topic:"Coordinate Geometry",
    question:"Find the equation of the tangent to the circle x² + y² − 4x + 2y = 20 at the point (6, 2).",
    answer:"Complete the square: (x−2)² + (y+1)² = 25. Centre = (2, −1). Radius to (6, 2): gradient = (2−(−1))/(6−2) = 3/4. Tangent is perpendicular: gradient = −4/3. Equation: y − 2 = −4/3(x − 6) → 3y − 6 = −4x + 24 → 4x + 3y = 30.",
    examiner_note:"Key steps: find centre by completing the square, find gradient of radius, use perpendicular gradient for tangent." },

  // --- Pure 2/3 ---
  { id:"cm201", board:CIE, subject:"mathematics", unit:"9709-P23", unitLabel:"Pure 2/3 · Further Calculus & Algebra", topic:"Integration",
    question:"Find ∫sin²x dx.",
    answer:"Use double angle: sin²x = ½(1 − cos 2x). ∫sin²x dx = ∫½(1 − cos 2x) dx = x/2 − (sin 2x)/4 + c.",
    examiner_note:"Must use the cos 2x identity — cannot integrate sin²x directly. This technique is essential for all even powers of sin/cos." },

  { id:"cm202", board:CIE, subject:"mathematics", unit:"9709-P23", unitLabel:"Pure 2/3 · Further Calculus & Algebra", topic:"Vectors",
    question:"Lines l₁ and l₂ have equations r = (1, 2, 3) + s(2, 1, −1) and r = (2, 3, 0) + t(1, −1, 2). Do they intersect?",
    answer:"Set equal: 1+2s = 2+t; 2+s = 3−t; 3−s = 2t. From equations 1 and 2: adding gives 3+3s = 5, so s=2/3 and t=1/3. Check in equation 3: 3−2/3 = 7/3 and 2(1/3) = 2/3. 7/3 ≠ 2/3, so lines do NOT intersect (skew in 3D).",
    examiner_note:"Must check ALL THREE equations — solving two may give a consistent solution but the third equation may fail. Lines may be skew (not intersecting, not parallel)." },

  // --- Statistics 1 ---
  { id:"cm301", board:CIE, subject:"mathematics", unit:"9709-S1", unitLabel:"Statistics 1 · Probability & Distributions", topic:"Normal Distribution",
    question:"X ~ N(70, 100). Find P(65 < X < 80).",
    answer:"σ = √100 = 10. P(65 < X < 80) = P((65−70)/10 < Z < (80−70)/10) = P(−0.5 < Z < 1.0) = Φ(1.0) − Φ(−0.5) = 0.8413 − (1−0.6915) = 0.8413 − 0.3085 = 0.5328.",
    examiner_note:"Note: N(70, 100) means µ=70, σ²=100 so σ=10. P(Z < −0.5) = 1 − P(Z < 0.5) using symmetry of normal distribution." },

  // --- Mechanics 1 ---
  { id:"cm401", board:CIE, subject:"mathematics", unit:"9709-M1", unitLabel:"Mechanics 1 · Forces & Motion", topic:"Connected Particles",
    question:"Two particles of mass 3 kg and 5 kg are connected by a light string over a smooth pulley. Find the acceleration and tension.",
    answer:"Net force = (5−3)g = 2 × 9.8 = 19.6 N. Total mass = 8 kg. a = 19.6/8 = 2.45 m s⁻². Tension: For 3 kg: T − 3g = 3a → T = 3(9.8 + 2.45) = 36.75 N.",
    examiner_note:"Must write separate equations for each particle. 'Smooth pulley' means same tension throughout the string. Verify T using the 5 kg equation: 5g − T = 5a → 49 − 36.75 = 12.25 = 5(2.45) ✓." },

];

// Derive unique boards, subjects and units from the data
export const BOARDS_AVAILABLE: Board[] = ["edexcel-ial", "cie"];

export const TOPICS_BY_BOARD: Record<string, string[]> = {
  "edexcel-ial": Array.from(new Set(EXAM_FAQS.filter(f => f.board === "edexcel-ial").map(f => f.topic))).sort(),
  "cie": Array.from(new Set(EXAM_FAQS.filter(f => f.board === "cie").map(f => f.topic))).sort(),
};

export const UNITS_BY_BOARD_SUBJECT = (board: Board, subject: SubjectCode) =>
  Array.from(
    new Map(
      EXAM_FAQS
        .filter(f => f.board === board && f.subject === subject)
        .map(f => [f.unit, f.unitLabel])
    ).entries()
  );
