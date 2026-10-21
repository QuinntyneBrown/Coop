using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.RemoveDocument;

[OfficeOnly]
public class RemoveDocumentRequest : IRequest<RemoveDocumentResponse>
{
    public Guid DocumentId { get; set; }
}
