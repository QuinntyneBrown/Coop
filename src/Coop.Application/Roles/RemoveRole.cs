using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class RemoveRoleRequest : IRequest<RemoveRoleResponse>
{
    public Guid RoleId { get; set; }
}
public class RemoveRoleResponse : ResponseBase
{
    public RoleDto Role { get; set; }
}
public class RemoveRoleHandler : IRequestHandler<RemoveRoleRequest, RemoveRoleResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveRoleHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveRoleResponse> Handle(RemoveRoleRequest request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles.SingleAsync(x => x.RoleId == request.RoleId);
        _context.Roles.Remove(role);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            Role = role.ToDto()
        };
    }
}
