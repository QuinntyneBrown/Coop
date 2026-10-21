using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Profiles.Queries.GetMemberById;

[OfficeOnly]
public class GetMemberByIdRequest : IRequest<GetMemberByIdResponse>
{
    public Guid ProfileId { get; set; }
}
