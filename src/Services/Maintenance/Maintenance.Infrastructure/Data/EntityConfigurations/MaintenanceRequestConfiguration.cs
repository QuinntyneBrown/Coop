// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Maintenance.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Maintenance.Infrastructure.Data.EntityConfigurations;

public class MaintenanceRequestConfiguration : IEntityTypeConfiguration<MaintenanceRequest>
{
    public void Configure(EntityTypeBuilder<MaintenanceRequest> builder)
    {
        builder.HasKey(x => x.MaintenanceRequestId);
        builder.HasIndex(x => x.RequestedByProfileId);
        builder.HasIndex(x => x.Status);

        builder.Property(x => x.Description)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(x => x.UnitEntered)
            .HasMaxLength(64);

        builder.Property(x => x.WorkDetails)
            .HasMaxLength(4000);

        builder.OwnsOne(x => x.Address, a =>
        {
            a.Property(p => p.Street).HasMaxLength(256);
            a.Property(p => p.Unit).HasMaxLength(64);
            a.Property(p => p.City).HasMaxLength(128);
            a.Property(p => p.Province).HasMaxLength(64);
            a.Property(p => p.PostalCode).HasMaxLength(16);
        });

        builder.HasMany(x => x.Comments)
            .WithOne()
            .HasForeignKey(x => x.MaintenanceRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.DigitalAssets)
            .WithOne()
            .HasForeignKey(x => x.MaintenanceRequestId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class MaintenanceRequestCommentConfiguration : IEntityTypeConfiguration<MaintenanceRequestComment>
{
    public void Configure(EntityTypeBuilder<MaintenanceRequestComment> builder)
    {
        builder.HasKey(x => x.MaintenanceRequestCommentId);
        builder.HasIndex(x => x.MaintenanceRequestId);

        builder.Property(x => x.Body)
            .IsRequired()
            .HasMaxLength(2000);
    }
}

public class MaintenanceRequestDigitalAssetConfiguration : IEntityTypeConfiguration<MaintenanceRequestDigitalAsset>
{
    public void Configure(EntityTypeBuilder<MaintenanceRequestDigitalAsset> builder)
    {
        builder.HasKey(x => x.MaintenanceRequestDigitalAssetId);
        builder.HasIndex(x => x.MaintenanceRequestId);
        builder.HasIndex(x => x.DigitalAssetId);
    }
}
