using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using Coop.SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.ReceiveMaintenanceRequest;

public class ReceiveMaintenanceRequestHandler : IRequestHandler<ReceiveMaintenanceRequestRequest, ReceiveMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ReceiveMaintenanceRequestHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ReceiveMaintenanceRequestResponse> Handle(ReceiveMaintenanceRequestRequest request, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_httpContextAccessor.HttpContext!.User.FindFirst(Constants.ClaimTypes.UserId)!.Value);
        var user = await _context.Users.Include(u => u.Profiles).SingleAsync(u => u.UserId == userId, cancellationToken);
        var currentProfileId = user.CurrentProfileId ?? user.Profiles.FirstOrDefault()?.ProfileId ?? Guid.Empty;

        var maintenanceRequest = await _context.MaintenanceRequests
            .Include(m => m.Comments)
            .Include(m => m.DigitalAssets)
            .SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);

        maintenanceRequest.Receive(currentProfileId);
        await _context.SaveChangesAsync(cancellationToken);

        return new ReceiveMaintenanceRequestResponse
        {
            MaintenanceRequest = MaintenanceRequestDto.FromMaintenanceRequest(maintenanceRequest)
        };
    }
}
