import { notFound } from "next/navigation";
import { DashboardOverview } from "@/components/business-dashboard";
import { getServerApi } from "@/lib/api/serverApi";
import { getBusinessBySlug } from "@/lib/data/BusinessData";
import { getBusinessDashboardStats } from "@/lib/data/dashboardData";

type DashboardPageProps = {
  params: Promise<{ businessSlug: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { businessSlug } = await params;
  const api = await getServerApi();

  const business = await getBusinessBySlug(api, businessSlug);
  if (!business) notFound();

  const stats = await getBusinessDashboardStats(api, business.id);

  return <DashboardOverview stats={stats} businessSlug={businessSlug} />;
}