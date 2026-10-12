using BusinessManagementApi.Models;
using Npgsql;

namespace BusinessManagementApi.Data;

public class InventoryRepository
{
  private readonly string _connectionString;

  public InventoryRepository(string connectionString)
  {
    _connectionString = connectionString;
  }

  // Insert Inventory to the database
  public async Task<int> InsertAsync(CreateInventoryRecord newInventory)
  {
    var sql = @"
      INSERT INTO inventories (business_id, product_id, quantity low_stock_threshold)
      VALUES (@businessId, @productId, @quantity, @lowStockThreshold)
      RETURNING id
    ";

    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(sql, conn);

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

    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(sql, conn);

    cmd.Parameters.AddWithValue("businessId", businessId);

    using var reader = await cmd.ExecuteReaderAsync();

    while (reader.Read())
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

  // public async Task<bool> UpdateAsync(UpdateInventoryRecord updateInventory)
  // {
  //   var sql = @"
  //     UPDATE inventories
  //     SET quantity = @quantity,
  //       updated_at = NOW()
  //     WHERE id = @inventoryId
  //       AND business_id = @businessId
  //   ";

  //   await using var conn = new NpgsqlConnection(_connectionString);
  //   await conn.OpenAsync();

  //   await using var cmd = new NpgsqlCommand(sql, conn);

  //   cmd.Parameters.AddWithValue("quantity", updateInventory.Quantity);
  //   cmd.Parameters.AddWithValue("inventoryId", updateInventory.InventoryId);
  //   cmd.Parameters.AddWithValue("businessId", updateInventory.BusinessId);

  //   var rowsAffected = await cmd.ExecuteNonQueryAsync();
  //   return rowsAffected > 0;
  // }
}