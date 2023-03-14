using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetReportByIdRequest : IRequest<GetReportByIdResponse>
{
    public Guid ReportId { get; set; }
}
public class GetReportByIdResponse : ResponseBase
{
    public ReportDto Report { get; set; }
}
public class GetReportByIdHandler : IRequestHandler<GetReportByIdRequest, GetReportByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetReportByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetReportByIdResponse> Handle(GetReportByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Report = (await _context.Reports.SingleOrDefaultAsync(x => x.ReportId == request.ReportId)).ToDto()
        };
    }
}
