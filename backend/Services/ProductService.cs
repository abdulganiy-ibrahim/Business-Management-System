using BusinessManagementApi.Data;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Services;

public class ProductService
{
  private readonly UnitOfWork _uow;
  private readonly ProductRepository _productRepository;
  private readonly InventoryRepository _inventoryRepository;

  public ProductService(UnitOfWork uow, ProductRepository productRepository, InventoryRepository inventoryRepository)
  {
    _uow = uow;
    _productRepository = productRepository;
    _inventoryRepository = inventoryRepository;
  }

  // Create product with inventory method
  public async Task<int> CreateAsync(Guid businessId, CreateProductRequest request)
{
  if (request.Quantity < 0)
    throw new ArgumentException("Quantity cannot be negative.");

  if (request.LowStockThreshold < 0)
    throw new ArgumentException("Low stock threshold cannot be negative.");

  var newProduct = new CreateProductRecord(
    request.Name,
    request.Sku,
    request.CostPrice,
    request.SellingPrice);

  await _uow.BeginAsync();

  try
  {
    // Step 1: the product must exist first, because inventory needs its id
    var productId = await _productRepository.InsertAsync(businessId, newProduct);

    // Step 2: create the inventory row using the new product id
    var newInventory = new CreateInventoryRecord(
      businessId,
      productId,
      request.Quantity,
      request.LowStockThreshold);

    await _inventoryRepository.InsertAsync(newInventory);

    await _uow.CommitAsync();
    return productId;
  }
  catch
  {
    await _uow.RollbackAsync();
    throw;
  }
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