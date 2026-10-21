using Coop.SharedKernel;
using FluentValidation;

namespace Coop.Application.Privileges.Commands.CreatePrivilege;

public class CreatePrivilegeValidator : AbstractValidator<CreatePrivilegeRequest>
{
    public CreatePrivilegeValidator()
    {
        RuleFor(x => x.RoleId).NotEmpty();
        RuleFor(x => x.Aggregate).NotEmpty()
            .Must(aggregate => Constants.Aggregates.All.Contains(aggregate))
            .WithMessage(x => $"Unknown aggregate \"{x.Aggregate}\".");
    }
}
