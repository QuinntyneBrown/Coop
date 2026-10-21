using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Identity.Queries.GetUserById;

[OfficeOnly]
public class GetUserByIdRequest : IRequest<GetUserByIdResponse>
{
    public Guid UserId { get; set; }
}
