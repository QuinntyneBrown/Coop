using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetStaffMembersRequest : IRequest<GetStaffMembersResponse> { }
public class GetStaffMembersResponse : ResponseBase
{
    public List<StaffMemberDto> StaffMembers { get; set; }
}
public class GetStaffMembersHandler : IRequestHandler<GetStaffMembersRequest, GetStaffMembersResponse>
{
    private readonly ICoopDbContext _context;
    public GetStaffMembersHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetStaffMembersResponse> Handle(GetStaffMembersRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            StaffMembers = await _context.StaffMembers.Select(x => x.ToDto()).ToListAsync()
        };
    }
}
