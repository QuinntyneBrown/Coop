// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Maintenance.Domain.Entities;
using Maintenance.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Maintenance.Infrastructure.Data;

public class MaintenanceDbContext : DbContext, IMaintenanceDbContext
{
    public DbSet<MaintenanceRequest> MaintenanceRequests => Set<MaintenanceRequest>();
    public DbSet<MaintenanceRequestComment> MaintenanceRequestComments => Set<MaintenanceRequestComment>();
    public DbSet<MaintenanceRequestDigitalAsset> MaintenanceRequestDigitalAssets => Set<MaintenanceRequestDigitalAsset>();

    public MaintenanceDbContext(DbContextOptions<MaintenanceDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MaintenanceDbContext).Assembly);
    }
}
