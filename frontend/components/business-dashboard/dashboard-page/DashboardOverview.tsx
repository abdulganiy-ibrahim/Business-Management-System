import type { BusinessDashboardStats } from "@/types/dashboardType";
import QuickActions from "./QuickActionsMain";
import RecentSalesCard from "./RecentSalesCard";
import SalesChartCard from "./SalesChartCard";
import SummaryCardGrid from "./SummaryCardGrid";
import TopProductsCard from "./TopProductsCard";

type DashboardOverviewProps = {
  stats: BusinessDashboardStats;
  businessSlug: string; // for the links
};

// The dashboard home. Only the chart is a client component; everything else renders on the server.
export default function DashboardOverview({
  stats,
  businessSlug,
}: DashboardOverviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Here is how your business is doing.
        </p>
      </div>

      <SummaryCardGrid summary={stats.summary} />

      {/* Stacked on small screens, chart takes 2/3 from xl up */}
      <div className="grid gap-4 xl:grid-cols-3">
        <SalesChartCard points={stats.salesChart} className="xl:col-span-2" />
        <TopProductsCard products={stats.topProducts} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <RecentSalesCard
          orders={stats.recentOrders}
          businessSlug={businessSlug}
          className="xl:col-span-2"
        />
        <QuickActions businessSlug={businessSlug} />
      </div>
    </div>
  );
}