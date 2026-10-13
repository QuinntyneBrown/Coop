using Coop.Application.Identity.Dtos;

namespace Coop.Application.Identity.Commands.RemoveUser;

public class RemoveUserResponse
{
    public UserDto User { get; set; } = default!;
}
