import { secondaryButton } from "@/components/ui/uiStyles";
import { formatDate, formatPrice } from "./format";
import type { Sale } from "@/types/saleType";

// Badge colors in one place. TODO: swap "Part paid" for your warning color token if you have one.
const statusStyles = {
  paid: "bg-primary/10 text-primary",
  partPaid: "bg-amber-500/15 text-amber-700",
  unpaid: "bg-danger/10 text-danger",
};

function getPaymentStatus(sale: Sale) {
  if (sale.amountPaid >= sale.totalAmount) {
    return { label: "Paid", style: statusStyles.paid };
  }
  if (sale.amountPaid > 0) {
    return { label: "Part paid", style: statusStyles.partPaid };
  }
  return { label: "Unpaid", style: statusStyles.unpaid };
}

type SaleCardProps = {
  sale: Sale;
  onViewItems: (sale: Sale) => void;
};

export default function SaleCard({ sale, onViewItems }: SaleCardProps) {
  const status = getPaymentStatus(sale);
  const balance = sale.totalAmount - sale.amountPaid;

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:p-5">
      {/* Customer, sale number, status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-foreground">
            {sale.customerName || "Walk-in customer"}
          </h2>
          <p className="mt-0.5 truncate text-xs text-muted">
            Sale #{sale.id} ·{" "}
            <span suppressHydrationWarning>{formatDate(sale.createdAt)}</span>
          </p>
          {sale.customerNumber && (
            <p className="mt-0.5 truncate text-xs text-muted">
              {sale.customerNumber}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${status.style}`}
        >
          {status.label}
        </span>
      </div>

      {/* Amounts (balance only shows when something is still owed) */}
      <dl className="grid grid-cols-2 gap-3 border-t border-border pt-4">
        <div>
          <dt className="text-xs text-muted">Total</dt>
          <dd className="mt-0.5 text-sm font-medium text-foreground">
            {formatPrice(sale.totalAmount)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Paid</dt>
          <dd className="mt-0.5 text-sm font-medium text-foreground">
            {formatPrice(sale.amountPaid)}
          </dd>
        </div>
        {balance > 0 && (
          <div>
            <dt className="text-xs text-muted">Balance due</dt>
            <dd className="mt-0.5 text-sm font-medium text-danger">
              {formatPrice(balance)}
            </dd>
          </div>
        )}
      </dl>

      <button
        type="button"
        onClick={() => onViewItems(sale)}
        className={`${secondaryButton} w-full`}
      >
        View items
      </button>
    </li>
  );
}