namespace BusinessManagementSystem.Model;

public record CreateSaleRequest(
  Guid BusinessId,
  string? CustomerName,
  string? CustomerNumber,
  IReadOnlyList<CreateSaleItemRequest> SaleItems
);

public record CreateSaleItemRequest(
  int ProductId,
  int Quantity
);

public record SaleRecord(
  int Id,
  Guid BusinessId,
  string? CustomerName,
  string? CustomerNumber,
  decimal TotalAmount,
  decimal PaidAmount,
  DateTime CreatedAt
);

public record SaleItem(
  int Id,
  int SaleId,
  int ProductId,
  int Quantity,
  decimal UnitPrice,
  decimal TotalPrice
);