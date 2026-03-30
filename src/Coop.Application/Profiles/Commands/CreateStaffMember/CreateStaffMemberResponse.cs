using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Commands.CreateStaffMember;

public class CreateStaffMemberResponse
{
    public StaffMemberDto StaffMember { get; set; } = default!;
}
