using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Queries.GetDocumentsPage;

[OfficeOnly]
public class GetDocumentsPageRequest : IRequest<GetDocumentsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
