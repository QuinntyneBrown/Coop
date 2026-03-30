using MediatR;

namespace Coop.Application.Profiles.Commands.RemoveStaffMember;

public class RemoveStaffMemberRequest : IRequest<RemoveStaffMemberResponse>
{
    public Guid ProfileId { get; set; }
}
