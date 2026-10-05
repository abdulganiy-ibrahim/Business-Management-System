using Npgsql;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Data;

public class DebitSaleRepository
{
  private readonly string _connectionString;

  public DebitSaleRepository(string connectionString)
  {
    _connectionString = connectionString;
  }

  // Create a new debit record
  public async Task<int> AddDebitAsync(CreateDebitSaleRequest newDebit)
  {
    var query = @"
      INSERT INTO debit_sales (sale_id, amount_due, amount_paid)
      VALUES (@SaleId, @AmountDue, @AmountPaid)
      RETURNING id;
    ";
    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(query, conn);
    cmd.Parameters.AddWithValue("SaleId", newDebit.SaleId);
    cmd.Parameters.AddWithValue("AmountDue", newDebit.AmountDue);
    cmd.Parameters.AddWithValue("AmountPaid", newDebit.AmountPaid);

    var newDebitId = (int)(await cmd.ExecuteScalarAsync())!;

    return newDebitId;    
  }

  public async Task<DebitRecord?> GetBySaleIdAsync(int saleId)
  {
    var query = @"
      SELECT id, sale_id, amount_due, amount_paid, created_at, updated_at
      FROM debit_sales
      WHERE sale_id = @SaleId;
    ";

    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(query, conn);
    cmd.Parameters.AddWithValue("SaleId", saleId);

    await using var reader = await cmd.ExecuteReaderAsync();
    if (await reader.ReadAsync())
    {
      return new DebitRecord(
        reader.GetInt32(0),
        reader.GetInt32(1),
        reader.GetDecimal(2),
        reader.GetDecimal(3),
        reader.GetDateTime(4),
        reader.GetDateTime(5)
      );
    }

    return null;
  }
}