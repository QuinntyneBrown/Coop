using System.Security.Claims;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace Coop.Domain.Authorization;

public class ResourceOperationAuthorizationHandler
    : AuthorizationHandler<OperationAuthorizationRequirement, string>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OperationAuthorizationRequirement requirement,
        string aggregate)
    {
        var privilegeClaims = context.User.FindAll(Constants.ClaimTypes.Privilege);

        foreach (var privilegeClaim in privilegeClaims)
        {
            // Claims are issued as "{AccessRight}:{Aggregate}" (see AuthenticateHandler).
            var separator = privilegeClaim.Value.IndexOf(':');
            if (separator <= 0)
                continue;

            if (!Enum.TryParse<AccessRight>(privilegeClaim.Value[..separator], out var accessRight))
                continue;

            var claimAggregate = privilegeClaim.Value[(separator + 1)..];
            if (claimAggregate == aggregate && HasRequiredAccess(accessRight, requirement))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
        }

        return Task.CompletedTask;
    }

    private static bool HasRequiredAccess(AccessRight accessRight, OperationAuthorizationRequirement requirement)
    {
        return requirement.Name switch
        {
            nameof(Operations.Read) => accessRight >= AccessRight.Read,
            nameof(Operations.Write) => accessRight >= AccessRight.Write,
            nameof(Operations.Create) => accessRight >= AccessRight.Create,
            nameof(Operations.Delete) => accessRight >= AccessRight.Delete,
            _ => false
        };
    }
}
