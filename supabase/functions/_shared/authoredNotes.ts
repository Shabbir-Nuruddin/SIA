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
