import { redirect } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase/supabaseServer";
import { getBusinessBySlug } from "@/lib/data/BusinessData";
import { getSalesByBusinessId } from "@/lib/data/saleData";
import { Business } from "@/types/BusinessType";
import { Sale } from "@/types/saleType";
import { getServerApi } from "@/lib/api/serverApi";

type SalesPageProps = {
  params:
    Promise<{
      businessSlug: string;
    }>
}

export default async function SalesPage({ params }: SalesPageProps) {
  const supabase = await supabaseServerClient();
  const { data: session, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.session) {
    redirect("/login");
  }

  const api = await getServerApi();

  const { businessSlug } = await params;
  const business: Business = await getBusinessBySlug(api, businessSlug);
  const sales: Sale[] = await getSalesByBusinessId(api, business.id);

  return (
    <div>
      <h1>Sales for {business.name}</h1>
    </div>
  )
}