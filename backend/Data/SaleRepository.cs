using Npgsql;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Data;

public class SaleRepository
{
  private readonly string _connectionString;

  public SaleRepository(string connectionString)
  {
    _connectionString = connectionString;
  }

  public async Task<int> CreateSaleWithItemsAsync(AddSaleRecord sale, IReadOnlyList<AddSaleItemRecord> items)
  {
    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();
    await using var transaction = await conn.BeginTransactionAsync();

    var saleSql = @"
      INSERT INTO sales (business_id, customer_name, customer_number, total_amount, paid_amount)
      VALUES (@businessId, @customerName, @customerNumber, @totalAmount, @paidAmount)
      RETURNING id;
    ";

    int saleId;
    await using (var saleCmd = new NpgsqlCommand(saleSql, conn, transaction))
    {
      saleCmd.Parameters.AddWithValue("@businessId", sale.BusinessId);
      saleCmd.Parameters.AddWithValue("@customerName", sale.CustomerName ?? (object)DBNull.Value);
      saleCmd.Parameters.AddWithValue("@customerNumber", sale.CustomerNumber ?? (object)DBNull.Value);
      saleCmd.Parameters.AddWithValue("@totalAmount", sale.TotalAmount);
      saleCmd.Parameters.AddWithValue("@paidAmount", sale.PaidAmount);

      saleId = Convert.ToInt32(await saleCmd.ExecuteScalarAsync());
    }

    var itemSql = @"
      INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price)
      VALUES (@saleId, @productId, @quantity, @unitPrice, @totalPrice);
    ";

    foreach (var item in items)
    {
      await using var itemCmd = new NpgsqlCommand(itemSql, conn, transaction);
      itemCmd.Parameters.AddWithValue("@saleId", saleId);
      itemCmd.Parameters.AddWithValue("@productId", item.ProductId);
      itemCmd.Parameters.AddWithValue("@quantity", item.Quantity);
      itemCmd.Parameters.AddWithValue("@unitPrice", item.UnitPrice);
      itemCmd.Parameters.AddWithValue("@totalPrice", item.TotalPrice);

      await itemCmd.ExecuteNonQueryAsync();
    }

    await transaction.CommitAsync();
    return saleId;
  }

  // Get Sales by BusinessId Async Method.
  public async Task<List<SaleRecord>> GetSalesByBusinessIdAsync(Guid businessId)
  {
    var sales = new List<SaleRecord>();

    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    var sqlCommand = @"
      SELECT id, business_id, customer_name, customer_number, total_amount, paid_amount, created_at
      FROM sales
      WHERE business_id = @businessId;
    ";

    await using var cmd = new NpgsqlCommand(sqlCommand, conn);
    cmd.Parameters.AddWithValue("@businessId", businessId);

    await using var reader = await cmd.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
      sales.Add(new SaleRecord(
        reader.GetInt32(0),
        reader.GetGuid(1),
        reader.IsDBNull(2) ? null : reader.GetString(2),
        reader.IsDBNull(3) ? null : reader.GetString(3),
        reader.GetDecimal(4),
        reader.GetDecimal(5),
        reader.GetDateTime(6)
      ));
    }

    return sales;
  }

  // Get Sale by SaleId Async Method.
  public async Task<SaleRecord?> GetSaleByIdAsync(int saleId)
  {
    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    var sqlCommand = @"
      SELECT id, business_id, customer_name, customer_number, total_amount, paid_amount, created_at
      FROM sales
      WHERE id = @saleId;
    ";

    await using var cmd = new NpgsqlCommand(sqlCommand, conn);
    cmd.Parameters.AddWithValue("@saleId", saleId);

    await using var reader = await cmd.ExecuteReaderAsync();
    if (await reader.ReadAsync())
    {
      return new SaleRecord(
        reader.GetInt32(0),
        reader.GetGuid(1),
        reader.IsDBNull(2) ? null : reader.GetString(2),
        reader.IsDBNull(3) ? null : reader.GetString(3),
        reader.GetDecimal(4),
        reader.GetDecimal(5),
        reader.GetDateTime(6)
      );
    }

    return null;
  }

  // Get Sale Items by SaleId Async Method.
  public async Task<List<SaleItem>> GetSaleItemsBySaleIdAsync(int saleId)
  {
    var saleItems = new List<SaleItem>();

    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    var sqlCommand = @"
      SELECT id, sale_id, product_id, quantity, unit_price, total_price
      FROM sale_items
      WHERE sale_id = @saleId;
    ";

    await using var cmd = new NpgsqlCommand(sqlCommand, conn);
    cmd.Parameters.AddWithValue("@saleId", saleId);

    await using var reader = await cmd.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
      saleItems.Add(new SaleItem(
        reader.GetInt32(0),
        reader.GetInt32(1),
        reader.GetInt32(2),
        reader.GetInt32(3),
        reader.GetDecimal(4),
        reader.GetDecimal(5)
      ));
    }

    return saleItems;
  }
}