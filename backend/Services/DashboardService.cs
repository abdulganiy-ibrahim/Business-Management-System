using BusinessManagementApi.Models;
using BusinessManagementApi.Data;
using Microsoft.Extensions.Caching.Memory;

namespace BusinessManagementApi.Services;

public class DashboardService
{
    // Later you can store a timezone on the businesses table and pass it in here instead
    private const string BusinessTimeZone = "Africa/Lagos";

    private readonly DashboardRepository _repo;
    private readonly IMemoryCache _cache;

    public DashboardService(DashboardRepository repo, IMemoryCache cache)
    {
        _repo = repo;
        _cache = cache;
    }

    public async Task<BusinessDashboardStats> GetDashboardStatsAsync(Guid businessId)
    {
        // Same business refreshing within 30 seconds = one database hit, not many
        var stats = await _cache.GetOrCreateAsync($"dashboard:{businessId}", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);
            return await BuildAsync(businessId);
        });

        return stats!;
    }

    private async Task<BusinessDashboardStats> BuildAsync(Guid businessId)
    {
        // Start all queries at once. They don't depend on each other,
        // and with no transaction each one gets its own pooled connection.
        var salesTask    = _repo.GetSalesTotalsAsync(businessId, BusinessTimeZone);
        var debitTask    = _repo.GetDebitTotalsAsync(businessId, BusinessTimeZone);
        var productsTask = _repo.GetProductTotalsAsync(businessId, BusinessTimeZone);
        var chartTask    = _repo.GetSalesChartAsync(businessId, BusinessTimeZone);
        var topTask      = _repo.GetTopProductsAsync(businessId, BusinessTimeZone);
        var recentTask   = _repo.GetRecentOrdersAsync(businessId);

        await Task.WhenAll(salesTask, debitTask, productsTask, chartTask, topTask, recentTask);

        var (sales, moneyIn) = salesTask.Result;

        var summary = new SummaryCards(
            TotalSales:    ToCard(sales),
            MoneyIn:       ToCard(moneyIn),
            MoneyOut:      ToCard(debitTask.Result),
            TotalProducts: ToCard(productsTask.Result)
        );

        return new BusinessDashboardStats(
            summary,
            chartTask.Result,
            topTask.Result,
            recentTask.Result
        );
    }

    private static StatCard ToCard(PeriodTotals totals) =>
        new(totals.Current, totals.Previous, ChangePercent(totals.Current, totals.Previous));

    // growth % = (current - previous) / previous * 100
    private static decimal? ChangePercent(decimal current, decimal previous)
    {
        if (previous == 0)
            return current == 0 ? 0m : null; // nothing before: no change, or "new" (null)

        return Math.Round((current - previous) / previous * 100m, 1);
    }
}