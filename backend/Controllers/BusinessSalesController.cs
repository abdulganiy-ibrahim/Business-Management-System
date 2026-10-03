using BusinessManagementApi.Models;
using BusinessManagementApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusinessManagementSystem.Controllers;

[ApiController]
[Route("api/business/{businessId}/sales")]
[Authorize]

public class BusinessSalesController : ControllerBase
{
  private readonly SaleService _saleService;

  public BusinessSalesController(SaleService saleService)
  {
    _saleService = saleService;
  }

  [HttpPost]
  public async Task<IActionResult> CreateSale(CreateSaleRequest newSale)
  {
    var business = (BusinessRecord)HttpContext.Items["Business"]!;

    try
    {
      var saleId = await _saleService.CreateSaleAsync(business.Id, newSale);
      return Ok(saleId);
    }
    catch (ArgumentException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }
}