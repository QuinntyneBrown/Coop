using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Privileges.Queries.GetPrivileges;

[OfficeOnly]
public class GetPrivilegesRequest : IRequest<GetPrivilegesResponse> { }
