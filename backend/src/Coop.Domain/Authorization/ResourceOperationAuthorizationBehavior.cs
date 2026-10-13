using System.Reflection;
using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace Coop.Domain.Authorization;

public class ResourceOperationAuthorizationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ClaimsPrincipal _claimsPrincipal;

    public ResourceOperationAuthorizationBehavior(
        IAuthorizationService authorizationService,
        ClaimsPrincipal claimsPrincipal)
    {
        _authorizationService = authorizationService;
        _claimsPrincipal = claimsPrincipal;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var attribute = typeof(TRequest).GetCustomAttribute<AuthorizeResourceOperationAttribute>();

        if (attribute is null)
            return await next();

        var requirement = (OperationAuthorizationRequirement)attribute.GetRequirement();

        var result = await _authorizationService.AuthorizeAsync(
            _claimsPrincipal,
            attribute.Aggregate,
            requirement);

        if (!result.Succeeded)
            throw new UnauthorizedAccessException(
                $"Access denied. Required: {attribute.AccessRight} on {attribute.Aggregate}.");

        return await next();
    }
}
