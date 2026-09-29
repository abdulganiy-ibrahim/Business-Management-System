import type { AxiosInstance } from "axios";
import { Business, BusinessFormValues } from "@/types/BusinessType";

export async function createBusiness(
  api: AxiosInstance,
  values: BusinessFormValues
  ) {
  const res = await api.post("/businesses", values);
  return res.data;

}

export async function getBusinesses(api: AxiosInstance) {
  const res = await api<Business[]>('api/businesses');

  return res.data;
}

export async function getBusinessBySlug(api: AxiosInstance, businessSlug: string): Promise<Business> {
  const res = await api.get<Business>(`api/businesses/${businessSlug}`);

  return res.data;
}

export async function editBusinessById(api: AxiosInstance, id: string, values: BusinessFormValues) {
  const res = await api.put(`api/businesses/${id}`, values);

  return res.data;
}

export async function deleteBusinessById(api: AxiosInstance, id: string) {
  const res = await api(`api/businesses/${id}`, {
    method: 'DELETE'
  });

  return res.data;
}