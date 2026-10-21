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

    [HttpGet]
    public async Task<ActionResult<BusinessDashboardStats>> GetDashboardStatsAsync()
    {
        var business = (BusinessRecord)HttpContext.Items["Business"]!;

        var stats = await _service.GetDashboardStatsAsync(business.Id);
        return Ok(stats);
    }
}