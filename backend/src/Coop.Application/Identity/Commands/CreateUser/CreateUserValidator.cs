using FluentValidation;

namespace Coop.Application.Identity.Commands.CreateUser;

public class CreateUserValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.Username).Username();
        RuleFor(x => x.Password).Password();
    }
}
