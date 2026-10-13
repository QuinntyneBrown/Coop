using MediatR;

namespace Coop.Application.Documents.Commands.UpdateDocument;

public class UpdateDocumentRequest : IRequest<UpdateDocumentResponse>
{
    public Guid DocumentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? DigitalAssetId { get; set; }
}
