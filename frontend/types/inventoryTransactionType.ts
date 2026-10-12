// Matches InventoryTransactionTypes on the backend.
// If the backend adds a new type, add it here too.
export type InventoryTransactionType =
  | "restock"
  | "sale"
  | "threshold_change";

// Matches InventoryTransactionRecord
export interface InventoryTransaction {
  id: number;
  businessId: string;
  inventoryId: number;
  transactionType: InventoryTransactionType;
  quantityChange: number;
  transactionDesc: string | null;
  createdAt: string;
}