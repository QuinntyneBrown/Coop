using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using Coop.Domain.Maintenance;
using Coop.SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.CreateMaintenanceRequest;

public class CreateMaintenanceRequestHandler : IRequestHandler<CreateMaintenanceRequestRequest, CreateMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public CreateMaintenanceRequestHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<CreateMaintenanceRequestResponse> Handle(CreateMaintenanceRequestRequest request, CancellationToken cancellationToken)
    {
        // A member's request is always made from their own current profile; the
        // office may name another profile, and gets its own when it names none (L2-REQ-106).
        var requestedByProfileId = request.RequestedByProfileId;
        if (requestedByProfileId == Guid.Empty
            || !await CallerAccess.HoldsWriteAsync(_authorization, _user, Constants.Aggregates.MaintenanceRequest))
        {
            requestedByProfileId = await CallerAccess.CurrentProfileIdAsync(_context, _user, cancellationToken) ?? Guid.Empty;
        }

        var profile = await _context.Profiles
            .SingleOrDefaultAsync(p => p.ProfileId == requestedByProfileId, cancellationToken);

        var requestedByName = request.RequestedByName;
        if (string.IsNullOrWhiteSpace(requestedByName))
        {
            requestedByName = profile == null ? string.Empty : $"{profile.Firstname} {profile.Lastname}".Trim();
        }

        var maintenanceRequest = new MaintenanceRequest
        {
            RequestedByProfileId = requestedByProfileId,
            RequestedByName = requestedByName,
            Title = request.Title,
            Description = request.Description,
            Phone = string.IsNullOrWhiteSpace(request.Phone) ? profile?.PhoneNumber : request.Phone,
            UnitNumber = request.UnitNumber
        };

        _context.MaintenanceRequests.Add(maintenanceRequest);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateMaintenanceRequestResponse
        {
            MaintenanceRequest = MaintenanceRequestDto.FromMaintenanceRequest(maintenanceRequest)
        };
    }
}
