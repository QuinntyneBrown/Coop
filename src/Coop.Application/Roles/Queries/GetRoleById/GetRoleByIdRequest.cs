using MediatR;

namespace Coop.Application.Roles.Queries.GetRoleById;

public class GetRoleByIdRequest : IRequest<GetRoleByIdResponse>
{
    public Guid RoleId { get; set; }
}
