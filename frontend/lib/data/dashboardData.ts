import type { AxiosInstance } from "axios";
import type { BusinessDashboardStats } from "@/types/dashboardType";

// Get the dashboard stats of a business
export async function getBusinessDashboardStats(
  api: AxiosInstance,
  businessId: string
): Promise<BusinessDashboardStats> {
  const res = await api.get<BusinessDashboardStats>(`/api/business/${businessId}/dashboard`);

  return res.data;
}