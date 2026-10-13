using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using Coop.SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.CompleteMaintenanceRequest;

public class CompleteMaintenanceRequestHandler : IRequestHandler<CompleteMaintenanceRequestRequest, CompleteMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CompleteMaintenanceRequestHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<CompleteMaintenanceRequestResponse> Handle(CompleteMaintenanceRequestRequest request, CancellationToken cancellationToken)
    {
        var mr = await _context.MaintenanceRequests
            .Include(m => m.Comments).Include(m => m.DigitalAssets)
            .SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);

        // Re-posting Complete returns the request as it is (ADR 0004).
        if (!mr.IsCompleted)
        {
            var userId = Guid.Parse(_httpContextAccessor.HttpContext!.User.FindFirst(Constants.ClaimTypes.UserId)!.Value);
            var user = await _context.Users.Include(u => u.Profiles).SingleAsync(u => u.UserId == userId, cancellationToken);
            var currentProfileId = user.CurrentProfileId ?? user.Profiles.FirstOrDefault()?.ProfileId ?? Guid.Empty;

            _context.StoredEvents.Add(mr.Complete(currentProfileId));
            await _context.SaveChangesAsync(cancellationToken);
        }

        return new CompleteMaintenanceRequestResponse { MaintenanceRequest = MaintenanceRequestDto.FromMaintenanceRequest(mr) };
    }
}
