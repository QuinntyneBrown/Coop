using MediatR;

namespace Coop.Application.Onboarding.Commands.UpdateInvitationToken;

public class UpdateInvitationTokenRequest : IRequest<UpdateInvitationTokenResponse>
{
    public Guid InvitationTokenId { get; set; }
    public string Value { get; set; } = string.Empty;
}
