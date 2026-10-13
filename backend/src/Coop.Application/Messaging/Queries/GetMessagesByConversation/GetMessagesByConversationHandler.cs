using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetMessagesByConversation;

public class GetMessagesByConversationHandler : IRequestHandler<GetMessagesByConversationRequest, GetMessagesByConversationResponse>
{
    private readonly ICoopDbContext _context;
    public GetMessagesByConversationHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetMessagesByConversationResponse> Handle(GetMessagesByConversationRequest request, CancellationToken cancellationToken)
    {
        var msgs = await _context.Messages.Where(m => m.ConversationId == request.ConversationId && !m.IsDeleted).OrderBy(m => m.CreatedOn).ToListAsync(cancellationToken);
        return new GetMessagesByConversationResponse { Messages = msgs.Select(MessageDto.FromMessage).ToList() };
    }
}
