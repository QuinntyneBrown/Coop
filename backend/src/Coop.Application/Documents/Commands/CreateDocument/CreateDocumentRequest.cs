using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.CreateDocument;

[OfficeOnly]
public class CreateDocumentRequest : IRequest<CreateDocumentResponse>
{
    public string Name { get; set; } = string.Empty;
    public Guid? DigitalAssetId { get; set; }
}
