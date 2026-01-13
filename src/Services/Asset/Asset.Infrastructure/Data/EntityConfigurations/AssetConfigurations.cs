// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Asset.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Asset.Infrastructure.Data.EntityConfigurations;

public class DigitalAssetConfiguration : IEntityTypeConfiguration<DigitalAsset>
{
    public void Configure(EntityTypeBuilder<DigitalAsset> builder)
    {
        builder.HasKey(x => x.DigitalAssetId);
        builder.HasIndex(x => x.Name);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(x => x.ContentType)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(x => x.Bytes)
            .IsRequired();
    }
}

public class ThemeConfiguration : IEntityTypeConfiguration<Theme>
{
    public void Configure(EntityTypeBuilder<Theme> builder)
    {
        builder.HasKey(x => x.ThemeId);
        builder.HasIndex(x => x.ProfileId);

        builder.Property(x => x.CssCustomProperties)
            .HasConversion(
                v => v.ToString(),
                v => Newtonsoft.Json.Linq.JObject.Parse(v ?? "{}"));
    }
}

public class OnCallConfiguration : IEntityTypeConfiguration<OnCall>
{
    public void Configure(EntityTypeBuilder<OnCall> builder)
    {
        builder.HasKey(x => x.OnCallId);
        builder.HasIndex(x => x.ProfileId);
        builder.HasIndex(x => x.EffectiveDate);
    }
}
