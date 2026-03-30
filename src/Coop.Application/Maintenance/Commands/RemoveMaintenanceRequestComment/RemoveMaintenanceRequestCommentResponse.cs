using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Commands.RemoveMaintenanceRequestComment;

public class RemoveMaintenanceRequestCommentResponse
{
    public MaintenanceRequestCommentDto MaintenanceRequestComment { get; set; } = default!;
}
