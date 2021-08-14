using Coop.Api.Models;
using System;
using System.Collections.Generic;

namespace Coop.Api.Features
{
    public class MaintenanceRequestDto
    {
        public Guid? MaintenanceRequestId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public MaintenanceRequestStatus Status { get; set; } = MaintenanceRequestStatus.New;
        public Guid? CreatedById { get; set; }
        public List<MaintenanceRequestDigitalAssetDto> DigitalAssets { get; set; } = new();
        public List<MaintenanceRequestCommentDto> Comments { get; set; } = new();
    }
}
