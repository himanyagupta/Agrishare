import { Resource, Availability, MachineryType, ResidueType, DemandPost, DemandUrgency } from "@/lib/types";
import { Database } from "./types";

type DBResource = Database["public"]["Tables"]["resources"]["Row"];
type DBDemandPost = Database["public"]["Tables"]["demand_posts"]["Row"];

/** Haversine distance in km between two lat/lng points. */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Splits a free-text "Village, District, State" location string for LocationBadge. */
export function parseLocation(location: string) {
  const parts = location.split(",").map((s) => s.trim());
  return {
    village: parts[0] || location,
    district: parts[1] || "",
    state: parts[2] || "",
  };
}

/** Masks all but the last 2 digits of a phone number, e.g. "9829012341" -> "••••••••41". */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  return `${"•".repeat(digits.length - 2)}${digits.slice(-2)}`;
}

function toAvailability(status: DBResource["status"]): Availability {
  switch (status) {
    case "available":
      return { status: "available", detail: "Available now" };
    case "booked":
      return { status: "booked", detail: "Currently booked" };
    case "upcoming":
      return { status: "upcoming", detail: "Available soon" };
  }
}

/**
 * Maps a raw `resources` row (+ optional joined owner data) to the `Resource`
 * shape the existing UI components (ResourceCard, badges, etc.) already
 * expect — so none of those components need to change.
 */
export function dbResourceToUI(
  row: DBResource,
  opts: {
    ownerName?: string;
    ownerPhone?: string | null;
    fromLat?: number | null;
    fromLng?: number | null;
  } = {}
): Resource {
  const { village, district, state } = parseLocation(row.location);

  const distanceKm =
    opts.fromLat != null && opts.fromLng != null && row.latitude != null && row.longitude != null
      ? haversineKm(opts.fromLat, opts.fromLng, row.latitude, row.longitude)
      : 0;

  const listedDaysAgo = Math.max(
    0,
    Math.floor((Date.now() - new Date(row.created_at).getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    id: row.id,
    category: row.category === "machinery" ? "machinery" : "residue",
    type: row.type as MachineryType | ResidueType,
    title: row.name,
    description: row.description ?? "",
    ownerName: opts.ownerName ?? "AgriShare user",
    ownerVillageYears: 0,
    location: { village, district, state, distanceKm },
    price: Number(row.price),
    priceUnit: row.price_unit as Resource["priceUnit"],
    availability: toAvailability(row.status),
    quantity: row.category === "crop_residue" ? row.quantity ?? undefined : undefined,
    condition: row.category === "machinery" ? row.quantity ?? undefined : undefined,
    icon: row.category === "machinery" ? "🚜" : "🌾",
    listedDaysAgo,
    rating: 0,
    ratingCount: 0,
    contactPhone: opts.ownerPhone ? maskPhone(opts.ownerPhone) : "Shown after request",
    tags: [],
  };
}

function urgencyFromRequiredDate(requiredDate: string | null): DemandUrgency {
  if (!requiredDate) return "low";
  const days = Math.ceil((new Date(requiredDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days <= 5) return "high";
  if (days <= 15) return "medium";
  return "low";
}

/**
 * Maps a raw `demand_posts` row to the `DemandPost` shape the existing
 * DemandCard component expects. A few fields (urgency, responders count)
 * don't exist in the schema yet, so they're derived/defaulted here rather
 * than stored — see the comments below.
 */
export function dbDemandToUI(row: DBDemandPost, opts: { requestedByName?: string } = {}): DemandPost {
  const { village, district, state } = parseLocation(row.location);
  const postedDaysAgo = Math.max(
    0,
    Math.floor((Date.now() - new Date(row.created_at).getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    id: row.id,
    category: row.category === "machinery" ? "machinery" : "residue",
    type: row.resource_type as MachineryType | ResidueType,
    title: `Looking for ${row.resource_type}`,
    requestedBy: opts.requestedByName ?? "AgriShare user",
    location: { village, district, state, distanceKm: 0 },
    quantityNeeded: row.quantity ?? "Not specified",
    neededBy: row.required_date
      ? new Date(row.required_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      : "Flexible",
    budget: row.budget ?? "Open to offers",
    urgency: urgencyFromRequiredDate(row.required_date),
    respondersCount: 0, // no response-tracking feature yet
    postedDaysAgo,
    notes: "",
  };
}
