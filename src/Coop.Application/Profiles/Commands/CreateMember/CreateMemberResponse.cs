using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Commands.CreateMember;

public class CreateMemberResponse
{
    public MemberDto Member { get; set; } = default!;
}
