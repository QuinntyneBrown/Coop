using Coop.Application.Identity.Dtos;

namespace Coop.Application.Identity.Commands.CreateUser;

public class CreateUserResponse
{
    public UserDto User { get; set; } = default!;
}
