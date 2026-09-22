import { createSupabaseServerClient } from "../supabase/supabaseServer";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  if (!apiUrl) {
    throw new Error("API URL is not defined");
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error("Failed to get authentication session");
  }

  if (!session?.access_token) {
    throw new Error("Authentication required");
  }

  return fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });
}