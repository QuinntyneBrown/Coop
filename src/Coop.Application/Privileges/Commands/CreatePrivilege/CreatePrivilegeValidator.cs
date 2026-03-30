using FluentValidation;

namespace Coop.Application.Privileges.Commands.CreatePrivilege;

public class CreatePrivilegeValidator : AbstractValidator<CreatePrivilegeRequest>
{
    public CreatePrivilegeValidator()
    {
        RuleFor(x => x.RoleId).NotEmpty();
        RuleFor(x => x.Aggregate).NotEmpty();
    }
}
