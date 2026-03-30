using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.PublishDocument;

public class PublishDocumentHandler : IRequestHandler<PublishDocumentRequest, PublishDocumentResponse>
{
    private readonly ICoopDbContext _context;
    public PublishDocumentHandler(ICoopDbContext context) { _context = context; }

    public async Task<PublishDocumentResponse> Handle(PublishDocumentRequest request, CancellationToken cancellationToken)
    {
        var doc = await _context.Documents.SingleAsync(d => d.DocumentId == request.DocumentId, cancellationToken);
        doc.Publish();
        await _context.SaveChangesAsync(cancellationToken);
        return new PublishDocumentResponse { Document = DocumentDto.FromDocument(doc) };
    }
}
