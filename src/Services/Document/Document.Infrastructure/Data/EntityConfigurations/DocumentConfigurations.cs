// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Document.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Document.Infrastructure.Data.EntityConfigurations;

public class ByLawConfiguration : IEntityTypeConfiguration<ByLaw>
{
    public void Configure(EntityTypeBuilder<ByLaw> builder)
    {
        builder.HasKey(x => x.DocumentId);
        builder.HasIndex(x => x.DigitalAssetId);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(256);
    }
}

public class NoticeConfiguration : IEntityTypeConfiguration<Notice>
{
    public void Configure(EntityTypeBuilder<Notice> builder)
    {
        builder.HasKey(x => x.DocumentId);
        builder.HasIndex(x => x.DigitalAssetId);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(256);
    }
}

public class ReportConfiguration : IEntityTypeConfiguration<Report>
{
    public void Configure(EntityTypeBuilder<Report> builder)
    {
        builder.HasKey(x => x.DocumentId);
        builder.HasIndex(x => x.DigitalAssetId);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(256);
    }
}

public class JsonContentConfiguration : IEntityTypeConfiguration<JsonContent>
{
    public void Configure(EntityTypeBuilder<JsonContent> builder)
    {
        builder.HasKey(x => x.JsonContentId);
        builder.HasIndex(x => x.Name).IsUnique();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(x => x.Json)
            .HasConversion(
                v => v.ToString(),
                v => Newtonsoft.Json.Linq.JObject.Parse(v ?? "{}"));
    }
}
