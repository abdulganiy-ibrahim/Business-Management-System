using BusinessManagementApi.Data;
using BusinessManagementApi.Models;

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
  public int Create(Guid businessId, CreateProductRecord newProduct)
  {
    var productId = _productRepository.Create(businessId, newProduct);

    return productId;
  }

  public List<ProductRecord> GetByBusinessId(Guid businessId)
  {
    var products = _productRepository.GetByBusinessId(businessId);

    return products;
  }

  public async Task<ProductRecord?> GetById(int productId)
  {

    var product = await _productRepository.GetById(productId);

    return product;
  }

  public bool Update(int productId, UpdateProductRecord request)
  {

    return _productRepository.Update(productId, request);
  }

  // Delete by productId;
  public void DeleteById(int productId)
  {
    _productRepository.DeleteById(productId);

    return;
  }
}