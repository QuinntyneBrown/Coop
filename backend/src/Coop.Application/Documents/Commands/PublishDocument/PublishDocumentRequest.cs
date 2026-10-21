using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.PublishDocument;

[OfficeOnly]
public class PublishDocumentRequest : IRequest<PublishDocumentResponse> { public Guid DocumentId { get; set; } }
