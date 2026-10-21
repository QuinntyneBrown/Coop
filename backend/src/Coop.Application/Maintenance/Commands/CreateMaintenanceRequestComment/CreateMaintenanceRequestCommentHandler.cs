using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using Coop.Domain.Maintenance;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.CreateMaintenanceRequestComment;

public class CreateMaintenanceRequestCommentHandler : IRequestHandler<CreateMaintenanceRequestCommentRequest, CreateMaintenanceRequestCommentResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public CreateMaintenanceRequestCommentHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<CreateMaintenanceRequestCommentResponse> Handle(CreateMaintenanceRequestCommentRequest request, CancellationToken cancellationToken)
    {
        // Only the household that asked and the office comment on a request (L2-REQ-114).
        var mr = await _context.MaintenanceRequests.SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);
        if (!await MaintenanceRequestAccess.CanReadAsync(_context, _authorization, _user, mr, cancellationToken))
            throw new UnauthorizedAccessException("Access denied.");

        var createdByProfileId = request.CreatedByProfileId == Guid.Empty
            ? await CallerAccess.CurrentProfileIdAsync(_context, _user, cancellationToken) ?? Guid.Empty
            : request.CreatedByProfileId;

        var comment = new MaintenanceRequestComment
        {
            MaintenanceRequestId = request.MaintenanceRequestId,
            CreatedByProfileId = createdByProfileId,
            Body = request.Body
        };

        _context.MaintenanceRequestComments.Add(comment);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateMaintenanceRequestCommentResponse { MaintenanceRequestComment = MaintenanceRequestCommentDto.FromComment(comment) };
    }
}
