import type { Inventory } from "@/types/inventoryType";

// Badge colors in one place. TODO: swap "Low stock" for your warning color token if you have one.
const statusStyles = {
  inStock: "bg-primary/10 text-primary",
  lowStock: "bg-amber-500/15 text-amber-700",
  outOfStock: "bg-danger/10 text-danger",
};

// Shared by the card, the table and the edit form, so they always agree
export function getStockStatus(inventory: Inventory) {
  if (inventory.quantity <= 0) {
    return { label: "Out of stock", style: statusStyles.outOfStock };
  }
  if (inventory.quantity <= inventory.lowStockThreshold) {
    return { label: "Low stock", style: statusStyles.lowStock };
  }
  return { label: "In stock", style: statusStyles.inStock };
}