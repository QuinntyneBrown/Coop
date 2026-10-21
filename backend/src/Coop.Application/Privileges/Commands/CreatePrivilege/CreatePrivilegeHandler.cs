using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using Coop.Domain.Identity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Privileges.Commands.CreatePrivilege;

public class CreatePrivilegeHandler : IRequestHandler<CreatePrivilegeRequest, CreatePrivilegeResponse>
{
    private readonly ICoopDbContext _context;

    public CreatePrivilegeHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<CreatePrivilegeResponse> Handle(CreatePrivilegeRequest request, CancellationToken cancellationToken)
    {
        // A repeated grant returns the privilege the role already holds (ADR 0015).
        var existing = await _context.Privileges.FirstOrDefaultAsync(p => p.RoleId == request.RoleId
            && p.Aggregate == request.Aggregate && p.AccessRight == request.AccessRight, cancellationToken);
        if (existing != null)
            return new CreatePrivilegeResponse { Privilege = PrivilegeDto.FromPrivilege(existing) };

        var privilege = new Privilege
        {
            RoleId = request.RoleId,
            AccessRight = request.AccessRight,
            Aggregate = request.Aggregate
        };

        _context.Privileges.Add(privilege);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreatePrivilegeResponse { Privilege = PrivilegeDto.FromPrivilege(privilege) };
    }
}
