using BusinessManagementApi.Model;
using BusinessManagementApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BusinessManagementApi.Controller;

[ApiController]
[Route("api/user")]

public class UserController : ControllerBase
{
  private readonly UserService _userService;

  public UserController(UserService userService)
  {
    _userService = userService;
  }

  [HttpGet("me")]
  public IActionResult GetCurrentUser()
  {
    var user = (User)HttpContext.Items["CurrentUser"]!;

    var userData = _userService.GetById(user.Id);

    return Ok(userData);
  }
}