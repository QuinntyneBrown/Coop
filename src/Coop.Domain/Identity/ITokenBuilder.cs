using System.Security.Claims;

namespace Coop.Domain.Identity;

public interface ITokenBuilder
{
    ITokenBuilder AddUsername(string username);
    ITokenBuilder AddClaim(Claim claim);
    ITokenBuilder AddOrUpdateClaim(Claim claim);
    ITokenBuilder RemoveClaim(string claimType);
    ITokenBuilder FromClaimsPrincipal(ClaimsPrincipal claimsPrincipal);
    string Build();
}
