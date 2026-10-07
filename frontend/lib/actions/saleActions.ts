"use server";

import { getServerApi } from "@/lib/api/serverApi";
import {
  createSale,
  getSaleItemsBySaleId,
  paySaleDebt,
} from "@/lib/data/saleData";
import type { CreateSaleRequest, SaleItem } from "@/types/saleType";
import { getErrorMessage, type ActionResult } from "./actionUtils";

export async function createSaleAction(
  businessId: string,
  newSale: CreateSaleRequest,
): Promise<ActionResult> {
  try {
    const api = await getServerApi();
    await createSale(api, businessId, newSale);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function getSaleItemsAction(
  businessId: string,
  saleId: number,
): Promise<ActionResult<SaleItem[]>> {
  try {
    const api = await getServerApi();
    const items = await getSaleItemsBySaleId(api, businessId, saleId);
    return { success: true, data: items };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function payDebtAction(
  businessId: string,
  saleId: number,
  amount: number,
): Promise<ActionResult> {
  try {
    const api = await getServerApi();
    await paySaleDebt(api, businessId, saleId, amount);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}