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

  "edexcel-igcse": {
    chemistry: {
      unit1: {
        "States of matter and separation techniques": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 1 — STATES OF MATTER & SEPARATION TECHNIQUES.

STATES & THE PARTICLE MODEL
- Solid: particles touching, regular lattice, vibrate in fixed positions — fixed shape and volume. Liquid: touching, random arrangement, move/slide — fixed volume, takes container shape. Gas: far apart, random, fast — fills container, easily compressed.
- Changes of state: melting (s→l), freezing/solidifying (l→s), boiling/evaporating (l→g), condensing (g→l), sublimation (s→g). Heating gives particles energy to overcome forces between them.
- Diffusion = net movement of particles from high to low concentration; faster in gases than liquids; lighter (lower Mr) particles diffuse faster (ammonia diffuses faster than HCl in the gas-jar experiment).

SOLUTIONS — KEY WORDS
- Solvent (does the dissolving) + solute (dissolves) → solution. Soluble / insoluble / saturated. "Aqueous" = dissolved in water (aq).

SEPARATION TECHNIQUES (match the method to the mixture)
- Filtration: separates an insoluble solid from a liquid (residue stays on filter paper, filtrate passes through).
- Crystallisation: get a soluble solid back from its solution — heat to evaporate some water to the point of crystallisation, cool, filter, dry. Used when the solid decomposes on strong heating.
- Simple distillation: separate a solvent (e.g. pure water) from a solution — evaporate then condense the vapour.
- Fractional distillation: separate two miscible liquids with different boiling points (e.g. ethanol bp 78°C from water) using a fractionating column.
- Paper chromatography: separate coloured substances (dyes/inks). Rf = distance moved by spot ÷ distance moved by solvent front (always between 0 and 1, no units).

WORKED-EXAMPLE MATERIAL
- Calculate an Rf value; choose the correct technique for a named mixture; explain a change of state using particle energy.
COMMON MISTAKES
- Confusing filtration (insoluble solid) with crystallisation (dissolved solid); measuring Rf from the wrong baseline; saying "particles melt" (particles don't melt, the substance does).
REACTIONS: empty. GRAPHS: empty.`,

        "Atoms, elements and the Periodic Table": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 1 — ATOMS, ELEMENTS & THE PERIODIC TABLE.

ATOMIC STRUCTURE
- Atom = nucleus (protons + neutrons) surrounded by electrons in shells. Proton: rel mass 1, charge +1. Neutron: 1, 0. Electron: ~1/1840, −1.
- Atomic number (proton number) Z = number of protons (= electrons in a neutral atom). Mass number A = protons + neutrons. Number of neutrons = A − Z.
- Isotopes = atoms of the same element (same Z) with different numbers of neutrons (different A). They have identical chemical properties (same electrons).
- Relative atomic mass Ar = weighted mean = Σ(isotope mass × % abundance) ÷ 100.

ELECTRONIC CONFIGURATION
- Shells fill 2, 8, 8 (then 2). Write e.g. chlorine (Z=17) = 2,8,7. Number of outer-shell electrons = group number; number of shells = period.

THE PERIODIC TABLE
- Arranged in order of increasing atomic number. Groups = columns (same number of outer electrons → similar properties). Periods = rows.
- Metals on the left, non-metals on the right (zig-zag divide). Group 0/8 = noble gases (full outer shell, unreactive). Group 1 = alkali metals, Group 7 = halogens, the middle block = transition metals.
- Element = one type of atom; compound = atoms of different elements chemically bonded; mixture = not chemically bonded (easily separated).

WORKED-EXAMPLE MATERIAL
- Deduce protons/neutrons/electrons from A and Z; write an electronic configuration and read off group/period; calculate Ar from isotope abundances.
COMMON MISTAKES
- Mixing up mass number and atomic number; forgetting neutrons = A − Z; counting shells vs electrons wrongly.
REACTIONS: empty. GRAPHS: empty.`,

        "Chemical formulae, equations and calculations (moles)": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 1 — FORMULAE, EQUATIONS & MOLE CALCULATIONS. Mostly maths — practise.

FORMULAE & EQUATIONS
- Work out ionic compound formulae by balancing charges (e.g. Mg²⁺ + Cl⁻ → MgCl₂). Learn common ions: NO₃⁻, CO₃²⁻, SO₄²⁻, OH⁻, NH₄⁺.
- Balance symbol equations (same number of each atom both sides). Add state symbols (s), (l), (g), (aq).

THE MOLE
- Relative formula mass Mr = sum of all the Ar values. One mole = Mr in grams = 6.02×10²³ particles (Avogadro constant).
- moles = mass ÷ Mr. Rearrange for mass = moles × Mr.
- Concentration: mol/dm³ = moles ÷ volume(dm³). (Remember 1 dm³ = 1000 cm³, so ÷1000 to convert cm³.) Also g/dm³ = concentration(mol/dm³) × Mr.
- Gas volume (at rtp): volume(dm³) = moles × 24 (or cm³ = moles × 24000). Avogadro's law: equal volumes of gases at same T and p contain equal moles.

REACTING-MASS, YIELD & TITRATION
- Reacting masses: moles of A → use the equation ratio → moles of B → mass of B.
- Percentage yield = (actual yield ÷ theoretical yield) × 100. Reasons for <100%: incomplete reaction, side reactions, losses on transfer/filtering.
- Empirical formula = simplest whole-number ratio (mass ÷ Ar for each, then simplest ratio). Molecular formula = (Mr ÷ empirical mass) × empirical formula.
- Titration: moles of known (c×v) → ratio → unknown concentration. % yield and % purity calculations.

WORKED-EXAMPLE MATERIAL
- mass↔moles; a reacting-mass calculation; an empirical formula from masses; a titration concentration; % yield.
COMMON MISTAKES
- cm³ vs dm³ (÷1000); not balancing before using ratios; using Ar instead of Mr; rounding too early.
REACTIONS: empty. GRAPHS: empty.`,

        "Ionic, covalent and metallic bonding": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 1 — IONIC, COVALENT & METALLIC BONDING.

IONIC BONDING (metal + non-metal)
- Electrons transferred from metal to non-metal → ions. Metals lose electrons → positive ions (cations); non-metals gain → negative ions (anions). Both reach full outer shells.
- Strong electrostatic attraction between oppositely charged ions in a giant ionic lattice.
- Properties: high melting/boiling points (strong forces, lots of energy to break); conduct electricity when molten or dissolved (ions free to move) but NOT when solid; many soluble in water; brittle.
- Draw dot-and-cross diagrams (e.g. NaCl, MgO, MgCl₂, Na₂O) showing the transfer and charges.

COVALENT BONDING (non-metal + non-metal)
- Shared pair(s) of electrons. Single, double (O₂, CO₂), triple (N₂) bonds. Draw dot-and-cross for H₂, Cl₂, H₂O, NH₃, CH₄, CO₂, HCl, O₂, N₂.
- Simple molecular: low mp/bp (weak intermolecular forces between molecules, NOT the strong covalent bonds); usually don't conduct (no charged particles free to move).
- Giant covalent (macromolecular): diamond (each C bonded to 4, very hard, high mp, doesn't conduct); graphite (each C bonded to 3, layers slide → soft/lubricant, has delocalised electrons → conducts).

METALLIC BONDING
- Giant lattice of positive metal ions in a "sea" of delocalised electrons. Strong attraction → high mp.
- Conduct electricity and heat (delocalised electrons move); malleable/ductile (layers of ions slide without breaking the bonding).

WORKED-EXAMPLE MATERIAL
- Dot-and-cross diagrams; explain a property from structure/bonding; predict bond type from the elements involved.
COMMON MISTAKES
- Saying covalent bonds break on melting (it's the weak intermolecular forces); saying ionic solids conduct (only molten/aqueous); forgetting graphite conducts but diamond doesn't.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit2: {
        "Group 1 and Group 7 trends": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 2 — GROUP 1 (ALKALI METALS) & GROUP 7 (HALOGENS) TRENDS.

GROUP 1 — ALKALI METALS (Li, Na, K…)
- Soft, low density, shiny when cut (tarnish quickly). One outer electron → lose it easily → +1 ions.
- React vigorously with water → metal hydroxide + hydrogen: e.g. 2Na + 2H₂O → 2NaOH + H₂. The hydroxide is alkaline (turns universal indicator purple).
- Reactivity INCREASES down the group: outer shell further from nucleus + more shielding → electron lost more easily. Li fizzes, Na melts into a ball/whizzes, K ignites with a lilac flame.

GROUP 7 — HALOGENS (F, Cl, Br, I)
- Non-metals, exist as diatomic molecules (Cl₂, Br₂, I₂). Colour darkens and physical state goes gas→liquid→solid DOWN the group: Cl₂ pale green gas, Br₂ red-brown liquid, I₂ grey solid (purple vapour).
- Gain one electron → −1 ions (halides). Reactivity DECREASES down the group: harder to gain an electron as the shell is further from the nucleus.
- Displacement reactions: a more reactive halogen displaces a less reactive halide from solution, e.g. Cl₂ + 2KBr → 2KCl + Br₂ (solution turns orange). Used to rank reactivity.

WORKED-EXAMPLE MATERIAL
- Predict the products/observations of a halogen displacement; explain the reactivity trend for Group 1 vs Group 7; write the equation for an alkali metal + water.
COMMON MISTAKES
- Saying reactivity increases down BOTH groups (it increases down G1 but decreases down G7); forgetting halogens are diatomic; wrong flame colours (Li red, Na yellow, K lilac).
REACTIONS: Na/K + water → hydroxide + H₂; Cl₂ + 2KBr → 2KCl + Br₂ (and similar displacements). GRAPHS: empty.`,

        "Gases in the atmosphere": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 2 — GASES IN THE ATMOSPHERE.

COMPOSITION OF CLEAN AIR
- Approx 78% nitrogen, 21% oxygen, ~1% noble gases (mainly argon), and a small/variable amount of carbon dioxide (~0.04%) and water vapour.
- Determining % oxygen: pass air over heated copper (copper → black copper oxide, 2Cu + O₂ → 2CuO) until volume stops decreasing; the volume drop ≈ % oxygen used up.

CARBON DIOXIDE & COMBUSTION
- Complete combustion of a fuel (plenty of O₂) → CO₂ + H₂O. Incomplete combustion (limited O₂) → carbon monoxide CO (toxic — binds to haemoglobin) and/or soot (carbon).
- CO₂ levels rise from burning fossil fuels and deforestation.

GREENHOUSE EFFECT & CLIMATE
- Greenhouse gases (CO₂, methane, water vapour) absorb re-radiated infrared from the Earth → keep the planet warm. Increasing CO₂/CH₄ → enhanced greenhouse effect → global warming/climate change.

ACID RAIN
- Burning fossil fuels containing sulfur → sulfur dioxide SO₂; high temperatures in engines → nitrogen oxides NOₓ. These dissolve in rain → acid rain (damages buildings/limestone, kills plants/aquatic life).

WORKED-EXAMPLE MATERIAL
- Describe the heated-copper experiment to find % O₂; name the products of complete vs incomplete combustion; explain how acid rain forms.
COMMON MISTAKES
- Quoting wrong air percentages; confusing CO (toxic, incomplete) with CO₂; mixing up acid rain (SO₂/NOₓ) with the greenhouse effect (CO₂/CH₄).
REACTIONS: 2Cu + O₂ → 2CuO; complete combustion (e.g. CH₄ + 2O₂ → CO₂ + 2H₂O). GRAPHS: empty.`,

        "Reactivity series and metal extraction": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 2 — REACTIVITY SERIES & METAL EXTRACTION.

THE REACTIVITY SERIES (most → least reactive)
- K, Na, Ca, Mg, Al, (C), Zn, Fe, (H), Cu, Ag, Au. Judge reactivity by reactions with water, acid, and oxygen.
- Metal + acid → salt + hydrogen (more reactive = faster fizzing). Metal + water/steam → hydroxide/oxide + hydrogen.
- Displacement: a more reactive metal displaces a less reactive one from its compound/solution, e.g. Fe + CuSO₄ → FeSO₄ + Cu (blue→pale green, brown coating). This is the basis of ranking and of redox (OIL RIG: oxidation is loss, reduction is gain of electrons).

OXIDATION & REDUCTION (redox)
- Oxidation = gain of oxygen / loss of electrons; reduction = loss of oxygen / gain of electrons. Rusting of iron needs water AND oxygen (prevented by barrier methods or sacrificial protection with a more reactive metal e.g. zinc — galvanising).

EXTRACTION
- Method depends on reactivity: metals BELOW carbon (Zn, Fe, Cu) extracted by reduction with carbon; metals ABOVE carbon (K, Na, Ca, Mg, Al) extracted by electrolysis (too reactive to reduce with carbon).
- Blast furnace (iron): coke + air → CO; Fe₂O₃ + 3CO → 2Fe + 3CO₂ (reduction). Limestone removes acidic impurities (CaCO₃ → CaO → reacts with SiO₂ to form slag).
- Aluminium by electrolysis of molten Al₂O₃ dissolved in cryolite (lowers the melting point/saves energy).

WORKED-EXAMPLE MATERIAL
- Predict displacement reactions and observations; choose extraction method from position vs carbon; identify what's oxidised/reduced in the blast furnace.
COMMON MISTAKES
- Forgetting carbon's position determines the method; wrong colour changes; calling a gain of electrons "oxidation".
REACTIONS: Fe + CuSO₄ → FeSO₄ + Cu; Fe₂O₃ + 3CO → 2Fe + 3CO₂; metal + acid → salt + H₂. GRAPHS: empty.`,

        "Acids, bases and salt preparations": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 2 — ACIDS, BASES & SALT PREPARATIONS.

ACIDS, BASES & pH
- Acid = proton (H⁺) donor → produces H⁺ in solution. Base = neutralises an acid; an alkali = soluble base → produces OH⁻ in solution.
- pH scale 0–14: acids <7, neutral 7, alkalis >7. Indicators: litmus (red acid/blue alkali), universal indicator (colour → pH). Strong acids (HCl, H₂SO₄, HNO₃) fully ionise; weak acids (e.g. ethanoic) partially ionise.
- Neutralisation: H⁺(aq) + OH⁻(aq) → H₂O(l).

REACTIONS OF ACIDS (learn the salt produced)
- Acid + metal → salt + hydrogen. Acid + base/metal oxide → salt + water. Acid + metal carbonate → salt + water + carbon dioxide. Acid + alkali → salt + water.
- Salt naming: HCl → chlorides; H₂SO₄ → sulfates; HNO₃ → nitrates.

PREPARING SALTS
- SOLUBLE salt from an INSOLUBLE base/metal/carbonate: add excess solid to warm acid → filter off the excess → crystallise the filtrate (evaporate to point of crystallisation, cool, dry).
- SOLUBLE salt from an alkali (soluble base): titration (no excess solid to remove) — find the exact volume with indicator, then repeat without indicator and crystallise.
- INSOLUBLE salt: precipitation — mix two soluble solutions, filter, wash and dry the precipitate (e.g. AgNO₃ + NaCl → AgCl↓ + NaNO₃).
- Solubility rules: all nitrates soluble; most chlorides soluble (not Ag, Pb); most sulfates soluble (not Ba, Pb, Ca); most carbonates insoluble (except group 1 + ammonium).

WORKED-EXAMPLE MATERIAL
- Choose the correct preparation route for a named salt; write the equation for acid + carbonate; describe the steps to make a pure dry salt.
COMMON MISTAKES
- Using titration when an insoluble base would be easier; forgetting CO₂ from carbonates; not washing/drying the precipitate; wrong salt name from the acid.
REACTIONS: acid + metal/oxide/carbonate/alkali (general forms); AgNO₃ + NaCl → AgCl + NaNO₃; H⁺ + OH⁻ → H₂O. GRAPHS: empty.`,

        "Chemical tests for ions and gases": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 2 — CHEMICAL TESTS (learn reagent → observation → conclusion). Pure recall marks.

FLAME TESTS (cations)
- Li⁺ red; Na⁺ yellow; K⁺ lilac; Ca²⁺ orange-red (brick red); Cu²⁺ blue-green.

CATION TESTS WITH SODIUM HYDROXIDE (NaOH(aq)) — coloured precipitates
- Cu²⁺ → blue precipitate; Fe²⁺ → green precipitate; Fe³⁺ → brown precipitate. (All metal hydroxides.)
- NH₄⁺ (ammonium): add NaOH and warm → ammonia gas → turns damp red litmus blue (pungent smell).

ANION TESTS
- Carbonate (CO₃²⁻): add dilute acid → fizzes, CO₂ given off → turns limewater milky.
- Sulfate (SO₄²⁻): add dilute HCl then barium chloride (BaCl₂) → white precipitate (BaSO₄).
- Halides (Cl⁻, Br⁻, I⁻): add dilute nitric acid then silver nitrate (AgNO₃) → chloride white ppt, bromide cream ppt, iodide yellow ppt.

GAS TESTS
- Hydrogen: lit splint → squeaky pop. Oxygen: glowing splint → relights. Carbon dioxide: limewater → turns milky (cloudy white). Ammonia: damp red litmus → turns blue. Chlorine: damp blue litmus → turns red then bleaches white.

WORKED-EXAMPLE MATERIAL
- Identify an unknown salt from a sequence of tests; give the reagent and observation to confirm a named ion or gas.
COMMON MISTAKES
- Forgetting to acidify first in sulfate/halide tests (to remove carbonate that would interfere); mixing up the halide precipitate colours; confusing the H₂ pop with the O₂ relighting test.
REACTIONS: precipitate/identification tests as above. GRAPHS: empty. REFERENCE TABLES: flame colours; NaOH precipitate colours; halide precipitate colours; gas tests.`,
      },
      unit3: {
        "Energetics and rates of reaction": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 3 — ENERGETICS & RATES OF REACTION.

ENERGETICS
- Exothermic = releases heat to surroundings (temperature rises), ΔH negative — combustion, neutralisation, most oxidations. Endothermic = takes in heat (temperature falls), ΔH positive — thermal decomposition, e.g. dissolving some salts.
- Energy-level (reaction profile) diagrams: exothermic products below reactants; endothermic products above. Activation energy Ea = minimum energy to start a reaction (the "hump").
- Bond breaking is endothermic (takes energy in); bond making is exothermic (gives energy out). ΔH = energy to break bonds − energy released making bonds. (Net exothermic if more energy out than in.)
- Calculating energy change of a reaction in solution: Q = m × c × ΔT (c = 4.2 J/g/°C for water).

RATES OF REACTION
- Rate = amount of reactant used or product formed ÷ time. Measure by gas volume collected, mass loss, or time for a precipitate to obscure a cross.
- Collision theory: reactions happen when particles collide with enough energy (≥ Ea) and correct orientation. Anything that increases frequency/energy of collisions increases rate.
- Factors: ↑ temperature (particles faster + more have ≥Ea → faster); ↑ concentration / ↑ pressure (gases) (more particles per volume → more frequent collisions); ↑ surface area (smaller pieces/powder → more frequent collisions); catalyst (provides a lower-Ea pathway, not used up).
- A catalyst speeds up the reaction without being used up; enzymes are biological catalysts.

WORKED-EXAMPLE MATERIAL
- Calculate rate from a graph (gradient); explain a rate change using collision theory; use Q = mcΔT for a temperature change; classify a reaction as exo/endothermic from ΔT.
COMMON MISTAKES
- Saying a catalyst "lowers activation energy of the reactants" (it provides an alternative pathway with lower Ea); confusing concentration with amount; bond breaking/making energy sign errors.
REACTIONS: empty. GRAPHS: rate curves (volume/mass vs time — steeper = faster, levels off when a reactant runs out); reaction profile diagrams.`,

        "Reversible reactions and equilibria": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 3 — REVERSIBLE REACTIONS & EQUILIBRIA.

REVERSIBLE REACTIONS
- Shown by ⇌. Products can react to re-form reactants. Example: hydrated copper(II) sulfate (blue) ⇌ anhydrous copper(II) sulfate (white) + water — heating removes water (forward), adding water reverses it (and is exothermic — used as a test for water).
- Thermal decomposition of ammonium chloride: NH₄Cl ⇌ NH₃ + HCl.

DYNAMIC EQUILIBRIUM (closed system)
- In a closed system the forward and backward reactions occur at the SAME rate → concentrations of reactants and products stay constant (but reactions don't stop). This is dynamic equilibrium.

LE CHATELIER'S PRINCIPLE (predicting the shift)
- If a change is made to a system at equilibrium, the position shifts to oppose/counteract the change.
- Temperature: increasing T shifts in the ENDOthermic direction (and decreasing T shifts exothermic).
- Pressure (gases): increasing pressure shifts toward the side with FEWER moles of gas.
- Concentration: adding a reactant shifts toward products; removing product shifts toward products.
- A catalyst does NOT change the position of equilibrium — it just reaches it faster.

THE HABER PROCESS (industrial example)
- N₂ + 3H₂ ⇌ 2NH₃ (forward exothermic). Conditions: ~450°C, ~200 atm, iron catalyst.
- Compromise conditions: low T favours yield but is too slow; high pressure favours the product side (fewer moles) but is expensive/unsafe → 200 atm is a compromise. Unreacted gases are recycled.

WORKED-EXAMPLE MATERIAL
- Predict the direction of shift for a change in T, p, or concentration; explain the choice of Haber conditions as a compromise.
COMMON MISTAKES
- Thinking equilibrium means equal amounts (it means constant amounts / equal rates); forgetting a catalyst doesn't shift position; getting the pressure-vs-moles direction wrong.
REACTIONS: N₂ + 3H₂ ⇌ 2NH₃; hydrated ⇌ anhydrous CuSO₄. GRAPHS: empty.`,
      },
      unit4: {
        "Introduction to organic chemistry and crude oil": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 4 — INTRODUCTION TO ORGANIC CHEMISTRY & CRUDE OIL.

KEY IDEAS
- Organic compounds contain carbon. A homologous series = family with the same general formula, similar chemical properties, and a gradual trend in physical properties (mp/bp rise with chain length).
- Functional group = the reactive part that gives a series its characteristic reactions. Isomers = same molecular formula, different structural arrangement.

CRUDE OIL
- A mixture of hydrocarbons (compounds of hydrogen and carbon only), mostly alkanes. A finite/non-renewable fossil fuel.
- Separated by FRACTIONAL DISTILLATION: heated and vaporised; the column is hot at the bottom, cool at the top; fractions condense at different heights by boiling point — small molecules (low bp) rise high; large molecules (high bp) condense low.
- Fractions (top→bottom, small→large): refinery gases, gasoline/petrol, kerosene, diesel, fuel oil, bitumen.
- Trends down the column (larger molecules): higher boiling point, more viscous (thicker), less flammable, less volatile, darker.

COMBUSTION & PROBLEMS
- Complete combustion of a hydrocarbon → CO₂ + H₂O (releases energy). Incomplete combustion (limited O₂) → carbon monoxide (toxic) + soot.
- Burning sulfur impurities → SO₂ → acid rain. High engine temperatures make NOₓ → acid rain/photochemical smog.

CRACKING
- Long-chain (less useful) alkanes are broken into shorter, more useful alkanes + alkenes. Conditions: high temperature + a catalyst (e.g. silica/alumina). Example: C₁₀H₂₂ → C₈H₁₈ + C₂H₄. Cracking meets demand for petrol and makes alkenes for polymers.

WORKED-EXAMPLE MATERIAL
- Explain fractional distillation in terms of boiling point; state a cracking equation and balance it; give a use of a named fraction.
COMMON MISTAKES
- Saying fractions are pure compounds (they're mixtures of similar-sized molecules); getting the bp/viscosity trend backwards; forgetting cracking needs heat + catalyst.
REACTIONS: cracking e.g. C₁₀H₂₂ → C₈H₁₈ + C₂H₄; complete combustion of a hydrocarbon. GRAPHS: empty.`,

        "Alkanes, alkenes and alcohols": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 4 — ALKANES, ALKENES & ALCOHOLS.

ALKANES (general formula CₙH₂ₙ₊₂)
- Saturated (only single C–C bonds). First four: methane CH₄, ethane C₂H₆, propane C₃H₈, butane C₄H₁₀.
- Fairly unreactive but burn (combustion) and react with halogens via SUBSTITUTION in UV light: e.g. CH₄ + Cl₂ →(UV) CH₃Cl + HCl. This is a photochemical free-radical substitution.

ALKENES (general formula CₙH₂ₙ)
- Unsaturated — contain a C=C double bond (more reactive). Ethene C₂H₄, propene C₃H₆.
- Test for unsaturation: shake with bromine water → orange/yellow → colourless (decolourised). Alkanes don't decolourise it.
- ADDITION reactions across the C=C: + H₂ (Ni catalyst) → alkane; + Br₂ → dibromoalkane; + H₂O (steam, catalyst) → alcohol (hydration of ethene → ethanol).

ALCOHOLS (functional group –OH; e.g. methanol, ethanol, propanol)
- Ethanol made two ways: (1) fermentation of glucose/sugar with yeast (enzymes), ~30°C, no air → C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ (renewable, slow, impure); (2) hydration of ethene with steam + catalyst (phosphoric acid), fast, pure, but uses finite crude oil.
- Ethanol burns (good fuel): C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O. Used as a solvent and fuel.

WORKED-EXAMPLE MATERIAL
- Use bromine water to distinguish an alkane from an alkene; write an addition reaction; compare fermentation vs hydration to make ethanol.
COMMON MISTAKES
- Calling alkenes saturated; forgetting "addition" for alkenes vs "substitution" for alkanes; wrong general formulae; saying bromine water turns "clear" (it turns colourless — it was already clear).
REACTIONS: CH₄ + Cl₂ →(UV) CH₃Cl + HCl; C₂H₄ + Br₂ → C₂H₄Br₂; C₂H₄ + H₂O → C₂H₅OH; fermentation C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. GRAPHS: empty.`,

        "Carboxylic acids, esters and synthetic polymers": `EDEXCEL IGCSE CHEMISTRY (4CH1) TOPIC 4 — CARBOXYLIC ACIDS, ESTERS & POLYMERS.

CARBOXYLIC ACIDS (functional group –COOH; e.g. methanoic, ethanoic acid)
- Weak acids (partially ionise) but show typical acid reactions: with metals → salt + hydrogen; with carbonates → salt + water + CO₂ (fizzes); with alkalis → salt + water. Salts are named ...anoates (e.g. sodium ethanoate).
- Ethanol can be OXIDISED to ethanoic acid (by oxidising agents e.g. acidified potassium dichromate, or by microbial oxidation in air — why wine turns to vinegar).

ESTERS
- Carboxylic acid + alcohol ⇌ ester + water, with a concentrated sulfuric acid catalyst (esterification). E.g. ethanoic acid + ethanol → ethyl ethanoate + water.
- Esters are sweet-smelling → used as flavourings and perfumes.

ADDITION POLYMERS
- Many small unsaturated monomers (alkenes) join, the C=C opening up, to form one long saturated chain — no other product. E.g. n ethene → poly(ethene); also poly(propene), poly(chloroethene)/PVC.
- Draw the repeat unit from a monomer (and deduce the monomer from a repeat unit): keep all atoms, change C=C to a single bond, put bonds through the brackets, subscript n.

CONDENSATION POLYMERS (named example)
- Two different monomers each with two functional groups join, LOSING a small molecule (water) each time — e.g. nylon (a polyamide) and PET (a polyester).

ENVIRONMENTAL ISSUES
- Most addition polymers are non-biodegradable → landfill/litter. Disposal: landfill (wastes land), incineration (releases CO₂ and toxic gases e.g. HCl from PVC), or recycling (sorting is difficult).

WORKED-EXAMPLE MATERIAL
- Draw a repeat unit / deduce a monomer; write the esterification of a named acid + alcohol; give the products of a carboxylic acid + carbonate.
COMMON MISTAKES
- Drawing the monomer with a double bond in the polymer repeat unit (it becomes single); forgetting the "n" and continuation bonds; confusing addition (no by-product) with condensation (loses water).
REACTIONS: ethanoic acid + ethanol ⇌ ethyl ethanoate + water; acid + carbonate → salt + water + CO₂; n C₂H₄ → poly(ethene). GRAPHS: empty.`,
      },
    },

    biology: {
      unit1: {
        "Characteristics of living organisms": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 1 — CHARACTERISTICS OF LIVING ORGANISMS.

THE EIGHT LIFE PROCESSES (MRS GREN / MRS NERG)
- Movement — change position or move part of the body.
- Respiration — chemical reactions that release energy from nutrients (in cells).
- Sensitivity — detect and respond to changes (stimuli) in the environment.
- Growth — a permanent increase in size and dry mass.
- Reproduction — produce more of the same kind of organism.
- Excretion — remove the waste products of metabolism (and substances in excess).
- Nutrition — take in nutrients (food/raw materials) for energy, growth and repair.

USING THE CHARACTERISTICS
- Living organisms carry out ALL of these; non-living things may show some (e.g. a car "moves" and "uses fuel") but not all.
- Distinguish excretion (removing metabolic waste, e.g. CO₂, urea) from egestion (removing undigested food/faeces — NOT a metabolic waste).

WORKED-EXAMPLE MATERIAL
- List the life processes and define each; argue whether something is living using the characteristics; distinguish excretion from egestion.
COMMON MISTAKES
- Confusing respiration with breathing (respiration is the chemical release of energy in cells); calling egestion "excretion"; vague definitions of growth (must say permanent increase in dry mass).
REACTIONS: empty. GRAPHS: empty.`,

        "Variety of organisms (Five Kingdoms)": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 1 — VARIETY OF ORGANISMS.

EUKARYOTES vs PROKARYOTES
- Eukaryotic cells have a true nucleus and membrane-bound organelles (animals, plants, fungi, protoctists). Prokaryotic cells (bacteria) have no nucleus — DNA is a loop free in the cytoplasm (plus possible plasmids).

THE MAIN GROUPS
- PLANTS: multicellular, cells have cellulose cell walls and chloroplasts (chlorophyll) → photosynthesise; store carbohydrate as starch/sucrose. E.g. flowering plants (cereals), ferns.
- ANIMALS: multicellular, no cell wall, no chloroplasts; nervous coordination, move; store carbohydrate as glycogen. E.g. mammals, insects.
- FUNGI: usually multicellular with thread-like hyphae forming a mycelium (some, e.g. yeast, are single-celled); cell walls NOT cellulose (chitin); feed by saprotrophic nutrition (secrete enzymes onto food, absorb digested products); store glycogen. E.g. Mucor, yeast.
- PROTOCTISTS: mostly single-celled eukaryotes; some plant-like (e.g. Chlorella, have chloroplasts), some animal-like (e.g. Amoeba). Some cause disease (Plasmodium → malaria).
- BACTERIA (prokaryotes): single-celled, no nucleus; some photosynthesise, most feed off other organisms. E.g. Lactobacillus (rod, used in yoghurt), Pneumococcus (sphere).

PATHOGENS & VIRUSES
- A pathogen = a microorganism that causes disease. Viruses are NOT cells (not a kingdom): a protein coat around genetic material (DNA or RNA); they can only reproduce inside a host cell (parasitic). E.g. tobacco mosaic virus, influenza virus, HIV.

WORKED-EXAMPLE MATERIAL
- Assign a named organism to its group using features; give features that distinguish fungi from plants; explain why viruses aren't classed as living cells.
COMMON MISTAKES
- Saying fungal walls are cellulose (they aren't); thinking all protoctists are the same; classing viruses as bacteria.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit2: {
        "Level of organisation and cell structure": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 2 — LEVELS OF ORGANISATION & CELL STRUCTURE.

LEVELS OF ORGANISATION
- Organelle → cell → tissue (group of similar cells with a function) → organ (group of tissues) → organ system → organism.

ANIMAL CELL (all have): nucleus (controls the cell, contains DNA), cytoplasm (site of reactions), cell membrane (controls what enters/leaves), mitochondria (aerobic respiration), ribosomes (protein synthesis).
PLANT CELL (extra): cellulose cell wall (support/shape), large permanent vacuole (filled with cell sap, keeps cell turgid), chloroplasts (contain chlorophyll → photosynthesis).

SPECIALISED CELLS (structure suits function)
- Root hair cell: long extension → large surface area for water/mineral absorption. Xylem: hollow dead tubes → transport water. Red blood cell: biconcave, no nucleus → more haemoglobin/O₂. Sperm/egg, ciliated cells, nerve cells etc.

MOVEMENT IN AND OUT OF CELLS
- Diffusion: net movement of particles from a high to a low concentration (down a gradient) — e.g. O₂ and CO₂ in gas exchange. Passive (no energy).
- Osmosis: net movement of water molecules from a dilute solution (high water potential) to a concentrated solution (low water potential) across a partially permeable membrane. Passive.
- Active transport: movement of substances AGAINST the concentration gradient using energy from respiration (e.g. mineral ions into root hair cells).
- Factors affecting rate of diffusion: concentration gradient, temperature, surface area, distance.

WORKED-EXAMPLE MATERIAL
- Label animal/plant cells and give organelle functions; explain osmosis in a potato/visking-tubing experiment; distinguish diffusion, osmosis and active transport.
COMMON MISTAKES
- Saying osmosis moves "from high to low concentration" (it's WATER from high to low water potential — i.e. dilute to concentrated); forgetting active transport needs energy; confusing cell wall with cell membrane.
REACTIONS: empty. GRAPHS: empty.`,

        "Biological molecules and nutrition": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 2 — BIOLOGICAL MOLECULES, ENZYMES & HUMAN NUTRITION.

BIOLOGICAL MOLECULES & FOOD TESTS
- Carbohydrates (made of simple sugars, e.g. starch/glucose) — store/release energy. Proteins (amino acids) — growth/repair/enzymes. Lipids/fats (fatty acids + glycerol) — energy store/insulation.
- Food tests: starch → iodine solution → blue-black. Reducing sugar → Benedict's solution, heat → brick-red (blue→green→orange→red with more sugar). Protein → Biuret → purple/lilac. Lipid → ethanol emulsion test → white/cloudy emulsion.

ENZYMES
- Biological catalysts (proteins) that speed up reactions and are not used up. Specific — the substrate fits the active site ("lock and key").
- Temperature: rate rises to an optimum then falls sharply as the enzyme DENATURES (active site changes shape) at high temperature. pH: each enzyme has an optimum pH; extreme pH denatures it.

BALANCED DIET (humans)
- Needs carbohydrate, protein, lipid, vitamins (C — scurvy; D — rickets/bone), minerals (iron for haemoglobin; calcium for bones/teeth), water and fibre (roughage — aids movement of food/prevents constipation).

DIGESTIVE SYSTEM
- Mouth → oesophagus → stomach → small intestine (duodenum, ileum) → large intestine (colon) → rectum → anus, plus liver, pancreas, gall bladder.
- Digestion = breaking large insoluble molecules into small soluble ones. Enzymes: amylase (starch → maltose, in mouth/pancreas), protease (protein → amino acids, e.g. pepsin in stomach), lipase (lipids → fatty acids + glycerol).
- Bile (made in liver, stored in gall bladder): emulsifies fats (large surface area for lipase) and neutralises stomach acid (alkaline) for enzymes in the small intestine.
- Absorption: small soluble molecules absorbed in the small intestine — villi (and microvilli) give a large surface area, thin walls, good blood supply.

WORKED-EXAMPLE MATERIAL
- State a food test and positive result; explain an enzyme rate vs temperature/pH graph including denaturing; give the enzyme and products for a named digestion step.
COMMON MISTAKES
- Saying enzymes are "killed" (they denature, they aren't alive); forgetting bile is not an enzyme; wrong food test colours.
REACTIONS: empty. GRAPHS: enzyme activity vs temperature (peak at optimum, falls after) and vs pH (bell-shaped).`,

        "Respiration and gas exchange": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 2 — RESPIRATION & GAS EXCHANGE.

RESPIRATION (releases energy in cells — happens in ALL living cells)
- Aerobic (with oxygen): glucose + oxygen → carbon dioxide + water (+ energy). C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O. Releases a lot of energy; occurs in mitochondria.
- Anaerobic (without oxygen): in muscle → glucose → lactic acid (+ a little energy) — causes oxygen debt/muscle fatigue; in yeast/plants → glucose → ethanol + carbon dioxide (fermentation). Releases much less energy than aerobic.
- Energy from respiration is used for: muscle contraction/movement, active transport, building large molecules, growth, keeping warm (mammals/birds).

GAS EXCHANGE IN HUMANS
- Pathway: nose/mouth → trachea → bronchi → bronchioles → alveoli. Trachea held open by cartilage rings; lined with ciliated cells + goblet cells (mucus traps dust/microbes, cilia sweep it up).
- Alveoli are adapted for gas exchange: large surface area, thin (one-cell) walls → short diffusion distance, moist, rich blood supply (maintains the concentration gradient). O₂ diffuses into blood, CO₂ out.
- Breathing (ventilation): inhale — diaphragm contracts/flattens, external intercostals contract → ribs up and out → volume up, pressure down → air in. Exhale — the reverse.

GAS EXCHANGE IN PLANTS / LEAVES
- Leaves: stomata (pores, opened/closed by guard cells) allow CO₂ in for photosynthesis and O₂ out (and vice versa in the dark). Net gas exchange depends on light intensity (balance of photosynthesis vs respiration).

WORKED-EXAMPLE MATERIAL
- Write the aerobic/anaerobic equations; explain how alveoli are adapted; describe the volume/pressure changes in breathing; explain the difference in CO₂ between inhaled and exhaled air.
COMMON MISTAKES
- Confusing respiration (cellular, releases energy) with breathing/ventilation; forgetting anaerobic gives less energy; saying respiration "makes" energy (it releases it).
REACTIONS: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O; glucose → lactic acid; glucose → ethanol + CO₂. GRAPHS: empty.`,

        "Transport, excretion and coordination": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 2 — TRANSPORT, EXCRETION & COORDINATION.

TRANSPORT IN HUMANS (circulation)
- Double circulation: heart → lungs → heart → body. Blood vessels: arteries (thick muscular walls, high pressure, carry blood AWAY from heart, no valves); veins (thinner walls, low pressure, TOWARDS heart, have valves); capillaries (one cell thick → exchange of substances with tissues).
- Heart: right side pumps deoxygenated blood to lungs; left side (thicker muscle) pumps oxygenated blood to the body. Valves prevent backflow; coronary arteries supply the heart muscle.
- Blood components: red blood cells (haemoglobin + O₂ → oxyhaemoglobin), white blood cells (defence — phagocytosis & antibodies), platelets (clotting), plasma (carries CO₂, urea, nutrients, hormones).

TRANSPORT IN PLANTS
- Xylem: carries water + dissolved minerals UP from roots to leaves (transpiration stream); dead, hollow, lignified. Phloem: carries dissolved sugars (translocation) up and down; living.
- Transpiration = loss of water vapour from leaves (through stomata). Faster with higher temperature, light intensity, air movement (wind), and lower humidity. Water enters root hair cells by osmosis.

EXCRETION (kidneys)
- Excretion = removal of metabolic waste. CO₂ removed by lungs; urea (from breakdown of excess amino acids in the liver — deamination) removed by kidneys in urine.
- Kidneys filter the blood (ultrafiltration) and reabsorb useful substances (glucose, some water/salts). Osmoregulation controls water content.

COORDINATION
- Nervous: fast, short-lived, electrical impulses along neurones. Reflex arc: stimulus → receptor → sensory neurone → relay (spinal cord) → motor neurone → effector → response (rapid, protective, involuntary). Synapse = gap; impulse passes by chemical (neurotransmitter).
- Hormonal: chemical messengers in the blood, slower, longer-lasting (e.g. adrenaline; insulin controls blood glucose).
- Homeostasis = maintaining a constant internal environment (temperature, blood glucose, water).

WORKED-EXAMPLE MATERIAL
- Compare arteries/veins/capillaries; trace blood through the heart; explain transpiration factors; describe a reflex arc; contrast nervous vs hormonal control.
COMMON MISTAKES
- Saying arteries always carry oxygenated blood (the pulmonary artery is deoxygenated); confusing xylem (water, up) with phloem (sugar, both ways); calling a reflex "voluntary".
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit3: {
        "Reproduction in plants and humans": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 3 — REPRODUCTION IN PLANTS & HUMANS.

ASEXUAL vs SEXUAL
- Asexual: one parent, no gametes, offspring genetically identical (clones), no variation — e.g. by mitosis, runners, bulbs. Sexual: two parents, gametes fuse (fertilisation), offspring show variation.

FLOWERING PLANT REPRODUCTION
- Flower parts: stamen (anther + filament) = male, makes pollen; carpel (stigma, style, ovary with ovules) = female. Sepals, petals.
- Pollination = transfer of pollen from anther to stigma. Insect-pollinated (large bright scented petals, nectar, sticky/spiky pollen, sticky stigma inside) vs wind-pollinated (small dull no petals, large feathery anthers/stigmas hanging out, lots of light smooth pollen).
- Fertilisation: pollen grain grows a pollen tube down the style to the ovule; nuclei fuse. Ovule → seed, ovary → fruit.
- Germination needs water, oxygen and warmth (a suitable temperature).

HUMAN REPRODUCTION
- Male: testes (make sperm + testosterone), sperm duct, urethra, penis. Female: ovaries (eggs + oestrogen/progesterone), oviduct (fertilisation site), uterus, cervix, vagina.
- Fertilisation: sperm + egg fuse in the oviduct → zygote → embryo → implants in the uterus lining.
- Placenta: exchange between mother and fetus — O₂, glucose, amino acids to fetus; CO₂, urea away. The umbilical cord connects fetus to placenta; the amniotic fluid protects/cushions.
- Menstrual cycle (~28 days): controlled by hormones — FSH (egg maturation), oestrogen (repairs uterus lining, triggers LH), LH (ovulation ~day 14), progesterone (maintains lining).
- Secondary sexual characteristics develop at puberty (testosterone in males, oestrogen in females).

WORKED-EXAMPLE MATERIAL
- Compare insect- vs wind-pollinated flowers; describe fertilisation in a plant or human; state the role of the placenta; outline the hormones of the menstrual cycle.
COMMON MISTAKES
- Confusing pollination (transfer) with fertilisation (fusion of nuclei); mixing up oviduct (fertilisation) and uterus (development); thinking asexual reproduction gives variation.
REACTIONS: empty. GRAPHS: empty.`,

        "Inheritance, DNA and cell division": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 3 — INHERITANCE, DNA & CELL DIVISION.

DNA & CHROMOSOMES
- DNA is a double helix made of two strands; a gene = a section of DNA coding for a protein (a sequence of amino acids). Chromosomes are long DNA molecules; humans have 23 pairs (46) in body cells.
- Genome = all the genetic material of an organism. Alleles = different versions of a gene.

CELL DIVISION
- MITOSIS: produces two genetically identical diploid cells — for growth, repair and asexual reproduction.
- MEIOSIS: produces four genetically different haploid gametes (half the chromosome number); introduces variation. Fertilisation restores the diploid number.

GENETIC TERMS
- Gene/allele; dominant (shown with one copy, capital letter) / recessive (needs two copies, lowercase); homozygous (two same alleles) / heterozygous (two different); genotype (alleles present) / phenotype (physical characteristic).

MONOHYBRID INHERITANCE
- Use a Punnett square. Cross of two heterozygotes (Bb × Bb) → 3:1 dominant:recessive ratio. A test cross with the homozygous recessive reveals an unknown genotype.
- Codominance: both alleles expressed (e.g. ... patterns). Human sex determination: XX female, XY male → 1:1 ratio.
- Some conditions are inherited (e.g. cystic fibrosis — recessive). A pedigree diagram traces inheritance through a family.

VARIATION & MUTATION
- Genetic variation (alleles, from meiosis/fertilisation/mutation) is inheritable; environmental variation is not. Continuous variation (range, e.g. height) vs discontinuous (categories, e.g. blood group).
- Mutation = a random change to a gene/DNA; the source of new alleles. Rate increased by ionising radiation and some chemicals (mutagens/carcinogens).

WORKED-EXAMPLE MATERIAL
- Complete a Punnett square and give ratios/probabilities; interpret a pedigree; compare mitosis and meiosis; define genotype/phenotype/homozygous.
COMMON MISTAKES
- Confusing mitosis (identical, diploid) with meiosis (varied, haploid gametes); writing genotypes with mixed-case errors; giving ratios as definite numbers rather than probabilities.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit4: {
        "The organism in the environment": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 4 — THE ORGANISM IN THE ENVIRONMENT.

KEY TERMS
- Population = all the organisms of one species in an area. Community = all the populations of different species. Habitat = the place where an organism lives. Ecosystem = a community + the non-living (abiotic) environment, interacting.

SAMPLING (estimating distribution & abundance)
- Quadrat: a square frame placed (randomly, to avoid bias) to count organisms or estimate % cover. Estimate population = mean per quadrat × (total area ÷ quadrat area).
- Transect: a line across a habitat; record organisms along it to study how distribution changes with an abiotic factor (e.g. light, up a shore).
- Capture–mark–recapture (Lincoln index) for mobile animals: population ≈ (number in 1st sample × number in 2nd sample) ÷ number marked in 2nd sample. Assumptions: no births/deaths/migration, marks don't harm or wash off, marked animals mix back in.

ABIOTIC & BIOTIC FACTORS
- Abiotic (non-living): light intensity, temperature, water/moisture, pH, soil/mineral content, oxygen/CO₂ levels.
- Biotic (living): food availability, predation, competition (for resources), disease.

WORKED-EXAMPLE MATERIAL
- Estimate a population from quadrat data or the mark–recapture formula; explain why sampling must be random; suggest abiotic factors affecting where a species lives.
COMMON MISTAKES
- Non-random quadrat placement (bias); forgetting the mark–recapture assumptions; confusing population, community and ecosystem.
REACTIONS: empty. GRAPHS: empty.`,

        "Feeding relationships and cycles": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 4 — FEEDING RELATIONSHIPS, ENERGY FLOW & CYCLES.

FEEDING RELATIONSHIPS
- Producers (plants — photosynthesise, make food) → primary consumers (herbivores) → secondary → tertiary consumers (carnivores). Decomposers (bacteria/fungi) break down dead material.
- Food chain shows energy flow (arrows point in the direction of energy transfer). Food web = interlinked chains. Trophic level = feeding level.
- Pyramids: of numbers (count of organisms — can be odd shapes), of biomass (mass at each level — usually a true pyramid).

ENERGY TRANSFER
- Energy enters as light, captured by producers in photosynthesis. Only ~10% of energy passes to the next trophic level — the rest is lost as heat (respiration), in movement, and in undigested/egested material and excretion. This limits the number of trophic levels (usually ≤5) and explains why pyramids of biomass narrow upward.

THE CARBON CYCLE
- CO₂ removed from air by photosynthesis. Returned by respiration (plants, animals, decomposers), combustion of fossil fuels/wood, and decomposition. Fossil fuels lock carbon away for millions of years.

THE NITROGEN CYCLE
- Nitrogen-fixing bacteria (in soil/root nodules of legumes) convert N₂ → nitrates/ammonium; lightning also fixes nitrogen.
- Decomposers convert proteins/urea → ammonium (decay). Nitrifying bacteria: ammonium → nitrites → nitrates (plants absorb nitrates to make protein). Denitrifying bacteria: nitrates → N₂ gas (returns to air).
- Plants absorb nitrate to make amino acids/proteins; animals get nitrogen by eating plants/animals.

WORKED-EXAMPLE MATERIAL
- Interpret a food web (effect of removing a species); explain the ~10% energy loss; describe the role of each bacteria type in the nitrogen cycle.
COMMON MISTAKES
- Drawing food-chain arrows the wrong way (they show energy flow); confusing nitrifying with nitrogen-fixing bacteria; forgetting decomposers in the carbon cycle.
REACTIONS: empty. GRAPHS: empty.`,

        "Human influences on the environment": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 4 — HUMAN INFLUENCES ON THE ENVIRONMENT.

POLLUTION — WATER
- Eutrophication: excess nitrate/phosphate (from fertiliser run-off or sewage) → algal bloom → blocks light → plants die → decomposers (bacteria) multiply → use up oxygen (high BOD) → fish/animals suffocate.
- Sewage and other pollutants also reduce dissolved oxygen and spread disease.

POLLUTION — AIR
- Carbon dioxide and methane are greenhouse gases → enhanced greenhouse effect → global warming/climate change (rising sea levels, changing weather, habitat loss). Methane from cattle, rice paddies, landfill.
- Sulfur dioxide and nitrogen oxides (from burning fossil fuels) → acid rain → damages trees, acidifies lakes (kills fish), erodes buildings.

DEFORESTATION
- Effects: less photosynthesis → more CO₂ in the atmosphere; loss of habitat/biodiversity (extinction); soil erosion and flooding; disruption of the water cycle.

CONSERVATION & SUSTAINABILITY
- Conservation maintains biodiversity (protected areas, captive breeding, replanting, seed banks). Sustainable resource use means meeting present needs without harming the future (e.g. fishing quotas/net mesh size, replanting forests).

WORKED-EXAMPLE MATERIAL
- Sequence the steps of eutrophication; explain the greenhouse effect and a consequence; list effects of deforestation; suggest a conservation measure.
COMMON MISTAKES
- Saying algae "use up oxygen" directly (it's the decomposers); confusing acid rain (SO₂/NOₓ) with the greenhouse effect (CO₂/CH₄); vague "pollution kills things" answers.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit5: {
        "Food production (crop plants and livestock)": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 5 — FOOD PRODUCTION.

GLASSHOUSES & POLYTUNNELS (crop yield)
- Increase yield by controlling factors that limit photosynthesis/growth: light (lamps), temperature (heating), and CO₂ enrichment (e.g. paraffin heaters). Also protection from pests and easier control of conditions.
- Fertilisers add minerals (nitrate for proteins/growth, phosphate, potassium) to increase yield. Overuse → eutrophication.
- Pest control: pesticides kill pests (but can harm other species/accumulate in food chains — bioaccumulation) vs biological control (a natural predator — slower, more specific, no chemical residue).

MICROORGANISMS IN FOOD PRODUCTION
- YOGHURT: bacteria (Lactobacillus) ferment lactose → lactic acid → lowers pH → milk clots/thickens and is preserved.
- BREAD: yeast respires anaerobically (fermentation) → CO₂ makes the dough rise (ethanol evaporates on baking).
- ALCOHOL (beer/wine): yeast ferments sugars → ethanol + CO₂ (anaerobic).

INDUSTRIAL FERMENTERS
- Large vessels to grow microorganisms (e.g. yeast, Penicillium) under optimum conditions. Controlled: temperature (water jacket/cooling — fermentation is exothermic), pH, oxygen (air supply), nutrients, and stirring (paddles distribute heat/nutrients). Kept sterile to prevent contamination.

WORKED-EXAMPLE MATERIAL
- Explain how a glasshouse increases yield; describe the microbe and process for yoghurt/bread/alcohol; explain why a fermenter is cooled and kept sterile.
COMMON MISTAKES
- Saying fermentation needs oxygen (it's anaerobic); forgetting fermenters need COOLING (the reaction is exothermic); confusing chemical vs biological pest control.
REACTIONS: anaerobic respiration in yeast: glucose → ethanol + CO₂; lactose → lactic acid (yoghurt). GRAPHS: empty.`,

        "Selective breeding and genetic modification": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 5 — SELECTIVE BREEDING & GENETIC MODIFICATION.

SELECTIVE BREEDING (artificial selection)
- Choose parents with the desired characteristic → breed them → choose the best offspring → repeat over many generations. Examples: cows with high milk yield, disease-resistant/high-yield wheat, dogs for temperament.
- Pros: improved yield/traits. Cons: reduced genetic variation (smaller gene pool) → more vulnerable to disease/environmental change; can cause inherited health problems (inbreeding).

GENETIC MODIFICATION / ENGINEERING
- Transferring a gene from one organism into another to give it a desired characteristic. Uses enzymes: restriction enzymes cut the DNA (often leaving "sticky ends"); ligase joins the gene into a vector (plasmid). The modified plasmid is taken up by a host (e.g. bacterium) which then expresses the gene.
- Example — human insulin: the human insulin gene is inserted into a bacterial plasmid → the bacteria are grown in a fermenter and produce large amounts of pure human insulin.
- Other examples: GM crops (e.g. pest-resistant Bt crops, herbicide resistance, higher yield, added vitamins).
- Evaluation: benefits (more food/medicine, less pesticide, vitamins) vs concerns (effect on ecosystems/biodiversity, gene transfer to wild plants, ethical and long-term safety questions).

WORKED-EXAMPLE MATERIAL
- Describe the steps of selective breeding and a disadvantage; outline how bacteria are engineered to make insulin (restriction enzyme, plasmid vector, ligase); evaluate GM crops.
COMMON MISTAKES
- Confusing selective breeding (choosing parents, slow) with genetic modification (moving a gene directly); forgetting the names/roles of restriction enzymes, ligase and the plasmid vector.
REACTIONS: empty. GRAPHS: empty.`,

        "Cloning": `EDEXCEL IGCSE BIOLOGY (4BI1) TOPIC 5 — CLONING.

CLONES
- A clone = genetically identical organism(s) produced from one parent (asexual reproduction → no variation).

MICROPROPAGATION / TISSUE CULTURE (plants)
- Take many small pieces of tissue (explants) from a parent plant; grow them on a sterile agar/nutrient medium containing plant hormones (auxins) → each grows into a new identical plantlet.
- Advantages: rapidly produce many identical plants from one parent with desirable features; possible all year; produce disease-free stock; conserve rare plants. Disadvantage: no genetic variation → a whole crop is vulnerable to the same disease.

CLONING ANIMALS — NUCLEAR TRANSFER (e.g. Dolly the sheep)
- Remove the nucleus from an unfertilised egg cell (enucleated egg). Take a body-cell nucleus (diploid) from the animal to be cloned. Insert that nucleus into the empty egg cell. Stimulate it (e.g. small electric shock) to divide → embryo. Implant the embryo into a surrogate mother → offspring is genetically identical to the nucleus donor.
- Uses: produce many identical animals with desired traits; produce GM animals (e.g. to make medicines in milk); research.
- Issues: low success rate, possible health problems, reduced variation, and ethical concerns.

WORKED-EXAMPLE MATERIAL
- Describe micropropagation and an advantage/disadvantage; put the steps of nuclear transfer in order; explain why clones show no variation.
COMMON MISTAKES
- Muddling the order of nuclear transfer (the egg's nucleus is removed, the body-cell nucleus is inserted); forgetting clones come from asexual processes; saying clones differ genetically.
REACTIONS: empty. GRAPHS: empty.`,
      },
    },

    physics: {
      unit1: {
        "Movement and position (v = u + at, s = ut + ½at²)": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 1 — MOVEMENT AND POSITION. Notation: u=initial velocity, v=final velocity, a=acceleration, t=time, s=distance.

SPEED, VELOCITY & ACCELERATION
- Speed = distance ÷ time (scalar). Average speed = total distance ÷ total time. Velocity = speed in a given direction (vector). Acceleration a = (v − u) ÷ t, unit m/s². Deceleration = negative acceleration.
- Typical values to know: walking ~1.5 m/s, running ~3 m/s, car ~13–30 m/s, speed of sound in air ~340 m/s.

EQUATIONS OF MOTION (uniform acceleration)
- v = u + at.
- s = ut + ½at² (also stated as s = ut + (1/2)at²).
- (Average velocity) s = ((u + v)/2) × t.
- v² = u² + 2as (given on the formula sheet for higher-level questions).

DISTANCE–TIME GRAPHS
- Gradient = speed. Horizontal line = stationary. Straight slope = constant speed. Curve getting steeper = accelerating.

VELOCITY–TIME GRAPHS
- Gradient = acceleration (a straight slope = constant acceleration; horizontal = constant velocity). AREA under the line = distance travelled (use triangles + rectangles, or ½ base × height).

WORKED-EXAMPLE MATERIAL
- Use v = u + at and s = ut + ½at²; find acceleration from a v–t graph gradient; find distance from the area under a v–t graph; convert km/h to m/s.
COMMON MISTAKES
- Confusing distance–time (gradient = speed) with velocity–time (gradient = acceleration, area = distance); forgetting units; sign of deceleration.
REACTIONS: empty. GRAPHS: distance–time and velocity–time graphs (gradient and area interpretations).`,

        "Forces, movement, shape and momentum": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 1 — FORCES, MOVEMENT, SHAPE & MOMENTUM.

FORCES
- A force (N) can change an object's speed, direction or shape. Forces are vectors. Resultant force = the single force that has the same effect as all forces combined. Balanced forces → no change in motion; unbalanced (resultant ≠ 0) → acceleration in that direction.
- Newton's second law: F = ma (resultant force = mass × acceleration). Weight W = mg (g ≈ 10 N/kg or 9.8). Mass (kg) is the amount of matter; weight (N) is the gravitational force on it.
- Friction and air resistance oppose motion. Terminal velocity: a falling object accelerates until air resistance = weight (resultant = 0) → constant maximum velocity.

FORCES AND SHAPE (Hooke's Law)
- Hooke's law: extension is directly proportional to the force (load), provided the limit of proportionality is not exceeded: F = k × x (k = spring constant, N/m; x = extension).
- Force–extension graph is a straight line through the origin up to the limit of proportionality, then curves.

MOMENTUM
- Momentum p = mass × velocity (kg m/s), a vector.
- Force = rate of change of momentum: F = (mv − mu) ÷ t.
- Conservation of momentum: in a collision/explosion with no external force, total momentum before = total momentum after. Use to find an unknown velocity after a collision.
- Safety features (crumple zones, airbags, seatbelts) increase the time of the collision → reduce the rate of change of momentum → reduce the force.

WORKED-EXAMPLE MATERIAL
- Use F = ma and W = mg; F = kx for a spring; momentum conservation in a collision; explain terminal velocity using forces.
COMMON MISTAKES
- Confusing mass and weight; forgetting momentum is a vector (direction/sign matters); using force = m×v instead of F = Δ(mv)/t; reading the spring graph beyond the limit.
REACTIONS: empty. GRAPHS: force–extension (Hooke's law) — linear then curves past the limit of proportionality.`,

        "Newton’s Laws and stopping distances": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 1 — NEWTON'S LAWS & STOPPING DISTANCES.

NEWTON'S LAWS OF MOTION
- 1st law: an object stays at rest or moves at constant velocity unless acted on by a resultant force (inertia).
- 2nd law: resultant force = mass × acceleration, F = ma. Acceleration is in the direction of the resultant force.
- 3rd law: for every action there is an equal and opposite reaction (forces act in pairs on different objects).

STOPPING DISTANCE
- Stopping distance = thinking distance + braking distance.
- Thinking distance = distance travelled during the driver's reaction time (≈ speed × reaction time). Increased by: tiredness, alcohol/drugs, distractions, higher speed.
- Braking distance = distance to stop once the brakes are applied. Increased by: higher speed, wet/icy/greasy road, worn tyres/brakes, greater mass. (Work done by braking force = kinetic energy → friction heats the brakes.)
- Both increase with speed; braking distance increases more steeply (∝ speed²).

CIRCULAR MOTION (basic)
- An object moving in a circle changes direction → it is accelerating → needs a resultant force toward the centre (centripetal force, e.g. friction, tension, gravity). If the force is removed, it flies off in a straight line (tangent).

WORKED-EXAMPLE MATERIAL
- State the three laws; calculate thinking/braking/total stopping distance; list factors affecting each; explain why a car on a roundabout needs a force.
COMMON MISTAKES
- Forgetting thinking distance is separate from braking distance; mixing up factors that affect thinking vs braking distance; saying there's no force in steady circular motion (there is — centripetal).
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit2: {
        "Mains electricity and safety": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 2 — MAINS ELECTRICITY & SAFETY.

MAINS SUPPLY
- UK mains is alternating current (a.c.), ~230 V, 50 Hz. Cells/batteries give direct current (d.c.).
- Three-pin plug wiring: LIVE (brown) carries the alternating voltage; NEUTRAL (blue) completes the circuit at ~0 V; EARTH (green/yellow) is a safety wire connected to the metal case.

SAFETY FEATURES
- Fuse: a thin wire in the live wire that melts ("blows") if the current is too high → breaks the circuit. Choose a fuse rated just above the normal current (I = P ÷ V).
- Earthing: a metal case is connected to earth; if the live wire touches the case, a large current flows to earth → blows the fuse → case is safe to touch. Double insulation (plastic case) means no earth wire is needed.
- Circuit breakers: switch that trips and breaks the circuit on excess current (resettable, faster than a fuse).

POWER & ENERGY
- Electrical power P = V × I (watts). Also P = I²R.
- Energy transferred E = P × t (joules); E = I × V × t. Domestic energy is billed in kilowatt-hours: energy (kWh) = power (kW) × time (h); cost = energy (kWh) × price per kWh.
- Heating effect: current through a resistor transfers electrical energy to heat (used in heaters; wasted in cables). Higher current/resistance → more heat.

WORKED-EXAMPLE MATERIAL
- Choose a suitable fuse using I = P/V; explain how earthing + a fuse protect the user; calculate energy cost in kWh; use P = VI and E = Pt.
COMMON MISTAKES
- Swapping the wire colours; saying the fuse "stops" current normally (it only blows on a fault); confusing kW and kWh; using the wrong power equation.
REACTIONS: empty. GRAPHS: empty.`,

        "Energy and voltage in circuits": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 2 — ENERGY & VOLTAGE IN CIRCUITS.

CURRENT, VOLTAGE & RESISTANCE
- Current I = rate of flow of charge, I = Q ÷ t (amps; Q in coulombs). Measured with an ammeter in SERIES.
- Voltage/potential difference V = energy transferred per unit charge, V = E ÷ Q (volts). Measured with a voltmeter in PARALLEL across a component.
- Resistance R = V ÷ I (ohms). A resistor opposes current.

OHM'S LAW & I–V CHARACTERISTICS
- Ohm's law: for a metallic conductor at constant temperature, current ∝ voltage (R constant) → I–V graph is a straight line through the origin.
- Filament lamp: I–V curve flattens (S-shape) — resistance increases as it heats up. Diode: only conducts one way (current flows above a small forward voltage, blocks reverse).
- Thermistor: resistance decreases as temperature increases. LDR: resistance decreases as light intensity increases. (Used in sensing circuits.)

SERIES vs PARALLEL CIRCUITS
- Series: same current everywhere; voltages add up (V_total = V₁ + V₂); total resistance = R₁ + R₂ + …
- Parallel: voltage the same across each branch; currents add (I_total = I₁ + I₂); total resistance is less than the smallest branch.

WORKED-EXAMPLE MATERIAL
- Use I = Q/t, V = E/Q, R = V/I; sketch/interpret I–V graphs for a resistor, lamp and diode; find current/voltage/resistance in series and parallel circuits.
COMMON MISTAKES
- Connecting the ammeter in parallel or voltmeter in series; saying a filament lamp obeys Ohm's law (it doesn't — R rises); adding parallel resistances like series.
REACTIONS: empty. GRAPHS: I–V characteristics for a fixed resistor (linear), filament lamp (S-curve) and diode (one-directional).`,

        "Electric charge and static electricity": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 2 — ELECTRIC CHARGE & STATIC ELECTRICITY.

STATIC CHARGE
- Charge by friction: rubbing insulators transfers ELECTRONS (negative). The material that gains electrons becomes negative; the one that loses electrons becomes positive. (Only electrons move, never protons.) E.g. a polythene rod rubbed with a cloth gains electrons → negative.
- Like charges repel, unlike charges attract. Demonstrate by bringing charged rods near a suspended rod.
- A charged object attracts small uncharged objects by inducing an opposite charge on the near side (e.g. attracting paper/water stream, bits of paper to a comb).

ELECTRIC FIELDS
- A charged object has an electric field around it; field lines go from positive to negative; a small charge in the field feels a force.

DANGERS & USES OF STATIC
- Dangers: sparks when charge jumps (refuelling aircraft/tankers → fire risk; remove by earthing/bonding); electric shocks.
- Uses: inkjet printers, photocopiers, electrostatic paint/crop spraying (charged droplets spread evenly and are attracted to the earthed object), smoke precipitators (charged dust attracted to plates).

CURRENT AS FLOWING CHARGE
- Electric current is a flow of charge (electrons in a metal). I = Q ÷ t, so Q = I × t (charge in coulombs).
- In a metal, the outer electrons are free to move (delocalised) and carry the current.

WORKED-EXAMPLE MATERIAL
- Explain charging by friction in terms of electron transfer; predict attraction/repulsion; give a use and a danger of static; use Q = It.
COMMON MISTAKES
- Saying protons move (only electrons transfer); getting the sign wrong (gaining electrons = negative); confusing induced charge with charging by contact.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit3: {
        "Properties of waves (v = fλ)": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 3 — PROPERTIES OF WAVES. Notation: v=wave speed, f=frequency, λ=wavelength, T=period.

WAVE BASICS
- A wave transfers energy (and information) without transferring matter.
- Transverse: vibrations perpendicular to the direction of travel (e.g. light, all EM waves, water ripples, waves on a rope). Longitudinal: vibrations parallel to travel — compressions and rarefactions (e.g. sound).
- Definitions: amplitude (max displacement from rest — relates to energy/loudness/brightness); wavelength λ (distance for one full cycle, m); frequency f (waves per second, Hz); period T (time for one wave, s).

WAVE EQUATIONS
- Wave speed v = f λ (m/s).
- Frequency and period: f = 1 ÷ T.

WAVE BEHAVIOUR
- Reflection: wave bounces off a surface (angle of incidence = angle of reflection).
- Refraction: wave changes speed (and direction) when it crosses into a different medium — bends toward the normal entering a denser/slower medium, away leaving it. Wavelength changes, frequency stays the same.
- Diffraction: waves spread out through a gap or around an edge; most noticeable when the gap is similar in size to the wavelength.

WORKED-EXAMPLE MATERIAL
- Use v = fλ and f = 1/T; label wavelength/amplitude on a wave; describe reflection, refraction and diffraction; classify a wave as transverse or longitudinal.
COMMON MISTAKES
- Forgetting frequency stays constant during refraction (speed and wavelength change); confusing amplitude with wavelength; mixing up transverse and longitudinal examples.
REACTIONS: empty. GRAPHS: a labelled transverse wave (amplitude, wavelength).`,

        "The electromagnetic spectrum": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 3 — THE ELECTROMAGNETIC SPECTRUM.

THE SPECTRUM (in order — learn it)
- Radio → Microwave → Infrared → Visible light → Ultraviolet → X-rays → Gamma.
- Increasing FREQUENCY and ENERGY (and decreasing WAVELENGTH) from radio to gamma. All are transverse, all travel at the speed of light in a vacuum (3×10⁸ m/s), all transfer energy.
- Visible light order (low→high frequency): Red, Orange, Yellow, Green, Blue, Indigo, Violet.

USES (radio → gamma)
- Radio: broadcasting and communications (TV/radio).
- Microwaves: cooking (heat water in food), satellite & mobile phone communications.
- Infrared: heaters, grills, cooking; thermal imaging; short-range communication/remote controls; optical fibres.
- Visible: vision, photography, illumination, optical fibres.
- Ultraviolet: security marking/fluorescence, sterilising water, sun tanning/vitamin D; detecting forged banknotes.
- X-rays: medical imaging of bones, airport security scanners.
- Gamma: sterilising medical equipment and food, killing cancer cells (radiotherapy), medical tracers.

DANGERS
- Microwaves: internal heating of body tissue. Infrared: skin burns. Ultraviolet: damages skin cells (sunburn, skin cancer), eye damage. X-rays and gamma: ionising → mutate/kill cells, cause cancer. Higher frequency/energy → more harmful.

WORKED-EXAMPLE MATERIAL
- Recall the spectrum order and trends; match a use to a region; state a danger; use v = fλ with c = 3×10⁸ m/s.
COMMON MISTAKES
- Reversing the order or the frequency/wavelength trend; mixing up uses (microwaves vs infrared for cooking/communication); forgetting all EM waves travel at the same speed in a vacuum.
REACTIONS: empty. GRAPHS: empty. REFERENCE TABLES: EM spectrum regions with a use and a danger for each.`,

        "Light and sound": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 3 — LIGHT AND SOUND.

REFLECTION & REFRACTION OF LIGHT
- Reflection: angle of incidence = angle of reflection (measured from the normal). A plane mirror gives an image that is virtual, upright, same size, laterally inverted, and as far behind the mirror as the object is in front.
- Refraction: light bends toward the normal entering a denser medium (e.g. air→glass, slows down), away on leaving. Refractive index n = sin i ÷ sin r (also n = c/v).
- Total internal reflection (TIR): when light in the denser medium hits the boundary at an angle greater than the critical angle c, it all reflects. n = 1 ÷ sin c. Used in optical fibres (communications, endoscopes) and reflecting prisms.

SOUND
- Sound is a longitudinal wave (compressions and rarefactions); needs a medium (can't travel through a vacuum). Speed in air ≈ 340 m/s (faster in liquids and solids).
- Frequency → pitch (higher f = higher pitch); amplitude → loudness. Human hearing range ≈ 20 Hz to 20 000 Hz.
- Echoes are reflected sound (use to measure distance: distance = speed × time, remembering the sound travels there AND back, so divide by 2).
- An oscilloscope (CRO) displays a sound wave: louder = bigger amplitude; higher pitch = waves closer together.

WORKED-EXAMPLE MATERIAL
- Use n = sin i / sin r and n = 1/sin c; describe an image in a plane mirror; explain TIR in an optical fibre; use distance = speed × time for an echo (÷2).
COMMON MISTAKES
- Measuring angles from the surface not the normal; forgetting to halve the distance for an echo; saying sound travels through a vacuum; confusing pitch (frequency) with loudness (amplitude).
REACTIONS: empty. GRAPHS: ray diagrams (reflection/refraction/TIR); oscilloscope traces for pitch and loudness.`,
      },
      unit4: {
        "Energy transfers and efficiency": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 4 — ENERGY TRANSFERS & EFFICIENCY.

ENERGY STORES & TRANSFERS
- Stores: kinetic, gravitational potential, elastic (strain), chemical, nuclear, thermal (internal), electrostatic, magnetic.
- Conservation of energy: energy cannot be created or destroyed, only transferred/stored. In every transfer some energy is dissipated (wasted), usually as heat to the surroundings.

KEY EQUATIONS
- Kinetic energy KE = ½ m v².
- Gravitational PE = m g h (change in GPE for a height change h; g ≈ 10 N/kg).
- Work done = force × distance, W = F × d (joules). Work done = energy transferred.
- Power = work done (or energy transferred) ÷ time, P = W ÷ t (watts).

EFFICIENCY
- Efficiency = useful energy (or power) output ÷ total energy (or power) input (× 100%). Always < 100% because some energy is wasted as heat/sound.
- Sankey diagrams show the proportion of input energy that becomes useful vs wasted (width ∝ energy).

CONSERVATION OF ENERGY EXAMPLES
- Falling/pendulum: GPE → KE (mgh = ½mv² ignoring resistance). Braking: KE → heat in brakes.
- Reducing waste: insulation, lubrication, streamlining.

WORKED-EXAMPLE MATERIAL
- Use KE = ½mv², GPE = mgh, W = Fd, P = W/t; calculate efficiency; equate mgh = ½mv² for a falling object; interpret a Sankey diagram.
COMMON MISTAKES
- Forgetting the ½ or squaring v in KE; mixing up power and energy; efficiency over 100% (impossible — check useful vs total); wrong units.
REACTIONS: empty. GRAPHS: Sankey energy-transfer diagrams.`,

        "Conduction, convection and radiation": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 4 — CONDUCTION, CONVECTION & RADIATION (heat transfer).

CONDUCTION (mainly solids)
- Heat passes along a solid as particles vibrate more and pass energy to neighbours. In metals, free (delocalised) electrons carry energy quickly → metals are good conductors. Non-metals, liquids and gases are poor conductors (insulators) — trapped air is a good insulator.

CONVECTION (liquids and gases — fluids)
- When a fluid is heated it expands, becomes less dense, and rises; cooler denser fluid sinks to take its place → a convection current that transfers heat. Explains heating a room, sea breezes, hot water systems.

RADIATION (no medium needed — by infrared waves)
- All objects emit and absorb infrared (thermal) radiation; hotter objects emit more. Can travel through a vacuum (how we get heat from the Sun).
- Surfaces: matt black surfaces are the best emitters AND best absorbers of radiation; shiny/silver/white surfaces are poor emitters and good reflectors. (Leslie cube experiment shows black emits most.)

APPLICATIONS
- Vacuum (Thermos) flask: vacuum stops conduction/convection; silvered walls reduce radiation; stopper reduces evaporation/convection.
- Home insulation: loft insulation, cavity-wall insulation, double glazing (trapped air/gas reduces conduction & convection).

WORKED-EXAMPLE MATERIAL
- Explain each mechanism in terms of particles/electrons/density; explain how a vacuum flask reduces all three; predict which surface heats/cools fastest.
COMMON MISTAKES
- Saying convection happens in solids (only fluids — particles can't move); thinking radiation needs particles; forgetting black is both best emitter and best absorber.
REACTIONS: empty. GRAPHS: empty.`,

        "Energy resources and electricity generation": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 4 — ENERGY RESOURCES & ELECTRICITY GENERATION.

NON-RENEWABLE (finite) RESOURCES
- Fossil fuels (coal, oil, gas): burned to heat water → steam → turbine → generator. Reliable, high output, but produce CO₂ (greenhouse/climate change) and SO₂ (acid rain); will run out.
- Nuclear: uses nuclear fission of uranium to heat water → steam → turbine. No CO₂ during generation, high output, but produces radioactive waste (long-term storage) and risk of accidents; high decommissioning cost.

RENEWABLE RESOURCES
- Wind: turbines turned by wind. No fuel/CO₂; but intermittent (no wind = no power), visual/noise impact, low output per turbine.
- Solar: solar cells (electricity directly) or solar heating. No CO₂; but depends on sunlight (none at night), low power density.
- Hydroelectric: water stored behind a dam falls and turns turbines. Reliable, fast response; but needs suitable geography, floods land/habitats.
- Tidal: water flows through turbines in a barrage as tides change. Predictable; but few suitable sites, ecological impact.
- Geothermal: heat from hot rocks underground heats water → steam. Reliable; limited to volcanic regions.
- Biofuels/biomass: burning plant/animal material (carbon-neutral over its life cycle).

CHOOSING & COMPARING
- Compare on: cost (build/running), reliability, power output, environmental impact, start-up time, and whether renewable.

ENERGY TRANSFER IN POWER STATIONS
- Chemical/nuclear → thermal (heat water) → kinetic (turbine) → electrical (generator). Much energy wasted as heat.

WORKED-EXAMPLE MATERIAL
- Compare two resources for a given situation; state the energy transfers in a power station; give a pro and con of a named renewable.
COMMON MISTAKES
- Calling nuclear "renewable" (it's not — uranium is finite, but it is low-carbon); forgetting renewables can be unreliable; vague "bad for the environment" answers.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit5: {
        "Density and pressure (p = ρgh)": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 5 — DENSITY & PRESSURE. Notation: ρ=density, p=pressure, h=depth.

DENSITY
- Density ρ = mass ÷ volume (kg/m³ or g/cm³). ρ = m / V.
- Measuring density: regular solid — measure mass (balance) and volume (l×w×h). Irregular solid — mass on a balance, volume by displacement (water in a measuring cylinder / eureka can). Liquid — mass of a known volume in a measuring cylinder.
- An object floats if its density is less than the fluid's.

PRESSURE
- Pressure = force ÷ area, p = F ÷ A (pascals, Pa = N/m²). Same force over a smaller area → bigger pressure (sharp knives, snowshoes spread force over a large area to reduce pressure).

PRESSURE IN FLUIDS (liquids and gases)
- Pressure in a liquid increases with depth and density. Pressure difference p = ρ g h (density × gravitational field strength × depth/height). It acts equally in all directions at a point and depends only on depth (not container shape).
- This explains why dams are thicker at the base and why pressure increases as you dive deeper.

WORKED-EXAMPLE MATERIAL
- Use ρ = m/V; p = F/A; p = ρgh for pressure at depth; explain a floating/sinking object by density; describe measuring the density of an irregular solid.
COMMON MISTAKES
- Mixing up the density formula (mass/volume); wrong units (cm³ vs m³); forgetting pressure acts in all directions; using force not pressure difference for ρgh.
REACTIONS: empty. GRAPHS: empty.`,

        "Change of state and specific heat capacity": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 5 — CHANGE OF STATE & SPECIFIC HEAT CAPACITY.

KINETIC THEORY & STATES
- Solids: particles in a fixed regular lattice, vibrating. Liquids: close together, random, can move past each other. Gases: far apart, random, fast. Heating gives particles more kinetic energy.
- Changes of state are physical (reversible); the substance is unchanged. During a change of state, temperature stays constant while energy breaks/forms bonds between particles (latent heat).

SPECIFIC HEAT CAPACITY
- Specific heat capacity c = energy needed to raise the temperature of 1 kg of a substance by 1 °C (J/kg°C).
- Q = m c ΔT (energy = mass × specific heat capacity × temperature change). Water has a high c (4200 J/kg°C) → good coolant/stores lots of heat.
- Experiment: heat a known mass with an electric heater, measure energy supplied (E = Pt or VIt) and temperature rise → c = E ÷ (m ΔT).

INTERNAL ENERGY & GAS PRESSURE (link to molecules)
- Internal energy = total kinetic + potential energy of the particles. Raising temperature increases the average kinetic energy of the molecules.
- In a gas, molecules collide with the container walls → this creates pressure. Heating a gas at constant volume → faster molecules, more frequent/harder collisions → higher pressure.

WORKED-EXAMPLE MATERIAL
- Use Q = mcΔT; find c from an experiment; describe a temperature–time graph showing flat sections during melting/boiling; explain pressure of a gas using molecular collisions.
COMMON MISTAKES
- Forgetting temperature is constant during a change of state; wrong units for c; not converting power×time to energy.
REACTIONS: empty. GRAPHS: temperature–time heating curve (flat plateaus at melting and boiling points).`,

        "Ideal gas molecules and gas laws": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 5 — IDEAL GAS MOLECULES & GAS LAWS.

MOLECULAR MODEL OF A GAS
- A gas is many fast, randomly-moving molecules. They collide with the walls and exert a force → pressure = force per unit area on the walls.
- Temperature of a gas is related to the average kinetic energy of its molecules: higher temperature → faster molecules → more KE.
- Absolute zero (0 K = −273 °C) is the temperature at which molecules have minimum kinetic energy. Kelvin: T(K) = θ(°C) + 273.

EXPLAINING THE GAS LAWS (qualitatively)
- Heat a gas at constant volume → molecules move faster → collide with walls more often and harder → pressure increases (pressure ∝ T in kelvin).
- Reduce the volume at constant temperature → molecules hit the walls more frequently → pressure increases.

GAS LAWS (calculations)
- Constant temperature (Boyle's law): p₁V₁ = p₂V₂.
- Constant volume (pressure law): p₁ / T₁ = p₂ / T₂ (T in kelvin).
- Combined: p₁V₁ / T₁ = p₂V₂ / T₂. ALWAYS convert temperatures to kelvin.

WORKED-EXAMPLE MATERIAL
- Convert °C↔K; use p₁V₁ = p₂V₂ and p₁/T₁ = p₂/T₂; explain a pressure change using molecular collisions; relate temperature to molecular KE.
COMMON MISTAKES
- Forgetting to use kelvin in the pressure/temperature law; mixing up which quantity is constant; saying molecules "expand" (the gas expands, molecules don't).
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit6: {
        "Magnets and magnetic fields": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 6 — MAGNETS & MAGNETIC FIELDS.

MAGNETS
- Magnetic materials: iron, steel, nickel, cobalt. Magnetic poles: north and south. Like poles repel, unlike poles attract (a force without contact). Magnetic force is strongest at the poles.
- Permanent magnets keep their magnetism (hard magnetic materials, e.g. steel). Induced magnetism: a magnetic material becomes a magnet when placed in a field, then loses it (soft materials, e.g. iron).
- A repulsion test is the only sure way to show two objects are both magnets (attraction also happens with unmagnetised magnetic material).

MAGNETIC FIELDS
- A magnetic field is the region where a magnetic material or another magnet feels a force. Represented by field lines that go from N to S outside the magnet; closer lines = stronger field.
- Plot a field with a plotting compass or iron filings. A uniform field (parallel, evenly spaced lines) exists between opposite poles of two magnets.
- The Earth behaves like a bar magnet; a compass needle (a small magnet) lines up with the field and points (magnetic) north.

ELECTROMAGNETS (intro)
- A current in a wire creates a magnetic field around it (concentric circles). A coil (solenoid) produces a field like a bar magnet. Adding an iron core makes an electromagnet — stronger, and it can be switched on/off and its strength changed by the current/number of turns. Uses: cranes (lifting scrap iron), relays, electric bells.

WORKED-EXAMPLE MATERIAL
- Sketch the field around a bar magnet and between two poles; explain induced magnetism; describe how a plotting compass shows field shape; explain how to make an electromagnet stronger.
COMMON MISTAKES
- Drawing field lines from S to N (they go N→S outside); using attraction as proof of a magnet (use repulsion); forgetting soft iron loses magnetism easily (good for electromagnets).
REACTIONS: empty. GRAPHS: magnetic field-line diagrams.`,

        "Electromagnetism and the motor effect": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 6 — ELECTROMAGNETISM & THE MOTOR EFFECT.

MAGNETIC FIELD AROUND A CURRENT
- A current-carrying wire has a circular magnetic field around it (right-hand grip rule for direction). A solenoid (coil) has a field like a bar magnet; reverse the current to swap the poles.

THE MOTOR EFFECT
- When a current-carrying wire is placed in a magnetic field, it experiences a force (because the two fields interact). Force is maximum when the wire is at 90° to the field, zero when parallel.
- Fleming's LEFT-hand rule gives the direction: thuMb = Motion (force), First finger = Field (N→S), seCond finger = Current.
- The size of the force increases with current and magnetic field strength. Reverse the current OR the field → reverse the force.

THE DC MOTOR
- A coil in a magnetic field carries a current → forces on the two sides act in opposite directions → the coil turns. A split-ring commutator reverses the current every half-turn so the coil keeps spinning the same way. Increase speed: bigger current, stronger magnets, more turns on the coil.
- Loudspeaker: a current (a.c. audio signal) in a coil in a magnetic field → force makes the coil/cone vibrate → sound.

WORKED-EXAMPLE MATERIAL
- Use Fleming's left-hand rule to find force/current/field direction; explain how a d.c. motor works and the role of the commutator; state how to increase the force/motor speed.
COMMON MISTAKES
- Using the right hand instead of the left for the motor effect; muddling which finger is which; forgetting the commutator keeps the motor turning one way.
REACTIONS: empty. GRAPHS: empty.`,

        "Electromagnetic induction and transformers": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 6 — ELECTROMAGNETIC INDUCTION & TRANSFORMERS.

ELECTROMAGNETIC INDUCTION
- Moving a wire/magnet so that a conductor cuts magnetic field lines (or a changing field through a coil) induces a voltage (e.m.f.); if the circuit is complete, an induced current flows. This is the generator effect.
- Size of induced voltage increases with: faster movement, stronger magnet, more turns on the coil (and larger area). Reversing the motion or magnet reverses the induced voltage. No movement/change → no induced voltage.
- A.C. generator (alternator): a coil rotates in a magnetic field (or magnet rotates) → continuously changing flux → alternating voltage. Slip rings (not a commutator) connect it.

TRANSFORMERS
- A transformer changes the size of an alternating voltage. Primary coil + secondary coil wound on a soft iron core. Alternating current in the primary → changing magnetic field in the core → induces an alternating voltage in the secondary. (Works on a.c. only.)
- Turns rule: Vp / Vs = Np / Ns. Step-up (more turns on secondary, voltage up) and step-down (fewer turns, voltage down).
- Ideal (100% efficient) transformer: power in = power out, Vp Ip = Vs Is.

NATIONAL GRID
- Power stations use step-UP transformers to transmit electricity at very high voltage (low current). Lower current → much less energy wasted as heat in the cables (heating ∝ I²R). Step-DOWN transformers near homes reduce it to a safe voltage.

WORKED-EXAMPLE MATERIAL
- Use Vp/Vs = Np/Ns and Vp Ip = Vs Is; explain why the grid uses high voltage; describe how to increase induced voltage; explain why a transformer needs a.c.
COMMON MISTAKES
- Trying to use a transformer with d.c. (no changing field → nothing induced); inverting the turns ratio; forgetting high voltage means low current (less heat loss).
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit7: {
        "Radioactivity: alpha, beta and gamma": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 7 — RADIOACTIVITY: ALPHA, BETA & GAMMA.

ATOMIC MODEL & ISOTOPES
- Nucleus = protons + neutrons; nucleon number A (top), proton number Z (bottom). Isotopes = same Z, different number of neutrons. Some isotopes are unstable → radioactive.
- Rutherford's scattering experiment (most alpha particles passed through gold foil, a few deflected strongly) → atom is mostly empty space with a tiny, dense, positive nucleus.

TYPES OF RADIATION
- Alpha (α): a helium nucleus (2 protons + 2 neutrons), charge +2. Highly ionising, least penetrating — stopped by paper/skin; range a few cm in air.
- Beta (β): a fast electron (from a neutron changing into a proton + electron), charge −1. Moderately ionising, more penetrating — stopped by a few mm of aluminium.
- Gamma (γ): high-frequency EM wave, no charge/mass. Least ionising, most penetrating — reduced by thick lead/concrete.
- In a magnetic/electric field: α and β deflect in opposite directions (opposite charge); β deflects more (less mass); γ is undeflected.

DECAY EQUATIONS (conserve A and Z)
- Alpha decay: A decreases by 4, Z by 2. Beta decay: A unchanged, Z increases by 1 (a neutron → proton + emitted electron). Gamma: no change to A or Z (just loses energy).

DETECTION, HALF-LIFE & SAFETY
- Detected by a Geiger–Müller tube (counts), photographic film. Background radiation (rocks/radon, cosmic rays, food, medical) must be subtracted from a count rate.
- Half-life = the time for half the radioactive nuclei (or the activity) to decay. Random process. Use a decay curve or repeated halving to find remaining activity/time.
- Activity is measured in becquerels (Bq) = decays per second. Safety: minimise exposure time, increase distance, use shielding; handle with tongs; store in lead.

WORKED-EXAMPLE MATERIAL
- Complete an alpha/beta decay equation (balance A and Z); use half-life to find remaining nuclei/activity or elapsed time; compare penetrating/ionising power; correct a count rate for background.
COMMON MISTAKES
- Not conserving nucleon/proton numbers in equations; confusing the penetration order; forgetting to subtract background; thinking half-life means it all decays in two half-lives.
REACTIONS: empty. GRAPHS: radioactive decay curve (activity halving each half-life).`,

        "Fission and fusion": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 7 — NUCLEAR FISSION & FUSION.

NUCLEAR FISSION
- Fission = the splitting of a large unstable nucleus (e.g. uranium-235 or plutonium-239) into two smaller nuclei (daughter nuclei), releasing energy and 2–3 neutrons.
- A slow ("thermal") neutron is absorbed → the nucleus becomes unstable and splits. The released neutrons can be absorbed by other nuclei → a CHAIN REACTION.
- Reactor control: control rods (e.g. boron) absorb neutrons to control the rate; a moderator (e.g. graphite/water) slows neutrons so they can be absorbed; coolant carries heat away to make steam → turbine → generator. An uncontrolled chain reaction is the principle of a nuclear bomb.

NUCLEAR FUSION
- Fusion = joining two light nuclei (e.g. hydrogen isotopes) to form a heavier nucleus (helium), releasing a very large amount of energy. This is the energy source of the Sun and stars.
- Requires extremely high temperature and pressure so the positively-charged nuclei can overcome their electrostatic repulsion and get close enough to fuse. These conditions are very hard to achieve/contain on Earth, which is why fusion is not yet a practical power source.

COMPARISON & RISKS
- Fission produces dangerous radioactive waste (long half-lives, needs long-term storage) and risk of accidents; fusion's main product (helium) is not radioactive, but it isn't yet viable.
- Both release energy from the nucleus (millions of times more per kg than chemical reactions).

WORKED-EXAMPLE MATERIAL
- Describe a fission chain reaction and the roles of control rods/moderator; explain why fusion needs very high temperature/pressure; compare fission and fusion products.
COMMON MISTAKES
- Mixing up fission (splitting) and fusion (joining); confusing the roles of control rods (absorb neutrons) and moderator (slow neutrons); thinking fusion is currently used in power stations.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit8: {
        "Motion in the universe": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 8 — MOTION IN THE UNIVERSE.

THE SOLAR SYSTEM
- The Sun (a star) at the centre; eight planets orbit it; moons orbit planets; also dwarf planets, asteroids and comets. Our Solar System is in the Milky Way galaxy (a collection of billions of stars). The Universe = all the galaxies.
- Gravity provides the force that keeps planets/moons/satellites in orbit (a centripetal force directed toward the body being orbited).

ORBITS
- Planets orbit the Sun in slightly elliptical (nearly circular) orbits; the further the planet, the longer the orbital period and the slower its orbital speed.
- Comets have very elongated elliptical orbits: they speed up when close to the Sun (stronger gravity) and slow down when far away.
- For circular orbits, orbital speed v = (2 π r) ÷ T (circumference ÷ time period).

SATELLITES
- Natural (moons) and artificial satellites. Geostationary satellites orbit high above the equator with a 24-hour period (stay above the same point) — used for communications/TV. Low polar orbits (shorter period) — used for weather/imaging/monitoring.

WORKED-EXAMPLE MATERIAL
- Use v = 2πr/T for orbital speed; explain why gravity is needed for an orbit; explain a comet's changing speed; distinguish Solar System / galaxy / Universe.
COMMON MISTAKES
- Saying there's no force in a steady orbit (gravity acts as centripetal force); confusing galaxy and Solar System; forgetting comets speed up near the Sun.
REACTIONS: empty. GRAPHS: empty.`,

        "Stellar evolution": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 8 — STELLAR EVOLUTION (the life cycle of stars).

STAR FORMATION
- Stars form from a cloud of dust and gas (a nebula). Gravity pulls the matter together → it heats up → forms a protostar. When hot/dense enough, hydrogen nuclei fuse (nuclear fusion) → a MAIN SEQUENCE star.
- Main sequence: stable for a long time because the outward pressure from fusion (radiation/thermal) balances the inward pull of gravity (equilibrium).

LIFE CYCLE — depends on the star's mass
- A star like the Sun (low–medium mass): main sequence → (hydrogen runs out) → RED GIANT → outer layers drift off (planetary nebula) → core collapses into a WHITE DWARF → cools to a black dwarf.
- A star much more massive than the Sun: main sequence → RED SUPERGIANT → explodes as a SUPERNOVA → core becomes a NEUTRON STAR, or (for the most massive) a BLACK HOLE.
- Supernovae scatter heavier elements (made by fusion in stars) into space → these form new stars, planets and us.

WORKED-EXAMPLE MATERIAL
- Put the stages of a low-mass vs high-mass star in order; explain the balance of forces in a main sequence star; explain the role of a supernova in producing heavy elements.
COMMON MISTAKES
- Giving the high-mass path for the Sun (it becomes a white dwarf, not a black hole); forgetting the force balance (gravity vs fusion pressure); mixing up red giant (low mass) and red supergiant (high mass).
REACTIONS: empty. GRAPHS: empty.`,

        "Cosmology and the Big Bang": `EDEXCEL IGCSE PHYSICS (4PH1) TOPIC 8 — COSMOLOGY & THE BIG BANG.

RED-SHIFT
- Light from distant galaxies is shifted towards the red (longer wavelength) end of the spectrum → red-shift. It means those galaxies are moving away from us.
- The further away a galaxy is, the greater its red-shift → the faster it is moving away. This is evidence that the whole Universe is expanding.

THE BIG BANG THEORY
- The Universe began from a single, extremely hot and dense point about 13.8 billion years ago and has been expanding ever since. Red-shift (galaxies receding, more distant = faster) supports this.
- Cosmic Microwave Background radiation (CMB): faint microwave radiation coming from all directions — "left-over" energy from the early hot Universe. It is strong evidence that the Big Bang theory provides and that the steady-state theory cannot easily explain.

DOPPLER EFFECT (the idea behind red-shift)
- When a source of waves moves away from an observer, the observed wavelength increases (frequency decreases) — like a siren dropping in pitch as it passes. The same effect on light from receding galaxies causes red-shift.

THE FUTURE / SCALE
- Distances are huge — measured in light-years (the distance light travels in one year). The ultimate fate of the Universe depends on the total mass/expansion rate.

WORKED-EXAMPLE MATERIAL
- Explain how red-shift supports an expanding Universe; state the two key pieces of evidence for the Big Bang (red-shift + CMB); link the Doppler effect to red-shift.
COMMON MISTAKES
- Saying red-shift means galaxies move towards us (it's away); forgetting CMB as evidence; thinking the Big Bang was an explosion "in" space rather than an expansion "of" space.
REACTIONS: empty. GRAPHS: empty.`,
      },
    },

    maths: {
      unit1: {
        "Numbers and the numbering system": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 1 — NUMBERS & THE NUMBERING SYSTEM.

INTEGERS, ORDERING & THE FOUR OPERATIONS
- Place value; ordering integers and decimals; use of <, >, =. BIDMAS/order of operations (Brackets, Indices, Division/Multiplication, Addition/Subtraction).
- Add, subtract, multiply and divide integers and decimals (with and without a calculator). Negative numbers: two like signs make +, two unlike signs make - (for multiply/divide).

FACTORS, MULTIPLES & PRIMES
- Factor (divides exactly), multiple (times table), prime (exactly two factors: 1 and itself; 1 is NOT prime).
- Prime factorisation using a factor tree → write as a product of primes (index form), e.g. 60 = 2^2 x 3 x 5.
- HCF (highest common factor) and LCM (lowest common multiple): from prime factors or a Venn diagram. HCF x LCM = product of the two numbers.

ROUNDING & ESTIMATION
- Round to decimal places (d.p.) and significant figures (s.f.). Estimate a calculation by rounding each value to 1 s.f.
- Bounds: a value rounded to the nearest unit has lower/upper bounds at +/- half a unit; combine bounds for sums, products and quotients (for max quotient use max top / min bottom).

WORKED-EXAMPLE MATERIAL
- Write a number as a product of primes; find HCF and LCM; round to s.f. and estimate; find upper and lower bounds of a measurement and of a calculation.
COMMON MISTAKES
- Calling 1 prime; mixing up HCF and LCM; rounding too early; choosing the wrong bound (e.g. for a maximum quotient).
REACTIONS: empty. GRAPHS: empty.`,

        "Fractions, decimals and percentages": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 1 — FRACTIONS, DECIMALS & PERCENTAGES.

FRACTIONS
- Equivalent fractions, simplify (divide by HCF), compare. Add/subtract: common denominator. Multiply: tops x tops, bottoms x bottoms. Divide: multiply by the reciprocal (KFC: Keep, Flip, Change). Mixed numbers <-> improper fractions.
- Fraction of an amount; one quantity as a fraction of another.

CONVERTING
- Fraction -> decimal: divide. Decimal -> percentage: x100. Recurring decimals -> fractions (e.g. 0.3 recurring = 1/3; use the algebraic method: let x = the decimal, multiply by 10/100, subtract).

PERCENTAGES
- Percentage of an amount; percentage change = (change / original) x 100. Increase/decrease by a percentage using a MULTIPLIER (e.g. +15% -> x1.15; -15% -> x0.85).
- Reverse percentage: find the original BEFORE a change by dividing by the multiplier (e.g. price after 20% off is 80, original = 80 / 0.8).
- Compound interest/growth and depreciation: amount = P x (multiplier)^n for n periods. Simple interest = P x r x t.

WORKED-EXAMPLE MATERIAL
- Add/divide fractions; convert a recurring decimal to a fraction; percentage increase with a multiplier; a reverse percentage; compound interest over several years.
COMMON MISTAKES
- Adding fractions without a common denominator; using the original instead of dividing for reverse percentages; confusing simple and compound interest; multiplier errors.
REACTIONS: empty. GRAPHS: empty.`,

        "Powers, roots and standard form": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 1 — POWERS, ROOTS & STANDARD FORM.

INDICES (LAWS)
- a^m x a^n = a^(m+n); a^m / a^n = a^(m-n); (a^m)^n = a^(mn); a^0 = 1; a^(-n) = 1/a^n; a^(1/n) = nth root of a; a^(m/n) = (nth root of a)^m.
- Square/cube numbers and roots; estimate roots.

SURDS (higher)
- A surd is an irrational root (e.g. root 2). Simplify: root(ab) = root a x root b (e.g. root 50 = 5 root 2). Add/subtract like surds. Rationalise the denominator: multiply top and bottom by the surd (or its conjugate).

STANDARD FORM (scientific notation)
- Written as A x 10^n where 1 <= A < 10 and n is an integer. Large numbers: positive n; small numbers (<1): negative n.
- Convert to/from ordinary numbers. Multiply/divide in standard form: handle the A values and the powers of 10 separately (add/subtract indices), then adjust so 1 <= A < 10. Add/subtract: convert to the same power of 10 first (or to ordinary numbers).

WORKED-EXAMPLE MATERIAL
- Apply index laws including negative/fractional powers; simplify and rationalise a surd; write a number in standard form; multiply two numbers in standard form.
COMMON MISTAKES
- Adding indices when multiplying base AND coefficient wrongly; forgetting 1 <= A < 10; negative-power and fractional-power slips; not simplifying surds fully.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit2: {
        "Equations, formulae and identities": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 2 — EQUATIONS, FORMULAE & IDENTITIES.

ALGEBRAIC MANIPULATION
- Simplify by collecting like terms; expand single and double brackets (FOIL), e.g. (x+3)(x-2) = x^2 + x - 6; expand triple brackets.
- Factorise: common factor; difference of two squares a^2 - b^2 = (a+b)(a-b); quadratics x^2 + bx + c (two numbers multiplying to c, adding to b); and ax^2 + bx + c.

LINEAR EQUATIONS & INEQUALITIES
- Solve linear equations (including brackets, fractions, unknown on both sides). Solve linear inequalities (flip the sign when multiplying/dividing by a negative); show solution sets on a number line.
- Rearrange formulae to change the subject (including where the new subject appears twice -> factorise).

SIMULTANEOUS EQUATIONS
- Two linear equations: solve by elimination or substitution. One linear + one quadratic: substitute the linear into the quadratic.

QUADRATIC EQUATIONS
- Solve by factorising (set = 0, each bracket = 0); by the quadratic formula x = [-b +/- root(b^2 - 4ac)] / 2a; by completing the square (also gives the turning point).
- Form and solve equations from a context (e.g. area problems).

WORKED-EXAMPLE MATERIAL
- Expand and factorise; solve a quadratic by factorising and by the formula; solve simultaneous equations (both methods); change the subject of a formula; solve an inequality.
COMMON MISTAKES
- Sign errors expanding double brackets; not flipping the inequality with a negative; only giving one root of a quadratic; formula slips (the -b and the 2a denominator over the whole top).
REACTIONS: empty. GRAPHS: empty.`,

        "Sequences, functions and graphs": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 2 — SEQUENCES, FUNCTIONS & GRAPHS.

SEQUENCES
- Term-to-term vs position-to-term rules. Linear (arithmetic) nth term: common difference d, nth term = dn + (first term - d). Find any term or test if a number is in the sequence.
- Recognise quadratic sequences (second difference constant; nth term has an n^2 term), and special sequences (square, cube, triangular, Fibonacci, powers).

FUNCTIONS (higher)
- Function notation f(x); evaluate f(a); solve f(x) = k. Composite functions fg(x) means do g first then f. Inverse function f^-1(x): swap x and y and rearrange.

STRAIGHT-LINE GRAPHS
- y = mx + c: gradient m = (change in y)/(change in x); c = y-intercept. Find the equation from two points or a point + gradient.
- Parallel lines have equal gradients; perpendicular gradients multiply to -1 (m1 x m2 = -1). Midpoint and length (distance) of a line segment.

CURVED GRAPHS
- Plot and recognise quadratics (parabola), cubics, reciprocal y = a/x (hyperbola), and exponential y = a^x.
- Solve equations graphically (intersections); find the turning point of a quadratic (by symmetry or completing the square); estimate gradient of a curve by drawing a tangent; estimate area under a graph.

WORKED-EXAMPLE MATERIAL
- Find the nth term (linear and quadratic); find a line equation and a perpendicular line; work out fg(x) and f^-1(x); sketch/recognise standard curves; solve by intersection.
COMMON MISTAKES
- Doing the composite function in the wrong order; gradient = change in x over change in y (it's the other way); forgetting the perpendicular rule; mislabelling intercepts.
REACTIONS: empty. GRAPHS: straight lines (y=mx+c), parabolas, cubics, reciprocal and exponential curves.`,
      },
      unit3: {
        "Geometric reasoning: angles and shapes": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 3 — GEOMETRIC REASONING: ANGLES & SHAPES.

ANGLE FACTS
- Angles on a straight line = 180; around a point = 360; vertically opposite angles equal. Parallel lines: corresponding (F) equal, alternate (Z) equal, co-interior/allied (C) add to 180.
- Triangle angles sum to 180; exterior angle = sum of the two opposite interior angles. Quadrilateral angles sum to 360. Types of triangle/quadrilateral and their properties.

POLYGONS
- Sum of interior angles of an n-sided polygon = (n - 2) x 180. Each exterior angle of a REGULAR polygon = 360 / n, and interior = 180 - exterior. Sum of exterior angles = 360 (always).

CIRCLE THEOREMS (higher)
- Angle in a semicircle = 90. Angle at the centre = twice the angle at the circumference (on the same arc). Angles in the same segment are equal. Opposite angles of a cyclic quadrilateral add to 180. A tangent meets a radius at 90; two tangents from a point are equal. Alternate segment theorem.

CONGRUENCE & SIMILARITY
- Congruent triangles (SSS, SAS, ASA, RHS) — identical shape and size. Similar shapes — same shape, enlarged by a scale factor k; corresponding angles equal, sides in ratio. Area scale factor = k^2, volume scale factor = k^3.

WORKED-EXAMPLE MATERIAL
- Find missing angles with reasons; use the polygon angle formula; apply circle theorems with justification; prove triangles congruent; use similarity (including area/volume scale factors).
COMMON MISTAKES
- Not giving angle REASONS (marks need them); muddling area (k^2) and volume (k^3) scale factors; misidentifying which circle theorem applies.
REACTIONS: empty. GRAPHS: empty.`,

        "Constructions, loci and transformations": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 3 — CONSTRUCTIONS, LOCI & TRANSFORMATIONS.

CONSTRUCTIONS (ruler & compasses)
- Perpendicular bisector of a line; angle bisector; perpendicular from/to a point on a line; constructing triangles from given sides/angles. Leave construction arcs visible.

LOCI
- A locus = the set of all points satisfying a rule. Standard loci: fixed distance from a point (circle); fixed distance from a line (parallel lines + semicircle ends); equidistant from two points (perpendicular bisector); equidistant from two lines (angle bisector).
- Solve "region" problems by combining loci (shade the area meeting all conditions).

TRANSFORMATIONS (describe fully AND perform)
- Translation: by a column vector (top = horizontal, bottom = vertical).
- Reflection: in a mirror line (state the line, e.g. y = x).
- Rotation: state angle, direction (clockwise/anticlockwise) AND centre of rotation.
- Enlargement: state the scale factor AND the centre. A fractional SF (between 0 and 1) makes it smaller; a negative SF puts the image on the opposite side of the centre and inverted.
- Combine transformations; describe a single transformation equivalent to two.

WORKED-EXAMPLE MATERIAL
- Construct a perpendicular/angle bisector; draw a locus/region; perform and fully describe each transformation; find the centre of a rotation/enlargement.
COMMON MISTAKES
- Giving an incomplete description (rotation needs angle + direction + centre; enlargement needs SF + centre); erasing construction arcs; vector direction errors; negative scale factor slips.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit4: {
        "Length, area and volume": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 4 — MENSURATION: LENGTH, AREA & VOLUME.

AREA & PERIMETER (2D)
- Rectangle = l x w; triangle = 1/2 x base x height; parallelogram = base x height; trapezium = 1/2 (a + b) x h. Perimeter = total distance around.
- Circle: circumference = pi x d = 2 pi r; area = pi r^2. Arc length = (theta/360) x 2 pi r; sector area = (theta/360) x pi r^2.
- Compound 2D shapes: split into basic shapes and add/subtract.

SURFACE AREA & VOLUME (3D)
- Prism volume = cross-sectional area x length. Cuboid = l x w x h. Cylinder volume = pi r^2 h; curved surface area = 2 pi r h (+ 2 pi r^2 for the ends).
- Cone: volume = 1/3 pi r^2 h; curved SA = pi r l (l = slant height). Sphere: volume = 4/3 pi r^3; SA = 4 pi r^2. Pyramid volume = 1/3 x base area x height.
- Surface area = total area of all faces/surfaces.

UNITS & CONVERSIONS
- Length, area (square units) and volume (cubic units) conversions: 1 cm = 10 mm, 1 cm^2 = 100 mm^2, 1 cm^3 = 1000 mm^3; 1 litre = 1000 cm^3. Convert between units of area/volume by squaring/cubing the linear factor.

WORKED-EXAMPLE MATERIAL
- Area of a trapezium/compound shape; arc length and sector area; volume and surface area of a cylinder/cone/sphere; a "find the height given the volume" rearrangement; unit conversions.
COMMON MISTAKES
- Using diameter instead of radius (or vice versa); forgetting the 1/3 for cones/pyramids; mixing up curved and total surface area; wrong area/volume unit conversion factors.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit5: {
        "Pythagoras and SOH CAH TOA": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 5 — PYTHAGORAS & RIGHT-ANGLED TRIGONOMETRY.

PYTHAGORAS' THEOREM
- For a right-angled triangle: a^2 + b^2 = c^2, where c is the hypotenuse (longest side, opposite the right angle).
- Find the hypotenuse: c = root(a^2 + b^2). Find a shorter side: a = root(c^2 - b^2) (subtract). Use to find distances, including the length of a line segment from coordinates.

TRIGONOMETRY (SOH CAH TOA)
- sin = opposite/hypotenuse; cos = adjacent/hypotenuse; tan = opposite/adjacent (relative to the angle).
- Find a side: choose the ratio with the two relevant sides, rearrange. Find an angle: use the inverse (sin^-1, cos^-1, tan^-1).
- Angles of elevation and depression; bearings problems (measured clockwise from north, three figures).

3D & EXACT VALUES (higher)
- Apply Pythagoras and trig in 3D shapes (e.g. the angle a diagonal makes with a base). Know exact trig values for 0, 30, 45, 60, 90 (e.g. sin 30 = 1/2, cos 60 = 1/2, tan 45 = 1, sin 60 = root3/2).

WORKED-EXAMPLE MATERIAL
- Find a missing side with Pythagoras; find a side and an angle with SOH CAH TOA; an angle-of-elevation problem; a 3D Pythagoras/trig question.
COMMON MISTAKES
- Subtracting when you should add in Pythagoras (or vice versa); picking the wrong ratio; not using the inverse function to find an angle; calculator in radians instead of degrees.
REACTIONS: empty. GRAPHS: empty.`,

        "Sine and Cosine rules": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 5 — SINE & COSINE RULES (non-right-angled triangles). Label sides a, b, c opposite angles A, B, C.

SINE RULE (a side & its opposite angle known)
- a/sin A = b/sin B = c/sin C (use the form with the unknown on top to find a side; flip it to find an angle).
- Watch for the "ambiguous case" when finding an obtuse angle (a second possible answer = 180 - the first).

COSINE RULE (two sides + included angle, OR all three sides)
- Find a side: a^2 = b^2 + c^2 - 2bc cos A.
- Find an angle: cos A = (b^2 + c^2 - a^2) / (2bc).

AREA OF A TRIANGLE
- Area = 1/2 ab sin C (two sides and the included angle). Use with the cosine/sine rule for multi-step problems.

CHOOSING THE RIGHT RULE
- Right-angled -> Pythagoras / SOH CAH TOA. Non-right-angled: a matching side-angle pair -> sine rule; two sides + included angle or three sides -> cosine rule.
- Apply to bearings, and to combined 2D/3D problems.

WORKED-EXAMPLE MATERIAL
- Use the sine rule for a side and for an angle; the cosine rule for a side and for an angle; area = 1/2 ab sin C; choose the correct rule in a bearings problem.
COMMON MISTAKES
- Using the cosine rule when the sine rule is simpler (or vice versa); rearrangement/calculator errors in the cosine rule; missing the ambiguous obtuse angle; using the included angle wrongly in the area formula.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit6: {
        "Graphical representation of data": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 6 — GRAPHICAL REPRESENTATION OF DATA.

DISPLAYING DATA
- Pictograms, bar charts, dual/composite bar charts, line graphs, and pie charts (angle for a category = frequency/total x 360).
- Stem-and-leaf diagrams (ordered, with a key); frequency tables (grouped and ungrouped).

SCATTER GRAPHS & CORRELATION
- Plot bivariate data; describe correlation: positive, negative or none, and strong/weak. Draw a line of best fit (through the mean point, balancing points) and use it to estimate (interpolation reliable; extrapolation unreliable).

HISTOGRAMS (unequal class widths, higher)
- Frequency density = frequency / class width; the AREA of each bar represents frequency. Read off frequencies and estimate values from a histogram.

CUMULATIVE FREQUENCY (higher)
- Plot cumulative frequency against the UPPER class boundary; the curve gives the median (at n/2), lower quartile (n/4) and upper quartile (3n/4); interquartile range = UQ - LQ. Box plots summarise min, LQ, median, UQ, max and allow comparison of two distributions.

WORKED-EXAMPLE MATERIAL
- Draw/read a pie chart; describe correlation and use a line of best fit; draw a histogram with frequency density; read the median/quartiles from a cumulative frequency curve; draw and compare box plots.
COMMON MISTAKES
- Using frequency instead of frequency density for histograms; plotting cumulative frequency at the wrong boundary; extrapolating a line of best fit; forgetting IQR = UQ - LQ.
REACTIONS: empty. GRAPHS: pie charts, scatter graphs with line of best fit, histograms (frequency density), cumulative frequency curves and box plots.`,

        "Statistical measures": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 6 — STATISTICAL MEASURES.

AVERAGES & RANGE
- Mean = sum of values / number of values. Median = middle value when ordered (average the two middle for an even count). Mode = most frequent. Range = highest - lowest (a measure of spread).
- Choose the appropriate average: the mean uses all data (affected by outliers); the median is best with outliers/skew; the mode for categorical/most-common data.

FREQUENCY TABLES
- Mean from a frequency table = sum of (value x frequency) / sum of frequencies. Identify the modal value and the class containing the median.

GROUPED DATA (estimates)
- Estimated mean = sum of (midpoint x frequency) / total frequency (use class midpoints). Identify the MODAL CLASS and the class containing the median (it's an estimate because exact values are unknown).

QUARTILES & SPREAD (higher)
- Lower quartile (LQ), upper quartile (UQ), interquartile range IQR = UQ - LQ (spread of the middle 50%, less affected by outliers). Identify outliers.

WORKED-EXAMPLE MATERIAL
- Mean/median/mode/range from a list and from a frequency table; estimated mean and modal class from grouped data; compare two data sets using an average AND a measure of spread.
COMMON MISTAKES
- Forgetting to multiply by frequency in a frequency-table mean; not ordering before finding the median; confusing modal class with the highest frequency value; comparing only averages (mention spread too).
REACTIONS: empty. GRAPHS: empty.`,

        "Probability and tree diagrams": `EDEXCEL IGCSE MATHEMATICS (4MA1) TOPIC 6 — PROBABILITY & TREE DIAGRAMS.

BASIC PROBABILITY
- Probability is between 0 (impossible) and 1 (certain). P(event) = number of favourable outcomes / total outcomes. P(not A) = 1 - P(A). Probabilities of all outcomes sum to 1.
- Expected frequency = probability x number of trials. Relative frequency (experimental probability) = successes / total trials -> approaches theoretical probability with more trials.

COMBINED EVENTS
- Sample space diagrams (e.g. two dice) list all equally likely outcomes.
- Mutually exclusive events (can't both happen): P(A or B) = P(A) + P(B) (the "OR -> add" rule).
- Independent events (one doesn't affect the other): P(A and B) = P(A) x P(B) (the "AND -> multiply" rule).

TREE DIAGRAMS
- Branches show outcomes; probabilities on each branch (each set sums to 1). MULTIPLY along the branches for "and"; ADD the relevant final results for "or".
- Conditional probability / WITHOUT replacement: the second set of branches changes (denominator decreases by 1, and the count of the chosen item decreases). Set notation and Venn diagrams for combined events (higher).

WORKED-EXAMPLE MATERIAL
- Single-event probability and expected frequency; a sample space for two dice; a tree diagram with replacement; a tree diagram WITHOUT replacement; use a Venn diagram.
COMMON MISTAKES
- Adding when you should multiply (and vice versa); not reducing the probabilities for "without replacement"; branch probabilities not summing to 1; forgetting P(not A) = 1 - P(A).
REACTIONS: empty. GRAPHS: empty.`,
      },
    },
  },

  "cie-igcse": {
    physics: {
      unit1: {
        "Physical quantities and measurement techniques (rulers, cylinders, clocks)": `CIE IGCSE PHYSICS (0625) 1.1 — MEASUREMENT TECHNIQUES.
- Measure length with a ruler (mm); volume of a liquid with a measuring cylinder (read the bottom of the meniscus at eye level); short time intervals with a digital timer/stopwatch.
- Volume of a regular solid = l x w x h; irregular solid by displacement (water in a measuring cylinder / displacement can).
- Improve accuracy: measure many (e.g. time 20 oscillations and divide; measure the thickness of many sheets of paper and divide). Take repeats and average.
COMMON MISTAKES: parallax error (read at eye level); not dividing by the number of repeats/sheets; wrong meniscus reading.
REACTIONS: empty. GRAPHS: empty.`,

        "Scalar and vector quantities (magnitude/direction)": `CIE IGCSE PHYSICS (0625) 1.1 — SCALARS & VECTORS.
- Scalar = magnitude only (distance, speed, time, mass, energy, temperature). Vector = magnitude AND direction (displacement, velocity, acceleration, force, momentum, weight).
- Vectors are drawn as arrows (length = magnitude, arrow = direction).
COMMON MISTAKES: calling speed a vector (it's scalar; velocity is the vector); forgetting weight/force are vectors.
REACTIONS: empty. GRAPHS: empty.`,

        "Resultant of two vectors at right angles": `CIE IGCSE PHYSICS (0625) 1.1 (Supplement) — RESULTANT OF PERPENDICULAR VECTORS.
- Combine two vectors at 90 degrees by a scale drawing (tip-to-tail, measure the resultant) OR by calculation.
- Magnitude of resultant = root(a^2 + b^2) (Pythagoras). Direction = tan^-1(opposite/adjacent) from one vector.
- Apply to forces and to velocities (e.g. a boat crossing a river).
COMMON MISTAKES: adding magnitudes directly (only works if parallel); forgetting to state the direction/angle.
REACTIONS: empty. GRAPHS: empty.`,

        "Speed, velocity and acceleration (v = s/t)": `CIE IGCSE PHYSICS (0625) 1.2 — SPEED, VELOCITY & ACCELERATION.
- Speed = distance / time, v = s/t (m/s). Velocity = speed in a stated direction. Average speed = total distance / total time.
- Acceleration a = change in velocity / time taken = (v - u)/t (m/s^2). Deceleration is negative acceleration.
- Constant acceleration: use a = (v-u)/t and average velocity = (u+v)/2.
COMMON MISTAKES: confusing speed (scalar) and velocity (vector); sign errors for deceleration; mixing up u and v.
REACTIONS: empty. GRAPHS: empty.`,

        "Distance-time and speed-time graphs": `CIE IGCSE PHYSICS (0625) 1.2 — MOTION GRAPHS.
- Distance-time graph: gradient = speed. Flat = stationary; straight slope = constant speed; curve = changing speed (steeper = faster).
- Speed-time (velocity-time) graph: gradient = acceleration; flat line = constant speed; AREA under the line = distance travelled.
- Calculate acceleration from the gradient and distance from the area (triangles + rectangles).
COMMON MISTAKES: confusing the two graph types; reading gradient when you need area (and vice versa).
REACTIONS: empty. GRAPHS: distance-time and speed-time graphs (gradient = speed/acceleration, area = distance).`,

        "Acceleration of free fall g ≈ 9.8 m/s²": `CIE IGCSE PHYSICS (0625) 1.2 — ACCELERATION OF FREE FALL.
- Near the Earth's surface all objects in free fall accelerate at g ≈ 9.8 m/s^2 (use 9.8 or 10 m/s^2), regardless of mass (ignoring air resistance).
- In the absence of air resistance a feather and a hammer fall together.
- On a speed-time graph free fall is a straight line of gradient g.
COMMON MISTAKES: thinking heavier objects fall faster (only true when air resistance matters); forgetting g is an acceleration not a force.
REACTIONS: empty. GRAPHS: empty.`,

        "Terminal velocity and motion in gravitational fields": `CIE IGCSE PHYSICS (0625) 1.2 (Supplement) — TERMINAL VELOCITY.
- A falling object speeds up; air resistance increases with speed. When air resistance = weight, the resultant force = 0, acceleration = 0 → constant maximum speed = terminal velocity.
- Speed-time graph: starts steep (a = g), curve flattens, then horizontal at terminal velocity. A parachute increases air resistance → lower terminal velocity.
COMMON MISTAKES: saying the object stops (it moves at constant speed); forgetting resultant force is zero at terminal velocity.
REACTIONS: empty. GRAPHS: speed-time curve approaching terminal velocity (levels off).`,

        "Mass and weight (g = W/m)": `CIE IGCSE PHYSICS (0625) 1.3 — MASS & WEIGHT.
- Mass = amount of matter (kg), the same everywhere; measured with a balance. Weight = gravitational force on a mass (N), W = mg.
- Gravitational field strength g = W/m (N/kg) ≈ 9.8 N/kg on Earth; numerically equals the acceleration of free fall.
- Weights/masses can be compared with a balance; weight measured with a spring balance (newtonmeter).
COMMON MISTAKES: confusing mass (kg) and weight (N); thinking mass changes on the Moon (only weight does).
REACTIONS: empty. GRAPHS: empty.`,

        "Density (ρ = m/V)": `CIE IGCSE PHYSICS (0625) 1.4 — DENSITY.
- Density = mass / volume, ρ = m/V (kg/m^3 or g/cm^3).
- Find density: measure mass (balance); volume of a regular solid by dimensions, of an irregular solid by displacement, of a liquid in a measuring cylinder.
- An object floats in a fluid if its density is less than the fluid's; predict floating/sinking by comparing densities.
COMMON MISTAKES: density formula upside down; mixing g/cm^3 and kg/m^3 (x1000); measuring volume wrongly.
REACTIONS: empty. GRAPHS: empty.`,

        "Effects of forces and load-extension graphs": `CIE IGCSE PHYSICS (0625) 1.5.1 — FORCES & EXTENSION (Hooke's Law).
- Forces can change the size, shape, speed or direction of an object. Resultant (net) force is the single force with the same effect.
- Hooke's law: extension is proportional to the load up to the limit of proportionality; F = kx (k = spring constant, N/m; x = extension).
- Load-extension graph: straight line through the origin, then curves beyond the limit of proportionality.
COMMON MISTAKES: using total length instead of extension; reading the graph beyond the limit; forgetting k = gradient.
REACTIONS: empty. GRAPHS: load-extension graph (linear then curving past the limit of proportionality).`,

        "Newton’s First Law and F = ma": `CIE IGCSE PHYSICS (0625) 1.5.1 (Supplement) — NEWTON'S LAWS.
- Newton's first law: an object stays at rest or moves at constant velocity unless acted on by a resultant force.
- Resultant force = mass x acceleration, F = ma (the acceleration is in the direction of the resultant force).
- Friction and air resistance oppose motion and act as a force.
COMMON MISTAKES: thinking constant velocity needs a force (it needs zero resultant force); mixing up mass and weight in F = ma.
REACTIONS: empty. GRAPHS: empty.`,

        "Circular motion qualitatively": `CIE IGCSE PHYSICS (0625) 1.5.1 (Supplement) — CIRCULAR MOTION.
- An object moving in a circle at constant speed is constantly changing direction → its velocity changes → it is accelerating → a resultant force acts toward the centre (centripetal force, e.g. tension, gravity, friction).
- Increasing the speed, or the mass, or decreasing the radius increases the force needed. Remove the force → it moves off in a straight line (tangent).
COMMON MISTAKES: saying speed changes (only direction/velocity does); thinking the force acts outward.
REACTIONS: empty. GRAPHS: empty.`,

        "Turning effect of forces and equilibrium": `CIE IGCSE PHYSICS (0625) 1.5.2 — MOMENTS & EQUILIBRIUM.
- Moment of a force = force x perpendicular distance from the pivot, moment = F x d (N m). A moment is the turning effect.
- Principle of moments: for a body in equilibrium, total clockwise moments = total anticlockwise moments (about any pivot).
- Equilibrium also requires the resultant force = 0. Use moments to find an unknown force or distance on a balanced beam.
COMMON MISTAKES: using the wrong (non-perpendicular) distance; forgetting BOTH conditions for equilibrium; choosing a poor pivot.
REACTIONS: empty. GRAPHS: empty.`,

        "Centre of gravity and stability": `CIE IGCSE PHYSICS (0625) 1.5.3 — CENTRE OF GRAVITY & STABILITY.
- Centre of gravity = the point where all the weight appears to act. Find it for an irregular lamina by suspending from two points and using a plumb line (the lines cross at the CG).
- Stability: an object is more stable with a wider base and a lower centre of gravity. It topples when the vertical line from its CG falls outside the base.
COMMON MISTAKES: confusing stability factors; forgetting the plumb-line method; not relating toppling to the line of action of weight.
REACTIONS: empty. GRAPHS: empty.`,

        "Momentum and Impulse (p = mv, FΔt = Δp)": `CIE IGCSE PHYSICS (0625) 1.6 (Supplement) — MOMENTUM & IMPULSE.
- Momentum p = mass x velocity (kg m/s), a vector. Impulse = F x t = change in momentum, F(delta t) = (delta)(mv).
- Resultant force = rate of change of momentum, F = (mv - mu)/t.
- Conservation of momentum: with no external force, total momentum before = total momentum after a collision/explosion. Use it to find an unknown velocity.
- Safety (airbags, crumple zones) increase collision time → reduce the force (smaller rate of change of momentum).
COMMON MISTAKES: ignoring direction/sign of momentum; using mv instead of change in mv for force; forgetting momentum is conserved only with no external force.
REACTIONS: empty. GRAPHS: empty.`,

        "Energy stores and transfers": `CIE IGCSE PHYSICS (0625) 1.7.1 — ENERGY STORES & TRANSFERS.
- Stores: kinetic, gravitational potential, elastic (strain), chemical, nuclear, internal (thermal), electrostatic.
- Energy is transferred by forces (mechanical work), electrical current, heating, and waves (light/sound).
- Principle of conservation of energy: energy cannot be created or destroyed, only transferred/stored; the total stays constant.
COMMON MISTAKES: saying energy is "used up" (it's transferred/dissipated); confusing stores with transfer pathways.
REACTIONS: empty. GRAPHS: empty.`,

        "Kinetic energy and Gravitational PE calculations": `CIE IGCSE PHYSICS (0625) 1.7.1 (Supplement) — KE & GPE.
- Kinetic energy E_k = 1/2 m v^2 (J). Change in gravitational PE = m g (delta h).
- Energy conservation: for a falling object (ignoring resistance) GPE lost = KE gained, mgh = 1/2 mv^2 → v = root(2gh).
- Apply to pendulums, slides, falling objects.
COMMON MISTAKES: forgetting the 1/2 or not squaring v in KE; using weight instead of mass; not converting units.
REACTIONS: empty. GRAPHS: empty.`,

        "Work done and Power (W = Fd, P = W/t)": `CIE IGCSE PHYSICS (0625) 1.7.2-1.7.3 — WORK & POWER.
- Work done = energy transferred = force x distance moved in the direction of the force, W = F d (J).
- Power = work done (or energy transferred) per unit time, P = W/t = E/t (watts, W).
COMMON MISTAKES: using a distance not in the force's direction; confusing power and energy; wrong units.
REACTIONS: empty. GRAPHS: empty.`,

        "Energy resources and Efficiency": `CIE IGCSE PHYSICS (0625) 1.7.3-1.7.4 — ENERGY RESOURCES & EFFICIENCY.
- Resources: fossil fuels, nuclear (fission), biofuel, wind, hydroelectric, tidal, geothermal, solar. Know one advantage and disadvantage of each (cost, reliability, output, pollution/CO2, renewable or not).
- Most energy in the world comes from the Sun (except nuclear, geothermal and tidal). Fossil/nuclear: reliable, high output, but finite and polluting/waste. Renewables: clean but often intermittent/lower output.
- Efficiency = useful energy (or power) output / total energy input (x100%). Always < 100% (energy dissipated, usually as heat). Sankey diagrams show the proportions.
COMMON MISTAKES: calling nuclear renewable; efficiency over 100%; forgetting wasted energy as heat.
REACTIONS: empty. GRAPHS: Sankey diagrams.`,

        "Pressure (p = F/A) and pressure in liquids (Δp = ρgΔh)": `CIE IGCSE PHYSICS (0625) 1.8 — PRESSURE.
- Pressure = force / area, p = F/A (pascals, Pa = N/m^2). Smaller area → larger pressure (sharp knife); larger area → smaller pressure (snowshoes).
- Pressure in a liquid increases with depth and density; change in pressure (delta)p = (rho) g (delta)h. It acts equally in all directions and depends only on depth, not container shape.
- Explains dams thicker at the base, and pressure rising as you dive deeper.
COMMON MISTAKES: pressure/force confusion; wrong units; forgetting pressure acts in all directions.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit2: {
        "Kinetic particle model: States of matter": `CIE IGCSE PHYSICS (0625) 2.1.1 — KINETIC PARTICLE MODEL.
- Solid: particles in a fixed regular lattice, vibrating; fixed shape and volume. Liquid: particles close, random, can move past each other; fixed volume, takes container shape. Gas: particles far apart, fast, random; fills container, easily compressed.
- Heating gives particles more kinetic energy → faster vibration/movement. Forces between particles are strongest in solids.
COMMON MISTAKES: saying particles in a solid don't move (they vibrate); confusing the arrangements.
REACTIONS: empty. GRAPHS: empty.`,

        "Brownian motion and gas pressure": `CIE IGCSE PHYSICS (0625) 2.1.2-2.1.3 — BROWNIAN MOTION & GAS PRESSURE.
- Brownian motion: small visible particles (e.g. smoke in air) move randomly because they are bombarded by fast-moving, smaller, unseen molecules → evidence for moving molecules.
- Gas pressure = molecules colliding with the container walls (force per unit area). Heating a gas → faster molecules → more frequent, harder collisions → higher pressure (at constant volume). Higher temperature → higher average kinetic energy.
COMMON MISTAKES: saying the big particle moves itself; not linking pressure to molecular collisions.
REACTIONS: empty. GRAPHS: empty.`,

        "Boyle’s Law (pV = constant)": `CIE IGCSE PHYSICS (0625) 2.1.3 (Supplement) — BOYLE'S LAW.
- At constant temperature, pressure is inversely proportional to volume: pV = constant, so p1 V1 = p2 V2.
- Reducing the volume → molecules hit the walls more often → higher pressure.
- A p-V graph is a curve (hyperbola); a p vs 1/V graph is a straight line.
COMMON MISTAKES: forgetting temperature must be constant; arithmetic on p1V1 = p2V2; units consistency.
REACTIONS: empty. GRAPHS: p-V curve and p vs 1/V straight line.`,

        "Thermal expansion of solids, liquids, and gases": `CIE IGCSE PHYSICS (0625) 2.2.1 — THERMAL EXPANSION.
- Heating makes particles vibrate/move more and take up more space → expansion. Gases expand most, then liquids, then solids (least).
- Uses/consequences: gaps in railway lines and bridges (expansion joints); bimetallic strip in thermostats; a liquid-in-glass thermometer works by expansion.
COMMON MISTAKES: saying particles themselves expand (they move further apart); wrong order of expansion.
REACTIONS: empty. GRAPHS: empty.`,

        "Specific heat capacity (c = ΔE/mΔθ)": `CIE IGCSE PHYSICS (0625) 2.2.2 (Supplement) — SPECIFIC HEAT CAPACITY.
- Specific heat capacity c = energy to raise 1 kg by 1 degree C (J/kg degC). Energy change (delta)E = m c (delta)(theta).
- Experiment: heat a known mass with an electric heater, measure energy (E = Pt or VIt) and temperature rise → c = E / (m x delta theta). Water has a high c (4200) → good coolant.
COMMON MISTAKES: forgetting to use the energy supplied (P x t); wrong mass; ignoring heat loss to surroundings.
REACTIONS: empty. GRAPHS: empty.`,

        "Melting, boiling, and evaporation": `CIE IGCSE PHYSICS (0625) 2.2.3 — CHANGES OF STATE.
- Melting (solid→liquid) and boiling (liquid→gas) happen at fixed temperatures; temperature stays constant during a change of state (energy breaks bonds, not raising temperature).
- Evaporation happens at any temperature, only at the surface; the fastest molecules escape → the liquid cools (evaporative cooling). Faster with higher temperature, larger surface area, more airflow, lower humidity.
- Boiling: throughout the liquid, at the boiling point, with bubbles.
COMMON MISTAKES: confusing evaporation (surface, any temp) with boiling (throughout, fixed temp); forgetting temperature is constant during a state change.
REACTIONS: empty. GRAPHS: heating curve with flat plateaus at melting and boiling points.`,

        "Thermal energy transfer: Conduction": `CIE IGCSE PHYSICS (0625) 2.3.1 — CONDUCTION.
- Conduction (mainly in solids): vibrating particles pass energy to neighbours; in metals, free (delocalised) electrons transfer energy quickly → metals are the best conductors.
- Non-metals, liquids and gases are poor conductors (insulators); trapped air is a good insulator.
COMMON MISTAKES: thinking conduction works well in gases/liquids; not mentioning free electrons for metals.
REACTIONS: empty. GRAPHS: empty.`,

        "Thermal energy transfer: Convection": `CIE IGCSE PHYSICS (0625) 2.3.2 — CONVECTION.
- Convection occurs in fluids (liquids and gases): heated fluid expands, becomes less dense and rises; cooler denser fluid sinks → a convection current that transfers thermal energy.
- Explains heating a room, sea breezes, hot-water systems. Cannot occur in solids (particles can't move freely).
COMMON MISTAKES: saying convection happens in solids; not mentioning density change.
REACTIONS: empty. GRAPHS: empty.`,

        "Thermal energy transfer: Radiation": `CIE IGCSE PHYSICS (0625) 2.3.3 — RADIATION.
- Thermal radiation is infrared (electromagnetic) waves; needs no medium (travels through a vacuum — how the Sun's energy reaches Earth). Hotter objects emit more radiation.
- Surfaces: matt black is the best emitter AND best absorber; shiny/white is a poor emitter and good reflector. Higher temperature and larger surface area → more emission.
- Applications: vacuum flask (silvered walls reduce radiation), survival blankets, satellites.
COMMON MISTAKES: thinking radiation needs particles; forgetting black is both best emitter and absorber.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit3: {
        "General properties: v = fλ": `CIE IGCSE PHYSICS (0625) 3.1 — GENERAL WAVE PROPERTIES.
- A wave transfers energy without transferring matter. Terms: wavefront, amplitude (max displacement), wavelength (lambda), frequency f (waves per second, Hz), period T, wave speed v.
- Wave equation v = f x lambda. Frequency and period: f = 1/T.
- All waves can be reflected, refracted and diffracted.
COMMON MISTAKES: mixing amplitude and wavelength; unit slips; forgetting f = 1/T.
REACTIONS: empty. GRAPHS: labelled transverse wave (amplitude, wavelength).`,

        "Transverse and longitudinal waves": `CIE IGCSE PHYSICS (0625) 3.1 — TRANSVERSE vs LONGITUDINAL.
- Transverse: vibrations perpendicular to the direction of travel (e.g. light/all EM waves, water ripples, waves on a rope). Has crests and troughs.
- Longitudinal: vibrations parallel to travel — compressions and rarefactions (e.g. sound). Needs a medium.
COMMON MISTAKES: mixing up examples (sound is longitudinal; light is transverse); confusing the vibration direction.
REACTIONS: empty. GRAPHS: empty.`,

        "Diffraction at gaps and edges": `CIE IGCSE PHYSICS (0625) 3.1 (Supplement) — DIFFRACTION.
- Diffraction = waves spreading out as they pass through a gap or around an edge. The wavelength is unchanged.
- The effect is greatest when the gap is about the same size as the wavelength; a wide gap diffracts little, a narrow gap (similar to lambda) diffracts a lot.
COMMON MISTAKES: thinking wavelength changes; getting the gap-size relationship backwards.
REACTIONS: empty. GRAPHS: empty.`,

        "Reflection of light and plane mirrors": `CIE IGCSE PHYSICS (0625) 3.2.1 — REFLECTION.
- Law of reflection: angle of incidence = angle of reflection (measured from the normal).
- A plane mirror image is: same size, upright, virtual, laterally inverted, and as far behind the mirror as the object is in front.
COMMON MISTAKES: measuring angles from the mirror surface not the normal; forgetting the image is virtual.
REACTIONS: empty. GRAPHS: ray diagram for a plane mirror.`,

        "Refraction and Snell’s Law (n = sin i / sin r)": `CIE IGCSE PHYSICS (0625) 3.2.2 — REFRACTION.
- Light changes speed when it enters a different medium → it changes direction: toward the normal entering a denser/slower medium (e.g. air→glass), away on leaving. Wavelength changes, frequency stays the same.
- Refractive index n = sin i / sin r (also n = speed in vacuum / speed in medium). Larger n = more bending.
COMMON MISTAKES: bending the wrong way; measuring from the surface; thinking frequency changes.
REACTIONS: empty. GRAPHS: ray diagram of refraction through a block.`,

        "Total internal reflection and optical fibres": `CIE IGCSE PHYSICS (0625) 3.2.2 (Supplement) — TOTAL INTERNAL REFLECTION.
- When light travels from a denser to a less dense medium and the angle of incidence exceeds the critical angle c, it is all reflected (total internal reflection).
- Critical angle: n = 1 / sin c. Uses: optical fibres (communications, endoscopes) and reflecting prisms (periscopes, binoculars).
COMMON MISTAKES: forgetting TIR needs dense→less-dense AND angle > critical; muddling the n = 1/sin c formula.
REACTIONS: empty. GRAPHS: empty.`,

        "Converging and diverging lenses": `CIE IGCSE PHYSICS (0625) 3.2.3 — LENSES.
- Converging (convex) lens brings parallel rays to a focus (principal focus); diverging (concave) spreads them out. Focal length f = distance from lens to principal focus.
- Draw ray diagrams to find the image (real/virtual, magnified/diminished, upright/inverted). A real image forms where rays actually meet; a virtual image (e.g. magnifying glass, object within f) is upright and enlarged.
COMMON MISTAKES: wrong construction rays; mislabelling real vs virtual; confusing converging and diverging.
REACTIONS: empty. GRAPHS: lens ray diagrams.`,

        "Electromagnetic spectrum (properties and uses)": `CIE IGCSE PHYSICS (0625) 3.3 — ELECTROMAGNETIC SPECTRUM.
- Order (increasing frequency/energy, decreasing wavelength): radio, microwave, infrared, visible, ultraviolet, X-rays, gamma. All travel at the speed of light in a vacuum (3 x 10^8 m/s) and are transverse.
- Uses: radio (broadcasting); microwave (cooking, satellite/phone comms); infrared (heaters, remote controls, thermal imaging); visible (vision, optical fibres); UV (sterilising, security marks, vitamin D); X-rays (medical imaging, security); gamma (sterilising, treating cancer).
- Dangers increase with frequency: UV (skin cancer), X-ray/gamma (ionising, cell damage).
COMMON MISTAKES: wrong order/trend; mixing microwave vs infrared uses; forgetting all EM waves share the same speed in a vacuum.
REACTIONS: empty. GRAPHS: empty. REFERENCE TABLES: EM regions with a use and a danger.`,

        "Sound waves and ultrasound": `CIE IGCSE PHYSICS (0625) 3.4 — SOUND.
- Sound is a longitudinal wave produced by vibrations; needs a medium (no sound in a vacuum). Speed in air ~330-340 m/s (faster in liquids and solids).
- Pitch depends on frequency; loudness on amplitude. Human hearing range ~20 Hz to 20 000 Hz. Ultrasound = above 20 000 Hz.
- Echo method: distance = speed x time, halving for there-and-back. Ultrasound uses: medical/prenatal scanning, cleaning, sonar/depth finding.
COMMON MISTAKES: sound through a vacuum; forgetting to halve for an echo; confusing pitch (frequency) and loudness (amplitude).
REACTIONS: empty. GRAPHS: oscilloscope traces (pitch = spacing, loudness = amplitude).`,
      },
      unit4: {
        "Simple phenomena of magnetism": `CIE IGCSE PHYSICS (0625) 4.1 — MAGNETISM.
- Magnetic materials: iron, steel, cobalt, nickel. Like poles repel, unlike poles attract. Magnetism is strongest at the poles.
- Induced magnetism: a magnetic material becomes a magnet in a field. Soft (iron) magnetises/demagnetises easily → electromagnets; hard (steel) keeps magnetism → permanent magnets.
- Magnetic field lines run from N to S; closer lines = stronger field. Plot with a compass or iron filings. A repulsion test confirms an object is a magnet.
COMMON MISTAKES: using attraction as proof of a magnet; field lines drawn S→N; confusing soft and hard magnetic materials.
REACTIONS: empty. GRAPHS: magnetic field-line diagrams.`,

        "Electric charge and electric fields": `CIE IGCSE PHYSICS (0625) 4.2.1 — ELECTRIC CHARGE.
- Two types of charge: positive and negative. Like charges repel, unlike attract. Charging by friction transfers ELECTRONS (the material gaining electrons becomes negative).
- Conductors (metals) let charge flow; insulators don't. An electric field is the region where a charge feels a force; field lines go from + to -.
- Electric field strength and induced charges explain attraction of small objects to a charged rod.
COMMON MISTAKES: saying protons move (only electrons transfer); wrong sign after charging; field-line direction.
REACTIONS: empty. GRAPHS: empty.`,

        "Current, EMF, and Potential Difference": `CIE IGCSE PHYSICS (0625) 4.2.2-4.2.3 — CURRENT, EMF & P.D.
- Current = rate of flow of charge, I = Q/t (amps; Q in coulombs). Measured with an ammeter in SERIES. Conventional current flows + to -; electrons flow the opposite way.
- e.m.f. = energy supplied per unit charge by a source; potential difference (voltage) = energy transferred per unit charge by a component, V = E/Q (volts). Measured with a voltmeter in PARALLEL.
COMMON MISTAKES: ammeter in parallel / voltmeter in series; confusing e.m.f. and p.d.; conventional vs electron flow.
REACTIONS: empty. GRAPHS: empty.`,

        "Resistance and Ohm’s Law": `CIE IGCSE PHYSICS (0625) 4.2.3 — RESISTANCE & OHM'S LAW.
- Resistance R = V/I (ohms). Ohm's law: for a metallic conductor at constant temperature, current is proportional to p.d. → straight-line I-V graph through the origin.
- A filament lamp: I-V curve flattens (resistance rises as it heats). A diode conducts one way only. Resistance of a wire increases with length and decreases with cross-sectional area.
COMMON MISTAKES: saying a filament lamp obeys Ohm's law; R formula errors; forgetting temperature effect.
REACTIONS: empty. GRAPHS: I-V graphs for a resistor (linear), lamp (S-curve), diode (one-way).`,

        "Electrical energy and power": `CIE IGCSE PHYSICS (0625) 4.2.4 — ELECTRICAL ENERGY & POWER.
- Electrical power P = V x I (watts); also P = I^2 R. Energy transferred E = P x t = I V t (joules).
- Domestic energy in kWh: energy (kWh) = power (kW) x time (h); cost = energy (kWh) x price per kWh.
COMMON MISTAKES: confusing kW and kWh; using the wrong power equation; unit conversions.
REACTIONS: empty. GRAPHS: empty.`,

        "Series and parallel circuits": `CIE IGCSE PHYSICS (0625) 4.3.1 — SERIES & PARALLEL CIRCUITS.
- Series: same current everywhere; p.d.s add (V_total = V1 + V2); total resistance = R1 + R2 + ... ; one break stops everything.
- Parallel: same p.d. across each branch; branch currents add (I_total = I1 + I2); total resistance is LESS than the smallest branch; branches work independently.
COMMON MISTAKES: adding parallel resistances like series; mixing up where current/voltage are equal.
REACTIONS: empty. GRAPHS: empty.`,

        "Potential dividers and logic gates": `CIE IGCSE PHYSICS (0625) 4.3.2 (Supplement) — POTENTIAL DIVIDERS & LOGIC.
- A potential divider uses two resistors in series to split a voltage; the output across one resistor = (R/(R1+R2)) x V_supply.
- Using an LDR (resistance falls with light) or thermistor (resistance falls with temperature) as one resistor makes a light/temperature sensing circuit.
- Logic gates (NOT, AND, OR, NAND, NOR) give an output (1/0) from inputs; use truth tables.
COMMON MISTAKES: potential-divider ratio upside down; mixing up LDR/thermistor behaviour; truth-table errors.
REACTIONS: empty. GRAPHS: empty.`,

        "Dangers of electricity and safety": `CIE IGCSE PHYSICS (0625) 4.4 — ELECTRICAL SAFETY.
- Hazards: damaged insulation, overheating cables, damp conditions, overloaded sockets → shock or fire.
- Safety: fuse and circuit breaker in the LIVE wire break the circuit if the current is too high; earthing a metal case sends fault current to earth and blows the fuse; double insulation (plastic case) needs no earth. Choose a fuse rated just above the normal current (I = P/V).
COMMON MISTAKES: putting the fuse in the neutral wire; wrong fuse rating; mixing up earthing and the fuse roles.
REACTIONS: empty. GRAPHS: empty.`,

        "Electromagnetic induction and a.c. generator": `CIE IGCSE PHYSICS (0625) 4.5.1 — ELECTROMAGNETIC INDUCTION.
- Moving a conductor so it cuts magnetic field lines (or a changing field through a coil) induces an e.m.f.; if the circuit is complete a current flows. Bigger e.m.f. with faster motion, stronger magnet, more turns.
- a.c. generator: a coil rotates in a magnetic field → the changing flux induces an alternating e.m.f.; slip rings connect it. Output is one cycle of a.c. per rotation.
COMMON MISTAKES: no induced e.m.f. without movement/change; confusing slip rings (a.c. generator) with a commutator (motor); direction of induced current.
REACTIONS: empty. GRAPHS: sinusoidal a.c. output.`,

        "Transformers and power transmission": `CIE IGCSE PHYSICS (0625) 4.5.2 — TRANSFORMERS & THE GRID.
- A transformer changes an alternating voltage using two coils on a soft iron core; alternating current in the primary makes a changing field that induces a voltage in the secondary. Works on a.c. only.
- Turns rule Vp/Vs = Np/Ns. Step-up (more secondary turns) raises voltage; step-down lowers it. Ideal transformer: Vp Ip = Vs Is (power in = power out).
- The grid transmits at very high voltage (low current) to reduce energy wasted as heat in cables (loss = I^2 R).
COMMON MISTAKES: using d.c. with a transformer; turns ratio inverted; forgetting high voltage = low current = less loss.
REACTIONS: empty. GRAPHS: empty.`,

        "The motor effect and d.c. motor": `CIE IGCSE PHYSICS (0625) 4.5.3 — MOTOR EFFECT & D.C. MOTOR.
- A current-carrying conductor in a magnetic field experiences a force (motor effect); maximum when the wire is at 90 degrees to the field. Fleming's left-hand rule: thuMb = Motion, First finger = Field (N→S), seCond finger = Current.
- A d.c. motor: forces on the two sides of a current-carrying coil act in opposite directions → it turns; a split-ring commutator reverses the current each half-turn to keep it spinning the same way. Increase speed: bigger current, stronger field, more turns.
COMMON MISTAKES: using the right hand; muddling the fingers; forgetting the commutator's role.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit5: {
        "The nuclear atom: Nucleus, protons, neutrons, electrons": `CIE IGCSE PHYSICS (0625) 5.1.1 — THE NUCLEAR ATOM.
- Atom = a tiny dense positive nucleus (protons + neutrons) surrounded by electrons in shells. Proton: charge +1, rel mass 1. Neutron: 0, 1. Electron: -1, ~1/1840.
- Rutherford's alpha-scattering: most alpha particles passed straight through gold foil, a few deflected strongly → atom is mostly empty space with a small, dense, positive nucleus.
COMMON MISTAKES: wrong charges/masses; misremembering the scattering conclusion.
REACTIONS: empty. GRAPHS: empty.`,

        "Isotopes and nuclide notation": `CIE IGCSE PHYSICS (0625) 5.1.2 — ISOTOPES & NUCLIDE NOTATION.
- Proton (atomic) number Z; nucleon (mass) number A = protons + neutrons; neutrons = A - Z. Nuclide notation: A on top, Z on bottom, before the symbol.
- Isotopes = atoms of the same element (same Z) with different numbers of neutrons (different A); identical chemical properties.
COMMON MISTAKES: swapping A and Z; forgetting neutrons = A - Z.
REACTIONS: empty. GRAPHS: empty.`,

        "Detection and types of radioactivity (α, β, γ)": `CIE IGCSE PHYSICS (0625) 5.2.1 — TYPES OF RADIATION.
- Alpha (helium nucleus, +2): highly ionising, least penetrating (stopped by paper/skin). Beta (fast electron, -1): moderately ionising, stopped by a few mm of aluminium. Gamma (EM wave, no charge): least ionising, most penetrating (reduced by thick lead/concrete).
- Detected by a Geiger-Muller tube. Background radiation (rocks/radon, cosmic rays, food, medical) must be subtracted from a count rate.
- In a field, alpha and beta deflect in opposite directions (beta more, less mass); gamma is undeflected.
COMMON MISTAKES: wrong penetration order; forgetting to subtract background; deflection directions.
REACTIONS: empty. GRAPHS: empty.`,

        "Radioactive decay and half-life": `CIE IGCSE PHYSICS (0625) 5.2.2 — HALF-LIFE.
- Radioactive decay is a random, spontaneous process. Activity is measured in becquerels (Bq) = decays per second.
- Half-life = the time for half the radioactive nuclei (or the activity) to decay. Use a decay curve or repeated halving to find remaining activity, fraction remaining, or elapsed time.
COMMON MISTAKES: thinking it all decays in two half-lives; misreading the decay curve; not subtracting background first.
REACTIONS: empty. GRAPHS: exponential decay curve (halving each half-life).`,

        "Safety, hazards and uses of radiation": `CIE IGCSE PHYSICS (0625) 5.2.3 — SAFETY & USES.
- Hazards: ionising radiation damages/kills cells and can cause cancer/mutations. Safety: minimise exposure time, maximise distance, use shielding (lead), handle sources with tongs, store in lead-lined containers.
- Uses: medical tracers and cancer treatment (gamma); sterilising equipment/food; smoke alarms (alpha); thickness monitoring (beta); carbon-14 and rock dating.
COMMON MISTAKES: matching the wrong radiation type to a use (e.g. alpha for thickness gauging); vague safety answers.
REACTIONS: empty. GRAPHS: empty.`,

        "Nuclear equations, fission, and fusion": `CIE IGCSE PHYSICS (0625) 5.2.4 (Supplement) — NUCLEAR EQUATIONS, FISSION & FUSION.
- Balance nuclear equations: conserve nucleon number A and proton number Z. Alpha decay: A -4, Z -2. Beta decay: A same, Z +1 (a neutron → proton + emitted electron).
- Fission: a large nucleus (U-235) splits into two smaller nuclei + 2-3 neutrons, releasing energy → chain reaction (controlled in reactors with control rods and a moderator).
- Fusion: two light nuclei join to form a heavier one, releasing huge energy; powers the Sun; needs extremely high temperature and pressure.
COMMON MISTAKES: not conserving A/Z; confusing fission (splitting) and fusion (joining).
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit6: {
        "Earth and the Solar System": `CIE IGCSE PHYSICS (0625) 6.1.1 — EARTH & THE SOLAR SYSTEM.
- The Solar System: the Sun (a star) plus eight planets, moons, asteroids and comets, held in orbit by gravity. Order of planets from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.
- Earth's rotation (24 h) gives day/night; orbit of the Earth (1 year) and axial tilt give seasons; the Moon orbits Earth (~1 month). Further planets have longer orbital periods.
COMMON MISTAKES: wrong planet order; confusing rotation (day) with revolution/orbit (year).
REACTIONS: empty. GRAPHS: empty.`,

        "Orbital speed and gravitational force": `CIE IGCSE PHYSICS (0625) 6.1.2 (Supplement) — ORBITS.
- Gravity provides the centripetal force keeping planets, moons and satellites in orbit. The closer to the Sun, the stronger the gravitational force and the faster/shorter the orbit.
- Orbital speed v = (2 pi r) / T (circumference / period). Comets have very elliptical orbits: faster near the Sun, slower far away.
COMMON MISTAKES: thinking there's no force in a steady orbit; v = 2(pi)r/T errors; comet speed direction.
REACTIONS: empty. GRAPHS: empty.`,

        "Stars and the Universe: Life cycle of stars": `CIE IGCSE PHYSICS (0625) 6.2.1 — STARS & THEIR LIFE CYCLE.
- Stars form from clouds of dust and gas (nebulae) pulled together by gravity → protostar → fusion begins → stable main-sequence star (outward fusion pressure balances inward gravity). The Sun is a main-sequence star.
- Low/medium mass (like the Sun): → red giant → planetary nebula → white dwarf. High mass: → red supergiant → supernova → neutron star or black hole. Supernovae spread heavier elements into space.
- The Sun's energy comes from the fusion of hydrogen into helium. Galaxies (e.g. the Milky Way) contain billions of stars.
COMMON MISTAKES: giving the high-mass path for the Sun; forgetting the gravity vs fusion-pressure balance.
REACTIONS: empty. GRAPHS: empty.`,

        "Red-shift and the Big Bang theory": `CIE IGCSE PHYSICS (0625) 6.2.2 (Supplement) — RED-SHIFT & THE BIG BANG.
- Light from distant galaxies is red-shifted (wavelength increased) → they are moving away from us; more distant galaxies have greater red-shift (move away faster) → the Universe is expanding.
- The Big Bang theory: the Universe began ~13.8 billion years ago from a hot, dense point and has expanded since. Evidence: red-shift of galaxies AND the cosmic microwave background radiation (CMBR) — microwave radiation from all directions left over from the early Universe.
- Hubble: speed of recession is proportional to distance (v = H0 d).
COMMON MISTAKES: red-shift meaning galaxies approach (it's away); forgetting CMBR as evidence; Big Bang as an explosion in space rather than expansion of space.
REACTIONS: empty. GRAPHS: empty.`,
      },
    },

    maths: {
      unit1: {
        "Types of number, sets and standard form": `CIE IGCSE MATHEMATICS (0580) 1 — TYPES OF NUMBER, SETS & STANDARD FORM.
- Natural numbers, integers, primes, square/cube numbers, rational and irrational numbers, real numbers. Factors, multiples, HCF and LCM (from prime factorisation/Venn diagrams). 1 is NOT prime.
- Set notation and Venn diagrams: union (or), intersection (and), complement, subset, universal set, number of elements n(A). Shade regions to solve problems.
- Standard form A x 10^n with 1 <= A < 10; convert to/from ordinary numbers; multiply/divide (handle A and powers of 10 separately), add/subtract (same power first).
COMMON MISTAKES: calling 1 prime; mixing HCF and LCM; A not between 1 and 10; muddling union and intersection.
REACTIONS: empty. GRAPHS: empty.`,

        "Fractions, decimals, percentages and ratio": `CIE IGCSE MATHEMATICS (0580) 1 — FRACTIONS, DECIMALS, PERCENTAGES & RATIO.
- Convert between fractions, decimals and percentages; order them; recurring decimals to fractions.
- Percentage of an amount; percentage change = (change/original) x 100; increase/decrease by a MULTIPLIER (e.g. x1.15, x0.85); reverse percentages (divide by the multiplier); compound interest = P x (multiplier)^n.
- Ratio: share a quantity in a given ratio; direct and inverse proportion; rates (speed, density, best buys); map scales.
COMMON MISTAKES: using the original for a reverse percentage; simple vs compound interest; ratio shares not summing correctly.
REACTIONS: empty. GRAPHS: empty.`,

        "Indices, powers and roots": `CIE IGCSE MATHEMATICS (0580) 1 — INDICES, POWERS & ROOTS.
- Index laws: a^m x a^n = a^(m+n); a^m / a^n = a^(m-n); (a^m)^n = a^(mn); a^0 = 1; a^(-n) = 1/a^n; a^(1/n) = nth root; a^(m/n) = (nth root a)^m.
- Square, cube and higher roots; estimate roots. (Extended) surds: simplify root(ab) = root a x root b, rationalise denominators.
COMMON MISTAKES: index-law slips with negative/fractional powers; mishandling a^0 = 1; surd simplification.
REACTIONS: empty. GRAPHS: empty.`,

        "Estimation, bounds and limits of accuracy": `CIE IGCSE MATHEMATICS (0580) 1 — ESTIMATION & BOUNDS.
- Round to decimal places and significant figures; estimate a calculation by rounding each value to 1 s.f.
- Upper and lower bounds: a value rounded to the nearest unit has bounds +/- half a unit. Combine bounds: for a max product use max x max; for a max quotient use max top / min bottom; for a min difference use min - max.
COMMON MISTAKES: rounding too early; choosing the wrong bound combination (especially for division/subtraction).
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit2: {
        "Algebraic manipulation and indices": `CIE IGCSE MATHEMATICS (0580) 2 — ALGEBRAIC MANIPULATION.
- Simplify expressions, expand single and double brackets (FOIL), and factorise: common factor, difference of two squares a^2 - b^2 = (a+b)(a-b), quadratics x^2 + bx + c and (extended) ax^2 + bx + c.
- Algebraic fractions: simplify, add/subtract, multiply/divide. Rearrange formulae to change the subject (including subject appearing twice → factorise).
COMMON MISTAKES: sign errors expanding brackets; cancelling terms wrongly in fractions; subject-change slips.
REACTIONS: empty. GRAPHS: empty.`,

        "Equations, inequalities and simultaneous equations": `CIE IGCSE MATHEMATICS (0580) 2 — EQUATIONS & INEQUALITIES.
- Solve linear equations (brackets, fractions, unknown both sides). Solve linear inequalities (FLIP the sign when multiplying/dividing by a negative); represent on a number line.
- Solve quadratics by factorising, by the formula x = [-b +/- root(b^2 - 4ac)]/2a, and (extended) by completing the square.
- Simultaneous equations: two linear (elimination/substitution); (extended) one linear + one quadratic by substitution.
COMMON MISTAKES: not flipping the inequality; only one root of a quadratic; formula/denominator errors.
REACTIONS: empty. GRAPHS: empty.`,

        "Sequences": `CIE IGCSE MATHEMATICS (0580) 2 — SEQUENCES.
- Continue a sequence and find the term-to-term rule. Linear (arithmetic) nth term = dn + (a - d) where d = common difference.
- Recognise square, cube, triangular and Fibonacci sequences. (Extended) find the nth term of a quadratic sequence (constant second difference → an^2 term) and simple geometric/exponential sequences.
COMMON MISTAKES: nth-term errors; not testing whether a number is in the sequence correctly; quadratic nth-term method.
REACTIONS: empty. GRAPHS: empty.`,

        "Functions and graphs of functions": `CIE IGCSE MATHEMATICS (0580) 2 — FUNCTIONS & GRAPHS.
- (Extended) function notation f(x); evaluate f(a); composite fg(x) (do g first); inverse f^-1(x) (swap x and y, rearrange).
- Plot and recognise: quadratics (parabola), cubics, reciprocal y = a/x, exponential y = a^x. Find roots, the y-intercept, turning points and intersections; solve equations graphically; estimate the gradient by a tangent.
COMMON MISTAKES: composite order wrong; misreading intercepts/turning points; sketching standard curves incorrectly.
REACTIONS: empty. GRAPHS: parabolas, cubics, reciprocal and exponential curves.`,
      },
      unit3: {
        "Straight-line graphs and gradients": `CIE IGCSE MATHEMATICS (0580) 3 — COORDINATE GEOMETRY.
- y = mx + c: gradient m = (change in y)/(change in x); c = y-intercept. Find the equation from two points or a point + gradient.
- Parallel lines have equal gradients; (extended) perpendicular gradients multiply to -1 (m1 x m2 = -1). Find the midpoint and length (distance) of a line segment.
COMMON MISTAKES: gradient inverted (change in x over change in y); perpendicular rule; midpoint/distance formula slips.
REACTIONS: empty. GRAPHS: straight-line graphs (y = mx + c).`,
      },
      unit4: {
        "Geometrical terms and constructions": `CIE IGCSE MATHEMATICS (0580) 4 — GEOMETRICAL TERMS & CONSTRUCTIONS.
- Geometrical terms: point, line, parallel, perpendicular, acute/obtuse/reflex angles; types of triangle and quadrilateral and their properties; parts of a circle (centre, radius, diameter, chord, tangent, arc, sector, segment).
- Constructions with ruler and compasses: triangles, perpendicular bisector, angle bisector. Scale drawings and bearings (3 figures, clockwise from north). Read and draw to scale.
COMMON MISTAKES: erasing construction arcs; bearing not given as 3 figures; mislabelling circle parts.
REACTIONS: empty. GRAPHS: empty.`,

        "Angles, polygons and circle theorems": `CIE IGCSE MATHEMATICS (0580) 4 — ANGLES, POLYGONS & CIRCLE THEOREMS.
- Angles: on a line (180), at a point (360), vertically opposite; parallel lines (corresponding, alternate, co-interior). Triangle = 180; quadrilateral = 360; exterior angle = sum of opposite interiors.
- Polygons: interior angle sum = (n-2) x 180; regular polygon exterior angle = 360/n; exterior angles sum to 360.
- Circle theorems: angle in a semicircle = 90; angle at centre = 2 x angle at circumference; angles in the same segment equal; cyclic quadrilateral opposite angles = 180; tangent meets radius at 90; equal tangents from a point; (extended) alternate segment theorem.
COMMON MISTAKES: not giving angle REASONS; misapplying a circle theorem; polygon angle formula errors.
REACTIONS: empty. GRAPHS: empty.`,

        "Similarity and congruence": `CIE IGCSE MATHEMATICS (0580) 4 — SIMILARITY & CONGRUENCE.
- Congruent shapes are identical (triangles by SSS, SAS, ASA, RHS). Similar shapes have equal angles and sides in the same ratio (scale factor k).
- Lengths scale by k. (Extended) area scale factor = k^2, volume scale factor = k^3. Use to find missing lengths/areas/volumes.
COMMON MISTAKES: confusing area (k^2) and volume (k^3) scale factors; pairing the wrong corresponding sides.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit5: {
        "Perimeter, area and volume": `CIE IGCSE MATHEMATICS (0580) 5 — MENSURATION.
- Perimeter and area: rectangle, triangle (1/2 b h), parallelogram, trapezium (1/2 (a+b) h). Circle: circumference = 2 pi r, area = pi r^2; arc length and sector area = (theta/360) x the whole.
- Volume and surface area: cuboid, prism (cross-section area x length), cylinder (V = pi r^2 h), (extended) cone (1/3 pi r^2 h, curved SA = pi r l), sphere (4/3 pi r^3, SA = 4 pi r^2), pyramid (1/3 base area x height).
- Units: convert areas (x100 per cm-mm step) and volumes (x1000); 1 litre = 1000 cm^3.
COMMON MISTAKES: radius vs diameter; forgetting 1/3 for cone/pyramid; curved vs total surface area; unit conversions.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit6: {
        "Pythagoras and right-angled trigonometry": `CIE IGCSE MATHEMATICS (0580) 6 — PYTHAGORAS & RIGHT-ANGLED TRIG.
- Pythagoras: a^2 + b^2 = c^2 (c = hypotenuse). Find the hypotenuse by adding, a shorter side by subtracting. Use for distances and lengths from coordinates.
- SOH CAH TOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj. Find a side (rearrange) or an angle (inverse function). Angles of elevation/depression and bearings. (Extended) exact values for 0, 30, 45, 60, 90.
COMMON MISTAKES: add vs subtract in Pythagoras; wrong ratio; not using the inverse for an angle; calculator in radians.
REACTIONS: empty. GRAPHS: empty.`,

        "Sine rule, cosine rule and area of a triangle": `CIE IGCSE MATHEMATICS (0580) 6 (Extended) — SINE & COSINE RULES.
- Sine rule a/sin A = b/sin B = c/sin C (use when a side and its opposite angle are known); watch the ambiguous obtuse case.
- Cosine rule a^2 = b^2 + c^2 - 2bc cos A (find a side from two sides + included angle); rearranged cos A = (b^2 + c^2 - a^2)/(2bc) to find an angle (three sides).
- Area of a triangle = 1/2 a b sin C (two sides + included angle). Apply to bearings and 2D/3D problems.
COMMON MISTAKES: choosing the wrong rule; cosine-rule rearrangement errors; missing the ambiguous angle; wrong included angle in the area formula.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit7: {
        "Transformations": `CIE IGCSE MATHEMATICS (0580) 7 — TRANSFORMATIONS.
- Reflection (state the mirror line, e.g. y = x); rotation (state angle, direction AND centre); translation (column vector); enlargement (state scale factor AND centre; fractional SF shrinks; negative SF inverts through the centre).
- Perform a transformation and fully describe a given one; combine transformations and find the single equivalent transformation.
COMMON MISTAKES: incomplete descriptions (rotation needs angle+direction+centre; enlargement needs SF+centre); vector/centre errors.
REACTIONS: empty. GRAPHS: empty.`,

        "Vectors": `CIE IGCSE MATHEMATICS (0580) 7 (Extended) — VECTORS.
- Column vectors (top = horizontal, bottom = vertical); add/subtract vectors and multiply by a scalar. Magnitude |v| = root(x^2 + y^2).
- Represent vectors on a diagram; find a resultant; use position vectors and ratios to prove points are collinear or to find a point on a line.
COMMON MISTAKES: adding components wrongly; magnitude formula; direction of a - b vs b - a.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit8: {
        "Probability basics": `CIE IGCSE MATHEMATICS (0580) 8 — PROBABILITY BASICS.
- Probability is between 0 and 1; P(event) = favourable outcomes / total outcomes; P(not A) = 1 - P(A); all probabilities sum to 1.
- Expected frequency = probability x number of trials; relative (experimental) frequency approaches theoretical probability with more trials. Use sample-space diagrams and frequency/Venn diagrams.
COMMON MISTAKES: probabilities outside 0-1; forgetting P(not A) = 1 - P(A); mixing expected with relative frequency.
REACTIONS: empty. GRAPHS: empty.`,

        "Combined events and tree diagrams": `CIE IGCSE MATHEMATICS (0580) 8 — COMBINED EVENTS & TREE DIAGRAMS.
- Mutually exclusive: P(A or B) = P(A) + P(B) (OR → add). Independent: P(A and B) = P(A) x P(B) (AND → multiply).
- Tree diagrams: multiply along branches for "and", add the relevant outcomes for "or"; each branch set sums to 1. WITHOUT replacement: the second set of probabilities changes (denominator and matching count decrease). (Extended) conditional probability and Venn-diagram/set notation.
COMMON MISTAKES: add vs multiply confusion; not reducing probabilities for "without replacement"; branches not summing to 1.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit9: {
        "Data representation": `CIE IGCSE MATHEMATICS (0580) 9 — DATA REPRESENTATION.
- Display data: pictograms, bar charts, pie charts (category angle = frequency/total x 360), line graphs, stem-and-leaf diagrams (with a key), frequency tables.
- Scatter diagrams: describe correlation (positive/negative/none, strong/weak); draw a line of best fit (through the mean point) and use it to estimate (interpolation reliable, extrapolation not).
COMMON MISTAKES: pie-chart angles not summing to 360; extrapolating a line of best fit; missing the stem-and-leaf key.
REACTIONS: empty. GRAPHS: pie charts, scatter diagrams with line of best fit.`,

        "Averages and measures of spread": `CIE IGCSE MATHEMATICS (0580) 9 — AVERAGES & SPREAD.
- Mean = sum/number; median = middle of ordered data; mode = most frequent; range = highest - lowest. Choose the appropriate average (median best with outliers).
- Mean from a frequency table = sum(fx)/sum(f). Grouped data: estimated mean using midpoints; identify the modal class and the class containing the median.
- (Extended) quartiles and interquartile range IQR = UQ - LQ (spread of the middle 50%).
COMMON MISTAKES: not multiplying by frequency; not ordering before the median; modal class vs highest value; estimate vs exact for grouped data.
REACTIONS: empty. GRAPHS: empty.`,

        "Cumulative frequency and histograms": `CIE IGCSE MATHEMATICS (0580) 9 (Extended) — CUMULATIVE FREQUENCY & HISTOGRAMS.
- Cumulative frequency: plot against the UPPER class boundary; read the median (n/2), lower quartile (n/4), upper quartile (3n/4) and IQR from the curve; box plots compare distributions.
- Histograms with unequal class widths: frequency density = frequency / class width; the AREA of each bar represents frequency. Read frequencies/estimate values from a histogram.
COMMON MISTAKES: plotting cumulative frequency at the wrong boundary; using frequency instead of frequency density; reading the wrong quartile position.
REACTIONS: empty. GRAPHS: cumulative frequency curve, box plots, histograms (frequency density).`,
      },
    },

    chemistry: {
      unit1: {
        "States of matter and the kinetic particle model": `CIE IGCSE CHEMISTRY (0620) 1 — STATES OF MATTER & KINETIC PARTICLE MODEL.
- Solid: particles in a fixed regular lattice, vibrating; fixed shape/volume. Liquid: particles close, random, slide past each other; fixed volume, takes shape. Gas: particles far apart, fast, random; fills container, compressible.
- Changes of state: melting, freezing, boiling/evaporating, condensing, sublimation. Heating gives particles kinetic energy to overcome forces between them; temperature stays constant during a change of state.
- Interpret heating/cooling curves (flat sections = changes of state). Effect of temperature and pressure on a gas (particles move faster / are pushed closer).
COMMON MISTAKES: saying particles in a solid don't move; "particles melt" (the substance does); forgetting constant temperature during a state change.
REACTIONS: empty. GRAPHS: heating/cooling curve with plateaus at melting and boiling points.`,

        "Diffusion": `CIE IGCSE CHEMISTRY (0620) 1 — DIFFUSION.
- Diffusion = net movement of particles from a region of higher concentration to lower concentration, due to random particle motion. Faster in gases than liquids.
- (Supplement) lighter (lower relative molecular mass) particles diffuse faster: in the gas-jar experiment ammonia (Mr 17) travels further/faster than hydrogen chloride (Mr 36.5), so the white ring of ammonium chloride forms nearer the HCl end.
COMMON MISTAKES: not linking diffusion to random motion; getting the Mr-speed relationship backwards.
REACTIONS: NH3 + HCl -> NH4Cl (white solid ring). GRAPHS: empty.`,
      },
      unit2: {
        "Elements, compounds and mixtures": `CIE IGCSE CHEMISTRY (0620) 2 — ELEMENTS, COMPOUNDS & MIXTURES.
- Element = one type of atom. Compound = different elements chemically bonded in fixed proportions. Mixture = substances not chemically joined (easily separated).
- A compound's properties differ from its elements; a mixture keeps the properties of its components.
COMMON MISTAKES: confusing mixture and compound; thinking air/alloys are compounds (they're mixtures).
REACTIONS: empty. GRAPHS: empty.`,

        "Atomic structure and isotopes": `CIE IGCSE CHEMISTRY (0620) 2 — ATOMIC STRUCTURE & ISOTOPES.
- Atom = nucleus (protons + neutrons) + electrons in shells. Proton +1 mass 1; neutron 0 mass 1; electron -1 mass ~1/2000. Proton (atomic) number Z; nucleon (mass) number A; neutrons = A - Z.
- Electronic configuration in shells 2,8,8; outer electrons = group number; number of shells = period.
- Isotopes = same element (same Z), different number of neutrons (different A). Relative atomic mass Ar = weighted mean of isotope masses by abundance.
COMMON MISTAKES: swapping A and Z; wrong shell filling; forgetting isotopes have identical chemistry.
REACTIONS: empty. GRAPHS: empty.`,

        "Ionic bonding": `CIE IGCSE CHEMISTRY (0620) 2 — IONIC BONDING.
- Forms between a metal and a non-metal: electrons transferred → positive metal ions and negative non-metal ions, both with full outer shells. Strong electrostatic attraction in a giant ionic lattice.
- Properties: high melting/boiling points; conduct when molten or aqueous (ions free to move), not when solid; often soluble in water.
- Draw dot-and-cross diagrams and work out formulae by balancing charges (e.g. MgCl2, Na2O).
COMMON MISTAKES: ionic solids conducting (only molten/aqueous); charge-balance errors in formulae.
REACTIONS: empty. GRAPHS: empty.`,

        "Covalent bonding and structures": `CIE IGCSE CHEMISTRY (0620) 2 — COVALENT BONDING & STRUCTURES.
- Covalent bond = shared pair of electrons, between non-metals. Draw dot-and-cross for H2, Cl2, O2, N2, H2O, CO2, CH4, NH3, HCl.
- Simple molecular: low melting/boiling points (weak intermolecular forces, NOT the strong bonds); don't conduct.
- Giant covalent (macromolecular): diamond (each C to 4, very hard, high mp, no conduction); graphite (each C to 3, layers slide → soft/lubricant, delocalised electrons → conducts); silicon(IV) oxide.
COMMON MISTAKES: saying covalent bonds break on melting (it's intermolecular forces); diamond conducting (it doesn't; graphite does).
REACTIONS: empty. GRAPHS: empty.`,

        "Metallic bonding": `CIE IGCSE CHEMISTRY (0620) 2 (Supplement) — METALLIC BONDING.
- A lattice of positive metal ions in a "sea" of delocalised (free) electrons; strong electrostatic attraction → high melting points.
- Properties explained: good conductors of heat and electricity (delocalised electrons move); malleable and ductile (layers of ions slide without breaking the bonding).
COMMON MISTAKES: forgetting delocalised electrons; not linking malleability to sliding layers.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit3: {
        "Formulae and chemical equations": `CIE IGCSE CHEMISTRY (0620) 3 — FORMULAE & EQUATIONS.
- Work out formulae of ionic compounds by balancing ion charges; learn common ions (NO3-, CO3 2-, SO4 2-, OH-, NH4+).
- Write word equations and balanced symbol equations with state symbols (s), (l), (g), (aq); (Supplement) write ionic equations (cancel spectator ions).
COMMON MISTAKES: unbalanced equations; missing state symbols; charge-balance errors.
REACTIONS: empty. GRAPHS: empty.`,

        "The mole and Avogadro constant": `CIE IGCSE CHEMISTRY (0620) 3 — THE MOLE.
- Relative molecular/formula mass Mr = sum of Ar values. One mole = Mr in grams = 6.02 x 10^23 particles (Avogadro constant). moles = mass / Mr.
- Gas volume at r.t.p.: volume(dm^3) = moles x 24. Concentration = moles / volume(dm^3).
COMMON MISTAKES: using Ar instead of Mr; cm^3 vs dm^3 (divide by 1000).
REACTIONS: empty. GRAPHS: empty.`,

        "Reacting masses, concentration and yield": `CIE IGCSE CHEMISTRY (0620) 3 (Supplement) — REACTING MASSES, CONCENTRATION & YIELD.
- Reacting masses: moles of A -> use the equation ratio -> moles and mass of B. Limiting reactant determines the amount of product.
- Concentration in mol/dm^3 and g/dm^3 (g/dm^3 = mol/dm^3 x Mr); titration calculations (moles = c x v).
- Percentage yield = (actual / theoretical) x 100; percentage purity; empirical and molecular formulae from masses or % composition.
COMMON MISTAKES: not balancing before using ratios; cm^3/dm^3; rounding early; wrong limiting reactant.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit4: {
        "Electrolysis": `CIE IGCSE CHEMISTRY (0620) 4 — ELECTROLYSIS.
- Electrolysis = breaking down an ionic compound (molten or aqueous) using electricity. Cations move to the cathode (negative electrode, reduction/gain of electrons); anions to the anode (positive, oxidation/loss).
- Molten binary compounds: metal at cathode, non-metal at anode. Aqueous solutions: at the cathode H2 unless the metal is below H in reactivity (then the metal); at the anode a halogen if concentrated halide, otherwise O2.
- Examples: molten lead bromide; concentrated NaCl (chlorine, hydrogen, NaOH); dilute sulfuric acid (H2 and O2); electroplating and purifying copper (impure Cu anode, pure Cu cathode).
- (Supplement) write half-equations, e.g. cathode 2H+ + 2e- -> H2; anode 2Cl- -> Cl2 + 2e-.
COMMON MISTAKES: swapping anode/cathode; wrong aqueous products; reduction is gain of electrons (at cathode).
REACTIONS: 2Cl- -> Cl2 + 2e- ; 2H+ + 2e- -> H2 ; 4OH- -> O2 + 2H2O + 4e-. GRAPHS: empty.`,

        "Hydrogen-oxygen fuel cells": `CIE IGCSE CHEMISTRY (0620) 4 (Supplement) — FUEL CELLS.
- A hydrogen-oxygen fuel cell uses hydrogen and oxygen to produce electricity, with water as the only product: 2H2 + O2 -> 2H2O.
- Advantages over petrol/diesel: only water produced (no CO2/pollutants at point of use), more efficient. Disadvantages: hydrogen storage/transport, made from finite resources or using energy, infrastructure.
COMMON MISTAKES: forgetting the only product is water; not comparing fairly with combustion engines.
REACTIONS: 2H2 + O2 -> 2H2O. GRAPHS: empty.`,
      },
      unit5: {
        "Exothermic and endothermic reactions": `CIE IGCSE CHEMISTRY (0620) 5 — ENERGETICS.
- Exothermic: releases heat to surroundings (temperature rises), e.g. combustion, neutralisation, most oxidation. Endothermic: takes in heat (temperature falls), e.g. thermal decomposition.
- Reaction pathway (energy-level) diagrams: exothermic products below reactants; endothermic above; activation energy = the energy "hump".
- (Supplement) bond breaking is endothermic, bond making is exothermic; overall energy change = energy to break bonds - energy released making bonds.
COMMON MISTAKES: sign of energy change; bond breaking vs making energy; reading the profile diagram.
REACTIONS: empty. GRAPHS: reaction pathway/energy-level diagrams.`,
      },
      unit6: {
        "Rate (speed) of reaction": `CIE IGCSE CHEMISTRY (0620) 6 — RATE OF REACTION.
- Rate = amount of reactant used or product made per unit time. Measure by gas volume, mass loss, or time for a precipitate to hide a cross.
- Collision theory: more frequent and/or more energetic collisions increase rate. Factors: higher concentration/pressure (gases), higher temperature, larger surface area (powder), and a catalyst (speeds up without being used up, lowers activation energy via an alternative pathway).
- Interpret rate graphs (steeper = faster; levels off when a reactant is used up).
COMMON MISTAKES: confusing concentration with amount; saying a catalyst is used up; reading a rate graph incorrectly.
REACTIONS: empty. GRAPHS: volume/mass vs time curves (gradient = rate).`,

        "Reversible reactions and equilibrium": `CIE IGCSE CHEMISTRY (0620) 6 — REVERSIBLE REACTIONS & EQUILIBRIUM.
- Reversible reaction shown by the symbol with two half arrows. Example: hydrated copper(II) sulfate (blue) <-> anhydrous (white) + water (a test for water); also ammonium chloride.
- In a closed system, equilibrium is reached when the forward and backward reactions occur at the same rate (concentrations constant).
- (Supplement) Le Chatelier: increasing temperature shifts in the endothermic direction; increasing pressure shifts toward fewer gas moles; adding a reactant shifts toward products. Haber process N2 + 3H2 <-> 2NH3 (~450 degC, ~200 atm, iron catalyst) and Contact process for sulfuric acid as compromise conditions.
COMMON MISTAKES: equilibrium meaning equal amounts (it's equal rates); catalyst shifting position (it doesn't); pressure-vs-moles direction.
REACTIONS: N2 + 3H2 <-> 2NH3 ; hydrated <-> anhydrous CuSO4. GRAPHS: empty.`,

        "Redox reactions": `CIE IGCSE CHEMISTRY (0620) 6 — REDOX.
- Oxidation = gain of oxygen / loss of electrons / increase in oxidation number. Reduction = loss of oxygen / gain of electrons / decrease in oxidation number (OIL RIG).
- Oxidising agent accepts electrons (is reduced); reducing agent donates electrons (is oxidised). Identify redox in displacement and extraction reactions.
- (Supplement) use oxidation numbers; tests: acidified potassium manganate(VII) (purple -> colourless by a reducing agent); potassium iodide (-> brown iodine by an oxidising agent).
COMMON MISTAKES: calling electron gain "oxidation"; mixing up oxidising/reducing agent; oxidation-number signs.
REACTIONS: e.g. Fe + CuSO4 -> FeSO4 + Cu (redox displacement). GRAPHS: empty.`,
      },
      unit7: {
        "Acids, bases and indicators": `CIE IGCSE CHEMISTRY (0620) 7 — ACIDS, BASES & INDICATORS.
- Acid = proton (H+) donor (produces H+ in solution); base neutralises acid; alkali = soluble base (produces OH- in solution). Neutralisation: H+ + OH- -> H2O.
- Indicators: litmus (red acid / blue alkali), thymolphthalein, methyl orange; pH scale 0-14 (acid <7, neutral 7, alkali >7) by universal indicator/pH meter.
- Reactions of acids: with metals -> salt + hydrogen; with bases/metal oxides -> salt + water; with carbonates -> salt + water + CO2.
- (Supplement) strong acids fully ionise, weak acids (e.g. ethanoic) partially ionise.
COMMON MISTAKES: confusing base and alkali; wrong salt from the acid; strong vs concentrated.
REACTIONS: acid + metal/base/carbonate (general forms); H+ + OH- -> H2O. GRAPHS: empty.`,

        "Oxides and the preparation of salts": `CIE IGCSE CHEMISTRY (0620) 7 — OXIDES & SALT PREPARATION.
- Oxides: metal oxides are basic (some amphoteric, e.g. Al2O3, ZnO, react with both acids and alkalis); non-metal oxides are acidic; some are neutral (e.g. CO, NO, H2O).
- Salt naming: HCl -> chlorides; H2SO4 -> sulfates; HNO3 -> nitrates.
- Soluble salt from an insoluble base/metal/carbonate: add excess solid to acid, filter off excess, crystallise. Soluble salt from an alkali: titration. Insoluble salt: precipitation (mix two solutions, filter, wash, dry). Know solubility rules.
COMMON MISTAKES: wrong preparation route; not removing/ washing excess; salt-name from the wrong acid.
REACTIONS: e.g. acid + base -> salt + water; precipitation reactions. GRAPHS: empty.`,
      },
      unit8: {
        "Group I and Group VII trends": `CIE IGCSE CHEMISTRY (0620) 8 — GROUP I & GROUP VII.
- Group I (alkali metals): soft, low density, one outer electron -> +1 ions; react with water -> metal hydroxide + hydrogen (alkaline). Reactivity INCREASES down the group (outer electron lost more easily).
- Group VII (halogens): diatomic; colour darkens and state goes gas->liquid->solid down the group (Cl2 green gas, Br2 red-brown liquid, I2 grey solid). Gain one electron -> -1 ions. Reactivity DECREASES down the group. Displacement: a more reactive halogen displaces a less reactive halide (e.g. Cl2 + 2KBr -> 2KCl + Br2).
COMMON MISTAKES: same trend for both groups (G1 increases, G7 decreases); forgetting halogens are diatomic.
REACTIONS: 2Na + 2H2O -> 2NaOH + H2 ; Cl2 + 2KBr -> 2KCl + Br2. GRAPHS: empty.`,

        "Transition elements and noble gases": `CIE IGCSE CHEMISTRY (0620) 8 — TRANSITION ELEMENTS & NOBLE GASES.
- Transition elements (central block): high density and melting points; form coloured compounds; often have variable oxidation states (variable valency); used as catalysts (e.g. iron in the Haber process).
- Noble gases (Group VIII/0): full outer shell -> unreactive (inert); exist as single atoms; uses (helium in balloons, argon in lamps).
COMMON MISTAKES: thinking transition metals are very reactive; forgetting variable oxidation states / coloured compounds; noble gas inertness reason.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit9: {
        "Reactivity series and reactions of metals": `CIE IGCSE CHEMISTRY (0620) 9 — REACTIVITY SERIES.
- Order (most -> least): K, Na, Ca, Mg, Al, (C), Zn, Fe, (H), Cu, Ag, Au. Judge by reactions with water/steam, acids and oxygen.
- Metal + acid -> salt + hydrogen; metal + water -> hydroxide/oxide + hydrogen. Displacement: a more reactive metal displaces a less reactive one from its compound (basis of ranking and redox).
COMMON MISTAKES: wrong order; not linking vigour to position; ignoring that displacement is redox.
REACTIONS: metal + acid -> salt + H2 ; Fe + CuSO4 -> FeSO4 + Cu. GRAPHS: empty.`,

        "Extraction of metals and corrosion": `CIE IGCSE CHEMISTRY (0620) 9 — EXTRACTION & CORROSION.
- Method depends on reactivity: metals below carbon (Zn, Fe, Cu) extracted by reduction with carbon; metals above carbon (Al, etc.) by electrolysis.
- Blast furnace (iron): C + O2 -> CO2, CO2 + C -> CO, Fe2O3 + 3CO -> 2Fe + 3CO2; limestone removes acidic impurities as slag. Aluminium by electrolysis of Al2O3 in cryolite.
- Rusting of iron needs water AND oxygen (4Fe + 3O2 + xH2O -> hydrated iron(III) oxide). Prevention: barrier (paint, oil, plastic, galvanising) and sacrificial protection with a more reactive metal (zinc).
COMMON MISTAKES: choosing wrong method vs carbon; forgetting rust needs BOTH water and oxygen; sacrificial protection idea.
REACTIONS: Fe2O3 + 3CO -> 2Fe + 3CO2. GRAPHS: empty.`,
      },
      unit10: {
        "Water and fertilisers": `CIE IGCSE CHEMISTRY (0620) 10 — WATER & FERTILISERS.
- Test for water: anhydrous copper(II) sulfate turns white -> blue (or anhydrous cobalt(II) chloride blue -> pink). Test for PURE water: boils at 100 degC and freezes at 0 degC.
- Water treatment: sedimentation/filtration to remove solids; chlorination to kill microbes.
- Fertilisers (NPK) supply nitrogen (for protein/growth), phosphorus and potassium. Ammonium salts and nitrates provide nitrogen.
COMMON MISTAKES: confusing the test FOR water with the test for PURE water; forgetting why N, P, K are needed.
REACTIONS: empty. GRAPHS: empty.`,

        "Air quality and climate": `CIE IGCSE CHEMISTRY (0620) 10 — AIR QUALITY & CLIMATE.
- Clean dry air ~78% nitrogen, 21% oxygen, ~1% argon, ~0.04% CO2. Pollutants: carbon monoxide (toxic, incomplete combustion), sulfur dioxide (acid rain), oxides of nitrogen (acid rain, from car engines), particulates.
- Greenhouse gases (CO2, methane) cause the enhanced greenhouse effect -> climate change. Acid rain from SO2/NOx damages buildings, plants and aquatic life.
- Reducing pollution: catalytic converters (convert CO/NOx to CO2 and N2), flue-gas desulfurisation, low-sulfur fuels.
COMMON MISTAKES: confusing CO (toxic) and CO2; mixing acid rain (SO2/NOx) with the greenhouse effect (CO2/CH4).
REACTIONS: e.g. 2CO + 2NO -> 2CO2 + N2 (catalytic converter). GRAPHS: empty.`,
      },
      unit11: {
        "Fuels, alkanes and homologous series": `CIE IGCSE CHEMISTRY (0620) 11 — FUELS, ALKANES & HOMOLOGOUS SERIES.
- Crude oil = a mixture of hydrocarbons separated by fractional distillation (small molecules/low bp rise to the top). Fractions: refinery gas, gasoline, kerosene/paraffin, diesel, fuel oil, bitumen; uses and trends (larger = higher bp, more viscous, less flammable).
- Homologous series = family with the same general formula, similar properties, gradual trend. Alkanes CnH2n+2 (saturated): combustion and substitution with halogens in UV light. Complete combustion -> CO2 + H2O; incomplete -> CO + soot.
- Cracking: long alkanes -> shorter alkanes + alkenes (high temperature + catalyst).
COMMON MISTAKES: fractions being "pure"; bp/viscosity trend; substitution (alkanes) vs addition (alkenes).
REACTIONS: cracking e.g. C10H22 -> C8H18 + C2H4 ; CH4 + Cl2 -(UV)-> CH3Cl + HCl. GRAPHS: empty.`,

        "Alkenes and addition reactions": `CIE IGCSE CHEMISTRY (0620) 11 — ALKENES.
- Alkenes CnH2n (unsaturated): contain a C=C double bond (more reactive). Ethene C2H4, propene C3H6.
- Test for unsaturation: bromine water orange -> colourless (decolourised) with an alkene; alkanes do not decolourise it.
- Addition reactions across C=C: + Br2 -> dibromoalkane; + H2 (Ni catalyst) -> alkane; + steam (catalyst) -> alcohol (hydration of ethene -> ethanol).
COMMON MISTAKES: calling alkenes saturated; addition vs substitution; saying bromine water turns "clear".
REACTIONS: C2H4 + Br2 -> C2H4Br2 ; C2H4 + H2O -> C2H5OH. GRAPHS: empty.`,

        "Alcohols and carboxylic acids": `CIE IGCSE CHEMISTRY (0620) 11 — ALCOHOLS & CARBOXYLIC ACIDS.
- Alcohols (-OH), e.g. ethanol. Made by fermentation of glucose with yeast (C6H12O6 -> 2C2H5OH + 2CO2, ~30 degC, no air) or hydration of ethene (steam + catalyst). Ethanol is a fuel and solvent; burns: C2H5OH + 3O2 -> 2CO2 + 3H2O.
- Carboxylic acids (-COOH), e.g. ethanoic acid: weak acids showing typical acid reactions (with metals, carbonates, bases). Ethanol oxidised (acidified potassium manganate(VII) or air/microbes) to ethanoic acid.
- (Supplement) ester formation: carboxylic acid + alcohol <-> ester + water (conc. sulfuric acid catalyst), e.g. ethyl ethanoate.
COMMON MISTAKES: confusing fermentation vs hydration; forgetting carboxylic acids are weak; ester naming.
REACTIONS: C6H12O6 -> 2C2H5OH + 2CO2 ; acid + alcohol <-> ester + water. GRAPHS: empty.`,

        "Polymers": `CIE IGCSE CHEMISTRY (0620) 11 — POLYMERS.
- Addition polymers: many unsaturated monomers (alkenes) join, the C=C opening, into one long chain with no by-product, e.g. n ethene -> poly(ethene); poly(propene), PVC. Draw a repeat unit from a monomer (and vice versa): C=C becomes a single bond, bonds pass through the brackets, subscript n.
- (Supplement) condensation polymers: two different monomers (each with two functional groups) join, losing a small molecule (water) each link -> polyesters (e.g. PET) and polyamides (e.g. nylon).
- Most addition polymers are non-biodegradable -> pollution; disposal by landfill, incineration (CO2/toxic gases) or recycling.
COMMON MISTAKES: leaving a double bond in the repeat unit; missing the n / continuation bonds; addition (no by-product) vs condensation (loses water).
REACTIONS: n C2H4 -> poly(ethene). GRAPHS: empty.`,
      },
      unit12: {
        "Experimental techniques and separation": `CIE IGCSE CHEMISTRY (0620) 12 — EXPERIMENTAL TECHNIQUES & SEPARATION.
- Measure time, temperature, mass and volume with appropriate apparatus; read the bottom of the meniscus at eye level.
- Purity: a pure substance has a sharp, fixed melting/boiling point; impurities lower and broaden the melting point.
- Separation: filtration (insoluble solid from liquid), crystallisation (soluble solid from solution), simple distillation (solvent from solution), fractional distillation (miscible liquids by boiling point), paper chromatography (Rf = distance moved by spot / distance moved by solvent; locating agent for colourless spots).
COMMON MISTAKES: filtration vs crystallisation; Rf > 1 (impossible); not using a locating agent for colourless substances.
REACTIONS: empty. GRAPHS: empty.`,

        "Identification of ions and gases": `CIE IGCSE CHEMISTRY (0620) 12 — IDENTIFYING IONS & GASES. Pure recall — reagent -> observation -> conclusion.
- Flame tests (cations): Li+ red, Na+ yellow, K+ lilac, Ca2+ orange-red, Cu2+ blue-green.
- Cations with sodium hydroxide (and aqueous ammonia): Cu2+ blue ppt; Fe2+ green ppt; Fe3+ red-brown ppt; NH4+ -> ammonia gas on warming (damp red litmus -> blue). Al3+, Zn3+/Zn2+, Ca2+ give white ppts (Al/Zn dissolve in excess NaOH).
- Anions: carbonate (add acid -> CO2 -> limewater milky); sulfate (acidify with HCl then BaCl2 -> white ppt); halides (acidify with HNO3 then AgNO3 -> Cl white, Br cream, I yellow); nitrate (Supplement: with NaOH + aluminium foil, warm -> ammonia).
- Gases: hydrogen (squeaky pop), oxygen (relights glowing splint), CO2 (limewater milky), ammonia (damp red litmus -> blue), chlorine (damp litmus bleached).
COMMON MISTAKES: not acidifying first in sulfate/halide tests; mixing halide precipitate colours; H2 pop vs O2 relight.
REACTIONS: identification/precipitate reactions as above. GRAPHS: empty. REFERENCE TABLES: flame colours; NaOH precipitate colours; halide precipitate colours; gas tests.`,
      },
    },

    biology: {
      unit1: {
        "Characteristics of living organisms": `CIE IGCSE BIOLOGY (0610) 1 — CHARACTERISTICS OF LIVING ORGANISMS (MRS GREN).
- Movement, Respiration (chemical release of energy from nutrients in cells), Sensitivity (detect and respond to stimuli), Growth (permanent increase in size/dry mass), Reproduction, Excretion (removal of metabolic waste), Nutrition (taking in materials for energy, growth, development).
- All living organisms show ALL seven. Distinguish excretion (metabolic waste, e.g. CO2, urea) from egestion (undigested food/faeces).
COMMON MISTAKES: confusing respiration with breathing; calling egestion excretion; vague growth definition.
REACTIONS: empty. GRAPHS: empty.`,

        "Classification systems and the five kingdoms": `CIE IGCSE BIOLOGY (0610) 1 — CLASSIFICATION & THE FIVE KINGDOMS.
- Classification groups organisms by shared features (modern systems use DNA/protein sequences — the more similar, the more closely related/recent common ancestor).
- Binomial system: each species has a two-part Latin name (Genus species), e.g. Homo sapiens. Species = organisms that can reproduce to give fertile offspring.
- Kingdoms: animals, plants, fungi, protoctists, prokaryotes (bacteria). Eukaryotes have a nucleus; prokaryotes (bacteria) do not.
COMMON MISTAKES: misordering Genus/species; capitalising species name; forgetting the fertile-offspring part of species.
REACTIONS: empty. GRAPHS: empty.`,

        "Features of organisms and dichotomous keys": `CIE IGCSE BIOLOGY (0610) 1 — FEATURES OF GROUPS & KEYS.
- Vertebrate groups: fish, amphibians, reptiles, birds, mammals (know one or two key features each, e.g. mammals: fur/hair, mammary glands; birds: feathers, beak).
- Plant groups (ferns and flowering plants) and the main features of arthropods (insects, arachnids, crustaceans, myriapods) by number of legs/body parts.
- Dichotomous key: a series of paired either/or questions about visible features that leads to the identity of an organism. Construct and use one.
COMMON MISTAKES: using non-visible features in a key; muddling arthropod groups; vertebrate feature errors.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit2: {
        "Cell structure and organisation": `CIE IGCSE BIOLOGY (0610) 2 — CELL STRUCTURE.
- Animal cell: nucleus (controls cell, contains DNA), cytoplasm (reactions), cell membrane (controls entry/exit), mitochondria (aerobic respiration), ribosomes (protein synthesis).
- Plant cell also has: cellulose cell wall (support), large permanent vacuole (cell sap, turgor), chloroplasts (photosynthesis).
- Bacterial cell: cell wall, cell membrane, cytoplasm, circular DNA (no nucleus), plasmids; no mitochondria/chloroplasts.
COMMON MISTAKES: confusing cell wall and membrane; giving animal cells chloroplasts/vacuole; bacteria having a nucleus.
REACTIONS: empty. GRAPHS: empty.`,

        "Specialised cells, tissues and organs": `CIE IGCSE BIOLOGY (0610) 2 — SPECIALISED CELLS & ORGANISATION.
- Levels: organelle -> cell -> tissue (similar cells with a function) -> organ -> organ system -> organism.
- Specialised cells (structure suits function): ciliated cell (cilia sweep mucus), root hair cell (large surface area for absorption), xylem vessel (hollow, lignified, transport water), red blood cell (biconcave, no nucleus, haemoglobin), nerve cell (long axon), sperm/egg, palisade mesophyll (many chloroplasts).
COMMON MISTAKES: wrong level order; not linking a feature to its function.
REACTIONS: empty. GRAPHS: empty.`,

        "Size of specimens and magnification": `CIE IGCSE BIOLOGY (0610) 2 — SIZE & MAGNIFICATION.
- Magnification = image size / actual size. Rearrange: actual size = image size / magnification.
- Use consistent units (1 mm = 1000 micrometres). Calculate magnification of a drawing/photograph and the real size of a structure using a scale bar.
COMMON MISTAKES: unit conversion (mm to micrometres); rearranging the formula wrongly; mixing image and actual size.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit3: {
        "Diffusion": `CIE IGCSE BIOLOGY (0610) 3 — DIFFUSION.
- Diffusion = net movement of particles from a higher to a lower concentration (down a concentration gradient), due to random motion; a passive process (no energy).
- Important for gas exchange (O2 in, CO2 out) and absorption. Rate increases with a steeper gradient, higher temperature, larger surface area and shorter distance.
COMMON MISTAKES: saying diffusion needs energy; forgetting it is down the gradient; not listing rate factors.
REACTIONS: empty. GRAPHS: empty.`,

        "Osmosis": `CIE IGCSE BIOLOGY (0610) 3 — OSMOSIS.
- Osmosis = net movement of water molecules from a region of higher water potential (dilute solution) to lower water potential (concentrated solution) through a partially permeable membrane; passive.
- Plant cells: in pure water -> water enters -> turgid (supports the plant); in concentrated solution -> water leaves -> flaccid, then plasmolysed (membrane pulls from wall). Animal cells lack a wall -> can burst (lysis) or shrink (crenation).
COMMON MISTAKES: saying osmosis is "high to low concentration" (it's WATER from high to low water potential, i.e. dilute to concentrated); confusing turgid/flaccid/plasmolysed.
REACTIONS: empty. GRAPHS: empty.`,

        "Active transport": `CIE IGCSE BIOLOGY (0610) 3 — ACTIVE TRANSPORT.
- Active transport = movement of particles through a cell membrane from a lower to a higher concentration (AGAINST the gradient) using energy from respiration (and carrier/transport proteins).
- Examples: ion uptake by root hair cells; glucose absorption in the small intestine/kidney.
COMMON MISTAKES: forgetting it needs energy/respiration; getting the gradient direction wrong; not mentioning carrier proteins.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit4: {
        "Biological molecules and food tests": `CIE IGCSE BIOLOGY (0610) 4 — BIOLOGICAL MOLECULES & FOOD TESTS.
- Carbohydrates (made of simple sugars; starch and glycogen are storage; cellulose makes plant cell walls). Proteins (made of amino acids; for growth/enzymes). Fats/lipids (fatty acids + glycerol; energy store/insulation). Water is essential as a solvent.
- Food tests: starch -> iodine solution -> blue-black; reducing sugar -> Benedict's solution, heat -> brick-red; protein -> Biuret -> purple/violet; fat -> ethanol emulsion test -> cloudy white emulsion. Vitamin C decolourises DCPIP.
- (Supplement) elements: carbohydrates/fats = C, H, O; proteins also contain N (and S).
COMMON MISTAKES: wrong food-test colours; not heating Benedict's; confusing starch (iodine) with sugar (Benedict's).
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit5: {
        "Enzymes and factors affecting activity": `CIE IGCSE BIOLOGY (0610) 5 — ENZYMES.
- Enzymes = biological catalysts (proteins) that speed up reactions and are not used up. Specific: the substrate fits the active site (complementary shape — "lock and key").
- Temperature: activity rises to an optimum then falls sharply as the enzyme DENATURES (active site shape changes) at high temperature. pH: each enzyme has an optimum pH; extreme pH denatures it.
- (Supplement) explain in terms of molecular collisions and the enzyme-substrate complex; denaturing is the permanent change to the active site.
COMMON MISTAKES: saying enzymes are "killed" (they denature, not alive); forgetting low temperature only slows (doesn't denature); wrong graph shapes.
REACTIONS: empty. GRAPHS: enzyme activity vs temperature (peak then sharp fall) and vs pH (bell-shaped).`,
      },
      unit6: {
        "Photosynthesis": `CIE IGCSE BIOLOGY (0610) 6 — PHOTOSYNTHESIS.
- Photosynthesis = plants make carbohydrates (glucose) from carbon dioxide and water using light energy absorbed by chlorophyll. Word: carbon dioxide + water -(light, chlorophyll)-> glucose + oxygen. Symbol: 6CO2 + 6H2O -> C6H12O6 + 6O2.
- Limiting factors: light intensity, carbon dioxide concentration, temperature (any can limit the rate). Glucose is used in respiration, converted to starch (storage), cellulose, or used to make proteins (with nitrate).
- Tests: starch test on a leaf (de-starch, then iodine); investigate the need for light, CO2 and chlorophyll (variegated leaf).
COMMON MISTAKES: forgetting chlorophyll/light over the arrow; not knowing the symbol equation; confusing limiting factors.
REACTIONS: 6CO2 + 6H2O -> C6H12O6 + 6O2. GRAPHS: rate of photosynthesis vs light/CO2/temperature (rises then plateaus at a limiting factor).`,

        "Leaf structure": `CIE IGCSE BIOLOGY (0610) 6 — LEAF STRUCTURE & ADAPTATIONS.
- Layers: waxy cuticle, upper epidermis, palisade mesophyll (many chloroplasts — most photosynthesis), spongy mesophyll (air spaces for gas exchange), lower epidermis with stomata (guard cells open/close them), vascular bundles (xylem + phloem).
- Adaptations for photosynthesis: large flat surface area (light/CO2 capture), thin (short diffusion distance), many chloroplasts near the top, stomata for gas exchange, vein network for transport/support.
COMMON MISTAKES: mixing palisade and spongy layers; forgetting guard cells control stomata; xylem vs phloem roles.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit7: {
        "Diet and balanced nutrition": `CIE IGCSE BIOLOGY (0610) 7 — DIET.
- A balanced diet contains carbohydrates, proteins, fats, vitamins, minerals, fibre (roughage) and water in the right proportions.
- Vitamin C (scurvy), vitamin D (rickets/weak bones — needed for calcium uptake), calcium (bones/teeth), iron (haemoglobin — deficiency causes anaemia). Fibre prevents constipation (aids peristalsis).
- Energy needs vary with age, activity, sex and pregnancy. Effects of malnutrition: starvation, deficiency diseases, obesity, coronary heart disease.
COMMON MISTAKES: confusing vitamins/minerals and their deficiency diseases; forgetting fibre/water; energy-requirement factors.
REACTIONS: empty. GRAPHS: empty.`,

        "The digestive system": `CIE IGCSE BIOLOGY (0610) 7 — THE DIGESTIVE SYSTEM.
- Parts and functions: mouth (mechanical digestion, amylase), oesophagus (peristalsis), stomach (acid + protease, kills microbes), small intestine = duodenum (digestion) + ileum (absorption), pancreas and liver (enzymes/bile), large intestine/colon (water absorption), rectum and anus (egestion).
- Ingestion, digestion (mechanical and chemical), absorption, assimilation, egestion. Peristalsis = waves of muscle contraction moving food along.
- Teeth types (incisor, canine, premolar, molar) and dental decay/care.
COMMON MISTAKES: confusing digestion sites; calling egestion excretion; peristalsis definition.
REACTIONS: empty. GRAPHS: empty.`,

        "Chemical digestion and absorption": `CIE IGCSE BIOLOGY (0610) 7 — CHEMICAL DIGESTION & ABSORPTION.
- Enzymes: amylase (starch -> maltose; mouth/pancreas), protease (protein -> amino acids; e.g. pepsin in the acidic stomach), lipase (fats -> fatty acids + glycerol). Maltase finishes maltose -> glucose.
- Bile (made in the liver, stored in the gall bladder): emulsifies fats (larger surface area for lipase) and neutralises stomach acid (alkaline) for small-intestine enzymes.
- Absorption in the small intestine: villi (and microvilli) give a large surface area, thin walls, good blood supply (and lacteals for fats). Assimilation = using absorbed nutrients in cells.
COMMON MISTAKES: bile being an enzyme (it's not); wrong enzyme-substrate pairs; forgetting villi adaptations.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit8: {
        "Transport in plants (xylem, phloem, transpiration)": `CIE IGCSE BIOLOGY (0610) 8 — TRANSPORT IN PLANTS.
- Xylem: carries water and dissolved mineral ions UP from roots to leaves (transpiration stream); dead, hollow, lignified. Phloem: carries dissolved sugars (sucrose) and amino acids up and down (translocation); living.
- Water uptake by root hair cells (osmosis); transpiration = loss of water vapour from leaves through stomata. Rate increases with higher temperature, light intensity, air movement (wind) and lower humidity.
- Investigate water uptake with a potometer.
COMMON MISTAKES: swapping xylem (water, up) and phloem (sugar, both ways); transpiration factors; root uptake by osmosis.
REACTIONS: empty. GRAPHS: empty.`,

        "The heart and circulatory system": `CIE IGCSE BIOLOGY (0610) 8 — HEART & CIRCULATION.
- Double circulation: heart -> lungs -> heart -> body. Heart has four chambers; right side pumps deoxygenated blood to the lungs, left side (thicker muscle) pumps oxygenated blood to the body; valves prevent backflow; coronary arteries supply the heart muscle.
- Heart rate increases during exercise (more O2/glucose to muscles, remove CO2) controlled by adrenaline/nervous signals.
- Coronary heart disease: blocked coronary arteries; risk factors (diet, smoking, lack of exercise) and prevention.
COMMON MISTAKES: which side is oxygenated; forgetting valves/thicker left wall; not explaining exercise response.
REACTIONS: empty. GRAPHS: empty.`,

        "Blood and blood vessels": `CIE IGCSE BIOLOGY (0610) 8 — BLOOD & VESSELS.
- Vessels: arteries (thick muscular/elastic walls, high pressure, carry blood away from heart, no valves); veins (thinner walls, low pressure, towards heart, valves); capillaries (one cell thick, exchange substances with tissues).
- Blood components: red blood cells (haemoglobin + O2 -> oxyhaemoglobin; biconcave, no nucleus), white blood cells (phagocytes engulf microbes; lymphocytes make antibodies), platelets (clotting), plasma (carries CO2, urea, nutrients, hormones, heat).
COMMON MISTAKES: arteries always oxygenated (pulmonary artery is deoxygenated); confusing the white blood cell types; capillary wall thickness.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit9: {
        "Pathogens, transmission and immunity": `CIE IGCSE BIOLOGY (0610) 9 — DISEASES & IMMUNITY.
- A pathogen = a disease-causing organism (bacteria, viruses, fungi, protoctists). A transmissible disease passes from one host to another (e.g. via contaminated water/food, droplets, contact, body fluids).
- Body defences: mechanical (skin, hairs, mucus), chemical (stomach acid, lysozymes in tears). White blood cells: phagocytes engulf pathogens (phagocytosis); lymphocytes produce specific antibodies that bind to antigens.
- Active immunity (memory cells from infection or vaccination) gives long-term protection; passive immunity (ready-made antibodies, e.g. from breast milk) is short-term. Vaccination: weakened/inactive pathogen (antigens) triggers an immune response and memory cells.
- Controlling spread: hygiene, sanitation, clean water, safe food handling, vaccination.
COMMON MISTAKES: confusing active and passive immunity; phagocyte vs lymphocyte roles; antigen vs antibody.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit10: {
        "Gas exchange in humans": `CIE IGCSE BIOLOGY (0610) 10 — GAS EXCHANGE IN HUMANS.
- Pathway: nose -> trachea -> bronchi -> bronchioles -> alveoli. Trachea held open by cartilage; lined with ciliated cells and goblet cells (mucus traps dust/microbes, cilia sweep it up).
- Alveoli adaptations: large surface area, thin (one-cell) walls -> short diffusion distance, moist, rich blood supply (maintains the gradient). O2 diffuses into blood, CO2 out.
- Ventilation: inhale — diaphragm contracts/flattens, external intercostals contract -> ribs up/out -> volume up, pressure down -> air in; exhale the reverse. Exhaled air has more CO2, less O2, more water vapour, and is warmer.
COMMON MISTAKES: confusing gas exchange with respiration; breathing mechanism (volume/pressure); alveoli adaptations.
REACTIONS: empty. GRAPHS: empty.`,

        "Respiration (aerobic and anaerobic)": `CIE IGCSE BIOLOGY (0610) 10 — RESPIRATION.
- Respiration = chemical reactions in cells that break down nutrients to release energy (for muscle contraction, active transport, building molecules, growth, keeping warm). Occurs in ALL living cells.
- Aerobic: glucose + oxygen -> carbon dioxide + water (+ much energy). C6H12O6 + 6O2 -> 6CO2 + 6H2O. Mainly in mitochondria.
- Anaerobic: in muscle -> glucose -> lactic acid (+ little energy), causing oxygen debt/fatigue; in yeast/plants -> glucose -> ethanol + carbon dioxide (fermentation). Anaerobic releases much less energy.
COMMON MISTAKES: confusing respiration with breathing; forgetting anaerobic gives less energy; saying respiration "makes" energy (it releases it).
REACTIONS: C6H12O6 + 6O2 -> 6CO2 + 6H2O ; glucose -> lactic acid ; glucose -> ethanol + CO2. GRAPHS: empty.`,
      },
      unit11: {
        "Excretion in humans": `CIE IGCSE BIOLOGY (0610) 11 — EXCRETION.
- Excretion = removal of toxic/waste products of metabolism and substances in excess. CO2 (from respiration) removed by the lungs; urea removed by the kidneys.
- The liver breaks down excess amino acids (deamination) to form urea; it also breaks down alcohol/toxins. Kidneys filter blood (remove urea, excess water and salts as urine) and reabsorb useful substances (glucose, needed water/salts).
- (Supplement) kidney structure (nephron): ultrafiltration in the glomerulus, selective reabsorption; osmoregulation controls water content. Dialysis vs transplant for kidney failure.
COMMON MISTAKES: confusing excretion with egestion; forgetting the liver makes urea; kidney reabsorption.
REACTIONS: empty. GRAPHS: empty.`,

        "Nervous control and reflexes": `CIE IGCSE BIOLOGY (0610) 11 — NERVOUS CONTROL.
- Nervous system = central (brain + spinal cord) and peripheral nerves. Neurones: sensory, relay, motor. Electrical impulses are fast and short-lived.
- Reflex arc (rapid, automatic, protective): stimulus -> receptor -> sensory neurone -> relay neurone (spinal cord) -> motor neurone -> effector (muscle/gland) -> response.
- Synapse = a gap between neurones; the impulse crosses by a chemical neurotransmitter (diffuses across, binds to receptors), making transmission one-way.
COMMON MISTAKES: reflex arc order; calling a reflex voluntary; synapse transmission (chemical, one-way).
REACTIONS: empty. GRAPHS: empty.`,

        "Hormones and homeostasis": `CIE IGCSE BIOLOGY (0610) 11 — HORMONES & HOMEOSTASIS.
- Hormone = a chemical messenger made by a gland, carried in the blood to target organs; slower and longer-lasting than nervous control. Adrenaline (fight-or-flight: raises heart rate, breathing, blood glucose).
- Homeostasis = maintaining a constant internal environment. Blood glucose control: insulin (lowers glucose, liver stores it as glycogen) and glucagon (raises glucose). Diabetes = inability to control blood glucose.
- Temperature control (skin): vasodilation/sweating to cool; vasoconstriction/shivering/hairs erect to warm. Negative feedback restores the set point.
COMMON MISTAKES: insulin vs glucagon roles; nervous vs hormonal comparison; vasodilation/constriction direction.
REACTIONS: empty. GRAPHS: empty.`,

        "Tropic responses in plants": `CIE IGCSE BIOLOGY (0610) 11 — PLANT TROPISMS.
- Tropism = a growth response to a directional stimulus. Phototropism (response to light): shoots are positively phototropic (grow toward light); roots negatively. Gravitropism/geotropism (response to gravity): roots positive (grow down), shoots negative.
- (Supplement) controlled by the hormone auxin: made at the tip, it moves to the shaded/lower side, causing those cells to elongate more, so the shoot bends toward the light. Synthetic auxins used as weedkillers/rooting powders.
COMMON MISTAKES: which way roots/shoots bend; auxin distribution and effect; defining tropism.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit12: {
        "Asexual and sexual reproduction": `CIE IGCSE BIOLOGY (0610) 12 — TYPES OF REPRODUCTION.
- Asexual: one parent, no gametes, offspring genetically identical (clones), no variation (e.g. bacteria dividing, runners, tubers). Advantages: fast, only one parent; disadvantage: no variation -> vulnerable to change/disease.
- Sexual: two parents, fusion of gametes (fertilisation), offspring genetically different (variation). Advantage: variation aids survival/selection; disadvantage: needs two parents/time.
COMMON MISTAKES: thinking asexual gives variation; gamete/fertilisation definitions; listing pros/cons.
REACTIONS: empty. GRAPHS: empty.`,

        "Sexual reproduction in plants": `CIE IGCSE BIOLOGY (0610) 12 — REPRODUCTION IN PLANTS.
- Flower parts: stamen (anther + filament) = male, makes pollen; carpel (stigma, style, ovary with ovules) = female. Sepals and petals.
- Pollination = transfer of pollen from anther to stigma. Insect-pollinated (large bright scented petals, nectar, sticky/spiky pollen) vs wind-pollinated (small dull no petals, feathery anthers/stigmas hanging out, lots of smooth light pollen).
- Fertilisation: pollen grows a pollen tube down the style to the ovule; nuclei fuse. Ovule -> seed, ovary -> fruit. Germination needs water, oxygen and warmth.
COMMON MISTAKES: pollination vs fertilisation; insect vs wind features; seed/fruit origin.
REACTIONS: empty. GRAPHS: empty.`,

        "Sexual reproduction in humans": `CIE IGCSE BIOLOGY (0610) 12 — REPRODUCTION IN HUMANS.
- Male: testes (sperm + testosterone), sperm ducts, prostate, urethra, penis. Female: ovaries (eggs + oestrogen/progesterone), oviduct (fertilisation site), uterus, cervix, vagina.
- Fertilisation: sperm + egg fuse in the oviduct -> zygote -> embryo -> implants in the uterus lining. Adaptations of sperm (tail, mitochondria, acrosome) and egg (cytoplasm/food, jelly coat).
- Placenta and umbilical cord: exchange O2, glucose, amino acids to the fetus and CO2, urea away; amniotic fluid protects the fetus.
COMMON MISTAKES: oviduct (fertilisation) vs uterus (development); gamete adaptations; placenta exchange direction.
REACTIONS: empty. GRAPHS: empty.`,

        "Sex hormones and sexually transmitted infections": `CIE IGCSE BIOLOGY (0610) 12 — SEX HORMONES & STIs.
- Puberty: testosterone (male) and oestrogen (female) cause secondary sexual characteristics.
- Menstrual cycle (~28 days): FSH (matures an egg, stimulates oestrogen), oestrogen (repairs/thickens uterus lining, triggers LH), LH (ovulation ~day 14), progesterone (maintains the lining; falls -> menstruation).
- STIs: HIV (causes AIDS) spread by body fluids/unprotected sex/sharing needles; controlled by condoms, screening, not sharing needles, education.
COMMON MISTAKES: hormone roles/order in the cycle; HIV transmission/control; testosterone vs oestrogen.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit13: {
        "Chromosomes, genes and proteins": `CIE IGCSE BIOLOGY (0610) 13 — CHROMOSOMES, GENES & PROTEINS.
- Chromosome = a long molecule of DNA. Gene = a length of DNA that codes for a protein (a sequence of amino acids). Alleles = different versions of a gene.
- Humans have 23 pairs of chromosomes (46) in body cells; gametes have 23 (haploid). The genome is all the DNA of an organism.
- (Supplement) the sequence of bases codes for the sequence of amino acids; different genes are active in different specialised cells (controlling which proteins are made).
COMMON MISTAKES: gene vs allele vs chromosome; haploid vs diploid numbers; DNA -> protein idea.
REACTIONS: empty. GRAPHS: empty.`,

        "Mitosis and meiosis": `CIE IGCSE BIOLOGY (0610) 13 — MITOSIS & MEIOSIS.
- Mitosis: produces two genetically identical diploid cells; for growth, repair, replacement and asexual reproduction. Chromosomes are copied exactly first.
- Meiosis: a reduction division producing four genetically different haploid gametes; introduces variation. Fertilisation restores the diploid number.
- Stem cells = unspecialised cells that divide (mitosis) to produce cells that can specialise.
COMMON MISTAKES: mitosis (identical, diploid) vs meiosis (varied, haploid gametes); number of daughter cells; where each occurs.
REACTIONS: empty. GRAPHS: empty.`,

        "Monohybrid inheritance": `CIE IGCSE BIOLOGY (0610) 13 — MONOHYBRID INHERITANCE.
- Terms: dominant (one allele shows it, capital letter) / recessive (needs two, lowercase); homozygous/heterozygous; genotype (alleles) / phenotype (characteristic).
- Genetic (Punnett) diagrams: a cross of two heterozygotes (Bb x Bb) gives a 3:1 ratio; a test cross with the homozygous recessive reveals an unknown genotype.
- Sex determination: XX female, XY male -> 1:1. (Supplement) codominance (both alleles expressed, e.g. ABO blood groups), sex-linked characteristics (genes on the X chromosome, e.g. colour blindness). Pedigree diagrams.
COMMON MISTAKES: genotype case errors; ratios as certainties (they're probabilities); test-cross logic; codominance.
REACTIONS: empty. GRAPHS: empty.`,

        "Variation and selection": `CIE IGCSE BIOLOGY (0610) 13 — VARIATION & SELECTION.
- Variation: continuous (a range, e.g. height — polygenic + environment) vs discontinuous (distinct categories, e.g. blood group — usually one/few genes). Genetic variation is inheritable; environmental is not.
- Mutation = a random change in a gene/DNA; the source of new alleles/genetic variation; rate increased by ionising radiation and some chemicals.
- Natural selection: variation exists; competition for resources; the best-adapted survive and reproduce (survival of the fittest), passing on advantageous alleles -> the population adapts/evolves (e.g. antibiotic-resistant bacteria). Artificial selection (selective breeding) by humans choosing the parents.
COMMON MISTAKES: continuous vs discontinuous; natural vs artificial selection; explaining adaptation steps fully.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit14: {
        "Energy flow, food chains and food webs": `CIE IGCSE BIOLOGY (0610) 14 — ENERGY FLOW & FEEDING RELATIONSHIPS.
- Energy enters as sunlight, captured by producers (plants) in photosynthesis. Food chain shows energy flow (arrows = direction of energy transfer): producer -> primary consumer (herbivore) -> secondary -> tertiary consumer. Decomposers break down dead material.
- Trophic levels; food webs (interlinked chains). Pyramids of numbers and of biomass.
- Only ~10% of energy passes to the next level (rest lost as heat from respiration, movement, undigested/egested material) -> limits chain length (usually <=5) and explains pyramids of biomass narrowing upward.
COMMON MISTAKES: food-chain arrow direction; the ~10% loss reasons; producer vs consumer.
REACTIONS: empty. GRAPHS: empty.`,

        "Carbon and nitrogen cycles": `CIE IGCSE BIOLOGY (0610) 14 — NUTRIENT CYCLES.
- Carbon cycle: CO2 removed by photosynthesis; returned by respiration (plants, animals, decomposers), combustion of fossil fuels/wood, and decomposition. Fossil fuels lock carbon away.
- (Supplement) Nitrogen cycle: nitrogen-fixing bacteria (soil/legume root nodules) convert N2 -> nitrates/ammonium (lightning also fixes N). Decomposers convert proteins/urea -> ammonium (decay); nitrifying bacteria: ammonium -> nitrites -> nitrates; plants absorb nitrates to make protein; denitrifying bacteria: nitrates -> N2.
COMMON MISTAKES: confusing nitrifying with nitrogen-fixing bacteria; forgetting decomposers in the carbon cycle.
REACTIONS: empty. GRAPHS: empty.`,

        "Populations": `CIE IGCSE BIOLOGY (0610) 14 — POPULATIONS.
- Population = all the organisms of one species in an area; community = all the populations; ecosystem = community + non-living environment.
- A population growth curve has lag, exponential (log), stationary and (sometimes) death phases. Limiting factors: food/water/space availability, predation, disease, competition.
- The human population has grown rapidly (better food, medicine, hygiene).
COMMON MISTAKES: population vs community vs ecosystem; naming/explaining the growth-curve phases; limiting factors.
REACTIONS: empty. GRAPHS: population growth (sigmoid) curve with named phases.`,
      },
      unit15: {
        "Food production and habitat destruction": `CIE IGCSE BIOLOGY (0610) 15 — FOOD PRODUCTION & HABITAT LOSS.
- Increasing food production: monocultures, glasshouses/polythene tunnels (control light, temperature, CO2), fertilisers (add minerals), pesticides/herbicides, and selective breeding/biotech. Intensive livestock farming increases yield but raises welfare and antibiotic concerns.
- Habitat destruction (deforestation, draining wetlands, building) and over-harvesting reduce biodiversity. Deforestation -> more CO2, less photosynthesis, soil erosion, flooding, loss of species, disruption of the water cycle.
COMMON MISTAKES: vague yield-increase answers; not linking deforestation to specific effects.
REACTIONS: empty. GRAPHS: empty.`,

        "Pollution and conservation": `CIE IGCSE BIOLOGY (0610) 15 — POLLUTION & CONSERVATION.
- Eutrophication: excess nitrate/phosphate (fertiliser run-off/sewage) -> algal bloom -> blocks light -> plants die -> decomposers multiply and use up oxygen (high BOD) -> aquatic animals suffocate.
- Air pollution: CO2 and methane (greenhouse gases) -> climate change; non-biodegradable plastics harm wildlife. Sewage spreads disease and lowers oxygen.
- Conservation maintains biodiversity: protected areas, captive breeding, seed banks, monitoring; sustainable resource use (fishing quotas/net mesh, replanting forests, recycling).
COMMON MISTAKES: eutrophication steps (decomposers use the O2, not the algae directly); greenhouse vs acid rain; vague conservation.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit16: {
        "Biotechnology (microorganisms and enzymes)": `CIE IGCSE BIOLOGY (0610) 16 — BIOTECHNOLOGY.
- Microorganisms are useful: fast reproduction, simple needs, no ethical concerns, can be genetically modified. Yeast in bread (CO2 makes dough rise) and brewing (anaerobic respiration -> ethanol + CO2). Bacteria (Lactobacillus) in yoghurt (lactic acid).
- Industrial fermenters grow microorganisms under controlled conditions: temperature (cooling — respiration is exothermic), pH, oxygen (air supply), nutrients, stirring, and sterility (prevent contamination). Used to make antibiotics (e.g. penicillin from Penicillium) and single-cell protein.
- (Supplement) enzymes from microorganisms: biological washing powders (proteases/lipases remove stains at low temperatures); pectinase (fruit juice); lactase (lactose-free milk).
COMMON MISTAKES: forgetting fermenters need COOLING; fermentation is anaerobic; enzyme uses.
REACTIONS: yeast: glucose -> ethanol + CO2. GRAPHS: empty.`,

        "Genetic modification": `CIE IGCSE BIOLOGY (0610) 16 — GENETIC MODIFICATION.
- Genetic modification = changing an organism's genetic material by inserting a gene from another organism to give a desired feature.
- (Supplement) making human insulin: cut the human insulin gene out and open a bacterial plasmid using restriction enzymes (leaving sticky ends); join the gene into the plasmid with ligase; the plasmid (vector) is taken up by a bacterium, which is grown in a fermenter and produces human insulin.
- Other examples: GM crops (pest/herbicide resistance, higher yield, added vitamins e.g. golden rice). Benefits (more food/medicine, less pesticide) vs concerns (effects on ecosystems, gene transfer, ethics).
COMMON MISTAKES: confusing GM with selective breeding; forgetting restriction enzymes/ligase/plasmid vector roles.
REACTIONS: empty. GRAPHS: empty.`,
      },
    },
  },

  "cie": {
    chemistry: {
      unit1: {
        "Atoms, molecules and stoichiometry": `CIE A LEVEL CHEMISTRY (9701) AS — ATOMS, MOLECULES & STOICHIOMETRY.
- Relative atomic/isotopic/molecular/formula mass on the 12C scale. Mass spectrometry: Ar = Σ(isotopic mass × abundance)/100; interpret Cl2/Br2 spectra.
- The mole and Avogadro constant (6.02×10^23). n = mass/Mr; n = cV (solutions); gas volume via molar gas volume (24 dm^3 at rtp); ideal gas pV = nRT (SI units: Pa, m^3, K, R = 8.31).
- Empirical and molecular formulae from composition. Balanced full and ionic equations with state symbols; reacting-quantity calculations including limiting reagent and percentage yield.
WORKED-EXAMPLE MATERIAL: Ar from a spectrum; pV = nRT to find Mr; limiting reagent + % yield; titration.
COMMON MISTAKES: SI units in pV=nRT; cm^3 vs dm^3; not balancing before ratios; wrong limiting reagent.
REACTIONS: empty. GRAPHS: empty.`,

        "Atomic structure": `CIE A LEVEL CHEMISTRY (9701) AS — ATOMIC STRUCTURE.
- Protons/neutrons/electrons (relative mass and charge); nuclide notation; isotopes. Behaviour of p, n, e in an electric field (deflection by charge/mass).
- Electronic configuration: shells, subshells s/p/d and orbitals; order of filling (1s 2s 2p 3s 3p 4s 3d 4p); electrons-in-boxes; Cr and Cu anomalies. Shapes of s and p orbitals; relative subshell energies.
- Ionisation energy: define 1st, 2nd, successive IE. Trends across periods 2/3 and down a group (nuclear charge, shielding, distance). Dips (Group 2→13 subshell; Group 15→16 pairing) are evidence for subshells; big jumps in successive IEs evidence for shells.
WORKED-EXAMPLE MATERIAL: deduce group from successive IEs; explain an IE trend/dip; write a config.
COMMON MISTAKES: 4s/3d order; forgetting Cr/Cu; vague IE explanations.
REACTIONS: empty. GRAPHS: successive ionisation energies (log) showing shell jumps.`,

        "Chemical bonding": `CIE A LEVEL CHEMISTRY (9701) AS — CHEMICAL BONDING.
- Ionic bonding: lattice; strength depends on ionic charge and radius. Covalent: dot-and-cross; sigma and pi bonds; multiple bonds; dative (coordinate) bonding.
- Shapes and bond angles by VSEPR for up to 6 electron pairs (BF3 trigonal planar 120; CO2 linear 180; CH4 tetrahedral 109.5; NH3 pyramidal 107; H2O bent 104.5; PCl5 trigonal bipyramidal; SF6 octahedral 90). Lone pairs repel more than bonding pairs.
- Electronegativity, bond polarity, molecular polarity (depends on shape — symmetrical dipoles cancel).
- Intermolecular forces: id-id (London), permanent dipole-dipole, hydrogen bonding (N/O/F-H); effect on mp/bp/solubility; anomalies of water/ice.
- Metallic bonding (delocalised electrons → conductivity, mp, malleability); giant covalent vs simple molecular vs ionic lattice properties.
WORKED-EXAMPLE MATERIAL: predict a shape/angle; rank bp by intermolecular forces; explain ice density.
COMMON MISTAKES: ignoring lone-pair effect on angle; calling all polar bonds polar molecules; missing H-bond criteria.
REACTIONS: empty. GRAPHS: empty.`,

        "States of matter": `CIE A LEVEL CHEMISTRY (9701) AS — STATES OF MATTER.
- Ideal gas behaviour and assumptions; deviations from ideality (high pressure, low temperature); when real gases approximate ideal (low p, high T).
- pV = nRT in calculations, including determining Mr of a volatile substance.
- Lattice structures and their properties: ionic (NaCl), simple molecular (I2, ice), giant molecular (diamond, graphite, SiO2), metallic (Cu). Explain physical properties from structure and bonding.
WORKED-EXAMPLE MATERIAL: pV=nRT to find Mr; explain conductivity/mp of named lattices; why graphite conducts but diamond doesn't.
COMMON MISTAKES: SI-unit errors; confusing simple molecular bp (weak IMF) with breaking covalent bonds.
REACTIONS: empty. GRAPHS: empty.`,

        "Chemical energetics": `CIE A LEVEL CHEMISTRY (9701) AS — CHEMICAL ENERGETICS.
- Enthalpy change ΔH; standard conditions (298 K, 100 kPa, 1 mol dm^-3); exothermic (ΔH < 0) / endothermic (ΔH > 0).
- Standard enthalpies: formation, combustion, neutralisation, atomisation, hydration, solution (know the definitions precisely).
- Calculate ΔH: from q = mcΔT (calorimetry); from Hess cycles (formation and combustion routes); from mean bond enthalpies (ΔH = bonds broken − bonds made).
- Construct energy/enthalpy level diagrams and Hess cycles.
WORKED-EXAMPLE MATERIAL: q = mcΔT for a reaction; a Hess-cycle ΔHf; bond-enthalpy ΔH.
COMMON MISTAKES: sign errors; using mass of solute not solution in mcΔT; bond enthalpies only exact for gases.
REACTIONS: empty. GRAPHS: enthalpy/reaction profile diagrams.`,

        "Electrochemistry": `CIE A LEVEL CHEMISTRY (9701) AS — ELECTROCHEMISTRY (REDOX).
- Redox as electron transfer and oxidation number (ON). Rules for assigning ON (elements 0; group ions; O usually −2, H +1; sum = charge).
- Construct ionic half-equations and combine into overall redox equations (balance electrons).
- Use of oxidation numbers in nomenclature (Roman numerals, e.g. iron(III), manganate(VII)).
WORKED-EXAMPLE MATERIAL: assign ON in a compound/ion; balance a redox equation from half-equations; name by ON.
COMMON MISTAKES: ON sign/peroxide/hydride exceptions; not balancing electrons; oxidation = loss of electrons.
REACTIONS: redox half-equations and combined equations. GRAPHS: empty.`,

        "Equilibria": `CIE A LEVEL CHEMISTRY (9701) AS — EQUILIBRIA.
- Dynamic equilibrium in a closed system; Le Chatelier's principle for changes in temperature, pressure and concentration; effect (and non-effect) of a catalyst on position. Industrial applications: Haber and Contact processes as compromises.
- Kc: write the expression; calculate Kc (with units) from equilibrium concentrations; deduce the effect of changes on Kc (only temperature changes Kc).
- Brønsted–Lowry acids and bases (proton donor/acceptor); conjugate acid–base pairs; strong vs weak acids/bases.
WORKED-EXAMPLE MATERIAL: write/calculate Kc with units; predict a Le Chatelier shift; identify conjugate pairs.
COMMON MISTAKES: equilibrium = equal amounts (it's constant); thinking a catalyst shifts position; only T changes Kc.
REACTIONS: N2 + 3H2 ⇌ 2NH3; 2SO2 + O2 ⇌ 2SO3. GRAPHS: empty.`,

        "Reaction kinetics (AS)": `CIE A LEVEL CHEMISTRY (9701) AS — REACTION KINETICS.
- Collision theory: effective collisions need energy ≥ activation energy Ea and correct orientation. Rate factors: concentration/pressure, temperature, surface area, catalyst.
- Maxwell–Boltzmann distribution of molecular energies: explain the effect of temperature (curve shifts/flattens, more molecules ≥ Ea) and a catalyst (lowers Ea via an alternative pathway, so more molecules exceed it). Sketch and annotate the curve.
- Catalysts (homogeneous/heterogeneous): provide an alternative route of lower Ea; not consumed; enzymes as biological catalysts.
WORKED-EXAMPLE MATERIAL: annotate a Boltzmann curve for ΔT or a catalyst; explain a rate change by collision theory.
COMMON MISTAKES: shifting the whole Boltzmann curve up (area is fixed = number of molecules); catalyst lowering Ea of reactants rather than providing a new path.
REACTIONS: empty. GRAPHS: Maxwell–Boltzmann distribution (Ea and catalyst Ea marked).`,

        "Periodic Table — chemical periodicity": `CIE A LEVEL CHEMISTRY (9701) AS — CHEMICAL PERIODICITY (Period 3).
- Periodic trends across Period 3: atomic radius (decreases), first IE (general increase with dips), melting point (rises to Si then falls), electrical conductivity.
- Reactions of Period 3 elements with oxygen and chlorine; formulae and structures of the oxides and chlorides; variation in oxide acid/base character (basic Na2O/MgO → amphoteric Al2O3 → acidic SiO2, P4O10, SO3).
- Reactions of the oxides and chlorides with water (and resulting pH); explain trends from structure and bonding.
WORKED-EXAMPLE MATERIAL: explain the mp trend across Period 3; predict the pH of an oxide/chloride in water; write reaction with water.
COMMON MISTAKES: explaining mp without referencing structure (giant vs simple molecular); oxide acid/base trend.
REACTIONS: Na2O/MgO + water; Al2O3 amphoteric; SiCl4/AlCl3 hydrolysis; SO3 + H2O → H2SO4. GRAPHS: trends across Period 3.`,

        "Group 2 chemistry": `CIE A LEVEL CHEMISTRY (9701) AS — GROUP 2.
- Reactions of Group 2 elements (Mg→Ba) with oxygen, water and dilute acids; reactivity increases down the group (easier to lose 2 electrons).
- Trends down the group: thermal stability of nitrates and carbonates increases; solubility of hydroxides increases; solubility of sulfates decreases.
- Bases: oxides and hydroxides as bases (e.g. neutralising acids); uses (e.g. Ca(OH)2 in agriculture, Mg(OH)2 as an antacid).
WORKED-EXAMPLE MATERIAL: write reactions with water/acid; explain the thermal-stability trend (cation polarising power); predict solubility.
COMMON MISTAKES: reversing solubility trends (hydroxides up, sulfates down); thermal-stability reasoning.
REACTIONS: M + 2H2O → M(OH)2 + H2; MCO3 → MO + CO2 (thermal decomposition). GRAPHS: empty.`,

        "Group 17 chemistry": `CIE A LEVEL CHEMISTRY (9701) AS — GROUP 17 (HALOGENS).
- Trends: volatility decreases down the group; colour darkens; oxidising power decreases (Cl2 > Br2 > I2) — shown by displacement reactions with halides.
- Reaction with hydrogen; relative reactivity. Disproportionation of chlorine with cold NaOH (bleach) and in water (and the chlorination of water — benefits vs risks).
- Halide ions as reducing agents (increasing down the group): reactions with concentrated sulfuric acid (Cl- → HCl; Br- → SO2 + Br2; I- → H2S + I2). Test for halides: AgNO3 (white/cream/yellow ppt) and solubility in ammonia.
WORKED-EXAMPLE MATERIAL: predict a displacement; explain the conc-H2SO4 trend; identify a halide by ppt + ammonia.
COMMON MISTAKES: confusing oxidising power (down ↓) with reducing power of halides (down ↑); disproportionation ON changes.
REACTIONS: Cl2 + 2KBr → 2KCl + Br2; Cl2 + 2NaOH → NaCl + NaClO + H2O; halide + conc H2SO4. GRAPHS: empty.`,

        "Nitrogen and sulfur": `CIE A LEVEL CHEMISTRY (9701) AS — NITROGEN & SULFUR.
- Nitrogen: explain its lack of reactivity (strong N≡N triple bond). Ammonia and ammonium salts; NH3 as a base; the displacement of NH3 from its salts by a base. Environmental: NOx formation in engines and its role in forming acid rain and in catalytic-converter removal; nitrate fertilisers and eutrophication.
- Sulfur: formation of SO2 (combustion of S-containing fuels) and its role in acid rain; SO2/H2SO4 environmental impact and uses.
WORKED-EXAMPLE MATERIAL: explain N2's inertness; write NH3 + acid; explain how NOx forms and is removed; acid-rain chemistry.
COMMON MISTAKES: forgetting the triple-bond reason; muddling NOx (acid rain) with the greenhouse effect; SO2 source.
REACTIONS: NH3 + HCl → NH4Cl; N2 + O2 → 2NO (high T); 2SO2 + O2 → 2SO3. GRAPHS: empty.`,

        "Introduction to organic chemistry": `CIE A LEVEL CHEMISTRY (9701) AS — INTRODUCTION TO ORGANIC CHEMISTRY.
- Functional groups and homologous series; general/structural/displayed/skeletal formulae; IUPAC nomenclature (longest chain, suffix, lowest locants, substituents).
- Isomerism: structural (chain, position, functional group) and stereoisomerism — cis–trans (E/Z) from restricted rotation about C=C, and optical isomerism (chiral centre, non-superimposable mirror images, rotation of plane-polarised light, racemic mixtures).
- Reaction types and mechanisms vocabulary: homolytic/heterolytic fission; free radical, electrophile, nucleophile; addition, substitution, elimination; bond fission and curly arrows.
WORKED-EXAMPLE MATERIAL: name a molecule; identify isomer type; identify a chiral centre; classify a reagent/mechanism.
COMMON MISTAKES: locant/naming errors; missing a chiral centre; confusing E/Z; electrophile vs nucleophile.
REACTIONS: empty. GRAPHS: empty.`,

        "Hydrocarbons (alkanes & alkenes)": `CIE A LEVEL CHEMISTRY (9701) AS — HYDROCARBONS.
- Alkanes (sigma bonds, free rotation): combustion (complete/incomplete); free-radical substitution with halogens (UV) — initiation, propagation, termination steps; environmental issues (CO, NOx, CO2, unburnt hydrocarbons, soot) and catalytic converters.
- Alkenes (C=C, sigma + pi): electrophilic addition of H2 (Ni), X2, HX, H2O (steam/H3PO4) and cold dilute KMnO4 (diol); mechanism with curly arrows and carbocation stability (Markovnikov). Test: bromine decolourised. Addition polymerisation (poly(alkenes)).
WORKED-EXAMPLE MATERIAL: free-radical substitution mechanism; electrophilic addition mechanism + major product (Markovnikov); polymer repeat unit.
COMMON MISTAKES: missing mechanism steps/arrows; wrong major product (carbocation stability); leaving C=C in a polymer repeat unit.
REACTIONS: CH4 + Cl2 →(UV) CH3Cl + HCl; CH2=CH2 + Br2 → CH2BrCH2Br; alkene + KMnO4 → diol. GRAPHS: empty.`,

        "Halogenoalkanes": `CIE A LEVEL CHEMISTRY (9701) AS — HALOGENOALKANES.
- Nucleophilic substitution: with OH- (→ alcohol), CN- (→ nitrile, adds a carbon), NH3 (→ amine). Mechanisms SN1 (tertiary, carbocation) and SN2 (primary, one step); rate order of C–X bond (C–I fastest, weakest bond).
- Elimination with hot ethanolic KOH (→ alkene). Distinguish substitution (warm aqueous) vs elimination (hot ethanolic) conditions.
- Uses and environmental concerns of organohalogens (CFCs and ozone depletion — radical mechanism).
WORKED-EXAMPLE MATERIAL: SN1/SN2 mechanism; predict substitution vs elimination from conditions; explain C–X reactivity order.
COMMON MISTAKES: wrong conditions for substitution vs elimination; SN1 vs SN2 by class; forgetting CN- adds a carbon.
REACTIONS: RBr + OH- → ROH + Br-; RBr + CN- → RCN + Br-; RBr + KOH(ethanolic) → alkene. GRAPHS: empty.`,

        "Hydroxy compounds (alcohols)": `CIE A LEVEL CHEMISTRY (9701) AS — ALCOHOLS.
- Formation: hydration of alkenes; substitution of halogenoalkanes; fermentation. Combustion. Reaction with Na (→ alkoxide + H2).
- Oxidation (acidified K2Cr2O7, orange→green): primary → aldehyde (distil off) → carboxylic acid (reflux); secondary → ketone; tertiary not oxidised. Esterification with carboxylic acids. Dehydration to alkenes (Al2O3 or conc acid). Reaction with PCl5/SOCl2/HX (→ halogenoalkane).
- Tri-iodomethane (iodoform) test for CH3CH(OH)– groups.
WORKED-EXAMPLE MATERIAL: predict oxidation products with conditions; classify 1/2/3 alcohol; iodoform test outcome.
COMMON MISTAKES: not distilling vs refluxing for aldehyde vs acid; oxidising a tertiary alcohol; missing the colour change.
REACTIONS: alcohol + [O] (K2Cr2O7/H+); ROH + Na; esterification. GRAPHS: empty.`,

        "Carbonyl compounds — aldehydes & ketones": `CIE A LEVEL CHEMISTRY (9701) AS — CARBONYL COMPOUNDS.
- Aldehydes (–CHO) and ketones (C=O in chain). Reduction (NaBH4) to alcohols. Nucleophilic addition of HCN (with KCN, forms hydroxynitrile, +1 carbon; note racemic mixture from a planar carbonyl).
- Distinguishing tests: Tollens' reagent (silver mirror) and Fehling's/Benedict's (brick-red ppt) oxidise ALDEHYDES only (not ketones). 2,4-DNPH (Brady's reagent) gives an orange ppt for any carbonyl (and its mp identifies the compound). Tri-iodomethane test for CH3CO– (methyl ketones/ethanal).
WORKED-EXAMPLE MATERIAL: nucleophilic addition of HCN mechanism; choose a test to tell an aldehyde from a ketone; iodoform.
COMMON MISTAKES: thinking Tollens'/Fehling's work on ketones; forgetting HCN adds a carbon and gives a racemate.
REACTIONS: RCHO + [O] (Tollens'/Fehling's) → RCOOH; carbonyl + HCN → hydroxynitrile; + 2,4-DNPH → orange ppt. GRAPHS: empty.`,

        "Carboxylic acids and derivatives": `CIE A LEVEL CHEMISTRY (9701) AS — CARBOXYLIC ACIDS & DERIVATIVES.
- Carboxylic acids (–COOH): weak acids; reactions with metals, carbonates, bases (salts), and alcohols (esterification, conc H2SO4 catalyst). Formation by oxidation of primary alcohols/aldehydes or hydrolysis of nitriles/esters.
- Esters: formation and hydrolysis (acid or alkaline/saponification); uses (solvents, flavourings, plasticisers, fats/oils as triesters of glycerol).
- (AS scope) acyl chlorides where in the syllabus: high reactivity with water/alcohols/amines.
WORKED-EXAMPLE MATERIAL: acid + carbonate; esterification and hydrolysis; predict products of saponification.
COMMON MISTAKES: weak vs strong acid; acid vs alkaline hydrolysis products; forgetting the catalyst for esterification.
REACTIONS: RCOOH + Na2CO3; RCOOH + R'OH ⇌ ester + H2O; ester + NaOH → carboxylate + alcohol. GRAPHS: empty.`,

        "Nitrogen compounds (AS scope)": `CIE A LEVEL CHEMISTRY (9701) AS — NITROGEN COMPOUNDS (AS scope).
- Amines as Brønsted–Lowry bases (lone pair on N accepts H+); formation from halogenoalkanes (with excess NH3) and by reduction of nitriles. Basicity and salt formation with acids.
- Nitriles: formation from halogenoalkanes (+CN-) and their reduction (to amines) and hydrolysis (to carboxylic acids).
- Amino acids: zwitterions; behaviour as acids and bases (amphoteric); effect of pH; peptide (amide) bond formation.
WORKED-EXAMPLE MATERIAL: amine as a base/salt formation; nitrile hydrolysis vs reduction; amino-acid behaviour with pH.
COMMON MISTAKES: forgetting amines are bases (lone pair); nitrile reduction (amine) vs hydrolysis (acid); zwitterion idea.
REACTIONS: RNH2 + HCl → RNH3+Cl-; RCN + 2H2 → RCH2NH2; RCN + 2H2O → RCOOH + NH3. GRAPHS: empty.`,

        "Polymerisation": `CIE A LEVEL CHEMISTRY (9701) AS — POLYMERISATION.
- Addition polymerisation of alkenes: deduce the repeat unit and the monomer; poly(ethene), poly(propene), PVC, PTFE. No by-product.
- Condensation polymerisation: polyesters (e.g. Terylene/PET, from a diol + dicarboxylic acid) and polyamides (e.g. nylon, from a diamine + dicarboxylic acid/acyl chloride) — lose water/HCl each link. Draw repeat units and identify monomers from a polymer (and vice versa).
- Properties and disposal/environmental impact (biodegradability, recycling).
WORKED-EXAMPLE MATERIAL: draw an addition repeat unit; draw a polyester/polyamide repeat unit and deduce monomers; identify the link.
COMMON MISTAKES: leaving C=C in addition repeat units; confusing addition (no by-product) with condensation; identifying the wrong linkage.
REACTIONS: n CH2=CH2 → poly(ethene); diol + diacid → polyester + water. GRAPHS: empty.`,

        "Organic synthesis & analysis (AS)": `CIE A LEVEL CHEMISTRY (9701) AS — ORGANIC SYNTHESIS & ANALYSIS.
- Synthesis: plan two-step routes between functional groups using AS reactions (e.g. alkene → halogenoalkane → nitrile → amine/acid); choose reagents/conditions; consider yield.
- Characteristic tests for functional groups: alkene (bromine decolourised), halogenoalkane (warm with NaOH then HNO3 + AgNO3 → ppt), alcohol/carbonyl/acid tests (oxidation, 2,4-DNPH, Tollens', NaHCO3 fizz for acids), iodoform test.
- Analysis: interpret data to deduce a structure; (where in scope) use of mass spectra and infrared absorptions to identify functional groups.
WORKED-EXAMPLE MATERIAL: plan a multi-step synthesis; choose a test to distinguish two compounds; deduce a structure from test results.
COMMON MISTAKES: vague conditions; choosing a reagent that affects another group; mis-assigning a test result.
REACTIONS: functional-group tests as above. GRAPHS: empty.`,
      },
      unit4: {
        "Chemical energetics II": `CIE A LEVEL CHEMISTRY (9701) A2 — CHEMICAL ENERGETICS II.
- Lattice energy (defined, always exothermic); Born–Haber cycles to calculate lattice energy or an unknown enthalpy (using ΔHf, atomisation, IE, electron affinity).
- Factors affecting lattice energy and hydration enthalpy: ionic charge and ionic radius (smaller/more charged → more exothermic). Enthalpy of solution = −lattice energy + Σ hydration enthalpies; explain solubility trends.
- Entropy ΔS: meaning (disorder/dispersal); predict the sign of ΔS for a change. Gibbs free energy ΔG = ΔH − TΔS; feasibility when ΔG < 0; effect of temperature.
WORKED-EXAMPLE MATERIAL: Born–Haber lattice energy; ΔH(solution) from cycle; ΔG feasibility and the temperature at which a reaction becomes feasible (T = ΔH/ΔS).
COMMON MISTAKES: sign errors in Born–Haber (IE/EA directions); forgetting T in kelvin and ΔS in J (÷1000) for ΔG.
REACTIONS: empty. GRAPHS: empty.`,

        "Electrochemistry II": `CIE A LEVEL CHEMISTRY (9701) A2 — ELECTROCHEMISTRY II.
- Standard electrode (redox) potentials E°; standard hydrogen electrode; measuring E° of half-cells; cell diagrams/notation. Standard cell e.m.f. = E°(positive/cathode) − E°(negative/anode).
- Use E° to predict the feasibility/direction of redox reactions and the species formed; limitations (kinetics, non-standard conditions). Effect of concentration on electrode potential (qualitative, Nernst idea).
- Electrolysis quantitative: Faraday constant; F = Le; calculate amount/mass/volume deposited from charge (Q = It, n(e) = Q/F).
WORKED-EXAMPLE MATERIAL: calculate cell e.m.f.; predict whether a redox reaction is feasible; mass deposited in electrolysis.
COMMON MISTAKES: wrong sign/order in e.m.f.; ignoring kinetic/concentration limitations; Q = It and n = Q/F slips.
REACTIONS: redox/half-cell equations. GRAPHS: empty.`,

        "Equilibria II — Kp, ionic, buffers": `CIE A LEVEL CHEMISTRY (9701) A2 — EQUILIBRIA II.
- Kp for gaseous equilibria: partial pressures and mole fractions; write/calculate Kp (with units); effect of conditions (only T changes Kp/Kc).
- Acid–base equilibria: Ka, pKa, Kw, pH and pOH; pH of strong and weak acids/bases; degree of dissociation. Ka = [H+][A-]/[HA]; pH = −log[H+].
- Buffers: how an acidic buffer (weak acid + its salt) resists pH change; calculate buffer pH (Henderson–Hasselbalch: pH = pKa + log([salt]/[acid])); buffers in blood. Indicators and titration curves (strong/weak combinations); choosing an indicator.
- Solubility product Ksp and the common-ion effect.
WORKED-EXAMPLE MATERIAL: pH of a weak acid from Ka; buffer pH; sketch a titration curve and pick an indicator; Ksp calculation.
COMMON MISTAKES: using strong-acid pH for weak acids; forgetting units of Kp/Ka; buffer ratio inverted.
REACTIONS: empty. GRAPHS: pH titration curves (strong/weak acid–base).`,

        "Reaction kinetics II": `CIE A LEVEL CHEMISTRY (9701) A2 — REACTION KINETICS II.
- Rate equation: rate = k[A]^m[B]^n; orders of reaction and overall order; rate constant k and its units (derive). Determine orders from initial-rates data and from concentration–time graphs (half-life of a first-order reaction is constant).
- Use rate-determining step to deduce a possible mechanism (and vice versa); the order with respect to each reactant reflects its involvement up to the RDS.
- Effect of temperature on k (Arrhenius idea, qualitative); homogeneous and heterogeneous catalysis with examples.
WORKED-EXAMPLE MATERIAL: deduce orders + k (with units) from initial rates; identify first order from a constant half-life; propose a mechanism consistent with the rate equation.
COMMON MISTAKES: wrong units for k; reading order from a graph incorrectly; mechanism inconsistent with the rate equation.
REACTIONS: empty. GRAPHS: concentration–time (first-order constant half-life) and rate–concentration graphs.`,

        "Group 2 and transition elements (A2)": `CIE A LEVEL CHEMISTRY (9701) A2 — TRANSITION ELEMENTS.
- Transition element = d-block element forming at least one ion with a partially filled d subshell. Characteristic properties: variable oxidation states, coloured ions, catalytic activity, complex formation.
- Complexes: ligands (mono/bi/polydentate), coordination number, shapes (octahedral, tetrahedral, square planar, linear); ligand exchange and stability; the colour origin (d–d transitions, splitting of d orbitals by ligands; complementary colour absorbed).
- Reactions: with NaOH and NH3 (precipitates, some dissolving in excess); redox of transition-metal ions (e.g. MnO4- and Cr2O7^2- as oxidants — colour changes); use in catalysis.
WORKED-EXAMPLE MATERIAL: explain colour by d-orbital splitting; predict ligand-exchange/precipitate reactions; a manganate(VII) redox titration.
COMMON MISTAKES: defining transition metal by the atom not the ion; forgetting Sc/Zn excluded; complex shape/coordination errors.
REACTIONS: [Cu(H2O)6]^2+ + ligand exchanges; MnO4- redox; metal-ion + NaOH/NH3 precipitates. GRAPHS: empty. REFERENCE TABLES: common ion colours and ligand-reaction observations.`,

        "Hydrocarbons & arenes (A2)": `CIE A LEVEL CHEMISTRY (9701) A2 — ARENES.
- Benzene structure: delocalised pi system (evidence: bond lengths equal, enthalpy of hydrogenation, resistance to addition); compare with the Kekulé model.
- Electrophilic substitution mechanisms: nitration (conc HNO3/H2SO4, NO2+), halogenation (Cl2/Br2 with AlCl3 halogen carrier), Friedel–Crafts alkylation/acylation. Why arenes undergo substitution not addition (preserve delocalisation).
- Side-chain vs ring reactions of methylbenzene; directing effects (activating/2,4 vs deactivating/3) qualitatively; phenol (greater reactivity to electrophiles; reaction with bromine water and with NaOH as a weak acid).
WORKED-EXAMPLE MATERIAL: nitration mechanism; explain benzene's stability/lack of addition; phenol vs benzene reactivity.
COMMON MISTAKES: drawing addition for benzene; missing the halogen carrier/electrophile generation; phenol acidity reasoning.
REACTIONS: C6H6 + HNO3 →(H2SO4) C6H5NO2 + H2O; Friedel–Crafts; phenol + Br2 → 2,4,6-tribromophenol. GRAPHS: empty.`,

        "Organic nitrogen compounds (A2)": `CIE A LEVEL CHEMISTRY (9701) A2 — ORGANIC NITROGEN COMPOUNDS.
- Amines: basicity comparison (aliphatic vs aromatic vs ammonia — electron density on N); preparation (from halogenoalkanes, reduction of nitriles, reduction of nitrobenzene → phenylamine). Reactions with acids and acyl chlorides.
- Diazonium salts: formation from phenylamine (NaNO2/HCl, <10°C) and coupling reactions to form azo dyes.
- Amides: formation and hydrolysis. Amino acids and proteins: zwitterions, isoelectric point, peptide bonds; electrophoresis. Condensation polymers revisited (polyamides/polyesters) and hydrolysis.
WORKED-EXAMPLE MATERIAL: rank amine basicity with reasons; phenylamine → diazonium → azo dye; amide hydrolysis products.
COMMON MISTAKES: basicity order reasoning (aromatic weaker); diazonium temperature condition; peptide vs ester link.
REACTIONS: nitrobenzene → phenylamine (Sn/HCl); diazotisation; azo coupling. GRAPHS: empty.`,

        "Polymerisation II & analysis": `CIE A LEVEL CHEMISTRY (9701) A2 — POLYMERS & ANALYSIS.
- Condensation polymers (polyesters, polyamides): deduce repeat units and monomers; hydrolysis (acid/base). Degradable vs non-degradable polymers and environmental considerations.
- Analytical techniques: mass spectrometry (molecular ion Mr, M+1/M+2 isotope patterns e.g. Cl/Br, fragmentation). Infrared spectroscopy (identify O–H, C=O, C–H, N–H from characteristic absorptions; fingerprint region).
- Proton (1H) NMR and carbon-13 NMR: number of environments, chemical shift, integration (relative number of H), and splitting (n+1 rule); use of TMS standard and D2O exchange for OH/NH. Combine techniques to deduce a structure.
WORKED-EXAMPLE MATERIAL: deduce a structure from combined MS/IR/NMR; interpret NMR splitting and integration; identify a group from an IR absorption.
COMMON MISTAKES: miscounting NMR environments; n+1 splitting errors; forgetting D2O exchange; M+2 for Cl/Br.
REACTIONS: empty. GRAPHS: empty. REFERENCE TABLES: characteristic IR absorptions; typical 1H NMR chemical shifts.`,
      },
    },

    biology: {
      unit1: {
        "Cell structure": `CIE A LEVEL BIOLOGY (9700) AS — CELL STRUCTURE.
- Eukaryotic cell ultrastructure and organelle functions: nucleus/nucleolus, rough and smooth ER, ribosomes (80S), Golgi apparatus, mitochondria, lysosomes, chloroplasts, cell surface membrane, centrioles, microvilli; plant extras (cellulose cell wall, vacuole/tonoplast, plasmodesmata).
- The protein-secretion pathway (nucleus → rER → Golgi → vesicle → membrane). Light microscope vs electron microscope (resolution and magnification; TEM vs SEM). Calculate magnification and actual size (use units; magnification = image/actual); use scale bars.
- Prokaryotic vs eukaryotic cells; viruses (non-cellular: nucleic acid + capsid).
WORKED-EXAMPLE MATERIAL: magnification/actual-size calculation; trace a secreted protein through organelles; compare resolution of LM vs EM.
COMMON MISTAKES: confusing magnification and resolution; unit conversion (µm/nm); 70S vs 80S ribosomes.
REACTIONS: empty. GRAPHS: empty.`,

        "Biological molecules": `CIE A LEVEL BIOLOGY (9700) AS — BIOLOGICAL MOLECULES.
- Carbohydrates: monosaccharides (glucose α/β), disaccharides (maltose, sucrose, lactose; condensation/glycosidic bonds), polysaccharides (starch, glycogen, cellulose — structure related to function).
- Lipids: triglycerides (ester bonds, energy storage) and phospholipids (bilayer). Proteins: amino acids, peptide bonds; primary/secondary (α-helix, β-pleated)/tertiary/quaternary structure; bonds stabilising structure (H-bonds, ionic, disulfide, hydrophobic); globular (haemoglobin) vs fibrous (collagen).
- Water properties (solvent, high specific heat, cohesion). Biochemical tests: Benedict's (reducing/non-reducing sugars), iodine (starch), biuret (protein), emulsion (lipid); semi-quantitative use.
WORKED-EXAMPLE MATERIAL: relate cellulose/collagen structure to function; describe a food test; explain protein bonding levels.
COMMON MISTAKES: α vs β glucose consequences; muddling bond types in proteins; non-reducing sugar test step.
REACTIONS: empty. GRAPHS: empty.`,

        "Enzymes": `CIE A LEVEL BIOLOGY (9700) AS — ENZYMES.
- Enzymes as biological catalysts lowering activation energy; lock-and-key and induced-fit models; intracellular vs extracellular enzymes.
- Factors affecting rate: temperature, pH, enzyme and substrate concentration; explain using collisions and active-site shape; Vmax and the effect of substrate concentration.
- Inhibition: competitive (active site, overcome by more substrate) vs non-competitive (allosteric); immobilised enzymes and their advantages.
WORKED-EXAMPLE MATERIAL: interpret rate vs temperature/pH/[substrate]; distinguish competitive vs non-competitive from a graph; explain denaturation.
COMMON MISTAKES: enzymes "killed" (denatured); confusing the two inhibition graphs; forgetting Vmax plateau reasoning.
REACTIONS: empty. GRAPHS: rate vs temperature/pH; rate vs [substrate] (Vmax); competitive vs non-competitive inhibition curves.`,

        "Cell membranes & transport": `CIE A LEVEL BIOLOGY (9700) AS — MEMBRANES & TRANSPORT.
- Fluid-mosaic model: phospholipid bilayer, proteins (channel/carrier), cholesterol, glycoproteins/glycolipids; roles in recognition and signalling. Effect of temperature/solvents on membrane permeability.
- Passive transport: simple diffusion, facilitated diffusion (channel/carrier proteins), osmosis (water potential ψ; ψ = 0 for pure water; solute lowers ψ). Active transport (carrier proteins + ATP, against the gradient); bulk transport (endocytosis/exocytosis).
- Water potential effects on plant and animal cells (turgid/flaccid/plasmolysed; haemolysis/crenation).
WORKED-EXAMPLE MATERIAL: predict water movement from water potentials; distinguish diffusion/facilitated/active transport; membrane permeability experiment.
COMMON MISTAKES: water potential signs (more negative = lower); facilitated vs active (ATP) transport; osmosis defined by water potential.
REACTIONS: empty. GRAPHS: empty.`,

        "The mitotic cell cycle": `CIE A LEVEL BIOLOGY (9700) AS — THE MITOTIC CELL CYCLE.
- The cell cycle: interphase (G1, S — DNA replication, G2) and mitosis (PMAT) + cytokinesis. Chromosome behaviour in each stage; role of the spindle and centromeres/centrioles.
- Significance of mitosis: genetically identical cells for growth, repair, replacement and asexual reproduction. Role of telomeres and stem cells; uncontrolled mitosis → tumours/cancer (mutations in proto-oncogenes/tumour suppressor genes).
WORKED-EXAMPLE MATERIAL: identify a stage of mitosis from a description/diagram; explain why daughter cells are identical; calculate mitotic index.
COMMON MISTAKES: ordering the stages; confusing chromatids/chromosomes; mitosis vs meiosis significance.
REACTIONS: empty. GRAPHS: empty.`,

        "Nucleic acids & protein synthesis": `CIE A LEVEL BIOLOGY (9700) AS — NUCLEIC ACIDS & PROTEIN SYNTHESIS.
- DNA and RNA structure (nucleotides, complementary base pairing A-T/A-U, C-G, antiparallel strands, double helix). Semi-conservative DNA replication (helicase, DNA polymerase); evidence.
- The genetic code (triplet, non-overlapping, degenerate, universal). Transcription (mRNA from a DNA template) and translation (ribosomes, tRNA, codon–anticodon, polypeptide assembly).
- Gene mutation (substitution, insertion, deletion; frameshift) and effects on the protein (e.g. sickle-cell).
WORKED-EXAMPLE MATERIAL: deduce an amino-acid sequence from a DNA sequence; explain semi-conservative replication; effect of a named mutation.
COMMON MISTAKES: base-pairing/antiparallel errors; transcription vs translation locations; degenerate code consequences.
REACTIONS: empty. GRAPHS: empty.`,

        "Transport in plants": `CIE A LEVEL BIOLOGY (9700) AS — TRANSPORT IN PLANTS.
- Xylem (dead, lignified vessels) carries water and mineral ions; phloem (living sieve tubes + companion cells) translocates assimilates (sucrose). Tissue distribution in root, stem and leaf.
- Water uptake (root hair cells) and movement (apoplast/symplast pathways, Casparian strip); transpiration and the cohesion–tension theory (transpiration pull, cohesion via H-bonds, adhesion). Factors affecting transpiration (light, temperature, humidity, air movement); xerophyte/hydrophyte adaptations.
- Translocation: source-to-sink, mass flow (loading sucrose by active transport at the source).
WORKED-EXAMPLE MATERIAL: explain cohesion–tension; interpret a potometer experiment; relate xerophyte features to reducing water loss.
COMMON MISTAKES: xylem vs phloem (dead/living, direction); apoplast vs symplast; transpiration factors.
REACTIONS: empty. GRAPHS: empty.`,

        "Transport in mammals": `CIE A LEVEL BIOLOGY (9700) AS — TRANSPORT IN MAMMALS.
- The circulatory system (double circulation); structure–function of arteries, veins, capillaries. Heart structure; the cardiac cycle (pressure/volume changes, valves) and its control (SAN, AVN, Purkyne fibres); interpret ECGs/pressure graphs.
- Blood: red cells/haemoglobin; oxygen dissociation curve (sigmoid; cooperative binding); the Bohr shift (effect of CO2/pH); fetal haemoglobin. Transport of CO2 (mostly as hydrogencarbonate; chloride shift; carbonic anhydrase). Tissue fluid formation and return.
WORKED-EXAMPLE MATERIAL: interpret the oxygen dissociation curve and Bohr shift; explain CO2 transport; describe the cardiac cycle from a pressure graph.
COMMON MISTAKES: reading the dissociation curve/Bohr direction; valve timing in the cardiac cycle; CO2 transport detail.
REACTIONS: CO2 + H2O ⇌ H2CO3 ⇌ H+ + HCO3-. GRAPHS: oxygen dissociation curve (and Bohr shift); cardiac-cycle pressure graphs.`,

        "Gas exchange": `CIE A LEVEL BIOLOGY (9700) AS — GAS EXCHANGE.
- Human gas-exchange system: trachea, bronchi, bronchioles, alveoli; structure–function of cartilage, smooth muscle, elastic fibres, goblet cells and ciliated epithelium.
- Alveoli adapted for efficient gas exchange (large surface area, thin walls/short diffusion distance, good blood supply maintaining the gradient). Distribution of tissues; effects of smoking on the gas-exchange and cardiovascular systems (where in scope).
WORKED-EXAMPLE MATERIAL: relate alveolar features to Fick's law (surface area × difference / distance); identify tissues in a section.
COMMON MISTAKES: confusing the tissue layers; gas-exchange vs ventilation; alveolar adaptation reasoning.
REACTIONS: empty. GRAPHS: empty.`,

        "Infectious disease": `CIE A LEVEL BIOLOGY (9700) AS — INFECTIOUS DISEASE.
- Named diseases and their pathogens/transmission: cholera (Vibrio cholerae, water), malaria (Plasmodium, Anopheles mosquito vector), TB (Mycobacterium, droplets), HIV/AIDS (HIV virus, body fluids). Global patterns and control/prevention measures.
- Antibiotics: how they work (bacteria only, not viruses); the development and consequences of antibiotic resistance (e.g. MRSA) and how to reduce it.
WORKED-EXAMPLE MATERIAL: match a disease to pathogen/transmission/control; explain why antibiotics don't treat viral disease; explain resistance.
COMMON MISTAKES: pathogen/vector mix-ups; antibiotics on viruses; vague control measures.
REACTIONS: empty. GRAPHS: empty.`,

        "Immunity": `CIE A LEVEL BIOLOGY (9700) AS — IMMUNITY.
- Phagocytosis (neutrophils/macrophages). The roles of lymphocytes: B-lymphocytes (antibodies/humoral) and T-lymphocytes (helper, killer/cell-mediated). Antigens and antibody structure (specific binding).
- Primary vs secondary immune response; memory cells. Active immunity (natural infection/vaccination) vs passive immunity (antibodies given, e.g. mother→baby). Vaccination and herd immunity; monoclonal antibodies (uses).
WORKED-EXAMPLE MATERIAL: compare primary and secondary responses (graph); distinguish active/passive and natural/artificial immunity; antibody structure/function.
COMMON MISTAKES: B vs T cell roles; active vs passive immunity; reading the antibody-response graph.
REACTIONS: empty. GRAPHS: primary vs secondary antibody response curves.`,
      },
      unit4: {
        "Energy & respiration": `CIE A LEVEL BIOLOGY (9700) A2 — ENERGY & RESPIRATION.
- Need for ATP (universal energy currency; properties). Aerobic respiration stages: glycolysis (cytoplasm), the link reaction and Krebs cycle (mitochondrial matrix), oxidative phosphorylation (electron transport chain on the inner membrane; chemiosmosis; ATP synthase); role of NAD/FAD and oxygen as the final electron acceptor.
- Anaerobic respiration (lactate fermentation in mammals; ethanol fermentation in yeast/plants) and relative ATP yield. Respiratory substrates and RQ (respiratory quotient); use of a respirometer.
WORKED-EXAMPLE MATERIAL: state where each stage occurs and its net products; calculate/interpret RQ; explain chemiosmosis.
COMMON MISTAKES: location of each stage; ATP yields; role of oxygen (final acceptor) and what happens without it.
REACTIONS: glycolysis/Krebs summary; C6H12O6 → 2 lactate (anaerobic). GRAPHS: empty.`,

        "Photosynthesis": `CIE A LEVEL BIOLOGY (9700) A2 — PHOTOSYNTHESIS.
- Light-dependent reactions (thylakoid membranes): photolysis of water, photophosphorylation (cyclic/non-cyclic), production of ATP and reduced NADP, oxygen release. Light-independent reactions/Calvin cycle (stroma): RuBP + CO2 → GP → TP (using ATP and reduced NADP); regeneration of RuBP; role of rubisco.
- Chloroplast structure related to function; photosynthetic pigments and chromatography (Rf). Limiting factors (light intensity, CO2, temperature) and interpreting graphs; effect of changing CO2/light on GP, TP and RuBP levels.
WORKED-EXAMPLE MATERIAL: predict GP/TP/RuBP changes when light or CO2 is altered; interpret a limiting-factor graph; calculate Rf.
COMMON MISTAKES: confusing light-dependent vs Calvin-cycle locations/products; GP/TP/RuBP responses; limiting factors.
REACTIONS: 6CO2 + 6H2O →(light) C6H12O6 + 6O2. GRAPHS: rate vs limiting factors.`,

        "Homeostasis": `CIE A LEVEL BIOLOGY (9700) A2 — HOMEOSTASIS.
- Principles: internal environment, set point, negative feedback, receptors and effectors. Excretion and the kidney: ultrafiltration (glomerulus/Bowman's capsule), selective reabsorption (PCT), the loop of Henle and water reabsorption; osmoregulation by ADH (and the collecting duct).
- Control of blood glucose: insulin and glucagon (islets of Langerhans), liver's role; diabetes (types). Cell signalling (hormone receptors, second messengers). Control of stomata (guard cells, ABA) in plants.
WORKED-EXAMPLE MATERIAL: explain ADH control when dehydrated; describe negative feedback for glucose; kidney function from a nephron diagram.
COMMON MISTAKES: insulin vs glucagon; ADH effect on water; nephron regions/functions.
REACTIONS: empty. GRAPHS: empty.`,

        "Coordination": `CIE A LEVEL BIOLOGY (9700) A2 — COORDINATION.
- Nervous coordination: neurone structure; the resting potential and action potential (Na+/K+ movements, depolarisation/repolarisation, refractory period); all-or-nothing; saltatory conduction (myelin); factors affecting speed. Synapses (neurotransmitter, summation, one-way transmission).
- Hormonal coordination and comparison with nervous. Plant responses: control by auxin (IAA) — phototropism/gravitropism; the role of mineral ions in nervous transmission.
WORKED-EXAMPLE MATERIAL: explain an action potential trace; compare nervous vs hormonal control; explain phototropism via auxin.
COMMON MISTAKES: ion movements in the action potential; refractory-period purpose; synapse one-way reason.
REACTIONS: empty. GRAPHS: action potential (membrane potential vs time).`,

        "Inherited change": `CIE A LEVEL BIOLOGY (9700) A2 — INHERITED CHANGE.
- Meiosis and genetic variation (independent assortment, crossing over). Monohybrid and dihybrid crosses; genotype/phenotype; test crosses; codominance and multiple alleles (ABO); sex linkage; autosomal linkage and epistasis (basic). Use the chi-squared (χ²) test to compare observed and expected ratios.
- Gene control: structural genes and the operon concept (lac operon); the effect of mutations; gene vs chromosome mutations.
WORKED-EXAMPLE MATERIAL: dihybrid/sex-linkage cross with ratios; apply the χ² test and interpret against a critical value; lac operon control.
COMMON MISTAKES: dihybrid ratio (9:3:3:1) errors; χ² (degrees of freedom, conclusion); sex-linkage notation.
REACTIONS: empty. GRAPHS: empty.`,

        "Selection & evolution": `CIE A LEVEL BIOLOGY (9700) A2 — SELECTION & EVOLUTION.
- Variation (genetic/environmental; continuous/discontinuous). Natural selection: types — stabilising, directional and disruptive; examples (antibiotic resistance, peppered moth, sickle-cell/malaria).
- The Hardy–Weinberg principle: p + q = 1 and p² + 2pq + q² = 1; calculate allele/genotype frequencies and conditions for equilibrium. Genetic drift, founder effect, the role of isolation in speciation (allopatric/sympatric); artificial selection.
WORKED-EXAMPLE MATERIAL: Hardy–Weinberg allele/genotype frequency calculation; identify the type of selection from a graph; explain speciation.
COMMON MISTAKES: Hardy–Weinberg algebra (q² is the homozygous recessive); types of selection; conditions for equilibrium.
REACTIONS: empty. GRAPHS: stabilising/directional/disruptive selection distributions.`,

        "Classification, biodiversity & conservation": `CIE A LEVEL BIOLOGY (9700) A2 — CLASSIFICATION, BIODIVERSITY & CONSERVATION.
- Classification: three domains (Bacteria, Archaea, Eukarya) and the kingdoms; binomial naming; dichotomous keys. Biodiversity at habitat, species and genetic levels; sampling (random/systematic, quadrats, transects, mark–release–recapture). Simpson's Index of Diversity (D) calculation and interpretation; Spearman's rank correlation (where in scope).
- Maintaining biodiversity: reasons for conservation; methods (protected areas, seed banks, captive breeding, sustainable resource management); assisted reproduction; the role of zoos and frozen reserves.
WORKED-EXAMPLE MATERIAL: calculate and interpret Simpson's Index; choose a sampling method; evaluate a conservation strategy.
COMMON MISTAKES: Simpson's Index formula/interpretation; random vs systematic sampling; mark–recapture assumptions.
REACTIONS: empty. GRAPHS: empty.`,

        "Genetic technology": `CIE A LEVEL BIOLOGY (9700) A2 — GENETIC TECHNOLOGY.
- Tools and steps of genetic engineering: restriction enzymes (sticky ends), DNA ligase, vectors (plasmids), transformation; obtaining a gene (reverse transcriptase/mRNA, gene machine); marker genes; the polymerase chain reaction (PCR) and gel electrophoresis.
- Applications: producing human insulin/proteins, genetically modified crops/organisms, gene therapy; analysing genomes; the social, ethical and bioethical implications. Genetic screening and DNA profiling.
WORKED-EXAMPLE MATERIAL: order the steps to make a GM bacterium producing insulin; explain PCR; interpret a gel-electrophoresis profile.
COMMON MISTAKES: enzyme/vector roles; PCR steps/temperatures; electrophoresis (size vs charge migration).
REACTIONS: empty. GRAPHS: empty.`,
      },
    },

    physics: {
      unit1: {
        "Physical quantities & units": `CIE A LEVEL PHYSICS (9702) AS — PHYSICAL QUANTITIES & UNITS.
- SI base quantities/units (mass kg, length m, time s, current A, temperature K, amount mol); derived units; homogeneity of equations by base units. Prefixes (p, n, µ, m, k, M, G).
- Scalars and vectors; add/subtract vectors and resolve into perpendicular components. Systematic vs random errors; precision vs accuracy; estimate uncertainties (absolute, fractional, percentage) and combine them (add for ×/÷; add absolute for +/−).
WORKED-EXAMPLE MATERIAL: check homogeneity by base units; resolve a vector; combine percentage uncertainties.
COMMON MISTAKES: precision vs accuracy; combining uncertainties; resolving the wrong component (sin/cos).
REACTIONS: empty. GRAPHS: empty.`,

        "Kinematics": `CIE A LEVEL PHYSICS (9702) AS — KINEMATICS.
- Displacement, velocity, acceleration; interpret and use displacement–time and velocity–time graphs (gradient = velocity/acceleration; area under v–t = displacement).
- Equations of uniformly accelerated motion (v = u + at; s = ut + ½at²; v² = u² + 2as; s = ½(u+v)t). Projectile motion: independent horizontal (constant velocity) and vertical (g) components.
WORKED-EXAMPLE MATERIAL: suvat problems; projectile range/height; derive acceleration from a v–t gradient.
COMMON MISTAKES: mixing horizontal/vertical components; sign of g; gradient vs area on motion graphs.
REACTIONS: empty. GRAPHS: displacement–time and velocity–time graphs.`,

        "Dynamics": `CIE A LEVEL PHYSICS (9702) AS — DYNAMICS.
- Newton's laws of motion; F = ma (resultant force, mass constant). Linear momentum p = mv; force as rate of change of momentum (F = Δp/Δt); impulse = FΔt = Δp.
- Conservation of momentum in collisions/explosions (1D); elastic (KE conserved) vs inelastic collisions; relative speed of approach = relative speed of separation for a perfectly elastic collision.
WORKED-EXAMPLE MATERIAL: momentum conservation in a collision; impulse from a force–time graph; identify elastic vs inelastic.
COMMON MISTAKES: momentum is a vector (signs); F = Δp/Δt vs ma; elastic vs inelastic test.
REACTIONS: empty. GRAPHS: empty.`,

        "Forces, density, pressure": `CIE A LEVEL PHYSICS (9702) AS — FORCES, DENSITY, PRESSURE.
- Types of force (weight = mg, normal, friction, drag, upthrust, tension). Turning effect: moment = F × perpendicular distance; couple and torque; principle of moments; conditions for equilibrium (zero resultant force AND zero resultant moment); centre of gravity.
- Density ρ = m/V; pressure p = F/A; hydrostatic pressure p = ρgh; upthrust and Archimedes' principle.
WORKED-EXAMPLE MATERIAL: solve an equilibrium problem with moments; find an unknown force on a beam; pressure at depth/upthrust.
COMMON MISTAKES: non-perpendicular distance for moments; forgetting both equilibrium conditions; ρgh.
REACTIONS: empty. GRAPHS: empty.`,

        "Work, energy & power": `CIE A LEVEL PHYSICS (9702) AS — WORK, ENERGY & POWER.
- Work done W = Fs cosθ; energy conservation; KE = ½mv²; change in GPE = mgΔh; derive KE and GPE. Elastic potential energy = ½Fx = ½kx².
- Power P = W/t = Fv; efficiency = useful output / total input (×100%). Conservation of energy in mechanical systems.
WORKED-EXAMPLE MATERIAL: energy conservation on a slope/pendulum; P = Fv for a moving vehicle; efficiency calculation.
COMMON MISTAKES: cosθ in work; ½ in KE/EPE; power as Fv vs W/t.
REACTIONS: empty. GRAPHS: empty.`,

        "Deformation of solids": `CIE A LEVEL PHYSICS (9702) AS — DEFORMATION OF SOLIDS.
- Hooke's law F = kx (limit of proportionality); springs in series/parallel. Stress = F/A, strain = x/L, Young modulus E = stress/strain; determine E experimentally.
- Force–extension and stress–strain graphs; elastic vs plastic behaviour; elastic strain energy = area under the force–extension graph (= ½Fx in the linear region); brittle/ductile/polymeric materials.
WORKED-EXAMPLE MATERIAL: calculate Young modulus; find strain energy from a graph; springs in series/parallel.
COMMON MISTAKES: stress/strain definitions and units; energy = area under graph; limit of proportionality vs elastic limit.
REACTIONS: empty. GRAPHS: force–extension and stress–strain graphs.`,

        "Waves": `CIE A LEVEL PHYSICS (9702) AS — WAVES.
- Wave terms (displacement, amplitude, wavelength, frequency, period, phase difference, wavefront); v = fλ; transverse vs longitudinal; energy and intensity (∝ amplitude²).
- The electromagnetic spectrum and orders of magnitude. Polarisation (transverse waves only; Malus's law where in scope). The Doppler effect for a moving source: f_observed = f·v/(v ± v_s).
WORKED-EXAMPLE MATERIAL: v = fλ; phase difference from a graph; Doppler shift of a moving source.
COMMON MISTAKES: phase difference in degrees/radians; polarisation only for transverse; Doppler ± sign.
REACTIONS: empty. GRAPHS: empty.`,

        "Superposition": `CIE A LEVEL PHYSICS (9702) AS — SUPERPOSITION.
- Principle of superposition; constructive/destructive interference; coherence and path difference (nλ constructive, (n+½)λ destructive). Two-source interference and Young's double-slit: λ = ax/D.
- Stationary (standing) waves on strings and in air columns: nodes/antinodes, formation from two waves travelling in opposite directions; harmonics and λ for fixed/open ends. Diffraction grating: d sinθ = nλ.
WORKED-EXAMPLE MATERIAL: λ = ax/D for double slits; d sinθ = nλ for a grating; find harmonic frequencies of a string/pipe.
COMMON MISTAKES: path difference conditions; stationary vs progressive wave properties; grating equation order.
REACTIONS: empty. GRAPHS: empty.`,

        "Electricity": `CIE A LEVEL PHYSICS (9702) AS — ELECTRICITY (CHARGE & CURRENT).
- Charge Q = It; current as flow of charge; charge carriers; I = nAvq (number density, drift velocity). Potential difference and e.m.f. (energy per unit charge, W = VQ); power P = VI = I²R = V²/R.
- Resistance R = V/I; resistivity ρ = RA/L; I–V characteristics of a resistor, filament lamp and diode; temperature dependence (metal, thermistor).
WORKED-EXAMPLE MATERIAL: I = nAvq; resistivity calculation; interpret an I–V characteristic.
COMMON MISTAKES: resistivity formula rearrangement; non-ohmic components; power equation choice.
REACTIONS: empty. GRAPHS: I–V characteristics.`,

        "DC circuits": `CIE A LEVEL PHYSICS (9702) AS — DC CIRCUITS.
- Kirchhoff's first law (current/charge conservation) and second law (energy conservation/e.m.f. = ΣIR). Resistor combinations in series and parallel.
- Electromotive force and internal resistance (terminal p.d. = e.m.f. − Ir); potential dividers (output = R/(R1+R2) × V; with LDR/thermistor for sensing).
WORKED-EXAMPLE MATERIAL: apply Kirchhoff's laws to a two-loop circuit; e.m.f./internal resistance from a V–I graph; potential-divider output.
COMMON MISTAKES: parallel resistor combination; sign conventions in Kirchhoff's second law; internal resistance.
REACTIONS: empty. GRAPHS: empty.`,

        "Particle physics": `CIE A LEVEL PHYSICS (9702) AS — PARTICLE PHYSICS.
- The nuclear atom (Rutherford α-scattering evidence); nucleon and proton number, nuclides, isotopes. Radioactive decay (α, β⁻, β⁺, γ); nuclear equations conserving nucleon/proton number and charge.
- Fundamental particles: quarks (up/down and charges), leptons (electron, neutrino); hadrons (baryons/mesons); quark composition of protons/neutrons; β decay in terms of quark change and the weak interaction; antiparticles.
WORKED-EXAMPLE MATERIAL: balance a nuclear decay equation; give the quark composition of a proton/neutron; β⁻ decay at quark level.
COMMON MISTAKES: not conserving nucleon/proton number; quark charges; β⁺ vs β⁻.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit4: {
        "Motion in a circle": `CIE A LEVEL PHYSICS (9702) A2 — MOTION IN A CIRCLE.
- Radian measure; angular velocity ω = 2π/T = v/r. Centripetal acceleration a = v²/r = ω²r directed to the centre; centripetal force F = mv²/r = mω²r.
- Examples: horizontal circle, vertical circle, conical pendulum, banked tracks; identify the force providing the centripetal force.
WORKED-EXAMPLE MATERIAL: centripetal force for an orbiting/whirling mass; minimum speed at the top of a vertical circle; conical pendulum.
COMMON MISTAKES: thinking the force is outward (centrifugal); degrees vs radians; identifying the centripetal force source.
REACTIONS: empty. GRAPHS: empty.`,

        "Gravitational fields": `CIE A LEVEL PHYSICS (9702) A2 — GRAVITATIONAL FIELDS.
- Newton's law of gravitation F = Gm₁m₂/r²; gravitational field strength g = F/m = GM/r² (radial field). Gravitational potential φ = −GM/r (and potential energy = mφ); zero at infinity, always negative.
- Orbits: derive v and T for a circular orbit (gravity provides centripetal force); geostationary satellites (period 24 h, equatorial, fixed point). Relationship between g and φ.
WORKED-EXAMPLE MATERIAL: orbital speed/period from GM/r² = v²/r; geostationary orbit radius; change in GPE using φ.
COMMON MISTAKES: r is from the centre; sign of potential; mixing g (field strength) and φ (potential).
REACTIONS: empty. GRAPHS: empty.`,

        "Temperature & ideal gases": `CIE A LEVEL PHYSICS (9702) A2 — TEMPERATURE & IDEAL GASES.
- Thermal equilibrium; thermodynamic (kelvin) scale; T(K) = θ(°C) + 273.15. Absolute zero. Specific heat capacity (E = mcΔθ) and specific latent heat (E = mL).
- Ideal gas: pV = nRT and pV = NkT; kinetic theory and the assumptions; mean kinetic energy of a molecule = (3/2)kT; pressure from molecular collisions (pV = ⅓Nm⟨c²⟩).
WORKED-EXAMPLE MATERIAL: gas-law calculation (kelvin); mean translational KE from temperature; specific heat/latent heat problems.
COMMON MISTAKES: kelvin conversion; ⅔/3⁄2 factors; ideal-gas assumptions.
REACTIONS: empty. GRAPHS: empty.`,

        "Thermodynamics": `CIE A LEVEL PHYSICS (9702) A2 — THERMODYNAMICS.
- Internal energy = sum of random kinetic + potential energies of molecules; depends on temperature and state. First law of thermodynamics: ΔU = q + W (heat supplied to the system + work done on the system).
- Work done on/by a gas (W = pΔV at constant pressure); apply the first law to heating, expansion/compression and changes of state.
WORKED-EXAMPLE MATERIAL: apply ΔU = q + W to a gas being compressed/heated; work done in an isobaric change; internal energy change.
COMMON MISTAKES: sign convention for q and W; internal energy depends on T (not just heat); work = pΔV.
REACTIONS: empty. GRAPHS: empty.`,

        "Oscillations (SHM)": `CIE A LEVEL PHYSICS (9702) A2 — OSCILLATIONS (SHM).
- Defining SHM: a = −ω²x (acceleration ∝ displacement, opposite direction). x = x₀cos(ωt) or sin; v = ±ω√(x₀² − x²); v_max = ωx₀; a_max = ω²x₀; period independent of amplitude. ω = 2π/T = 2πf.
- Energy in SHM (interchange of KE and PE; total constant). Damping (light/heavy/critical) and forced oscillations; resonance (driving frequency = natural frequency, maximum amplitude) and the effect of damping.
WORKED-EXAMPLE MATERIAL: use a = −ω²x and v = ±ω√(x₀²−x²); sketch displacement/velocity/acceleration vs time; explain resonance.
COMMON MISTAKES: the SHM condition; phase relationships; resonance/damping effect on amplitude.
REACTIONS: empty. GRAPHS: x, v, a vs time; amplitude vs driving frequency (resonance, varying damping).`,

        "Electric fields": `CIE A LEVEL PHYSICS (9702) A2 — ELECTRIC FIELDS.
- Field strength E = F/q; uniform field E = V/d (parallel plates); radial field of a point charge E = Q/(4πε₀r²). Coulomb's law F = Q₁Q₂/(4πε₀r²).
- Electric potential V = Q/(4πε₀r) (zero at infinity); potential energy; compare gravitational and electric fields (similarities/differences — gravity always attractive). Motion of charges in uniform fields.
WORKED-EXAMPLE MATERIAL: force between point charges; field/potential of a point charge; deflection of a charge in a uniform field.
COMMON MISTAKES: 1/r² (field) vs 1/r (potential); sign of charges; comparing to gravitational fields.
REACTIONS: empty. GRAPHS: empty.`,

        "Capacitance": `CIE A LEVEL PHYSICS (9702) A2 — CAPACITANCE.
- Capacitance C = Q/V; capacitors in series and parallel. Energy stored W = ½QV = ½CV² = ½Q²/C (area under a Q–V graph).
- Capacitor charging and discharging through a resistor: exponential decay Q = Q₀e^(−t/RC); time constant τ = RC; meaning of the time constant; uses (smoothing, timing).
WORKED-EXAMPLE MATERIAL: combine capacitors; energy stored; discharge calculation with Q = Q₀e^(−t/RC) and τ = RC.
COMMON MISTAKES: series/parallel combination (opposite to resistors); ½ in energy; time-constant interpretation.
REACTIONS: empty. GRAPHS: exponential charge/discharge curves.`,

        "Magnetic fields": `CIE A LEVEL PHYSICS (9702) A2 — MAGNETIC FIELDS.
- Magnetic flux density B; force on a current-carrying conductor F = BIL sinθ (Fleming's left-hand rule). Force on a moving charge F = BQv sinθ; circular motion of a charge in a field (r = mv/BQ); velocity selector.
- Magnetic fields due to currents (long wire, solenoid); forces between parallel currents. Determining B (current balance, Hall probe).
WORKED-EXAMPLE MATERIAL: F = BIL and F = BQv; radius of a charged particle's path; Fleming's left-hand rule direction.
COMMON MISTAKES: sinθ factor; left vs right hand; radius formula r = mv/BQ.
REACTIONS: empty. GRAPHS: empty.`,

        "Electromagnetic induction": `CIE A LEVEL PHYSICS (9702) A2 — ELECTROMAGNETIC INDUCTION.
- Magnetic flux Φ = BA; flux linkage = NΦ. Faraday's law: induced e.m.f. = rate of change of flux linkage (e.m.f. = −N dΦ/dt). Lenz's law (induced effect opposes the change; energy conservation) and the minus sign.
- Applications: a wire/coil moving in a field, rotating coils, transformers (qualitative link).
WORKED-EXAMPLE MATERIAL: e.m.f. from changing flux linkage; apply Lenz's law to find direction; e.m.f. of a moving rod (BLv).
COMMON MISTAKES: flux vs flux linkage; rate of change (not value); Lenz/sign reasoning.
REACTIONS: empty. GRAPHS: empty.`,

        "Alternating currents": `CIE A LEVEL PHYSICS (9702) A2 — ALTERNATING CURRENTS.
- Sinusoidal a.c.: peak and peak-to-peak values, period, frequency. Root-mean-square values: I_rms = I₀/√2, V_rms = V₀/√2; mean power in a resistive load = ½I₀V₀ = I_rms V_rms.
- Rectification: half-wave and full-wave (bridge rectifier); smoothing with a capacitor.
WORKED-EXAMPLE MATERIAL: rms from peak; mean power; describe full-wave rectification and smoothing.
COMMON MISTAKES: rms factor (√2); mean power (½ peak product); rectifier/smoothing operation.
REACTIONS: empty. GRAPHS: a.c. waveform; rectified/smoothed output.`,

        "Quantum physics": `CIE A LEVEL PHYSICS (9702) A2 — QUANTUM PHYSICS.
- Photon energy E = hf = hc/λ. Photoelectric effect: threshold frequency, work function φ, hf = φ + ½mv²_max; evidence for the particulate nature of light (why wave theory fails). The electronvolt.
- Wave–particle duality: de Broglie wavelength λ = h/p (electron diffraction evidence). Line spectra and energy levels: hf = E₁ − E₂; emission and absorption spectra.
WORKED-EXAMPLE MATERIAL: photoelectric equation (find KE_max/φ/threshold); de Broglie wavelength; photon from an energy-level transition.
COMMON MISTAKES: work function vs threshold; eV–J conversion; energy-level sign/transition.
REACTIONS: empty. GRAPHS: photoelectric KE_max vs frequency (gradient h, intercept φ).`,

        "Nuclear physics": `CIE A LEVEL PHYSICS (9702) A2 — NUCLEAR PHYSICS.
- Mass defect and binding energy; E = mc²; binding energy per nucleon curve (peak ~iron) explaining fission and fusion energy release. Atomic mass unit and MeV.
- Radioactive decay: random and spontaneous; activity A = λN; A = A₀e^(−λt); decay constant λ and half-life (t½ = ln2/λ). Calculations of activity/number remaining.
WORKED-EXAMPLE MATERIAL: binding energy from mass defect (E = mc²); explain energy release using the BE/nucleon curve; half-life/activity with A = A₀e^(−λt).
COMMON MISTAKES: mass defect → energy units; λ–half-life link; reading the BE/nucleon curve.
REACTIONS: empty. GRAPHS: binding energy per nucleon vs nucleon number; exponential decay.`,

        "Medical physics": `CIE A LEVEL PHYSICS (9702) A2 — MEDICAL PHYSICS.
- Production and use of ultrasound (piezoelectric transducer, A- and B-scans, acoustic impedance and reflection, the need for coupling gel). X-rays: production, attenuation (I = I₀e^(−µx)), and improving image sharpness/contrast (CT scanning principle).
- Diagnostic methods using radioactive tracers and PET scanning (annihilation of positron–electron, detection of gamma photons); principle of magnetic resonance imaging (MRI) where in scope.
WORKED-EXAMPLE MATERIAL: ultrasound reflection/acoustic impedance; X-ray attenuation I = I₀e^(−µx); outline how PET locates a tracer.
COMMON MISTAKES: attenuation equation; why coupling gel is needed (impedance matching); confusing the imaging methods.
REACTIONS: empty. GRAPHS: empty.`,
      },
    },

    maths: {
      unit1: {
        "Quadratics": `CIE A LEVEL MATHEMATICS (9709) P1 — QUADRATICS.
- Complete the square (find vertex/turning point, max/min, line of symmetry); solve quadratics by factorising, formula and completing the square.
- The discriminant b^2 - 4ac: two/one/no real roots (>0, =0, <0); conditions for a line to meet a curve (substitute and use the discriminant).
- Quadratic inequalities; solve equations reducible to quadratics (e.g. in x^2, root x, or e^x).
WORKED-EXAMPLE MATERIAL: complete the square for the vertex; use the discriminant for tangency; solve a disguised quadratic.
COMMON MISTAKES: sign on completing the square; discriminant conditions; inequality solution set.
REACTIONS: empty. GRAPHS: parabola (vertex/intercepts).`,

        "Functions": `CIE A LEVEL MATHEMATICS (9709) P1 — FUNCTIONS.
- Domain and range; one-to-one functions; composite functions fg (apply g first); inverse f^-1 (exists if one-to-one; reflect in y = x; swap and rearrange).
- Transformations of graphs: translations, stretches and reflections of y = f(x) (and how they combine). Modulus where in scope.
WORKED-EXAMPLE MATERIAL: find a composite and its domain; find an inverse and its domain/range; describe a sequence of transformations.
COMMON MISTAKES: composite order; inverse domain = original range; transformation order/direction.
REACTIONS: empty. GRAPHS: empty.`,

        "Coordinate geometry": `CIE A LEVEL MATHEMATICS (9709) P1 — COORDINATE GEOMETRY.
- Straight lines: gradient, midpoint, length; equation forms; parallel (equal gradients) and perpendicular (product of gradients = -1).
- Circle (x - a)^2 + (y - b)^2 = r^2: centre and radius (complete the square); intersection of a line and a curve; tangents/normals.
WORKED-EXAMPLE MATERIAL: equation of a perpendicular bisector; circle centre/radius; line-curve intersection.
COMMON MISTAKES: perpendicular gradient rule; completing the square for the circle; tangent condition.
REACTIONS: empty. GRAPHS: empty.`,

        "Circular measure": `CIE A LEVEL MATHEMATICS (9709) P1 — CIRCULAR MEASURE.
- Radians (pi rad = 180 deg); arc length s = r(theta); area of a sector = (1/2) r^2 (theta) (theta in radians).
- Area of a segment (sector minus triangle); solve problems combining arcs, sectors and triangles.
WORKED-EXAMPLE MATERIAL: arc length and sector area in radians; segment area; perimeter of a composite region.
COMMON MISTAKES: degrees instead of radians; segment = sector - triangle; mixing the formulae.
REACTIONS: empty. GRAPHS: empty.`,

        "Trigonometry": `CIE A LEVEL MATHEMATICS (9709) P1 — TRIGONOMETRY.
- Graphs and exact values of sin, cos, tan (0, 30, 45, 60, 90); amplitude/period of transformed trig graphs. Identities: tan = sin/cos; sin^2 + cos^2 = 1.
- Solve trig equations in a given interval (including using identities and multiple/compound angles within P1 scope).
WORKED-EXAMPLE MATERIAL: solve a trig equation in [0, 360]; use sin^2 + cos^2 = 1; sketch y = a sin(bx) + c.
COMMON MISTAKES: losing solutions in the interval; degrees/radians; identity rearrangement.
REACTIONS: empty. GRAPHS: trig graphs.`,

        "Series": `CIE A LEVEL MATHEMATICS (9709) P1 — SERIES.
- Binomial expansion of (a + b)^n for positive integer n (use nCr / Pascal's triangle); find a particular term.
- Arithmetic progressions (nth term, sum Sn = (n/2)(2a + (n-1)d)); geometric progressions (nth term ar^(n-1), sum, sum to infinity for |r| < 1: a/(1 - r)).
WORKED-EXAMPLE MATERIAL: a specific binomial term; AP/GP sum; sum to infinity and condition |r| < 1.
COMMON MISTAKES: nCr term index; AP vs GP formula; convergence condition for sum to infinity.
REACTIONS: empty. GRAPHS: empty.`,

        "Differentiation": `CIE A LEVEL MATHEMATICS (9709) P1 — DIFFERENTIATION.
- Differentiate powers of x; gradient of a curve, tangents and normals. Chain rule for (ax + b)^n; rates of change.
- Stationary points (dy/dx = 0) and their nature (second derivative or sign test); increasing/decreasing functions; connected rates of change.
WORKED-EXAMPLE MATERIAL: equation of a tangent/normal; classify stationary points; a simple connected rate of change.
COMMON MISTAKES: chain-rule factor; classifying stationary points; tangent vs normal gradient.
REACTIONS: empty. GRAPHS: empty.`,

        "Integration": `CIE A LEVEL MATHEMATICS (9709) P1 — INTEGRATION.
- Integrate powers of x (and (ax + b)^n); +c for indefinite integrals; find a curve from its gradient function and a point.
- Definite integrals; area under a curve and area between a curve and a line; volume of revolution about the x- or y-axis (pi integral y^2 dx).
WORKED-EXAMPLE MATERIAL: area between a curve and a line; volume of revolution; find the constant of integration from a point.
COMMON MISTAKES: forgetting +c; limits/area below the axis; pi y^2 for volume.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit2: {
        "Algebra (P2)": `CIE A LEVEL MATHEMATICS (9709) P2 — ALGEBRA.
- The modulus function |x|: sketch y = |f(x)|; solve equations and inequalities with modulus (by cases or squaring).
- Polynomials: division, the factor and remainder theorems; factorise and solve cubic/quartic equations.
WORKED-EXAMPLE MATERIAL: solve |ax + b| = |cx + d|; use the factor theorem to factorise a cubic; remainder theorem.
COMMON MISTAKES: losing a modulus case; sign errors in division; applying the remainder theorem.
REACTIONS: empty. GRAPHS: empty.`,

        "Logarithmic & exponential functions (P2)": `CIE A LEVEL MATHEMATICS (9709) P2 — LOGS & EXPONENTIALS.
- Laws of logarithms; solve equations of the form a^x = b (take logs). The functions e^x and ln x as inverses; their graphs.
- Reduce a relationship to linear form (e.g. y = ka^x or y = ax^n) and use a straight-line graph (log-log or log-linear) to find constants.
WORKED-EXAMPLE MATERIAL: solve an exponential equation with logs; linearise y = kx^n and find k and n from a graph.
COMMON MISTAKES: log laws; which variables to plot for linear form; e and ln as inverses.
REACTIONS: empty. GRAPHS: linearised log graphs.`,

        "Trigonometry (P2)": `CIE A LEVEL MATHEMATICS (9709) P2 — TRIGONOMETRY.
- Secant, cosecant, cotangent and the identities 1 + tan^2 = sec^2, 1 + cot^2 = cosec^2. Compound-angle formulae (sin(A +/- B), cos(A +/- B), tan(A +/- B)) and double-angle formulae.
- Express a sin(theta) + b cos(theta) in the form R sin(theta +/- alpha) / R cos(...); solve trig equations and find max/min.
WORKED-EXAMPLE MATERIAL: prove an identity; solve using double angles; R sin(theta + alpha) form and its max/min.
COMMON MISTAKES: identity selection; R-alpha method (R = root(a^2+b^2), tan alpha = b/a); losing solutions.
REACTIONS: empty. GRAPHS: empty.`,

        "Differentiation (P2)": `CIE A LEVEL MATHEMATICS (9709) P2 — DIFFERENTIATION.
- Differentiate e^x, ln x, sin x, cos x, tan x; the product and quotient rules; the chain rule.
- Apply to tangents/normals, stationary points and curves involving these functions.
WORKED-EXAMPLE MATERIAL: differentiate a product/quotient with trig/exponentials; stationary points of y = x e^(-x) etc.
COMMON MISTAKES: product/quotient rule structure; derivative of ln/tan; chain-rule factors.
REACTIONS: empty. GRAPHS: empty.`,

        "Integration (P2)": `CIE A LEVEL MATHEMATICS (9709) P2 — INTEGRATION.
- Integrate e^(ax+b), 1/(ax+b), sin/cos/(sec^2) of (ax+b); use trig identities to integrate (e.g. cos^2 via double angle).
- Definite integrals and areas; the trapezium rule to estimate an area (and whether it over/underestimates).
WORKED-EXAMPLE MATERIAL: integrate 1/(ax+b) and e^(ax+b); use a double-angle identity; trapezium-rule estimate.
COMMON MISTAKES: 1/a factor for (ax+b); integrating cos^2 directly; trapezium rule over/underestimate.
REACTIONS: empty. GRAPHS: empty.`,

        "Numerical solution of equations (P2)": `CIE A LEVEL MATHEMATICS (9709) P2 — NUMERICAL SOLUTION OF EQUATIONS.
- Locate a root by a sign change of a continuous function. Iterative methods: rearrange to x = g(x) and use x_(n+1) = g(x_n); show convergence; comment on the result to required accuracy.
WORKED-EXAMPLE MATERIAL: show a root lies in an interval (sign change); carry out an iteration to a given accuracy.
COMMON MISTAKES: not justifying with a sign change; iteration arithmetic; stating accuracy/convergence.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit3: {
        "Algebra (P3)": `CIE A LEVEL MATHEMATICS (9709) P3 — ALGEBRA.
- Partial fractions (proper/improper; linear factors, repeated factors, and an irreducible quadratic factor). Use partial fractions in integration and in binomial expansions.
- Binomial expansion of (1 + x)^n for any rational n (and its validity |x| < 1), including after factoring out a constant.
WORKED-EXAMPLE MATERIAL: decompose into partial fractions (repeated/quadratic factor); expand (1 + ax)^(-1) and state the range of validity.
COMMON MISTAKES: cover-up for repeated/quadratic factors; range of validity; improper fraction division first.
REACTIONS: empty. GRAPHS: empty.`,

        "Logarithmic & exponential functions": `CIE A LEVEL MATHEMATICS (9709) P3 — LOGS & EXPONENTIALS.
- Consolidate log laws and solving a^x = b; model growth/decay with e^(kt); ln to linearise. Solve equations and inequalities involving e^x and ln x.
WORKED-EXAMPLE MATERIAL: exponential growth/decay problem; solve ln/e equations; linearise and find constants.
COMMON MISTAKES: log laws; sign of k for decay; domain of ln.
REACTIONS: empty. GRAPHS: empty.`,

        "Trigonometry (P3)": `CIE A LEVEL MATHEMATICS (9709) P3 — TRIGONOMETRY.
- Use all identities (Pythagorean, compound, double angle, R-form) to prove identities and solve equations in a given range; express products/powers in integrable forms.
WORKED-EXAMPLE MATERIAL: prove a harder identity; solve a trig equation needing double-angle/R-form; integrand preparation.
COMMON MISTAKES: identity choice; losing solutions in range; R-form sign/quadrant of alpha.
REACTIONS: empty. GRAPHS: empty.`,

        "Differentiation (P3)": `CIE A LEVEL MATHEMATICS (9709) P3 — DIFFERENTIATION.
- Implicit differentiation; parametric differentiation (dy/dx = (dy/dt)/(dx/dt)). Differentiate inverse trig where in scope; tangents/normals and stationary points for implicit/parametric curves.
WORKED-EXAMPLE MATERIAL: implicit differentiation for a tangent; parametric dy/dx and a tangent; stationary point of a parametric curve.
COMMON MISTAKES: differentiating y-terms (chain rule) implicitly; parametric quotient; second derivative parametric.
REACTIONS: empty. GRAPHS: empty.`,

        "Integration (P3)": `CIE A LEVEL MATHEMATICS (9709) P3 — INTEGRATION.
- Techniques: recognising f'(x)/f(x) (gives ln), integration by substitution, integration by parts, and using partial fractions; integrate kf'(x)(f(x))^n.
- Definite integrals; areas; combine techniques.
WORKED-EXAMPLE MATERIAL: integration by parts (e.g. integral of x e^x or x ln x); substitution; integral of a partial-fraction expression.
COMMON MISTAKES: by-parts choice of u/dv; substitution limits; recognising the ln (f'/f) form.
REACTIONS: empty. GRAPHS: empty.`,

        "Numerical solution of equations": `CIE A LEVEL MATHEMATICS (9709) P3 — NUMERICAL SOLUTION.
- Locate roots by sign change; iterative formulae x_(n+1) = g(x_n); show/justify convergence and give the root to a stated accuracy; understand when an iteration fails.
WORKED-EXAMPLE MATERIAL: establish a root by sign change; iterate to convergence; verify accuracy.
COMMON MISTAKES: no sign-change justification; rounding during iteration; stating the accuracy.
REACTIONS: empty. GRAPHS: empty.`,

        "Vectors (P3)": `CIE A LEVEL MATHEMATICS (9709) P3 — VECTORS.
- Position and direction vectors; magnitude and unit vectors. The scalar (dot) product and the angle between two vectors/lines.
- Vector equation of a line r = a + t d; determine whether lines are parallel, intersect or are skew, and find the point/angle of intersection.
WORKED-EXAMPLE MATERIAL: angle between two lines via the dot product; show lines are skew; find an intersection point.
COMMON MISTAKES: dot-product angle formula; distinguishing parallel/intersecting/skew; using different parameters for two lines.
REACTIONS: empty. GRAPHS: empty.`,

        "Differential equations": `CIE A LEVEL MATHEMATICS (9709) P3 — DIFFERENTIAL EQUATIONS.
- Form a differential equation from a rate statement; solve first-order separable equations (separate the variables and integrate); use partial fractions where needed.
- Apply boundary/initial conditions to find the particular solution; interpret the solution (including long-term behaviour).
WORKED-EXAMPLE MATERIAL: set up and solve dy/dx = ky or a separable model; apply a condition; interpret the result.
COMMON MISTAKES: separating variables; constant of integration from conditions; interpreting limits.
REACTIONS: empty. GRAPHS: empty.`,

        "Complex numbers": `CIE A LEVEL MATHEMATICS (9709) P3 — COMPLEX NUMBERS.
- Arithmetic of complex numbers (a + bi); complex conjugate; solve quadratics/polynomials with complex roots (conjugate pairs). Modulus and argument; modulus-argument (polar) form and exponential form re^(i theta).
- Argand diagram; multiplication/division in polar form; loci (e.g. |z - a| = r is a circle; arg(z - a) = theta is a half-line).
WORKED-EXAMPLE MATERIAL: solve a quadratic with complex roots; convert to modulus-argument form; sketch a locus on an Argand diagram.
COMMON MISTAKES: argument quadrant; conjugate-pair roots; locus interpretation.
REACTIONS: empty. GRAPHS: Argand diagram loci.`,
      },
      unit4: {
        "Forces & equilibrium": `CIE A LEVEL MATHEMATICS (9709) M1 — FORCES & EQUILIBRIUM.
- Forces as vectors; resolve a force into perpendicular components; find the resultant. Equilibrium of a particle under coplanar forces (resolve in two directions, set each to zero).
- Contact forces, weight, tension, normal reaction; friction (F <= mu R, limiting equilibrium F = mu R); objects on inclined planes.
WORKED-EXAMPLE MATERIAL: equilibrium on an inclined plane with friction; resolve and solve for an unknown force/angle; limiting friction.
COMMON MISTAKES: resolving (sin/cos) on a slope; using F = mu R when not on the point of moving; missing a force.
REACTIONS: empty. GRAPHS: empty.`,

        "Kinematics (M1)": `CIE A LEVEL MATHEMATICS (9709) M1 — KINEMATICS.
- Motion in a straight line: displacement, velocity, acceleration; the suvat equations for constant acceleration; motion under gravity.
- Use calculus when acceleration is variable: v = ds/dt, a = dv/dt, and integrate to reverse; interpret displacement-time and velocity-time graphs (gradient and area).
WORKED-EXAMPLE MATERIAL: suvat problem (including vertical motion); variable acceleration via calculus; distance from a v-t graph area.
COMMON MISTAKES: constant- vs variable-acceleration methods; sign of g; gradient vs area.
REACTIONS: empty. GRAPHS: displacement-time and velocity-time graphs.`,

        "Newton’s laws": `CIE A LEVEL MATHEMATICS (9709) M1 — NEWTON'S LAWS OF MOTION.
- F = ma applied to a particle (resolve forces, find acceleration); motion on horizontal and inclined planes with friction.
- Connected particles: objects joined by a string over a pulley, or in a lift, or being towed; treat the system and individual particles; tension in the string.
WORKED-EXAMPLE MATERIAL: connected particles over a pulley (find acceleration and tension); a lift problem; F = ma on a slope.
COMMON MISTAKES: signs/direction of acceleration; treating the system vs each particle; friction direction.
REACTIONS: empty. GRAPHS: empty.`,

        "Energy, work & power": `CIE A LEVEL MATHEMATICS (9709) M1 — ENERGY, WORK & POWER.
- Work done by a force = F s cos(theta); kinetic energy (1/2) m v^2; gravitational PE = m g h. The work-energy principle (work done by the resultant force = change in KE).
- Conservation of energy with work done against friction; power P = work/time = F v (driving force x speed).
WORKED-EXAMPLE MATERIAL: work-energy on a slope with friction; power of an engine at a steady speed; KE/PE interchange.
COMMON MISTAKES: cos(theta) in work; including/excluding friction; P = Fv vs work/time.
REACTIONS: empty. GRAPHS: empty.`,

        "Momentum": `CIE A LEVEL MATHEMATICS (9709) M1 — MOMENTUM.
- Linear momentum p = m v (vector). Conservation of momentum in a direct collision (and when particles coalesce); impulse = change in momentum.
WORKED-EXAMPLE MATERIAL: collision where two particles join; find a velocity after collision using conservation of momentum; impulse.
COMMON MISTAKES: momentum direction/sign; coalescing particles (combined mass); impulse = change in momentum.
REACTIONS: empty. GRAPHS: empty.`,
      },
      unit5: {
        "Representation of data": `CIE A LEVEL MATHEMATICS (9709) S1 — REPRESENTATION OF DATA.
- Display and interpret data: stem-and-leaf, box-and-whisker plots, histograms (frequency density, area = frequency), cumulative frequency graphs.
- Measures of central tendency (mean, median, mode) and spread (range, interquartile range, variance and standard deviation; from raw or grouped data using sum(x) and sum(x^2)). Effect of coding/outliers.
WORKED-EXAMPLE MATERIAL: mean and standard deviation from sum(x), sum(x^2); read median/quartiles from a cumulative frequency curve; histogram with frequency density.
COMMON MISTAKES: standard deviation formula (sum(x^2)/n - mean^2); frequency density; quartile positions.
REACTIONS: empty. GRAPHS: histograms, box plots, cumulative frequency curves.`,

        "Permutations & combinations": `CIE A LEVEL MATHEMATICS (9709) S1 — PERMUTATIONS & COMBINATIONS.
- Counting principle (multiplication). Permutations nPr (order matters), including with restrictions and repeated items; arrangements in a line/circle.
- Combinations nCr (order does not matter); selections with restrictions; use in probability problems.
WORKED-EXAMPLE MATERIAL: arrangements with restrictions (e.g. specific items together/apart); selections; combine with probability.
COMMON MISTAKES: permutation vs combination; handling repeats; "at least/together" restrictions.
REACTIONS: empty. GRAPHS: empty.`,

        "Probability": `CIE A LEVEL MATHEMATICS (9709) S1 — PROBABILITY.
- Sample spaces; P(A or B) = P(A) + P(B) - P(A and B); mutually exclusive and independent events; tree and Venn diagrams.
- Conditional probability P(A|B) = P(A and B)/P(B); test for independence.
WORKED-EXAMPLE MATERIAL: conditional probability from a tree/Venn; test whether events are independent; combined-event probability.
COMMON MISTAKES: independence vs mutual exclusivity; conditional formula; double counting in OR.
REACTIONS: empty. GRAPHS: empty.`,

        "Discrete random variables": `CIE A LEVEL MATHEMATICS (9709) S1 — DISCRETE RANDOM VARIABLES.
- Probability distribution table (sum of probabilities = 1); expectation E(X) = sum(x P(X=x)); variance Var(X) = sum(x^2 P) - [E(X)]^2.
- The binomial distribution B(n, p): conditions, P(X = r) = nCr p^r (1-p)^(n-r), mean np, variance np(1-p). The geometric distribution where in scope.
WORKED-EXAMPLE MATERIAL: E(X) and Var(X) from a table; binomial probability and mean/variance; check the conditions for a binomial model.
COMMON MISTAKES: Var formula; binomial conditions (fixed n, constant p, independence); r index.
REACTIONS: empty. GRAPHS: empty.`,

        "Normal distribution": `CIE A LEVEL MATHEMATICS (9709) S1 — NORMAL DISTRIBUTION.
- The normal distribution N(mu, sigma^2); standardise z = (x - mu)/sigma; use the standard normal tables (and inverse) to find probabilities and values.
- Use the normal as an approximation to the binomial (np and n(1-p) > 5) with a continuity correction.
WORKED-EXAMPLE MATERIAL: find a probability via z; find mu or sigma from a given probability; normal approximation to the binomial with continuity correction.
COMMON MISTAKES: standardising; reading tables / using symmetry; forgetting the continuity correction.
REACTIONS: empty. GRAPHS: normal distribution curve.`,
      },
      unit6: {
        "The Poisson distribution (S2)": `CIE A LEVEL MATHEMATICS (9709) S2 — THE POISSON DISTRIBUTION.
- Poisson Po(lambda) for events at random, independent, at a constant average rate: P(X = r) = e^(-lambda) lambda^r / r!; mean = variance = lambda. Add independent Poissons (lambdas add).
- Poisson as an approximation to the binomial (large n, small p; lambda = np). Normal approximation to the Poisson (lambda > 15) with continuity correction.
WORKED-EXAMPLE MATERIAL: Poisson probability; combine rates over a different interval; Poisson approximation to a binomial.
COMMON MISTAKES: scaling lambda for the interval; conditions for each approximation; continuity correction.
REACTIONS: empty. GRAPHS: empty.`,

        "Linear combinations of random variables (S2)": `CIE A LEVEL MATHEMATICS (9709) S2 — LINEAR COMBINATIONS OF RANDOM VARIABLES.
- E(aX + b) = a E(X) + b; Var(aX + b) = a^2 Var(X). For independent X and Y: E(aX +/- bY) = aE(X) +/- bE(Y); Var(aX +/- bY) = a^2 Var(X) + b^2 Var(Y).
- Distribution of sums of independent normal variables is normal; sums of independent Poissons are Poisson.
WORKED-EXAMPLE MATERIAL: mean/variance of a linear combination; distribution of the sum/difference of independent normals; total of several observations.
COMMON MISTAKES: Var(aX) = a^2 Var(X) (square the constant); adding variances even for a difference; independence required.
REACTIONS: empty. GRAPHS: empty.`,

        "Continuous random variables (S2)": `CIE A LEVEL MATHEMATICS (9709) S2 — CONTINUOUS RANDOM VARIABLES.
- Probability density function f(x): f(x) >= 0 and the integral over all x = 1; P(a < X < b) = integral of f from a to b. Cumulative distribution function F(x) (and f = F').
- E(X) = integral of x f(x); Var(X) = integral of x^2 f(x) - [E(X)]^2; median (F = 0.5) and mode (maximum of f).
WORKED-EXAMPLE MATERIAL: find an unknown constant in f(x); compute E(X), Var(X), median; use F(x).
COMMON MISTAKES: not setting the total integral to 1; Var formula; median from F(x) = 0.5.
REACTIONS: empty. GRAPHS: empty.`,

        "Sampling and estimation (S2)": `CIE A LEVEL MATHEMATICS (9709) S2 — SAMPLING & ESTIMATION.
- Population vs sample; random sampling; the sample mean as an unbiased estimator; the distribution of the sample mean (normal with variance sigma^2/n) — Central Limit Theorem for large n.
- Unbiased estimates of population mean and variance from a sample; confidence intervals for a population mean (using normal, or with estimated variance) and for a proportion.
WORKED-EXAMPLE MATERIAL: unbiased estimate of variance from sample data; confidence interval for a mean; CLT-based probability for a sample mean.
COMMON MISTAKES: dividing by n vs n-1 for the unbiased variance; sigma/root(n) for the sample mean; CI structure.
REACTIONS: empty. GRAPHS: empty.`,

        "Hypothesis testing (S2)": `CIE A LEVEL MATHEMATICS (9709) S2 — HYPOTHESIS TESTING.
- Null and alternative hypotheses; one- and two-tailed tests; significance level; test statistic; critical region; conclusion in context.
- Tests for: a population proportion/binomial; a Poisson mean; and a normal mean (known variance, or large sample). Type I and Type II errors.
WORKED-EXAMPLE MATERIAL: carry out a binomial/Poisson hypothesis test; a normal-mean test and conclusion in context; identify a Type I error.
COMMON MISTAKES: one- vs two-tailed; comparing the wrong tail probability; concluding without context; mixing up Type I/II errors.
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
