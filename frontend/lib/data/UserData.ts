import { User } from "@/types/UserType";
import { apiFetch } from "../api/apiFetch";

export async function getUser(): Promise<User> {
  try {
    const res = await apiFetch(`/api/user/me`);

    if (!res.ok) {
      throw new Error(`Failed to get user: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}