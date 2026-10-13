using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetDocuments;

public class GetDocumentsHandler : IRequestHandler<GetDocumentsRequest, GetDocumentsResponse>
{
    private readonly ICoopDbContext _context;
    public GetDocumentsHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetDocumentsResponse> Handle(GetDocumentsRequest request, CancellationToken cancellationToken)
    {
        var d = await _context.Documents.Where(x => !x.IsDeleted).ToListAsync(cancellationToken);
        return new GetDocumentsResponse { Documents = d.Select(DocumentDto.FromDocument).ToList() };
    }
}
