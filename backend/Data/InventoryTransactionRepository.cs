using BusinessManagementApi.Models;

namespace BusinessManagementApi.Data;

public class InventoryTransactionRepository
{
  private readonly UnitOfWork _uow;

  public InventoryTransactionRepository(UnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task InsertAsync(CreateInventoryTransactionReq request)
  {
    var sql = @"
      INSERT INTO inventory_transactions (business_id, inventory_id, transaction_type, quantity_change, transaction_desc)
      VALUES (@businessId, @inventoryId, @transactionType, @quantityChange, @transactionDesc)
    ";

    await using var cmd = _uow.CreateCommand(sql);
    cmd.Parameters.AddWithValue("businessId", request.BusinessId);
    cmd.Parameters.AddWithValue("inventoryId", request.InventoryId);
    cmd.Parameters.AddWithValue("transactionType", request.TransactionType);
    cmd.Parameters.AddWithValue("quantityChange", request.QuantityChange);
    cmd.Parameters.AddWithValue("transactionDesc", (object?)request.TransactionDesc ?? DBNull.Value);

    await cmd.ExecuteNonQueryAsync();
  }

  public async Task<List<InventoryTransactionRecord>> GetByInventoryIdAsync(
    int inventoryId, 
    Guid businessId, 
    CancellationToken cancellationToken)
  {
    var inventoryTransactions = new List<InventoryTransactionRecord>();

    var sql = @"
      SELECT 
        id, business_id, inventory_id, transaction_type, quantity_change, transaction_desc, created_at
      FROM inventory_transactions
      WHERE inventory_id = @inventoryId
      AND business_id = @businessId
    ";

    await using var cmd = _uow.CreateCommand(sql);

    cmd.Parameters.AddWithValue("inventoryId", inventoryId);
    cmd.Parameters.AddWithValue("businessId", businessId);

    await using var reader = await cmd.ExecuteReaderAsync(cancellationToken);

    while (await reader.ReadAsync(cancellationToken))
    {
      inventoryTransactions.Add(new InventoryTransactionRecord(
        reader.GetInt32(0),
        reader.GetGuid(1),
        reader.GetInt32(2),
        reader.GetString(3),
        reader.GetInt32(4),
        reader.IsDBNull(5) ? null : reader.GetString(5),
        reader.GetDateTime(6)
      ));
    }

    return inventoryTransactions;
  }
}