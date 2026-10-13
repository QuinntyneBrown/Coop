using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using Coop.Domain.Messaging;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Commands.DeleteMessage;

public class DeleteMessageHandler : IRequestHandler<DeleteMessageRequest, DeleteMessageResponse>
{
    private readonly ICoopDbContext _context;
    public DeleteMessageHandler(ICoopDbContext context) { _context = context; }

    public async Task<DeleteMessageResponse> Handle(DeleteMessageRequest request, CancellationToken cancellationToken)
    {
        var message = await _context.Messages.SingleAsync(m => m.MessageId == request.MessageId, cancellationToken);
        message.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new DeleteMessageResponse { Success = true };
    }
}
