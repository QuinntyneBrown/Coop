using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetUnreadMessageCount;

public class GetUnreadMessageCountHandler : IRequestHandler<GetUnreadMessageCountRequest, GetUnreadMessageCountResponse>
{
    private readonly ICoopDbContext _context;
    public GetUnreadMessageCountHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetUnreadMessageCountResponse> Handle(GetUnreadMessageCountRequest request, CancellationToken cancellationToken)
    {
        var count = await _context.Messages.CountAsync(m => m.ToProfileId == request.ProfileId && !m.Read && !m.IsDeleted, cancellationToken);
        return new GetUnreadMessageCountResponse { Count = count };
    }
}
