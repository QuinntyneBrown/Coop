using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetDocumentsPage;

public class GetDocumentsPageResponse
{
    public List<DocumentDto> Documents { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
