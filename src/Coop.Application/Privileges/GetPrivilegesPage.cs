using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Coop.Application.Common.Extensions;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Application.Common.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetPrivilegesPageRequest : IRequest<GetPrivilegesPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetPrivilegesPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<PrivilegeDto> Entities { get; set; }
}
public class GetPrivilegesPageHandler : IRequestHandler<GetPrivilegesPageRequest, GetPrivilegesPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetPrivilegesPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetPrivilegesPageResponse> Handle(GetPrivilegesPageRequest request, CancellationToken cancellationToken)
    {
        var query = from privilege in _context.Privileges
                    select privilege;
        var length = await _context.Privileges.CountAsync();
        var privileges = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = privileges
        };
    }
}
