using Coop.Application.Common.Interfaces;
using Coop.Application.Identity;
using FluentValidation;

namespace Coop.Application.Roles.Commands.RemoveRole;

public class RemoveRoleValidator : AbstractValidator<RemoveRoleRequest>
{
    public RemoveRoleValidator(ICoopDbContext context)
    {
        // Removing it would leave nobody able to administer the installation (L2-REQ-106 AC3).
        RuleFor(x => x.RoleId)
            .MustAsync(async (roleId, cancellationToken) => !await SystemAdministratorRules.IsSystemAdministratorRoleAsync(context, roleId, cancellationToken))
            .WithMessage("The SystemAdministrator role cannot be removed.");
    }
}
