using Coop.Application.Identity.Dtos;

namespace Coop.Application.Roles.Queries.GetRoleById;

public class GetRoleByIdResponse
{
    public RoleDto Role { get; set; } = default!;
}
