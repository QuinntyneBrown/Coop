using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Commands.RemoveMaintenanceRequestComment;

[OfficeOnly]
public class RemoveMaintenanceRequestCommentRequest : IRequest<RemoveMaintenanceRequestCommentResponse>
{
    public Guid MaintenanceRequestCommentId { get; set; }
}
