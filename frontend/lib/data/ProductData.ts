import type { AxiosInstance } from 'axios';
import { CreateProduct, Product } from '@/types/productType';


export async function createProduct(api: AxiosInstance, businessId: string, newProduct: CreateProduct) {
  const res = await api.post(`api/business/${businessId}/products`, newProduct);

  return res.data;
}

export async function getProductsByBusinessId(api: AxiosInstance, businessId: string): Promise<Product[]> {
  const res = await api.get<Product[]>(`api/business/${businessId}/products`);

  return res.data;
}

export async function getProductById(api: AxiosInstance, businessId: string, productId: number): Promise<Product> {
  const res = await api.get<Product>(`api/business/${businessId}/products/${productId}`);

  return res.data;
}

export async function deleteById(api: AxiosInstance, businessId: string, productId: number) {
  const res = await api.delete(`api/business/${businessId}/products/${productId}`);

  return res.data;
}