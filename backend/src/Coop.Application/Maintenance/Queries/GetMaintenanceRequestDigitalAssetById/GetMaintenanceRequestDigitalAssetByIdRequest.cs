using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssetById;

[OfficeOnly]
public class GetMaintenanceRequestDigitalAssetByIdRequest : IRequest<GetMaintenanceRequestDigitalAssetByIdResponse>
{
    public Guid MaintenanceRequestDigitalAssetId { get; set; }
}
