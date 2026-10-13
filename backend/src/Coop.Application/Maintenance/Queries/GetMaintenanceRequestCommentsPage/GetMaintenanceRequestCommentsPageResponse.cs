using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestCommentsPage;

public class GetMaintenanceRequestCommentsPageResponse
{
    public List<MaintenanceRequestCommentDto> MaintenanceRequestComments { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
