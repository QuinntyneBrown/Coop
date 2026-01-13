// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Maintenance.Domain.Entities;

public class MaintenanceRequestDigitalAsset
{
    public Guid MaintenanceRequestDigitalAssetId { get; private set; } = Guid.NewGuid();
    public Guid MaintenanceRequestId { get; private set; }
    public Guid DigitalAssetId { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private MaintenanceRequestDigitalAsset() { }

    public MaintenanceRequestDigitalAsset(Guid maintenanceRequestId, Guid digitalAssetId)
    {
        MaintenanceRequestId = maintenanceRequestId;
        DigitalAssetId = digitalAssetId;
    }
}
