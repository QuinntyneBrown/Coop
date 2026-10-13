using MediatR;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssetsPage;

public class GetMaintenanceRequestDigitalAssetsPageRequest : IRequest<GetMaintenanceRequestDigitalAssetsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
