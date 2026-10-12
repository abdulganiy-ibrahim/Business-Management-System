namespace BusinessManagementApi.Models;

public record CreateProductRequest(
  string Name,
  string? Sku,
  decimal CostPrice, 
  decimal SellingPrice,
  int Quantity,
  int LowStockThreshold
);

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

public record UpdateProductRecord(
  string? Name,
  string? Sku,
  decimal? CostPrice, 
  decimal? SellingPrice
);