using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestsPage;

public class GetMaintenanceRequestsPageHandler : IRequestHandler<GetMaintenanceRequestsPageRequest, GetMaintenanceRequestsPageResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public GetMaintenanceRequestsPageHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<GetMaintenanceRequestsPageResponse> Handle(GetMaintenanceRequestsPageRequest request, CancellationToken cancellationToken)
    {
        var visible = await MaintenanceRequestScope.VisibleProfileIdsAsync(_context, _authorization, _user, cancellationToken);
        var query = _context.MaintenanceRequests.Include(m => m.Comments).Include(m => m.DigitalAssets)
            .Where(m => !m.IsDeleted && (visible == null || visible.Contains(m.RequestedByProfileId)));
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
