using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Commands.RemoveUserRole;

public class RemoveUserRoleHandler : IRequestHandler<RemoveUserRoleRequest, RemoveUserRoleResponse>
{
    private readonly ICoopDbContext _context;

    public RemoveUserRoleHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<RemoveUserRoleResponse> Handle(RemoveUserRoleRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .SingleAsync(u => u.UserId == request.UserId, cancellationToken);

        user.Roles.RemoveAll(r => r.RoleId == request.RoleId);
        await _context.SaveChangesAsync(cancellationToken);

        return new RemoveUserRoleResponse
        {
            User = UserDto.FromUser(user)
        };
    }
}
