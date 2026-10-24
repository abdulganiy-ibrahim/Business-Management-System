// Matches the backend InventoryRecord
export interface Inventory {
  id: number;
  businessId: string;
  productId: number;
  quantity: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string | null;
}

// Matches CreateInventoryRequest
export interface CreateInventoryRequest {
  productId: number;
  quantity: number;
  lowStockThreshold: number;
}

// Matches UpdateInventoryRequest.
// addQuantity is how many units to ADD to the stock, not the new total.
export interface UpdateInventoryRequest {
  addQuantity?: number;
  lowStockThreshold?: number;
}