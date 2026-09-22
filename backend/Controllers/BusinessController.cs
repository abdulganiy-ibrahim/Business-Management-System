namespace BusinessManagementApi.Controller;

using BusinessManagementApi.Services;
using BusinessManagementApi.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/business")]
[Authorize]
public class BusinessController : ControllerBase
{
  private readonly BusinessService _businessService;

  public BusinessController(BusinessService businessService)
  {
    _businessService = businessService;
  }

  [HttpPost]
  public IActionResult Create(CreateBusinessRecord newBusiness)
  {
    var userIdClaim = User.FindFirst("sub")?.Value;

    if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
    {
        return Unauthorized();
    }

    try
    {
        var business = _businessService.Create(userId, newBusiness);
        return Ok(business);
    }
    catch (UnauthorizedAccessException ex)
    {
        return Unauthorized(ex.Message);
    }
  }
}