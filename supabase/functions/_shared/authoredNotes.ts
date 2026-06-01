// Expert-authored, specification-accurate content briefs, keyed by
//   board -> subject -> "unit{n}" -> exact topic name (matches src/lib/subjects.ts).
//
// The notes generator passes the matching brief to the model as the AUTHORITATIVE
// source: the model formats THIS into the note structure (overview bullets, worked
// examples, flashcards) instead of inventing content. That fixes three things at
// once — wrong topic / wrong level (the brief defines exact scope), accuracy (the
// facts are pre-checked), and speed (the model formats rather than "thinks up"
// content, so it finishes well inside the free-tier budget).
//
// Topics without a brief fall back to normal generation, so this can be filled in
// incrementally, board by board, without breaking anything.

type Briefs = Record<string, Record<string, Record<string, Record<string, string>>>>;

export const AUTHORED_NOTES: Briefs = {
  "edexcel-ial": {
    chemistry: {
      unit1: {
        "Formulae, Equations and Amount of Substance": `EDEXCEL IAL CHEMISTRY UNIT 1 (WCH11) — FORMULAE, EQUATIONS AND AMOUNT OF SUBSTANCE (AS). Mostly calculations.

THE MOLE
- One mole = 6.022×10²³ particles (Avogadro constant). Molar mass = relative formula mass in g mol⁻¹.
- moles n = mass / Mr ; moles in solution n = concentration (mol dm⁻³) × volume (dm³) ; moles of gas = volume / 24 000 cm³ at rtp (or use pV = nRT).
- Ideal gas equation pV = nRT (p in Pa, V in m³, T in K, R = 8.31 J K⁻¹ mol⁻¹).

FORMULAE & EQUATIONS
- Empirical formula = simplest whole-number ratio of atoms (from % composition or masses ÷ Ar, then simplest ratio). Molecular formula = (Mr ÷ empirical mass) × empirical formula.
- Balance symbol equations and write ionic equations (spectator ions cancelled) with state symbols.
- Water of crystallisation: find x in a hydrate from mass loss on heating.

TITRATION & YIELD CALCULATIONS
- Titration: moles = c×v for the known solution → mole ratio → unknown concentration. Use concordant titres (within 0.10 cm³).
- Percentage yield = (actual moles / theoretical moles) × 100. Atom economy = (Mr of desired product / Mr of all products) × 100.

WORKED-EXAMPLE MATERIAL
- Empirical→molecular formula; a back-titration; a gas-volume calculation with pV=nRT; % yield.

COMMON MISTAKES
- cm³ vs dm³ (÷1000); not balancing; wrong units for R/p/V; reading the mole ratio wrong.
REACTIONS: empty. GRAPHS: empty.`,

        "Atomic Structure and the Periodic Table": `EDEXCEL IAL CHEMISTRY UNIT 1 (WCH11) — ATOMIC STRUCTURE AND THE PERIODIC TABLE (AS).

SUB-ATOMIC PARTICLES & ISOTOPES
- Proton (rel mass 1, charge +1), neutron (1, 0), electron (1/1836, −1). Atomic number Z = protons; mass number A = protons + neutrons. Isotopes = same Z, different number of neutrons.
- Mass spectrometry: relative atomic mass = Σ(isotopic mass × % abundance) / 100. Read abundances off a mass spectrum.

ELECTRONIC CONFIGURATION
- Order of filling: 1s 2s 2p 3s 3p 4s 3d 4p … Sub-shells hold s=2, p=6, d=10 electrons; each orbital holds 2 (opposite spin — Pauli); fill singly before pairing (Hund); lowest energy first (Aufbau).
- Write configs e.g. 1s²2s²2p⁶3s²3p⁶4s²3d⁶ for Fe. Anomalies: Cr = [Ar]3d⁵4s¹ and Cu = [Ar]3d¹⁰4s¹ (extra stability of half-/fully-filled d).

IONISATION ENERGY
- 1st ionisation energy = energy to remove one mole of electrons from one mole of gaseous atoms: X(g) → X⁺(g) + e⁻.
- Factors: nuclear charge (↑ → ↑IE), atomic radius/distance (↑ → ↓IE), shielding (↑ → ↓IE).
- Trends: increases across a period, decreases down a group. Dips (e.g. Group 2→3 across period: electron now in higher-energy p sub-shell; Group 5→6: pairing repulsion in p) are EVIDENCE for sub-shells.
- Successive ionisation energies show big jumps between shells → evidence for electron shells and group number.

WORKED-EXAMPLE MATERIAL
- Calculate Ar from a mass spectrum; explain a specific IE trend/dip; deduce group from successive IEs.
COMMON MISTAKES
- Forgetting Cr/Cu anomalies; muddling the order of 4s/3d; vague IE explanations (must name nuclear charge, shielding, distance).
REACTIONS: empty. GRAPHS: empty.`,

        "Bonding and Structure": `EDEXCEL IAL CHEMISTRY UNIT 1 (WCH11) — BONDING AND STRUCTURE (AS).

BOND TYPES
- Ionic: electrostatic attraction between oppositely charged ions; giant ionic lattice; high mp, conducts when molten/aqueous, brittle.
- Covalent: shared pair of electrons; dative (coordinate) = both electrons from one atom. Bond strength from mean bond enthalpies.
- Metallic: lattice of positive ions in a sea of delocalised electrons; high mp, conducts, malleable.

ELECTRONEGATIVITY & POLARITY
- Electronegativity = ability of an atom to attract the bonding electrons. A difference → polar bond (δ+/δ−). A molecule is polar only if the bond dipoles do NOT cancel (depends on shape).

SHAPES (VSEPR)
- Electron pairs repel to be as far apart as possible; lone pairs repel more than bonding pairs (reduce bond angle by ~2.5° each).
- 2 pairs linear 180°; 3 trigonal planar 120°; 4 tetrahedral 109.5°; 3 bond +1 lone → pyramidal 107° (NH₃); 2 bond +2 lone → bent 104.5° (H₂O); 6 octahedral 90°.

STRUCTURES & PROPERTIES
- Giant covalent (diamond, graphite, SiO₂): very high mp; graphite conducts (delocalised e⁻) and is soft (layers). Simple molecular (I₂, CO₂): low mp (weak intermolecular forces), don't conduct.

WORKED-EXAMPLE MATERIAL
- Predict the shape + bond angle of a molecule and explain it; decide if a molecule is polar.
COMMON MISTAKES
- Forgetting lone-pair repulsion lowers the angle; saying simple molecular substances have weak covalent bonds (the COVALENT bonds are strong; the INTERMOLECULAR forces are weak).
REACTIONS: empty. GRAPHS: empty.`,

        "Introductory Organic Chemistry and Alkanes": `EDEXCEL IAL CHEMISTRY UNIT 1 (WCH11) — INTRODUCTORY ORGANIC CHEMISTRY AND ALKANES (AS).

NOMENCLATURE & ISOMERISM
- Name by longest chain (stem) + functional group (suffix) + substituents (prefixes, lowest locants). Know homologous series and general formulae (alkanes CₙH₂ₙ₊₂).
- Structural isomerism: chain, position, and functional-group isomers (same molecular formula, different structure).
- Use displayed, structural and skeletal formulae.

ALKANES
- Saturated hydrocarbons; non-polar; only London forces → bp rises with chain length, falls with branching.
- Complete combustion → CO₂ + H₂O; incomplete → CO (toxic) / C (soot). Pollutants: CO, NOₓ, SO₂, unburnt hydrocarbons; catalytic converters.
- FREE-RADICAL SUBSTITUTION with Cl₂ and UV light: Initiation Cl₂ → 2Cl• (UV, homolytic). Propagation: Cl• + CH₄ → •CH₃ + HCl; •CH₃ + Cl₂ → CH₃Cl + Cl•. Termination: two radicals combine (e.g. Cl• + •CH₃ → CH₃Cl). Gives a mixture / further substitution.
- Crude oil: fractional distillation (separates by bp); cracking (long → short + alkene) — thermal/catalytic.

WORKED-EXAMPLE MATERIAL
- Write the full free-radical mechanism for chlorination of methane (label each step); name/draw isomers.
COMMON MISTAKES
- Heterolytic instead of homolytic; missing the half-arrows/radical dots; forgetting UV; only writing one propagation step.
REACTIONS: include combustion + the radical substitution steps. GRAPHS: empty.`,

        "Alkenes": `EDEXCEL IAL CHEMISTRY UNIT 1 (WCH11) — ALKENES (AS).

THE C=C DOUBLE BOND
- Made of a σ bond and a π bond (sideways p-orbital overlap); the π bond restricts rotation → E/Z (cis–trans) isomerism. Assign E/Z by Cahn–Ingold–Prelog priority (higher atomic number = higher priority).
- C=C is a region of high electron density → attacked by electrophiles.

ELECTROPHILIC ADDITION (mechanism)
- With HBr: the δ+ end of HBr is attacked by the π electrons → carbocation + Br⁻ → Br⁻ adds. MARKOVNIKOV: H adds to give the more stable carbocation (tertiary > secondary > primary), so the major product has Br on the more substituted carbon.
- With Br₂: bromine is polarised by the π bond → addition (and is the TEST for C=C: orange bromine water is DECOLOURISED). With H₂O/H₃PO₄ → alcohol; with H₂/Ni → alkane.

POLYMERISATION
- Addition polymerisation: many monomers → one long chain; draw the repeat unit (open the double bond, n outside brackets). Polymers are unreactive → disposal/recycling issues.

WORKED-EXAMPLE MATERIAL
- Full electrophilic-addition mechanism for HBr + propene (show curly arrows + the carbocation), explaining Markovnikov; draw a repeat unit.
COMMON MISTAKES
- Wrong carbocation stability order; arrows from H not from the C=C/H–Br bond; forgetting bromine water is the unsaturation test.
REACTIONS: include addition of Br₂/HBr/H₂O/H₂ + the bromine-water test. GRAPHS: empty.`,
      },

      unit2: {
        "Energetics": `EDEXCEL IAL CHEMISTRY UNIT 2 (WCH12) — ENERGETICS (AS).

ENTHALPY BASICS
- Enthalpy change ΔH = heat change at constant pressure. Exothermic ΔH < 0 (heat out); endothermic ΔH > 0. Standard conditions: 298 K, 100 kPa, 1 mol dm⁻³.
- Definitions: ΔHf (formation, from elements), ΔHc (combustion, complete), ΔH neutralisation, ΔH reaction — all "per mole", standard states.

CALORIMETRY
- q = mcΔT (m = mass of solution, c = 4.18 J g⁻¹ K⁻¹). Then ΔH = −q / moles (sign from temp change). Main error = heat loss to surroundings (improve: lid, insulation, extrapolation).

HESS'S LAW
- The enthalpy change is independent of route. Build a cycle: ΔHr from ΔHf values = ΣΔHf(products) − ΣΔHf(reactants); from ΔHc values = ΣΔHc(reactants) − ΣΔHc(products).

BOND ENTHALPIES
- ΔH ≈ Σ(bonds broken) − Σ(bonds made). Uses MEAN bond enthalpies, so it differs from the true value (bond strength varies with environment; only valid for gases).

WORKED-EXAMPLE MATERIAL
- Calculate ΔH from calorimetry data; a Hess-cycle calculation; estimate ΔH from bond enthalpies.
COMMON MISTAKES
- Wrong sign; forgetting "per mole"; using mass of solute instead of solution; mixing up the Hess directions for ΔHf vs ΔHc.
REACTIONS: empty. GRAPHS: empty.`,

        "Intermolecular Forces": `EDEXCEL IAL CHEMISTRY UNIT 2 (WCH12) — INTERMOLECULAR FORCES (AS).

THE THREE FORCES (weakest → strongest, roughly)
- London (dispersion) forces: temporary/induced dipoles; present in ALL molecules; stronger with more electrons (larger Mr) → higher boiling point.
- Permanent dipole–dipole: between polar molecules.
- Hydrogen bonding: strongest; occurs when H is bonded to N, O or F (small, very electronegative) and another N/O/F lone pair is nearby.

CONSEQUENCES
- Boiling-point trends down Groups 4–7 hydrides increase (more electrons → stronger London), BUT NH₃, H₂O and HF are anomalously high due to hydrogen bonding.
- Water's anomalies from H-bonding: high bp, high surface tension, and ICE is LESS DENSE than water (open hydrogen-bonded lattice) so it floats.
- More/stronger intermolecular forces → higher bp/mp; like dissolves like (polar/H-bonding solutes dissolve in water).

WORKED-EXAMPLE MATERIAL
- Explain a boiling-point trend or anomaly by naming the intermolecular force; draw a hydrogen bond (show lone pair + δ charges + the H⋯O alignment).
COMMON MISTAKES
- Calling London forces "weak covalent bonds"; saying H-bonding occurs with any H; not specifying N/O/F.
REACTIONS: empty. GRAPHS: empty.`,

        "Redox Chemistry and Groups 1, 2 and 7": `EDEXCEL IAL CHEMISTRY UNIT 2 (WCH12) — REDOX AND GROUPS 1, 2 AND 7 (AS).

REDOX
- Oxidation = electron loss / oxidation number increase; reduction = gain / decrease (OIL RIG). Assign oxidation numbers by the rules; oxidising agent is itself reduced. Write half-equations and combine.

GROUP 2 (alkaline earth metals)
- Reactivity INCREASES down the group (ionisation energy falls). React with water → hydroxide + H₂ (more vigorous down).
- Solubility of hydroxides INCREASES down; solubility of sulfates DECREASES down (BaSO₄ insoluble → used in the sulfate test, and barium meals). Thermal stability of carbonates/nitrates increases down. Flame tests: Ca brick-red, Sr crimson, Ba pale green.

GROUP 7 (halogens)
- Down the group: boiling point increases (more London forces), electronegativity decreases, OXIDISING power decreases.
- Displacement: a more reactive halogen displaces a less reactive halide (e.g. Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂).
- Halide tests: add AgNO₃(aq) → AgCl WHITE (dissolves in dilute NH₃), AgBr CREAM (dissolves in conc NH₃), AgI YELLOW (insoluble in NH₃).
- Halides + conc H₂SO₄: NaCl → HCl; NaBr → HBr then Br₂ + SO₂ (H₂SO₄ reduced); NaI → HI then I₂ + H₂S (most reducing).
- Chlorine + water → HCl + HOCl (disproportionation, bleach); + cold NaOH → bleach (NaClO).

WORKED-EXAMPLE MATERIAL
- Identify an unknown halide from AgNO₃ + NH₃; explain the trend in oxidising power; balance a redox/disproportionation equation.
COMMON MISTAKES
- Sulfate vs hydroxide solubility trends swapped; AgBr/AgI colours; forgetting NH₃ solubility step.
REACTIONS: include displacement, halide + AgNO₃/NH₃, chlorine + water/NaOH. GRAPHS: empty.`,

        "Introduction to Kinetics and Equilibria": `EDEXCEL IAL CHEMISTRY UNIT 2 (WCH12) — INTRODUCTION TO KINETICS AND EQUILIBRIA (AS). (This is the AS/qualitative version — collision theory & Le Chatelier. The A2 rate-equation/Kc material is Unit 4.)

KINETICS (qualitative)
- Collision theory: particles must collide with energy ≥ activation energy (Ea) AND correct orientation to react.
- Maxwell–Boltzmann distribution: curve of molecular energies; area under curve = total molecules; only the fraction beyond Ea can react. Increasing TEMPERATURE shifts the curve right/lower-peak → many more molecules exceed Ea → faster.
- Rate factors: higher concentration/pressure → more frequent collisions; larger surface area → more collisions; CATALYST → alternative pathway with lower Ea (more molecules exceed it).

EQUILIBRIA (qualitative)
- Dynamic equilibrium (closed system): forward and backward rates equal, concentrations constant.
- Le Chatelier: a system opposes a change. ↑concentration of a reactant → shifts right. ↑pressure → shifts to the side with fewer gas moles. ↑temperature → shifts in the ENDOTHERMIC direction. A catalyst does NOT shift the position (speeds both equally).
- Industrial compromise: Haber (N₂+3H₂⇌2NH₃, exothermic) uses ~450 °C and ~200 atm + Fe catalyst (compromise between rate and yield); Contact process similar.

WORKED-EXAMPLE MATERIAL
- Use a Maxwell–Boltzmann sketch (in words) to explain why temperature/catalyst speed a reaction; apply Le Chatelier to predict a shift and explain industrial conditions.
COMMON MISTAKES
- Saying a catalyst shifts equilibrium; saying temperature changes collision frequency a lot (it mainly changes the energy distribution); forgetting "correct orientation".
REACTIONS: empty. GRAPHS: removed — describe the Maxwell–Boltzmann curve in words.`,

        "Halogenoalkanes, Alcohols and Spectra": `EDEXCEL IAL CHEMISTRY UNIT 2 (WCH12) — HALOGENOALKANES, ALCOHOLS AND SPECTRA (AS).

HALOGENOALKANES
- Nucleophilic substitution: with warm NaOH(aq) → alcohol; with KCN/ethanol → nitrile (+1 carbon); with excess NH₃ → amine.
- Elimination: with KOH in ethanol, reflux → alkene.
- Hydrolysis rate depends on C–X BOND ENTHALPY: C–I weakest → fastest; C–F strongest → slowest (compare by warming with AgNO₃/ethanol — fastest ppt for iodo).
- CFCs deplete the ozone layer (release Cl• radicals).

ALCOHOLS
- Classify primary/secondary/tertiary. Combust; react with Na → alkoxide + H₂.
- Oxidation with acidified K₂Cr₂O₇ (orange→green): primary → aldehyde (distil) → carboxylic acid (reflux); secondary → ketone; tertiary NOT oxidised.
- Dehydration (conc H₂SO₄ / Al₂O₃, heat) → alkene; esterification (carboxylic acid + conc H₂SO₄) → ester.

SPECTROSCOPY
- Mass spectrum: the molecular ion peak M⁺ at the highest m/z gives the Mr; fragmentation gives structure clues (loss of 15 = CH₃, 29 = CHO/C₂H₅, 17 = OH).
- INFRARED: identify functional groups from absorptions — O–H (alcohol) broad 3200–3550; O–H (acid) very broad 2500–3300; C=O 1680–1750; C–H ~2850–3100; N–H 3300–3500. The fingerprint region (<1500 cm⁻¹) identifies a specific molecule.

WORKED-EXAMPLE MATERIAL
- Use M⁺ and a fragment to deduce a structure; identify a functional group from an IR absorption; write a substitution/elimination product.
COMMON MISTAKES
- Distil vs reflux for aldehyde vs acid; saying tertiary alcohols oxidise; reading the wrong IR band; using base peak instead of M⁺ for Mr.
REACTIONS: include substitution/elimination + alcohol oxidation. GRAPHS: empty.`,
      },

      unit3: {
        "Practical techniques (Units 1 & 2)": `EDEXCEL IAL CHEMISTRY UNIT 3 (WCH13) — PRACTICAL TECHNIQUES (AS practical skills paper). This unit assesses HOW experiments from Units 1 & 2 are carried out — write it as concise, exam-ready technique points.

TITRATION
- Rinse burette with the solution it will hold, pipette with the solution it will measure. Use a white tile + swirl; add dropwise near the end-point; read the bottom of the meniscus at eye level. Repeat for CONCORDANT titres (within 0.10 cm³) and mean only those. Indicators: methyl orange or phenolphthalein.
- Making a standard solution: weigh accurately by difference, dissolve, transfer with washings to a volumetric flask, make up to the mark, invert to mix.

HEATING & SEPARATION
- Reflux: heat without losing volatile contents (vertical condenser) — for slow organic reactions. Distillation: separate/collect a product by boiling point. Filtration (gravity/Büchner) and recrystallisation to purify a solid; solvent extraction with a separating funnel.

MEASUREMENTS
- Calorimetry: measure temperature change of a known mass of solution; insulate and use a lid to reduce heat loss. Collect gases over water or with a gas syringe.

KEY APPARATUS CHOICE
- Choose apparatus with appropriate resolution (e.g. burette ±0.05 cm³ per reading, balance ±0.005 g) and quantities that give a measurable, safe change.

WORKED-EXAMPLE MATERIAL
- Describe the steps of an accurate titration / making a standard solution; justify reflux vs distillation for a given reaction.
COMMON MISTAKES
- Not rinsing glassware correctly; averaging non-concordant titres; meniscus read at the wrong level.
REACTIONS: empty. GRAPHS: empty.`,

        "Data analysis, uncertainties and evaluation": `EDEXCEL IAL CHEMISTRY UNIT 3 (WCH13) — DATA ANALYSIS, UNCERTAINTIES AND EVALUATION (AS practical).

SIGNIFICANT FIGURES & RECORDING
- Record raw data to the resolution of the instrument and quote a calculated answer to the same number of sig figs as the LEAST precise reading.

UNCERTAINTIES
- % uncertainty of a single reading = (uncertainty ÷ reading) × 100. For an instrument read twice (e.g. burette initial + final), the absolute uncertainty doubles.
- Combine % uncertainties by ADDING them for quantities that are multiplied/divided. To reduce % uncertainty, use larger measured quantities (e.g. a bigger titre, a larger temperature change, a larger mass).

ACCURACY, PRECISION, ERRORS
- Accuracy = closeness to the true value; precision = closeness of repeats. Systematic errors shift all results one way (e.g. uncalibrated balance) — repeats don't help; random errors scatter results — reduce by repeating and averaging.
- Identify anomalies and exclude them from a mean (with justification).

EVALUATION
- Suggest realistic improvements that reduce the LARGEST source of error; comment on reliability (repeatability) vs accuracy.

WORKED-EXAMPLE MATERIAL
- Calculate the % uncertainty of a titration / calorimetry result and identify the biggest contributor; suggest a targeted improvement.
COMMON MISTAKES
- Forgetting the ×2 for two burette readings; confusing accuracy and precision; vague "be more careful" improvements.
REACTIONS: empty. GRAPHS: empty.`,

        "Tests for ions, gases and organic functional groups": `EDEXCEL IAL CHEMISTRY UNIT 3 (WCH13) — QUALITATIVE TESTS (AS practical). Learn reagent → observation → conclusion for each.

CATIONS
- Flame tests: Li red, Na yellow, K lilac, Ca brick-red, Sr crimson, Ba pale green, Cu blue-green.
- NaOH(aq): forms metal hydroxide precipitates (and NH₄⁺ + NaOH, warmed → NH₃ gas turns damp red litmus blue).

ANIONS
- Carbonate: add dilute acid → effervescence; bubble gas through limewater → milky (CO₂).
- Sulfate: add dilute HCl then BaCl₂ → WHITE precipitate (BaSO₄).
- Halides: add dilute HNO₃ then AgNO₃ → AgCl white, AgBr cream, AgI yellow; confirm with NH₃ (AgCl dissolves in dilute, AgBr in conc, AgI insoluble).

GASES
- H₂: lit splint → squeaky pop. O₂: relights a glowing splint. CO₂: limewater turns milky. NH₃: damp red litmus turns blue (alkaline). Cl₂: damp blue litmus bleached/turns red then white.

ORGANIC FUNCTIONAL GROUPS
- C=C alkene: bromine water decolourises (orange → colourless). Carbonyl: 2,4-DNPH → orange/yellow ppt. Aldehyde: Tollens' → silver mirror; Fehling's → brick-red ppt. Carboxylic acid: add Na₂CO₃ → CO₂ effervescence. Alcohol/–OH: add PCl₅ → steamy HCl fumes; primary/secondary oxidise with acidified K₂Cr₂O₇ (orange→green).

WORKED-EXAMPLE MATERIAL
- Devise a sequence of tests to identify an unknown ion/compound, each as reagent → observation → conclusion.
COMMON MISTAKES
- Forgetting to acidify before AgNO₃/BaCl₂ (removes interfering ions); wrong precipitate colours; not stating both observation AND conclusion.
REACTIONS: include the key test reactions/observations. GRAPHS: empty.`,
      },

      unit4: {
        "Kinetics": `EDEXCEL IAL CHEMISTRY UNIT 4 (WCH14) — KINETICS (A2 level). This is ADVANCED kinetics: rate equations, orders and the Arrhenius equation. Do NOT cover collision theory, Maxwell–Boltzmann or Le Chatelier here — those are AS Unit 2.

RATE EQUATION
- Rate = k[A]^m[B]^n, where m = order with respect to A, n = order with respect to B; overall order = m + n.
- Order can only be found EXPERIMENTALLY (never from the stoichiometric equation).
- The rate constant k is constant at a fixed temperature and increases with temperature.
- Units of k depend on the overall order: 0th → mol dm⁻³ s⁻¹; 1st → s⁻¹; 2nd → mol⁻¹ dm³ s⁻¹; 3rd → mol⁻² dm⁶ s⁻¹. (Derive by rearranging k = rate / [conc terms].)

FINDING ORDERS — INITIAL RATES METHOD
- Run several experiments varying one reactant concentration at a time; compare how initial rate changes.
- Double [A], rate unchanged → 0 order; rate doubles → 1st order; rate ×4 → 2nd order.

FINDING ORDERS — GRAPHS
- Concentration–time graph: a constant HALF-LIFE (t½) means FIRST order. For first order t½ = ln2 / k = 0.693 / k.
- Rate–concentration graph: horizontal line = 0 order; straight line through the origin = 1st order; upward curve = 2nd order.

RATE-DETERMINING STEP (RDS) & MECHANISM
- The RDS is the slowest step; the rate equation only contains species involved in or before the RDS.
- Orders give the number of each species in the mechanism up to and including the RDS; use this to test whether a proposed multi-step mechanism is consistent with the rate equation.

ARRHENIUS EQUATION
- k = A·e^(−Ea/RT); A = pre-exponential (frequency/orientation) factor.
- Logarithmic form: ln k = ln A − Ea/RT. Plot ln k (y) against 1/T (x): gradient = −Ea/R, y-intercept = ln A. Hence Ea = −gradient × R.

EXPERIMENTAL METHODS TO FOLLOW A REACTION
- Continuous monitoring: gas volume collected, mass loss, colorimetry (colour change), pH/conductivity, or sampling + quenching then titration.
- Clock reactions: time to a fixed visible change (e.g. iodine clock); initial rate ∝ 1/time.

WORKED-EXAMPLE MATERIAL (for the model to turn into full worked examples)
- Given an initial-rates table, deduce orders, write the rate equation, then calculate k WITH UNITS.
- Given a ln k vs 1/T graph with a gradient, calculate Ea in kJ mol⁻¹ (Ea = −gradient × 8.31, ÷1000).

COMMON EXAM MISTAKES
- Reading order off the chemical equation. Forgetting the units of k. Confusing rate–conc and conc–time graphs. Quoting Ea in J not kJ.

REACTIONS: none specific — leave the reactions array empty.
GRAPHS: include a rate–concentration graph (0, 1st, 2nd order lines) and/or a first-order concentration–time decay showing constant half-life.`,

        "Entropy and Energetics": `EDEXCEL IAL CHEMISTRY UNIT 4 (WCH14) — ENTROPY AND ENERGETICS (A2). Two linked strands: (1) Born–Haber / lattice energy, (2) entropy and Gibbs free energy. LEAD with the entropy/feasibility calculations — they are the most-tested and most students get them wrong.

ENTROPY (S)
- Entropy = a measure of disorder / number of ways energy and particles can be arranged (microstates); units J K⁻¹ mol⁻¹.
- Predict sign of ΔS: more gas moles → +ΔS; solid/liquid → gas → +ΔS; dissolving a solid → usually +ΔS; fewer gas moles → −ΔS.
- ΔS_system = ΣS(products) − ΣS(reactants).
- ΔS_surroundings = −ΔH / T  (T in K; ΔH in J mol⁻¹ — watch units).
- ΔS_total = ΔS_system + ΔS_surroundings. A reaction is SPONTANEOUS (feasible) when ΔS_total > 0 (second law).

GIBBS FREE ENERGY (G)
- ΔG = ΔH − TΔS_system. Reaction feasible when ΔG ≤ 0 (equivalently ΔS_total ≥ 0).
- Temperature at which a reaction just becomes feasible: set ΔG = 0 → T = ΔH / ΔS_system.
- Link to equilibrium: ΔG = −RT ln K — a large positive K means a very negative ΔG.
- Thermodynamic feasibility ≠ fast: a feasible reaction (ΔG < 0) may be infinitely slow (kinetic stability, high Ea).

BORN–HABER CYCLE (lattice energy)
- Lattice energy ΔH_latt = enthalpy change forming 1 mol of solid ionic lattice from gaseous ions (exothermic, negative).
- Terms in the cycle (define each): enthalpy of formation ΔH_f; enthalpy of atomisation ΔH_at (per mole of gaseous atoms); 1st (and 2nd) ionisation energy; 1st (and 2nd) electron affinity (1st EA exothermic, 2nd EA endothermic).
- Apply Hess's law around the cycle to find an unknown term (usually ΔH_latt or ΔH_f).
- Theoretical (ionic-model) vs experimental (Born–Haber) lattice energy: a bigger discrepancy indicates more COVALENT character (polarisation of the anion by a small, highly charged cation — Fajans' rules).

ENTHALPY OF SOLUTION & HYDRATION
- ΔH_solution = −ΔH_latt + ΣΔH_hydration. Enthalpy of hydration = enthalpy when 1 mol gaseous ions dissolves in water; more exothermic for smaller, more highly charged ions.

WORKED-EXAMPLE MATERIAL
- Calculate ΔS_total for a reaction given S values and ΔH, then state whether it is feasible.
- Find the temperature at which a reaction becomes feasible (T = ΔH/ΔS).
- Complete a Born–Haber cycle to find lattice energy.

COMMON MISTAKES
- Using ΔH in kJ but T in K without converting (ΔS_surroundings = −ΔH/T needs ΔH in J). Sign errors on electron affinity / lattice energy. Confusing ΔS_system with ΔS_total.

REACTIONS: none specific — empty array.
GRAPHS: optional — a ΔG vs T line (showing the feasibility changeover where ΔG crosses zero) is useful.`,

        "Chemical Equilibria": `EDEXCEL IAL CHEMISTRY UNIT 4 (WCH14) — CHEMICAL EQUILIBRIA (A2). Focus on Kc and Kp, not just qualitative Le Chatelier.

EQUILIBRIUM CONSTANTS
- Kc = product of [products] over [reactants], each raised to its stoichiometric coefficient (aqueous/all species in mol dm⁻³). Work out the units of Kc each time from the expression.
- Kp = same but using partial pressures of gases. Partial pressure p(X) = mole fraction × total pressure. Units of Kp from the expression.
- Pure solids and pure liquids are omitted from Kc/Kp.

CALCULATIONS
- Use an ICE table (Initial, Change, Equilibrium) to find equilibrium amounts, then concentrations or mole fractions, then K.
- Given K and some equilibrium quantities, calculate an unknown concentration/partial pressure.

EFFECT OF CONDITIONS ON K
- K depends ONLY on temperature. Changing concentration or pressure shifts the position but does NOT change K. A catalyst does not change K.
- Temperature: for an exothermic forward reaction, increasing T decreases K (shifts back); for endothermic, increasing T increases K.

WORKED-EXAMPLE MATERIAL
- Build a Kc expression with correct units; ICE-table calculation of Kc; Kp from partial pressures.

COMMON MISTAKES
- Forgetting units; including solids/liquids; thinking concentration/pressure changes alter K.

REACTIONS: empty unless a specific equilibrium is named.
GRAPHS: optional.`,

        "Acid-base Equilibria": `EDEXCEL IAL CHEMISTRY UNIT 4 (WCH14) — ACID–BASE EQUILIBRIA (A2). Quantitative pH work — this is mostly calculations.

DEFINITIONS
- Brønsted–Lowry acid = proton (H⁺) donor; base = proton acceptor. Conjugate acid–base pairs differ by one H⁺.
- Strong acid/base = fully dissociated; weak acid/base = only partially dissociated (an equilibrium).

pH, Kw
- pH = −log₁₀[H⁺]; [H⁺] = 10^(−pH). Always quote pH to 2 d.p.
- Ionic product of water Kw = [H⁺][OH⁻] = 1.0×10⁻¹⁴ at 298 K (Kw increases with temperature → neutral water pH < 7 when hot, but still neutral).
- pH + pOH = 14 at 298 K.

STRONG ACIDS/BASES
- Strong monoprotic acid: [H⁺] = concentration → pH directly.
- Strong base: [OH⁻] = concentration; [H⁺] = Kw/[OH⁻] → pH.

WEAK ACIDS
- Ka = [H⁺][A⁻]/[HA]; pKa = −log Ka (smaller pKa = stronger acid).
- Approximation for a weak acid: [H⁺] = √(Ka × [HA]); valid when dissociation is small and [H⁺] from water is negligible.

BUFFERS
- A buffer resists pH change on adding small amounts of acid/base. Made from a weak acid + its conjugate base (e.g. CH₃COOH/CH₃COO⁻) or a weak base + its conjugate acid.
- pH = pKa + log([A⁻]/[HA]) (Henderson–Hasselbalch). Added H⁺ is removed by A⁻; added OH⁻ is removed by HA.

TITRATION CURVES & INDICATORS
- Recognise the four curve shapes: strong–strong, strong acid–weak base, weak acid–strong base, weak–weak (no sharp vertical).
- Equivalence point pH: 7 (strong–strong), >7 (weak acid–strong base), <7 (strong acid–weak base).
- A buffer region appears before the equivalence point in weak-acid/weak-base titrations; half-neutralisation point: pH = pKa.
- Choose an indicator whose pKin (colour-change range) lies within the steep vertical section: methyl orange (3.1–4.4), phenolphthalein (8.3–10).

WORKED-EXAMPLE MATERIAL
- pH of a strong acid/base; pH of a weak acid from Ka; pH of a buffer; pH change when acid/base added to a buffer.

COMMON MISTAKES
- Treating a weak acid like a strong one ([H⁺] = conc). Forgetting Kw for bases. Wrong indicator. Mixing up Ka and pKa direction.

REACTIONS: empty. GRAPHS: removed — describe titration-curve shapes in words.`,

        "Organic Chemistry: Carbonyls, Carboxylic Acids and Chirality": `EDEXCEL IAL CHEMISTRY UNIT 4 (WCH14) — CARBONYLS, CARBOXYLIC ACIDS AND CHIRALITY (A2).

ALDEHYDES vs KETONES (C=O)
- Aldehydes are oxidised to carboxylic acids; ketones are NOT oxidised — this distinguishes them.
- Oxidising/test reagents: acidified K₂Cr₂O₇ (orange → green with aldehyde); Tollens' reagent [Ag(NH₃)₂]⁺ → SILVER MIRROR with aldehyde; Fehling's/Benedict's → brick-RED ppt (Cu₂O) with aldehyde.
- Reduction: NaBH₄ reduces aldehyde → primary alcohol, ketone → secondary alcohol.

NUCLEOPHILIC ADDITION
- HCN / KCN + H⁺ adds across C=O to give a hydroxynitrile (2-hydroxynitrile). Mechanism: :CN⁻ attacks the δ+ carbonyl carbon → alkoxide → protonation. A new chiral centre forms → product is a RACEMATE (attack equally likely on both faces of the planar carbonyl).

CARBONYL TESTS
- 2,4-DNPH (Brady's reagent): orange/yellow crystalline ppt confirms a carbonyl (aldehyde OR ketone); the melting point of the purified derivative identifies the specific carbonyl.
- Iodoform (triiodomethane) test: I₂ + NaOH gives a pale-yellow ppt of CHI₃ with compounds containing CH₃C(=O)– or CH₃CH(OH)– groups.

CARBOXYLIC ACIDS (–COOH)
- Weak acids: react with reactive metals (→ H₂), with carbonates/hydrogencarbonates (→ CO₂, effervescence — distinguishes acids from phenols, which do NOT react with carbonates), and with bases (→ salt + water).
- Esterification: carboxylic acid + alcohol, conc H₂SO₄ catalyst → ester + water (reversible).
- Reduction: LiAlH₄ in dry ether → primary alcohol. Conversion to acyl chloride: SOCl₂ or PCl₅.

CHIRALITY / OPTICAL ISOMERISM
- A chiral (asymmetric) carbon has FOUR different groups attached. The two enantiomers are non-superimposable mirror images that rotate plane-polarised light in opposite directions.
- A racemic mixture (50:50 enantiomers) shows NO net optical rotation. Reactions going through a planar intermediate (carbonyl addition, SN1) give racemates.

WORKED-EXAMPLE MATERIAL
- Distinguish an aldehyde, ketone and carboxylic acid using reagents (state reagent + observation). Identify a chiral centre and explain optical isomerism.

COMMON MISTAKES
- Saying ketones are oxidised; forgetting carbonyl test observations; not spotting a chiral centre; calling a racemate optically active.

REACTIONS: populate with the key tests/conversions (reagent + conditions + observation). GRAPHS: empty.`,
      },

      unit5: {
        "Organic Synthesis": `EDEXCEL IAL CHEMISTRY UNIT 5 (WCH15) — ORGANIC SYNTHESIS (A2, synoptic). This topic is about PLANNING multi-step routes between functional groups using reactions from across the course, plus practical technique, yield and chirality. It is NOT about electrode potentials or transition-metal colours — do not include those.

THE REACTION MAP (reagents + conditions are the marks)
- Alkene → alcohol: steam, H₃PO₄ catalyst (hydration); or via halogenoalkane.
- Alkene → halogenoalkane: HX(g). Alkene → dihalogenoalkane: X₂.
- Halogenoalkane → alcohol: NaOH(aq), reflux (nucleophilic substitution).
- Halogenoalkane → nitrile: KCN in ethanol, reflux (ADDS one carbon).
- Halogenoalkane → amine: excess NH₃ in ethanol, sealed tube.
- Halogenoalkane → alkene: KOH in ethanol, reflux (elimination).
- Alcohol → halogenoalkane: HX, or PCl₅ / SOCl₂ (and conc HCl/ZnCl₂, or PBr₃/red P + Br₂).
- Primary alcohol → aldehyde: K₂Cr₂O₇ / H₂SO₄, DISTIL off (partial oxidation). → carboxylic acid: K₂Cr₂O₇ / H₂SO₄, REFLUX (full oxidation).
- Secondary alcohol → ketone: K₂Cr₂O₇ / H₂SO₄, reflux. Tertiary alcohol: not oxidised.
- Alcohol → alkene: conc H₂SO₄ or Al₂O₃, heat (dehydration).
- Aldehyde/ketone → alcohol: NaBH₄ (reduction). Aldehyde/ketone → hydroxynitrile: HCN/KCN, dilute H₂SO₄ (ADDS one carbon; gives a racemate).
- Nitrile → carboxylic acid: dilute acid (or alkaline) hydrolysis, reflux. Nitrile → amine: LiAlH₄ in dry ether, or H₂/Ni (reduction).
- Carboxylic acid → ester: alcohol + conc H₂SO₄ (esterification). → acyl chloride: SOCl₂ or PCl₅. → salt: NaOH / Na₂CO₃.
- Acyl chloride → ester/amide: with alcohol → ester; with ammonia/amine → amide.
- Benzene → nitrobenzene: conc HNO₃ / conc H₂SO₄, <55 °C. Nitrobenzene → phenylamine: Sn / conc HCl, then NaOH (reduction). Phenylamine → diazonium salt: NaNO₂ / HCl, 0–5 °C → azo dye by coupling with phenol in NaOH.

CHANGING CHAIN LENGTH
- Add one carbon: KCN with a halogenoalkane (→ nitrile) or HCN with a carbonyl (→ hydroxynitrile), then hydrolyse/reduce.

PLANNING A SYNTHESIS
- Work BACKWARDS from the target molecule; identify functional-group changes; pick reagents/conditions for each step; keep steps to a minimum; watch for steps that would affect other groups.

PRACTICAL TECHNIQUE, YIELD & PURITY
- Reflux (prolonged heating without loss of volatiles); distillation (separate by boiling point); solvent extraction (separating funnel); recrystallisation (purify solids); melting point / boiling point to check purity; drying agents.
- % yield = (actual / theoretical) × 100. Atom economy = (Mr of desired product / Mr of all products) × 100; addition reactions have high atom economy, substitution/elimination lower.

CHIRALITY IN SYNTHESIS
- Reactions via a planar intermediate (e.g. nucleophilic addition to C=O, or SN1) give a RACEMIC mixture (equal enantiomers) — no optical activity. Recognise when a new chiral centre is formed.

WORKED-EXAMPLE MATERIAL
- Give a 2–3 step synthesis (e.g. propan-1-ol → propanoic acid → an ester, or 1-bromopropane → butanoic acid via nitrile), stating reagents and conditions for each step.
- Calculate % yield and atom economy for a named step.

COMMON MISTAKES
- Vague conditions ("oxidise") instead of exact reagents; forgetting KCN/HCN add a carbon; not realising a planar intermediate gives a racemate; choosing a reagent that attacks another functional group.

REACTIONS: populate the reactions array with the key conversions above (reagent + conditions + what's formed/observed).
GRAPHS: empty.`,

        "Redox Equilibria": `EDEXCEL IAL CHEMISTRY UNIT 5 (WCH15) — REDOX EQUILIBRIA (A2). Electrode potentials and redox titrations.

STANDARD ELECTRODE POTENTIAL (E°)
- E° = the potential of a half-cell measured against the Standard Hydrogen Electrode (SHE) under standard conditions (298 K, 1 mol dm⁻³ solutions, 100 kPa gases). The SHE is defined as 0.00 V.
- Measured with a high-resistance voltmeter; the two half-cells are connected by a salt bridge (e.g. KNO₃) and a wire.
- The electrochemical series lists half-equations by E°; more positive E° = better oxidising agent (more readily reduced).

CELL POTENTIAL & FEASIBILITY
- E°cell = E°(positive electrode) − E°(negative electrode) = E°(half-cell reduced) − E°(half-cell oxidised). Always positive for a spontaneous cell.
- A reaction is thermodynamically FEASIBLE when E°cell is positive (equivalently ΔG = −nFE°cell < 0).
- The more positive half-cell undergoes reduction (cathode); the more negative is oxidised (anode).
- LIMITATIONS of E° predictions: they ignore kinetics (a feasible reaction may be very slow due to high Ea); they assume standard conditions — changing concentration shifts the electrode potential (apply Le Chatelier to the half-equation).

REDOX TITRATIONS
- Manganate(VII): MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O. Self-indicating: the first permanent PALE PINK marks the end-point (purple MnO₄⁻ → colourless Mn²⁺). Use dilute H₂SO₄ (not HCl — Cl⁻ would be oxidised; not HNO₃ — it is an oxidiser).
- Iodine–thiosulfate: I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻. Add STARCH near the end-point (blue-black → colourless). Used to find the % of an oxidising agent (e.g. Cu²⁺, ClO⁻).
- Calculations: write half-equations, combine for the ratio, use moles = c×v, scale by the mole ratio.

DISPROPORTIONATION
- A species is simultaneously oxidised and reduced (e.g. 2Cu⁺ → Cu²⁺ + Cu).

WORKED-EXAMPLE MATERIAL
- Calculate E°cell and state feasibility; a full MnO₄⁻ or I₂/S₂O₃²⁻ titration calculation (moles → ratio → concentration/%).

COMMON MISTAKES
- Wrong sign in E°cell; using HCl with manganate; forgetting the 5e⁻/2e⁻ ratios; saying a feasible reaction must be fast.

REACTIONS: include the manganate and thiosulfate half-equations/observations. GRAPHS: empty.`,

        "Organic Chemistry: Arenes": `EDEXCEL IAL CHEMISTRY UNIT 5 (WCH15) — ARENES (A2). Benzene, electrophilic aromatic substitution and phenol.

BENZENE STRUCTURE
- A planar, regular hexagon; all six C–C bonds are equal length (≈0.139 nm, between single 0.154 and double 0.134). The 6 p-electrons are DELOCALISED in a π ring above and below the plane.
- Evidence for delocalisation (not Kekulé): equal bond lengths; the enthalpy of hydrogenation is LESS exothermic than expected for 3 isolated C=C (extra stability ≈ 152 kJ mol⁻¹); benzene resists addition and does not decolourise bromine water without a catalyst.

ELECTROPHILIC AROMATIC SUBSTITUTION (EAS)
- General mechanism: an electrophile attacks the π system → a positively charged, resonance-stabilised intermediate (aromaticity temporarily lost) → loss of H⁺ restores the aromatic ring.
- Nitration: conc HNO₃ + conc H₂SO₄, below 55 °C. H₂SO₄ generates the nitronium ion: HNO₃ + 2H₂SO₄ → NO₂⁺ + H₃O⁺ + 2HSO₄⁻. Product nitrobenzene.
- Halogenation: Cl₂ (or Br₂) with a halogen-carrier catalyst AlCl₃ (or FeCl₃/FeBr₃).
- Friedel–Crafts alkylation: RCl + AlCl₃ → alkylbenzene. Acylation: RCOCl + AlCl₃ → aromatic ketone (preferred — avoids further substitution).

PHENOL (C₆H₅OH)
- The O lone pair partly delocalises into the ring → ring is ACTIVATED (more reactive than benzene) and phenol is weakly acidic.
- Reacts with bromine water WITHOUT a catalyst → white ppt of 2,4,6-tribromophenol (decolourises bromine water — unlike benzene).
- Acidic: reacts with NaOH → sodium phenoxide, but does NOT react with carbonates (weaker acid than carboxylic acids). Neutral FeCl₃ gives a purple colour (test for phenol).

DIRECTING EFFECTS
- Activating groups (–OH, –NH₂, –R) push electron density into the ring → direct to 2- and 4- (ortho/para) and speed up EAS.
- Deactivating groups (–NO₂, –COOH) withdraw electron density → direct to 3- (meta) and slow EAS.

WORKED-EXAMPLE MATERIAL
- Outline the nitration mechanism (electrophile generation + the 3 steps); explain why phenol is more reactive than benzene; predict the substitution position for a substituted benzene.

COMMON MISTAKES
- Drawing Kekulé reactivity (addition); forgetting the halogen carrier; saying benzene decolourises bromine water; wrong directing effect.

REACTIONS: include nitration, halogenation, Friedel–Crafts, phenol + bromine water (reagents + conditions + observation). GRAPHS: empty.`,

        "Organic Nitrogen Compounds: Amines, Amides, Amino Acids and Proteins": `EDEXCEL IAL CHEMISTRY UNIT 5 (WCH15) — ORGANIC NITROGEN COMPOUNDS (A2).

AMINES
- Classified primary (RNH₂) / secondary (R₂NH) / tertiary (R₃N) / quaternary (R₄N⁺) by groups on N.
- Basic: the N lone pair accepts H⁺. Strength: aliphatic amines > ammonia (alkyl groups push electron density onto N) > aromatic amines (e.g. phenylamine — the lone pair is delocalised into the ring, so less available).
- Reactions: with acids → ammonium salts; with acyl chlorides → N-substituted amides.
- PREPARATION: halogenoalkane + excess NH₃ (sealed tube) → amine; nitrile reduction (LiAlH₄, or H₂/Ni) → amine (one more carbon than the halogenoalkane it came from); nitrobenzene reduction (Sn + conc HCl, then NaOH) → phenylamine.

AMIDES
- –CONH₂; formed from an acyl chloride + ammonia (primary amide) or + amine (N-substituted amide). Hydrolyse (acid or alkali) back to carboxylic acid/salt + amine.

DIAZONIUM SALTS & AZO DYES
- Phenylamine + HNO₂ (from NaNO₂ + HCl) at 0–5 °C → benzenediazonium chloride (unstable above 10 °C). Coupling with phenol (in NaOH) or an aromatic amine → an azo compound: a brightly coloured AZO DYE (the –N=N– azo group is the chromophore).

AMINO ACIDS & PROTEINS
- Contain both –NH₂ and –COOH. Exist as a ZWITTERION (⁺H₃N–CHR–COO⁻) at the isoelectric point (pI) where net charge = 0; in acid they gain H⁺ (positive), in alkali they lose H⁺ (negative).
- Condensation between –COOH of one and –NH₂ of another forms a PEPTIDE bond (–CO–NH–) → polypeptides/proteins; hydrolysis (acid or enzyme) breaks them back to amino acids.
- Separation by electrophoresis: at a given pH amino acids carry different charges and migrate to different electrodes. All amino acids except glycine are chiral (optically active).

WORKED-EXAMPLE MATERIAL
- Explain the order of base strength (ethylamine vs ammonia vs phenylamine); outline azo dye formation (diazotisation + coupling, with conditions); draw the zwitterion and predict the form at high/low pH.

COMMON MISTAKES
- Getting base-strength order backwards; warming the diazonium salt; forgetting the 0–5 °C condition; drawing the amino acid neutral instead of as a zwitterion.

REACTIONS: include amine + acid, diazotisation, azo coupling, peptide-bond formation (reagents + conditions + observation/product). GRAPHS: empty.`,
      },

      unit6: {
        "Planning, Implementing and Safety": `EDEXCEL IAL CHEMISTRY UNIT 6 (WCH16) — PLANNING, IMPLEMENTING AND SAFETY (A2 practical skills). Write as concise exam-ready points on how to DESIGN a valid A2 experiment.

PLANNING A METHOD
- Identify the independent, dependent and control variables. Choose a method and apparatus that give a measurable change with appropriate resolution, and quantities that are safe and give a good signal (e.g. a titre of 20–30 cm³, a measurable temperature change).
- Sequence the steps logically; state what is measured and how repeats give reliable data.

RISK ASSESSMENT
- For each hazardous chemical state the HAZARD (corrosive, flammable, toxic, oxidising, irritant) and a sensible CONTROL MEASURE (goggles, gloves, fume cupboard, no naked flames for flammables, small quantities). Distinguish hazard (potential to harm) from risk (likelihood in this experiment).

CHOOSING APPARATUS & QUANTITIES
- Pick apparatus by required precision (burette ±0.05 cm³, balance ±0.001 g, thermometer/data-logger). Justify concentrations/masses so the change is large enough to measure accurately but safe.

A2 CONTEXTS
- Redox titrations (KMnO₄, thiosulfate), rate experiments (clock/sampling, Arrhenius for Ea), multi-step organic prep + purification, enthalpy determinations.

WORKED-EXAMPLE MATERIAL
- Plan a named A2 experiment: variables, method outline, apparatus + justification, and a risk assessment table (hazard → control).
COMMON MISTAKES
- Confusing hazard and risk; vague "wear goggles" without naming the hazard; quantities too small to measure.
REACTIONS: empty. GRAPHS: empty.`,

        "Analysis and Evaluation": `EDEXCEL IAL CHEMISTRY UNIT 6 (WCH16) — ANALYSIS AND EVALUATION (A2 practical).

PROCESSING DATA
- Calculate the required quantity from raw data (moles, ΔH, rate constant, Ea), quoting answers to a sensible number of significant figures (matching the least precise reading).

UNCERTAINTIES
- % uncertainty of a reading = (uncertainty ÷ value) × 100; double the absolute uncertainty for instruments read twice (burette, thermometer). ADD % uncertainties for multiplied/divided quantities to get the overall % uncertainty. Reduce it by using larger measured values.

EVALUATION
- Compare your result with a true/literature value (calculate % error). Decide whether any difference is within the experimental uncertainty (if % error < % uncertainty, the result is consistent — errors explain it; if greater, a systematic error is likely).
- Identify the LARGEST source of error and suggest a targeted, realistic improvement. Comment on reliability (repeatability) separately from accuracy.

CONCLUSIONS
- State a conclusion that the data actually support, linked to the underlying chemistry.

WORKED-EXAMPLE MATERIAL
- Process a titration/enthalpy/rate data set, find the overall % uncertainty, compare with % error, and evaluate.
COMMON MISTAKES
- Not doubling for two readings; confusing % error with % uncertainty; concluding beyond what the data show.
REACTIONS: empty. GRAPHS: empty.`,

        "Experimental Techniques": `EDEXCEL IAL CHEMISTRY UNIT 6 (WCH16) — EXPERIMENTAL TECHNIQUES (A2 practical). The A2-level techniques students must be able to perform and describe.

REDOX TITRATIONS
- Manganate(VII): MnO₄⁻ is self-indicating — first permanent pale pink = end-point; use dilute H₂SO₄ (not HCl/HNO₃). Iodine–thiosulfate: add starch near the end-point (blue-black → colourless); standardise via I₂ liberated.

RATES
- Clock reactions (time to a fixed change; initial rate ∝ 1/time); continuous monitoring (gas volume, colorimetry, sampling + quenching then titrate). Determine activation energy by measuring k at several temperatures and plotting ln k vs 1/T (gradient = −Ea/R).

ORGANIC PREPARATION & PURIFICATION
- Reflux to react; distillation to collect product; purify a liquid by washing in a separating funnel + drying agent + redistillation; purify a solid by recrystallisation; confirm purity by measuring melting/boiling point (sharp = pure) and by % yield.

ENTHALPY
- Calorimetry with insulation/lid; for slow/indirect reactions use Hess-cycle determinations (e.g. enthalpy of a reaction via two measurable steps).

WORKED-EXAMPLE MATERIAL
- Describe how to carry out a KMnO₄ titration / an Ea determination / a recrystallisation, including the key observation or check.
COMMON MISTAKES
- Using the wrong acid in a manganate titration; adding starch too early; not checking purity by melting point.
REACTIONS: include the redox-titration half-equations/observations. GRAPHS: empty.`,
      },
    },

    biology: {
      unit1: {
        "Water Properties and Hydrogen Bonding": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — WATER PROPERTIES AND HYDROGEN BONDING.
- Water is a POLAR molecule: O is δ−, H atoms δ+; this allows HYDROGEN BONDS between molecules.
- Solvent: dissolves ions and polar molecules → medium for metabolic reactions and for transport (blood, xylem).
- High specific heat capacity: H-bonds absorb a lot of energy → temperature stays stable (good for organisms/habitats).
- High latent heat of vaporisation: evaporating water (sweating/transpiration) removes a lot of heat → cooling.
- Cohesion + high surface tension (H-bonds): water columns in xylem; habitat for small organisms.
- Less dense as ice (open H-bonded lattice) → ice floats and insulates water below.
- Reactant/metabolite: used in hydrolysis and photosynthesis.
REACTIONS: empty. GRAPHS: empty.`,
        "Monosaccharides and Reducing Sugars": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — MONOSACCHARIDES AND REDUCING SUGARS.
- Monosaccharides = single sugar units, general formula (CH₂O)ₙ; e.g. glucose, fructose, galactose (hexoses); ribose/deoxyribose (pentoses).
- α-glucose and β-glucose are isomers differing in the OH position on C1 → leads to different polysaccharides.
- Soluble, sweet, the main respiratory substrate; building blocks of larger carbohydrates.
- REDUCING SUGAR test (Benedict's): add Benedict's reagent and heat → blue → green/yellow/orange → brick-RED precipitate (Cu₂O) if a reducing sugar is present; colour/amount indicates concentration.
REACTIONS: empty. GRAPHS: empty.`,
        "Disaccharides and Glycosidic Bonds": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — DISACCHARIDES AND GLYCOSIDIC BONDS.
- A CONDENSATION reaction joins two monosaccharides, forming a GLYCOSIDIC BOND and releasing water.
- Maltose = glucose + glucose (1,4); sucrose = glucose + fructose; lactose = glucose + galactose.
- HYDROLYSIS (adding water, with acid or enzyme) breaks the glycosidic bond back to monosaccharides.
- Sucrose is a NON-reducing sugar: negative Benedict's; boil with dilute HCl (hydrolyse), neutralise, then Benedict's → now positive (brick-red).
REACTIONS: empty. GRAPHS: empty.`,
        "Polysaccharides — Glycogen and Starch": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — POLYSACCHARIDES (STARCH & GLYCOGEN).
- Made of many α-glucose units joined by glycosidic bonds (condensation). Good STORAGE molecules: insoluble (no osmotic/water-potential effect), compact, easily hydrolysed to release glucose.
- STARCH (plants) = amylose (unbranched α-1,4, coils into a helix → compact) + amylopectin (α-1,4 with α-1,6 BRANCHES → more ends for fast hydrolysis). Tested with iodine → blue-black.
- GLYCOGEN (animals, liver/muscle) = like amylopectin but MORE branched → very rapidly hydrolysed when glucose is needed.
REACTIONS: empty. GRAPHS: empty.`,
        "Triglycerides and Fatty Acids": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — TRIGLYCERIDES AND FATTY ACIDS.
- A triglyceride = 1 glycerol + 3 fatty acids joined by ESTER bonds (condensation, 3 waters released).
- SATURATED fatty acids have no C=C (straight chains, pack closely → solid fats); UNSATURATED have C=C double bonds (kinked → liquid oils, lower melting point).
- Functions: concentrated energy store (more energy per gram than carbohydrate, as more C–H bonds), thermal insulation, protection of organs, waterproofing; hydrophobic and insoluble.
REACTIONS: empty. GRAPHS: empty.`,
        "Phospholipids and the Fluid Mosaic Model": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — PHOSPHOLIPIDS.
- A phospholipid = glycerol + 2 fatty acids + a phosphate group. The phosphate "head" is HYDROPHILIC (polar); the fatty-acid "tails" are HYDROPHOBIC → the molecule is amphipathic.
- In water phospholipids form a BILAYER (heads outward to water, tails inward) — the basis of all cell membranes.
- This arrangement makes the membrane partially permeable: small non-polar molecules pass; ions/large polar molecules need proteins.
REACTIONS: empty. GRAPHS: empty.`,
        "Cell Surface Membrane Structure": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — CELL SURFACE MEMBRANE (FLUID MOSAIC MODEL).
- "Fluid" = phospholipids move laterally; "mosaic" = proteins scattered through the bilayer.
- Components: phospholipid bilayer; intrinsic (channel & carrier) proteins for transport; extrinsic proteins; CHOLESTEROL (regulates fluidity/stability); glycoproteins & glycolipids (cell recognition/receptors).
- Function: partially permeable barrier controlling what enters/leaves; site of receptors and cell signalling.
REACTIONS: empty. GRAPHS: empty.`,
        "Diffusion and Facilitated Diffusion": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — DIFFUSION & FACILITATED DIFFUSION.
- Diffusion = net movement of particles from a region of HIGH to LOW concentration (down the gradient), passive (no ATP). Small, non-polar molecules (O₂, CO₂) cross the bilayer directly.
- Facilitated diffusion = passive movement of larger/charged/polar molecules (glucose, ions) through CHANNEL or CARRIER proteins, still down the gradient.
- Rate increases with: steeper concentration gradient, higher temperature, larger surface area, shorter diffusion distance, more channel/carrier proteins (for facilitated).
REACTIONS: empty. GRAPHS: empty.`,
        "Osmosis and Water Potential": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — OSMOSIS AND WATER POTENTIAL.
- Osmosis = net movement of WATER molecules from a region of HIGHER (less negative) water potential to LOWER (more negative) water potential, across a partially permeable membrane.
- Water potential (ψ): pure water = 0 kPa; adding solute makes ψ NEGATIVE. Water moves toward more negative ψ.
- Cells: animal cells in pure water → lyse (haemolysis); in concentrated solution → shrink (crenation). Plant cells → turgid / plasmolysed.
REACTIONS: empty. GRAPHS: empty.`,
        "Active Transport": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — ACTIVE TRANSPORT.
- Movement of molecules/ions AGAINST the concentration gradient (low → high), requiring ENERGY (ATP) and a CARRIER protein that changes shape.
- Examples: ion uptake by root hair cells; reabsorption in the kidney/gut.
- Bulk transport: endocytosis (in) and exocytosis (out) of large materials in vesicles, also ATP-requiring.
REACTIONS: empty. GRAPHS: empty.`,
        "DNA Structure": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — DNA STRUCTURE.
- DNA = a double helix of two ANTIPARALLEL polynucleotide strands. Each nucleotide = deoxyribose + phosphate + a base (A, T, G, C).
- Backbone joined by PHOSPHODIESTER bonds (condensation). Strands held by HYDROGEN BONDS between complementary base pairs: A–T (2 H-bonds), G–C (3 H-bonds).
- Complementary base pairing allows accurate replication and is the basis of the genetic code.
REACTIONS: empty. GRAPHS: empty.`,
        "RNA and the Genetic Code": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — RNA AND THE GENETIC CODE.
- RNA = single strand, contains RIBOSE and URACIL (instead of thymine). Types: mRNA (carries the code), tRNA (brings amino acids), rRNA.
- The genetic code is a TRIPLET code (each codon of 3 bases = one amino acid). It is: degenerate (most amino acids have several codons), non-overlapping, and (almost) universal.
- There are start and stop codons that signal the beginning/end of translation.
REACTIONS: empty. GRAPHS: empty.`,
        "Transcription": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — TRANSCRIPTION.
- Transcription makes mRNA from a DNA template, in the NUCLEUS.
- Steps: DNA unwinds; RNA POLYMERASE binds; free RNA nucleotides pair with the exposed TEMPLATE (antisense) strand by complementary base pairing (U pairs with A); the sugar-phosphate backbone forms → mRNA.
- mRNA detaches and leaves the nucleus through a nuclear pore to a ribosome. (Eukaryotes: introns spliced out of pre-mRNA.)
REACTIONS: empty. GRAPHS: empty.`,
        "Translation": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — TRANSLATION.
- Translation builds a polypeptide at a RIBOSOME using the mRNA code.
- mRNA is read in CODONS (3 bases). Each tRNA has an ANTICODON complementary to a codon and carries a specific amino acid.
- tRNAs bring amino acids in order; adjacent amino acids join by PEPTIDE bonds (condensation); the ribosome moves along until a STOP codon → the polypeptide is released.
REACTIONS: empty. GRAPHS: empty.`,
        "Gene Mutations": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — GENE MUTATIONS.
- A gene mutation = a change in the DNA base sequence.
- SUBSTITUTION (one base swapped): silent (same amino acid — code is degenerate), missense (different amino acid), or nonsense (premature stop codon).
- INSERTION/DELETION cause a FRAMESHIFT — every codon after the mutation is altered → usually a non-functional protein.
- Effect depends on whether the amino-acid sequence (and so protein shape/function) changes; e.g. sickle-cell anaemia from a single substitution in haemoglobin.
REACTIONS: empty. GRAPHS: empty.`,
        "Genetic Screening — PCR and Gel Electrophoresis": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — GENETIC SCREENING (incl. PCR & GEL ELECTROPHORESIS).
- Genetic screening = testing DNA for disease-causing alleles (e.g. carrier testing, prenatal testing by amniocentesis/CVS, newborn screening, pre-implantation diagnosis).
- PCR amplifies tiny DNA samples: DENATURE (~95 °C, strands separate) → ANNEAL primers (~55 °C) → EXTEND (~72 °C, Taq polymerase); each cycle doubles the DNA.
- GEL ELECTROPHORESIS separates DNA fragments by size: DNA is negative → moves to the ANODE; smaller fragments travel further; compared against known markers.
- Ethical/social implications: consent, confidentiality, insurance/employment use, decisions after a positive result.
REACTIONS: empty. GRAPHS: empty.`,
        "Why Animals Need a Circulatory System": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — NEED FOR A CIRCULATORY SYSTEM.
- Large, active multicellular animals have a small SURFACE-AREA-TO-VOLUME ratio and long diffusion distances → diffusion alone is too slow to supply cells.
- A MASS TRANSPORT SYSTEM (blood + heart + vessels) moves O₂, nutrients, hormones and heat to cells and removes CO₂/waste quickly.
- Mammals have a DOUBLE circulation (blood passes the heart twice): a low-pressure pulmonary circuit to the lungs and a high-pressure systemic circuit to the body → efficient.
REACTIONS: empty. GRAPHS: empty.`,
        "Blood Vessel Structure and Function": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — BLOOD VESSELS.
- ARTERIES: carry blood at HIGH pressure away from the heart; thick wall with lots of elastic tissue + smooth muscle, narrow lumen; elastic recoil smooths flow; no valves.
- VEINS: low pressure, return blood to the heart; thin wall, wide lumen, VALVES prevent backflow; aided by skeletal muscle.
- CAPILLARIES: one-cell-thick endothelium, very narrow → short diffusion distance + large surface area for EXCHANGE of substances with tissues.
REACTIONS: empty. GRAPHS: empty.`,
        "Cardiac Cycle": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — THE CARDIAC CYCLE.
- Stages: ATRIAL SYSTOLE (atria contract, push blood into ventricles) → VENTRICULAR SYSTOLE (ventricles contract; AV valves shut "lub", semilunar valves open, blood leaves) → DIASTOLE (all relax; semilunar valves shut "dub"; heart refills).
- Valves open/close due to PRESSURE differences, ensuring ONE-WAY flow: a valve opens when pressure behind > in front, and shuts when pressure in front > behind.
- Be able to read a pressure–time graph of the atrium, ventricle and aorta to explain valve opening/closing.
REACTIONS: empty. GRAPHS: empty.`,
        "Heart Structure": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — HEART STRUCTURE.
- Four chambers: right atrium → right ventricle → lungs (pulmonary); left atrium → left ventricle → body (systemic).
- The LEFT ventricle wall is thicker/more muscular — it pumps blood at higher pressure around the whole body.
- Valves: atrioventricular (tricuspid right, bicuspid/mitral left) and semilunar (in pulmonary artery & aorta) prevent backflow. The septum separates oxygenated and deoxygenated blood. Coronary arteries supply the heart muscle.
REACTIONS: empty. GRAPHS: empty.`,
        "Haemoglobin and Oxygen Transport": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — HAEMOGLOBIN & OXYGEN TRANSPORT.
- Haemoglobin (in red blood cells) binds up to 4 O₂ → oxyhaemoglobin. Binding is COOPERATIVE (binding one O₂ makes the next easier) → S-SHAPED (sigmoid) oxygen dissociation curve.
- Loads O₂ at the lungs (high pO₂, high % saturation) and unloads at respiring tissues (low pO₂).
- BOHR EFFECT: high CO₂ / low pH (active tissue) shifts the curve RIGHT → haemoglobin releases more O₂ where it's needed. Fetal haemoglobin has higher O₂ affinity (curve to the left) to take O₂ from the mother.
REACTIONS: empty. GRAPHS: removed — describe the sigmoidal dissociation curve and Bohr shift in words.`,
        "Atherosclerosis": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — ATHEROSCLEROSIS.
- Sequence: damage to the artery ENDOTHELIUM (e.g. high blood pressure, toxins from smoking) → inflammatory response → white blood cells and LIPIDS (cholesterol/LDL) build up in the wall → a fatty plaque (ATHEROMA) forms → fibrous tissue + calcium harden it.
- Consequences: the lumen NARROWS and the wall loses elasticity → blood pressure rises further (positive feedback), and a plaque can rupture → clot (thrombosis) → blocked artery → angina, heart attack or stroke.
REACTIONS: empty. GRAPHS: empty.`,
        "Blood Clotting": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — BLOOD CLOTTING.
- Damage exposes the wall → PLATELETS stick and release THROMBOPLASTIN → (with Ca²⁺ and vitamin K) PROTHROMBIN is converted to THROMBIN → thrombin converts soluble FIBRINOGEN into insoluble FIBRIN → a fibrin mesh traps blood cells → a clot.
- Clotting seals wounds but, on a ruptured atheroma, can block an artery (thrombosis) → heart attack/stroke.
REACTIONS: empty. GRAPHS: empty.`,
        "Cardiovascular Disease Risk Factors": `EDEXCEL IAL BIOLOGY UNIT 1 (WBI11) — CVD RISK FACTORS.
- Risk factors: diet high in saturated fat / salt, high blood cholesterol (LDL:HDL ratio), smoking, high blood pressure (hypertension), obesity, physical inactivity, excess alcohol, genetic/family history, age, sex.
- Be able to interpret data/correlation studies and distinguish CORRELATION from CAUSATION (confounding variables, sample size, controls).
- Reducing risk: improve diet (less saturated fat/salt, more fibre), stop smoking, exercise, maintain healthy weight; treatments (statins, antihypertensives, anticoagulants) and their benefits/risks.
REACTIONS: empty. GRAPHS: empty.`,
      },

      unit2: {
        "Prokaryotic Cell Structure": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — PROKARYOTIC CELL STRUCTURE.
- Small (1–5 µm), NO nucleus and NO membrane-bound organelles. Single circular loop of DNA free in the cytoplasm (not associated with histones), plus small rings of DNA called PLASMIDS.
- Smaller (70S) ribosomes; a cell wall of PEPTIDOGLYCAN (murein); cell surface membrane; sometimes a capsule (protection), flagella (movement) and pili.
REACTIONS: empty. GRAPHS: empty.`,
        "Eukaryotic Cell Structure and Organelles": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — EUKARYOTIC CELL STRUCTURE & ORGANELLES.
- NUCLEUS (nuclear envelope + pores, nucleolus makes ribosomes, chromatin = DNA + histones).
- Rough ER (ribosomes on surface → protein synthesis); smooth ER (lipid synthesis); 80S ribosomes.
- GOLGI APPARATUS (modifies, packages and secretes proteins in vesicles); MITOCHONDRIA (aerobic respiration/ATP; folded cristae); LYSOSOMES (hydrolytic enzymes); centrioles.
- PROTEIN SECRETION PATHWAY: ribosome on rER → vesicle → Golgi (modified) → vesicle → cell surface membrane → exocytosis.
REACTIONS: empty. GRAPHS: empty.`,
        "Comparing Prokaryotic and Eukaryotic Cells": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — COMPARING PROKARYOTIC vs EUKARYOTIC CELLS.
- Size: prokaryotic smaller (1–5 µm) vs eukaryotic larger (10–100 µm).
- DNA: prokaryotic = circular, free, no histones; eukaryotic = linear, in a nucleus, with histones.
- Ribosomes: 70S (prokaryotic) vs 80S (eukaryotic). Organelles: none membrane-bound in prokaryotes; many in eukaryotes.
- Cell wall: peptidoglycan (bacteria) vs cellulose (plants) / none (animals).
REACTIONS: empty. GRAPHS: empty.`,
        "Light Microscopy vs Electron Microscopy": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — LIGHT vs ELECTRON MICROSCOPY.
- MAGNIFICATION = how many times bigger the image is (= image size ÷ actual size). RESOLUTION = the smallest distance at which two points appear separate; limited by the wavelength used.
- Light microscope: can view LIVING/coloured specimens; low resolution (~200 nm), magnification up to ~×1500.
- Electron microscope: electrons (tiny wavelength) → high resolution (~0.5 nm). TEM = thin sections, detailed INTERNAL structure (2D); SEM = surface, 3D image. But specimens are dead and in a vacuum.
- Be able to use magnification = image/actual (watch units; 1 mm = 1000 µm = 10⁶ nm).
REACTIONS: empty. GRAPHS: empty.`,
        "Cell Fractionation": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — CELL FRACTIONATION.
- HOMOGENISE tissue in a solution that is COLD (slows enzymes), ISOTONIC (prevents osmotic damage to organelles) and BUFFERED (stable pH). Filter to remove debris.
- ULTRACENTRIFUGE the homogenate at increasing speeds — densest organelles sediment first: nuclei → mitochondria/chloroplasts → ER/ribosomes. The pellet is resuspended at each stage.
REACTIONS: empty. GRAPHS: empty.`,
        "Cell Cycle and Mitosis": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — CELL CYCLE & MITOSIS.
- Cell cycle = INTERPHASE (G1 growth, S DNA replication, G2) then mitosis + cytokinesis.
- MITOSIS stages: PROPHASE (chromosomes condense, spindle forms), METAPHASE (chromosomes line up on the equator), ANAPHASE (sister chromatids pulled to opposite poles), TELOPHASE (nuclei reform).
- Produces TWO genetically IDENTICAL diploid cells → growth, repair, asexual reproduction.
REACTIONS: empty. GRAPHS: empty.`,
        "Cancer and Uncontrolled Mitosis": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — CANCER & UNCONTROLLED MITOSIS.
- Cancer = uncontrolled mitosis caused by MUTATIONS in genes controlling the cell cycle — activated oncogenes (from proto-oncogenes) and/or inactivated TUMOUR-SUPPRESSOR genes.
- Cells divide uncontrollably → a tumour: benign (localised) or malignant/cancerous (invades, metastasises).
- Risk factors (carcinogens, mutagens, UV); many treatments target rapidly dividing cells.
REACTIONS: empty. GRAPHS: empty.`,
        "Meiosis and Genetic Variation": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — MEIOSIS & GENETIC VARIATION.
- Meiosis = TWO divisions producing FOUR HAPLOID, genetically DIFFERENT gametes from one diploid cell (halves the chromosome number → restored at fertilisation).
- Variation arises from: CROSSING OVER between homologous chromosomes (prophase I) and INDEPENDENT ASSORTMENT of homologous pairs (metaphase I); plus random fertilisation.
REACTIONS: empty. GRAPHS: empty.`,
        "Stem Cells and Totipotency": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — STEM CELLS & TOTIPOTENCY.
- Stem cells = undifferentiated cells that can keep dividing and can DIFFERENTIATE into other cell types.
- TOTIPOTENT (can form ALL cell types incl. placenta) → PLURIPOTENT (all body cells, e.g. embryonic) → MULTIPOTENT (a limited range, e.g. adult bone marrow). iPSCs are reprogrammed adult cells.
- Uses: treating disease/repair; ethical issues around embryonic sources.
REACTIONS: empty. GRAPHS: empty.`,
        "Cell Differentiation": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — CELL DIFFERENTIATION.
- All body cells have the same genes, but differentiate by switching specific genes ON/OFF → make different PROTEINS → become specialised.
- Specialised structure suits function (e.g. red blood cell: no nucleus, biconcave for O₂ carriage; neurone: long axon; root hair cell: large surface area).
REACTIONS: empty. GRAPHS: empty.`,
        "β-glucose Structure": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — β-GLUCOSE STRUCTURE.
- β-glucose has the OH on carbon-1 ABOVE the ring (α-glucose has it below).
- To join β-glucose into long straight chains (cellulose), alternate molecules are ROTATED 180°, which lets the –OH groups line up to form glycosidic bonds and allows H-bonding between chains.
REACTIONS: empty. GRAPHS: empty.`,
        "Cellulose — Structure and Function": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — CELLULOSE.
- Long, straight chains of β-glucose joined by β-1,4 glycosidic bonds.
- Many HYDROGEN BONDS between parallel chains hold them in bundles (microfibrils → fibres) → high tensile strength.
- Forms the plant CELL WALL: provides support and rigidity, prevents the cell bursting (resists turgor pressure), and is freely permeable.
REACTIONS: empty. GRAPHS: empty.`,
        "Plant Cell Structure": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — PLANT CELL STRUCTURE.
- Extra features vs animal cells: CELLULOSE CELL WALL (support); large permanent VACUOLE with tonoplast (turgor, storage); CHLOROPLASTS (photosynthesis — thylakoids stacked into grana, fluid stroma); plasmodesmata (cytoplasmic links between cells); middle lamella; amyloplasts (starch store).
REACTIONS: empty. GRAPHS: empty.`,
        "Classification — Three Domains and Five Kingdoms": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — CLASSIFICATION.
- Hierarchy: Domain → Kingdom → Phylum → Class → Order → Family → Genus → Species. Binomial name = Genus species (e.g. Homo sapiens).
- THREE DOMAINS: Bacteria, Archaea, Eukarya (based on rRNA differences). FIVE KINGDOMS: Prokaryotae, Protoctista, Fungi, Plantae, Animalia.
- A species = organisms that can interbreed to produce fertile offspring.
REACTIONS: empty. GRAPHS: empty.`,
        "Phylogenetics and Molecular Evidence": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — PHYLOGENETICS & MOLECULAR EVIDENCE.
- Phylogeny = evolutionary relationships; shown on a phylogenetic tree (closer branches = more recent common ancestor).
- Modern classification uses MOLECULAR evidence: comparing DNA/RNA base sequences and protein (amino-acid) sequences and immunological similarity. More differences → more distantly related / longer since divergence (molecular clock).
- This evidence led to reclassification (e.g. the three-domain system from rRNA comparison).
REACTIONS: empty. GRAPHS: empty.`,
        "Biodiversity — Simpson's Diversity Index": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — BIODIVERSITY (SIMPSON'S INDEX).
- Biodiversity considers species RICHNESS (number of species) and EVENNESS (relative abundance), and also genetic diversity within species.
- Simpson's Index of Diversity: D = 1 − Σ(n/N)², where n = number of one species, N = total of all species. D is between 0 and 1; HIGHER D = more diverse and generally more stable.
- Be able to calculate D from a table and compare two habitats.
REACTIONS: empty. GRAPHS: empty.`,
        "Sampling Methods — Quadrats and Transects": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — SAMPLING METHODS.
- QUADRATS estimate abundance of (mostly) non-motile organisms: random placement (use random coordinates to avoid bias) → measure density, frequency or % cover; scale up to estimate the whole population.
- TRANSECTS (line or belt) sample along an environmental GRADIENT (e.g. up a shore) to show how distribution changes.
- Reliability: take many samples, randomise to avoid bias, use a mean.
REACTIONS: empty. GRAPHS: empty.`,
        "Conservation — In Situ and Ex Situ": `EDEXCEL IAL BIOLOGY UNIT 2 (WBI12) — CONSERVATION.
- IN SITU = conserving species in their natural habitat (nature reserves, protected areas, habitat management) — maintains the ecosystem but harder to control threats.
- EX SITU = conserving outside the habitat (zoos, botanic gardens, captive breeding, SEED BANKS) — protects from immediate threats and aids breeding, but limited gene pool and costly.
- Importance of biodiversity: ecosystem stability, genetic resources, medicines, food security; sustainability.
REACTIONS: empty. GRAPHS: empty.`,
      },

      unit3: {
        "Enzyme Temperature Investigation": `EDEXCEL IAL BIOLOGY UNIT 3 (WBI13) — ENZYME & TEMPERATURE (practical).
- As temperature rises, enzyme and substrate molecules have more kinetic energy → more frequent successful collisions → rate increases up to the OPTIMUM.
- Above the optimum, increasing vibration breaks the bonds holding the tertiary structure → the ACTIVE SITE changes shape (DENATURATION) → substrate no longer fits → rate falls.
- METHOD points: vary temperature (water baths) as independent variable; keep pH, [enzyme], [substrate] constant (controls); measure rate (e.g. time for colour change / volume of product); repeat for reliability.
REACTIONS: empty. GRAPHS: empty.`,
        "Enzyme Substrate Concentration": `EDEXCEL IAL BIOLOGY UNIT 3 (WBI13) — ENZYME & SUBSTRATE CONCENTRATION (practical).
- Rate increases with substrate concentration because more active sites are occupied; at high concentration the rate PLATEAUS because all active sites are saturated (enzyme concentration is now the limiting factor).
- METHOD: vary substrate concentration; control temperature, pH, enzyme concentration; measure initial rate; repeat and mean.
REACTIONS: empty. GRAPHS: empty.`,
        "Enzyme pH Investigation": `EDEXCEL IAL BIOLOGY UNIT 3 (WBI13) — ENZYME & pH (practical).
- Each enzyme has an OPTIMUM pH. Away from it, H⁺/OH⁻ ions disrupt ionic and hydrogen bonds in the tertiary structure → the active site changes shape → activity falls; extreme pH denatures the enzyme.
- METHOD: use BUFFERS to set pH (independent variable); control temperature, [enzyme], [substrate]; measure rate; repeat.
REACTIONS: empty. GRAPHS: empty.`,
        "Osmosis in Plant Tissue": `EDEXCEL IAL BIOLOGY UNIT 3 (WBI13) — OSMOSIS IN PLANT TISSUE (practical).
- Place identical pieces of tissue (e.g. potato) in a range of sucrose concentrations; measure % change in MASS (or length).
- Tissue GAINS mass in solutions with higher water potential and LOSES mass in lower water potential. The concentration at which there is NO change in mass = the water potential of the tissue (where the curve crosses zero).
- Controls: same tissue, size, temperature, time; blot before weighing. Use % change so different starting masses are comparable.
REACTIONS: empty. GRAPHS: empty.`,
        "Microscopy and Cell Measurement": `EDEXCEL IAL BIOLOGY UNIT 3 (WBI13) — MICROSCOPY & MEASUREMENT (practical).
- Use an EYEPIECE GRATICULE calibrated against a STAGE MICROMETER to measure cell size: calibrate at each magnification (1 eyepiece division = X µm).
- Magnification = image size ÷ actual size. Convert units carefully (1 mm = 1000 µm). Calculate actual size from a measured image and a known magnification/scale bar.
REACTIONS: empty. GRAPHS: empty.`,
        "Photosynthesis Rate — Light Wavelengths": `EDEXCEL IAL BIOLOGY UNIT 3 (WBI13) — PHOTOSYNTHESIS & LIGHT (practical).
- Measure photosynthesis rate (e.g. bubbles/volume of O₂ from pondweed, or DCPIP colour change) while varying light intensity, wavelength (colour filters) or CO₂.
- Rate is highest in red and blue light (absorbed by chlorophyll) and low in green (reflected). Light intensity follows the inverse-square law (intensity ∝ 1/distance²).
- Controls: temperature, CO₂ (hydrogencarbonate), same plant; repeat.
REACTIONS: empty. GRAPHS: empty.`,
        "Transpiration and Potometers": `EDEXCEL IAL BIOLOGY UNIT 3 (WBI13) — TRANSPIRATION & POTOMETERS (practical).
- A POTOMETER measures water UPTAKE (≈ transpiration rate) by tracking an air bubble's movement along a capillary tube per unit time.
- Set up under water and seal joints to keep airtight; cut the shoot under water. Vary one factor: light, temperature, humidity, or air movement (wind), keeping the others constant.
- Transpiration increases with light (stomata open), temperature, wind and lower humidity.
REACTIONS: empty. GRAPHS: empty.`,
        "Statistical Analysis — t-test and Chi-squared": `EDEXCEL IAL BIOLOGY UNIT 3 (WBI13) — STATISTICS (t-test & chi-squared).
- State a NULL HYPOTHESIS (no significant difference / no association). Calculate the statistic, compare with the CRITICAL value at p = 0.05 and the correct degrees of freedom.
- t-TEST: compares the MEANS of two sets of measured (continuous) data. If calculated t > critical t → reject the null hypothesis (a significant difference).
- CHI-SQUARED (χ²): compares observed vs expected FREQUENCIES (categorical data), χ² = Σ(O−E)²/E. If χ² > critical value → reject the null (a significant difference/association).
REACTIONS: empty. GRAPHS: empty.`,
        "Graph Skills and Error Bars": `EDEXCEL IAL BIOLOGY UNIT 3 (WBI13) — GRAPH SKILLS & ERROR BARS (practical).
- Choose the right graph: line graph for two continuous variables; bar chart for categories. Independent variable on the x-axis; label axes with units; sensible scale; plot accurately; line of best fit/curve.
- ERROR BARS show the spread (range or ± standard deviation) of repeats. If error bars of two means OVERLAP, the difference may not be significant; if they don't overlap, it likely is.
REACTIONS: empty. GRAPHS: empty.`,
        "Sources of Error — Systematic and Random": `EDEXCEL IAL BIOLOGY UNIT 3 (WBI13) — SOURCES OF ERROR (practical).
- RANDOM errors scatter results either side of the true value (e.g. judgement of an end-point) → reduce by repeating and averaging.
- SYSTEMATIC errors shift every result the same way (e.g. an uncalibrated balance, parallax) → repeats DON'T help; fix by calibration/technique.
- Accuracy = closeness to the true value; precision = closeness of repeats. Identify and justify excluding anomalies.
REACTIONS: empty. GRAPHS: empty.`,
        "Validity and Reliability in Biology Practicals": `EDEXCEL IAL BIOLOGY UNIT 3 (WBI13) — VALIDITY & RELIABILITY (practical).
- VALID = the experiment tests what it is meant to (only the independent variable changes; all other variables CONTROLLED; a suitable control). RELIABLE/repeatable = consistent results on repeating (similar values → take a mean).
- Improve validity by controlling confounding variables; improve reliability by repeating and increasing sample size; evaluate the method and suggest targeted improvements.
REACTIONS: empty. GRAPHS: empty.`,
      },

      unit4: {
        "ATP Structure and Hydrolysis": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — ATP.
- ATP = adenine + ribose + THREE phosphate groups (a phosphorylated nucleotide).
- HYDROLYSIS of the terminal phosphate by ATP hydrolase: ATP + H₂O → ADP + Pi, releasing a small, usable amount of energy for cellular work; reversible (resynthesised in respiration/photosynthesis by ATP synthase — phosphorylation).
- ATP is the "universal energy currency": releases energy in small manageable amounts, quickly, in one step; not a long-term store.
REACTIONS: empty. GRAPHS: empty.`,
        "Light-Dependent Reactions of Photosynthesis": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — LIGHT-DEPENDENT REACTIONS.
- Occur on the THYLAKOID membranes. Light excites electrons in chlorophyll (photosystems) → electrons pass down the electron transport chain → energy pumps H⁺ → chemiosmosis → ATP (photophosphorylation).
- PHOTOLYSIS of water: H₂O → 2H⁺ + ½O₂ + 2e⁻ (replaces lost electrons; O₂ is a waste product). NADP is reduced to reduced NADP.
- Products passed to the light-independent stage: ATP and reduced NADP.
REACTIONS: empty. GRAPHS: empty.`,
        "Light-Independent Reactions — Calvin Cycle": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — CALVIN CYCLE.
- In the STROMA. CO₂ combines with ribulose bisphosphate (RuBP, 5C) catalysed by RUBISCO → an unstable 6C → two molecules of glycerate-3-phosphate (GP, 3C).
- GP is reduced to triose phosphate (TP) using ATP and reduced NADP (from the light reactions).
- Some TP → glucose/organic molecules; most TP regenerates RuBP (using ATP). 6 turns fix enough carbon for one glucose.
REACTIONS: empty. GRAPHS: empty.`,
        "Limiting Factors for Photosynthesis": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — LIMITING FACTORS.
- The rate is limited by whichever factor is in shortest supply: LIGHT INTENSITY, CO₂ CONCENTRATION or TEMPERATURE.
- On a rate graph the line rises then PLATEAUS when another factor becomes limiting. Temperature affects enzyme (Rubisco) activity. Commercial growers optimise all three in glasshouses.
REACTIONS: empty. GRAPHS: empty.`,
        "Food Chains and Energy Flow in Ecosystems": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — ENERGY FLOW.
- Energy enters via producers (photosynthesis) and flows through trophic levels (producer → primary consumer → secondary…). Only ~10% transfers between levels.
- Energy is LOST as heat (respiration), in undigested material (faeces) and excretion → so food chains are short and biomass decreases up the chain (pyramids of energy/biomass).
REACTIONS: empty. GRAPHS: empty.`,
        "Gross and Net Primary Production": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — GPP & NPP.
- GROSS primary production (GPP) = the total chemical energy fixed by producers in photosynthesis (per area per time).
- NET primary production (NPP) = GPP − energy lost in RESPIRATION (R): NPP = GPP − R. NPP is the energy available to the next trophic level / for growth.
- Calculate efficiency of energy transfer = (energy of level ÷ energy of previous level) × 100.
REACTIONS: empty. GRAPHS: empty.`,
        "Carbon Cycle": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — CARBON CYCLE.
- CO₂ removed by PHOTOSYNTHESIS; returned by RESPIRATION (plants, animals, decomposers), COMBUSTION of fossil fuels, and decomposition.
- Carbon stored in biomass, fossil fuels and oceans. Human burning of fossil fuels raises atmospheric CO₂ → enhanced greenhouse effect / climate change.
REACTIONS: empty. GRAPHS: empty.`,
        "Nitrogen Cycle and Eutrophication": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — NITROGEN CYCLE & EUTROPHICATION.
- Stages: NITROGEN FIXATION (N₂ → ammonium, by Rhizobium/free-living bacteria), AMMONIFICATION (decomposers → ammonium), NITRIFICATION (ammonium → nitrite → nitrate, by nitrifying bacteria, aerobic), DENITRIFICATION (nitrate → N₂, anaerobic).
- EUTROPHICATION: fertiliser/sewage runoff adds nitrates → algal bloom → blocks light → plants die → decomposers multiply and use up O₂ → aquatic organisms die.
REACTIONS: empty. GRAPHS: empty.`,
        "Bacterial Growth Phases": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — BACTERIAL GROWTH CURVE.
- Four phases: LAG (adjusting, enzymes made, little division) → LOG/EXPONENTIAL (rapid division, nutrients plentiful) → STATIONARY (birth rate = death rate; nutrients limited, toxins build up) → DEATH/DECLINE (death rate > division).
- Bacteria divide by binary fission; number = initial × 2ⁿ (n = generations). Plot log of number vs time → straight line in the exponential phase.
REACTIONS: empty. GRAPHS: empty.`,
        "Aseptic Technique and Culture Media": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — ASEPTIC TECHNIQUE.
- Aseptic technique prevents CONTAMINATION (of the culture and the experimenter): work near a Bunsen flame (updraught), flame the loop/bottle necks, lift the lid at an angle, sterilise equipment (autoclave), seal but don't fully seal plates, incubate ≤25 °C in schools (no human pathogens).
- Culture media: agar with nutrients (carbon, nitrogen, minerals); broth or plates.
REACTIONS: empty. GRAPHS: empty.`,
        "Antibiotic Resistance": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — ANTIBIOTIC RESISTANCE.
- A chance MUTATION makes some bacteria resistant. When antibiotics are used, susceptible bacteria die but resistant ones SURVIVE and reproduce (natural selection) → the resistant allele increases → resistant population (e.g. MRSA).
- Spread accelerated by overuse/misuse and not finishing courses; reduce by prudent prescribing, finishing courses, hygiene, new antibiotics. Resistance genes can spread on PLASMIDS.
REACTIONS: empty. GRAPHS: empty.`,
        "Viruses — Influenza and Antigenic Variation": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — VIRUSES & ANTIGENIC VARIATION.
- Viruses are non-living: nucleic acid (DNA/RNA) in a protein capsid (some have an envelope with antigens, e.g. influenza's haemagglutinin/neuraminidase). They replicate only inside host cells.
- ANTIGENIC VARIATION: mutations change the surface antigens (antigenic drift/shift), so memory cells no longer recognise them → previous immunity/vaccines become ineffective → new vaccines needed each year (flu).
REACTIONS: empty. GRAPHS: empty.`,
        "Non-Specific Immunity and Phagocytosis": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — NON-SPECIFIC IMMUNITY & PHAGOCYTOSIS.
- Non-specific (innate) defences: barriers (skin, mucus), inflammation, and PHAGOCYTOSIS.
- Phagocytosis: a phagocyte (neutrophil/macrophage) engulfs a pathogen into a vesicle (phagosome) → LYSOSOMES fuse and release hydrolytic enzymes (lysozymes) → pathogen digested. Macrophages then present antigens (APC) to activate the specific response.
REACTIONS: empty. GRAPHS: empty.`,
        "Specific Humoral Immunity and B Cells": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — HUMORAL IMMUNITY (B CELLS).
- A B cell with a complementary antibody binds its antigen; with help from T-helper cells it is activated and undergoes CLONAL SELECTION and division (clonal expansion).
- Clones differentiate into PLASMA CELLS (secrete large amounts of specific antibody) and MEMORY B cells (long-lived → faster secondary response). Antibodies circulate in blood/lymph → "humoral".
REACTIONS: empty. GRAPHS: empty.`,
        "Antibody Structure": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — ANTIBODY STRUCTURE.
- A glycoprotein (immunoglobulin) of FOUR polypeptide chains (2 heavy + 2 light) held by disulfide bonds — a Y shape.
- VARIABLE region (tips) = the antigen-binding sites, with a specific shape COMPLEMENTARY to one antigen; CONSTANT region is the same in a class.
- Functions: AGGLUTINATION (clumping pathogens), neutralising toxins, marking pathogens for phagocytosis.
REACTIONS: empty. GRAPHS: empty.`,
        "Specific Cell-Mediated Immunity and T Cells": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — CELL-MEDIATED IMMUNITY (T CELLS).
- An antigen-presenting cell displays antigen → a T cell with the complementary receptor binds and is activated → clonal expansion.
- T-HELPER cells release cytokines that stimulate B cells and phagocytes; T-KILLER (cytotoxic) cells destroy infected/abnormal (cancer) cells; T-MEMORY cells give a rapid secondary response. "Cell-mediated" targets the body's own infected cells.
REACTIONS: empty. GRAPHS: empty.`,
        "Primary and Secondary Immune Response": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — PRIMARY vs SECONDARY RESPONSE.
- PRIMARY response (first exposure): slow, low antibody concentration; takes days as the specific cells must be selected and cloned → person may feel ill. MEMORY cells are produced.
- SECONDARY response (re-exposure to the same antigen): memory cells respond FASTER, produce MORE antibody for LONGER → pathogen destroyed before symptoms → immunity. Be able to read an antibody-concentration vs time graph.
REACTIONS: empty. GRAPHS: empty.`,
        "Vaccines and Herd Immunity": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — VACCINES & HERD IMMUNITY.
- A vaccine introduces antigens (dead/attenuated pathogen, or part of it) → triggers a primary response and forms MEMORY cells → on later infection a fast secondary response gives immunity.
- HERD IMMUNITY: if a high enough % of the population is immune, the pathogen cannot spread easily, protecting the unvaccinated. Boosters and new vaccines needed when antigens change.
REACTIONS: empty. GRAPHS: empty.`,
        "Monoclonal Antibodies": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — MONOCLONAL ANTIBODIES.
- Identical antibodies from a single B-cell clone, all specific to one antigen.
- Uses: PREGNANCY tests (detect hCG), DIAGNOSIS (e.g. detecting a specific antigen/disease marker), and TARGETED therapy (antibody delivers a drug to cancer cells → fewer side effects). ELISA tests use them.
- Ethical issues around production (use of animals).
REACTIONS: empty. GRAPHS: empty.`,
        "HIV and AIDS": `EDEXCEL IAL BIOLOGY UNIT 4 (WBI14) — HIV AND AIDS.
- HIV is a RETROVIRUS (RNA + reverse transcriptase) that infects T-HELPER cells. Reverse transcriptase makes DNA from its RNA, which inserts into the host genome.
- As T-helper cells are destroyed, the immune system is weakened → AIDS, where the person suffers OPPORTUNISTIC infections. Spread by body fluids; no cure — antiretroviral drugs slow progression. Antibiotics do NOT work on viruses.
REACTIONS: empty. GRAPHS: empty.`,
      },

      unit5: {
        "Glycolysis": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — GLYCOLYSIS.
- Occurs in the CYTOPLASM; does NOT need oxygen (first stage of both aerobic and anaerobic respiration).
- Glucose (6C) is PHOSPHORYLATED using 2 ATP, then split into two triose phosphate (3C). These are oxidised to two PYRUVATE (3C), producing 4 ATP (net +2 ATP) and 2 reduced NAD.
- Net products per glucose: 2 pyruvate, 2 ATP (net), 2 reduced NAD.
REACTIONS: empty. GRAPHS: empty.`,
        "Link Reaction": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — LINK REACTION.
- Occurs in the MITOCHONDRIAL MATRIX (pyruvate is actively transported in). Aerobic.
- Each pyruvate (3C) is DECARBOXYLATED (loses CO₂) and OXIDISED (reduces NAD) to an acetyl group (2C), which combines with coenzyme A → ACETYL CoA.
- Per glucose (2 pyruvate): 2 acetyl CoA, 2 CO₂, 2 reduced NAD. No ATP made directly.
REACTIONS: empty. GRAPHS: empty.`,
        "Krebs Cycle": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — KREBS CYCLE.
- In the mitochondrial MATRIX. Acetyl CoA (2C) combines with oxaloacetate (4C) → citrate (6C).
- Through the cycle: decarboxylation (CO₂ released) and dehydrogenation (NAD and FAD reduced) regenerate oxaloacetate.
- Per turn: 2 CO₂, 3 reduced NAD, 1 reduced FAD, 1 ATP (substrate-level). The cycle turns TWICE per glucose.
REACTIONS: empty. GRAPHS: empty.`,
        "Oxidative Phosphorylation and Chemiosmosis": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — OXIDATIVE PHOSPHORYLATION.
- On the INNER mitochondrial membrane (cristae). Reduced NAD and FAD release electrons to the ELECTRON TRANSPORT CHAIN; energy released pumps H⁺ into the intermembrane space → an electrochemical gradient.
- CHEMIOSMOSIS: H⁺ flow back through ATP SYNTHASE → ATP. OXYGEN is the FINAL electron acceptor, combining with electrons and H⁺ → water (without O₂ the chain backs up and stops).
- Produces most of the ATP (~ up to 34 ATP per glucose).
REACTIONS: empty. GRAPHS: empty.`,
        "Anaerobic Respiration": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — ANAEROBIC RESPIRATION.
- Without O₂, the electron transport chain stops, so NAD must be regenerated to keep glycolysis going.
- ANIMALS: pyruvate + reduced NAD → LACTATE (lactate fermentation); lactate later oxidised back in the liver (oxygen debt).
- YEAST/PLANTS: pyruvate → ETHANOL + CO₂ (alcoholic fermentation). Only the 2 ATP from glycolysis are made (much less than aerobic).
REACTIONS: empty. GRAPHS: empty.`,
        "Respiratory Quotient": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — RESPIRATORY QUOTIENT (RQ).
- RQ = CO₂ produced ÷ O₂ consumed. Carbohydrate ≈ 1.0; lipid ≈ 0.7; protein ≈ 0.9. Values above 1 suggest some anaerobic respiration.
- Measured with a RESPIROMETER (KOH/soda lime absorbs CO₂ to measure O₂ uptake first, then without it to find CO₂). Control: temperature, a control tube with non-living material.
REACTIONS: empty. GRAPHS: empty.`,
        "Homeostasis and Negative Feedback": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — HOMEOSTASIS & NEGATIVE FEEDBACK.
- Homeostasis = maintaining a stable internal environment (temperature, blood glucose, water potential, pH) for enzymes/cells to work.
- NEGATIVE FEEDBACK: a change is DETECTED by a receptor → a corrective response by an effector → returns the factor toward the set point (the response reverses the change). Involves coordination by nervous and endocrine systems.
REACTIONS: empty. GRAPHS: empty.`,
        "Thermoregulation": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — THERMOREGULATION.
- The HYPOTHALAMUS detects blood/skin temperature and coordinates responses (negative feedback).
- TOO HOT: vasodilation of skin arterioles (more heat lost), sweating (evaporative cooling), hairs flat. TOO COLD: vasoconstriction, shivering (respiration releases heat), hairs erect (insulating layer), less sweat; the liver may increase metabolic heat.
REACTIONS: empty. GRAPHS: empty.`,
        "Blood Glucose Regulation — Insulin and Glucagon": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — BLOOD GLUCOSE REGULATION.
- Controlled by the PANCREAS islets of Langerhans (β cells → insulin, α cells → glucagon).
- HIGH glucose → INSULIN: increases glucose uptake by cells (more channels) and conversion of glucose to GLYCOGEN in liver/muscle (glycogenesis) → glucose falls.
- LOW glucose → GLUCAGON: stimulates breakdown of glycogen to glucose (glycogenolysis) and gluconeogenesis in the liver → glucose rises. (Adrenaline also raises glucose.)
REACTIONS: empty. GRAPHS: empty.`,
        "Type 1 and Type 2 Diabetes": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — DIABETES.
- TYPE 1: the immune system destroys β cells → little/no insulin; usually develops young; treated with insulin injections + diet/monitoring.
- TYPE 2: cells become less RESPONSIVE to insulin (receptors less sensitive); linked to obesity, diet, inactivity, age, genetics; managed by diet, exercise, weight loss, sometimes drugs.
- Both: high blood glucose, glucose in urine; risks of long-term damage.
REACTIONS: empty. GRAPHS: empty.`,
        "Kidney Structure": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — KIDNEY STRUCTURE.
- Gross: cortex, medulla, pelvis; the functional unit is the NEPHRON.
- Nephron parts: glomerulus + Bowman's capsule (ultrafiltration), proximal convoluted tubule (selective reabsorption), loop of Henle (water/salt gradient), distal convoluted tubule and collecting duct (water reabsorption controlled by ADH).
- Functions: EXCRETION of urea and OSMOREGULATION (water balance).
REACTIONS: empty. GRAPHS: empty.`,
        "Ultrafiltration and Selective Reabsorption": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — ULTRAFILTRATION & SELECTIVE REABSORPTION.
- ULTRAFILTRATION: high blood pressure in the glomerulus (afferent wider than efferent arteriole) forces small molecules (water, glucose, ions, urea) through the basement membrane into the Bowman's capsule; blood cells and proteins are too big to pass.
- SELECTIVE REABSORPTION (mainly proximal convoluted tubule): all glucose and most ions/water are reabsorbed by ACTIVE TRANSPORT and co-transport, aided by microvilli and many mitochondria; useful substances returned to the blood.
REACTIONS: empty. GRAPHS: empty.`,
        "Loop of Henle — Countercurrent Multiplier": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — LOOP OF HENLE.
- Sets up a salt (Na⁺/Cl⁻) concentration gradient in the medulla so water can be reabsorbed. The ascending limb actively pumps out Na⁺/Cl⁻ (impermeable to water); this makes the medulla increasingly concentrated.
- COUNTERCURRENT MULTIPLIER: the descending limb (permeable to water) loses water to the concentrated medulla. The gradient lets the COLLECTING DUCT reabsorb water by osmosis → concentrated urine. Longer loops → more concentrated urine (desert animals).
REACTIONS: empty. GRAPHS: empty.`,
        "ADH and Osmoregulation": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — ADH & OSMOREGULATION.
- OSMORECEPTORS in the hypothalamus detect blood water potential. LOW water potential (dehydration) → posterior pituitary releases more ADH.
- ADH makes the collecting duct walls MORE PERMEABLE to water (inserts aquaporins) → more water reabsorbed → small volume of concentrated urine. High water potential → less ADH → dilute urine. Negative feedback.
REACTIONS: empty. GRAPHS: empty.`,
        "Neurone Structure": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — NEURONE STRUCTURE.
- Cell body (nucleus), DENDRITES (receive impulses), AXON (carries impulse away). Motor/sensory/relay neurones.
- MYELIN SHEATH (Schwann cells) insulates the axon, with gaps (NODES OF RANVIER) → faster (saltatory) conduction.
REACTIONS: empty. GRAPHS: empty.`,
        "Resting Potential": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — RESTING POTENTIAL.
- About −70 mV (inside negative relative to outside). Maintained by the SODIUM-POTASSIUM PUMP (active transport: 3 Na⁺ OUT, 2 K⁺ IN) and the membrane being more permeable to K⁺ (K⁺ leaks out).
- The axon is POLARISED and ready to conduct an impulse.
REACTIONS: empty. GRAPHS: empty.`,
        "Action Potential": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — ACTION POTENTIAL.
- A stimulus reaching THRESHOLD opens voltage-gated Na⁺ channels → Na⁺ floods IN → DEPOLARISATION (to ~+40 mV).
- Na⁺ channels close, K⁺ channels open → K⁺ moves OUT → REPOLARISATION → brief HYPERPOLARISATION → resting potential restored.
- ALL-OR-NOTHING (same size if threshold reached); a REFRACTORY PERIOD ensures one-way propagation and limits frequency.
REACTIONS: empty. GRAPHS: removed — describe the action-potential trace in words.`,
        "Saltatory Conduction": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — SALTATORY CONDUCTION.
- In MYELINATED neurones the action potential "jumps" from one node of Ranvier to the next (the myelin insulates between nodes) → much FASTER conduction.
- Speed also increases with greater axon diameter and higher temperature.
REACTIONS: empty. GRAPHS: empty.`,
        "Synaptic Transmission": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — SYNAPTIC TRANSMISSION.
- An action potential reaches the presynaptic knob → voltage-gated Ca²⁺ channels open → Ca²⁺ in → vesicles fuse and release NEUROTRANSMITTER (e.g. acetylcholine) by exocytosis.
- It diffuses across the synaptic cleft and binds RECEPTORS on the postsynaptic membrane → Na⁺ channels open → depolarisation → new action potential. Neurotransmitter is broken down (e.g. acetylcholinesterase) and recycled.
- Synapses ensure ONE-WAY transmission and allow summation.
REACTIONS: empty. GRAPHS: empty.`,
        "Endocrine Coordination": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — ENDOCRINE COORDINATION.
- Endocrine glands secrete HORMONES into the blood; they act on TARGET cells with complementary receptors. Slower, longer-lasting and more widespread than nervous signalling.
- Compare nervous (fast, electrical, short-lived, localised) vs endocrine (slower, chemical, longer-lasting, widespread). Examples: insulin/glucagon, ADH, adrenaline.
REACTIONS: empty. GRAPHS: empty.`,
        "PCR and Gel Electrophoresis": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — PCR & GEL ELECTROPHORESIS.
- PCR amplifies DNA in cycles: DENATURE (~95 °C, strands separate) → ANNEAL primers (~55 °C) → EXTEND (~72 °C, Taq polymerase adds nucleotides). Each cycle DOUBLES the DNA.
- GEL ELECTROPHORESIS separates fragments by SIZE: DNA is negatively charged → moves toward the ANODE; smaller fragments move further; compared with size markers. Used in profiling, screening, sequencing prep.
REACTIONS: empty. GRAPHS: empty.`,
        "Genetic Engineering and Recombinant DNA": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — GENETIC ENGINEERING.
- Isolate the desired gene (RESTRICTION ENZYMES cut at specific sequences leaving sticky ends, or made from mRNA by reverse transcriptase).
- Insert into a VECTOR (plasmid) cut with the same restriction enzyme; DNA LIGASE joins them → RECOMBINANT DNA. Transfer into host cells (bacteria) which express the gene → product (e.g. human INSULIN). Marker genes identify transformed cells.
- Issues: ethics, ecological risk, monopolies.
REACTIONS: empty. GRAPHS: empty.`,
        "CRISPR-Cas9 Gene Editing": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — CRISPR-Cas9.
- A precise gene-editing tool: a GUIDE RNA directs the Cas9 enzyme to a complementary target DNA sequence, where Cas9 CUTS the DNA; the cell's repair can disable a gene or insert a new sequence.
- Uses: research, potential treatment of genetic diseases, crop improvement. Ethical concerns: off-target effects, editing germline/embryos.
REACTIONS: empty. GRAPHS: empty.`,
        "Gene Therapy": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — GENE THERAPY.
- Treating a genetic disorder by delivering a functional allele (using a vector — often a modified virus or liposome) into the patient's cells.
- SOMATIC gene therapy (body cells, not inherited) vs GERMLINE (gametes/embryos, inherited — banned in humans). Challenges: getting the gene into enough cells, lasting expression, immune response, safety. Examples: SCID, cystic fibrosis trials.
REACTIONS: empty. GRAPHS: empty.`,
        "DNA Profiling": `EDEXCEL IAL BIOLOGY UNIT 5 (WBI15) — DNA PROFILING.
- Uses non-coding repeated sequences (STRs/VNTRs) that vary in number between individuals.
- Method: extract DNA → PCR amplify the repeat regions → gel electrophoresis separates fragments by size → a unique banding pattern ("fingerprint").
- Uses: forensic identification, paternity testing, conservation. The chance of two unrelated people matching is extremely low.
REACTIONS: empty. GRAPHS: empty.`,
      },

      unit6: {
        "Antibiotic Effectiveness — Zones of Inhibition": `EDEXCEL IAL BIOLOGY UNIT 6 (WBI16) — ZONES OF INHIBITION (practical).
- Spread bacteria evenly on agar; add discs soaked in different antibiotics (aseptic technique); incubate.
- A clear ZONE OF INHIBITION around a disc = bacteria killed/inhibited; measure the DIAMETER (or calculate area πr²). A larger zone = more effective antibiotic (or bacteria more sensitive).
- Controls: same bacterial lawn, disc size, volume, incubation; a control disc with no antibiotic. Compare means; consider concentration diffusion.
REACTIONS: empty. GRAPHS: empty.`,
        "Microbial Growth Curves": `EDEXCEL IAL BIOLOGY UNIT 6 (WBI16) — MICROBIAL GROWTH CURVES (practical).
- Measure population over time (turbidity with a colorimeter, or viable counts). Plot LOG of number vs time → the exponential phase is a straight line.
- Identify lag, log (exponential), stationary and death phases; calculate growth rate / number of generations (N = N₀ × 2ⁿ). Control temperature, nutrients, pH.
REACTIONS: empty. GRAPHS: empty.`,
        "Investigating Photosynthesis with DCPIP": `EDEXCEL IAL BIOLOGY UNIT 6 (WBI16) — DCPIP & PHOTOSYNTHESIS (practical).
- DCPIP is a blue redox indicator that turns COLOURLESS when REDUCED. In isolated chloroplasts (the Hill reaction), electrons from the light-dependent reactions reduce DCPIP instead of NADP.
- The rate of colour loss (measured with a colorimeter) indicates the rate of the light-dependent reactions. Vary light intensity/wavelength; keep chloroplast suspension, temperature constant; dark control.
REACTIONS: empty. GRAPHS: empty.`,
        "Respiration with a Respirometer": `EDEXCEL IAL BIOLOGY UNIT 6 (WBI16) — RESPIROMETER (practical).
- Measures O₂ uptake by respiring organisms/seeds: KOH (or soda lime) absorbs CO₂, so any volume change is due to O₂ being used → the manometer fluid moves toward the organism.
- Calculate rate of O₂ uptake per unit time/mass. Determine RQ by repeating without KOH. Controls: a tube with non-living material (to correct for pressure/temperature), constant temperature (water bath).
REACTIONS: empty. GRAPHS: empty.`,
        "Fermentation Rate Investigation": `EDEXCEL IAL BIOLOGY UNIT 6 (WBI16) — FERMENTATION RATE (practical).
- Anaerobic respiration of yeast produces ethanol + CO₂; measure the rate by the volume/rate of CO₂ released (gas syringe, or counting bubbles), or by mass loss.
- Vary temperature, sugar concentration or sugar type; keep yeast amount, volume, pH constant. Use a layer of oil to exclude oxygen (ensure anaerobic). Repeat and mean.
REACTIONS: empty. GRAPHS: empty.`,
        "Chromatography of Chloroplast Pigments": `EDEXCEL IAL BIOLOGY UNIT 6 (WBI16) — CHROMATOGRAPHY OF PIGMENTS (practical).
- Separates leaf pigments (chlorophyll a, chlorophyll b, carotene, xanthophyll) by their solubility in the solvent and affinity for the paper.
- Calculate Rf = distance moved by the pigment ÷ distance moved by the solvent front. Each pigment has a characteristic Rf and colour → identify them. Keep the solvent level below the spot; sealed tank.
REACTIONS: empty. GRAPHS: empty.`,
        "Advanced Statistical Tests — Mann-Whitney and Spearman's": `EDEXCEL IAL BIOLOGY UNIT 6 (WBI16) — ADVANCED STATS (practical).
- State a null hypothesis; compare the calculated statistic with the critical value at p = 0.05.
- MANN–WHITNEY U: tests for a significant DIFFERENCE between two sets of (ranked/non-normal) data. SPEARMAN'S RANK correlation (rₛ): tests for a CORRELATION between two ranked variables (rₛ from −1 to +1; near 0 = no correlation).
- Choose the right test: difference vs correlation; type/distribution of data.
REACTIONS: empty. GRAPHS: empty.`,
        "Evaluating Experimental Design": `EDEXCEL IAL BIOLOGY UNIT 6 (WBI16) — EVALUATING DESIGN (practical).
- Identify the independent, dependent and CONTROL variables and a suitable control. Judge VALIDITY (does it test what's intended? are variables controlled?) and RELIABILITY (repeats, sample size).
- Identify the main source of error (random/systematic) and suggest a realistic, targeted improvement; comment on whether conclusions are justified by the data and uncertainty.
REACTIONS: empty. GRAPHS: empty.`,
        "Microbiological Counting Techniques": `EDEXCEL IAL BIOLOGY UNIT 6 (WBI16) — COUNTING TECHNIQUES (practical).
- TOTAL count (e.g. haemocytometer or turbidity) counts all cells (living + dead). VIABLE count counts only living cells: make serial DILUTIONS, plate, count colonies (each colony = one viable cell), then multiply by the dilution factor.
- Choose plates with 20–100 colonies for accuracy; use aseptic technique; report as colony-forming units (CFU) per cm³.
REACTIONS: empty. GRAPHS: empty.`,
      },
    },

    physics: {
      unit1: {
        "Kinematics — SUVAT Equations": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — KINEMATICS (SUVAT).
- Distinguish SCALARS (distance, speed) from VECTORS (displacement, velocity, acceleration). Acceleration a = (v−u)/t.
- The four equations of uniformly accelerated motion: v = u + at ; s = ut + ½at² ; v² = u² + 2as ; s = ½(u+v)t.
- Take a consistent sign convention for direction; g = 9.81 m s⁻² downward.
WORKED-EXAMPLE MATERIAL: pick the SUVAT equation with the three knowns + one unknown; vertical-motion problems with g.
COMMON MISTAKES: mixing sign conventions; using SUVAT when acceleration is not constant.
REACTIONS: empty. GRAPHS: empty.`,
        "Graphs of Motion": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — GRAPHS OF MOTION.
- Displacement–time: GRADIENT = velocity (curved → changing velocity).
- Velocity–time: GRADIENT = acceleration; AREA under the line = displacement.
- Be able to convert between the graphs and read instantaneous values (tangent) and totals (area, e.g. trapezium/triangle).
REACTIONS: empty. GRAPHS: empty.`,
        "Projectile Motion": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — PROJECTILE MOTION.
- Horizontal and vertical motions are INDEPENDENT. Horizontal: constant velocity (no acceleration, ignoring air resistance). Vertical: uniform acceleration g.
- Resolve the launch velocity: vₓ = v cosθ, v_y = v sinθ. Use SUVAT vertically (time of flight, max height when v_y = 0) and horizontal range = vₓ × time.
WORKED-EXAMPLE MATERIAL: find range/max height/time of flight for a given launch speed and angle.
COMMON MISTAKES: applying g horizontally; not resolving the initial velocity.
REACTIONS: empty. GRAPHS: empty.`,
        "Free Fall and Terminal Velocity": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — FREE FALL & TERMINAL VELOCITY.
- In free fall the only force is weight → acceleration g = 9.81 m s⁻².
- With air resistance (drag), drag increases with speed; when DRAG = WEIGHT the resultant force is zero → acceleration = 0 → constant TERMINAL VELOCITY. Describe the velocity–time shape (rises, curve flattens to terminal velocity).
REACTIONS: empty. GRAPHS: empty.`,
        "Newton's Laws of Motion": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — NEWTON'S LAWS.
- 1st law: an object stays at rest / constant velocity unless a resultant force acts (inertia).
- 2nd law: F = ma (more generally F = Δp/Δt = rate of change of momentum). Resultant force in the direction of acceleration.
- 3rd law: forces occur in pairs — equal in magnitude, opposite in direction, on DIFFERENT objects, of the same type.
COMMON MISTAKES: pairing forces on the same object; forgetting "resultant" force.
REACTIONS: empty. GRAPHS: empty.`,
        "Free Body Diagrams and Resolving Forces": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — FREE-BODY DIAGRAMS & RESOLVING.
- Draw all forces acting ON the object (weight, normal, tension, friction, drag). RESOLVE forces into perpendicular components: along = F cosθ, perpendicular = F sinθ.
- For equilibrium, components in each direction sum to zero. The resultant of two forces can be found by components or a vector triangle/parallelogram.
WORKED-EXAMPLE MATERIAL: object on an inclined plane (resolve weight into mg sinθ along, mg cosθ perpendicular).
REACTIONS: empty. GRAPHS: empty.`,
        "Moments, Couples and Equilibrium": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — MOMENTS, COUPLES & EQUILIBRIUM.
- Moment = force × PERPENDICULAR distance from the pivot (N m). Principle of moments: for equilibrium, sum of clockwise moments = sum of anticlockwise moments.
- A COUPLE = two equal, opposite, parallel forces; its torque = force × distance between them. Centre of gravity = point where weight acts.
- Conditions for equilibrium: resultant force = 0 AND resultant moment = 0.
REACTIONS: empty. GRAPHS: empty.`,
        "Work, Energy and Power": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — WORK, ENERGY & POWER.
- Work done W = F s cosθ (J), where θ is the angle between force and displacement.
- Kinetic energy = ½mv²; gravitational PE = mgh (near Earth).
- Power = work done / time = energy transferred / time; also P = Fv. Efficiency = useful output / total input (×100%).
WORKED-EXAMPLE MATERIAL: power of a motor lifting a mass; efficiency calculations.
REACTIONS: empty. GRAPHS: empty.`,
        "Conservation of Energy": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — CONSERVATION OF ENERGY.
- Energy cannot be created or destroyed, only transferred. In mechanics, GPE ↔ KE (e.g. a falling object: loss in mgh = gain in ½mv², ignoring resistance).
- With friction/air resistance, some energy is transferred to heat → less KE gained. Use energy conservation as an alternative to SUVAT.
REACTIONS: empty. GRAPHS: empty.`,
        "Momentum and Impulse": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — MOMENTUM & IMPULSE.
- Momentum p = mv (vector, kg m s⁻¹). Newton's 2nd law: F = Δp/Δt.
- IMPULSE = F × t = change in momentum (Δp) = area under a force–time graph.
- CONSERVATION of momentum: in a closed system total momentum before = total after (apply with directions/signs).
WORKED-EXAMPLE MATERIAL: collision/explosion momentum problems; force from a rate of change of momentum.
REACTIONS: empty. GRAPHS: empty.`,
        "Elastic and Inelastic Collisions": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — ELASTIC vs INELASTIC COLLISIONS.
- Momentum is ALWAYS conserved in collisions. KINETIC ENERGY is conserved only in an ELASTIC collision; in an INELASTIC collision some KE → other forms (heat/sound/deformation).
- Test by calculating total KE before and after. In a perfectly inelastic collision the objects stick together.
REACTIONS: empty. GRAPHS: empty.`,
        "Density and Pressure": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — DENSITY & PRESSURE.
- Density ρ = m/V (kg m⁻³). Pressure p = F/A (Pa = N m⁻²).
- Pressure in a fluid at depth h: p = hρg. Upthrust = weight of fluid displaced (Archimedes).
REACTIONS: empty. GRAPHS: empty.`,
        "Hooke's Law and Spring Constant": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — HOOKE'S LAW.
- Force F = kΔx (k = spring/force constant, N m⁻¹) up to the LIMIT OF PROPORTIONALITY (linear region).
- Springs in SERIES: extensions add (softer overall); in PARALLEL: share the load (stiffer). Elastic strain energy stored = ½FΔx = ½kΔx² = area under the force–extension graph.
WORKED-EXAMPLE MATERIAL: find k from a force–extension gradient; energy stored.
REACTIONS: empty. GRAPHS: empty.`,
        "Young's Modulus": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — YOUNG'S MODULUS.
- Stress σ = F/A (Pa); Strain ε = Δx/x (no units). YOUNG MODULUS E = stress/strain (Pa) — a property of the material.
- Determined from the GRADIENT of the straight (elastic) part of a stress–strain graph. Experiment: measure extension of a wire for known loads; A from diameter (micrometer).
WORKED-EXAMPLE MATERIAL: calculate E from F, A, x and Δx; find the load to give a certain strain.
REACTIONS: empty. GRAPHS: empty.`,
        "Stress-Strain Graphs and Material Properties": `EDEXCEL IAL PHYSICS UNIT 1 (WPH11) — STRESS–STRAIN GRAPHS.
- Key points: limit of proportionality (Hooke's law ends), ELASTIC LIMIT (returns to original shape below it), YIELD point (large strain for little stress), ultimate tensile stress, breaking/fracture.
- ELASTIC deformation returns; PLASTIC deformation is permanent. BRITTLE materials (e.g. glass) break with little plastic deformation; DUCTILE materials (e.g. copper) stretch a lot. Area under the graph = energy stored/work done per unit volume.
REACTIONS: empty. GRAPHS: removed — describe the stress–strain curve and key points in words.`,
      },

      unit2: {
        "Wave Properties — Amplitude, Frequency, Wavelength": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — WAVE PROPERTIES.
- Amplitude (max displacement), wavelength λ (one full cycle), frequency f (cycles per second, Hz), period T = 1/f, phase difference.
- Wave equation: v = fλ. A wave transfers energy without transferring matter.
WORKED-EXAMPLE MATERIAL: use v = fλ; read amplitude/wavelength/period off a displacement graph.
REACTIONS: empty. GRAPHS: empty.`,
        "Transverse and Longitudinal Waves": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — TRANSVERSE vs LONGITUDINAL.
- TRANSVERSE: oscillations PERPENDICULAR to the direction of energy transfer (light/all EM, water surface, transverse seismic S-waves); can be polarised.
- LONGITUDINAL: oscillations PARALLEL to energy transfer (sound, P-waves); compressions and rarefactions; cannot be polarised.
REACTIONS: empty. GRAPHS: empty.`,
        "Reflection and Refraction — Snell's Law": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — REFLECTION & REFRACTION.
- Refractive index n = c/v (speed in vacuum ÷ speed in medium). SNELL'S LAW: n₁ sinθ₁ = n₂ sinθ₂ (angles to the normal).
- Light slows and bends TOWARD the normal entering a denser medium (higher n). Refraction changes speed and wavelength but not frequency.
WORKED-EXAMPLE MATERIAL: find an angle of refraction or a refractive index with Snell's law.
REACTIONS: empty. GRAPHS: empty.`,
        "Total Internal Reflection and Optical Fibres": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — TIR & OPTICAL FIBRES.
- TIR occurs when light in a denser medium hits the boundary at an angle GREATER than the CRITICAL ANGLE; sin θc = n₂/n₁ (= 1/n for a medium–air boundary).
- Optical fibres guide light by repeated TIR (core of higher n surrounded by cladding of lower n). Uses: communications, endoscopes.
REACTIONS: empty. GRAPHS: empty.`,
        "Diffraction and Superposition": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — DIFFRACTION & SUPERPOSITION.
- Diffraction = spreading of waves through a gap or round an edge; most pronounced when the gap ≈ wavelength.
- SUPERPOSITION: when waves meet, displacements ADD. CONSTRUCTIVE (in phase, path difference = nλ) → larger amplitude; DESTRUCTIVE (antiphase, path difference = (n+½)λ) → cancellation. Requires COHERENT sources (constant phase difference, same frequency).
REACTIONS: empty. GRAPHS: empty.`,
        "Stationary Waves — Nodes and Antinodes": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — STATIONARY (STANDING) WAVES.
- Formed by two waves of the same frequency travelling in opposite directions (e.g. a wave and its reflection) superposing. No net energy transfer.
- NODES (zero amplitude, antiphase points) and ANTINODES (maximum amplitude); adjacent nodes are λ/2 apart. Harmonics on a string: fundamental λ = 2L, f = (n/2L)√(T/μ)-style relationships. Compare with progressive waves (all points different amplitude/phase there).
REACTIONS: empty. GRAPHS: empty.`,
        "Interference and Young's Double Slit": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — YOUNG'S DOUBLE SLIT.
- Coherent light through two slits → interference fringes. Fringe spacing w = λD/s, where D = slit-to-screen distance, s = slit separation.
- Bright fringes where path difference = nλ (constructive), dark where (n+½)λ. Demonstrates the WAVE nature of light; used to measure λ.
WORKED-EXAMPLE MATERIAL: calculate λ from w, D and s.
REACTIONS: empty. GRAPHS: empty.`,
        "Diffraction Gratings": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — DIFFRACTION GRATINGS.
- Grating equation: d sinθ = nλ, where d = slit spacing (= 1/lines per metre), n = order.
- Many slits → sharper, brighter maxima than a double slit → more accurate λ measurement; used in spectroscopy.
WORKED-EXAMPLE MATERIAL: find λ or the maximum order from d sinθ = nλ.
REACTIONS: empty. GRAPHS: empty.`,
        "Polarisation": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — POLARISATION.
- Only TRANSVERSE waves can be polarised (oscillation restricted to one plane) — evidence that light is transverse.
- A polarising filter transmits one plane; crossing two filters at 90° blocks the light. Applications: polaroid sunglasses, stress analysis, LCDs.
REACTIONS: empty. GRAPHS: empty.`,
        "Electromagnetic Spectrum": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — EM SPECTRUM.
- All EM waves are transverse, travel at c = 3.0×10⁸ m s⁻¹ in a vacuum, and are oscillating electric and magnetic fields.
- Order (increasing frequency/decreasing λ): radio → microwave → infrared → visible → ultraviolet → X-ray → gamma. Higher frequency = higher photon energy.
REACTIONS: empty. GRAPHS: empty.`,
        "Photoelectric Effect": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — PHOTOELECTRIC EFFECT.
- Light above a THRESHOLD FREQUENCY ejects electrons from a metal surface instantly. Evidence for the PHOTON (particle) model — a wave model can't explain the threshold or instant emission.
- Einstein's equation: hf = φ + KE_max, where φ = work function (minimum energy to release an electron), KE_max = ½mv²_max.
- Increasing intensity (more photons) increases the NUMBER of electrons, not their max KE; increasing frequency increases max KE.
WORKED-EXAMPLE MATERIAL: find max KE or threshold frequency from hf = φ + KE_max.
REACTIONS: empty. GRAPHS: empty.`,
        "Photons and Energy Levels": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — PHOTONS & ENERGY LEVELS.
- Photon energy E = hf = hc/λ. Electronvolt: 1 eV = 1.6×10⁻¹⁹ J.
- Electrons occupy discrete ENERGY LEVELS in an atom. An electron drops between levels and emits a photon of energy ΔE = hf = E₁ − E₂ → line emission spectra; absorption raises electrons → line absorption spectra.
WORKED-EXAMPLE MATERIAL: find the wavelength of a photon emitted in a level transition.
REACTIONS: empty. GRAPHS: empty.`,
        "De Broglie Wavelength and Wave-Particle Duality": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — DE BROGLIE / DUALITY.
- Particles have a wavelength: de Broglie λ = h/p = h/(mv). Wave–particle DUALITY: light and matter show both wave (diffraction/interference) and particle (photoelectric effect) behaviour.
- Electron DIFFRACTION (electrons through a crystal give rings) is evidence that particles behave as waves; faster electrons → smaller λ → smaller rings.
WORKED-EXAMPLE MATERIAL: calculate the de Broglie wavelength of an electron.
REACTIONS: empty. GRAPHS: empty.`,
        "Electric Current, Charge and Drift Velocity": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — CURRENT, CHARGE, DRIFT VELOCITY.
- Current I = ΔQ/Δt (charge flow per second); Q = It. Charge is quantised (electron charge e = 1.6×10⁻¹⁹ C).
- I = nAvq, where n = charge-carrier density, A = cross-sectional area, v = drift velocity, q = charge per carrier. Explains why drift velocity is small yet current flows quickly.
WORKED-EXAMPLE MATERIAL: use I = nAvq to find drift velocity.
REACTIONS: empty. GRAPHS: empty.`,
        "Resistance, Resistivity and Ohm's Law": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — RESISTANCE & RESISTIVITY.
- Resistance R = V/I (Ω). OHM'S LAW: for an ohmic conductor at constant temperature, I ∝ V (R constant).
- Resistivity ρ: R = ρL/A (ρ in Ω m). Resistance increases with length, decreases with area; resistivity is a material property that rises with temperature for metals.
WORKED-EXAMPLE MATERIAL: find resistivity from R, L, A; or R for a wire.
REACTIONS: empty. GRAPHS: empty.`,
        "I-V Characteristics": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — I–V CHARACTERISTICS.
- OHMIC conductor / fixed resistor: straight line through the origin (constant R).
- FILAMENT LAMP: S-shaped curve — resistance increases as it heats (ions vibrate more).
- DIODE: conducts only in forward bias above ~0.6 V, blocks reverse. Thermistor (NTC): resistance falls as temperature rises.
GRAPHS: removed — describe each I–V curve shape in words.
REACTIONS: empty.`,
        "Power and Energy in Circuits": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — POWER & ENERGY IN CIRCUITS.
- Power P = VI = I²R = V²/R (W). Energy transferred W = VIt = Pt. The kilowatt-hour for energy use.
WORKED-EXAMPLE MATERIAL: choose the right power formula from the known quantities; energy/cost calculations.
REACTIONS: empty. GRAPHS: empty.`,
        "Series and Parallel Circuits": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — SERIES & PARALLEL.
- SERIES: same current; voltages add; R_total = R₁ + R₂ + …
- PARALLEL: same voltage across each branch; currents add; 1/R_total = 1/R₁ + 1/R₂ + … (total resistance is less than the smallest).
WORKED-EXAMPLE MATERIAL: find currents/voltages in a mixed series–parallel circuit.
REACTIONS: empty. GRAPHS: empty.`,
        "EMF and Internal Resistance": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — EMF & INTERNAL RESISTANCE.
- EMF ε = energy per unit charge supplied by a source. A real cell has internal resistance r: ε = I(R + r) = V + Ir, where V (terminal pd) = ε − Ir ("lost volts" = Ir).
- Experiment: vary R, plot V against I → straight line; y-intercept = ε, gradient = −r.
WORKED-EXAMPLE MATERIAL: find ε and r from a V–I graph or two readings.
REACTIONS: empty. GRAPHS: empty.`,
        "Kirchhoff's Laws": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — KIRCHHOFF'S LAWS.
- 1st law (current/charge conservation): the sum of currents INTO a junction = sum of currents OUT.
- 2nd law (energy conservation): around any closed loop, the sum of EMFs = sum of pd drops (ΣIR).
WORKED-EXAMPLE MATERIAL: set up and solve simultaneous equations for a two-loop circuit.
REACTIONS: empty. GRAPHS: empty.`,
        "Potential Dividers": `EDEXCEL IAL PHYSICS UNIT 2 (WPH12) — POTENTIAL DIVIDERS.
- Two resistors in series split the supply voltage in proportion to their resistance: V_out = V_in × R₂/(R₁ + R₂).
- Using an LDR or thermistor in the divider makes V_out respond to light/temperature (sensor circuits); a potentiometer gives a variable output.
WORKED-EXAMPLE MATERIAL: calculate V_out; explain how the output changes as an LDR/thermistor's resistance changes.
REACTIONS: empty. GRAPHS: empty.`,
      },

      unit3: {
        "Measurement Uncertainty and Error Analysis": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — UNCERTAINTY & ERROR ANALYSIS (practical).
- Absolute uncertainty = ± the smallest meaningful interval (often ½ the resolution, or the spread of repeats). % uncertainty = (absolute uncertainty ÷ value) × 100.
- COMBINING: for quantities multiplied/divided, ADD the % uncertainties; for a power, MULTIPLY the % uncertainty by the power; for added/subtracted quantities, add the ABSOLUTE uncertainties.
- Reduce % uncertainty by measuring larger values (e.g. time many oscillations, measure a long length).
WORKED-EXAMPLE MATERIAL: combine uncertainties to get the overall uncertainty in a calculated quantity (e.g. resistivity, g).
REACTIONS: empty. GRAPHS: empty.`,
        "Significant Figures and Recording Results": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — SIG FIGS & RECORDING (practical).
- Record raw data to the instrument's resolution and to a CONSISTENT number of decimal places. Quote a calculated answer to the same number of significant figures as the least precise measurement used.
- Tabulate with column headings AND units (quantity / unit); include uncertainties.
REACTIONS: empty. GRAPHS: empty.`,
        "Types of Error — Random and Systematic": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — RANDOM vs SYSTEMATIC ERRORS (practical).
- RANDOM errors scatter readings either side of the true value (reaction time, reading judgement) → reduce by repeating and averaging.
- SYSTEMATIC errors shift all readings the same way (zero error, parallax, uncalibrated instrument) → repeats DON'T help; fix by correcting the zero/calibration or technique. A ZERO ERROR is a common systematic error.
- Accuracy = close to true value; precision = consistent repeats.
REACTIONS: empty. GRAPHS: empty.`,
        "Graph Skills — Best-Fit Lines and Gradients": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — GRAPH SKILLS (practical).
- Plot the independent variable on the x-axis; use a sensible scale filling the page; label axes with units; plot accurately; draw a LINE OF BEST FIT (balance points above/below).
- GRADIENT = Δy/Δx using a large triangle; the y-intercept has a physical meaning. Use the gradient/intercept to find a physical quantity (e.g. g, k, ε, Young modulus).
- Error bars + a worst-acceptable line give the uncertainty in the gradient.
REACTIONS: empty. GRAPHS: empty.`,
        "Linearising Relationships": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — LINEARISING (practical).
- Rearrange a relationship into the form y = mx + c so a straight-line graph can be plotted and the gradient/intercept used.
- Examples: T = 2π√(l/g) → plot T² against l (gradient 4π²/g); for an exponential, plot ln(quantity) against time (gradient = the decay constant).
REACTIONS: empty. GRAPHS: empty.`,
        "Free-Fall Experiment — Determining g": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — DETERMINING g (practical).
- Drop an object through measured heights h and time the fall t (light gates / electromagnet + timer). Use h = ½gt² → plot h against t² → gradient = ½g, so g = 2 × gradient.
- Reduce errors: use an electronic timer (not a stopwatch), repeat, measure h accurately.
REACTIONS: empty. GRAPHS: empty.`,
        "Young's Modulus Experiment": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — YOUNG'S MODULUS (practical).
- Stretch a long thin wire with increasing loads; measure extension (with a marker + ruler/travelling microscope) and the original length; find diameter with a micrometer (A = πd²/4).
- Plot stress (F/A) against strain (Δx/L); the gradient of the straight region = Young modulus E. Use a long thin wire to get measurable extension.
REACTIONS: empty. GRAPHS: empty.`,
        "Spring Constant Experiment": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — SPRING CONSTANT (practical).
- Add known masses to a spring; measure extension for each. Plot force (mg) against extension → straight line through origin; gradient = spring constant k.
- Alternatively from oscillations: T = 2π√(m/k) → plot T² against m (gradient = 4π²/k).
REACTIONS: empty. GRAPHS: empty.`,
        "Newton's Second Law Verification": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — F = ma VERIFICATION (practical).
- Use a trolley/glider with light gates (or a ticker timer) to measure acceleration for known resultant forces (hanging masses) and known total mass.
- Plot acceleration against force (gradient = 1/mass) at constant mass; and acceleration against 1/mass at constant force. Compensate for friction (slight slope). Confirms a ∝ F and a ∝ 1/m.
REACTIONS: empty. GRAPHS: empty.`,
        "Refractive Index of Glass": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — REFRACTIVE INDEX OF GLASS (practical).
- Trace a ray through a glass block; measure the angles of incidence and refraction (to the normal) for several angles. Plot sin θ_incidence against sin θ_refraction → gradient = refractive index n (Snell's law n = sinθ₁/sinθ₂).
- Reduce error: sharp pencil rays, measure angles with a protractor carefully, repeat.
REACTIONS: empty. GRAPHS: empty.`,
        "I-V Characteristics Investigation": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — I–V CHARACTERISTICS (practical).
- Use a potential divider to vary the voltage across a component (better than a series rheostat — gives a full 0→max range); measure I and V with ammeter (series) and voltmeter (parallel).
- Reverse the supply for negative values (diode). Plot I against V to find the component's behaviour (ohmic / filament / diode). Take readings quickly to limit heating.
REACTIONS: empty. GRAPHS: empty.`,
        "Wavelength Measurement — Double Slit and Grating": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — MEASURING WAVELENGTH (practical).
- Double slit: w = λD/s → measure fringe spacing w (measure several fringes and divide), slit separation s and distance D → λ = ws/D.
- Diffraction grating: d sinθ = nλ → measure the angle to a known order → λ. Use a laser safely (never look into the beam). Grating gives sharper maxima → smaller % uncertainty.
REACTIONS: empty. GRAPHS: empty.`,
        "Resistivity Experiment": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — RESISTIVITY (practical).
- Measure the resistance R of different lengths L of wire (R = V/I); find the cross-sectional area A from the diameter (micrometer, A = πd²/4).
- Plot R against L → gradient = ρ/A → resistivity ρ = gradient × A. Keep the current low / take readings quickly to avoid heating changing R.
REACTIONS: empty. GRAPHS: empty.`,
        "EMF and Internal Resistance Experiment": `EDEXCEL IAL PHYSICS UNIT 3 (WPH13) — EMF & INTERNAL RESISTANCE (practical).
- Vary the external resistance R; record terminal pd V and current I. Use V = ε − Ir → plot V against I: y-intercept = EMF ε, gradient = −r (internal resistance).
- Don't short the cell for long (it heats and r changes). Repeat for reliability.
REACTIONS: empty. GRAPHS: empty.`,
      },

      unit4: {
        "Momentum in Two Dimensions and Impulse": `EDEXCEL IAL PHYSICS UNIT 4 (WPH14) — MOMENTUM IN 2D & IMPULSE.
- Momentum is conserved in EACH perpendicular direction separately. Resolve velocities into components and apply conservation to x and y.
- Impulse = FΔt = Δp = area under a force–time graph (vector). Useful for collisions at an angle and explosions.
WORKED-EXAMPLE MATERIAL: a 2D collision — resolve and apply conservation in both directions.
REACTIONS: empty. GRAPHS: empty.`,
        "Circular Motion": `EDEXCEL IAL PHYSICS UNIT 4 (WPH14) — CIRCULAR MOTION.
- Angular velocity ω = 2π/T = 2πf; speed v = ωr. CENTRIPETAL acceleration a = v²/r = ω²r, directed toward the centre.
- CENTRIPETAL FORCE F = mv²/r = mω²r is the RESULTANT force toward the centre (provided by tension/gravity/friction/normal — it is not an extra force). Examples: vehicle on a bend, conical pendulum, vertical circle.
WORKED-EXAMPLE MATERIAL: find the centripetal force/speed; minimum speed at the top of a vertical circle.
REACTIONS: empty. GRAPHS: empty.`,
        "Electric Fields and Coulomb's Law": `EDEXCEL IAL PHYSICS UNIT 4 (WPH14) — COULOMB'S LAW.
- Force between point charges: F = Qq/(4πε₀r²) = kQq/r² (k ≈ 8.99×10⁹). Like charges repel, unlike attract; inverse-square law.
- Field lines: radial out from +, into −. Compare with gravitational fields (both inverse-square; gravity always attractive, electric can attract or repel).
WORKED-EXAMPLE MATERIAL: calculate the force between two charges.
REACTIONS: empty. GRAPHS: empty.`,
        "Electric Field Strength and Potential": `EDEXCEL IAL PHYSICS UNIT 4 (WPH14) — E-FIELD STRENGTH & POTENTIAL.
- Electric field strength E = F/Q (N C⁻¹ = V m⁻¹). Radial field around a point charge: E = Q/(4πε₀r²); UNIFORM field between parallel plates: E = V/d.
- Electric potential V = Q/(4πε₀r) (zero at infinity); work done moving charge W = QΔV; E = −potential gradient. Equipotentials are perpendicular to field lines.
WORKED-EXAMPLE MATERIAL: force on a charge between plates (E = V/d); accelerate a charge through a pd (½mv² = QV).
REACTIONS: empty. GRAPHS: empty.`,
        "Capacitance": `EDEXCEL IAL PHYSICS UNIT 4 (WPH14) — CAPACITANCE.
- Capacitance C = Q/V (farad, F) — charge stored per unit pd.
- Capacitors in PARALLEL: C_total = C₁ + C₂ + …; in SERIES: 1/C_total = 1/C₁ + 1/C₂ + …
WORKED-EXAMPLE MATERIAL: charge stored Q = CV; combine capacitors.
REACTIONS: empty. GRAPHS: empty.`,
        "Energy Stored in a Capacitor": `EDEXCEL IAL PHYSICS UNIT 4 (WPH14) — ENERGY IN A CAPACITOR.
- Energy stored W = ½QV = ½CV² = ½Q²/C. It equals the AREA under a charge–pd graph (the ½ comes from the pd rising as it charges).
WORKED-EXAMPLE MATERIAL: energy stored; energy released on discharge.
REACTIONS: empty. GRAPHS: empty.`,
        "Capacitor Charging and Discharging": `EDEXCEL IAL PHYSICS UNIT 4 (WPH14) — CHARGING & DISCHARGING (RC).
- Exponential discharge: Q = Q₀e^(−t/RC) (and V, I follow the same form). TIME CONSTANT τ = RC = time to fall to 1/e (≈37%) of the initial value.
- Charging: Q rises toward Q₀ as Q = Q₀(1 − e^(−t/RC)). Linearise by plotting ln Q against t → gradient = −1/RC.
WORKED-EXAMPLE MATERIAL: find Q or V after time t; find RC from a ln-graph gradient.
GRAPHS: removed — describe the exponential decay/charging curves in words.
REACTIONS: empty.`,
        "Magnetic Flux Density and Force on a Current": `EDEXCEL IAL PHYSICS UNIT 4 (WPH14) — FORCE ON A CURRENT.
- Force on a current-carrying conductor in a magnetic field: F = BIL sinθ (θ = angle between current and field; maximum when perpendicular). B = magnetic flux density (tesla, T).
- Direction by FLEMING'S LEFT-HAND RULE (thumb = force/motion, first finger = field, second finger = current).
WORKED-EXAMPLE MATERIAL: calculate the force on a wire; deduce the force direction.
REACTIONS: empty. GRAPHS: empty.`,
        "Force on a Moving Charged Particle": `EDEXCEL IAL PHYSICS UNIT 4 (WPH14) — FORCE ON A MOVING CHARGE.
- Force on a charge moving through a magnetic field: F = BQv sinθ. Perpendicular to velocity → CIRCULAR motion: BQv = mv²/r → r = mv/(BQ).
- Used in mass spectrometers, cyclotrons. The magnetic force does no work (always perpendicular to motion).
WORKED-EXAMPLE MATERIAL: radius of a charged particle's path; combine with E = V/d (velocity selector).
REACTIONS: empty. GRAPHS: empty.`,
        "Electromagnetic Induction and Faraday's Law": `EDEXCEL IAL PHYSICS UNIT 4 (WPH14) — ELECTROMAGNETIC INDUCTION.
- Magnetic flux Φ = BA; flux linkage = NΦ. FARADAY'S LAW: induced EMF = rate of change of flux linkage, ε = −N(ΔΦ/Δt).
- LENZ'S LAW (the minus sign): the induced current opposes the change causing it (conservation of energy). Applications: generators, transformers.
WORKED-EXAMPLE MATERIAL: EMF induced when a coil's flux changes; explain a direction with Lenz's law.
REACTIONS: empty. GRAPHS: empty.`,
        "The Nuclear Atom and Particle Accelerators": `EDEXCEL IAL PHYSICS UNIT 4 (WPH14) — NUCLEAR ATOM & ACCELERATORS.
- Rutherford scattering (most α pass straight through, a few deflect greatly) → a tiny, dense, positive NUCLEUS with mostly empty atom. Nuclear radius ∝ A^(1/3).
- Particle accelerators (linac, cyclotron) use electric fields to accelerate and magnetic fields to steer charged particles; high energies probe structure / create particles (E = mc²). Detectors track curved paths.
REACTIONS: empty. GRAPHS: empty.`,
        "Particle Physics — Quarks and the Standard Model": `EDEXCEL IAL PHYSICS UNIT 4 (WPH14) — PARTICLE PHYSICS.
- Fundamental particles: LEPTONS (electron, muon, neutrinos) and QUARKS (up, down, strange…). HADRONS are made of quarks: BARYONS = 3 quarks (proton uud, neutron udd), MESONS = quark + antiquark.
- Conservation laws in interactions: charge, baryon number, lepton number (and strangeness in strong/EM). Forces via EXCHANGE PARTICLES (photon = EM, W/Z bosons = weak, gluons = strong). Beta decay: n → p + e⁻ + ν̄ via a W⁻ boson.
WORKED-EXAMPLE MATERIAL: deduce a particle's quark composition; check an interaction with conservation rules.
REACTIONS: empty. GRAPHS: empty.`,
      },

      unit5: {
        "Specific Heat Capacity and Thermal Energy": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — SPECIFIC HEAT CAPACITY.
- Energy to change temperature: Q = mcDeltaT (c = specific heat capacity, J kg^-1 K^-1). Energy for a change of state: Q = mL (L = specific latent heat of fusion/vaporisation), at CONSTANT temperature.
- Heating/cooling curve: sloped sections = temperature change (Q = mcDeltaT); FLAT sections = change of state (Q = mL), energy goes to breaking bonds not raising temperature.
WORKED-EXAMPLE MATERIAL: energy to heat then melt/boil a substance.
REACTIONS: empty. GRAPHS: empty.`,
        "Internal Energy and Temperature": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — INTERNAL ENERGY & TEMPERATURE.
- Internal energy = sum of the randomly distributed kinetic and potential energies of all the particles. For an IDEAL GAS there is no intermolecular PE, so internal energy is entirely KINETIC.
- Temperature (in KELVIN) is proportional to the mean kinetic energy of particles. T(K) = theta(C) + 273; absolute zero (0 K) = minimum internal energy.
REACTIONS: empty. GRAPHS: empty.`,
        "Ideal Gas Laws — Boyle's and Charles's Law": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — GAS LAWS.
- Boyle's law: pV = constant at constant T (p inversely proportional to V). Charles's law: V/T = constant at constant p. Pressure law: p/T = constant at constant V.
- Combined: p1V1/T1 = p2V2/T2 (T in kelvin always).
WORKED-EXAMPLE MATERIAL: find a new pressure/volume/temperature using the combined gas law.
REACTIONS: empty. GRAPHS: empty.`,
        "Ideal Gas Equation and Kinetic Theory": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — IDEAL GAS EQUATION & KINETIC THEORY.
- Ideal gas equation: pV = nRT (R = 8.31) OR pV = NkT (k = Boltzmann constant 1.38x10^-23, N = number of molecules).
- Kinetic theory pressure: pV = (1/3)Nm<c^2>. Mean kinetic energy of a molecule: (1/2)m<c^2> = (3/2)kT, directly proportional to temperature in kelvin. Assumptions: many identical molecules in random motion, negligible volume, elastic collisions, no forces between collisions.
WORKED-EXAMPLE MATERIAL: find the rms speed or mean KE at a temperature.
REACTIONS: empty. GRAPHS: empty.`,
        "Simple Harmonic Motion — Equations and Graphs": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — SHM.
- DEFINING condition: acceleration a = -omega^2 x (proportional to displacement, directed toward equilibrium). omega = 2(pi)f = 2(pi)/T.
- x = A cos(omega t); v = +/- omega sqrt(A^2 - x^2), v_max = omega A at the centre; a_max = omega^2 A at the amplitude.
- Period formulae: simple pendulum T = 2(pi)sqrt(l/g); mass-spring T = 2(pi)sqrt(m/k) — period is INDEPENDENT of amplitude.
WORKED-EXAMPLE MATERIAL: find period/frequency, max speed, or acceleration at a displacement.
GRAPHS: removed — describe the x-t (cosine), v-t and a-t relationships in words.
REACTIONS: empty.`,
        "Energy in Simple Harmonic Motion": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — ENERGY IN SHM.
- Energy continuously exchanges between KINETIC and POTENTIAL; total energy is constant (proportional to A^2): E = (1/2)m(omega^2)(A^2).
- Maximum KE at the equilibrium position (x = 0, v = v_max); maximum PE at the amplitude (x = +/-A, v = 0).
REACTIONS: empty. GRAPHS: empty.`,
        "Damping and Resonance": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — DAMPING & RESONANCE.
- DAMPING: resistive forces remove energy, so amplitude decreases over time. Light (underdamped) oscillates with decreasing amplitude; critical damping returns to equilibrium fastest without oscillating; heavy (overdamped) returns slowly.
- RESONANCE: when the driving frequency = natural frequency, energy transfer is maximum, so amplitude peaks. Increasing damping LOWERS and BROADENS the resonance peak. Examples: bridges, tuning circuits, MRI.
REACTIONS: empty. GRAPHS: empty.`,
        "Nuclear Radiation — Alpha, Beta, Gamma": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — RADIOACTIVITY.
- ALPHA (helium nucleus): +2 charge, highly ionising, stopped by paper/few cm air, deflected in fields. BETA-minus (high-energy electron): -1, stopped by a few mm of aluminium, moderately ionising. GAMMA (EM photon): no charge, least ionising, reduced by thick lead/concrete.
- Decay equations conserve mass number A and proton number Z. Radiation is random and spontaneous.
WORKED-EXAMPLE MATERIAL: complete a decay equation; identify radiation by penetration/deflection.
REACTIONS: empty. GRAPHS: empty.`,
        "Half-Life and Radioactive Decay Equations": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — HALF-LIFE & DECAY.
- Activity A = (lambda)N (lambda = decay constant); N = N0 e^(-lambda t) and A = A0 e^(-lambda t). HALF-LIFE t1/2 = ln2/lambda = 0.693/lambda. Activity in becquerel (Bq) = decays per second.
- Decay is random (cannot predict one nucleus) but the large-number behaviour is exponential. Linearise: ln A vs t gives gradient = -lambda.
WORKED-EXAMPLE MATERIAL: find remaining nuclei/activity after a time; find lambda or t1/2.
GRAPHS: removed — describe the exponential decay curve and constant half-life in words.
REACTIONS: empty.`,
        "Binding Energy and Mass Defect (E = mc²)": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — BINDING ENERGY.
- MASS DEFECT = mass of the separate nucleons minus mass of the nucleus. BINDING ENERGY = (mass defect)c^2 (energy to split the nucleus into nucleons). 1 u corresponds to 931.5 MeV.
- Binding energy PER NUCLEON peaks at iron-56 (most stable). Lighter nuclei release energy by FUSION; heavier by FISSION (moving toward the peak).
WORKED-EXAMPLE MATERIAL: calculate binding energy / energy released from a mass change using E = mc^2 (or mass defect x 931.5 MeV).
GRAPHS: removed — describe the binding-energy-per-nucleon curve in words.
REACTIONS: empty.`,
        "Nuclear Fission and Fusion": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — FISSION & FUSION.
- FISSION: a heavy nucleus (U-235) absorbs a neutron, splits into two smaller nuclei + 2-3 neutrons + energy, giving a CHAIN REACTION. Reactor: fuel, MODERATOR (slows neutrons), CONTROL RODS (absorb neutrons), coolant, shielding.
- FUSION: light nuclei (hydrogen isotopes) join to give helium + energy; needs very high temperature/pressure to overcome electrostatic repulsion (in stars). Both release energy because the products have higher binding energy per nucleon.
REACTIONS: empty. GRAPHS: empty.`,
        "Newton's Law of Gravitation": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — NEWTON'S LAW OF GRAVITATION.
- Force between two masses: F = G m1 m2 / r^2 (G = 6.67x10^-11), always ATTRACTIVE; inverse-square law.
- A radial field around a point/spherical mass. Compare with electric fields (both inverse-square; gravity only attractive).
WORKED-EXAMPLE MATERIAL: gravitational force between two bodies; combine with circular motion for orbits.
REACTIONS: empty. GRAPHS: empty.`,
        "Gravitational Field Strength (Radial Fields)": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — GRAVITATIONAL FIELD STRENGTH.
- g = F/m (N kg^-1). For a radial field: g = GM/r^2 (inverse-square). Near a surface g is approximately uniform (parallel field lines).
- Field lines point radially inward toward the mass; g decreases with the square of distance from the centre.
WORKED-EXAMPLE MATERIAL: g at a distance from a planet's centre; compare g at the surface and in orbit.
REACTIONS: empty. GRAPHS: empty.`,
        "Gravitational Potential": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — GRAVITATIONAL POTENTIAL.
- Gravitational potential V = -GM/r (J kg^-1), NEGATIVE, zero at infinity (work done per unit mass bringing a mass from infinity). Gravitational PE = mV = -GMm/r.
- g = -potential gradient (-dV/dr). Equipotentials are circles around a point mass.
WORKED-EXAMPLE MATERIAL: work to move a mass between two points; escape considerations.
REACTIONS: empty. GRAPHS: empty.`,
        "Orbital Motion and Kepler's Third Law": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — ORBITAL MOTION.
- For a circular orbit, gravity provides the centripetal force: GMm/r^2 = mv^2/r, so v = sqrt(GM/r); period from v = 2(pi)r/T gives T^2 = (4(pi)^2/GM) r^3, i.e. KEPLER'S THIRD LAW T^2 proportional to r^3.
- GEOSTATIONARY orbit: period 24 h, equatorial, same direction as Earth's spin, so it appears fixed (used for communications).
WORKED-EXAMPLE MATERIAL: find orbital speed/period/radius; geostationary orbit calculation.
REACTIONS: empty. GRAPHS: empty.`,
        "Astrophysics — Stellar Luminosity and Stefan's Law": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — STELLAR LUMINOSITY.
- LUMINOSITY L = total power radiated. STEFAN'S LAW: L = 4(pi)r^2(sigma)T^4 (sigma = Stefan constant) — luminosity depends on surface area and the FOURTH power of temperature.
- WIEN'S LAW: lambda_max x T = constant — hotter stars peak at shorter wavelengths (bluer). Intensity at a distance: I = L/(4(pi)d^2) (inverse-square); standard candles give distance.
WORKED-EXAMPLE MATERIAL: find a star's luminosity from r and T; surface temperature from lambda_max.
REACTIONS: empty. GRAPHS: empty.`,
        "Hertzsprung-Russell Diagram": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — HERTZSPRUNG-RUSSELL DIAGRAM.
- A plot of LUMINOSITY (y) against TEMPERATURE (x, hot on the LEFT). Main features: the MAIN SEQUENCE (stars fusing hydrogen), RED GIANTS/SUPERGIANTS (top right, cool but very luminous), WHITE DWARFS (bottom left, hot but dim).
- Stellar evolution: a star spends most of its life on the main sequence; low/medium mass becomes red giant then planetary nebula then white dwarf; massive becomes supergiant then supernova then neutron star/black hole.
REACTIONS: empty. GRAPHS: empty.`,
        "Cosmology — Hubble's Law and the Big Bang": `EDEXCEL IAL PHYSICS UNIT 5 (WPH15) — COSMOLOGY.
- REDSHIFT: light from receding galaxies is shifted to longer wavelengths; z = (change in lambda)/lambda is approximately v/c (for v much less than c). HUBBLE'S LAW: v = H0 d (recession speed proportional to distance), so the universe is EXPANDING.
- BIG BANG: the universe began hot and dense and has expanded/cooled. Evidence: Hubble's law, the cosmic microwave background (CMB about 2.7 K), and the abundance of hydrogen/helium. Age is approximately 1/H0.
WORKED-EXAMPLE MATERIAL: find recession speed/distance from Hubble's law; estimate the age of the universe.
REACTIONS: empty. GRAPHS: empty.`,
      },

      unit6: {
        "Advanced Uncertainty Analysis": `EDEXCEL IAL PHYSICS UNIT 6 (WPH16) — ADVANCED UNCERTAINTY (practical).
- Find the % uncertainty of each measurement (absolute uncertainty / value x 100). COMBINE: ADD % uncertainties for quantities multiplied or divided; MULTIPLY a % uncertainty by the power for a quantity raised to a power; add ABSOLUTE uncertainties for quantities added/subtracted.
- Uncertainty in a gradient: draw a "worst acceptable" line through the error bars; (best gradient - worst gradient) gives the uncertainty. Reduce % uncertainty by measuring larger quantities and repeating.
WORKED-EXAMPLE MATERIAL: overall % uncertainty in a result (e.g. resistivity, Young modulus, g) and which measurement dominates.
REACTIONS: empty. GRAPHS: empty.`,
        "Evaluating Experimental Design in Physics": `EDEXCEL IAL PHYSICS UNIT 6 (WPH16) — EVALUATING DESIGN (practical).
- Identify independent, dependent and CONTROL variables; choose apparatus with suitable resolution and a sensible range. Judge VALIDITY (controls a fair test) and RELIABILITY (repeats, consistency).
- Identify the main error source (random/systematic) and give a targeted, realistic improvement; state whether the conclusion is supported by the data and the uncertainty.
REACTIONS: empty. GRAPHS: empty.`,
        "SHM Experiments — Pendulum and Mass-Spring": `EDEXCEL IAL PHYSICS UNIT 6 (WPH16) — SHM EXPERIMENTS (practical).
- Simple pendulum: time MANY oscillations (e.g. 20) and divide, for several lengths l; T = 2(pi)sqrt(l/g), so plot T^2 against l, gradient = 4(pi)^2/g, so g = 4(pi)^2/gradient.
- Mass-spring: T = 2(pi)sqrt(m/k); plot T^2 against m, gradient = 4(pi)^2/k. Use small amplitudes; time many swings to reduce % timing uncertainty; a fiducial marker at the centre.
REACTIONS: empty. GRAPHS: empty.`,
        "Investigating Capacitor Discharge": `EDEXCEL IAL PHYSICS UNIT 6 (WPH16) — CAPACITOR DISCHARGE (practical).
- Discharge a capacitor through a resistor; record pd (or current) against time (data logger / voltmeter + stopwatch). V = V0 e^(-t/RC).
- Find the TIME CONSTANT RC: either read the time to fall to 37% of V0, or plot ln V against t, gradient = -1/RC. Compare with the calculated RC.
REACTIONS: empty. GRAPHS: empty.`,
        "Magnetic Field Investigations": `EDEXCEL IAL PHYSICS UNIT 6 (WPH16) — MAGNETIC FIELD (practical).
- Measure the force on a current-carrying wire in a magnetic field using a top-pan balance: F = BIL. Vary current I and measure the change in reading (force); plot force against I, gradient = BL, so B = gradient/L.
- Keep length in the field constant; use a known field/magnet; zero the balance.
REACTIONS: empty. GRAPHS: empty.`,
        "Radiation Safety and Measurements": `EDEXCEL IAL PHYSICS UNIT 6 (WPH16) — RADIATION (practical).
- Always subtract BACKGROUND count rate from readings. Safety: handle sources with tongs, keep at arm's length, minimise exposure time, store in a lead-lined box, point away from people.
- Investigate absorption (count rate vs thickness of absorber) to identify radiation type, or verify the inverse-square law for gamma (count rate proportional to 1/d^2 — plot count rate against 1/d^2). Repeat and take means; counting is random so longer counts are more reliable.
REACTIONS: empty. GRAPHS: empty.`,
      },
    },

    maths: {
      unit1: {
        "Algebra and Functions": `EDEXCEL IAL MATHS P1 (WMA11) — ALGEBRA AND FUNCTIONS. Overview should be one short line; put the depth into WORKED EXAMPLES.
- Indices: a^m x a^n = a^(m+n); a^m / a^n = a^(m-n); (a^m)^n = a^(mn); a^0 = 1; a^(-n) = 1/a^n; a^(1/n) = nth root; a^(m/n) = (nth root of a)^m.
- Surds: simplify (sqrt(ab)=sqrt a x sqrt b); rationalise denominators — monomial (x sqrt a / sqrt a) and binomial (multiply by the conjugate, (a+sqrt b)(a-sqrt b)=a^2-b).
- Quadratics: complete the square a(x+p)^2+q (vertex), discriminant b^2-4ac (>0 two real roots, =0 one repeated, <0 none), solve by factorising/formula/completing the square; quadratic inequalities (solve then sketch/number line).
- Simultaneous equations (linear + quadratic by substitution -> a quadratic). Polynomials: expand, factorise, factor theorem (if f(a)=0 then (x-a) is a factor), remainder theorem.
- Graphs: sketch cubics, reciprocals y=k/x; transformations y=f(x+a) (left a), y=f(x)+a (up a), y=af(x) (vertical stretch a), y=f(ax) (horizontal stretch 1/a), y=-f(x), y=f(-x).
WORKED-EXAMPLE MATERIAL: complete the square + use the discriminant; rationalise a surd; solve a quadratic inequality; use the factor theorem to factorise a cubic.
COMMON MISTAKES: dropping +/- on square roots; sign slips completing the square; wrong inequality direction.
REACTIONS: empty. GRAPHS: empty.`,
        "Coordinate Geometry in the (x, y) Plane": `EDEXCEL IAL MATHS P1 (WMA11) — COORDINATE GEOMETRY (STRAIGHT LINES).
- Gradient m = (y2-y1)/(x2-x1). Line forms: y = mx + c; y - y1 = m(x - x1); ax + by + c = 0.
- Parallel lines have equal gradient; perpendicular lines have m1 x m2 = -1. Distance between two points = sqrt((x2-x1)^2 + (y2-y1)^2). Midpoint = ((x1+x2)/2, (y1+y2)/2).
WORKED-EXAMPLE MATERIAL: equation of a line through two points; equation of the perpendicular bisector of a segment; show two lines are perpendicular.
COMMON MISTAKES: negative-reciprocal slip for perpendicular; not simplifying to the required form.
REACTIONS: empty. GRAPHS: empty.`,
        "Trigonometry": `EDEXCEL IAL MATHS P1 (WMA11) — TRIGONOMETRY.
- Right-angled: SOH CAH TOA. Any triangle: sine rule a/sinA = b/sinB = c/sinC; cosine rule a^2 = b^2 + c^2 - 2bc cosA; area = (1/2)ab sinC.
- Exact values for 30, 45, 60 degrees. Radians: pi rad = 180 deg; arc length s = r(theta); sector area = (1/2)r^2(theta).
- Graphs of sin, cos, tan (period, amplitude, asymptotes); solve equations like sin x = 0.5 over a given interval using the CAST diagram / symmetry.
WORKED-EXAMPLE MATERIAL: cosine rule for a missing side/angle; solve a trig equation in 0 to 360; arc length and sector area.
COMMON MISTAKES: calculator in wrong mode; missing solutions in the interval.
REACTIONS: empty. GRAPHS: empty.`,
        "Differentiation": `EDEXCEL IAL MATHS P1 (WMA11) — DIFFERENTIATION.
- From first principles: gradient = limit as h->0 of (f(x+h)-f(x))/h. Differentiate x^n -> n x^(n-1) (including negative and fractional n); sums, differences, constant multiples.
- Uses: gradient of a curve at a point; equations of tangents and normals; stationary points (set dy/dx = 0, classify with the second derivative d2y/dx2 or a sign test); increasing/decreasing functions.
WORKED-EXAMPLE MATERIAL: find and classify stationary points; equation of a tangent and a normal at a point.
COMMON MISTAKES: forgetting to rewrite roots/fractions as powers before differentiating; misclassifying stationary points.
REACTIONS: empty. GRAPHS: empty.`,
        "Integration": `EDEXCEL IAL MATHS P1 (WMA11) — INTEGRATION.
- Indefinite integration is the reverse of differentiation: integral of x^n = x^(n+1)/(n+1) + c (n not equal to -1). Always include the constant of integration c.
- Find the equation of a curve given its gradient function and a point on it (use the point to find c).
WORKED-EXAMPLE MATERIAL: integrate a polynomial; find a curve through a given point from its gradient function.
COMMON MISTAKES: omitting +c; not converting surds/fractions to powers first.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit2: {
        "Proof": `EDEXCEL IAL MATHS P2 (WMA12) — PROOF.
- Proof by deduction (logical steps from given assumptions). Proof by exhaustion (check all cases). Disproof by counterexample (one example that breaks the statement).
WORKED-EXAMPLE MATERIAL: disprove a statement with a counterexample; a short deductive proof.
REACTIONS: empty. GRAPHS: empty.`,
        "Algebra and Functions": `EDEXCEL IAL MATHS P2 (WMA12) — ALGEBRA AND FUNCTIONS.
- Algebraic (long) division by (ax + b). Factor theorem: if f(b/a) = 0 then (ax - b) is a factor. Remainder theorem: the remainder on dividing f(x) by (ax - b) is f(b/a). Factorise cubics fully.
WORKED-EXAMPLE MATERIAL: use the factor theorem to factorise a cubic, then solve f(x)=0; find a remainder.
COMMON MISTAKES: sign errors in the theorem (b/a vs -b/a); incomplete factorisation.
REACTIONS: empty. GRAPHS: empty.`,
        "Coordinate Geometry in the (x, y) Plane": `EDEXCEL IAL MATHS P2 (WMA12) — COORDINATE GEOMETRY (THE CIRCLE).
- Circle: (x - a)^2 + (y - b)^2 = r^2 has centre (a, b), radius r; expand to x^2 + y^2 + 2gx + 2fy + c = 0 (centre (-g,-f), radius sqrt(g^2+f^2-c)).
- Properties: the angle in a semicircle is 90 deg; the perpendicular from the centre bisects a chord; a tangent is perpendicular to the radius at the point of contact. Line-circle intersection via substitution then the discriminant.
WORKED-EXAMPLE MATERIAL: find centre/radius from the general form; equation of a tangent to a circle at a point.
COMMON MISTAKES: sign of the centre from 2g/2f; forgetting to complete the square.
REACTIONS: empty. GRAPHS: empty.`,
        "Sequences and Series": `EDEXCEL IAL MATHS P2 (WMA12) — SEQUENCES AND SERIES.
- Arithmetic: nth term a + (n-1)d; sum Sn = n/2(2a + (n-1)d) = n/2(a + l). Geometric: nth term a r^(n-1); sum Sn = a(1 - r^n)/(1 - r); sum to infinity a/(1 - r) ONLY for |r| < 1 (convergent). Sigma notation.
- Binomial expansion (a + b)^n for a positive integer n using Pascal's triangle or nCr = n!/(r!(n-r)!).
WORKED-EXAMPLE MATERIAL: geometric sum to infinity; a specified term/coefficient in a binomial expansion; arithmetic series sum.
COMMON MISTAKES: using sum-to-infinity when |r| >= 1; off-by-one in n; nCr errors.
REACTIONS: empty. GRAPHS: empty.`,
        "Exponentials and Logarithms": `EDEXCEL IAL MATHS P2 (WMA12) — EXPONENTIALS AND LOGARITHMS.
- y = e^x (gradient = e^x) and y = ln x are inverses (reflections in y = x). Log laws: log(xy)=log x+log y; log(x/y)=log x-log y; log(x^n)=n log x; log_a a = 1; change of base.
- Solve a^x = b by taking logs. Model growth/decay. Linearise: y = a x^n -> log y = log a + n log x (straight line, gradient n); y = a b^x -> ln y = ln a + x ln b.
WORKED-EXAMPLE MATERIAL: solve 2^x = 10; reduce experimental data to linear form and find the constants from a log graph.
COMMON MISTAKES: log of a sum (does not split); mixing log and ln; domain (x>0).
REACTIONS: empty. GRAPHS: empty.`,
        "Trigonometry": `EDEXCEL IAL MATHS P2 (WMA12) — TRIGONOMETRY (IDENTITIES).
- Identities: sin^2(x) + cos^2(x) = 1; tan x = sin x / cos x; 1 + tan^2 x = sec^2 x; 1 + cot^2 x = cosec^2 x. Definitions of sec, cosec, cot (reciprocals).
- Solve equations by rearranging to a quadratic in one ratio using an identity.
WORKED-EXAMPLE MATERIAL: solve 2 sin^2 x = 1 + cos x in an interval using sin^2 = 1 - cos^2.
COMMON MISTAKES: losing solutions when dividing by a trig term; interval errors.
REACTIONS: empty. GRAPHS: empty.`,
        "Differentiation": `EDEXCEL IAL MATHS P2 (WMA12) — DIFFERENTIATION (RULES).
- Chain rule dy/dx = dy/du x du/dx; product rule d(uv) = u v' + v u'; quotient rule d(u/v) = (v u' - u v')/v^2. Differentiate e^x, e^(kx), ln x, sin x, cos x, tan x. Connected rates of change.
WORKED-EXAMPLE MATERIAL: differentiate a product/quotient with trig/exponential; a connected rates problem (e.g. dV/dt from dr/dt).
COMMON MISTAKES: forgetting the inner-derivative in the chain rule; quotient-rule sign order.
REACTIONS: empty. GRAPHS: empty.`,
        "Integration": `EDEXCEL IAL MATHS P2 (WMA12) — INTEGRATION (DEFINITE + METHODS).
- Definite integral = area under a curve (area below the x-axis counts as negative); area between two curves. Integrate e^x, 1/x (-> ln|x| + c), sin, cos. Integration by substitution. Trapezium rule for an estimate.
WORKED-EXAMPLE MATERIAL: definite integral for an area; integration by substitution; trapezium-rule estimate (state whether over/underestimate from concavity).
COMMON MISTAKES: ignoring negative areas; limits not changed under substitution.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit3: {
        "Algebra and Functions": `EDEXCEL IAL MATHS P3 (WMA13) — ALGEBRA AND FUNCTIONS.
- Partial fractions: distinct linear factors A/(x+a)+B/(x+b); repeated factor A/(x+a)+B/(x+a)^2; quadratic factor A/(x+a)+(Bx+C)/(quadratic).
- Modulus function |f(x)|: sketch y = |f(x)| and y = f(|x|); solve |f(x)| = a / |f(x)| = |g(x)| by cases. Functions: domain and range; composite fg(x); inverse f^-1 (exists only if one-to-one; reflect in y = x).
WORKED-EXAMPLE MATERIAL: decompose into partial fractions; solve a modulus equation; find a composite/inverse and its domain.
COMMON MISTAKES: missing cases in modulus equations; wrong order in fg vs gf.
REACTIONS: empty. GRAPHS: empty.`,
        "Trigonometry": `EDEXCEL IAL MATHS P3 (WMA13) — TRIGONOMETRY (COMPOUND/DOUBLE ANGLE).
- Compound angles: sin(A+/-B), cos(A+/-B), tan(A+/-B). Double angle: sin2A = 2 sinA cosA; cos2A = cos^2 A - sin^2 A = 2cos^2 A - 1 = 1 - 2 sin^2 A; tan2A.
- R sin(theta + alpha) form: R = sqrt(a^2 + b^2), tan alpha = b/a — find max/min and solve a cos + b sin = c. Small-angle approximations (radians): sin x ~ x, tan x ~ x, cos x ~ 1 - x^2/2. Inverse trig arcsin/arccos/arctan (domains and ranges).
WORKED-EXAMPLE MATERIAL: write a cos x + b sin x as R cos(x - alpha) and solve; prove an identity using double-angle formulae.
COMMON MISTAKES: wrong cos2A form for the situation; degrees/radians mix-ups.
REACTIONS: empty. GRAPHS: empty.`,
        "Exponentials and Logarithms": `EDEXCEL IAL MATHS P3 (WMA13) — EXPONENTIALS AND LOGARITHMS.
- Differentiate and integrate e^(ax+b); further exponential growth/decay models; combine with logs to solve. (Builds on P2 log laws.)
WORKED-EXAMPLE MATERIAL: solve an equation involving e^(ax+b); interpret a growth/decay model.
REACTIONS: empty. GRAPHS: empty.`,
        "Differentiation": `EDEXCEL IAL MATHS P3 (WMA13) — DIFFERENTIATION (IMPLICIT/PARAMETRIC).
- Implicit differentiation: differentiate both sides w.r.t. x (d/dx of y^2 = 2y dy/dx, etc.), then make dy/dx the subject. Parametric: dy/dx = (dy/dt)/(dx/dt). Differentiate inverse trig: d/dx arcsin x = 1/sqrt(1-x^2); d/dx arctan x = 1/(1+x^2). Second derivatives; connected rates.
WORKED-EXAMPLE MATERIAL: tangent to an implicit curve; gradient of a parametric curve at a parameter value.
COMMON MISTAKES: forgetting dy/dx when differentiating y-terms implicitly.
REACTIONS: empty. GRAPHS: empty.`,
        "Integration": `EDEXCEL IAL MATHS P3 (WMA13) — INTEGRATION (PARTS/VOLUMES).
- Integration by parts: integral of u dv = uv - integral of v du (choose u by LATE). Integration using partial fractions. Standard results to arctan/arcsin forms (integral of 1/(a^2+x^2) = (1/a)arctan(x/a)). Volumes of revolution V = pi integral y^2 dx (about x-axis).
WORKED-EXAMPLE MATERIAL: integrate x e^x or x ln x by parts; a volume of revolution.
COMMON MISTAKES: wrong choice of u; forgetting pi / squaring y in volumes.
REACTIONS: empty. GRAPHS: empty.`,
        "Numerical Methods": `EDEXCEL IAL MATHS P3 (WMA13) — NUMERICAL METHODS.
- Locate a root by a sign change of f over [a,b] (continuity). Iteration x_(n+1) = g(x_n); converges if |g'(x)| < 1 near the root; staircase/cobweb diagrams. Newton-Raphson: x_(n+1) = x_n - f(x_n)/f'(x_n).
WORKED-EXAMPLE MATERIAL: show a root lies in an interval by sign change; carry out 2-3 Newton-Raphson iterations.
COMMON MISTAKES: not stating continuity for sign change; rounding too early in iterations.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit4: {
        "Proof": `EDEXCEL IAL MATHS P4 (WMA14) — PROOF.
- Proof by contradiction (assume the negation, derive a contradiction; e.g. sqrt 2 is irrational, infinitely many primes). Proof by induction: basis (n=1), inductive step (assume true for n=k, prove for n=k+1), conclusion — for series sums and divisibility.
WORKED-EXAMPLE MATERIAL: prove a summation formula by induction; a short proof by contradiction.
COMMON MISTAKES: weak/missing inductive step; not stating the conclusion sentence.
REACTIONS: empty. GRAPHS: empty.`,
        "Algebra and Functions": `EDEXCEL IAL MATHS P4 (WMA14) — ALGEBRA AND FUNCTIONS.
- Further partial fractions (including for use in binomial expansion and integration).
WORKED-EXAMPLE MATERIAL: decompose a rational expression then expand or integrate it.
REACTIONS: empty. GRAPHS: empty.`,
        "Coordinate Geometry in the (x, y) Plane": `EDEXCEL IAL MATHS P4 (WMA14) — COORDINATE GEOMETRY (PARAMETRIC).
- Parametric equations x = f(t), y = g(t): convert to Cartesian by eliminating the parameter; gradient dy/dx = (dy/dt)/(dx/dt); tangents and normals; area under a parametric curve = integral of y (dx/dt) dt.
WORKED-EXAMPLE MATERIAL: eliminate the parameter to get the Cartesian equation; tangent to a parametric curve.
REACTIONS: empty. GRAPHS: empty.`,
        "Binomial Expansion": `EDEXCEL IAL MATHS P4 (WMA14) — BINOMIAL EXPANSION (RATIONAL n).
- (1 + x)^n = 1 + n x + n(n-1)/2! x^2 + n(n-1)(n-2)/3! x^3 + ... valid for |x| < 1. For (a + bx)^n rewrite as a^n (1 + bx/a)^n; state the range of validity. Use partial fractions first when needed; use for approximations.
WORKED-EXAMPLE MATERIAL: expand (1 + x)^(1/2) or (a + bx)^(-1) to a few terms and give the valid range; use it to estimate a value.
COMMON MISTAKES: forgetting to factor out a^n; wrong validity range.
REACTIONS: empty. GRAPHS: empty.`,
        "Differentiation": `EDEXCEL IAL MATHS P4 (WMA14) — DIFFERENTIATION (FURTHER).
- Further implicit and parametric differentiation, including second derivatives d2y/dx2; further connected rates of change.
WORKED-EXAMPLE MATERIAL: second derivative of an implicit/parametric curve; a connected-rates problem.
REACTIONS: empty. GRAPHS: empty.`,
        "Integration": `EDEXCEL IAL MATHS P4 (WMA14) — INTEGRATION (FURTHER).
- Further integration techniques; integrals leading to arctan/arcsin; further volumes of revolution; (first-order linear differential equations by integrating factor if in the specification version).
WORKED-EXAMPLE MATERIAL: a harder substitution or by-parts integral; a volume of revolution.
REACTIONS: empty. GRAPHS: empty.`,
        "Vectors": `EDEXCEL IAL MATHS P4 (WMA14) — VECTORS (3D).
- 3D vectors in column or i, j, k form; magnitude |v| = sqrt(x^2+y^2+z^2); unit vector v/|v|; position vectors. Scalar (dot) product a.b = a1b1+a2b2+a3b3 = |a||b|cos(theta); perpendicular when a.b = 0; angle between vectors.
- Vector equation of a line r = a + t b; find intersections; parallel and SKEW lines (not parallel, do not meet); angle between lines.
WORKED-EXAMPLE MATERIAL: angle between two vectors using the dot product; show two lines are skew; find the point of intersection of two lines.
COMMON MISTAKES: using position vectors instead of direction vectors for the angle between lines; arithmetic in the dot product.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit5: {
        "Mathematical Models in Mechanics": `EDEXCEL IAL MATHS M1 (WME01) — MATHEMATICAL MODELS IN MECHANICS.
- Common modelling assumptions and what they mean: particle (mass at a point, no air resistance/size), light (negligible mass), inextensible string (constant length), smooth surface (no friction), rigid body. Be able to state and evaluate the effect of each.
REACTIONS: empty. GRAPHS: empty.`,
        "Vectors in Mechanics": `EDEXCEL IAL MATHS M1 (WME01) — VECTORS IN MECHANICS.
- Represent forces/velocities as i and j vectors; resolve into components; add to find a resultant; magnitude = sqrt(x^2+y^2) and direction = arctan(y/x). Newton's second law in vector form F = m a.
WORKED-EXAMPLE MATERIAL: resultant of forces given as vectors; acceleration from a resultant force.
REACTIONS: empty. GRAPHS: empty.`,
        "Kinematics of a Particle Moving in a Straight Line": `EDEXCEL IAL MATHS M1 (WME01) — KINEMATICS (STRAIGHT LINE).
- SUVAT: v=u+at; s=ut+(1/2)at^2; v^2=u^2+2as; s=(1/2)(u+v)t. Velocity-time graph: gradient = acceleration, area = displacement; displacement-time gradient = velocity.
- Non-uniform acceleration with calculus: v = ds/dt, a = dv/dt; integrate to get s from v, using initial conditions.
WORKED-EXAMPLE MATERIAL: a multi-stage v-t graph (areas for displacement); a calculus kinematics problem.
COMMON MISTAKES: sign convention for direction; using SUVAT when a is not constant.
REACTIONS: empty. GRAPHS: empty.`,
        "Dynamics of a Particle Moving in a Straight Line or Plane": `EDEXCEL IAL MATHS M1 (WME01) — DYNAMICS.
- Newton's 2nd law F = ma; weight W = mg. Connected particles (a string over a smooth pulley / Atwood machine; particles on a table and hanging): set up F = ma for each, with the same acceleration and equal tension. Friction F <= mu R (equal to mu R at the point of slipping or while moving). On an incline resolve weight into mg sin(theta) along and mg cos(theta) perpendicular.
WORKED-EXAMPLE MATERIAL: connected-particles over a pulley (find acceleration and tension); a particle on a rough incline.
COMMON MISTAKES: using the wrong weight component; forgetting the normal reaction changes on an incline.
REACTIONS: empty. GRAPHS: empty.`,
        "Statics of a Particle": `EDEXCEL IAL MATHS M1 (WME01) — STATICS OF A PARTICLE.
- In equilibrium the resultant force is zero: resolve in two perpendicular directions and set each sum to zero. Use a triangle of forces. With friction, limiting equilibrium uses F = mu R.
WORKED-EXAMPLE MATERIAL: find unknown forces/tension for a particle in equilibrium (e.g. hanging on two strings); a body about to slip on a rough plane.
REACTIONS: empty. GRAPHS: empty.`,
        "Moments": `EDEXCEL IAL MATHS M1 (WME01) — MOMENTS.
- Moment = force x perpendicular distance from the pivot (N m). Principle of moments: for equilibrium, total clockwise moments = total anticlockwise moments. Apply to a beam/rod (find reactions at supports; the point where it is about to tilt has zero reaction at the other support).
WORKED-EXAMPLE MATERIAL: a uniform/non-uniform beam on two supports — find the reactions; find where a mass can be placed before it tips.
COMMON MISTAKES: using the distance not the perpendicular distance; forgetting the weight acts at the centre of mass.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit6: {
        "Kinematics of a Particle Moving in a Straight Line or Plane": `EDEXCEL IAL MATHS M2 (WME02) — KINEMATICS (PROJECTILES + VARIABLE).
- PROJECTILES: resolve initial velocity into horizontal (u cos(theta), constant) and vertical (u sin(theta), acceleration -g) components; use SUVAT vertically. Time of flight, maximum height (when vertical velocity = 0), range, and the equation of the path.
- Variable acceleration in 2D using vectors and calculus (v = dr/dt, a = dv/dt; integrate with initial conditions).
WORKED-EXAMPLE MATERIAL: range and greatest height of a projectile; whether a projectile clears a wall; 2D variable-acceleration with vectors.
COMMON MISTAKES: applying g horizontally; not resolving the launch velocity.
REACTIONS: empty. GRAPHS: empty.`,
        "Centres of Mass": `EDEXCEL IAL MATHS M2 (WME02) — CENTRES OF MASS.
- Centre of mass of a system of particles: x-bar = sum(m_i x_i)/sum(m_i) (and similarly for y). Composite uniform laminae: split into simple shapes, use known centres, combine by moments. A suspended body hangs with its centre of mass vertically below the point of suspension.
WORKED-EXAMPLE MATERIAL: centre of mass of a composite lamina; the angle a suspended lamina hangs at.
REACTIONS: empty. GRAPHS: empty.`,
        "Work and Energy": `EDEXCEL IAL MATHS M2 (WME02) — WORK, ENERGY AND POWER.
- Work done by a force = F s cos(theta). Kinetic energy = (1/2) m v^2; gravitational PE = m g h. Work-energy principle: work done by the resultant force = change in KE. Power = work/time = F v. Use conservation of energy where appropriate (allowing for work done against friction).
WORKED-EXAMPLE MATERIAL: speed of a body up/down a rough incline using the work-energy principle; power of a vehicle (P = Fv) on an incline.
COMMON MISTAKES: omitting work done against friction; mixing up PE and KE signs.
REACTIONS: empty. GRAPHS: empty.`,
        "Collisions": `EDEXCEL IAL MATHS M2 (WME02) — IMPULSE AND COLLISIONS.
- Impulse = F t = change in momentum (m v - m u), a vector. Conservation of momentum: total momentum before = total after (apply with directions/signs) for direct collisions.
WORKED-EXAMPLE MATERIAL: impulse on a particle struck by a force/ball; speed after a 1D collision using conservation of momentum.
COMMON MISTAKES: sign errors with directions; confusing impulse with force.
REACTIONS: empty. GRAPHS: empty.`,
        "Statics of Rigid Bodies": `EDEXCEL IAL MATHS M2 (WME02) — STATICS OF RIGID BODIES.
- A rigid body in equilibrium under coplanar forces: resolve in two directions AND take moments about a chosen point (both must be zero). Choose the pivot to eliminate an unknown. Typical problems: a ladder against a wall (with friction), a hinged rod, a beam with a reaction at a support.
WORKED-EXAMPLE MATERIAL: a ladder in limiting equilibrium against a rough floor/smooth wall — find the friction or the angle; reaction at a hinge.
COMMON MISTAKES: missing a force in the free-body diagram; taking moments about a poor point.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit7: {
        "Mathematical Models in Probability and Statistics": `EDEXCEL IAL MATHS S1 (WST01) — MATHEMATICAL MODELS.
- The statistical modelling process: observe -> model -> predict -> test against data -> refine. Recognise assumptions and limitations of a model.
REACTIONS: empty. GRAPHS: empty.`,
        "Representation and Summary of Data": `EDEXCEL IAL MATHS S1 (WST01) — REPRESENTATION AND SUMMARY OF DATA.
- Measures of location: mean, median, mode. Spread: range, interquartile range (Q3 - Q1), variance and standard deviation (Sxx/n). Use coding to simplify calculations.
- Diagrams: histograms (frequency density = frequency / class width), box plots, outliers (e.g. beyond Q1 - 1.5 IQR or Q3 + 1.5 IQR), skewness (compare mean/median or use quartiles).
WORKED-EXAMPLE MATERIAL: mean and standard deviation from a frequency table (with coding); interpret/draw a box plot and identify outliers and skew.
COMMON MISTAKES: frequency density vs frequency on histograms; n vs n-1 (use the spec's formula).
REACTIONS: empty. GRAPHS: empty.`,
        "Probability": `EDEXCEL IAL MATHS S1 (WST01) — PROBABILITY.
- Sample spaces; addition law P(A or B) = P(A) + P(B) - P(A and B). Conditional probability P(A|B) = P(A and B)/P(B). Independent events: P(A and B) = P(A) P(B). Use tree diagrams and Venn diagrams.
WORKED-EXAMPLE MATERIAL: a tree-diagram conditional-probability problem; test whether two events are independent.
COMMON MISTAKES: confusing mutually exclusive with independent; wrong conditioning.
REACTIONS: empty. GRAPHS: empty.`,
        "Correlation and Regression": `EDEXCEL IAL MATHS S1 (WST01) — CORRELATION AND REGRESSION.
- Product-moment correlation coefficient r (between -1 and +1; sign and strength). Least-squares regression line y = a + bx (b = Sxy/Sxx, a = y-bar - b x-bar). Use the line to predict — interpolation (within range, reliable) vs extrapolation (outside range, unreliable). Effect of coding.
WORKED-EXAMPLE MATERIAL: interpret a value of r; find and use the regression line to predict; comment on reliability.
COMMON MISTAKES: extrapolating; predicting x from the y-on-x line.
REACTIONS: empty. GRAPHS: empty.`,
        "Discrete Random Variables": `EDEXCEL IAL MATHS S1 (WST01) — DISCRETE RANDOM VARIABLES.
- A probability distribution: sum of probabilities = 1. Expectation E(X) = sum of x P(X=x). Variance Var(X) = E(X^2) - [E(X)]^2. E(aX + b) = a E(X) + b; Var(aX + b) = a^2 Var(X). Cumulative distribution function.
WORKED-EXAMPLE MATERIAL: find a missing probability, then E(X) and Var(X); apply E(aX+b)/Var(aX+b).
COMMON MISTAKES: forgetting to subtract the mean squared in variance; sign of b in Var(aX+b) (it drops out).
REACTIONS: empty. GRAPHS: empty.`,
        "The Normal Distribution": `EDEXCEL IAL MATHS S1 (WST01) — THE NORMAL DISTRIBUTION.
- X ~ N(mu, sigma^2): symmetric, bell-shaped. Standardise with Z = (X - mu)/sigma and use the normal tables to find probabilities. Inverse problems: given a probability, find the value (or find mu/sigma from given probabilities using simultaneous equations).
WORKED-EXAMPLE MATERIAL: find P(X < a); find the value exceeded by 10%; find mu and sigma from two probability statements.
COMMON MISTAKES: not standardising; reading the table the wrong side (use 1 - phi for upper tails).
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit8: {
        "The Binomial and Poisson Distributions": `EDEXCEL IAL MATHS S2 (WST02) — BINOMIAL AND POISSON.
- BINOMIAL B(n, p): conditions (fixed n, two outcomes, constant p, independent trials); P(X=x) = nCx p^x (1-p)^(n-x); mean = np, variance = np(1-p). Use cumulative tables.
- POISSON Po(lambda): for events at a constant average rate; P(X=x) = e^(-lambda) lambda^x / x!; mean = variance = lambda; sums of independent Poissons add. Poisson approximates the binomial when n is large and p is small (lambda = np).
WORKED-EXAMPLE MATERIAL: a binomial probability with tables; a Poisson probability; use the Poisson approximation to a binomial.
COMMON MISTAKES: checking binomial conditions; mean vs variance of Poisson; cumulative vs exact from tables.
REACTIONS: empty. GRAPHS: empty.`,
        "Continuous Random Variables": `EDEXCEL IAL MATHS S2 (WST02) — CONTINUOUS RANDOM VARIABLES.
- Probability density function f(x): f(x) >= 0 and the integral over all x = 1; P(a < X < b) = integral of f from a to b. Cumulative distribution function F(x) = integral of f up to x (and f = F'). E(X) = integral of x f(x); Var(X) = integral of x^2 f(x) - [E(X)]^2; median (F = 0.5) and mode (max of f).
WORKED-EXAMPLE MATERIAL: find the constant k so f is a valid pdf; find F(x), the median, E(X) and Var(X).
COMMON MISTAKES: limits of integration; forgetting f integrates to 1.
REACTIONS: empty. GRAPHS: empty.`,
        "Continuous Distributions": `EDEXCEL IAL MATHS S2 (WST02) — CONTINUOUS UNIFORM DISTRIBUTION.
- Continuous uniform (rectangular) distribution on [a, b]: f(x) = 1/(b-a); mean = (a+b)/2; variance = (b-a)^2 / 12; probabilities are proportional to length.
WORKED-EXAMPLE MATERIAL: probability, mean and variance for a continuous uniform distribution.
REACTIONS: empty. GRAPHS: empty.`,
        "Hypothesis Tests": `EDEXCEL IAL MATHS S2 (WST02) — HYPOTHESIS TESTS.
- State the null hypothesis H0 and alternative H1; choose one- or two-tailed and a significance level. Compute the probability of the observed (or more extreme) result under H0, or use a critical region. Compare with the significance level and CONCLUDE in context (reject or do not reject H0). Tests for a binomial proportion p and for a Poisson mean lambda.
WORKED-EXAMPLE MATERIAL: a one-tailed test on a binomial p (find the critical region or p-value, then conclude in context); a Poisson-mean test.
COMMON MISTAKES: one- vs two-tailed; concluding without context; comparing the wrong tail probability.
REACTIONS: empty. GRAPHS: empty.`,
      },
    },
  },
};

const subjKey = (subject: string) =>
  String(subject || "").toLowerCase() === "mathematics" ? "maths" : String(subject || "").toLowerCase();

export function getAuthoredBrief(board: string, subject: string, unitNumber: number | string, topic: string): string | null {
  const byUnit = AUTHORED_NOTES[String(board)]?.[subjKey(subject)]?.[`unit${unitNumber}`];
  if (!byUnit) return null;
  if (byUnit[topic]) return byUnit[topic];
  const wanted = String(topic || "").toLowerCase().trim();
  const key = Object.keys(byUnit).find((k) => k.toLowerCase().trim() === wanted)
    || Object.keys(byUnit).find((k) => k.toLowerCase().includes(wanted) || wanted.includes(k.toLowerCase()));
  return key ? byUnit[key] : null;
}
