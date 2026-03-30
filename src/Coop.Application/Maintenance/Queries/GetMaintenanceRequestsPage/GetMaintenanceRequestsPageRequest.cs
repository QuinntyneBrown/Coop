using MediatR;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestsPage;

public class GetMaintenanceRequestsPageRequest : IRequest<GetMaintenanceRequestsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
