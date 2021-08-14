using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class MaintenanceRequestExtensions
    {
        public static MaintenanceRequestDto ToDto(this MaintenanceRequest maintenanceRequest)
        {
            return new()
            {
                MaintenanceRequestId = maintenanceRequest.MaintenanceRequestId,
                Title = maintenanceRequest.Title,
                Description = maintenanceRequest.Description,
                Status = maintenanceRequest.Status
            };
        }
    }
}
