import api from "../api/axios";
import { Business, BusinessFormValues } from "@/types/BusinessType";

export async function createBusiness(values: BusinessFormValues) {
  const res = await api.post<Business>('api/businesses', values);

  return res.data;
}

export async function getBusinesses() {
  const res = await api<Business[]>('api/businesses');

  return res.data;
}

export async function getBusinessBySlug(businessSlug: string) {
  const res = await api.get<Business>(`api/businesses/${businessSlug}`);

  return res.data;
}

export async function editBusinessById(id: string, values: BusinessFormValues) {
  const res = await api.put(`api/businesses/${id}`, values);

  return res.data;
}

export async function deleteBusinessById(id: string) {
  const res = await api(`api/businesses/${id}`, {
    method: 'DELETE'
  });

  return res.data;
}