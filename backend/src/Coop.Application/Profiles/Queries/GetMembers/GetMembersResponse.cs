using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Queries.GetMembers;

public class GetMembersResponse
{
    public List<MemberDto> Members { get; set; } = new();
}
