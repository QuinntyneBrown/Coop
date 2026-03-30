using Coop.Application.Identity.Dtos;

namespace Coop.Application.Identity.Commands.SetPassword;

public class SetPasswordResponse
{
    public UserDto User { get; set; } = default!;
}
