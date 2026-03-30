using MediatR;

namespace Coop.Application.Maintenance.Commands.RemoveMaintenanceRequestComment;

public class RemoveMaintenanceRequestCommentRequest : IRequest<RemoveMaintenanceRequestCommentResponse>
{
    public Guid MaintenanceRequestCommentId { get; set; }
}
