using MediatR;

namespace Coop.Application.Profiles.Commands.RemoveMember;

public class RemoveMemberRequest : IRequest<RemoveMemberResponse>
{
    public Guid ProfileId { get; set; }
}
