using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.UpdateReport;

public class UpdateReportHandler : IRequestHandler<UpdateReportRequest, UpdateReportResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateReportHandler(ICoopDbContext context) { _context = context; }

    public async Task<UpdateReportResponse> Handle(UpdateReportRequest request, CancellationToken cancellationToken)
    {
        var e = await _context.Reports.SingleAsync(x => x.DocumentId == request.DocumentId, cancellationToken);
        e.Name = request.Name; e.Body = request.Body; e.DigitalAssetId = request.DigitalAssetId;
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateReportResponse { Report = ReportDto.FromReport(e) };
    }
}
