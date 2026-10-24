using BusinessManagementApi.Models;
using BusinessManagementApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusinessManagementApi.Controllers;

[ApiController]
[Authorize]
[Route("api/business/{businessId}/inventory-transactions")]
public class InventoryTransactionController : ControllerBase
{
    private readonly InventoryTransactionService _inventoryTransactionService;

    public InventoryTransactionController(InventoryTransactionService inventoryTransactionService)
    {
        _inventoryTransactionService = inventoryTransactionService;
    }

    // GET api/business/{businessId}/inventory-transactions?page=1&pageSize=20
    // All inventory transactions of the business, newest first.
    // [HttpGet]
    // public async Task<IActionResult> GetAll(
    //     Guid businessId,
    //     [FromQuery] int page = 1,
    //     [FromQuery] int pageSize = 20,
    //     CancellationToken ct = default)
    // {
    //     if (page < 1) page = 1;
    //     pageSize = Math.Clamp(pageSize, 1, 100); // never let a client ask for 1,000,000 rows

    //     var result = await _inventoryTransactionService.GetAllAsync(businessId, page, pageSize, ct);
    //     return Ok(result);
    // }

    [HttpGet("inventory/{inventoryId:int}")]
    public async Task<IActionResult> GetByInventory(
        Guid businessId,
        int inventoryId,
        CancellationToken cancellationToken = default)
    {
        var business = (BusinessRecord)HttpContext.Items["Business"]!;

        var result = await _inventoryTransactionService.GetByInventoryIdAsync(inventoryId, business.Id, cancellationToken);
        return Ok(result);
    }
}
