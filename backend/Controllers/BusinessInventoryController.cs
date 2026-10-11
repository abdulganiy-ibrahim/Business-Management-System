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
}