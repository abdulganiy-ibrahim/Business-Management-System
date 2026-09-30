import { Header } from "@/components/business-dashboard";
import { getServerApi } from "@/lib/api/serverApi";
import { getBusinessBySlug, getBusinesses } from "@/lib/data/BusinessData";

type DashboardLayoutProps = {
  children: React.ReactNode
  params: Promise<{
    businessSlug: string
  }>
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const api = await getServerApi();

  const { businessSlug } = await params;

  const allBusinesses = await getBusinesses(api);
  const activeBusiness = await getBusinessBySlug(api, businessSlug);

  return (
    <div className="min-h-screen">
      
      <>
        <Header businesses={allBusinesses} activeBusiness={activeBusiness} />
      </>

      {children}
    </div>
  )
}