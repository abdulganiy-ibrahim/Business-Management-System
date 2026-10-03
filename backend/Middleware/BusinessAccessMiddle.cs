using BusinessManagementApi.Models;
using Microsoft.AspNetCore.Mvc;
using BusinessManagementApi.Data;

public class BusinessAccessMiddleware
{
    private readonly RequestDelegate _next;

    public BusinessAccessMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, BusinessRepository businessRepository)
    {
        var rawBusinessId = context.GetRouteValue("businessId")?.ToString()
                            ?? context.Request.Query["businessId"].FirstOrDefault();

        // No businessId in this request, so nothing to check
        if (string.IsNullOrEmpty(rawBusinessId))
        {
            await _next(context);
            return;
        }

        if (!Guid.TryParse(rawBusinessId, out var businessId))
        {
            await WriteError(context, StatusCodes.Status400BadRequest,
                "Invalid business id", $"'{rawBusinessId}' is not a valid business id.");
            return;
        }

        if (context.Items["CurrentUser"] is not UserRecord user)
        {
            await WriteError(context, StatusCodes.Status401Unauthorized,
                "Unauthorized", "You must be logged in to access this business.");
            return;
        }

        var business = businessRepository.GetById(user.Id, businessId);
        if (business is null)
        {
            await WriteError(context, StatusCodes.Status404NotFound,
                "Business not found", "This business does not exist or you do not have access to it.");
            return;
        }

        context.Items["Business"] = business;
        await _next(context);
    }

    private static async Task WriteError(HttpContext context, int statusCode, string title, string detail)
    {
        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail
        });
    }
}