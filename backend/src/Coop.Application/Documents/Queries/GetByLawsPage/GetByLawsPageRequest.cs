using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Queries.GetByLawsPage;

[OfficeOnly]
public class GetByLawsPageRequest : IRequest<GetByLawsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
