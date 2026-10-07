import { primaryButton, secondaryButton } from "@/components/ui/uiStyles";
import { formatDate, formatPrice } from "./format";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { getBalance } from "./salePayment";
import type { Sale } from "@/types/saleType";

type SaleCardProps = {
  sale: Sale;
  onViewItems: (sale: Sale) => void;
  onPayDebt: (sale: Sale) => void;
};

/** Mobile and tablet version of the sales list. Hidden from lg up, where SalesTable is used. */
export default function SaleCard({
  sale,
  onViewItems,
  onPayDebt,
}: SaleCardProps) {
  const balance = getBalance(sale);
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

        <PaymentStatusBadge sale={sale} />
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
          className={`${secondaryButton} cursor-pointer`}
        >
          View items
        </button>
        <button
          type="button"
          onClick={() => onPayDebt(sale)}
          disabled={!hasDebt}
          className={`${primaryButton} cursor-pointer`}
        >
          Pay debt
        </button>
      </div>
    </li>
  );
}