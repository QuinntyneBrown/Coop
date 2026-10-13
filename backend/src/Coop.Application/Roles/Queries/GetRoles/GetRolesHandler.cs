using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Roles.Queries.GetRoles;

public class GetRolesHandler : IRequestHandler<GetRolesRequest, GetRolesResponse>
{
    private readonly ICoopDbContext _context;

    public GetRolesHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetRolesResponse> Handle(GetRolesRequest request, CancellationToken cancellationToken)
    {
        var roles = await _context.Roles
            .Include(r => r.Privileges)
            .ToListAsync(cancellationToken);

        return new GetRolesResponse { Roles = roles.Select(RoleDto.FromRole).ToList() };
    }
}
