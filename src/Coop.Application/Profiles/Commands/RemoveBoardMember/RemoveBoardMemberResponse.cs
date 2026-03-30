using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Commands.RemoveBoardMember;

public class RemoveBoardMemberResponse
{
    public BoardMemberDto BoardMember { get; set; } = default!;
}
