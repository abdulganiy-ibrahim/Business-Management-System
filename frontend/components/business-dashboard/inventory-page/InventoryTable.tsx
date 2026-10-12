import { focusRing } from "@/components/ui/uiStyles";
import { formatDate } from "@/lib/format";
import type { Inventory } from "@/types/inventoryType";
import StockStatusBadge from "./StockStatusBadge";

// Cell styles in one place: change a column's look here
const headCell = "px-4 py-3 text-xs font-semibold whitespace-nowrap text-muted";
const cell = "px-4 py-3.5 whitespace-nowrap";
const numberCell = `${cell} text-right tabular-nums text-foreground`;

// Compact buttons for table rows (the card buttons are taller for thumbs)
const rowButton = `inline-flex h-9 items-center justify-center rounded-lg px-3.5 text-sm font-semibold transition-colors ${focusRing}`;
const transactionsButton = `${rowButton} border border-border bg-background text-foreground hover:bg-foreground/5`;
const editButton = `${rowButton} bg-primary text-white hover:opacity-90`;

type InventoryTableProps = {
  inventory: Inventory[];
  getProductName: (productId: number) => string;
  onViewTransactions: (inventory: Inventory) => void;
  onEdit: (inventory: Inventory) => void;
};

/** Desktop version of the inventory list. Hidden below lg, where InventoryCard is used instead. */
export default function InventoryTable({
  inventory,
  getProductName,
  onViewTransactions,
  onEdit,
}: InventoryTableProps) {
  return (
    // overflow-x-auto: if the screen is narrow the table scrolls inside its box
    <div className="hidden overflow-x-auto rounded-2xl border border-border bg-background lg:block">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Inventory, A to Z by product</caption>

        <thead className="border-b border-border bg-foreground/5">
          <tr>
            <th scope="col" className={headCell}>Product</th>
            <th scope="col" className={`${headCell} text-right`}>In stock</th>
            <th scope="col" className={`${headCell} text-right`}>Low stock at</th>
            <th scope="col" className={headCell}>Status</th>
            <th scope="col" className={headCell}>Last updated</th>
            <th scope="col" className={`${headCell} text-right`}>Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {inventory.map((item) => {
            const productName = getProductName(item.productId);

            return (
              <tr key={item.id} className="transition-colors hover:bg-foreground/5">
                <td className={cell}>
                  <div className="max-w-64 truncate font-medium text-foreground">
                    {productName}
                  </div>
                </td>
                <td className={numberCell}>{item.quantity}</td>
                <td className={numberCell}>{item.lowStockThreshold}</td>
                <td className={cell}>
                  <StockStatusBadge inventory={item} />
                </td>
                <td className={`${cell} text-muted`}>
                  <span suppressHydrationWarning>
                    {formatDate(item.updatedAt ?? item.createdAt)}
                  </span>
                </td>
                <td className={cell}>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onViewTransactions(item)}
                      aria-label={`View transactions for ${productName}`}
                      className={transactionsButton}
                    >
                      Transactions
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      aria-label={`Edit ${productName}`}
                      className={editButton}
                    >
                      Edit
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