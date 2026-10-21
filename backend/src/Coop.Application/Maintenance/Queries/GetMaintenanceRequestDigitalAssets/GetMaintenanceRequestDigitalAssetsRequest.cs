using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssets;

[OfficeOnly]
public class GetMaintenanceRequestDigitalAssetsRequest : IRequest<GetMaintenanceRequestDigitalAssetsResponse> { }
