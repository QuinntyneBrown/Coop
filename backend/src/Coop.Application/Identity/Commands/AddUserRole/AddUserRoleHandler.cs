using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Commands.AddUserRole;

public class AddUserRoleHandler : IRequestHandler<AddUserRoleRequest, AddUserRoleResponse>
{
    private readonly ICoopDbContext _context;

    public AddUserRoleHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<AddUserRoleResponse> Handle(AddUserRoleRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .SingleAsync(u => u.UserId == request.UserId, cancellationToken);

        if (user.Roles.All(r => r.RoleId != request.RoleId))
        {
            user.Roles.Add(await _context.Roles.SingleAsync(r => r.RoleId == request.RoleId, cancellationToken));
            await _context.SaveChangesAsync(cancellationToken);
        }

        return new AddUserRoleResponse
        {
            User = UserDto.FromUser(user)
        };
    }
}
