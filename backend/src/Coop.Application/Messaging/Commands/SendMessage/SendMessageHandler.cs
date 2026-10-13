using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using Coop.Domain.Messaging;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Commands.SendMessage;

public class SendMessageHandler : IRequestHandler<SendMessageRequest, SendMessageResponse>
{
    private readonly ICoopDbContext _context;
    public SendMessageHandler(ICoopDbContext context) { _context = context; }

    public async Task<SendMessageResponse> Handle(SendMessageRequest request, CancellationToken cancellationToken)
    {
        var message = new Message
        {
            ConversationId = request.ConversationId,
            FromProfileId = request.FromProfileId,
            ToProfileId = request.ToProfileId,
            Body = request.Body
        };
        _context.Messages.Add(message);
        await _context.SaveChangesAsync(cancellationToken);
        return new SendMessageResponse { Message = MessageDto.FromMessage(message) };
    }
}
