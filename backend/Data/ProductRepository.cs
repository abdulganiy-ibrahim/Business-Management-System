using BusinessManagementApi.Models;
using Npgsql;

namespace BusinessManagementApi.Data;

public class ProductRepository
{
  private readonly string _connectionString;

  public ProductRepository(string connectionString)
  {
    _connectionString = connectionString;
  }

  // Create a product method
  public async Task<int> InsertAsync(Guid businessId, CreateProductRecord newProduct)
  {
    var sql = @"
      INSERT INTO products(business_id, name, sku, cost_price, selling_price)
      VALUES (@businessId, @name, @sku, @costPrice, @sellingPrice)
      RETURNING id
    ";
    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(sql, conn);

    cmd.Parameters.AddWithValue("businessId", businessId);
    cmd.Parameters.AddWithValue("name", newProduct.Name);
    cmd.Parameters.AddWithValue(
      "sku",
      (object?)newProduct.Sku ?? DBNull.Value
    );
    cmd.Parameters.AddWithValue("costPrice", newProduct.CostPrice);
    cmd.Parameters.AddWithValue("sellingPrice", newProduct.SellingPrice);

    var result = await cmd.ExecuteScalarAsync();

    return Convert.ToInt32(result);
  }

  // Get product by Business Id
  public async Task<List<ProductRecord>> GetByBusinessIdAsync(Guid businessId)
  {
    var products = new List<ProductRecord>();

    var sql = @"
      SELECT
        id, business_id, name, sku, cost_price, selling_price, created_at, updated_at
      FROM products
      WHERE business_id = @businessId
      ORDER BY created_at DESC
    ";

    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(sql, conn);

    cmd.Parameters.AddWithValue("businessId", businessId);

    using var reader = await cmd.ExecuteReaderAsync();

    while (reader.Read())
    {
      products.Add(new ProductRecord(
        reader.GetInt32(reader.GetOrdinal("id")),
        reader.GetGuid(reader.GetOrdinal("business_id")),
        reader.GetString(reader.GetOrdinal("name")),
        reader.GetString(reader.GetOrdinal("sku")),
        reader.GetDecimal(reader.GetOrdinal("cost_price")),
        reader.GetDecimal(reader.GetOrdinal("selling_price")),
        reader.GetDateTime(reader.GetOrdinal("created_at")),
        reader.IsDBNull(reader.GetOrdinal("updated_at"))
          ? null
          : reader.GetDateTime(reader.GetOrdinal("updated_at"))
      ));
    }

    return products;
  }

  // Get product by Id
  public async Task<ProductRecord?> GetByIdAsync(int id)
  {
    var sql = @"
      SELECT
        id,
        business_id,
        name,
        sku,
        cost_price,
        selling_price,
        created_at,
        updated_at 
      FROM products
      WHERE id = @id
    ";

    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(sql, conn);

    cmd.Parameters.AddWithValue("id", id);

    using var reader = await cmd.ExecuteReaderAsync();

    if (reader.Read())
    {
      return new ProductRecord(
        reader.GetInt32(reader.GetOrdinal("id")),
        reader.GetGuid(reader.GetOrdinal("business_id")),
        reader.GetString(reader.GetOrdinal("name")),
        reader.GetString(reader.GetOrdinal("sku")),
        reader.GetDecimal(reader.GetOrdinal("cost_price")),
        reader.GetDecimal(reader.GetOrdinal("selling_price")),
        reader.GetDateTime(reader.GetOrdinal("created_at")),
        reader.IsDBNull(reader.GetOrdinal("updated_at"))
          ? null
          : reader.GetDateTime(reader.GetOrdinal("updated_at"))
      );
    }

    return null;
  }

  public async Task<bool> UpdateAsync(int productId, UpdateProductRecord request)
  {
    var updates = new List<string>();

    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    await using var command = new NpgsqlCommand();
    command.Connection = conn;

    command.Parameters.AddWithValue("@id", productId);

    if (request.Name is not null)
    {
      updates.Add("name = @name");
      command.Parameters.AddWithValue("@name", request.Name);
    }

    if (request.Sku is not null)
    {
      updates.Add("sku = @sku");
      command.Parameters.AddWithValue("@sku", request.Sku);
    }

    if (request.CostPrice.HasValue)
    {
      updates.Add("cost_price = @costPrice");
      command.Parameters.AddWithValue("@costPrice", request.CostPrice.Value);
    }

    if (request.SellingPrice.HasValue)
    {
      updates.Add("selling_price = @sellingPrice");
      command.Parameters.AddWithValue("@sellingPrice", request.SellingPrice.Value);
    }

    if (updates.Count == 0)
    {
      return false;
    }

    updates.Add("updated_at = NOW()");

    command.CommandText = $"UPDATE products SET {string.Join(", ", updates)} WHERE id = @id";

    var rowsAffected = await command.ExecuteNonQueryAsync();
    return rowsAffected > 0;
  }

  // Delete product by id;
  public async Task DeleteByIdAsync(int id)
  {
    await using var conn = new NpgsqlConnection(_connectionString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(
      "DELETE FROM products WHERE id = @id",
      conn
    );

    cmd.Parameters.AddWithValue("id", id);

    var rowAffected = await cmd.ExecuteNonQueryAsync();

    return;
  }
}