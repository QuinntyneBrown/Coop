using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.UpdateDocument;

[OfficeOnly]
public class UpdateDocumentRequest : IRequest<UpdateDocumentResponse>
{
    public Guid DocumentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? DigitalAssetId { get; set; }
}
