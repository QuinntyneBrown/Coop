// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Messaging.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Messaging.Infrastructure.Data.EntityConfigurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.HasKey(x => x.MessageId);
        builder.HasIndex(x => x.ConversationId);
        builder.HasIndex(x => x.FromProfileId);
        builder.HasIndex(x => x.ToProfileId);

        builder.Property(x => x.Body)
            .IsRequired()
            .HasMaxLength(4000);
    }
}

public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
    public void Configure(EntityTypeBuilder<Conversation> builder)
    {
        builder.HasKey(x => x.ConversationId);

        builder.Property(x => x.ParticipantProfileIds)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(Guid.Parse).ToList());

        builder.HasMany(x => x.Messages)
            .WithOne()
            .HasForeignKey(x => x.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
