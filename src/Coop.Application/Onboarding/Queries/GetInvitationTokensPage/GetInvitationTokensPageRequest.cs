using MediatR;

namespace Coop.Application.Onboarding.Queries.GetInvitationTokensPage;

public class GetInvitationTokensPageRequest : IRequest<GetInvitationTokensPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
