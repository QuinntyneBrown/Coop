using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using Coop.SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequests;

public class GetMaintenanceRequestsHandler : IRequestHandler<GetMaintenanceRequestsRequest, GetMaintenanceRequestsResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetMaintenanceRequestsHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor = null!)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<GetMaintenanceRequestsResponse> Handle(GetMaintenanceRequestsRequest request, CancellationToken cancellationToken)
    {
        var mrs = await _context.MaintenanceRequests.Include(m => m.Comments).Include(m => m.DigitalAssets)
            .Where(m => !m.IsDeleted).ToListAsync(cancellationToken);
        return new GetMaintenanceRequestsResponse { MaintenanceRequests = mrs.Select(MaintenanceRequestDto.FromMaintenanceRequest).ToList() };
    }
}
