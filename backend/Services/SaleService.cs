using BusinessManagementApi.Models;
using BusinessManagementApi.Data;

namespace BusinessManagementApi.Services;

public class SaleService
{
  private readonly UnitOfWork _uow;
  private readonly SaleRepository _saleRepository;
  private readonly ProductRepository _productRepository;
  private readonly DebitSaleRepository _debitSaleRepository;

  public SaleService(
    UnitOfWork uow,
    SaleRepository saleRepository,
    ProductRepository productRepository,
    DebitSaleRepository debitSaleRepository)
  {
    _uow = uow;
    _saleRepository = saleRepository;
    _productRepository = productRepository;
    _debitSaleRepository = debitSaleRepository;
  }

  public async Task<int> CreateSaleAsync(Guid businessId, CreateSaleRequest newSale)
  {
    // 1. Validate and calculate

    if (newSale.SaleItems == null || newSale.SaleItems.Count == 0)
    {
      throw new ArgumentException("Sale must contain at least one item.");
    }

    if (newSale.AmountPaid < 0)
    {
      throw new ArgumentException("Amount paid cannot be negative.");
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

    if (newSale.AmountPaid > totalAmount)
    {
      throw new ArgumentException("Amount paid cannot be greater than the total amount.");
    }

    var sale = new AddSaleRecord(
      businessId,
      newSale.CustomerName,
      newSale.CustomerNumber,
      totalAmount,
      newSale.AmountPaid
    );

    var amountOwed = totalAmount - newSale.AmountPaid;

    // Save everything: all or nothing.

    await _uow.BeginAsync();
    try
    {
      var saleId = await _saleRepository.AddSaleAsync(sale);

      foreach (var item in saleItems)
      {
        await _saleRepository.AddSaleItemAsync(saleId, item);
      }

      // The customer has not paid in full, so record the debit
      if (amountOwed > 0)
      {
        var debit = new CreateDebitSaleRequest(saleId, amountOwed, newSale.AmountPaid);
        await _debitSaleRepository.AddDebitAsync(debit);
      }

      await _uow.CommitAsync();
      return saleId;
    }
    catch
    {
      await _uow.RollbackAsync(); // undo every step, then pass the error up
      throw;
    }
  }

  public async Task<List<SaleRecord>> GetSalesByBusinessIdAsync(Guid businessId)
  {
    return await _saleRepository.GetSalesByBusinessIdAsync(businessId);
  }

  public async Task<SaleRecord?> GetSaleByIdAsync(int saleId)
  {
    return await _saleRepository.GetSaleByIdAsync(saleId);
  }

  public async Task<List<SaleItem>> GetSaleItemsBySaleIdAsync(int saleId)
  {
    return await _saleRepository.GetSaleItemsBySaleIdAsync(saleId);
  }

  public async Task PayDebtAsync(Guid businessId, int saleId, decimal amount)
  {
    Console.WriteLine(amount);
    if (amount <= 0)
    {
      throw new ArgumentException("Amount must be greater than zero.");
    }

    var sale = await _saleRepository.GetSaleByIdAsync(saleId);

    // One message for "missing" and "belongs to someone else",
    // so nobody can discover which sale ids exist
    if (sale is null || sale.BusinessId != businessId)
    {
      throw new KeyNotFoundException("The sale does not exist.");
    }

    var debit = await _debitSaleRepository.GetBySaleIdAsync(saleId);

    if (debit is null)
    {
      throw new KeyNotFoundException("There is no debit record for this sale.");
    }

    if (amount > debit.AmountDue)
    {
      throw new ArgumentException("Amount cannot be greater than the amount due.");
    }

    await _uow.BeginAsync();
    try
    {
      await _debitSaleRepository.PayDebtAsync(saleId, amount);
      await _saleRepository.PayDebtAsync(saleId, amount);

      await _uow.CommitAsync();
    }
    catch
    {
      await _uow.RollbackAsync();
      throw;
    }
  }
}