using Coop.Application.Messaging.Dtos;

namespace Coop.Application.Messaging.Queries.GetConversationById;

public class GetConversationByIdResponse
{
    public ConversationDto Conversation { get; set; } = default!;
}
