"use server";

import { getServerApi } from "@/lib/api/serverApi";
import {
  getInventoryTransactionsByInventoryId,
  updateInventory,
} from "@/lib/data/inventoryData";
import type { UpdateInventoryRequest } from "@/types/inventoryType";
import type { InventoryTransaction } from "@/types/inventoryTransactionType";
import { getErrorMessage, type ActionResult } from "./actionUtils";

export async function updateInventoryAction(
  businessId: string,
  inventoryId: number,
  update: UpdateInventoryRequest,
): Promise<ActionResult> {
  try {
    const api = await getServerApi();
    await updateInventory(api, businessId, inventoryId, update);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function getInventoryTransactionsAction(
  businessId: string,
  inventoryId: number,
): Promise<ActionResult<InventoryTransaction[]>> {
  try {
    const api = await getServerApi();
    const transactions = await getInventoryTransactionsByInventoryId(
      api,
      businessId,
      inventoryId,
    );
    return { success: true, data: transactions };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}