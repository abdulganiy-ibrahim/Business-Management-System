import { DashboardShell } from "@/components/business-dashboard";
import { getServerApi } from "@/lib/api/serverApi";
import { getCurrentUser } from "@/lib/data/userData";
import { getBusinessBySlug, getBusinesses } from "@/lib/data/BusinessData";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    businessSlug: string;
  }>;
};

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const api = await getServerApi();

  const { businessSlug } = await params;

  const currentUser = await getCurrentUser(api);
  const allBusinesses = await getBusinesses(api);
  const activeBusiness = await getBusinessBySlug(api, businessSlug);

  return (
    <DashboardShell
      businesses={allBusinesses}
      activeBusiness={activeBusiness}
      user={currentUser}
    >
      {children}
    </DashboardShell>
  );
}