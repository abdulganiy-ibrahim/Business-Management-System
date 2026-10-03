using BusinessManagementApi.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusinessManagementSystem.Controller;

[ApiController]
[Route("api/business/{businessId}/sales")]
[Authorize]

public class BusinessSalesController : ControllerBase
{

}