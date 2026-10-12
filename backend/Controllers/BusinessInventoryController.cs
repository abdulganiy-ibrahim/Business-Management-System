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

  public BusinessInventoryController(InventoryService inventoryService)
  {
    _inventoryService = inventoryService;
  }

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

  public async Task<IActionResult> GetByBusinessIdAsync()
  {
    var business = (BusinessRecord)HttpContext.Items["Business"]!;

    var inventories = await _inventoryService.GetByBusinessIdAsync(business.Id);

    return Ok(inventories);
  }

  public async Task<IActionResult> UpdateAsync(UpdateInventoryRequest request)
  {
    var business = (BusinessRecord)HttpContext.Items["Business"]!;

    try
    {
      await _inventoryService.UpdateAsync(business.Id, request);
      return NoContent();
    } catch (ArgumentException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }
}