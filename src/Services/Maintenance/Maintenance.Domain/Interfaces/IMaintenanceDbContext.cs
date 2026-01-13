// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Maintenance.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Maintenance.Domain.Interfaces;

public interface IMaintenanceDbContext
{
    DbSet<MaintenanceRequest> MaintenanceRequests { get; }
    DbSet<MaintenanceRequestComment> MaintenanceRequestComments { get; }
    DbSet<MaintenanceRequestDigitalAsset> MaintenanceRequestDigitalAssets { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
