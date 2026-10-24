using BusinessManagementApi.Data;
using BusinessManagementApi.Models;
using BusinessManagementApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusinessManagementApi.Controllers;

[ApiController]
[Route("api/business/{businessId}/inventory")]
[Authorize]

public class BusinessInventoryController : ControllerBase
{
  private readonly InventoryService _inventoryService;
  private readonly InventoryTransactionService _inventoryTransactionService;

  public BusinessInventoryController(
    InventoryService inventoryService,
    InventoryTransactionService inventoryTransactionService)
  {
    _inventoryService = inventoryService;
    _inventoryTransactionService = inventoryTransactionService;
  }

  [HttpPost]
  public async Task<IActionResult> CreateAsync(CreateInventoryRequest newInventoryReq)
  {
    var business = (BusinessRecord)HttpContext.Items["Business"]!;
    try
    {
      var newInventoryId = await _inventoryService.CreateAsync(business.Id, newInventoryReq);
      return Ok(new { id = newInventoryId });
    }
    catch (ArgumentException ex)
    {
      return NotFound(new { message = ex.Message });
    }
  }

  [HttpGet]
  public async Task<IActionResult> GetByBusinessIdAsync()
  {
    var business = (BusinessRecord)HttpContext.Items["Business"]!;

    var inventories = await _inventoryService.GetByBusinessIdAsync(business.Id);

    return Ok(inventories);
  }

  [HttpPatch("{inventoryId}")]
  public async Task<IActionResult> UpdateAsync(int inventoryId, UpdateInventoryRequest request)
  {
    var business = (BusinessRecord)HttpContext.Items["Business"]!;

    try
    {
      await _inventoryService.UpdateAsync(business.Id, inventoryId, request);
      return NoContent();
    } catch (ArgumentException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpGet("{inventoryId}/transactions")]
  public async Task<IActionResult> GetInventoryTransactionByInventoryId(
        int inventoryId,
        CancellationToken cancellationToken = default)
    {
        var business = (BusinessRecord)HttpContext.Items["Business"]!;

        var result = await _inventoryTransactionService.GetByInventoryIdAsync(inventoryId, business.Id, cancellationToken);
        return Ok(result);
    }
}