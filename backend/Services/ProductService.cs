using BusinessManagementApi.Data;
using BusinessManagementApi.Model;

namespace BusinessManagementApi.Services;

public class ProductService
{
  private readonly ProductRepository _productRepository;
  private readonly BusinessRepository _businessRepository;

  public ProductService(ProductRepository productRepository, BusinessRepository businessRepository)
  {
    _productRepository = productRepository;
    _businessRepository = businessRepository;
  }

  // Create product method
  public int Create(Guid userId, Guid businessId, CreateProductRecord newProduct)
  {
    var business = _businessRepository.GetById(userId, businessId);

    if (business is null)
    {
      throw new KeyNotFoundException("Business does not exist or does not belong to you");
    }

    var productId = _productRepository.Create(businessId, newProduct);

    return productId;
  }

  public List<ProductRecord> GetByBusinessId(Guid userId, Guid businessId)
  {
    var business = _businessRepository.GetById(userId, businessId);

    if (business is null)
    {
      throw new KeyNotFoundException("Business does not exist or does not belong to you");
    }

    var products = _productRepository.GetByBusinessId(business.Id);

    return products;
  }

  public ProductRecord? GetById(Guid userId, Guid businessId, int productId)
  {
    var business = _businessRepository.GetById(userId, businessId);

    if (business is null)
    {
      throw new KeyNotFoundException("Business does not exist or does not belong to you");
    }

    var product = _productRepository.GetById(productId);

    return product;
  }

  // Delete by productId;
  public void DeleteById(Guid userId, Guid businessId, int productId)
  {
    var business = _businessRepository.GetById(userId, businessId);

    if (business is null)
    {
      throw new KeyNotFoundException("Business does not exist or does not belong to you");
    }

    _productRepository.DeleteById(productId);

    return;
  }
}