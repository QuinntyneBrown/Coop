using Coop.Application.Common.Interfaces;
using FluentValidation;

namespace Coop.Application.Identity.Commands.RemoveUserRole;

public class RemoveUserRoleValidator : AbstractValidator<RemoveUserRoleRequest>
{
    public RemoveUserRoleValidator(ICoopDbContext context)
    {
        RuleFor(x => x)
            .MustAsync(async (request, cancellationToken) =>
                !await SystemAdministratorRules.IsSystemAdministratorRoleAsync(context, request.RoleId, cancellationToken)
                || await SystemAdministratorRules.AnotherRemainsWithoutAsync(context, request.UserId, cancellationToken))
            .WithMessage(SystemAdministratorRules.LastAdministratorMessage);
    }
}
