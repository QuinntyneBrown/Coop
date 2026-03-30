using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Commands.CreateBoardMember;

public class CreateBoardMemberResponse
{
    public BoardMemberDto BoardMember { get; set; } = default!;
}
