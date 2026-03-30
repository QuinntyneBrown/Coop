using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using Coop.SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetCurrentUserMaintenanceRequests;

public class GetCurrentUserMaintenanceRequestsHandler : IRequestHandler<GetCurrentUserMaintenanceRequestsRequest, GetCurrentUserMaintenanceRequestsResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCurrentUserMaintenanceRequestsHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<GetCurrentUserMaintenanceRequestsResponse> Handle(GetCurrentUserMaintenanceRequestsRequest request, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_httpContextAccessor.HttpContext!.User.FindFirst(Constants.ClaimTypes.UserId)!.Value);
        var user = await _context.Users.Include(u => u.Profiles).SingleAsync(u => u.UserId == userId, cancellationToken);
        var currentProfileId = user.CurrentProfileId ?? user.Profiles.FirstOrDefault()?.ProfileId ?? Guid.Empty;

        var mrs = await _context.MaintenanceRequests
            .Include(m => m.Comments).Include(m => m.DigitalAssets)
            .Where(m => m.RequestedByProfileId == currentProfileId && !m.IsDeleted)
            .ToListAsync(cancellationToken);

        return new GetCurrentUserMaintenanceRequestsResponse
        {
            MaintenanceRequests = mrs.Select(MaintenanceRequestDto.FromMaintenanceRequest).ToList()
        };
    }
}
