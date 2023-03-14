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

public class GetStaffMembersPageRequest : IRequest<GetStaffMembersPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetStaffMembersPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<StaffMemberDto> Entities { get; set; }
}
public class GetStaffMembersPageHandler : IRequestHandler<GetStaffMembersPageRequest, GetStaffMembersPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetStaffMembersPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetStaffMembersPageResponse> Handle(GetStaffMembersPageRequest request, CancellationToken cancellationToken)
    {
        var query = from staffMember in _context.StaffMembers
                    select staffMember;
        var length = await _context.StaffMembers.CountAsync();
        var staffMembers = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = staffMembers
        };
    }
}
