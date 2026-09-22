namespace BusinessManagementApi.Services;

using BusinessManagementApi.Data;
using BusinessManagementApi.Model;

public class BusinessService
{
  private readonly BusinessRepository _businessRepository;
  private readonly UserRepository _userRepository;

  public BusinessService(BusinessRepository businessRepository, UserRepository userRepository)
  {
    _businessRepository = businessRepository;
    _userRepository = userRepository;
  }

  public BusinessRecord Create(Guid userId, CreateBusinessRecord newBusiness)
  {
    var user = _userRepository.GetById(userId);

    if (user is null)
    {
        throw new UnauthorizedAccessException("User does not exist.");
    }

    return _businessRepository.Create(userId, newBusiness);
  }

  public BusinessRecord? GetByUserId(Guid userId)
  {
    var user = _userRepository.GetById(userId);

    if (user is null)
    {
      throw new UnauthorizedAccessException("User does not exist.");
    }

    var business = _businessRepository.GetByUserId(user.Id);

    return business;
  }

  public void DeleteById(Guid id)
  {
    _businessRepository.DeleteById(id);

    return;
  }
}