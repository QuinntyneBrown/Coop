using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestComment;

public class UpdateMaintenanceRequestCommentResponse
{
    public MaintenanceRequestCommentDto MaintenanceRequestComment { get; set; } = default!;
}
