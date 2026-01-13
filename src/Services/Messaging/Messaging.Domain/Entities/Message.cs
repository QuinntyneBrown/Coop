// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Messaging.Domain.Entities;

public class Message
{
    public Guid MessageId { get; private set; } = Guid.NewGuid();
    public Guid ConversationId { get; private set; }
    public Guid FromProfileId { get; private set; }
    public Guid ToProfileId { get; private set; }
    public string Body { get; private set; } = string.Empty;
    public bool IsRead { get; private set; }
    public DateTime? ReadAt { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private Message() { }

    public Message(Guid conversationId, Guid fromProfileId, Guid toProfileId, string body)
    {
        ConversationId = conversationId;
        FromProfileId = fromProfileId;
        ToProfileId = toProfileId;
        Body = body;
    }

    public void MarkAsRead()
    {
        if (!IsRead)
        {
            IsRead = true;
            ReadAt = DateTime.UtcNow;
        }
    }
}
