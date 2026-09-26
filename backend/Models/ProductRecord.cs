namespace BusinessManagementApi.Model;

public record CreateProductRecord(
  string Name,
  string? Sku,
  decimal CostPrice, 
  decimal SellingPrice
);

public record ProductRecord(
  int Id,
  Guid BusinessId,
  string Name,
  string? Sku,
  decimal CostPrice,
  decimal SellingPrice,
  DateTime CreatedAt,
  DateTime? UpdatedAt
);