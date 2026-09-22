import { User } from "@/types/UserType";
import { apiFetch } from "./apiFetch";

export async function getUserById(id: string): Promise<User> {
  try {
    const res = await apiFetch(`/api/user/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to get user: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}