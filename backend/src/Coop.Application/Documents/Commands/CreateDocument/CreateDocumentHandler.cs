using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using Coop.Domain.Documents;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.CreateDocument;

public class CreateDocumentHandler : IRequestHandler<CreateDocumentRequest, CreateDocumentResponse>
{
    private readonly ICoopDbContext _context;
    public CreateDocumentHandler(ICoopDbContext context) { _context = context; }

    public async Task<CreateDocumentResponse> Handle(CreateDocumentRequest request, CancellationToken cancellationToken)
    {
        var e = new Document { Name = request.Name, DigitalAssetId = request.DigitalAssetId };
        _context.Documents.Add(e);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateDocumentResponse { Document = DocumentDto.FromDocument(e) };
    }
}
