using Coop.Core.Models;

namespace Coop.Api.Features
{
    public static class MaintenanceRequestExtensions
    {
        public static MaintenanceRequestDto ToDto(this MaintenanceRequest maintenanceRequest)
        {
            return new()
            {
                MaintenanceRequestId = maintenanceRequest.MaintenanceRequestId,
                Description = maintenanceRequest.Description,
                Status = maintenanceRequest.Status
            };
        }
    }
}
