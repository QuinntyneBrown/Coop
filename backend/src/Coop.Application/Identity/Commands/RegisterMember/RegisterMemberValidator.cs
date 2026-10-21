using FluentValidation;

namespace Coop.Application.Identity.Commands.RegisterMember;

/// <summary>The same rules as creating a user from the Users area.</summary>
public class RegisterMemberValidator : AbstractValidator<RegisterMemberRequest>
{
    public RegisterMemberValidator()
    {
        RuleFor(x => x.Username).NotEmpty().MinimumLength(3);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
    }
}
