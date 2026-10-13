using Coop.Application.Onboarding.Dtos;

namespace Coop.Application.Onboarding.Commands.UpdateInvitationToken;

public class UpdateInvitationTokenResponse
{
    public InvitationTokenDto InvitationToken { get; set; } = default!;
}
