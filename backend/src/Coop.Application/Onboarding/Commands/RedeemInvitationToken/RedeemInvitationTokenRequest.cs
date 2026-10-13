using MediatR;

namespace Coop.Application.Onboarding.Commands.RedeemInvitationToken;

public class RedeemInvitationTokenRequest : IRequest<RedeemInvitationTokenResponse>
{
    public string Value { get; set; } = string.Empty;
}
