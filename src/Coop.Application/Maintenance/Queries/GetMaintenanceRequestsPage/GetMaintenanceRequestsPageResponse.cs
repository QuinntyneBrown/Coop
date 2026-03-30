using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestsPage;

public class GetMaintenanceRequestsPageResponse
{
    public List<MaintenanceRequestDto> MaintenanceRequests { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
