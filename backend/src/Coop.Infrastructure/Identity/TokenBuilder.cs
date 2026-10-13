using System.Security.Claims;
using Coop.Domain.Identity;

namespace Coop.Infrastructure.Identity;

public class TokenBuilder : ITokenBuilder
{
    private readonly ITokenProvider _tokenProvider;
    private readonly List<Claim> _claims = new();
    private string _username = string.Empty;

    public TokenBuilder(ITokenProvider tokenProvider)
    {
        _tokenProvider = tokenProvider;
    }

    public ITokenBuilder AddUsername(string username)
    {
        _username = username;
        return this;
    }

    public ITokenBuilder AddClaim(Claim claim)
    {
        _claims.Add(claim);
        return this;
    }

    public ITokenBuilder AddOrUpdateClaim(Claim claim)
    {
        var existing = _claims.FirstOrDefault(c => c.Type == claim.Type);
        if (existing != null)
        {
            _claims.Remove(existing);
        }
        _claims.Add(claim);
        return this;
    }

    public ITokenBuilder RemoveClaim(string claimType)
    {
        var claim = _claims.FirstOrDefault(c => c.Type == claimType);
        if (claim != null)
        {
            _claims.Remove(claim);
        }
        return this;
    }

    public ITokenBuilder FromClaimsPrincipal(ClaimsPrincipal claimsPrincipal)
    {
        _claims.AddRange(claimsPrincipal.Claims);
        return this;
    }

    public string Build()
    {
        var token = _tokenProvider.Get(_username, _claims);
        _claims.Clear();
        _username = string.Empty;
        return token;
    }
}
