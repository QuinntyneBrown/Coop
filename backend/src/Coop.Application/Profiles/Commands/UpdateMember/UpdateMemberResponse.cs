using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Commands.UpdateMember;

public class UpdateMemberResponse
{
    public MemberDto Member { get; set; } = default!;
}
