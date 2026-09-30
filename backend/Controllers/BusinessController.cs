namespace BusinessManagementApi.Controller;

using BusinessManagementApi.Service;
using BusinessManagementApi.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/businesses")]
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
    var user = (UserRecord)HttpContext.Items["CurrentUser"]!;

    var business = _businessService.Create(user.Id, newBusiness);
    return Ok(business);
  }

  [HttpGet]
  public IActionResult GetBusinesses()
  {
    var user = (UserRecord)HttpContext.Items["CurrentUser"]!;

    var businesses = _businessService.GetByUserId(user.Id);

    return Ok(businesses);
  }

  [HttpGet("{businessSlug}")]
  public IActionResult GetBySlug(string businessSlug)
  {
    var user = (UserRecord)HttpContext.Items["CurrentUser"]!;

    try
    {
      var business = _businessService.GetBySlug(user.Id, businessSlug);
      return Ok(business);
    } catch (KeyNotFoundException ex)
    {
      return NotFound(ex.Message);
    } catch (UnauthorizedAccessException ex)
    {
      return Unauthorized(ex.Message);
    }
  }
}