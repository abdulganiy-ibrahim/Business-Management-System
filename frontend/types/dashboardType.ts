// Matches GET api/business/{businessId}/dashboard
// ASP.NET Core turns C# property names into camelCase JSON by default.
// decimal / int / long -> number, Guid / DateTime / DateOnly -> string

export interface StatCard {
  current: number;
  previous: number;
  // null means last period was 0 and this one is not (show "New" instead of a number)
  changePercent: number | null;
}

export interface SummaryCards {
  totalSales: StatCard;
  moneyIn: StatCard;
  moneyOut: StatCard;
  totalProducts: StatCard;
}

export interface SalesChartPoint {
  date: string; // "2026-10-21" (yyyy-MM-dd), always 7 points, empty days have total 0
  total: number;
}

export interface TopProduct {
  productId: number;
  name: string;
  unitsSold: number;
}

export type OrderStatus = "Paid" | "Partial" | "Unpaid";

export interface RecentOrder {
  id: number;
  customerName: string | null;
  totalAmount: number;
  amountPaid: number;
  status: OrderStatus;
  createdAt: string; // ISO date-time in UTC, e.g. "2026-10-21T14:30:00Z"
}

export interface BusinessDashboardStats {
  summary: SummaryCards;
  salesChart: SalesChartPoint[];
  topProducts: TopProduct[]; // up to 5
  recentOrders: RecentOrder[]; // up to 5
}