using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using Coop.Domain.Messaging;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Commands.MarkMessageAsRead;

public class MarkMessageAsReadHandler : IRequestHandler<MarkMessageAsReadRequest, MarkMessageAsReadResponse>
{
    private readonly ICoopDbContext _context;
    public MarkMessageAsReadHandler(ICoopDbContext context) { _context = context; }

    public async Task<MarkMessageAsReadResponse> Handle(MarkMessageAsReadRequest request, CancellationToken cancellationToken)
    {
        var message = await _context.Messages.SingleAsync(m => m.MessageId == request.MessageId, cancellationToken);
        message.MarkAsRead();
        await _context.SaveChangesAsync(cancellationToken);
        return new MarkMessageAsReadResponse { Success = true };
    }
}
