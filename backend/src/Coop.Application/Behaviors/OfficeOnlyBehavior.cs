using System.Reflection;
using System.Security.Claims;
using Coop.Application.Common;
using MediatR;

namespace Coop.Application.Behaviors;

/// <summary>
/// Refuses an <see cref="OfficeOnlyAttribute"/> request from a caller who holds
/// no office role. Runs first, so a member learns nothing from validation.
/// </summary>
public class OfficeOnlyBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ClaimsPrincipal _user;

    public OfficeOnlyBehavior(ClaimsPrincipal user)
    {
        _user = user;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (typeof(TRequest).GetCustomAttribute<OfficeOnlyAttribute>() is not null && !CallerAccess.IsOffice(_user))
            throw new UnauthorizedAccessException("Access denied.");

        return await next();
    }
}
