using Coop.Core.Dtos;
using Coop.Core.Models;
using System;
using System.Collections.Generic;

namespace Coop.Api.Features
{
    public class MaintenanceRequestDto
    {
        public Guid? MaintenanceRequestId { get; set; }
        public DateTime Date { get; set; }
        public Guid RequestedByProfileId { get; set; }
        public string RequestedByName { get; set; }
        public AddressDto Address { get; set; }
        public string Phone { get; set; }
        public string Description { get; set; }
        public bool UnattendedUnitEntryAllowed { get; set; }
        public MaintenanceRequestStatus Status { get; set; } = MaintenanceRequestStatus.New;
        public List<MaintenanceRequestDigitalAssetDto> DigitalAssets { get; set; } = new();
        public List<MaintenanceRequestCommentDto> Comments { get; set; } = new();
    }
}
