using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Commands.UpdateUser;

public class UpdateUserHandler : IRequestHandler<UpdateUserRequest, UpdateUserResponse>
{
    private readonly ICoopDbContext _context;

    public UpdateUserHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateUserResponse> Handle(UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .SingleAsync(u => u.UserId == request.UserId, cancellationToken);

        user.SetUsername(request.Username);

        if (request.RoleIds.Any())
        {
            var roles = await _context.Roles
                .Where(r => request.RoleIds.Contains(r.RoleId))
                .ToListAsync(cancellationToken);
            user.Roles = roles;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateUserResponse
        {
            User = UserDto.FromUser(user)
        };
    }
}
