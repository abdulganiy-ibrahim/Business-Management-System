import { redirect } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase/supabaseServer";
import { OnboardingDashboard } from "@/components/create-business-dashboard";
import { getBusinesses } from "@/lib/data/BusinessData";
import { getServerApi } from "@/lib/api/serverApi";
import { Business } from "@/types/BusinessType";

function isNotFoundError(error: unknown): boolean {
  const { status, response } = (error ?? {}) as {
    status?: number;
    response?: { status?: number };
  };
  return status === 404 || response?.status === 404;
}

async function loadBusinesses(
  api: Awaited<ReturnType<typeof getServerApi>>
): Promise<Business[]> {
  try {
    return (await getBusinesses(api)) ?? [];
  } catch (error) {
    if (isNotFoundError(error)) return [];
    throw error; // real failures go to error.tsx
  }
}

export default async function Page() {
  const supabase = await supabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/sign-up');
  }

  const api = await getServerApi();

  const businesses = await loadBusinesses(api);
  
  return <OnboardingDashboard businesses={businesses} />;
}