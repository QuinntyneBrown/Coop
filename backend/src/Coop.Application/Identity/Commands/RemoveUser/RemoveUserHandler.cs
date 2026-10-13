using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Commands.RemoveUser;

public class RemoveUserHandler : IRequestHandler<RemoveUserRequest, RemoveUserResponse>
{
    private readonly ICoopDbContext _context;

    public RemoveUserHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<RemoveUserResponse> Handle(RemoveUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .SingleAsync(u => u.UserId == request.UserId, cancellationToken);

        user.Delete();

        await _context.SaveChangesAsync(cancellationToken);

        return new RemoveUserResponse
        {
            User = UserDto.FromUser(user)
        };
    }
}
