using BusinessManagementApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusinessManagementSystem.Controllers;

[ApiController]
[Route("api/business/{businessId}/sales")]
[Authorize]

public class BusinessSalesController : ControllerBase
{

}