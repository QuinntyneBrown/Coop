using Coop.Domain.Interfaces;
using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using static Coop.Domain.Constants;
using System;

namespace Coop.Application.Features.Users;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(x => x.Password)
            .NotNull()
            .NotEmpty();
    }
}
[AuthorizeResourceOperation(nameof(Operations.Write), nameof(Aggregates.User))]
public class UpdatePasswordRequest : IRequest<UpdatePasswordResponse>
{
    public Guid UserId { get; set; }
    public string Password { get; set; }
}
public class UpdatePasswordResponse
{
    public UserDto User { get; set; }
}
public class UpdatePasswordHandler : IRequestHandler<UpdatePasswordRequest, UpdatePasswordResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    public UpdatePasswordHandler(ICoopDbContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }
    public async Task<UpdatePasswordResponse> Handle(UpdatePasswordRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(request.UserId);
        user.SetPassword(request.Password, _passwordHasher);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            User = user.ToDto()
        };
    }
}
