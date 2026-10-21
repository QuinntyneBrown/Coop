using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Queries.GetNotices;

[OfficeOnly]
public class GetNoticesRequest : IRequest<GetNoticesResponse>
{

}
