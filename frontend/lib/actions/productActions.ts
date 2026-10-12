"use server";

// Client components can't call your product helpers directly: they need `api`,
// which comes from getServerApi (server only). This action runs on the server,
// builds `api`, calls the helper, and returns a simple result.

import { getServerApi } from "@/lib/api/serverApi";
import { createProduct } from "@/lib/data/productData";
import type { CreateProduct } from "@/types/productType";
import { getErrorMessage, type ActionResult } from "./actionUtils";

export async function createProductAction(
  businessId: string,
  newProduct: CreateProduct,
): Promise<ActionResult> {
  try {
    const api = await getServerApi();
    await createProduct(api, businessId, newProduct);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}