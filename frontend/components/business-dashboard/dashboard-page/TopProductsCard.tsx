import type { TopProduct } from "@/types/dashboardType";
import DashboardCard from "./DashboardCard";

type TopProductsCardProps = {
  products: TopProduct[]; // up to 5, best first
  className?: string;
};

export default function TopProductsCard({
  products,
  className,
}: TopProductsCardProps) {
  // The best seller gets a full bar; the others are shown relative to it
  const maxUnits = Math.max(...products.map((product) => product.unitsSold), 1);

  return (
    <DashboardCard
      title="Top selling products"
      description="By units sold"
      className={className}
    >
      {products.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          No sales yet to rank your products.
        </p>
      ) : (
        <ol className="flex flex-col gap-4">
          {products.map((product, index) => (
            <li key={product.productId} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-xs font-semibold text-muted">
                    {index + 1}
                  </span>
                  <span className="truncate font-medium text-foreground">
                    {product.name}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums text-muted">
                  {product.unitsSold} sold
                </span>
              </div>

              <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(product.unitsSold / maxUnits) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </DashboardCard>
  );
}