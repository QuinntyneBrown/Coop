using Coop.Application.Messaging.Dtos;

namespace Coop.Application.Messaging.Commands.SendMessage;

public class SendMessageResponse
{
    public MessageDto Message { get; set; } = default!;
}
