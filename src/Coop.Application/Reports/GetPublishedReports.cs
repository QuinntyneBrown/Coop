using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class GetPublishedReportsRequest : IRequest<GetPublishedReportsResponse> { }
public class GetPublishedReportsResponse
{
    public List<ReportDto> Reports { get; set; }
}
public class GetPublishedReportsHandler : IRequestHandler<GetPublishedReportsRequest, GetPublishedReportsResponse>
{
    private readonly ICoopDbContext _context;
    public GetPublishedReportsHandler(ICoopDbContext context)
    {
        _context = context;
    }
    public async Task<GetPublishedReportsResponse> Handle(GetPublishedReportsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Reports = await _context
            .Reports.Where(x => x.Published.HasValue)
            .Select(x => x.ToDto())
            .ToListAsync()
        };
    }
}
