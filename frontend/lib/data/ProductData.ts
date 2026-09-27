import api from '../api/axios';
import { CreateProduct, Product } from '@/types/ProductType';


export async function createProduct(businessId: string, newProduct: CreateProduct) {
  const res = await api.post(`api/business/${businessId}/products`, newProduct);

  return res.data;
}

export async function getProductsByBusinessId(businessId: string): Promise<Product[]> {
  const res = await api.get<Product[]>(`api/business/${businessId}/products`);

  return res.data;
}

export async function getProductById(businessId: string, productId: number): Promise<Product> {
  const res = await api.get<Product>(`api/business/${businessId}/products/${productId}`);

  return res.data;
}

export async function deleteById(businessId: string, productId: number) {
  const res = await api.delete(`api/business/${businessId}/products/${productId}`);

  return res.data;
}