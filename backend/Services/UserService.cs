using BusinessManagementApi.Data;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Services;

public class UserService
{
  private readonly UserRepository _userRepository;

  public UserService(UserRepository userRepository)
  {
    _userRepository = userRepository;
  }

  public UserRecord? GetById(Guid userId)
  {
    var user = _userRepository.GetById(userId);

    return user;
  } 
}