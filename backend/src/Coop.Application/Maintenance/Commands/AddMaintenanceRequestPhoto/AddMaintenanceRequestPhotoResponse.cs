using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Commands.AddMaintenanceRequestPhoto;

public class AddMaintenanceRequestPhotoResponse
{
    public MaintenanceRequestPhotoDto Photo { get; set; } = default!;
}
