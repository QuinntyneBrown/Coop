using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetByLawsPage;

public class GetByLawsPageHandler : IRequestHandler<GetByLawsPageRequest, GetByLawsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetByLawsPageHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetByLawsPageResponse> Handle(GetByLawsPageRequest request, CancellationToken cancellationToken)
    {
        var q = _context.ByLaws.Where(x => !x.IsDeleted);
        var tc = await q.CountAsync(cancellationToken);
        var es = await q.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
        return new GetByLawsPageResponse { ByLaws = es.Select(ByLawDto.FromByLaw).ToList(), TotalCount = tc, PageSize = request.PageSize, PageIndex = request.Index };
    }
}
