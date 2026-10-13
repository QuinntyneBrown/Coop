using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.UpdateDocument;

public class UpdateDocumentHandler : IRequestHandler<UpdateDocumentRequest, UpdateDocumentResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateDocumentHandler(ICoopDbContext context) { _context = context; }

    public async Task<UpdateDocumentResponse> Handle(UpdateDocumentRequest request, CancellationToken cancellationToken)
    {
        var e = await _context.Documents.SingleAsync(x => x.DocumentId == request.DocumentId, cancellationToken);
        e.Name = request.Name; e.DigitalAssetId = request.DigitalAssetId;
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateDocumentResponse { Document = DocumentDto.FromDocument(e) };
    }
}
