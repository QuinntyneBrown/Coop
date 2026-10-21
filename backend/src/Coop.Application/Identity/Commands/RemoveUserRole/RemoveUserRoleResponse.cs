using Coop.Application.Identity.Dtos;

namespace Coop.Application.Identity.Commands.RemoveUserRole;

public class RemoveUserRoleResponse
{
    public UserDto User { get; set; } = default!;
}
