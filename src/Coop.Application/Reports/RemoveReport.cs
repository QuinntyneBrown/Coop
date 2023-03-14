using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class RemoveReportRequest : IRequest<RemoveReportResponse>
{
    public Guid ReportId { get; set; }
}
public class RemoveReportResponse : ResponseBase
{
    public ReportDto Report { get; set; }
}
public class RemoveReportHandler : IRequestHandler<RemoveReportRequest, RemoveReportResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveReportHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveReportResponse> Handle(RemoveReportRequest request, CancellationToken cancellationToken)
    {
        var report = await _context.Reports.SingleAsync(x => x.ReportId == request.ReportId);
        _context.Reports.Remove(report);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveReportResponse()
        {
            Report = report.ToDto()
        };
    }
}
