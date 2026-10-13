using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetDocumentById;

public class GetDocumentByIdHandler : IRequestHandler<GetDocumentByIdRequest, GetDocumentByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetDocumentByIdHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetDocumentByIdResponse> Handle(GetDocumentByIdRequest request, CancellationToken cancellationToken)
    {
        var d = await _context.Documents.SingleAsync(x => x.DocumentId == request.DocumentId, cancellationToken);
        return new GetDocumentByIdResponse { Document = DocumentDto.FromDocument(d) };
    }
}
