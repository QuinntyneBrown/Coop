using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequests;

public class GetMaintenanceRequestsResponse
{
    public List<MaintenanceRequestDto> MaintenanceRequests { get; set; } = new();
}
