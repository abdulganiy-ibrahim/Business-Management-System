export interface CreateSaleItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateSaleRequest {
  customerName?: string;
  customerNumber?: string;
  saleItems: CreateSaleItemRequest[];
  paidAmount: number;
}

export interface Sale {
  id: number;
  businessId: string;
  customerName?: string;
  customerNumber?: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
}

export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}