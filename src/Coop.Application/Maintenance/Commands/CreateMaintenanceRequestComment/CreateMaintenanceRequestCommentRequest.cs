using MediatR;

namespace Coop.Application.Maintenance.Commands.CreateMaintenanceRequestComment;

public class CreateMaintenanceRequestCommentRequest : IRequest<CreateMaintenanceRequestCommentResponse>
{
    public Guid MaintenanceRequestId { get; set; }
    public Guid CreatedByProfileId { get; set; }
    public string Body { get; set; } = string.Empty;
}
