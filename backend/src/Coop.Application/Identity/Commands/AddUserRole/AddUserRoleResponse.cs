using Coop.Application.Identity.Dtos;

namespace Coop.Application.Identity.Commands.AddUserRole;

public class AddUserRoleResponse
{
    public UserDto User { get; set; } = default!;
}
