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

  // check existing slug in database
  public bool SlugExists(string slug)
  {
    using var conn = new NpgsqlConnection(_connectionString);
    conn.Open();

    using var cmd = new NpgsqlCommand(
      "SELECT EXISTS(SELECT 1 FROM businesses WHERE slug = @slug)",
      conn
    );
  
    cmd.Parameters.AddWithValue("slug", slug);

    return (bool)cmd.ExecuteScalar()!;
  }

  public BusinessRecord Create(Guid userId, CreateBusinessRecord newBusiness, string uniqueSlug)
  {
    using var conn = new NpgsqlConnection(_connectionString);
    conn.Open();

    using var cmd = new NpgsqlCommand(
      "INSERT INTO businesses (user_id, business_name, business_category, phone_number, slug) VALUES (@userId, @businessName, @businessCategory, @phoneNumber, @slug) RETURNING id",
      conn
    );
    
    cmd.Parameters.AddWithValue("userId", userId);
    cmd.Parameters.AddWithValue("businessName", newBusiness.Name);
    cmd.Parameters.AddWithValue("businessCategory", newBusiness.Category);
    cmd.Parameters.AddWithValue("phoneNumber", newBusiness.PhoneNumber);
    cmd.Parameters.AddWithValue("slug", uniqueSlug);

    var newId = (Guid)cmd.ExecuteScalar()!;

    return new BusinessRecord(newId, userId, newBusiness.Name, newBusiness.Category, newBusiness.PhoneNumber, uniqueSlug);
  }

  public BusinessRecord? GetByUserId(Guid userId)
  {
    using var conn = new NpgsqlConnection(_connectionString);
    conn.Open();

    using var cmd = new NpgsqlCommand(
      "SELECT id, user_id, business_name, business_category, phone_number, slug FROM businesses WHERE user_id = @user_id",
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
        reader.GetString(3),
        reader.GetString(4),
        reader.GetString(5)
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