using FluentValidation;

namespace Coop.Application.Identity.Commands.SetPassword;

public class SetPasswordValidator : AbstractValidator<SetPasswordRequest>
{
    public SetPasswordValidator()
    {
        RuleFor(x => x.Password).Password();
    }
}
