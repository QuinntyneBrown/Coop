using FluentValidation;

namespace Coop.Application.Onboarding.Commands.CreateInvitationToken;

public class CreateInvitationTokenValidator : AbstractValidator<CreateInvitationTokenRequest>
{
    public CreateInvitationTokenValidator()
    {
        RuleFor(x => x.Value).NotEmpty();
        RuleFor(x => x.Type).IsInEnum();
    }
}
