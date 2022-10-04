using System;
using Coop.Domain.Entities;

namespace Coop.Application.Features
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
