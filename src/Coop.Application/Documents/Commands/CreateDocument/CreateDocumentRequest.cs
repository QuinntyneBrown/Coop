using MediatR;

namespace Coop.Application.Documents.Commands.CreateDocument;

public class CreateDocumentRequest : IRequest<CreateDocumentResponse>
{
    public string Name { get; set; } = string.Empty;
    public Guid? DigitalAssetId { get; set; }
}
