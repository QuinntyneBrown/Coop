using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using Coop.Domain.Documents;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.CreateReport;

public class CreateReportHandler : IRequestHandler<CreateReportRequest, CreateReportResponse>
{
    private readonly ICoopDbContext _context;
    public CreateReportHandler(ICoopDbContext context) { _context = context; }

    public async Task<CreateReportResponse> Handle(CreateReportRequest request, CancellationToken cancellationToken)
    {
        var e = new Report { Name = request.Name, Body = request.Body, DigitalAssetId = request.DigitalAssetId };
        _context.Reports.Add(e);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateReportResponse { Report = ReportDto.FromReport(e) };
    }
}
