using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using Coop.Domain.Messaging;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Commands.DeleteConversation;

public class DeleteConversationHandler : IRequestHandler<DeleteConversationRequest, DeleteConversationResponse>
{
    private readonly ICoopDbContext _context;
    public DeleteConversationHandler(ICoopDbContext context) { _context = context; }

    public async Task<DeleteConversationResponse> Handle(DeleteConversationRequest request, CancellationToken cancellationToken)
    {
        var conversation = await _context.Conversations.Include(c => c.Messages).SingleAsync(c => c.ConversationId == request.ConversationId, cancellationToken);
        conversation.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new DeleteConversationResponse { Success = true };
    }
}
