using Coop.Application.Identity.Dtos;

namespace Coop.Application.Roles.Commands.UpdateRole;

public class UpdateRoleResponse
{
    public RoleDto Role { get; set; } = default!;
}
