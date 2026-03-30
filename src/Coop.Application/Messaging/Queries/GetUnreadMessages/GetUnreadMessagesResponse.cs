using Coop.Application.Messaging.Dtos;

namespace Coop.Application.Messaging.Queries.GetUnreadMessages;

public class GetUnreadMessagesResponse
{
    public List<MessageDto> Messages { get; set; } = new();
}
