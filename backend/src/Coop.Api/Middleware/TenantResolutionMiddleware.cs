using Coop.Api.Tenancy;
using Coop.Application.Common.Interfaces;
using Coop.Domain.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Middleware;

/// <summary>
/// Finds the co-op a request is for from the sub-domain of its host, or the
/// default co-op for hosts outside the base domain, and answers 404 when there
/// is none (L2-REQ-101). Runs after authentication and before authorization.
/// </summary>
public class TenantResolutionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly TenancyOptions _options;

    public TenantResolutionMiddleware(RequestDelegate next, TenancyOptions options)
    {
        _next = next;
        _options = options;
    }

    public async Task InvokeAsync(HttpContext context, TenantContext tenantContext, ICoopDbContext db)
    {
        var slug = SlugFrom(context.Request.Host.Host);
        var tenant = slug is not null && Tenant.IsValidSlug(slug)
            ? await db.Tenants.AsNoTracking().SingleOrDefaultAsync(t => t.Slug == slug, context.RequestAborted)
            : null;

        if (tenant is null)
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            await context.Response.WriteAsJsonAsync(new { message = "Co-op not found." });
            return;
        }

        tenantContext.Set(tenant);
        await _next(context);
    }

    private string? SlugFrom(string host)
    {
        host = host.ToLowerInvariant();
        var suffix = "." + _options.BaseDomain.ToLowerInvariant();
        if (_options.BaseDomain.Length > 0 && host.EndsWith(suffix))
            return host[..^suffix.Length];
        return string.IsNullOrWhiteSpace(_options.DefaultTenant) ? null : _options.DefaultTenant.ToLowerInvariant();
    }
}
