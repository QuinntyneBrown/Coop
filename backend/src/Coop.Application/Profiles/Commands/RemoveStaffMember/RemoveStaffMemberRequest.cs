using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Profiles.Commands.RemoveStaffMember;

[OfficeOnly]
public class RemoveStaffMemberRequest : IRequest<RemoveStaffMemberResponse>
{
    public Guid ProfileId { get; set; }
}
