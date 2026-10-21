using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Identity.Queries.GetUsers;

[OfficeOnly]
public class GetUsersRequest : IRequest<GetUsersResponse>
{
}
