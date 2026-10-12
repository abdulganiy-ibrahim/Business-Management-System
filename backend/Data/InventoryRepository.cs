using BusinessManagementApi.Models;

namespace BusinessManagementApi.Data;

public class InventoryRepository
{
  private readonly UnitOfWork _uow;

  public InventoryRepository(UnitOfWork uow)
  {
    _uow = uow;
  }

  // Insert Inventory to the database
  public async Task<int> InsertAsync(CreateInventoryRecord newInventory)
  {
    var sql = @"
      INSERT INTO inventories (business_id, product_id, quantity, low_stock_threshold)
      VALUES (@businessId, @productId, @quantity, @lowStockThreshold)
      RETURNING id
    ";

    await using var cmd = _uow.CreateCommand(sql);

    cmd.Parameters.AddWithValue("businessId", newInventory.BusinessId);
    cmd.Parameters.AddWithValue("productId", newInventory.ProductId);
    cmd.Parameters.AddWithValue("quantity", newInventory.Quantity);
    cmd.Parameters.AddWithValue("lowStockThreshold", newInventory.LowStockThreshold);

    var result = await cmd.ExecuteScalarAsync();
    return Convert.ToInt32(result);
  }

  public async Task<List<InventoryRecord>> GetByBusinessIdAsync(Guid businessId)
  {
    var inventories = new List<InventoryRecord>();

    var sql = @"
      SELECT
        id, business_id, product_id, quantity, low_stock_threshold, created_at, updated_at
      FROM inventories
      WHERE business_id = @businessId
    ";

    await using var cmd = _uow.CreateCommand(sql);

    cmd.Parameters.AddWithValue("businessId", businessId);

    await using var reader = await cmd.ExecuteReaderAsync();

    while (await reader.ReadAsync())
    {
      inventories.Add(new InventoryRecord(
        reader.GetInt32(0),
        reader.GetGuid(1),
        reader.GetInt32(2),
        reader.GetInt32(3),
        reader.GetInt32(4),
        reader.GetDateTime(5),
        reader.IsDBNull(6) ? null : reader.GetDateTime(6)
      ));
    }

    return inventories;
  }

  public async Task<bool> DeductQuantityAsync(DeductQuantityRequest newRequest)
  {
    var sql = @"
      UPDATE inventories
      SET quantity = quantity - @quantity,
          updated_at = NOW()
      WHERE id = @inventoryId
        AND business_id = @businessId
        AND quantity >= @quantity
    ";

    await using var cmd = _uow.CreateCommand(sql);

    cmd.Parameters.AddWithValue("quantity", newRequest.Quantity);
    cmd.Parameters.AddWithValue("inventoryId", newRequest.InventoryId);
    cmd.Parameters.AddWithValue("businessId", newRequest.BusinessId);

    var rowsAffected = await cmd.ExecuteNonQueryAsync();
    return rowsAffected > 0;
  }

  public async Task<bool> AddQuantityAsync(int inventoryId, Guid businessId, int quantity)
  {
    var sql = @"
      UPDATE inventories
      SET quantity = quantity + @quantity,
          updated_at = NOW()
      WHERE id = @inventoryId
        AND business_id = @businessId
    ";

    await using var cmd = _uow.CreateCommand(sql);

    cmd.Parameters.AddWithValue("quantity", quantity);
    cmd.Parameters.AddWithValue("inventoryId", inventoryId);
    cmd.Parameters.AddWithValue("businessId", businessId);

    var rowsAffected = await cmd.ExecuteNonQueryAsync();
    return rowsAffected > 0;
  }

  public async Task<bool> UpdateLowStockThresholdAsync(int inventoryId, Guid businessId, int threshold)
  {
    var sql = @"
      UPDATE inventories
      SET low_stock_threshold = @threshold,
          updated_at = NOW()
      WHERE id = @inventoryId
        AND business_id = @businessId
    ";

    await using var cmd = _uow.CreateCommand(sql);

    cmd.Parameters.AddWithValue("threshold", threshold);
    cmd.Parameters.AddWithValue("inventoryId", inventoryId);
    cmd.Parameters.AddWithValue("businessId", businessId);

    var rowsAffected = await cmd.ExecuteNonQueryAsync();
    return rowsAffected > 0;
  }
}