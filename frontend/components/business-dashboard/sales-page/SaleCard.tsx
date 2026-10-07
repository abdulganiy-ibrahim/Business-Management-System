import { primaryButton, secondaryButton } from "@/components/ui/uiStyles";
import { formatDate, formatPrice } from "./format";
import type { Sale } from "@/types/saleType";

// Badge colors in one place. TODO: swap "Part paid" for your warning color token if you have one.
const statusStyles = {
  paid: "bg-primary/10 text-primary",
  partPaid: "bg-amber-500/15 text-amber-700",
  unpaid: "bg-danger/10 text-danger",
};

// What the customer still owes. Rounded to cents so decimal noise
// (like 0.1 + 0.2) can never leave a fake debt on a fully paid sale.
function getBalance(sale: Sale) {
  return Math.round((sale.totalAmount - sale.amountPaid) * 100) / 100;
}

function getPaymentStatus(sale: Sale, balance: number) {
  if (balance <= 0) {
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
  onPayDebt: (sale: Sale) => void;
};

export default function SaleCard({
  sale,
  onViewItems,
  onPayDebt,
}: SaleCardProps) {
  const balance = getBalance(sale);
  const status = getPaymentStatus(sale, balance);
  const hasDebt = balance > 0;

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
        {hasDebt && (
          <div>
            <dt className="text-xs text-muted">Balance due</dt>
            <dd className="mt-0.5 text-sm font-medium text-danger">
              {formatPrice(balance)}
            </dd>
          </div>
        )}
      </dl>

      {/* Actions: "Pay debt" is disabled once the sale is fully paid */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onViewItems(sale)}
          className={secondaryButton}
        >
          View items
        </button>
        <button
          type="button"
          onClick={() => onPayDebt(sale)}
          disabled={!hasDebt}
          className={primaryButton}
        >
          Pay debt
        </button>
      </div>
    </li>
  );
}