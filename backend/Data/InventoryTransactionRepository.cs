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
}