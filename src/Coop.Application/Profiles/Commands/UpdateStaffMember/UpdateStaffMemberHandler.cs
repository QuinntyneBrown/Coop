using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Commands.UpdateStaffMember;

public class UpdateStaffMemberHandler : IRequestHandler<UpdateStaffMemberRequest, UpdateStaffMemberResponse>
{
    private readonly ICoopDbContext _context;

    public UpdateStaffMemberHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateStaffMemberResponse> Handle(UpdateStaffMemberRequest request, CancellationToken cancellationToken)
    {
        var staffMember = await _context.StaffMembers.SingleAsync(s => s.ProfileId == request.ProfileId, cancellationToken);

        staffMember.Firstname = request.Firstname;
        staffMember.Lastname = request.Lastname;
        staffMember.PhoneNumber = request.PhoneNumber;
        staffMember.Email = request.Email;
        staffMember.JobTitle = request.JobTitle;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateStaffMemberResponse { StaffMember = StaffMemberDto.FromStaffMember(staffMember) };
    }
}
