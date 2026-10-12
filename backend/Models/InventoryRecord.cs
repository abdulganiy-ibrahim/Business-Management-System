namespace BusinessManagementApi.Models;

public record CreateInventoryRequest(
  int ProductId,
  int Quantity,
  int LowStockThreshold
);

public record CreateInventoryRecord(
  Guid BusinessId,
  int ProductId,
  int Quantity,
  int LowStockThreshold
);

public record InventoryRecord(
  int Id,
  Guid BusinessId,
  int ProductId,
  int Quantity,
  int LowStockThreshold,
  DateTime CreatedAt,
  DateTime? UpdatedAt
);

public record UpdateInventoryRecord(
  Guid BusinessId,
  int InventoryId,
  int Quantity,
  int LowStockThreshold
);