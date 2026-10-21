using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Roles.Queries.GetRoleById;

[OfficeOnly]
public class GetRoleByIdRequest : IRequest<GetRoleByIdResponse>
{
    public Guid RoleId { get; set; }
}
