using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Commands.RemoveStaffMember;

public class RemoveStaffMemberHandler : IRequestHandler<RemoveStaffMemberRequest, RemoveStaffMemberResponse>
{
    private readonly ICoopDbContext _context;

    public RemoveStaffMemberHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<RemoveStaffMemberResponse> Handle(RemoveStaffMemberRequest request, CancellationToken cancellationToken)
    {
        var staffMember = await _context.StaffMembers.SingleAsync(s => s.ProfileId == request.ProfileId, cancellationToken);
        staffMember.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveStaffMemberResponse { StaffMember = StaffMemberDto.FromStaffMember(staffMember) };
    }
}
