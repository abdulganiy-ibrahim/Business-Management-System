using Npgsql;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Data;

public class SaleRepository
{
  private readonly UnitOfWork _uow;

  public SaleRepository(UnitOfWork uow)
  {
    _uow = uow;
  }

  // ---------- Writes (join the active transaction, if there is one) ----------

  public async Task<int> AddSaleAsync(AddSaleRecord sale)
  {
    var sql = @"
      INSERT INTO sales (business_id, customer_name, customer_number, total_amount, amount_paid)
      VALUES (@businessId, @customerName, @customerNumber, @totalAmount, @amountPaid)
      RETURNING id;
    ";

    await using var cmd = _uow.CreateCommand(sql);
    cmd.Parameters.AddWithValue("@businessId", sale.BusinessId);
    cmd.Parameters.AddWithValue("@customerName", sale.CustomerName ?? (object)DBNull.Value);
    cmd.Parameters.AddWithValue("@customerNumber", sale.CustomerNumber ?? (object)DBNull.Value);
    cmd.Parameters.AddWithValue("@totalAmount", sale.TotalAmount);
    cmd.Parameters.AddWithValue("@amountPaid", sale.AmountPaid);

    return Convert.ToInt32(await cmd.ExecuteScalarAsync());
  }

  public async Task AddSaleItemAsync(int saleId, AddSaleItemRecord item)
  {
    var sql = @"
      INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price)
      VALUES (@saleId, @productId, @quantity, @unitPrice, @totalPrice);
    ";

    await using var cmd = _uow.CreateCommand(sql);
    cmd.Parameters.AddWithValue("@saleId", saleId);
    cmd.Parameters.AddWithValue("@productId", item.ProductId);
    cmd.Parameters.AddWithValue("@quantity", item.Quantity);
    cmd.Parameters.AddWithValue("@unitPrice", item.UnitPrice);
    cmd.Parameters.AddWithValue("@totalPrice", item.TotalPrice);

    await cmd.ExecuteNonQueryAsync();
  }

  // ---------- Reads ----------

  public async Task<List<SaleRecord>> GetSalesByBusinessIdAsync(Guid businessId)
  {
    var sql = @"
      SELECT id, business_id, customer_name, customer_number, total_amount, amount_paid, created_at
      FROM sales
      WHERE business_id = @businessId;
    ";

    await using var cmd = _uow.CreateCommand(sql);
    cmd.Parameters.AddWithValue("@businessId", businessId);

    var sales = new List<SaleRecord>();
    await using var reader = await cmd.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
      sales.Add(MapSale(reader));
    }

    return sales;
  }

  public async Task<SaleRecord?> GetSaleByIdAsync(int saleId)
  {
    var sql = @"
      SELECT id, business_id, customer_name, customer_number, total_amount, amount_paid, created_at
      FROM sales
      WHERE id = @saleId;
    ";

    await using var cmd = _uow.CreateCommand(sql);
    cmd.Parameters.AddWithValue("@saleId", saleId);

    await using var reader = await cmd.ExecuteReaderAsync();
    return await reader.ReadAsync() ? MapSale(reader) : null;
  }

  public async Task<List<SaleItem>> GetSaleItemsBySaleIdAsync(int saleId)
  {
    var sql = @"
      SELECT id, sale_id, product_id, quantity, unit_price, total_price
      FROM sale_items
      WHERE sale_id = @saleId;
    ";

    await using var cmd = _uow.CreateCommand(sql);
    cmd.Parameters.AddWithValue("@saleId", saleId);

    var saleItems = new List<SaleItem>();
    await using var reader = await cmd.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
      saleItems.Add(MapSaleItem(reader));
    }

    return saleItems;
  }

  // ---------- Mapping helpers (one place to change if a column changes) ----------

  private static SaleRecord MapSale(NpgsqlDataReader reader) => new(
    reader.GetInt32(0),
    reader.GetGuid(1),
    reader.IsDBNull(2) ? null : reader.GetString(2),
    reader.IsDBNull(3) ? null : reader.GetString(3),
    reader.GetDecimal(4),
    reader.GetDecimal(5),
    reader.GetDateTime(6)
  );

  private static SaleItem MapSaleItem(NpgsqlDataReader reader) => new(
    reader.GetInt32(0),
    reader.GetInt32(1),
    reader.GetInt32(2),
    reader.GetInt32(3),
    reader.GetDecimal(4),
    reader.GetDecimal(5)
  );
}