using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetReports;

public class GetReportsHandler : IRequestHandler<GetReportsRequest, GetReportsResponse>
{
    private readonly ICoopDbContext _context;
    public GetReportsHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetReportsResponse> Handle(GetReportsRequest request, CancellationToken cancellationToken)
    {
        var es = await _context.Reports.Where(x => !x.IsDeleted).ToListAsync(cancellationToken);
        return new GetReportsResponse { Reports = es.Select(ReportDto.FromReport).ToList() };
    }
}
