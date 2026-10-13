using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Queries.GetBoardMembers;

public class GetBoardMembersResponse
{
    public List<BoardMemberDto> BoardMembers { get; set; } = new();
}
