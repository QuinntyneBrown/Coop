// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Role).NotNull();
        RuleFor(request => request.Role).SetValidator(new RoleValidator());
    }
}
public class CreateRoleRequest : IRequest<CreateRoleResponse>
{
    public RoleDto Role { get; set; }
}
public class CreateRoleResponse : ResponseBase
{
    public RoleDto Role { get; set; }
}
public class CreateRoleHandler : IRequestHandler<CreateRoleRequest, CreateRoleResponse>
{
    private readonly ICoopDbContext _context;
    public CreateRoleHandler(ICoopDbContext context)
        => _context = context;
    public async Task<CreateRoleResponse> Handle(CreateRoleRequest request, CancellationToken cancellationToken)
    {
        var role = new Role(request.Role.Name);
        _context.Roles.Add(role);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            Role = role.ToDto()
        };
    }
}

