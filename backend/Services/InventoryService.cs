using BusinessManagementApi.Data;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Services;

public class InventoryService
{
  private readonly InventoryRepository _inventoryRepository;
  private readonly ProductRepository _productRepository;

  public InventoryService(InventoryRepository inventoryRepository, ProductRepository productRepository)
  {
    _inventoryRepository = inventoryRepository;
    _productRepository = productRepository;
  }

  // Create new inventory
  public async Task<int> CreateAsync(Guid businessId, CreateInventoryRequest newInventoryReq)
  {
    var product = await _productRepository.GetById(newInventoryReq.ProductId);

    if (product is null || product.BusinessId != businessId)
    {
      throw new ArgumentException("Product not found or you don't own the product");
    }

    var newInventoryData = new CreateInventoryRecord(businessId, product.Id, newInventoryReq.Quantity);

    var newInventoryId = await _inventoryRepository.InsertAsync(newInventoryData);

    return newInventoryId;
  }
}