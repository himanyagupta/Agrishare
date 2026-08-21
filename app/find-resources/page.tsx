"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getResources } from "@/lib/supabase/queries";
import { dbResourceToUI } from "@/lib/supabase/adapters";
import { Resource } from "@/lib/types";
import FilterBar, { DEFAULT_FILTERS, FilterState } from "@/components/FilterBar";
import ResourceCard from "@/components/ResourceCard";

export default function FindResourcesPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function load() {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      let fromLat: number | null = null;
      let fromLng: number | null = null;
      if (userData.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("latitude, longitude")
          .eq("id", userData.user.id)
          .maybeSingle();
        fromLat = profile?.latitude ?? null;
        fromLng = profile?.longitude ?? null;
      }

      const { data, error: fetchError } = await getResources(supabase);
      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setResources([]);
      } else {
        setResources((data ?? []).map((row) => dbResourceToUI(row, { fromLat, fromLng })));
      }
      setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const typeOptions = useMemo(
    () => Array.from(new Set(resources.map((r) => r.type))).sort(),
    [resources]
  );

  const filtered = useMemo(() => {
    let list = resources.filter((r) => {
      if (filters.category !== "all" && r.category !== filters.category) return false;
      if (filters.type !== "all" && r.type !== filters.type) return false;
      if (r.location.distanceKm > filters.maxDistance && r.location.distanceKm > 0) return false;
      if (filters.availabilityOnly && r.availability.status !== "available") return false;
      if (filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        const haystack = `${r.title} ${r.type} ${r.location.village} ${r.location.district} ${r.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    switch (filters.sortBy) {
      case "distance":
        list = [...list].sort((a, b) => a.location.distanceKm - b.location.distanceKm);
        break;
      case "price-low":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list = [...list].sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
        break;
    }
    return list;
  }, [filters, resources]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="kl-section-eyebrow text-field-700">Browse listings</span>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Find Resources</h1>
      <p className="mt-2 max-w-2xl text-field-600">
        Machinery and crop residue currently listed on AgriShare. Filter by category, distance,
        or availability to find the closest fit.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <FilterBar filters={filters} onChange={setFilters} typeOptions={typeOptions} />
        </div>

        <div>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Couldn&apos;t load resources: {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="kl-card h-64 animate-pulse bg-field-50" />
              ))}
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-field-500">
                {filtered.length} resource{filtered.length !== 1 ? "s" : ""} found
              </p>

              {filtered.length === 0 ? (
                <div className="kl-card flex flex-col items-center gap-2 p-12 text-center">
                  <span className="text-3xl">🔍</span>
                  <p className="font-display text-lg font-semibold text-field-900">
                    {resources.length === 0
                      ? "No resources listed yet"
                      : "No resources match those filters"}
                  </p>
                  <p className="max-w-sm text-sm text-field-500">
                    {resources.length === 0
                      ? "Be the first to list machinery or crop residue on AgriShare."
                      : "Try widening the distance range, clearing the search term, or switching category."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="kl-btn-secondary mt-3"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
