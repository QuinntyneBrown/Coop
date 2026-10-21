using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestCommentById;

public class GetMaintenanceRequestCommentByIdHandler : IRequestHandler<GetMaintenanceRequestCommentByIdRequest, GetMaintenanceRequestCommentByIdResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public GetMaintenanceRequestCommentByIdHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<GetMaintenanceRequestCommentByIdResponse> Handle(GetMaintenanceRequestCommentByIdRequest request, CancellationToken cancellationToken)
    {
        var c = await _context.MaintenanceRequestComments.SingleAsync(x => x.MaintenanceRequestCommentId == request.MaintenanceRequestCommentId, cancellationToken);
        var mr = await _context.MaintenanceRequests.SingleAsync(m => m.MaintenanceRequestId == c.MaintenanceRequestId, cancellationToken);
        if (!await MaintenanceRequestAccess.CanReadAsync(_context, _authorization, _user, mr, cancellationToken))
            throw new UnauthorizedAccessException("Access denied.");

        return new GetMaintenanceRequestCommentByIdResponse { MaintenanceRequestComment = MaintenanceRequestCommentDto.FromComment(c) };
    }
}
