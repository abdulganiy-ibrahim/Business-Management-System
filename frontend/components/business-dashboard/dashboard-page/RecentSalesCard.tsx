import Link from "next/link";
import { focusRing } from "../../ui/uiStyles";
import { formatPrice } from "@/lib/format";
import type { RecentOrder } from "@/types/dashboardType";
import DashboardCard from "./DashboardCard";
import { formatBusinessDateTime } from "./dashboardFormat";
import OrderStatusBadge from "./OrderStatusBadge";

type RecentSalesCardProps = {
  orders: RecentOrder[]; // up to 5, newest first
  businessSlug: string;
  className?: string;
};

export default function RecentSalesCard({
  orders,
  businessSlug,
  className,
}: RecentSalesCardProps) {
  return (
    <DashboardCard
      title="Recent sales"
      description="Your latest sales"
      className={className}
      action={
        <Link
          href={`/dashboard/${businessSlug}/sales`}
          className={`rounded-md text-sm font-medium text-primary hover:underline ${focusRing}`}
        >
          View all
        </Link>
      }
    >
      {orders.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No sales yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {order.customerName || "Walk-in customer"}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  Sale #{order.id} · {formatBusinessDateTime(order.createdAt)}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                <p className="text-sm font-semibold tabular-nums text-foreground">
                  {formatPrice(order.totalAmount)}
                </p>
                <OrderStatusBadge status={order.status} />
                {/* Only worth showing when the sale isn't fully paid */}
                {order.status !== "Paid" && (
                  <p className="text-xs text-muted">
                    Paid {formatPrice(order.amountPaid)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}