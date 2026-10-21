using Coop.Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Commands.CreateUser;

public class CreateUserValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserValidator(ICoopDbContext context)
    {
        RuleFor(x => x.Username).Username()
            .MustAsync(async (username, cancellationToken) => !await context.Users.AnyAsync(u => u.Username == username && !u.IsDeleted, cancellationToken))
            .WithMessage(x => CredentialRules.TakenMessage(x.Username));
        RuleFor(x => x.Password).Password();
    }
}
