using MediatR;

namespace Coop.Application.Onboarding.Commands.RemoveInvitationToken;

public class RemoveInvitationTokenRequest : IRequest<RemoveInvitationTokenResponse>
{
    public Guid InvitationTokenId { get; set; }
}
