using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Privileges.Queries.GetPrivilegeById;

[OfficeOnly]
public class GetPrivilegeByIdRequest : IRequest<GetPrivilegeByIdResponse>
{
    public Guid PrivilegeId { get; set; }
}
