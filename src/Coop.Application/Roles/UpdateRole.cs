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

public class UpdateRoleValidator : AbstractValidator<UpdateRoleRequest>
{
    public UpdateRoleValidator()
    {
        RuleFor(request => request.Role).NotNull();
        RuleFor(request => request.Role).SetValidator(new RoleValidator());
    }
}
public class UpdateRoleRequest : IRequest<UpdateRoleResponse>
{
    public RoleDto Role { get; set; }
}
public class UpdateRoleResponse : ResponseBase
{
    public RoleDto Role { get; set; }
}
public class UpdateRoleHandler : IRequestHandler<UpdateRoleRequest, UpdateRoleResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateRoleHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateRoleResponse> Handle(UpdateRoleRequest request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles.SingleAsync(x => x.RoleId == request.Role.RoleId);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            Role = role.ToDto()
        };
    }
}

