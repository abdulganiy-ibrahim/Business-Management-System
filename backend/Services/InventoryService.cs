using BusinessManagementApi.Data;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Services;

public class InventoryService
{
  private readonly UnitOfWork _uow;
  private readonly InventoryRepository _inventoryRepository;
  private readonly ProductRepository _productRepository;
  private readonly InventoryTransactionRepository _inventoryTransactionRepository;

  public InventoryService(
    UnitOfWork uow,
    InventoryRepository inventoryRepository, 
    ProductRepository productRepository, 
    InventoryTransactionRepository inventoryTransactionRepository)
  {
    _uow = uow;
    _inventoryRepository = inventoryRepository;
    _productRepository = productRepository;
    _inventoryTransactionRepository = inventoryTransactionRepository;
  }

  // Create new inventory
  public async Task<int> CreateAsync(Guid businessId, CreateInventoryRequest newInventoryReq)
  {
    var product = await _productRepository.GetByIdAsync(newInventoryReq.ProductId);

    if (product is null || product.BusinessId != businessId)
    {
      throw new ArgumentException("Product not found or you don't own the product");
    }

    var newInventoryData = new CreateInventoryRecord(businessId, product.Id, newInventoryReq.Quantity, newInventoryReq.LowStockThreshold);

    var newInventoryId = await _inventoryRepository.InsertAsync(newInventoryData);

    return newInventoryId;
  }

  public async Task<List<InventoryRecord>> GetByBusinessIdAsync(Guid businessId)
  {
    var inventories = await _inventoryRepository.GetByBusinessIdAsync(businessId);

    return inventories;
  }

  public async Task UpdateAsync(Guid businessId, UpdateInventoryRequest request)
  {
    if (request.AddQuantity is null && request.LowStockThreshold is null)
      throw new ArgumentException("Nothing to update.");

    if (request.AddQuantity is <= 0)
      throw new ArgumentException("Quantity to add must be greater than zero.");

    if (request.LowStockThreshold is < 0)
      throw new ArgumentException("Low stock threshold cannot be negative.");

    await _uow.BeginAsync();

    try
    {
      if (request.AddQuantity is not null)
      {
        var updated = await _inventoryRepository.AddQuantityAsync(
          request.InventoryId, businessId, request.AddQuantity.Value);

        if (!updated)
          throw new ArgumentException("Inventory not found.");

        var newInventoryTransaction = new CreateInventoryTransactionReq(
          businessId,
          request.InventoryId,
          InventoryTransactionTypes.Restock,
          request.AddQuantity.Value,
          $"Add {request.AddQuantity.Value} to stock"
        );

        await _inventoryTransactionRepository.InsertAsync(newInventoryTransaction);
      }

      if (request.LowStockThreshold is not null)
      {
        var updated = await _inventoryRepository.UpdateLowStockThresholdAsync(
          request.InventoryId, businessId, request.LowStockThreshold.Value);

        if (!updated)
          throw new ArgumentException("Inventory not found.");

        await _inventoryTransactionRepository.InsertAsync(new CreateInventoryTransactionReq(
          businessId,
          request.InventoryId,
          InventoryTransactionTypes.ThresholdChange,
          0,
          $"Low stock threshold set to {request.LowStockThreshold.Value}"));
      }

      await _uow.CommitAsync();
    }
    catch
    {
      await _uow.RollbackAsync();
      throw;
    }
  }
}