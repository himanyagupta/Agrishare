import Link from "next/link";
import { notFound } from "next/navigation";
import { resources } from "@/lib/mockData";
import { formatINR, timeAgo } from "@/lib/utils";
import ResourceTypeBadge from "@/components/ResourceTypeBadge";
import LocationBadge from "@/components/LocationBadge";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import ResourceCard from "@/components/ResourceCard";
import RequestResourceButton from "@/components/RequestResourceButton";

export function generateStaticParams() {
  return resources.map((r) => ({ id: r.id }));
}

export default function ResourceDetailsPage({ params }: { params: { id: string } }) {
  const resource = resources.find((r) => r.id === params.id);
  if (!resource) notFound();

  const similar = resources
    .filter((r) => r.id !== resource.id && r.type === resource.type)
    .slice(0, 3);
  const fallbackSimilar = similar.length
    ? similar
    : resources.filter((r) => r.id !== resource.id && r.category === resource.category).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-field-500">
        <Link href="/find-resources" className="hover:text-field-700">
          Find Resources
        </Link>{" "}
        / <span className="text-field-700">{resource.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="kl-card overflow-hidden">
            <div className="flex h-56 items-center justify-center bg-field-50 text-7xl sm:h-72">
              <span aria-hidden>{resource.icon}</span>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <ResourceTypeBadge category={resource.category} />
                <AvailabilityBadge availability={resource.availability} />
              </div>

              <h1 className="mt-4 text-3xl font-semibold">{resource.title}</h1>
              <p className="mt-1 text-field-500">{resource.type}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-field-600">
                <LocationBadge location={resource.location} />
                <span>·</span>
                <span>{timeAgo(resource.listedDaysAgo)}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <span aria-hidden>⭐</span>
                  {resource.rating.toFixed(1)} ({resource.ratingCount} reviews)
                </span>
              </div>

              <p className="mt-6 text-field-700">{resource.description}</p>

              <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-field-50/70 p-4 sm:grid-cols-3">
                {resource.quantity && (
                  <div>
                    <dt className="text-xs text-field-500">Quantity available</dt>
                    <dd className="mt-0.5 font-medium text-field-800">{resource.quantity}</dd>
                  </div>
                )}
                {resource.condition && (
                  <div>
                    <dt className="text-xs text-field-500">Condition</dt>
                    <dd className="mt-0.5 font-medium text-field-800">{resource.condition}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-field-500">Owner farming since</dt>
                  <dd className="mt-0.5 font-medium text-field-800">
                    {resource.ownerVillageYears} years
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-field-100 px-3 py-1 text-xs font-medium text-field-700"
                  >
                    #{tag.replace(/\s+/g, "-")}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Location placeholder — honest about map not being wired up yet */}
          <div className="kl-card mt-6 flex flex-col items-center justify-center gap-2 p-10 text-center text-field-500">
            <span className="text-2xl" aria-hidden>
              🗺️
            </span>
            <p className="font-medium text-field-700">Map view coming soon</p>
            <p className="max-w-sm text-sm">
              An interactive Leaflet/OpenStreetMap view will show this resource's exact location
              once maps are integrated in the next milestone.
            </p>
          </div>
        </div>

        {/* Sidebar: price, owner, request */}
        <aside className="space-y-6">
          <div className="kl-card p-6">
            <p className="font-display text-3xl font-semibold text-field-900">
              {formatINR(resource.price)}
              <span className="ml-1 text-sm font-sans font-normal text-field-500">
                {resource.priceUnit}
              </span>
            </p>
            <p className="mt-1 text-sm text-field-500">{resource.availability.detail}</p>

            <div className="mt-5">
              <RequestResourceButton ownerName={resource.ownerName} />
            </div>
          </div>

          <div className="kl-card p-6">
            <h3 className="font-display text-base font-semibold text-field-900">
              Listed by
            </h3>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-field-100 text-lg font-semibold text-field-700">
                {resource.ownerName.charAt(0)}
              </span>
              <div>
                <p className="font-medium text-field-900">{resource.ownerName}</p>
                <p className="text-xs text-field-500">
                  {resource.location.village}, {resource.location.district}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-field-50/70 px-3 py-2 text-sm">
              <span className="text-field-500">Phone</span>
              <span className="font-mono text-field-800">{resource.contactPhone}</span>
            </div>
            <p className="mt-2 text-xs text-field-500">
              Full number reveals after a request is confirmed, to protect farmer privacy.
            </p>
          </div>

          <Link
            href={`/smart-match?type=${encodeURIComponent(resource.type)}`}
            className="kl-card block p-6 hover:border-field-300"
          >
            <p className="font-display text-base font-semibold text-field-900">
              See better matches →
            </p>
            <p className="mt-1 text-sm text-field-500">
              Run Smart Match to compare this against every {resource.type.toLowerCase()} nearby.
            </p>
          </Link>
        </aside>
      </div>

      {fallbackSimilar.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-xl font-semibold text-field-900">
            Similar resources nearby
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackSimilar.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
