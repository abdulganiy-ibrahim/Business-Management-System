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

  [HttpGet]
  public async Task<IActionResult> GetSalesByBusinessId()
  {
    var business = (BusinessRecord)HttpContext.Items["Business"]!;

    var sales = await _saleService.GetSalesByBusinessIdAsync(business.Id);
    
    if (sales == null || sales.Count == 0)
    {
      return NotFound(new { message = "No sales found for this business." });
    }

    return Ok(sales);
  }

  [HttpGet("{saleId}")]
  public async Task<IActionResult> GetSaleById(int saleId)
  {
    var sale = await _saleService.GetSaleByIdAsync(saleId);
    if (sale == null)
    {
      return NotFound();
    }
    return Ok(sale);
  }

  [HttpGet("{saleId}/items")]
  public async Task<IActionResult> GetSaleItemsBySaleId(int saleId)
  {
    var saleItems = await _saleService.GetSaleItemsBySaleIdAsync(saleId);
    return Ok(saleItems);
  }
}