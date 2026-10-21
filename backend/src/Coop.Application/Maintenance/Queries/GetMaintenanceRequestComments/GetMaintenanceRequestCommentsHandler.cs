using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestComments;

public class GetMaintenanceRequestCommentsHandler : IRequestHandler<GetMaintenanceRequestCommentsRequest, GetMaintenanceRequestCommentsResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public GetMaintenanceRequestCommentsHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<GetMaintenanceRequestCommentsResponse> Handle(GetMaintenanceRequestCommentsRequest request, CancellationToken cancellationToken)
    {
        var visible = await MaintenanceRequestScope.VisibleProfileIdsAsync(_context, _authorization, _user, cancellationToken);
        var ownRequestIds = visible == null
            ? null
            : await _context.MaintenanceRequests.Where(m => visible.Contains(m.RequestedByProfileId)).Select(m => m.MaintenanceRequestId).ToListAsync(cancellationToken);
        var comments = await _context.MaintenanceRequestComments
            .Where(c => !c.IsDeleted && (ownRequestIds == null || ownRequestIds.Contains(c.MaintenanceRequestId))).ToListAsync(cancellationToken);
        return new GetMaintenanceRequestCommentsResponse { MaintenanceRequestComments = comments.Select(MaintenanceRequestCommentDto.FromComment).ToList() };
    }
}
