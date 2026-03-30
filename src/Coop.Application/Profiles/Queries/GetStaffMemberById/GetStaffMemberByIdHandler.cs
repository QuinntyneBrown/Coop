using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Queries.GetStaffMemberById;

public class GetStaffMemberByIdHandler : IRequestHandler<GetStaffMemberByIdRequest, GetStaffMemberByIdResponse>
{
    private readonly ICoopDbContext _context;

    public GetStaffMemberByIdHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetStaffMemberByIdResponse> Handle(GetStaffMemberByIdRequest request, CancellationToken cancellationToken)
    {
        var staffMember = await _context.StaffMembers.SingleAsync(s => s.ProfileId == request.ProfileId, cancellationToken);
        return new GetStaffMemberByIdResponse { StaffMember = StaffMemberDto.FromStaffMember(staffMember) };
    }
}
