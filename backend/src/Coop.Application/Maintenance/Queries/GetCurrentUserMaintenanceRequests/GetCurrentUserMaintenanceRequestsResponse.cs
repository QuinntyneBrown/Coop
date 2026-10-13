using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Queries.GetCurrentUserMaintenanceRequests;

public class GetCurrentUserMaintenanceRequestsResponse
{
    public List<MaintenanceRequestDto> MaintenanceRequests { get; set; } = new();
}
