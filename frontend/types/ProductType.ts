export interface CreateProduct {
  name: string;
  sku?: string;
  costPrice: number;
  sellingPrice: number;
}

export interface Product {
  id: number;
  businessId: string;
  name: string;
  sku?: string;
  costPrice: string;
  sellingPrice: string;
  createdAt: string;
  updatedAt: string;
}