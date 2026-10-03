using BusinessManagementSystem.Data;

namespace BusinessManagementSystem.Service;

public class SaleService
{
  private readonly SaleRepository _saleRepository;

  public SaleService(SaleRepository saleRepository)
  {
    _saleRepository = saleRepository;
  }

 
}