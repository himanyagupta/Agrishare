"use client";

import { ResourceCategory } from "@/lib/types";

export interface FilterState {
  search: string;
  category: ResourceCategory | "all";
  type: string;
  maxDistance: number;
  availabilityOnly: boolean;
  sortBy: "distance" | "price-low" | "price-high" | "newest";
}

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  category: "all",
  type: "all",
  maxDistance: 50,
  availabilityOnly: false,
  sortBy: "distance",
};

export default function FilterBar({
  filters,
  onChange,
  typeOptions,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  typeOptions: string[];
}) {
  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="kl-card space-y-4 p-4 sm:p-5">
      <div>
        <label htmlFor="search" className="kl-label">
          Search
        </label>
        <input
          id="search"
          type="text"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Try 'tractor', 'wheat straw', 'Pushkar'..."
          className="kl-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label htmlFor="category" className="kl-label">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => set("category", e.target.value as FilterState["category"])}
            className="kl-input"
          >
            <option value="all">All categories</option>
            <option value="machinery">Machinery</option>
            <option value="residue">Crop Residue</option>
          </select>
        </div>

        <div>
          <label htmlFor="type" className="kl-label">
            Type
          </label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => set("type", e.target.value)}
            className="kl-input"
          >
            <option value="all">All types</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="distance" className="kl-label">
            Within {filters.maxDistance} km
          </label>
          <input
            id="distance"
            type="range"
            min={1}
            max={50}
            value={filters.maxDistance}
            onChange={(e) => set("maxDistance", Number(e.target.value))}
            className="mt-3 w-full accent-field-700"
          />
        </div>

        <div>
          <label htmlFor="sort" className="kl-label">
            Sort by
          </label>
          <select
            id="sort"
            value={filters.sortBy}
            onChange={(e) => set("sortBy", e.target.value as FilterState["sortBy"])}
            className="kl-input"
          >
            <option value="distance">Nearest first</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest listed</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-field-700">
        <input
          type="checkbox"
          checked={filters.availabilityOnly}
          onChange={(e) => set("availabilityOnly", e.target.checked)}
          className="h-4 w-4 rounded border-field-300 text-field-700 focus:ring-field-400"
        />
        Show only what&apos;s available right now
      </label>
    </div>
  );
}
