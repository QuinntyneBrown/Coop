using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using Coop.Domain.Identity;
using MediatR;

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
        var role = new Role { Name = request.Name };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateRoleResponse { Role = RoleDto.FromRole(role) };
    }
}
