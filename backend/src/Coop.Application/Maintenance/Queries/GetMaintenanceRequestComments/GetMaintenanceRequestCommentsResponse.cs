using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestComments;

public class GetMaintenanceRequestCommentsResponse
{
    public List<MaintenanceRequestCommentDto> MaintenanceRequestComments { get; set; } = new();
}
