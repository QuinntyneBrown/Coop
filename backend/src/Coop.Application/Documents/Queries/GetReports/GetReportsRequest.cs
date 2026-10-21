using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Queries.GetReports;

[OfficeOnly]
public class GetReportsRequest : IRequest<GetReportsResponse>
{

}
