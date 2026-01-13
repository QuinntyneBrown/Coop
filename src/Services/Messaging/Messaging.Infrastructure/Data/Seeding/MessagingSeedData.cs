// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Messaging.Infrastructure.Data.Seeding;

public static class MessagingSeedData
{
    public static void Seed(MessagingDbContext context)
    {
        // No seed data required for messaging
        // Conversations and messages are created through user interactions
        context.SaveChanges();
    }
}
