using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestDigitalAsset;

[OfficeOnly]
public class UpdateMaintenanceRequestDigitalAssetRequest : IRequest<UpdateMaintenanceRequestDigitalAssetResponse>
{
    public Guid MaintenanceRequestDigitalAssetId { get; set; }
    public Guid DigitalAssetId { get; set; }
}
