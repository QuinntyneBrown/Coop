using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestCommentById;

public class GetMaintenanceRequestCommentByIdResponse
{
    public MaintenanceRequestCommentDto MaintenanceRequestComment { get; set; } = default!;
}
