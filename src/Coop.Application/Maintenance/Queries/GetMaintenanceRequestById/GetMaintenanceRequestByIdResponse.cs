using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestById;

public class GetMaintenanceRequestByIdResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; } = default!;
}
