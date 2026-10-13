using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Queries.GetStaffMembers;

public class GetStaffMembersHandler : IRequestHandler<GetStaffMembersRequest, GetStaffMembersResponse>
{
    private readonly ICoopDbContext _context;

    public GetStaffMembersHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetStaffMembersResponse> Handle(GetStaffMembersRequest request, CancellationToken cancellationToken)
    {
        var staffMembers = await _context.StaffMembers.Where(s => !s.IsDeleted).ToListAsync(cancellationToken);
        return new GetStaffMembersResponse { StaffMembers = staffMembers.Select(StaffMemberDto.FromStaffMember).ToList() };
    }
}
