using Coop.Domain.Entities;

namespace Coop.Application.Features;

public static class MessageExtensions
{
    public static MessageDto ToDto(this Message message)
    {
        return new()
        {
            MessageId = message.MessageId,
            ConversationId = message.ConversationId,
            ToProfileId = message.ToProfileId,
            FromProfileId = message.FromProfileId,
            Body = message.Body,
            Read = message.Read,
            Created = message.Created
        };
    }
}
