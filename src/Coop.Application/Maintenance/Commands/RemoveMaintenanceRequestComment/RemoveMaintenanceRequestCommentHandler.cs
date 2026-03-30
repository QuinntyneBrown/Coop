using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.RemoveMaintenanceRequestComment;

public class RemoveMaintenanceRequestCommentHandler : IRequestHandler<RemoveMaintenanceRequestCommentRequest, RemoveMaintenanceRequestCommentResponse>
{
    private readonly ICoopDbContext _context;

    public RemoveMaintenanceRequestCommentHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<RemoveMaintenanceRequestCommentResponse> Handle(RemoveMaintenanceRequestCommentRequest request, CancellationToken cancellationToken)
    {
        var comment = await _context.MaintenanceRequestComments.SingleAsync(c => c.MaintenanceRequestCommentId == request.MaintenanceRequestCommentId, cancellationToken);
        comment.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveMaintenanceRequestCommentResponse { MaintenanceRequestComment = MaintenanceRequestCommentDto.FromComment(comment) };
    }
}
