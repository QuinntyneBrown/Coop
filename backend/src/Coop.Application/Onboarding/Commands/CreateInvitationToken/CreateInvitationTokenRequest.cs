using Coop.Application.Behaviors;
using Coop.Domain.Onboarding;
using MediatR;

namespace Coop.Application.Onboarding.Commands.CreateInvitationToken;

[OfficeOnly]
public class CreateInvitationTokenRequest : IRequest<CreateInvitationTokenResponse>
{
    public string Value { get; set; } = string.Empty;
    public InvitationTokenType Type { get; set; }
    public DateTime? ExpirationDate { get; set; }
}
