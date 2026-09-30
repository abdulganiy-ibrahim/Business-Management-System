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
  costPrice: number;
  sellingPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProduct {
  name?: string;
  sku?: string;
  costPrice?: number;
  sellingPrice?: number;
}