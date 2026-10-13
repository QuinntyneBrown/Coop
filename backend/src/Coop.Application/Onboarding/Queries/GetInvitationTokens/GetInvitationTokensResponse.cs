using Coop.Application.Onboarding.Dtos;

namespace Coop.Application.Onboarding.Queries.GetInvitationTokens;

public class GetInvitationTokensResponse
{
    public List<InvitationTokenDto> InvitationTokens { get; set; } = new();
}
