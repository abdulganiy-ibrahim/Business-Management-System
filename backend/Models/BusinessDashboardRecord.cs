namespace BusinessManagementApi.Models;

// ---------- What the frontend receives ----------

// One summary card. ChangePercent is null when last period was 0 and this period is not
// (you can't divide by zero), so the frontend can show "New" instead of a number.
public record StatCard(decimal Current, decimal Previous, decimal? ChangePercent);

public record SummaryCards(
    StatCard TotalSales,
    StatCard MoneyIn,
    StatCard MoneyOut,
    StatCard TotalProducts
);

public record SalesChartPoint(DateOnly Date, decimal Total);

public record TopProduct(int ProductId, string Name, long UnitsSold);

public record RecentOrder(
    int Id,
    string? CustomerName,
    decimal TotalAmount,
    decimal AmountPaid,
    string Status, // Paid, Partial or Unpaid
    DateTime CreatedAt
);

public record BusinessDashboardStats(
    SummaryCards Summary,
    List<SalesChartPoint> SalesChart,
    List<TopProduct> TopProducts,
    List<RecentOrder> RecentOrders
);

// ---------- Internal: raw numbers from the repository ----------

// Current = last 7 days, Previous = the 7 days before that
public record PeriodTotals(decimal Current, decimal Previous);