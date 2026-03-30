using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Queries.GetMemberById;

public class GetMemberByIdResponse
{
    public MemberDto Member { get; set; } = default!;
}
