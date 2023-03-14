// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class UpdateUserValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserValidator()
    {
        RuleFor(request => request.User).NotNull();
        RuleFor(request => request.User).SetValidator(new UserValidator());
    }
}
public class UpdateUserRequest : IRequest<UpdateUserResponse>
{
    public UserDto User { get; set; }
}
public class UpdateUserResponse : ResponseBase
{
    public UserDto User { get; set; }
}
public class UpdateUserHandler : IRequestHandler<UpdateUserRequest, UpdateUserResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateUserHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateUserResponse> Handle(UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.SingleAsync(x => x.UserId == request.User.UserId);
        user.SetUsername(request.User.Username);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            User = user.ToDto()
        };
    }
}

