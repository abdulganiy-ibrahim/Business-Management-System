namespace BusinessManagementApi.Service;

using BusinessManagementApi.Data;
using BusinessManagementApi.Model;

public class BusinessService
{
  private readonly BusinessRepository _businessRepository;

  public BusinessService(BusinessRepository businessRepository)
  {
    _businessRepository = businessRepository;
  }

  private string GenerateBaseSlug(string name)
  {
      var slug = name.ToLower().Trim();
      slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\s-]", "");
      slug = System.Text.RegularExpressions.Regex.Replace(slug, @"\s+", "-");
      return slug;
  }

  public BusinessRecord Create(Guid userId, CreateBusinessRecord newBusiness)
  {
    var baseSlug = GenerateBaseSlug(newBusiness.Name);
    var uniqueSlug = baseSlug;
    var suffix = 1;

    while (_businessRepository.SlugExists(uniqueSlug))
    {
      suffix++;
      uniqueSlug = $"{baseSlug}-{suffix}";
    }

    return _businessRepository.Create(userId, newBusiness, uniqueSlug);
  }

  public List<BusinessRecord> GetByUserId(Guid userId)
  {
    var businesses = _businessRepository.GetByUserId(userId);

    return businesses;
  }

  public void DeleteById(Guid id)
  {
    _businessRepository.DeleteById(id);

    return;
  }
}