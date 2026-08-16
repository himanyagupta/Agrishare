import { ResourceLocation } from "@/lib/types";
import { formatDistance } from "@/lib/utils";

export default function LocationBadge({
  location,
  showDistance = true,
}: {
  location: ResourceLocation;
  showDistance?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-field-600">
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5 flex-shrink-0"
      >
        <path
          fillRule="evenodd"
          d="M10 18s6-5.686 6-10A6 6 0 0 0 4 8c0 4.314 6 10 6 10Zm0-7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          clipRule="evenodd"
        />
      </svg>
      <span>
        {location.village}, {location.district}
        {showDistance && (
          <span className="text-field-500"> · {formatDistance(location.distanceKm)}</span>
        )}
      </span>
    </span>
  );
}
