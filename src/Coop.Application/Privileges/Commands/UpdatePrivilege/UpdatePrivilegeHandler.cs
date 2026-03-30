using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Privileges.Commands.UpdatePrivilege;

public class UpdatePrivilegeHandler : IRequestHandler<UpdatePrivilegeRequest, UpdatePrivilegeResponse>
{
    private readonly ICoopDbContext _context;

    public UpdatePrivilegeHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<UpdatePrivilegeResponse> Handle(UpdatePrivilegeRequest request, CancellationToken cancellationToken)
    {
        var privilege = await _context.Privileges
            .SingleAsync(p => p.PrivilegeId == request.PrivilegeId, cancellationToken);

        privilege.AccessRight = request.AccessRight;
        privilege.Aggregate = request.Aggregate;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdatePrivilegeResponse { Privilege = PrivilegeDto.FromPrivilege(privilege) };
    }
}
