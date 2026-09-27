import { supabaseServerClient } from "@/lib/supabase/supabaseServer";
import { redirect } from "next/navigation";
import { getBusinessBySlug } from "@/lib/data/BusinessData";
import { Business } from "@/types/BusinessType";

type ParamsProps = {
  params: Promise<{
    businessSlug: string;
  }>
}

export default async function BusinessDashboardPage({ params }: ParamsProps) {
  const supabase = await supabaseServerClient();

  const {data: { user }, error} = await supabase.auth.getUser();

  if (error || !user){
    redirect('/sign-up');
  }

  const { businessSlug } = await params;

  let business: Business;

  try {
    business = await getBusinessBySlug(businessSlug); 
  } catch (error) {
    console.log(error);
    return;
  }

  console.log(business);


  return (
    <>
      <h1>{business.slug}</h1>
      <h1>{business.phoneNumber}</h1>
    </>
  )

}