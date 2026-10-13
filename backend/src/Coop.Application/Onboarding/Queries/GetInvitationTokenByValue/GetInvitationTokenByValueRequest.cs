using MediatR;

namespace Coop.Application.Onboarding.Queries.GetInvitationTokenByValue;

public class GetInvitationTokenByValueRequest : IRequest<GetInvitationTokenByValueResponse>
{
    public string Value { get; set; } = string.Empty;
}
