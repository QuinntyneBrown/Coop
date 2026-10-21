using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Identity.Commands.SetPassword;

[OfficeOnly]
public class SetPasswordRequest : IRequest<SetPasswordResponse>
{
    public Guid UserId { get; set; }
    public string Password { get; set; } = string.Empty;
}
