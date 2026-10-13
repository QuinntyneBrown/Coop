using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Commands.RemoveStaffMember;

public class RemoveStaffMemberResponse
{
    public StaffMemberDto StaffMember { get; set; } = default!;
}
