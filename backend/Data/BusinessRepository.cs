namespace BusinessManagementApi.Data;

using BusinessManagementApi.Model;
using Npgsql;

public class BusinessRepository
{
  public readonly string _connectionString;

  public BusinessRepository(string connectionString)
  {
    _connectionString = connectionString;
  }

  public BusinessRecord Create(Guid userId, CreateBusinessRecord newBusiness)
  {
    using var conn = new NpgsqlConnection(_connectionString);
    conn.Open();

    using var cmd = new NpgsqlCommand(
      "INSERT INTO businesses (user_id, business_name, business_category) VALUES (@userId, @businessName, @businessCategory) RETURNING id",
      conn
    );
    
    cmd.Parameters.AddWithValue("userId", userId);
    cmd.Parameters.AddWithValue("businessName", newBusiness.Name);
    cmd.Parameters.AddWithValue("businessCategory", newBusiness.Category);

    var newId = (Guid)cmd.ExecuteScalar()!;

    return new BusinessRecord(newId, userId, newBusiness.Name, newBusiness.Category);
  }

  public BusinessRecord? GetByUserId(Guid userId)
  {
    using var conn = new NpgsqlConnection(_connectionString);
    conn.Open();

    using var cmd = new NpgsqlCommand(
      "SELECT id, user_id, business_name, business_category FROM businesses WHERE user_id = @user_id",
      conn
    );
    cmd.Parameters.AddWithValue("user_id", userId);

    using var reader = cmd.ExecuteReader();

    if (reader.Read())
    {
      return new BusinessRecord(
        reader.GetGuid(0),
        reader.GetGuid(1),
        reader.GetString(2),
        reader.GetString(3)
      );
    }

    return null;
  }

  public BusinessRecord? GetById(Guid id, Guid userId)
  {
    using var conn = new NpgsqlConnection(_connectionString);
    conn.Open();

    using var cmd = new NpgsqlCommand(
      """
      SELECT 
        id,
        user_id,
        business_name, 
        business_category
      FROM businesses 
      WHERE id = @id
      AND user_id = @user_id
      """,
      conn
    );

    cmd.Parameters.AddWithValue("id", id);
    cmd.Parameters.AddWithValue("user_id", userId);

    using var reader = cmd.ExecuteReader();

    if (reader.Read())
    {
      return new BusinessRecord(
        reader.GetGuid(0),
        reader.GetGuid(1),
        reader.GetString(2),
        reader.GetString(3)
      );
    }

    return null;
  }

  public void DeleteById(Guid id)
  {
    using var conn = new NpgsqlConnection(_connectionString);
    conn.Open();

    using var cmd = new NpgsqlCommand(
      "DELETE FROM businesses WHERE id = @id",
      conn
    );
    
    cmd.Parameters.AddWithValue("id", id);

    var rowsAffected = cmd.ExecuteNonQuery();

    return;
  }
}