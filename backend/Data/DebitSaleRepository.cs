using Npgsql;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Data;

public class DebitSaleRepository
{
  private readonly UnitOfWork _uow;

  public DebitSaleRepository(UnitOfWork uow)
  {
    _uow = uow;
  }

  // ---------- Write (joins the active transaction, if there is one) ----------

  public async Task<int> AddDebitAsync(CreateDebitSaleRequest newDebit)
  {
    var sql = @"
      INSERT INTO debit_sales (sale_id, amount_due, amount_paid)
      VALUES (@saleId, @amountDue, @amountPaid)
      RETURNING id;
    ";

    await using var cmd = _uow.CreateCommand(sql);
    cmd.Parameters.AddWithValue("@saleId", newDebit.SaleId);
    cmd.Parameters.AddWithValue("@amountDue", newDebit.AmountDue);
    cmd.Parameters.AddWithValue("@amountPaid", newDebit.AmountPaid);

    return Convert.ToInt32(await cmd.ExecuteScalarAsync());
  }

  // ---------- Read ----------

  public async Task<DebitRecord?> GetBySaleIdAsync(int saleId)
  {
    var sql = @"
      SELECT id, sale_id, amount_due, amount_paid, created_at, updated_at
      FROM debit_sales
      WHERE sale_id = @saleId;
    ";

    await using var cmd = _uow.CreateCommand(sql);
    cmd.Parameters.AddWithValue("@saleId", saleId);

    await using var reader = await cmd.ExecuteReaderAsync();
    return await reader.ReadAsync() ? MapDebit(reader) : null;
  }

  // ---------- Mapping helper ----------

  private static DebitRecord MapDebit(NpgsqlDataReader reader) => new(
    reader.GetInt32(0),
    reader.GetInt32(1),
    reader.GetDecimal(2),
    reader.GetDecimal(3),
    reader.GetDateTime(4),
    reader.GetDateTime(5)
  );
}