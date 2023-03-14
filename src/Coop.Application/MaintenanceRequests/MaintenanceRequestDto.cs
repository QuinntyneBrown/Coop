// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Dtos;
using Coop.Domain.Entities;
using System;
using System.Collections.Generic;

namespace Coop.Application.Features;

public class MaintenanceRequestDto
{
    public Guid? MaintenanceRequestId { get; set; }
    public DateTime Date { get; set; }
    public Guid RequestedByProfileId { get; set; }
    public string RequestedByName { get; set; }
    public AddressDto Address { get; set; }
    public string Phone { get; set; }
    public string Description { get; set; }
    public string WorkDetails { get; set; }
    public bool UnattendedUnitEntryAllowed { get; set; }
    public string ReceivedByName { get; set; }
    public MaintenanceRequestStatus Status { get; set; } = MaintenanceRequestStatus.New;
    public List<MaintenanceRequestDigitalAssetDto> DigitalAssets { get; set; } = new();
    public List<MaintenanceRequestCommentDto> Comments { get; set; } = new();
}

