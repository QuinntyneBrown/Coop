// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.Common.Extensions;
using Coop.Domain.Entities;
using System;

namespace Coop.Application.Features;

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

