using MediatR;

namespace Coop.Application.Messaging.Commands.MarkConversationRead;

public class MarkConversationReadRequest : IRequest<MarkConversationReadResponse>
{
    public Guid ConversationId { get; set; }
    public Guid ProfileId { get; set; }
}
