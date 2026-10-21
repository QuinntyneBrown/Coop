using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Onboarding.Commands.RemoveInvitationToken;

[OfficeOnly]
public class RemoveInvitationTokenRequest : IRequest<RemoveInvitationTokenResponse>
{
    public Guid InvitationTokenId { get; set; }
}
