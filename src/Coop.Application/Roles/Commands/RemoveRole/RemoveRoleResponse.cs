using Coop.Application.Identity.Dtos;

namespace Coop.Application.Roles.Commands.RemoveRole;

public class RemoveRoleResponse
{
    public RoleDto Role { get; set; } = default!;
}
