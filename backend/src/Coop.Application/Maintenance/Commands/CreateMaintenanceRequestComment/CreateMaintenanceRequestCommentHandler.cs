using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using Coop.Domain.Maintenance;
using MediatR;

namespace Coop.Application.Maintenance.Commands.CreateMaintenanceRequestComment;

public class CreateMaintenanceRequestCommentHandler : IRequestHandler<CreateMaintenanceRequestCommentRequest, CreateMaintenanceRequestCommentResponse>
{
    private readonly ICoopDbContext _context;

    public CreateMaintenanceRequestCommentHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<CreateMaintenanceRequestCommentResponse> Handle(CreateMaintenanceRequestCommentRequest request, CancellationToken cancellationToken)
    {
        var comment = new MaintenanceRequestComment
        {
            MaintenanceRequestId = request.MaintenanceRequestId,
            CreatedByProfileId = request.CreatedByProfileId,
            Body = request.Body
        };
        _context.MaintenanceRequestComments.Add(comment);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateMaintenanceRequestCommentResponse { MaintenanceRequestComment = MaintenanceRequestCommentDto.FromComment(comment) };
    }
}
