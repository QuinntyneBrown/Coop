using System;

namespace Coop.Domain.Entities;

public class Message
{
    public Guid MessageId { get; private set; }
    public Guid? ConversationId { get; private set; }
    public Guid ToProfileId { get; private set; }
    public Guid FromProfileId { get; private set; }
    public string Body { get; private set; }
    public bool Read { get; private set; }
    public DateTime Created { get; private set; } = DateTime.UtcNow;
    public Message(Guid? conversationId, Guid toProfileId, Guid fromProfileId, string body)
    {
        ConversationId = conversationId;
        ToProfileId = toProfileId;
        FromProfileId = fromProfileId;
        Body = body;
    }
    private Message()
    {
    }
}
