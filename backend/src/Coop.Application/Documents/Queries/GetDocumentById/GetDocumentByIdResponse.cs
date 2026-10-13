using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetDocumentById;

public class GetDocumentByIdResponse
{
    public DocumentDto Document { get; set; } = default!;
}
