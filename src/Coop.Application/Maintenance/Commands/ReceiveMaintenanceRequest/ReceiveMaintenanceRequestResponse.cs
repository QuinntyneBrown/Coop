using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Commands.ReceiveMaintenanceRequest;

public class ReceiveMaintenanceRequestResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; } = default!;
}
