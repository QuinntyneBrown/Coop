using Coop.Application.Messaging.Dtos;

namespace Coop.Application.Messaging.Commands.CreateConversation;

public class CreateConversationResponse
{
    public ConversationDto Conversation { get; set; } = default!;
}
