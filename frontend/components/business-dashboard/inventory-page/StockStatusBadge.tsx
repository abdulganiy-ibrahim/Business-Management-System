import type { Inventory } from "@/types/inventoryType";
import { getStockStatus } from "./inventoryStatus";

// In stock / Low stock / Out of stock pill
export default function StockStatusBadge({
  inventory,
}: {
  inventory: Inventory;
}) {
  const status = getStockStatus(inventory);

  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${status.style}`}
    >
      {status.label}
    </span>
  );
}