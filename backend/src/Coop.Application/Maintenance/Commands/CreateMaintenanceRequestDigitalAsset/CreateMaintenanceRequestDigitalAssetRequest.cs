using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Commands.CreateMaintenanceRequestDigitalAsset;

[OfficeOnly]
public class CreateMaintenanceRequestDigitalAssetRequest : IRequest<CreateMaintenanceRequestDigitalAssetResponse>
{
    public Guid MaintenanceRequestId { get; set; }
    public Guid DigitalAssetId { get; set; }
}
