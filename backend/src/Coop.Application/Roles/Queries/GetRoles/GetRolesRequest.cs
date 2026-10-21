using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Roles.Queries.GetRoles;

[OfficeOnly]
public class GetRolesRequest : IRequest<GetRolesResponse>
{
}
