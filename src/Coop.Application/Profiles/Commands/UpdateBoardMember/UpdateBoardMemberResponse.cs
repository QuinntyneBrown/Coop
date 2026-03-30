using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Commands.UpdateBoardMember;

public class UpdateBoardMemberResponse
{
    public BoardMemberDto BoardMember { get; set; } = default!;
}
