// Practical-use reference content for the Knowledge Hub. Written from
// well-established, general agricultural knowledge (not sourced from a
// single external site) — the kind of thing an experienced extension
// officer would tell a farmer about what a piece of machinery or a residue
// type is actually good for. Matches the same type names used in
// lib/mockData.ts and the List a Resource form, so this stays consistent
// with the rest of the platform.

export type KnowledgeCategory = "machinery" | "residue";

export interface KnowledgeEntry {
  id: string;
  name: string;
  category: KnowledgeCategory;
  icon: string;
  summary: string;
  bestFor: string[];
  tips: string[];
}

export const knowledgeEntries: KnowledgeEntry[] = [
  {
    id: "tractor",
    name: "Tractor",
    category: "machinery",
    icon: "🚜",
    summary:
      "The most versatile machine on a farm — on its own it just pulls, but attachments turn it into almost any tool you need.",
    bestFor: [
      "Ploughing and land preparation before sowing",
      "Hauling trolleys of produce, fertilizer, or residue",
      "Powering attached implements (rotavator, seed drill, sprayer) via the PTO shaft",
    ],
    tips: [
      "Horsepower (HP) matters — under 35 HP suits small plots, 45 HP+ suits larger fields or heavier implements",
      "Ask whether the rental includes an operator or if you're expected to drive it yourself",
    ],
  },
  {
    id: "rotavator",
    name: "Rotavator",
    category: "machinery",
    icon: "⚙️",
    summary:
      "Breaks up and levels soil in a single pass, mixing crop stubble into the soil instead of leaving it on top.",
    bestFor: [
      "Seedbed preparation before sowing wheat, mustard, or vegetables",
      "Working leftover stubble into the soil instead of burning it",
    ],
    tips: [
      "Needs to be matched to your tractor's HP — an underpowered tractor will struggle to pull it through hard soil",
      "Best used shortly after harvest, while the soil still has some moisture",
    ],
  },
  {
    id: "combine-harvester",
    name: "Combine Harvester",
    category: "machinery",
    icon: "🌾",
    summary:
      "Cuts, threshes, and cleans grain in one pass — the single biggest time-saver at harvest, but priced per acre since it's expensive to run.",
    bestFor: [
      "Harvesting wheat, paddy, and mustard quickly before weather risk",
      "Large or medium plots where hand-harvesting would take too many labourers",
    ],
    tips: [
      "Book well ahead of your harvest window — combines get booked solid right before monsoon or a weather change",
      "Straw comes out chopped and spread by most combines — decide in advance if you want it baled separately",
    ],
  },
  {
    id: "seed-drill",
    name: "Seed Drill",
    category: "machinery",
    icon: "🌱",
    summary:
      "Places seed and fertilizer at a consistent depth and spacing in one pass, instead of broadcasting seed by hand.",
    bestFor: [
      "Sowing wheat, gram, and mustard evenly, which improves germination rates",
      "Saving seed — precision placement uses noticeably less seed than broadcasting",
    ],
    tips: [
      "Calibrate the seed rate for your specific crop before starting — ask the owner if it was calibrated for the previous user's crop",
    ],
  },
  {
    id: "power-tiller",
    name: "Power Tiller",
    category: "machinery",
    icon: "🛠️",
    summary:
      "A lighter, walk-behind alternative to a tractor — easier to move between small or oddly shaped plots.",
    bestFor: [
      "Small plots and kitchen-garden-scale vegetable beds",
      "Areas a full-size tractor can't easily access",
    ],
    tips: ["Not a substitute for a tractor on large open fields — it's slower per acre but far more manoeuvrable"],
  },
  {
    id: "sprayer",
    name: "Sprayer",
    category: "machinery",
    icon: "💦",
    summary:
      "Applies pesticide, herbicide, or liquid fertilizer evenly across a field — a boom sprayer covers far more ground per hour than manual spraying.",
    bestFor: [
      "Pest and disease control across large fields",
      "Foliar fertilizer application",
    ],
    tips: [
      "Check the nozzle spacing matches your row spacing to avoid uneven coverage",
      "Spray early morning or evening — midday heat causes faster evaporation and weaker results",
    ],
  },
  {
    id: "thresher",
    name: "Thresher",
    category: "machinery",
    icon: "🌽",
    summary:
      "Separates grain from the harvested plant — used after hand-harvesting or where a combine wasn't used.",
    bestFor: ["Post-harvest processing of wheat, gram, and mustard cut by hand or sickle"],
    tips: ["Output rate (quintals/hour) varies a lot by model — ask before booking if you have a large quantity to process in a day"],
  },
  {
    id: "laser-land-leveller",
    name: "Laser Land Leveller",
    category: "machinery",
    icon: "📐",
    summary:
      "Uses a laser-guided blade to make a field perfectly flat — pays off through water savings for years afterward.",
    bestFor: [
      "Improving irrigation efficiency — water spreads evenly instead of pooling in low spots",
      "More uniform germination since low spots won't get waterlogged",
    ],
    tips: ["A one-time investment per field that keeps paying off — worth doing before a new cropping cycle, not mid-season"],
  },
  {
    id: "wheat-straw",
    name: "Wheat Straw (Bhusa)",
    category: "residue",
    icon: "🌾",
    summary: "Dry stalks left after wheat harvest — one of the most in-demand residues because cattle actually eat it.",
    bestFor: [
      "Cattle and buffalo fodder — this is the primary market for wheat straw",
      "Mulching around vegetable beds to retain soil moisture",
    ],
    tips: ["Keep it dry and covered in storage — wet bhusa moulds quickly and becomes unusable as fodder"],
  },
  {
    id: "paddy-straw",
    name: "Paddy Straw",
    category: "residue",
    icon: "🍄",
    summary:
      "Rice stalks left after harvest — historically burned in the field, but has real value if collected instead.",
    bestFor: [
      "Substrate for mushroom cultivation (a genuinely profitable use, not just a fallback)",
      "Animal bedding and, to a lesser extent, low-grade fodder",
    ],
    tips: ["Collect and bale it soon after harvest — leaving it in the field is exactly what leads to it being burned"],
  },
  {
    id: "cotton-stalks",
    name: "Cotton Stalks",
    category: "residue",
    icon: "🔥",
    summary: "Woody stalks left after cotton picking — too tough for fodder, but well suited as a fuel feedstock.",
    bestFor: [
      "Biomass briquetting and fuel-grade use for boilers or biomass power",
      "Rarely used as fodder — the stalk is too woody",
    ],
    tips: ["Buyers price this by dryness and cleanliness — remove excess soil/debris before offering it for sale"],
  },
  {
    id: "maize-stover",
    name: "Maize Stover",
    category: "residue",
    icon: "🌽",
    summary: "The leaves, stalks and cobs left after maize harvest — bulky, but useful in more than one way.",
    bestFor: [
      "Silage-making for cattle feed (chopped and fermented)",
      "Traditional roof thatching in some regions",
    ],
    tips: ["Silage-quality stover needs to be relatively fresh — don't let it dry out too long before chopping if that's the intended use"],
  },
  {
    id: "mustard-husk",
    name: "Mustard Husk",
    category: "residue",
    icon: "🌼",
    summary: "Leftover husk after mustard threshing — a lower-value residue, but still useful close to the farm.",
    bestFor: [
      "Composting to build up soil organic matter",
      "Low-cost supplement mixed into cattle feed",
    ],
    tips: ["Best used or sold locally — it's rarely worth transporting long distances given its lower per-quintal value"],
  },
  {
    id: "sugarcane-trash",
    name: "Sugarcane Trash",
    category: "residue",
    icon: "🎋",
    summary: "The leafy trash cleared after cane cutting — usually burned in the field, but collectible for other uses.",
    bestFor: [
      "Mulching sugarcane or other fields to retain moisture and suppress weeds",
      "Biomass fuel feedstock, similar to cotton stalks",
    ],
    tips: ["Field-collection right after cutting avoids the trash drying out and becoming a fire hazard if left in place"],
  },
  {
    id: "groundnut-shells",
    name: "Groundnut Shells",
    category: "residue",
    icon: "🥜",
    summary: "Shells left after groundnut processing — light, but genuinely useful as a fuel and filler material.",
    bestFor: [
      "Biomass fuel and fuel-briquette feedstock",
      "Low-grade filler in animal bedding",
    ],
    tips: ["Store dry — shells absorb moisture easily, which lowers their value as a fuel feedstock"],
  },
];
