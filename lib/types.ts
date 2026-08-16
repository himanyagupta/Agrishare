// Core domain types for AgriShare.
// Kept in one place so backend integration (Supabase) can later
// generate/replace these without touching component code.

export type ResourceCategory = "machinery" | "residue";

export type MachineryType =
  | "Tractor"
  | "Rotavator"
  | "Combine Harvester"
  | "Seed Drill"
  | "Power Tiller"
  | "Sprayer"
  | "Thresher"
  | "Laser Land Leveller"
  | "Baler";

export type ResidueType =
  | "Wheat Straw (Bhusa)"
  | "Paddy Straw"
  | "Sugarcane Trash"
  | "Cotton Stalks"
  | "Maize Stover"
  | "Mustard Husk"
  | "Groundnut Shells";

export type PriceUnit =
  | "per hour"
  | "per day"
  | "per acre"
  | "per quintal"
  | "per tonne";

export type AvailabilityStatus = "available" | "booked" | "upcoming";

export interface Availability {
  status: AvailabilityStatus;
  detail: string; // human-readable, e.g. "Free after 22 Aug" or "Booked till 19 Aug"
}

export interface ResourceLocation {
  village: string;
  district: string;
  state: string;
  distanceKm: number; // distance from the current user, mock-computed
}

export interface Resource {
  id: string;
  category: ResourceCategory;
  type: MachineryType | ResidueType;
  title: string;
  description: string;
  ownerName: string;
  ownerVillageYears: number; // years the owner has been farming, adds realism
  location: ResourceLocation;
  price: number;
  priceUnit: PriceUnit;
  availability: Availability;
  quantity?: string; // for residues, e.g. "40 quintals"
  condition?: string; // for machinery, e.g. "Well maintained, 2019 model"
  icon: string; // emoji used as a lightweight visual, no image assets needed
  listedDaysAgo: number;
  rating: number; // 0-5
  ratingCount: number;
  contactPhone: string; // masked for the prototype
  tags: string[];
}

export type DemandUrgency = "low" | "medium" | "high";

export interface DemandPost {
  id: string;
  category: ResourceCategory;
  type: MachineryType | ResidueType;
  title: string;
  requestedBy: string;
  location: ResourceLocation;
  quantityNeeded: string;
  neededBy: string; // human-readable date/window
  budget: string; // human-readable budget range
  urgency: DemandUrgency;
  respondersCount: number;
  postedDaysAgo: number;
  notes: string;
}

export interface MatchFactorScores {
  distance: number; // 0-100
  cost: number; // 0-100
  availability: number; // 0-100
  demandFit: number; // 0-100
}

export interface MatchResult {
  resource: Resource;
  overallScore: number; // 0-100
  factors: MatchFactorScores;
}
