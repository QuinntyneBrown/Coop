using Coop.Core.Models;
using System;

namespace Coop.Api.Features
{
    public static class MaintenanceRequestExtensions
    {
        public static MaintenanceRequestDto ToDto(this MaintenanceRequest maintenanceRequest)
        {
            return new()
            {
                MaintenanceRequestId = maintenanceRequest.MaintenanceRequestId,
                RequestedByName = maintenanceRequest.RequestedByName,
                RequestedByProfileId = maintenanceRequest.RequestedByProfileId,
                UnattendedUnitEntryAllowed = maintenanceRequest.UnattendedUnitEntryAllowed,
                Address = maintenanceRequest.Address.ToDto(),
                Phone = maintenanceRequest.Phone,
                Description = maintenanceRequest.Description,
                Status = maintenanceRequest.Status,
                ReceivedByName = maintenanceRequest.ReceivedByName,
                WorkDetails = maintenanceRequest.WorkDetails,
                Date = TimeZoneInfo.ConvertTimeFromUtc(maintenanceRequest.Date, TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time"))
            };
        }
    }
}
