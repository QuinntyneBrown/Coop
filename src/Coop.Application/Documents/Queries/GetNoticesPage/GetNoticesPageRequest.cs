using MediatR;

namespace Coop.Application.Documents.Queries.GetNoticesPage;

public class GetNoticesPageRequest : IRequest<GetNoticesPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
