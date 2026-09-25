import api from "../api/axios";
import { Business, BusinessFormValues } from "@/types/BusinessType";

export async function createBusiness(values: BusinessFormValues) {
  const res = await api.post<Business>('api/business', values);

  return res.data;
}

export async function getBusinesses() {
  const res = await api<Business[]>('api/business');

  return res.data;
}

export async function editBusinessById(id: string, values: BusinessFormValues) {
  const res = await api.put(`api/business/${id}`, values);

  return res.data;
}

export async function deleteBusinessById(id: string) {
  const res = await api(`api/business/${id}`, {
    method: 'DELETE'
  });

  return res.data;
}