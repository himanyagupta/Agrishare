import Link from "next/link";
import { resources, dashboardStats, recentActivity, CURRENT_USER, demandPosts } from "@/lib/mockData";
import { formatINR } from "@/lib/utils";
import DashboardStat from "@/components/DashboardStat";
import ResourceCard from "@/components/ResourceCard";
import AvailabilityBadge from "@/components/AvailabilityBadge";

export default function DashboardPage() {
  // In this prototype, "my resources" is a fixed slice of the mock data.
  // Once Supabase auth is wired up, this will filter by the logged-in owner id.
  const myResources = resources.slice(0, 3);
  const myOpenDemand = demandPosts.slice(4, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kl-section-eyebrow text-field-700">Welcome back</span>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {CURRENT_USER.name.split(" ")[0]}&apos;s Dashboard
          </h1>
          <p className="mt-1 text-field-600">
            {CURRENT_USER.village}, {CURRENT_USER.district}, {CURRENT_USER.state}
          </p>
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
          value={String(dashboardStats.myActiveListings)}
          icon="📦"
          trend="2 machinery · 1 residue"
          accent="field"
        />
        <DashboardStat
          label="Open Requests"
          value={String(dashboardStats.myOpenRequests)}
          icon="📋"
          trend="Awaiting responses"
          accent="turmeric"
        />
        <DashboardStat
          label="Matches Found"
          value={String(dashboardStats.matchesFound)}
          icon="🎯"
          trend="Across all listings"
          accent="field"
        />
        <DashboardStat
          label="Estimated Savings"
          value={formatINR(dashboardStats.estimatedSavings)}
          icon="💰"
          trend="vs. market hiring rates"
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
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {myResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-field-900">My Requests</h2>
              <Link href="/community-demand" className="text-sm font-semibold text-field-700 hover:underline">
                Post a new request →
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {myOpenDemand.map((d) => (
                <div key={d.id} className="kl-card flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium text-field-900">{d.title}</p>
                    <p className="text-sm text-field-500">
                      {d.quantityNeeded} · {d.neededBy}
                    </p>
                  </div>
                  <AvailabilityBadge
                    availability={{
                      status: d.urgency === "high" ? "upcoming" : "available",
                      detail: `${d.respondersCount} responses`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <h2 className="font-display text-xl font-semibold text-field-900">Recent Activity</h2>
          <div className="kl-card mt-4 divide-y divide-field-100">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-field-50 text-base">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm text-field-800">{item.message}</p>
                  <p className="mt-0.5 text-xs text-field-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="kl-card mt-6 bg-field-50/60 p-5">
            <h3 className="font-display text-base font-semibold text-field-900">
              Next milestone
            </h3>
            <p className="mt-1.5 text-sm text-field-600">
              This dashboard currently reflects sample data. Once Supabase auth and database are
              connected, it will show your real listings, requests and match history.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
