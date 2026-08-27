"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getDemandPosts } from "@/lib/supabase/queries";
import { dbDemandToUI } from "@/lib/supabase/adapters";
import { DemandPost, ResourceCategory, DemandUrgency } from "@/lib/types";
import { useUser } from "@/hooks/useUser";
import DemandCard from "@/components/DemandCard";
import DashboardStat from "@/components/DashboardStat";
import PostDemandForm from "./PostDemandForm";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CommunityDemandPage() {
  const { t } = useLanguage();
  const { user, loading: userLoading } = useUser();
  const [demandPosts, setDemandPosts] = useState<DemandPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<ResourceCategory | "all">("all");
  const [urgency, setUrgency] = useState<DemandUrgency | "all">("all");

  async function loadDemandPosts() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: fetchError } = await getDemandPosts(supabase);

    if (fetchError) {
      setError(fetchError.message);
      setDemandPosts([]);
      setLoading(false);
      return;
    }

    const rows = data ?? [];
    const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
    let namesById: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase.from("users").select("id, name").in("id", userIds);
      namesById = Object.fromEntries((users ?? []).map((u) => [u.id, u.name]));
    }

    setDemandPosts(rows.map((row) => dbDemandToUI(row, { requestedByName: namesById[row.user_id] })));
    setLoading(false);
  }

  useEffect(() => {
    loadDemandPosts();
  }, []);

  const filtered = useMemo(() => {
    return demandPosts.filter((d) => {
      if (category !== "all" && d.category !== category) return false;
      if (urgency !== "all" && d.urgency !== urgency) return false;
      return true;
    });
  }, [demandPosts, category, urgency]);

  const totalResponders = demandPosts.reduce((sum, d) => sum + d.respondersCount, 0);
  const urgentCount = demandPosts.filter((d) => d.urgency === "high").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kl-section-eyebrow text-field-700">{t("communityDemand.eyebrow")}</span>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{t("communityDemand.title")}</h1>
          <p className="mt-2 max-w-2xl text-field-600">{t("communityDemand.subtitle")}</p>
        </div>
        {!showForm &&
          (user ? (
            <button type="button" onClick={() => setShowForm(true)} className="kl-btn-primary">
              {t("communityDemand.postDemand")}
            </button>
          ) : (
            !userLoading && (
              <Link href="/login?next=/community-demand" className="kl-btn-primary">
                {t("communityDemand.loginToPost")}
              </Link>
            )
          ))}
      </div>

      {showForm && user && (
        <div className="mt-6">
          <PostDemandForm
            userId={user.id}
            onCancel={() => setShowForm(false)}
            onPosted={() => {
              setShowForm(false);
              loadDemandPosts();
            }}
          />
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <DashboardStat label={t("communityDemand.openRequests")} value={String(demandPosts.length)} icon="📋" accent="field" />
        <DashboardStat label={t("communityDemand.urgentRequests")} value={String(urgentCount)} icon="⏱️" accent="turmeric" />
        <DashboardStat label={t("communityDemand.farmerResponses")} value={String(totalResponders)} icon="🤝" accent="soil" />
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
              {c === "all" ? t("communityDemand.all") : c === "machinery" ? t("findResources.machinery") : t("findResources.residue")}
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
              {u === "all"
                ? t("communityDemand.anyUrgency")
                : u === "high"
                ? t("communityDemand.urgent")
                : u === "medium"
                ? t("communityDemand.moderate")
                : t("communityDemand.flexible")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {t("common.couldntLoadDemand")}: {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="kl-card h-56 animate-pulse bg-field-50" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="kl-card p-10 text-center text-field-500">
            {demandPosts.length === 0 ? t("communityDemand.noneOpenYet") : t("communityDemand.noneMatchFilters")}
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
