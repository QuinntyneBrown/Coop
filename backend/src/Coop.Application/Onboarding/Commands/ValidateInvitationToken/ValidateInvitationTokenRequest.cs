using MediatR;

namespace Coop.Application.Onboarding.Commands.ValidateInvitationToken;

public class ValidateInvitationTokenRequest : IRequest<ValidateInvitationTokenResponse>
{
    public string Value { get; set; } = string.Empty;
}
