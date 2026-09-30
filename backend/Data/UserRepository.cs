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
        """
        SELECT
          id,
          email,
          display_name,
          phone,
          created_at,
          last_sign_in
        FROM public.users
        WHERE id = @id
        """,
        conn);

    cmd.Parameters.AddWithValue("id", id);

    using var reader = cmd.ExecuteReader();

    if (reader.Read())
    {
      return new User(
        reader.GetGuid(0),
        reader.GetString(1),
        reader.GetString(2),
        reader.IsDBNull(3) ? null : reader.GetString(3),
        reader.GetDateTime(4),
        reader.GetDateTime(5)
      );
    }

    return null;
  }
}