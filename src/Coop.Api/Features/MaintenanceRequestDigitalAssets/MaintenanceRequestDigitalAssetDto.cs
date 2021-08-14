using System;

namespace Coop.Api.Features
{
    public class MaintenanceRequestDigitalAssetDto
    {
        public Guid MaintenanceRequestDigitalAssetId { get; set; }
        public Guid MaintenanceRequestId { get; set; }
        public Guid DigitalAssetId { get; set; }
    }
}
