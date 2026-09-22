import type { KBEntry } from "./types";

export const KB_PART_B: KBEntry[] = [
  // ─── Domain 1: physics-chemistry ──────────────────────────────────────────

  {
    docId: "classical-mechanics-newton",
    domain: "physics-chemistry",
    title: "Newton's three laws of motion and universal gravitation",
    content: "Isaac Newton's Principia Mathematica (1687) unified terrestrial and celestial mechanics under three laws of motion. The first law, the law of inertia, states that a body remains at rest or in uniform motion unless acted upon by a net external force. The second law relates net force to mass and acceleration, written F equals m times a. The third law states that for every action there is an equal and opposite reaction. Newton's law of universal gravitation adds that any two masses attract with a force proportional to the product of the masses and inversely proportional to the square of the distance between them, explaining both falling bodies and planetary orbits in one framework. Newtonian mechanics remains accurate at everyday speeds and is still the workhorse of engineering, from bridges to spacecraft trajectories.",
    keywords: ["newton", "laws of motion", "inertia", "force", "gravity", "universal gravitation", "principia mathematica", "classical mechanics", "action reaction", "dynamics", "kinematics"],
    source: "Newton, Philosophiae Naturalis Principia Mathematica, 1687",
  },

  {
    docId: "thermodynamics-laws",
    domain: "physics-chemistry",
    title: "The four laws of thermodynamics and entropy",
    content: "Thermodynamics governs energy, heat and work. The zeroth law defines temperature: two bodies each in thermal equilibrium with a third are in equilibrium with each other, which makes thermometers possible. The first law is conservation of energy: heat added to a system equals its increase in internal energy plus the work it performs. The second law states that the entropy of an isolated system tends to increase, that heat flows spontaneously only from hotter to colder bodies, and that no engine operating between two temperatures can exceed the efficiency limit derived by Sadi Carnot in 1824. The third law holds that entropy approaches a constant minimum as temperature approaches absolute zero, which cannot be reached in a finite number of steps. Together these laws underpin engines, refrigerators, chemical reactions and even information theory.",
    keywords: ["thermodynamics", "zeroth law", "first law", "second law", "third law", "entropy", "carnot efficiency", "heat engine", "absolute zero", "energy conservation", "thermal equilibrium"],
    source: "Carnot 1824; Clausius 1865; standard thermodynamics references",
  },

  {
    docId: "electromagnetism-maxwell",
    domain: "physics-chemistry",
    title: "Electromagnetism: Faraday's induction and Maxwell's equations",
    content: "Michael Faraday's discovery of electromagnetic induction in 1831 showed that a changing magnetic field generates an electric current, the principle behind generators and transformers. In the 1860s James Clerk Maxwell distilled electricity and magnetism into four equations, predicting that oscillating electric and magnetic fields travel together as waves moving at the speed of light, which revealed light itself to be electromagnetic radiation. Heinrich Hertz confirmed the predicted radio waves experimentally in 1887, opening the path to wireless communication. The electromagnetic spectrum spans radio waves, microwaves, infrared, visible light, ultraviolet, X-rays and gamma rays, differing only in wavelength and frequency. Electromagnetism became the template for later field theories and underlies electric power, broadcasting, motors and modern electronics.",
    keywords: ["electromagnetism", "maxwell equations", "faraday", "electromagnetic induction", "electromagnetic spectrum", "hertz", "radio waves", "light", "generator", "magnetic field", "electric field"],
    source: "Faraday 1831; Maxwell, A Dynamical Theory of the Electromagnetic Field, 1865",
  },

  {
    docId: "relativity-einstein",
    domain: "physics-chemistry",
    title: "Einstein's special and general relativity",
    content: "Albert Einstein's special relativity, published in 1905, rests on two postulates: the laws of physics are identical in all uniformly moving reference frames, and the speed of light in vacuum is the same for all observers. Consequences include time dilation, length contraction, relativity of simultaneity and the mass-energy relation E equals m c squared. General relativity, completed in 1915, reinterpreted gravity as the curvature of spacetime produced by mass and energy. It predicted the bending of starlight confirmed by Arthur Eddington's 1919 eclipse expedition, black holes, and gravitational waves, detected directly by LIGO in 2015. Satellite navigation systems such as GPS must apply relativistic corrections to their clocks, without which calculated positions would drift by many kilometers per day.",
    keywords: ["relativity", "einstein", "special relativity", "general relativity", "time dilation", "spacetime", "e equals mc squared", "gps corrections", "gravitational waves", "light speed", "black holes"],
    source: "Einstein 1905 and 1915 papers; Eddington 1919; LIGO 2015-2016",
  },

  {
    docId: "quantum-mechanics-basics",
    domain: "physics-chemistry",
    title: "Quantum mechanics: quanta, uncertainty and wave-particle duality",
    content: "Quantum mechanics arose from Max Planck's 1900 proposal that energy is exchanged in discrete quanta and Einstein's 1905 explanation of the photoelectric effect using particles of light later named photons. Louis de Broglie proposed in 1924 that matter has wave properties, giving wave-particle duality, and Erwin Schrodinger's 1926 equation describes how quantum states evolve. Werner Heisenberg's uncertainty principle, formulated in 1927, states that certain paired properties, such as position and momentum, cannot both be determined with arbitrary precision, while Max Born supplied the probabilistic interpretation of the wave function. The theory explains atomic spectra, chemical bonding, semiconductors, lasers and medical imaging, though its interpretation, from Copenhagen to many-worlds, remains philosophically debated.",
    keywords: ["quantum mechanics", "planck", "heisenberg", "uncertainty principle", "schrodinger equation", "wave particle duality", "quantum theory", "photons", "photoelectric effect", "de broglie", "quantum physics"],
    source: "Planck 1900; Schrodinger 1926; Heisenberg 1927",
  },

  {
    docId: "atomic-structure-periodic-table",
    domain: "physics-chemistry",
    title: "Atomic structure and the periodic table",
    content: "The modern atom emerged stepwise: John Dalton proposed indivisible atoms in 1803, J. J. Thomson discovered the electron in 1897, Ernest Rutherford's gold-foil experiment revealed a tiny, dense, positively charged nucleus in 1911, and Niels Bohr's 1913 model placed electrons in quantized orbits, explaining hydrogen's spectral lines. Dmitri Mendeleev published his periodic table in 1869, ordering elements by atomic weight, leaving gaps and successfully predicting undiscovered elements such as gallium and germanium. Henry Moseley's work established atomic number, the proton count, as the true ordering principle, now the modern periodic law. Elements in the same group share valence-electron configurations, producing recurring trends in reactivity, atomic radius, electronegativity and metallic character across periods and groups.",
    keywords: ["atomic structure", "periodic table", "mendeleev", "bohr model", "nucleus", "electron", "proton", "atomic number", "periodicity", "valence electrons", "rutherford", "moseley"],
    source: "Mendeleev 1869; Rutherford 1911; Bohr 1913; IUPAC Periodic Table",
  },

  {
    docId: "chemical-bonding",
    domain: "physics-chemistry",
    title: "Chemical bonding: ionic, covalent, metallic and hydrogen bonds",
    content: "Chemical bonds hold atoms together in molecules and solids. Ionic bonds transfer electrons from a metal to a nonmetal, producing oppositely charged ions bound by electrostatic attraction, as in sodium chloride. Covalent bonds share electron pairs, typically between nonmetals, and range from nonpolar to strongly polar depending on electronegativity differences. Metallic bonding delocalizes valence electrons into a sea around positive ions, explaining metals' conductivity, luster and malleability. VSEPR theory predicts molecular shape by arranging electron pairs to minimize mutual repulsion, yielding tetrahedral methane and bent water molecules. Weaker intermolecular forces matter greatly: hydrogen bonds give water its high boiling point, stabilize the DNA double helix and protein structures, and shape the properties of countless liquids and polymers.",
    keywords: ["chemical bond", "ionic bond", "covalent bond", "metallic bond", "hydrogen bond", "vsepr", "electronegativity", "molecular geometry", "valence", "intermolecular forces", "chemical bonding"],
    source: "Pauling, The Nature of the Chemical Bond, 1939; VSEPR theory (Gillespie-Nyholm)",
  },

  {
    docId: "acids-bases-ph",
    domain: "physics-chemistry",
    title: "Acids, bases and the pH scale",
    content: "Definitions of acids and bases broadened over time. Arrhenius defined acids as substances releasing hydrogen ions in water and bases as releasing hydroxide ions. The Bronsted-Lowry definition of 1923 generalizes: acids donate protons and bases accept them, forming conjugate pairs. The Lewis definition widens further to electron-pair acceptors and donors, covering reactions with no protons at all. S. P. L. Sorensen introduced the pH scale in 1909 as the negative logarithm of hydrogen-ion concentration, running from strongly acidic near zero to strongly basic near fourteen, with seven neutral; each pH unit represents a tenfold change. Strong acids and bases dissociate completely, weak ones partially. Indicators such as litmus and phenolphthalein change color over characteristic ranges, and buffers in blood and seawater resist pH shifts.",
    keywords: ["acids", "bases", "ph scale", "arrhenius", "bronsted lowry", "lewis acids", "alkalinity", "neutralization", "buffer", "litmus", "hydrogen ion", "dissociation"],
    source: "Arrhenius 1884; Bronsted and Lowry 1923; Lewis 1923; Sorensen 1909",
  },

  {
    docId: "organic-chemistry-carbon",
    domain: "physics-chemistry",
    title: "Organic chemistry: the versatility of carbon",
    content: "Organic chemistry studies carbon compounds, a vast family possible because carbon forms four strong covalent bonds and links into chains, rings and branching frameworks, a capacity called catenation. Friedrich Wohler's 1828 synthesis of urea from inorganic ammonium cyanate overturned the vitalist belief that organic compounds required living sources. Functional groups, such as the hydroxyl group of alcohols, the carboxyl group of acids, the carbonyl of aldehydes and ketones, and the amine group, confer predictable reactivity and organize compounds into homologous series. Petroleum feedstocks sustain the petrochemical industry, producing fuels, plastics, solvents, dyes, fertilizers and pharmaceuticals. Polymerization joins small monomers into giant molecules such as polyethylene, PVC and nylon, making synthetic polymers among the most-produced materials on Earth.",
    keywords: ["organic chemistry", "carbon", "functional groups", "polymers", "petrochemicals", "hydrocarbons", "covalent", "catenation", "wohler", "monomers", "homologous series", "isomers"],
    source: "Wohler 1828; IUPAC organic nomenclature",
  },

  {
    docId: "states-of-matter",
    domain: "physics-chemistry",
    title: "States of matter and phase transitions",
    content: "Common states of matter are solid, liquid, gas and plasma. In solids, particles vibrate about fixed positions, giving definite shape and volume; liquids flow and keep nearly fixed volume; gases expand to fill any container; plasma, an ionized gas, dominates the visible universe because stars are plasma. Heating drives phase transitions, melting, vaporization and sublimation, each absorbing latent heat, and cooling reverses them. Above the critical temperature and pressure, liquid and gas merge into a single supercritical phase. Near absolute zero, exotic quantum states appear, including the Bose-Einstein condensate first created in 1995. Phase diagrams map states against pressure and temperature; water's diagram, with solid ice less dense than the liquid, explains floating icebergs and lakes freezing from the top down.",
    keywords: ["states of matter", "solid", "liquid", "gas", "plasma", "phase transition", "critical point", "melting", "sublimation", "bose einstein condensate", "phase diagram", "latent heat"],
    source: "Standard physics references; Bose-Einstein condensate: Cornell, Wieman and Ketterle, 1995",
  },

  {
    docId: "light-optics",
    domain: "physics-chemistry",
    title: "Light and optics: reflection, refraction and diffraction",
    content: "Light shows both wave and particle character. Reflection obeys equal angles of incidence and reflection. Refraction, the bending of light as it crosses between media, follows Snell's law and lets lenses focus: converging lenses form real images in cameras, eyes, microscopes and telescopes. Total internal reflection traps light inside optical fibers, which now carry the bulk of internet traffic as light pulses. Diffraction and interference, demonstrated in Thomas Young's 1801 double-slit experiment, reveal wave behavior; gratings and thin films produce spectra and iridescence. Dispersion splits white light into colors by wavelength in prisms and raindrops, forming rainbows. Polarization filters light by orientation, while absorption and emission spectra let astronomers identify the chemistry of distant stars.",
    keywords: ["light", "optics", "reflection", "refraction", "snell law", "lenses", "diffraction", "interference", "fiber optics", "total internal reflection", "dispersion", "polarization"],
    source: "Snell's law; Young's double-slit experiment 1801; standard optics references",
  },

  {
    docId: "energy-conservation-laws",
    domain: "physics-chemistry",
    title: "Conservation of energy and momentum",
    content: "Conservation laws rank among physics' deepest principles. Energy changes form, kinetic to potential to thermal to chemical, but the total in a closed system is fixed, established by James Joule's careful experiments in the 1840s and identical to the first law of thermodynamics. Momentum, mass times velocity, is conserved when no external force acts, governing collisions from billiard balls to rocket exhaust. Angular momentum conservation explains figure skaters' spins and planetary orbits. The work-energy theorem ties net work to changes in kinetic energy. Because no device can create energy from nothing, perpetual-motion machines are impossible, and every real engine dissipates some energy as waste heat, setting bounds on efficiency that engineers must respect.",
    keywords: ["conservation of energy", "conservation of momentum", "work energy theorem", "perpetual motion", "efficiency", "joule", "kinetic energy", "potential energy", "first law of thermodynamics", "collisions", "angular momentum"],
    source: "Joule's experiments, 1840s; standard mechanics references",
  },

  {
    docId: "nuclear-fission-fusion",
    domain: "physics-chemistry",
    title: "Nuclear fission, fusion and radioactivity",
    content: "Radioactivity, discovered by Henri Becquerel in 1896 and explored by Marie and Pierre Curie, revealed unstable nuclei emitting particles and energy. Nuclear reactions tap binding energy through mass-energy equivalence. Fission, the splitting of heavy nuclei, was discovered by Otto Hahn and Fritz Strassmann in 1938; because neutron-induced fission of uranium releases further neutrons, a chain reaction becomes possible. Enrico Fermi achieved the first self-sustaining chain reaction in Chicago Pile-1 in December 1942, and commercial reactors now supply roughly a tenth of the world's electricity. Fusion, the merging of light nuclei, powers stars through proton-proton chains at immense temperatures and pressures. Fusion promises abundant low-carbon energy, and the international ITER project in France is building a tokamak to demonstrate it, though sustained net-energy gain remains a frontier.",
    keywords: ["nuclear fission", "nuclear fusion", "radioactivity", "chain reaction", "nuclear reactor", "uranium", "mass energy equivalence", "iter", "tokamak", "curie", "becquerel", "nuclear energy"],
    source: "Becquerel 1896; Hahn and Strassmann 1938; Fermi CP-1 1942; ITER project",
  },

  {
    docId: "materials-science",
    domain: "physics-chemistry",
    title: "Materials science: alloys, semiconductors, superconductors and graphene",
    content: "Materials science tailors matter's structure to function. Alloys such as bronze and steel mix elements to gain strength, hardness or corrosion resistance, with heat treatment tuning their microstructure. Semiconductors, chiefly silicon, become useful through doping: trace phosphorus adds electrons, making n-type material, while boron removes them, making p-type; p-n junctions are the heart of every transistor and chip. Superconductivity, discovered by Heike Kamerlingh Onnes in 1911, lets certain materials carry current with zero resistance below critical temperatures and expel magnetic fields, enabling the powerful magnets of MRI scanners and particle colliders; a practical room-temperature superconductor remains undiscovered. Graphene, a one-atom-thick carbon honeycomb isolated by Andre Geim and Konstantin Novoselov in 2004, is extraordinarily strong and conductive. Composites such as carbon fiber combine lightness with stiffness for aircraft and turbine blades.",
    keywords: ["materials science", "alloys", "semiconductors", "doping", "superconductors", "graphene", "composites", "carbon fiber", "silicon", "microstructure", "metallurgy", "n type p type"],
    source: "Onnes 1911; Geim and Novoselov 2004; Nobel Prize in Physics 2010",
  },

  {
    docId: "measurement-si-units",
    domain: "physics-chemistry",
    title: "SI units, measurement, precision and accuracy",
    content: "The International System of Units builds measurement on seven base units: second, metre, kilogram, ampere, kelvin, mole and candela, with derived units such as the newton, joule, watt and volt constructed from them. In a redefinition completed in 2019, every base unit was anchored to fixed constants of nature, including the Planck constant for the kilogram and the speed of light for the metre, making standards reproducible anywhere. Precision means repeatability of measurements; accuracy means closeness to the true value, and the two are distinct: precise instruments can still be miscalibrated. Scientific notation expresses quantities as a number times a power of ten, spanning scales from subatomic particles to galaxies. Calibration chains link working instruments to national metrology institutes, underpinning manufacturing, trade and science.",
    keywords: ["si units", "metric system", "base units", "derived units", "kilogram", "planck constant", "precision", "accuracy", "scientific notation", "measurement", "calibration", "metrology"],
    source: "BIPM SI Brochure, 9th edition, 2019 revision",
  },

  // ─── Domain 2: life-sciences-medicine ─────────────────────────────────────

  {
    docId: "cell-theory-organelles",
    domain: "life-sciences-medicine",
    title: "Cell theory and the organelles of eukaryotic cells",
    content: "Cell theory, formulated by Matthias Schleiden for plants (1838) and Theodor Schwann for animals (1839), and completed by Rudolf Virchow's 1855 dictum that all cells arise from pre-existing cells, holds that all living things are made of cells and that the cell is life's basic unit. Eukaryotic cells contain a nucleus storing DNA, mitochondria that generate ATP through respiration and carry their own bacterial-derived DNA, ribosomes that synthesize proteins, and an endoplasmic reticulum and Golgi apparatus that process and ship molecules. Lysosomes digest waste, and chloroplasts perform photosynthesis in plants. Prokaryotes lack these compartments. These structures, mapped with microscopes and molecular biology, are the foundation of genetics, physiology, medicine and the study of disease.",
    keywords: ["cell theory", "cell", "organelles", "mitochondria", "nucleus", "endoplasmic reticulum", "schleiden", "schwann", "virchow", "ribosomes", "prokaryote", "eukaryote"],
    source: "Schleiden 1838; Schwann 1839; Virchow 1855",
  },

  {
    docId: "dna-central-dogma",
    domain: "life-sciences-medicine",
    title: "DNA, the double helix and the central dogma of molecular biology",
    content: "In 1953 James Watson and Francis Crick, building on Rosalind Franklin's X-ray diffraction images, notably Photo 51, and Maurice Wilkins' data, determined DNA's structure: two antiparallel strands twisted into a double helix, whose bases pair adenine with thymine and guanine with cytosine. The pairing immediately suggested a copying mechanism, and replication proved semi-conservative. The central dogma, framed by Crick, describes information flowing from DNA to RNA to protein: transcription copies genes into messenger RNA, and translation decodes triplet codons into chains of amino acids at ribosomes. Regulating which genes are expressed lets identical genomes produce hundreds of cell types. The Human Genome Project, completed in 2003, read all three billion base pairs, transforming medicine, forensics and evolutionary biology; Watson, Crick and Wilkins shared the 1962 Nobel Prize.",
    keywords: ["dna", "double helix", "watson crick", "rosalind franklin", "central dogma", "replication", "transcription", "translation", "genes", "human genome project", "base pairs", "rna"],
    source: "Watson and Crick, Nature, 1953; Crick 1958; Human Genome Project 2003",
  },

  {
    docId: "evolution-natural-selection",
    domain: "life-sciences-medicine",
    title: "Evolution by natural selection",
    content: "Charles Darwin published On the Origin of Species on 24 November 1859, arguing that species change through natural selection: individuals vary, variations are heritable, and variants better suited to their circumstances leave more offspring. Alfred Russel Wallace independently reached the same theory, prompting their joint presentation in 1858. Darwin marshaled evidence from Galapagos finches, homologous structures, vestigial organs and embryology to argue for common descent. In evolution, fitness means reproductive success, not strength. Selection combined with isolation drives speciation, the origin of new species. The modern synthesis merged Darwinism with Mendelian genetics, and later evidence, from antibiotic resistance to DNA sequence comparisons, has confirmed evolution as biology's unifying principle.",
    keywords: ["evolution", "natural selection", "darwin", "origin of species", "wallace", "fitness", "speciation", "adaptation", "common descent", "galapagos", "modern synthesis", "heredity"],
    source: "Darwin, On the Origin of Species, 1859; Darwin-Wallace joint paper, 1858",
  },

  {
    docId: "human-immune-system",
    domain: "life-sciences-medicine",
    title: "The human immune system: innate and adaptive defenses",
    content: "The human immune system layers defenses. Innate immunity responds within minutes and broadly: skin and mucous membranes, inflammation, phagocytes such as macrophages, natural killer cells and fever. Adaptive immunity is slower but precise and specific: B lymphocytes produce antibodies that tag pathogens for destruction and mature into memory cells conferring long-lasting immunity, while T lymphocytes include cytotoxic killers of infected cells and helper cells that coordinate the response. The lymphatic system's nodes, spleen and vessels house these cells and filter antigens. Vaccination safely trains adaptive immunity, and clonal selection expands matching cells enormously upon infection. Disorders span immunodeficiency, allergies and autoimmune diseases, in which the body attacks its own tissues.",
    keywords: ["immune system", "innate immunity", "adaptive immunity", "antibodies", "b cells", "t cells", "lymphatic system", "white blood cells", "vaccination", "autoimmunity", "memory cells", "inflammation"],
    source: "Standard immunology references (Janeway's Immunobiology)",
  },

  {
    docId: "vaccines-history",
    domain: "life-sciences-medicine",
    title: "A short history of vaccines",
    content: "Edward Jenner demonstrated in 1796 that inoculation with cowpox protected against smallpox, naming the technique vaccination after vacca, Latin for cow. Louis Pasteur developed attenuated vaccines against anthrax and rabies in the 1880s. The twentieth century brought Jonas Salk's injected inactivated polio vaccine (1955) and Albert Sabin's oral live vaccine, followed by vaccines against measles, mumps, rubella, hepatitis B and influenza. The World Health Organization's global campaign against smallpox succeeded with the last natural case in 1977 and eradication declared in 1980, one of medicine's greatest triumphs. COVID-19 vaccines deployed mRNA platforms at unprecedented speed. High vaccination coverage also protects those who cannot be vaccinated through herd immunity, making immunization a matter of public as well as individual health.",
    keywords: ["vaccines", "vaccination", "jenner", "smallpox", "polio", "salk", "sabin", "mrna vaccines", "herd immunity", "immunization", "pasteur", "eradication"],
    source: "Jenner 1796; WHO smallpox eradication declaration, 1980",
  },

  {
    docId: "antibiotics-resistance",
    domain: "life-sciences-medicine",
    title: "Antibiotics and the rise of antimicrobial resistance",
    content: "Alexander Fleming noticed penicillin's antibacterial action in September 1928, but Howard Florey and Ernst Chain turned it into a usable drug during World War II; the three shared the 1945 Nobel Prize. Antibiotics transformed once-fatal infections, yet resistance appeared almost immediately. Bacteria resist through enzymes that degrade drugs, pumps that expel them, altered target molecules and protective biofilms, and they spread resistance genes horizontally on plasmids. Overuse in human medicine and agriculture accelerates selection for resistant strains. The World Health Organization calls antimicrobial resistance a leading global health threat, endangering routine surgery, chemotherapy and childbirth. Stewardship, new drug classes, vaccines, rapid diagnostics and hygiene are the main countermeasures, since evolution continually undermines existing drugs.",
    keywords: ["antibiotics", "penicillin", "fleming", "antimicrobial resistance", "amr", "superbugs", "bacteria", "stewardship", "infection", "resistance genes", "florey", "chain"],
    source: "Fleming 1928; Nobel Prize in Physiology or Medicine 1945; WHO AMR reports",
  },

  {
    docId: "cancer-basics",
    domain: "life-sciences-medicine",
    title: "Cancer: mutations, oncogenes, metastasis and treatment",
    content: "Cancer arises when accumulated DNA mutations free cells from normal controls, producing uncontrolled division, evasion of cell death, recruitment of blood vessels and eventually invasion of other tissues, called metastasis, which causes most cancer deaths. Mutated growth-promoting genes become oncogenes, while disabled tumor suppressors such as p53 remove brakes. Contributors include tobacco smoke, radiation, certain viruses such as HPV and hepatitis B, and inherited mutations. Screening and prevention catch disease early: mammography, Pap smears, colonoscopy and HPV vaccination measurably cut mortality. Treatment combines surgery, chemotherapy, radiotherapy, targeted drugs against specific mutations, and immunotherapies such as checkpoint inhibitors that release brakes on T cells. Outcomes vary enormously by cancer type and stage, with steady gains in survival for many cancers.",
    keywords: ["cancer", "tumor", "oncogene", "metastasis", "mutation", "chemotherapy", "radiotherapy", "immunotherapy", "screening", "p53", "carcinogen", "malignant"],
    source: "Hanahan and Weinberg, Hallmarks of Cancer; WHO cancer fact sheets",
  },

  {
    docId: "nutrition-macronutrients",
    domain: "life-sciences-medicine",
    title: "Macronutrients, vitamins and deficiency diseases",
    content: "Macronutrients supply energy and building blocks: carbohydrates and proteins provide about four kilocalories per gram and fats about nine. Proteins digest into amino acids, of which nine are essential and must come from the diet; meat, dairy, eggs and soy supply complete protein. Fats include saturated, unsaturated and trans types, with omega-3 fatty acids essential for brain and heart health. Vitamins and minerals act in tiny amounts: vitamin C prevents scurvy, vitamin D prevents rickets, vitamin B1 prevents beriberi, niacin prevents pellagra, and vitamin A deficiency causes night blindness, while iodine prevents goiter, iron prevents anemia and calcium builds bone. Dietary fiber, water and moderation matter too: whole-diet patterns predict health better than any single nutrient.",
    keywords: ["nutrition", "macronutrients", "carbohydrates", "proteins", "fats", "vitamins", "deficiency diseases", "scurvy", "rickets", "calories", "amino acids", "balanced diet"],
    source: "WHO and FAO dietary guidance; standard nutrition references",
  },

  {
    docId: "sleep-science",
    domain: "life-sciences-medicine",
    title: "Sleep science: circadian rhythms and sleep stages",
    content: "Sleep is an active biological process essential to health. The circadian rhythm, a roughly 24-hour clock in the brain's suprachiasmatic nucleus, is set primarily by light and governs hormones, body temperature and alertness; the pineal gland secretes melatonin in darkness. Sleep cycles through stages roughly every 90 minutes: light and deep non-REM stages, when growth hormone is released and the body repairs itself, and REM sleep, when dreams occur and memories are consolidated. Chronic short sleep impairs memory, mood, immunity, glucose regulation and cardiovascular health, and it sharply raises accident risk. Sleep hygiene, meaning consistent schedules, morning light, limited caffeine and screens before bed, and cool, dark bedrooms, is the first-line behavioral treatment for insomnia.",
    keywords: ["sleep", "circadian rhythm", "melatonin", "rem sleep", "sleep hygiene", "insomnia", "suprachiasmatic nucleus", "sleep stages", "memory consolidation", "sleep deprivation", "nrem", "biological clock"],
    source: "Standard sleep-medicine references; AASM guidance",
  },

  {
    docId: "exercise-physiology",
    domain: "life-sciences-medicine",
    title: "Exercise physiology: adaptation, VO2 max and muscle fibers",
    content: "Exercise remodels the body. Regular aerobic training increases heart stroke volume, lowers resting heart rate, improves capillary density and mitochondrial volume, and raises VO2 max, the peak oxygen uptake that caps endurance performance. Skeletal muscle contains type I slow-twitch fibers, fatigue-resistant and aerobic, and type II fast-twitch fibers, powerful but quickly tired; training shifts performance within genetic limits. Resistance training causes hypertrophy as muscle protein synthesis outpaces breakdown, and bones strengthen under load. Acute exercise releases endorphins and other molecules that lift mood. The World Health Organization recommends at least 150 minutes of moderate or 75 minutes of vigorous activity weekly plus muscle-strengthening, doses associated with substantially lower cardiovascular, metabolic and cancer risk.",
    keywords: ["exercise", "physiology", "vo2 max", "muscle fibers", "cardiovascular fitness", "aerobic training", "hypertrophy", "endorphins", "slow twitch", "fast twitch", "physical activity", "endurance"],
    source: "WHO Physical Activity Guidelines, 2020; standard exercise-physiology references",
  },

  {
    docId: "mental-health",
    domain: "life-sciences-medicine",
    title: "Mental health: depression, anxiety and treatment",
    content: "Mental disorders are common, disabling and treatable. The World Health Organization estimates that roughly one person in eight worldwide lives with a mental disorder, with anxiety and depression the most common and among the leading causes of disability. Depression involves persistent low mood, loss of pleasure, and disturbed sleep, appetite and concentration; anxiety disorders involve excessive, persistent fear and avoidance. Causes combine genetic predisposition, brain circuitry, trauma and social circumstances such as poverty, debt and isolation. Stigma and shortages of care leave large treatment gaps, especially in low-income countries. Effective responses include psychotherapy, notably cognitive behavioral therapy, which retrains distorted thought patterns; medication such as antidepressants; social support and lifestyle change, often in combination. Suicide prevention and destigmatization are global public-health priorities.",
    keywords: ["mental health", "depression", "anxiety", "stigma", "cognitive behavioral therapy", "cbt", "psychiatry", "wellbeing", "antidepressants", "suicide prevention", "therapy", "who"],
    source: "WHO World Mental Health reports",
  },

  {
    docId: "epidemiology-basics",
    domain: "life-sciences-medicine",
    title: "Epidemiology basics: incidence, prevalence and R0",
    content: "Epidemiology studies patterns of health and disease in populations. Prevalence counts existing cases at a time; incidence counts new cases over a period. The basic reproduction number, R0, is the average number of secondary infections one case causes in a fully susceptible population: values above one allow epidemic growth. The herd-immunity threshold, approximately one minus one over R0 in simple models, explains why vaccination coverage sufficient to push the effective reproduction number below one halts spread. Study designs span ecological, cross-sectional, case-control, cohort and randomized controlled trials, the last the gold standard for establishing causation. Confounding, selection bias and chance threaten every inference, addressed through matching, statistical adjustment and causal criteria such as Bradford Hill's.",
    keywords: ["epidemiology", "incidence", "prevalence", "r0", "herd immunity", "study design", "randomized controlled trial", "cohort study", "case control", "confounding", "public health", "bradford hill"],
    source: "Standard epidemiology references (Rothman et al.); Bradford Hill criteria, 1965",
  },

  {
    docId: "1918-influenza-pandemic",
    domain: "life-sciences-medicine",
    title: "The 1918 influenza pandemic",
    content: "The 1918 influenza pandemic, caused by an H1N1 virus misleadingly called the Spanish flu because neutral Spain's press reported it freely during wartime censorship, swept the world in three waves: a mild spring 1918 wave, an exceptionally deadly autumn wave, and a final severe wave in early 1919. It killed an estimated 50 million people, with some estimates higher, more than World War I itself. Unusually, mortality peaked among young adults, producing a W-shaped age curve. Troop movements and overcrowding in 1918 fueled spread. With no antivirals, no antibiotics for secondary bacterial pneumonia and no flu vaccine, cities that closed schools, theaters and churches early flattened mortality curves. The pandemic reshaped public health, driving disease surveillance and pandemic planning ever since.",
    keywords: ["1918 flu", "spanish flu", "influenza pandemic", "h1n1", "pandemic waves", "50 million deaths", "world war one", "public health history", "epidemic", "mortality", "nonpharmaceutical interventions"],
    source: "CDC and WHO historical reviews of the 1918 pandemic",
  },

  {
    docId: "covid-19-pandemic",
    domain: "life-sciences-medicine",
    title: "The COVID-19 pandemic",
    content: "COVID-19, caused by the novel coronavirus SARS-CoV-2, was first identified in Wuhan, China, in December 2019. The World Health Organization declared a public health emergency in late January 2020 and characterized the outbreak as a pandemic on 11 March 2020. Governments responded with lockdowns, travel restrictions, mask mandates and mass testing while hospitals came under severe strain. Successive variants, including Alpha, Delta and the highly transmissible Omicron of late 2021, drove repeated waves. Vaccines arrived at unprecedented speed, with mRNA and adenovirus-vector platforms authorized within a year of the virus's genome publication and averting millions of deaths. The reported death toll ran into the millions, with excess mortality higher still, and post-infection syndromes known as long COVID affected many survivors, accelerating remote work and digital services.",
    keywords: ["covid 19", "sars cov 2", "coronavirus", "pandemic", "who declaration", "lockdown", "mrna vaccine", "variants", "omicron", "delta", "long covid", "wuhan"],
    source: "WHO COVID-19 timeline, 2020-2023",
  },

  {
    docId: "crispr-gene-editing",
    domain: "life-sciences-medicine",
    title: "CRISPR-Cas9 gene editing",
    content: "CRISPR-Cas9 is a gene-editing tool adapted from a bacterial immune system that stores memories of invading viruses and cuts their DNA. In 2012 Jennifer Doudna and Emmanuelle Charpentier showed that a programmable guide RNA can direct the Cas9 protein to cut any chosen DNA sequence; they shared the 2020 Nobel Prize in Chemistry. Cells then repair the break, allowing genes to be disabled, corrected or inserted. Applications span agriculture, diagnostics and research: the first CRISPR-based therapy, treating sickle-cell disease, was approved in late 2023. Ethical debate intensified after He Jiankui's 2018 unauthorized editing of human embryos in China; germline editing that passes changes to descendants is widely prohibited, while somatic editing to treat patients in the clinic advances rapidly.",
    keywords: ["crispr", "cas9", "gene editing", "doudna", "charpentier", "nobel prize", "genome engineering", "guide rna", "germline editing", "sickle cell", "biotechnology", "bioethics"],
    source: "Jinek et al., Science, 2012; Nobel Prize in Chemistry 2020",
  },

  // ─── Domain 3: technology-ai ──────────────────────────────────────────────

  {
    docId: "computing-history",
    domain: "technology-ai",
    title: "The history of computing: from Turing to Moore's law",
    content: "Modern computing began with Alan Turing's 1936 concept of a universal machine that could compute anything computable by following stored instructions, and his 1950 paper proposed an imitation game for machine intelligence now called the Turing test. ENIAC, completed in 1945 at the University of Pennsylvania, was the first general-purpose electronic computer, initially programmed by rewiring. The von Neumann architecture, described in 1945, stores instructions and data in the same memory and still defines most computers. The transistor, invented at Bell Labs in 1947 by John Bardeen, Walter Brattain and William Shockley, replaced fragile vacuum tubes, and the integrated circuit, devised independently by Jack Kilby and Robert Noyce in 1958-59, packed many transistors onto one chip. Gordon Moore's 1965 observation that chip density doubles roughly every two years forecast the exponential progress that followed.",
    keywords: ["computing history", "turing", "eniac", "von neumann", "transistor", "integrated circuit", "moore law", "stored program", "bell labs", "computer science", "silicon", "turing test"],
    source: "Turing 1936 and 1950; Bell Labs 1947; Moore 1965",
  },

  {
    docId: "how-computers-work",
    domain: "technology-ai",
    title: "How computers work: binary, CPUs, memory and operating systems",
    content: "Computers represent everything in binary, sequences of zeros and ones mapped onto electrical states. The central processing unit executes instructions through its arithmetic logic unit and control unit, synchronized by a clock; modern chips pack billions of transistors across multiple cores. Data flows through a memory hierarchy that trades speed for size: fast registers and cache close to the processor, larger main memory (RAM), and slower persistent storage such as SSDs and disks. The operating system, for example Linux, Windows or Android, manages processes, memory, files and devices, giving applications a stable interface. Programs written in high-level languages are compiled or interpreted into machine instructions. This stored-program design lets identical hardware run endlessly different software, which is why software defines what a computer can do.",
    keywords: ["computer architecture", "binary", "cpu", "memory hierarchy", "ram", "operating system", "cache", "machine code", "compiler", "hardware", "software", "processor"],
    source: "Standard computer-architecture references (von Neumann model)",
  },

  {
    docId: "internet-infrastructure",
    domain: "technology-ai",
    title: "Internet infrastructure: ARPANET, TCP/IP and the World Wide Web",
    content: "The internet grew from ARPANET, a United States research network that sent its first messages in 1969 using packet switching, which breaks data into independently routed packets, a concept developed by Paul Baran and Donald Davies. Vinton Cerf and Robert Kahn's TCP/IP protocols, adopted on ARPANET in 1983, allowed different networks to interoperate, effectively creating the internet. The domain name system, introduced in 1983, translated human-readable names into numeric addresses. In 1989 Tim Berners-Lee at CERN invented the World Wide Web, combining HTTP, HTML and URLs and releasing it freely, which turned the internet from a research tool into a mass medium. Today traffic runs mostly over fiber-optic cables, including hundreds of undersea cables linking continents, with routing distributed across thousands of independent networks.",
    keywords: ["internet", "arpanet", "tcp ip", "packet switching", "dns", "world wide web", "tim berners lee", "undersea cables", "fiber optic", "networking", "protocol", "cerf kahn"],
    source: "ARPANET and RFC history; CERN web history, 1989-1991",
  },

  {
    docId: "programming-paradigms",
    domain: "technology-ai",
    title: "Programming paradigms and the open-source movement",
    content: "Programming paradigms are styles of structuring computation. Imperative programming specifies step-by-step commands, with procedural languages like C organizing code into reusable procedures. Object-oriented programming, begun with Simula and Smalltalk, bundles data and methods into objects, using encapsulation, inheritance and polymorphism, as in Java and Python. Functional programming, rooted in lambda calculus and exemplified by Haskell, treats computation as the evaluation of pure functions avoiding shared state, easing testing and parallelism. Declarative styles describe desired results, as SQL does for queries, and most large systems mix paradigms. Alongside them, the open-source movement, catalyzed by Richard Stallman's GNU project in 1983 and Linus Torvalds' Linux kernel in 1991, proved that freely licensed, collaboratively developed software could run the world's infrastructure, from servers to smartphones.",
    keywords: ["programming paradigms", "object oriented", "functional programming", "imperative", "open source", "gnu", "linux", "encapsulation", "polymorphism", "inheritance", "lambda calculus", "software engineering"],
    source: "GNU Project 1983; Linux 1991; standard computer-science references",
  },

  {
    docId: "databases",
    domain: "technology-ai",
    title: "Databases: relational model, SQL, ACID and NoSQL",
    content: "A database stores structured data for reliable, efficient retrieval. Edgar Codd's 1970 relational model organizes data into tables of rows linked by keys; SQL, developed at IBM in the 1970s, queries and updates them. Relational databases guarantee ACID transactions, meaning atomicity, consistency, isolation and durability, so a transfer either fully commits or fully rolls back. Normalization removes redundancy, and B-tree indexes speed lookups by orders of magnitude. NoSQL systems trade some guarantees for scale and flexibility: document stores like MongoDB, key-value stores like Redis, graph databases for relationship-heavy data, and wide-column stores like Cassandra. Distributed and NewSQL systems such as Spanner combine scale with strong consistency. Database management remains among the most commercially important software categories, powering everything from banking to real-time analytics.",
    keywords: ["databases", "relational model", "sql", "acid", "nosql", "transactions", "indexing", "codd", "normalization", "mongodb", "postgres", "data storage"],
    source: "Codd, A Relational Model of Data for Large Shared Data Banks, 1970; System R and SQL history",
  },

  {
    docId: "machine-learning-fundamentals",
    domain: "technology-ai",
    title: "Machine learning fundamentals",
    content: "Machine learning lets computers improve at tasks from data rather than explicit rules. Supervised learning trains on labeled examples for classification, predicting categories, or regression, predicting numbers. Unsupervised learning finds structure in unlabeled data through clustering or dimensionality reduction. Reinforcement learning trains agents to maximize rewards through interaction with an environment. Features encode model inputs, and training adjusts parameters to minimize error. Overfitting, when a model memorizes training data including its noise, generalizes poorly, while underfitting models are too simple; the bias-variance tradeoff balances the two. Held-out test sets and cross-validation estimate real-world performance honestly. Deployment brings new concerns: data drift, monitoring, feedback loops and fairness, since a model is only as good as the data and objectives it learns from.",
    keywords: ["machine learning", "supervised learning", "unsupervised learning", "reinforcement learning", "training data", "overfitting", "features", "classification", "regression", "cross validation", "bias variance", "models"],
    source: "Standard machine-learning references (Mitchell, 1997; modern texts)",
  },

  {
    docId: "neural-networks-deep-learning",
    domain: "technology-ai",
    title: "Neural networks and deep learning",
    content: "Neural networks are layered mathematical functions loosely inspired by neurons. Frank Rosenblatt's 1958 perceptron was a single learnable layer, and the 1986 popularization of backpropagation by Rumelhart, Hinton and Williams allowed multilayer networks to train by propagating error gradients backward. Depth lets networks learn hierarchical features, edges, textures, parts, objects. The pivotal moment came in 2012, when AlexNet, a deep convolutional network by Krizhevsky, Sutskever and Hinton, trained on graphics processors, cut the ImageNet image-recognition error rate dramatically and ignited the deep-learning boom. Successes followed in speech recognition, machine translation and games, including AlphaGo's 2016 victory over a world Go champion. Progress rests on large datasets, GPU computing and techniques such as dropout, normalization and better optimizers rather than any single breakthrough.",
    keywords: ["neural networks", "deep learning", "perceptron", "backpropagation", "alexnet", "imagenet", "gpu", "convolutional", "layers", "hinton", "alphago", "artificial intelligence"],
    source: "Rumelhart, Hinton and Williams, 1986; Krizhevsky et al. (AlexNet), 2012",
  },

  {
    docId: "transformers-llms",
    domain: "technology-ai",
    title: "Transformers and large language models",
    content: "The Transformer architecture, introduced in the 2017 paper Attention Is All You Need by Vaswani and colleagues at Google, replaced recurrence with self-attention, a mechanism that weighs the relevance of every token to every other and can be trained massively in parallel. Transformers became the foundation of large language models, which learn to predict the next token across enormous text corpora and acquire surprisingly broad abilities. Google's BERT in 2018 advanced understanding tasks, while OpenAI's GPT lineage, from GPT-1 in 2018 to GPT-4 in 2023, scaled text generation into widely used assistants. Empirical scaling laws showed predictable gains from more parameters, data and compute. Instruction tuning and reinforcement learning from human feedback improved usefulness and safety, while context windows, the span a model reads at once, grew from thousands toward millions of tokens.",
    keywords: ["transformer", "large language models", "attention is all you need", "self attention", "gpt", "bert", "scaling laws", "context window", "openai", "vaswani", "next token prediction", "llm"],
    source: "Vaswani et al., Attention Is All You Need, 2017; GPT and BERT papers, 2018-2023",
  },

  {
    docId: "generative-ai",
    domain: "technology-ai",
    title: "Generative AI: diffusion models, hallucinations and prompt engineering",
    content: "Generative AI creates novel content. Text-to-image systems began with generative adversarial networks, invented by Ian Goodfellow in 2014, but diffusion models, which learn to reverse gradual noising, now dominate: DALL-E, Stable Diffusion and Midjourney produce detailed images from text prompts, and video generators extend the idea. Large language models generate essays, code and conversation, and multimodal systems handle text, images and audio together. A central failure mode is hallucination: models optimize for plausible continuations, not verified truth, so they can assert false facts fluently, requiring citations, retrieval grounding and human review. Prompt engineering, crafting instructions, examples and constraints, materially changes outputs. Controversies span training-data copyright, deepfakes, misinformation and labor impacts, spurring watermarking and content-provenance standards.",
    keywords: ["generative ai", "diffusion models", "text to image", "hallucination", "prompt engineering", "dall e", "stable diffusion", "midjourney", "gans", "deepfake", "copyright", "multimodal"],
    source: "Goodfellow (GANs), 2014; diffusion-model literature, 2020-2022",
  },

  {
    docId: "computer-vision",
    domain: "technology-ai",
    title: "Computer vision: CNNs, detection and medical imaging",
    content: "Computer vision extracts meaning from images. Convolutional neural networks, stacked layers that detect edges, textures, parts and objects, became dominant after AlexNet's 2012 victory on ImageNet, the million-image dataset organized by Fei-Fei Li's group. Core tasks include classification, labeling whole images; object detection, drawing boxes, as in the YOLO and R-CNN families; segmentation, labeling every pixel; and tracking. Facial recognition identifies individuals, raising surveillance and bias concerns that led some cities and regulators to restrict its use. High-value applications include medical imaging, from diabetic-retinopathy screening to radiology triage, autonomous driving, manufacturing inspection, crop monitoring and document parsing. Newer models train on image-text pairs at scale, enabling open-vocabulary detection and captioning, and vision increasingly pairs with language models in multimodal systems.",
    keywords: ["computer vision", "convolutional neural networks", "object detection", "yolo", "facial recognition", "image classification", "medical imaging", "segmentation", "imagenet", "perception", "autonomous driving", "cnn"],
    source: "ImageNet (Deng et al., 2009); AlexNet, 2012; standard computer-vision references",
  },

  {
    docId: "nlp",
    domain: "technology-ai",
    title: "Natural language processing",
    content: "Natural language processing (NLP) lets computers handle human language. Core steps include tokenization, splitting text into units, and embeddings, dense vectors that encode meaning, popularized by word2vec in 2013, in which similar words land near each other. Classic tasks include sentiment analysis, named entity recognition, part-of-speech tagging, summarization, question answering and machine translation, which neural and then Transformer systems transformed, roughly halving the gap to human translation on some language pairs. Speech recognition converts audio to text, powering dictation and voice assistants, with Whisper a widely used open model. Hard problems persist: ambiguity, sarcasm, low-resource languages, and grounding language in real-world knowledge, all active research fronts as language models grow in scale and capability.",
    keywords: ["natural language processing", "nlp", "tokenization", "embeddings", "word2vec", "machine translation", "speech recognition", "sentiment analysis", "bert", "whisper", "language models", "computational linguistics"],
    source: "word2vec, 2013; BERT, 2018; standard NLP references",
  },

  {
    docId: "ai-ethics-alignment",
    domain: "technology-ai",
    title: "AI ethics and alignment",
    content: "AI systems inherit patterns from their data, including bias: hiring, credit and recidivism-risk tools have shown disparate performance across demographic groups, as in the controversy over the COMPAS risk score. Fairness metrics can conflict with each other, forcing explicit tradeoffs. Explainability research, including saliency maps and SHAP values, clarifies why models decide, which matters in medicine, lending and law. Alignment research aims to make capable systems reliably pursue intended goals; reinforcement learning from human feedback, training on human preference comparisons, shaped modern chatbots, yet reward hacking and specification gaming persist. Safety work covers robustness to adversarial inputs, evaluations of dangerous capabilities, and governance of frontier models. Debates range from near-term harms like misinformation to long-term risks, shaping audits, red-teaming and responsible-release norms.",
    keywords: ["ai ethics", "bias", "fairness", "explainability", "alignment", "rlhf", "ai safety", "human feedback", "compas", "shap", "responsible ai", "governance"],
    source: "AI ethics and safety literature (fairness metrics, XAI, RLHF)",
  },

  {
    docId: "ai-regulation",
    domain: "technology-ai",
    title: "AI regulation and the EU AI Act",
    content: "Regulation of artificial intelligence crystallized in the European Union's AI Act, adopted in 2024, the first comprehensive AI law by a major economic bloc. It sorts systems by risk: unacceptable risks, including social scoring and certain real-time remote biometric surveillance, are banned; high-risk uses in hiring, credit, education and critical infrastructure face requirements for data quality, logging, human oversight and risk management; limited-risk uses such as chatbots face transparency duties, including disclosing that users are talking to a machine; and synthetic media and deepfakes must be labeled. Approaches elsewhere differ: the United States leaned on executive orders and sector-specific rules, China regulates recommendation algorithms and generative services, and international bodies pursue shared principles, amid debates over innovation, enforcement capacity and open-source models.",
    keywords: ["ai regulation", "eu ai act", "risk tiers", "deepfake labeling", "ai governance", "high risk ai", "compliance", "ai law", "technology policy", "transparency requirements", "bans", "ai act 2024"],
    source: "EU AI Act, Regulation (EU) 2024/1689",
  },

  {
    docId: "quantum-computing",
    domain: "technology-ai",
    title: "Quantum computing: qubits, Shor's algorithm and error correction",
    content: "Quantum computers manipulate qubits, which unlike classical bits can occupy superpositions of zero and one and can be entangled, correlating in ways impossible classically. Algorithms exploit this: Shor's 1994 algorithm factors integers exponentially faster than known classical methods, threatening RSA encryption, while Grover's speeds unstructured search quadratically. Hardware platforms include superconducting circuits, trapped ions, photonics and neutral atoms, all fighting decoherence, the loss of quantum information to the environment. Quantum error correction encodes one logical qubit across many physical qubits, and fault-tolerant machines will need thousands of physical qubits per logical one. Google's 2019 experiment claimed a quantum advantage on a contrived task, and companies including IBM and numerous startups pursue roadmaps toward useful applications in chemistry, materials and optimization.",
    keywords: ["quantum computing", "qubits", "superposition", "entanglement", "shor algorithm", "grover", "error correction", "decoherence", "rsa threat", "ibm quantum", "quantum supremacy", "fault tolerance"],
    source: "Shor, 1994; Google Quantum AI (Sycamore), 2019",
  },

  {
    docId: "robotics-automation",
    domain: "technology-ai",
    title: "Robotics and automation",
    content: "Robotics combines sensing, computation and actuation to act physically in the world. Unimate, deployed at General Motors in 1961, launched industrial robots, now central to welding, assembly and electronics, with Asia, above all China, dominating installations. Sensors such as cameras, lidar, encoders and inertial units feed perception algorithms, and SLAM, simultaneous localization and mapping, lets robots build maps and navigate autonomously. The open-source Robot Operating System is a community standard for robot software. Autonomous vehicles fuse these stacks on the road, and recent years brought learning-based manipulation plus humanoid programs at companies including Boston Dynamics and Tesla. Economists debate labor effects: automation displaces routine tasks while creating new ones and raising productivity, with transition pain concentrated in exposed occupations and regions.",
    keywords: ["robotics", "automation", "industrial robots", "slam", "sensors", "humanoid robots", "autonomous vehicles", "unimate", "ros", "lidar", "manufacturing", "labor impact"],
    source: "Unimate, 1961; IFR World Robotics reports",
  },

  {
    docId: "cybersecurity-fundamentals",
    domain: "technology-ai",
    title: "Cybersecurity fundamentals",
    content: "Cybersecurity protects systems and data against adversaries. Its classic triad is confidentiality, integrity and availability. Attacks include phishing emails that harvest credentials, malware families such as viruses, worms, spyware and ransomware, which encrypts data and demands payment, plus denial-of-service floods, SQL injection and supply-chain compromises of trusted software. Zero-day vulnerabilities, flaws unknown to the vendor, are prized and sometimes stockpiled by states. Defense in depth layers controls because any single layer eventually fails: least-privilege access, multi-factor authentication, encryption, firewalls, network segmentation, patching and offline backups. Detection and response, through logging, monitoring and rehearsed incident plans, matter as much as prevention. Most breaches involve human error or stolen credentials, which makes training and phishing simulation a core control, not an afterthought.",
    keywords: ["cybersecurity", "cia triad", "phishing", "malware", "ransomware", "zero day", "defense in depth", "firewall", "multi factor authentication", "data breach", "hacking", "incident response"],
    source: "NIST Cybersecurity Framework; standard security references",
  },

  {
    docId: "cryptography",
    domain: "technology-ai",
    title: "Cryptography: symmetric, asymmetric and end-to-end encryption",
    content: "Cryptography secures information through mathematics. Symmetric encryption, such as AES, uses one shared secret key for both encryption and decryption; it is fast but requires distributing the key safely. Asymmetric, or public-key, cryptography, introduced publicly by Diffie and Hellman in 1976 with RSA following in 1977 from Rivest, Shamir and Adleman, uses key pairs: a public key anyone can use to encrypt or verify, and a private key kept secret, enabling secure key exchange and digital signatures. Hash functions such as SHA-256 are one-way fingerprints used for integrity, password storage and blockchains. TLS combines these to secure web traffic through certificates, and end-to-end encryption, as in the Signal protocol, lets only the endpoints read messages. Future quantum computers threaten today's public-key systems, driving post-quantum cryptography standards.",
    keywords: ["cryptography", "encryption", "rsa", "symmetric key", "asymmetric", "public key", "hashing", "sha 256", "tls", "end to end encryption", "digital signature", "post quantum cryptography"],
    source: "Diffie-Hellman, 1976; RSA, 1977; NIST post-quantum standards, 2024",
  },

  {
    docId: "blockchain-web3",
    domain: "technology-ai",
    title: "Blockchain, Bitcoin and Web3",
    content: "A blockchain is an append-only ledger replicated across many computers, kept consistent by cryptography and consensus rules rather than a central authority. Bitcoin, described in a 2008 whitepaper by the pseudonymous Satoshi Nakamoto and launched in January 2009, introduced proof-of-work, in which miners race to add blocks and earn newly issued coins, making the transaction history prohibitively expensive to rewrite. Ethereum, proposed by Vitalik Buterin and live since 2015, added smart contracts, self-executing programs that enable decentralized finance and NFTs, and it moved to proof-of-stake in 2022, cutting its energy use dramatically and sharpening debate over proof-of-work's environmental cost. Web3 visions extend the model to identity, storage and organizations. Critics point to price volatility, scams, governance failures and scaling limits as barriers to mainstream adoption.",
    keywords: ["blockchain", "bitcoin", "ethereum", "satoshi nakamoto", "smart contracts", "proof of work", "proof of stake", "web3", "defi", "nft", "cryptocurrency", "distributed ledger"],
    source: "Nakamoto, Bitcoin: A Peer-to-Peer Electronic Cash System, 2008; Ethereum, 2015",
  },

  // ─── Domain 4: economics-finance ──────────────────────────────────────────

  {
    docId: "supply-demand-equilibrium",
    domain: "economics-finance",
    title: "Supply, demand and market equilibrium",
    content: "Markets coordinate through prices. The demand curve slopes downward because consumers buy more at lower prices; the supply curve slopes upward because producers offer more at higher prices. Where the curves intersect, quantity demanded equals quantity supplied at the equilibrium price, and there is no pressure for change. Prices above equilibrium create surpluses, inventories build and sellers cut prices; prices below create shortages, queues and upward pressure. Prices act as signals that allocate scarce resources and transmit information about scarcity and preferences. Shifts in demand or supply, caused by income, tastes, technology or input costs, move the equilibrium, while movements along a curve respond only to that good's own price. Price ceilings such as rent caps and floors such as minimum wages prevent markets from clearing, producing persistent shortages or surpluses.",
    keywords: ["supply and demand", "equilibrium price", "market", "surplus", "shortage", "price mechanism", "demand curve", "supply curve", "price ceiling", "allocation", "microeconomics", "price signals"],
    source: "Standard microeconomic theory (Marshallian supply and demand)",
  },

  {
    docId: "elasticity-economics",
    domain: "economics-finance",
    title: "Elasticity in economics",
    content: "Elasticity measures responsiveness. Price elasticity of demand is the percentage change in quantity demanded per percentage change in price: elastic goods, with many substitutes or large budget shares, respond strongly, while inelastic necessities like insulin or salt respond little. A seller's revenue rises with price only when demand is inelastic. Income elasticity distinguishes normal goods, bought more as income grows, from inferior goods, bought less; cross-price elasticity separates substitutes from complements. Elasticity determines the deadweight loss of taxation: taxing inelastic goods raises substantial revenue with small efficiency costs, which is why cigarettes and fuel attract excise duties, while taxing elastic goods distorts behavior heavily. Short-run elasticities are typically smaller than long-run ones, because consumers and producers need time to adjust.",
    keywords: ["elasticity", "price elasticity of demand", "income elasticity", "inelastic", "deadweight loss", "taxation", "substitutes", "revenue", "excise", "elastic", "consumer response", "cross elasticity"],
    source: "Standard microeconomic theory; Marshall, Principles of Economics",
  },

  {
    docId: "gdp-measurement",
    domain: "economics-finance",
    title: "Measuring GDP and its alternatives",
    content: "Gross domestic product measures the market value of final goods and services produced within a country in a period. The expenditure approach sums consumption, investment, government purchases and net exports; the income approach sums wages, profits, rents and interest, and the two must agree. Nominal GDP uses current prices, while real GDP strips out price changes with base-year or chained prices, tracked through deflators. GDP per capita approximates average living standards but misses unpaid household work, leisure, income distribution and environmental damage; rebuilding after disasters can even raise it. Alternatives include the United Nations Human Development Index, which combines health, education and income and has been published since 1990, Bhutan's Gross National Happiness, and wellbeing dashboards. None replaces GDP as a measure of production, but they correct its blind spots.",
    keywords: ["gdp", "gross domestic product", "national accounts", "nominal gdp", "real gdp", "gdp deflator", "expenditure approach", "hdi", "human development index", "gdp per capita", "limitations", "measurement"],
    source: "UN System of National Accounts; UNDP Human Development Index",
  },

  {
    docId: "inflation-causes",
    domain: "economics-finance",
    title: "Inflation and its causes",
    content: "Inflation is a sustained rise in the general price level, eroding purchasing power and, when unexpected, redistributing wealth from creditors to debtors. Demand-pull inflation arises when aggregate demand outruns productive capacity; cost-push inflation when input costs such as energy or wages rise; monetarists, following Milton Friedman, argued that persistent inflation is ultimately a monetary phenomenon, too much money chasing too few goods. Wage-price spirals can entrench it through expectations. The consumer price index tracks the cost of a household basket, wholesale price indices track producer prices, and core measures exclude volatile food and fuel. Most central banks target inflation around two percent. Extremes include Germany in 1923, Hungary in 1946 and Zimbabwe in 2008, where hyperinflation destroyed savings and money's basic functions.",
    keywords: ["inflation", "demand pull", "cost push", "cpi", "consumer price index", "wholesale price index", "hyperinflation", "weimar germany", "zimbabwe", "monetarism", "purchasing power", "wage price spiral"],
    source: "Friedman's monetarist analysis; historical hyperinflation records",
  },

  {
    docId: "unemployment-types",
    domain: "economics-finance",
    title: "Types of unemployment and the Phillips curve",
    content: "Economists distinguish unemployment types with different remedies. Frictional unemployment reflects normal search between jobs. Structural unemployment reflects skills mismatch or long-term industry decline, as when technology displaces occupations, and calls for retraining rather than stimulus. Cyclical unemployment arises from deficient demand in recessions and is what counter-cyclical policy targets. The natural rate is frictional plus structural unemployment, and an economy at it is considered at full employment. A. W. Phillips observed an inverse relation between wage inflation and unemployment in 1958, the Phillips curve, treated for years as a policy menu until 1970s stagflation, high inflation alongside high unemployment, revived models built on expectations and the NAIRU concept. Labor-force participation, underemployment and informal work broaden the picture beyond the headline unemployment rate.",
    keywords: ["unemployment", "frictional", "structural", "cyclical", "phillips curve", "natural rate", "nairu", "stagflation", "labor force", "full employment", "participation rate", "jobs"],
    source: "Phillips, 1958; standard macroeconomic references",
  },

  {
    docId: "monetary-policy",
    domain: "economics-finance",
    title: "Monetary policy and central banking",
    content: "Monetary policy is a central bank's management of money, credit and interest rates to stabilize prices and support output. Classic tools are the policy rate, the United States federal funds rate set by the Federal Reserve's FOMC and India's repo rate set by the Reserve Bank of India's Monetary Policy Committee under flexible inflation targeting of four percent; open-market operations buying or selling securities; reserve requirements; and, since 2008, quantitative easing and forward guidance. Raising rates cools credit demand and inflation; cutting them stimulates borrowing and spending. Central banks also serve as lenders of last resort to halt panics. Credible independence from short-term politics is considered essential for anchoring inflation expectations, though mandates differ, with the Fed holding a dual mandate for price stability and maximum employment.",
    keywords: ["monetary policy", "central bank", "repo rate", "interest rates", "open market operations", "quantitative easing", "inflation targeting", "federal reserve", "rbi", "lender of last resort", "money supply", "fomc"],
    source: "Federal Reserve and RBI monetary-policy frameworks",
  },

  {
    docId: "fiscal-policy",
    domain: "economics-finance",
    title: "Fiscal policy, multipliers and crowding out",
    content: "Fiscal policy uses government spending and taxation to steer demand. Expansionary policy, deficit-financed spending or tax cuts, fights recessions; contractionary policy cools booms. Keynesian analysis stresses multipliers, the extra output generated per unit of spending, which are larger when resources are idle and spending stays domestic. Automatic stabilizers cushion cycles without new legislation: progressive taxes rise in booms and unemployment benefits rise in busts. Discretionary stimulus packages, as in 2009 and 2020-21, can be powerful but slow to target. Critics warn of crowding out, in which government borrowing pushes up interest rates and displaces private investment, and of debt sustainability when debt grows faster than output. Debates over rules versus discretion, balanced-budget requirements and fiscal councils shape how forcefully governments respond.",
    keywords: ["fiscal policy", "government spending", "taxation", "multiplier", "keynesian", "automatic stabilizers", "stimulus", "crowding out", "deficit", "public debt", "expansionary", "balanced budget"],
    source: "Keynesian economics; standard public-finance references",
  },

  {
    docId: "business-cycles",
    domain: "economics-finance",
    title: "Business cycles and recession dating",
    content: "Economies fluctuate around trend in business cycles of expansion, peak, contraction and trough. In the United States, the National Bureau of Economic Research's Business Cycle Dating Committee officially dates recessions using the depth, diffusion and duration of declines across output, income, employment and sales, not the folk rule of two consecutive quarters of falling real GDP. Leading indicators, including the yield curve, which has inverted before most modern American recessions, building permits, new orders and consumer confidence, aim to give warning. Explanations range from demand shocks, credit cycles and oil prices to waves of technology and animal spirits. Notable contractions include the Great Depression of the 1930s, the 2008-09 Great Recession and the short but deep pandemic recession of 2020. Stabilization policy has dampened cycles, not abolished them.",
    keywords: ["business cycles", "recession", "expansion", "nber", "economic indicators", "yield curve", "leading indicators", "great depression", "great recession", "trough", "peak", "macroeconomics"],
    source: "NBER Business Cycle Dating Committee methodology",
  },

  {
    docId: "2008-financial-crisis",
    domain: "economics-finance",
    title: "The 2008 global financial crisis",
    content: "The 2008 global financial crisis began in the United States housing market. Years of low interest rates, securitization and lax lending inflated a subprime mortgage bubble; banks worldwide held mortgage-backed securities and written credit default swaps, including at AIG, believing risk had been dispersed when it was concentrated and correlated. House prices turned in 2006-07; Bear Stearns needed a rescue in early 2008, and Lehman Brothers failed on 15 September 2008, the largest bankruptcy in American history, freezing credit markets worldwide. Governments and central banks responded with recapitalizations, guarantees, the TARP program, near-zero interest rates and quantitative easing. The resulting Great Recession cost tens of millions of jobs globally. Reforms included the 2010 Dodd-Frank Act, bank stress tests, Basel III capital rules and central clearing of derivatives.",
    keywords: ["2008 financial crisis", "subprime mortgage", "lehman brothers", "mortgage backed securities", "credit default swaps", "great recession", "dodd frank", "tarp", "aig", "systemic risk", "bank bailout", "credit crunch"],
    source: "Financial Crisis Inquiry Commission Report, 2011",
  },

  {
    docId: "international-trade",
    domain: "economics-finance",
    title: "International trade and comparative advantage",
    content: "Trade theory begins with Adam Smith's absolute advantage and David Ricardo's 1817 principle of comparative advantage: countries gain by specializing where their opportunity cost is lowest, so trade expands consumption beyond what each country could produce alone, even when one country is better at everything. Gains are uneven, and adjustment can hurt specific industries and workers, fueling protectionism. Tariffs raise domestic prices, invite retaliation and create deadweight losses; infant-industry arguments justify temporary protection but are easily captured. The General Agreement on Tariffs and Trade, from 1947, and its successor, the World Trade Organization created in 1995, negotiated tariff reductions and adjudicate disputes. A trade deficit, imports exceeding exports, is offset by capital inflows and is not inherently a loss. Global supply chains now trade tasks and components across many countries, complicating tariff and reshoring debates.",
    keywords: ["international trade", "comparative advantage", "ricardo", "wto", "tariffs", "trade deficit", "protectionism", "globalization", "gatt", "supply chains", "free trade", "exports"],
    source: "Ricardo, On the Principles of Political Economy, 1817; WTO",
  },

  {
    docId: "exchange-rates",
    domain: "economics-finance",
    title: "Exchange rates and the international monetary system",
    content: "An exchange rate is a currency's price in another currency. Floating rates move with the supply and demand generated by trade, investment and speculation; fixed, or pegged, rates hold a band, defended with foreign-exchange reserves and interest-rate policy, and are vulnerable to speculative attacks when markets doubt the commitment, as in the 1992 crisis that pushed the pound out of Europe's exchange-rate mechanism. Managed floats intervene selectively. Purchasing-power parity holds that rates should equalize price levels in the long run but explains little in the short run. The Bretton Woods system, from 1944, pegged currencies to a dollar convertible into gold until President Nixon suspended convertibility in 1971. The dollar still dominates trade invoicing, international debt and global reserves, a position often called exorbitant privilege.",
    keywords: ["exchange rates", "fixed exchange rate", "floating", "currency", "forex reserves", "dollar dominance", "bretton woods", "purchasing power parity", "devaluation", "capital flows", "speculative attack", "nixon shock"],
    source: "Bretton Woods agreement, 1944; standard international-finance references",
  },

  {
    docId: "public-finance-taxation",
    domain: "economics-finance",
    title: "Public finance and taxation",
    content: "Public finance studies how governments tax, spend and borrow. Direct taxes fall on income and profits, including personal and corporate income tax; indirect taxes fall on transactions, including excise and value-added taxes. Progressive taxes take a rising share of income as income rises, regressive taxes a falling share, and proportional taxes a flat share; sales taxes tend to be regressive, income taxes progressive. India replaced its web of central and state indirect levies with the Goods and Services Tax in July 2017, designed through the GST Council as a unified internal market with input-tax credits and temporary compensation for states. Persistent debates include the Laffer curve claim that beyond some point higher rates collect less revenue, and the gaps among evasion, avoidance and honest compliance, which shape every tax system's yield.",
    keywords: ["public finance", "taxation", "direct tax", "indirect tax", "gst", "progressive tax", "regressive", "laffer curve", "tax evasion", "vat", "fiscal federalism", "tax base"],
    source: "GST Council, India, 2017; standard public-finance references",
  },

  {
    docId: "development-economics",
    domain: "economics-finance",
    title: "Development economics: poverty, inequality and growth",
    content: "Development economics studies how living standards rise, beyond mere output growth. The Gini coefficient measures income inequality from zero, perfect equality, to one; the Human Development Index combines life expectancy, schooling and income. The World Bank's international poverty line, expressed in purchasing-power terms and updated over time, anchors global counts of extreme poverty, which fell dramatically over recent decades, mostly because of Asian growth, even as measurement debates continue. Foreign-aid arguments set optimists like Jeffrey Sachs against skeptics like William Easterly over planning versus feedback and accountability. The middle-income trap describes economies that escape poverty then stall before reaching rich-country incomes; South Korea is the classic escapee. Lasting development pairs health, education and functioning institutions with capital, and often rides a demographic transition.",
    keywords: ["development economics", "gini coefficient", "human development index", "poverty line", "foreign aid", "middle income trap", "inequality", "economic development", "world bank", "demographic transition", "growth", "sachs easterly"],
    source: "World Bank poverty data; UNDP; Sen, Development as Freedom",
  },

  {
    docId: "behavioral-economics",
    domain: "economics-finance",
    title: "Behavioral economics: biases and nudges",
    content: "Behavioral economics imports psychology into models of choice. Daniel Kahneman and Amos Tversky documented systematic departures from strict rationality: loss aversion, losses loom larger than equivalent gains; anchoring on initial numbers; and availability and representativeness heuristics. Their prospect theory of 1979 replaced expected utility with reference-dependent, probability-weighted valuation, and Herbert Simon had earlier framed bounded rationality, the idea that people satisfice with limited information and attention. Richard Thaler applied these insights to savings, mental accounting and self-control, and with Cass Sunstein wrote Nudge (2008): choice architecture, sensible defaults and framing can steer decisions without restricting options, an approach the authors called libertarian paternalism. Applications include automatic pension enrollment and organ-donation defaults. Kahneman won the 2002 Nobel Memorial Prize in Economics, Thaler the 2017 prize.",
    keywords: ["behavioral economics", "kahneman", "tversky", "prospect theory", "nudge", "thaler", "loss aversion", "cognitive bias", "anchoring", "bounded rationality", "choice architecture", "heuristic"],
    source: "Kahneman and Tversky, 1979; Thaler and Sunstein, Nudge, 2008",
  },

  {
    docId: "financial-markets",
    domain: "economics-finance",
    title: "Financial markets: stocks, bonds and diversification",
    content: "Financial markets channel savings into investment. Stocks are equity shares conferring ownership and a residual claim on profits; bonds are loans that pay coupons and return principal, rank ahead of equity in bankruptcy and fall in price when interest rates rise. Compounding reinvests earnings, so time does the heavy lifting: the rule of 72 estimates doubling time as 72 divided by the annual percentage return. Diversification reduces risk without sacrificing expected return when returns are imperfectly correlated, the core of Harry Markowitz's portfolio theory, and indices such as the S&P 500, the Sensex and the Nifty track baskets, with low-cost index funds making diversification cheap. Risk and expected return travel together, and volatility indices gauge market fear. Bubbles from tulips to the 2000 dot-com crash show prices detaching from fundamentals at extremes.",
    keywords: ["financial markets", "stocks", "bonds", "equity", "compounding", "diversification", "index funds", "s&p 500", "sensex", "volatility", "portfolio", "risk return"],
    source: "Markowitz, 1952; standard finance references",
  },

  {
    docId: "banking-system",
    domain: "economics-finance",
    title: "The banking system, bank runs and deposit insurance",
    content: "Banks take deposits and make loans, transforming short-term liabilities into long-term assets. Under fractional-reserve banking only a share of deposits is held in reserve, so lending creates money and the money supply expands when confidence holds. A bank run occurs when depositors, fearing illiquidity, all withdraw at once; the Diamond-Dybvig model explains runs as self-fulfilling coordination failures. Deposit insurance and central banks acting as lenders of last resort largely ended classic runs for insured banks, but the failures of United States regional banks in 2023, including Silicon Valley Bank in March, showed the modern form: unrealized losses on long-duration securities plus depositors concentrated in large uninsured balances enabled withdrawal at smartphone speed. Basel capital and liquidity rules respond, while shadow banking moves risk beyond the regulated perimeter.",
    keywords: ["banking", "fractional reserve", "deposit insurance", "bank run", "diamond dybvig", "lender of last resort", "silicon valley bank", "basel iii", "capital adequacy", "money creation", "shadow banking", "credit"],
    source: "Diamond and Dybvig, 1983; Basel III; 2023 US regional-bank episode",
  },

  {
    docId: "indian-economy",
    domain: "economics-finance",
    title: "The Indian economy since 1991",
    content: "India's economy transformed after the 1991 balance-of-payments crisis, when reforms dismantled industrial licensing, the License Raj, devalued the rupee, opened trade and foreign investment, and freed much of private industry. Growth accelerated: services, especially information technology, boomed; agriculture's share of output fell to well below a fifth while still employing over two-fifths of workers; and India became one of the world's largest economies by purchasing power and among its fastest-growing major markets. Distinctive digital public infrastructure scaled nationally: Aadhaar biometric identity, mass basic bank accounts and the Unified Payments Interface, launched by NPCI in 2016, which processes billions of transactions monthly and ranks among the world's largest real-time payments systems. Whether India converts its young workforce into a demographic dividend, or loses the chance for want of jobs and skills, remains a central debate.",
    keywords: ["indian economy", "1991 reforms", "liberalization", "license raj", "upi", "digital payments", "npci", "aadhaar", "demographic dividend", "services sector", "gdp growth", "india"],
    source: "India's 1991 liberalization; NPCI UPI documentation",
  },

  {
    docId: "gig-economy-future-of-work",
    domain: "economics-finance",
    title: "The gig economy and the future of work",
    content: "The gig economy organizes work through digital platforms matching workers to tasks, from ride-hailing and delivery to freelancing and domestic services. It offers flexibility and low entry barriers but shifts risk onto workers, whose earnings fluctuate and who often lack health insurance, pensions and paid leave, sparking social-protection debates, employment-status litigation, portable-benefit proposals and minimum-earnings rules in several jurisdictions. Automation reshapes tasks rather than simply destroying jobs: automatic teller machines, for example, changed bank tellers' work as branch economics shifted. Historically technology has destroyed old occupations while creating new ones, with transition costs borne unevenly across workers and regions. Reskilling, lifelong learning and education reform dominate policy agendas, alongside experiments such as universal basic income pilots and the spread of remote work.",
    keywords: ["gig economy", "platform work", "future of work", "automation", "reskilling", "social protection", "precarity", "remote work", "universal basic income", "freelancing", "labor market", "jobs"],
    source: "ILO platform-economy reports; OECD future-of-work studies",
  },

  // ─── Domain 5: environment-climate ────────────────────────────────────────

  {
    docId: "greenhouse-effect",
    domain: "environment-climate",
    title: "The greenhouse effect and the carbon cycle",
    content: "The greenhouse effect works because sunlight arrives mainly as short-wave radiation while Earth radiates heat back as long-wave infrared, which greenhouse gases absorb and re-emit, slowing its escape to space. Naturally, this keeps Earth about 33 degrees Celsius warmer than an airless planet, making life possible. Key gases include carbon dioxide, long-lived and dominant in total warming; methane, far stronger per molecule but shorter-lived; nitrous oxide; and water vapor, which amplifies warming as a feedback. The carbon cycle exchanges carbon among atmosphere, ocean, soils and vegetation, and natural sinks absorb roughly half of human emissions. Since the industrial revolution, atmospheric carbon dioxide has risen from about 280 to over 420 parts per million, tracked since 1958 by the Keeling Curve measured at Mauna Loa, driving observed global warming.",
    keywords: ["greenhouse effect", "greenhouse gases", "carbon dioxide", "methane", "carbon cycle", "keeling curve", "global warming", "infrared radiation", "carbon sinks", "parts per million", "climate science", "water vapor feedback"],
    source: "IPCC Sixth Assessment Report; NOAA Mauna Loa records",
  },

  {
    docId: "climate-tipping-points",
    domain: "environment-climate",
    title: "Climate tipping points",
    content: "Climate tipping points are thresholds beyond which components of the Earth system shift irreversibly or self-perpetuatingly, often with hysteresis, so later cooling does not simply reverse the change. Candidates include the Greenland and West Antarctic ice sheets, whose loss would lock in meters of sea-level rise over centuries; the Atlantic Meridional Overturning Circulation, already assessed as weakened, whose collapse would reshape European and monsoon climates; Amazon rainforest dieback under deforestation plus drying; thawing permafrost releasing carbon and methane; and tropical coral reef die-off, already observed at scale during marine heatwaves. Research suggests several thresholds may lie between 1.5 and 2 degrees of warming. Overshooting a temperature target before returning raises the risk of tripping points that do not wait, sharpening the case for near-term emissions cuts.",
    keywords: ["climate tipping points", "ice sheets", "amoc", "permafrost", "amazon dieback", "coral reefs", "irreversible change", "hysteresis", "overshoot", "sea level rise", "thresholds", "nonlinear change"],
    source: "IPCC AR6; Armstrong McKay et al., Science, 2022",
  },

  {
    docId: "paris-agreement-2015",
    domain: "environment-climate",
    title: "The Paris Agreement of 2015",
    content: "The Paris Agreement, adopted on 12 December 2015 at the COP21 conference by nearly 200 parties, aims to hold the increase in global average temperature well below 2 degrees Celsius above pre-industrial levels and to pursue efforts to limit it to 1.5 degrees. Unlike the top-down targets of Kyoto, Paris rests on nationally determined contributions pledged by each country, with a ratchet mechanism requiring stronger commitments at five-year intervals, and a global stocktake, first concluded in 2023, to review collective progress. Developed countries committed to mobilizing climate finance for poorer nations, with a goal of 100 billion dollars annually later extended, and COP27 in 2022 finally agreed to establish a Loss and Damage fund for especially vulnerable countries. The United States has withdrawn, rejoined and withdrawn again as administrations changed, testing the regime's resilience.",
    keywords: ["paris agreement", "cop21", "1.5 degrees", "ndc", "nationally determined contributions", "ratchet mechanism", "global stocktake", "loss and damage", "unfccc", "cop27", "climate finance", "climate targets"],
    source: "UNFCCC Paris Agreement, 12 December 2015",
  },

  {
    docId: "carbon-pricing",
    domain: "environment-climate",
    title: "Carbon pricing: taxes and emissions trading",
    content: "Carbon pricing makes emitters pay for greenhouse-gas pollution, correcting the externality that climate damage is free to the polluter. A carbon tax sets a price per tonne of carbon dioxide; cap-and-trade sets a total cap on emissions and lets the market discover the price through tradable permits. A tax gives price certainty, a cap gives quantity certainty. The European Union Emissions Trading System, launched in 2005 as the world's first major scheme, covers power generation and heavy industry; early over-allocation of permits collapsed prices, later repaired by a declining cap and a market stability reserve. British Columbia's carbon tax is a frequently cited tax design, and the EU's Carbon Border Adjustment Mechanism, phasing in through 2026, charges imports for embedded carbon to prevent leakage. Coverage remains a minority of global emissions, and critics debate regressive incidence.",
    keywords: ["carbon pricing", "carbon tax", "cap and trade", "eu ets", "emissions trading", "cbam", "carbon border adjustment", "carbon markets", "price on carbon", "british columbia", "leakage", "externalities"],
    source: "EU ETS; World Bank State and Trends of Carbon Pricing",
  },

  {
    docId: "solar-energy",
    domain: "environment-climate",
    title: "Solar energy and photovoltaics",
    content: "Solar power converts sunlight into electricity through the photovoltaic effect, observed by Edmond Becquerel in 1839, with the first practical silicon cell built at Bell Labs in 1954. Crystalline silicon modules dominate the market today. Costs collapsed as manufacturing scaled: module prices fell roughly ninety percent between 2010 and the early 2020s, following a learning curve, making solar among the cheapest sources of new electricity in sunny regions. Integration is the frontier: output varies with weather and ends at sunset, producing the duck-curve ramp in solar-heavy grids, managed with batteries, pumped hydro, demand response and wider interconnection. India's National Solar Mission began in 2010, parks such as Bhadla in Rajasthan rank among the world's largest, and rooftop programs extend adoption beyond utilities.",
    keywords: ["solar energy", "photovoltaic", "solar panels", "silicon cells", "renewable energy", "cost decline", "grid integration", "duck curve", "india solar mission", "bhadla", "rooftop solar", "clean energy"],
    source: "IRENA renewable cost analyses; India National Solar Mission",
  },

  {
    docId: "wind-energy",
    domain: "environment-climate",
    title: "Wind energy: onshore and offshore",
    content: "Wind turbines convert the kinetic energy of moving air into electricity, and because power scales with the cube of wind speed, siting dominates economics. Onshore wind is mature and among the cheapest power sources; offshore wind taps stronger, steadier winds with larger turbines, at higher cost and engineering difficulty, using fixed-bottom foundations near shore and floating platforms for deep water. Capacity factors, actual output divided by theoretical maximum, run materially higher offshore than onshore. Denmark pioneered the industry and now draws a large share of its electricity from wind; China installs far more capacity than any other country, followed by the United States, Germany and India. Variable output demands forecasting, storage and flexible grids, while siting debates cover birds, bats, noise and land use.",
    keywords: ["wind energy", "wind turbines", "onshore wind", "offshore wind", "capacity factor", "renewable energy", "denmark wind", "floating offshore", "wind power", "intermittency", "china wind", "turbines"],
    source: "GWEC and IRENA wind-market reports",
  },

  {
    docId: "energy-transition-debate",
    domain: "environment-climate",
    title: "The energy transition debate",
    content: "Decarbonizing energy systems forces contested choices. Nuclear power offers dense, weather-independent, low-carbon electricity but carries cost overruns, construction delays, waste disposal and accident anxieties: France built a largely nuclear grid, while Germany's post-Fukushima phase-out increased its near-term coal reliance. Hydropower is dispatchable and large but constrained by ecology, displacement and drought, which climate change itself worsens. Plummeting wind and solar costs collide with variability, shifting the frontier toward batteries, long-duration storage, transmission and demand flexibility to hold grids stable. Just-transition policies address coal workers and dependent regions, from Germany's Ruhr to India's Jharkhand, and stranded-asset risk grows for fossil infrastructure. Optimal pathways differ by resource endowment, income and politics; no single technology is cheapest everywhere.",
    keywords: ["energy transition", "nuclear energy", "renewables", "grid stability", "energy storage", "hydro power", "just transition", "coal phase out", "stranded assets", "decarbonization", "fukushima", "energy mix"],
    source: "IEA net-zero studies; IPCC AR6 Working Group III",
  },

  {
    docId: "electric-vehicles",
    domain: "environment-climate",
    title: "Electric vehicles and batteries",
    content: "Electric vehicles replace combustion engines with batteries and electric motors, which convert stored energy into motion far more efficiently. Most use lithium-ion packs, with chemistries trading energy density against cost, safety and cobalt content: nickel-rich blends maximize range, while lithium-iron-phosphate offers cheaper, longer-lived cells. Charging spans slow overnight alternating current to fast direct-current stations, and infrastructure buildout remains a bottleneck alongside purchase price, though fuel and maintenance savings narrow the total cost of ownership. Lifecycle emissions depend on grid carbon intensity: manufacturing a battery creates an emissions debt, but typical driving repays it within a few years, decisively on clean grids. In India, electrification is led by two- and three-wheelers, whose smaller batteries suit usage patterns, while car adoption follows incentives, models and charging networks.",
    keywords: ["electric vehicles", "ev", "battery", "lithium ion", "charging infrastructure", "range anxiety", "lifepo4", "total cost of ownership", "two wheelers india", "grid emissions", "cobalt", "clean transport"],
    source: "IEA Global EV Outlook; standard battery references",
  },

  {
    docId: "biodiversity-crisis",
    domain: "environment-climate",
    title: "The biodiversity crisis and the 30x30 target",
    content: "Biodiversity is declining rapidly. The Intergovernmental Science-Policy Platform on Biodiversity and Ecosystem Services reported in 2019 that around one million species face extinction risk, with nature deteriorating at rates unprecedented in human history. Drivers, in rough order of impact, are land- and sea-use change, direct exploitation of organisms, climate change, pollution and invasive alien species. Scientists debate whether this constitutes a sixth mass extinction comparable to the five in the fossil record: confirmed extinctions are fewer, but current rates run far above the background rate. Biodiversity underpins ecosystem services, pollination, water purification, soil fertility and coastal protection, valued in the trillions of dollars annually. The Kunming-Montreal Global Biodiversity Framework, agreed in 2022, set the 30x30 target of protecting 30 percent of land and ocean by 2030, though implementation and finance lag the pledges.",
    keywords: ["biodiversity", "ipbes", "mass extinction", "species extinction", "habitat loss", "30x30", "kunming montreal", "ecosystem services", "protected areas", "invasive species", "conservation", "wildlife decline"],
    source: "IPBES Global Assessment, 2019; Kunming-Montreal Global Biodiversity Framework, 2022",
  },

  {
    docId: "deforestation",
    domain: "environment-climate",
    title: "Deforestation: the Amazon, palm oil and REDD+",
    content: "Deforestation, concentrated in the tropics, releases stored carbon and destroys habitat. In the Amazon, the largest rainforest, cattle ranching and soy farming drive clearing; fragmentation combined with warming and drying raises fears of a dieback tipping point, and parts of the southeast have flipped to net carbon sources in some years. Southeast Asian forests, especially Indonesia's, have lost ground to palm-oil plantations, spurring certification schemes like the RSPO and importers' traceability rules. REDD+, under the UN climate convention, pays developing countries to reduce emissions from deforestation and forest degradation, though measurement, permanence and results-based finance remain contested. Forests absorb roughly a quarter of annual human carbon dioxide emissions, so protecting them counts as a recognized climate solution; Brazil's deforestation rates have swung sharply with political enforcement, showing policy's leverage.",
    keywords: ["deforestation", "amazon rainforest", "palm oil", "redd plus", "forest carbon", "tropical forests", "land use change", "soy", "cattle ranching", "reforestation", "brazil", "certification"],
    source: "FAO Forest Resources Assessment; UNFCCC REDD+ framework",
  },

  {
    docId: "ocean-plastics",
    domain: "environment-climate",
    title: "Ocean plastics and microplastics",
    content: "Plastic waste accumulates in the oceans, transported mainly by rivers and concentrated by the great gyres into garbage patches, of which the North Pacific patch is the largest and best known, sprawling across a huge but diffuse area mostly made of fragments. Macroplastics entangle and starve marine life; sunlight and abrasion break them into microplastics, now documented from deep-sea sediments to mountain snow, in seafood and table salt, and in human blood and tissue, with health effects still under study. Single-use packaging and discarded fishing gear are dominant sources. Responses include bans on specific single-use plastics, extended producer responsibility, better waste collection and design for circularity; a 2022 United Nations resolution launched negotiations for a global plastics treaty covering the full product lifecycle, though talks over production caps remain contentious.",
    keywords: ["ocean plastic", "great pacific garbage patch", "microplastics", "marine pollution", "plastic waste", "single use plastic", "un plastics treaty", "circular economy", "ocean gyres", "fishing gear", "recycling", "marine litter"],
    source: "UNEP reports; UN Environment Assembly resolution 5/14, 2022",
  },

  {
    docId: "water-scarcity",
    domain: "environment-climate",
    title: "Water scarcity and groundwater depletion",
    content: "Freshwater is a small fraction of Earth's water, and scarcity bites where demand outstrips renewable supply. Agriculture accounts for roughly seventy percent of global freshwater withdrawals, so diets and irrigation efficiency dominate humanity's water footprint. Groundwater depletion is severe where extraction exceeds recharge, as across parts of the North China Plain, the Ogallala aquifer beneath the American Great Plains, and northwestern India's breadbasket, where water tables fall year after year. The virtual-water concept traces water embedded in traded food and goods, effectively moving water from wet to dry regions. Cities face acute stress: Cape Town's 2018 Day Zero crisis was narrowly averted, and Indian megacities such as Bengaluru, Chennai and Delhi have suffered severe shortages in drought years. Drip irrigation, wastewater reuse, rainwater harvesting, aquifer recharge and pricing all help, with governance the binding constraint.",
    keywords: ["water scarcity", "groundwater depletion", "aquifer", "agriculture water use", "virtual water", "water stress", "drip irrigation", "desalination", "rainwater harvesting", "cape town day zero", "water crisis", "freshwater"],
    source: "FAO AQUASTAT; standard hydrology and water-policy references",
  },
];
