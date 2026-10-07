namespace BusinessManagementApi.Middleware;

using BusinessManagementApi.Data;

public class UserExistsMiddleware
{
  private readonly RequestDelegate _next;

  public UserExistsMiddleware(RequestDelegate next)
  {
    _next = next;
  }

  public async Task InvokeAsync(HttpContext context, UserRepository userRepository)
  {

    if (context.User.Identity?.IsAuthenticated == true)
    {
      var userIdClaim = context.User.FindFirst("sub")?.Value;

      if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
      {
          context.Response.StatusCode = 401;
          await context.Response.WriteAsync("Invalid token.");
          return;
      }

      var user = userRepository.GetById(userId);

      if (user is null)
      {
          Console.WriteLine($"UserExistsMiddleware: no user found for id {userId}");
          context.Response.StatusCode = 401;
          await context.Response.WriteAsync("User does not exist.");
          return;
      }

      context.Items["CurrentUser"] = user;
    }

    await _next(context);
  }
}