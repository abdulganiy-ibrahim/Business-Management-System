using BusinessManagementSystem.Model;

namespace BusinessManagementSystem.Data;

public class SaleRepository
{
  private readonly string _connectionString;

  public SaleRepository(string connectionString)
  {
    _connectionString = connectionString;
  }

  public int AddSale(SaleRecord newSale)
  {
    using var conn = new Npgsql.NpgsqlConnection(_connectionString);
    conn.Open();

    using var cmd = new Npgsql.NpgsqlCommand(
      "INSERT INTO sales (business_id, customer_name, customer_number, total_amount, paid_amount) VALUES (@businessId, @customerName, @customerNumber, @totalAmount, @paidAmount) RETURNING id",
      conn
    );
    cmd.Parameters.AddWithValue("@businessId", newSale.BusinessId);
    cmd.Parameters.AddWithValue("@customerName", newSale.CustomerName ?? (object)DBNull.Value);
    cmd.Parameters.AddWithValue("@customerNumber", newSale.CustomerNumber ?? (object)DBNull.Value);
    cmd.Parameters.AddWithValue("@totalAmount", newSale.TotalAmount);
    cmd.Parameters.AddWithValue("@paidAmount", newSale.PaidAmount);

    return (int)cmd.ExecuteScalar()!;
  }
}