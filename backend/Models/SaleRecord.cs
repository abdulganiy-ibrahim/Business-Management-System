namespace BusinessManagementApi.Models;

public record CreateSaleRequest(
  string? CustomerName,
  string? CustomerNumber,
  IReadOnlyList<CreateSaleItemRequest> SaleItems,
  decimal AmountPaid
);

public record CreateSaleItemRequest(
  int ProductId,
  int Quantity
);

public record AddSaleItemRecord(
  int SaleId,
  int ProductId,
  int Quantity,
  decimal UnitPrice,
  decimal TotalPrice
);

public record AddSaleRecord(
  Guid BusinessId,
  string? CustomerName,
  string? CustomerNumber,
  decimal TotalAmount,
  decimal AmountPaid
);

public record SaleRecord(
  int Id,
  Guid BusinessId,
  string? CustomerName,
  string? CustomerNumber,
  decimal TotalAmount,
  decimal AmountPaid,
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