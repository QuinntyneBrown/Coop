using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetPublishedReports;

public class GetPublishedReportsHandler : IRequestHandler<GetPublishedReportsRequest, GetPublishedReportsResponse>
{
    private readonly ICoopDbContext _context;
    public GetPublishedReportsHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetPublishedReportsResponse> Handle(GetPublishedReportsRequest request, CancellationToken cancellationToken)
    {
        var es = await _context.Reports.Where(x => x.Published && !x.IsDeleted).ToListAsync(cancellationToken);
        return new GetPublishedReportsResponse { Reports = es.Select(ReportDto.FromReport).ToList() };
    }
}
