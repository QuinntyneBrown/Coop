using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Roles.Commands.RemoveRole;

public class RemoveRoleHandler : IRequestHandler<RemoveRoleRequest, RemoveRoleResponse>
{
    private readonly ICoopDbContext _context;

    public RemoveRoleHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<RemoveRoleResponse> Handle(RemoveRoleRequest request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles
            .Include(r => r.Privileges)
            .SingleAsync(r => r.RoleId == request.RoleId, cancellationToken);

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync(cancellationToken);

        return new RemoveRoleResponse { Role = RoleDto.FromRole(role) };
    }
}
