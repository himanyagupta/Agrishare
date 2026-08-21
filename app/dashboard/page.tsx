import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyResources, getMyRequests, getProfile } from "@/lib/supabase/queries";
import { dbResourceToUI } from "@/lib/supabase/adapters";
import DashboardStat from "@/components/DashboardStat";
import ResourceCard from "@/components/ResourceCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const [{ data: profile }, { data: resourceRows }, { data: requestRows }] = await Promise.all([
    getProfile(supabase, user.id),
    getMyResources(supabase, user.id),
    getMyRequests(supabase, user.id),
  ]);

  const myResources = (resourceRows ?? []).map((row) =>
    dbResourceToUI(row, { fromLat: profile?.latitude, fromLng: profile?.longitude })
  );
  const activeCount = myResources.filter((r) => r.availability.status === "available").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kl-section-eyebrow text-field-700">Welcome back</span>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {(profile?.name ?? "Your").split(" ")[0]}&apos;s Dashboard
          </h1>
          {profile?.location && <p className="mt-1 text-field-600">{profile.location}</p>}
        </div>
        <div className="flex gap-3">
          <Link href="/list-resource" className="kl-btn-primary">
            + List a Resource
          </Link>
          <Link href="/smart-match" className="kl-btn-secondary">
            Run Smart Match
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          label="Active Listings"
          value={String(activeCount)}
          icon="📦"
          trend={`${myResources.length} total listed`}
          accent="field"
        />
        <DashboardStat
          label="Machinery Listed"
          value={String(myResources.filter((r) => r.category === "machinery").length)}
          icon="🚜"
          accent="field"
        />
        <DashboardStat
          label="Residue Listed"
          value={String(myResources.filter((r) => r.category === "residue").length)}
          icon="🌾"
          accent="turmeric"
        />
        <DashboardStat
          label="Open Requests"
          value={String((requestRows ?? []).length)}
          icon="📋"
          trend="Personal requests"
          accent="soil"
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* My resources */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-field-900">My Resources</h2>
            <Link href="/list-resource" className="text-sm font-semibold text-field-700 hover:underline">
              Add another →
            </Link>
          </div>

          {myResources.length === 0 ? (
            <div className="kl-card mt-4 flex flex-col items-center gap-2 p-10 text-center">
              <span className="text-2xl">📦</span>
              <p className="font-medium text-field-800">You haven&apos;t listed anything yet</p>
              <p className="max-w-sm text-sm text-field-500">
                List idle machinery or surplus crop residue so nearby farmers can find it.
              </p>
              <Link href="/list-resource" className="kl-btn-primary mt-2">
                List a Resource
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {myResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </section>

        {/* My requests */}
        <section>
          <h2 className="font-display text-xl font-semibold text-field-900">My Requests</h2>
          <div className="kl-card mt-4 p-5">
            {(requestRows ?? []).length === 0 ? (
              <div className="text-center">
                <p className="text-sm text-field-600">
                  You haven&apos;t posted a personal request yet.
                </p>
                <Link
                  href="/community-demand"
                  className="mt-2 inline-block text-sm font-semibold text-field-700 hover:underline"
                >
                  Post to Community Demand instead →
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {(requestRows ?? []).map((r) => (
                  <li key={r.id} className="border-b border-field-100 pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-field-900">{r.resource_type}</p>
                    <p className="text-xs text-field-500">
                      {r.quantity ?? "—"} · {r.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="kl-card mt-6 bg-field-50/60 p-5">
            <h3 className="font-display text-base font-semibold text-field-900">
              Next milestone
            </h3>
            <p className="mt-1.5 text-sm text-field-600">
              This dashboard now reflects your real AgriShare data. Matching, bookings and
              messaging are planned for upcoming milestones.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
