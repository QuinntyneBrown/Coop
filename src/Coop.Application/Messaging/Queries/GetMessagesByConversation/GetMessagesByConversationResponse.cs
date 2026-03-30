using Coop.Application.Messaging.Dtos;

namespace Coop.Application.Messaging.Queries.GetMessagesByConversation;

public class GetMessagesByConversationResponse
{
    public List<MessageDto> Messages { get; set; } = new();
}
