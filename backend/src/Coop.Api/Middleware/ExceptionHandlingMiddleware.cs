using FluentValidation;

namespace Coop.Api.Middleware;

/// <summary>
/// Turns the exceptions the application pipeline raises into HTTP statuses:
/// validation failures become 400 and refused resource operations become 403.
/// Runs after CORS so refused responses keep their headers, and inside Serilog
/// request logging so the logged status is the one sent.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex) when (!context.Response.HasStarted)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(new
            {
                message = "One or more fields are invalid.",
                errors = ex.Errors.Select(e => new { property = e.PropertyName, message = e.ErrorMessage })
            });
        }
        catch (UnauthorizedAccessException ex) when (!context.Response.HasStarted)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            await context.Response.WriteAsJsonAsync(new { message = ex.Message });
        }
    }
}
