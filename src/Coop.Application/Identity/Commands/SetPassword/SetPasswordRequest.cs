using MediatR;

namespace Coop.Application.Identity.Commands.SetPassword;

public class SetPasswordRequest : IRequest<SetPasswordResponse>
{
    public Guid UserId { get; set; }
    public string Password { get; set; } = string.Empty;
}
