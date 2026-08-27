import { createClient } from "@/lib/supabase/server";
import { getResources, getDemandPosts } from "@/lib/supabase/queries";
import { dbResourceToUI, dbDemandToUI, parseLocation } from "@/lib/supabase/adapters";
import LandingContent from "./LandingContent";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const supabase = createClient();

  const [{ data: resourceRows }, { data: demandRows }] = await Promise.all([
    getResources(supabase),
    getDemandPosts(supabase),
  ]);

  const allResources = resourceRows ?? [];
  const allDemand = demandRows ?? [];

  const featured = allResources
    .filter((r) => r.status === "available")
    .slice(0, 3)
    .map((r) => dbResourceToUI(r));

  const demandTeaser = allDemand.slice(0, 2).map((d) => dbDemandToUI(d));

  const villageCount = new Set(allResources.map((r) => parseLocation(r.location).village)).size;
  const residueCount = allResources.filter((r) => r.category === "crop_residue").length;

  return (
    <LandingContent
      totalListings={allResources.length}
      villageCount={villageCount}
      residueCount={residueCount}
      featured={featured}
      demandTeaser={demandTeaser}
    />
  );
}
