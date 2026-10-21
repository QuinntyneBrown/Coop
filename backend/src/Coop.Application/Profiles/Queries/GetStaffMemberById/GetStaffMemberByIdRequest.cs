using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Profiles.Queries.GetStaffMemberById;

[OfficeOnly]
public class GetStaffMemberByIdRequest : IRequest<GetStaffMemberByIdResponse>
{
    public Guid ProfileId { get; set; }
}
