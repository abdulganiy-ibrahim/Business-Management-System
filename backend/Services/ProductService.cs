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
  public int Create(Guid userId, CreateProductRecord newProduct)
  {
    var business = _businessRepository.GetById(userId, newProduct.BusinessId);

    if (business is null)
    {
      throw new KeyNotFoundException("Business does not exist or does not belong to you");
    }

    var productId = _productRepository.Create(newProduct);

    return productId;
  }
}