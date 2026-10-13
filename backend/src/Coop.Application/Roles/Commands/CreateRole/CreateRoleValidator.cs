using FluentValidation;

namespace Coop.Application.Roles.Commands.CreateRole;

public class CreateRoleValidator : AbstractValidator<CreateRoleRequest>
{
    public CreateRoleValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
    }
}
