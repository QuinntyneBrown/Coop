using System.Security.Claims;

namespace Coop.Domain.Identity;

public interface ITokenProvider
{
    string Get(string username, IEnumerable<Claim> claims);
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    string GenerateRefreshToken();
}
