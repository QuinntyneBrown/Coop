using System;

namespace Coop.Application.Features
{
    public class MaintenanceRequestDigitalAssetDto
    {
        public Guid MaintenanceRequestDigitalAssetId { get; set; }
        public Guid MaintenanceRequestId { get; set; }
        public Guid DigitalAssetId { get; set; }
    }
}
