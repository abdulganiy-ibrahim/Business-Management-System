import type { OrderStatus } from "@/types/dashboardType";
// The same colors as the sales page, so a status always looks the same
import { statusStyles } from "../sales-page/salePayment";

const orderStatuses: Record<OrderStatus, { label: string; style: string }> = {
  Paid: { label: "Paid", style: statusStyles.paid },
  Partial: { label: "Part paid", style: statusStyles.partPaid },
  Unpaid: { label: "Unpaid", style: statusStyles.unpaid },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  // Fallback in case the backend ever sends a status we don't know
  const { label, style } = orderStatuses[status] ?? {
    label: status,
    style: "bg-foreground/5 text-muted",
  };

  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}