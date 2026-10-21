using BusinessManagementApi.Models;

namespace BusinessManagementApi.Data;

public class BusinessDashboardRepository
{
    private readonly UnitOfWork _uow;

    public BusinessDashboardRepository(UnitOfWork uow)
    {
        _uow = uow;
    }

    // The two 7-day windows, worked out by the database in the business's timezone.
    //   cur_start  = midnight 6 days ago (so today + the 6 days before = 7 days)
    //   cur_end    = midnight tomorrow
    //   prev_start = midnight 13 days ago (the 7 days before the current window)
    private const string Bounds = """
        bounds AS (
            SELECT
                (date_trunc('day', now() AT TIME ZONE @tz) - interval '6 days')  AT TIME ZONE @tz AS cur_start,
                (date_trunc('day', now() AT TIME ZONE @tz) + interval '1 day')   AT TIME ZONE @tz AS cur_end,
                (date_trunc('day', now() AT TIME ZONE @tz) - interval '13 days') AT TIME ZONE @tz AS prev_start
        )
        """;

    // ---------- Total sales + money in (both come from the sales table) ----------
    public async Task<(PeriodTotals Sales, PeriodTotals MoneyIn)> GetSalesTotalsAsync(Guid businessId, string tz)
    {
        var sql = "WITH " + Bounds + """

            SELECT
                COALESCE(SUM(s.total_amount) FILTER (WHERE s.created_at >= b.cur_start), 0),
                COALESCE(SUM(s.total_amount) FILTER (WHERE s.created_at <  b.cur_start), 0),
                COALESCE(SUM(s.amount_paid)  FILTER (WHERE s.created_at >= b.cur_start), 0),
                COALESCE(SUM(s.amount_paid)  FILTER (WHERE s.created_at <  b.cur_start), 0)
            FROM sales s
            CROSS JOIN bounds b
            WHERE s.business_id = @businessId
              AND s.created_at >= b.prev_start
              AND s.created_at <  b.cur_end
            """;

        await using var cmd = _uow.CreateCommand(sql);
        cmd.Parameters.AddWithValue("businessId", businessId);
        cmd.Parameters.AddWithValue("tz", tz);

        await using var reader = await cmd.ExecuteReaderAsync();
        await reader.ReadAsync();

        return (
            new PeriodTotals(reader.GetDecimal(0), reader.GetDecimal(1)),
            new PeriodTotals(reader.GetDecimal(2), reader.GetDecimal(3))
        );
    }

    // ---------- Money out (debit): what customers still owe from sales made in the window ----------
    public async Task<PeriodTotals> GetDebitTotalsAsync(Guid businessId, string tz)
    {
        var sql = "WITH " + Bounds + """

            SELECT
                COALESCE(SUM(d.amount_due - d.amount_paid) FILTER (WHERE d.created_at >= b.cur_start), 0),
                COALESCE(SUM(d.amount_due - d.amount_paid) FILTER (WHERE d.created_at <  b.cur_start), 0)
            FROM debit_sales d
            JOIN sales s ON s.id = d.sale_id
            CROSS JOIN bounds b
            WHERE s.business_id = @businessId
              AND d.created_at >= b.prev_start
              AND d.created_at <  b.cur_end
            """;

        await using var cmd = _uow.CreateCommand(sql);
        cmd.Parameters.AddWithValue("businessId", businessId);
        cmd.Parameters.AddWithValue("tz", tz);

        await using var reader = await cmd.ExecuteReaderAsync();
        await reader.ReadAsync();

        return new PeriodTotals(reader.GetDecimal(0), reader.GetDecimal(1));
    }

    // ---------- Total products: how many now vs how many existed 7 days ago ----------
    public async Task<PeriodTotals> GetProductTotalsAsync(Guid businessId, string tz)
    {
        var sql = "WITH " + Bounds + """

            SELECT
                COUNT(*),
                COUNT(*) FILTER (WHERE p.created_at < b.cur_start)
            FROM products p
            CROSS JOIN bounds b
            WHERE p.business_id = @businessId
            """;

        await using var cmd = _uow.CreateCommand(sql);
        cmd.Parameters.AddWithValue("businessId", businessId);
        cmd.Parameters.AddWithValue("tz", tz);

        await using var reader = await cmd.ExecuteReaderAsync();
        await reader.ReadAsync();

        return new PeriodTotals(reader.GetInt64(0), reader.GetInt64(1));
    }

    // ---------- Sales chart: one point per day, empty days = 0 ----------
    public async Task<List<SalesChartPoint>> GetSalesChartAsync(Guid businessId, string tz)
    {
        const string sql = """
            WITH days AS (
                SELECT generate_series(
                    date_trunc('day', now() AT TIME ZONE @tz) - interval '6 days',
                    date_trunc('day', now() AT TIME ZONE @tz),
                    interval '1 day'
                ) AS day
            )
            SELECT d.day::date, COALESCE(SUM(s.total_amount), 0)
            FROM days d
            LEFT JOIN sales s
                   ON s.business_id = @businessId
                  AND s.created_at >= (d.day AT TIME ZONE @tz)
                  AND s.created_at <  ((d.day + interval '1 day') AT TIME ZONE @tz)
            GROUP BY d.day
            ORDER BY d.day
            """;

        await using var cmd = _uow.CreateCommand(sql);
        cmd.Parameters.AddWithValue("businessId", businessId);
        cmd.Parameters.AddWithValue("tz", tz);

        var points = new List<SalesChartPoint>();
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            points.Add(new SalesChartPoint(reader.GetFieldValue<DateOnly>(0), reader.GetDecimal(1)));
        }
        return points;
    }

    // ---------- Top 5 best selling products (last 7 days, by units sold) ----------
    // ASSUMES sale_items has: sale_id, product_id, quantity
    public async Task<List<TopProduct>> GetTopProductsAsync(Guid businessId, string tz)
    {
        var sql = "WITH " + Bounds + """

            SELECT p.id, p.name, SUM(si.quantity)::bigint AS units_sold
            FROM sale_items si
            JOIN sales s    ON s.id = si.sale_id
            JOIN products p ON p.id = si.product_id
            CROSS JOIN bounds b
            WHERE s.business_id = @businessId
              AND s.created_at >= b.cur_start
              AND s.created_at <  b.cur_end
            GROUP BY p.id, p.name
            ORDER BY units_sold DESC, p.name
            LIMIT 5
            """;

        await using var cmd = _uow.CreateCommand(sql);
        cmd.Parameters.AddWithValue("businessId", businessId);
        cmd.Parameters.AddWithValue("tz", tz);

        var products = new List<TopProduct>();
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            products.Add(new TopProduct(reader.GetInt32(0), reader.GetString(1), reader.GetInt64(2)));
        }
        return products;
    }

    // ---------- 5 most recent orders ----------
    public async Task<List<RecentOrder>> GetRecentOrdersAsync(Guid businessId)
    {
        const string sql = """
            SELECT id, customer_name, total_amount, amount_paid, created_at
            FROM sales
            WHERE business_id = @businessId
            ORDER BY created_at DESC
            LIMIT 5
            """;

        await using var cmd = _uow.CreateCommand(sql);
        cmd.Parameters.AddWithValue("businessId", businessId);

        var orders = new List<RecentOrder>();
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var total = reader.GetDecimal(2);
            var paid = reader.GetDecimal(3);

            var status = paid >= total ? "Paid"
                       : paid <= 0     ? "Unpaid"
                       :                 "Partial";

            orders.Add(new RecentOrder(
                reader.GetInt32(0),
                reader.IsDBNull(1) ? null : reader.GetString(1),
                total,
                paid,
                status,
                reader.GetDateTime(4)
            ));
        }
        return orders;
    }
}