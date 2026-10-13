using Coop.Domain.Messaging;

namespace Coop.Application.Messaging.Dtos;

public class MessageDto
{
    public Guid MessageId { get; set; }
    public Guid ConversationId { get; set; }
    public Guid FromProfileId { get; set; }
    public Guid? ToProfileId { get; set; }
    public string Body { get; set; } = string.Empty;
    public bool Read { get; set; }
    public DateTime CreatedOn { get; set; }

    public static MessageDto FromMessage(Message m)
    {
        return new MessageDto
        {
            MessageId = m.MessageId,
            ConversationId = m.ConversationId,
            FromProfileId = m.FromProfileId,
            ToProfileId = m.ToProfileId,
            Body = m.Body,
            Read = m.Read,
            CreatedOn = m.CreatedOn
        };
    }
}
