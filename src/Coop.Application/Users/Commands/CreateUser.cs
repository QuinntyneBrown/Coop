// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using Coop.Domain.DomainEvents;
using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using static Coop.Domain.Constants;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.User).NotNull();
        RuleFor(request => request.User).SetValidator(new UserValidator());
    }
}
[AuthorizeResourceOperation(nameof(Operations.Create), nameof(Aggregates.User))]
public class CreateUserRequest : IRequest<CreateUserResponse>
{
    public UserDto User { get; set; }
}
public class CreateUserResponse : ResponseBase
{
    public UserDto User { get; set; }
}
public class CreateUserHandler : IRequestHandler<CreateUserRequest, CreateUserResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IOrchestrationHandler _messageHandlerContext;
    public CreateUserHandler(ICoopDbContext context, IPasswordHasher passwordHasher, IOrchestrationHandler messageHandlerContext)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _messageHandlerContext = messageHandlerContext;
    }
    public async Task<CreateUserResponse> Handle(CreateUserRequest request, CancellationToken cancellationToken)
    {
        var user = new User(request.User.Username, request.User.Password, _passwordHasher);
        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            User = user.ToDto()
        };
    }
}

