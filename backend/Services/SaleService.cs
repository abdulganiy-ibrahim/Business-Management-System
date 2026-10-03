using BusinessManagementApi.Models;
using BusinessManagementApi.Data;

namespace BusinessManagementApi.Services;

public class SaleService
{
  private readonly SaleRepository _saleRepository;
  private readonly ProductRepository _productRepository;

  public SaleService(SaleRepository saleRepository, ProductRepository productRepository)
  {
      _saleRepository = saleRepository;
      _productRepository = productRepository;
    }

  public async Task<int> CreateSaleAsync(Guid businessId, CreateSaleRequest newSale)
  {
    if (newSale.SaleItems == null || newSale.SaleItems.Count == 0)
    {
        throw new ArgumentException("Sale must contain at least one item.");
    }

    if (newSale.PaidAmount < 0)
    {
        throw new ArgumentException("Paid amount cannot be negative.");
    }

    var saleItems = new List<AddSaleItemRecord>();
    decimal totalAmount = 0;

    foreach (var item in newSale.SaleItems)
    {
      if (item.Quantity <= 0)
      {
          throw new ArgumentException($"Quantity for product {item.ProductId} must be greater than zero.");
      }

      var product = _productRepository.GetById(item.ProductId);

      if (product == null || product.BusinessId != businessId)
      {
          throw new ArgumentException($"Product {item.ProductId} is not found or does not belong to the specified business.");
      }

      var totalPrice = product.SellingPrice * item.Quantity;
      totalAmount += totalPrice;

      // SaleId is 0 for now because the sale doesn't exist yet
      saleItems.Add(new AddSaleItemRecord(0, item.ProductId, item.Quantity, product.SellingPrice, totalPrice));
    }

    if (newSale.PaidAmount > totalAmount)
    {
      throw new ArgumentException("Paid amount cannot be greater than the total amount.");
    }

    var sale = new AddSaleRecord(
      businessId,
      newSale.CustomerName,
      newSale.CustomerNumber,
      totalAmount,
      newSale.PaidAmount
    );

    return await _saleRepository.CreateSaleWithItemsAsync(sale, saleItems);
  }
}