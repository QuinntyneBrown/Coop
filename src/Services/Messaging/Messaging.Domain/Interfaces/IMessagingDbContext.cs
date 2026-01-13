// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Messaging.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messaging.Domain.Interfaces;

public interface IMessagingDbContext
{
    DbSet<Message> Messages { get; }
    DbSet<Conversation> Conversations { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
