// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Entities;
using Innofactor.EfCoreJsonValueConverter;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Data;

public class JsonContentConfiguration : IEntityTypeConfiguration<JsonContent>
{
    public void Configure(EntityTypeBuilder<JsonContent> builder)
    {
        builder.Property(e => e.Json).HasJsonValueConversion();
    }
}

