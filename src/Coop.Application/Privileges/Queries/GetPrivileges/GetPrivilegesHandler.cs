using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Privileges.Queries.GetPrivileges;

public class GetPrivilegesHandler : IRequestHandler<GetPrivilegesRequest, GetPrivilegesResponse>
{
    private readonly ICoopDbContext _context;

    public GetPrivilegesHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetPrivilegesResponse> Handle(GetPrivilegesRequest request, CancellationToken cancellationToken)
    {
        var privileges = await _context.Privileges.ToListAsync(cancellationToken);
        return new GetPrivilegesResponse { Privileges = privileges.Select(PrivilegeDto.FromPrivilege).ToList() };
    }
}
