import Link from "next/link";
import { Resource } from "@/lib/types";
import { formatINR, timeAgo } from "@/lib/utils";
import ResourceTypeBadge from "./ResourceTypeBadge";
import LocationBadge from "./LocationBadge";
import AvailabilityBadge from "./AvailabilityBadge";

export default function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/resource/${resource.id}`}
      className="kl-card group flex flex-col overflow-hidden p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-field-50 text-2xl">
          <span aria-hidden>{resource.icon}</span>
        </div>
        <ResourceTypeBadge category={resource.category} />
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-field-900 group-hover:text-field-700">
        {resource.title}
      </h3>
      <p className="mt-1 text-sm text-field-500">{resource.type}</p>

      <p className="mt-2 line-clamp-2 text-sm text-field-600">{resource.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <LocationBadge location={resource.location} />
        <span className="text-field-300">·</span>
        <span className="text-xs text-field-500">{timeAgo(resource.listedDaysAgo)}</span>
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-field-100 pt-3">
        <div>
          <p className="font-display text-xl font-semibold text-field-800">
            {formatINR(resource.price)}
            <span className="ml-1 text-xs font-sans font-normal text-field-500">
              {resource.priceUnit}
            </span>
          </p>
          {resource.ratingCount > 0 && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-field-500">
              <span aria-hidden>⭐</span>
              {resource.rating.toFixed(1)} ({resource.ratingCount})
            </p>
          )}
        </div>
        <AvailabilityBadge availability={resource.availability} />
      </div>
    </Link>
  );
}
