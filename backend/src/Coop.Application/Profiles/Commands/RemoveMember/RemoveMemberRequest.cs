using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Profiles.Commands.RemoveMember;

[OfficeOnly]
public class RemoveMemberRequest : IRequest<RemoveMemberResponse>
{
    public Guid ProfileId { get; set; }
}
