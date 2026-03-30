using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.RemoveReport;

public class RemoveReportHandler : IRequestHandler<RemoveReportRequest, RemoveReportResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveReportHandler(ICoopDbContext context) { _context = context; }

    public async Task<RemoveReportResponse> Handle(RemoveReportRequest request, CancellationToken cancellationToken)
    {
        var e = await _context.Reports.SingleAsync(x => x.DocumentId == request.DocumentId, cancellationToken);
        e.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveReportResponse { Report = ReportDto.FromReport(e) };
    }
}
