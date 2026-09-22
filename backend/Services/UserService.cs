using BusinessManagementApi.Data;
using BusinessManagementApi.Model;

namespace BusinessManagementApi.Services;

public class UserService
{
  private readonly UserRepository _userRepository;

  public UserService(UserRepository userRepository)
  {
    _userRepository = userRepository;
  }

  public User? GetById(Guid userId)
  {
    var user = _userRepository.GetById(userId);

    return user;
  } 
}