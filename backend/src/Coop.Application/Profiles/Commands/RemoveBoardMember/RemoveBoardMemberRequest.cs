using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Profiles.Commands.RemoveBoardMember;

[OfficeOnly]
public class RemoveBoardMemberRequest : IRequest<RemoveBoardMemberResponse>
{
    public Guid ProfileId { get; set; }
}
