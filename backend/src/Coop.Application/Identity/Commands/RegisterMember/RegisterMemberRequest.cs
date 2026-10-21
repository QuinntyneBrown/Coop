using MediatR;

namespace Coop.Application.Identity.Commands.RegisterMember;

/// <summary>Anonymous registration with an invitation (L2-REQ-111); never needs an office role.</summary>
public class RegisterMemberRequest : IRequest<RegisterMemberResponse>
{
    public string InvitationToken { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
