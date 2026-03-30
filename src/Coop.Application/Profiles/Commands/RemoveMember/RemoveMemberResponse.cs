using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Commands.RemoveMember;

public class RemoveMemberResponse
{
    public MemberDto Member { get; set; } = default!;
}
