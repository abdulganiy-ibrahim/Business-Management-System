using Microsoft.AspNetCore.Mvc;
using BusinessManagementApi.Services;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Controllers;

[ApiController]
[Route("api/business/{businessId:guid}/dashboard")]
public class BusinessDashboardController : ControllerBase
{
    private readonly BusinessDashboardService _service;

    public BusinessDashboardController(BusinessDashboardService service)
    {
        _service = service;
    }

    // Your middleware has already checked that this business exists and belongs to the user.
    // Add the same [Authorize] attribute your other controllers use, if they have one.
    [HttpGet]
    public async Task<ActionResult<BusinessDashboardStats>> Get(Guid businessId)
    {
        var stats = await _service.GetStatsAsync(businessId);
        return Ok(stats);
    }
}