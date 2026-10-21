using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestComment;

[OfficeOnly]
public class UpdateMaintenanceRequestCommentRequest : IRequest<UpdateMaintenanceRequestCommentResponse>
{
    public Guid MaintenanceRequestCommentId { get; set; }
    public string Body { get; set; } = string.Empty;
}
