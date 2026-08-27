// Real Government of India (and select state) schemes relevant to farmers,
// prioritizing ones directly tied to what AgriShare is about: machinery
// access/subsidy and crop residue management. Details researched from
// official scheme portals and current government sources — not invented.
// Government schemes change over time (budgets, limits, extensions), so
// each entry links to the official portal for the current, authoritative
// details rather than treating anything here as final.

export type SchemeCategory =
  | "Income Support"
  | "Crop Insurance"
  | "Credit & Loans"
  | "Machinery Subsidy"
  | "Residue Management"
  | "Market Access";

export interface GovtScheme {
  id: string;
  name: string;
  shortName: string;
  category: SchemeCategory;
  icon: string;
  tagline: string;
  description: string;
  keyBenefit: string;
  eligibility: string[];
  howToApply: string;
  officialUrl: string;
  officialUrlLabel: string;
}

export const govtSchemes: GovtScheme[] = [
  {
    id: "pm-kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi",
    shortName: "PM-KISAN",
    category: "Income Support",
    icon: "💰",
    tagline: "₹6,000/year direct income support for landholding farmer families",
    description:
      "A central scheme giving every eligible landholding farmer family direct cash support, paid in three instalments straight to their bank account — no middlemen involved.",
    keyBenefit: "₹6,000 per year, in 3 instalments of ₹2,000",
    eligibility: [
      "Landholding farmer family (husband, wife, minor children) with cultivable land",
      "Valid Aadhaar linked to an active bank account",
      "Institutional landholders and income-tax payers are excluded",
    ],
    howToApply: "Register online, or through your nearest Common Service Centre (CSC).",
    officialUrl: "https://pmkisan.gov.in",
    officialUrlLabel: "pmkisan.gov.in",
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana",
    shortName: "PMFBY",
    category: "Crop Insurance",
    icon: "🌦️",
    tagline: "Low-premium crop insurance against natural calamities, pests and disease",
    description:
      "Covers yield loss, prevented sowing, and post-harvest damage for notified crops. Premiums are kept deliberately low — the government subsidizes the rest.",
    keyBenefit: "Farmer premium as low as 1.5–2% of sum insured (Kharif/Rabi)",
    eligibility: [
      "Owner and tenant farmers growing notified crops in notified areas",
      "Both loanee and non-loanee farmers can apply",
      "Enrolment is voluntary since 2020",
    ],
    howToApply: "Apply online, through your bank, or via a Common Service Centre before the season's cut-off date.",
    officialUrl: "https://pmfby.gov.in",
    officialUrlLabel: "pmfby.gov.in",
  },
  {
    id: "kcc",
    name: "Kisan Credit Card",
    shortName: "KCC",
    category: "Credit & Loans",
    icon: "💳",
    tagline: "Low-interest revolving credit for crop and farm equipment expenses",
    description:
      "Works like a credit card built for farming — draw, repay, and re-draw funds through the crop cycle for seeds, fertilizer, equipment and allied activities like dairy or fisheries.",
    keyBenefit: "Effective interest as low as ~4% p.a. with timely repayment (subvention applied)",
    eligibility: [
      "Owner cultivators, tenant farmers, sharecroppers, and joint liability groups",
      "Dairy, fisheries and animal husbandry farmers also eligible",
      "PM-KISAN beneficiaries get fast-tracked approval",
    ],
    howToApply: "Visit any public, private, or cooperative bank branch with land and identity documents.",
    officialUrl: "https://www.myscheme.gov.in/schemes/kcc",
    officialUrlLabel: "myscheme.gov.in",
  },
  {
    id: "smam",
    name: "Sub-Mission on Agricultural Mechanization",
    shortName: "SMAM",
    category: "Machinery Subsidy",
    icon: "🚜",
    tagline: "Subsidized tractors, tillers and farm machinery — directly relevant to listings on AgriShare",
    description:
      "Helps farmers buy machinery at subsidized rates, and funds Custom Hiring Centres and Farm Machinery Banks so small and marginal farmers without capital to own equipment can still rent it cheaply nearby.",
    keyBenefit: "Subsidy of roughly 40–50% on eligible farm machinery purchases",
    eligibility: [
      "All categories of farmers, with priority for small, marginal, and women farmers",
      "Farmer groups, FPOs, and cooperatives can apply for Custom Hiring Centres",
      "Documents: Aadhaar, land records, caste certificate (if applicable)",
    ],
    howToApply: "Apply through your state agriculture department's mechanization portal.",
    officialUrl: "https://agrimachinery.nic.in",
    officialUrlLabel: "agrimachinery.nic.in",
  },
  {
    id: "crm",
    name: "Crop Residue Management Scheme",
    shortName: "CRM Scheme",
    category: "Residue Management",
    icon: "🌾",
    tagline: "Subsidized machinery to manage stubble instead of burning it — directly relevant to AgriShare's residue listings",
    description:
      "A dedicated central scheme (running since 2018-19) to end stubble burning by subsidizing in-situ and ex-situ residue management machines like Super Seeders and Happy Seeders, and by funding Custom Hiring Centres for shared access.",
    keyBenefit: "Up to 50% subsidy for individual farmers, up to 80% for Custom Hiring Centres/FPOs on eligible machines",
    eligibility: [
      "Individual farmers, cooperatives, FPOs, and panchayats",
      "Currently focused on Punjab, Haryana, Uttar Pradesh, Madhya Pradesh and NCT Delhi",
      "Some states add direct per-acre incentives for not burning residue",
    ],
    howToApply: "Apply via your state's agriculture machinery portal (e.g. agrimachinerypb.com for Punjab).",
    officialUrl: "https://agricoop.gov.in",
    officialUrlLabel: "agricoop.gov.in",
  },
  {
    id: "enam",
    name: "National Agriculture Market",
    shortName: "e-NAM",
    category: "Market Access",
    icon: "🏪",
    tagline: "The government's own online mandi network — sell produce beyond your local market",
    description:
      "A pan-India electronic trading platform connecting existing mandis so farmers can get real-time price discovery, sell to buyers outside their district, and receive payment directly into their bank account.",
    keyBenefit: "Access to buyers in any connected mandi, with online, transparent price discovery",
    eligibility: [
      "Any registered farmer with produce to sell",
      "Land should be recorded in the applicant's name",
      "Active, Aadhaar-seeded bank account required for payments",
    ],
    howToApply: "Register free on the e-NAM portal or app, or through your local APMC mandi.",
    officialUrl: "https://enam.gov.in",
    officialUrlLabel: "enam.gov.in",
  },
];

export const SCHEME_CATEGORIES: SchemeCategory[] = [
  "Income Support",
  "Crop Insurance",
  "Credit & Loans",
  "Machinery Subsidy",
  "Residue Management",
  "Market Access",
];
