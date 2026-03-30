using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Queries.GetStaffMemberById;

public class GetStaffMemberByIdResponse
{
    public StaffMemberDto StaffMember { get; set; } = default!;
}
