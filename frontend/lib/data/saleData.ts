import type { AxiosInstance } from "axios";
import type { CreateSaleRequest, Sale, SaleItem } from "@/types/saleType";

// Create a new sale
export async function createSale(
  api: AxiosInstance,
  businessId: string,
  newSale: CreateSaleRequest
) {
  const res = await api.post(`/api/businesses/${businessId}/sales`, newSale);

  return res.data;
}

// Get sales by businessId
export async function getSalesByBusinessId(
  api: AxiosInstance,
  businessId: string
): Promise<Sale[]> {
  const res = await api.get<Sale[]>(`/api/businesses/${businessId}/sales`);

  return res.data;
}

// Get sale by saleId
export async function getSaleById(
  api: AxiosInstance,
  businessId: string,
  saleId: number
): Promise<Sale> {
  const res = await api.get<Sale>(`/api/businesses/${businessId}/sales/${saleId}`);

  return res.data;
}

// Get sale items by sale id
export async function getSaleItemsBySaleId(
  api: AxiosInstance,
  businessId: string,
  saleId: number
): Promise<SaleItem[]> {
  const res = await api.get<SaleItem[]>(`/api/businesses/${businessId}/sales/${saleId}/items`);

  return res.data;
}