using MediatR;

namespace Coop.Application.Documents.Queries.GetByLawsPage;

public class GetByLawsPageRequest : IRequest<GetByLawsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
