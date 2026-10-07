import type { AxiosInstance } from "axios";
import type { CreateSaleRequest, Sale, SaleItem } from "@/types/saleType";

// Create a new sale
export async function createSale(
  api: AxiosInstance,
  businessId: string,
  newSale: CreateSaleRequest
) {
  const res = await api.post(`/api/business/${businessId}/sales`, newSale);

  return res.data;
}

// Get sales by businessId
export async function getSalesByBusinessId(
  api: AxiosInstance,
  businessId: string
): Promise<Sale[]> {
  const res = await api.get<Sale[]>(`/api/business/${businessId}/sales`);

  return res.data;
}

// Get sale by saleId
export async function getSaleById(
  api: AxiosInstance,
  businessId: string,
  saleId: number
): Promise<Sale> {
  const res = await api.get<Sale>(`/api/business/${businessId}/sales/${saleId}`);

  return res.data;
}

// Get sale items by sale id
export async function getSaleItemsBySaleId(
  api: AxiosInstance,
  businessId: string,
  saleId: number
): Promise<SaleItem[]> {
  const res = await api.get<SaleItem[]>(`/api/business/${businessId}/sales/${saleId}/items`);

  return res.data;
}

// Pay part or all of the debt on a sale (sends saleId and amountPaid)
export async function paySaleDebt(
  api: AxiosInstance,
  businessId: string,
  saleId: number,
  amountPaid: number
) {
  const res = await api.post(`/api/business/${businessId}/sales/${saleId}/payments`, {
    amountPaid,
  });

  return res.data;
}