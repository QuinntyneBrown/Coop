using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Privileges.Commands.RemovePrivilege;

public class RemovePrivilegeHandler : IRequestHandler<RemovePrivilegeRequest, RemovePrivilegeResponse>
{
    private readonly ICoopDbContext _context;

    public RemovePrivilegeHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<RemovePrivilegeResponse> Handle(RemovePrivilegeRequest request, CancellationToken cancellationToken)
    {
        var privilege = await _context.Privileges
            .SingleAsync(p => p.PrivilegeId == request.PrivilegeId, cancellationToken);

        _context.Privileges.Remove(privilege);
        await _context.SaveChangesAsync(cancellationToken);

        return new RemovePrivilegeResponse { Privilege = PrivilegeDto.FromPrivilege(privilege) };
    }
}
