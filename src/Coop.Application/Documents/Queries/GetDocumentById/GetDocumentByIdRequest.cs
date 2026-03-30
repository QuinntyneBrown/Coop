using MediatR;

namespace Coop.Application.Documents.Queries.GetDocumentById;

public class GetDocumentByIdRequest : IRequest<GetDocumentByIdResponse>
{
    public Guid DocumentId { get; set; }
}
