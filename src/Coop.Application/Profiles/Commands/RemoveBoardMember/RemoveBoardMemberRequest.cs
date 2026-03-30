using MediatR;

namespace Coop.Application.Profiles.Commands.RemoveBoardMember;

public class RemoveBoardMemberRequest : IRequest<RemoveBoardMemberResponse>
{
    public Guid ProfileId { get; set; }
}
