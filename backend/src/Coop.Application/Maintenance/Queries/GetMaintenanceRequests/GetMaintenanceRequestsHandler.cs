using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequests;

public class GetMaintenanceRequestsHandler : IRequestHandler<GetMaintenanceRequestsRequest, GetMaintenanceRequestsResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public GetMaintenanceRequestsHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<GetMaintenanceRequestsResponse> Handle(GetMaintenanceRequestsRequest request, CancellationToken cancellationToken)
    {
        var visible = await MaintenanceRequestScope.VisibleProfileIdsAsync(_context, _authorization, _user, cancellationToken);
        var mrs = await _context.MaintenanceRequests.Include(m => m.Comments).Include(m => m.DigitalAssets)
            .Where(m => !m.IsDeleted && (visible == null || visible.Contains(m.RequestedByProfileId))).ToListAsync(cancellationToken);
        return new GetMaintenanceRequestsResponse { MaintenanceRequests = mrs.Select(MaintenanceRequestDto.FromMaintenanceRequest).ToList() };
    }
}
