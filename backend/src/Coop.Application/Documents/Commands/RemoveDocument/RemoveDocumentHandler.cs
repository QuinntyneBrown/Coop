using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.RemoveDocument;

public class RemoveDocumentHandler : IRequestHandler<RemoveDocumentRequest, RemoveDocumentResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveDocumentHandler(ICoopDbContext context) { _context = context; }

    public async Task<RemoveDocumentResponse> Handle(RemoveDocumentRequest request, CancellationToken cancellationToken)
    {
        var e = await _context.Documents.SingleAsync(x => x.DocumentId == request.DocumentId, cancellationToken);
        e.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveDocumentResponse { Document = DocumentDto.FromDocument(e) };
    }
}
