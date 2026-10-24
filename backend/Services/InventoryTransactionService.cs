using BusinessManagementApi.Data;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Services;

public class InventoryTransactionService
{
  private readonly InventoryTransactionRepository _inventoryTransactionRepo;
  private readonly UnitOfWork _uow;

  public InventoryTransactionService(
    InventoryTransactionRepository inventoryTransactionRepository,
    UnitOfWork uow)
  {
    _inventoryTransactionRepo = inventoryTransactionRepository;
    _uow = uow;
  }

  public async Task<List<InventoryTransactionRecord>> GetByInventoryIdAsync(int inventoryId, Guid businessId, CancellationToken cancellationToken)
  {
    return await _inventoryTransactionRepo.GetByInventoryIdAsync(inventoryId, businessId, cancellationToken);
  }
}