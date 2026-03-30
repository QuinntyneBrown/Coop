using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Privileges.Queries.GetPrivilegeById;

public class GetPrivilegeByIdHandler : IRequestHandler<GetPrivilegeByIdRequest, GetPrivilegeByIdResponse>
{
    private readonly ICoopDbContext _context;

    public GetPrivilegeByIdHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetPrivilegeByIdResponse> Handle(GetPrivilegeByIdRequest request, CancellationToken cancellationToken)
    {
        var privilege = await _context.Privileges.SingleAsync(p => p.PrivilegeId == request.PrivilegeId, cancellationToken);
        return new GetPrivilegeByIdResponse { Privilege = PrivilegeDto.FromPrivilege(privilege) };
    }
}
