using System;
using Coop.Core.Models;

namespace Coop.Api.Features
{
    public static class MaintenanceRequestDigitalAssetExtensions
    {
        public static MaintenanceRequestDigitalAssetDto ToDto(this MaintenanceRequestDigitalAsset maintenanceRequestDigitalAsset)
        {
            return new()
            {
                MaintenanceRequestDigitalAssetId = maintenanceRequestDigitalAsset.MaintenanceRequestDigitalAssetId
            };
        }

    }
}
