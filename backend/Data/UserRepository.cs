namespace BusinessManagementApi.Data;

using Npgsql;
using BusinessManagementApi.Model;

public class UserRepository
{
  private readonly string _connectionString;

  public UserRepository(string connectionString)
  {
    _connectionString = connectionString;
  }

  public User? GetById(Guid id)
  {
    using var conn = new NpgsqlConnection(_connectionString);
    conn.Open();

    using var cmd = new NpgsqlCommand(
      "SELECT id, email, raw_user_meta_data->>'name', phone, created_at, last_sign_in_at FROM auth.users WHERE id = @id",
      conn);
    cmd.Parameters.AddWithValue("id", id);

    using var reader = cmd.ExecuteReader();

    if (reader.Read())
    {
      return new User(
          reader.GetGuid(0),
          reader.GetString(1),
          reader.IsDBNull(2) ? null : reader.GetString(2),
          reader.IsDBNull(3) ? null : reader.GetString(3),
          reader.GetDateTime(4),
          reader.IsDBNull(5) ? null : reader.GetDateTime(5)
      );
    }

    return null;
  }
}