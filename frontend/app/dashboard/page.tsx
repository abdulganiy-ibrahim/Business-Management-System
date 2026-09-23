import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/supabaseServer";
import { OnboardingDashboard } from "@/components/create-business-dashboard";
import { getUser } from "@/lib/data/UserData";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/sign-up');
  }
  
  return <OnboardingDashboard businesses={[]} />;
}