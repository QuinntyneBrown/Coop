using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using Coop.Domain.Profiles;
using MediatR;

namespace Coop.Application.Profiles.Commands.CreateStaffMember;

public class CreateStaffMemberHandler : IRequestHandler<CreateStaffMemberRequest, CreateStaffMemberResponse>
{
    private readonly ICoopDbContext _context;

    public CreateStaffMemberHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<CreateStaffMemberResponse> Handle(CreateStaffMemberRequest request, CancellationToken cancellationToken)
    {
        var staffMember = new StaffMember
        {
            UserId = request.UserId,
            Firstname = request.Firstname,
            Lastname = request.Lastname,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            JobTitle = request.JobTitle
        };

        _context.StaffMembers.Add(staffMember);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateStaffMemberResponse { StaffMember = StaffMemberDto.FromStaffMember(staffMember) };
    }
}
