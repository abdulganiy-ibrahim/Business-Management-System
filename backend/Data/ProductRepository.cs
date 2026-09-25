using BusinessManagementApi.Model;
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
  public int Create(CreateProductRecord newProduct)
  {
    using var conn = new NpgsqlConnection(_connectionString);
    conn.Open();

    using var cmd = new NpgsqlCommand(
      """
      INSERT INTO products(business_id, name, sku, cost_price, selling_price)
      VALUES (@businessId, @name, @sku, @costPrice, @sellingPrice)
      RETURNING id
      """,
      conn
    );

    cmd.Parameters.AddWithValue("businessId", newProduct.BusinessId);
    cmd.Parameters.AddWithValue("name", newProduct.Name);
    cmd.Parameters.AddWithValue(
      "sku",
      (object?)newProduct.Sku ?? DBNull.Value
    );
    cmd.Parameters.AddWithValue("costPrice", newProduct.CostPrice);
    cmd.Parameters.AddWithValue("sellingPrice", newProduct.SellingPrice);

    return (int)cmd.ExecuteScalar()!;
  }
}