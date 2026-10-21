using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Profiles.Queries.GetMembers;

[OfficeOnly]
public class GetMembersRequest : IRequest<GetMembersResponse> { }
