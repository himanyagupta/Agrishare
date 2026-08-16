import { ResourceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ResourceTypeBadge({
  category,
  className,
}: {
  category: ResourceCategory;
  className?: string;
}) {
  const isMachinery = category === "machinery";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        isMachinery
          ? "bg-field-100 text-field-800"
          : "bg-turmeric-100 text-turmeric-800",
        className
      )}
    >
      <span aria-hidden>{isMachinery ? "🚜" : "🌾"}</span>
      {isMachinery ? "Machinery" : "Crop Residue"}
    </span>
  );
}
