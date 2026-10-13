using MediatR;

namespace Coop.Application.Documents.Commands.PublishDocument;

public class PublishDocumentRequest : IRequest<PublishDocumentResponse> { public Guid DocumentId { get; set; } }
