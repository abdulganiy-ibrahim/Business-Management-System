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
  public void Create(CreateProductRecord newProduct)
  {
    
  }
}