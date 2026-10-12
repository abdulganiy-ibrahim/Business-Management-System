import { primaryButton, secondaryButton } from "@/components/ui/uiStyles";
import { formatDate } from "@/lib/format";
import type { Inventory } from "@/types/inventoryType";
import StockStatusBadge from "./StockStatusBadge";

type InventoryCardProps = {
  inventory: Inventory;
  productName: string;
  onViewTransactions: (inventory: Inventory) => void;
  onEdit: (inventory: Inventory) => void;
};

/** Small and medium screen version of the inventory list. Hidden from lg up, where InventoryTable is used. */
export default function InventoryCard({
  inventory,
  productName,
  onViewTransactions,
  onEdit,
}: InventoryCardProps) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:p-5">
      {/* Product, last update, status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-foreground">
            {productName}
          </h2>
          <p className="mt-0.5 truncate text-xs text-muted">
            Updated{" "}
            <span suppressHydrationWarning>
              {formatDate(inventory.updatedAt ?? inventory.createdAt)}
            </span>
          </p>
        </div>

        <StockStatusBadge inventory={inventory} />
      </div>

      {/* Numbers */}
      <dl className="grid grid-cols-2 gap-3 border-t border-border pt-4">
        <div>
          <dt className="text-xs text-muted">In stock</dt>
          <dd className="mt-0.5 text-sm font-medium text-foreground">
            {inventory.quantity}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Low stock at</dt>
          <dd className="mt-0.5 text-sm font-medium text-foreground">
            {inventory.lowStockThreshold}
          </dd>
        </div>
      </dl>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onViewTransactions(inventory)}
          className={secondaryButton}
        >
          Transactions
        </button>
        <button
          type="button"
          onClick={() => onEdit(inventory)}
          className={primaryButton}
        >
          Edit
        </button>
      </div>
    </li>
  );
}