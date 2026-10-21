using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Onboarding.Queries.GetInvitationTokenById;

[OfficeOnly]
public class GetInvitationTokenByIdRequest : IRequest<GetInvitationTokenByIdResponse>
{
    public Guid InvitationTokenId { get; set; }
}
