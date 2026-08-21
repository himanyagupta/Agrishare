import { DemandPost } from "@/lib/types";
import { cn } from "@/lib/utils";
import ResourceTypeBadge from "./ResourceTypeBadge";
import LocationBadge from "./LocationBadge";

const URGENCY_STYLES: Record<DemandPost["urgency"], { label: string; classes: string }> = {
  high: { label: "Urgent", classes: "bg-red-50 text-red-700 border-red-200" },
  medium: { label: "Moderate", classes: "bg-turmeric-50 text-turmeric-700 border-turmeric-200" },
  low: { label: "Flexible", classes: "bg-field-50 text-field-700 border-field-200" },
};

export default function DemandCard({ demand }: { demand: DemandPost }) {
  const urgency = URGENCY_STYLES[demand.urgency];

  return (
    <div className="kl-card flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <ResourceTypeBadge category={demand.category} />
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-semibold",
            urgency.classes
          )}
        >
          {urgency.label}
        </span>
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-field-900">
        {demand.title}
      </h3>
      <p className="mt-1 text-sm text-field-500">
        {demand.type} · requested by {demand.requestedBy}
      </p>

      {demand.notes && <p className="mt-2 text-sm text-field-600">{demand.notes}</p>}

      <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-field-50/70 p-3 text-xs">
        <div>
          <dt className="text-field-500">Quantity needed</dt>
          <dd className="mt-0.5 font-medium text-field-800">{demand.quantityNeeded}</dd>
        </div>
        <div>
          <dt className="text-field-500">Needed by</dt>
          <dd className="mt-0.5 font-medium text-field-800">{demand.neededBy}</dd>
        </div>
        <div>
          <dt className="text-field-500">Budget</dt>
          <dd className="mt-0.5 font-medium text-field-800">{demand.budget}</dd>
        </div>
        <div>
          <dt className="text-field-500">Responses so far</dt>
          <dd className="mt-0.5 font-medium text-field-800">{demand.respondersCount} farmers</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-field-100 pt-3">
        <LocationBadge location={demand.location} showDistance={demand.location.distanceKm > 0} />
        <button
          type="button"
          disabled
          title="Direct responses aren't wired up yet — list a matching resource instead."
          className="kl-btn-secondary !px-4 !py-1.5 text-xs opacity-60"
        >
          I can supply this
        </button>
      </div>
    </div>
  );
}
