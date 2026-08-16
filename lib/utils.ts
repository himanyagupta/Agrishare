import { Resource, MatchFactorScores, MatchResult } from "./types";

/** Formats a number as Indian Rupees using the en-IN locale (lakh/crore grouping). */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(1)} km away`;
}

export function timeAgo(daysAgo: number): string {
  if (daysAgo === 0) return "Listed today";
  if (daysAgo === 1) return "Listed yesterday";
  if (daysAgo < 7) return `Listed ${daysAgo} days ago`;
  const weeks = Math.round(daysAgo / 7);
  return `Listed ${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

/**
 * Rule-based matching engine (prototype stand-in for the eventual backend).
 * Every factor is derived transparently from fields already on the Resource,
 * so the score can be explained on-screen during the demo:
 *
 *  - distance:      closer resources score higher, capped at 40 km
 *  - cost:          cheaper resources score higher relative to the category's price band
 *  - availability:  "available now" scores highest, "upcoming" partial, "booked" lowest
 *  - demandFit:     how well the resource type matches the requested type
 */
export function scoreResource(
  resource: Resource,
  opts: { requestedType?: string; maxPrice?: number } = {}
): MatchFactorScores {
  const distanceScore = Math.max(0, 100 - (resource.location.distanceKm / 40) * 100);

  const priceCeiling = opts.maxPrice ?? (resource.price * 1.6 || 1);
  const costScore = Math.max(
    0,
    Math.min(100, 100 - (resource.price / priceCeiling) * 60)
  );

  const availabilityScore =
    resource.availability.status === "available"
      ? 100
      : resource.availability.status === "upcoming"
      ? 55
      : 15;

  const demandFit =
    !opts.requestedType || opts.requestedType === resource.type ? 95 : 45;

  return {
    distance: Math.round(distanceScore),
    cost: Math.round(costScore),
    availability: Math.round(availabilityScore),
    demandFit: Math.round(demandFit),
  };
}

export function overallScore(factors: MatchFactorScores): number {
  // Weighted blend: distance and availability matter most for a same-day rural exchange.
  const weighted =
    factors.distance * 0.35 +
    factors.availability * 0.3 +
    factors.cost * 0.2 +
    factors.demandFit * 0.15;
  return Math.round(weighted);
}

export function buildMatches(
  resources: Resource[],
  opts: { requestedType?: string; maxPrice?: number } = {}
): MatchResult[] {
  return resources
    .map((resource) => {
      const factors = scoreResource(resource, opts);
      return { resource, factors, overallScore: overallScore(factors) };
    })
    .sort((a, b) => b.overallScore - a.overallScore);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
