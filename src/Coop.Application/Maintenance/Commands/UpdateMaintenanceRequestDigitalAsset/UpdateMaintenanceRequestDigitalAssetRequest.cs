using MediatR;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestDigitalAsset;

public class UpdateMaintenanceRequestDigitalAssetRequest : IRequest<UpdateMaintenanceRequestDigitalAssetResponse>
{
    public Guid MaintenanceRequestDigitalAssetId { get; set; }
    public Guid DigitalAssetId { get; set; }
}
