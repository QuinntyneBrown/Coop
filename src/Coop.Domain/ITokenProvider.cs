using System.Collections.Generic;
using System.Security.Claims;

namespace Coop.Domain;

public interface ITokenProvider
{
    string Get(string username, IEnumerable<Claim> customClaims = null);
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    string GenerateRefreshToken();
}
