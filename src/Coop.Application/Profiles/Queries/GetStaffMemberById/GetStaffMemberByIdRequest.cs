using MediatR;

namespace Coop.Application.Profiles.Queries.GetStaffMemberById;

public class GetStaffMemberByIdRequest : IRequest<GetStaffMemberByIdResponse>
{
    public Guid ProfileId { get; set; }
}
