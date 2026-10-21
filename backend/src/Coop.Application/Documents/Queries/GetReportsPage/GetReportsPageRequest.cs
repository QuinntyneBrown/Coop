using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Queries.GetReportsPage;

[OfficeOnly]
public class GetReportsPageRequest : IRequest<GetReportsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
