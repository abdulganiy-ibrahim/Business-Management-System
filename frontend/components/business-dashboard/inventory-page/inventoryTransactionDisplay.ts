import type { InventoryTransaction } from "@/types/inventoryTransactionType";

const labels: Record<string, string> = {
  restock: "Restock",
  sale: "Sale",
  threshold_change: "Low stock threshold changed",
};

export const getTransactionLabel = (transaction: InventoryTransaction) =>
  labels[transaction.transactionType] ?? transaction.transactionType;

// "+10" for restocks, "-3" for sales. Threshold changes don't move stock, so nothing is shown.
// The sign comes from the type, so it works whether the backend stores sales as 3 or -3.
export function getQuantityChangeText(transaction: InventoryTransaction) {
  if (transaction.transactionType === "threshold_change") return null;

  const sign = transaction.transactionType === "sale" ? "-" : "+";
  return `${sign}${Math.abs(transaction.quantityChange)}`;
}

export const isDeduction = (transaction: InventoryTransaction) =>
  transaction.transactionType === "sale";

// Copy first: .sort() changes the array it is called on
export const sortNewestFirst = (transactions: InventoryTransaction[]) =>
  [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );