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
  private readonly ILogger<BusinessSalesController> _logger;

  public BusinessSalesController(SaleService saleService, ILogger<BusinessSalesController> logger)
  {
    _saleService = saleService;
    _logger = logger;
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

  [HttpPost("{saleId}/pay-debt")]
  public async Task<IActionResult> PayDebt(int saleId, PayDebtRequest request)
  {
    var business = (BusinessRecord)HttpContext.Items["Business"]!;

    try
    {
      await _saleService.PayDebtAsync(business.Id, saleId, request.Amount);
      return NoContent();
    }
    catch (KeyNotFoundException ex)
    {
      return NotFound(new { message = ex.Message });
    }
    catch (ArgumentException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed to pay debt for sale {SaleId}", saleId);
      return StatusCode(500, new { message = "Could not record the payment. Nothing was changed. Please try again." });
    }
  }
}
