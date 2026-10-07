import type { Sale } from "@/types/saleType";
import { formatPrice } from "./format";
import { calculateSalesStats } from "./calulateSalesStats";

type StatProps = {
  label: string;
  value: string;
  hint: string;
  valueClassName?: string;
};

// One number with a label above it and a small hint below it
function Stat({
  label,
  value,
  hint,
  valueClassName = "text-foreground",
}: StatProps) {
  return (
    <div className="min-w-0 lg:px-6 lg:first:pl-0 lg:last:pr-0">
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd
        className={`mt-1 truncate text-xl font-semibold tabular-nums sm:text-2xl ${valueClassName}`}
      >
        {value}
      </dd>
      <dd className="mt-1 text-xs text-muted">{hint}</dd>
    </div>
  );
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

/** Summary of every sale in the list. Recalculates whenever the list changes. */
export default function SalesStats({ sales }: { sales: Sale[] }) {
  // A single pass over the list is cheap, so no useMemo needed here
  const stats = calculateSalesStats(sales);
  const hasDebt = stats.outstandingDebt > 0;

  return (
    <section
      aria-label="Sales summary"
      className="rounded-2xl border border-border bg-background p-4 sm:p-5"
    >
      {/* 2 x 2 on mobile, one row of four with dividers from lg up */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4 lg:gap-x-0 lg:divide-x lg:divide-border">
        <Stat
          label="Total sales"
          value={formatPrice(stats.totalSales)}
          hint={plural(stats.salesCount, "sale")}
        />
        <Stat
          label="Amount received"
          value={formatPrice(stats.amountReceived)}
          hint={`${stats.collectionRate}% collected`}
        />
        <Stat
          label="Outstanding debt"
          value={formatPrice(stats.outstandingDebt)}
          hint={
            hasDebt
              ? `${plural(stats.unpaidCount, "sale")} not fully paid`
              : "Everything is paid"
          }
          valueClassName={hasDebt ? "text-danger" : "text-foreground"}
        />
        <Stat
          label="Average sale"
          value={formatPrice(stats.averageSale)}
          hint="per sale"
        />
      </dl>
    </section>
  );
}