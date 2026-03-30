using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Privileges.Queries.GetPrivilegesPage;

public class GetPrivilegesPageHandler : IRequestHandler<GetPrivilegesPageRequest, GetPrivilegesPageResponse>
{
    private readonly ICoopDbContext _context;

    public GetPrivilegesPageHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetPrivilegesPageResponse> Handle(GetPrivilegesPageRequest request, CancellationToken cancellationToken)
    {
        var query = _context.Privileges.AsQueryable();
        var totalCount = await query.CountAsync(cancellationToken);
        var privileges = await query.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);

        return new GetPrivilegesPageResponse
        {
            Privileges = privileges.Select(PrivilegeDto.FromPrivilege).ToList(),
            TotalCount = totalCount,
            PageSize = request.PageSize,
            PageIndex = request.Index
        };
    }
}
