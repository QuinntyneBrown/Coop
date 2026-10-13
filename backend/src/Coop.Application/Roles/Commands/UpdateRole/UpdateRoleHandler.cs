using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Roles.Commands.UpdateRole;

public class UpdateRoleHandler : IRequestHandler<UpdateRoleRequest, UpdateRoleResponse>
{
    private readonly ICoopDbContext _context;

    public UpdateRoleHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateRoleResponse> Handle(UpdateRoleRequest request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles
            .Include(r => r.Privileges)
            .SingleAsync(r => r.RoleId == request.RoleId, cancellationToken);

        role.Name = request.Name;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateRoleResponse { Role = RoleDto.FromRole(role) };
    }
}
