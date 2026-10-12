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
  public async Task<int> CreateAsync(Guid businessId, CreateProductRecord newProduct)
  {
    var productId = await _productRepository.InsertAsync(businessId, newProduct);

    return productId;
  }

  public async Task<List<ProductRecord>> GetByBusinessIdAsync(Guid businessId)
  {
    var products = await _productRepository.GetByBusinessIdAsync(businessId);

    return products;
  }

  public async Task<ProductRecord?> GetByIdAsync(int productId)
  {

    var product = await _productRepository.GetByIdAsync(productId);

    return product;
  }

  public async Task<bool> UpdateAsync(int productId, UpdateProductRecord request)
  {

    return await _productRepository.UpdateAsync(productId, request);
  }

  // Delete by productId;
  public async Task DeleteByIdAsync(int productId)
  {
    await _productRepository.DeleteByIdAsync(productId);

    return;
  }
}