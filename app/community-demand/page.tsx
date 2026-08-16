"use client";

import { useMemo, useState } from "react";
import { demandPosts } from "@/lib/mockData";
import { ResourceCategory, DemandUrgency } from "@/lib/types";
import DemandCard from "@/components/DemandCard";
import DashboardStat from "@/components/DashboardStat";

export default function CommunityDemandPage() {
  const [category, setCategory] = useState<ResourceCategory | "all">("all");
  const [urgency, setUrgency] = useState<DemandUrgency | "all">("all");

  const filtered = useMemo(() => {
    return demandPosts.filter((d) => {
      if (category !== "all" && d.category !== category) return false;
      if (urgency !== "all" && d.urgency !== urgency) return false;
      return true;
    });
  }, [category, urgency]);

  const totalResponders = demandPosts.reduce((sum, d) => sum + d.respondersCount, 0);
  const urgentCount = demandPosts.filter((d) => d.urgency === "high").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kl-section-eyebrow text-field-700">What the community needs</span>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Community Demand</h1>
          <p className="mt-2 max-w-2xl text-field-600">
            Open requests from nearby farmers, cooperatives and small businesses. Respond if you
            have a matching resource to offer.
          </p>
        </div>
        <button type="button" className="kl-btn-primary">
          + Post a Demand
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <DashboardStat label="Open Requests" value={String(demandPosts.length)} icon="📋" accent="field" />
        <DashboardStat label="Urgent Requests" value={String(urgentCount)} icon="⏱️" accent="turmeric" />
        <DashboardStat label="Farmer Responses" value={String(totalResponders)} icon="🤝" accent="soil" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <div className="flex rounded-full border border-field-200 bg-white p-1">
          {(["all", "machinery", "residue"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === c ? "bg-field-700 text-white" : "text-field-600 hover:bg-field-50"
              }`}
            >
              {c === "all" ? "All" : c === "machinery" ? "Machinery" : "Residue"}
            </button>
          ))}
        </div>

        <div className="flex rounded-full border border-field-200 bg-white p-1">
          {(["all", "high", "medium", "low"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUrgency(u)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                urgency === u ? "bg-turmeric-400 text-soil-900" : "text-field-600 hover:bg-field-50"
              }`}
            >
              {u === "all" ? "Any urgency" : u === "high" ? "Urgent" : u === "medium" ? "Moderate" : "Flexible"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <div className="kl-card p-10 text-center text-field-500">
            No requests match those filters right now.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((demand) => (
              <DemandCard key={demand.id} demand={demand} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
