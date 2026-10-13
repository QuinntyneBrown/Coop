using Coop.Application.Identity.Dtos;

namespace Coop.Application.Identity.Commands.UpdateUser;

public class UpdateUserResponse
{
    public UserDto User { get; set; } = default!;
}
