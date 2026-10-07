import type { Sale } from "@/types/saleType";
import { getPaymentStatus } from "./salePayment";

// Paid / Part paid / Unpaid pill, used by SaleCard and SalesTable
export default function PaymentStatusBadge({ sale }: { sale: Sale }) {
  const status = getPaymentStatus(sale);

  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${status.style}`}
    >
      {status.label}
    </span>
  );
}