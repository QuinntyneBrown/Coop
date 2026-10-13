using Coop.Application.Identity.Dtos;

namespace Coop.Application.Roles.Commands.CreateRole;

public class CreateRoleResponse
{
    public RoleDto Role { get; set; } = default!;
}
