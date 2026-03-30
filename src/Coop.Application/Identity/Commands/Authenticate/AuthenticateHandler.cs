using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Commands.Authenticate;

public class AuthenticateHandler : IRequestHandler<AuthenticateRequest, AuthenticateResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenBuilder _tokenBuilder;

    public AuthenticateHandler(ICoopDbContext context, IPasswordHasher passwordHasher, ITokenBuilder tokenBuilder)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenBuilder = tokenBuilder;
    }

    public async Task<AuthenticateResponse> Handle(AuthenticateRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .ThenInclude(r => r.Privileges)
            .Include(u => u.Profiles)
            .SingleOrDefaultAsync(u => u.Username == request.Username && !u.IsDeleted, cancellationToken);

        if (user == null)
            throw new InvalidOperationException("Invalid credentials.");

        var hashedPassword = _passwordHasher.HashPassword(user.Salt, request.Password);

        if (hashedPassword != user.Password)
            throw new InvalidOperationException("Invalid credentials.");

        _tokenBuilder.AddUsername(user.Username);
        _tokenBuilder.AddClaim(new Claim(Constants.ClaimTypes.UserId, user.UserId.ToString()));

        if (user.CurrentProfileId.HasValue)
            _tokenBuilder.AddClaim(new Claim("CurrentProfileId", user.CurrentProfileId.Value.ToString()));

        foreach (var role in user.Roles)
        {
            _tokenBuilder.AddClaim(new Claim(Constants.ClaimTypes.Role, role.Name));
            foreach (var privilege in role.Privileges)
            {
                _tokenBuilder.AddClaim(new Claim(Constants.ClaimTypes.Privilege, $"{privilege.AccessRight}:{privilege.Aggregate}"));
            }
        }

        var accessToken = _tokenBuilder.Build();

        return new AuthenticateResponse
        {
            AccessToken = accessToken,
            UserId = user.UserId
        };
    }
}
