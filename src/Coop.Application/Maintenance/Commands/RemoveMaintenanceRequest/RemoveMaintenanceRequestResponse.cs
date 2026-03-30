using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Commands.RemoveMaintenanceRequest;

public class RemoveMaintenanceRequestResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; } = default!;
}
