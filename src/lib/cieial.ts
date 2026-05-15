// ============================================================
// syllabusData_cie_alevel.ts
// PLACE AT: src/lib/syllabusData_cie_alevel.ts
//
// SOURCES (official Cambridge PDFs):
//   Chemistry  9701: 2025-2027 syllabus v1 Sept 2022
//   Biology    9700: 2025-2027 syllabus v1 Sept 2022
//   Physics    9702: 2025-2027 syllabus v1 Sept 2022
//   Mathematics 9709: 2026-2027 syllabus v4 Dec 2025
// ============================================================
 
export interface CIETopicData {
  code: string;
  title: string;
  asLevel: boolean;
  paperRef: string;
  allowedTopics: string[];
  forbiddenTopics: string[];
  requiredKeywords: string[];
  boundaryNotes?: string[];
  practicalNotes?: string[];
}
 
export interface CIESubjectData {
  [topicKey: string]: CIETopicData;
}
 
export interface CIESyllabusDatabase {
  [subject: string]: CIESubjectData;
}
 
export const CIE_ALEVEL_SYLLABUS: CIESyllabusDatabase = {
 
  // ================================================================
  // CIE A LEVEL CHEMISTRY 9701
  // ================================================================
  chemistry: {
 
    topic1: {
      code: '9701-T1',
      title: 'Atomic Structure',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Subatomic particles — proton (mass 1, charge +1); neutron (mass 1, charge 0); electron (negligible mass, charge −1); nucleus is dense and positively charged; electrons occupy shells around nucleus',
        'Atomic number Z (proton number) and mass number A (nucleon number); number of neutrons = A − Z; ions: protons unchanged, electrons = Z − charge',
        'Isotopes — same Z, different A; same chemical properties (same electronic config); different physical properties (different mass, density)',
        'Atomic and ionic radius trends — atomic radius decreases across period (increasing nuclear charge, same number of inner shells); increases down group (extra shells); cations smaller than parent atom; anions larger than parent atom',
        'Electron shells, sub-shells and orbitals — principal quantum number n; s (1 orbital, max 2e); p (3 orbitals, max 6e); d (5 orbitals, max 10e); energy order: 1s < 2s < 2p < 3s < 3p < 4s < 3d',
        'Aufbau principle (fill lowest energy first); Hund\'s rule (maximise unpaired electrons before pairing); Pauli exclusion (max 2 electrons per orbital, opposite spins)',
        'Electronic configuration — full notation e.g. 1s²2s²2p⁶3s²3p⁶3d⁶4s²; shorthand [Ar]3d⁶4s²; electrons-in-boxes with spin arrows',
        'Shapes of orbitals — s orbital spherical; p orbital dumbbell/figure-of-eight with nodal plane',
        'Free radicals — species with one or more unpaired electrons; formed by homolytic bond fission',
        'First ionisation energy — energy to remove 1 mol electrons from 1 mol gaseous atoms: X(g) → X⁺(g) + e⁻; successive IEs; large jump = new inner shell; evidence for shell structure',
        'Trends in IE — across period generally increases; dip at Group 3 (p electron slightly above s in energy); dip at Group 6 (spin-pair repulsion in first paired p orbital); down group decreases (larger radius, more shielding)',
        'Factors affecting IE — nuclear charge; atomic radius; shielding by inner shells; spin-pair repulsion',
      ],
      forbiddenTopics: [
        'Ar calculation from mass spectrum — Topic 2',
        'Chemical bonding — Topic 3',
        'Cr and Cu anomalous configurations — Topic 28 A Level only',
        'd-d transitions and colour — Topic 28 A Level only',
      ],
      requiredKeywords: [
        'proton number', 'nucleon number', 'isotope', 'sub-shell', 'orbital',
        'Aufbau', 'Hund\'s rule', 'Pauli exclusion',
        'first ionisation energy', 'successive ionisation energy', 'shell structure',
        'atomic radius', 'ionic radius', 'shielding', 'spin-pair repulsion',
        'free radical', 's orbital spherical', 'p orbital dumbbell',
      ],
      boundaryNotes: [
        'Only elements H to Kr (periods 1-4) assessed for electronic configuration at AS.',
        'Cr [Ar]3d⁵4s¹ and Cu [Ar]3d¹⁰4s¹ anomalies are Topic 28 A Level ONLY.',
        '4s empties before 3d when forming transition metal ions — Topic 28 context.',
      ],
      practicalNotes: [
        'Flame tests connect to atomic emission: excited electrons fall to lower levels → photons emitted → colour visible.',
        'Each line in emission spectrum = specific electron transition; E = hf relates photon energy to frequency.',
      ],
    },
 
    topic2: {
      code: '9701-T2',
      title: 'Atoms, Molecules and Stoichiometry',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Unified atomic mass unit — one twelfth of mass of carbon-12 atom',
        'Relative atomic mass Ar — weighted mean mass relative to 1/12 of carbon-12; calculating from mass spectrum: Ar = Σ(mass × abundance)/100',
        'Relative isotopic mass; relative molecular mass Mr; relative formula mass for ionic compounds',
        'Mole — 6.02 × 10²³ particles (Avogadro constant L)',
        'Formulae of ionic compounds from ionic charges and Roman numeral oxidation states; recall: NO₃⁻, CO₃²⁻, SO₄²⁻, OH⁻, NH₄⁺, Zn²⁺, Ag⁺, HCO₃⁻, PO₄³⁻',
        'Balancing full chemical equations and ionic equations; state symbols (s) (l) (g) (aq)',
        'Empirical formula — simplest whole-number ratio; molecular formula — actual atoms; calculating from percentage composition or combustion data',
        'Hydrated salts — anhydrous, hydrated, water of crystallisation e.g. CuSO₄·5H₂O',
        'Reacting masses — stoichiometric ratios; percentage yield = actual/theoretical × 100; limiting reagent; excess reagent',
        'Volume calculations — gases at RTP: 24.0 dm³ mol⁻¹; concentration c = n/V (mol dm⁻³); titration: moles = c × V/1000',
        'Time-of-flight mass spectrometry (TOF-MS) — ionisation, acceleration, drift, detection; m/z on x-axis, relative abundance on y-axis; molecular ion M⁺ gives Mr; base peak = most abundant fragment; M+2 peaks: Cl 3:1 ratio (³⁵Cl:³⁷Cl); Br 1:1 ratio (⁷⁹Br:⁸¹Br)',
      ],
      forbiddenTopics: [
        'pV = nRT ideal gas equation — Topic 4',
        'Enthalpy calculations — Topic 5',
        'Specific organic fragmentation patterns — Topics 14-22',
      ],
      requiredKeywords: [
        'relative atomic mass', 'relative molecular mass', 'mole', 'Avogadro constant',
        'empirical formula', 'molecular formula', 'water of crystallisation',
        'limiting reagent', 'percentage yield', 'ionic equation', 'state symbols',
        'TOF mass spectrometry', 'molecular ion peak', 'base peak', 'm/z',
        'Cl 3:1 M:M+2', 'Br 1:1 M:M+2',
      ],
    },
 
    topic3: {
      code: '9701-T3',
      title: 'Chemical Bonding',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Electronegativity — power of atom to attract electrons in a covalent bond; Pauling scale; increases across period; decreases down group; predicting ionic vs covalent from electronegativity difference',
        'Ionic bonding — electron transfer metal→non-metal; electrostatic attraction between oppositely charged ions; dot-and-cross diagrams NaCl, MgO, CaF₂',
        'Metallic bonding — positive metal ions in sea of delocalised electrons; conducts, malleable, ductile, high MP',
        'Covalent bonding — shared electron pair; dot-and-cross for H₂, O₂, N₂, Cl₂, HCl, CO₂, NH₃, CH₄, C₂H₄; expanded octet: SO₂, PCl₅ (10e around P), SF₆ (12e around S)',
        'Coordinate (dative covalent) bond — both electrons from one atom; NH₄⁺, Al₂Cl₆',
        'Sigma (σ) bonds — end-on orbital overlap; Pi (π) bonds — sideways p orbital overlap; single bond = σ only; double = σ + π; triple = σ + 2π',
        'Hybridisation — sp: linear 180° e.g. BeCl₂, C₂H₂; sp²: trigonal planar 120° e.g. BF₃, C₂H₄; sp³: tetrahedral 109.5° e.g. CH₄, NH₃, H₂O',
        'Bond energy and bond length — shorter bond = stronger = higher energy; triple > double > single',
        'VSEPR — electron pairs repel; lone pairs repel more than bonding; shapes: linear 180° (2bp 0lp); trigonal planar 120° (3bp 0lp); tetrahedral 109.5° (4bp 0lp); pyramidal ~107° (3bp 1lp); V-shaped ~104.5° (2bp 2lp); octahedral 90° (6bp 0lp); trigonal bipyramidal 90°/120° (5bp 0lp)',
        'Bond polarity — δ+ and δ− from electronegativity difference; dipole moment = vector sum of bond dipoles; symmetric = non-polar (CO₂, CCl₄); asymmetric = polar (H₂O, NH₃, HCl)',
        'Intermolecular forces — id-id London dispersion forces (all molecules; increase with Mr and surface area); pd-pd permanent dipole-dipole (polar molecules); hydrogen bonding (N-H, O-H, F-H with lone pair on N/O/F; explains high BP of H₂O, HF, NH₃; ice less dense than liquid water)',
        'Lattice structures — giant ionic (NaCl 6:6 coordination, high MP, conducts when molten/dissolved, brittle); simple molecular (I₂, C₆₀, ice; low MP; held by van der Waals/H-bonds); giant covalent (SiO₂ very high MP hard non-conductor; graphite layered with delocalised electrons, conductor; diamond tetrahedral very hard non-conductor); metallic',
      ],
      forbiddenTopics: [
        'Lattice enthalpy and Born-Haber cycles — Topic 23 A Level only',
        'Crystal field theory — Topic 28 A Level only',
      ],
      requiredKeywords: [
        'electronegativity', 'ionic bonding', 'metallic bonding', 'covalent bonding',
        'coordinate dative bond', 'sigma bond', 'pi bond',
        'sp sp² sp³ hybridisation', 'VSEPR', 'lone pair', 'bond angle',
        'dipole moment', 'non-polar symmetric', 'polar asymmetric',
        'London dispersion id-id', 'pd-pd permanent dipole', 'hydrogen bonding N-H O-H F-H',
        'ice less dense', 'giant ionic', 'giant covalent', 'graphite delocalised electrons',
      ],
      boundaryNotes: [
        'Lattice enthalpy and Born-Haber cycles are Topic 23 ONLY — do not include here.',
        'Fajans\' rules and polarisation belong in Topic 23.',
      ],
    },
 
    topic4: {
      code: '9701-T4',
      title: 'States of Matter',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Ideal gas assumptions — zero particle volume; no intermolecular forces; pressure from collisions of molecules with container walls',
        'Ideal gas equation — pV = nRT; R = 8.31 J K⁻¹ mol⁻¹; p in Pa, V in m³, T in kelvin; unit conversions: kPa × 1000 = Pa; cm³ ÷ 10⁶ = m³; °C + 273 = K; using to find Mr from gas density data',
        'Giant ionic lattice — NaCl (each Na⁺ surrounded by 6 Cl⁻ and vice versa); MgO (2+ and 2- ions, stronger attraction, higher MP than NaCl); high MP/BP; conducts when molten or dissolved; brittle; soluble in polar solvents',
        'Simple molecular lattice — I₂ (London forces, low MP); C₆₀ buckminsterfullerene (cage of 60 C; each C has 3 σ bonds + delocalised π electron; molecular not giant; low MP; semiconductor); ice (H-bonds between H₂O; hexagonal open lattice; less dense than liquid water)',
        'Giant covalent lattice — SiO₂ (each Si bonded to 4 O; each O bonded to 2 Si; very high MP; hard; non-conductor); graphite (layers of hexagonal rings; delocalised π electrons between layers → conductor; layers held by weak London forces → soft lubricant; very high MP due to covalent bonds within layers); diamond (each C bonded to 4 C tetrahedrally; very hard; non-conductor; very high MP)',
        'Giant metallic lattice — positive ions in sea of delocalised electrons; conducts electricity and heat; malleable and ductile; high MP',
        'Deducing structure and bonding type from experimental data (MP, conductivity, solubility)',
      ],
      forbiddenTopics: [
        'Lattice enthalpy — Topic 23 A Level only',
        'Real gas deviations — not required in 9701',
        'Kinetic theory calculations — physics topic',
      ],
      requiredKeywords: [
        'ideal gas', 'pV = nRT', 'zero volume no intermolecular forces',
        'giant ionic NaCl 6:6', 'MgO 2+ 2- higher MP',
        'C₆₀ buckminsterfullerene molecular cage', 'ice H-bonds open structure less dense',
        'SiO₂ giant covalent very high MP non-conductor',
        'graphite delocalised electrons conductor London forces between layers',
        'diamond tetrahedral very hard non-conductor',
      ],
    },
 
    topic5: {
      code: '9701-T5',
      title: 'Chemical Energetics (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Enthalpy change ΔH — heat energy at constant pressure; standard conditions 298 K, 101 kPa; symbol ⦵; exothermic ΔH negative (energy released); endothermic ΔH positive (energy absorbed)',
        'Standard enthalpy changes — formation ΔHf⦵ (1 mol compound from elements in standard states); combustion ΔHc⦵ (1 mol in excess O₂); neutralisation ΔHneut⦵ (per mol water formed)',
        'Energy profile diagram — x-axis reaction progress; y-axis energy; activation energy Ea shown as peak; ΔH = products − reactants energy level',
        'Bond breaking endothermic; bond making exothermic; ΔH = Σ(bond energies broken) − Σ(bond energies formed); average bond energies vs exact values for diatomic molecules',
        'Calorimetry — q = mcΔT; c(water) = 4.18 J g⁻¹ K⁻¹; ΔH = −q/n (units kJ mol⁻¹); ΔH negative = exothermic',
        'Hess\'s law — total ΔH independent of route; energy cycle calculations; using formation data: ΔHr = ΣΔHf⦵(products) − ΣΔHf⦵(reactants); using combustion data: ΔHr = ΣΔHc⦵(reactants) − ΣΔHc⦵(products)',
      ],
      forbiddenTopics: [
        'Lattice enthalpy, Born-Haber cycles, electron affinity — Topic 23 A Level only',
        'Entropy ΔS and Gibbs free energy ΔG — Topic 23 A Level only',
        'Arrhenius equation — Topic 26 A Level only',
      ],
      requiredKeywords: [
        'enthalpy change', 'exothermic ΔH negative', 'endothermic ΔH positive',
        'standard conditions 298K', 'ΔHf⦵', 'ΔHc⦵', 'Hess\'s law', 'energy cycle',
        'bond energy', 'calorimetry', 'q = mcΔT', 'activation energy Ea',
      ],
      practicalNotes: [
        'Paper 3: spirit burner calorimetry for ΔHc; main error = heat loss to surroundings; improve with draught shield, insulated beaker',
        'Enthalpy of neutralisation using polystyrene cup; value less exothermic than theoretical due to heat capacity of cup and heat loss',
        'Hess\'s law verification: measure ΔH directly and via two-step route and compare',
      ],
    },
 
    topic6: {
      code: '9701-T6',
      title: 'Redox Chemistry (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Oxidation numbers — rules: F = −1 always; O = −2 (except peroxide −1, OF₂ = +2); H = +1 (except metal hydrides −1); element = 0; sum = overall charge; Roman numerals for variable states',
        'Balancing redox equations by half-equation method: balance atoms; add H₂O for O; add H⁺ for H (acid medium) or OH⁻ (alkaline); add electrons to balance charge; combine half-equations',
        'OIL RIG — Oxidation Is Loss (of electrons); Reduction Is Gain',
        'Oxidising agent — accepts electrons, is itself reduced; reducing agent — donates electrons, is itself oxidised',
        'Disproportionation — same species simultaneously oxidised and reduced; e.g. Cl₂ + 2NaOH → NaCl + NaOCl + H₂O (Cl: 0 → −1 and +1)',
      ],
      forbiddenTopics: [
        'Standard electrode potentials, E°cell, electrochemical cells — Topic 24 A Level only',
        'Faraday calculations and quantitative electrolysis — Topic 24 A Level only',
        'Transition metal redox reactions — Topic 28 A Level only',
      ],
      requiredKeywords: [
        'oxidation number', 'OIL RIG', 'oxidising agent is reduced', 'reducing agent is oxidised',
        'disproportionation', 'half-equation', 'electron transfer',
      ],
    },
 
    topic7: {
      code: '9701-T7',
      title: 'Equilibria (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Dynamic equilibrium — closed system; forward and reverse rates equal; concentrations constant',
        'Le Chatelier\'s principle — if change made to system at equilibrium, position shifts to minimise that change',
        'Effects on equilibrium position: concentration (increase [reactant] → shifts right); temperature (increase T → shifts endothermic way; Kc changes); pressure (increase P → shifts to fewer moles of gas); catalyst (reaches equilibrium faster; does NOT shift position; Kc unchanged)',
        'Equilibrium constant Kc — Kc = [products]^powers / [reactants]^powers from balanced equation; units depend on Δn; large Kc = products favoured; small Kc = reactants favoured; temperature is ONLY factor that changes Kc value',
        'Mole fraction xA = nA/ntotal; partial pressure pA = xA × Ptotal',
        'Kp — equilibrium constant using partial pressures; Kp = Kc(RT)^Δn; units depend on Δn',
        'Industrial equilibria: Haber process N₂ + 3H₂ ⇌ 2NH₃ (ΔH = −92 kJ mol⁻¹); Contact process 2SO₂ + O₂ ⇌ 2SO₃; compromise conditions applying Le Chatelier + economics',
      ],
      forbiddenTopics: [
        'Ka, pH, buffer solutions, Kw — Topic 25 A Level only',
        'Ksp — Topic 25 A Level only',
        'Partition coefficient — Topic 25 A Level only',
      ],
      requiredKeywords: [
        'dynamic equilibrium', 'Le Chatelier\'s principle',
        'Kc expression', 'only temperature changes Kc', 'catalyst no effect on Kc',
        'mole fraction', 'partial pressure', 'Kp', 'Haber process', 'Contact process',
        'compromise conditions',
      ],
    },
 
    topic8: {
      code: '9701-T8',
      title: 'Reaction Kinetics (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Rate of reaction — change in concentration per unit time; measured by gas volume, mass loss, colour change, conductivity, turbidity',
        'Collision theory — particles need sufficient energy (≥ Ea) AND correct orientation for effective collision',
        'Activation energy Ea — minimum energy for effective collision',
        'Boltzmann distribution — x-axis: kinetic energy starting at origin; y-axis: number of molecules; peak = most probable energy; long tail to right; total area = total particles; Ea on x-axis; area to right of Ea = fraction able to react; higher T: curve flattens, peak shifts right, peak height decreases, area to right of Ea greatly increases',
        'Effects on rate — concentration/pressure (more collisions per unit time); temperature (larger fraction has E ≥ Ea; also more frequent collisions); surface area (more collision sites); catalyst (alternative pathway with lower Ea; not consumed); heterogeneous catalyst (different phase: Fe Haber, V₂O₅ Contact, Pt catalytic converters); homogeneous catalyst (same phase)',
        'Initial rate from gradient of tangent at t = 0 on concentration-time graph',
      ],
      forbiddenTopics: [
        'Rate equations, rate constant k, orders, half-life, Arrhenius equation — Topic 26 A Level only',
        'Mechanism and rate-determining step — Topic 26 A Level only',
      ],
      requiredKeywords: [
        'collision theory', 'activation energy', 'effective collision',
        'Boltzmann distribution', 'area to right of Ea', 'fraction with E ≥ Ea',
        'catalyst lowers Ea', 'heterogeneous catalyst', 'homogeneous catalyst',
      ],
      practicalNotes: [
        'Paper 3: iodine clock reaction; 1/t as rate measure; plotting rate vs concentration',
        'H₂O₂ decomposition with MnO₂; gas syringe O₂; initial rate from tangent',
      ],
    },
 
    topic9: {
      code: '9701-T9',
      title: 'Chemical Periodicity (Period 3)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Periodicity — repeating properties at regular intervals related to electronic configuration',
        'Period 3 physical properties: atomic radius decreases Na→Ar (nuclear charge increases, same inner shells); IE generally increases (dips at Al and S); MP: Na–Al increases (metallic); Si very high (giant covalent); P₄→S₈→Cl₂→Ar decreases (simple molecular); conductivity: Na/Mg/Al good; Si semiconductor; P/S/Cl/Ar non-conductors',
        'Period 3 oxides — trend basic→amphoteric→acidic: Na₂O basic (Na₂O + H₂O → 2NaOH); MgO basic sparingly soluble; Al₂O₃ amphoteric (reacts with both HCl and NaOH); SiO₂ acidic (SiO₂ + 2NaOH → Na₂SiO₃ + H₂O); P₄O₁₀ acidic → H₃PO₄; SO₃ acidic → H₂SO₄; SO₂ acidic → H₂SO₃',
        'Period 3 chlorides — trend ionic→covalent: NaCl ionic (dissolves neutral); MgCl₂ ionic (slightly acidic due to [Mg(H₂O)₆]²⁺ hydrolysis); AlCl₃ intermediate (fumes in moist air, acidic hydrolysis → HCl); SiCl₄ covalent (vigorous hydrolysis → SiO₂ + 4HCl); PCl₃ covalent → H₃PO₃ + HCl; PCl₅ covalent → H₃PO₄ + HCl; covalent chlorides hydrolyse producing steamy HCl fumes',
      ],
      forbiddenTopics: [
        'Group 2 detailed chemistry — Topic 10', 'Group 17 detailed chemistry — Topic 11',
        'Transition elements — Topic 28 A Level only',
      ],
      requiredKeywords: [
        'periodicity', 'atomic radius decreases across period', 'IE dip at Al and S',
        'basic oxide', 'amphoteric Al₂O₃', 'acidic oxide',
        'ionic chloride dissolves', 'covalent chloride hydrolyses', 'steamy HCl fumes',
        'SiCl₄ vigorous hydrolysis', 'AlCl₃ intermediate character',
      ],
    },
 
    topic10: {
      code: '9701-T10',
      title: 'Group 2',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Group 2 (Be, Mg, Ca, Sr, Ba) — outer ns² configuration; form 2+ ions; reactivity increases down group (lower IE)',
        'Reactions with water: Mg + steam → MgO + H₂; Ca + 2H₂O → Ca(OH)₂ + H₂; Sr/Ba react more vigorously',
        'Reactions with oxygen: form ionic oxides MgO, CaO etc.',
        'Reactions with dilute HCl: all dissolve to give MCl₂ + H₂',
        'Thermal stability of carbonates and nitrates increases down group — larger cation, lower charge density, less polarising power, less distortion of anion, harder to decompose; MgCO₃ decomposes below 300°C; BaCO₃ above 1000°C; MCO₃ → MO + CO₂; M(NO₃)₂ → MO + 2NO₂ + ½O₂',
        'Solubility of hydroxides M(OH)₂ — INCREASES down group (Mg(OH)₂ sparingly soluble; Ba(OH)₂ soluble)',
        'Solubility of sulfates MSO₄ — DECREASES down group (MgSO₄ soluble; BaSO₄ virtually insoluble)',
        'Uses: Ca(OH)₂ neutralising acid soils and water treatment; CaO cement; Ca(OH)₂ + CO₂ → CaCO₃ milky (limewater test); BaSO₄ barium meal (insoluble → safe, opaque to X-rays)',
        'Flame tests: Ca²⁺ brick-red; Sr²⁺ crimson; Ba²⁺ pale green',
      ],
      forbiddenTopics: [
        'Group 17 — Topic 11', 'Transition metals — Topic 28', 'Ksp calculations — Topic 25',
      ],
      requiredKeywords: [
        'reactivity increases down Group 2', 'Ca + 2H₂O → Ca(OH)₂ + H₂',
        'thermal stability increases down group', 'charge density polarising power',
        'hydroxide solubility INCREASES down group', 'sulfate solubility DECREASES down group',
        'BaSO₄ insoluble barium meal', 'limewater CO₂ test milky',
        'Ca brick-red', 'Sr crimson', 'Ba pale green',
      ],
    },
 
    topic11: {
      code: '9701-T11',
      title: 'Group 17',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Halogens F₂, Cl₂, Br₂, I₂ — state at RTP: F₂ Cl₂ gas; Br₂ liquid; I₂ solid; colour: F₂ pale yellow; Cl₂ yellow-green; Br₂ orange-brown; I₂ grey-black',
        'Oxidising power decreases down group (F₂ strongest); fluorine most electronegative',
        'Displacement reactions: Cl₂ + 2KBr → 2KCl + Br₂; Cl₂ + 2KI → 2KCl + I₂; Br₂ + 2KI → 2KBr + I₂; Cl₂ displaces Br⁻ and I⁻; Br₂ displaces I⁻ only; I₂ cannot displace; colours in organic solvent: Cl₂ very pale yellow; Br₂ orange; I₂ purple',
        'Reducing power of halide ions: I⁻ > Br⁻ > Cl⁻ >> F⁻ (F⁻ not a reducing agent)',
        'Reactions with conc H₂SO₄: NaCl → NaHSO₄ + HCl (Cl⁻ not strong enough to reduce H₂SO₄); NaBr → HBr + SO₂ (Br⁻ reduces H₂SO₄ to SO₂); NaI → HI + H₂S + S + SO₂ (I⁻ reduces H₂SO₄ further)',
        'Test for halide ions — acidify with dilute HNO₃ then add AgNO₃(aq): AgCl white precipitate soluble in dilute NH₃; AgBr cream precipitate soluble only in conc NH₃; AgI yellow precipitate insoluble in NH₃',
        'Cl₂ with NaOH — disproportionation: cold dilute → NaCl + NaOCl (bleach) + H₂O; hot conc → NaCl + NaClO₃ + H₂O',
        'Cl₂ water treatment — Cl₂ + H₂O ⇌ HCl + HOCl; HOCl kills bacteria by oxidising enzymes; risk: chlorinated organic by-products',
      ],
      forbiddenTopics: [
        'Aryl halides — Topic 31 A Level only', 'Transition metal redox — Topic 28 A Level only',
      ],
      requiredKeywords: [
        'oxidising power decreases down Group 17', 'displacement reaction',
        'Br₂ organic layer orange', 'I₂ organic layer purple',
        'reducing power I⁻ > Br⁻ > Cl⁻', 'conc H₂SO₄ reactions',
        'AgNO₃ acidified halide test', 'AgCl white dilute NH₃', 'AgBr cream conc NH₃', 'AgI yellow insoluble',
        'Cl₂ disproportionation NaOCl bleach', 'HOCl water purification',
      ],
    },
 
    topic12: {
      code: '9701-T12',
      title: 'Nitrogen and Sulfur',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Nitrogen — N₂ triple bond, very stable; Haber process for NH₃',
        'NH₃ reactions: with HCl → NH₄Cl; with H₂SO₄ → (NH₄)₂SO₄; thermal decomposition NH₄Cl(s) ⇌ NH₃(g) + HCl(g)',
        'Ostwald process for HNO₃: 4NH₃ + 5O₂ → 4NO + 6H₂O (Pt/Rh catalyst ~900°C); 2NO + O₂ → 2NO₂; 4NO₂ + O₂ + 2H₂O → 4HNO₃',
        'NOₓ acid rain: formed in car engines at high T; catalytic converters (Pt/Rh) convert NOₓ + CO → N₂ + CO₂',
        'SO₂ acid rain: from fossil fuels/volcanoes; SO₂ + H₂O → H₂SO₃; damages limestone (CaCO₃ + H₂SO₄ → CaSO₄ + H₂O + CO₂); flue gas desulfurisation with CaO or Ca(OH)₂',
        'Contact process: 2SO₂ + O₂ ⇌ 2SO₃; V₂O₅ catalyst; 450°C and 1–2 atm; compromise conditions (Le Chatelier); SO₃ absorbed into conc H₂SO₄ → oleum; diluted to give H₂SO₄',
      ],
      forbiddenTopics: [
        'Organic nitrogen compounds — Topics 19, 34', 'Nitrogen cycle ecology — not in chem syllabus',
      ],
      requiredKeywords: [
        'N₂ triple bond stable', 'Haber process', 'Ostwald process Pt/Rh catalyst',
        'NOₓ acid rain catalytic converter', 'SO₂ acid rain',
        'Contact process V₂O₅ 450°C', 'oleum', 'compromise conditions',
        'flue gas desulfurisation CaO Ca(OH)₂',
      ],
    },
 
    topic13: {
      code: '9701-T13',
      title: 'Introduction to Organic Chemistry',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Formulae types — molecular; empirical; structural; displayed (all bonds); skeletal (zig-zag, H implied)',
        'IUPAC naming — chain prefixes meth/eth/prop/but/pent/hex; functional group suffixes; lowest locants; branched chains',
        'Functional groups — C=C alkene; C-X haloalkane; -OH alcohol; -CHO aldehyde; C=O ketone; -COOH carboxylic acid; -NH₂ amine; -CONH₂ amide; -CN nitrile; -COO- ester; -COCl acyl chloride',
        'Structural isomers — chain (different skeleton); positional (different position of FG); functional group (different FG, same formula)',
        'E/Z stereoisomerism — restricted rotation C=C; two different groups on each C; E (entgegen): higher priority groups opposite sides; Z (zusammen): higher priority groups same side; CIP rules: higher atomic number = higher priority',
        'Optical isomerism — chiral carbon (4 different groups); enantiomers (non-superimposable mirror images); racemic mixture (50:50 enantiomers); optically active (rotates plane-polarised light); biological significance (different receptor activity)',
        'Reaction types — addition; elimination; substitution; condensation; hydrolysis; oxidation; reduction; polymerisation',
        'Bond fission — homolytic (each atom gets 1 electron → free radicals; half-headed arrow); heterolytic (both electrons to one atom → ions; full curly arrow)',
        'Electrophile — electron-pair acceptor (δ+ or +); nucleophile — electron-pair donor (lone pair); free radical — unpaired electron',
        'Curly arrows — show movement of electron pairs from electron-rich to electron-deficient; all intermediates shown',
      ],
      forbiddenTopics: [
        'Specific reaction mechanisms — Topics 14-22', 'NMR — Topics 22 and 37 A Level',
      ],
      requiredKeywords: [
        'molecular structural displayed skeletal formula', 'IUPAC naming',
        'chain positional functional group isomers',
        'E/Z isomerism', 'CIP priority rules', 'chiral carbon',
        'enantiomers', 'racemic mixture', 'optically active plane-polarised light',
        'electrophile', 'nucleophile', 'free radical',
        'homolytic fission half-headed arrow', 'heterolytic fission curly arrow',
      ],
    },
 
    topic14: {
      code: '9701-T14',
      title: 'Hydrocarbons (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Alkanes CₙH₂ₙ₊₂ — saturated; BP increases with chain length (stronger London forces); branching decreases BP (smaller surface area); combustion complete → CO₂ + H₂O; incomplete → CO/soot',
        'Free radical substitution (Cl₂/UV): initiation Cl₂ → 2Cl• (homolytic, half-headed arrows); propagation Cl• + CH₄ → HCl + •CH₃; •CH₃ + Cl₂ → CH₃Cl + Cl•; termination: two radicals combine; mixture of products (continued substitution, isomers)',
        'Cracking — thermal (~800°C, no catalyst, alkenes + shorter alkanes); catalytic (~450°C, zeolite, more useful products); reforming (cyclisation, isomerisation)',
        'Fractional distillation of crude oil — fractions by BP; uses of fractions (LPG, petrol, naphtha, kerosene, diesel, fuel oil)',
        'Alkenes CₙH₂ₙ — C=C (σ + π bond); planar sp² hybridised; bromine water decolourised (test); acidified KMnO₄ decolourised',
        'Electrophilic addition mechanism — π bond attacks electrophile; carbocation intermediate; nucleophile attacks; full curly arrows required',
        'Markovnikov\'s rule — H adds to C with more H; secondary/tertiary carbocation more stable than primary; determines major product',
        'Addition of Br₂ — bromonium ion intermediate; dibromoalkane product; decolourises bromine water = test for alkene',
        'Addition of HBr — Markovnikov product (secondary/tertiary C gets Br); mechanism with carbocation',
        'Addition of H₂O — H₃PO₄ catalyst 300°C, 60-70 atm; produces alcohol (Markovnikov); industrial ethanol',
        'Hydrogenation — H₂, Ni catalyst ~150°C; alkene → alkane; margarine hardening',
        'Oxidation with KMnO₄ — cold dilute alkaline → diol; hot conc acid → cleavage products',
        'Addition polymerisation — C=C monomers → polymer; repeat unit from monomer; poly(ethene), poly(propene), PVC, PTFE; disposal problems (non-biodegradable, HCl/HF from burning)',
        'Benzene — Kekulé disproved; delocalised model (6 π electrons); evidence: equal C-C bond lengths 140 pm; ΔH hydrogenation −208 vs predicted −360 kJ mol⁻¹; delocalisation energy ~150 kJ mol⁻¹',
        'Electrophilic aromatic substitution (EAS) — electrophile attacks ring; arenium ion intermediate; H⁺ expelled; aromaticity restored; overall substitution not addition',
        'Nitration: conc HNO₃/conc H₂SO₄ below 55°C → nitrobenzene; H₂SO₄ protonates HNO₃ → NO₂⁺ nitronium ion; mechanism with curly arrows',
        'Friedel-Crafts alkylation/acylation: RCl or RCOCl + AlCl₃ Lewis acid catalyst → alkyl/acylbenzene + HCl; AlCl₃ generates R⁺ or RCO⁺',
        'Halogenation: Cl₂ + AlCl₃ → chlorobenzene + HCl; AlCl₃ polarises Cl₂',
        'Directing effects — ortho/para directors: OH, NH₂, alkyl (electron-donating, activate ring); meta directors: NO₂, COR (electron-withdrawing, deactivate ring)',
      ],
      forbiddenTopics: [
        'Halogenoalkane mechanisms — Topic 15', 'Alcohols — Topic 16',
        'Ozonolysis, Diels-Alder — Topic 30 A Level only',
      ],
      requiredKeywords: [
        'free radical substitution', 'initiation propagation termination',
        'electrophilic addition', 'carbocation stability tertiary > secondary > primary',
        'Markovnikov', 'bromonium ion',
        'addition polymerisation', 'repeat unit',
        'benzene delocalised', 'ΔH hydrogenation evidence',
        'arenium ion', 'NO₂⁺ nitronium', 'Friedel-Crafts AlCl₃ Lewis acid',
        'ortho-para director activating', 'meta director deactivating',
      ],
    },
 
    topic15: {
      code: '9701-T15',
      title: 'Halogen Compounds (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Halogenoalkane classification — primary (1C on C-X); secondary (2C); tertiary (3C)',
        'C-X polarity — δ+ on C, δ− on X; susceptible to nucleophilic attack',
        'SN2 mechanism (primary): one-step; nucleophile attacks C from back 180°; transition state (pentacoordinate C); X⁻ leaves; Walden inversion; rate = k[RX][Nu]; full curly arrows required',
        'SN1 mechanism (tertiary): two-step; slow step: C-X breaks heterolytically → planar carbocation (sp²); fast step: nucleophile attacks from either side → racemisation; rate = k[RX]',
        'Competition substitution vs elimination — NaOH(aq) dilute, room T → SN2 (primary); NaOH in ethanol conc, heat → E2 elimination → alkene + HX; Zaitsev product (more substituted alkene) preferred',
        'Relative reactivity — C-F strongest bond → least reactive; C-I weakest → most reactive; testing with AgNO₃(aq): faster precipitate = more reactive',
        'Other nucleophiles: KCN in ethanol → nitrile (chain extension +1C); excess NH₃ sealed tube heat → amine',
        'CFCs and ozone — UV breaks C-Cl → Cl•; Cl• + O₃ → ClO• + O₂; ClO• + O• → Cl• + O₂; catalytic; Montreal Protocol; replaced by HFCs',
      ],
      forbiddenTopics: [
        'Aryl halide reactions — Topic 31 A Level only', 'Grignard reagents — not in 9701',
      ],
      requiredKeywords: [
        'SN1 SN2', 'carbocation planar sp²', 'Walden inversion', 'transition state',
        'rate = k[RX] SN1', 'rate = k[RX][Nu] SN2', 'racemisation SN1',
        'elimination ethanolic NaOH', 'Zaitsev product',
        'C-X bond strength order C-F strongest C-I weakest',
        'nitrile chain extension', 'CFCs ozone Cl• catalytic',
      ],
    },
 
    topic16: {
      code: '9701-T16',
      title: 'Hydroxy Compounds (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Alcohols — primary/secondary/tertiary; -ol suffix; H-bonding → high BP vs alkanes; miscibility with water decreases with chain length',
        'Combustion: alcohol + O₂ → CO₂ + H₂O',
        'Oxidation with acidified K₂Cr₂O₇ (orange→green): primary → aldehyde (distil) → carboxylic acid (reflux); secondary → ketone; tertiary → no reaction',
        'Dehydration to alkene — conc H₃PO₄ or Al₂O₃ with heat; elimination of H₂O',
        'Reaction with Na — 2ROH + 2Na → 2RONa + H₂; slower than water + Na',
        'Reaction with PCl₅ — ROH + PCl₅ → RCl + POCl₃ + HCl; white fumes confirm -OH',
        'Esterification — alcohol + carboxylic acid ⇌ ester + H₂O; conc H₂SO₄ catalyst; reversible; naming: alkyl alkanoate',
        'Industrial ethanol — fermentation (glucose → ethanol + CO₂; yeast zymase; anaerobic; ~37°C; slow; batch; renewable; dilute product); hydration of ethene (steam + H₃PO₄; 300°C, 65 atm; continuous; fast; concentrated; non-renewable feedstock); atom economy, purity, sustainability comparison',
        'Phenol — more acidic than alcohols (pKa ~10); phenoxide C₆H₅O⁻ stabilised by delocalisation into ring; reacts with NaOH → sodium phenoxide; does NOT react with Na₂CO₃; Br₂(aq) without catalyst → 2,4,6-tribromophenol (white precipitate); OH activates ring → ortho/para substitution',
      ],
      forbiddenTopics: [
        'Detailed phenol EAS mechanism — Topic 32 A Level only',
        'LiAlH₄ reduction — Topic 33 A Level only',
      ],
      requiredKeywords: [
        'primary secondary tertiary alcohol', 'H-bonding BP higher than alkanes',
        'K₂Cr₂O₇ orange→green', 'primary→aldehyde→carboxylic acid',
        'secondary→ketone', 'tertiary no reaction',
        'dehydration H₃PO₄ or Al₂O₃', 'esterification alkyl alkanoate reversible',
        'fermentation vs hydration ethene',
        'phenol pKa ~10', 'phenoxide delocalisation', 'Na₂CO₃ no reaction phenol',
        '2,4,6-tribromophenol without catalyst',
      ],
      practicalNotes: [
        'Paper 3: K₂Cr₂O₇ test distinguishes 1°/2° alcohol (orange→green) from 3° (no change)',
        'Set up reflux for oxidation to carboxylic acid; set up distillation to collect aldehyde',
      ],
    },
 
    topic17: {
      code: '9701-T17',
      title: 'Carbonyl Compounds (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Aldehydes -CHO (-al); ketones C=O (-one); C=O polar; no H-bonding between molecules → lower BP than alcohols; soluble in water (H-bond donor water + C=O acceptor)',
        'Nucleophilic addition of HCN — KCN catalyst; CN⁻ attacks δ+ C of C=O; mechanism: CN⁻ → alkoxide → protonated by HCN → hydroxynitrile; new chiral centre → racemic mixture; chain extension application',
        'Reduction with NaBH₄ — aldehyde → primary alcohol; ketone → secondary alcohol',
        'Distinguishing aldehydes from ketones: Tollens\' reagent [Ag(NH₃)₂]⁺: aldehyde → silver mirror (Ag°); ketone → no reaction; Fehling\'s/Benedict\'s (alkaline Cu²⁺): aliphatic aldehyde → brick-red Cu₂O; aromatic aldehyde no reaction; ketone no reaction',
        '2,4-DNPH (Brady\'s reagent) — reacts with BOTH aldehyde AND ketone → orange/yellow crystalline precipitate; confirms carbonyl; recrystallise + measure MP to identify specific compound',
        'Iodoform test — I₂ in NaOH; CHI₃ yellow precipitate with distinct smell; confirms: CH₃COR (methyl ketones); CH₃CHO (ethanal); CH₃CH(OH)- group (secondary alcohol oxidised in situ)',
      ],
      forbiddenTopics: [
        'Acetal/hemiacetal — not in syllabus', 'Wittig — not in syllabus',
      ],
      requiredKeywords: [
        'aldehyde -al', 'ketone -one', 'C=O polar no H-bonding between molecules',
        'nucleophilic addition CN⁻ attacks δ+ C', 'hydroxynitrile chiral centre racemic',
        'NaBH₄ aldehyde→primary alcohol ketone→secondary alcohol',
        'Tollens\' silver mirror aldehydes only', 'Fehling\'s brick-red Cu₂O aliphatic aldehyde',
        '2,4-DNPH orange both aldehyde and ketone', 'iodoform CHI₃ yellow methyl ketone',
      ],
    },
 
    topic18: {
      code: '9701-T18',
      title: 'Carboxylic Acids and Derivatives (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Carboxylic acids -COOH (-oic acid); H-bonding → dimerisation → high BP; acidic; with Na → H₂ + salt; with NaOH → salt + H₂O; with Na₂CO₃ → salt + H₂O + CO₂ (effervescence distinguishes from alcohols and phenol)',
        'Esterification — acid + alcohol ⇌ ester + H₂O; conc H₂SO₄ catalyst; reversible; naming: alkyl alkanoate',
        'Acyl chlorides -COCl — more reactive than carboxylic acids; nucleophilic addition-elimination: with H₂O → carboxylic acid + HCl (steamy fumes); with alcohol → ester + HCl; with NH₃ → primary amide + HCl; with RNH₂ → secondary amide + HCl; all produce HCl; full curly arrow mechanism required',
        'Acid anhydrides — less reactive than acyl chlorides; with H₂O → 2× carboxylic acid; with alcohol → ester + carboxylic acid (no HCl, preferred industrially); aspirin synthesis: ethanoic anhydride + 2-hydroxybenzoic acid → aspirin + ethanoic acid',
        'Esters — acid hydrolysis (H₂SO₄/H₂O, reflux) → acid + alcohol (reversible); base hydrolysis/saponification (NaOH/H₂O, reflux) → carboxylate salt + alcohol (irreversible; soap making)',
      ],
      forbiddenTopics: [
        'LiAlH₄ reduction — Topic 33 A Level only',
        'Amino acid peptide bonds — Topics 19 and 34',
        'Fats and oils — Topic 33 A Level only',
      ],
      requiredKeywords: [
        'carboxylic acid dimerisation H-bonding', 'Na₂CO₃ CO₂ effervescence',
        'acyl chloride -COCl nucleophilic addition-elimination',
        'steamy fumes HCl', 'primary amide', 'secondary N-substituted amide',
        'acid anhydride less reactive', 'aspirin ethanoic anhydride',
        'ester hydrolysis reversible acid', 'saponification NaOH irreversible', 'soap',
      ],
    },
 
    topic19: {
      code: '9701-T19',
      title: 'Nitrogen Compounds (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Amines — primary RNH₂, secondary R₂NH, tertiary R₃N; lone pair on N → basicity + nucleophilicity',
        'Basicity: aliphatic amines more basic than NH₃ (alkyl groups electron-donating → more e-density on N); phenylamine less basic than NH₃ (lone pair delocalised into ring → less available)',
        'Reactions: with HCl → alkylammonium salt; with acyl chloride → secondary amide + HCl',
        'Preparation: from halogenoalkane + excess conc NH₃ sealed tube heat → mixture; from nitrile + LiAlH₄ → primary amine (+1C); from nitrobenzene + Sn + conc HCl then NaOH → phenylamine',
        'Amino acids — H₂N-CHR-COOH; R group varies; zwitterion NH₃⁺-CHR-COO⁻ at isoelectric point; below pI net positive; above pI net negative',
        'Peptide bond — condensation between -NH₂ and -COOH → -CO-NH- + H₂O; dipeptide/polypeptide; hydrolysis in HCl or NaOH or enzyme → amino acids',
        'Protein structure — primary (sequence, peptide bonds); secondary (α-helix H-bonds between C=O and N-H i+4; β-pleated sheet H-bonds between chains); tertiary (H-bonds, ionic bonds, disulfide bonds -S-S- cysteine, hydrophobic interactions); quaternary (multiple subunits e.g. haemoglobin 4 subunits)',
        'Diazonium ions — primary aromatic amine + NaNO₂ + HCl at 0-5°C → ArN₂⁺Cl⁻; must keep cold (unstable >10°C); coupling with phenol (alkaline NaOH) → azo dye R-N=N-Ar; bright colour; -N=N- chromophore; textile dyes',
      ],
      forbiddenTopics: [
        'Sandmeyer reactions — Topic 34 A Level only',
        'Electrophoresis of amino acids — Topic 34 A Level only',
      ],
      requiredKeywords: [
        'amine primary secondary tertiary', 'lone pair basicity',
        'aliphatic more basic than NH₃', 'phenylamine less basic delocalised',
        'amino acid zwitterion isoelectric point',
        'peptide bond -CO-NH- condensation', 'protein primary secondary tertiary quaternary',
        'α-helix H-bonds i+4', 'β-pleated sheet', 'disulfide bonds cysteine',
        'diazonium ion 0-5°C', 'coupling reaction azo dye -N=N- chromophore',
      ],
    },
 
    topic20: {
      code: '9701-T20',
      title: 'Polymerisation (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Addition polymerisation — C=C monomers → polymer without loss of small molecule; repeat unit from monomer and vice versa; poly(ethene) LDPE/HDPE, poly(propene), PVC, PTFE, polystyrene; non-biodegradable; burning PVC → HCl toxic; burning PTFE → HF toxic',
        'Condensation polymerisation — bifunctional monomers; loses small molecule (H₂O or HCl)',
        'Polyesters — diol + dicarboxylic acid; ester bond -COO-; Terylene/PET: ethane-1,2-diol + benzene-1,4-dicarboxylic acid; repeat unit drawing; hydrolysis in acid (reversible) or base (irreversible)',
        'Polyamides — diamine + dicarboxylic acid; amide bond -CONH-; nylon-6,6: 1,6-diaminohexane + hexanedioic acid; Kevlar: 1,4-diaminobenzene + benzene-1,4-dicarboxylic acid (H-bonds between chains → very high strength); repeat unit drawing; hydrolysis',
        'Biodegradability — condensation polymers hydrolysable → biodegradable; addition polymers non-biodegradable; PLA (polylactic acid) from renewable starch → biodegradable polyester alternative',
      ],
      forbiddenTopics: [
        'Cationic polymerisation, Ziegler-Natta, conducting polymers — Topic 35 A Level only',
      ],
      requiredKeywords: [
        'addition polymerisation', 'repeat unit', 'condensation polymerisation',
        'polyester ester bond -COO-', 'Terylene PET diol + dicarboxylic acid',
        'polyamide amide bond -CONH-', 'nylon-6,6', 'Kevlar H-bonds strength',
        'biodegradable condensation hydrolysis', 'non-biodegradable addition',
        'PLA renewable biodegradable',
      ],
    },
 
    topic21: {
      code: '9701-T21',
      title: 'Organic Synthesis (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Multi-step synthesis — planning routes between functional groups using all AS Level reactions (Topics 14-20); reagents, conditions, solvents for each step',
        'Retrosynthesis — working backward from target to starting material',
        'Functional group tests for identification: bromine water (alkene/phenol decolourises; alkane does not without UV); K₂Cr₂O₇/H₂SO₄ (1° or 2° alcohol/aldehyde orange→green; ketone/3° no change); Tollens\' (aldehyde→silver mirror); Fehling\'s (aliphatic aldehyde→brick-red Cu₂O); 2,4-DNPH (carbonyl→orange precipitate); iodoform I₂/NaOH (methyl ketone/ethanal→yellow CHI₃); Na₂CO₃ (carboxylic acid→CO₂; phenol→no CO₂); AgNO₃ acidified (halide→precipitate)',
        'Purification — recrystallisation (hot solvent, cool, filter, dry); distillation; solvent extraction (separating funnel); melting point as purity test (sharp = pure; broad range = impure)',
        'Atom economy — Mr desired product / total Mr all reactants × 100%; green chemistry principle; addition reactions 100%; substitution/elimination lower',
      ],
      forbiddenTopics: [
        'A Level synthesis routes — Topic 36 A Level only',
      ],
      requiredKeywords: [
        'multi-step synthesis', 'reagents conditions', 'retrosynthesis',
        'bromine water', 'K₂Cr₂O₇', 'Tollens\'', 'Fehling\'s',
        '2,4-DNPH orange', 'iodoform yellow CHI₃', 'Na₂CO₃ CO₂',
        'recrystallisation', 'melting point purity', 'atom economy',
      ],
    },
 
    topic22: {
      code: '9701-T22',
      title: 'Analytical Techniques (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Mass spectrometry — M⁺ gives Mr; base peak most abundant; fragmentation patterns; common losses from M⁺: CH₃ (15), C₂H₅ (29), C₃H₇ (43); M+2 peaks: Cl 3:1 ratio; Br 1:1 ratio; high-resolution MS → molecular formula',
        'Infrared spectroscopy — wavenumber (cm⁻¹) vs absorbance; functional group identification: O-H alcohol broad 3200-3550 cm⁻¹; O-H carboxylic acid very broad 2500-3300 cm⁻¹; N-H 3300-3500 cm⁻¹; C=O carbonyl sharp 1640-1750 cm⁻¹ (ester ~1735; ketone/aldehyde ~1715; carboxylic acid ~1700; amide ~1660); C-H 2850-3100 cm⁻¹; fingerprint region below 1500 cm⁻¹ unique to compound; green chemistry: monitoring reaction progress by IR',
        'Combining MS and IR — Mr from MS + functional groups from IR → propose structural formula; systematic approach: check M⁺; check Cl/Br isotope pattern; identify functional groups from IR; calculate degrees of unsaturation',
      ],
      forbiddenTopics: [
        '¹H NMR spectroscopy — Topic 37 A Level only',
        '¹³C NMR — Topic 37 A Level only',
        'GC-MS — Topic 37 A Level only',
        'HPLC — Topic 37 A Level only',
      ],
      requiredKeywords: [
        'M⁺ molecular ion', 'base peak', 'fragmentation', 'm/z',
        'Cl 3:1 M:M+2', 'Br 1:1 M:M+2',
        'IR wavenumber', 'O-H broad 3200-3550 alcohol',
        'O-H very broad 2500-3300 carboxylic acid',
        'C=O sharp 1640-1750', 'ester ~1735', 'amide ~1660',
        'fingerprint region below 1500',
      ],
    },
 
    topic23: {
      code: '9701-T23',
      title: 'Chemical Energetics (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'Lattice energy ΔHlat — enthalpy when 1 mol ionic compound forms from gaseous ions (exothermic, negative); factors: ionic charge (higher → more exothermic); ionic radius (smaller → more exothermic)',
        'Born-Haber cycle — Hess cycle for ionic compounds; steps: atomisation of metal ΔHat⦵; IE₁ (and IE₂ for M²⁺); atomisation of non-metal; EA₁ (usually exothermic); EA₂ (endothermic for O²⁻ and S²⁻); ΔHf⦵; lattice energy; calculating any unknown term',
        'Comparing experimental vs theoretical lattice energies — difference indicates covalent character due to polarisation; Fajans\' rules: small highly-charged cation (high charge density) distorts large polarisable anion → covalent character; e.g. AgI significantly covalent',
        'Enthalpy of solution ΔHsol — ionic solid dissolves in water; ΔHsol = ΔHhyd(cation) + ΔHhyd(anion) − ΔHlat; hydration enthalpy ΔHhyd always negative (exothermic); larger charge + smaller radius → more negative ΔHhyd',
        'Entropy S — measure of disorder; units J K⁻¹ mol⁻¹; more gaseous moles → ΔS positive; fewer gaseous moles → ΔS negative; dissolving → ΔS positive; ΔS°reaction = ΣS°products − ΣS°reactants',
        'Gibbs free energy ΔG = ΔH − TΔS; ΔG < 0 spontaneous/feasible; ΔG > 0 not feasible; T = ΔH/ΔS at which reaction just becomes feasible; four cases: exo+pos ΔS always feasible; exo+neg ΔS feasible below threshold T; endo+pos ΔS feasible above threshold T; endo+neg ΔS never feasible; thermodynamic feasibility ≠ kinetic feasibility',
      ],
      forbiddenTopics: [
        'AS energetics (Hess, calorimetry, bond enthalpies) — Topic 5 assumed; do not repeat',
        'Electrode potentials — Topic 24', 'Rate equations — Topic 26',
      ],
      requiredKeywords: [
        'lattice energy', 'Born-Haber cycle', 'atomisation', 'electron affinity',
        'EA₂ endothermic O²⁻', 'Fajans\' rules', 'covalent character polarisation',
        'enthalpy of solution', 'hydration enthalpy smaller ion more negative',
        'entropy S units J K⁻¹ mol⁻¹', 'ΔG = ΔH − TΔS',
        'spontaneous ΔG < 0', 'T = ΔH/ΔS threshold',
        'thermodynamic feasibility not same as kinetic feasibility',
      ],
    },
 
    topic24: {
      code: '9701-T24',
      title: 'Electrochemistry (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'Standard electrode potential E⦵ — standard conditions (298K, 1 mol dm⁻³, 101 kPa) relative to SHE = 0.00V; SHE: H₂(g) 101kPa over Pt in 1 mol dm⁻³ H⁺(aq)',
        'Standard cell EMF — E⦵cell = E⦵cathode − E⦵anode; positive E⦵cell = thermodynamically feasible; more positive E⦵ = cathode (reduction); less positive = anode (oxidation)',
        'Electrochemical series — more positive E⦵ = stronger oxidising agent; more negative = stronger reducing agent',
        'Predicting feasibility — E⦵cell > 0 thermodynamically feasible; kinetics may prevent reaction (kinetic stability)',
        'Qualitative effect of concentration — Le Chatelier: increasing [oxidised form] increases E; increasing [reduced form] decreases E',
        'Hydrogen-oxygen fuel cell — H₂ oxidised at anode: H₂ → 2H⁺ + 2e⁻; O₂ reduced at cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O; advantages: efficient, only H₂O produced; disadvantages: H₂ storage difficult, H₂ from fossil fuels usually',
        'Electrolysis — anode oxidation (+); cathode reduction (−); products depend on: molten vs aqueous; concentration; relative discharge potentials',
        'Electrolysis products: molten NaCl → Na(cathode), Cl₂(anode); aqueous conc NaCl → H₂(cathode), Cl₂(anode); aqueous dilute NaCl → H₂(cathode), O₂(anode); dilute H₂SO₄ → H₂(cathode), O₂(anode); aqueous CuSO₄ inert electrodes → Cu(cathode), O₂(anode); aqueous CuSO₄ Cu electrodes → Cu deposits(cathode), Cu dissolves(anode): copper purification',
        'Electrolysis calculations — Q = It; moles electrons = Q/96500 (F = 96500 C mol⁻¹); moles product from stoichiometry; mass = moles × Mr',
      ],
      forbiddenTopics: [
        'AS redox oxidation numbers — Topic 6 assumed', 'Nernst equation calculations — qualitative only',
        'Transition metal redox — Topic 28',
      ],
      requiredKeywords: [
        'E⦵ standard electrode potential', 'SHE 0.00V', 'E⦵cell = E⦵cathode − E⦵anode',
        'positive E⦵cell thermodynamically feasible', 'kinetics may prevent reaction',
        'fuel cell H₂ anode O₂ cathode H₂O only product',
        'electrolysis anode oxidation cathode reduction',
        'Q = It', 'Faraday constant 96500 C mol⁻¹', 'copper purification',
      ],
    },
 
    topic25: {
      code: '9701-T25',
      title: 'Equilibria (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'Brønsted-Lowry — acid: proton donor; base: proton acceptor; conjugate acid-base pair differ by one proton; amphoteric: H₂O, HCO₃⁻, amino acids',
        'Ka and pKa — Ka = [H⁺][A⁻]/[HA]; pKa = −log Ka; larger Ka / smaller pKa = stronger weak acid; [H⁺] ≈ √(Ka × [HA]); pH = ½pKa − ½log[HA]',
        'Kw = [H⁺][OH⁻] = 10⁻¹⁴ at 25°C; pKw = 14; pH of neutral solution = 7 only at 25°C; Kw increases with temperature (endothermic reaction); neutral solution [H⁺] = [OH⁻] at all temperatures',
        'pH calculations — strong acid: pH = −log[acid]; strong base: [OH⁻] → pOH → pH = 14 − pOH; weak acid: pH = ½(pKa − log[HA]); buffer: pH = pKa + log([A⁻]/[HA]) Henderson-Hasselbalch',
        'Buffer — weak acid + conjugate base (salt); mechanism: added H⁺ neutralised by A⁻; added OH⁻ neutralised by HA; pH = pKa when [A⁻] = [HA]; biological importance: blood pH 7.4 (H₂CO₃/HCO₃⁻)',
        'Titration curves — strong acid/strong base: equivalence pH 7; steep pH ~3.5-10.5; strong acid/weak base: equivalence pH < 7; weak acid/strong base: equivalence pH > 7; weak/weak: no sharp section; half-equivalence for weak acid: pH = pKa; indicator: pKin within steep section; methyl orange pKin ~4; phenolphthalein pKin ~9',
        'Ksp — sparingly soluble salts; e.g. AgCl: Ksp = [Ag⁺][Cl⁻]; calculating from solubility; predicting precipitation: Qsp > Ksp → precipitate forms; common ion effect reduces solubility',
        'Partition coefficient Kpc — [solute in solvent 1]/[solute in solvent 2]; multiple small extractions more efficient than one large; industrial separations',
      ],
      forbiddenTopics: [
        'AS equilibria (Le Chatelier, Kc, Kp) — Topic 7 assumed',
      ],
      requiredKeywords: [
        'Brønsted-Lowry', 'conjugate acid-base pair', 'amphoteric',
        'Ka', 'pKa', 'Kw = 10⁻¹⁴', 'pH calculations',
        'Henderson-Hasselbalch', 'buffer mechanism A⁻ neutralises H⁺',
        'half-equivalence pH = pKa', 'indicator pKin within steep section',
        'Ksp', 'Qsp > Ksp precipitate forms', 'common ion effect',
        'partition coefficient', 'multiple extractions more efficient',
      ],
    },
 
    topic26: {
      code: '9701-T26',
      title: 'Reaction Kinetics (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'Rate equation — rate = k[A]^m[B]^n; order with respect to each reactant; overall order m+n; determined experimentally NOT from stoichiometry',
        'Orders — zero order: rate independent of [A]; first order: rate ∝ [A]; second order: rate ∝ [A]²; initial rates method: if doubling [A] → rate doubles = first order; rate quadruples = second order; no change = zero order',
        'Units of k — zero order: mol dm⁻³ s⁻¹; first order: s⁻¹; second order: mol⁻¹ dm³ s⁻¹',
        'Graphs — [A] vs time: zero order = straight line; first order = exponential decay; second order = different curve; rate vs [A]: zero order = horizontal; first order = straight through origin; second order = upward curve; ln[A] vs t = straight line with gradient = −k for first order',
        'Half-life t½ — first order ONLY: t½ = ln2/k = 0.693/k; constant independent of initial concentration; confirms first order; radioactive decay application',
        'Arrhenius equation — k = Ae^(−Ea/RT); ln k = ln A − Ea/RT; plot ln k (y) vs 1/T (x): gradient = −Ea/R; y-intercept = ln A; from two temperatures: ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂)',
        'Mechanisms — rate-determining step (RDS) = slowest step; rate equation reflects molecularity of RDS; mechanism must be consistent with (a) experimental rate equation AND (b) overall stoichiometry; SN1: rate = k[RX] → unimolecular RDS; SN2: rate = k[RX][Nu] → bimolecular RDS',
      ],
      forbiddenTopics: [
        'AS collision theory — Topic 8 assumed; begin with rate equations directly',
      ],
      requiredKeywords: [
        'rate equation', 'rate constant k', 'order of reaction', 'initial rates method',
        'zero first second order', 'units of k',
        'half-life t½ = 0.693/k', 'constant half-life confirms first order',
        'Arrhenius equation k = Ae^(-Ea/RT)', 'ln k vs 1/T gradient = −Ea/R',
        'rate-determining step', 'SN1 unimolecular', 'SN2 bimolecular',
      ],
    },
 
    topic28: {
      code: '9701-T28',
      title: 'Chemistry of Transition Elements (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'Definition — d-block element forming at least one stable ion with incomplete d sub-shell; Sc³⁺ = [Ar]3d⁰ and Zn²⁺ = [Ar]3d¹⁰ → NOT transition metals',
        'Electronic configurations — Cr: [Ar]3d⁵4s¹ (anomaly — half-filled d extra stable); Cu: [Ar]3d¹⁰4s¹ (anomaly — full d extra stable); 4s fills before 3d; 4s empties BEFORE 3d when forming ions: Fe [Ar]3d⁶4s² → Fe²⁺ [Ar]3d⁶ → Fe³⁺ [Ar]3d⁵',
        'Variable oxidation states — similar energies of 3d and 4s; V: +2,+3,+4,+5; Cr: +2,+3,+6; Mn: +2,+3,+4,+6,+7; Fe: +2,+3; Co: +2,+3; Ni: +2; Cu: +1,+2',
        'Colour and d-d transitions — ligand field splits d orbitals into two energy levels; electron absorbs specific visible wavelength → complimentary colour observed; different ligands, oxidation states → different colours; d⁰ and d¹⁰ colourless; key colours: [Cu(H₂O)₆]²⁺ pale blue; [Cu(NH₃)₄(H₂O)₂]²⁺ deep blue; CrO₄²⁻ yellow; Cr₂O₇²⁻ orange; MnO₄⁻ deep purple; Mn²⁺ pale pink; Fe³⁺ pale yellow-brown; Fe²⁺ pale green; [Ti(H₂O)₆]³⁺ purple',
        'Catalytic activity — variable oxidation state allows electron acceptance/donation; heterogeneous: Fe (Haber, surface adsorption lowers Ea); V₂O₅ (Contact process: V⁵⁺ oxidises SO₂ → SO₃ → reduced to V⁴⁺ → reoxidised by O₂ → V⁵⁺ regenerated); Pt/Pd/Rh catalytic converters; homogeneous: Fe³⁺ in S₂O₈²⁻ + I⁻ reaction',
        'Complex ions — ligand: molecule or ion donating lone pair to central metal ion (Lewis base); dative covalent bond; coordination number = number of dative bonds; monodentate: H₂O, NH₃, Cl⁻, CN⁻, OH⁻, CO; bidentate: en (ethane-1,2-diamine), ox²⁻ (ethanedioate); polydentate: EDTA⁴⁻ (6 donor atoms); chelate effect: polydentate more stable — ΔS more positive (entropy advantage)',
        'Geometry — coordination number 6 → octahedral 90°; coordination number 4 → tetrahedral (e.g. [CoCl₄]²⁻) or square planar (Pt²⁺, e.g. [Pt(NH₃)₂Cl₂]); coordination number 2 → linear (e.g. [Ag(NH₃)₂]⁺)',
        'Isomerism — cis-trans in square planar and octahedral; cisplatin cis-[Pt(NH₃)₂Cl₂] is anti-cancer (cross-links adjacent guanine on same DNA strand preventing replication); transplatin inactive; optical isomerism in tris-bidentate octahedral (no plane of symmetry → non-superimposable mirror images)',
        'NaOH reactions: [Cu(H₂O)₆]²⁺ + 2OH⁻ → Cu(OH)₂ pale blue; [Fe(H₂O)₆]²⁺ + 2OH⁻ → Fe(OH)₂ green; [Fe(H₂O)₆]³⁺ + 3OH⁻ → Fe(OH)₃ brown; [Cr(H₂O)₆]³⁺ + 3OH⁻ → Cr(OH)₃ grey-green (dissolves in excess NaOH → [Cr(OH)₄]⁻ amphoteric)',
        'Excess NH₃: Cu(OH)₂ dissolves → [Cu(NH₃)₄(H₂O)₂]²⁺ deep blue; Cr(OH)₃ dissolves → [Cr(NH₃)₆]³⁺; Fe²⁺/Fe³⁺ precipitates do NOT dissolve in excess NH₃',
        'Redox reactions: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O (purple → colourless); Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O (orange → green); vanadium reduction with Zn in dilute H₂SO₄: V⁵⁺ VO₂⁺ yellow → V⁴⁺ VO²⁺ blue → V³⁺ [V(H₂O)₆]³⁺ green → V²⁺ [V(H₂O)₆]²⁺ violet; CrO₄²⁻/Cr₂O₇²⁻ equilibrium: 2CrO₄²⁻(yellow) + 2H⁺ ⇌ Cr₂O₇²⁻(orange) + H₂O; yellow in alkali, orange in acid',
      ],
      forbiddenTopics: [
        'Crystal field theory quantitative — qualitative colour only',
        'Lanthanides and actinides — not in 9701',
        'Cr and Cu configurations at AS level — Topic 1 boundary',
      ],
      requiredKeywords: [
        'incomplete d sub-shell', 'Cr [Ar]3d⁵4s¹ anomaly', 'Cu [Ar]3d¹⁰4s¹ anomaly',
        '4s empties before 3d forming ions',
        'variable oxidation states', 'd-d transition', 'ligand field splitting',
        'ligand Lewis base dative bond', 'coordination number',
        'monodentate bidentate en ox²⁻', 'EDTA polydentate', 'chelate effect entropy',
        'octahedral 90°', 'square planar', 'tetrahedral',
        'cisplatin cross-links DNA anticancer', 'transplatin inactive',
        'optical isomerism tris-bidentate',
        'Cu(OH)₂ pale blue', 'Fe(OH)₂ green', 'Fe(OH)₃ brown', 'Cr(OH)₃ amphoteric dissolves excess NaOH',
        '[Cu(NH₃)₄(H₂O)₂]²⁺ deep blue',
        'MnO₄⁻ purple → Mn²⁺ colourless', 'Cr₂O₇²⁻ orange → Cr³⁺ green',
        'vanadium V⁵⁺ yellow V⁴⁺ blue V³⁺ green V²⁺ violet',
        'CrO₄²⁻ yellow Cr₂O₇²⁻ orange pH dependent',
        'V₂O₅ Contact process redox cycle', 'Fe Haber surface adsorption',
      ],
      practicalNotes: [
        'Paper 5/Paper 3 context: identifying transition metal ions with NaOH and NH₃; colour of precipitate and whether dissolves in excess',
        'Permanganate titrations: MnO₄⁻ purple endpoint when excess; need acidified solution; no indicator required (self-indicating)',
        'Writing half-equations for MnO₄⁻ and Cr₂O₇²⁻ in acid conditions',
      ],
    },
 
    topic29to37: {
      code: '9701-T29-37',
      title: 'A Level Organic Chemistry (Topics 29-37)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        // Topic 29 — A Level Organic intro
        'Conformational isomers — rotation around C-C single bond; eclipsed vs staggered ethane; Newman projection; eclipsed higher energy (steric repulsion); conformers not isolable at room temperature',
        'Directing effects review — activating ortho/para directors: OH, NH₂, alkyl (electron-donating, activate ring, direct ortho/para); deactivating meta directors: NO₂, COR, COOR, CN (electron-withdrawing, deactivate, direct meta); strategy: choose order of substitution based on directing effects to achieve target product',
        '¹³C NMR introduction — each chemically distinct carbon gives one signal; chemical shifts: 0-50 ppm alkyl C; 50-90 ppm C-X or C-O; 110-160 ppm aromatic/alkene C; 160-220 ppm carbonyl C; broadband decoupling removes coupling → one peak per carbon; DEPT identifies CH, CH₂, CH₃',
        // Topic 30 — A Level Hydrocarbons
        'Diels-Alder [4+2] cycloaddition — conjugated diene (must be s-cis conformation) + dienophile → cyclohexene derivative; pericyclic concerted mechanism; syn addition; electron-withdrawing groups on dienophile accelerate reaction; useful ring-forming reaction in synthesis',
        '1,2- vs 1,4-addition to conjugated dienes — kinetic control (1,2-addition at low T; primary carbocation less stable but forms faster); thermodynamic control (1,4-addition at high T; more stable product)',
        'Ozonolysis — O₃ followed by reductive workup (Zn/CH₃COOH) → aldehydes and ketones from each C of double bond; oxidative workup (H₂O₂) → terminal alkene C → carboxylic acid; identifies position of double bond in chain',
        'Alkyl benzene side chain oxidation — hot conc KMnO₄/acid → carboxylic acid at position of alkyl group (e.g. methylbenzene → benzoic acid); useful in synthesis',
        // Topic 31 — A Level Halogen Compounds
        'Aryl halides — C-Cl in chlorobenzene has partial double bond character (overlap with ring π system) → less reactive toward nucleophilic substitution than alkyl halides; preparation of chlorobenzene: Cl₂ + AlCl₃ EAS; preparation of phenol from chlorobenzene requires NaOH at 300°C high pressure (harsh conditions)',
        // Topic 32 — A Level Hydroxy Compounds
        'Phenol acidity order — carboxylic acid (pKa ~5) > phenol (pKa ~10) > alcohol (pKa ~16); resonance stabilisation of phenoxide ion explains why phenol more acidic than alcohol; Na₂CO₃ reacts with carboxylic acid but NOT phenol (phenol not acidic enough to displace CO₃²⁻); NaHCO₃ also reacts with carboxylic acid but NOT phenol',
        'Phenol esterification — with acyl chloride → phenyl ester + HCl; with acid anhydride → phenyl ester + carboxylic acid (less corrosive, preferred); aspirin synthesis (Kolbe/anhydride route from 2-hydroxybenzoic acid + ethanoic anhydride)',
        // Topic 33 — A Level Carboxylic Acids
        'LiAlH₄ reduction — reduces carboxylic acid → primary alcohol; reduces ester → two alcohols; reduces amide → amine; requires dry ether; reacts violently with water',
        'Fats and oils — triesters of glycerol (propane-1,2,3-triol) with long-chain fatty acids; saturated (all C-C single bonds) = solid fat; unsaturated (C=C) = liquid oil; saponification (NaOH aq) → glycerol + sodium salts of fatty acids (soap); micelle action of soap in cleaning; transesterification with methanol → biodiesel (FAME)',
        'Lactams — cyclic amides; β-lactam ring in penicillin; ring strain makes reactive',
        // Topic 34 — A Level Nitrogen Compounds
        'Sandmeyer reactions — diazonium ion ArN₂⁺ at 0-5°C: + CuCl → ArCl + N₂; + CuCN → ArCN + N₂; + KI → ArI + N₂ (direct); replaces NH₂ with Cl, CN, or I; useful when direct EAS not possible',
        'Electrophoresis of amino acids — at pH below pI: amino acid positively charged → migrates to cathode; at pH above pI: negatively charged → migrates to anode; separates amino acids by pI',
        'Biuret test for proteins — Cu²⁺ in alkaline solution + peptide bonds (≥2) → mauve/purple colour; confirms polypeptide',
        // Topic 35 — A Level Polymerisation
        'Ziegler-Natta polymerisation — TiCl₄ + Al(C₂H₅)₃ catalyst; produces isotactic polypropene (regular stereoregular structure); unbranched HDPE; highly crystalline; high tensile strength; compared with LDPE (radical polymerisation: branched, amorphous, lower MP)',
        'Cationic polymerisation — Lewis acid catalyst (BF₃); generates carbocation from monomer; chain growth via carbocation; branched polymers',
        'Conducting polymers — polyacetylene (polyethyne): conjugated alternating single/double bonds → delocalised π electrons; semiconductor; doping with I₂ → p-type conductor; applications: flexible electronics, sensors, batteries',
        'PLA polylactic acid — from lactic acid (2-hydroxypropanoic acid) by fermentation of starch; polyester (OH and COOH on same monomer → condensation); biodegradable by hydrolysis; renewable feedstock; replacing conventional plastics for packaging',
        'Polymer physical properties — crystalline regions (aligned chains, strong intermolecular forces, high Tm, high tensile strength) vs amorphous (random chains, flexible, lower Tg); glass transition temperature Tg; plasticisers (fit between chains, reduce Tg, more flexible); cross-linking (covalent bonds between chains → thermoset polymer, hard, cannot melt; vulcanisation of rubber with S)',
        // Topic 36 — A Level Organic Synthesis
        'Retrosynthetic analysis — formal disconnection; working backward from target; identifying synthon and corresponding reagent; building from commercially available materials',
        'Stereochemical control — SN2 = inversion at chiral centre; SN1 = racemisation; chiral catalyst → asymmetric synthesis → single enantiomer; pharmaceutical importance: thalidomide (S-enantiomer sedative; R-enantiomer teratogen)',
        'Atom economy and green chemistry — atom economy = Mr desired product / total Mr all reactants × 100%; addition reactions 100%; catalytic reactions preferred (catalyst not consumed); waste reduction; renewable feedstocks; safer solvents',
        // Topic 37 — A Level Analytical Techniques
        '¹H NMR spectroscopy — chemical shift δ (ppm) relative to TMS at 0 ppm; number of signals = number of chemically non-equivalent H environments; integration = relative number of H in each environment; spin-spin splitting n+1 rule: n adjacent non-equivalent H → n+1 peaks; singlet (0 adjacent H); doublet (1); triplet (2); quartet (3); common shifts: CH₃ alkyl ~0.9 ppm; CH₂ alkyl ~1.3 ppm; CH₂-O ~3.4 ppm; ArH aromatic ~7-8 ppm; RCHO aldehyde ~9-10 ppm; RCOOH ~10-12 ppm; OH and NH broad/variable; D₂O shake removes OH/NH peaks; combining ¹H NMR + MS + IR + ¹³C NMR for full structure determination',
        'GC-MS — carrier gas (N₂ or He); stationary phase liquid on inert solid in column; components separate by BP and polarity (retention time); mass spectrometer as detector → molecular formula and fragmentation for each peak; peak area proportional to amount → quantitative; applications: blood alcohol, environmental analysis, forensics',
        'HPLC — for non-volatile compounds; reversed-phase: polar mobile phase (water/acetonitrile), non-polar stationary; UV or refractive index detector; retention time for identification; pharmaceutical QC and purity testing',
      ],
      forbiddenTopics: [
        'AS organic content — Topics 13-22 assumed knowledge; do not repeat',
        '2D NMR (COSY, HMBC) — not required', 'Grignard, organolithium — not in 9701',
        'X-ray crystallography — not required',
      ],
      requiredKeywords: [
        'conformational isomers eclipsed staggered', 'Newman projection',
        '¹³C NMR one peak per distinct carbon', 'carbonyl 160-220 ppm',
        'Diels-Alder diene s-cis dienophile syn addition',
        '1,2-addition kinetic control', '1,4-addition thermodynamic control',
        'ozonolysis reductive oxidative workup',
        'Sandmeyer ArN₂⁺ + CuCl → ArCl', 'ArN₂⁺ + CuCN → ArCN', 'ArN₂⁺ + KI → ArI',
        'LiAlH₄ reduces COOH → primary alcohol', 'saponification soap micelles',
        'transesterification biodiesel', 'Ziegler-Natta isotactic HDPE unbranched crystalline',
        'conducting polymer polyacetylene conjugated', 'PLA biodegradable renewable',
        'cross-linking thermoset Tg glass transition', 'vulcanisation rubber',
        'retrosynthesis disconnection synthon', 'atom economy', 'chiral catalyst asymmetric synthesis', 'thalidomide',
        '¹H NMR TMS 0 ppm', 'n+1 rule', 'doublet triplet quartet singlet',
        'ArH ~7-8 ppm', 'CHO ~9-10 ppm', 'COOH ~10-12 ppm',
        'GC-MS retention time peak area quantitative', 'HPLC reversed-phase',
      ],
    },
 
    chemistry_paper3: {
      code: '9701-P3',
      title: 'Advanced Practical Skills Paper 3 (AS Level)',
      asLevel: true,
      paperRef: 'Paper 3 — 2 hours, 40 marks',
      allowedTopics: [
        'Safe handling — COSHH; PPE; fume cupboard for toxic/volatile chemicals; correct disposal; hazard symbols',
        'Accurate measurement — burette (read bottom of meniscus ±0.05 cm³; avoid parallax); pipette (use filler; drain completely); analytical balance (tare correctly; all sig figs); gas syringe; thermometer',
        'Titration technique — filling burette; initial reading; concordant titres (within 0.10 cm³); mean from concordant only; recording all raw data; indicator choice and endpoint',
        'Apparatus assembly — reflux; distillation; filtration gravity and under reduced pressure (Buchner); extraction with separating funnel; water bath for controlled heating',
        'Recrystallisation — dissolve in minimum hot solvent; cool slowly to crystallise; filter under reduced pressure; wash; dry',
        'Melting point — capillary tube; heat slowly ~1°C min⁻¹ near MP; sharp ≤1°C range = pure; broad/depressed = impure',
        'Colour changes in inorganic chemistry — K₂Cr₂O₇ orange → Cr³⁺ green; KMnO₄ purple → Mn²⁺ colourless/pale pink; Cu²⁺ pale blue → [Cu(NH₃)₄]²⁺ deep blue; Cu(OH)₂ pale blue precipitate; Fe²⁺ pale green → Fe(OH)₂ green; Fe³⁺ → Fe(OH)₃ brown; halogen colours in organic solvent',
        'Colour changes in organic chemistry — bromine water orange → colourless (alkene or phenol); K₂Cr₂O₇ orange → green (primary/secondary alcohol or aldehyde); 2,4-DNPH yellow-orange precipitate (carbonyl); Tollens\' silver mirror (aldehyde); Fehling\'s blue → brick-red Cu₂O (aliphatic aldehyde); iodoform CHI₃ yellow (methyl ketone/ethanal)',
        'Flame tests — Li⁺ red; Na⁺ yellow-orange; K⁺ lilac; Ca²⁺ brick-red; Sr²⁺ crimson; Ba²⁺ pale green',
        'Gas tests — H₂ pops with lit splint; O₂ relights glowing splint; Cl₂ bleaches damp red litmus; CO₂ turns limewater milky; NH₃ turns damp red litmus blue; SO₂ decolourises KMnO₄; HCl white fumes with NH₃',
        'Cation tests — add NaOH dropwise then excess; add NH₃ dropwise then excess; colour of precipitate; whether dissolves in excess; Cu²⁺, Fe²⁺, Fe³⁺, Cr³⁺, Al³⁺ (white ppt dissolves in excess NaOH), Zn²⁺ (white ppt dissolves in excess NaOH), Pb²⁺',
        'Anion tests — SO₄²⁻: BaCl₂(aq) acidified HCl → white BaSO₄ ppt (insoluble in HCl); CO₃²⁻: dilute HCl → CO₂ (limewater test); Cl⁻/Br⁻/I⁻: AgNO₃(aq) + dilute HNO₃; NO₃⁻: NaOH + Al foil → NH₃',
        'Organic tests — all from Topics 17-19: bromine water; K₂Cr₂O₇; Tollens\'; Fehling\'s; 2,4-DNPH; iodoform; Na₂CO₃; PCl₅; AgNO₃',
        'Calculations — titration: moles = c × V/1000; stoichiometric ratio; unknown concentration; % purity',
        'Percentage error — |absolute error| / reading × 100%; dominant source of error; specific improvements',
        'Graph skills — IV on x-axis, DV on y-axis; axes labelled with quantity and units; data covers >50% of grid; best-fit line; gradient using large triangle; intercept',
      ],
      forbiddenTopics: [
        'Theory from any topic — Paper 3 tests skills not content',
        'Rate equations, kinetics calculations — Paper 5/Paper 4',
      ],
      requiredKeywords: [
        'concordant titres 0.10 cm³', 'read bottom of meniscus', 'tare balance',
        'percentage error', 'dominant source of error', 'specific improvement not generic',
        'gradient large triangle', 'best-fit line',
        'K₂Cr₂O₇ orange→green', 'Tollens\' silver mirror', 'Fehling\'s brick-red Cu₂O',
        '2,4-DNPH orange precipitate', 'iodoform yellow CHI₃',
        'AgNO₃ acidified', 'AgCl white soluble dilute NH₃', 'AgBr cream soluble conc NH₃', 'AgI yellow insoluble',
        'BaCl₂ acidified SO₄²⁻ white BaSO₄', 'limewater CO₂ milky',
        'flame test colours', 'gas tests',
      ],
      boundaryNotes: [
        'UAE centres: Paper 3 usually replaced by Alternate Paper (written), using supplied experimental data.',
        'Colour changes must be precise — "turns from orange to green" not "changes colour".',
        'Organic identification: state reagent, conditions, and exact observation — all three needed for full marks.',
      ],
    },
 
    chemistry_paper5: {
      code: '9701-P5',
      title: 'Planning, Analysis and Evaluation Paper 5 (A Level)',
      asLevel: false,
      paperRef: 'Paper 5 — 1 hr 15 min, 30 marks',
      allowedTopics: [
        'Planning — aim; testable quantitative hypothesis ("as X doubles, rate will double because first order"); IV (what is changed); DV (what is measured); CVs (what is controlled and exactly how e.g. "thermostat at 25 ± 0.5°C in water bath")',
        'Experimental design — detailed step-by-step method; specific volumes, concentrations, masses; list all equipment with specifications; at least 5 values of IV over appropriate range; describe how each CV is controlled; repeats; control experiment (blank/negative control) and why needed',
        'Risk assessment — specific hazards for chemicals used; specific control measures; COSHH; context-specific not generic',
        'Processing data — sig figs; units; derived quantities (rate = 1/t; dilution C₁V₁ = C₂V₂; percentage)',
        'Graphs — correct type; axes with quantity + unit; scale covers >50% of grid; all points plotted; best-fit line or curve (not dot-to-dot); anomalous points identified; whether to include or exclude anomaly with reason',
        'Gradient and intercept — large triangle (>50% of line); units; tangent gradient = instantaneous rate',
        'Linearising — y = axⁿ: plot log y vs log x; gradient = n; y-intercept = log a; y = ae^(bx): plot ln y vs x; gradient = b; y-intercept = ln a; first order: ln[A] vs t gradient = −k; Arrhenius: ln k vs 1/T gradient = −Ea/R',
        'Statistical analysis — mean; standard deviation s = √Σ(x−x̄)²/(n−1); standard error SE = s/√n; error bars; overlapping error bars → may not be significant',
        'Identifying errors — random (scatter; reduce with repeats; e.g. timing reaction end point); systematic (shift all data one way; not reduced by repeating; e.g. heat loss in calorimetry, zero error); ALWAYS specific not generic',
        'Suggesting improvements — SPECIFIC: state problem + exact change + why it improves; e.g. "use thermostatted water bath at ±0.1°C rather than room temperature to prevent uncontrolled T changes affecting rate constant k"; not "use more accurate equipment"',
        'Evaluating conclusions — does data support hypothesis within uncertainty? limitations: extrapolation invalid beyond data range; correlation ≠ causation; confounding variables; sample size insufficient; anomalies may be due to specific experimental issue',
        'Context note — Paper 5 often uses contexts outside chemistry syllabus; skills are transferable; apply to novel situations',
      ],
      forbiddenTopics: [],
      requiredKeywords: [
        'independent variable', 'dependent variable', 'control variable',
        'systematic error', 'random error', 'control experiment blank',
        'linearising log y vs log x', 'ln y vs x gradient',
        'gradient large triangle units', 'standard deviation', 'standard error', 'error bars',
        'specific improvement not generic', 'confounding variable',
        'correlation not causation', 'extrapolation invalid',
      ],
      boundaryNotes: [
        'Paper 5 = 11.5% of A Level; contexts may be OUTSIDE chemistry syllabus — intentional.',
        'Most marks lost: improvements too vague; wrong statistical test; no null hypothesis stated; not showing working.',
        'Always include units with every quantity; show all working in calculations.',
      ],
    },
  },
}