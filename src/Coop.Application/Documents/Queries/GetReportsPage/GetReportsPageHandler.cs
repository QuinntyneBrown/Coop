using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetReportsPage;

public class GetReportsPageHandler : IRequestHandler<GetReportsPageRequest, GetReportsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetReportsPageHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetReportsPageResponse> Handle(GetReportsPageRequest request, CancellationToken cancellationToken)
    {
        var q = _context.Reports.Where(x => !x.IsDeleted);
        var tc = await q.CountAsync(cancellationToken);
        var es = await q.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
        return new GetReportsPageResponse { Reports = es.Select(ReportDto.FromReport).ToList(), TotalCount = tc, PageSize = request.PageSize, PageIndex = request.Index };
    }
}
