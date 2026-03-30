using MediatR;

namespace Coop.Application.Identity.Commands.Authenticate;

public class AuthenticateRequest : IRequest<AuthenticateResponse>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
