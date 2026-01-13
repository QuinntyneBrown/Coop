// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Asset.Domain.Entities;
using Asset.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Asset.Infrastructure.Data;

public class AssetDbContext : DbContext, IAssetDbContext
{
    public DbSet<DigitalAsset> DigitalAssets => Set<DigitalAsset>();
    public DbSet<Theme> Themes => Set<Theme>();
    public DbSet<OnCall> OnCalls => Set<OnCall>();

    public AssetDbContext(DbContextOptions<AssetDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AssetDbContext).Assembly);
    }
}
