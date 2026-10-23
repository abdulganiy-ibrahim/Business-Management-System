using Microsoft.AspNetCore.Mvc;
using BusinessManagementApi.Services;
using BusinessManagementApi.Models;

namespace BusinessManagementApi.Controllers;

[ApiController]
[Route("api/business/{businessId:guid}/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _service;

    public DashboardController(DashboardService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<BusinessDashboardStats>> GetDashboardStatsAsync()
    {
        var business = (BusinessRecord)HttpContext.Items["Business"]!;

        var stats = await _service.GetDashboardStatsAsync(business.Id);
        return Ok(stats);
    }
}