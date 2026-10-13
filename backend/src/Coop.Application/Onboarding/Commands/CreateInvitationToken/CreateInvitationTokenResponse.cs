using Coop.Application.Onboarding.Dtos;

namespace Coop.Application.Onboarding.Commands.CreateInvitationToken;

public class CreateInvitationTokenResponse
{
    public InvitationTokenDto InvitationToken { get; set; } = default!;
}
