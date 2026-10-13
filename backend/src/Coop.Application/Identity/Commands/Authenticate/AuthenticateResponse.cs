namespace Coop.Application.Identity.Commands.Authenticate;

public class AuthenticateResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public Guid UserId { get; set; }
}
