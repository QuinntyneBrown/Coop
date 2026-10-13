using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetUnreadMessages;

public class GetUnreadMessagesHandler : IRequestHandler<GetUnreadMessagesRequest, GetUnreadMessagesResponse>
{
    private readonly ICoopDbContext _context;
    public GetUnreadMessagesHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetUnreadMessagesResponse> Handle(GetUnreadMessagesRequest request, CancellationToken cancellationToken)
    {
        var msgs = await _context.Messages.Where(m => m.ToProfileId == request.ProfileId && !m.Read && !m.IsDeleted).ToListAsync(cancellationToken);
        return new GetUnreadMessagesResponse { Messages = msgs.Select(MessageDto.FromMessage).ToList() };
    }
}
