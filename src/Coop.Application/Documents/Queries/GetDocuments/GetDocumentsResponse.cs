using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetDocuments;

public class GetDocumentsResponse
{
    public List<DocumentDto> Documents { get; set; } = new();
}
