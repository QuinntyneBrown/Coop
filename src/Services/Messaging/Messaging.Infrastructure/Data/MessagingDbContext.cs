// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Messaging.Domain.Entities;
using Messaging.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Messaging.Infrastructure.Data;

public class MessagingDbContext : DbContext, IMessagingDbContext
{
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Conversation> Conversations => Set<Conversation>();

    public MessagingDbContext(DbContextOptions<MessagingDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MessagingDbContext).Assembly);
    }
}
