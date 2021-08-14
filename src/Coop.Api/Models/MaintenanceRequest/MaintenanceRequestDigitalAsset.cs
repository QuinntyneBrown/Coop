using Microsoft.EntityFrameworkCore;
using System;

namespace Coop.Api.Models
{
    [Owned]
    public class MaintenanceRequestDigitalAsset
    {
        public Guid MaintenanceRequestDigitalAssetId { get; set; }
        public Guid MaintenanceRequestId { get; private set; }
        public Guid DigitalAssetId { get; private set; }

        public MaintenanceRequestDigitalAsset(Guid maintenanceRequestId, Guid digitalAssetId)
        {
            MaintenanceRequestId = maintenanceRequestId;
            DigitalAssetId = digitalAssetId;
        }

        public MaintenanceRequestDigitalAsset(Guid digitalAssetId)
        {
            DigitalAssetId = digitalAssetId;
        }

        private MaintenanceRequestDigitalAsset()
        {

        }
    }
}
