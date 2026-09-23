import api from "../api/axios";
import { Business } from "@/types/BusinessType";

export async function getBusinesses() {
  const res = await api<Business[]>('api/business');

  return res.data;
}