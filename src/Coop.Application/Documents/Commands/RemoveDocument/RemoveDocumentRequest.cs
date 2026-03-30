using MediatR;

namespace Coop.Application.Documents.Commands.RemoveDocument;

public class RemoveDocumentRequest : IRequest<RemoveDocumentResponse>
{
    public Guid DocumentId { get; set; }
}
