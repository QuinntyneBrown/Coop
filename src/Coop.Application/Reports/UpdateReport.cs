using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Report).NotNull();
        RuleFor(request => request.Report).SetValidator(new ReportValidator());
    }
}
public class UpdateReportRequest : IRequest<UpdateReportResponse>
{
    public ReportDto Report { get; set; }
}
public class UpdateReportResponse : ResponseBase
{
    public ReportDto Report { get; set; }
}
public class UpdateReportHandler : IRequestHandler<UpdateReportRequest, UpdateReportResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateReportHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateReportResponse> Handle(UpdateReportRequest request, CancellationToken cancellationToken)
    {
        var report = await _context.Reports.SingleAsync(x => x.ReportId == request.Report.ReportId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateReportResponse()
        {
            Report = report.ToDto()
        };
    }
}
