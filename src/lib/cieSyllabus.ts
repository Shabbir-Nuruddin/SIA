// Cambridge International A Level — full syllabus content for the 4 supported subjects.
// Codes: 9709 Mathematics, 9700 Biology, 9701 Chemistry, 9702 Physics.
// Each topic carries the official assessment-statement-level content (paraphrased to plain text)
// so the AI can generate notes / questions / mark schemes that stay strictly within scope.

import type { SubjectCode, SubjectMeta } from "./subjects";

export interface CIESyllabusStatement { ref: string; text: string; }
export interface CIESyllabusTopic {
  number: number;
  name: string;
  unit: number;     // CIE component number (1 = Paper 1 component, etc.)
  statements: CIESyllabusStatement[];
}

// === CHEMISTRY 9701 ===
export const CIE_CHEMISTRY_TOPICS: CIESyllabusTopic[] = [
  { number: 1, unit: 1, name: "Atoms, molecules and stoichiometry", statements: [
    { ref: "1.1", text: "relative atomic, isotopic, molecular and formula masses on the 12C scale" },
    { ref: "1.2", text: "use of mass spectra to determine relative isotopic and atomic masses; analyse Cl2/Br2 spectra" },
    { ref: "1.3", text: "the mole, Avogadro constant; mole calculations including reacting masses, gas volumes (using molar gas volume), solution concentrations" },
    { ref: "1.4", text: "use of pV = nRT for ideal gases" },
    { ref: "1.5", text: "empirical and molecular formulae from composition data" },
    { ref: "1.6", text: "balanced full and ionic equations including state symbols; reacting quantities calculations including limiting reagent and percentage yield" },
  ]},
  { number: 2, unit: 1, name: "Atomic structure", statements: [
    { ref: "2.1", text: "particles in the atom: relative mass and charge of protons, neutrons and electrons; nuclide notation; isotopes" },
    { ref: "2.2", text: "behaviour of protons, neutrons and electrons in electric fields" },
    { ref: "2.3", text: "electronic configuration: shells, subshells (s, p, d) and orbitals; filling order; electrons-in-boxes" },
    { ref: "2.4", text: "shapes of s and p orbitals; relative energies of subshells in a shell" },
    { ref: "2.5", text: "ionisation energies: definition of 1st, 2nd, successive; trends across periods 2 and 3 and down a group; evidence for shell and subshell structure" },
  ]},
  { number: 3, unit: 1, name: "Chemical bonding", statements: [
    { ref: "3.1", text: "ionic bonding: lattice formation, factors affecting strength (charge, ionic radius)" },
    { ref: "3.2", text: "covalent bonding: dot-and-cross diagrams; sigma and pi bonds; multiple bonds; dative covalent bonding" },
    { ref: "3.3", text: "shapes and bond angles using VSEPR for up to six electron pairs (e.g. BF3, CO2, CH4, NH3, H2O, SF6, PCl5)" },
    { ref: "3.4", text: "electronegativity; bond polarity; molecular polarity" },
    { ref: "3.5", text: "intermolecular forces: instantaneous dipole-induced dipole, permanent dipole-dipole, hydrogen bonding; effect on physical properties (mp, bp, solubility)" },
    { ref: "3.6", text: "metallic bonding: sea of delocalised electrons; explain conductivity, mp, malleability" },
    { ref: "3.7", text: "structures and properties of giant covalent (diamond, graphite, silicon(IV) oxide), simple molecular and ionic lattices" },
  ]},
  { number: 4, unit: 1, name: "States of matter", statements: [
    { ref: "4.1", text: "ideal gas behaviour and deviations; conditions when real gases approach ideal" },
    { ref: "4.2", text: "use pV = nRT in calculations including determining Mr" },
    { ref: "4.3", text: "lattice structures: ionic (NaCl), simple molecular (I2, ice), giant molecular (graphite, diamond, SiO2), metallic (Cu)" },
    { ref: "4.4", text: "explain physical properties of substances from structure and bonding" },
  ]},
  { number: 5, unit: 1, name: "Chemical energetics", statements: [
    { ref: "5.1", text: "enthalpy change ΔH; standard conditions (298 K, 100 kPa); exo and endothermic" },
    { ref: "5.2", text: "standard enthalpies: formation, combustion, neutralisation, atomisation, hydration, solution" },
    { ref: "5.3", text: "calculate ΔH from q = mcΔT; from Hess cycles; from bond energies (mean bond enthalpies)" },
    { ref: "5.4", text: "construct energy/enthalpy level diagrams" },
  ]},
  { number: 6, unit: 1, name: "Electrochemistry", statements: [
    { ref: "6.1", text: "redox in terms of electron transfer and oxidation numbers; rules for assigning ON" },
    { ref: "6.2", text: "construct ionic half-equations and overall redox equations" },
    { ref: "6.3", text: "use of oxidation numbers in nomenclature (Roman numerals)" },
  ]},
  { number: 7, unit: 1, name: "Equilibria", statements: [
    { ref: "7.1", text: "dynamic equilibrium in closed systems; Le Chatelier's principle (T, p, concentration); industrial applications (Haber, Contact)" },
    { ref: "7.2", text: "Kc expressions and units; calculations from equilibrium concentrations" },
    { ref: "7.3", text: "Brønsted–Lowry acids and bases; conjugate pairs" },
    { ref: "7.4", text: "use of pH = -log[H+]; strong vs weak acids; pH calculations for strong monobasic acids and bases" },
  ]},
  { number: 8, unit: 1, name: "Reaction kinetics (AS)", statements: [
    { ref: "8.1", text: "definition of rate; collision theory; activation energy" },
    { ref: "8.2", text: "Maxwell–Boltzmann distribution; effect of T on rate; effect of catalysts" },
    { ref: "8.3", text: "homogeneous vs heterogeneous catalysts; mechanism of catalysis" },
  ]},
  { number: 9, unit: 1, name: "The Periodic Table — chemical periodicity", statements: [
    { ref: "9.1", text: "periodic trends in atomic radius, ionic radius, melting points, electrical conductivity, electronegativity, first IE across period 3" },
    { ref: "9.2", text: "reactions of period 3 elements with O2 and Cl2; equations; pH of resulting oxides/chlorides in water" },
    { ref: "9.3", text: "trends in acid-base behaviour of oxides and hydroxides across period 3" },
  ]},
  { number: 10, unit: 1, name: "Group 2 chemistry", statements: [
    { ref: "10.1", text: "reactions with O2, H2O, dilute acid; trends in reactivity down the group" },
    { ref: "10.2", text: "thermal stability of nitrates and carbonates and trend down the group; explanation in terms of polarising power of the cation" },
    { ref: "10.3", text: "qualitative tests for cations using flame tests" },
  ]},
  { number: 11, unit: 1, name: "Group 17 chemistry", statements: [
    { ref: "11.1", text: "trends in physical properties (volatility, colour) and oxidising power down the group" },
    { ref: "11.2", text: "displacement reactions of halide ions by halogens" },
    { ref: "11.3", text: "reactions of halide ions with concentrated H2SO4; reducing power of halides" },
    { ref: "11.4", text: "disproportionation of Cl2 in cold and hot NaOH and in water; uses in water treatment and bleach" },
    { ref: "11.5", text: "qualitative tests for halide ions with AgNO3/NH3" },
  ]},
  { number: 12, unit: 1, name: "Nitrogen and sulfur", statements: [
    { ref: "12.1", text: "industrial importance of N2 (low reactivity) and ammonia (Haber); environmental issues — NOx and acid rain" },
    { ref: "12.2", text: "SO2 as an atmospheric pollutant; equations for acid rain formation; uses of SO2 in flue-gas desulfurisation" },
  ]},
  { number: 13, unit: 1, name: "Introduction to organic chemistry", statements: [
    { ref: "13.1", text: "homologous series, general formulae; nomenclature for alkanes, alkenes, halogenoalkanes, alcohols, aldehydes, ketones, carboxylic acids, esters" },
    { ref: "13.2", text: "structural and stereoisomerism (cis–trans, E–Z, optical)" },
    { ref: "13.3", text: "homolytic and heterolytic bond fission; free radicals; nucleophiles and electrophiles; curly arrow conventions" },
  ]},
  { number: 14, unit: 1, name: "Hydrocarbons (alkanes & alkenes)", statements: [
    { ref: "14.1", text: "alkanes: combustion (complete and incomplete); free-radical substitution mechanism with halogens (initiation, propagation, termination)" },
    { ref: "14.2", text: "alkanes from crude oil — fractional distillation, cracking, reforming" },
    { ref: "14.3", text: "alkenes: addition reactions with H2/Ni, halogens, HX, H2O/H2SO4, KMnO4/H+ to diol" },
    { ref: "14.4", text: "electrophilic addition mechanism (HBr, Br2 to ethene; HBr to propene with Markovnikov); carbocation stability (1°<2°<3°)" },
    { ref: "14.5", text: "addition polymerisation; recognise repeat unit and monomer; environmental issues" },
  ]},
  { number: 15, unit: 1, name: "Halogenoalkanes", statements: [
    { ref: "15.1", text: "classification 1°/2°/3°" },
    { ref: "15.2", text: "nucleophilic substitution: SN1 (3°) and SN2 (1°) mechanisms with curly arrows" },
    { ref: "15.3", text: "reactions with NaOH(aq), KCN(alc), NH3(alc), and elimination with KOH(alc)" },
    { ref: "15.4", text: "comparative hydrolysis rates of C–Cl, C–Br, C–I; bond enthalpies" },
    { ref: "15.5", text: "uses and environmental issues — CFCs and the ozone layer" },
  ]},
  { number: 16, unit: 1, name: "Hydroxy compounds (alcohols)", statements: [
    { ref: "16.1", text: "classification of alcohols 1°/2°/3°" },
    { ref: "16.2", text: "preparation from halogenoalkanes (hydrolysis) and alkenes (acid-catalysed hydration)" },
    { ref: "16.3", text: "reactions: combustion; oxidation with K2Cr2O7/H+ to aldehyde/carboxylic acid (1°), ketone (2°); resistance of 3°" },
    { ref: "16.4", text: "esterification with carboxylic acids/H2SO4; dehydration to alkenes; halogenation with PCl3, PCl5, SOCl2, HX" },
    { ref: "16.5", text: "tri-iodomethane reaction (CH3CH(OH)–) with I2/OH−" },
  ]},
  { number: 17, unit: 1, name: "Carbonyl compounds — aldehydes & ketones", statements: [
    { ref: "17.1", text: "preparation from oxidation of alcohols" },
    { ref: "17.2", text: "reduction with NaBH4 to alcohols" },
    { ref: "17.3", text: "addition of HCN/KCN to give hydroxynitriles; mechanism (nucleophilic addition with curly arrows)" },
    { ref: "17.4", text: "qualitative distinction: 2,4-DNPH (orange ppt), Tollens', Fehling's/Benedict's, tri-iodomethane" },
  ]},
  { number: 18, unit: 1, name: "Carboxylic acids and derivatives", statements: [
    { ref: "18.1", text: "preparation by oxidation of 1° alcohols/aldehydes; hydrolysis of nitriles" },
    { ref: "18.2", text: "acidity of carboxylic acids; reactions with bases, carbonates, metals" },
    { ref: "18.3", text: "ester formation with alcohols/H2SO4; hydrolysis (acid and alkaline)" },
    { ref: "18.4", text: "uses of esters" },
  ]},
  { number: 19, unit: 1, name: "Nitrogen compounds (AS scope)", statements: [
    { ref: "19.1", text: "primary amines: preparation from halogenoalkanes + NH3; basicity" },
    { ref: "19.2", text: "amino acids: zwitterion structure; behaviour in acid and alkali" },
  ]},
  { number: 20, unit: 1, name: "Polymerisation", statements: [
    { ref: "20.1", text: "addition vs condensation polymerisation; identify monomers from repeat units; recognise polyamides and polyesters" },
    { ref: "20.2", text: "biodegradability and disposal issues; recycling" },
  ]},
  { number: 21, unit: 1, name: "Organic synthesis & analysis (AS)", statements: [
    { ref: "21.1", text: "design 2- or 3-step synthetic routes between functional groups studied" },
    { ref: "21.2", text: "infrared spectroscopy: identify functional groups from absorption ranges (O–H, N–H, C=O, C–O, C=C)" },
    { ref: "21.3", text: "mass spectrometry of organic compounds: M+ peak and fragmentation" },
  ]},
  // === A2 (Paper 4 / Paper 5) ===
  { number: 22, unit: 4, name: "Chemical energetics II", statements: [
    { ref: "22.1", text: "lattice energy; Born–Haber cycles for ionic compounds; factors affecting LE (charge, ionic radius)" },
    { ref: "22.2", text: "enthalpies of hydration and solution; explanation of trends" },
    { ref: "22.3", text: "entropy ΔS as disorder; predict sign; calculate ΔS from standard entropies" },
    { ref: "22.4", text: "Gibbs free energy ΔG = ΔH − TΔS; spontaneity criteria; effect of T" },
  ]},
  { number: 23, unit: 4, name: "Electrochemistry II", statements: [
    { ref: "23.1", text: "standard electrode potentials E°; standard hydrogen electrode" },
    { ref: "23.2", text: "calculate Ecell° and predict feasibility of redox reactions" },
    { ref: "23.3", text: "use of Nernst equation (qualitative effect of concentration)" },
    { ref: "23.4", text: "electrolysis: products at electrodes; calculations using F = 96500 C mol−1" },
    { ref: "23.5", text: "industrial uses — Al extraction, electroplating, fuel cells" },
  ]},
  { number: 24, unit: 4, name: "Equilibria II — Kp, ionic, buffers", statements: [
    { ref: "24.1", text: "Kp expressions in terms of partial pressures; calculations" },
    { ref: "24.2", text: "Brønsted–Lowry conjugate pairs; Ka, Kb, pKa, pKb; calculations for weak acids" },
    { ref: "24.3", text: "Kw and pH of strong/weak acids and bases" },
    { ref: "24.4", text: "buffer solutions: action; calculations with Henderson–Hasselbalch" },
    { ref: "24.5", text: "titration curves (4 combinations); choice of indicators" },
    { ref: "24.6", text: "solubility product Ksp; common ion effect; predict precipitation" },
  ]},
  { number: 25, unit: 4, name: "Reaction kinetics II", statements: [
    { ref: "25.1", text: "rate equation rate = k[A]^m[B]^n; orders, k and overall order" },
    { ref: "25.2", text: "deduce orders from concentration-time and rate-concentration graphs and initial rates" },
    { ref: "25.3", text: "half-life; constant t½ ⇒ first order" },
    { ref: "25.4", text: "rate-determining step from rate equation; deduce mechanism" },
    { ref: "25.5", text: "Arrhenius equation k = A e^(−Ea/RT); use to find Ea graphically" },
    { ref: "25.6", text: "homogeneous and heterogeneous catalysis with examples (Fe in Haber, V2O5 in Contact)" },
  ]},
  { number: 26, unit: 4, name: "Group 2 and transition elements (A2)", statements: [
    { ref: "26.1", text: "general properties of transition elements: variable oxidation states, coloured ions, catalytic activity, complex ion formation" },
    { ref: "26.2", text: "ligands and complex ions; coordination number; shapes (octahedral, tetrahedral, square planar, linear)" },
    { ref: "26.3", text: "ligand exchange reactions of Cu2+, Co2+; colour changes; stability constants Kstab" },
    { ref: "26.4", text: "redox chemistry of Mn and Cr; titrations with KMnO4 and K2Cr2O7" },
    { ref: "26.5", text: "qualitative analysis: cations (NH3, NaOH), anions (CO3^2-, NO3-, SO4^2-, halides)" },
  ]},
  { number: 27, unit: 4, name: "Hydrocarbons & arenes (A2)", statements: [
    { ref: "27.1", text: "benzene structure: delocalised pi system; evidence (enthalpy of hydrogenation, bond lengths, lack of addition reactions)" },
    { ref: "27.2", text: "electrophilic substitution: nitration, halogenation (with halogen carrier), Friedel–Crafts alkylation/acylation; mechanisms" },
    { ref: "27.3", text: "directing effects (activating/deactivating; ortho/para vs meta) of substituents on benzene" },
    { ref: "27.4", text: "phenol: acidity, reactions with NaOH and Na; reactivity of ring (bromination without catalyst)" },
  ]},
  { number: 28, unit: 4, name: "Organic nitrogen compounds (A2)", statements: [
    { ref: "28.1", text: "amines: basicity comparison (alkyl vs aryl); preparation routes" },
    { ref: "28.2", text: "amides: structure and hydrolysis; formation from acyl chlorides" },
    { ref: "28.3", text: "amino acids: isoelectric point; peptide bond formation" },
    { ref: "28.4", text: "proteins: primary, secondary, tertiary, quaternary structures; bonding interactions" },
  ]},
  { number: 29, unit: 4, name: "Polymerisation II & analysis", statements: [
    { ref: "29.1", text: "condensation polymers — polyamides (Nylon-6,6, Kevlar), polyesters (Terylene); identify monomers and bonds" },
    { ref: "29.2", text: "biodegradability; PLA; comparison with addition polymers" },
    { ref: "29.3", text: "13C NMR and 1H NMR: chemical shift, integration, splitting (n+1 rule); deduce structures from NMR + IR + MS" },
    { ref: "29.4", text: "chromatography: TLC, GLC and HPLC qualitative principles; Rf values" },
  ]},
];

// === BIOLOGY 9700 ===
export const CIE_BIOLOGY_TOPICS: CIESyllabusTopic[] = [
  { number: 1, unit: 1, name: "Cell structure", statements: [
    { ref: "1.1", text: "use of light and electron microscopes; magnification, resolution, calculation of size" },
    { ref: "1.2", text: "ultrastructure of eukaryotic cells (animal and plant); functions of organelles (nucleus, RER, SER, ribosomes, Golgi, mitochondria, chloroplasts, lysosomes, centrioles, microtubules)" },
    { ref: "1.3", text: "differences between prokaryotic and eukaryotic cells; structure of bacterial cells" },
    { ref: "1.4", text: "structure of viruses (TMV, HIV) — non-cellular, capsid, no metabolism" },
  ]},
  { number: 2, unit: 1, name: "Biological molecules", statements: [
    { ref: "2.1", text: "structure and roles of water; hydrogen bonding; properties (solvent, thermal, density of ice)" },
    { ref: "2.2", text: "carbohydrates: monosaccharides (α/β glucose), disaccharides, polysaccharides (starch, glycogen, cellulose); structure-function" },
    { ref: "2.3", text: "lipids: triglycerides, phospholipids; saturated vs unsaturated; roles" },
    { ref: "2.4", text: "proteins: amino acid structure, peptide bond, primary/secondary/tertiary/quaternary; globular vs fibrous (haemoglobin, collagen)" },
    { ref: "2.5", text: "biochemical tests: Benedict's, biuret, iodine, emulsion test for lipids" },
  ]},
  { number: 3, unit: 1, name: "Enzymes", statements: [
    { ref: "3.1", text: "enzymes as biological catalysts; lock-and-key and induced fit models" },
    { ref: "3.2", text: "factors affecting enzyme activity: temperature, pH, substrate concentration, enzyme concentration" },
    { ref: "3.3", text: "competitive vs non-competitive inhibition; Vmax and Km concepts" },
    { ref: "3.4", text: "immobilised enzymes — uses and advantages" },
  ]},
  { number: 4, unit: 1, name: "Cell membranes & transport", statements: [
    { ref: "4.1", text: "fluid mosaic model; phospholipid bilayer; proteins (channel, carrier), cholesterol, glycoproteins, glycolipids" },
    { ref: "4.2", text: "diffusion, facilitated diffusion, osmosis (water potential), active transport, endo/exocytosis" },
    { ref: "4.3", text: "investigate water potential of plant tissues" },
  ]},
  { number: 5, unit: 1, name: "The mitotic cell cycle", statements: [
    { ref: "5.1", text: "stages of cell cycle: interphase (G1, S, G2), mitosis, cytokinesis" },
    { ref: "5.2", text: "stages of mitosis (prophase, metaphase, anaphase, telophase); identify in micrographs" },
    { ref: "5.3", text: "significance of mitosis in growth, repair, asexual reproduction" },
    { ref: "5.4", text: "stem cells; cancer as uncontrolled mitosis; tumour-suppressor genes and oncogenes" },
  ]},
  { number: 6, unit: 1, name: "Nucleic acids & protein synthesis", statements: [
    { ref: "6.1", text: "structure of DNA and RNA; complementary base pairing; semi-conservative replication" },
    { ref: "6.2", text: "transcription and translation; role of mRNA, tRNA, ribosomes" },
    { ref: "6.3", text: "genetic code: triplet, degenerate, universal" },
    { ref: "6.4", text: "gene mutation: substitution, deletion, insertion; effect on polypeptide" },
  ]},
  { number: 7, unit: 1, name: "Transport in plants", statements: [
    { ref: "7.1", text: "structure of xylem vessels and phloem sieve tubes; root, stem, leaf cross-section" },
    { ref: "7.2", text: "uptake of water and ions in roots (apoplast, symplast, vacuolar pathways)" },
    { ref: "7.3", text: "transpiration; cohesion-tension theory; potometers" },
    { ref: "7.4", text: "translocation in the phloem (mass-flow hypothesis); source and sink" },
  ]},
  { number: 8, unit: 1, name: "Transport in mammals", statements: [
    { ref: "8.1", text: "structure of arteries, veins, capillaries; tissue fluid formation" },
    { ref: "8.2", text: "structure of mammalian heart; cardiac cycle; SAN, AVN, ECG interpretation" },
    { ref: "8.3", text: "haemoglobin: oxygen dissociation curve; Bohr shift; fetal Hb; CO2 transport (chloride shift)" },
  ]},
  { number: 9, unit: 1, name: "Gas exchange", statements: [
    { ref: "9.1", text: "structure of human gas exchange system; alveoli adaptations" },
    { ref: "9.2", text: "ventilation mechanism; spirometer measurements" },
    { ref: "9.3", text: "smoking and lung disease — emphysema, lung cancer; cardiovascular effects" },
  ]},
  { number: 10, unit: 1, name: "Infectious disease", statements: [
    { ref: "10.1", text: "cholera, malaria, TB, HIV/AIDS, smallpox, measles: causative agents, transmission, prevention, control" },
    { ref: "10.2", text: "antibiotics: action and resistance; MRSA" },
  ]},
  { number: 11, unit: 1, name: "Immunity", statements: [
    { ref: "11.1", text: "primary defence (skin, mucous membranes); phagocytosis" },
    { ref: "11.2", text: "B-lymphocytes, T-lymphocytes (helper, cytotoxic); humoral and cell-mediated response" },
    { ref: "11.3", text: "structure of antibodies; how they work (agglutination, neutralisation)" },
    { ref: "11.4", text: "active vs passive, natural vs artificial immunity; vaccination programmes" },
    { ref: "11.5", text: "monoclonal antibodies — diagnosis and therapy" },
  ]},
  // A2
  { number: 12, unit: 4, name: "Energy & respiration", statements: [
    { ref: "12.1", text: "ATP: structure, synthesis, role as universal energy currency" },
    { ref: "12.2", text: "stages of aerobic respiration: glycolysis, link reaction, Krebs cycle, oxidative phosphorylation" },
    { ref: "12.3", text: "role of mitochondria; chemiosmosis" },
    { ref: "12.4", text: "anaerobic respiration in mammals (lactate) and yeast (ethanol)" },
    { ref: "12.5", text: "RQ values; respirometers" },
  ]},
  { number: 13, unit: 4, name: "Photosynthesis", statements: [
    { ref: "13.1", text: "chloroplast structure and adaptation" },
    { ref: "13.2", text: "light-dependent reactions: photolysis, photophosphorylation (cyclic and non-cyclic)" },
    { ref: "13.3", text: "light-independent reactions: Calvin cycle (RuBP, GP, TP); role of RuBisCO" },
    { ref: "13.4", text: "limiting factors: light intensity, CO2 concentration, temperature" },
  ]},
  { number: 14, unit: 4, name: "Homeostasis", statements: [
    { ref: "14.1", text: "negative feedback; importance of homeostasis" },
    { ref: "14.2", text: "kidney structure; ultrafiltration, selective reabsorption; ADH and water balance" },
    { ref: "14.3", text: "control of blood glucose: insulin, glucagon; type 1 vs type 2 diabetes" },
    { ref: "14.4", text: "plant homeostasis: stomatal control by ABA" },
  ]},
  { number: 15, unit: 4, name: "Coordination", statements: [
    { ref: "15.1", text: "neurones (sensory, motor, relay); resting and action potential; transmission across synapses" },
    { ref: "15.2", text: "endocrine vs nervous coordination" },
    { ref: "15.3", text: "muscle structure (sarcomere); sliding filament model; role of Ca2+ and ATP" },
    { ref: "15.4", text: "plant responses: auxins (IAA), gibberellins; tropisms" },
  ]},
  { number: 16, unit: 4, name: "Inherited change", statements: [
    { ref: "16.1", text: "meiosis and genetic variation: independent assortment, crossing over" },
    { ref: "16.2", text: "monohybrid and dihybrid inheritance; test crosses; chi-squared analysis" },
    { ref: "16.3", text: "sex linkage, codominance, multiple alleles, autosomal linkage; epistasis" },
    { ref: "16.4", text: "evolution: natural selection, types of selection (stabilising, directional, disruptive); Hardy–Weinberg" },
    { ref: "16.5", text: "speciation: allopatric and sympatric; artificial selection" },
  ]},
  { number: 17, unit: 4, name: "Selection & evolution", statements: [
    { ref: "17.1", text: "evidence for evolution; speciation processes" },
    { ref: "17.2", text: "molecular evidence (DNA, proteins); phylogenetic trees" },
  ]},
  { number: 18, unit: 4, name: "Classification, biodiversity & conservation", statements: [
    { ref: "18.1", text: "three-domain classification; binomial nomenclature; hierarchy" },
    { ref: "18.2", text: "Simpson's diversity index; biodiversity at species/genetic/ecosystem level" },
    { ref: "18.3", text: "in-situ vs ex-situ conservation; CITES; seed banks; assisted reproduction" },
  ]},
  { number: 19, unit: 4, name: "Genetic technology", statements: [
    { ref: "19.1", text: "PCR, gel electrophoresis, DNA sequencing, microarrays" },
    { ref: "19.2", text: "genetic engineering: restriction enzymes, ligase, vectors; recombinant insulin" },
    { ref: "19.3", text: "genetic screening, gene therapy; ethical issues" },
  ]},
];

// === PHYSICS 9702 ===
export const CIE_PHYSICS_TOPICS: CIESyllabusTopic[] = [
  { number: 1, unit: 1, name: "Physical quantities & units", statements: [
    { ref: "1.1", text: "SI base quantities and units; derived units; prefixes" },
    { ref: "1.2", text: "scalars and vectors; addition by graphical and trig methods; resolving" },
    { ref: "1.3", text: "homogeneity of units to check equations" },
    { ref: "1.4", text: "estimation; significant figures; uncertainties; combining uncertainties" },
  ]},
  { number: 2, unit: 1, name: "Kinematics", statements: [
    { ref: "2.1", text: "displacement, velocity, acceleration; distinguish from speed and distance" },
    { ref: "2.2", text: "graphs of motion: s–t, v–t; gradients and areas" },
    { ref: "2.3", text: "uniform acceleration equations (suvat); free fall and air resistance" },
    { ref: "2.4", text: "projectile motion: horizontal and vertical components" },
  ]},
  { number: 3, unit: 1, name: "Dynamics", statements: [
    { ref: "3.1", text: "Newton's laws of motion; F = ma" },
    { ref: "3.2", text: "linear momentum; conservation in collisions; elastic and inelastic" },
    { ref: "3.3", text: "weight, mass, gravitational field strength" },
  ]},
  { number: 4, unit: 1, name: "Forces, density, pressure", statements: [
    { ref: "4.1", text: "force as a vector; resultant; equilibrium of three coplanar forces" },
    { ref: "4.2", text: "moment, couple, torque; principle of moments; centre of gravity" },
    { ref: "4.3", text: "density; pressure in fluids p = ρgh; upthrust = ρgV" },
  ]},
  { number: 5, unit: 1, name: "Work, energy & power", statements: [
    { ref: "5.1", text: "work done W = Fs cosθ; principle of conservation of energy" },
    { ref: "5.2", text: "kinetic energy ½mv²; gravitational PE mgh; elastic PE" },
    { ref: "5.3", text: "power P = W/t; efficiency calculations" },
  ]},
  { number: 6, unit: 1, name: "Deformation of solids", statements: [
    { ref: "6.1", text: "Hooke's law; spring constant; elastic limit; force-extension graphs" },
    { ref: "6.2", text: "stress, strain, Young modulus; experimental determination" },
  ]},
  { number: 7, unit: 1, name: "Waves", statements: [
    { ref: "7.1", text: "transverse vs longitudinal; wavelength, frequency, period, speed (v = fλ)" },
    { ref: "7.2", text: "displacement-distance and displacement-time graphs; phase difference" },
    { ref: "7.3", text: "intensity ∝ amplitude²" },
    { ref: "7.4", text: "Doppler effect for moving source: fo = fs v/(v ± vs)" },
    { ref: "7.5", text: "EM spectrum; properties and uses" },
    { ref: "7.6", text: "polarisation of transverse waves" },
  ]},
  { number: 8, unit: 1, name: "Superposition", statements: [
    { ref: "8.1", text: "principle of superposition; coherence; interference; path difference" },
    { ref: "8.2", text: "two-source interference (Young's slits); λ = ax/D" },
    { ref: "8.3", text: "diffraction grating equation d sinθ = nλ" },
    { ref: "8.4", text: "stationary waves on strings and in air columns; nodes and antinodes; harmonics" },
  ]},
  { number: 9, unit: 1, name: "Electricity", statements: [
    { ref: "9.1", text: "current as rate of flow of charge; I = nAvq" },
    { ref: "9.2", text: "potential difference; emf; resistance; Ohm's law" },
    { ref: "9.3", text: "I-V characteristics for resistor, filament lamp, semiconductor diode, NTC thermistor" },
    { ref: "9.4", text: "resistivity ρ; effect of T on metals and semiconductors" },
    { ref: "9.5", text: "energy and power: E = IVt, P = IV = I²R = V²/R" },
  ]},
  { number: 10, unit: 1, name: "DC circuits", statements: [
    { ref: "10.1", text: "Kirchhoff's laws (current and voltage)" },
    { ref: "10.2", text: "series and parallel resistor combinations" },
    { ref: "10.3", text: "potential dividers; sensors using LDR, thermistor" },
    { ref: "10.4", text: "internal resistance and emf: V = ε − Ir" },
  ]},
  { number: 11, unit: 1, name: "Particle physics", statements: [
    { ref: "11.1", text: "atomic model; α-particle scattering experiment evidence for nucleus" },
    { ref: "11.2", text: "isotopes; nuclide notation" },
    { ref: "11.3", text: "fundamental particles: quarks (up, down, strange) and leptons" },
    { ref: "11.4", text: "β-decay involves quark transformation; weak interaction" },
  ]},
  // A2
  { number: 12, unit: 4, name: "Motion in a circle", statements: [
    { ref: "12.1", text: "angular displacement, angular velocity; ω = 2π/T = v/r" },
    { ref: "12.2", text: "centripetal acceleration a = v²/r = ω²r; centripetal force" },
    { ref: "12.3", text: "examples: vertical circle, banked tracks, conical pendulum" },
  ]},
  { number: 13, unit: 4, name: "Gravitational fields", statements: [
    { ref: "13.1", text: "Newton's law of gravitation F = GMm/r²" },
    { ref: "13.2", text: "gravitational field strength g = GM/r²; uniform near Earth" },
    { ref: "13.3", text: "gravitational potential φ = −GM/r; PE; relation g = −dφ/dr" },
    { ref: "13.4", text: "geostationary orbits; Kepler's third law" },
  ]},
  { number: 14, unit: 4, name: "Temperature & ideal gases", statements: [
    { ref: "14.1", text: "thermal equilibrium; thermodynamic temperature scale" },
    { ref: "14.2", text: "specific heat capacity, specific latent heat" },
    { ref: "14.3", text: "ideal gas law pV = NkT = nRT; root-mean-square speed" },
    { ref: "14.4", text: "internal energy as sum of random KE and PE of molecules" },
  ]},
  { number: 15, unit: 4, name: "Thermodynamics", statements: [
    { ref: "15.1", text: "first law of thermodynamics ΔU = q + w; sign conventions" },
    { ref: "15.2", text: "work done by/on a gas pΔV" },
  ]},
  { number: 16, unit: 4, name: "Oscillations (SHM)", statements: [
    { ref: "16.1", text: "definition of SHM (a = −ω²x); period and frequency" },
    { ref: "16.2", text: "x = x0 cos(ωt) etc.; v and a equations; energy in SHM" },
    { ref: "16.3", text: "free, damped (light, critical, heavy) and forced oscillations; resonance" },
  ]},
  { number: 17, unit: 4, name: "Electric fields", statements: [
    { ref: "17.1", text: "Coulomb's law F = Q1Q2/(4πε0 r²)" },
    { ref: "17.2", text: "electric field strength E = F/Q; uniform fields between plates E = V/d" },
    { ref: "17.3", text: "electric potential V = Q/(4πε0 r); PE; relation E = −dV/dr" },
  ]},
  { number: 18, unit: 4, name: "Capacitance", statements: [
    { ref: "18.1", text: "C = Q/V; combinations in series and parallel" },
    { ref: "18.2", text: "energy stored W = ½CV² = ½QV" },
    { ref: "18.3", text: "discharge through a resistor: V = V0 e^(−t/RC); time constant τ = RC" },
  ]},
  { number: 19, unit: 4, name: "Magnetic fields", statements: [
    { ref: "19.1", text: "F = BIL sinθ on current-carrying conductor; F = BQv on moving charge" },
    { ref: "19.2", text: "magnetic flux density; field due to long straight wire, solenoid" },
    { ref: "19.3", text: "Hall effect; velocity selector; mass spectrometer principles" },
  ]},
  { number: 20, unit: 4, name: "Electromagnetic induction", statements: [
    { ref: "20.1", text: "magnetic flux Φ = BA; Faraday's law (E = −dΦ/dt); Lenz's law" },
    { ref: "20.2", text: "transformers; rms values; AC power" },
  ]},
  { number: 21, unit: 4, name: "Alternating currents", statements: [
    { ref: "21.1", text: "sinusoidal AC; peak vs rms; mean power" },
    { ref: "21.2", text: "rectification: half-wave, full-wave bridge; smoothing capacitors" },
  ]},
  { number: 22, unit: 4, name: "Quantum physics", statements: [
    { ref: "22.1", text: "photoelectric effect; threshold frequency; Einstein equation hf = φ + ½mv²max" },
    { ref: "22.2", text: "wave-particle duality; de Broglie λ = h/p; electron diffraction" },
    { ref: "22.3", text: "atomic line spectra; energy levels; emission and absorption" },
  ]},
  { number: 23, unit: 4, name: "Nuclear physics", statements: [
    { ref: "23.1", text: "binding energy; mass defect; E = mc²; binding energy per nucleon curve" },
    { ref: "23.2", text: "fission and fusion; energy released" },
    { ref: "23.3", text: "radioactive decay law N = N0 e^(−λt); half-life t½ = ln2/λ; activity A = λN" },
    { ref: "23.4", text: "α, β, γ properties; radiation hazards and uses" },
  ]},
  { number: 24, unit: 4, name: "Medical physics", statements: [
    { ref: "24.1", text: "ultrasound: production by piezoelectric effect; A and B-scans; acoustic impedance" },
    { ref: "24.2", text: "X-rays: production, attenuation (I = I0 e^(−μx)); CAT scans" },
    { ref: "24.3", text: "PET scanning; tracers" },
  ]},
];

// === MATHEMATICS 9709 ===
export const CIE_MATHS_TOPICS: CIESyllabusTopic[] = [
  // Pure 1 (Paper 1)
  { number: 1, unit: 1, name: "Quadratics (P1)", statements: [
    { ref: "1.1", text: "completing the square; vertex form; solving quadratic equations and inequalities" },
    { ref: "1.2", text: "discriminant b² − 4ac; nature of roots" },
    { ref: "1.3", text: "simultaneous equations: linear + quadratic" },
  ]},
  { number: 2, unit: 1, name: "Functions (P1)", statements: [
    { ref: "2.1", text: "domain, range; one-one functions; composite and inverse functions" },
    { ref: "2.2", text: "graphs of y = |f(x)|, y = f(x) + a, y = f(x + a), y = af(x), y = f(ax)" },
  ]},
  { number: 3, unit: 1, name: "Coordinate geometry (P1)", statements: [
    { ref: "3.1", text: "equations of straight lines; gradient; perpendicular and parallel lines" },
    { ref: "3.2", text: "midpoint, distance; equation of circle (x − a)² + (y − b)² = r²; intersection problems" },
  ]},
  { number: 4, unit: 1, name: "Circular measure (P1)", statements: [
    { ref: "4.1", text: "radian measure; arc length s = rθ, area of sector ½r²θ; segment area" },
  ]},
  { number: 5, unit: 1, name: "Trigonometry (P1)", statements: [
    { ref: "5.1", text: "graphs of sin, cos, tan; solve trig equations in given intervals" },
    { ref: "5.2", text: "identities sin²x + cos²x = 1, tan = sin/cos" },
  ]},
  { number: 6, unit: 1, name: "Series (P1)", statements: [
    { ref: "6.1", text: "binomial expansion of (a + b)^n for positive integer n" },
    { ref: "6.2", text: "AP and GP; sum to n terms; sum to infinity (|r| < 1)" },
  ]},
  { number: 7, unit: 1, name: "Differentiation (P1)", statements: [
    { ref: "7.1", text: "differentiate x^n, products, sums; chain rule for composite functions" },
    { ref: "7.2", text: "tangents and normals; stationary points (max/min); rates of change" },
  ]},
  { number: 8, unit: 1, name: "Integration (P1)", statements: [
    { ref: "8.1", text: "integration as reverse of differentiation; ∫x^n dx" },
    { ref: "8.2", text: "definite integrals; areas under curves; volumes of revolution about x and y axes" },
  ]},
  // Pure 2 (Paper 2 — AS extension, also feeds into A2)
  { number: 28, unit: 2, name: "Algebra (P2)", statements: [
    { ref: "P2.1.1", text: "modulus function |x|; graphs of y = |ax + b|; solve equations and inequalities involving the modulus" },
    { ref: "P2.1.2", text: "polynomial division; factor and remainder theorems for polynomials up to degree 4" },
    { ref: "P2.1.3", text: "sketch graphs of polynomial functions and locate roots" },
  ]},
  { number: 29, unit: 2, name: "Logarithmic & exponential functions (P2)", statements: [
    { ref: "P2.2.1", text: "definitions and properties of e^x and ln x; graphs and inverse relationship" },
    { ref: "P2.2.2", text: "laws of logarithms; solving equations of form a^x = b and reducing relations to linear form (e.g. y = kx^n, y = ka^x)" },
  ]},
  { number: 30, unit: 2, name: "Trigonometry (P2)", statements: [
    { ref: "P2.3.1", text: "secant, cosecant, cotangent and their graphs" },
    { ref: "P2.3.2", text: "identities 1 + tan²x = sec²x and 1 + cot²x = cosec²x" },
    { ref: "P2.3.3", text: "expansions of sin(A ± B), cos(A ± B), tan(A ± B); double angle formulae" },
    { ref: "P2.3.4", text: "expressions of the form a sinθ + b cosθ as R sin(θ ± α) or R cos(θ ± α); solving trig equations" },
  ]},
  { number: 31, unit: 2, name: "Differentiation (P2)", statements: [
    { ref: "P2.4.1", text: "differentiate e^x, ln x, sin x, cos x, tan x and combinations using chain, product and quotient rules" },
    { ref: "P2.4.2", text: "applications: tangents, normals, stationary points, increasing/decreasing functions, connected rates of change" },
  ]},
  { number: 32, unit: 2, name: "Integration (P2)", statements: [
    { ref: "P2.5.1", text: "integrate e^(ax + b), 1/(ax + b), sin(ax + b), cos(ax + b), sec²(ax + b)" },
    { ref: "P2.5.2", text: "definite integrals; areas under and between curves" },
    { ref: "P2.5.3", text: "trapezium rule; estimate areas and recognise over- or under-estimates from concavity" },
  ]},
  { number: 33, unit: 2, name: "Numerical solution of equations (P2)", statements: [
    { ref: "P2.6.1", text: "locate a root by sign change; understand limitations" },
    { ref: "P2.6.2", text: "rearrange f(x) = 0 to x = F(x); use iterative formula x_{n+1} = F(x_n); convergence and divergence behaviour" },
  ]},
  // Pure 3 (Paper 3 — A2)
  { number: 9, unit: 3, name: "Algebra (P3)", statements: [
    { ref: "9.1", text: "modulus inequalities; |x − a| < b" },
    { ref: "9.2", text: "polynomial division; factor and remainder theorems" },
    { ref: "9.3", text: "partial fractions: linear distinct, repeated linear, irreducible quadratic factors" },
    { ref: "9.4", text: "binomial expansion of (1 + x)^n for any rational n; range of validity" },
  ]},
  { number: 10, unit: 3, name: "Logarithmic & exponential functions (P3)", statements: [
    { ref: "10.1", text: "laws of logarithms; solve a^x = b" },
    { ref: "10.2", text: "graphs of y = e^x and y = ln x; their derivatives and integrals" },
  ]},
  { number: 11, unit: 3, name: "Trigonometry (P3)", statements: [
    { ref: "11.1", text: "secant, cosecant, cotangent; identities 1 + tan² = sec² etc." },
    { ref: "11.2", text: "compound and double angle formulae; R sin(x + α) form; solve trig equations" },
  ]},
  { number: 12, unit: 3, name: "Differentiation (P3)", statements: [
    { ref: "12.1", text: "differentiate e^x, ln x, sin x, cos x, tan x" },
    { ref: "12.2", text: "product, quotient, chain rules; implicit and parametric differentiation" },
  ]},
  { number: 13, unit: 3, name: "Integration (P3)", statements: [
    { ref: "13.1", text: "integrate e^x, 1/x, sin x, cos x, sec²x, 1/(a² + x²)" },
    { ref: "13.2", text: "integration by substitution; integration by parts; using partial fractions" },
    { ref: "13.3", text: "trapezium rule; estimate areas" },
  ]},
  { number: 14, unit: 3, name: "Numerical solution of equations (P3)", statements: [
    { ref: "14.1", text: "locate roots by sign change; iterative formulae x_{n+1} = F(x_n); convergence conditions" },
  ]},
  { number: 15, unit: 3, name: "Vectors (P3)", statements: [
    { ref: "15.1", text: "vector form of a line r = a + tb; pairs of lines (parallel, intersecting, skew)" },
    { ref: "15.2", text: "scalar product; angle between lines; perpendicularity" },
  ]},
  { number: 16, unit: 3, name: "Differential equations (P3)", statements: [
    { ref: "16.1", text: "separable variables; first-order ODEs; rate problems" },
  ]},
  { number: 17, unit: 3, name: "Complex numbers (P3)", statements: [
    { ref: "17.1", text: "i² = −1; addition, subtraction, multiplication, division of complex numbers" },
    { ref: "17.2", text: "modulus, argument, Argand diagram; polar (modulus-argument) form" },
    { ref: "17.3", text: "loci in the Argand plane: |z − a| = r, arg(z − a) = θ" },
  ]},
  // Mechanics 1 (Paper 4 option)
  { number: 18, unit: 4, name: "Forces & equilibrium (M1)", statements: [
    { ref: "18.1", text: "equilibrium of a particle; forces on inclined planes; friction (μ)" },
  ]},
  { number: 19, unit: 4, name: "Kinematics (M1)", statements: [
    { ref: "19.1", text: "constant and variable acceleration; calculus methods" },
    { ref: "19.2", text: "v–t and s–t graphs; areas and gradients" },
  ]},
  { number: 20, unit: 4, name: "Newton's laws (M1)", statements: [
    { ref: "20.1", text: "F = ma applied to single particles and connected particles (pulley problems)" },
  ]},
  { number: 21, unit: 4, name: "Energy, work & power (M1)", statements: [
    { ref: "21.1", text: "work done by constant force; KE and PE; conservation of energy" },
    { ref: "21.2", text: "power = Fv" },
  ]},
  { number: 22, unit: 4, name: "Momentum (M1)", statements: [
    { ref: "22.1", text: "impulse = Ft = change in momentum; conservation in 1D collisions" },
  ]},
  // Statistics 1 (Paper 5 option)
  { number: 23, unit: 5, name: "Representation of data (S1)", statements: [
    { ref: "23.1", text: "stem-and-leaf, box plots, histograms (unequal class widths)" },
    { ref: "23.2", text: "median, mean, mode, range, IQR, variance and standard deviation" },
  ]},
  { number: 24, unit: 5, name: "Permutations & combinations (S1)", statements: [
    { ref: "24.1", text: "nPr, nCr; arrangements with restrictions" },
  ]},
  { number: 25, unit: 5, name: "Probability (S1)", statements: [
    { ref: "25.1", text: "addition and multiplication rules; conditional probability; tree diagrams" },
    { ref: "25.2", text: "mutually exclusive and independent events" },
  ]},
  { number: 26, unit: 5, name: "Discrete random variables (S1)", statements: [
    { ref: "26.1", text: "probability distributions; E(X) and Var(X)" },
    { ref: "26.2", text: "binomial distribution B(n,p); geometric distribution; mean and variance" },
  ]},
  { number: 27, unit: 5, name: "Normal distribution (S1)", statements: [
    { ref: "27.1", text: "use of standardised normal tables; standardising X to Z" },
    { ref: "27.2", text: "approximation to binomial when np > 5 and n(1−p) > 5; continuity correction" },
  ]},
  // Probability & Statistics 2 (Paper 6 option — A2)
  { number: 34, unit: 6, name: "The Poisson distribution (S2)", statements: [
    { ref: "S2.1.1", text: "Poisson distribution as a model; mean and variance both equal to λ" },
    { ref: "S2.1.2", text: "calculate P(X = r), P(X ≤ r) using the Poisson formula and tables" },
    { ref: "S2.1.3", text: "Poisson as an approximation to the binomial when n is large and p is small (np < 5)" },
    { ref: "S2.1.4", text: "normal approximation to Poisson when λ > 15; continuity correction" },
  ]},
  { number: 35, unit: 6, name: "Linear combinations of random variables (S2)", statements: [
    { ref: "S2.2.1", text: "E(aX + b) = aE(X) + b; Var(aX + b) = a²Var(X)" },
    { ref: "S2.2.2", text: "for independent X and Y: E(aX + bY) = aE(X) + bE(Y); Var(aX + bY) = a²Var(X) + b²Var(Y)" },
    { ref: "S2.2.3", text: "linear combinations of independent normal variables are normal; sums and differences of independent Poisson variables are Poisson" },
  ]},
  { number: 36, unit: 6, name: "Continuous random variables (S2)", statements: [
    { ref: "S2.3.1", text: "probability density functions f(x); ∫f(x) dx = 1; P(a ≤ X ≤ b) = ∫_a^b f(x) dx" },
    { ref: "S2.3.2", text: "median (P(X ≤ m) = 0.5), mean E(X) = ∫x f(x) dx, variance Var(X) = E(X²) − [E(X)]²" },
    { ref: "S2.3.3", text: "use of the cumulative distribution function F(x)" },
  ]},
  { number: 37, unit: 6, name: "Sampling and estimation (S2)", statements: [
    { ref: "S2.4.1", text: "concept of a random sample; population vs sample; need for randomness" },
    { ref: "S2.4.2", text: "distribution of the sample mean X̄ ~ N(μ, σ²/n) by the Central Limit Theorem for large n" },
    { ref: "S2.4.3", text: "unbiased estimates of population mean and variance from a sample (use of n − 1 divisor for s²)" },
    { ref: "S2.4.4", text: "confidence intervals for a population mean (σ known and unknown for large samples) and for a population proportion" },
  ]},
  { number: 38, unit: 6, name: "Hypothesis testing (S2)", statements: [
    { ref: "S2.5.1", text: "null and alternative hypotheses; one- and two-tailed tests; significance level; critical region; Type I and Type II errors" },
    { ref: "S2.5.2", text: "hypothesis tests for the mean of a normal distribution (σ known) and for a population proportion using the binomial distribution" },
    { ref: "S2.5.3", text: "hypothesis tests using the Poisson distribution and using the normal approximation to the binomial or Poisson" },
  ]},
];

// === Subject metas for the CIE board ===
export const CIE_SUBJECTS: Record<SubjectCode, SubjectMeta> = {
  mathematics: {
    code: "mathematics", name: "Mathematics", emoji: "∑", spec: "9709",
    units: [
      { number: 1, unitCode: "P1", name: "Pure Mathematics 1", paperLabel: "Paper 1 · 1hr 50min · 75 marks", durationMinutes: 110,
        topics: ["Quadratics", "Functions", "Coordinate geometry", "Circular measure", "Trigonometry", "Series", "Differentiation", "Integration"],
      },
      { number: 2, unitCode: "P2", name: "Pure Mathematics 2", paperLabel: "Paper 2 · 1hr 15min · 50 marks", durationMinutes: 75,
        topics: ["Algebra (P2)", "Logarithmic & exponential functions (P2)", "Trigonometry (P2)", "Differentiation (P2)", "Integration (P2)", "Numerical solution of equations (P2)"],
      },
      { number: 3, unitCode: "P3", name: "Pure Mathematics 3", paperLabel: "Paper 3 · 1hr 50min · 75 marks", durationMinutes: 110, aLevelOnly: true,
        topics: ["Algebra (P3)", "Logarithmic & exponential functions", "Trigonometry (P3)", "Differentiation (P3)", "Integration (P3)", "Numerical solution of equations", "Vectors (P3)", "Differential equations", "Complex numbers"],
      },
      { number: 4, unitCode: "M1", name: "Mechanics", paperLabel: "Paper 4 · 1hr 15min · 50 marks", durationMinutes: 75,
        topics: ["Forces & equilibrium", "Kinematics (M1)", "Newton's laws", "Energy, work & power", "Momentum"],
      },
      { number: 5, unitCode: "S1", name: "Probability & Statistics 1", paperLabel: "Paper 5 · 1hr 15min · 50 marks", durationMinutes: 75,
        topics: ["Representation of data", "Permutations & combinations", "Probability", "Discrete random variables", "Normal distribution"],
      },
      { number: 6, unitCode: "S2", name: "Probability & Statistics 2", paperLabel: "Paper 6 · 1hr 15min · 50 marks", durationMinutes: 75, aLevelOnly: true,
        topics: ["The Poisson distribution (S2)", "Linear combinations of random variables (S2)", "Continuous random variables (S2)", "Sampling and estimation (S2)", "Hypothesis testing (S2)"],
      },
    ],
  },
  biology: {
    code: "biology", name: "Biology", emoji: "🧬", spec: "9700",
    units: [
      { number: 1, unitCode: "P1/2", name: "AS Biology (Papers 1, 2 & 3)", paperLabel: "AS · Multiple choice + structured + practical", durationMinutes: 230,
        topics: ["Cell structure", "Biological molecules", "Enzymes", "Cell membranes & transport", "The mitotic cell cycle", "Nucleic acids & protein synthesis", "Transport in plants", "Transport in mammals", "Gas exchange", "Infectious disease", "Immunity"],
      },
      { number: 4, unitCode: "P4/5", name: "A2 Biology (Papers 4 & 5)", paperLabel: "A2 · Structured + practical planning", durationMinutes: 195, aLevelOnly: true,
        topics: ["Energy & respiration", "Photosynthesis", "Homeostasis", "Coordination", "Inherited change", "Selection & evolution", "Classification, biodiversity & conservation", "Genetic technology"],
      },
    ],
  },
  chemistry: {
    code: "chemistry", name: "Chemistry", emoji: "⚗", spec: "9701",
    units: [
      { number: 1, unitCode: "P1/2", name: "AS Chemistry (Papers 1, 2 & 3)", paperLabel: "AS · MCQ + structured + practical", durationMinutes: 230,
        topics: ["Atoms, molecules and stoichiometry", "Atomic structure", "Chemical bonding", "States of matter", "Chemical energetics", "Electrochemistry", "Equilibria", "Reaction kinetics (AS)", "Periodic Table — chemical periodicity", "Group 2 chemistry", "Group 17 chemistry", "Nitrogen and sulfur", "Introduction to organic chemistry", "Hydrocarbons (alkanes & alkenes)", "Halogenoalkanes", "Hydroxy compounds (alcohols)", "Carbonyl compounds — aldehydes & ketones", "Carboxylic acids and derivatives", "Nitrogen compounds (AS scope)", "Polymerisation", "Organic synthesis & analysis (AS)"],
      },
      { number: 4, unitCode: "P4/5", name: "A2 Chemistry (Papers 4 & 5)", paperLabel: "A2 · Structured + practical planning", durationMinutes: 195, aLevelOnly: true,
        topics: ["Chemical energetics II", "Electrochemistry II", "Equilibria II — Kp, ionic, buffers", "Reaction kinetics II", "Group 2 and transition elements (A2)", "Hydrocarbons & arenes (A2)", "Organic nitrogen compounds (A2)", "Polymerisation II & analysis"],
      },
    ],
  },
  physics: {
    code: "physics", name: "Physics", emoji: "⚛", spec: "9702",
    units: [
      { number: 1, unitCode: "P1/2", name: "AS Physics (Papers 1, 2 & 3)", paperLabel: "AS · MCQ + structured + practical", durationMinutes: 230,
        topics: ["Physical quantities & units", "Kinematics", "Dynamics", "Forces, density, pressure", "Work, energy & power", "Deformation of solids", "Waves", "Superposition", "Electricity", "DC circuits", "Particle physics"],
      },
      { number: 4, unitCode: "P4/5", name: "A2 Physics (Papers 4 & 5)", paperLabel: "A2 · Structured + practical planning", durationMinutes: 195, aLevelOnly: true,
        topics: ["Motion in a circle", "Gravitational fields", "Temperature & ideal gases", "Thermodynamics", "Oscillations (SHM)", "Electric fields", "Capacitance", "Magnetic fields", "Electromagnetic induction", "Alternating currents", "Quantum physics", "Nuclear physics", "Medical physics"],
      },
    ],
  },
};

// Lookup helpers — the AI grounding system uses these to attach the right syllabus
// statements to the prompt for any topic name on any subject.

const CIE_TOPIC_INDEX: Record<SubjectCode, CIESyllabusTopic[]> = {
  mathematics: CIE_MATHS_TOPICS,
  biology: CIE_BIOLOGY_TOPICS,
  chemistry: CIE_CHEMISTRY_TOPICS,
  physics: CIE_PHYSICS_TOPICS,
};

export function findCieTopic(subject: SubjectCode, topicName: string): CIESyllabusTopic | undefined {
  const list = CIE_TOPIC_INDEX[subject];
  if (!list) return undefined;
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const key = norm(topicName);
  return list.find(t => norm(t.name) === key)
      ?? list.find(t => norm(t.name).includes(key) || key.includes(norm(t.name)));
}

export function buildCieSyllabusContext(subject: SubjectCode, topicName: string): string | undefined {
  const t = findCieTopic(subject, topicName);
  if (!t) return undefined;
  const subjectLabel = subject.charAt(0).toUpperCase() + subject.slice(1);
  return `Cambridge International A Level ${subjectLabel} (9701/9700/9702/9709) — Topic ${t.number}: ${t.name}\nOfficial assessment statements:\n${t.statements.map(s => `${s.ref} ${s.text}`).join("\n")}`;
}
