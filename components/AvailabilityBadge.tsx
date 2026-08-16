import { Availability } from "@/lib/types";
import { cn } from "@/lib/utils";

const STYLES: Record<Availability["status"], string> = {
  available: "bg-field-600 text-white",
  upcoming: "bg-turmeric-400 text-soil-900",
  booked: "bg-soil-200 text-soil-700",
};

const DOT: Record<Availability["status"], string> = {
  available: "bg-white",
  upcoming: "bg-soil-900",
  booked: "bg-soil-500",
};

export default function AvailabilityBadge({
  availability,
  className,
}: {
  availability: Availability;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        STYLES[availability.status],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT[availability.status])} />
      {availability.detail}
    </span>
  );
}
