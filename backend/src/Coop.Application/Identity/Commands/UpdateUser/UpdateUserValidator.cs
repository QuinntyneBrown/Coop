using Coop.Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Commands.UpdateUser;

public class UpdateUserValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserValidator(ICoopDbContext context)
    {
        RuleFor(x => x.Username).Username()
            .MustAsync(async (request, username, cancellationToken) => !await context.Users
                .AnyAsync(u => u.Username == username && u.UserId != request.UserId && !u.IsDeleted, cancellationToken))
            .WithMessage(x => CredentialRules.TakenMessage(x.Username));
    }
}
