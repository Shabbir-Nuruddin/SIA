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
  forbiddenTopics?: string[];
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
      ],
      forbiddenTopics: [
        'Halogenoalkane mechanisms — Topic 15', 'Alcohols — Topic 16',
        'Ozonolysis, Diels-Alder — Topic 30 A Level only',
        'Benzene, arenes and electrophilic aromatic substitution (nitration, Friedel-Crafts, halogenation, directing effects) — A Level Topic 27 (Paper 4 only); do NOT include any benzene content here',
      ],
      requiredKeywords: [
        'free radical substitution', 'initiation propagation termination',
        'electrophilic addition', 'carbocation stability tertiary > secondary > primary',
        'Markovnikov', 'bromonium ion',
        'addition polymerisation', 'repeat unit',
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
 
    topic27: {
      code: '9701-T27',
      title: 'Arenes (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'Benzene structure — Kekulé structure disproved by evidence; delocalised model: cyclic π system of 6 electrons delocalized above and below the ring plane; all C-C bond lengths equal at 140 pm (between single 154 pm and double 134 pm); planar ring; evidence: (1) ΔH hydrogenation −208 kJ mol⁻¹ vs predicted −360 kJ mol⁻¹ (3× cyclohexene = −360); (2) all C-C bonds equal length by X-ray diffraction; delocalisation energy ≈ 150 kJ mol⁻¹',
        'Nomenclature — benzene C₆H₆; methylbenzene (toluene) C₆H₅CH₃; 1,2-dimethylbenzene; chlorobenzene C₆H₅Cl; nitrobenzene C₆H₅NO₂; phenol C₆H₅OH; phenylamine C₆H₅NH₂; phenyl group C₆H₅-; use ring with circle to represent delocalised structure',
        'Electrophilic aromatic substitution (EAS) — the π electron cloud of the ring attacks an electrophile; arenium ion (Wheland intermediate) formed — ring loses aromaticity temporarily; H⁺ expelled to restore aromaticity; overall result is substitution not addition (contrast with alkenes); full curly arrow mechanism required for all EAS reactions',
        'Nitration — reagents: conc HNO₃ + conc H₂SO₄, temperature below 55°C; product: nitrobenzene + H₂O; mechanism: H₂SO₄ protonates HNO₃ → HSO₄⁻ + NO₂⁺ (nitronium ion); NO₂⁺ attacks ring π cloud → arenium ion → H⁺ lost → nitrobenzene; temperature control critical — polynitration occurs at higher T',
        'Friedel-Crafts alkylation — reagents: RCl + AlCl₃ (Lewis acid, halogen carrier); conditions: anhydrous; product: alkylbenzene + HCl; AlCl₃ accepts Cl⁻ from RCl → generates R⁺ carbocation; limitation: carbocation rearrangement gives unexpected products; polyalkylation possible',
        'Friedel-Crafts acylation — reagents: RCOCl (acyl chloride) + AlCl₃; conditions: anhydrous; product: aryl ketone (acylbenzene) + HCl; generates acylium ion RCO⁺ (more stable than R⁺ — no rearrangement); preferred over alkylation for predictable products',
        'Halogenation of benzene — reagents: Cl₂ or Br₂ + halogen carrier (AlCl₃ or FeBr₃); catalyst polarises X₂ → X⁺-like electrophile; product: halobenzene + HX; contrast: EAS for benzene vs electrophilic addition for alkenes',
        'Directing effects — ortho/para directors: OH, NH₂, OCH₃, alkyl groups (electron-donating → activate ring → EAS at ortho and para positions); meta directors: NO₂, COR, COOR, CN, SO₃H (electron-withdrawing → deactivate ring → EAS at meta); strategy in synthesis: plan substitution order based on directing effects',
        'Side chain oxidation — reagents: hot conc acidified KMnO₄; product: benzoic acid regardless of alkyl chain length; e.g. methylbenzene → benzoic acid; ethylbenzene → benzoic acid',
      ],
      forbiddenTopics: [
        'Alkanes, alkenes, cracking, free radical substitution — Topic 14 (AS Level)',
        'Aryl halide nucleophilic substitution detailed mechanism — Topic 31 A Level',
        'Phenol reactions beyond Br₂(aq) — Topic 32 A Level',
        'Birch reduction — not in 9701 specification',
      ],
      requiredKeywords: [
        'benzene delocalised model', 'all C-C bonds equal 140 pm',
        'ΔH hydrogenation −208 evidence', 'delocalisation energy 150 kJ mol⁻¹',
        'electrophilic aromatic substitution EAS', 'arenium ion Wheland intermediate',
        'aromaticity restored H⁺ expelled',
        'NO₂⁺ nitronium ion', 'conc H₂SO₄ below 55°C', 'curly arrow mechanism',
        'Friedel-Crafts AlCl₃ Lewis acid anhydrous', 'acylium ion RCO⁺ no rearrangement',
        'halogenation AlCl₃ FeBr₃ halogen carrier',
        'ortho-para director activating', 'meta director deactivating',
        'side chain oxidation KMnO₄ benzoic acid',
      ],
      boundaryNotes: [
        'Benzene and all EAS reactions are A Level (Paper 4) ONLY — never include in AS Level Topic 14 notes.',
        'Curly arrow mechanisms are required for ALL EAS reactions in Paper 4.',
        'Directing effects must be explained in terms of electron density on the ring.',
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

// ================================================================
  // CIE A LEVEL BIOLOGY 9700
  // AS Level Topics 1-11 | A Level adds Topics 12-19
  // Practical: Paper 3 (AS) and Paper 5 (A Level)
  // ================================================================
  biology: {

    topic1: {
      code: '9700-T1',
      title: 'Cell Structure',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Light microscope — making temporary preparations; staining with iodine, methylene blue; scientific diagram conventions (no shading, clear outlines, labels with ruled lines)',
        'Magnification = image size / actual size; rearrange for actual size; units: mm → µm (×1000) → nm (×1000); eyepiece graticule calibrated with stage micrometer; converting between units',
        'Resolution — minimum distance between two points that can be distinguished separately; light microscope max ~200 nm; TEM max ~0.1-0.5 nm; higher resolution = finer detail possible',
        'TEM vs SEM — TEM: electrons transmitted through thin section; 2D internal detail; very high resolution; SEM: electrons reflected from surface; 3D surface image; lower resolution than TEM',
        'Eukaryotic organelles — nucleus (nuclear envelope with pores; nucleolus rRNA; chromosomes); rough ER (ribosomes attached; protein synthesis/folding/transport); smooth ER (lipid synthesis; detoxification); Golgi body/apparatus (modifies and packages proteins into vesicles for secretion); mitochondria (outer membrane; inner membrane with cristae; matrix contains DNA and 70S ribosomes; site of aerobic respiration); ribosomes: 80S in cytoplasm, 70S in mitochondria and chloroplasts; lysosomes (hydrolytic enzymes; digest organelles and pathogens); centrioles (animal cells/lower plants; form spindle during cell division); microtubules (cell shape; spindle; cilia; flagella); cilia (move substances over surface e.g. mucus); microvilli (increase SA for absorption e.g. intestinal epithelium); chloroplasts (outer+inner membrane/envelope; thylakoid/granum; stroma; 70S ribosomes; site of photosynthesis); cell wall (cellulose in plants; peptidoglycan in bacteria; support and shape); plasmodesmata (channels through cell walls connecting adjacent plant cells); large permanent vacuole + tonoplast (plant cells; maintains turgor)',
        'Plant vs animal cells — plant: cell wall, chloroplasts, large permanent vacuole, plasmodesmata, no centrioles in higher plants; animal: no cell wall, no chloroplasts, no large permanent vacuole; both: cell surface membrane, nucleus, mitochondria, ER, Golgi, ribosomes',
        'Prokaryotic cell structure — no membrane-bound nucleus; circular DNA not complexed with histones; 70S ribosomes; peptidoglycan cell wall; pili (attachment and conjugation); flagella (locomotion); capsule (protection); no membrane-bound organelles; some have plasmids; typically 1-5 µm',
        'Eukaryotic vs prokaryotic comparison — nucleus membrane-bound (euk) vs naked circular DNA (prok); 80S ribosomes (euk) vs 70S (prok); membrane-bound organelles (euk) vs none (prok); linear DNA complexed with histones (euk) vs circular no histones (prok)',
        'Viruses — non-cellular; smaller than cells (20-300 nm); capsid (protein coat) containing nucleic acid (DNA or RNA, never both); some have lipid envelope from host cell; can only replicate inside host cells; not living (no metabolism, no growth, no homeostasis); examples: bacteriophage (DNA, infects bacteria); HIV (RNA retrovirus with reverse transcriptase)',
        'Cell fractionation — homogenise in cold isotonic buffer (cold = prevent enzyme activity; isotonic = prevent osmotic lysis; buffer = maintain pH); differential centrifugation: low speed → nuclei pellet; medium speed → mitochondria/chloroplasts; high speed → ribosomes/small vesicles; ultracentrifugation separates further',
      ],
      forbiddenTopics: [
        'Mitosis stages in detail — Topic 5',
        'Cell membrane fluid mosaic model — Topic 4',
        'Nucleic acid structure — Topic 6',
        'Photosynthesis mechanism — Topic 13 A Level only',
        'Respiration mechanism — Topic 12 A Level only',
      ],
      requiredKeywords: [
        'magnification = image/actual size', 'µm nm conversion', 'resolution',
        'TEM 2D internal SEM 3D surface',
        'rough ER ribosomes protein', 'smooth ER lipid', 'Golgi vesicles secretion',
        'mitochondria cristae matrix 70S', '80S cytoplasm 70S chloroplast mitochondria',
        'plasmodesmata', 'tonoplast vacuole', 'cilia microvilli',
        'prokaryotic no membrane-bound nucleus', 'peptidoglycan', '70S ribosomes prokaryote',
        'virus capsid nucleic acid not both DNA and RNA',
        'differential centrifugation cold isotonic buffer',
      ],
      practicalNotes: [
        'Paper 3: temporary mount preparation; staining; drawing cells from slides; calculating actual size from micrograph with scale bar; identifying organelles in electron micrographs',
      ],
    },

    topic2: {
      code: '9700-T2',
      title: 'Biological Molecules',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Food tests — Benedict\'s for reducing sugars (blue → brick-red precipitate on heating; glucose, fructose, maltose, galactose, lactose are reducing; sucrose is non-reducing); non-reducing sugar test: boil with dilute HCl to hydrolyse → neutralise with NaHCO₃ → then Benedict\'s; iodine for starch (orange-brown → blue-black); biuret for proteins: add NaOH then dilute CuSO₄ → blue → mauve/purple if peptide bonds present; emulsion test for lipids: dissolve in ethanol, add water → milky white emulsion',
        'α-glucose and β-glucose — Haworth projections; α: OH at C1 is below ring plane (axial); β: OH at C1 is above ring plane (equatorial); this difference determines polymer structure',
        'Condensation reaction — joins monomers with loss of H₂O; forms covalent bond (glycosidic bond in carbohydrates; peptide bond in proteins; ester bond in lipids)',
        'Hydrolysis — breaks polymer using H₂O; reverse of condensation; requires enzyme or acid/alkali catalyst',
        'Starch — amylose: unbranched; α-1,4 glycosidic bonds; helical shape; energy storage in plants; amylopectin: branched; α-1,4 and α-1,6 at branch points; compact; rapid mobilisation',
        'Glycogen — α-1,4 and α-1,6 glycosidic bonds; highly branched (more than amylopectin); energy storage in animals (liver and muscle); very compact; rapid hydrolysis from many chain ends simultaneously',
        'Cellulose — β-glucose monomers; β-1,4 glycosidic bonds; alternating orientation (each glucose rotated 180°) → straight chains; parallel chains form H-bonds → microfibrils → fibres; high tensile strength; structural role in plant cell wall; cannot be digested by most animals (no cellulase)',
        'Triglycerides — glycerol + 3 fatty acids; ester bonds by condensation; hydrophobic; functions: energy storage; insulation; buoyancy; saturated (all C-C single bonds; solid at room T; animal fats); unsaturated (one or more C=C; liquid at room T; plant oils)',
        'Phospholipids — glycerol + 2 fatty acids + phosphate group (+ charged head group); amphipathic (hydrophilic phosphate head; hydrophobic fatty acid tails); form bilayer in water; basis of all membranes',
        'Amino acid structure — H₂N-CHR-COOH; R group (side chain) varies and determines properties and identity',
        'Peptide bond — condensation between -COOH of one amino acid and -NH₂ of another; -CO-NH- formed + H₂O; hydrolysis: H₂O + acid/base/enzyme → individual amino acids',
        'Protein structure — primary: sequence of amino acids held by peptide bonds; secondary: α-helix (H-bonds between C=O of residue i and N-H of residue i+4) and β-pleated sheet (H-bonds between adjacent parallel or antiparallel chains); tertiary: 3D shape of single polypeptide; H-bonds, ionic bonds, disulfide bonds (-S-S- between cysteine), hydrophobic interactions; quaternary: two or more polypeptide subunits held by same interactions as tertiary',
        'Haemoglobin — globular protein; quaternary structure (4 subunits: 2α + 2β each with haem group); Fe²⁺ in haem binds O₂ reversibly; cooperative binding',
        'Collagen — fibrous protein; 3 polypeptides wound into triple helix (Gly-X-Pro repeat; glycine every 3rd residue to fit in centre); H-bonds between chains; cross-linking between helices → very strong; insoluble; tendons, bone matrix, skin',
        'Water properties — H-bonding between molecules; solvent for ionic and polar substances (blood plasma transport; cell cytoplasm reactions); high specific heat capacity (buffers temperature changes); high latent heat of vaporisation (evaporative cooling in sweating); cohesion (pulls water column up xylem); metabolite (reactant in hydrolysis, photosynthesis; product of respiration, condensation)',
      ],
      forbiddenTopics: [
        'Nucleic acid structure — Topic 6', 'Enzyme kinetics (Km, Vmax) — Topic 3',
        'Membrane fluid mosaic model — Topic 4', 'Haemoglobin Bohr effect — Topic 8',
      ],
      requiredKeywords: [
        'Benedict\'s reducing sugar blue→brick-red', 'iodine starch blue-black',
        'biuret test peptide bonds mauve', 'emulsion test lipid milky white',
        'α-glucose β-glucose Haworth', 'glycosidic bond condensation hydrolysis',
        'amylose unbranched α-1,4', 'amylopectin branched α-1,4 α-1,6',
        'glycogen highly branched animals', 'cellulose β-1,4 microfibrils straight chains',
        'triglyceride ester bonds', 'phospholipid bilayer amphipathic',
        'peptide bond -CO-NH-', 'primary secondary tertiary quaternary structure',
        'α-helix H-bonds i+4', 'β-pleated sheet H-bonds between chains',
        'disulfide bonds cysteine', 'haemoglobin quaternary haem Fe²⁺',
        'collagen triple helix glycine every 3rd', 'water cohesion specific heat latent heat',
      ],
    },

    topic3: {
      code: '9700-T3',
      title: 'Enzymes',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Enzymes — globular proteins; biological catalysts; speed up reactions; not consumed; intracellular (e.g. catalase) or extracellular (e.g. digestive enzymes)',
        'Lock-and-key hypothesis — active site has fixed complementary shape to substrate; substrate fits like key in lock; rigid model',
        'Induced-fit hypothesis — active site changes shape as substrate binds; substrate induces conformational change → better complementary fit; explains why enzyme is more flexible and specific than lock-and-key alone',
        'Activation energy — enzymes lower Ea by providing alternative reaction pathway; enzyme-substrate complex formation weakens bonds in substrate; enzyme-product complex less stable → products released',
        'Effects of temperature — rate increases with T up to optimum; above optimum: denaturation (H-bonds, ionic bonds break → active site loses complementary 3D shape → enzyme-substrate complex cannot form → rate falls to zero); denaturation irreversible; different enzymes have different optima',
        'Effects of pH — optimum pH for each enzyme; outside range: ionic bonds and H-bonds maintaining shape break → active site changes shape → substrate cannot bind; denatures at extremes; pepsin optimum pH 2; salivary amylase pH 7',
        'Effect of enzyme concentration — at constant [substrate], rate increases proportionally (more active sites); rate levels off when substrate becomes limiting',
        'Effect of substrate concentration — at constant [enzyme], rate increases hyperbolically with [substrate] up to Vmax (all active sites occupied = saturated); Michaelis-Menten curve',
        'Vmax and Km — Vmax = maximum rate at saturating [substrate]; Km = [substrate] at which rate = ½Vmax; low Km = high affinity; Lineweaver-Burk double reciprocal plot (1/rate vs 1/[S]): y-intercept = 1/Vmax; x-intercept = −1/Km',
        'Competitive inhibition — inhibitor structurally similar to substrate; competes for active site; increasing [substrate] overcomes inhibition; Km increases (lower apparent affinity); Vmax unchanged; examples: malonate inhibits succinate dehydrogenase',
        'Non-competitive inhibition — inhibitor binds allosteric site (not active site); changes shape of active site → substrate cannot bind/reaction rate reduced; cannot be overcome by increasing [substrate]; Vmax decreases; Km unchanged; examples: heavy metal ions, cyanide',
        'Reversible vs irreversible inhibition — reversible: inhibitor can be removed (competitive and non-competitive); irreversible: covalent bond forms with enzyme → permanently inactivated (e.g. organophosphates inhibit acetylcholinesterase; aspirin inhibits COX enzymes)',
        'Immobilised enzymes — attached to inert support (alginate beads, membranes, nylon mesh); advantages: enzyme reusable; product not contaminated with enzyme; more thermostable; continuous process possible; uses: lactase in lactose-free milk; glucose isomerase for fructose syrup',
        'Cofactors — inorganic ions required for enzyme activity (e.g. Cl⁻ for salivary amylase; Mg²⁺ for many enzymes); coenzymes: organic molecules that transfer chemical groups (NAD, FAD, CoA — detailed in Topic 12)',
      ],
      forbiddenTopics: [
        'Detailed allosteric regulation and feedback inhibition mechanisms — beyond this level',
        'Specific coenzyme functions in respiration — Topic 12 A Level only',
      ],
      requiredKeywords: [
        'lock-and-key', 'induced fit', 'active site complementary shape', 'enzyme-substrate complex',
        'activation energy', 'specificity', 'optimum temperature pH',
        'denaturation irreversible', 'Vmax Km Michaelis-Menten', 'saturation',
        'competitive inhibitor Km increases Vmax unchanged',
        'non-competitive inhibitor Vmax decreases Km unchanged',
        'Lineweaver-Burk', 'immobilised enzyme alginate beads reusable',
        'cofactor inorganic ion', 'coenzyme organic',
      ],
      practicalNotes: [
        'Paper 3: catalase + H₂O₂ → O₂ measured with gas syringe; initial rate from tangent at t=0; investigating T, pH, [E], [S]; plotting Michaelis-Menten; identifying competitive vs non-competitive inhibition from graph data',
      ],
    },

    topic4: {
      code: '9700-T4',
      title: 'Cell Membranes and Transport',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Fluid mosaic model (Singer and Nicolson 1972) — phospholipid bilayer; hydrophilic heads face outward; hydrophobic tails face inward; fluid: phospholipids move laterally; mosaic: proteins at various positions; confirmed by freeze-fracture electron microscopy',
        'Membrane components — phospholipids (bilayer selective barrier; hydrophobic core prevents charged/polar molecules crossing freely); cholesterol (between fatty acid tails; stabilises membrane at varying T; reduces fluidity at high T; prevents crystallisation at low T; in animal cells); glycolipids (carbohydrate on lipid; cell recognition, blood groups ABO); glycoproteins (carbohydrate on protein; cell recognition, antigens, receptor sites)',
        'Membrane proteins — channel proteins (allow specific ions or molecules through; ion channels; aquaporins for water; some gated); carrier proteins (transport specific molecules by facilitated diffusion changing shape; or active transport using ATP); receptor proteins (bind specific signalling molecules → trigger intracellular response)',
        'Simple diffusion — passive; net movement down concentration gradient; through phospholipid bilayer for non-polar/lipid-soluble molecules (O₂, CO₂, steroid hormones, ethanol); rate ∝ concentration gradient, SA, T; rate ∝ 1/diffusion distance, molecular size',
        'Facilitated diffusion — passive; down concentration gradient; through specific channel or carrier proteins; for polar/charged/large molecules (glucose, amino acids, ions); no ATP required; rate levels off when all protein channels occupied',
        'Osmosis — net movement of water molecules from higher water potential (ψ) to lower water potential through selectively permeable membrane; pure water has highest water potential (ψ = 0); solutions have negative ψ; measuring water potential of plant tissue using sucrose solutions of different concentrations; plot % mass change vs concentration; water potential = concentration where no mass change',
        'Effects of osmosis — plant cells: turgid (water enters → vacuole expands → pressed against wall → turgor pressure; wall prevents bursting); flaccid (water leaves → vacuole shrinks → cell goes limp); plasmolysis (concentrated external solution → water leaves → protoplast pulls from cell wall; reversible); incipient plasmolysis (point where plasmolysis just begins); animal cells: crenated (water leaves → cell shrinks); lysis (water enters → cell bursts; no cell wall)',
        'Active transport — requires ATP; carrier proteins; moves molecules/ions against concentration gradient (from low to high); examples: Na⁺-K⁺ ATPase pump (3 Na⁺ out, 2 K⁺ in per cycle); loading sucrose into phloem; mineral ion uptake by root hairs',
        'Endocytosis — cell engulfs material in vesicle formed from cell surface membrane; phagocytosis (solid particles; macrophages engulf pathogens); pinocytosis (liquid droplets)',
        'Exocytosis — secretory vesicles from Golgi fuse with cell surface membrane → release contents outside; secretion of neurotransmitters, hormones, digestive enzymes',
        'Surface area to volume ratio — as organism size increases, SA:V ratio decreases; large organisms need transport systems; calculating SA:V for cubes; investigating with agar blocks and indicator dye; time for dye to reach centre ∝ block size',
      ],
      forbiddenTopics: [
        'Water potential components ψs and ψp — use water potential only at this level',
        'Na⁺-K⁺ ATPase mechanism in detail — active transport concept only',
        'Signal transduction cascade detail — brief introduction only',
        'Co-transport Na⁺-glucose — Topic 8',
      ],
      requiredKeywords: [
        'fluid mosaic model', 'phospholipid bilayer', 'cholesterol', 'glycolipid glycoprotein',
        'channel protein carrier protein receptor protein',
        'simple diffusion non-polar', 'facilitated diffusion specific protein',
        'osmosis water potential', 'turgid flaccid plasmolysis', 'crenated lysis',
        'active transport ATP carrier against concentration gradient',
        'endocytosis phagocytosis', 'exocytosis',
        'SA:V ratio decreases with size',
      ],
    },

    topic5: {
      code: '9700-T5',
      title: 'The Mitotic Cell Cycle',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Chromosome structure — DNA + histone proteins; wound around histones → nucleosomes → chromatin → chromosome; sister chromatids (identical copies joined at centromere after S phase); centromere (spindle attachment point); telomeres (repetitive DNA at chromosome ends; protect from degradation; shorten with each division)',
        'Cell cycle — interphase: G1 (cell grows, organelles made); S (DNA replication, histone synthesis); G2 (further growth, organelle replication); mitosis; cytokinesis; G0 (non-dividing cells exit cycle)',
        'Importance of mitosis — growth of multicellular organisms; replacement of dead/damaged cells; tissue repair; asexual reproduction; producing genetically identical daughter cells',
        'Stem cells — totipotent (embryonic stem cells: can form any cell type including extra-embryonic tissues); pluripotent (can form most somatic cell types but not extra-embryonic); multipotent (limited range: haematopoietic → blood cells; intestinal stem cells → gut epithelium)',
        'Prophase — chromosomes condense (visible under light microscope); nuclear envelope breaks down; centrioles move to opposite poles; spindle fibres (microtubules) form and attach to centromeres; nucleolus disappears',
        'Metaphase — chromosomes align at cell equator (metaphase plate); spindle fibres from both poles attached to centromere of each chromosome; each chromosome has two sister chromatids attached',
        'Anaphase — centromeres split; spindle fibres shorten → pull sister chromatids to opposite poles; each pole receives a full set of chromosomes; cell elongates',
        'Telophase — chromosomes at poles; decondense; nuclear envelopes reform; nucleoli reappear; spindle breaks down',
        'Cytokinesis — plant cells: cell plate forms (Golgi vesicles fuse at equator → new cellulose wall); animal cells: cleavage furrow (actin microfilaments contract → pinches cell in two)',
        'Cancer — uncontrolled cell division; failure of apoptosis (programmed cell death); loss of contact inhibition; proto-oncogenes mutated → oncogenes → uncontrolled proliferation; tumour suppressor genes (e.g. p53) mutated → cells bypass checkpoints; benign (localised); malignant (metastasis)',
        'Mitotic index — proportion of cells in mitosis: MI = (cells in mitosis / total cells observed) × 100%; higher MI = faster cell division; used clinically to assess cancer severity',
      ],
      forbiddenTopics: [
        'Meiosis — Topic 16 A Level only', 'Genetics of cell division — Topics 16 and 17',
        'DNA replication mechanism — Topic 6', 'Cancer treatment — not in syllabus',
      ],
      requiredKeywords: [
        'chromosome DNA histone', 'sister chromatids centromere telomere',
        'G1 S G2 interphase', 'prophase metaphase anaphase telophase',
        'spindle fibres microtubules', 'nuclear envelope', 'cytokinesis',
        'cell plate plant', 'cleavage furrow animal',
        'totipotent pluripotent multipotent', 'apoptosis contact inhibition',
        'proto-oncogene tumour suppressor', 'mitotic index',
      ],
      practicalNotes: [
        'Paper 3: interpreting stained root tip squash; identifying stages; calculating mitotic index; drawing labelled cells at different stages',
      ],
    },

    topic6: {
      code: '9700-T6',
      title: 'Nucleic Acids and Protein Synthesis',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'DNA structure — double helix; two antiparallel strands (5\'→3\' one direction; 3\'→5\' other); deoxyribose-phosphate backbone; nitrogenous bases: purines (A, G) and pyrimidines (T, C); base pairing: A-T (2 H-bonds) and G-C (3 H-bonds); Chargaff\'s rules (A=T; G=C)',
        'Nucleotide — phosphate group + pentose sugar (deoxyribose in DNA; ribose in RNA) + nitrogenous base',
        'RNA types — mRNA (single strand; codons = triplets; copy of gene; carries info from nucleus to ribosomes); tRNA (cloverleaf secondary structure; anticodon loop complementary to mRNA codon; amino acid attached at 3\' CCA end); rRNA (component of ribosome; catalyses peptide bond formation = ribozyme)',
        'Semi-conservative DNA replication — each daughter molecule has one original strand + one new strand; Meselson-Stahl experiment (¹⁵N → ¹⁴N) proves semi-conservative; helicase unwinds double helix; DNA polymerase adds nucleotides 5\'→3\'; leading strand (continuous); lagging strand (discontinuous, Okazaki fragments); DNA ligase joins Okazaki fragments; primase adds RNA primer',
        'Genetic code — triplet codons; 64 codons; 20 amino acids + 3 stop codons; degenerate (multiple codons for one amino acid); non-overlapping; universal (same in virtually all organisms)',
        'Transcription — RNA polymerase binds promoter; unwinds DNA; reads template strand 3\'→5\'; synthesises pre-mRNA 5\'→3\'; complementary base pairing (U pairs with A in RNA); in eukaryotes: pre-mRNA processed: 5\' cap added; poly-A tail added; introns removed by splicing; exons joined → mature mRNA; exits nucleus through nuclear pores',
        'Introns and exons — introns: non-coding sequences removed; exons: coding sequences joined; alternative splicing: different exon combinations → different proteins from same gene → proteome larger than genome',
        'Translation — ribosome assembles on mRNA at start codon AUG (methionine); P-site holds tRNA + growing polypeptide; A-site receives new tRNA; tRNA anticodon pairs with mRNA codon; peptidyl transferase (rRNA) catalyses peptide bond between amino acids; ribosome moves along mRNA (translocation); polypeptide grows from N-terminus; stop codon (UAA/UAG/UGA) → release factor → polypeptide released',
        'Gene mutation — substitution (point): missense (new codon → different amino acid → altered protein); nonsense (new stop codon → truncated protein); silent (synonymous codon → same amino acid → no effect); insertion/deletion: frameshift (reading frame shifts → garbled protein from mutation point; can be more severe than substitution)',
      ],
      forbiddenTopics: [
        'Recombinant DNA technology — Topic 19 A Level only',
        'Gene regulation — Topic 19 A Level only', 'Epigenetics — not in syllabus',
      ],
      requiredKeywords: [
        'double helix antiparallel 5\'→3\'', 'deoxyribose phosphate backbone',
        'A-T 2 H-bonds G-C 3 H-bonds', 'Chargaff\'s rules',
        'semi-conservative replication', 'Meselson-Stahl', 'helicase DNA polymerase 5\'→3\'',
        'Okazaki fragments lagging strand', 'DNA ligase primase',
        'mRNA codon', 'tRNA anticodon CCA 3\' end', 'rRNA ribozyme',
        'triplet codon degenerate non-overlapping universal',
        'transcription RNA polymerase promoter template strand',
        'introns removed exons joined alternative splicing',
        'translation ribosome A-site P-site peptide bond stop codon',
        'missense nonsense silent frameshift mutation',
      ],
    },

    topic7: {
      code: '9700-T7',
      title: 'Transport in Plants',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Xylem vessels — dead cells; lignified walls (spiral, annular or reticulate); no end walls (continuous hollow tube); impermeable to water; transports water and mineral ions from roots to leaves; cohesion-tension theory: evaporation from mesophyll → water potential gradient → water pulled up by cohesion (H-bonds between water molecules) and adhesion (water to xylem walls) → transpiration pull; continuous water column maintained by cohesion',
        'Phloem — living cells; sieve tube elements (end walls = sieve plates with pores; little cytoplasm); companion cells (provide metabolic support via plasmodesmata; have many mitochondria); translocation of organic solutes (sucrose and amino acids) from source to sink; mass flow hypothesis: active loading of sucrose at source (using ATP + proton pump) → water moves in by osmosis → high pressure → mass flow to sink; unloading at sink → water leaves',
        'Evidence for phloem — aphid stylet experiment; ringing experiments; radioactive ¹⁴CO₂ tracer; evaluating mass flow hypothesis evidence',
        'Transpiration — evaporation of water vapour from leaves mainly through open stomata; factors affecting rate: temperature (higher → faster evaporation); light intensity (stomata open in light → faster); humidity (lower humidity → larger water potential gradient → faster); wind speed (removes water vapour from boundary layer → maintains gradient)',
        'Stomata and guard cells — K⁺ pumped into guard cells in light (active transport using ATP) → water potential falls → water enters by osmosis → guard cells become turgid → stomata open; dark → K⁺ leave → guard cells flaccid → stomata close; abscisic acid (ABA) causes closure in water stress conditions',
        'Water movement pathways — apoplast (through cell walls; no crossing membranes; main route for water); symplast (through cytoplasm via plasmodesmata; across membranes); vacuolar (through vacuoles); Casparian strip in root endodermis: forces water through symplast → controls mineral ion uptake selectively',
        'Mineral ion uptake — active transport at root hair cell membrane; ions move via symplast pathway into xylem; roots need O₂ for respiration to generate ATP for active transport (waterlogged soils reduce mineral uptake)',
        'Xerophyte adaptations — reduced water loss: thick cuticle (reduces evaporation from epidermis); stomata in pits or grooves (trap humid air); rolled leaves (trap humid air); reduced leaf surface area; CAM metabolism (stomata open at night; CO₂ stored; light-independent reactions by day); sunken stomata; small leaves or spines; shallow extensive root system to capture rainwater; water storage in stem (succulent)',
      ],
      forbiddenTopics: [
        'Water potential components ψs and ψp — qualitative water potential only',
        'Apoplast and symplast named explicitly — concepts described but names optional here',
        'Plant hormones — Topic 15 A Level only',
        'Cohesion-tension theory by name — describe mechanism',
      ],
      requiredKeywords: [
        'xylem vessel lignified dead no end walls', 'transpiration pull cohesion adhesion',
        'phloem sieve tube companion cell', 'translocation source sink',
        'mass flow hypothesis active loading ATP',
        'transpiration stomata guard cells K⁺ active transport',
        'ABA stomatal closure', 'Casparian strip symplast',
        'potometer measures water uptake',
        'xerophyte thick cuticle stomata pits rolled leaves CAM',
      ],
      practicalNotes: [
        'Paper 3: potometer to measure transpiration rate; controlling variables; rate per unit leaf area; effect of wind, humidity, temperature',
        'Preparing and examining root, stem, leaf cross-sections; identifying xylem, phloem, cortex, endodermis',
      ],
    },

    topic8: {
      code: '9700-T8',
      title: 'Transport in Mammals',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Double circulation — pulmonary (right heart → lungs → left heart): oxygenation; systemic (left heart → body → right heart): O₂ delivery; advantages: higher pressure maintained in systemic; oxygenation separate from delivery',
        'Blood vessel structure — arteries: thick wall (tunica media with elastic fibres and smooth muscle); small lumen; high pressure; elastic recoil maintains pressure between beats; veins: thin wall; valves (prevent backflow); large lumen; low pressure; capillaries: one cell thick (endothelium only; ~0.5 µm); very large total SA; 5-10 µm diameter (RBCs squeeze through single file); exchange by diffusion',
        'Heart structure — four chambers (right atrium, right ventricle, left atrium, left ventricle); major vessels: vena cava → right atrium; pulmonary artery → lungs; pulmonary vein → left atrium; aorta → body; valves: atrioventricular (AV) valves (tricuspid right; bicuspid/mitral left); semilunar valves (aortic and pulmonary; prevent backflow from arteries); chordae tendineae and papillary muscles prevent AV valves inverting; coronary arteries supply myocardium',
        'Cardiac cycle — diastole: all chambers relax; blood fills atria from veins; AV valves open; blood flows into ventricles; atrial systole: atria contract; push blood into ventricles; ventricular systole: ventricles contract; pressure rises; AV valves close (first heart sound S1); semilunar valves open; blood ejected; then semilunar valves close (second heart sound S2) when ventricular pressure falls below arterial',
        'ECG — P wave: atrial depolarisation; QRS complex: ventricular depolarisation; T wave: ventricular repolarisation; normal ~70 bpm; interpreting abnormal ECGs (arrhythmia = irregular rhythm; absent P wave; prolonged QRS)',
        'Blood components — erythrocytes (RBC): biconcave disc; no nucleus; no mitochondria (anaerobic respiration only); packed with haemoglobin (~280 million molecules per cell); large SA; flexible; lifespan ~120 days; leucocytes (WBC): phagocytes (neutrophils and macrophages: engulf pathogens); lymphocytes (B cells: antibodies; T cells: cell-mediated); platelets (cell fragments; thromboplastin; clotting); plasma (water; dissolved: glucose, amino acids, fatty acids, hormones, CO₂, urea, ions, plasma proteins: albumin, globulins, fibrinogen)',
        'O₂ transport — haemoglobin (Hb) + O₂ ⇌ oxyhaemoglobin (HbO₂); cooperative binding → sigmoid O₂ dissociation curve; at high pO₂ (lungs) → loads O₂; at low pO₂ (respiring tissues) → unloads O₂; Bohr effect: CO₂ ↑ → H⁺ ↑ (CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻; catalysed by carbonic anhydrase) → H⁺ binds Hb → reduces O₂ affinity → curve shifts right → more O₂ unloaded at tissues (where needed); P50: pO₂ at which Hb is 50% saturated; foetal Hb has higher O₂ affinity than adult (shifted left) → loads O₂ from maternal blood at placenta',
        'CO₂ transport — dissolved in plasma (~5%); as carbaminohaemoglobin HbCO₂ (~25%); as HCO₃⁻ ions (~70%): in RBCs CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻; HCO₃⁻ diffuses out of RBC into plasma in exchange for Cl⁻ (chloride shift); H⁺ buffered by Hb; at lungs: all reversed',
        'Tissue fluid formation — at arterial end of capillary: hydrostatic pressure (HP) > oncotic pressure (OP from plasma proteins) → fluid forced out; at venous end: HP falls below OP → fluid drawn back in; excess tissue fluid → lymph capillaries → lymph vessels → lymph nodes → thoracic duct → subclavian vein',
        'Cardiovascular disease — atherosclerosis: endothelial damage → inflammatory response → LDL cholesterol accumulates → foam cells → fatty streak → atherosclerotic plaque → narrows lumen → raises blood pressure → risk of: coronary heart disease; myocardial infarction; stroke; risk factors: high LDL cholesterol; saturated fat diet; smoking (CO reduces O₂; nicotine raises BP); hypertension; physical inactivity; diabetes; genetics; age',
      ],
      forbiddenTopics: [
        'Action potential mechanism — Topic 15 A Level only',
        'Lymphocyte detailed immune function — Topic 11',
        'Na⁺/K⁺ ATPase — Topic 15',
      ],
      requiredKeywords: [
        'double circulation pulmonary systemic', 'elastic recoil arteries', 'valves veins',
        'AV valves semilunar valves', 'heart sounds S1 S2',
        'ECG P wave QRS T wave', 'atrial systole ventricular systole diastole',
        'haemoglobin oxyhaemoglobin sigmoid curve', 'Bohr effect CO₂ H⁺ shifts curve right',
        'P50', 'foetal Hb higher affinity', 'carbonic anhydrase',
        'CO₂ as HCO₃⁻ 70%', 'chloride shift',
        'tissue fluid HP oncotic pressure', 'lymph thoracic duct',
        'atherosclerosis plaque LDL', 'risk factors CVD',
      ],
    },

    topic9: {
      code: '9700-T9',
      title: 'Gas Exchange',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Fick\'s law — rate of diffusion ∝ (SA × concentration difference) / diffusion distance; gas exchange surfaces need: large SA; thin membrane; moist surface; maintained concentration gradient',
        'Human lungs — trachea → bronchi → bronchioles → alveoli; alveolar wall: type I pneumocytes (squamous cells; ~0.2 µm thick; gas exchange); type II pneumocytes (secrete surfactant; prevent alveolar collapse); adjacent capillary endothelium; total barrier ~0.5 µm; SA ~70 m² in adult; moist inner surface; excellent blood supply',
        'Ventilation mechanism — inspiration: external intercostal muscles contract (ribs up and out); diaphragm muscles contract (diaphragm flattens); thoracic volume increases; pressure falls below atmospheric → air flows in; expiration: muscles relax; elastic tissue recoils; thoracic volume decreases; pressure rises → air flows out; forced expiration: internal intercostal and abdominal muscles contract',
        'Smoking effects on lungs — tar: carcinogens → lung cancer; coats surfaces; paralyses/destroys cilia → mucus accumulates → bacteria not removed → bronchitis; emphysema: alveolar walls break down → reduced SA → reduced gas exchange → breathlessness; nicotine: addictive; raises heart rate and blood pressure; CO: binds haemoglobin 200× affinity (carboxyhaemoglobin) → less O₂ carried → cardiovascular effects',
        'Gas exchange in fish (gills) — countercurrent exchange: water flows over gills opposite to blood flow; maintains concentration gradient along entire gill surface; ~80% O₂ extraction efficiency; parallel flow would equilibrate quickly → much less efficient',
        'Gas exchange in insects (tracheae) — tracheal system: spiracles (openings with valves to reduce water loss) → tracheae (chitin rings keep open) → tracheoles (reach individual cells directly; end in fluid); O₂ diffuses along tracheal tubes directly to cells; abdominal pumping (ventilation of trachea in larger insects)',
        'Gas exchange in dicotyledonous leaves — CO₂ enters through open stomata → diffuses through air spaces in spongy mesophyll → dissolves in moisture on cell surface → absorbed into palisade mesophyll cells → used in Calvin cycle; O₂ exits through stomata; large air spaces provide large SA; spongy mesophyll loosely packed for gas exchange; at night only respiration → CO₂ exits',
      ],
      forbiddenTopics: [
        'Neural control of breathing rate — Topic 15 A Level only',
        'Surfactant detail — brief mention only',
        'Gas transport in blood — Topic 8',
      ],
      requiredKeywords: [
        'Fick\'s law SA × concentration difference / diffusion distance',
        'type I pneumocytes squamous', 'type II pneumocytes surfactant', '0.5 µm barrier',
        'inspiration external intercostal diaphragm', 'expiration elastic recoil',
        'tar cilia paralysis bronchitis emphysema', 'CO carboxyhaemoglobin',
        'countercurrent exchange fish gills 80% efficiency',
        'tracheoles directly to cells spiracles chitin rings',
        'leaf stomata air spaces spongy mesophyll',
      ],
    },

    topic10: {
      code: '9700-T10',
      title: 'Infectious Diseases',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Pathogens — bacteria; viruses; fungi; protoctists/protozoa; prions',
        'Cholera — Vibrio cholerae bacterium; transmission: contaminated water (faecal-oral); cholera toxin stimulates Cl⁻ ion pumps in small intestine wall → massive Cl⁻ secretion into lumen → water follows by osmosis → severe watery diarrhoea → dehydration; ORT (oral rehydration therapy): water + glucose + salts; glucose actively transported → osmotic gradient → water absorbed; prevention: clean water, sanitation, vaccines',
        'Malaria — Plasmodium protozoan (P. falciparum, P. vivax etc.); vector: female Anopheles mosquito; lifecycle: liver stage (asexual multiplication → merozoites) → red blood cells (multiply → rupture → fever pattern; RBCs destroyed → anaemia); cerebral malaria (P. falciparum); treatment: artemisinin, quinine; prevention: insecticide-treated bed nets, indoor residual spraying, antimalarial drugs, vaccines',
        'HIV/AIDS — HIV retrovirus; RNA genome; reverse transcriptase copies RNA → DNA; integrase inserts into host genome; infects CD4+ T helper cells and macrophages; destroys T cells → immunodeficiency → AIDS (CD4 < 200/µL; opportunistic infections e.g. TB, Pneumocystis pneumonia); transmission: sexual contact; contaminated needles; blood transfusion; mother-to-child; treatment: HAART (antiretrovirals: reverse transcriptase inhibitors + protease inhibitors + integrase inhibitors); reduces viral load to undetectable',
        'Tuberculosis — Mycobacterium tuberculosis bacterium; transmission: droplet inhalation (coughing, sneezing); infects alveolar macrophages → granuloma (macrophages + lymphocytes encapsulate bacteria); may remain latent; active disease when immune system weakened; MDR-TB (multi-drug resistant): natural selection from incomplete antibiotic courses; treatment: 6-month course (rifampicin, isoniazid, pyrazinamide, ethambutol); BCG vaccine',
        'Epidemics and pandemics — epidemic: rapid spread within population; pandemic: global spread; factors: transmission route; population density; international travel; vaccine availability; herd immunity threshold; zoonoses (cross species barrier)',
        'Global disease control — WHO coordination; vaccination programmes; surveillance; education; improved sanitation and water supply; vector control; new drug development',
      ],
      forbiddenTopics: [
        'Detailed immune response mechanisms — Topic 11',
        'HIV molecular biology detail (reverse transcriptase mechanism) — beyond required level',
        'Antibiotic resistance molecular mechanisms — Topic 19',
      ],
      requiredKeywords: [
        'Vibrio cholerae Cl⁻ pump osmosis dehydration', 'ORT glucose active transport',
        'Plasmodium Anopheles vector', 'liver RBC stage fever anaemia',
        'HIV retrovirus reverse transcriptase integrase CD4 T helper cells',
        'AIDS CD4 < 200 opportunistic infections', 'HAART antiretroviral',
        'Mycobacterium tuberculosis droplet', 'granuloma macrophage',
        'MDR-TB natural selection incomplete course', 'BCG vaccine',
        'epidemic pandemic zoonosis herd immunity',
      ],
    },

    topic11: {
      code: '9700-T11',
      title: 'Immunity',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Non-specific defence — skin (physical barrier; sebum antimicrobial); mucous membranes; cilia (sweep mucus); lysozyme in tears/saliva (breaks down bacterial cell walls); HCl in stomach; inflammatory response (histamine from mast cells → vasodilation → redness/heat; increased permeability → swelling; attracts phagocytes); fever (inhibits pathogen growth)',
        'Phagocytosis — neutrophils and macrophages; chemotaxis (attracted by chemical signals); pseudopodia engulf pathogen → phagosome; lysosome fuses → phagolysosome; hydrolytic enzymes digest pathogen; products released by exocytosis; macrophages = antigen-presenting cells (APC): display antigen on MHC class II → activates T helper cells',
        'Antigens — molecules (proteins, glycoproteins) on pathogen surface; recognised as foreign; each pathogen has unique set of antigens',
        'B lymphocytes and humoral immunity — each B cell has unique BCR (B cell receptor) with specific variable region; clonal selection: antigen binds B cell with complementary BCR; B cell activated (requires T helper cell co-stimulation); clonal expansion (mitosis → many identical B cells); differentiation → plasma cells (secrete antibodies into blood) + memory B cells (long-lived; rapid secondary response)',
        'Antibody structure — Y-shaped; two heavy + two light polypeptide chains; held by disulfide bonds; variable region (V region; antigen-binding site; unique shape complementary to specific antigen); constant region (C region; determines antibody class; effector function); antigen-antibody complex highly specific; antibody actions: agglutination (clumping); neutralisation (block toxins/entry); opsonisation (coat pathogen → phagocytes bind more easily); complement activation',
        'T lymphocytes and cell-mediated immunity — T helper cells (CD4+): secrete cytokines → activate B cells and cytotoxic T cells → coordinate immune response; T cytotoxic/killer cells (CD8+): recognise antigen on MHC class I on infected body cells → perforin (pores in cell membrane → cell lysis) + granzymes (trigger apoptosis); T memory cells; T regulatory cells (suppress autoimmune response)',
        'Primary vs secondary immune response — primary: first exposure; slow (several days to peak); lower antibody titre; mainly IgM then IgG; secondary: re-exposure; faster (hours to days); much higher antibody titre; predominantly IgG; due to memory B and T cells; basis for vaccination',
        'Vaccines — active immunity: antigen introduced → memory cells formed → long-lasting protection; types: live attenuated (weakened; e.g. MMR, oral polio; strong response); inactivated/killed (e.g. flu injection; safer; less response); subunit/protein (part of pathogen; e.g. hepatitis B); toxoid (inactivated toxin; e.g. tetanus, diphtheria); mRNA (novel; COVID-19; instructs cells to make antigen); passive immunity: antibodies given directly (no memory; immediate but temporary); antivenom; maternal antibodies (placenta, breast milk); herd immunity threshold varies by pathogen (measles ~95%; polio ~85%)',
        'Monoclonal antibodies — hybridoma technology: immunise mouse with antigen → collect spleen B cells → fuse with myeloma cells (polyethylene glycol) → hybridoma → clone → screen for antibody → scale up; uses: ELISA (enzyme-linked immunosorbent assay) for diagnosis; pregnancy tests (hCG); lateral flow assays; targeting cancer cells (Herceptin/trastuzumab targets HER2 on breast cancer cells); delivering drugs specifically to cancer cells; reducing organ transplant rejection',
      ],
      forbiddenTopics: [
        'MHC class I and II molecular detail — implied, not assessed',
        'Complement pathway detail — mentioned as antibody action only',
        'Clonal deletion and tolerance — not required',
      ],
      requiredKeywords: [
        'non-specific phagocytosis lysozyme inflammation histamine',
        'clonal selection clonal expansion', 'plasma cells memory B cells',
        'antibody variable region constant region', 'antigen-antibody specificity',
        'agglutination opsonisation neutralisation',
        'T helper CD4+ cytokines', 'cytotoxic T CD8+ perforin granzyme apoptosis',
        'primary secondary response antibody titre memory cells',
        'active immunity memory long-lasting', 'passive immunity immediate temporary',
        'vaccine types: live attenuated inactivated subunit toxoid mRNA',
        'hybridoma monoclonal antibody', 'ELISA Herceptin HER2',
      ],
      practicalNotes: [
        'Paper 3: interpreting antibody titre graphs; ELISA data analysis; evaluating vaccination programme data; analysing immunological data from tables',
      ],
    },

    topic12: {
      code: '9700-T12',
      title: 'Energy and Respiration (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'ATP — adenine + ribose + 3 phosphate groups; hydrolysis: ATP + H₂O → ADP + Pi + energy (~30.5 kJ mol⁻¹); universal energy currency; synthesis: substrate-level phosphorylation (direct); oxidative phosphorylation (ETC); photophosphorylation (chloroplasts)',
        'Coenzymes — NAD (NAD⁺ + 2H → NADH + H⁺; carries H atoms; oxidised NAD⁺ regenerated in ETC); FAD (FAD + 2H → FADH₂; carries H; oxidised in ETC); CoA (carries acetyl group as acetyl-CoA)',
        'Glycolysis (cytoplasm) — glucose (6C) → 2 pyruvate (3C); ATP investment: 2ATP used for phosphorylation; ATP yield: 4ATP (net 2ATP per glucose); 2 NAD reduced to 2 NADH; phosphorylated intermediates: glucose-6-phosphate → fructose-1,6-bisphosphate → 2× triose phosphate → 2× pyruvate',
        'Link reaction (mitochondrial matrix) — pyruvate + CoA + NAD⁺ → acetyl-CoA (2C) + CO₂ + NADH; pyruvate dehydrogenase; per glucose: 2 turns; produces 2 acetyl-CoA + 2 CO₂ + 2 NADH',
        'Krebs cycle (mitochondrial matrix) — acetyl-CoA (2C) + oxaloacetate (4C) → citrate (6C) → 8 enzyme-catalysed steps → oxaloacetate regenerated; per turn: 3 NADH + 1 FADH₂ + 1 ATP (substrate-level) + 2 CO₂; per glucose (2 turns): 6 NADH, 2 FADH₂, 2 ATP, 4 CO₂',
        'Oxidative phosphorylation and ETC (inner mitochondrial membrane) — NADH and FADH₂ donate electrons to ETC (complex I: NADH dehydrogenase; complex II: succinate dehydrogenase, FADH₂; complex III: cytochrome bc₁; complex IV: cytochrome oxidase); electrons pass through → protons pumped from matrix to intermembrane space → electrochemical gradient → protons flow back through ATP synthase (chemiosmosis, Mitchell hypothesis) → ATP synthesised; O₂ = terminal electron acceptor → H₂O; NADH yields ~2.5 ATP; FADH₂ yields ~1.5 ATP; total per glucose ~30-32 ATP',
        'Anaerobic respiration — animals/muscle: pyruvate + NADH → lactate + NAD⁺ (lactate dehydrogenase); NAD⁺ regenerated → glycolysis continues; oxygen debt: lactate converted back in liver when O₂ available; yeast: pyruvate → ethanal + CO₂ (pyruvate decarboxylase) → ethanol + NAD⁺ (alcohol dehydrogenase); NAD⁺ regenerated; commercial brewing and bread-making',
        'Respiratory quotient RQ = CO₂ produced / O₂ consumed; carbohydrate RQ = 1.0; fat RQ ≈ 0.7 (more O₂ needed; more C-H bonds); protein RQ ≈ 0.9; mixed substrate; using respirometer: control tube with dead tissue or KOH only; experimental tube; measure O₂ consumption from fluid movement; CO₂ absorbed by KOH (to measure O₂ only) or not (to measure RQ)',
      ],
      forbiddenTopics: [
        'AS respiration concepts — not just ATP from respiration; Topic 1 and Topic 3 provide AS context',
        'Photosynthesis — Topic 13', 'Hormonal metabolic regulation — Topic 14',
      ],
      requiredKeywords: [
        'ATP hydrolysis ADP + Pi', 'NAD⁺ → NADH', 'FAD → FADH₂', 'CoA acetyl-CoA',
        'glycolysis net 2ATP 2NADH pyruvate cytoplasm',
        'link reaction acetyl-CoA CO₂ NADH matrix',
        'Krebs cycle oxaloacetate citrate 3NADH 1FADH₂ 1ATP per turn',
        'ETC complex I II III IV', 'proton gradient chemiosmosis ATP synthase',
        'O₂ terminal electron acceptor H₂O',
        'oxygen debt lactate', 'yeast ethanol CO₂ anaerobic',
        'RQ carbohydrate 1.0 fat 0.7', 'respirometer KOH CO₂ absorber',
      ],
      practicalNotes: [
        'Paper 3/5: respirometer calculations; RQ from CO₂/O₂ ratio; investigating effect of substrate on respiration rate; anaerobic respiration in yeast (CO₂ production vs time)',
      ],
    },

    topic13: {
      code: '9700-T13',
      title: 'Photosynthesis (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'Chloroplast structure — outer and inner membrane (envelope); intermembrane space; thylakoid membranes (stacks = grana; interconnected by lamellae); thylakoid lumen; stroma (fluid matrix; contains: Calvin cycle enzymes, DNA, 70S ribosomes, starch grains)',
        'Photosynthetic pigments — chlorophyll a (primary; absorbs blue 430 nm and red 680 nm); chlorophyll b (accessory; absorbs blue-violet and orange-red); carotenoids: β-carotene and xanthophyll (absorb blue-green; protect against photooxidation); chromatography to separate (Rf values; TLC or paper); absorption spectrum (peaks at absorbed wavelengths); action spectrum (rate of photosynthesis vs wavelength; matches absorption spectrum of pigment mixture; evidence pigments drive photosynthesis)',
        'Light-dependent reactions (thylakoid membrane) — Photosystem II (PSII) absorbs 680 nm → excites electrons; photolysis of water: 2H₂O → 4H⁺ + 4e⁻ + O₂ (by-product); excited electrons pass through ETC (plastoquinone, cytochrome b6f, plastocyanin) → pump H⁺ into thylakoid lumen → proton gradient → ATP synthesised by ATP synthase (photophosphorylation); Photosystem I (PSI) absorbs 700 nm → electrons re-excited → NADP⁺ reduced to NADPH (by NADP reductase); non-cyclic photophosphorylation: uses PSII + PSI → produces ATP + NADPH + O₂; cyclic photophosphorylation: PSI only; electrons cycle back → produces ATP only (no NADPH, no O₂)',
        'Light-independent reactions / Calvin cycle (stroma) — CO₂ fixation: CO₂ + RuBP (5C ribulose bisphosphate) → 2× GP (3C glycerate-3-phosphate); catalysed by RuBisCO; reduction of GP: GP + ATP + NADPH → G3P (triose phosphate/glyceraldehyde-3-phosphate); regeneration of RuBP: 5G3P + 3ATP → 3RuBP; net: 1 G3P produced per 3CO₂ fixed; G3P uses: synthesis of glucose (2G3P → hexose sugar); starch; fatty acids; amino acids (with NH₄⁺); glycerol',
        'Limiting factors — light intensity: increases rate up to plateau (another factor limiting); CO₂ concentration: limits rate of carbon fixation by RuBisCO; temperature: affects enzyme-catalysed Calvin cycle reactions; light-dependent reactions less temperature sensitive; compensation point: light intensity where photosynthesis rate = respiration rate (no net gas exchange)',
        'Investigating photosynthesis — Elodea or Cabomba: count O₂ bubbles; gas syringe; effect of light intensity (inverse square law: I ∝ 1/d²); different NaHCO₃ concentrations (vary CO₂); wavelength filters; temperature; chloroplast isolation and DCPIP reduction (Hill reaction: DCPIP blue → colourless when reduced by electrons from light-dependent reactions; boiled chloroplast control; dark control)',
      ],
      forbiddenTopics: [
        'C4 plants and CAM in detail — not in syllabus', 'Photorespiration — not in syllabus',
        'Rubisco oxygenase activity detail — not required', 'Protein complexes detail — not required',
      ],
      requiredKeywords: [
        'thylakoid grana stroma', 'chlorophyll a b carotenoid',
        'absorption spectrum action spectrum', 'Rf value chromatography',
        'PSII 680 nm photolysis 2H₂O → O₂', 'PSI 700 nm NADP → NADPH',
        'non-cyclic photophosphorylation ATP NADPH O₂',
        'cyclic photophosphorylation ATP only no NADPH no O₂',
        'RuBisCO CO₂ + RuBP → 2GP', 'GP → G3P ATP NADPH',
        'G3P → glucose starch RuBP regeneration 3ATP',
        'limiting factors light CO₂ temperature compensation point',
        'DCPIP Hill reaction', 'inverse square law light intensity',
      ],
    },

    topic14: {
      code: '9700-T14',
      title: 'Homeostasis (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'Homeostasis — maintaining constant internal environment; negative feedback: receptor detects deviation from set point → control centre processes → effector corrects → returns to set point → receptor detects return → effector action reduced; positive feedback: amplifies deviation (blood clotting; oxytocin contractions; action potential depolarisation)',
        'Thermoregulation — hypothalamus as thermostat; peripheral thermoreceptors (skin) and central (hypothalamus blood temperature); too hot: vasodilation of skin arterioles (more blood to surface → more radiation); sweating (evaporative cooling; eccrine glands); piloerection muscles relax (hairs flat); too cold: vasoconstriction (less blood to surface → less radiation); shivering (involuntary muscle contraction → heat); piloerection (hair erects → traps air layer → insulation); increased metabolic rate (thermogenesis); behavioural responses',
        'Blood glucose regulation — after meal: blood [glucose] rises; β cells of islets of Langerhans in pancreas detect → insulin secreted (by exocytosis); binds receptors on liver, muscle, adipose cells; GLUT4 transporter vesicles inserted into cell membrane → glucose uptake increases; glycogenesis (glucose → glycogen in liver and muscle); lipogenesis; glycolysis stimulated; blood [glucose] returns to set point (~5 mmol dm⁻³)',
        'Low blood [glucose]: α cells detect → glucagon secreted; binds liver cell receptors; glycogenolysis (glycogen → glucose in liver); gluconeogenesis (amino acids, glycerol → glucose); blood [glucose] rises; adrenaline also triggers glycogenolysis in fight-or-flight',
        'Type 1 diabetes — autoimmune destruction of β cells → no insulin produced; insulin-dependent; managed with insulin injections/pump; risk of hypoglycaemia; diabetic ketoacidosis (fat → ketones → acidic blood) if untreated',
        'Type 2 diabetes — target cells become insulin resistant (receptors downregulated or signal transduction impaired); β cells initially compensate; then fail; associated with obesity, inactivity, age, genetics; management: lifestyle (diet, exercise); metformin (reduces gluconeogenesis); other oral hypoglycaemics; sometimes insulin at later stages',
        'Kidney structure — renal cortex: Bowman\'s capsules, PCT, DCT; renal medulla: loops of Henle, collecting ducts; renal pelvis; ureter; blood supply: renal artery → afferent arteriole → glomerulus → efferent arteriole → peritubular capillaries → vasa recta → renal vein',
        'Ultrafiltration — glomerulus: high hydrostatic pressure (afferent arteriole wider than efferent → high capillary pressure); forces plasma through basement membrane (selective by size); podocytes with filtration slits; blood cells and proteins (>70 kDa) remain in blood; filtrate contains: water, glucose, urea, amino acids, mineral ions, creatinine',
        'Selective reabsorption — PCT: all glucose and amino acids reabsorbed (active transport + Na⁺ co-transport; carrier proteins); ~80% water reabsorbed by osmosis; Na⁺/K⁺ ATPase maintains Na⁺ gradient; urea: passive reabsorption of ~50%; microvilli and many mitochondria in PCT cells',
        'Loop of Henle countercurrent multiplier — descending limb: permeable to water only → water leaves by osmosis into increasingly hypertonic medulla → filtrate concentrates; ascending limb (thick): impermeable to water; Na⁺ and Cl⁻ actively pumped out → builds medullary gradient; creates hypertonic interstitium; longer loop = more concentrated urine potential',
        'DCT and collecting duct — ADH (antidiuretic hormone) from posterior pituitary; stimulus: high blood osmolarity → osmoreceptors in hypothalamus → posterior pituitary releases ADH → binds V2 receptors on DCT/collecting duct → aquaporin-2 channels inserted → water reabsorbed → concentrated urine, small volume; low osmolarity → less ADH → fewer aquaporins → dilute urine, large volume; alcohol and caffeine suppress ADH → diuresis',
      ],
      forbiddenTopics: [
        'AS homeostasis (basic negative feedback) — deepen here; do not repeat from scratch',
        'Nervous system — Topic 15', 'Water potential notation ψ — qualitative water potential',
      ],
      requiredKeywords: [
        'negative feedback set point receptor effector', 'positive feedback amplifies',
        'thermoregulation hypothalamus', 'vasodilation vasoconstriction sweating shivering',
        'β cells insulin', 'α cells glucagon', 'GLUT4',
        'glycogenesis glycogenolysis gluconeogenesis',
        'Type 1 autoimmune no insulin', 'Type 2 insulin resistance metformin',
        'glomerulus hydrostatic pressure podocytes filtration slits',
        'PCT glucose amino acids active transport Na⁺ co-transport microvilli',
        'loop of Henle countercurrent multiplier hypertonic medulla',
        'ADH aquaporin-2', 'osmoreceptors posterior pituitary',
        'concentrated urine high ADH', 'dilute urine low ADH',
      ],
    },

    topic15: {
      code: '9700-T15',
      title: 'Control and Coordination (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'Nervous system — CNS (brain + spinal cord); PNS; somatic (voluntary, skeletal muscle); autonomic (involuntary; sympathetic: noradrenaline, fight-or-flight; parasympathetic: acetylcholine, rest-and-digest)',
        'Neurone structure — cell body; axon (conducts impulse away); dendrites (receive signals); myelin sheath (Schwann cells, nodes of Ranvier every 1-2 mm; saltatory conduction); axon terminal (synaptic knob); sensory (receptor → CNS); interneurone (within CNS); motor (CNS → effector)',
        'Resting potential (~−70 mV) — maintained by Na⁺/K⁺ ATPase (pumps 3 Na⁺ out, 2 K⁺ in per cycle using ATP); K⁺ leak channels allow K⁺ to diffuse out (down concentration gradient); Na⁺ channels closed at rest; interior negative relative to outside',
        'Action potential — depolarisation: threshold reached → voltage-gated Na⁺ channels open → Na⁺ rushes in (down electrochemical gradient) → inside becomes ~+40 mV; repolarisation: Na⁺ channels inactivated; voltage-gated K⁺ channels open → K⁺ rushes out → potential returns toward −70 mV; hyperpolarisation: brief overshoot below resting potential; absolute refractory period (Na⁺ channels inactivated; no new AP possible); relative refractory period (only very strong stimulus can trigger); all-or-nothing principle',
        'Propagation — AP in adjacent region triggered by local currents; refractory period prevents back-propagation; myelinated axons: saltatory conduction (AP jumps between nodes of Ranvier → much faster); speed affected by: temperature; axon diameter; myelination',
        'Synaptic transmission — AP arrives at synaptic knob → voltage-gated Ca²⁺ channels open → Ca²⁺ influx → synaptic vesicles fuse with pre-synaptic membrane → ACh released by exocytosis → diffuses across cleft (20 nm) → binds nicotinic ACh receptors → ligand-gated Na⁺ channels open → Na⁺ influx → EPSP (local depolarisation); if sum of EPSPs exceeds threshold → AP; acetylcholinesterase breaks ACh → choline + acetate; choline reabsorbed; inhibitory synapse: GABA → Cl⁻ influx → IPSP (hyperpolarisation) → inhibits firing; summation: temporal (rapid successive stimuli at one synapse); spatial (multiple synapses simultaneously)',
        'Muscle structure and contraction — skeletal muscle: muscle fibres → myofibrils; sarcomere: actin (thin filaments with troponin + tropomyosin) and myosin (thick filaments with heads); A band (myosin ± actin); I band (actin only); H zone (myosin only); Z lines (sarcomere boundaries); sliding filament theory: myosin heads bind actin active sites (cross-bridge; ATP releases myosin head → head pivots → power stroke pulls actin → sarcomere shortens; new ATP binds → head detaches; hydrolysis → head cocked); Ca²⁺ from sarcoplasmic reticulum binds troponin → tropomyosin moves → actin active sites exposed; NMJ (neuromuscular junction): ACh from motor neuron → AP in muscle → Ca²⁺ release',
        'Plant responses — tropisms: phototropism (shoots positive → grow toward light; roots negative → grow away); gravitropism (roots positive → grow toward gravity; shoots negative); IAA/auxin: produced in shoot tip; polar transport (moves away from shoot tip); in phototropism: unilateral light → IAA moves to shaded side → more cell elongation on shaded side → bending toward light; high [IAA] in roots inhibits elongation → root curves away from high concentration; apical dominance: IAA from apex inhibits lateral bud growth; commercial uses: rooting powder (IAA promotes root formation on cuttings); selective weedkillers (2,4-D at high concentration kills broad-leaved plants; grasses resistant); ethylene (fruit ripening); gibberellins (stem elongation, seed germination, breaking dormancy); ABA (stomatal closure in drought; seed dormancy)',
      ],
      forbiddenTopics: [
        'CNS brain regions in detail — not assessed',
        'Chemoreceptors controlling breathing — brief mention only',
        'Spinal cord reflex arc in detail — not specifically tested at A Level',
      ],
      requiredKeywords: [
        'Na⁺/K⁺ ATPase 3Na⁺ out 2K⁺ in', 'resting potential −70 mV',
        'depolarisation voltage-gated Na⁺ channels', 'repolarisation K⁺ channels',
        'all-or-nothing', 'absolute relative refractory period',
        'saltatory conduction nodes of Ranvier',
        'ACh synaptic vesicles Ca²⁺ influx EPSP', 'GABA IPSP hyperpolarisation',
        'acetylcholinesterase', 'summation temporal spatial',
        'sarcomere A I H Z bands', 'sliding filament myosin head ATP',
        'troponin tropomyosin Ca²⁺ actin active sites exposed',
        'IAA auxin phototropism apical dominance',
        'ABA stomatal closure drought', 'gibberellins elongation germination',
      ],
    },

    topic16: {
      code: '9700-T16',
      title: 'Inheritance (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'Meiosis — produces haploid gametes; meiosis I: prophase I (homologous chromosomes pair as bivalents; crossing over at chiasmata between non-sister chromatids → recombinant chromosomes; variation source 1); metaphase I (bivalents align at equator; independent assortment → 2²³ combinations in humans; variation source 2); anaphase I (homologous pairs separate); telophase I; meiosis II (sister chromatids separate; like mitosis); result: 4 haploid cells each genetically unique',
        'Monohybrid inheritance — gene; allele; locus; dominant (expressed when heterozygous); recessive (expressed only when homozygous); Punnett squares; genotype (alleles present); phenotype (observable characteristic); homozygous; heterozygous; test cross (cross with homozygous recessive → determines unknown genotype)',
        'Dihybrid inheritance — two genes on different chromosomes; 9:3:3:1 ratio in F2 (assuming both dominant and both recessive expressed); Punnett square 4×4; linked genes deviate from 9:3:3:1',
        'Linkage and crossing over — genes on same chromosome inherited together; crossing over creates recombinant gametes; recombination frequency ∝ distance between genes; chi-squared test to determine if deviation from expected is significant',
        'Epistasis — one gene masks expression of another; recessive epistasis (aa masks B: 9:3:4); dominant epistasis (A masks B: 12:3:1); duplicate dominant epistasis (A or B: 9:7); interpreting modified dihybrid ratios',
        'Sex determination — XX female; XY male; SRY gene on Y; sex chromosomes',
        'Sex-linked inheritance — genes on X chromosome only (no equivalent on Y); X-linked recessive: males (XY) affected if they have one recessive allele (hemizygous); females carrier (X^A X^a); haemophilia; red-green colour blindness; pedigree analysis; Punnett squares',
        'Codominance — both alleles expressed in heterozygote; ABO blood groups: I^A, I^B, i alleles (I^A and I^B codominant; i recessive); four blood groups A, B, AB, O; anti-A and anti-B antibodies (agglutination); sickle cell (HbA/HbS heterozygote has both normal and sickle haemoglobin)',
        'Chi-squared test — χ² = Σ[(O-E)²/E]; df = n-1 (where n = number of classes); compare with critical value at p = 0.05; if χ² < critical value → do not reject H₀ → results consistent with expected ratio',
      ],
      forbiddenTopics: [
        'Quantitative genetics (polygenic traits, heritability) — not in detail',
        'Hardy-Weinberg equilibrium — Topic 17',
        'Genomic imprinting — not assessed',
      ],
      requiredKeywords: [
        'meiosis crossing over chiasmata independent assortment bivalent',
        'haploid gametes', 'monohybrid dihybrid Punnett square',
        'dominant recessive codominant', 'test cross', 'linkage recombination frequency',
        'epistasis 9:3:4 12:3:1 9:7',
        'X-linked haemophilia colour blindness carrier female hemizygous male',
        'ABO blood groups I^A I^B i', 'sickle cell HbA HbS codominant',
        'chi-squared test df critical value p = 0.05',
      ],
    },

    topic17: {
      code: '9700-T17',
      title: 'Selection and Evolution (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'Variation — continuous (polygenic + environment; normal distribution; e.g. height, mass, skin colour); discontinuous (mainly genetic; few environmental effects; distinct categories; e.g. ABO blood groups, sex)',
        'Sources of genetic variation — mutation (random; gene or chromosome; most neutral; rate increased by mutagens: ionising radiation, UV, chemical mutagens); meiosis (crossing over + independent assortment → unique gametes); random fertilisation',
        'Natural selection — Darwin; overproduction of offspring; heritable variation in population; competition for limited resources; differential survival and reproduction (survival of the fittest); survivors pass on favourable alleles → allele frequency changes over generations; directional selection (favours one extreme → mean shifts; e.g. industrial melanism: Biston betularia peppered moth; dark melanic form increased in frequency in industrial areas due to predation on pale form on soot-covered trees); stabilising selection (favours intermediate phenotype; variance decreases; most common in stable environments; e.g. birth weight in humans); disruptive selection (favours both extremes; bimodal distribution; can lead to speciation)',
        'Hardy-Weinberg equilibrium — allele and genotype frequencies remain constant if: large population; random mating; no mutation; no migration; no natural selection; p + q = 1 (p = frequency of dominant allele; q = frequency of recessive); p² + 2pq + q² = 1 (p² = homozygous dominant; 2pq = heterozygous; q² = homozygous recessive); calculating q from observed q² phenotype frequency → q → p → p², 2pq; testing whether selection is occurring by comparing actual with HWE expected',
        'Speciation — new species from existing; biological species concept: species = group that can interbreed and produce fertile offspring; allopatric speciation: geographical isolation → different selection pressures → different mutations → different allele frequencies → eventually reproductive isolation → cannot interbreed even if barrier removed; sympatric speciation: polyploidy (especially in plants); allopolyploidy (hybridisation between species + chromosome doubling → fertile hybrid; common in angiosperms; e.g. wheat)',
        'Antibiotic resistance as natural selection — random mutation creates resistant variant; antibiotic kills susceptible bacteria; resistant survive and reproduce; resistance allele frequency increases; horizontal gene transfer (plasmids) spreads resistance between bacteria; MRSA case study; importance of completing antibiotic courses',
      ],
      forbiddenTopics: [
        'Molecular clock, neutral theory — not required',
        'Human evolution — not in 9700',
      ],
      requiredKeywords: [
        'continuous variation normal distribution', 'discontinuous variation',
        'natural selection directional stabilising disruptive',
        'industrial melanism Biston betularia',
        'Hardy-Weinberg p + q = 1', 'p² + 2pq + q² = 1',
        'assumptions HWE large population random mating no selection',
        'allopatric speciation geographical isolation reproductive isolation',
        'sympatric speciation polyploidy allopolyploidy',
        'antibiotic resistance natural selection horizontal gene transfer',
      ],
    },

    topic18: {
      code: '9700-T18',
      title: 'Classification, Biodiversity and Conservation (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'Classification hierarchy — Domain → Kingdom → Phylum → Class → Order → Family → Genus → Species; binomial nomenclature (Genus species, italicised); three domains: Archaea, Bacteria, Eukarya; five kingdoms: Prokaryotae, Protoctista, Fungi, Plantae, Animalia',
        'Phylogenetics — cladistics: grouping by shared derived characteristics (synapomorphies); cladogram shows evolutionary relationships; molecular phylogeny: comparing DNA sequences (mitochondrial DNA; 16S rRNA for bacteria), amino acid sequences → often revises traditional taxonomy; molecular clock concept',
        'Simpson\'s Diversity Index — D = 1 − [Σn(n-1)/N(N-1)]; n = number of individuals of each species; N = total number of individuals; D ranges 0 (low diversity) to 1 (high diversity); species richness (number of species) + species evenness (relative abundance) both contribute',
        'Sampling methods — random: quadrats placed using random number coordinates; avoid bias; systematic: belt transect along gradient; point quadrats; line transect; mark-release-recapture (Lincoln/Peterson index): N = (M × n) / m (M = first sample marked; n = second sample size; m = recaptured marked individuals); assumptions: closed population; marks don\'t affect survival; marks don\'t fall off; equal recapture probability',
        'Conservation of biodiversity — reasons: ecological (ecosystem services; food webs; stability); economic (medicines; crops; bioprospecting; ecotourism); aesthetic; ethical (intrinsic value of species); in situ: national parks; nature reserves; biosphere reserves; marine protected areas; habitat management; reintroduction programmes; habitat corridors; ex situ: zoos; botanic gardens; seed banks (Kew Millennium Seed Bank); captive breeding; cryopreservation; CITES (Convention on International Trade in Endangered Species); CBD (Convention on Biological Diversity); IUCN Red List',
        'Sustainable development — meeting present needs without compromising future generations; sustainable use of ecosystems (sustainable fishing with quotas; selective logging; certified timber); ecosystem services: provisioning (food, water, medicine); regulating (climate, water purification, pollination); cultural (recreation); supporting (nutrient cycling, primary production)',
      ],
      requiredKeywords: [
        'domain kingdom phylum class order family genus species',
        'binomial nomenclature italicised', 'three domains Archaea Bacteria Eukarya',
        'cladistics synapomorphy cladogram', 'molecular phylogeny 16S rRNA mitochondrial DNA',
        'Simpson\'s Index D = 1 − Σn(n-1)/N(N-1)', 'species richness evenness',
        'mark-release-recapture Lincoln index N = Mn/m', 'closed population assumption',
        'in situ national park nature reserve', 'ex situ seed bank captive breeding',
        'CITES IUCN Red List', 'ecosystem services', 'sustainable development',
      ],
    },

    topic19: {
      code: '9700-T19',
      title: 'Genetic Technology (A Level)',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        'PCR — denaturation 95°C (H-bonds break; strands separate); annealing 50-65°C (specific primers bind to complementary flanking sequences); extension 72°C (Taq DNA polymerase; heat-stable from Thermus aquaticus; adds nucleotides 5\'→3\'); exponential amplification (2ⁿ copies after n cycles); applications: forensics (DNA profiling); diagnosis (genetic diseases; infectious disease detection); research',
        'Gel electrophoresis — agarose gel; DNA negatively charged → migrates toward positive electrode; smaller fragments move further; stained with ethidium bromide or SYBR Green; UV illumination; compare with size ladder/marker; DNA profiling using STR (short tandem repeat) analysis; RFLP (restriction fragment length polymorphism)',
        'DNA sequencing — Sanger chain-termination (dideoxy): ddNTPs each labelled with different fluorescent dye; terminates chain when incorporated; mixture of all lengths; gel electrophoresis; laser detection → sequence read 5\'→3\'; next-generation sequencing (NGS): massively parallel; shotgun; bioinformatics assembly; whole genome sequencing',
        'Recombinant DNA technology — restriction endonucleases: cut DNA at specific palindromic recognition sequences → sticky ends (cohesive single-stranded overhangs); same enzyme used to cut vector; DNA ligase: joins sticky ends; forms phosphodiester bonds; seals nicks; creates recombinant DNA; vectors: plasmids (with: origin of replication ori; antibiotic resistance gene for selection; lacZ reporter gene for blue-white screening); or bacteriophages; transformation: host cells (E. coli) take up plasmid by heat shock or electroporation; selection of transformants: antibiotic resistance (only transformed cells survive); blue-white selection (X-gal: disrupted lacZ → white colonies = insert present; intact lacZ → blue); sequencing to verify',
        'Applications of GMOs — human insulin: insulin gene cloned into E. coli or yeast; expressed in fermenters; purified → cheaper, more consistent, less immunogenic than animal insulin; golden rice: phytoene synthase (daffodil) + carotene desaturase (bacterium) inserted into rice endosperm → β-carotene production → reduces vitamin A deficiency; Bt crops: Bacillus thuringiensis toxin gene → pest resistance; herbicide-resistant crops (Roundup Ready); controversy: GMO environmental risks; gene flow; biodiversity; corporate control; labelling',
        'CRISPR-Cas9 — guide RNA (gRNA = crRNA + tracrRNA): ~20 nt sequence complementary to target DNA + scaffold; directs Cas9 nuclease to specific genomic site; Cas9 makes double-strand break (DSB); cell repair: NHEJ (non-homologous end joining → insertions/deletions → frameshift → gene knockout); HDR (homology-directed repair → precise correction using repair template); applications: correcting genetic diseases (sickle cell disease; thalassaemia); cancer immunotherapy (CAR-T cells); agriculture; ethical concerns about germline editing; delivery: viral vectors (AAV); lipid nanoparticles',
        'Gene therapy — somatic gene therapy: corrective gene delivered to somatic cells (non-heritable); viral vectors (AAV, lentivirus, adenovirus); success: Luxturna (RPE65 → inherited blindness); SCID-X1; challenges: immune response to vector; transient expression; insertional mutagenesis; germline therapy: heritable; ethical moratorium; pharmacogenomics: using patient genome to personalise treatment (CYP450 polymorphisms; targeted cancer drugs e.g. BRAF V600E + vemurafenib)',
        'Ethical issues — GMOs: environment; gene flow to wild relatives; allergenicity; labelling; corporate control; gene therapy: somatic (accepted); germline (controversial; designer babies); genetic testing: privacy; discrimination (insurance, employment); genetic counselling; prenatal/preimplantation diagnosis',
      ],
      requiredKeywords: [
        'PCR denaturation annealing extension Taq polymerase', 'exponential amplification',
        'gel electrophoresis agarose size ladder', 'STR DNA profiling',
        'Sanger sequencing ddNTP chain termination', 'NGS shotgun',
        'restriction endonuclease palindromic sticky ends', 'DNA ligase phosphodiester',
        'plasmid ori antibiotic resistance lacZ', 'transformation heat shock',
        'blue-white selection antibiotic selection',
        'insulin E. coli expression fermenters', 'golden rice β-carotene',
        'CRISPR Cas9 gRNA double-strand break', 'NHEJ knockout HDR correction',
        'gene therapy somatic viral vector AAV', 'germline heritable ethical',
        'pharmacogenomics CYP450',
      ],
      practicalNotes: [
        'Paper 3/5: interpreting gel electrophoresis; calculating fragment sizes from gel image; evaluating DNA profiling evidence; restriction enzyme digest planning; ethical evaluation of GMOs',
      ],
    },

    biology_paper3: {
      code: '9700-P3',
      title: 'Advanced Practical Skills Paper 3 (AS Level)',
      asLevel: true,
      paperRef: 'Paper 3 — 2 hours, 40 marks',
      allowedTopics: [
        'Making and observing preparations — temporary mount; staining; using light microscope; scientific diagram rules (no shading, clear lines, labels with ruled lines, scale bar, appropriate magnification stated)',
        'Measuring cell size — eyepiece graticule calibrated with stage micrometer; calculating actual size; scale bar interpretation in micrographs',
        'Biochemical food tests — Benedict\'s for reducing sugar; non-reducing sugar test; iodine for starch; biuret for protein; emulsion test for lipid; interpreting colour changes; semi-quantitative Benedict\'s',
        'Enzyme investigations — catalase + H₂O₂; amylase + starch; measuring initial rate from tangent at t=0; effect of temperature, pH, concentration; Michaelis-Menten graph; identifying competitive vs non-competitive inhibition from data',
        'Osmosis practical — potato cylinders in sucrose solutions; measuring % mass change; plotting graph; finding water potential of tissue from x-intercept; preparing serial dilutions accurately',
        'Transpiration — potometer setup; bubble movement; rate per unit leaf area; effect of conditions; discussing limitations (potometer measures water uptake, not transpiration; some water used for photosynthesis)',
        'Dissections — mammalian heart; leaf; insect; identifying structures; scientific drawing with labels',
        'Interpreting photomicrographs — identifying organelles; stages of cell division; calculating actual size; comparing prokaryotic and eukaryotic',
        'Statistical analysis — mean; standard deviation; standard error; t-test (comparing two means; df = n₁+n₂-2); null hypothesis; p value; chi-squared for genetics ratios; interpreting whether difference is significant',
        'Experimental design — IV, DV, CVs; writing full method; choosing apparatus; range of values; number of repeats; control experiment; risk assessment; presenting results table',
        'Graphs — correct type; axes labelled with quantity + unit; suitable scale; plotting with error bars; best-fit line or curve; interpreting trends; calculating rates from gradients',
        'Evaluating — specific sources of error; specific improvements; whether data supports conclusion; limitations of method',
      ],
      forbiddenTopics: [
        'Theory from topic notes — Paper 3 tests practical skills',
      ],
      requiredKeywords: [
        'control experiment', 'independent dependent control variables',
        'standard deviation', 't-test df', 'null hypothesis p value',
        'chi-squared genetics', 'initial rate from tangent',
        'error bars', 'scale bar magnification', '% mass change osmosis',
        'potometer water uptake', 'eyepiece graticule calibration',
        'specific error not generic', 'specific improvement',
      ],
      boundaryNotes: [
        'UAE: Paper 3 often replaced by Alternate Paper (written) using supplied experimental data.',
        'For written exam: answer questions about observations, sources of error, improvements, and analysis as if you performed the experiment.',
      ],
    },

    biology_paper5: {
      code: '9700-P5',
      title: 'Planning, Analysis and Evaluation Paper 5 (A Level)',
      asLevel: false,
      paperRef: 'Paper 5 — 1 hour 15 min, 30 marks',
      allowedTopics: [
        'Planning — aim; quantitative hypothesis; IV (what you change); DV (what you measure); CVs (what you control and exactly how); detailed step-by-step method; realistic equipment and concentrations; at least 5 IV values; control experiment and why needed; risk assessment context-specific',
        'Statistical tests — selecting correct test: t-test (comparing two means, normally distributed); Mann-Whitney U (non-normal data or small sample); chi-squared (categorical/genetics data); Spearman\'s rank (correlation); state H₀; calculate; compare with critical value; conclude whether to reject H₀; p < 0.05 = significant',
        'Processing data — mean; % change; rate = 1/time; appropriate sig figs and units throughout',
        'Graphs — correct type; axes with quantity + units; scale >50% of grid; error bars; best-fit line or curve; anomalous points; gradient using large triangle',
        'Linearising — y = ab^x: plot log y vs x (gradient = log b); y = ax^n: plot log y vs log x (gradient = n); using to find rate constants and orders',
        'Evaluating — specific random errors (timing; reading; biological variation); specific systematic errors (heat loss; side reactions; calibration); specific improvements (not generic); limitations of conclusion (correlation ≠ causation; small n; confounding variables; extrapolation); Paper 5 may use contexts outside biology syllabus',
      ],
      requiredKeywords: [
        'independent variable', 'dependent variable', 'control variable',
        'null hypothesis', 'p < 0.05 significant',
        't-test Mann-Whitney chi-squared Spearman',
        'log y vs log x gradient n', 'log y vs x gradient log b',
        'gradient large triangle', 'error bars',
        'specific error not generic', 'specific improvement',
        'correlation not causation', 'extrapolation invalid',
      ],
      boundaryNotes: [
        'Paper 5 = 11.5% of A Level; contexts may be outside biology syllabus — intentional.',
        'Common errors: too vague in improvements; wrong statistical test selected; null hypothesis not stated.',
      ],
    },
  },

  // ================================================================
  // CIE A LEVEL PHYSICS 9702
  // AS Level Topics 1-14 | A Level adds Topics 15-26
  // ================================================================
  physics: {

    topic1: {
      code: '9702-T1',
      title: 'Physical Quantities and Units',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'SI base units — metre (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol)',
        'Derived units in base units — N = kg m s⁻²; Pa = kg m⁻¹ s⁻²; J = kg m² s⁻²; V = kg m² s⁻³ A⁻¹; Wb = kg m² s⁻² A⁻¹; T = kg s⁻² A⁻¹',
        'Prefixes — pico p 10⁻¹²; nano n 10⁻⁹; micro µ 10⁻⁶; milli m 10⁻³; centi c 10⁻²; kilo k 10³; mega M 10⁶; giga G 10⁹; tera T 10¹²',
        'Scalars — magnitude only: mass, speed, distance, energy, temperature, time, density, pressure, work, power',
        'Vectors — magnitude and direction: displacement, velocity, acceleration, force, weight, momentum, electric field, gravitational field',
        'Adding vectors — triangle rule; parallelogram rule; resolving: Fx = F cosθ; Fy = F sinθ; resultant by Pythagoras; direction by trigonometry',
        'Measurement uncertainty — systematic error (shifts all readings; calibration error; zero error; not reduced by repeating); random error (spread of readings; reduced by taking more readings and averaging); absolute uncertainty (units); percentage uncertainty (= absolute/reading × 100%)',
        'Combining uncertainties — addition/subtraction: add absolute uncertainties; multiplication/division: add percentage uncertainties; power n: multiply percentage uncertainty by n',
        'Significant figures — recording to appropriate precision; standard form',
        'Checking equations — checking homogeneity using SI base units; an equation is only possibly correct if both sides have the same base units; identifying incorrect equations',
      ],
      forbiddenTopics: [
        'Specific formulae from other topics — this is pure quantities/errors/vectors',
      ],
      requiredKeywords: [
        'SI base units', 'derived units in base units', 'prefix',
        'scalar magnitude only', 'vector magnitude and direction',
        'resolving components Fx Fy', 'resultant vector',
        'systematic error', 'random error', 'absolute uncertainty', 'percentage uncertainty',
        'add absolute uncertainties', 'add percentage uncertainties',
        'significant figures', 'homogeneity of equations',
      ],
      practicalNotes: [
        'Paper 3: all percentage uncertainty calculations; identifying sources of error; combining uncertainties in quantities like ρ = m/V; checking dimensional homogeneity',
      ],
    },

    topic2: {
      code: '9702-T2',
      title: 'Kinematics',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Displacement, speed, velocity, acceleration — definitions; SI units; scalar vs vector',
        'Equations of uniformly accelerated motion (SUVAT) — v = u + at; s = ut + ½at²; v² = u² + 2as; s = ½(u+v)t; conditions: constant acceleration only',
        'Displacement-time graphs — gradient = velocity; area under graph has no direct meaning; curve = non-uniform speed; horizontal line = stationary',
        'Velocity-time graphs — gradient = acceleration; area under graph = displacement; horizontal line = constant velocity; curve = non-uniform acceleration',
        'Acceleration-time graphs — area = change in velocity',
        'Projectile motion — horizontal: no force (ignoring air resistance) → constant velocity; vx = ux constant; vertical: gravitational force → constant acceleration g downward; uy changes; vy = uy − gt; both components independent; calculating time of flight, range, maximum height, velocity at any point',
        'Terminal velocity — drag force increases with speed (∝ v or v² depending on conditions); when drag = weight → net force = 0 → acceleration = 0 → constant terminal velocity; velocity-time graph: steep initial gradient (max acceleration) → curve → horizontal (terminal velocity)',
      ],
      forbiddenTopics: [
        'Circular motion — Topic 7 A Level', 'Relativistic effects — not in 9702',
      ],
      requiredKeywords: [
        'displacement velocity acceleration definitions',
        'SUVAT equations constant acceleration only',
        'displacement-time gradient = velocity',
        'velocity-time gradient = acceleration area = displacement',
        'projectile horizontal constant velocity vertical g downward independent',
        'terminal velocity drag = weight zero acceleration',
      ],
    },

    topic3: {
      code: '9702-T3',
      title: 'Dynamics',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Newton\'s first law — object remains at rest or constant velocity unless resultant force acts; inertia',
        'Newton\'s second law — resultant force F = ma; or F = rate of change of momentum = Δp/Δt; units: N = kg m s⁻²',
        'Newton\'s third law — for every force there is an equal and opposite force of the same type on a different object; identifying Newton\'s third law pairs (same magnitude, opposite direction, same type of force, different objects)',
        'Linear momentum p = mv; SI unit: kg m s⁻¹',
        'Conservation of linear momentum — total momentum of a closed system is constant (no external net force); applying to collisions and explosions',
        'Elastic collision — kinetic energy conserved; momentum conserved; coefficient of restitution e = 1',
        'Inelastic collision — momentum conserved; kinetic energy NOT conserved (converted to heat/sound/deformation); coefficient of restitution e < 1',
        'Perfectly inelastic — objects coalesce; maximum KE loss; e = 0',
        'Impulse — J = FΔt = Δp; units: N s = kg m s⁻¹; area under force-time graph = impulse; used to explain why padding reduces injury (increases contact time → reduces peak force)',
        'Free body diagrams — all forces on single object; magnitude and direction; resultant',
        'Weight W = mg; mass is scalar; weight is vector',
      ],
      forbiddenTopics: [
        'Rotational dynamics (moment of inertia, angular momentum) — not in 9702',
        'Relativistic momentum — not in 9702',
      ],
      requiredKeywords: [
        'Newton\'s first second third law', 'inertia', 'F = ma', 'F = Δp/Δt',
        'Newton\'s third law pairs same type different objects',
        'momentum p = mv', 'conservation of momentum closed system',
        'elastic collision KE conserved', 'inelastic collision KE not conserved',
        'impulse J = FΔt = Δp', 'area under F-t graph = impulse',
        'free body diagram', 'weight W = mg',
      ],
    },

    topic4: {
      code: '9702-T4',
      title: 'Forces, Density and Pressure',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Turning effect — moment M = Fd (perpendicular distance from pivot); units N m; couple = two equal antiparallel forces not acting at same point; torque of couple = F × d (perpendicular separation)',
        'Principle of moments — for equilibrium: sum of clockwise moments = sum of anticlockwise moments about any point; conditions for equilibrium: resultant force = 0 AND resultant moment = 0',
        'Centre of gravity — single point where entire weight acts; finding by suspension method; stability: low CG and wide base → more stable',
        'Density ρ = m/V; units kg m⁻³',
        'Pressure P = F/A; units Pa = N m⁻²; pressure in fluid P = ρgh (h = depth below surface; ρ = fluid density; g = gravitational field strength)',
        'Upthrust (Archimedes\' principle) — upthrust = weight of fluid displaced; F = ρfluid × V submerged × g; floating: upthrust = weight; sinking: weight > upthrust; rising: upthrust > weight',
        'Friction — F ≤ µN (µ = coefficient of friction; N = normal reaction force); F = µN at limiting equilibrium; kinetic friction < static friction at same surfaces; direction always opposes motion or tendency of motion',
      ],
      requiredKeywords: [
        'moment = Fd perpendicular', 'couple torque', 'principle of moments',
        'equilibrium resultant force and moment = 0', 'centre of gravity',
        'density ρ = m/V', 'pressure P = F/A', 'fluid pressure P = ρgh',
        'upthrust Archimedes weight of fluid displaced',
        'friction F ≤ µN limiting equilibrium',
      ],
    },

    topic5: {
      code: '9702-T5',
      title: 'Work, Energy and Power',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Work done W = Fd cosθ (θ = angle between force and displacement); W > 0 if force component in direction of motion; W < 0 if against motion; units J',
        'Gravitational PE (near surface) Ep = mgh; change in GPE = mgΔh',
        'Kinetic energy Ek = ½mv²; deriving from work-energy theorem: W = ΔEk',
        'Elastic (strain) PE = ½kx² (for spring obeying Hooke\'s law; k = spring constant; x = extension)',
        'Conservation of energy — energy cannot be created or destroyed; total energy in closed system constant; conversion between forms; using to solve problems (KE ↔ GPE ↔ elastic PE etc.)',
        'Work-energy theorem — net work done on object = change in KE; W_net = ΔEk = ½mv² − ½mu²',
        'Efficiency — useful output energy / total input energy × 100%; or useful output power / total input power × 100%; always ≤ 100%',
        'Power P = W/t = Fv (for constant force); units W = J s⁻¹',
      ],
      requiredKeywords: [
        'work done W = Fd cosθ', 'gravitational PE Ep = mgh',
        'kinetic energy Ek = ½mv²', 'elastic PE = ½kx²',
        'conservation of energy', 'work-energy theorem W_net = ΔEk',
        'efficiency useful output / total input', 'power P = W/t = Fv',
      ],
    },

    topic6: {
      code: '9702-T6',
      title: 'Deformation of Solids',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Hooke\'s law — F = kx (k = spring constant in N m⁻¹; x = extension); linear region up to elastic limit; spring constant from gradient of F-x graph',
        'Elastic potential energy = ½kx² = ½Fx; area under F-x graph',
        'Tensile stress σ = F/A (Pa); tensile strain ε = ΔL/L (dimensionless)',
        'Young modulus E = stress/strain = σ/ε = FL/AΔL; units Pa; measure by plotting stress-strain graph → gradient in linear region',
        'Stress-strain graph features — limit of proportionality (Hooke\'s law ceases); elastic limit (material returns to original length if stress removed below this); yield point (large extension for small increase in stress; plastic deformation begins); UTS (ultimate tensile stress; maximum stress); fracture point; brittle (fractures near elastic limit with little/no plastic deformation; e.g. glass, ceramics); ductile (large plastic region before fracture; e.g. copper, steel); glass is brittle; copper is ductile',
        'Elastic deformation — reversible; material returns to original shape when load removed; no permanent change',
        'Plastic deformation — irreversible; permanent change in shape; occurs beyond elastic limit',
        'Hysteresis — rubber: loading and unloading curves different; area between curves = energy lost as heat per cycle; useful in shock absorbers and tyres',
      ],
      requiredKeywords: [
        'Hooke\'s law F = kx', 'elastic limit', 'spring constant',
        'stress σ = F/A', 'strain ε = ΔL/L', 'Young modulus E = σ/ε',
        'limit of proportionality', 'yield point', 'UTS', 'fracture',
        'brittle fractures at elastic limit', 'ductile large plastic region',
        'elastic deformation reversible', 'plastic deformation irreversible',
        'hysteresis energy lost as heat',
      ],
      practicalNotes: [
        'Paper 3: Young modulus of wire by plotting load vs extension; gradient from stress-strain graph; identifying sources of error (e.g. non-uniform wire cross-section measured with micrometer at multiple points)',
      ],
    },

    topic7_9_waves: {
      code: '9702-T7-9',
      title: 'Waves (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Progressive waves — transfer energy without net transfer of matter; amplitude A; wavelength λ; frequency f; period T = 1/f; wave speed v = fλ; intensity ∝ A² ∝ 1/r² (for point source)',
        'Transverse waves — oscillation perpendicular to wave propagation; EM waves; water surface waves; S seismic waves; can be polarised',
        'Longitudinal waves — oscillation parallel to wave propagation; sound; P seismic waves; compressions and rarefactions; cannot be polarised',
        'Displacement-distance and displacement-time graphs — reading amplitude, wavelength, period; phase difference from graph',
        'Phase difference — expressed in degrees or radians; in phase: Δφ = 0 or 2nπ; antiphase: Δφ = π or (2n+1)π; general: Δφ = 2πd/λ (d = path difference)',
        'Electromagnetic spectrum — all transverse; all travel at c = 3.00 × 10⁸ m s⁻¹ in vacuum; order (longest to shortest λ): radio/microwave/infrared/visible/UV/X-ray/gamma; properties and uses of each; hazards of UV, X-rays, gamma (ionising)',
        'Polarisation — transverse waves only; plane polarisation: oscillations in one plane; by filter (polaroid); by reflection at Brewster\'s angle; Malus\'s law: I = I₀cos²θ; applications: polaroid sunglasses (reduce glare); LCD screens; photography; stress analysis; evidence that EM waves are transverse (can be polarised)',
        'Reflection — angle of incidence = angle of reflection; plane mirror images (virtual, upright, same size, laterally inverted)',
        'Refraction — Snell\'s law: n₁sinθ₁ = n₂sinθ₂; refractive index n = c/v = sin(angle in less dense medium) / sin(angle in denser medium); bends toward normal entering denser medium; frequency unchanged; wavelength changes',
        'Total internal reflection — only from denser to less dense medium; critical angle θc: sinθc = n₂/n₁ = 1/n (if n₂ = 1 for air); at θ ≥ θc all light reflected; optical fibres: step-index (core n₁ > cladding n₂; TIR at interface); multimode dispersion (different rays take different paths → pulse broadening); monomode (narrow core; single path; less dispersion); medical endoscopy; telecommunications',
        'Superposition — algebraic sum of displacements when waves overlap',
        'Stationary/standing waves — two progressive waves equal amplitude, equal frequency, travelling in opposite directions; nodes (zero displacement always; due to destructive interference); antinodes (maximum displacement; constructive); node-to-node = λ/2; antinode-to-antinode = λ/2; node-to-antinode = λ/4; fundamental frequency and harmonics in: strings (both ends fixed; λ₁ = 2L; f₁ = v/2L); open pipe (both ends open; λ₁ = 2L; same as string); closed pipe (one end closed; λ₁ = 4L; f₁ = v/4L; only odd harmonics)',
        'Interference — coherent sources required (same frequency; constant phase difference); constructive: path difference = nλ; destructive: path difference = (n + ½)λ; Young\'s double-slit: λ = ax/D (a = slit separation; x = fringe spacing; D = slit to screen distance)',
        'Diffraction — spreading of waves at edges or through gaps; significant when gap size ≈ λ; single slit: central maximum wider and brighter than secondary maxima; diffraction grating: d sinθ = nλ (d = 1/N where N = slits per metre); sharp bright maxima; uses: measuring wavelength; spectroscopy; identifying elements from emission spectra',
      ],
      forbiddenTopics: [
        'All mechanics from Topics 2-6', 'Doppler effect — Topic 14 A Level',
        'Quantum wave-particle duality — Topic 13',
      ],
      requiredKeywords: [
        'amplitude wavelength frequency period', 'v = fλ', 'intensity ∝ A²',
        'transverse oscillation perpendicular', 'longitudinal oscillation parallel',
        'phase difference 2πd/λ', 'EM spectrum all travel at c',
        'polarisation transverse waves only Malus\'s law I = I₀cos²θ',
        'Snell\'s law n₁sinθ₁ = n₂sinθ₂', 'refractive index n = c/v',
        'total internal reflection sinθc = 1/n', 'optical fibre TIR',
        'stationary waves nodes antinodes node-to-node = λ/2',
        'coherent sources', 'Young\'s double-slit λ = ax/D',
        'diffraction grating d sinθ = nλ',
      ],
    },

    topic10_12_electricity: {
      code: '9702-T10-12',
      title: 'Electricity (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Electric current I = ΔQ/Δt; conventional current from + to −; charge Q = It; units: coulomb (C)',
        'Potential difference V = W/Q (energy per unit charge); units: V = J C⁻¹',
        'Resistance R = V/I; units: ohm (Ω)',
        'Ohm\'s law — V ∝ I at constant temperature; resistance constant; ohmic conductor',
        'Resistivity ρ = RA/L; units Ω m; factors: material (different ρ); length (R ∝ L); cross-sectional area (R ∝ 1/A); temperature',
        'I-V characteristics — ohmic resistor: straight line through origin; filament lamp: curve (R increases with T); semiconductor diode: conducts above ~0.6V forward; reverse biased → very small current; thermistor NTC: R decreases as T increases; LDR: R decreases as light intensity increases',
        'Drift velocity — I = nAve (n = number density of charge carriers per m³; A = cross-sectional area; v = mean drift velocity; e = charge of electron 1.6×10⁻¹⁹ C)',
        'Power P = IV = I²R = V²/R; energy E = Pt = VIt',
        'Series circuits — same current; voltages add; resistances add: R_total = R₁ + R₂ + ...',
        'Parallel circuits — same voltage; currents add; 1/R_total = 1/R₁ + 1/R₂ + ...',
        'Potential divider — Vout = R₂/(R₁+R₂) × Vin; applications: light sensor with LDR; temperature sensor with thermistor',
        'EMF and internal resistance — EMF ε = terminal pd + lost volts = V + Ir = I(R+r); terminal pd V = ε − Ir; V-I graph: y-intercept = ε; gradient magnitude = r; maximum power transferred when R = r',
        'Kirchhoff\'s current law (KCL) — sum of currents into junction = sum leaving (charge conservation)',
        'Kirchhoff\'s voltage law (KVL) — sum of EMFs = sum of pd drops around any closed loop (energy conservation)',
      ],
      forbiddenTopics: [
        'Capacitors — Topic 20 A Level', 'Magnetic forces on charges — Topic 21 A Level',
        'Electromagnetic induction — Topic 22 A Level',
      ],
      requiredKeywords: [
        'current I = ΔQ/Δt', 'potential difference V = W/Q', 'resistance R = V/I',
        'Ohm\'s law constant temperature', 'resistivity ρ = RA/L',
        'I-V characteristics ohmic lamp diode',
        'drift velocity I = nAve', 'power P = IV = I²R = V²/R',
        'series R add', 'parallel 1/R add', 'potential divider Vout = R₂/(R₁+R₂) × Vin',
        'EMF internal resistance V = ε − Ir', 'KCL KVL',
      ],
      practicalNotes: [
        'Paper 3: I-V characteristics using variable resistor or potential divider supply; plotting graphs; measuring EMF and internal resistance from V vs I graph',
      ],
    },

    topic13: {
      code: '9702-T13',
      title: 'Quantum Physics (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Photoelectric effect — photons needed; threshold frequency f₀ below which no emission regardless of intensity; work function φ = hf₀; Einstein equation: hf = φ + Ek(max); stopping potential V₀: eV₀ = Ek(max) = hf − φ; intensity → number of photons (not energy per photon); evidence for photon model: instantaneous emission; threshold frequency; stopping potential independent of intensity',
        'Photons — E = hf = hc/λ; Planck\'s constant h = 6.63 × 10⁻³⁴ J s; photon has zero rest mass; travels at c',
        'Energy levels in atoms — electrons in discrete energy levels; ground state = lowest energy; excitation = electron absorbs photon → higher energy level; emission: electron falls → photon emitted; E = hf = ΔE between levels',
        'Line emission spectra — each element has unique set of discrete energy levels; each transition → specific wavelength photon; explains discrete lines in spectrum; evidence for quantised energy levels',
        'Line absorption spectra — white light through cool gas; photons of specific λ absorbed; dark lines at same wavelengths as emission lines; electrons excited then re-emit in random directions → less intensity in original direction',
        'de Broglie wavelength — λ = h/p = h/mv; matter waves; electron diffraction as evidence (electrons passing through crystal lattice produce diffraction pattern → wave behaviour); wave-particle duality applies to all matter',
      ],
      forbiddenTopics: [
        'Heisenberg uncertainty principle — not in 9702',
        'Schrödinger equation — not in 9702', 'Quantum tunnelling — not in 9702',
      ],
      requiredKeywords: [
        'photoelectric effect threshold frequency', 'work function φ = hf₀',
        'Einstein equation hf = φ + Ek(max)', 'stopping potential eV₀ = Ek(max)',
        'intensity → number of photons', 'instantaneous emission evidence',
        'photon E = hf = hc/λ', 'Planck\'s constant h',
        'energy levels discrete', 'excitation emission E = hf = ΔE',
        'line emission spectra unique to element', 'line absorption dark lines',
        'de Broglie wavelength λ = h/mv', 'electron diffraction wave-particle duality',
      ],
    },

    topic14: {
      code: '9702-T14',
      title: 'Nuclear Physics (AS Level)',
      asLevel: true,
      paperRef: 'Paper 1 MCQ + Paper 2 AS Structured',
      allowedTopics: [
        'Atomic structure — nucleus (protons + neutrons); electrons in shells; atomic number Z; mass number A; nuclide notation A/Z X',
        'Isotopes — same Z different A; same chemical properties; used in medicine, dating, industry',
        'Radioactive decay — alpha α: ⁴₂He nucleus; +2 charge; range few cm air; stopped by paper; highly ionising; deflected by E and B fields; decay equation conserves A and Z; beta-minus β⁻: electron from nucleus; −1 charge; range ~1 m air; stopped by few mm Al; moderately ionising; deflected; antineutrino emitted; beta-plus β⁺: positron; +1 charge; antineutrino replaced by neutrino; gamma γ: EM radiation; no charge; no mass; stopped by thick lead; least ionising; not deflected; often accompanies α or β decay',
        'Writing nuclear decay equations — conservation of mass number A and proton number Z',
        'Radioactive decay law — random and spontaneous; N = N₀e^(−λt); activity A = λN = A₀e^(−λt); decay constant λ (s⁻¹); half-life t½ = ln2/λ = 0.693/λ; activity: becquerel (Bq = 1 decay per second)',
        'Uses of radioisotopes — medical tracer (short t½; gamma or beta emitter; e.g. ⁹⁹ᵐTc for organ imaging); radiotherapy (gamma kills cancer cells); radiocarbon dating (¹⁴C t½ = 5730 yr; organic material); industrial: thickness gauging; smoke detectors (²⁴¹Am, alpha); sterilisation of medical equipment',
        'Safety with radiation — inverse square law for gamma (I ∝ 1/r²); distance; shielding; time; dosimetry; background radiation sources (radon, cosmic, medical, food, nuclear)',
        'Mass-energy equivalence — E = mc²; c = 3.00 × 10⁸ m s⁻¹; mass defect Δm; binding energy = Δmc²; binding energy per nucleon vs mass number A: peak at Fe-56 (most stable); lighter nuclei: fusion releases energy; heavier nuclei: fission releases energy',
        'Nuclear fission — heavy nucleus + slow neutron → two smaller nuclei + 2-3 neutrons + energy; chain reaction (critical mass); reactor components: fuel rods (enriched ²³⁵U); moderator (graphite or water; slows neutrons to thermal speeds); control rods (absorb neutrons; boron or cadmium; regulate power); coolant (removes heat; water or CO₂); shielding (concrete)',
        'Nuclear fusion — light nuclei combine → heavier nucleus + energy; conditions: very high temperature (~10⁸ K) and pressure; plasma containment (tokamak: magnetic confinement; JET, ITER); energy released per nucleon greater than fission; challenges: achieving conditions for sustained reaction',
      ],
      requiredKeywords: [
        'atomic number Z mass number A', 'isotopes same Z different A',
        'alpha β⁻ β⁺ gamma properties charge range ionisation',
        'conservation of A and Z decay equations',
        'N = N₀e^(−λt)', 'activity A = λN', 'half-life t½ = 0.693/λ',
        'becquerel Bq', 'radiocarbon dating ¹⁴C',
        'E = mc²', 'mass defect binding energy', 'binding energy per nucleon Fe-56 peak',
        'fission chain reaction moderator control rods coolant shielding',
        'fusion tokamak plasma magnetic confinement',
      ],
    },

    topic15to26_alevel: {
      code: '9702-T15-26',
      title: 'A Level Physics Topics 15-26',
      asLevel: false,
      paperRef: 'Paper 4 A Level Structured',
      allowedTopics: [
        // Topic 15 — Circular Motion
        'Angular velocity ω = v/r = 2πf = 2π/T; units rad s⁻¹',
        'Centripetal acceleration a = v²/r = ω²r; always directed toward centre of circle',
        'Centripetal force F = mv²/r = mω²r; this IS the resultant force directed toward centre; not an additional force; provided by: tension (string), gravity (orbit), normal reaction (banked road), friction (car on flat curve)',
        'Vertical circular motion — at top: F_net = mg + N = mv²/r; minimum speed at top when N = 0: v_min = √(gr); at bottom: N − mg = mv²/r',

        // Topic 16 — Gravitational Fields
        'Newton\'s law of gravitation F = Gm₁m₂/r²; G = 6.67 × 10⁻¹¹ N m² kg⁻²; inverse square law',
        'Gravitational field strength g = F/m = GM/r²; radial field around spherical mass; uniform field near surface; field lines radially inward',
        'Gravitational potential φ = −GM/r; negative; zero at infinity; work done per unit mass to bring mass from infinity; equipotentials perpendicular to field lines',
        'Gravitational PE = mφ = −GMm/r; change in PE = mΔφ',
        'g = −dφ/dr (field strength = −potential gradient)',
        'Orbital mechanics — GMm/r² = mv²/r → v = √(GM/r); T = 2πr/v; Kepler\'s third law T² ∝ r³: T² = 4π²r³/GM',
        'Geostationary orbit — T = 24 h; equatorial; same direction as Earth\'s rotation; r ≈ 42,000 km; appears stationary; used for communications, weather',
        'Escape velocity — ½mv² = GMm/r → v_esc = √(2GM/r)',

        // Topic 17 — Temperature and Ideal Gases
        'Temperature scales — Celsius and Kelvin: T(K) = θ(°C) + 273; absolute zero = 0 K; no negative temperatures on Kelvin scale',
        'Internal energy — sum of random KE and PE of all molecules; ideal gas: only KE (no intermolecular PE); internal energy proportional to T',
        'Gas laws — Boyle\'s: pV = constant (constant T); Charles\': V/T = constant (constant p); Pressure law: p/T = constant (constant V)',
        'Ideal gas equation — pV = nRT (R = 8.31 J mol⁻¹ K⁻¹; n = moles) OR pV = NkT (k = 1.38 × 10⁻²³ J K⁻¹; N = number of molecules)',
        'Kinetic theory — pressure p = Nm<c²>/3V; assumptions: many identical point particles; random motion; elastic collisions; no forces except during collision; collision time negligible vs time between collisions',
        'Mean KE per molecule = ½m<c²> = 3kT/2; rms speed c_rms = √(3kT/m) = √(3RT/Mᵣ)',

        // Topic 18 — Oscillations
        'SHM — defining condition: a = −ω²x (acceleration proportional to displacement; directed toward equilibrium); restoring force; ω = 2πf',
        'SHM equations — x = A cos(ωt) or A sin(ωt); v = ±ω√(A²−x²); v_max = ωA (at x = 0); a = −ω²x; a_max = ω²A (at x = ±A)',
        'Period formulae — pendulum: T = 2π√(l/g); spring-mass: T = 2π√(m/k)',
        'Energy in SHM — Ek = ½mω²(A²−x²); Ep = ½mω²x²; E_total = ½mω²A² = constant; exchange between KE and PE; max KE at equilibrium; max PE at amplitude',
        'Damping — light: exponentially decreasing amplitude; critical: shortest time to equilibrium without oscillating; overdamped: slow return without oscillating; effect on resonance: increased damping reduces peak amplitude and broadens resonance curve',
        'Resonance — natural frequency f₀; forced oscillations at driving frequency f; maximum amplitude when f = f₀; phase difference increases from 0 to π through resonance',

        // Topic 19 — Electric Fields
        'Coulomb\'s law F = kq₁q₂/r² = q₁q₂/4πε₀r²; k ≈ 9 × 10⁹ N m² C⁻²; ε₀ = 8.85 × 10⁻¹² F m⁻¹; inverse square law; can attract or repel',
        'Electric field strength E = F/q; for point charge E = kQ/r²; for uniform field E = V/d',
        'Electric potential V = kQ/r = Q/4πε₀r; zero at infinity; work done per unit positive charge from infinity',
        'Work done W = qΔV; E = −dV/dr (field = −potential gradient); equipotentials perpendicular to field lines',
        'Comparison gravity vs electric — both inverse square; gravity always attractive; electric: attractive or repulsive; gravity: replace Gm with kq',

        // Topic 20 — Capacitance
        'Capacitance C = Q/V; unit farad (F); parallel plate capacitor C = ε₀εᵣA/d',
        'Energy stored E = ½CV² = ½QV = Q²/2C; area under Q-V graph',
        'Capacitors in parallel: C_total = C₁ + C₂ + ... (same voltage; charges add)',
        'Capacitors in series: 1/C_total = 1/C₁ + 1/C₂ + ... (charges same; voltages add)',
        'Charging/discharging through resistor — Q = Q₀e^(−t/RC); V = V₀e^(−t/RC); I = I₀e^(−t/RC); time constant τ = RC (time for charge to fall to 37% = 1/e of initial value); when t = RC, charge = Q₀/e; plotting ln Q vs t gives gradient = −1/RC',

        // Topic 21 — Magnetic Fields
        'Magnetic flux density B; unit: tesla (T); force on current-carrying conductor F = BIl sinθ (l = length in field; θ = angle between current and B); F = 0 when current parallel to B; Fleming\'s left-hand rule',
        'Force on moving charge F = BQv sinθ; direction by Fleming\'s left-hand rule; for v perpendicular to B: F = BQv → circular motion (radius r = mv/BQ; useful for mass spectrometry)',
        'Hall voltage — V_H = BI/ntq (n = charge carrier density; t = thickness; q = carrier charge); used to measure B; polarity indicates carrier sign',
        'Magnetic flux Φ = BA cosθ (B perpendicular to area A); unit weber (Wb)',
        'Electromagnetic induction — Faraday\'s law: induced EMF ε = −dΦ/dt; Lenz\'s law: induced current opposes change in flux that causes it (energy conservation)',
        'Alternating current — V = V₀ sin(ωt); I = I₀ sin(ωt); peak voltage V₀ and rms voltage: V_rms = V₀/√2; I_rms = I₀/√2; P = I_rms V_rms = I_rms²R = V_rms²/R',
        'Transformer — n_p/n_s = V_p/V_s = I_s/I_p (ideal transformer); V_pI_p = V_sI_s (power conservation); used for power transmission (step up voltage → reduce current → reduce I²R losses)',

        // Topic 22 — Further Electronics (if applicable)
        'Rectification — half-wave (one diode); full-wave (bridge rectifier with 4 diodes); smoothing with capacitor (reduces ripple voltage; large C → less ripple)',

        // Topic 23 — Quantum and Nuclear
        'X-rays — produced when fast electrons decelerate in metal target; bremsstrahlung (continuous spectrum); characteristic radiation (specific wavelengths from inner shell electron transitions); applications: medical imaging; crystallography (Bragg diffraction: 2d sinθ = nλ; d = plane spacing)',
        'Wave-particle duality — electrons diffracted by crystals; photons have momentum p = h/λ; de Broglie wavelength λ = h/mv; applies to all particles',
        'Electron energy levels in atoms — Bohr model (circular orbits; quantised angular momentum; energy levels En = −13.6/n² eV for hydrogen); transitions → photon emission or absorption',
        'Nuclear stability — N-Z plot; stable nuclei near N = Z for light elements; N > Z for heavy elements; unstable: α decay (large N and Z); β⁻ (excess neutrons; neutron → proton + β⁻ + antineutrino); β⁺ (excess protons)',
        'Radioactive decay series — successive decays until stable nucleus reached',

        // Topic 24 — Medical Imaging
        'X-ray imaging — attenuation I = I₀e^(−µx) (µ = attenuation coefficient; x = thickness); contrast agents; CT scanner; limitations: 2D; ionising radiation',
        'Ultrasound — non-ionising; pulsed; reflection at tissue boundaries; A-scan (distance); B-scan (2D image); impedance Z = ρc; fraction reflected: (Z₁−Z₂)²/(Z₁+Z₂)²; coupling gel (matches impedance of probe to skin)',
        'MRI — magnetic field aligns proton spins; radiofrequency pulse → resonance; relaxation → RF signal detected; excellent soft tissue contrast; non-ionising; cannot use with metal implants',
        'PET scan — positron emission tomography; β⁺ emitter injected; positron annihilates with electron → two γ photons (511 keV each, opposite directions); coincidence detection; used for metabolic activity imaging',

        // Topic 25 — Communications
        'AM (amplitude modulation) — carrier signal amplitude varies with information signal; bandwidth = 2 × max audio frequency; susceptible to noise',
        'FM (frequency modulation) — carrier frequency varies with information; larger bandwidth than AM; less susceptible to noise; better quality audio',
        'Digital vs analogue — digital: discrete binary signal; noise rejection (regenerative repeaters); easier processing; bandwidth issues; analogue: continuous; susceptible to noise; ADC and DAC conversion',
        'Sampling — Nyquist theorem: sampling frequency ≥ 2 × maximum signal frequency; bit depth determines number of amplitude levels; bit rate = sampling frequency × bit depth',
        'Attenuation — signal power loss; measured in dB: attenuation = 10 log(P₁/P₂) dB; amplifiers needed at intervals; repeaters regenerate digital signal',
        'Optical fibres — total internal reflection; bandwidth; low attenuation; no interference; monomode vs multimode',

        // Topic 26 — Astronomy and Cosmology
        'Luminosity L — total power radiated (W); Stefan-Boltzmann law: L = 4πr²σT⁴ (r = star radius; σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴; T = surface temperature)',
        'Flux density F = L/4πd² (W m⁻²; d = distance); observed from Earth',
        'Stellar spectra — Wien\'s displacement law: λ_max T = 2.90 × 10⁻³ m K; blue stars hotter; red stars cooler',
        'Hubble\'s law — v = H₀d; H₀ ≈ 70 km s⁻¹ Mpc⁻¹; recession velocity proportional to distance; evidence for expanding universe',
        'Redshift — z = Δλ/λ ≈ v/c (for v << c); cosmological redshift; Hubble\'s law evidence',
        'Big Bang — universe from single hot dense state; evidence: CMB (2.7 K blackbody; Penzias and Wilson 1965); Hubble\'s law; relative abundances H and He; age of universe t ≈ 1/H₀ ≈ 14 billion years',
        'Olbers\' paradox — if infinite, eternal, uniform universe: sky should be uniformly bright; it is dark → universe has finite age and is expanding',
        'Stellar evolution — nebula → protostar (gravitational contraction; T increases) → main sequence (H fusion; radiation pressure balances gravity; HR diagram); end depends on mass: low/medium → red giant → planetary nebula → white dwarf; massive → red supergiant → supernova → neutron star or black hole',
        'HR diagram — luminosity (y) vs surface temperature (x, decreasing right); main sequence (diagonal band); red giants (top right); white dwarfs (bottom left); supergiants (top)',
      ],
      forbiddenTopics: [
        'AS physics content — Topics 1-14 assumed knowledge; do not repeat',
        'Quantum field theory — not in 9702', 'General relativity — not in 9702',
      ],
      requiredKeywords: [
        'centripetal force F = mv²/r toward centre', 'ω = v/r = 2πf',
        'gravitational field g = GM/r²', 'gravitational potential φ = −GM/r',
        'Kepler\'s third law T² ∝ r³', 'escape velocity √(2GM/r)',
        'pV = nRT', 'pV = NkT', 'kinetic theory p = Nm<c²>/3V',
        'mean KE = 3kT/2', 'a = −ω²x SHM', 'T = 2π√(l/g) T = 2π√(m/k)',
        'damping resonance', 'Coulomb\'s law F = kq₁q₂/r²',
        'electric potential V = kQ/r', 'capacitance C = Q/V',
        'τ = RC time constant', 'Q = Q₀e^(−t/RC)',
        'F = BIl sinθ Fleming\'s left-hand', 'F = BQv circular motion r = mv/BQ',
        'Faraday\'s law ε = −dΦ/dt', 'Lenz\'s law',
        'V_rms = V₀/√2', 'transformer n_p/n_s = V_p/V_s',
        'L = 4πr²σT⁴', 'Wien\'s law λ_max T = 2.90 × 10⁻³',
        'Hubble\'s law v = H₀d', 'redshift z = Δλ/λ',
        'Big Bang CMB evidence', 'main sequence HR diagram',
      ],
    },

    physics_paper3: {
      code: '9702-P3',
      title: 'Advanced Practical Skills Paper 3 (AS Level)',
      asLevel: true,
      paperRef: 'Paper 3 — 2 hours, 40 marks',
      allowedTopics: [
        'Measurement skills — using vernier calipers (±0.1 mm); micrometer screw gauge (±0.01 mm); metre rule (±1 mm); stopwatch (±0.1 s or ±0.01 s); multimeter; signal generator; oscilloscope; thermometer; balance',
        'Uncertainty calculations — absolute uncertainty from instrument precision; percentage uncertainty = absolute/reading × 100%; combining in calculations: add absolute for + and −; add % for × and ÷; multiply % by power',
        'Repeat readings — using mean to reduce random error; identifying and excluding anomalous values with justification; standard deviation concept',
        'Core practicals — measuring g by free-fall; Young modulus of wire; spring constant; verifying Newton\'s second law; refractive index of glass block; I-V characteristics; wavelength of light (double-slit or diffraction grating); resistance and resistivity; EMF and internal resistance; half-life of simulated decay',
        'Graph skills — axes: quantity + unit; scale covering >50% of grid; plotting all points with error bars if required; drawing best-fit straight line; gradient from large triangle (using >50% of the line); y-intercept; identifying and excluding anomalous points; drawing lines of maximum and minimum gradient to estimate gradient uncertainty',
        'Linearising — rearranging physics equations to form y = mx + c to identify what to plot; e.g. for v² = u² + 2as: plot v² (y) vs s (x); gradient = 2a; for T² = 4π²l/g: plot T² vs l; gradient = 4π²/g; for I = I₀e^(−µx): plot ln I vs x; gradient = −µ',
        'Evaluation — identifying specific sources of systematic error (not generic "human error"); suggesting specific improvements; assessing whether result agrees with theory (within uncertainty); stating whether hypothesis is supported',
      ],
      requiredKeywords: [
        'absolute uncertainty', 'percentage uncertainty', 'combining uncertainties',
        'anomalous result exclude with justification',
        'gradient large triangle', 'best-fit line', 'y-intercept',
        'linearising y = mx + c', 'plot T² vs l gradient = 4π²/g',
        'systematic error specific', 'random error repeats',
        'specific improvement not generic',
      ],
      boundaryNotes: [
        'UAE: Paper 3 often replaced by Alternate Paper (written) using supplied experimental data.',
        'Uncertainty analysis is the most heavily tested skill — know how to calculate, combine and interpret uncertainties in every context.',
      ],
    },

    physics_paper5: {
      code: '9702-P5',
      title: 'Planning, Analysis and Evaluation Paper 5 (A Level)',
      asLevel: false,
      paperRef: 'Paper 5 — 1 hr 15 min, 30 marks',
      allowedTopics: [
        'Planning — identifying IV, DV, CVs; detailed step-by-step method; specific equipment with specifications; range and number of readings; describing how to control each CV; expected relationship; how to determine constant from graph',
        'Safety — specific hazards in physics experiments: high voltage (electric shock); strong magnets (pacemakers); UV/laser (eye damage); hot surfaces; radioactive sources (minimise time; maximise distance; use tongs); context-specific not generic',
        'Analysis — processing raw data; correct sig figs and units; plotting linearised graph; gradient from large triangle; y-intercept; determining physical constants from gradient/intercept; evaluating whether result agrees with accepted value within uncertainty',
        'Linearising — given relationship: identify how to linearise; what to plot on each axis; what gradient and intercept represent; e.g. E = E₀e^(−λt): plot ln E vs t; gradient = −λ; y-intercept = ln E₀',
        'Uncertainty in A Level — uncertainty in gradient from comparing best-fit with steepest/least steep line possible; percentage uncertainty in gradient; absolute uncertainty in determined constant; stating result as value ± uncertainty',
        'Evaluation — identifying dominant source of error; specific improvements; whether conclusion is valid; limitations (small number of readings; range too narrow; confounding variable not controlled)',
      ],
      requiredKeywords: [
        'linearise relationship', 'gradient represents constant', 'y-intercept meaning',
        'uncertainty in gradient from steepest least steep lines',
        'percentage uncertainty in determined constant',
        'specific hazard specific control measure',
        'dominant source of error', 'specific improvement',
        'result ± uncertainty', 'within percentage uncertainty agrees',
      ],
      boundaryNotes: [
        'Paper 5 = 11.5% of A Level; contexts often from A Level topics (gravity, oscillations, waves, electricity) but may be novel.',
        'Expressing result with correct uncertainty is frequently examined; value ± absolute uncertainty with correct units and sig figs.',
      ],
    },
  },

  // ================================================================
  // CIE A LEVEL MATHEMATICS 9709
  // Components: P1, P2, P3, Mechanics 1 (M1), Statistics 1 (S1), S2
  // Valid for 2026-2027 examinations (v4 syllabus Dec 2025)
  // ================================================================
  mathematics: {

    p1: {
      code: '9709-P1',
      title: 'Pure Mathematics 1',
      asLevel: true,
      paperRef: 'Paper 1 — 75 min, 75 marks',
      allowedTopics: [
        'Quadratics — completing the square ax² + bx + c → a(x+p)² + q; vertex; discriminant b²−4ac (>0 two real distinct roots; =0 repeated root; <0 no real roots); solving; quadratic inequalities; graphs',
        'Functions — domain and range; composite function fg(x); inverse f⁻¹(x) (exists only for one-to-one functions; graph reflection in y=x); odd and even functions; modulus function |x|; graph of y = |f(x)|',
        'Coordinate geometry — gradient m = (y₂−y₁)/(x₂−x₁); y − y₁ = m(x − x₁); perpendicular lines m₁m₂ = −1; midpoint; distance; circle equation (x−a)² + (y−b)² = r²; condition for line to intersect/be tangent to/not meet circle; tangent perpendicular to radius',
        'Circular measure — radian measure; conversion: π rad = 180°; arc length s = rθ; sector area A = ½r²θ; segment area = sector − triangle',
        'Trigonometry — identities: sin²θ + cos²θ ≡ 1; tan θ ≡ sin θ/cos θ; 1 + tan²θ ≡ sec²θ; 1 + cot²θ ≡ cosec²θ; graphs of sin, cos, tan, cosec, sec, cot; solving equations in given intervals; amplitude and period of transformations',
        'Binomial expansion — (a + b)ⁿ for positive integer n; Pascal\'s triangle or ⁿCr = n!/r!(n−r)!; finding specific terms; approximations',
        'Series — arithmetic progressions: a, a+d, a+2d,...; nth term aₙ = a + (n−1)d; sum Sₙ = n/2(2a + (n−1)d) = n/2(a + l); geometric progressions: a, ar, ar²,...; nth term = arⁿ⁻¹; sum Sₙ = a(1−rⁿ)/(1−r); sum to infinity S∞ = a/(1−r) for |r| < 1; convergent condition; sigma notation',
        'Differentiation — d/dx(xⁿ) = nxⁿ⁻¹; d/dx(eˣ) = eˣ; d/dx(ln x) = 1/x; d/dx(sin x) = cos x; d/dx(cos x) = −sin x; d/dx(tan x) = sec²x; chain rule dy/dx = (dy/du)(du/dx); product rule d/dx(uv) = u(dv/dx) + v(du/dx); quotient rule; stationary points; increasing/decreasing; second derivative test; application to kinematics',
        'Integration — ∫xⁿ dx = xⁿ⁺¹/(n+1) + c (n ≠ −1); ∫eˣ dx = eˣ + c; ∫1/x dx = ln|x| + c; ∫sin x dx = −cos x + c; ∫cos x dx = sin x + c; integration by substitution; definite integrals; area under curve; area between two curves; volume of revolution V = π∫y² dx about x-axis',
      ],
      forbiddenTopics: [
        'Partial fractions — P2/P3', 'Implicit differentiation — P3',
        'Integration by parts — P3', 'Complex numbers — Further Maths',
        'Differential equations — P3', 'Vectors in 3D — P3',
      ],
      requiredKeywords: [
        'completing the square', 'discriminant b²−4ac', 'composite function', 'inverse function',
        'circle equation (x−a)² + (y−b)² = r²', 'tangent perpendicular to radius',
        'radian', 'arc length s = rθ', 'sector area ½r²θ',
        'sin²θ + cos²θ = 1', 'sec²θ = 1 + tan²θ',
        'arithmetic progression sum Sₙ', 'geometric progression sum to infinity S∞ = a/(1−r)',
        'convergent |r| < 1', 'binomial expansion ⁿCr',
        'chain rule product rule quotient rule', 'stationary point',
        'integration by substitution', 'volume of revolution π∫y² dx',
      ],
    },

    p2: {
      code: '9709-P2',
      title: 'Pure Mathematics 2',
      asLevel: true,
      paperRef: 'Paper 2 — 75 min, 50 marks',
      allowedTopics: [
        'Algebra — division of polynomials (long division or inspection); factor theorem: f(a) = 0 ↔ (x−a) is a factor; remainder theorem: f(a) = remainder when divided by (x−a); factorising polynomials; partial fractions: distinct linear factors A/(x+a) + B/(x+b); repeated factor A/(x+a) + B/(x+a)²; improper fractions (long divide first)',
        'Logarithms and exponentials — laws of logarithms: log(xy) = log x + log y; log(x/y) = log x − log y; log xⁿ = n log x; change of base: logₐ b = log b/log a; natural logarithm ln x = logₑ x; solving equations of form aˣ = b; exponential growth and decay; linearising using logarithms: y = kxⁿ → log y = log k + n log x; y = kaˣ → log y = log k + x log a',
        'Trigonometry — addition formulae: sin(A±B) = sinA cosB ± cosA sinB; cos(A±B) = cosA cosB ∓ sinA sinB; tan(A±B) = (tanA ± tanB)/(1 ∓ tanA tanB); double angle: sin2A = 2sinA cosA; cos2A = cos²A − sin²A = 1 − 2sin²A = 2cos²A − 1; tan2A = 2tanA/(1−tan²A); expressing in form R sin(x+α) or R cos(x+α): R = √(a²+b²); tanα = b/a; solving equations; finding maximum/minimum; small angle approximations: sinθ ≈ θ; cosθ ≈ 1 − θ²/2; tanθ ≈ θ (θ in radians; valid for small θ)',
        'Differentiation — implicit differentiation: d/dx(y²) = 2y dy/dx; d/dx(y³) = 3y² dy/dx; parametric equations: x = f(t), y = g(t); dy/dx = (dy/dt)/(dx/dt); second derivatives implicitly and parametrically',
        'Integration — integration of 1/(ax+b); integration by parts ∫u dv/dx dx = uv − ∫v du/dx dx; LATE rule (Logarithm, Algebraic, Trigonometric, Exponential); using partial fractions in integration; forming and solving first-order differential equations by separating variables; ∫f(y) dy = ∫g(x) dx; general and particular solutions',
        'Numerical methods — locating roots by sign change f(a) < 0 < f(b); iterative methods xₙ₊₁ = g(xₙ); convergence when |g\'(x)| < 1 near root; staircase and cobweb diagrams; understanding convergence and divergence',
      ],
      forbiddenTopics: [
        'P1 content assumed — do not repeat', 'Vectors — P3', 'Complex numbers — Further Maths',
        'Maclaurin series — Further Maths', 'Second-order differential equations — Further Maths',
      ],
      requiredKeywords: [
        'factor theorem remainder theorem', 'partial fractions distinct repeated',
        'laws of logarithms', 'change of base', 'linearising log y vs log x',
        'addition formulae sin cos tan', 'double angle formulae',
        'R sin(x+α) R = √(a²+b²)', 'small angle approximation',
        'implicit differentiation', 'parametric dy/dx = (dy/dt)/(dx/dt)',
        'integration by parts LATE rule', 'separating variables general particular solution',
        'sign change root location', 'iteration convergence |g\'(x)| < 1',
      ],
    },

    p3: {
      code: '9709-P3',
      title: 'Pure Mathematics 3',
      asLevel: false,
      paperRef: 'Paper 3 — 75 min, 75 marks',
      allowedTopics: [
        'Further algebra — proof by contradiction (e.g. √2 is irrational); binomial expansion of (1+x)ⁿ for rational n: 1 + nx + n(n-1)/2! x² + ... valid for |x| < 1; (a+bx)ⁿ = aⁿ(1 + bx/a)ⁿ; finding valid range',
        'Further integration — volumes of revolution V = π∫x² dy (about y-axis); integration using partial fractions; integration involving arctan and arcsin: ∫1/(a²+x²) dx = (1/a)arctan(x/a) + c; ∫1/√(a²−x²) dx = arcsin(x/a) + c; reduction formulae (Iₙ = ... Iₙ₋₂ type)',
        'Complex numbers — z = a + bi; i² = −1; Argand diagram; modulus |z| = √(a²+b²); argument arg(z) = arctan(b/a) in correct quadrant; modulus-argument form z = r(cosθ + i sinθ) = re^(iθ); complex conjugate z* = a − bi; roots of polynomials with real coefficients occur in conjugate pairs; operations: +, −, ×, ÷; finding powers using de Moivre\'s theorem (r^n)(cosnθ + i sinnθ); loci: |z − a| = r (circle); arg(z − a) = θ (half-line); |z − a| = |z − b| (perpendicular bisector)',
        'Vectors — 2D and 3D; column vector and ijk notation; magnitude; unit vector; scalar (dot) product a·b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b|cosθ; angle between vectors; perpendicularity condition a·b = 0; vector equation of line r = a + tb; intersection of two lines; skew lines; angle between lines; distance from point to line; equation of plane n·r = n·a (n = normal); angle between line and plane; angle between two planes; distance from point to plane',
        'Differential equations — forming from context (growth, decay, cooling); first-order linear by integrating factor (if required); separating variables; exponential growth/decay: dN/dt = kN → N = Ae^(kt); particular solution from initial conditions; interpreting solutions in context',
      ],
      forbiddenTopics: [
        'P1 and P2 assumed — do not repeat', 'Cross product of vectors — Further Maths',
        'Second-order DEs — Further Maths', 'Maclaurin/Taylor series — Further Maths',
      ],
      requiredKeywords: [
        'binomial expansion rational n valid for |x| < 1',
        '∫1/(a²+x²) = (1/a)arctan(x/a)', '∫1/√(a²−x²) = arcsin(x/a)',
        'complex number z = a + bi', 'modulus |z| argument arg(z)',
        'Argand diagram', 'conjugate pairs real coefficients',
        'de Moivre rⁿ(cosnθ + i sinnθ)', 'loci |z−a| = r circle',
        'dot product a·b = |a||b|cosθ', 'vector equation line r = a + tb',
        'normal to plane n·r = n·a', 'skew lines', 'distance point to line',
      ],
    },

    mechanics1: {
      code: '9709-M1',
      title: 'Mechanics 1',
      asLevel: true,
      paperRef: 'Paper 4 Mechanics 1 — 75 min, 50 marks',
      allowedTopics: [
        'Forces and equilibrium — forces as vectors; resolving horizontally and vertically; triangle of forces; Lami\'s theorem (three concurrent coplanar forces in equilibrium: F₁/sin α₁ = F₂/sin α₂ = F₃/sin α₃; where α = angle opposite to force); friction F = µR at limiting equilibrium; smooth surfaces',
        'Kinematics in 1D — SUVAT equations; displacement-time; velocity-time; acceleration-time graphs; non-uniform motion using calculus: v = ds/dt; a = dv/dt; integrating to find displacement',
        'Momentum — p = mv; conservation in closed system; impulse J = Δp = FΔt',
        'Newton\'s laws — F = ma; connected particles: particles connected by string (over smooth peg/pulley; on incline; Atwood machine); tension in string; normal reaction; friction',
        'Energy, work and power — W = Fd cosθ; KE = ½mv²; GPE = mgh; conservation; work-energy theorem; power P = Fv; efficiency',
        'Projectiles — horizontal: constant velocity; vertical: constant acceleration g; independence of components; range; maximum height; time of flight; velocity at any point; angle of projection for maximum range',
      ],
      forbiddenTopics: [
        'Moments for rigid bodies in detail — M2', 'Centres of mass — M2',
        'Elastic strings — M2', 'Newton\'s law of restitution — M2',
      ],
      requiredKeywords: [
        'resolving forces', 'Lami\'s theorem', 'friction F = µR',
        'SUVAT', 'v = ds/dt a = dv/dt', 'conservation of momentum', 'impulse J = Δp',
        'connected particles Atwood', 'tension normal reaction',
        'work-energy theorem', 'power P = Fv',
        'projectile horizontal vertical independent',
      ],
    },

    statistics1: {
      code: '9709-S1',
      title: 'Statistics 1',
      asLevel: true,
      paperRef: 'Paper 5 Statistics 1 — 75 min, 50 marks',
      allowedTopics: [
        'Representation of data — stem-and-leaf; box-and-whisker plots (min, Q1, median, Q3, max; outliers beyond Q1 − 1.5×IQR or Q3 + 1.5×IQR); histogram (frequency density = frequency / class width; y-axis must be frequency density for unequal class widths); cumulative frequency curves; choosing appropriate display',
        'Measures of location — mean (ungrouped: Σx/n; grouped: Σfx/Σf using midpoints); median (middle value or from cumulative frequency); mode; effect of coding y = (x−a)/b on mean and variance: ȳ = (x̄−a)/b; σy² = σx²/b²',
        'Measures of spread — range; IQR = Q3 − Q1; variance σ² = Σ(x−x̄)²/n = Σx²/n − (x̄)²; standard deviation σ = √variance; for grouped data: Σf(x−x̄)²/Σf',
        'Probability — events, outcomes, sample space; P(A) ∈ [0,1]; P(A∪B) = P(A) + P(B) − P(A∩B); mutually exclusive: P(A∩B) = 0; independent: P(A∩B) = P(A)×P(B); conditional: P(A|B) = P(A∩B)/P(B); Venn diagrams; tree diagrams',
        'Discrete random variables — probability distribution table ΣP = 1; E(X) = Σ xP(X=x); E(X²) = Σ x²P(X=x); Var(X) = E(X²) − [E(X)]²; E(aX+b) = aE(X)+b; Var(aX+b) = a²Var(X)',
        'Permutations and combinations — ⁿPr = n!/(n−r)!; ⁿCr = n!/r!(n−r)!; arranging objects with repetition; circular arrangements; selecting from groups',
        'Binomial distribution — X~B(n,p); conditions: fixed n independent trials; constant p; binary outcome; P(X=r) = ⁿCr pʳ(1−p)ⁿ⁻ʳ; mean E(X) = np; variance Var(X) = np(1−p)',
        'Geometric distribution — first success model; X = number of trials until first success; P(X=r) = (1−p)^(r-1)p; E(X) = 1/p; Var(X) = (1−p)/p²',
        'Normal distribution — X~N(µ,σ²); symmetric bell curve; standardising Z = (X−µ)/σ; P(Z < z) from tables; finding probabilities; inverse normal (finding x from probability); finding µ or σ from given probability',
        'Normal approximation to binomial — conditions: n large; p close to 0.5; X~B(n,p) ≈ Y~N(np, np(1−p)); continuity correction: P(X ≤ a) → P(Y ≤ a+0.5); P(X ≥ a) → P(Y ≥ a−0.5)',
      ],
      forbiddenTopics: [
        'Poisson distribution — S2', 'Continuous random variables — S2',
        'Hypothesis testing — S2', 'Central limit theorem — S2',
      ],
      requiredKeywords: [
        'frequency density = frequency/class width', 'IQR outliers',
        'variance σ² = Σx²/n − (x̄)²', 'coding effect on mean and variance',
        'conditional probability P(A|B)', 'independent events P(A∩B) = P(A)P(B)',
        'E(X) Var(X) discrete random variable',
        'permutations ⁿPr', 'combinations ⁿCr',
        'binomial B(n,p) conditions', 'mean np variance np(1−p)',
        'geometric distribution E(X) = 1/p',
        'normal N(µ,σ²) standardising Z', 'continuity correction',
      ],
    },

    statistics2: {
      code: '9709-S2',
      title: 'Statistics 2',
      asLevel: false,
      paperRef: 'Paper 6 Statistics 2 — 75 min, 50 marks',
      allowedTopics: [
        'Poisson distribution — X~Po(λ); P(X=r) = e^(−λ)λʳ/r!; mean = variance = λ; conditions: events random, independent, constant average rate; additive property: X₁~Po(λ₁) + X₂~Po(λ₂) independent → X₁+X₂~Po(λ₁+λ₂); approximation by Poisson: B(n,p) ≈ Po(np) when n large (>50), p small (<0.1), np < 10',
        'Continuous random variables — probability density function f(x): P(a≤X≤b) = ∫f(x)dx; conditions f(x) ≥ 0 and ∫all f(x)dx = 1; cumulative distribution function F(x) = P(X≤x) = ∫_{-∞}^x f(t)dt; F\'(x) = f(x); E(X) = ∫xf(x)dx; Var(X) = E(X²) − [E(X)]²; mode (max of f(x)); median (F(median) = 0.5)',
        'Uniform distribution — X~U(a,b): f(x) = 1/(b−a) for a≤x≤b; E(X) = (a+b)/2; Var(X) = (b−a)²/12',
        'Normal approximation to Poisson — if λ large (>15): Po(λ) ≈ N(λ, λ); continuity correction applies',
        'Sampling and hypothesis testing — population vs sample; sampling distribution of sample mean X̄; E(X̄) = µ; Var(X̄) = σ²/n; central limit theorem: for large n X̄ approximately N(µ, σ²/n); standard error SE = σ/√n',
        'Hypothesis testing framework — H₀ (null hypothesis; assumed true); H₁ (alternative; one-tailed or two-tailed); significance level α; test statistic; critical region; p-value; conclusion in context; Type I error (reject H₀ when true; P(Type I) = α); Type II error (fail to reject H₀ when false); power = 1 − P(Type II)',
        'Tests — testing µ with known σ: Z = (x̄ − µ₀)/(σ/√n) ~ N(0,1); testing µ with unknown σ (large n): use sample s; testing proportion: B(n,p) directly; testing Poisson mean: find P(X ≥ observed) or P(X ≤ observed)',
      ],
      forbiddenTopics: [
        'S1 content assumed — do not repeat', 'Two-sample tests — not in 9709',
        'Chi-squared test — not in 9709 S2', 'ANOVA — not in syllabus',
      ],
      requiredKeywords: [
        'Poisson Po(λ)', 'conditions for Poisson random independent constant rate',
        'mean = variance = λ', 'additive property Poisson',
        'B(n,p) ≈ Po(np) when n large p small',
        'probability density function f(x)', 'CDF F(x)', 'mode max f(x)', 'median F = 0.5',
        'uniform U(a,b) E(X) = (a+b)/2', 'central limit theorem',
        'standard error σ/√n', 'null hypothesis alternative hypothesis',
        'significance level', 'Type I error = α', 'Type II error', 'power = 1 − P(Type II)',
        'Z = (x̄ − µ₀)/(σ/√n)', 'conclusion in context',
      ],
    },
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Build a system prompt for note generation for a given CIE A Level topic.
 * Call this fresh on every note generation call — never cache the prompt string.
 */
export function buildCIESystemPrompt(
  subject: string,
  topicKey: string
): string {
  const topic = CIE_ALEVEL_SYLLABUS[subject]?.[topicKey];

  if (!topic) {
    throw new Error(`No syllabus data found for ${subject} > ${topicKey}`);
  }

  const timestamp = new Date().toISOString();
  const seed = Math.floor(10000000 + Math.random() * 90000000).toString();
  const levelLabel = topic.asLevel ? 'AS Level' : 'A Level (A2)';

  return `You are a world-class Cambridge International ${subject.toUpperCase()} examiner and subject expert.
Your task is to generate high-fidelity revision notes for: ${topic.code} — ${topic.title} (${levelLabel}).

GENERATION TIMESTAMP: ${timestamp}
GENERATION SEED: ${seed}

═══════════════════════════════════════════════
STRICT CONTENT RULES — READ BEFORE WRITING
═══════════════════════════════════════════════

1. ONLY generate content explicitly listed in ALLOWED TOPICS below.
2. NEVER mention, explain, or reference anything in FORBIDDEN TOPICS — act as if those concepts do not exist for this unit.
3. REQUIRED KEYWORDS must appear naturally in your explanations where relevant.
4. Do NOT write an overview or introduction paragraph — go straight to definitions and content.
5. Every formula, definition, and example must trace directly to the ALLOWED TOPICS list.

═══════════════════════════════════════════════
ALLOWED TOPICS (STRICT SCOPE):
═══════════════════════════════════════════════
${topic.allowedTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

═══════════════════════════════════════════════
FORBIDDEN TOPICS (DO NOT MENTION):
═══════════════════════════════════════════════
${topic.forbiddenTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

═══════════════════════════════════════════════
REQUIRED KEYWORDS (integrate naturally):
═══════════════════════════════════════════════
${topic.requiredKeywords.join(', ')}

${topic.boundaryNotes && topic.boundaryNotes.length > 0
  ? `═══════════════════════════════════════════════
CRITICAL BOUNDARY NOTES:
═══════════════════════════════════════════════
${topic.boundaryNotes.join('\n')}`
  : ''}

${topic.practicalNotes && topic.practicalNotes.length > 0
  ? `═══════════════════════════════════════════════
PRACTICAL EXAM NOTES (include in examiner tips):
═══════════════════════════════════════════════
${topic.practicalNotes.join('\n')}`
  : ''}

═══════════════════════════════════════════════
REQUIRED OUTPUT STRUCTURE:
═══════════════════════════════════════════════

1. EXAM-FOCUSED SUMMARY (80-120 words exactly)
   Write one dense paragraph covering: the central concept; the key formula or relationship to calculate;
   what is most commonly examined; one specific mark-scheme trap to avoid.
   Write in second person ("You need to know..."). No textbook waffle.

2. KEY DEFINITIONS (all bold terms with precise definitions as examiners expect them)

3. CORE CONTENT (all spec points with depth appropriate to mark allocations; include worked examples)

4. EQUATIONS AND FORMULAE (every formula with: units for each symbol; when to use; worked numerical substitution)

5. VISUAL SUMMARY (describe what a diagram or table would show; key relationships at a glance)

6. EXAMINER TIPS (5-7 specific tips based on common mark scheme errors and student mistakes)

7. FLASHCARDS (12 Q&A pairs in exam-style wording; cover definitions, calculations, and application)`;
}

/**
 * Build image generation prompt for a CIE A Level topic diagram.
 */
export function buildCIEImagePrompt(
  subject: string,
  topicKey: string,
  specificTopic: string
): string {
  const topic = CIE_ALEVEL_SYLLABUS[subject]?.[topicKey];
  if (!topic) return '';
  const subjLabel = subject.charAt(0).toUpperCase() + subject.slice(1);
  const levelLabel = topic.asLevel ? 'AS Level' : 'A2 Level';

  return `Create a clean educational scientific diagram for Cambridge International A Level ${subjLabel} (${levelLabel}) students.
White background. Textbook quality. No decorative borders. All labels with clear arrows.

Topic code: ${topic.code} — ${topic.title}
Diagram topic: ${specificTopic}

MUST show only content explicitly listed in the allowed topics for ${topic.code}.
MUST NOT show: content from other topics; decorative elements; any process or structure not in the allowed list.

Style: clean scientific textbook diagram; white background; clearly labelled with arrows and annotations;
educational quality. Every label must be scientifically accurate and specific.`;
}

/**
 * Validate generated notes against the syllabus boundary (keyword-based check).
 */
export function validateCIENotes(
  notes: string,
  subject: string,
  topicKey: string
): { passed: boolean; warnings: string[] } {
  const topic = CIE_ALEVEL_SYLLABUS[subject]?.[topicKey];
  if (!topic) return { passed: false, warnings: ['Topic not found in syllabus database'] };

  const notesLower = notes.toLowerCase();
  const warnings: string[] = [];

  for (const forbidden of topic.forbiddenTopics ?? []) {
    const technicalTerms = forbidden.match(/[A-Z][a-z]{5,}|[a-z]{8,}/g) || [];
    for (const term of technicalTerms) {
      if (term.length > 5 && notesLower.includes(term.toLowerCase())) {
        warnings.push(`Possible out-of-scope: "${term}" — from: ${forbidden.substring(0, 60)}...`);
        break;
      }
    }
  }

  return { passed: warnings.length === 0, warnings };
}

// ────────────────────────────────────────────────────────────
// Utility accessors
// ────────────────────────────────────────────────────────────

export function getCIESubjects(): string[] {
  return Object.keys(CIE_ALEVEL_SYLLABUS);
}

export function getCIETopics(subject: string): string[] {
  return Object.keys(CIE_ALEVEL_SYLLABUS[subject] || {});
}

export function getCIETopicData(subject: string, topicKey: string): CIETopicData | null {
  return CIE_ALEVEL_SYLLABUS[subject]?.[topicKey] || null;
}

export function getCIEASTopics(subject: string): string[] {
  const subjectData = CIE_ALEVEL_SYLLABUS[subject];
  if (!subjectData) return [];
  return Object.keys(subjectData).filter(k => subjectData[k].asLevel);
}

export function getCIEA2Topics(subject: string): string[] {
  const subjectData = CIE_ALEVEL_SYLLABUS[subject];
  if (!subjectData) return [];
  return Object.keys(subjectData).filter(k => !subjectData[k].asLevel);
}

export function generateCIECacheKey(subject: string, topicKey: string): string {
  return `notes_cie_alevel_${subject}_${topicKey}`;
}

export function buildCIEGenerationLog(
  subject: string,
  topicKey: string,
  trigger: 'initial' | 'cache_clear' | 'validation_retry',
  validationPassed: boolean,
  warnings: string[] = []
) {
  const topicData = getCIETopicData(subject, topicKey);
  return {
    qualification: 'cie_alevel',
    subject,
    topicKey,
    topicCode: topicData?.code || 'Unknown',
    topicTitle: topicData?.title || 'Unknown',
    asLevel: topicData?.asLevel ?? null,
    timestamp: new Date().toISOString(),
    seed: Math.floor(10000000 + Math.random() * 90000000).toString(),
    trigger,
    validationPassed,
    warnings,
  };
}