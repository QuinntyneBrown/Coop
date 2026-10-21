using System.Security.Claims;
using Coop.Domain.Identity;
using Coop.SharedKernel;

namespace Coop.Cli;

/// <summary>
/// The identity every command runs as: the SystemAdministrator role and
/// <c>Delete</c>, the highest access right, on every aggregate, so the
/// resource-operation authorization behavior lets the operator do what a
/// system administrator can (ADR 0014, L2-REQ-102 AC7).
/// </summary>
public static class OperatorIdentity
{
    public const string Name = "coop-cli";

    public static ClaimsPrincipal Create()
    {
        var claims = new List<Claim>
        {
            new(Constants.ClaimTypes.Username, Name),
            new(Constants.ClaimTypes.Role, Constants.Roles.SystemAdministrator),
        };
        claims.AddRange(Constants.Aggregates.All.Select(aggregate =>
            new Claim(Constants.ClaimTypes.Privilege, $"{AccessRight.Delete}:{aggregate}")));
        return new ClaimsPrincipal(new ClaimsIdentity(claims, "CommandLine"));
    }
}
