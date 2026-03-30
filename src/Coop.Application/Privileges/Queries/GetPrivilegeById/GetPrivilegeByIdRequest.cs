using MediatR;

namespace Coop.Application.Privileges.Queries.GetPrivilegeById;

public class GetPrivilegeByIdRequest : IRequest<GetPrivilegeByIdResponse>
{
    public Guid PrivilegeId { get; set; }
}
