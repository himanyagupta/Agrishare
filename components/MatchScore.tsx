import { MatchFactorScores } from "@/lib/types";
import { cn } from "@/lib/utils";

const FACTOR_LABELS: { key: keyof MatchFactorScores; label: string }[] = [
  { key: "distance", label: "Distance" },
  { key: "availability", label: "Availability" },
  { key: "cost", label: "Cost fit" },
  { key: "demandFit", label: "Demand match" },
];

function scoreColor(score: number) {
  if (score >= 75) return "text-field-600";
  if (score >= 50) return "text-turmeric-500";
  return "text-soil-500";
}

function ringColor(score: number) {
  if (score >= 75) return "stroke-field-600";
  if (score >= 50) return "stroke-turmeric-400";
  return "stroke-soil-400";
}

/** Compact circular gauge. Use `factors` + `showBreakdown` for the full explanation panel. */
export default function MatchScore({
  score,
  factors,
  showBreakdown = false,
  size = "md",
}: {
  score: number;
  factors?: MatchFactorScores;
  showBreakdown?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dims = size === "lg" ? 88 : size === "sm" ? 44 : 60;
  const stroke = size === "lg" ? 8 : 6;
  const radius = dims / 2 - stroke;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dims, height: dims }}>
        <svg width={dims} height={dims} className="-rotate-90">
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={radius}
            strokeWidth={stroke}
            className="fill-none stroke-field-100"
          />
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={radius}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("fill-none transition-all duration-700", ringColor(score))}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-display font-semibold", scoreColor(score), size === "lg" ? "text-2xl" : "text-sm")}>
            {score}
          </span>
          {size === "lg" && <span className="text-[10px] text-field-500">match</span>}
        </div>
      </div>

      {showBreakdown && factors && (
        <div className="w-full space-y-2 pt-2">
          {FACTOR_LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span className="w-24 flex-shrink-0 text-field-600">{label}</span>
              <div className="h-1.5 flex-1 rounded-full bg-field-100">
                <div
                  className={cn("h-1.5 rounded-full bg-field-600")}
                  style={{ width: `${factors[key]}%` }}
                />
              </div>
              <span className="w-7 flex-shrink-0 text-right font-mono text-field-700">
                {factors[key]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
