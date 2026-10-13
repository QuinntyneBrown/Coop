using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Commands.CreateMaintenanceRequestComment;

public class CreateMaintenanceRequestCommentResponse
{
    public MaintenanceRequestCommentDto MaintenanceRequestComment { get; set; } = default!;
}
