using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using Coop.Domain.Messaging;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Commands.MarkConversationRead;

public class MarkConversationReadHandler : IRequestHandler<MarkConversationReadRequest, MarkConversationReadResponse>
{
    private readonly ICoopDbContext _context;
    public MarkConversationReadHandler(ICoopDbContext context) { _context = context; }

    public async Task<MarkConversationReadResponse> Handle(MarkConversationReadRequest request, CancellationToken cancellationToken)
    {
        var messages = await _context.Messages.Where(m => m.ConversationId == request.ConversationId && m.ToProfileId == request.ProfileId && !m.Read).ToListAsync(cancellationToken);
        foreach (var m in messages) m.MarkAsRead();
        await _context.SaveChangesAsync(cancellationToken);
        return new MarkConversationReadResponse { Success = true };
    }
}
