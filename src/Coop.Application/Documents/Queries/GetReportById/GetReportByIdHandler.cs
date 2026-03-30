using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetReportById;

public class GetReportByIdHandler : IRequestHandler<GetReportByIdRequest, GetReportByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetReportByIdHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetReportByIdResponse> Handle(GetReportByIdRequest request, CancellationToken cancellationToken)
    {
        var e = await _context.Reports.SingleAsync(x => x.DocumentId == request.DocumentId, cancellationToken);
        return new GetReportByIdResponse { Report = ReportDto.FromReport(e) };
    }
}
