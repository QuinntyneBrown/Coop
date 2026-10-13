using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetDocumentsPage;

public class GetDocumentsPageHandler : IRequestHandler<GetDocumentsPageRequest, GetDocumentsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetDocumentsPageHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetDocumentsPageResponse> Handle(GetDocumentsPageRequest request, CancellationToken cancellationToken)
    {
        var q = _context.Documents.Where(x => !x.IsDeleted);
        var tc = await q.CountAsync(cancellationToken);
        var d = await q.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
        return new GetDocumentsPageResponse { Documents = d.Select(DocumentDto.FromDocument).ToList(), TotalCount = tc, PageSize = request.PageSize, PageIndex = request.Index };
    }
}
