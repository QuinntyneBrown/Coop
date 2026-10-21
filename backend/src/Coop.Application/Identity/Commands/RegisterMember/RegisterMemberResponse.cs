namespace Coop.Application.Identity.Commands.RegisterMember;

public class RegisterMemberResponse
{
    /// <summary>Why the registration was refused, or null when it succeeded.</summary>
    public string? Error { get; set; }
    public string AccessToken { get; set; } = string.Empty;
    public Guid UserId { get; set; }
}
