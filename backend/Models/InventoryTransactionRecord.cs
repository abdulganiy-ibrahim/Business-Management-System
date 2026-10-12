namespace BusinessManagementApi.Models;

public record CreateInventoryTransactionReq(
  Guid BusinessId,
  int InventoryId,
  string TransactionType,
  int QuantityChange,
  string? TransactionDesc
);

public record InventoryTransactionRecord(
  int Id,
  Guid BusinessId,
  int InventoryId,
  string TransactionType,
  int QuantityChange,
  string? TransactionDesc,
  DateTime CreatedAt
);