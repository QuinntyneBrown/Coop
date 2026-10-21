using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using Coop.Domain.Identity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Roles.Commands.CreateRole;

public class CreateRoleHandler : IRequestHandler<CreateRoleRequest, CreateRoleResponse>
{
    private readonly ICoopDbContext _context;

    public CreateRoleHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<CreateRoleResponse> Handle(CreateRoleRequest request, CancellationToken cancellationToken)
    {
        // A repeated create returns the role that already has the name (ADR 0015).
        var existing = await _context.Roles
            .Include(r => r.Privileges)
            .FirstOrDefaultAsync(r => r.Name == request.Name, cancellationToken);
        if (existing != null)
            return new CreateRoleResponse { Role = RoleDto.FromRole(existing) };

        var role = new Role { Name = request.Name };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateRoleResponse { Role = RoleDto.FromRole(role) };
    }
}
