using Coop.Application.Common.Interfaces;
using FluentValidation;

namespace Coop.Application.Identity.Commands.RemoveUser;

public class RemoveUserValidator : AbstractValidator<RemoveUserRequest>
{
    public RemoveUserValidator(ICoopDbContext context)
    {
        RuleFor(x => x.UserId)
            .MustAsync((userId, cancellationToken) => SystemAdministratorRules.AnotherRemainsWithoutAsync(context, userId, cancellationToken))
            .WithMessage(SystemAdministratorRules.LastAdministratorMessage);
    }
}
