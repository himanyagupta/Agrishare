import { cn } from "@/lib/utils";

export default function DashboardStat({
  label,
  value,
  icon,
  trend,
  accent = "field",
}: {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  accent?: "field" | "turmeric" | "soil";
}) {
  const accentClasses = {
    field: "bg-field-50 text-field-700",
    turmeric: "bg-turmeric-50 text-turmeric-700",
    soil: "bg-soil-50 text-soil-700",
  }[accent];

  return (
    <div className="kl-card flex items-start justify-between p-5">
      <div>
        <p className="text-sm font-medium text-field-500">{label}</p>
        <p className="mt-1.5 font-display text-2xl font-semibold text-field-900">{value}</p>
        {trend && <p className="mt-1 text-xs text-field-500">{trend}</p>}
      </div>
      <div className={cn("flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl", accentClasses)}>
        <span aria-hidden>{icon}</span>
      </div>
    </div>
  );
}
