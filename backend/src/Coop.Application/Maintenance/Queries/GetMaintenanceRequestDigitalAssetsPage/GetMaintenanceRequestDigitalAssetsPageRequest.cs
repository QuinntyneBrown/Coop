using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssetsPage;

[OfficeOnly]
public class GetMaintenanceRequestDigitalAssetsPageRequest : IRequest<GetMaintenanceRequestDigitalAssetsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
