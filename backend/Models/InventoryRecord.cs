namespace BusinessManagementApi.Models;

public record CreateInventoryRequest(
  int ProductId,
  int Quantity
);

public record CreateInventoryRecord(
  Guid BusinessId,
  int ProductId,
  int Quantity
);

public record InventoryRecord(
  int Id,
  Guid BusinessId,
  int ProductId,
  int Quantity,
  DateTime CreatedAt,
  DateTime? UpdatedAt
);

public record UpdateInventoryRecord(
  int ProductId,
  int Quantity
);