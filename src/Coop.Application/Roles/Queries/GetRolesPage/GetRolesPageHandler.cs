using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Roles.Queries.GetRolesPage;

public class GetRolesPageHandler : IRequestHandler<GetRolesPageRequest, GetRolesPageResponse>
{
    private readonly ICoopDbContext _context;

    public GetRolesPageHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetRolesPageResponse> Handle(GetRolesPageRequest request, CancellationToken cancellationToken)
    {
        var query = _context.Roles.Include(r => r.Privileges).AsQueryable();

        var totalCount = await query.CountAsync(cancellationToken);

        var roles = await query
            .Skip(request.Index * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new GetRolesPageResponse
        {
            Roles = roles.Select(RoleDto.FromRole).ToList(),
            TotalCount = totalCount,
            PageSize = request.PageSize,
            PageIndex = request.Index
        };
    }
}
