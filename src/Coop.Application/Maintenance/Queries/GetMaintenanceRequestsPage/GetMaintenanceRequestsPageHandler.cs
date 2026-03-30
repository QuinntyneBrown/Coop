using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestsPage;

public class GetMaintenanceRequestsPageHandler : IRequestHandler<GetMaintenanceRequestsPageRequest, GetMaintenanceRequestsPageResponse>
{
    private readonly ICoopDbContext _context;

    public GetMaintenanceRequestsPageHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetMaintenanceRequestsPageResponse> Handle(GetMaintenanceRequestsPageRequest request, CancellationToken cancellationToken)
    {
        var query = _context.MaintenanceRequests.Include(m => m.Comments).Include(m => m.DigitalAssets).Where(m => !m.IsDeleted);
        var totalCount = await query.CountAsync(cancellationToken);
        var mrs = await query.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
        return new GetMaintenanceRequestsPageResponse
        {
            MaintenanceRequests = mrs.Select(MaintenanceRequestDto.FromMaintenanceRequest).ToList(),
            TotalCount = totalCount,
            PageSize = request.PageSize,
            PageIndex = request.Index
        };
    }
}
