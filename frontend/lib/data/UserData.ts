import type { AxiosInstance } from "axios";
import { User } from "@/types/UserType";

export async function getCurrentUser(api: AxiosInstance): Promise<User> {
  const res = await api.get<User>(`/api/users/me`);

  return res.data;
}