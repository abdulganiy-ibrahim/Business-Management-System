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
    var user = (User)HttpContext.Items["CurrentUser"]!;

    var business = _businessService.Create(user.Id, newBusiness);
    return Ok(business);
  }
}