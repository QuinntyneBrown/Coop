using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestComment;

public class UpdateMaintenanceRequestCommentHandler : IRequestHandler<UpdateMaintenanceRequestCommentRequest, UpdateMaintenanceRequestCommentResponse>
{
    private readonly ICoopDbContext _context;

    public UpdateMaintenanceRequestCommentHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateMaintenanceRequestCommentResponse> Handle(UpdateMaintenanceRequestCommentRequest request, CancellationToken cancellationToken)
    {
        var comment = await _context.MaintenanceRequestComments.SingleAsync(c => c.MaintenanceRequestCommentId == request.MaintenanceRequestCommentId, cancellationToken);
        comment.Body = request.Body;
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateMaintenanceRequestCommentResponse { MaintenanceRequestComment = MaintenanceRequestCommentDto.FromComment(comment) };
    }
}
