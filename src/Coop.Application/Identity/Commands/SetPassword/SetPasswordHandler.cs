using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using Coop.Domain.Identity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Commands.SetPassword;

public class SetPasswordHandler : IRequestHandler<SetPasswordRequest, SetPasswordResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public SetPasswordHandler(ICoopDbContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<SetPasswordResponse> Handle(SetPasswordRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .SingleAsync(u => u.UserId == request.UserId, cancellationToken);

        user.SetPassword(_passwordHasher, request.Password);

        await _context.SaveChangesAsync(cancellationToken);

        return new SetPasswordResponse
        {
            User = UserDto.FromUser(user)
        };
    }
}
