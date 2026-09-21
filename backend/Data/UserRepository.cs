namespace UserRepository.Data;

using UserRecord.Model;

public class UserRepository
{
  private readonly string _connectionStrings;

  public UserRepository(string connectionString)
  {
    _connectionStrings = connectionString;
  }
}