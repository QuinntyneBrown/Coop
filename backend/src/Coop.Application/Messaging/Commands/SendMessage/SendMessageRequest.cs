using MediatR;

namespace Coop.Application.Messaging.Commands.SendMessage;

public class SendMessageRequest : IRequest<SendMessageResponse>
{
    public Guid ConversationId { get; set; }
    public Guid FromProfileId { get; set; }
    public Guid? ToProfileId { get; set; }
    public string Body { get; set; } = string.Empty;
}
