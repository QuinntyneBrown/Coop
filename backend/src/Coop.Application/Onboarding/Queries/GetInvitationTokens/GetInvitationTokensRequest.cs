using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Onboarding.Queries.GetInvitationTokens;

[OfficeOnly]
public class GetInvitationTokensRequest : IRequest<GetInvitationTokensResponse>
{

}
