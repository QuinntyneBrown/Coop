using Coop.Application.Identity.Dtos;

namespace Coop.Application.Roles.Queries.GetRoles;

public class GetRolesResponse
{
    public List<RoleDto> Roles { get; set; } = new();
}
