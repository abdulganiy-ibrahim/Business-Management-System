import type { AxiosInstance } from "axios";
import type { Inventory, UpdateInventoryRequest } from "@/types/inventoryType";
import type { InventoryTransaction } from "@/types/inventoryTransactionType";

// Get the inventory of a business
export async function getInventoryByBusinessId(
  api: AxiosInstance,
  businessId: string
): Promise<Inventory[]> {
  // TODO: match this URL to your backend
  const res = await api.get<Inventory[]>(`/api/business/${businessId}/inventory`);

  return res.data;
}

// Get the transactions of one inventory
export async function getInventoryTransactionsByInventoryId(
  api: AxiosInstance,
  businessId: string,
  inventoryId: number
): Promise<InventoryTransaction[]> {
  // TODO: match this URL to your backend
  const res = await api.get<InventoryTransaction[]>(
    `/api/business/${businessId}/inventory/${inventoryId}/transactions`
  );

  return res.data;
}

// Update an inventory: add stock and/or change the low stock threshold.
// The backend compares the changes and creates the transactions.
export async function updateInventory(
  api: AxiosInstance,
  businessId: string,
  update: UpdateInventoryRequest
) {
  const res = await api.put(`/api/business/${businessId}/inventory`, update);

  return res.data;
}