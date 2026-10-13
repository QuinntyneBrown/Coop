using MediatR;

namespace Coop.Application.Documents.Queries.GetReportsPage;

public class GetReportsPageRequest : IRequest<GetReportsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
