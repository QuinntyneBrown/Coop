using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Queries.GetStaffMembers;

public class GetStaffMembersResponse
{
    public List<StaffMemberDto> StaffMembers { get; set; } = new();
}
