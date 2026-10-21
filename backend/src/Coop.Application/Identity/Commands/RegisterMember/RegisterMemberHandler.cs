using System.Security.Cryptography;
using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Commands.Authenticate;
using Coop.Application.Onboarding.Commands.ValidateInvitationToken;
using Coop.Domain.Identity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Commands.RegisterMember;

/// <summary>
/// Checks the invitation, creates the user with no role when the username is
/// new, and signs them in. Creating a user from the Users area is office-only;
/// this anonymous path is the one way in for a new member.
/// </summary>
public class RegisterMemberHandler : IRequestHandler<RegisterMemberRequest, RegisterMemberResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IMediator _mediator;

    public RegisterMemberHandler(ICoopDbContext context, IPasswordHasher passwordHasher, IMediator mediator)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _mediator = mediator;
    }

    public async Task<RegisterMemberResponse> Handle(RegisterMemberRequest request, CancellationToken cancellationToken)
    {
        var invitation = await _mediator.Send(new ValidateInvitationTokenRequest { Value = request.InvitationToken }, cancellationToken);
        if (!invitation.Success)
            return new RegisterMemberResponse { Error = "Invalid invitation token." };

        if (!await _context.Users.AnyAsync(u => u.Username == request.Username, cancellationToken))
        {
            var salt = new byte[16];
            RandomNumberGenerator.Fill(salt);
            _context.Users.Add(new User
            {
                Username = request.Username,
                Salt = salt,
                Password = _passwordHasher.HashPassword(salt, request.Password)
            });
            await _context.SaveChangesAsync(cancellationToken);
        }

        try
        {
            var signedIn = await _mediator.Send(new AuthenticateRequest { Username = request.Username, Password = request.Password }, cancellationToken);
            return new RegisterMemberResponse { AccessToken = signedIn.AccessToken, UserId = signedIn.UserId };
        }
        catch (InvalidOperationException)
        {
            return new RegisterMemberResponse { Error = "Registration failed." };
        }
    }
}
