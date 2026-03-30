using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Queries.GetBoardMemberById;

public class GetBoardMemberByIdResponse
{
    public BoardMemberDto BoardMember { get; set; } = default!;
}
