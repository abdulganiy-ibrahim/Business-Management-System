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

  public BusinessRecord? GetBySlug(Guid userId, string slug)
  {
    var business = _businessRepository.GetBySlug(slug);

    if (business is null)
    {
      throw new KeyNotFoundException("Can't find business with the slug provided");
    }

    if (business.UserId != userId)
    {
      throw new UnauthorizedAccessException("You are not eligible to get this business");
    }

    return business;
  }

  public void DeleteById(Guid userId, Guid businessId)
  {
    var business = _businessRepository.GetById(userId, businessId);

    if (business is null)
    {
      throw new KeyNotFoundException("Business doesn't exist or not belong to you");
    }

    _businessRepository.DeleteById(businessId);

    return;
  }
}