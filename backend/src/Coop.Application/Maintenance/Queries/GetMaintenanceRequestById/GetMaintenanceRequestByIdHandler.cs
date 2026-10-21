using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestById;

public class GetMaintenanceRequestByIdHandler : IRequestHandler<GetMaintenanceRequestByIdRequest, GetMaintenanceRequestByIdResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public GetMaintenanceRequestByIdHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<GetMaintenanceRequestByIdResponse> Handle(GetMaintenanceRequestByIdRequest request, CancellationToken cancellationToken)
    {
        var mr = await _context.MaintenanceRequests.Include(m => m.Comments).Include(m => m.DigitalAssets)
            .SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);

        // Only the household that asked and the office see a request (L2-REQ-114).
        if (!await MaintenanceRequestAccess.CanReadAsync(_context, _authorization, _user, mr, cancellationToken))
            throw new UnauthorizedAccessException("Access denied.");

        return new GetMaintenanceRequestByIdResponse { MaintenanceRequest = MaintenanceRequestDto.FromMaintenanceRequest(mr) };
    }
}
