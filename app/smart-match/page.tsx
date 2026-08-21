"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { resources } from "@/lib/mockData";
import { buildMatches } from "@/lib/utils";
import { ResourceCategory } from "@/lib/types";
import MatchScore from "@/components/MatchScore";
import ResourceTypeBadge from "@/components/ResourceTypeBadge";
import LocationBadge from "@/components/LocationBadge";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

const ALL_TYPES = Array.from(new Set(resources.map((r) => r.type))).sort();

function SmartMatchContent() {
  const searchParams = useSearchParams();
  const presetType = searchParams.get("type") ?? "";

  const [category, setCategory] = useState<ResourceCategory>("machinery");
  const [type, setType] = useState<string>(presetType);
  const [maxDistance, setMaxDistance] = useState(50);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [ran, setRan] = useState(Boolean(presetType));

  const typeOptions = useMemo(
    () =>
      Array.from(
        new Set(resources.filter((r) => r.category === category).map((r) => r.type))
      ).sort(),
    [category]
  );

  const matches = useMemo(() => {
    const pool = resources.filter(
      (r) => r.category === category && r.location.distanceKm <= maxDistance
    );
    return buildMatches(pool, { requestedType: type || undefined, maxPrice }).slice(0, 6);
  }, [category, type, maxDistance, maxPrice]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="kl-section-eyebrow text-field-700">Matching engine</span>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Smart Match</h1>
      <p className="mt-2 max-w-2xl text-field-600">
        Tell AgriShare what you need. The prototype engine below ranks nearby listings using a
        transparent, rule-based score — distance, availability, cost fit and demand match — so
        you can see exactly why each result is recommended.
      </p>
      <p className="mt-2 max-w-2xl text-xs text-field-500">
        This preview still runs on sample listings, not your live AgriShare data — real-data
        matching is planned for the next milestone.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Controls */}
        <div className="kl-card h-fit space-y-5 p-5 lg:sticky lg:top-24">
          <div>
            <label className="kl-label"> I&apos;m looking for</label>
            <div className="grid grid-cols-2 gap-2">
              {(["machinery", "residue"] as ResourceCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setType("");
                  }}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    category === cat
                      ? "border-field-600 bg-field-700 text-white"
                      : "border-field-200 text-field-700 hover:bg-field-50"
                  }`}
                >
                  {cat === "machinery" ? "🚜 Machinery" : "🌾 Residue"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="matchType" className="kl-label">
              Specific type (optional)
            </label>
            <select
              id="matchType"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="kl-input"
            >
              <option value="">Any {category === "machinery" ? "machinery" : "residue"} type</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="matchDistance" className="kl-label">
              Within {maxDistance} km
            </label>
            <input
              id="matchDistance"
              type="range"
              min={5}
              max={50}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-field-700"
            />
          </div>

          <div>
            <label htmlFor="matchPrice" className="kl-label">
              Budget ceiling: {formatINR(maxPrice)}
            </label>
            <input
              id="matchPrice"
              type="range"
              min={100}
              max={3000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-field-700"
            />
          </div>

          <button type="button" onClick={() => setRan(true)} className="kl-btn-primary w-full">
            Find My Matches
          </button>
        </div>

        {/* Results */}
        <div>
          {!ran ? (
            <div className="kl-card flex flex-col items-center gap-2 p-16 text-center">
              <span className="text-3xl">🎯</span>
              <p className="font-display text-lg font-semibold text-field-900">
                Set your requirements and run Smart Match
              </p>
              <p className="max-w-sm text-sm text-field-500">
                Choose what you need on the left, then click &ldquo;Find My Matches&rdquo; to see
                ranked results with a full score breakdown.
              </p>
            </div>
          ) : matches.length === 0 ? (
            <div className="kl-card p-10 text-center text-field-500">
              No listings currently fit those filters. Try widening the distance or budget.
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-field-500">
                {matches.length} ranked match{matches.length !== 1 ? "es" : ""}
              </p>
              {matches.map(({ resource, overallScore, factors }, i) => (
                <div key={resource.id} className="kl-card flex flex-col gap-4 p-5 sm:flex-row">
                  <div className="flex items-center justify-center sm:w-24">
                    <MatchScore score={overallScore} size="lg" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {i === 0 && (
                        <span className="rounded-full bg-turmeric-400 px-2.5 py-1 text-xs font-semibold text-soil-900">
                          Best match
                        </span>
                      )}
                      <ResourceTypeBadge category={resource.category} />
                      <AvailabilityBadge availability={resource.availability} />
                    </div>
                    <p className="mt-2 font-display text-lg font-semibold text-field-900">
                      {resource.title}
                      <span className="ml-2 align-middle text-xs font-sans font-normal text-field-400">
                        (sample listing)
                      </span>
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-field-600">
                      <LocationBadge location={resource.location} />
                      <span>·</span>
                      <span>
                        {formatINR(resource.price)} {resource.priceUnit}
                      </span>
                    </div>
                  </div>

                  <div className="sm:w-56">
                    <MatchScore score={overallScore} factors={factors} showBreakdown size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SmartMatchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">Loading…</div>}>
      <SmartMatchContent />
    </Suspense>
  );
}
