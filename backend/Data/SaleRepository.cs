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
}