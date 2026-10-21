import type { IconType } from "react-icons";
import ChangeBadge from "./ChangeBadge";

type SummaryCardProps = {
  label: string;
  value: string; // already formatted
  icon: IconType;
  changePercent: number | null;
  higherIsBetter: boolean;
};

export default function SummaryCard({
  label,
  value,
  icon: Icon,
  changePercent,
  higherIsBetter,
}: SummaryCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted">{label}</p>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
      </div>

      <p className="truncate text-xl font-semibold tabular-nums text-foreground sm:text-2xl">
        {value}
      </p>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <ChangeBadge
          changePercent={changePercent}
          higherIsBetter={higherIsBetter}
        />
        <span className="text-xs text-muted">vs previous period</span>
      </div>
    </div>
  );
}