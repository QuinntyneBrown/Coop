using Coop.Application.Onboarding.Dtos;

namespace Coop.Application.Onboarding.Queries.GetInvitationTokenById;

public class GetInvitationTokenByIdResponse
{
    public InvitationTokenDto InvitationToken { get; set; } = default!;
}
