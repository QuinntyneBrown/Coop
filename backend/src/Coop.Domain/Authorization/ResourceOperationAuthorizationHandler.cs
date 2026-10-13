using System.Security.Claims;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Newtonsoft.Json;

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
            var privilege = JsonConvert.DeserializeObject<PrivilegeDto>(privilegeClaim.Value);

            if (privilege is null)
                continue;

            if (privilege.Aggregate == aggregate && HasRequiredAccess(privilege.AccessRight, requirement))
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

    private class PrivilegeDto
    {
        public AccessRight AccessRight { get; set; }
        public string Aggregate { get; set; } = string.Empty;
    }
}
