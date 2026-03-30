using MediatR;

namespace Coop.Application.Onboarding.Queries.GetInvitationTokenById;

public class GetInvitationTokenByIdRequest : IRequest<GetInvitationTokenByIdResponse>
{
    public Guid InvitationTokenId { get; set; }
}
