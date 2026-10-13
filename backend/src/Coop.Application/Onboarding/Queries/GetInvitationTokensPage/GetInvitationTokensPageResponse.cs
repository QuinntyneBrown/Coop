using Coop.Application.Onboarding.Dtos;

namespace Coop.Application.Onboarding.Queries.GetInvitationTokensPage;

public class GetInvitationTokensPageResponse
{
    public List<InvitationTokenDto> InvitationTokens { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
