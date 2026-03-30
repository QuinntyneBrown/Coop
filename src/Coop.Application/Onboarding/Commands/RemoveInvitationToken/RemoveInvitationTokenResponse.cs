using Coop.Application.Onboarding.Dtos;

namespace Coop.Application.Onboarding.Commands.RemoveInvitationToken;

public class RemoveInvitationTokenResponse
{
    public InvitationTokenDto InvitationToken { get; set; } = default!;
}
