import { focusRing } from "@/components/ui/uiStyles";
import type { Sale } from "@/types/saleType";
import { formatDate, formatPrice } from "./format";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { getBalance } from "./salePayment";

// Cell styles in one place: change a column's look here
const headCell = "px-4 py-3 text-xs font-semibold whitespace-nowrap text-muted";
const cell = "px-4 py-3.5 whitespace-nowrap";
const numberCell = `${cell} text-right tabular-nums`;

// Compact buttons for table rows (the card buttons are taller for thumbs)
const rowButton = `inline-flex h-9 items-center justify-center rounded-lg px-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;
const viewButton = `${rowButton} border border-border bg-background text-foreground hover:bg-foreground/5`;
const payButton = `${rowButton} bg-primary text-white hover:opacity-90`;

type SalesTableProps = {
  sales: Sale[];
  onViewItems: (sale: Sale) => void;
  onPayDebt: (sale: Sale) => void;
};

/** Desktop version of the sales list. Hidden below lg, where SaleCard is used instead. */
export default function SalesTable({
  sales,
  onViewItems,
  onPayDebt,
}: SalesTableProps) {
  return (
    // overflow-x-auto: if the screen is narrow the table scrolls inside its box
    <div className="hidden overflow-x-auto rounded-2xl border border-border bg-background lg:block">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Sales, newest first</caption>

        <thead className="border-b border-border bg-foreground/5">
          <tr>
            <th scope="col" className={headCell}>Sale</th>
            <th scope="col" className={headCell}>Customer</th>
            <th scope="col" className={headCell}>Date</th>
            <th scope="col" className={`${headCell} text-right`}>Total</th>
            <th scope="col" className={`${headCell} text-right`}>Paid</th>
            <th scope="col" className={`${headCell} text-right`}>Balance due</th>
            <th scope="col" className={headCell}>Status</th>
            <th scope="col" className={`${headCell} text-right`}>Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {sales.map((sale) => {
            const balance = getBalance(sale);
            const hasDebt = balance > 0;

            return (
              <tr
                key={sale.id}
                className="transition-colors hover:bg-foreground/5"
              >
                <td className={`${cell} text-muted`}>#{sale.id}</td>

                <td className={cell}>
                  <div className="max-w-56 truncate font-medium text-foreground">
                    {sale.customerName || "Walk-in customer"}
                  </div>
                  {sale.customerNumber && (
                    <div className="mt-0.5 max-w-56 truncate text-xs text-muted">
                      {sale.customerNumber}
                    </div>
                  )}
                </td>

                <td className={`${cell} text-foreground`}>
                  <span suppressHydrationWarning>
                    {formatDate(sale.createdAt)}
                  </span>
                </td>

                <td className={`${numberCell} text-foreground`}>
                  {formatPrice(sale.totalAmount)}
                </td>
                <td className={`${numberCell} text-foreground`}>
                  {formatPrice(sale.amountPaid)}
                </td>
                <td className={numberCell}>
                  {hasDebt ? (
                    <span className="font-semibold text-danger">
                      {formatPrice(balance)}
                    </span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>

                <td className={cell}>
                  <PaymentStatusBadge sale={sale} />
                </td>

                {/* "Pay debt" is disabled once the sale is fully paid */}
                <td className={cell}>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onViewItems(sale)}
                      aria-label={`View items for sale ${sale.id}`}
                      className={`${viewButton} cursor-pointer`}
                    >
                      View items
                    </button>
                    <button
                      type="button"
                      onClick={() => onPayDebt(sale)}
                      disabled={!hasDebt}
                      aria-label={`Pay debt for sale ${sale.id}`}
                      className={`${payButton} cursor-pointer`}
                    >
                      Pay debt
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}