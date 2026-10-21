using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Profiles.Queries.GetStaffMembers;

[OfficeOnly]
public class GetStaffMembersRequest : IRequest<GetStaffMembersResponse> { }
