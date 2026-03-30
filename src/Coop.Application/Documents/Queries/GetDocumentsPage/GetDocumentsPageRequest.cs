using MediatR;

namespace Coop.Application.Documents.Queries.GetDocumentsPage;

public class GetDocumentsPageRequest : IRequest<GetDocumentsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
