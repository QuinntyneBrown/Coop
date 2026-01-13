// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Profile.Domain.Entities;

namespace Profile.Infrastructure.Data.EntityConfigurations;

public class InvitationTokenConfiguration : IEntityTypeConfiguration<InvitationToken>
{
    public void Configure(EntityTypeBuilder<InvitationToken> builder)
    {
        builder.HasKey(x => x.InvitationTokenId);
        builder.HasIndex(x => x.Value).IsUnique();
        builder.HasIndex(x => x.Type);

        builder.Property(x => x.Value)
            .IsRequired()
            .HasMaxLength(512);
    }
}
